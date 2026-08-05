#!/usr/bin/env node
/**
 * validate-refs.js — 校验 catalog/ 数据资产的结构完整性。
 *
 * 检查项:
 *   1. role 的 mainSkills / atomicSkills 引用的 skill id 是否真实存在于 catalog/
 *   2. 正文中的相对链接 (../<domain>/<id>.md) 是否指向存在的文件
 *   3. frontmatter 必填字段缺失统计 (type / level / nameZh)
 *   4. 重复 id / 疑似重复文件 (同 id 多文件、-1 后缀)
 *   5. type / level / catalogSource 分布统计
 *
 * 用法:
 *   node tools/import/validate-refs.js           # 人类可读报告
 *   node tools/import/validate-refs.js --json    # JSON 输出(供其他工具消费)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CATALOG = path.join(ROOT, 'catalog');
const JSON_MODE = process.argv.includes('--json');

function parseFM(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  const fm = {};
  if (!m) return { fm, body: src };
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { fm, body: src.slice(m[0].length) };
}

// ── 收集全部 skills ─────────────────────────────────────────────────
const entries = []; // { domain, file, id, type, level, source, nameZh, fm, body }
const idIndex = new Map(); // id → [entry, ...]

for (const domain of fs.readdirSync(CATALOG)) {
  const dir = path.join(CATALOG, domain);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md') || f.startsWith('_')) continue;
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    const { fm, body } = parseFM(src);
    const e = {
      domain, file: f,
      id: fm.id || f.replace(/\.md$/, ''),
      type: fm.type || 'external',
      level: fm.level || '',
      source: fm.catalogSource || '',
      nameZh: fm.nameZh || '',
      fm, body,
    };
    entries.push(e);
    if (!idIndex.has(e.id)) idIndex.set(e.id, []);
    idIndex.get(e.id).push(e);
  }
}

// ── 1. role 引用校验 ───────────────────────────────────────────────
const brokenSkillRefs = []; // { role, field, ref }
const roles = entries.filter(e => e.type === 'role');
for (const r of roles) {
  for (const field of ['mainSkills', 'atomicSkills']) {
    const raw = r.fm[field];
    if (!raw) continue;
    const refs = raw.replace(/^\[|\]$/g, '').split(',').map(s => s.trim()).filter(Boolean);
    for (const ref of refs) {
      if (!idIndex.has(ref)) brokenSkillRefs.push({ role: r.id, field, ref });
    }
  }
}

// ── 2. 正文相对链接校验 ─────────────────────────────────────────────
const brokenLinks = []; // { domain, file, link }
const LINK_RE = /\]\((\.\.?\/[^)#\s]+\.md)\)/g;
for (const e of entries) {
  let m;
  while ((m = LINK_RE.exec(e.body)) !== null) {
    const target = path.resolve(CATALOG, e.domain, m[1]);
    if (!fs.existsSync(target)) brokenLinks.push({ domain: e.domain, file: e.file, link: m[1] });
  }
}

// ── 3. frontmatter 缺失统计 ─────────────────────────────────────────
const missingType = entries.filter(e => !e.fm.type);
const missingLevel = entries.filter(e => ['role', 'atomic-skill'].includes(e.type) && !e.level);
const missingNameZh = entries.filter(e => !e.nameZh);

// ── 4. 重复检测 ─────────────────────────────────────────────────────
const dupIds = [...idIndex.entries()].filter(([, v]) => v.length > 1)
  .map(([id, v]) => ({ id, files: v.map(e => `${e.domain}/${e.file}`) }));
const suffixDups = entries.filter(e => /-1\.md$/.test(e.file))
  .map(e => `${e.domain}/${e.file}`);

// ── 5. 分布统计 ─────────────────────────────────────────────────────
const countBy = (arr, key) => arr.reduce((acc, e) => {
  const k = e[key] || '(空)';
  acc[k] = (acc[k] || 0) + 1;
  return acc;
}, {});
const typeDist = countBy(entries, 'type');
const levelDist = countBy(entries.filter(e => e.type !== 'external'), 'level');
const sourceDist = countBy(entries, 'source');

const report = {
  generated: new Date().toISOString().slice(0, 10),
  total: entries.length,
  typeDist, levelDist, sourceDist,
  roles: roles.length,
  brokenSkillRefs, brokenLinks,
  missing: {
    type: missingType.length,
    level: missingLevel.map(e => `${e.domain}/${e.file}`),
    nameZh: missingNameZh.map(e => `${e.domain}/${e.file}`),
  },
  dupIds, suffixDups,
};

if (JSON_MODE) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(brokenSkillRefs.length || brokenLinks.length ? 1 : 0);
}

// ── 人类可读输出 ────────────────────────────────────────────────────
console.log(`\n== catalog 结构校验 (${report.generated}) · 共 ${entries.length} 条 ==\n`);
console.log('type 分布:', typeDist);
console.log('level 分布(非 external):', levelDist);
console.log('来源分布:', sourceDist);

console.log(`\n-- role → skill 引用 (${roles.length} 个 role) --`);
if (brokenSkillRefs.length === 0) console.log('  ✅ 全部可解析');
else {
  console.log(`  ❌ ${brokenSkillRefs.length} 个引用无法在 catalog 中解析:`);
  for (const b of brokenSkillRefs) console.log(`     ${b.role}.${b.field} → ${b.ref}`);
}

console.log(`\n-- 正文相对链接 --`);
if (brokenLinks.length === 0) console.log('  ✅ 全部有效');
else {
  console.log(`  ❌ ${brokenLinks.length} 个死链:`);
  for (const b of brokenLinks.slice(0, 40)) console.log(`     ${b.domain}/${b.file} → ${b.link}`);
  if (brokenLinks.length > 40) console.log(`     …… 其余 ${brokenLinks.length - 40} 条见 --json 输出`);
}

console.log(`\n-- frontmatter 缺失 --`);
console.log(`  type 缺失: ${missingType.length}`);
console.log(`  level 缺失(role/atomic): ${report.missing.level.length}`);
console.log(`  nameZh 缺失: ${report.missing.nameZh.length}`);

console.log(`\n-- 重复 --`);
console.log(`  重复 id: ${dupIds.length} 组`);
for (const d of dupIds) console.log(`     ${d.id}: ${d.files.join(' | ')}`);
console.log(`  "-1" 后缀疑似重复文件: ${suffixDups.length}`);
for (const f of suffixDups) console.log(`     ${f}`);

console.log('');
process.exit(brokenSkillRefs.length || brokenLinks.length ? 1 : 0);

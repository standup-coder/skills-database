#!/usr/bin/env node
/**
 * validate-roles.js
 *
 * 校验 roles/ 目录下所有 Role JSON 是否符合 schema/role-v1.json，
 * 并输出"知识库成熟度"报表（必填字段、双语字段、技能引用完整性）。
 *
 * Usage:
 *   node scripts/validate-roles.js            # 标准输出（人类可读）
 *   node scripts/validate-roles.js --json     # JSON 输出（CI 友好）
 *   node scripts/validate-roles.js --strict   # 任何 warning 即非零退出
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const rolesDir = join(projectRoot, 'roles');
const atomicDir = join(projectRoot, 'atomic-skills');
const skillsDir = join(projectRoot, 'skills');

const args = new Set(process.argv.slice(2));
const asJson = args.has('--json');
const strict = args.has('--strict');

const REQUIRED_TOP = ['id', 'type', 'version', 'metadata', 'jd', 'capabilities'];
const REQUIRED_METADATA = ['name', 'description', 'author', 'tags', 'level'];
const REQUIRED_JD = ['summary', 'responsibilities', 'requirements'];
const ZH_FIELDS = [
  ['metadata', 'nameZh'],
  ['metadata', 'descriptionZh'],
  ['jd', 'summaryZh'],
  ['jd', 'responsibilitiesZh']
];

function loadIds(dir) {
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        try {
          return JSON.parse(readFileSync(join(dir, f), 'utf-8')).id;
        } catch {
          return null;
        }
      })
      .filter(Boolean)
  );
}

const knownAtomic = loadIds(atomicDir);
const knownComposite = loadIds(skillsDir);

function validateRole(filePath) {
  const errors = [];
  const warnings = [];
  let role;
  try {
    role = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (e) {
    return { file: filePath, errors: [`JSON parse error: ${e.message}`], warnings: [], score: 0 };
  }

  for (const k of REQUIRED_TOP) {
    if (role[k] === undefined) errors.push(`Missing required: ${k}`);
  }
  if (role.type && role.type !== 'role') errors.push(`type must be "role", got "${role.type}"`);
  if (role.id && !/^[a-z0-9-]+$/.test(role.id)) errors.push(`id must be kebab-case: ${role.id}`);
  if (role.version && !/^\d+\.\d+\.\d+$/.test(role.version)) errors.push(`version must be semver: ${role.version}`);

  if (role.metadata) {
    for (const k of REQUIRED_METADATA) {
      if (role.metadata[k] === undefined) errors.push(`Missing metadata.${k}`);
    }
    if (role.metadata.level && !['junior', 'mid', 'senior', 'lead'].includes(role.metadata.level)) {
      errors.push(`metadata.level invalid: ${role.metadata.level}`);
    }
  }

  if (role.jd) {
    for (const k of REQUIRED_JD) {
      if (role.jd[k] === undefined) errors.push(`Missing jd.${k}`);
    }
    if (Array.isArray(role.jd.responsibilities) && role.jd.responsibilities.length === 0) {
      errors.push('jd.responsibilities is empty');
    }
  }

  if (role.capabilities) {
    if (!Array.isArray(role.capabilities.mainSkills)) errors.push('capabilities.mainSkills must be array');
    if (!Array.isArray(role.capabilities.atomicSkills)) errors.push('capabilities.atomicSkills must be array');

    // 严格类型一致性：mainSkills 只能引用 composite，atomicSkills 只能引用 atomic
    for (const s of role.capabilities.mainSkills || []) {
      if (knownAtomic.has(s)) {
        errors.push(`mainSkills references atomic skill (must be composite): ${s}`);
      } else if (!knownComposite.has(s)) {
        warnings.push(`mainSkills reference not found: ${s}`);
      }
    }
    for (const s of role.capabilities.atomicSkills || []) {
      if (knownComposite.has(s)) {
        errors.push(`atomicSkills references composite skill (must be atomic): ${s}`);
      } else if (!knownAtomic.has(s)) {
        warnings.push(`atomicSkills reference not found: ${s}`);
      }
    }
  }

  // 双语字段成熟度
  let zhPresent = 0;
  for (const [parent, key] of ZH_FIELDS) {
    if (role[parent] && role[parent][key] !== undefined) zhPresent++;
  }
  const zhRatio = zhPresent / ZH_FIELDS.length;
  if (zhRatio < 0.5) warnings.push(`Bilingual coverage low: ${(zhRatio * 100).toFixed(0)}%`);

  // 评分：必填 60% + 引用完整 20% + 双语 20%
  const requiredOk = errors.length === 0 ? 1 : 0;
  const refOk = warnings.filter(w => w.includes('reference not found')).length === 0 ? 1 : 0;
  const score = Math.round((requiredOk * 0.6 + refOk * 0.2 + zhRatio * 0.2) * 100);

  return { file: filePath, id: role.id, errors, warnings, score, zhRatio };
}

const files = existsSync(rolesDir)
  ? readdirSync(rolesDir).filter(f => f.endsWith('.json')).map(f => join(rolesDir, f))
  : [];

const results = files.map(validateRole);
const totalErrors = results.reduce((s, r) => s + r.errors.length, 0);
const totalWarnings = results.reduce((s, r) => s + r.warnings.length, 0);
const avgScore = results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0;

if (asJson) {
  console.log(JSON.stringify({ summary: { count: results.length, errors: totalErrors, warnings: totalWarnings, avgScore }, results }, null, 2));
} else {
  console.log(`\n📋 Role Validation Report (${results.length} files)\n`);
  for (const r of results) {
    const status = r.errors.length ? '❌' : (r.warnings.length ? '⚠️ ' : '✅');
    console.log(`${status} ${r.id || r.file}  score=${r.score}  zh=${(r.zhRatio * 100).toFixed(0)}%`);
    for (const e of r.errors) console.log(`   ERROR: ${e}`);
    for (const w of r.warnings) console.log(`   WARN : ${w}`);
  }
  console.log(`\n— Summary —`);
  console.log(`  files       : ${results.length}`);
  console.log(`  errors      : ${totalErrors}`);
  console.log(`  warnings    : ${totalWarnings}`);
  console.log(`  avg score   : ${avgScore}/100\n`);
}

if (totalErrors > 0) process.exit(1);
if (strict && totalWarnings > 0) process.exit(2);

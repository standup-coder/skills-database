#!/usr/bin/env node
/**
 * build.js — 从 catalog/ 生成一个静态 tools/web/index.html。
 *
 * 无依赖、无构建步骤。打开 index.html 即可浏览所有 skills,
 * 内置搜索/筛选。点 skill 卡片直接打开对应的 .md 文件。
 *
 * 用法:node tools/web/build.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CATALOG = path.join(ROOT, 'catalog');

function parseFM(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const k = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim();
    if (v.startsWith('[') && v.endsWith(']')) {
      try { v = JSON.parse(v.replace(/'/g, '"')); } catch { /* keep as string */ }
    }
    fm[k] = v;
  }
  return fm;
}

function excerpt(src, max = 200) {
  // 去掉 frontmatter,取第一段非空文本
  const body = src.replace(/^---[\s\S]*?---\n?/, '');
  const lines = body.split('\n')
    .filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('>') && !l.startsWith('|'))
    .slice(0, 3)
    .join(' ')
    .replace(/[`*_#>\[\]]/g, '')
    .trim();
  return lines.length > max ? lines.slice(0, max) + '…' : lines;
}

// 收集所有 skills
const skills = [];
const domains = {};
for (const d of fs.readdirSync(CATALOG)) {
  const dir = path.join(CATALOG, d);
  if (!fs.statSync(dir).isDirectory()) continue;
  domains[d] = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md') || f.startsWith('_')) continue;
    const full = path.join(dir, f);
    const src = fs.readFileSync(full, 'utf8');
    const fm = parseFM(src);
    skills.push({
      id: fm.id || f.replace(/\.md$/, ''),
      title: fm.title || '',
      nameZh: fm.nameZh || '',
      domain: d,
      domainLabel: fm.domainLabel || d,
      tags: Array.isArray(fm.tags) ? fm.tags : (fm.tags ? String(fm.tags).split(',').map(s=>s.trim()) : []),
      type: fm.type || 'external',
      source: fm.catalogSource || '',
      file: f,
      path: `../../catalog/${d}/${f}`,
      excerpt: excerpt(src),
    });
    domains[d]++;
  }
}

// 按 domain 计数排序
const domainOrder = Object.entries(domains).sort((a, b) => b[1] - a[1]);

// HTML 模板
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Skills Database · 职业技能 SkillHub</title>
<style>
  :root {
    --bg: #fafaf7;
    --fg: #1a1a1a;
    --muted: #6b6b6b;
    --accent: #4a6fa5;
    --card: #fff;
    --border: #e5e5e0;
    --tag-bg: #f0f0eb;
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#1a1a1a; --fg:#e8e8e8; --muted:#999; --accent:#7ba0d0;
            --card:#242424; --border:#333; --tag-bg:#2a2a2a; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; font: 15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
         background: var(--bg); color: var(--fg); }
  header { padding: 2.5rem 2rem 1.5rem; max-width: 1200px; margin: 0 auto; }
  h1 { margin: 0 0 .5rem; font-size: 1.8rem; }
  .subtitle { color: var(--muted); margin: 0 0 1.5rem; }
  .stats { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; font-size: .9rem; color: var(--muted); }
  .stats b { color: var(--fg); }
  .search { width: 100%; padding: .7rem 1rem; font-size: 1rem;
            border: 1px solid var(--border); border-radius: 6px;
            background: var(--card); color: var(--fg); }
  .filters { display: flex; flex-wrap: wrap; gap: .4rem; margin: 1rem 0; }
  .chip { padding: .35rem .85rem; border: 1px solid var(--border); border-radius: 999px;
          background: var(--card); color: var(--fg); font-size: .85rem; cursor: pointer;
          user-select: none; }
  .chip.active { background: var(--accent); color: #fff; border-color: var(--accent); }
  main { max-width: 1200px; margin: 0 auto; padding: 0 2rem 4rem; }
  .domain-section { margin: 2rem 0; }
  .domain-section h2 { font-size: 1.2rem; border-bottom: 1px solid var(--border); padding-bottom: .4rem;
                       display: flex; align-items: center; gap: .5rem; }
  .domain-section h2 .count { font-size: .8rem; color: var(--muted); font-weight: normal; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
  .card { display: block; padding: 1rem; background: var(--card); border: 1px solid var(--border);
          border-radius: 8px; text-decoration: none; color: var(--fg);
          transition: border-color .15s, transform .15s; }
  .card:hover { border-color: var(--accent); transform: translateY(-1px); }
  .card h3 { margin: 0 0 .3rem; font-size: 1rem; }
  .card .zh { color: var(--muted); font-size: .85rem; margin-bottom: .4rem; }
  .card .desc { font-size: .8rem; color: var(--muted); display: -webkit-box;
                -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .tags { display: flex; flex-wrap: wrap; gap: .3rem; margin-top: .6rem; }
  .tag { background: var(--tag-bg); color: var(--muted); font-size: .7rem;
         padding: .15rem .5rem; border-radius: 4px; }
  .type-badge { font-size: .65rem; padding: .1rem .4rem; border-radius: 4px;
                background: var(--accent); color: #fff; float: right; }
  .empty { color: var(--muted); text-align: center; padding: 3rem; }
  footer { text-align: center; padding: 2rem; color: var(--muted); font-size: .85rem;
           border-top: 1px solid var(--border); }
</style>
</head>
<body>
<header>
  <h1>Skills Database</h1>
  <p class="subtitle">职业技能学习与挑选 · 本地 SkillHub · ${skills.length} 条 skills</p>
  <div class="stats">
    <span><b>${domainOrder.length}</b> 个领域</span>
    <span><b>${skills.filter(s => s.type === 'role').length}</b> 个职业角色</span>
    <span><b>${skills.filter(s => s.type === 'composite-skill').length}</b> 个复合技能</span>
    <span><b>${skills.filter(s => s.type === 'atomic-skill').length}</b> 个原子技能</span>
    <span><b>${skills.filter(s => s.type === 'external' || !['role','composite-skill','atomic-skill'].includes(s.type)).length}</b> 条外部</span>
  </div>
  <input class="search" id="search" placeholder="搜索 skills… (按名称、标签、描述)" autofocus />
  <div class="filters" id="filters"></div>
</header>
<main id="main"></main>
<footer>
  <a href="../../catalog/_index.md">查看 Markdown 源索引</a> ·
  <a href="../../README.md">回到项目首页</a>
</footer>
<script>
const SKILLS = ${JSON.stringify(skills)};
const DOMAINS = ${JSON.stringify(domainOrder.map(([d, n]) => ({id: d, count: n})))};

let activeDomain = null;
let searchTerm = '';

const $main = document.getElementById('main');
const $filters = document.getElementById('filters');
const $search = document.getElementById('search');

// 渲染 chips
$filters.innerHTML = '<span class="chip active" data-d="">全部</span>' +
  DOMAINS.map(d => \`<span class="chip" data-d="\${d.id}">\${d.id} (\${d.count})</span>\`).join('');
$filters.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  $filters.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  activeDomain = chip.dataset.d || null;
  render();
});

$search.addEventListener('input', e => {
  searchTerm = e.target.value.toLowerCase();
  render();
});

function render() {
  const filtered = SKILLS.filter(s => {
    if (activeDomain && s.domain !== activeDomain) return false;
    if (!searchTerm) return true;
    const hay = (s.title + ' ' + s.nameZh + ' ' + s.tags.join(' ') + ' ' + s.excerpt).toLowerCase();
    return hay.includes(searchTerm);
  });

  if (!filtered.length) {
    $main.innerHTML = '<div class="empty">没有匹配的 skills</div>';
    return;
  }

  // 按 domain 分组
  const grouped = {};
  for (const s of filtered) (grouped[s.domain] = grouped[s.domain] || []).push(s);

  $main.innerHTML = Object.entries(grouped).map(([dom, items]) => {
    return \`<section class="domain-section">
      <h2>\${dom} <span class="count">(\${items.length})</span></h2>
      <div class="grid">\${items.map(cardHTML).join('')}</div>
    </section>\`;
  }).join('');
}

function cardHTML(s) {
  const typeBadge = ['role','composite-skill','atomic-skill'].includes(s.type)
    ? \`<span class="type-badge">\${s.type === 'role' ? '角色' : s.type === 'composite-skill' ? '复合' : '原子'}</span>\`
    : '';
  return \`<a class="card" href="\${s.path}">
    \${typeBadge}
    <h3>\${escapeHtml(s.nameZh || s.title || s.id)}</h3>
    <div class="zh">\${escapeHtml(s.title || s.id)}</div>
    <div class="desc">\${escapeHtml(s.excerpt)}</div>
    \${s.tags.length ? \`<div class="tags">\${s.tags.slice(0,5).map(t => \`<span class="tag">\${escapeHtml(t)}</span>\`).join('')}</div>\` : ''}
  </a>\`;
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

render();
</script>
</body>
</html>`;

const out = path.join(__dirname, 'index.html');
fs.writeFileSync(out, html);
console.log(`✅ generated ${out}`);
console.log(`   ${skills.length} skills, ${domainOrder.length} domains`);
console.log(`   file://${out}`);
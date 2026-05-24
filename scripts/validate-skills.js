#!/usr/bin/env node
/**
 * validate-skills.js
 *
 * 校验 atomic-skills/ 与 skills/ 下所有 JSON，并输出知识库成熟度报表：
 *   - 必填字段覆盖率
 *   - 双语字段覆盖率
 *   - constraints / errors 完整率（仅 atomic）
 *   - 工作流引用完整性（仅 composite）
 *
 * Usage:
 *   node scripts/validate-skills.js            # 标准输出
 *   node scripts/validate-skills.js --json     # JSON 输出
 *   node scripts/validate-skills.js --strict   # 任意 warning 即非零退出
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const atomicDir = join(projectRoot, 'atomic-skills');
const skillsDir = join(projectRoot, 'skills');

const args = new Set(process.argv.slice(2));
const asJson = args.has('--json');
const strict = args.has('--strict');
const gapsOnly = args.has('--gaps');

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

const ATOMIC_REQUIRED = ['id', 'type', 'version', 'metadata', 'input', 'output', 'implementation'];
const COMPOSITE_REQUIRED = ['id', 'type', 'version', 'metadata', 'input', 'output', 'workflow'];
const META_REQUIRED = ['name', 'description', 'author', 'tags', 'category'];

function validateAtomic(filePath) {
  const errors = [];
  const warnings = [];
  let s;
  try {
    s = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (e) {
    return { file: filePath, kind: 'atomic', errors: [`JSON parse: ${e.message}`], warnings: [], score: 0 };
  }

  for (const k of ATOMIC_REQUIRED) {
    if (s[k] === undefined) errors.push(`Missing ${k}`);
  }
  if (s.type && s.type !== 'atomic-skill') errors.push(`type must be "atomic-skill"`);
  if (s.id && !/^[a-z0-9-]+$/.test(s.id)) errors.push(`id must be kebab-case: ${s.id}`);

  if (s.metadata) {
    for (const k of META_REQUIRED) {
      if (s.metadata[k] === undefined) errors.push(`Missing metadata.${k}`);
    }
  }

  if (s.implementation && !['mcp-tool', 'native', 'api'].includes(s.implementation.type)) {
    errors.push(`implementation.type invalid: ${s.implementation.type}`);
  }

  // 成熟度：双语 / constraints / errors / placeholder 检测 / learning 字段
  const meta = s.metadata || {};
  const isPlaceholderName = !meta.nameZh || meta.nameZh === s.id;
  const isPlaceholderDesc = !meta.description || /^Skill:\s/i.test(meta.description);
  const hasZhName = !!meta.nameZh && meta.nameZh !== s.id;
  const hasZhDesc = !!meta.descriptionZh && meta.descriptionZh !== s.id
                    && !/^Skill:\s/i.test(meta.descriptionZh);
  const hasRichTags = Array.isArray(meta.tags) && meta.tags.length >= 2;
  const hasInputProps = !!(s.input && s.input.schema && s.input.schema.properties
                           && Object.keys(s.input.schema.properties).length > 0);
  const hasOutputProps = !!(s.output && s.output.schema && s.output.schema.properties
                           && Object.keys(s.output.schema.properties).length > 0);
  const hasConstraints = !!(s.constraints && Object.keys(s.constraints).length > 0);
  const hasErrors = !!(s.errors && Object.keys(s.errors).length > 0);
  const hasLearning = !!(s.learning
                         && ((s.learning.keyPoints || []).length > 0
                             || (s.learning.bestPractices || []).length > 0));

  if (isPlaceholderName) warnings.push('Placeholder metadata.nameZh (equals id)');
  if (isPlaceholderDesc) warnings.push('Placeholder metadata.description ("Skill: ...")');
  if (!hasZhName) warnings.push('Missing metadata.nameZh');
  if (!hasZhDesc) warnings.push('Missing metadata.descriptionZh');
  if (!hasRichTags) warnings.push('Sparse tags (need >=2)');
  if (!hasInputProps) warnings.push('Empty input.schema.properties');
  if (!hasOutputProps) warnings.push('Empty output.schema.properties');
  if (!hasConstraints) warnings.push('Missing constraints');
  if (!hasErrors) warnings.push('Missing errors');
  if (!hasLearning) warnings.push('Missing learning content');

  const requiredOk = errors.length === 0 ? 1 : 0;
  // 丰富度分 7 项考量
  const richnessParts = [hasZhName, hasZhDesc, hasRichTags, hasInputProps, hasOutputProps, hasConstraints, hasErrors];
  const richness = richnessParts.reduce((a, b) => a + Number(b), 0) / richnessParts.length;
  const learningBonus = hasLearning ? 0.1 : 0;
  const score = Math.round(Math.min(1, requiredOk * 0.5 + richness * 0.4 + learningBonus) * 100);

  return { file: filePath, kind: 'atomic', id: s.id, errors, warnings, score, richness, hasLearning };
}

function validateComposite(filePath) {
  const errors = [];
  const warnings = [];
  let s;
  try {
    s = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (e) {
    return { file: filePath, kind: 'composite', errors: [`JSON parse: ${e.message}`], warnings: [], score: 0 };
  }

  for (const k of COMPOSITE_REQUIRED) {
    if (s[k] === undefined) errors.push(`Missing ${k}`);
  }
  if (s.type && s.type !== 'composite-skill') errors.push(`type must be "composite-skill"`);
  if (s.id && !/^[a-z0-9-]+$/.test(s.id)) errors.push(`id must be kebab-case: ${s.id}`);

  if (s.metadata) {
    for (const k of META_REQUIRED) {
      if (s.metadata[k] === undefined) errors.push(`Missing metadata.${k}`);
    }
  }

  // 工作流引用检查
  if (s.workflow && Array.isArray(s.workflow.steps)) {
    if (s.workflow.steps.length === 0) errors.push('workflow.steps is empty');
    for (const step of s.workflow.steps) {
      const ref = step.atomicSkill || step.skill;
      if (ref && !knownAtomic.has(ref) && !ref.startsWith('llm:')) {
        warnings.push(`step "${step.id}" references unknown skill: ${ref}`);
      }
    }
  }

  const hasZhName = !!(s.metadata && s.metadata.nameZh);
  const hasZhDesc = !!(s.metadata && s.metadata.descriptionZh);
  const hasErrorHandling = !!s.errorHandling;

  if (!hasZhName) warnings.push('Missing metadata.nameZh');
  if (!hasZhDesc) warnings.push('Missing metadata.descriptionZh');

  const requiredOk = errors.length === 0 ? 1 : 0;
  const richness = (Number(hasZhName) + Number(hasZhDesc) + Number(hasErrorHandling)) / 3;
  const score = Math.round((requiredOk * 0.6 + richness * 0.4) * 100);

  return { file: filePath, kind: 'composite', id: s.id, errors, warnings, score };
}

function listJson(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(f => f.endsWith('.json')).map(f => join(dir, f));
}

const atomicResults = listJson(atomicDir).map(validateAtomic);
const compositeResults = listJson(skillsDir).map(validateComposite);
const all = [...atomicResults, ...compositeResults];

const totalErrors = all.reduce((s, r) => s + r.errors.length, 0);
const totalWarnings = all.reduce((s, r) => s + r.warnings.length, 0);
const avgScore = all.length ? Math.round(all.reduce((s, r) => s + r.score, 0) / all.length) : 0;
const atomicAvg = atomicResults.length
  ? Math.round(atomicResults.reduce((s, r) => s + r.score, 0) / atomicResults.length) : 0;
const compositeAvg = compositeResults.length
  ? Math.round(compositeResults.reduce((s, r) => s + r.score, 0) / compositeResults.length) : 0;

if (asJson) {
  console.log(JSON.stringify({
    summary: {
      atomic: atomicResults.length,
      composite: compositeResults.length,
      errors: totalErrors,
      warnings: totalWarnings,
      avgScore,
      atomicAvg,
      compositeAvg
    },
    results: all
  }, null, 2));
} else if (gapsOnly) {
  // 待补 backlog：按缺失字段分组输出，供 enrich 脚本消费
  const buckets = {
    'missing.nameZh': [],
    'missing.descriptionZh': [],
    'missing.constraints': [],
    'missing.errors': [],
    'unknown.skillRef': []
  };
  for (const r of all) {
    for (const w of r.warnings) {
      if (/Placeholder metadata\.nameZh/.test(w)) buckets['placeholder.nameZh'] = (buckets['placeholder.nameZh'] || []).concat(r.id);
      else if (/Placeholder metadata\.description/.test(w)) buckets['placeholder.description'] = (buckets['placeholder.description'] || []).concat(r.id);
      else if (w.includes('Missing metadata.nameZh')) buckets['missing.nameZh'].push(r.id);
      else if (w.includes('Missing metadata.descriptionZh')) buckets['missing.descriptionZh'].push(r.id);
      else if (w.includes('Sparse tags')) buckets['sparse.tags'] = (buckets['sparse.tags'] || []).concat(r.id);
      else if (w.includes('Empty input.schema')) buckets['empty.inputSchema'] = (buckets['empty.inputSchema'] || []).concat(r.id);
      else if (w.includes('Empty output.schema')) buckets['empty.outputSchema'] = (buckets['empty.outputSchema'] || []).concat(r.id);
      else if (w.includes('Missing constraints')) buckets['missing.constraints'].push(r.id);
      else if (w.includes('Missing errors')) buckets['missing.errors'].push(r.id);
      else if (w.includes('Missing learning')) buckets['missing.learning'] = (buckets['missing.learning'] || []).concat(r.id);
      else if (w.includes('unknown skill')) buckets['unknown.skillRef'].push({ id: r.id, ref: w });
    }
  }
  console.log(JSON.stringify({
    generated: new Date().toISOString(),
    summary: Object.fromEntries(
      Object.entries(buckets).map(([k, v]) => [k, v.length])
    ),
    buckets
  }, null, 2));
} else {
  console.log(`\n📋 Skill Validation Report`);
  console.log(`   atomic: ${atomicResults.length}, composite: ${compositeResults.length}\n`);
  for (const r of all) {
    if (r.errors.length === 0 && r.warnings.length === 0) continue;
    const status = r.errors.length ? '❌' : '⚠️ ';
    console.log(`${status} [${r.kind}] ${r.id || r.file}  score=${r.score}`);
    for (const e of r.errors) console.log(`   ERROR: ${e}`);
    for (const w of r.warnings) console.log(`   WARN : ${w}`);
  }
  console.log(`\n— Maturity Summary —`);
  console.log(`  atomic count   : ${atomicResults.length}, avg ${atomicAvg}/100`);
  console.log(`  composite count: ${compositeResults.length}, avg ${compositeAvg}/100`);
  console.log(`  total errors   : ${totalErrors}`);
  console.log(`  total warnings : ${totalWarnings}`);
  console.log(`  overall score  : ${avgScore}/100\n`);
}

if (totalErrors > 0) process.exit(1);
if (strict && totalWarnings > 0) process.exit(2);

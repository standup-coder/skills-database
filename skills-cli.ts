#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Skill {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  status: 'learning' | 'improved' | 'completed';
}

interface DataStore {
  skills: Skill[];
}

const DATA_DIR = join(homedir(), '.skills-tracker');
const DATA_FILE = join(DATA_DIR, 'data.json');
const PROJECT_ROOT = join(__dirname, '..');

const styles = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  bgBlue: '\x1b[44m',
  bgCyan: '\x1b[46m',
};

function loadData(): DataStore {
  if (!existsSync(DATA_FILE)) {
    return { skills: [] };
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

function saveData(data: DataStore): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function getProjectSkills(): { name: string; type: string }[] {
  const items: { name: string; type: string }[] = [];

  const dirs = [
    { path: join(PROJECT_ROOT, 'skills'), type: 'skill' },
    { path: join(PROJECT_ROOT, 'atomic-skills'), type: 'atomic' },
    { path: join(PROJECT_ROOT, 'roles'), type: 'role' },
  ];

  for (const dir of dirs) {
    if (existsSync(dir.path)) {
      const files = readdirSync(dir.path).filter(f => f.endsWith('.json'));
      for (const file of files) {
        try {
          const content = JSON.parse(readFileSync(join(dir.path, file), 'utf-8'));
          items.push({ name: content.name || file.replace('.json', ''), type: dir.type });
        } catch {
          items.push({ name: file.replace('.json', ''), type: dir.type });
        }
      }
    }
  }
  return items;
}

function getFullSkillData() {
  const data: { roles: any[]; skills: any[]; atomics: any[] } = { roles: [], skills: [], atomics: [] };
  const dirs = [
    { path: join(PROJECT_ROOT, 'roles'), type: 'roles' },
    { path: join(PROJECT_ROOT, 'skills'), type: 'skills' },
    { path: join(PROJECT_ROOT, 'atomic-skills'), type: 'atomics' },
  ];
  for (const dir of dirs) {
    if (existsSync(dir.path)) {
      const files = readdirSync(dir.path).filter(f => f.endsWith('.json'));
      for (const file of files) {
        try {
          const content = JSON.parse(readFileSync(join(dir.path, file), 'utf-8'));
          data[dir.type].push(content);
        } catch { /* skip */ }
      }
    }
  }
  return data;
}

interface RoleProfile {
  name: string;
  nameZh: string;
  level: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  mainSkills: string[];
  atomicSkills: string[];
  techStack: string[];
}

function distillRoles(roles: any[]): RoleProfile[] {
  return roles.map(role => ({
    name: role.metadata?.name || role.id,
    nameZh: role.metadata?.nameZh || role.metadata?.name || role.id,
    level: role.metadata?.level || 'mid',
    summary: role.jd?.summaryZh || role.jd?.summary || '',
    responsibilities: role.jd?.responsibilitiesZh || role.jd?.responsibilities || [],
    requirements: role.jd?.requirements ? [
      role.jd.requirements.experience ? `经验: ${role.jd.requirements.experience}` : '',
      role.jd.requirements.coreSkills ? `核心技能: ${role.jd.requirements.coreSkills.join(', ')}` : '',
    ].filter(Boolean) : [],
    mainSkills: role.capabilities?.mainSkills || [],
    atomicSkills: role.capabilities?.atomicSkills || [],
    techStack: role.context?.techStack ? [...new Set(Object.values(role.context.techStack).flat())] as string[] : [],
  }));
}

function printDistillReport(roles: RoleProfile[], mySkills: Skill[]) {
  console.log('\n');

  const title = `${styles.bold}${styles.cyan}🔬 程序员蒸馏报告${styles.reset}`;
  console.log(title);
  console.log(styles.gray + '─'.repeat(56) + styles.reset);

  const _mySkillNames = new Set(mySkills.map(s => s.name.toLowerCase()));

  const allCapabilities = new Set<string>();
  const skillToRoles = new Map<string, string[]>();
  const roleSkillCounts = new Map<string, number>();

  for (const role of roles) {
    const count = (role.mainSkills.length + role.atomicSkills.length);
    roleSkillCounts.set(role.name, count);
    for (const skill of [...role.mainSkills, ...role.atomicSkills]) {
      allCapabilities.add(skill);
      if (!skillToRoles.has(skill)) skillToRoles.set(skill, []);
      skillToRoles.get(skill)!.push(role.name);
    }
  }

  const masteredCaps = new Set<string>();
  const learningCaps = new Set<string>();
  for (const skill of mySkills) {
    const matched = Array.from(allCapabilities).find(cap =>
      cap.toLowerCase().includes(skill.name.toLowerCase()) ||
      skill.name.toLowerCase().includes(cap.toLowerCase())
    );
    if (matched) {
      if (skill.status === 'completed') masteredCaps.add(matched);
      else if (skill.status === 'improved') learningCaps.add(matched);
    }
  }

  console.log(`\n  ${styles.bold}📊 能力统计${styles.reset}`);
  console.log(styles.gray + '  ' + '─'.repeat(52) + styles.reset);
  console.log(`    项目角色:       ${styles.magenta}${roles.length}${styles.reset} 个`);
  console.log(`    所需能力总数:   ${styles.blue}${allCapabilities.size}${styles.reset} 种`);
  console.log(`    我已掌握:       ${styles.green}${masteredCaps.size}${styles.reset} 种`);
  console.log(`    我在学习:       ${styles.yellow}${learningCaps.size}${styles.reset} 种`);
  console.log(`    覆盖率:         ${allCapabilities.size > 0 ? Math.round((masteredCaps.size / allCapabilities.size) * 100) : 0}%`);

  console.log(`\n  ${styles.bold}🎯 角色能力画像${styles.reset}`);
  console.log(styles.gray + '  ' + '─'.repeat(52) + styles.reset);

  const sortedRoles = [...roles].sort((a, b) => (roleSkillCounts.get(b.name) || 0) - (roleSkillCounts.get(a.name) || 0));

  for (const role of sortedRoles) {
    const capCount = (role.mainSkills.length + role.atomicSkills.length);
    const barLen = Math.round((capCount / (allCapabilities.size || 1)) * 20);
    const bar = '█'.repeat(barLen) + '░'.repeat(20 - barLen);

    console.log(`\n  ${styles.magenta}▸ ${role.nameZh}${styles.reset} ${styles.dim}(${role.name})${styles.reset}`);
    console.log(`    ${styles.gray}${bar}${styles.reset} ${styles.dim}${capCount} 能力${styles.reset}`);

    if (role.summary) {
      console.log(`    ${styles.cyan}${role.summary}${styles.reset}`);
    }

    const myMatched = [...role.mainSkills, ...role.atomicSkills].filter(skill =>
      masteredCaps.has(skill) || learningCaps.has(skill)
    );
    if (myMatched.length > 0) {
      const matchedStr = myMatched.map(s => `${masteredCaps.has(s) ? styles.green + '✓' : styles.yellow + '↑'}${styles.reset} ${s}`).join(', ');
      console.log(`    我的匹配: ${matchedStr}`);
    }

    if (role.techStack.length > 0) {
      console.log(`    技术栈: ${role.techStack.slice(0, 6).join(', ')}${role.techStack.length > 6 ? '...' : ''}`);
    }
  }

  console.log(`\n  ${styles.bold}📋 能力清单提取${styles.reset}`);
  console.log(styles.gray + '  ' + '─'.repeat(52) + styles.reset);

  const mainSkillsAll = [...new Set(roles.flatMap(r => r.mainSkills))].sort();
  const atomicSkillsAll = [...new Set(roles.flatMap(r => r.atomicSkills))].sort();

  console.log(`\n  ${styles.blue}复合技能 (${mainSkillsAll.length}):${styles.reset}`);
  for (let i = 0; i < mainSkillsAll.length; i += 3) {
    const row = mainSkillsAll.slice(i, i + 3).map(s => s.padEnd(25)).join('');
    console.log(`    ${row}`);
  }

  console.log(`\n  ${styles.green}原子技能 (${atomicSkillsAll.length}):${styles.reset}`);
  for (let i = 0; i < atomicSkillsAll.length; i += 4) {
    const row = atomicSkillsAll.slice(i, i + 4).map(s => s.padEnd(18)).join('');
    console.log(`    ${row}`);
  }

  console.log('\n');
}

function _printBox(lines: string[], opts: { border?: string; padding?: number; width?: number } = {}) {
  const { border = '─', padding = 1, width = 80 } = opts;
  const pad = ' '.repeat(padding);
  console.log(`┌${border.repeat(width - 2)}┐`);
  for (const line of lines) {
    const content = line.length > width - padding * 2 - 2
      ? line.substring(0, width - padding * 2 - 5) + '...'
      : line;
    console.log(`│${pad}${content}${' '.repeat(Math.max(0, width - 2 - padding * 2 - content.length))}│`);
  }
  console.log(`└${border.repeat(width - 2)}┘`);
}

function printDashboard(mySkills: Skill[], projectSkills: { name: string; type: string }[]) {
  console.log('\n');

  const title = `${styles.bold}${styles.cyan}⚡ Skills Tracker${styles.reset} ─ 能力提升追踪`;
  console.log(title);
  console.log(styles.gray + '─'.repeat(50) + styles.reset);

  const learning = mySkills.filter(s => s.status === 'learning').length;
  const improved = mySkills.filter(s => s.status === 'improved').length;
  const completed = mySkills.filter(s => s.status === 'completed').length;

  const statsLine = `  ${styles.green}●${styles.reset} 学习中 ${learning}  ${styles.yellow}↑${styles.reset} 已提升 ${improved}  ${styles.cyan}✓${styles.reset} 已掌握 ${completed}`;
  console.log(statsLine);
  console.log('');

  if (mySkills.length > 0) {
    const sectionTitle = `  ${styles.bold}${styles.white}📋 我的能力点 (${mySkills.length})${styles.reset}`;
    console.log(sectionTitle);
    console.log(styles.gray + '  ' + '─'.repeat(46) + styles.reset);

    mySkills.forEach((skill, i) => {
      const num = `${styles.dim}${(i + 1).toString().padStart(2, ' ')}${styles.reset}`;
      const icon = skill.status === 'completed' ? `${styles.green}✓` : skill.status === 'improved' ? `${styles.yellow}↑` : `${styles.cyan}○`;
      const statusText = skill.status === 'completed' ? `${styles.green}已掌握` : skill.status === 'improved' ? `${styles.yellow}已提升` : `${styles.dim}学习中`;
      const desc = skill.description ? `  ${styles.gray}${skill.description}${styles.reset}` : '';

      console.log(`  ${num} ${icon} ${styles.white}${skill.name}${styles.reset} ${statusText}`);
      if (desc) console.log(desc);
    });
    console.log('');
  }

  const roles = projectSkills.filter(s => s.type === 'role');
  const skills = projectSkills.filter(s => s.type === 'skill');
  const atomics = projectSkills.filter(s => s.type === 'atomic');

  const projectTitle = `  ${styles.bold}${styles.white}📦 项目 Skills (${projectSkills.length})${styles.reset}`;
  console.log(projectTitle);
  console.log(styles.gray + '  ' + '─'.repeat(46) + styles.reset);

  const _typeLabels: Record<string, string> = { role: '角色', skill: '技能', atomic: '原子' };
  const typeColors: Record<string, string> = { role: styles.magenta, skill: styles.blue, atomic: styles.green };

  const allItems = [...roles.map(s => ({ ...s, label: '角色' })), ...skills.map(s => ({ ...s, label: '技能' })), ...atomics.map(s => ({ ...s, label: '原子' }))];

  allItems.forEach((item) => {
    const color = typeColors[item.type] || styles.white;
    const label = `${color}[${item.label}]${styles.reset}`;
    console.log(`    ${label} ${item.name}`);
  });

  console.log('\n');
}

const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'add': {
    const data = loadData();
    let name = args.join(' ');
    let description: string | undefined;
    if (args.includes('--desc')) {
      const descIdx = args.indexOf('--desc');
      name = args.slice(0, descIdx).join(' ') || name;
      description = args.slice(descIdx + 1).join(' ') || undefined;
    }
    if (!name) {
      console.log('  请提供能力点名称: skills add <名称>');
      process.exit(1);
    }
    data.skills.push({
      id: generateId(),
      name,
      description,
      createdAt: new Date().toISOString(),
      status: 'learning'
    });
    saveData(data);
    console.log(`  ${styles.green}✓${styles.reset} 已添加: ${name}`);
    break;
  }

  case 'list':
  case 'ls':
  case 'dashboard':
  case undefined: {
    const data = loadData();
    const projectSkills = getProjectSkills();
    printDashboard(data.skills, projectSkills);
    break;
  }

  case 'done':
  case 'complete': {
    const data = loadData();
    const idx = parseInt(args[0]) - 1;
    if (isNaN(idx) || idx < 0 || idx >= data.skills.length) {
      console.log('  请提供正确的序号: skills done <序号>');
      process.exit(1);
    }
    data.skills[idx].status = 'completed';
    saveData(data);
    console.log(`  ${styles.green}✓${styles.reset} 已完成: ${data.skills[idx].name}`);
    break;
  }

  case 'improve':
  case 'up': {
    const data = loadData();
    const idx = parseInt(args[0]) - 1;
    if (isNaN(idx) || idx < 0 || idx >= data.skills.length) {
      console.log('  请提供正确的序号: skills improve <序号>');
      process.exit(1);
    }
    data.skills[idx].status = 'improved';
    saveData(data);
    console.log(`  ${styles.yellow}↑${styles.reset} 已标记提升: ${data.skills[idx].name}`);
    break;
  }

  case 'remove':
  case 'rm':
  case 'delete': {
    const data = loadData();
    const idx = parseInt(args[0]) - 1;
    if (isNaN(idx) || idx < 0 || idx >= data.skills.length) {
      console.log('  请提供正确的序号: skills remove <序号>');
      process.exit(1);
    }
    const removed = data.skills.splice(idx, 1)[0];
    saveData(data);
    console.log(`  ${styles.green}✓${styles.reset} 已删除: ${removed.name}`);
    break;
  }

  case 'distill':
  case 'profile': {
    const { roles } = getFullSkillData();
    const data = loadData();
    const profiles = distillRoles(roles);
    printDistillReport(profiles, data.skills);
    break;
  }

  case 'extract':
  case 'capabilities': {
    const { roles, skills, atomics } = getFullSkillData();
    console.log('\n');
    console.log(`${styles.bold}${styles.cyan}📦 能力清单导出${styles.reset}`);
    console.log(styles.gray + '─'.repeat(56) + styles.reset);

    const allSkills = skills.map(s => ({
      id: s.id,
      name: s.metadata?.name || s.id,
      type: 'skill',
      desc: s.metadata?.description || s.description || ''
    }));
    const allAtomics = atomics.map(s => ({
      id: s.id,
      name: s.metadata?.name || s.id,
      type: 'atomic',
      desc: s.metadata?.description || s.description || ''
    }));

    const mainSkillsAll = [...new Set(roles.flatMap(r => r.capabilities?.mainSkills || []))].sort();
    const atomicSkillsAll = [...new Set(roles.flatMap(r => r.capabilities?.atomicSkills || []))].sort();

    console.log(`\n  ${styles.blue}角色定义 (${roles.length})${styles.reset}`);
    for (const role of roles) {
      const level = role.metadata?.level || 'mid';
      const levelColor = level === 'senior' ? styles.green : level === 'junior' ? styles.yellow : styles.cyan;
      console.log(`    ${styles.magenta}▸${styles.reset} ${role.metadata?.nameZh || role.metadata?.name} ${styles.dim}(id: ${role.id}, level: ${levelColor}${level}${styles.reset})`);
    }

    console.log(`\n  ${styles.blue}所需复合技能 (${mainSkillsAll.length})${styles.reset}`);
    for (let i = 0; i < mainSkillsAll.length; i += 3) {
      const row = mainSkillsAll.slice(i, i + 3).map(s => {
        const found = allSkills.find(as => as.id === s);
        return found ? `${s} ${styles.dim}(${found.name})${styles.reset}` : s;
      }).map(s => s.padEnd(30)).join('');
      console.log(`    ${row}`);
    }

    console.log(`\n  ${styles.green}所需原子技能 (${atomicSkillsAll.length})${styles.reset}`);
    for (let i = 0; i < atomicSkillsAll.length; i += 4) {
      const row = atomicSkillsAll.slice(i, i + 4).map(s => {
        const found = allAtomics.find(at => at.id === s);
        return found ? `${s} ${styles.dim}(${found.name})${styles.reset}` : s;
      }).map(s => s.padEnd(22)).join('');
      console.log(`    ${row}`);
    }

    console.log(`\n  ${styles.yellow}项目现有技能 (${allSkills.length})${styles.reset}`);
    for (const skill of allSkills) {
      console.log(`    ${styles.blue}[skill]${styles.reset} ${skill.name} ${styles.dim}- ${skill.desc}${styles.reset}`);
    }

    console.log(`\n  ${styles.green}项目现有原子 (${allAtomics.length})${styles.reset}`);
    for (const atomic of allAtomics) {
      console.log(`    ${styles.green}[atomic]${styles.reset} ${atomic.name} ${styles.dim}- ${atomic.desc}${styles.reset}`);
    }

    console.log('\n');
    break;
  }

  case 'help':
  default: {
    console.log(`
${styles.bold}${styles.cyan}⚡ Skills Tracker${styles.reset} ─ 能力提升追踪 CLI

${styles.bold}用法:${styles.reset}
  ${styles.green}add${styles.reset} <名称>              添加新的能力点
  ${styles.green}add${styles.reset} <名称> --desc <描述>  添加带描述的能力点
  ${styles.green}list${styles.reset}                     查看所有能力点 (默认)
  ${styles.green}distill${styles.reset}                  生成程序员蒸馏报告
  ${styles.green}extract${styles.reset}                   提取所有能力定义清单
  ${styles.green}improve${styles.reset} <序号>           标记为已提升
  ${styles.green}done${styles.reset} <序号>             标记为已掌握
  ${styles.green}remove${styles.reset} <序号>           删除能力点
  ${styles.green}help${styles.reset}                    显示帮助

${styles.bold}示例:${styles.reset}
  skills add TypeScript
  skills add 系统设计 --desc 深入理解微服务架构
  skills list
  skills distill
  skills extract
  skills improve 1
  skills done 2
  skills remove 3
`);
    break;
  }
}
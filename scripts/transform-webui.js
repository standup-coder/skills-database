import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, '..', 'webui', 'index.html');

const html = fs.readFileSync(htmlPath, 'utf-8');
const lines = html.split('\n');

const beforeData = lines.slice(0, 1137);
const afterData = lines.slice(3530);

const asyncLoadCode = `    // ===== PROJECT DATA (loaded from API) =====
    let PROJECT = { roles: [], skills: [], atomics: [] };

    async function loadProjectData() {
      try {
        const res = await fetch('/api/project-data');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        PROJECT = await res.json();
      } catch(e) {
        console.error('Failed to load project data:', e);
        showToast('数据加载失败，请刷新页面重试');
      }
    }`;

let remaining = afterData.join('\n');

remaining = remaining.replace(
  '    // Cache for fast lookups - rebuilt when data changes\n    const roleMap = new Map(PROJECT.roles.map(r => [r.id, r]));\n    const skillMap = new Map(PROJECT.skills.map(s => [s.id, s]));\n    const atomicMap = new Map(PROJECT.atomics.map(a => [a.id, a]));',
  `    // Cache for fast lookups - rebuilt when data changes
    let roleMap = new Map();
    let skillMap = new Map();
    let atomicMap = new Map();
    function rebuildMaps() {
      roleMap = new Map(PROJECT.roles.map(r => [r.id, r]));
      skillMap = new Map(PROJECT.skills.map(s => [s.id, s]));
      atomicMap = new Map(PROJECT.atomics.map(a => [a.id, a]));
    }`
);

remaining = remaining.replace(
  `    // ===== INIT =====
    selectedPath = { type: 'person' };
    render();
    renderSkillBuilderList();
  </script>`,
  `    // ===== INIT =====
    async function initApp() {
      await loadProjectData();
      rebuildMaps();
      selectedPath = { type: 'person' };
      render();
      renderSkillBuilderList();
    }
    initApp();
  </script>`
);

const newHtml = beforeData.join('\n') + '\n' + asyncLoadCode + '\n' + remaining;

fs.writeFileSync(htmlPath, newHtml, 'utf-8');
console.log('webui/index.html updated: removed inline data, added async API loading');

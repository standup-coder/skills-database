import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const htmlPath = join(rootDir, 'webui', 'index.html');
const seedDataPath = join(rootDir, 'data', 'seed-data.json');

const html = fs.readFileSync(htmlPath, 'utf-8');

const startMarker = 'const PROJECT = {';
const startIdx = html.indexOf(startMarker);
if (startIdx === -1) {
  console.error('ERROR: No inline PROJECT data found in webui/index.html');
  console.error('This script must be run BEFORE the webui is transformed.');
  process.exit(1);
}

const endMarker = '\n    };\n\n    // ===== LEVELS =====';
const endIdx = html.indexOf(endMarker, startIdx);
if (endIdx === -1) {
  console.error('ERROR: Could not find end of PROJECT data');
  process.exit(1);
}

let code = html.substring(startMarker.length, startIdx + (endIdx - startIdx) + '\n    };'.length);
code = code.replace(/]\s*\n(\s*)resources:/g, '],\n$1resources:');

const dataDir = join(rootDir, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const context = vm.createContext({});
const PROJECT = vm.runInContext(`(function() { ${code}; return PROJECT; })()`, context, { timeout: 10000 });

fs.writeFileSync(seedDataPath, JSON.stringify(PROJECT));
console.log(`Extracted: ${PROJECT.roles.length} roles, ${PROJECT.skills.length} skills, ${PROJECT.atomics.length} atomics -> ${seedDataPath}`);

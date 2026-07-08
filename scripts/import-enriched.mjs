import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initDb, migrateDb, getDb } from '../app/server/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'enriched');

initDb();
migrateDb();

const db = getDb();
const updateStmt = db.prepare(`
  UPDATE knowledge_points SET
    summary = ?, key_points = ?, code_example = ?,
    best_practices = ?, common_mistakes = ?,
    difficulty = ?, estimated_time = ?, enriched = 1
  WHERE id = ?
`);

const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
console.log(`[import] Found ${files.length} enriched data files`);

let totalImported = 0;

const importAll = db.transaction(() => {
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(join(DATA_DIR, file), 'utf-8'));
    for (const [id, kp] of Object.entries(data)) {
      updateStmt.run(
        kp.summary || null,
        JSON.stringify(kp.keyPoints || []),
        kp.codeExample || null,
        JSON.stringify(kp.bestPractices || []),
        JSON.stringify(kp.commonMistakes || []),
        kp.difficulty || 'intermediate',
        kp.estimatedTime || '30min',
        id
      );
      totalImported++;
    }
  }
});

importAll();
console.log(`[import] Imported ${totalImported} knowledge points`);

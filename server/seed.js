import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initDb, getDb, isSeeded } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED_DATA_PATH = join(__dirname, '..', 'data', 'seed-data.json');

function loadSeedData() {
  if (!fs.existsSync(SEED_DATA_PATH)) {
    throw new Error('Seed data not found. Run: node scripts/extract-seed-data.mjs first');
  }
  return JSON.parse(fs.readFileSync(SEED_DATA_PATH, 'utf-8'));
}

export function seedDatabase() {
  initDb();

  if (isSeeded()) {
    console.log('[seed] Database already seeded, skipping...');
    return;
  }

  console.log('[seed] Loading data from data/seed-data.json...');
  const PROJECT = loadSeedData();

  const db = getDb();

  const insertRole = db.prepare(`
    INSERT INTO roles (id, name, name_en, \`desc\`, level, tech_stack, responsibilities, requirements)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertSkill = db.prepare(`
    INSERT INTO skills (id, name, name_en, \`desc\`, category, steps)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertAtomic = db.prepare(`
    INSERT INTO atomic_skills (id, name, name_en, \`desc\`, category)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertRoleSkill = db.prepare(`
    INSERT OR IGNORE INTO role_skills (role_id, skill_id, sort_order) VALUES (?, ?, ?)
  `);
  const insertRoleAtomic = db.prepare(`
    INSERT OR IGNORE INTO role_atomic_skills (role_id, atomic_skill_id, sort_order) VALUES (?, ?, ?)
  `);
  const insertKp = db.prepare(`
    INSERT INTO knowledge_points (id, name, \`desc\`, skill_id, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertResource = db.prepare(`
    INSERT INTO resources (title, url, type, source, skill_id, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const seedAll = db.transaction(() => {
    for (const r of PROJECT.roles) {
      insertRole.run(
        r.id,
        r.name,
        r.nameEn || null,
        r.desc || null,
        r.level || null,
        JSON.stringify(r.techStack || []),
        JSON.stringify(r.responsibilities || []),
        JSON.stringify(r.requirements || {})
      );
      (r.mainSkills || []).forEach((sid, i) => {
        insertRoleSkill.run(r.id, sid, i);
      });
      (r.atomicSkills || []).forEach((aid, i) => {
        insertRoleAtomic.run(r.id, aid, i);
      });
    }

    for (const s of PROJECT.skills) {
      insertSkill.run(
        s.id,
        s.name,
        s.nameEn || null,
        s.desc || null,
        s.category || null,
        JSON.stringify(s.steps || [])
      );
      (s.knowledgePoints || []).forEach((kp, i) => {
        insertKp.run(kp.id, kp.name, kp.desc || null, s.id, i);
      });
      (s.resources || []).forEach((res, i) => {
        insertResource.run(res.title, res.url || null, res.type || null, res.source || null, s.id, i);
      });
    }

    for (const a of PROJECT.atomics) {
      insertAtomic.run(a.id, a.name, a.nameEn || null, a.desc || null, a.category || null);
    }
  });

  seedAll();

  const stats = {
    roles: PROJECT.roles.length,
    skills: PROJECT.skills.length,
    atomics: PROJECT.atomics.length,
    knowledgePoints: PROJECT.skills.reduce((c, s) => c + (s.knowledgePoints || []).length, 0),
    resources: PROJECT.skills.reduce((c, s) => c + (s.resources || []).length, 0),
  };

  console.log(`[seed] Seeded: ${stats.roles} roles, ${stats.skills} skills, ${stats.atomics} atomics, ${stats.knowledgePoints} knowledge points, ${stats.resources} resources`);
}

seedDatabase();

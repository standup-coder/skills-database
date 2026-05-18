import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'skills4coder.db');

let db = null;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT,
      desc TEXT,
      level TEXT,
      tech_stack TEXT,
      responsibilities TEXT,
      requirements TEXT
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT,
      desc TEXT,
      category TEXT,
      steps TEXT
    );

    CREATE TABLE IF NOT EXISTS atomic_skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT,
      desc TEXT,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS role_skills (
      role_id TEXT NOT NULL,
      skill_id TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      PRIMARY KEY (role_id, skill_id)
    );

    CREATE TABLE IF NOT EXISTS role_atomic_skills (
      role_id TEXT NOT NULL,
      atomic_skill_id TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      PRIMARY KEY (role_id, atomic_skill_id)
    );

    CREATE TABLE IF NOT EXISTS knowledge_points (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      desc TEXT,
      skill_id TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      summary TEXT,
      key_points TEXT,
      code_example TEXT,
      best_practices TEXT,
      common_mistakes TEXT,
      difficulty TEXT,
      estimated_time TEXT,
      enriched INTEGER DEFAULT 0,
      FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT,
      type TEXT,
      source TEXT,
      skill_id TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
    );
  `);

  return db;
}

export function migrateDb() {
  const db = getDb();
  const cols = db.prepare("PRAGMA table_info(knowledge_points)").all().map(c => c.name);
  const additions = [
    ['summary', 'TEXT'],
    ['key_points', 'TEXT'],
    ['code_example', 'TEXT'],
    ['best_practices', 'TEXT'],
    ['common_mistakes', 'TEXT'],
    ['difficulty', 'TEXT'],
    ['estimated_time', 'TEXT'],
    ['enriched', 'INTEGER DEFAULT 0'],
  ];
  for (const [col, type] of additions) {
    if (!cols.includes(col)) {
      db.exec(`ALTER TABLE knowledge_points ADD COLUMN ${col} ${type}`);
    }
  }
}

export function isSeeded() {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as cnt FROM roles').get();
  return row.cnt > 0;
}

function mapKpRow(kp) {
  return {
    id: kp.id,
    name: kp.name,
    desc: kp.desc,
    skill_id: kp.skill_id,
    summary: kp.summary,
    keyPoints: JSON.parse(kp.key_points || '[]'),
    codeExample: kp.code_example,
    bestPractices: JSON.parse(kp.best_practices || '[]'),
    commonMistakes: JSON.parse(kp.common_mistakes || '[]'),
    difficulty: kp.difficulty,
    estimatedTime: kp.estimated_time,
    enriched: !!kp.enriched,
  };
}

export function getProjectData() {
  const db = getDb();

  const roles = db.prepare('SELECT * FROM roles').all().map(r => ({
    ...r,
    techStack: JSON.parse(r.tech_stack || '[]'),
    responsibilities: JSON.parse(r.responsibilities || '[]'),
    requirements: JSON.parse(r.requirements || '{}'),
    mainSkills: db.prepare('SELECT skill_id FROM role_skills WHERE role_id = ? ORDER BY sort_order').all(r.id).map(s => s.skill_id),
    atomicSkills: db.prepare('SELECT atomic_skill_id FROM role_atomic_skills WHERE role_id = ? ORDER BY sort_order').all(r.id).map(s => s.atomic_skill_id),
  }));

  const kpStmt = db.prepare('SELECT * FROM knowledge_points WHERE skill_id = ? ORDER BY sort_order');
  const skills = db.prepare('SELECT * FROM skills').all().map(s => ({
    ...s,
    steps: JSON.parse(s.steps || '[]'),
    knowledgePoints: kpStmt.all(s.id).map(mapKpRow),
    resources: db.prepare('SELECT title, url, type, source FROM resources WHERE skill_id = ? ORDER BY sort_order').all(s.id),
  }));

  const atomics = db.prepare('SELECT * FROM atomic_skills').all();

  return { roles, skills, atomics };
}

export function getRolesList() {
  const db = getDb();
  return db.prepare(`
    SELECT r.*,
      (SELECT COUNT(*) FROM role_skills WHERE role_id = r.id) as main_skill_count,
      (SELECT COUNT(*) FROM role_atomic_skills WHERE role_id = r.id) as atomic_skill_count
    FROM roles r
  `).all().map(r => ({
    ...r,
    techStack: JSON.parse(r.tech_stack || '[]'),
    responsibilities: JSON.parse(r.responsibilities || '[]'),
    requirements: JSON.parse(r.requirements || '{}'),
    mainSkills: db.prepare('SELECT skill_id FROM role_skills WHERE role_id = ? ORDER BY sort_order').all(r.id).map(s => s.skill_id),
    atomicSkills: db.prepare('SELECT atomic_skill_id FROM role_atomic_skills WHERE role_id = ? ORDER BY sort_order').all(r.id).map(s => s.atomic_skill_id),
  }));
}

export function getSkillsList() {
  const db = getDb();
  return db.prepare(`
    SELECT s.*,
      (SELECT COUNT(*) FROM knowledge_points WHERE skill_id = s.id) as kp_count
    FROM skills s
  `).all().map(s => ({
    ...s,
    steps: JSON.parse(s.steps || '[]'),
    knowledgePoints: db.prepare('SELECT * FROM knowledge_points WHERE skill_id = ? ORDER BY sort_order').all(s.id).map(mapKpRow),
    resources: db.prepare('SELECT title, url, type, source FROM resources WHERE skill_id = ? ORDER BY sort_order').all(s.id),
  }));
}

export function getAtomicSkillsList() {
  const db = getDb();
  return db.prepare('SELECT * FROM atomic_skills').all();
}

export function getStats() {
  const db = getDb();
  return {
    roles: db.prepare('SELECT COUNT(*) as cnt FROM roles').get().cnt,
    skills: db.prepare('SELECT COUNT(*) as cnt FROM skills').get().cnt,
    atomicSkills: db.prepare('SELECT COUNT(*) as cnt FROM atomic_skills').get().cnt,
    knowledgePoints: db.prepare('SELECT COUNT(*) as cnt FROM knowledge_points').get().cnt,
    resources: db.prepare('SELECT COUNT(*) as cnt FROM resources').get().cnt,
  };
}

export function search(query) {
  const db = getDb();
  const q = `%${query}%`;

  const roles = db.prepare('SELECT id, name, name_en, desc FROM roles WHERE name LIKE ? OR name_en LIKE ? OR "desc" LIKE ?').all(q, q, q);
  const skills = db.prepare('SELECT id, name, name_en, desc, category FROM skills WHERE name LIKE ? OR name_en LIKE ? OR "desc" LIKE ?').all(q, q, q);
  const knowledgePoints = db.prepare('SELECT id, name, desc, skill_id FROM knowledge_points WHERE name LIKE ? OR "desc" LIKE ?').all(q, q);

  return { roles, skills, knowledgePoints };
}

import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initDb, migrateDb, getProjectData, getRolesList, getSkillsList, getAtomicSkillsList, getStats, search } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.WEBUI_PORT || '8420', 10);

const app = express();
app.use(express.json());

app.get('/api/project-data', (req, res) => {
  try {
    const data = getProjectData();
    res.json(data);
  } catch (err) {
    console.error('[api] Error fetching project data:', err);
    res.status(500).json({ error: 'Failed to fetch project data' });
  }
});

app.get('/api/roles', (req, res) => {
  try {
    res.json(getRolesList());
  } catch (err) {
    console.error('[api] Error fetching roles:', err);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

app.get('/api/skills', (req, res) => {
  try {
    res.json(getSkillsList());
  } catch (err) {
    console.error('[api] Error fetching skills:', err);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

app.get('/api/atomic-skills', (req, res) => {
  try {
    res.json(getAtomicSkillsList());
  } catch (err) {
    console.error('[api] Error fetching atomic skills:', err);
    res.status(500).json({ error: 'Failed to fetch atomic skills' });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    res.json(getStats());
  } catch (err) {
    console.error('[api] Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/search', (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q.trim()) return res.json({ roles: [], skills: [], knowledgePoints: [] });
    res.json(search(q));
  } catch (err) {
    console.error('[api] Error searching:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.use(express.static(join(__dirname, '..', 'webui')));

initDb();
migrateDb();

export function startServer() {
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`[server] Skills4Coder running at http://localhost:${PORT}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer().catch(err => {
    console.error('[server] Failed to start:', err);
    process.exit(1);
  });
}

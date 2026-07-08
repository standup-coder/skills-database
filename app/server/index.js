import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initDb, migrateDb, getProjectData, getRolesList, getSkillsList, getAtomicSkillsList, getStats, search } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.WEBUI_PORT || '8420', 10);
const API_KEY = process.env.API_KEY || '';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8420';

// ---------------------------------------------------------------------------
// Rate limiter (in-memory, no external deps)
// ---------------------------------------------------------------------------
const rateLimitMap = new Map(); // ip -> { count, resetAt }
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 120;         // requests per window

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  let entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(ip, entry);
  }
  entry.count++;
  res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, RATE_LIMIT_MAX - entry.count)));
  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests, please try again later' });
  }
  next();
}

// ---------------------------------------------------------------------------
// Input validation helpers
// ---------------------------------------------------------------------------
const MAX_QUERY_LENGTH = 200;
const DANGEROUS_PATTERN = /[\x00-\x08\x0e-\x1f<>{}]/g;

function sanitizeQuery(raw) {
  if (typeof raw !== 'string') return '';
  let q = raw.slice(0, MAX_QUERY_LENGTH);
  q = q.replace(DANGEROUS_PATTERN, '');
  return q.trim();
}

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------
const app = express();

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Only send HSTS when served over HTTPS
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// API key auth (skipped when API_KEY env var is empty for backward compat)
app.use('/api', (req, res, next) => {
  if (!API_KEY) return next();            // auth disabled
  const provided = req.headers['x-api-key'];
  if (provided === API_KEY) return next();
  return res.status(401).json({ error: 'Unauthorized: invalid or missing API key' });
});

// Rate limiting for API routes
app.use('/api', rateLimiter);

// Body parsing
app.use(express.json({ limit: '100kb' }));

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

app.get('/api/project-data', (req, res) => {
  try {
    res.json(getProjectData());
  } catch (err) {
    console.error('[api] Error fetching project data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/roles', (req, res) => {
  try {
    res.json(getRolesList());
  } catch (err) {
    console.error('[api] Error fetching roles:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/skills', (req, res) => {
  try {
    res.json(getSkillsList());
  } catch (err) {
    console.error('[api] Error fetching skills:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/atomic-skills', (req, res) => {
  try {
    res.json(getAtomicSkillsList());
  } catch (err) {
    console.error('[api] Error fetching atomic skills:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    res.json(getStats());
  } catch (err) {
    console.error('[api] Error fetching stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/search', (req, res) => {
  try {
    const q = sanitizeQuery(req.query.q);
    if (!q) return res.json({ roles: [], skills: [], knowledgePoints: [] });
    res.json(search(q));
  } catch (err) {
    console.error('[api] Error searching:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Catch-all: serve static webui files
app.use(express.static(join(__dirname, '..', 'webui')));

// Global error handler — never leak internals
app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ---------------------------------------------------------------------------
// Database init & server start
// ---------------------------------------------------------------------------

initDb();
migrateDb();

export function startServer() {
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`[server] Skills4Coder running at http://localhost:${PORT}`);
      if (API_KEY) console.log('[server] API key auth is ENABLED');
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

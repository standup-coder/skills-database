import { initDb, migrateDb, getDb } from './db.js';

initDb();
migrateDb();

const db = getDb();

const skills = db.prepare('SELECT id, name, category FROM skills').all();
const skillMap = new Map(skills.map(s => [s.id, s]));
const kps = db.prepare('SELECT id, name, desc, skill_id FROM knowledge_points').all();

const DIFFICULTY_MAP = {
  'sre-core': 'advanced', observability: 'intermediate', incident: 'intermediate',
  platform: 'advanced', security: 'intermediate', operations: 'intermediate',
  reliability: 'advanced', devops: 'intermediate', cloud: 'intermediate',
  architecture: 'advanced', backend: 'intermediate', frontend: 'intermediate',
  qa: 'intermediate', product: 'beginner', 'cloud-security': 'advanced',
  'cloud-product': 'intermediate', 'ai-agent': 'advanced', leadership: 'intermediate',
  'customer-success': 'beginner', data: 'intermediate', design: 'beginner',
  growth: 'intermediate', marketing: 'beginner', mobile: 'intermediate', development: 'intermediate',
};

function pickDifficulty(category, name, desc) {
  const base = DIFFICULTY_MAP[category] || 'intermediate';
  const lower = (name + ' ' + desc).toLowerCase();
  if (/\b(基础|入门|fundamental|basic|intro)\b/.test(lower)) return 'beginner';
  if (/\b(高级|进阶|advanced|expert|deep)\b/.test(lower)) return 'advanced';
  return base;
}

function pickTime(difficulty, desc) {
  const len = (desc || '').length;
  if (difficulty === 'beginner') return len > 100 ? '30min' : '15min';
  if (difficulty === 'advanced') return len > 100 ? '2h' : '1h';
  return len > 100 ? '1h' : '30min';
}

function makeSummary(name, desc) {
  if (!desc || desc.length < 10) return `${name}是软件开发和运维中的关键技术概念，掌握其核心原理和实践方法对于提升工程能力至关重要。`;
  const first = desc.replace(/[；;].*/, '').trim();
  if (first.length > 120) return first.substring(0, 117) + '...';
  return first;
}

function extractKeyPoints(name, desc) {
  if (!desc) return [`${name}的核心概念与定义`, `${name}的工作原理与机制`, `${name}的典型应用场景`, `掌握${name}需要了解的关键技术细节`];

  const parts = desc.split(/[；;，,、。\n]/).map(s => s.trim()).filter(s => s.length > 5 && s.length < 80);
  if (parts.length >= 4) return parts.slice(0, 6);

  const base = [`${name}的定义与核心概念`];
  if (desc.includes('：')) {
    const subParts = desc.split('：').slice(1).join('：').split(/[，,、]/).map(s => s.trim()).filter(s => s.length > 3 && s.length < 60);
    base.push(...subParts.slice(0, 5));
  } else {
    base.push(...parts.slice(0, 3));
  }
  base.push(`${name}在实际项目中的应用与注意事项`);
  return base.slice(0, 6);
}

const CODE_TEMPLATES = {
  sre: (name) => `# SLO 定义示例\nslo:\n  name: "${name}"\n  target: 99.9%\n  window: 30d\n  sli:\n    metric: success_rate\n    filter: service="api-gateway"\n  alert:\n    burn_rate: 14.4x`,

  observability: (name) => `# Prometheus 告警规则\ngroups:\n  - name: ${name}\n    rules:\n      - alert: HighErrorRate\n        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01\n        for: 5m\n        labels:\n          severity: critical`,

  incident: (name) => `# 故障响应 Runbook\n## ${name}\n### 检测\n- 监控告警触发\n- 用户反馈\n### 止血\n- 评估影响范围\n- 执行回滚/降级\n- 通知 stakeholders`,

  devops: (name) => `# Dockerfile 最佳实践\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --production\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nCMD ["node", "dist/main.js"]`,

  security: (name) => `# 安全扫描\n$ trivy image --severity HIGH,CRITICAL myapp:latest\n$ tfsec .\n$ checkov -f terraform/main.tf\n\n# OPA 策略\npackage authz\ndefault allow = false\nallow {\n  input.role == "admin"\n  input.action == "read"\n}`,

  operations: (name) => `# Kubernetes 部署清单\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n      - name: app\n        image: app:1.0.0\n        resources:\n          requests: { memory: "128Mi", cpu: "100m" }\n          limits:   { memory: "256Mi", cpu: "500m" }\n        livenessProbe:\n          httpGet: { path: /healthz, port: 8080 }`,

  'cloud-security': (name) => `# IAM 最小权限策略\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["s3:GetObject", "s3:PutObject"],\n    "Resource": "arn:aws:s3:::my-bucket/*",\n    "Condition": {\n      "IpAddress": {"aws:SourceIp": ["10.0.0.0/8"]}\n    }\n  }]\n}`,

  'cloud-product': (name) => `# AWS CDK 示例\nimport * as cdk from 'aws-cdk-lib';\nimport * as lambda from 'aws-cdk-lib/aws-lambda';\n\nexport class AppStack extends cdk.Stack {\n  constructor(scope, id, props) {\n    super(scope, id, props);\n    new lambda.Function(this, 'Handler', {\n      runtime: lambda.Runtime.NODEJS_20_X,\n      handler: 'index.handler',\n      code: lambda.Code.fromAsset('src'),\n    });\n  }\n}`,

  'ai-agent': (name) => `# OpenAI Function Calling\nconst tools = [{\n  type: "function",\n  function: {\n    name: "get_weather",\n    description: "获取天气信息",\n    parameters: {\n      type: "object",\n      properties: {\n        city: { type: "string", description: "城市名" }\n      },\n      required: ["city"]\n    }\n  }\n}];\n\nconst response = await openai.chat.completions.create({\n  model: "gpt-4o", messages, tools\n});`,

  frontend: (name) => `// React 组件示例\nimport { useState, useCallback } from 'react';\n\nexport function useOptimisticUpdate(key) {\n  const [state, setState] = useState(null);\n  const update = useCallback(async (newValue) => {\n    const prev = state;\n    setState(newValue); // optimistic\n    try {\n      await api.update(key, newValue);\n    } catch (e) {\n      setState(prev); // rollback\n    }\n  }, [key, state]);\n  return [state, update];\n}`,

  backend: (name) => `// Node.js API 示例\napp.post('/api/users', async (req, res) => {\n  const { name, email } = req.body;\n  // 输入校验\n  if (!name || !email) return res.status(400).json({ error: 'Missing fields' });\n  try {\n    const user = await db.user.create({ data: { name, email } });\n    res.status(201).json(user);\n  } catch (err) {\n    if (err.code === 'P2002') return res.status(409).json({ error: 'Email exists' });\n    res.status(500).json({ error: 'Internal error' });\n  }\n});`,

  default: (name) => `# ${name}\n# 1. 理解核心概念\n# 2. 实践基本操作\n# 3. 结合项目场景应用\n# 4. 持续学习和改进`,
};

function makeCodeExample(category, name) {
  const tmpl = CODE_TEMPLATES[category] || CODE_TEMPLATES.default;
  return tmpl(name);
}

function makeBestPractices(name, category) {
  return [
    `在实践${name}时，始终参考官方文档和社区最佳实践指南`,
    `建立定期回顾机制，确保${name}相关配置和策略保持最新`,
    `在团队内部分享${name}的经验教训，建立知识库`,
  ];
}

function makeCommonMistakes(name, category) {
  return [
    `忽略${name}的边界条件和异常场景处理`,
    `过度依赖默认配置，未根据实际业务需求调优`,
    `缺乏对${name}相关变更的测试和验证流程`,
  ];
}

const updateStmt = db.prepare(`
  UPDATE knowledge_points SET
    summary = ?, key_points = ?, code_example = ?,
    best_practices = ?, common_mistakes = ?,
    difficulty = ?, estimated_time = ?, enriched = 1
  WHERE id = ?
`);

const enrichAll = db.transaction(() => {
  for (const kp of kps) {
    const skill = skillMap.get(kp.skill_id);
    const category = skill?.category || 'default';
    const difficulty = pickDifficulty(category, kp.name, kp.desc);
    const estimatedTime = pickTime(difficulty, kp.desc);
    const summary = makeSummary(kp.name, kp.desc);
    const keyPoints = JSON.stringify(extractKeyPoints(kp.name, kp.desc));
    const codeExample = makeCodeExample(category, kp.name);
    const bestPractices = JSON.stringify(makeBestPractices(kp.name, category));
    const commonMistakes = JSON.stringify(makeCommonMistakes(kp.name, category));

    updateStmt.run(summary, keyPoints, codeExample, bestPractices, commonMistakes, difficulty, estimatedTime, kp.id);
  }
});

enrichAll();

const enriched = db.prepare('SELECT COUNT(*) as cnt FROM knowledge_points WHERE enriched = 1').get().cnt;
console.log(`[enrich-template] Enriched ${enriched} knowledge points`);

# Agent 开发指南

如何使用 Skills4Coder 框架开发和部署专业 AI Agent。

## 🌐 Languages
- [English](AGENTS.md) | [中文](AGENTS_zh.md)

---

## 目录

1. [Agent 基础概念](#agent-基础概念)
2. [快速开始](#快速开始)
3. [定义 Role](#定义-role)
4. [使用 Skills](#使用-skills)
5. [多 Agent 协作](#多-agent-协作)
6. [高级用法](#高级用法)
7. [调试与监控](#调试与监控)

---

## Agent 基础概念

### 什么是 Agent？

在 Skills4Coder 中，**Agent = Role + LLM + Tools + Memory**

| 组件 | 说明 | 示例 |
|-----|------|------|
| Role | 岗位定义，决定 Agent 的能力边界 | Senior Frontend Dev |
| LLM | 底层大语言模型 | GPT-4, Claude |
| Tools | 可调用的工具集 | MCP Servers |
| Memory | 上下文和对话历史 | Thread 存储 |

### Agent 类型

```
Single Agent (单 Agent)
    └── 一个 Role 完成特定任务
    
Multi Agent (多 Agent)
    └── 多个 Role 协作完成复杂项目
    
Dynamic Agent (动态 Agent)
    └── 运行时动态切换 Role 和 Skills
```

---

## 快速开始

### 安装依赖

```bash
npm install skills4coder
```

### 运行第一个 Agent

```javascript
import { Agent, Role } from 'skills4coder';

// 1. 加载预定义 Role
const role = Role.fromJSON('./roles/code-reviewer.json');

// 2. 创建 Agent
const agent = new Agent({
  role,
  llm: 'gpt-4',
  tools: ['mcp-filesystem']
});

// 3. 执行任务
const result = await agent.execute('review-code', {
  filePath: './src/app.ts'
});

console.log(result.reviewComments);
```

---

## 定义 Role

### Role 配置文件

```json
{
  "$schema": "./schema/role-v1.json",
  "id": "senior-backend-dev",
  "type": "role",
  "version": "1.0.0",
  
  "metadata": {
    "name": "Senior Backend Developer",
    "description": "负责服务端架构、API 开发、性能优化",
    "author": "skills4coder-team",
    "tags": ["backend", "api", "database"]
  },
  
  "jd": {
    "summary": "设计和实现高可用、可扩展的后端服务",
    "responsibilities": [
      "设计 RESTful/GraphQL API",
      "数据库设计和优化",
      "代码审查和质量把控",
      "性能监控和调优"
    ],
    "requirements": {
      "experience": "5+ years",
      "education": "CS related",
      "skills": ["Node.js", "PostgreSQL", "Redis", "Docker"]
    }
  },
  
  "capabilities": {
    "mainSkills": [
      "api-design",
      "database-design", 
      "performance-optimization",
      "code-review"
    ],
    "atomicSkills": [
      "read-file",
      "write-code",
      "run-tests",
      "git-operations",
      "database-query"
    ]
  },
  
  "context": {
    "techStack": ["Node.js", "Express", "PostgreSQL"],
    "codingStandards": "airbnb-base",
    "reviewCriteria": ["security", "performance", "maintainability"]
  }
}
```

### 动态创建 Role

```javascript
import { Role } from 'skills4coder';

const customRole = new Role({
  id: 'my-custom-role',
  name: 'Custom Developer',
  jd: 'Custom job description...',
  mainSkills: ['skill-1', 'skill-2'],
  atomicSkills: ['atomic-1', 'atomic-2'],
  parameters: {
    customParam: 'value'
  }
});

// 保存 Role 定义
customRole.save('./roles/my-custom-role.json');
```

---

## 使用 Skills

### 调用复合技能

```javascript
// 方式 1: 直接调用
const result = await agent.use('code-review', {
  filePath: './src/utils.ts',
  focus: ['security', 'performance']
});

// 方式 2: 流式输出
const stream = await agent.stream('write-documentation', {
  codeFiles: ['./src/*.ts']
});

for await (const chunk of stream) {
  process.stdout.write(chunk.content);
}

// 方式 3: 批量处理
const files = ['./src/a.ts', './src/b.ts', './src/c.ts'];
const results = await agent.batch('code-review', files.map(f => ({ filePath: f })));
```

### 技能组合

```javascript
// 链式调用
const design = await agent.use('api-design', { requirements });
const code = await agent.use('generate-code', { spec: design });
const tests = await agent.use('generate-tests', { code });

// 使用工作流
const workflow = agent.createWorkflow([
  { skill: 'api-design', input: { requirements } },
  { skill: 'generate-code', input: { spec: '{{prev.apiSpec}}' } },
  { skill: 'generate-tests', input: { code: '{{prev.code}}' } }
]);

const result = await workflow.run();
```

---

## 多 Agent 协作

### 简单协作

```javascript
import { Team } from 'skills4coder';

const team = new Team({
  name: 'Feature Development Team',
  members: [
    { role: 'product-manager', name: 'PM-Agent' },
    { role: 'backend-dev', name: 'Backend-Agent' },
    { role: 'frontend-dev', name: 'Frontend-Agent' },
    { role: 'qa-engineer', name: 'QA-Agent' }
  ]
});

const result = await team.collaborate({
  task: 'implement-feature',
  requirements: '用户登录功能，支持 OAuth',
  deliverables: ['prd.md', 'api-spec.yaml', 'frontend-code/', 'test-cases/']
});
```

### 定义协作流程

```javascript
import { Workflow } from 'skills4coder';

const devWorkflow = new Workflow({
  name: 'Feature Development',
  
  steps: [
    {
      id: 'prd',
      agent: 'product-manager',
      skill: 'write-prd',
      input: '{{requirements}}',
      output: 'PRD.md'
    },
    {
      id: 'api-design',
      agent: 'backend-architect',
      skill: 'design-api',
      input: '{{steps.prd.output}}',
      output: 'api-spec.yaml',
      dependsOn: ['prd']
    },
    {
      id: 'backend-impl',
      agent: 'backend-dev',
      skill: 'implement-api',
      input: '{{steps.api-design.output}}',
      output: 'backend-code/',
      dependsOn: ['api-design']
    },
    {
      id: 'frontend-impl',
      agent: 'frontend-dev',
      skill: 'implement-ui',
      input: ['{{steps.prd.output}}', '{{steps.api-design.output}}'],
      output: 'frontend-code/',
      dependsOn: ['api-design']
    },
    {
      id: 'testing',
      agent: 'qa-engineer',
      skill: 'write-e2e-tests',
      input: ['{{steps.api-design.output}}', '{{steps.frontend-impl.output}}'],
      output: 'e2e-tests/',
      dependsOn: ['backend-impl', 'frontend-impl']
    }
  ],
  
  // 并行执行策略
  strategy: {
    maxParallel: 2,
    failFast: false
  }
});

// 执行工作流
const result = await devWorkflow.execute({
  requirements: '实现用户认证功能'
});
```

### Agent 间通信

```javascript
// 方式 1: 通过共享上下文
const context = new SharedContext();

const agentA = new Agent({ role: 'architect', context });
const agentB = new Agent({ role: 'developer', context });

await agentA.execute('design-system');
await agentB.execute('implement-system'); // 自动读取 architect 的设计

// 方式 2: 显式消息传递
const agentA = new Agent({ role: 'backend-dev' });
const agentB = new Agent({ role: 'frontend-dev' });

agentA.on('api-ready', async (data) => {
  await agentB.execute('implement-ui', { apiSpec: data.spec });
});

await agentA.execute('design-api');
```

---

## 高级用法

### 自定义 Skill 实现

```javascript
import { CompositeSkill } from 'skills4coder';

const customSkill = new CompositeSkill({
  id: 'my-custom-skill',
  name: 'Custom Skill',
  
  async execute(context, inputs) {
    // 1. 调用原子技能
    const fileContent = await context.atomic('read-file', { 
      path: inputs.filePath 
    });
    
    // 2. LLM 处理
    const analysis = await context.llm.complete({
      prompt: `Analyze: ${fileContent}`,
      system: context.role.systemPrompt
    });
    
    // 3. 调用外部 API
    const result = await context.api.call('validation-service', {
      content: analysis
    });
    
    return result;
  }
});

agent.addSkill(customSkill);
```

### 动态 Role 切换

```javascript
const agent = new Agent({
  roles: ['backend-dev', 'frontend-dev', 'devops'],
  defaultRole: 'backend-dev'
});

// 自动根据任务切换 Role
await agent.execute('design-database');     // 使用 backend-dev
await agent.execute('setup-cicd');          // 自动切换到 devops
await agent.execute('implement-component'); // 自动切换到 frontend-dev
```

### 记忆和上下文

```javascript
const agent = new Agent({
  role: 'senior-dev',
  memory: {
    type: 'persistent',  // 持久化存储
    store: 'redis',      // 存储后端
    ttl: '7d'           // 记忆保留时间
  }
});

// 第一次对话
await agent.chat('我们项目使用什么技术栈？');
// Agent: 根据记忆，项目使用 React + Node.js...

// 后续对话（自动携带上下文）
await agent.chat('帮我生成一个组件');
// Agent: 好的，使用 React + TypeScript 生成组件...
```

---

## 调试与监控

### 调试模式

```javascript
const agent = new Agent({
  role: 'developer',
  debug: true,  // 开启调试
  logLevel: 'verbose'
});

// 输出详细信息：
// - 每个 Skill 的调用参数
// - LLM Prompt 和 Completion
// - 执行时间和 Token 消耗
// - 错误堆栈
```

### 执行追踪

```javascript
import { Tracer } from 'skills4coder';

const tracer = new Tracer();

const agent = new Agent({
  role: 'developer',
  tracer
});

await agent.execute('complex-task');

// 生成执行报告
const report = tracer.generateReport();
console.log(report.timeline);
console.log(report.tokenUsage);
console.log(report.skillCalls);
```

### 性能监控

```javascript
import { Metrics } from 'skills4coder';

const metrics = new Metrics();

const agent = new Agent({
  role: 'developer',
  metrics
});

// 自动收集指标：
// - 响应时间
// - Token 消耗
// - Skill 调用次数
// - 错误率

// 导出到 Prometheus/Grafana
metrics.export('prometheus', { port: 9090 });
```

---

## 最佳实践

### 1. Role 设计原则

- **单一职责**: 一个 Role 专注于一个领域
- **能力边界清晰**: 明确列出能做什么、不能做什么
- **可验证**: 包含评估标准

### 2. Skill 粒度控制

- **原子技能**: 只做一件事，做好一件事
- **复合技能**: 组合 3-5 个原子技能为宜
- **避免过深嵌套**: 最多 3 层 Skill 调用

### 3. 错误处理

```javascript
const result = await agent.execute('risky-task', {
  fallback: 'alternative-skill',
  retry: 3,
  timeout: '30s'
});
```

### 4. 安全性

```javascript
const agent = new Agent({
  role: 'developer',
  sandbox: true,  // 沙箱模式
  allowedOperations: ['read', 'write'],  // 白名单
  blockedPaths: ['/etc', '/usr']  // 黑名单
});
```

---

## 示例代码

### 示例 1: 代码审查 Agent

```javascript
import { Agent } from 'skills4coder';

const reviewer = new Agent({
  role: 'senior-code-reviewer',
  llm: 'gpt-4'
});

const prReview = await reviewer.execute('review-pr', {
  repo: 'my-org/my-repo',
  prNumber: 123,
  focus: ['security', 'performance', 'maintainability']
});

console.log(prReview.summary);
console.log(prReview.comments);
console.log(prReview.approval);
```

### 示例 2: 自动化文档生成

```javascript
const techWriter = new Agent({
  role: 'technical-writer'
});

const docs = await techWriter.execute('generate-docs', {
  sourceCode: './src',
  outputFormat: 'markdown',
  sections: ['api', 'examples', 'faq']
});

await docs.save('./docs/generated/');
```

### 示例 3: 故障诊断团队

```javascript
const incidentTeam = new Team({
  members: [
    { role: 'sre-engineer', lead: true },
    { role: 'backend-dev' },
    { role: 'dba', condition: (ctx) => ctx.includes('database') }
  ]
});

const diagnosis = await incidentTeam.diagnose({
  alert: 'High latency on /api/users',
  logs: '/var/log/app.log',
  metrics: 'prometheus-query'
});
```

---

## 参考资源

- [Role Schema](./schema/role-v1.json)
- [Skill Schema](./schema/skill-v1.json)
- [Atomic Skill Schema](./schema/atomic-skill-v1.json)
- [示例集](./examples/)

---

**开始构建你的专业 Agent 团队！** 🚀

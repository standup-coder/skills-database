# Skills Database

> **高质量岗位技能知识库，Agent 专业分工协作**

Skills Database 首先是一份**可机器消费的岗位技能知识资产**——
**23 个角色 × 42 个复合技能 × 145 个原子技能（116 个高价值原子已完成学习字段升级）**，全部由 JSON Schema 严格约束，中英双语描述。
配套的 Agent 编排 SDK 与 LLM 辅助扩充工具，是知识库的下游消费方。

```
知识库（核心）   →   schema 校验 / 成熟度报表   →   编排 SDK / LLM 辅助扩充（辅助）
```

## 🌐 Languages
- [English](README.md) | [中文](README_zh.md)

## 知识库一览（实测）

| 资产 | 数量 | 成熟度 | 校验命令 |
|------|------|--------|----------|
| 岗位（roles/） | 23 | 99/100 | `npm run validate-roles` |
| 复合技能（skills/） | 42 | 96/100 | `npm run validate-skills` |
| 原子技能（atomic-skills/） | 145 | 98/100† | `npm run validate-skills` |
| **整体** | **210** | **97/100** | — |

> 量化口径：必填合规 50% + 丰富度 40%（双语/tags/input/output/constraints/errors）+ learning 字段 10% 加分。详见 [docs/contribute/knowledge-base.md](./docs/contribute/knowledge-base.md)。
>
> † 其中 27 个高价值原子技能已示范级填充（8 个架构与测试基本盘 + 15 个 2026-05 新增的 LLM 链路与韧性/可观测/测试细分 + 4 个 2026-06 新增的 Agentic 技能），含双语、完整 schema、constraints、errors 与丰富的 `learning` 节（keyPoints / bestPractices / antiPatterns / resources / maturityLevels），可作贡献参考；剩余为骨架条目，可查 [KNOWLEDGE_GAPS.json](./documentation/KNOWLEDGE_GAPS.json) 按优先级补全。
>
> ✅ **2026-06 第五轮质量提升**：岗位 22→23（+1 AI Agent Engineer 2026 新兴岗位）；原子 141→145（+4 Agentic 技能：mcp-server-development / agent-evaluation / prompt-engineering-advanced / rag-pipeline-design）。
>
> ✅ **2026-05 第四轮质量提升**：岗位 16→22（+6 P0 缺口岗位：AI/ML、Platform、Engineering Manager、Fullstack、Data Scientist、Technical Writer）；复合 28→42（+14 零复合岗位与横向治理）；原子 126→141（+15 LLM/韧性/可观测）。详见 [COVERAGE_GAP_REPORT.md](./documentation/COVERAGE_GAP_REPORT.md) 与 [REASSESSMENT_FIX_LOG.md](./documentation/REASSESSMENT_FIX_LOG.md)。

## 快速消费知识资产

```bash
# 1. 校验完整性与质量
npm run validate-roles
npm run validate-skills            # 人类可读
npm run validate-skills -- --json  # CI 友好

# 2. 直接读取 JSON 资产
cat roles/senior-frontend-dev.json
cat skills/code-review.json
cat atomic-skills/read-file.json

# 3. 通过 SDK 加载（参考实现）
import { Role } from 'skills-database';
const role = Role.fromJSON('./roles/senior-frontend-dev.json');
```

---

## 核心理念

### 传统方式 vs Skills Database

| 传统方式 | Skills Database |
|---------|-------------|
| 单一的 AI 助手做所有事情 | 多个专业 Agent 分工协作 |
| 技能内嵌在 Prompt 中 | 技能外置，可组合复用 |
| 岗位边界模糊 | 岗位 = JD = Skills 集合 |
| 难以评估能力 | 原子技能可验证、可追踪 |

### 三层架构

```
┌─────────────────────────────────────────────────────┐
│                    Role (岗位)                        │
│  JD = 主 Skills 集合                                  │
│  例：Senior Frontend Developer                        │
│      = 架构设计 + 代码审查 + 性能优化                   │
└──────────────────┬──────────────────────────────────┘
                   │ 组合调用
                   ▼
┌─────────────────────────────────────────────────────┐
│              Composite Skills (复合技能)              │
│  可复用的专业能力模块                                  │
│  例：Code Review = 读文件 → 分析 → 写评论              │
└──────────────────┬──────────────────────────────────┘
                   │ 编排调用
                   ▼
┌─────────────────────────────────────────────────────┐
│              Atomic Skills (原子技能)                 │
│  最基础的操作能力，不可再分                            │
│  例：read_file, write_code, run_test                  │
└─────────────────────────────────────────────────────┘
```

---

## 架构说明

### 1. Role (岗位定义)

**Role = JD = 主 Skills 集合**

每个 Role 对应一个传统岗位，包含：
- **JD 描述**: 岗位职责和要求的自然语言描述
- **主 Skills**: 该岗位需要掌握的复合技能
- **原子 Skills**: 基础操作能力
- **Parameters**: 技术栈、经验要求等参数

```json
{
  "id": "senior-frontend-dev",
  "type": "role",
  "name": "Senior Frontend Developer",
  "jd": "负责前端架构设计，代码审查，性能优化，指导初中级开发者",
  "mainSkills": ["architecture-design", "code-review", "performance-optimization"],
  "atomicSkills": ["read-file", "write-code", "run-linter", "git-commit"],
  "parameters": {
    "techStack": ["React", "TypeScript", "Next.js"],
    "experience": "5+ years",
    "teamSize": "3-5 developers"
  }
}
```

### 2. Composite Skills (复合技能)

**分 Skills = 可组合的复合能力**

复合技能是完成特定任务的能力模块，可以：
- 调用多个原子技能
- 被多个 Role 复用
- 嵌套调用其他复合技能

```json
{
  "id": "code-review",
  "type": "composite-skill",
  "name": "Code Review",
  "description": "全面审查代码质量、安全性、性能",
  "atomicSkills": ["read-file", "analyze-code", "write-comment"],
  "workflow": {
    "steps": [
      { "skill": "read-file", "input": "{{filePath}}" },
      { "skill": "analyze-code", "input": "{{fileContent}}", "config": { "depth": "deep" } },
      { "skill": "write-comment", "input": "{{analysis}}" }
    ]
  },
  "output": {
    "format": "markdown",
    "sections": ["issues", "suggestions", "score"]
  }
}
```

### 3. Atomic Skills (原子技能)

**原子技能 = 最基础的能力单元**

原子技能是不可再分的基础操作，直接映射到：
- MCP Tools
- API 调用
- 本地命令执行
- 文件系统操作

```json
{
  "id": "read-file",
  "type": "atomic-skill",
  "name": "Read File",
  "description": "读取文件内容",
  "input": { 
    "path": { "type": "string", "required": true },
    "encoding": { "type": "string", "default": "utf-8" }
  },
  "output": { 
    "content": "string",
    "size": "number"
  },
  "implementation": {
    "type": "mcp-tool",
    "server": "filesystem",
    "tool": "read_file"
  }
}
```

---

## 使用场景

### 场景 1: 单 Agent 执行专业任务

**需求**: 需要一个专业的前端开发者 Agent 来审查 PR

```javascript
import { Agent, Role } from 'skills-database';

// 加载角色定义
const role = Role.fromJSON('./roles/senior-frontend-dev.json');

// 创建专业 Agent
const agent = new Agent({
  name: 'FrontendReviewer',
  role,
  llm: 'gpt-4'
});

// 执行专业技能
const result = await agent.use('code-review', {
  filePath: 'src/components/Button.tsx'
});

console.log(result);
```

### 场景 2: 多 Agent 协作完成项目

**需求**: 开发一个新功能，需要前后端协作

```javascript
import { Team, Role, Workflow } from 'skills-database';

// 加载角色
const pmRole = Role.fromJSON('./roles/product-manager.json');
const beRole = Role.fromJSON('./roles/backend-architect.json');
const feRole = Role.fromJSON('./roles/senior-frontend-dev.json');
const qaRole = Role.fromJSON('./roles/qa-automation.json');

// 创建团队
const team = new Team({
  name: 'Feature Development Team',
  members: [
    { role: pmRole, name: 'PM', lead: true },
    { role: beRole, name: 'Backend' },
    { role: feRole, name: 'Frontend' },
    { role: qaRole, name: 'QA' }
  ]
});

// 定义工作流
const workflow = new Workflow({
  name: 'User Authentication Feature',
  description: '实现用户认证功能',
  steps: [
    { id: 'prd', name: 'Write PRD', agent: 'PM', skill: 'write-prd', input: {} },
    { id: 'api', name: 'Design API', agent: 'Backend', skill: 'api-design', input: {}, dependsOn: ['prd'] },
    { id: 'ui', name: 'Implement UI', agent: 'Frontend', skill: 'implement-ui', input: {}, dependsOn: ['api'] },
    { id: 'test', name: 'Write Tests', agent: 'QA', skill: 'write-e2e-tests', input: {}, dependsOn: ['api', 'ui'] }
  ],
  strategy: { failFast: false }
});

// 执行工作流
const result = await team.executeWorkflow(workflow);
console.log(`Completed ${result.completedSteps}/${result.totalSteps} steps`);
```

### 场景 3: Agent 动态调用不同岗位

**需求**: 系统出现异常，需要多领域专家诊断

```javascript
import { Team, Role } from 'skills-database';

const sreRole = Role.fromJSON('./roles/sre-engineer.json');
const dbaRole = Role.fromJSON('./roles/dba.json');
const feRole = Role.fromJSON('./roles/senior-frontend-dev.json');

const team = new Team({
  name: 'Incident Response Team',
  members: [
    { role: sreRole, name: 'sre-engineer', lead: true },
    { role: dbaRole, name: 'dba' },
    { role: feRole, name: 'senior-frontend-dev' }
  ]
});

// SRE 先诊断
const sreReport = await team.callAgent('sre-engineer', 'diagnose', {
  logs: context.logs,
  metrics: context.metrics
});

// 根据诊断结果调用不同专家
if (sreReport.category === 'database') {
  await team.callAgent('dba', 'optimize-query', sreReport);
} else if (sreReport.category === 'frontend') {
  await team.callAgent('senior-frontend-dev', 'fix-performance', sreReport);
}
```

---

## 快速开始

### 安装

```bash
npm install skills-database
# or
yarn add skills-database
```

### 定义一个 Role

```javascript
import { Role } from 'skills-database';

const backendDev = Role.fromObject({
  id: 'backend-developer',
  type: 'role',
  version: '1.0.0',
  metadata: {
    name: 'Backend Developer',
    description: '负责 API 开发、数据库设计、服务维护',
    author: 'you',
    tags: ['backend'],
    level: 'senior'
  },
  jd: {
    summary: '设计和实现高可用后端服务',
    responsibilities: ['API 开发', '数据库设计', '代码审查'],
    requirements: { experience: '5+ years' }
  },
  capabilities: {
    mainSkills: ['api-design', 'database-design', 'code-review'],
    atomicSkills: ['read-file', 'write-code', 'run-tests']
  }
});
```

### 创建一个 Agent

```javascript
import { Agent } from 'skills-database';

const agent = new Agent({
  role: backendDev,
  llm: 'gpt-4',  // 或其他 LLM
  tools: ['mcp-filesystem', 'mcp-git']
});

// 执行复合技能
const result = await agent.use('api-design', {
  requirements: '用户认证 API，支持 JWT',
  techStack: ['Node.js', 'Express']
});

console.log(result.openapi_spec);
```

### 查看示例

```bash
# 单 Agent 任务示例
cd examples/single-agent-task
node code-review-example.js

# 多 Agent 协作示例
cd examples/multi-agent-project
node feature-development.js
```

---

## 项目结构

根目录以**语料库为主**，所有代码（SDK + Web 栈）统一收拢在 `app/`，编译产物 `dist/` 留根供 npm 发布消费。

```
skills-database/
├── roles/                       # 语料库 · 岗位定义 (JD)
├── skills/                      # 语料库 · 复合技能
├── atomic-skills/               # 语料库 · 原子技能
├── schema/                      # 语料库 · JSON Schema 约束
├── skill-lists/                 # 语料库 · 岗位能力清单
├── data/                        # 语料派生数据 (seed-data, SQLite, enriched)
├── dist/                        # 编译产物 (npm 发布入口，留根)
├── scripts/                     # 语料校验/扩充工具
├── docs/                        # VitePress 文档站
├── examples/                    # 使用示例
├── app/                         # 代码入口（SDK + Web）
│   ├── src/                     #   SDK 核心库 (Agent/Role/Team/Workflow)
│   ├── orchestration/           #   编排运行时 (agent-runtime / mcp-server / skillhub-adapter)
│   ├── server/                  #   Web API (Express + SQLite)
│   ├── webui/                   #   Web UI (静态页)
│   ├── skills-cli.ts            #   能力追踪 CLI
│   └── start.sh                 #   Web 服务启停脚本
├── package.json
└── tsconfig.json
```

---

## 核心优势

### 1. 专业化分工
- 每个 Agent 都有明确的岗位定义
- 不同 Agent 擅长不同领域
- 避免"万金油" AI 的局限性

### 2. 可复用组合
- Skills 可以在不同 Role 间复用
- 复合技能可以嵌套组合
- 原子技能标准化，易于扩展

### 3. 可验证评估
- 原子技能可单独测试验证
- Agent 能力可量化评估
- 支持技能认证和徽章系统

### 4. 生态整合
- 支持 MCP 协议，无缝接入各类工具
- 兼容 SkillHub、Claw Hub 等技能市场
- 支持自定义技能实现

---

## 生态集成

### MCP (Model Context Protocol)

Skills Database 原生支持 MCP，可以直接调用：
- Filesystem Server - 文件操作
- Git Server - 版本控制
- Database Server - 数据库查询
- Custom Servers - 自定义工具

### SkillHub / Claw Hub

可以加载和查询项目中的技能定义：
```javascript
import { SkillHubAdapter } from 'skills-database/orchestration/skillhub-adapter';

const adapter = new SkillHubAdapter();
adapter.initialize();

// 查询所有技能
const allSkills = adapter.getAllSkills();
console.log(`Loaded ${allSkills.length} skills`);

// 按角色获取可用技能
const roleSkills = adapter.getRoleSkills('senior-frontend-dev');

// 检查角色技能缺失
const { resolved, missing } = adapter.resolveRoleSkills('senior-frontend-dev');
```

---

## 贡献指南

我们欢迎各种形式的贡献：

- **新增 Role**: 提交你所在岗位的定义
- **新增 Skill**: 分享可复用的能力模块
- **改进文档**: 帮助完善使用指南
- **提交 Issue**: 报告问题或建议

详见 [AGENTS.md](./AGENTS.md) 和 [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 路线图

- [x] 核心架构设计
- [x] Role/Skill/Atomic Skill 定义
- [ ] Agent 运行时 v1.0
- [ ] Visual Skill Builder
- [ ] Skill Marketplace
- [ ] Multi-Agent Orchestration
- [ ] Performance Benchmarks

---

## License

MIT License © 2026 Skills Database Contributors

---

**让 AI Agent 像专业团队一样工作** 🤖👥

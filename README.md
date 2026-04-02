# Skills4Coder

> **岗位即 Skills 集合，Agent 专业分工协作**

一个面向 AI Agent 时代的技能编排框架。将传统岗位（JD）拆解为可组合、可复用的技能单元，让 AI Agent 能够像专业团队一样协作完成复杂任务。

## 🌐 Languages
- [English](README.md) | [中文](README_zh.md)

---

## 核心理念

### 传统方式 vs Skills4Coder

| 传统方式 | Skills4Coder |
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
// 创建专业 Agent
const frontendDev = new Agent({
  role: 'senior-frontend-dev',
  context: {
    project: 'my-react-app',
    techStack: ['React', 'TypeScript']
  }
});

// 执行专业任务
await frontendDev.execute('code-review', {
  filePath: 'src/components/Button.tsx'
});
```

### 场景 2: 多 Agent 协作完成项目

**需求**: 开发一个新功能，需要前后端协作

```javascript
// 定义协作流程
const project = new Project({
  name: 'User Authentication Feature',
  workflow: [
    { 
      agent: { role: 'product-manager' },
      task: 'write-prd',
      output: 'PRD.md'
    },
    {
      agent: { role: 'backend-architect' },
      task: 'design-api',
      input: 'PRD.md',
      output: 'api-spec.yaml'
    },
    {
      agent: { role: 'senior-frontend-dev' },
      task: 'implement-ui',
      input: ['PRD.md', 'api-spec.yaml'],
      output: 'frontend-code/'
    },
    {
      agent: { role: 'qa-automation' },
      task: 'write-e2e-tests',
      input: ['PRD.md', 'api-spec.yaml'],
      output: 'e2e-tests/'
    }
  ]
});

// 执行项目
await project.run();
```

### 场景 3: Agent 动态调用不同岗位

**需求**: 系统出现异常，需要多领域专家诊断

```javascript
const incidentResponse = new Workflow({
  name: 'Production Incident Response',
  steps: async (context) => {
    // SRE 先进行初步诊断
    const sreReport = await context.callAgent('sre-engineer', 'diagnose', {
      logs: context.logs,
      metrics: context.metrics
    });
    
    // 根据诊断结果调用不同专家
    if (sreReport.category === 'database') {
      return await context.callAgent('dba', 'optimize-query', sreReport);
    } else if (sreReport.category === 'frontend') {
      return await context.callAgent('senior-frontend-dev', 'fix-performance', sreReport);
    }
  }
});
```

---

## 快速开始

### 安装

```bash
npm install skills4coder
# or
yarn add skills4coder
```

### 定义一个 Role

```javascript
import { Role } from 'skills4coder';

const backendDev = new Role({
  id: 'backend-developer',
  name: 'Backend Developer',
  jd: '负责 API 开发、数据库设计、服务维护',
  mainSkills: ['api-design', 'database-design', 'code-review'],
  atomicSkills: ['read-file', 'write-code', 'run-tests', 'git-operations']
});
```

### 创建一个 Agent

```javascript
import { Agent } from 'skills4coder';

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

```
skills4coder/
├── README.md                    # 本文件
├── AGENTS.md                    # Agent 开发完整指南
├── roles/                       # 岗位定义 (JD)
│   ├── senior-frontend-dev.json
│   ├── backend-architect.json
│   └── qa-automation.json
├── skills/                      # 复合技能
│   ├── code-review.json
│   ├── api-design.json
│   └── database-design.json
├── atomic-skills/               # 原子技能
│   ├── read-file.json
│   ├── write-code.json
│   └── run-tests.json
├── orchestration/               # 编排运行时
│   ├── agent-runtime/           # Agent 执行引擎
│   ├── mcp-server/              # MCP 协议支持
│   └── skillhub-adapter/        # SkillHub 适配器
└── examples/                    # 使用示例
    ├── single-agent-task/
    └── multi-agent-project/
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

Skills4Coder 原生支持 MCP，可以直接调用：
- Filesystem Server - 文件操作
- Git Server - 版本控制
- Database Server - 数据库查询
- Custom Servers - 自定义工具

### SkillHub / Claw Hub

可以直接导入和使用第三方技能：
```javascript
import { SkillHubAdapter } from 'skills4coder';

const adapter = new SkillHubAdapter({ apiKey: 'xxx' });
const externalSkill = await adapter.importSkill('tencent/code-review-v2');

agent.addSkill(externalSkill);
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

MIT License © 2026 Skills4Coder Contributors

---

**让 AI Agent 像专业团队一样工作** 🤖👥

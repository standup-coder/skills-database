# 核心概念

Skills4Coder 的核心理念是 **"岗位即 Skills 集合，Agent 专业分工协作"**。为了理解这个框架，你需要掌握以下几个核心概念。

## 概念概览

```
┌─────────────────────────────────────────────────────────────────┐
│                        三层架构模型                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │    Role     │────▶│  Composite  │────▶│   Atomic    │       │
│  │   (岗位)     │     │   Skills    │     │   Skills    │       │
│  │             │     │  (复合技能)  │     │  (原子技能)  │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│    JD 定义            可复用模块           基础操作             │
│    能力边界            编排执行            直接执行             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 核心概念

### 1. [Role (岗位)](./role-and-jd.md)

**Role = JD = 主 Skills 集合**

Role 定义了一个岗位的能力边界、职责范围和技能要求。它是 Agent 的"身份"和"专业领域"。

- **JD 描述**: 岗位职责和要求的自然语言描述
- **主 Skills**: 该岗位需要掌握的复合技能
- **原子 Skills**: 基础操作能力
- **Parameters**: 技术栈、经验要求等参数

[了解更多 →](./role-and-jd.md)

### 2. [Composite Skills (复合技能)](./skill-composition.md)

**分 Skills = 可组合的复合能力**

复合技能是完成特定任务的能力模块，可以调用多个原子技能，被多个 Role 复用，甚至可以嵌套调用其他复合技能。

- 调用多个原子技能
- 被多个 Role 复用
- 嵌套调用其他复合技能
- 定义工作流和执行逻辑

[了解更多 →](./skill-composition.md)

### 3. [Atomic Skills (原子技能)](./atomic-skills.md)

**原子技能 = 最基础的能力单元**

原子技能是不可再分的基础操作，直接映射到 MCP Tools、API 调用、本地命令执行或文件系统操作。

- MCP Tools 集成
- API 调用
- 本地命令执行
- 文件系统操作

[了解更多 →](./atomic-skills.md)

### 4. [Agent 架构](./agent-architecture.md)

**Agent = Role + LLM + Tools + Memory**

Agent 是执行具体任务的智能体，基于 Role 定义，结合大语言模型、工具和记忆系统，完成专业任务。

[了解更多 →](./agent-architecture.md)

### 5. [Multi-Agent 协作](./multi-agent.md)

**多 Agent 协作 = 团队 Workflow 编排**

多个专业 Agent 可以组成团队，通过工作流编排完成复杂项目，就像真实的团队协作一样。

[了解更多 →](./multi-agent.md)

## 快速对比

| 概念 | 层级 | 描述 | 示例 |
|------|------|------|------|
| **Role** | 应用层 | 岗位定义，确定 Agent 身份 | Senior Frontend Developer |
| **Composite Skill** | 编排层 | 复合能力，编排原子技能 | Code Review、API Design |
| **Atomic Skill** | 执行层 | 基础操作，直接执行 | read_file、write_code |

## 工作流程

```
1. 定义 Role (JD)
   └── 确定岗位职责和能力边界

2. 选择/创建 Skills
   └── 为主 Skills 定义工作流
   └── 组合原子技能实现功能

3. 创建 Agent
   └── 基于 Role 创建 Agent 实例
   └── 配置 LLM 和 Tools

4. 执行任务
   └── 调用 Skills 完成工作
   └── 追踪执行过程

5. (可选) Multi-Agent 协作
   └── 组建专业团队
   └── 编排工作流
   └── 完成复杂项目
```

## 下一步

- [快速开始 →](../getting-started/quickstart.md)
- [定义你的第一个 Role →](../guides/defining-roles.md)
- [查看示例 →](../examples/)

---
id: agent-orchestration-design
type: composite-skill
title: Agent Orchestration Design
nameZh: Agent 编排设计
domain: ai-ml
tags: agent, orchestration, tool-use, multi-agent, ai
catalogSource: internal
catalogFile: skills/agent-orchestration-design.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# Agent 编排设计

> 设计多 Agent 编排：角色拆解 → 工具注册 → 记忆与状态 → 控制流 → 评测与追踪

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: roles — 
  ↓
步骤 2: tools — 
  ↓
步骤 3: control — 
  ↓
步骤 4: memory — 
  ↓
步骤 5: eval-harness — 
  ↓
步骤 6: tracing — 
  ↓
[输出]
```

### 步骤 1: roles

执行对应 atomic skill

### 步骤 2: tools

执行对应 atomic skill

### 步骤 3: control

执行对应 atomic skill

### 步骤 4: memory

执行对应 atomic skill

### 步骤 5: eval-harness

执行对应 atomic skill

### 步骤 6: tracing

执行对应 atomic skill

## 输入参数

- `objective` (string, **必填**)
- `topology` (string, **必填**) 取值: single/supervisor/swarm/graph
- `availableTools` (array, 可选)
- `memoryStrategy` (string, 可选) 取值: none/scratchpad/summary/vector/hybrid

## 输出

- `agentRoles` (array, 可选)
- `toolRegistry` (object, 可选)
- `controlFlow` (object, 可选)
- `memoryDesign` (object, 可选)
- `evaluationHarness` (object, 可选)
- `tracingPlan` (object, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

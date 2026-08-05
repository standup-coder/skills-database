---
contentStatus: outline
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

- 需要完成「设计多 Agent 编排：角色拆解 → 工具注册 → 记忆与状态 → 控制流 → 评测与追踪」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（agent、orchestration、tool-use）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

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

**目标**：执行 roles，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（tools）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: tools

**目标**：执行 tools，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（roles）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（control）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: control

**目标**：执行 control，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（tools）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（memory）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: memory

**目标**：执行 memory，产出该环节的结构化结果供下一步消费。
**输入**：步骤 3（control）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 5（eval-harness）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 5: eval-harness

**目标**：执行 eval-harness，产出该环节的结构化结果供下一步消费。
**输入**：步骤 4（memory）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 6（tracing）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 6: tracing

**目标**：建立/执行观测（tracing），让结果状态可量化、异常可发现。
**输入**：步骤 5（eval-harness）的输出。
**输出**：可持续观测的指标/告警/日志视图，含基线值与异常判定阈值。作为工作流最终交付的一部分。
**失败处理**：指标缺失或噪声过大时先修观测本身，避免基于失真数据做后续判断。

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

---
contentStatus: outline
id: llm-app-development
type: composite-skill
title: LLM App Development
nameZh: LLM 应用开发
domain: ai-ml
tags: llm, rag, prompt-engineering, evaluation, guardrails
catalogSource: internal
catalogFile: skills/llm-app-development.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# LLM 应用开发

> 面向生产环境构建 LLM 应用：用例 → Prompt → RAG → 评测 → 安全护栏 → 上线

## 何时使用

- 需要完成「面向生产环境构建 LLM 应用：用例 → Prompt → RAG → 评测 → 安全护栏 → 上线」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（llm、rag、prompt-engineering）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: scope — 
  ↓
步骤 2: prompt — 
  ↓
步骤 3: rag — 
  ↓
步骤 4: eval — 
  ↓
步骤 5: guardrails — 
  ↓
步骤 6: deploy — 
  ↓
[输出]
```

### 步骤 1: scope

**目标**：对输入做结构化梳理（scope），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 2（prompt）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 2: prompt

**目标**：执行 prompt，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（scope）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（rag）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: rag

**目标**：执行 rag，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（prompt）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（eval）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: eval

**目标**：执行 eval，产出该环节的结构化结果供下一步消费。
**输入**：步骤 3（rag）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 5（guardrails）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 5: guardrails

**目标**：执行 guardrails，产出该环节的结构化结果供下一步消费。
**输入**：步骤 4（eval）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 6（deploy）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 6: deploy

**目标**：执行 deploy，产出该环节的结构化结果供下一步消费。
**输入**：步骤 5（guardrails）的输出。
**输出**：本步骤的结构化结果与关键中间数据。作为工作流最终交付的一部分。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

## 输入参数

- `useCase` (string, **必填**)
- `knowledgeSources` (array, 可选)
- `model` (string, **必填**)
- `qualityBar` (object, 可选)

## 输出

- `promptLibrary` (object, 可选)
- `ragIndex` (object, 可选)
- `evaluationReport` (object, 可选)
- `guardrailPolicy` (object, 可选)
- `deploymentPlan` (object, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

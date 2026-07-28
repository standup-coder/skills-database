---
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

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

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

执行对应 atomic skill

### 步骤 2: prompt

执行对应 atomic skill

### 步骤 3: rag

执行对应 atomic skill

### 步骤 4: eval

执行对应 atomic skill

### 步骤 5: guardrails

执行对应 atomic skill

### 步骤 6: deploy

执行对应 atomic skill

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

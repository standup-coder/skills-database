---
id: user-research-process
type: composite-skill
title: User Research Process
nameZh: 用户研究流程
domain: design
tags: user-research, ux, interview, survey, insight
catalogSource: internal
catalogFile: skills/user-research-process.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 用户研究流程

> 以决策为导向运作一次完整的用户研究：目标对齐 → 招募 → 访谈/问卷 → 编码分析 → 洞察输出

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: plan — 
  ↓
步骤 2: recruit — 
  ↓
步骤 3: fieldwork — 
  ↓
步骤 4: coding — 
  ↓
步骤 5: insight — 
  ↓
[输出]
```

### 步骤 1: plan

执行对应 atomic skill

### 步骤 2: recruit

执行对应 atomic skill

### 步骤 3: fieldwork

执行对应 atomic skill

### 步骤 4: coding

执行对应 atomic skill

### 步骤 5: insight

执行对应 atomic skill

## 输入参数

- `researchQuestion` (string, **必填**) — 驱动研究的核心问题
- `targetSegment` (object, 可选)
- `method` (string, **必填**) 取值: interview/survey/diary/usability-test/mixed
- `sampleSize` (integer, 可选)

## 输出

- `researchPlan` (object, 可选)
- `rawData` (array, 可选)
- `themes` (array, 可选)
- `insightReport` (string, 可选)
- `recommendations` (array, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

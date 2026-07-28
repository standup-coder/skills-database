---
id: churn-analysis
type: composite-skill
title: Churn Analysis
nameZh: 客户流失分析
domain: product
tags: churn, retention, cohort, customer-success, analytics
catalogSource: internal
catalogFile: skills/churn-analysis.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 客户流失分析

> 量化流失驱动因素并产出优先级化的留存动作计划：定义 → 队列 → 模型 → 干预 → 复盘

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: define — 
  ↓
步骤 2: cohort — 
  ↓
步骤 3: drivers — 
  ↓
步骤 4: intervention — 
  ↓
步骤 5: impact — 
  ↓
[输出]
```

### 步骤 1: define

执行对应 atomic skill

### 步骤 2: cohort

执行对应 atomic skill

### 步骤 3: drivers

执行对应 atomic skill

### 步骤 4: intervention

执行对应 atomic skill

### 步骤 5: impact

执行对应 atomic skill

## 输入参数

- `churnDefinition` (string, **必填**) — 流失业务定义（订阅取消/连续 30 天不活跃等）
- `lookbackDays` (integer, 可选)
- `segments` (array, 可选)

## 输出

- `churnRate` (object, 可选)
- `cohortMatrix` (object, 可选)
- `driverModel` (object, 可选)
- `interventionPlan` (array, 可选)
- `expectedImpact` (object, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

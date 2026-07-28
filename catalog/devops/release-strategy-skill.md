---
id: release-strategy
type: composite-skill
title: Release Strategy
nameZh: 发布策略
domain: devops
tags: release, progressive-delivery, feature-flag, canary, rollback
catalogSource: internal
catalogFile: skills/release-strategy.json
catalogAddedAt: 2026-07-26
errorHandling: stop
stepCount: 5
---

# 发布策略

> 以渐进式交付为核心设计发布策略：分级灰度 + 特性开关 + 自动回滚 + 可观测验证

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: tradeoff — 
  ↓
步骤 2: flags — 
  ↓
步骤 3: canary — 
  ↓
步骤 4: rollback — 
  ↓
步骤 5: verify — 
  ↓
[输出]
```

### 步骤 1: tradeoff

执行对应 atomic skill

### 步骤 2: flags

执行对应 atomic skill

### 步骤 3: canary

执行对应 atomic skill

### 步骤 4: rollback

执行对应 atomic skill

### 步骤 5: verify

执行对应 atomic skill

## 输入参数

- `releaseScope` (string, **必填**)
- `riskLevel` (string, **必填**) 取值: low/medium/high/critical
- `trafficSegments` (array, 可选)
- `rollbackBudgetMinutes` (integer, 可选)

## 输出

- `deliveryPlan` (object, 可选)
- `flagPlan` (object, 可选)
- `canaryStages` (array, 可选)
- `rollbackTriggers` (array, 可选)
- `verificationDashboard` (string, 可选)

## 错误处理
策略: `stop`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

---
id: customer-onboarding
type: composite-skill
title: Customer Onboarding
nameZh: 客户上手流程
domain: product
tags: customer-success, onboarding, ttv, playbook, growth
catalogSource: internal
catalogFile: skills/customer-onboarding.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# 客户上手流程

> 围绕 Time-to-Value 设计并落地客户上手旅程：分段 → 旅程图 → 自动化 → 健康分 → 复盘

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: segment — 
  ↓
步骤 2: journey — 
  ↓
步骤 3: playbook — 
  ↓
步骤 4: automation — 
  ↓
步骤 5: health — 
  ↓
步骤 6: qbr — 
  ↓
[输出]
```

### 步骤 1: segment

执行对应 atomic skill

### 步骤 2: journey

执行对应 atomic skill

### 步骤 3: playbook

执行对应 atomic skill

### 步骤 4: automation

执行对应 atomic skill

### 步骤 5: health

执行对应 atomic skill

### 步骤 6: qbr

执行对应 atomic skill

## 输入参数

- `segment` (string, **必填**) 取值: self-serve/smb/mid-market/enterprise
- `ttvTargetDays` (integer, **必填**)
- `productSurface` (array, 可选)
- `successCriteria` (array, 可选)

## 输出

- `journeyMap` (object, 可选)
- `playbook` (string, 可选)
- `automationFlows` (array, 可选)
- `healthScoreModel` (object, 可选)
- `qbrTemplate` (string, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

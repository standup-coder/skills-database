---
id: data-quality-management
type: composite-skill
title: Data Quality Management
nameZh: 数据质量治理
domain: data
tags: data-quality, great-expectations, data-contract, data-sla, data
catalogSource: internal
catalogFile: skills/data-quality-management.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 数据质量治理

> 以剖析→预期→SLA→事件四步法持续治理数据质量，闭环故障与回放

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: profile — 
  ↓
步骤 2: expectations — 
  ↓
步骤 3: sla — 
  ↓
步骤 4: score — 
  ↓
步骤 5: runbook — 
  ↓
[输出]
```

### 步骤 1: profile

执行对应 atomic skill

### 步骤 2: expectations

执行对应 atomic skill

### 步骤 3: sla

执行对应 atomic skill

### 步骤 4: score

执行对应 atomic skill

### 步骤 5: runbook

执行对应 atomic skill

## 输入参数

- `dataset` (string, **必填**) — 目标数据集/表名
- `criticalColumns` (array, 可选)
- `slaTarget` (object, 可选) — freshness/completeness/accuracy SLA

## 输出

- `profile` (object, 可选)
- `expectations` (array, 可选)
- `qualityScore` (number, 可选)
- `incidentRunbook` (string, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

---
id: terraform-plan-review
type: composite-skill
title: Terraform Plan Review
nameZh: Terraform Plan 审查
domain: devops
tags: terraform, iac, security, cost, ops
catalogSource: internal
catalogFile: skills/terraform-plan-review.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 4
---

# Terraform Plan 审查

> 分析 Terraform Plan 的风险、成本影响与策略合规性

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: read-plan — 
  ↓
步骤 2: parse-plan — 
  ↓
步骤 3: llm-review — 
  ↓
步骤 4: format-output — 
  ↓
[输出]
```

### 步骤 1: read-plan

执行对应 atomic skill

### 步骤 2: parse-plan

执行对应 atomic skill

### 步骤 3: llm-review

执行对应 atomic skill

### 步骤 4: format-output

执行对应 atomic skill

## 输入参数

- `planFilePath` (string, **必填**) — terraform plan 输出文件路径（JSON 格式）
- `focus` (array, 可选) 默认: `["security","cost","compliance"]`

## 输出

- `riskScore` (number, 可选)
- `approval` (any, 可选) 取值: approved/comment/request-changes
- `issues` (array, 可选)
- **costImpact** (object):
  - `estimatedMonthly` (string, 可选)
  - `trend` (any, 可选) 取值: increase/decrease/neutral

## 错误处理
策略: `continue`
- fallback: `llm-review` → skip-partial-analysis

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

---
id: cloud-security
type: composite-skill
title: Cloud Security Assessment
nameZh: 云安全评估
domain: security
tags: cloud, security, iam, vpc, encryption
catalogSource: internal
catalogFile: skills/cloud-security.json
catalogAddedAt: 2026-07-26
stepCount: 3
---

# 云安全评估

> IAM、VPC、加密和云安全控制

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: scan-iam — 
  ↓
步骤 2: scan-network — 
  ↓
步骤 3: generate-report — 
  ↓
[输出]
```

### 步骤 1: scan-iam

执行对应 atomic skill

### 步骤 2: scan-network

执行对应 atomic skill

### 步骤 3: generate-report

执行对应 atomic skill

## 输入参数

_无明确 schema_

## 输出

_无明确 schema_



## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

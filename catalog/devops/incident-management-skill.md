---
id: incident-management
type: composite-skill
title: Incident Management
nameZh: 事件管理
domain: devops
tags: incident, response, runbook, on-call
catalogSource: internal
catalogFile: skills/incident-management.json
catalogAddedAt: 2026-07-26
stepCount: 3
---

# 事件管理

> 事件响应手册和云IR剧本

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: analyze-incident — 
  ↓
步骤 2: create-runbook — 
  ↓
步骤 3: setup-alerting — 
  ↓
[输出]
```

### 步骤 1: analyze-incident

执行对应 atomic skill

### 步骤 2: create-runbook

执行对应 atomic skill

### 步骤 3: setup-alerting

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

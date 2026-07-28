---
id: infrastructure-automation
type: composite-skill
title: Infrastructure Automation
nameZh: 基础设施自动化
domain: devops
tags: terraform, ansible, gitops, iac
catalogSource: internal
catalogFile: skills/infrastructure-automation.json
catalogAddedAt: 2026-07-26
stepCount: 3
---

# 基础设施自动化

> Terraform、Ansible和GitOps工作流

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: design-infra — 
  ↓
步骤 2: write-terraform — 
  ↓
步骤 3: write-ansible — 
  ↓
[输出]
```

### 步骤 1: design-infra

执行对应 atomic skill

### 步骤 2: write-terraform

执行对应 atomic skill

### 步骤 3: write-ansible

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

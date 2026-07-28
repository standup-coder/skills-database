---
id: container-orchestration
type: composite-skill
title: Container Orchestration
nameZh: 容器编排
domain: devops
tags: docker, kubernetes, k8s, containers
catalogSource: internal
catalogFile: skills/container-orchestration.json
catalogAddedAt: 2026-07-26
stepCount: 3
---

# 容器编排

> Docker和Kubernetes部署工作流

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: analyze-app — 
  ↓
步骤 2: create-dockerfile — 
  ↓
步骤 3: create-k8s-manifests — 
  ↓
[输出]
```

### 步骤 1: analyze-app

执行对应 atomic skill

### 步骤 2: create-dockerfile

执行对应 atomic skill

### 步骤 3: create-k8s-manifests

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

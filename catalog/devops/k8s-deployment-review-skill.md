---
id: k8s-deployment-review
type: composite-skill
title: Kubernetes Deployment Review
nameZh: K8s 部署审查
domain: devops
tags: kubernetes, security, review, ops
catalogSource: internal
catalogFile: skills/k8s-deployment-review.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# K8s 部署审查

> 审查 Kubernetes Deployment YAML 的配置正确性、安全性与最佳实践

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: read-manifest — 
  ↓
步骤 2: validate-manifest — 
  ↓
步骤 3: security-review — 
  ↓
步骤 4: best-practice-review — 
  ↓
步骤 5: format-output — 
  ↓
[输出]
```

### 步骤 1: read-manifest

执行对应 atomic skill

### 步骤 2: validate-manifest

执行对应 atomic skill

### 步骤 3: security-review

执行对应 atomic skill

### 步骤 4: best-practice-review

执行对应 atomic skill

### 步骤 5: format-output

执行对应 atomic skill

## 输入参数

- `manifestPath` (string, **必填**) — YAML 文件路径
- `focus` (array, 可选) 默认: `["security","best-practice"]`

## 输出

- `valid` (boolean, 可选)
- `score` (number, 可选)
- `issues` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `format-output` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

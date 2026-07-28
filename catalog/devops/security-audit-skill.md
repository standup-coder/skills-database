---
id: security-audit
type: composite-skill
title: Security Audit
nameZh: 安全审计
domain: devops
tags: security, audit, compliance, ops
catalogSource: internal
catalogFile: skills/security-audit.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 4
---

# 安全审计

> 对配置文件、代码和云资源进行安全扫描与合规检查

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: list-files — 
  ↓
步骤 2: scan-secrets — 
  ↓
步骤 3: llm-audit — 
  ↓
步骤 4: format-output — 
  ↓
[输出]
```

### 步骤 1: list-files

执行对应 atomic skill

### 步骤 2: scan-secrets

执行对应 atomic skill

### 步骤 3: llm-audit

执行对应 atomic skill

### 步骤 4: format-output

执行对应 atomic skill

## 输入参数

- `targetPath` (string, **必填**) — 审计目标路径
- `scope` (array, 可选) 默认: `["k8s","terraform","secrets"]`

## 输出

- `passed` (boolean, 可选)
- `score` (number, 可选)
- `findings` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-audit` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

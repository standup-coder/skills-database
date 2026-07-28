---
id: code-review
type: composite-skill
title: Code Review
nameZh: 代码审查
domain: backend
tags: review, quality, security
catalogSource: internal
catalogFile: skills/code-review.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# 代码审查

> 全面审查代码质量、安全性、性能和可维护性

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: read-file — 
  ↓
步骤 2: analyze-syntax — 
  ↓
步骤 3: check-security — 
  ↓
步骤 4: check-performance — 
  ↓
步骤 5: llm-review — 
  ↓
步骤 6: format-output — 
  ↓
[输出]
```

### 步骤 1: read-file

执行对应 atomic skill

### 步骤 2: analyze-syntax

执行对应 atomic skill

### 步骤 3: check-security

执行对应 atomic skill

### 步骤 4: check-performance

执行对应 atomic skill

### 步骤 5: llm-review

执行对应 atomic skill

### 步骤 6: format-output

执行对应 atomic skill

## 输入参数

- `filePath` (string, **必填**) — 要审查的文件路径
- `fileContent` (string, 可选) — 文件内容（如未提供则自动读取）
- **context** (object):
  - `relatedFiles` (array, 可选)
  - `prDescription` (string, 可选)
  - `techStack` (array, 可选)
- `focus` (array, 可选) 默认: `["all"]`

## 输出

- `summary` (string, 可选)
- `score` (number, 可选)
- `issues` (array, 可选)
- `suggestions` (array, 可选)
- `approval` (any, 可选) 取值: approved/comment/request-changes

## 错误处理
策略: `continue`
- fallback: `llm-review` → skip-partial-analysis

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

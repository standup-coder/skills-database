---
id: ci-pipeline-setup
type: composite-skill
title: CI Pipeline Setup
nameZh: CI 流水线搭建
domain: devops
tags: cicd, github-actions, automation, ops
catalogSource: internal
catalogFile: skills/ci-pipeline-setup.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 3
---

# CI 流水线搭建

> 为项目生成 GitHub Actions 等 CI/CD 流水线配置

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: inspect-project — 
  ↓
步骤 2: generate-workflow — 
  ↓
步骤 3: format-output — 
  ↓
[输出]
```

### 步骤 1: inspect-project

执行对应 atomic skill

### 步骤 2: generate-workflow

执行对应 atomic skill

### 步骤 3: format-output

执行对应 atomic skill

## 输入参数

- `projectPath` (string, **必填**) — 项目根目录路径
- `techStack` (array, 可选) — 技术栈，如 ["nodejs", "docker"]
- `stages` (array, 可选) 默认: `["lint","test","build"]`

## 输出

- `workflowYaml` (string, 可选)
- `summary` (string, 可选)
- `filesToCreate` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `generate-workflow` → use-template

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

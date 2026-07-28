---
id: docker-container-management
type: composite-skill
title: Docker Container Management
nameZh: Docker 容器管理
domain: devops
tags: docker, container, ops
catalogSource: internal
catalogFile: skills/docker-container-management.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 4
---

# Docker 容器管理

> 管理 Docker 容器生命周期：查看状态、执行命令、收集日志

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: check-status — 
  ↓
步骤 2: exec-command — 
  ↓
步骤 3: fetch-logs — 
  ↓
步骤 4: format-output — 
  ↓
[输出]
```

### 步骤 1: check-status

执行对应 atomic skill

### 步骤 2: exec-command

执行对应 atomic skill

### 步骤 3: fetch-logs

执行对应 atomic skill

### 步骤 4: format-output

执行对应 atomic skill

## 输入参数

- `action` (string, **必填**) 取值: status/exec/logs — 操作类型
- `container` (string, **必填**) — 容器名称或 ID
- `command` (string, 可选) — exec 时执行的命令

## 输出

- `result` (string, 可选)
- `exitCode` (number, 可选)

## 错误处理
策略: `continue`
- fallback: `format-output` → return-raw

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

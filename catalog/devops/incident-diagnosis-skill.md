---
id: incident-diagnosis
type: composite-skill
title: Incident Diagnosis
nameZh: 故障诊断
domain: devops
tags: sre, incident, troubleshooting, ops
catalogSource: internal
catalogFile: skills/incident-diagnosis.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# 故障诊断

> 结合日志、指标和容器状态进行故障根因分析

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: health-check — 
  ↓
步骤 2: read-logs — 
  ↓
步骤 3: parse-logs — 
  ↓
步骤 4: container-status — 
  ↓
步骤 5: llm-diagnosis — 
  ↓
步骤 6: format-output — 
  ↓
[输出]
```

### 步骤 1: health-check

执行对应 atomic skill

### 步骤 2: read-logs

执行对应 atomic skill

### 步骤 3: parse-logs

执行对应 atomic skill

### 步骤 4: container-status

执行对应 atomic skill

### 步骤 5: llm-diagnosis

执行对应 atomic skill

### 步骤 6: format-output

执行对应 atomic skill

## 输入参数

- `serviceUrl` (string, 可选) — 服务 URL
- `logFilePath` (string, 可选) — 日志文件路径
- `containerName` (string, 可选) — 相关容器名称
- `symptom` (string, 可选) — 故障现象描述

## 输出

- `rootCause` (string, 可选)
- `confidence` (number, 可选)
- `evidence` (array, 可选)
- `remediation` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-diagnosis` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

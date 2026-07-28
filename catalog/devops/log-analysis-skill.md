---
id: log-analysis
type: composite-skill
title: Log Analysis
nameZh: 日志分析
domain: devops
tags: logging, analysis, troubleshooting, ops
catalogSource: internal
catalogFile: skills/log-analysis.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 4
---

# 日志分析

> 分析应用日志，定位异常模式并生成摘要报告

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: read-log — 
  ↓
步骤 2: parse-log — 
  ↓
步骤 3: llm-analysis — 
  ↓
步骤 4: format-output — 
  ↓
[输出]
```

### 步骤 1: read-log

执行对应 atomic skill

### 步骤 2: parse-log

执行对应 atomic skill

### 步骤 3: llm-analysis

执行对应 atomic skill

### 步骤 4: format-output

执行对应 atomic skill

## 输入参数

- `logFilePath` (string, **必填**) — 日志文件路径
- `logFormat` (string, 可选) 取值: json/nginx/apache/plain 默认: `"json"`
- `query` (string, **必填**) — 自然语言查询，如'找出5xx错误的原因'

## 输出

- `summary` (string, 可选)
- `anomalies` (array, 可选)
- `timeline` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-analysis` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

---
id: data-pipeline-build
type: composite-skill
title: Data Pipeline Build
nameZh: 数据管道构建
domain: data
tags: data-pipeline, etl, elt, lineage, data-engineering
catalogSource: internal
catalogFile: skills/data-pipeline-build.json
catalogAddedAt: 2026-07-26
errorHandling: stop
stepCount: 5
---

# 数据管道构建

> 以契约和血缘为核心搭建生产级数据管道：从源接入、转换、装载到调度、监控与回放

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: contracts — 
  ↓
步骤 2: etl-design — 
  ↓
步骤 3: dag — 
  ↓
步骤 4: lineage — 
  ↓
步骤 5: monitor — 
  ↓
[输出]
```

### 步骤 1: contracts

执行对应 atomic skill

### 步骤 2: etl-design

执行对应 atomic skill

### 步骤 3: dag

执行对应 atomic skill

### 步骤 4: lineage

执行对应 atomic skill

### 步骤 5: monitor

执行对应 atomic skill

## 输入参数

- `sources` (array, **必填**) — 源系统列表
- `sinks` (array, **必填**)
- `slaMinutes` (integer, 可选) — 端到端时延 SLA
- `engine` (string, 可选) 取值: airflow/dagster/prefect/spark/flink

## 输出

- `dagDefinition` (string, 可选)
- `schemaContracts` (array, 可选)
- `lineageGraph` (object, 可选)
- `monitoringDashboard` (string, 可选)

## 错误处理
策略: `stop`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

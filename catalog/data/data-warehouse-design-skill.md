---
id: data-warehouse-design
type: composite-skill
title: Data Warehouse Design
nameZh: 数据仓库建模
domain: data
tags: data-warehouse, dimensional-modeling, metrics-layer, kimball, data
catalogSource: internal
catalogFile: skills/data-warehouse-design.json
catalogAddedAt: 2026-07-26
errorHandling: stop
stepCount: 6
---

# 数据仓库建模

> 按 ODS/DWD/DWS/ADS 分层与维度建模理论设计数据仓库，并落地指标层与一致性维度

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: process-matrix — 
  ↓
步骤 2: grain — 
  ↓
步骤 3: dimensions — 
  ↓
步骤 4: facts — 
  ↓
步骤 5: metrics — 
  ↓
步骤 6: ddl — 
  ↓
[输出]
```

### 步骤 1: process-matrix

执行对应 atomic skill

### 步骤 2: grain

执行对应 atomic skill

### 步骤 3: dimensions

执行对应 atomic skill

### 步骤 4: facts

执行对应 atomic skill

### 步骤 5: metrics

执行对应 atomic skill

### 步骤 6: ddl

执行对应 atomic skill

## 输入参数

- `businessProcesses` (array, **必填**)
- `engine` (string, **必填**) 取值: snowflake/bigquery/redshift/doris/starrocks/hive
- `metricsCatalog` (array, 可选)

## 输出

- `layerModel` (object, 可选)
- `factTables` (array, 可选)
- `dimensionTables` (array, 可选)
- `metricsLayer` (object, 可选)
- `ddl` (string, 可选)

## 错误处理
策略: `stop`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

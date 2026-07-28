---
id: cross-platform-development
type: composite-skill
title: Cross-Platform Development
nameZh: 跨平台开发
domain: mobile
tags: cross-platform, react-native, flutter, kmm, mobile
catalogSource: internal
catalogFile: skills/cross-platform-development.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 跨平台开发

> 以共享核心层为目标设计跨平台应用：选型 → 架构分层 → 平台桥接 → 性能与一致性验证

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: tradeoff — 
  ↓
步骤 2: architecture — 
  ↓
步骤 3: bridging — 
  ↓
步骤 4: perf-budget — 
  ↓
步骤 5: consistency — 
  ↓
[输出]
```

### 步骤 1: tradeoff

执行对应 atomic skill

### 步骤 2: architecture

执行对应 atomic skill

### 步骤 3: bridging

执行对应 atomic skill

### 步骤 4: perf-budget

执行对应 atomic skill

### 步骤 5: consistency

执行对应 atomic skill

## 输入参数

- `framework` (string, **必填**) 取值: react-native/flutter/kmm/tauri/electron
- `platforms` (array, **必填**)
- `sharedLogicScope` (array, 可选) — 希望共享的业务领域

## 输出

- `architecture` (object, 可选)
- `bridgingPlan` (object, 可选)
- `performanceBudget` (object, 可选)
- `consistencyChecklist` (array, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

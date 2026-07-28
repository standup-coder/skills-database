---
id: mobile-release-pipeline
type: composite-skill
title: Mobile Release Pipeline
nameZh: 移动端发布流水线
domain: mobile
tags: mobile, ci-cd, fastlane, code-signing, release-train
catalogSource: internal
catalogFile: skills/mobile-release-pipeline.json
catalogAddedAt: 2026-07-26
errorHandling: stop
stepCount: 6
---

# 移动端发布流水线

> 覆盖移动端发布全流程：多渠道构建、签名、灰度、商店提交与回滚

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: build — 
  ↓
步骤 2: sign — 
  ↓
步骤 3: beta — 
  ↓
步骤 4: submit — 
  ↓
步骤 5: monitor — 
  ↓
步骤 6: rollback-plan — 
  ↓
[输出]
```

### 步骤 1: build

执行对应 atomic skill

### 步骤 2: sign

执行对应 atomic skill

### 步骤 3: beta

执行对应 atomic skill

### 步骤 4: submit

执行对应 atomic skill

### 步骤 5: monitor

执行对应 atomic skill

### 步骤 6: rollback-plan

执行对应 atomic skill

## 输入参数

- `platforms` (array, **必填**)
- `version` (string, **必填**)
- `rolloutStrategy` (string, 可选) 取值: full/staged/ab-test
- `betaChannel` (string, 可选) 取值: testflight/firebase-app-distribution/internal

## 输出

- `buildArtifacts` (array, 可选)
- `signingReport` (object, 可选)
- `submissionResult` (object, 可选)
- `rollbackPlan` (string, 可选)

## 错误处理
策略: `stop`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

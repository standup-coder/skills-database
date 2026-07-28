---
id: incident-postmortem
type: composite-skill
title: Incident Postmortem
nameZh: 事故复盘
domain: devops
tags: postmortem, incident, sre, blameless, reliability
catalogSource: internal
catalogFile: skills/incident-postmortem.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 事故复盘

> 以无指责为原则运作事故复盘：时间线 → 根因 → 教训 → 行动项 → 知识沉淀

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: timeline — 
  ↓
步骤 2: rca — 
  ↓
步骤 3: lessons — 
  ↓
步骤 4: actions — 
  ↓
步骤 5: doc — 
  ↓
[输出]
```

### 步骤 1: timeline

执行对应 atomic skill

### 步骤 2: rca

执行对应 atomic skill

### 步骤 3: lessons

执行对应 atomic skill

### 步骤 4: actions

执行对应 atomic skill

### 步骤 5: doc

执行对应 atomic skill

## 输入参数

- `incidentId` (string, **必填**)
- `severity` (string, **必填**) 取值: sev1/sev2/sev3/sev4
- `rawTimeline` (array, 可选)
- `impactedServices` (array, 可选)
- `userImpact` (string, 可选)

## 输出

- `timeline` (array, 可选)
- `rootCause` (string, 可选)
- `contributingFactors` (array, 可选)
- `lessonsLearned` (array, 可选)
- `actionItems` (array, 可选)
- `postmortemDoc` (string, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

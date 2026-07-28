---
id: content-marketing-campaign
type: composite-skill
title: Content Marketing Campaign
nameZh: 内容营销战役
domain: marketing
tags: content-marketing, seo, campaign, funnel, marketing
catalogSource: internal
catalogFile: skills/content-marketing-campaign.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 内容营销战役

> 围绕漏斗目标设计并执行多渠道内容战役：受众 → 主题群 → 日历 → 分发 → 复盘

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: narrative — 
  ↓
步骤 2: topics — 
  ↓
步骤 3: calendar — 
  ↓
步骤 4: distribution — 
  ↓
步骤 5: kpi — 
  ↓
[输出]
```

### 步骤 1: narrative

执行对应 atomic skill

### 步骤 2: topics

执行对应 atomic skill

### 步骤 3: calendar

执行对应 atomic skill

### 步骤 4: distribution

执行对应 atomic skill

### 步骤 5: kpi

执行对应 atomic skill

## 输入参数

- `goal` (string, **必填**) 取值: awareness/lead-gen/activation/retention
- `audience` (object, **必填**)
- `channels` (array, **必填**)
- `budgetUsd` (number, 可选)
- `durationWeeks` (integer, 可选)

## 输出

- `narrative` (string, 可选)
- `topicCluster` (object, 可选)
- `contentCalendar` (array, 可选)
- `distributionPlan` (object, 可选)
- `kpiDashboard` (object, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

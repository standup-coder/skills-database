---
id: design-system-build
type: composite-skill
title: Design System Build
nameZh: 设计系统构建
domain: design
tags: design-system, tokens, component-library, ui-ux, governance
catalogSource: internal
catalogFile: skills/design-system-build.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 设计系统构建

> 以 Design Token 为核心搭建可治理的设计系统：从基础变量、组件库到文档与版本治理

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: audit — 
  ↓
步骤 2: tokens — 
  ↓
步骤 3: components — 
  ↓
步骤 4: docs — 
  ↓
步骤 5: governance — 
  ↓
[输出]
```

### 步骤 1: audit

执行对应 atomic skill

### 步骤 2: tokens

执行对应 atomic skill

### 步骤 3: components

执行对应 atomic skill

### 步骤 4: docs

执行对应 atomic skill

### 步骤 5: governance

执行对应 atomic skill

## 输入参数

- `brandGuide` (object, **必填**) — 品牌视觉规范（颜色/字体/间距）
- `componentScope` (array, **必填**) — 首批组件清单
- `platforms` (array, 可选)
- `techStack` (string, 可选) 取值: react/vue/svelte/web-components

## 输出

- `tokens` (object, 可选) — Design Tokens（W3C DTCG 格式）
- `componentSpecs` (array, 可选)
- `documentation` (string, 可选) — Storybook / Docusaurus 站点
- `governanceModel` (object, 可选)

## 错误处理
策略: `continue`
- fallback: `governance` → skip-llm-step

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

---
id: monitoring-stack-setup
type: composite-skill
title: Monitoring Stack Setup
nameZh: 监控栈搭建
domain: devops
tags: prometheus, grafana, monitoring, observability, ops
catalogSource: internal
catalogFile: skills/monitoring-stack-setup.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 3
---

# 监控栈搭建

> 生成 Prometheus + Grafana 监控栈的 Docker Compose 配置与告警规则

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
步骤 2: generate-configs — 
  ↓
步骤 3: format-output — 
  ↓
[输出]
```

### 步骤 1: health-check

执行对应 atomic skill

### 步骤 2: generate-configs

执行对应 atomic skill

### 步骤 3: format-output

执行对应 atomic skill

## 输入参数

- `targets` (array, **必填**) — 要监控的服务地址列表
- `alertChannels` (array, 可选) 默认: `["email"]`
- `outputDir` (string, 可选) — 配置输出目录 默认: `"./monitoring"`

## 输出

- `composeYaml` (string, 可选)
- `prometheusConfig` (string, 可选)
- `alertRules` (string, 可选)
- `setupInstructions` (string, 可选)

## 错误处理
策略: `continue`
- fallback: `generate-configs` → use-default-template

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

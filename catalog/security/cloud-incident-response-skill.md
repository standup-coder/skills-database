---
id: cloud-incident-response
type: composite-skill
title: Cloud Incident Response
nameZh: 云安全事件响应
domain: security
tags: incident-response, cloud-security, forensics, containment
catalogSource: internal
catalogFile: skills/cloud-incident-response.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 云安全事件响应

> 云安全事件的检测、分析、遏制和修复，支持凭据泄露、数据外泄等场景

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: collect-evidence — 
  ↓
步骤 2: analyze-access-logs — 
  ↓
步骤 3: scan-credential-exposure — 
  ↓
步骤 4: llm-incident-analysis — 
  ↓
步骤 5: format-output — 
  ↓
[输出]
```

### 步骤 1: collect-evidence

执行对应 atomic skill

### 步骤 2: analyze-access-logs

执行对应 atomic skill

### 步骤 3: scan-credential-exposure

执行对应 atomic skill

### 步骤 4: llm-incident-analysis

执行对应 atomic skill

### 步骤 5: format-output

执行对应 atomic skill

## 输入参数

- `incidentType` (string, **必填**) 取值: credential-compromise/data-exfiltration/cryptojacking/misconfiguration-exposure/unauthorized-access/malware-container — 事件类型
- `cloudProvider` (string, **必填**) 取值: aws/azure/gcp/tencent-cloud 默认: `"aws"`
- `evidencePath` (string, 可选) — 证据文件路径（日志、配置快照等）
- `affectedResources` (array, 可选) — 受影响资源列表

## 输出

- `severity` (any, 可选) 取值: critical/high/medium/low
- `status` (any, 可选) 取值: detected/analyzing/contained/resolved
- `timeline` (array, 可选)
- `rootCause` (string, 可选)
- `affectedResources` (array, 可选)
- `containmentSteps` (array, 可选)
- `remediationPlan` (array, 可选)
- `lessonsLearned` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-incident-analysis` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

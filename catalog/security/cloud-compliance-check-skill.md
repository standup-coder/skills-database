---
id: cloud-compliance-check
type: composite-skill
title: Cloud Compliance Check
nameZh: 云合规检查
domain: security
tags: compliance, cis, soc2, gdpr, hipaa, pci-dss, cloud
catalogSource: internal
catalogFile: skills/cloud-compliance-check.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 云合规检查

> 对云资源配置进行合规框架检查（CIS、SOC2、GDPR、HIPAA、PCI-DSS）

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: list-resources — 
  ↓
步骤 2: scan-logging-config — 
  ↓
步骤 3: scan-encryption-config — 
  ↓
步骤 4: llm-compliance — 
  ↓
步骤 5: format-output — 
  ↓
[输出]
```

### 步骤 1: list-resources

执行对应 atomic skill

### 步骤 2: scan-logging-config

执行对应 atomic skill

### 步骤 3: scan-encryption-config

执行对应 atomic skill

### 步骤 4: llm-compliance

执行对应 atomic skill

### 步骤 5: format-output

执行对应 atomic skill

## 输入参数

- `targetPath` (string, **必填**) — 云资源配置路径
- `framework` (string, **必填**) 取值: CIS/SOC2/GDPR/HIPAA/PCI-DSS/ISO27001 — 合规框架
- `cloudProvider` (string, **必填**) 取值: aws/azure/gcp/tencent-cloud

## 输出

- `compliant` (boolean, 可选)
- `framework` (string, 可选)
- `totalControls` (number, 可选)
- `passedControls` (number, 可选)
- `failedControls` (number, 可选)
- `results` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-compliance` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

---
id: cloud-security-assessment
type: composite-skill
title: Cloud Security Assessment
nameZh: 云安全评估
domain: security
tags: cloud-security, assessment, cspm, compliance
catalogSource: internal
catalogFile: skills/cloud-security-assessment.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# 云安全评估

> 对云基础设施配置进行安全评估，识别错误配置、权限泄露和合规风险

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: list-cloud-configs — 
  ↓
步骤 2: scan-iam-risks — 
  ↓
步骤 3: scan-exposed-resources — 
  ↓
步骤 4: scan-unencrypted-data — 
  ↓
步骤 5: llm-assessment — 
  ↓
步骤 6: format-output — 
  ↓
[输出]
```

### 步骤 1: list-cloud-configs

执行对应 atomic skill

### 步骤 2: scan-iam-risks

执行对应 atomic skill

### 步骤 3: scan-exposed-resources

执行对应 atomic skill

### 步骤 4: scan-unencrypted-data

执行对应 atomic skill

### 步骤 5: llm-assessment

执行对应 atomic skill

### 步骤 6: format-output

执行对应 atomic skill

## 输入参数

- `targetPath` (string, **必填**) — 云资源配置目标路径（Terraform / CloudFormation / K8s manifests）
- `cloudProvider` (string, 可选) 取值: aws/azure/gcp/tencent-cloud/multi-cloud 默认: `"aws"`
- `frameworks` (array, 可选) 默认: `["CIS"]`

## 输出

- `passed` (boolean, 可选)
- `riskScore` (number, 可选)
- `findings` (array, 可选)
- **compliance** (object):
  - `framework` (string, 可选)
  - `totalChecks` (number, 可选)
  - `passedChecks` (number, 可选)
  - `failedChecks` (number, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-assessment` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

---
id: cloud-infrastructure-hardening
type: composite-skill
title: Cloud Infrastructure Hardening
nameZh: 云基础设施加固
domain: security
tags: cloud-security, hardening, vpc, cis, network
catalogSource: internal
catalogFile: skills/cloud-infrastructure-hardening.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 7
---

# 云基础设施加固

> 对云网络、计算、存储资源进行安全加固，消除错误配置和攻击面

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: list-infra-configs — 
  ↓
步骤 2: scan-network-exposure — 
  ↓
步骤 3: scan-unencrypted-resources — 
  ↓
步骤 4: scan-logging-gaps — 
  ↓
步骤 5: scan-compute-security — 
  ↓
步骤 6: llm-hardening — 
  ↓
步骤 7: format-output — 
  ↓
[输出]
```

### 步骤 1: list-infra-configs

执行对应 atomic skill

### 步骤 2: scan-network-exposure

执行对应 atomic skill

### 步骤 3: scan-unencrypted-resources

执行对应 atomic skill

### 步骤 4: scan-logging-gaps

执行对应 atomic skill

### 步骤 5: scan-compute-security

执行对应 atomic skill

### 步骤 6: llm-hardening

执行对应 atomic skill

### 步骤 7: format-output

执行对应 atomic skill

## 输入参数

- `targetPath` (string, **必填**) — 云基础设施配置路径（Terraform / CloudFormation / ARM / Pulumi）
- `cloudProvider` (string, 可选) 取值: aws/azure/gcp/tencent-cloud 默认: `"aws"`
- `hardeningProfile` (string, 可选) 取值: cis-benchmark/nist-800-53/soc2/custom — 加固基准 默认: `"cis-benchmark"`

## 输出

- `passed` (boolean, 可选)
- `hardeningScore` (number, 可选)
- `totalChecks` (number, 可选)
- `passedChecks` (number, 可选)
- `findings` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-hardening` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

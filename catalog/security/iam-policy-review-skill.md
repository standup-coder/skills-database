---
id: iam-policy-review
type: composite-skill
title: IAM Policy Review
nameZh: IAM 策略审查
domain: security
tags: iam, policy, least-privilege, rbac, cloud-security
catalogSource: internal
catalogFile: skills/iam-policy-review.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# IAM 策略审查

> 审查云 IAM 策略文件，识别过度授权、权限泄露和最小权限违规

## 何时使用

- 场景 1(根据 description 推导)
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
  ↓
步骤 1: list-iam-files — 
  ↓
步骤 2: read-iam-policies — 
  ↓
步骤 3: scan-wildcards — 
  ↓
步骤 4: scan-admin-access — 
  ↓
步骤 5: llm-review — 
  ↓
步骤 6: format-output — 
  ↓
[输出]
```

### 步骤 1: list-iam-files

执行对应 atomic skill

### 步骤 2: read-iam-policies

执行对应 atomic skill

### 步骤 3: scan-wildcards

执行对应 atomic skill

### 步骤 4: scan-admin-access

执行对应 atomic skill

### 步骤 5: llm-review

执行对应 atomic skill

### 步骤 6: format-output

执行对应 atomic skill

## 输入参数

- `targetPath` (string, **必填**) — IAM 策略文件路径（Terraform / JSON / YAML）
- `cloudProvider` (string, 可选) 取值: aws/azure/gcp/tencent-cloud 默认: `"aws"`
- `strictness` (string, 可选) 取值: strict/moderate/permissive — 审查严格度：strict=最小权限 / moderate=合理授权 / permissive=仅标记高风险 默认: `"moderate"`

## 输出

- `passed` (boolean, 可选)
- `totalPolicies` (number, 可选)
- `riskPolicies` (number, 可选)
- `findings` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-review` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_

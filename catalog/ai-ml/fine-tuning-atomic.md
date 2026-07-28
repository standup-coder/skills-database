---
id: fine-tuning
type: atomic-skill
title: Fine-Tuning
nameZh: 模型微调
domain: ai-ml
tags: llm, fine-tuning, sft, lora, dpo
catalogSource: internal
catalogFile: atomic-skills/fine-tuning.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# 模型微调
> 规划并执行 LLM 微调：SFT / LoRA / DPO；数据治理、训练与评估。
## 操作语义
- 类型: ai-llm
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `baseModel` (string, **必填**)
- `useCase` (string, **必填**)
- `datasetSize` (number, 可选)
- `budget` (object, 可选)
## 输出
- `method` (any, 可选) 取值: sft/lora/qlora/dpo/rlhf
- `datasetPlan` (object, 可选)
- `trainingConfig` (object, 可选)
- `evalPlan` (object, 可选)
## 核心要点

微调不是万灵药：先 prompt → 再 RAG → 最后才考虑微调，且微调的代价是通用能力损失。

## 关键要点

- 决策树：能用 prompt 解决就别 RAG，能用 RAG 解决就别微调
- SFT 学风格/格式效果最好，学知识效果差且会幻觉
- LoRA / QLoRA 用极少参数即可适配，性价比远高于全参 SFT
- DPO/RLHF 用于让模型符合偏好，需要成对样本（chosen/rejected）
- 数据质量 >> 数据数量：1k 高质量样本胜 100k 低质量
- 永远做留出集评估，警惕 catastrophic forgetting

## 最佳实践

- 微调前先把 prompt+RAG 打到极限，确认天花板
- 数据治理：去重、平衡、人工 review，按主题分桶
- 用 7B / 13B 小模型先验证方案，再放大到大模型
- 训练时同时评估专项任务与通用 benchmark（防忘）
- 用 Weights & Biases / MLflow 记录每次实验

## 反模式

- ❌ 为了让模型学新知识而微调，结果还是幻觉
- ❌ 数据没清洗就训练，把脏数据学进去
- ❌ 全参微调小数据集，过拟合 + 忘掉通用能力
- ❌ 不做留出集评估，靠训练 loss 判断质量
- ❌ 微调成本远高于直接调用大模型 API 也不算账

## 分级掌握

- **Junior**: 能用现成脚本对小模型做 SFT/LoRA 微调
- **Mid**: 能做数据治理、超参调优、留出集评估
- **Senior**: 能选择 SFT/DPO/RLHF 方案、平衡专项与通用能力、控制成本

## 参考资源

- [LoRA (Hu et al.)](https://arxiv.org/abs/2106.09685) — article
- [QLoRA (Dettmers et al.)](https://arxiv.org/abs/2305.14314) — article
- [DPO (Rafailov et al.)](https://arxiv.org/abs/2305.18290) — article
- [Hugging Face PEFT](https://github.com/huggingface/peft) — tool
- [Axolotl](https://github.com/OpenAccess-AI-Collective/axolotl) — tool

## 相关 Skills
_见所属 composite skill 或 role_
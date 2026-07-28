---
id: llm-evaluation
type: atomic-skill
title: LLM Evaluation
nameZh: LLM 评估
domain: ai-ml
tags: llm, evaluation, quality, regression
catalogSource: internal
catalogFile: atomic-skills/llm-evaluation.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# LLM 评估
> 为 LLM 应用建立离线与在线评估体系：评估集、指标、judge 模型、回归。
## 操作语义
- 类型: ai-llm
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `appType` (any, **必填**) 取值: chatbot/rag/agent/summarization/classification
- `qualityDimensions` (array, 可选)
- `datasetSize` (number, 可选)
## 输出
- `evalDataset` (object, 可选)
- `metrics` (array, 可选)
- `judgePrompt` (string, 可选)
- `ciIntegration` (object, 可选)
## 核心要点

没有评估就没有 LLM 工程：评估集是地基，指标是尺子，自动化回归是护栏。

## 关键要点

- 区分参考型指标（BLEU/ROUGE）与无参考型指标（faithfulness/groundedness）
- LLM-as-Judge 强大但有偏（位置偏好/啰嗦偏好/同模型偏好）
- RAG 专用指标：context-precision、context-recall、answer-faithfulness
- Agent 专用指标：task-success、tool-use-correctness、step-efficiency
- 评估集需覆盖正例、反例、对抗样本与边界场景
- 在线评估：影子流量 + 人工抽检 + 用户反馈闭环

## 最佳实践

- 评估集 ≥200 条，分桶覆盖关键意图，含 ground-truth 引用
- 用两个不同家族模型做 judge，避免同源偏好
- 把评估接入 CI：每次 prompt/模型变更触发回归
- 记录每次评估的 traces（input/output/cost），便于回溯
- 结合 A/B 实验，离线分数与在线指标双验证

## 反模式

- ❌ 只看主观体验，没有评估集
- ❌ 评估集与训练数据混淆，污染结果
- ❌ 用同一模型既做生成又做 judge
- ❌ 只看平均分，不看分桶与坏 case
- ❌ 上线前不跑回归，模型一升级就翻车

## 分级掌握

- **Junior**: 能用现成评估库跑 baseline 指标
- **Mid**: 能为业务自定义 judge prompt、维护评估集与 CI 集成
- **Senior**: 能设计离线 + 在线 + 人工抽检的多层评估体系并解决 judge 偏倚

## 参考资源

- [Ragas](https://github.com/explodinggradients/ragas) — tool
- [DeepEval](https://github.com/confident-ai/deepeval) — tool
- [TruLens](https://www.trulens.org/) — tool
- [LLM-as-Judge (Zheng et al.)](https://arxiv.org/abs/2306.05685) — article
- [Evaluating LLM Apps (Hamel Husain)](https://hamel.dev/blog/posts/evals/) — article

## 相关 Skills
_见所属 composite skill 或 role_
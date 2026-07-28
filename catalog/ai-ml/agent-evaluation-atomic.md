---
id: agent-evaluation
type: atomic-skill
title: Agent Evaluation
nameZh: Agent 评估
domain: ai-ml
tags: agent, evaluation, llm, reliability, benchmarking
catalogSource: internal
catalogFile: atomic-skills/agent-evaluation.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# Agent 评估
> 评估 LLM Agent 的可靠性、任务完成率、工具调用正确性、幻觉率与步骤效率。
## 操作语义
- 类型: ai-llm
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `agentConfig` (object, **必填**) — 被评估 Agent 的配置（模型/工具/提示）
- `taskSuite` (array, **必填**) — 评估任务集，含期望输出或验证函数
- `evalDimensions` (array, 可选) — 评估维度
- `baseline` (object, 可选) — 对比基线（旧版本/不同模型）
## 输出
- `scorecard` (object, 可选) — 各维度得分汇总
- `taskResults` (array, 可选)
- `failureAnalysis` (object, 可选) — 失败模式分类与根因
- `regressionReport` (object, 可选) — 与基线的对比差异
## 核心要点

Agent 评估比单轮 LLM 评估更难——轨迹长、工具副作用不可逆、成功标准多样，需要多层次评估体系。

## 关键要点

- 核心指标三角：Task Success Rate（目标达成）× Tool Correctness（工具调用质量）× Step Efficiency（路径最优性）
- 幻觉在 Agent 中更危险：错误工具参数可能触发真实副作用
- 评估粒度：最终结果评估 vs 轨迹评估（每步 action 是否合理）
- Agent 基准集：SWE-bench（代码）、WebArena（浏览器）、τ-bench（工具调用）、GAIA（通用）
- 非确定性处理：多次运行取均值，记录方差；固定 temperature=0 保障可复现
- 成本效率指标：完成相同任务的平均 token 数与工具调用次数
- 安全评估：拒绝率（对不当请求）、权限越界率

## 最佳实践

- 构建层次化任务集：简单（单工具）→ 中等（多步骤）→ 复杂（跨域推理）
- 记录完整轨迹（每步 thought/action/observation），便于人工复盘
- 用确定性验证器（代码执行/数据库查询）替代 LLM-as-Judge（减少评估误差）
- 对失败用例做根因分类：规划失败 / 工具调用失败 / 幻觉 / 上下文丢失
- 在 CI 中跑轻量化评估集（20-50 任务），完整评估每周跑一次
- 评估应覆盖对抗样本：提示注入、无效工具输入、长上下文

## 反模式

- ❌ 只评估最终输出，不看中间轨迹（错误步骤可能碰巧得到正确结果）
- ❌ 评估集只有正面任务，缺乏边界与拒绝场景
- ❌ 在生产环境跑评估，副作用污染真实数据
- ❌ 不固定随机种子，每次评估结果不可复现
- ❌ 仅靠 LLM-as-Judge 评判 Agent 轨迹，忽略 judge 自身的幻觉

## 分级掌握

- **Junior**: 能对 Agent 做端到端任务成功率统计，知道什么是 task-success
- **Mid**: 能构建轨迹级评估、分析失败模式、接入 CI 回归
- **Senior**: 能设计多维度、多基线、可扩展的 Agent 评估平台，处理非确定性与安全评估

## 参考资源

- [SWE-bench](https://www.swebench.com/) — tool
- [τ-bench (Tool-Use Benchmark)](https://github.com/sierra-research/tau-bench) — tool
- [GAIA Benchmark](https://huggingface.co/spaces/gaia-benchmark/leaderboard) — tool
- [Agent Evaluation Framework (Langchain)](https://docs.smith.langchain.com/evaluation) — doc
- [Evaluating Language-Model Agents (Anthropic)](https://www.anthropic.com/research/evaluating-ai-systems) — article

## 相关 Skills
_见所属 composite skill 或 role_
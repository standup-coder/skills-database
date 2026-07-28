---
id: prompt-engineering-advanced
type: atomic-skill
title: Advanced Prompt Engineering
nameZh: 高级提示工程
domain: ai-ml
tags: llm, prompt, chain-of-thought, structured-output, dspy, agent
catalogSource: internal
catalogFile: atomic-skills/prompt-engineering-advanced.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# 高级提示工程
> 掌握高级提示技术：Agent 系统提示设计、few-shot 校准、思维链变体、结构化输出与程序化提示优化。
## 操作语义
- 类型: ai-llm
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `task` (string, **必填**) — 目标任务描述
- `taskComplexity` (any, **必填**) 取值: simple/multi-step/reasoning-heavy/agentic — 任务复杂度类型
- `outputFormat` (string, 可选) — 期望输出格式（JSON schema / Pydantic model / markdown）
- `model` (string, 可选) — 目标模型标识符
- `evalSet` (array, 可选) — 用于驱动 prompt 迭代的评估集
## 输出
- `systemPrompt` (string, 可选)
- `userPromptTemplate` (string, 可选)
- `chainOfThoughtStrategy` (string, 可选) — 使用的 CoT 变体及原因
- `fewShotExamples` (array, 可选)
- `outputSchema` (object, 可选) — 结构化输出的 JSON Schema
- `optimizationNotes` (string, 可选) — DSPy/自动优化配置说明
## 核心要点

高级提示工程的本质是把 prompt 当程序来管理：可测试、可版本化、可自动优化。

## 关键要点

- CoT 变体选择：标准 CoT（数学/逻辑）vs Zero-shot CoT（'think step by step'）vs Tree-of-Thought（分支探索）vs ReAct（推理+行动交织）
- Agent 系统提示四要素：角色定义 + 能力边界 + 行为约束 + 输出格式规范
- 结构化输出三种方式：JSON mode / function calling / grammar-constrained generation（可靠性递增）
- Meta-prompting：让模型生成/改写自己的 prompt，再用评估集打分选优
- DSPy 范式：把 prompt 编译为优化器可调整的模块，由数据驱动而非手写
- Prompt chaining vs 单次多步：复杂任务拆分为有检查点的多阶段更可控
- 上下文工程（Context Engineering）：精确控制哪些信息、以何种顺序进入窗口

## 最佳实践

- 始终先写评估集（≥50 条），再开始优化 prompt
- 对 Agent 系统提示做角色扮演测试：尝试让它越权，观察是否拒绝
- 用 XML 标签明确分隔系统提示各节（<persona>, <tools>, <constraints>, <output_format>）
- few-shot 示例要覆盖正例、反例与边界输入，保持风格高度一致
- 生产提示纳入版本控制，每次变更记录 diff 与评估分数变化
- 对结构化输出做 schema 验证 + 重试（Instructor / Outlines / Guidance）

## 反模式

- ❌ 在没有评估集的情况下 '调感觉' 优化 prompt
- ❌ 系统提示超过 2000 tokens 却不做精简，增加成本与 'lost in the middle' 风险
- ❌ 对所有任务强制使用 CoT，简单分类任务反而更差
- ❌ few-shot 示例从同一数据集取，与评估集有重叠（数据泄漏）
- ❌ 结构化输出用正则解析自由文本而非 schema 约束

## 分级掌握

- **Junior**: 能理解 CoT 与 few-shot 的基本原理并套用到具体任务
- **Mid**: 能为 Agent 系统提示设计完整约束体系，能用 Instructor 实现稳定结构化输出
- **Senior**: 能用 DSPy 等工具做程序化 prompt 优化，建立提示治理体系并解决大规模幻觉问题

## 参考资源

- [Chain-of-Thought Prompting (Wei et al.)](https://arxiv.org/abs/2201.11903) — article
- [Tree of Thoughts (Yao et al.)](https://arxiv.org/abs/2305.10601) — article
- [DSPy: Declarative Self-improving Prompts](https://github.com/stanfordnlp/dspy) — tool
- [Instructor (Structured Outputs)](https://github.com/jxnl/instructor) — tool
- [Anthropic Prompt Engineering Guides](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — doc

## 相关 Skills
_见所属 composite skill 或 role_
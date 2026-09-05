---
id: prompt-engineering
type: atomic-skill
title: Prompt Engineering
nameZh: 提示工程
domain: ai-ml
tags: llm, prompt, ai, context-engineering
catalogSource: internal
catalogFile: atomic-skills/prompt-engineering.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# 提示工程
> 设计、组织并迭代提示词，引导大语言模型产生可靠、有依据的行为。
## 操作语义
- 类型: ai-llm
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `task` (string, **必填**) — 需要 LLM 完成的任务描述
- `examples` (array, 可选) — few-shot 示例
- `constraints` (array, 可选) — 硬约束（输出格式、禁用词等）
- `model` (string, 可选) — 目标模型（用于选择 prompt 风格）
## 输出
- `systemPrompt` (string, 可选)
- `userPromptTemplate` (string, 可选)
- `fewShot` (array, 可选)
- `rationale` (string, 可选) — 为什么这样设计
## 核心要点

提示工程的本质是把模糊任务翻译成模型可执行的明确上下文，关键在结构、约束与示例三件套。

## 关键要点

- 区分 system / user / assistant 三类消息的不同作用
- 结构化输出优先用 JSON Schema / function calling，而非靠正则解析自由文本
- Few-shot 示例的多样性比数量更重要（覆盖正反例与边界）
- Chain-of-Thought 适合复杂推理但会增加 token，对简单任务反而引入噪声
- 把任务拆步骤（task decomposition）通常优于让模型一步出结果
- 上下文窗口有限：相关信息要放在头部或尾部（lost in the middle 现象）
- 对模型行为做 grounding，强制引用提供的上下文而非自由发挥

## 最佳实践

- 先写评估集再写 prompt，让 prompt 演化由数据驱动
- 用 XML/Markdown 标签明确分块（<context>, <task>, <constraints>）
- 明确告知失败行为：找不到信息时输出 'I don't know' 而非编造
- 对模型版本做 pin，prompt 的稳定性依赖模型快照
- 把 prompt 视为代码：纳入版本控制、code review 与 diff 比对

## 反模式

- ❌ 把所有信息塞给 system prompt 致使长度失控
- ❌ 依赖自由文本解析输出（应改用 structured output）
- ❌ 用一个超长 prompt 解决所有任务，不做拆分
- ❌ Few-shot 示例风格不一致，模型学到错误模板
- ❌ 不写评估集，靠手感调 prompt

## 分级掌握

- **Junior**: 能照搬模板写 prompt，理解 system/user 区别
- **Mid**: 能根据任务设计结构化输出与 few-shot，配合评估集迭代
- **Senior**: 能用 DSPy/programmatic prompt 做自动化优化，建立 prompt 治理与回归

## 参考资源

- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering) — doc
- [Anthropic Prompt Library](https://docs.anthropic.com/en/prompt-library/library) — doc
- [Prompt Engineering Guide (DAIR.AI)](https://www.promptingguide.ai/) — doc
- [Lost in the Middle (Liu et al.)](https://arxiv.org/abs/2307.03172) — article
- [DSPy](https://github.com/stanfordnlp/dspy) — tool

## 相关 Skills
_见所属 composite skill 或 role_
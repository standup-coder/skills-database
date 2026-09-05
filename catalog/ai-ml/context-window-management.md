---
id: context-window-management
type: atomic-skill
title: Context Window Management
nameZh: 上下文窗口管理
domain: ai-ml
tags: ai-ml, context-engineering, llm, token-budget, compaction
catalogSource: internal
catalogFile: atomic-skills/context-window-management.json
catalogAddedAt: 2026-07-29
operation: ai-ml
level: mid
---

# 上下文窗口管理
> 把上下文当作稀缺资源经营：用最小的高信号 token 集合换取最大的输出质量，对抗长上下文的注意力衰减与成本膨胀。
## 操作语义
- 类型: ai-ml
## 何时使用
- Agent 长程任务（多轮工具调用）逼近窗口上限，输出质量随轮次下降
- 提示词越堆越长（规则/示例/历史全塞），模型开始忽略中段指令
- token 成本随会话长度线性甚至超线性增长，需要压缩策略
## 何时不使用
- 单轮短任务离窗口上限还很远——过度工程化压缩反而丢信息
## 输入参数
- `contextProfile` (object, **必填**) — 当前上下文构成（系统提示/历史/工具结果/检索内容各占多少）
- `taskHorizon` (string, 可选) — 任务时长（单轮/长程 agent）
## 输出
- `budgetPlan` (object) — 各成分的 token 预算分配
- `compactionStrategy` (string) — 压缩/摘要/检索化方案
- `layoutOptimization` (string) — 关键信息的位置编排
## 核心要点

上下文不是越多越好：模型存在"context rot"——随 token 增长，注意力被稀释，中段信息最容易被忽略（lost in the middle）。Anthropic 的定义是：好的 context engineering = 找到"最小的高信号 token 集合"使期望输出概率最大化。

## 关键要点

- 位置效应真实存在：关键指令与约束放开头或结尾，长文档问答把问题重复放在文档之后——中间位置的召回率显著更低
- 长程任务三板斧（Anthropic 实践）：压缩（compaction，接近上限时摘要重启会话）、结构化笔记（把状态写到窗口外的文件/记忆，用时再读）、子代理（每个子任务用干净窗口，只回传结论）
- 工具结果是最大的窗口杀手：截断/分页/只保留摘要，原始大结果落盘存引用——一次 10 万 token 的工具返回能毁掉整个会话
- 检索优于全量塞入：把"可能用到"的资料做成按需检索（RAG/文件系统），只把"当前一步必需"的内容放进窗口（just-in-time context）
- KV cache 友好的提示词布局：稳定前缀（系统提示/工具定义）在前、易变内容在后，命中前缀缓存可省 45-80% 输入成本——每轮都变的时间戳/随机 id 会击穿缓存
- 压缩有损：摘要会丢失细节且错误会复利，关键决策/约束/待办要显式保留原文，只压缩过程性内容
## 最佳实践

- 给上下文各成分定预算上限（如系统提示 ≤2K、历史 ≤8K、检索 ≤4K），超限触发对应压缩策略
- 定期做"上下文审计"：dump 真实会话，逐段问"删掉这段输出会变差吗"
- 系统提示按"背景/指令/工具/示例"分区组织，追求最小完备集而非大而全
- 长程 agent 用外部状态文件（todo/进展笔记）替代靠窗口记忆

## 反模式

- ❌ 把整个知识库/全部历史消息无差别塞进每轮请求
- ❌ 关键约束埋在 3 万 token 的中段然后抱怨模型"不听话"
- ❌ 摘要压缩一切，包括后续步骤必须逐字引用的规格与代码
- ❌ 动态内容插在系统提示开头，KV cache 每轮全 miss

## 分级掌握

- **Junior**: 理解窗口/token 计费与位置效应，会做基本的历史截断
- **Mid**: 能设计预算分配 + 压缩 + 检索化的完整方案，布局兼顾 KV cache
- **Senior**: 能为长程 agent 设计记忆分层与多代理窗口架构，量化压缩对质量的影响

## 参考资源

- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — article
- [Liu et al. — Lost in the Middle (TACL 2024)](https://arxiv.org/abs/2307.03172) — paper
- [Anthropic — Prompt caching 文档](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — doc
- [LangChain — Context Engineering 专题](https://blog.langchain.com/context-engineering-for-agents/) — article

## 相关 Skills

- [agent-memory-design](./agent-memory-design.md) — 窗口外的状态去处
- [llm-cost-optimization](./llm-cost-optimization.md) — 缓存与预算的成本视角
- [prompt-engineering](./prompt-engineering.md)

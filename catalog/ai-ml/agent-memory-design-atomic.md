---
id: agent-memory-design
type: atomic-skill
title: Agent Memory Design
nameZh: Agent 记忆设计
domain: ai-ml
tags: ai-ml, agent-memory, long-term-memory, episodic, retrieval
catalogSource: internal
catalogFile: atomic-skills/agent-memory-design.json
catalogAddedAt: 2026-07-29
operation: ai-ml
level: senior
---

# Agent 记忆设计
> 为 AI Agent 设计分层记忆系统：短期会话状态、长期语义/情景/程序记忆的写入、检索、更新与遗忘策略。
## 操作语义
- 类型: ai-ml
## 何时使用
- Agent 需要跨会话记住用户偏好、项目约定、历史决策
- 长程任务中窗口装不下全部状态，需要外部化记忆
- 用户抱怨"我上次说过了"——记忆缺失已成产品体验问题
## 何时不使用
- 单次性无状态任务（翻译/摘要 API）——记忆系统是纯负担
- 合规要求不留存用户数据的场景——先解决数据治理再谈记忆
## 输入参数
- `agentScenario` (string, **必填**) — Agent 类型与交互模式（对话助手/编码/客服）
- `memoryNeeds` (object, 可选) — 需要记住什么、记多久、谁可见
## 输出
- `memoryArchitecture` (object) — 分层设计（短期/语义/情景/程序）与存储选型
- `writePolicy` (string) — 何时写入、如何去重与冲突消解
- `retrievalPolicy` (string) — 检索时机、召回方式、注入预算
## 核心要点

记忆设计的核心矛盾是"写入宽松 vs 检索精准"：什么都记会让检索充满噪声（且错误记忆会长期误导行为），什么都不记则体验退化。按认知科学的四分层设计——工作记忆（窗口内）、情景记忆（发生过什么）、语义记忆（事实与偏好）、程序记忆（怎么做事的规则）——各自用不同的写入与检索策略。

## 关键要点

- 短期记忆 = 会话状态管理：LangGraph 的 checkpointer/thread 模式（每会话持久化、可恢复）是事实标准；超窗时先摘要旧轮次而非硬截断
- 长期记忆两条写入路径：hot path（对话中实时抽取，延迟敏感）与 background（会话后批处理提炼，质量更高）——生产系统多用后者或混合
- 检索不是只有向量：语义记忆用 embedding 相似度，情景记忆按时间+实体过滤，程序记忆按任务类型路由——单一向量库解决一切是常见的设计偷懒
- 记忆更新比写入难：新信息与旧记忆冲突时需要合并/覆盖/共存决策（Letta/MemGPT 的自编辑记忆、mem0 的 ADD/UPDATE/DELETE 操作是两种代表实现）
- 遗忘是特性不是缺陷：TTL、按访问频率衰减、容量上限淘汰——不遗忘的记忆库最终变成检索垃圾场
- 错误记忆的复利效应：一条错误的用户偏好会污染之后所有会话，写入前验证 + 用户可见可删是安全底线
## 最佳实践

- 从最小可用开始：先只做"用户显式要求记住的"（explicit memory），再逐步引入自动抽取
- 记忆条目结构化：内容 + 来源会话 + 时间戳 + 置信度 + 类别，检索时可按元数据过滤
- 注入预算固定（如 ≤1K token）：检索 top-k 后再做相关性重排，宁缺毋滥
- 定期评估记忆质量：抽样人审 + "有记忆 vs 无记忆"的 A/B 对比任务成功率

## 反模式

- ❌ 把全部对话历史向量化当"记忆"，检索回来的是大量寒暄噪声
- ❌ 每轮对话都实时写记忆，重复条目与半成品结论堆积
- ❌ 记忆对用户不可见不可删——错误偏好永久生效还无法纠正
- ❌ 检索结果不设预算全部注入，记忆系统反过来挤爆上下文窗口

## 分级掌握

- **Junior**: 能用框架（LangGraph checkpointer）实现会话内与跨会话的基本记忆
- **Mid**: 能设计四分层架构与写入/检索/更新策略，处理记忆冲突
- **Senior**: 能设计多租户记忆平台（隔离/合规/评估体系），量化记忆对任务成功率的贡献

## 参考资源

- [LangGraph — Memory 概念文档](https://langchain-ai.github.io/langgraph/concepts/memory/) — doc
- [MemGPT/Letta — Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) — paper
- [Redis — Build smarter AI agents: short-term & long-term memory](https://redis.io/blog/build-smarter-ai-agents-manage-short-term-and-long-term-memory-with-redis/) — article
- [CoALA — Cognitive Architectures for Language Agents](https://arxiv.org/abs/2309.02427) — paper

## 相关 Skills

- [context-window-management](./context-window-management-atomic.md) — 记忆与窗口的分工
- [rag-pipeline](./rag-pipeline-atomic.md) — 检索技术的共享底座
- [agent-orchestration](./agent-orchestration-atomic.md)

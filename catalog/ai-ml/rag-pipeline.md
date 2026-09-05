---
id: rag-pipeline
type: atomic-skill
title: RAG Pipeline
nameZh: RAG 检索增强生成
domain: ai-ml
tags: rag, llm, retrieval, knowledge
catalogSource: internal
catalogFile: atomic-skills/rag-pipeline.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# RAG 检索增强生成
> 设计端到端 RAG 链路：摄取、检索、增强、生成、评估。
## 操作语义
- 类型: ai-llm
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `useCase` (string, **必填**) — 应用场景：客服/研发助手/法律咨询等
- `knowledgeSources` (array, **必填**)
- `qualityTargets` (object, 可选) — 目标 groundedness / faithfulness 等指标
## 输出
- `ingestPipeline` (object, 可选)
- `retrievalConfig` (object, 可选)
- `promptTemplate` (string, 可选)
- `evalSetup` (object, 可选)
## 核心要点

RAG = Retrieval × Generation，检索质量是天花板，生成质量是地板，评估闭环是工程化关键。

## 关键要点

- 经典链路：Ingest → Chunk → Embed → Index → Retrieve → Rerank → Augment → Generate → Cite
- Groundedness（答案是否来自证据）比纯准确率更重要
- 永远要返回引用（citations），便于用户验证与归因
- 查询改写（HyDE / multi-query / step-back）显著提升复杂问题召回
- 知识更新策略：增量索引、TTL、版本化
- 失败兜底：检索为空时显式说 'I don't know' 而非让模型自由发挥

## 最佳实践

- 先做最小 baseline（BM25 + GPT-4），再迭代到向量 + rerank
- 建立 200+ 条评估问答对，用 Ragas/DeepEval 自动化
- 在 prompt 中明确：'仅基于以下上下文回答，无信息时回答 "未知"'
- 返回结构化结果：answer + citations + confidence
- 对低置信度查询做兜底（人工/工具调用/澄清问题）

## 反模式

- ❌ 把检索结果一股脑塞进 prompt，超出上下文窗口
- ❌ 不返回引用，用户无法验证
- ❌ 评估只看主观体验，没有量化指标
- ❌ 知识源更新但索引不重建
- ❌ 复杂方案堆砌（agent + 多 retriever）但 baseline 都没打透

## 分级掌握

- **Junior**: 能搭一个 demo 级 RAG（embedding + top-k + 直接生成）
- **Mid**: 能引入 hybrid search + rerank + 结构化引用 + 评估集
- **Senior**: 能在生产环境维护多租户、多源、可观测、可演进的 RAG 系统

## 参考资源

- [Retrieval-Augmented Generation (Lewis et al., 2020)](https://arxiv.org/abs/2005.11401) — article
- [Ragas](https://github.com/explodinggradients/ragas) — tool
- [LangChain RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/) — doc
- [LlamaIndex Docs](https://docs.llamaindex.ai/) — doc
- [Advanced RAG Techniques (NVIDIA)](https://developer.nvidia.com/blog/rag-101-retrieval-augmented-generation-questions-answered/) — article

## 相关 Skills
_见所属 composite skill 或 role_
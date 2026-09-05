---
id: embeddings-design
type: atomic-skill
title: Embeddings Design
nameZh: 向量嵌入设计
domain: ai-ml
tags: llm, embeddings, rag, vector
catalogSource: internal
catalogFile: atomic-skills/embeddings-design.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: senior
---

# 向量嵌入设计
> 为语义检索选择合适的 embedding 模型、切块策略与元数据 schema。
## 操作语义
- 类型: ai-llm
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `corpus` (string, **必填**) — 待向量化的语料描述
- `domain` (string, 可选) — 领域（通用/法律/医疗/代码等）
- `language` (string, 可选) — 主要语言
- `scale` (string, 可选) — 规模量级（万/百万/亿）
## 输出
- `embeddingModel` (string, 可选)
- `chunkingStrategy` (object, 可选)
- `metadataSchema` (object, 可选)
- `rationale` (string, 可选)
## 核心要点

Embedding 质量决定 RAG 召回上限，模型选型、切块策略与元数据三者缺一不可。

## 关键要点

- 通用语料用 OpenAI text-embedding-3 / Cohere；中文场景考虑 BGE / m3e
- 切块大小要匹配下游模型上下文与查询粒度，过小丢上下文，过大稀释信号
- 重叠（overlap）20% 左右可缓解切块边界丢失关键句的问题
- 维度越高检索精度未必更好，需结合存储与延迟成本权衡
- 结构化元数据（doc_id / section / time / acl）是过滤与重排序的关键
- 代码/法律等领域应使用领域专用 embedding 或微调

## 最佳实践

- 建立离线 retrieval 评估集（query → relevant doc），用 nDCG/MRR 量化
- 以 sentence/段落 为切块边界而非固定字符，结合 markdown 标题切分
- 保留原文与可定位的 source_uri，便于引用回溯
- 对长文档做层级 embedding（summary + chunk）
- embedding 模型版本变更必须重建索引，纳入 schema migration

## 反模式

- ❌ 固定字节切块导致句子被腰斩
- ❌ 把所有内容混入一张大表，不带任何元数据，无法过滤
- ❌ 维度选最大不考虑成本
- ❌ 线上线下使用不同 embedding 模型导致检索失效
- ❌ 中文语料用纯英文 embedding 模型

## 分级掌握

- **Junior**: 能调用 embedding API，按固定大小切块
- **Mid**: 能根据语料特点选择模型与切块策略，搭建评估集
- **Senior**: 能针对领域微调 embedding，设计层级检索与多向量方案

## 参考资源

- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) — tool
- [BGE Embeddings](https://github.com/FlagOpen/FlagEmbedding) — tool
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings) — doc
- [Chunking Strategies for LLM Apps (Pinecone)](https://www.pinecone.io/learn/chunking-strategies/) — article
- [BEIR Benchmark](https://github.com/beir-cellar/beir) — tool

## 相关 Skills
_见所属 composite skill 或 role_
---
id: vector-search
type: atomic-skill
title: Vector Search
nameZh: 向量检索
domain: ai-ml
tags: vector, ann, retrieval, rag
catalogSource: internal
catalogFile: atomic-skills/vector-search.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# 向量检索
> 为低延迟语义检索配置 ANN 索引、查询与重排策略。
## 操作语义
- 类型: ai-llm
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `vectorDB` (any, **必填**) 取值: pgvector/qdrant/weaviate/pinecone/milvus
- `scale` (string, 可选) — 向量数量级
- `latencyBudget` (string, 可选) — P95 延迟预算
- `filters` (array, 可选)
## 输出
- `indexConfig` (object, 可选)
- `queryPlan` (object, 可选)
- `rerankerConfig` (object, 可选)
## 核心要点

向量检索是 RAG 的入口，召回率/延迟/过滤能力的取舍决定整体体验。

## 关键要点

- ANN 主流算法：HNSW（高召回低延迟）vs IVF-PQ（低内存大规模）
- metric 选择：cosine 用于规范化向量，dot product / L2 用于未规范化
- Hybrid search = 关键词（BM25）+ 向量，比单一向量更稳
- Reranking（cross-encoder）显著提升 top-k 精度，代价是延迟
- 元数据过滤要前置（pre-filter）或后置（post-filter）依据基数权衡
- batch 查询与连接池是吞吐关键

## 最佳实践

- 先用 BM25 + 向量混合，必要时加 reranker，避免一上来就追求复杂方案
- 为高基数过滤字段建索引或用分区，避免全表扫
- 监控召回@k、nDCG、查询延迟 P95/P99
- 向量与原文分离存储，原文用对象存储，向量库只存 metadata + id
- 做 query 改写（HyDE / multi-query）提升模糊问题召回

## 反模式

- ❌ 把全文塞进 vector DB 的 payload，导致存储爆炸
- ❌ 只看 top-1 结果，没有 reranking
- ❌ filter 条件过滤掉 99% 文档但仍走全量 ANN，浪费
- ❌ 线上随意改 embedding 模型却不重建索引
- ❌ 对 ID 类精确查询也走向量检索

## 分级掌握

- **Junior**: 能调用 vector DB API 完成 top-k 查询
- **Mid**: 能选择合适索引算法、设计 hybrid + reranker 流水线
- **Senior**: 能在 P99 延迟预算下设计大规模、多租户向量检索系统

## 参考资源

- [pgvector](https://github.com/pgvector/pgvector) — tool
- [Qdrant Docs](https://qdrant.tech/documentation/) — doc
- [HNSW Paper (Malkov & Yashunin)](https://arxiv.org/abs/1603.09320) — article
- [Hybrid Search (Weaviate)](https://weaviate.io/blog/hybrid-search-explained) — article
- [Reranking with Cohere](https://docs.cohere.com/docs/reranking) — doc

## 相关 Skills
_见所属 composite skill 或 role_
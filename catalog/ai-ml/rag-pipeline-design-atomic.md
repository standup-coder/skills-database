---
id: rag-pipeline-design
type: atomic-skill
title: RAG Pipeline Design
nameZh: RAG 管道架构设计
domain: ai-ml
tags: rag, retrieval, architecture, llm, vector-search, hybrid-search
catalogSource: internal
catalogFile: atomic-skills/rag-pipeline-design.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# RAG 管道架构设计
> 架构生产级 RAG 系统：多源摄取、高级分块策略、混合检索、重排序、查询变换与可观测性。
## 操作语义
- 类型: ai-llm
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `useCase` (string, **必填**) — 应用场景（企业知识库/代码助手/法律合规等）
- `knowledgeSources` (array, **必填**) — 知识源清单（类型/体量/更新频率）
- **qualityTargets** (object):
  - `faithfulness` (number, 可选)
  - `contextRecall` (number, 可选)
  - `latencyP95Ms` (number, 可选)
- `scale` (any, 可选) 取值: prototype/small/medium/large — 规模预期
## 输出
- `architectureDiagram` (string, 可选) — 架构图（Mermaid/文字描述）
- `ingestPipeline` (object, 可选) — 摄取管道设计（解析/分块/嵌入/索引）
- `retrievalStrategy` (object, 可选) — 检索策略（dense/sparse/hybrid/rerank）
- `queryTransformations` (array, 可选) — 查询变换列表（HyDE/multi-query/step-back）
- `evalSetup` (object, 可选) — 评估方案（Ragas/DeepEval 配置）
- `observabilityPlan` (object, 可选) — 可观测性方案（traces/metrics/alerts）
## 核心要点

RAG 架构设计的难点在于检索质量与延迟的权衡，以及在知识更新场景下维持索引一致性。

## 关键要点

- 分块策略决定检索天花板：语义分块 > 句子分块 > 固定长度分块（领域文档用结构感知分块）
- 混合检索（Dense + BM25）通常优于纯向量：Dense 捕捉语义，BM25 捕捉关键词
- 重排序（Cross-Encoder reranker）是召回后的精排，显著提升 precision
- 查询变换三板斧：HyDE（假设文档扩展）/ multi-query（多角度扩写）/ step-back（泛化追问）
- 上下文压缩（Contextual Compression）：只传送检索段落中与问题最相关的句子
- 引用链路：每条生成结果必须携带来源文档 ID + chunk 位置，支持可验证
- 知识更新策略：增量索引（新增/修改）+ 软删除 + 版本化快照

## 最佳实践

- 从 baseline 开始：BM25 + top-k + GPT-4，先量化基线分再迭代
- 用 Ragas 量化 faithfulness / context-recall / answer-relevancy 三角
- 为每次检索记录 trace（query → retrieved chunks → final answer），支持离线分析
- 嵌入模型 pin 到具体版本，升级前对比 embedding 漂移影响
- 大规模系统用命名空间/过滤器做 multi-tenant 隔离，防止跨租户信息泄漏
- 设置检索失败兜底：召回为空时明确回复 '未找到相关信息' 而非幻觉

## 反模式

- ❌ 用固定 512-token 分块处理所有文档类型（代码/表格/Markdown 各有最优策略）
- ❌ 只用向量相似度，忽视关键词匹配（专有名词/型号/代码符号召回率低）
- ❌ 检索结果超出上下文窗口后截断，导致信息丢失且不提示用户
- ❌ 不返回引用，生成结果无从验证
- ❌ 评估只靠主观体验，缺乏量化指标与回归测试

## 分级掌握

- **Junior**: 能搭建 demo 级 RAG（固定分块 + 向量检索 + 直接生成）
- **Mid**: 能设计混合检索 + 重排序 + 结构化引用 + Ragas 评估的中型 RAG 系统
- **Senior**: 能架构多租户、多源、可观测、增量更新的生产 RAG 平台，并解决领域知识冷启动问题

## 参考资源

- [Advanced RAG Techniques Overview](https://arxiv.org/abs/2312.10997) — article
- [Ragas Evaluation Framework](https://github.com/explodinggradients/ragas) — tool
- [LlamaIndex RAG Documentation](https://docs.llamaindex.ai/en/stable/) — doc
- [pgvector Documentation](https://github.com/pgvector/pgvector) — tool
- [HyDE Paper (Gao et al.)](https://arxiv.org/abs/2212.10496) — article

## 相关 Skills
_见所属 composite skill 或 role_
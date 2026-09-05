---
id: llm-cost-optimization
type: atomic-skill
title: LLM Cost Optimization
nameZh: LLM 成本优化
domain: ai-ml
tags: ai-ml, cost-optimization, prompt-caching, model-routing, token-budget
catalogSource: internal
catalogFile: atomic-skills/llm-cost-optimization.json
catalogAddedAt: 2026-07-29
operation: ai-ml
level: mid
---

# LLM 成本优化
> 在不牺牲质量底线的前提下系统性压降 LLM 调用成本：模型路由、prompt caching、批处理与 token 治理的组合拳。
## 操作语义
- 类型: ai-ml
## 何时使用
- LLM API 账单随流量线性增长，成为产品毛利的主要威胁
- 所有请求无差别打到最贵的旗舰模型，简单任务在为智商溢价买单
- Agent 系统多轮调用叠加，单次会话成本不可预测也无人监控
## 何时不使用
- 原型验证期——先证明价值再优化成本，过早优化会拖慢迭代
- 质量敏感且调用量极小的场景（如内部专家工具），优化收益覆盖不了工程成本
## 输入参数
- `usageProfile` (object, **必填**) — 各任务类型的调用量、token 分布与当前模型选择
- `qualityFloor` (object, 可选) — 各任务可接受的最低质量线（评估集分数）
## 输出
- `routingPlan` (object) — 任务分级与模型路由/级联方案
- `cachingPlan` (string) — prompt caching 与 semantic caching 落地方案
- `costDashboard` (string) — 按任务/用户/功能维度的成本归因与告警
## 核心要点

LLM 成本优化的第一定律是"先测量再优化"：绝大多数团队连"哪个功能烧掉了多少钱"都答不上来。第二定律是"路由 > 缓存 > 压缩"的收益排序——把 70% 的简单请求从旗舰模型路由到小模型通常能省 40-70%，且这是对质量影响最可控的一刀。

## 关键要点

- 模型路由/级联是最大杠杆：简单任务（分类/抽取/格式化）用小模型，复杂推理才上旗舰；级联模式（小模型先答、置信度不足再升级）在实践中可节省 40-70% 成本
- Prompt caching 是"免费的钱"：稳定前缀（系统提示/工具定义/few-shot 示例）命中缓存后输入 token 计价降至 10%（Anthropic）或 50%（OpenAI），长系统提示场景整体可省 45-80%——前提是布局对缓存友好（稳定内容在前、易变内容在后）
- 批处理 API 直接 5 折：所有非实时任务（离线评估/数据标注/内容生成）走 Batch API，OpenAI/Anthropic 均提供 50% 折扣，24 小时内返回
- Semantic caching 适合高重复查询场景：客服/FAQ 类应用 25-35% 的查询语义重复，缓存命中直接零成本返回——但要处理好相似度阈值与时效失效
- 输出 token 比输入贵 3-5 倍：约束输出长度（max_tokens、"简洁回答"指令、结构化输出）往往比压缩输入更划算
- 成本归因要到业务维度：按 feature/用户/租户打 tag 记账，没有归因就没有优化优先级，也无法发现异常调用（如失控的 agent 循环）
## 最佳实践

- 建评估集先行：每次降级模型/加缓存前后跑同一评估集，用数据证明质量未跌破底线
- 给 agent 设成本熔断：单会话 token 上限 + 单日预算告警，防止循环失控产生天价账单
- 缓存友好的提示词布局纳入 code review 清单：时间戳/随机 id 不进系统提示
- 每季度重估模型选型：模型价格与能力迭代极快，半年前的路由决策可能已过时

## 反模式

- ❌ 不做测量直接砍模型档位，质量崩了才发现省的钱远小于流失的用户
- ❌ 所有任务共用一个旗舰模型配置，"反正效果好"
- ❌ 实时接口和离线批任务混在一起，白白放弃 50% 批处理折扣
- ❌ 每轮请求动态拼接系统提示（插入当前时间/会话 id），prompt cache 全 miss

## 分级掌握

- **Junior**: 理解 token 计价模型与输入/输出价差，会用 max_tokens 与批处理 API
- **Mid**: 能设计模型路由 + 缓存组合方案并用评估集验证质量底线
- **Senior**: 能建组织级成本治理体系（归因/预算/熔断），量化每项优化的质量-成本权衡

## 参考资源

- [Anthropic — Prompt caching 文档](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — doc
- [OpenAI — Prompt caching 文档](https://platform.openai.com/docs/guides/prompt-caching) — doc
- [OpenAI — Batch API 文档](https://platform.openai.com/docs/guides/batch) — doc
- [Kong — LLM Cost Optimization Strategies](https://konghq.com/blog/enterprise/llm-cost-optimization) — article

## 相关 Skills

- [context-window-management](./context-window-management.md) — token 预算的窗口视角
- [llm-evaluation](./llm-evaluation.md) — 质量底线的验证手段
- [fine-tuning](./fine-tuning.md) — 小模型替代旗舰的路径之一

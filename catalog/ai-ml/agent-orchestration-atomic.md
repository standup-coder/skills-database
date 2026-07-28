---
id: agent-orchestration
type: atomic-skill
title: Agent Orchestration
nameZh: Agent 编排
domain: ai-ml
tags: agent, llm, orchestration, multi-agent
catalogSource: internal
catalogFile: atomic-skills/agent-orchestration.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# Agent 编排
> 协调多 Agent 系统：角色分工、规划、通信、控制流与终止条件。
## 操作语义
- 类型: ai-llm
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `task` (string, **必填**)
- `agents` (array, **必填**)
- `topology` (any, 可选) 取值: sequential/hierarchical/graph/swarm
## 输出
- `controlGraph` (object, 可选)
- `messageProtocol` (object, 可选)
- `terminationCriteria` (array, 可选)
## 核心要点

多 Agent 协作的难点不是让它们能跑，而是让它们停下且收敛于正确答案。

## 关键要点

- 拓扑选择：单体 → ReAct → Plan-and-Execute → Hierarchical → Graph
- 明确每个 Agent 的角色、输入契约与输出契约
- 通信协议：消息 schema + 共享黑板 vs 直接对话
- 必须有显式终止条件（最大步数、目标判定、置信阈值）
- 状态管理：Agent 是无状态的，状态在编排器或共享内存
- 可观测性：每一步的 thought/action/observation 都要可追溯

## 最佳实践

- 从单 Agent + 工具开始，证明无效再上多 Agent
- 用 supervisor 模式做收敛，避免 N×N 全连接
- 限制每个 Agent 的工具子集，遵守最小权限
- 为每条消息加 trace_id 与 step_id，便于离线分析
- 用确定性流程包裹 LLM 决策（先固定 plan 再让 LLM 填空）

## 反模式

- ❌ Agent 互相吹捧死循环
- ❌ 无终止条件，靠超时硬截断
- ❌ 把所有上下文广播给所有 Agent，token 爆炸
- ❌ Agent 角色重叠，决策权不清
- ❌ 为了多 Agent 而多 Agent，简单任务被复杂化

## 分级掌握

- **Junior**: 能跑通 ReAct 单 Agent + 工具
- **Mid**: 能用 LangGraph/AutoGen 设计 supervisor + worker 拓扑
- **Senior**: 能设计可终止、可观测、可演进的生产级多 Agent 系统

## 参考资源

- [AutoGen](https://github.com/microsoft/autogen) — tool
- [LangGraph](https://github.com/langchain-ai/langgraph) — tool
- [CrewAI](https://github.com/joaomdmoura/crewAI) — tool
- [ReAct (Yao et al.)](https://arxiv.org/abs/2210.03629) — article
- [Multi-Agent Patterns (Anthropic)](https://www.anthropic.com/research/building-effective-agents) — article

## 相关 Skills
_见所属 composite skill 或 role_
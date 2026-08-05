---
id: tool-use-design
type: atomic-skill
title: Tool Use Design
nameZh: 工具调用设计
domain: ai-ml
tags: llm, tool-use, function-calling, mcp
catalogSource: internal
catalogFile: atomic-skills/tool-use-design.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: senior
---

# 工具调用设计
> 设计 LLM 可靠选择并调用的工具（function calling / MCP）。
## 操作语义
- 类型: ai-llm
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `domain` (string, **必填**)
- `existingApis` (array, 可选)
- `safetyRequirements` (array, 可选)
## 输出
- `toolCatalog` (array, 可选)
- `schemas` (array, 可选)
- `selectionGuidance` (string, 可选)
## 核心要点

工具是 Agent 的手脚，工具的命名、描述与 schema 直接决定 LLM 选择正确率。

## 关键要点

- 工具描述要写给 LLM 看：动词开头、用例明确、列出何时不要用
- 参数 schema 用 JSON Schema，关键字段加 description 与 enum
- 工具数量超过 ~20 个会让选择正确率显著下降，需分组或层级
- 幂等性设计：同一工具+同一参数应可重试
- 副作用工具（写、删、转账）必须有 dry-run 与人工确认机制
- MCP 是工具暴露的标准化协议，便于跨 LLM 复用

## 最佳实践

- 工具命名用 verb_noun，描述写清前置条件与典型用例
- 对每个工具写 5-10 个调用示例（few-shot）
- 返回结构化错误，包含 retryable 标志与 hint
- 敏感工具加 confirmation 步骤（return need_confirmation 而非直接执行）
- 建立工具调用 trace：tool_name + args + result + duration + cost

## 反模式

- ❌ 把一个 mega-tool 暴露成 'do_anything(action, params)'
- ❌ 工具描述写成实现细节（'调用内部 X 服务'），LLM 无法理解何时用
- ❌ 参数没有 schema，靠 LLM 编造字段
- ❌ 副作用工具无审计，模型一调就执行
- ❌ 工具数量爆炸却不分组

## 分级掌握

- **Junior**: 能为简单 API 写 function schema 让 LLM 调用
- **Mid**: 能设计 10+ 工具集合，处理副作用与错误反馈
- **Senior**: 能用 MCP 标准化暴露工具，做层级路由与权限治理

## 参考资源

- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling) — doc
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) — doc
- [Anthropic Tool Use](https://docs.anthropic.com/en/docs/tool-use) — doc
- [Toolformer (Schick et al.)](https://arxiv.org/abs/2302.04761) — article
- [Building Effective Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents) — article

## 相关 Skills
_见所属 composite skill 或 role_
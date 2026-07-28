---
id: mcp-server-development
type: atomic-skill
title: MCP Server Development
nameZh: MCP 服务器开发
domain: ai-ml
tags: mcp, agent, llm, tool-use, protocol
catalogSource: internal
catalogFile: atomic-skills/mcp-server-development.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# MCP 服务器开发
> 设计并实现 Model Context Protocol（MCP）服务器，向 LLM Agent 暴露工具、资源与提示。
## 操作语义
- 类型: ai-llm
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `tools` (array, **必填**) — 待暴露的工具列表（name/description/inputSchema）
- `resources` (array, 可选) — 待暴露的资源（URI 模板/静态）
- `transport` (any, 可选) 取值: stdio/sse/websocket — 传输协议选择
- `authScheme` (string, 可选) — 认证方案（none/api-key/oauth）
## 输出
- `serverCode` (string, 可选) — MCP 服务器实现代码
- `toolManifest` (object, 可选) — 工具 JSON Schema 清单
- `testCases` (array, 可选)
- `deployConfig` (object, 可选) — 部署配置（Docker/npm 包/Claude Desktop config）
## 核心要点

MCP 是连接 LLM 与外部世界的标准协议，服务器质量直接决定 Agent 的工具调用可靠性。

## 关键要点

- MCP 三大原语：Tools（可调用）、Resources（可读）、Prompts（可重用提示模板）
- 传输层：stdio 适合本地进程，SSE/WebSocket 适合远程服务
- 工具 inputSchema 必须精确——LLM 依赖它推断如何调用
- 每个工具应单一职责，名称与描述要对 LLM 友好（不是对人类友好）
- MCP 服务器应无状态或支持会话隔离，避免跨用户状态泄漏
- 版本化工具 schema：破坏性变更需升级版本号
- 安全边界：验证所有输入，防止 prompt 注入借助工具提权

## 最佳实践

- 先用官方 MCP Inspector 调试，确认工具可被正确发现与调用
- 工具描述中写清触发条件而非实现细节（'Use when you need to…'）
- 对副作用工具（write/delete）在描述中明确标注并添加确认机制
- 用 zod/JSON Schema 严格验证输入，不信任 LLM 生成的参数
- 在 CI 中跑 MCP conformance tests，防止 schema 漂移
- 提供 Claude Desktop / Cursor 的即插即用配置示例

## 反模式

- ❌ 工具 description 写给人看而非写给模型看，导致模型不知道何时调用
- ❌ 一个工具做太多事（create_and_update_and_delete），违反单一职责
- ❌ 不做输入校验，任意字符串流入底层命令执行
- ❌ 工具执行时间过长（>30s）却不提供流式或异步机制
- ❌ 不提供错误消息，LLM 无法根据失败原因重试或回退

## 分级掌握

- **Junior**: 能基于 SDK 示例实现一个简单工具服务器并在 Claude Desktop 中验证
- **Mid**: 能设计多工具、有认证、有错误处理的生产级 MCP 服务器并发布为 npm/PyPI 包
- **Senior**: 能设计 MCP 服务器的安全边界、版本策略与大规模工具注册中心

## 参考资源

- [Model Context Protocol Spec](https://modelcontextprotocol.io/docs) — doc
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) — tool
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) — tool
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) — tool
- [Anthropic MCP Introduction](https://www.anthropic.com/news/model-context-protocol) — article

## 相关 Skills
_见所属 composite skill 或 role_
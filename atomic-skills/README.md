# Atomic Skills (原子技能)

本目录包含最基础的原子技能。

## 什么是原子技能？

**原子技能 = 不可再分的基础操作**

原子技能是 Agent 的最小能力单元，直接映射到：
- MCP Tools
- API 调用
- 本地命令执行
- 文件系统操作

## 原子技能分类

### 1. 文件操作

| Skill ID | 名称 | 描述 | 实现 |
|----------|------|------|------|
| read-file | 读取文件 | 读取文件内容 | mcp-filesystem |
| write-file | 写入文件 | 写入文件内容 | mcp-filesystem |
| list-directory | 列出目录 | 列出目录内容 | mcp-filesystem |
| search-files | 搜索文件 | 按模式搜索文件 | mcp-filesystem |

### 2. 代码操作

| Skill ID | 名称 | 描述 | 实现 |
|----------|------|------|------|
| analyze-code | 分析代码 | 分析代码质量 | llm + ast |
| run-linter | 运行检查 | 运行代码检查工具 | native |
| run-tests | 运行测试 | 执行测试套件 | native |
| format-code | 格式化代码 | 格式化代码 | native |

### 3. Git 操作

| Skill ID | 名称 | 描述 | 实现 |
|----------|------|------|------|
| git-diff | Git 对比 | 查看代码变更 | mcp-git |
| git-commit | Git 提交 | 提交代码 | mcp-git |
| git-log | Git 日志 | 查看提交历史 | mcp-git |

### 4. 数据库操作

| Skill ID | 名称 | 描述 | 实现 |
|----------|------|------|------|
| database-query | 执行查询 | 执行 SQL 查询 | mcp-postgres |
| database-migrate | 执行迁移 | 运行数据库迁移 | native |

### 5. 网络操作

| Skill ID | 名称 | 描述 | 实现 |
|----------|------|------|------|
| http-request | HTTP 请求 | 发送 HTTP 请求 | native |
| api-call | API 调用 | 调用 REST/GraphQL API | native |
| http-health-check | HTTP 健康探测 | 验证端点健康状态 | native |

### 6. 运维操作

| Skill ID | 名称 | 描述 | 实现 |
|----------|------|------|------|
| run-shell-command | 执行 Shell 命令 | 受控环境下执行命令并捕获输出 | native |
| docker-exec | Docker 容器执行 | 在运行中的容器内执行命令 | native |
| validate-k8s-manifest | 校验 K8s 清单 | 使用 kubeval/kubectl 校验 YAML | native |
| parse-json-log | 解析 JSON 日志 | 解析并过滤结构化日志 | native |

### 7. AI / LLM 链路

| Skill ID | 名称 | 描述 | 实现 |
|----------|------|------|------|
| prompt-engineering | Prompt 工程 | 系统化设计、版本化与 A/B 评测 prompt | native |
| embeddings-design | 嵌入向量设计 | 选模型、维度、归一化与冷启动策略 | native |
| vector-search | 向量检索 | ANN/HNSW/IVF 检索与混合查询 | native |
| rag-pipeline | RAG 链路 | chunk → embed → retrieve → rerank → cite | native |
| llm-evaluation | LLM 评测 | groundedness/faithfulness/cost 离线在线 | native |
| agent-orchestration | Agent 编排 | supervisor/swarm/graph 多 Agent 控制流 | native |
| tool-use-design | 工具调用设计 | 工具 schema、降级策略与失败边界 | native |
| fine-tuning | 模型微调 | SFT/LoRA/RLHF 选型与评测闭环 | native |

### 8. 微服务韧性

| Skill ID | 名称 | 描述 | 实现 |
|----------|------|------|------|
| service-mesh | 服务网格 | Istio/Linkerd 流量、安全与可观测 | native |
| circuit-breaker | 熔断器 | 半开探测、超时与降级策略 | native |
| idempotency-design | 幂等设计 | 幂等键、去重窗口、幂等存储 | native |

### 9. 可观测性

| Skill ID | 名称 | 描述 | 实现 |
|----------|------|------|------|
| distributed-tracing | 分布式追踪 | OpenTelemetry trace/span 与采样策略 | native |
| slo-error-budget | SLO 与错误预算 | 多窗口 burn rate 告警与冻结策略 | native |

### 10. 测试细分

| Skill ID | 名称 | 描述 | 实现 |
|----------|------|------|------|
| contract-testing | 契约测试 | Pact/CDC 流水线与版本兼容 | native |
| chaos-engineering | 混沌工程 | 假设、爆炸半径、自动回滚的故障注入 | native |

> **2026-05 更新**：补齐 LLM 链路 8 个 + 微服务韧性 3 个 + 可观测 2 个 + 测试细分 2 个，原子技能由 126 → 141；新增项 100% 带 learning 节（含 keyPoints / bestPractices / antiPatterns / resources / maturityLevels）。

## 原子技能结构

```json
{
  "id": "skill-id",
  "type": "atomic-skill",
  "metadata": { ... },
  "input": { ... },      // 输入参数
  "output": { ... },     // 输出格式
  "implementation": {    // 实现方式
    "type": "mcp-tool|native|api",
    "server": "server-name",
    "tool": "tool-name"
  },
  "constraints": { ... }, // 约束条件
  "errors": { ... }       // 错误定义
}
```

## 实现类型

### MCP Tool

```json
{
  "implementation": {
    "type": "mcp-tool",
    "server": "filesystem",
    "tool": "read_file"
  }
}
```

### Native Function

```json
{
  "implementation": {
    "type": "native",
    "function": "fs.readFileSync",
    "module": "fs"
  }
}
```

### API Call

```json
{
  "implementation": {
    "type": "api",
    "endpoint": "https://api.example.com/analyze",
    "method": "POST"
  }
}
```

## 安全性

原子技能有严格的安全约束：

```json
{
  "constraints": {
    "permissions": ["read"],
    "blockedPaths": ["/etc/passwd"],
    "maxFileSize": 10485760
  }
}
```

## 创建新原子技能

1. 确定技能是不可再分的基础操作
2. 选择合适的实现方式（MCP/Native/API）
3. 定义输入输出参数
4. 配置安全约束
5. 编写测试用例

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

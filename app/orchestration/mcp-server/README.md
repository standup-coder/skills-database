# MCP Server Integration

Model Context Protocol (MCP) 服务器集成。

## 支持的 MCP Servers

### 官方 Servers

- **filesystem** - 文件系统操作
- **git** - Git 操作
- **github** - GitHub API
- **postgres** - PostgreSQL 数据库
- **sqlite** - SQLite 数据库
- **brave-search** - 网页搜索

### 配置示例

```javascript
import { MCPServerManager } from 'skills4coder/orchestration/mcp-server';

const mcpManager = new MCPServerManager({
  servers: [
    {
      name: 'filesystem',
      command: 'npx -y @modelcontextprotocol/server-filesystem /path/to/project',
      enabled: true
    },
    {
      name: 'git',
      command: 'uvx mcp-server-git --repository /path/to/repo',
      enabled: true
    },
    {
      name: 'github',
      command: 'npx -y @modelcontextprotocol/server-github',
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN
      }
    }
  ]
});

// 启动所有服务器
await mcpManager.connectAll();

// 获取可用工具
const tools = mcpManager.getTools();

// 调用工具
const result = await mcpManager.callTool('filesystem', 'read_file', {
  path: '/path/to/file.ts'
});
```

## 自定义 MCP Server

```javascript
// 注册自定义 MCP Server
mcpManager.register({
  name: 'my-custom-server',
  transport: 'stdio',
  command: 'node ./my-server.js',
  tools: [
    {
      name: 'custom_analysis',
      description: '自定义分析工具',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string' }
        }
      }
    }
  ]
});
```

## 与 Atomic Skills 集成

```json
{
  "id": "read-file",
  "type": "atomic-skill",
  "implementation": {
    "type": "mcp-tool",
    "server": "filesystem",
    "tool": "read_file"
  }
}
```

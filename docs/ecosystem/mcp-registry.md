# MCP (Model Context Protocol) Registry

The open standard for connecting AI assistants to external tools and data sources.

## 🌐 Languages
- [English](mcp-registry.md) | [中文](mcp-registry_zh.md)

---

## Overview

**Model Context Protocol (MCP)** is an open protocol developed by Anthropic that standardizes how AI assistants connect to external tools, data sources, and services.

### What is MCP?

MCP provides:
- **Standardized Integration**: Universal protocol for AI-tool connections
- **Security**: Built-in authentication and permission controls
- **Flexibility**: Works with any AI model or application
- **Ecosystem**: Growing library of official and community servers

---

## Core Concepts

### MCP Server

A server that exposes capabilities via MCP:
- **Resources**: Data sources (files, databases, APIs)
- **Tools**: Functions the AI can call
- **Prompts**: Reusable prompt templates

### MCP Client

Applications that connect to MCP servers:
- Claude Desktop
- IDE plugins
- Custom applications

### Protocol Flow

```
┌─────────────┐     MCP Protocol      ┌─────────────┐
│   Client    │ ←──────────────────→ │   Server    │
│  (Claude)   │   JSON-RPC + SSE     │  (Tools)    │
└─────────────┘                      └─────────────┘
```

---

## Official MCP Servers

### Development Tools

| Server | Description | Installation |
|--------|-------------|--------------|
| [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) | Read/write local files | `npx @modelcontextprotocol/server-filesystem` |
| [Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) | Git operations | `npx @modelcontextprotocol/server-git` |
| [GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/github) | GitHub API access | `npx @modelcontextprotocol/server-github` |
| [PostgreSQL](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) | Database queries | `npx @modelcontextprotocol/server-postgres` |
| [SQLite](https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite) | SQLite operations | `npx @modelcontextprotocol/server-sqlite` |

### Productivity

| Server | Description | Use Case |
|--------|-------------|----------|
| [Slack](https://github.com/modelcontextprotocol/servers/tree/main/src/slack) | Slack integration | Team communication |
| [Google Drive](https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive) | File access | Document analysis |
| [Brave Search](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search) | Web search | Research |
| [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) | HTTP requests | API calls |

---

## Getting Started

### With Claude Desktop

#### 1. Install Claude Desktop

Download from [claude.ai/download](https://claude.ai/download)

#### 2. Configure MCP Servers

Edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/workspace"]
    },
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "/path/to/repo"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

#### 3. Location

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

#### 4. Restart Claude

After configuration, restart Claude Desktop to load the servers.

---

## Using MCP in Development

### Example: Code Analysis Workflow

```
User: "Analyze the codebase in ~/projects/myapp"

Claude uses:
1. filesystem server → Read project structure
2. git server → Get commit history
3. GitHub server → Check for open issues
4. Analyzes and provides comprehensive report
```

### Example: Database Queries

```
User: "What are the top 10 customers by revenue?"

Claude uses PostgreSQL server:
- Connects to configured database
- Executes safe, read-only query
- Returns formatted results
```

---

## Building MCP Servers

### Python Example

```python
from mcp.server import Server
from mcp.types import Resource, Tool

app = Server("my-custom-server")

@app.list_resources()
async def list_resources() -> list[Resource]:
    return [
        Resource(
            uri="docs://readme",
            name="Project README",
            mimeType="text/markdown"
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list:
    if name == "search_code":
        query = arguments["query"]
        # Implementation
        return [TextContent(type="text", text=results)]

# Run server
app.run()
```

### TypeScript Example

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'my-server',
  version: '1.0.0'
}, {
  capabilities: {
    resources: {},
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: 'analyze_code',
      description: 'Analyze code for issues',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string' }
        }
      }
    }]
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## MCP + Skills4Coder Integration

### Skill Mapping

| Skills4Coder Skill | MCP Server | Capability |
|-------------------|------------|------------|
| Code Review | Git + GitHub | PR analysis, issue tracking |
| Database Design | PostgreSQL/SQLite | Schema analysis, query optimization |
| Documentation | Filesystem | Doc generation, file analysis |
| Testing | Filesystem + Git | Test coverage analysis |
| Architecture | Multiple | System design with real data |

### Development Environment Setup

```json
{
  "mcpServers": {
    "dev-filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", 
        "~/projects",
        "~/.config"]
    },
    "project-git": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "~/projects/current"]
    },
    "local-db": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", 
        "postgresql://localhost/devdb"]
    }
  }
}
```

---

## Security Considerations

### Best Practices

1. **Token Management**
   - Use environment variables for secrets
   - Rotate tokens regularly
   - Scope tokens minimally

2. **Permission Control**
   - Read-only access where possible
   - Validate all inputs
   - Log sensitive operations

3. **Server Verification**
   - Use official servers when possible
   - Audit community servers
   - Review code before running

---

## Resources

### Official
- [MCP Documentation](https://modelcontextprotocol.io)
- [Protocol Specification](https://spec.modelcontextprotocol.io)
- [Server Repository](https://github.com/modelcontextprotocol/servers)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

### Community
- [Awesome MCP](https://github.com/modelcontextprotocol/awesome-mcp)
- [Community Servers](https://github.com/modelcontextprotocol/servers/tree/main#community-servers)
- [Discord](https://discord.gg/anthropic)

---

## Comparison

| Feature | MCP | SkillHub | Claw Hub |
|---------|-----|----------|----------|
| Protocol | ✅ Standard | Proprietary | Plugin-based |
| Vendor Lock-in | None | Tencent | Limited |
| Self-Host | ✅ Yes | Limited | ✅ Yes |
| Cross-Platform | ✅ Universal | Tencent Cloud | Web/Mobile |
| Enterprise | ✅ Ready | Strong | Growing |

---

**Next**: Explore [GitHub Copilot](./github-copilot.md) integration.

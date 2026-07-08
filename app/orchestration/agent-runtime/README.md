# Agent Runtime

Agent 运行时 - 执行 Agent 的核心引擎。

## 功能

- Role 加载和验证
- Skill 编排和执行
- 原子技能调用
- 上下文管理
- 记忆持久化
- 工作流执行

## 架构

```
┌─────────────────────────────────────────────┐
│              Agent Runtime                   │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────┐   │
│  │ Role Loader │  │ Skill Orchestrator  │   │
│  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────┐   │
│  │  LLM Client │  │  Memory Manager     │   │
│  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐│
│  │      Atomic Skill Dispatcher           ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐   ││
│  │  │MCP Tool │ │ Native  │ │  API    │   ││
│  │  └─────────┘ └─────────┘ └─────────┘   ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

## 使用示例

```javascript
import { AgentRuntime } from 'skills4coder/orchestration/agent-runtime';

const runtime = new AgentRuntime({
  llm: {
    provider: 'openai',
    model: 'gpt-4'
  },
  mcpServers: [
    { name: 'filesystem', command: 'npx @modelcontextprotocol/server-filesystem' },
    { name: 'git', command: 'npx @modelcontextprotocol/server-git' }
  ]
});

// 加载 Role
const role = await runtime.loadRole('senior-frontend-dev');

// 创建 Agent
const agent = runtime.createAgent(role);

// 执行 Skill
const result = await agent.execute('code-review', {
  filePath: './src/app.tsx'
});
```

## 配置

```typescript
interface RuntimeConfig {
  llm: {
    provider: 'openai' | 'anthropic' | 'custom';
    model: string;
    apiKey?: string;
    baseURL?: string;
  };
  mcpServers?: MCPServerConfig[];
  memory?: {
    type: 'in-memory' | 'redis' | 'file';
    config?: any;
  };
  sandbox?: {
    enabled: boolean;
    allowedPaths?: string[];
    blockedPaths?: string[];
  };
}
```

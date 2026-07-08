/**
 * MCP Server - 使用 @modelcontextprotocol/sdk 实现真实的 MCP 协议交互
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

export interface MCPServerConfig {
  name: string;
  tools?: Tool[];
  command?: string;
  env?: Record<string, string>;
}

export interface MCPToolHandler {
  (args: any): Promise<any>;
}

/**
 * MCP Server - 真实的 MCP 服务器实现
 */
export class MCPServer {
  private config: MCPServerConfig;
  private server: Server;
  private connected: boolean = false;
  private toolHandlers: Map<string, MCPToolHandler>;

  constructor(config: MCPServerConfig) {
    this.config = config;
    this.toolHandlers = new Map();

    this.server = new Server(
      {
        name: config.name || 'mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  /**
   * 设置 MCP 请求处理器
   */
  private setupHandlers(): void {
    // 列出工具处理器
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = this.config.tools || [];
      return { tools };
    });

    // 调用工具处理器
    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;

      if (!this.connected) {
        throw new Error(`MCP server ${this.config.name} is not connected`);
      }

      const handler = this.toolHandlers.get(name);
      if (!handler) {
        throw new Error(`Tool ${name} not found`);
      }

      try {
        const result = await handler(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * 注册工具处理器
   */
  registerTool(name: string, description: string, inputSchema: any, handler: MCPToolHandler): void {
    this.toolHandlers.set(name, handler);

    // 添加到 MCP 工具列表
    if (!this.config.tools) {
      this.config.tools = [];
    }

    this.config.tools.push({
      name,
      description,
      inputSchema,
    });

    console.log(`[MCP] Registered tool: ${name}`);
  }

  /**
   * 连接服务器
   */
  async connect(): Promise<void> {
    if (this.connected) return;

    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    this.connected = true;
    console.log(`[MCP] ${this.config.name} connected (stdio transport)`);
  }

  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    if (!this.connected) return;

    await this.server.close();
    this.connected = false;
    console.log(`[MCP] ${this.config.name} disconnected`);
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * 调用工具
   */
  async callTool(tool: string, args: any): Promise<any> {
    if (!this.connected) {
      throw new Error(`MCP server ${this.config.name} is not connected`);
    }

    const handler = this.toolHandlers.get(tool);
    if (!handler) {
      throw new Error(`Tool ${tool} not found`);
    }

    return handler(args);
  }

  /**
   * 获取可用工具列表
   */
  getTools(): Tool[] {
    return this.config.tools || [];
  }

  /**
   * 获取服务器状态
   */
  getStatus(): any {
    return {
      name: this.config.name,
      connected: this.connected,
      toolsCount: this.toolHandlers.size,
    };
  }
}

/**
 * MCP Server Manager - 管理多个 MCP 服务器
 */
export interface MCPServerManagerConfig {
  servers: Array<{
    name: string;
    command?: string;
    enabled?: boolean;
    env?: Record<string, string>;
    tools?: Tool[];
  }>;
}

export class MCPServerManager {
  private config: MCPServerManagerConfig;
  private servers: Map<string, MCPServer> = new Map();

  constructor(config: MCPServerManagerConfig) {
    this.config = config;
  }

  /**
   * 连接所有启用的服务器
   */
  async connectAll(): Promise<void> {
    for (const serverConfig of this.config.servers) {
      if (serverConfig.enabled !== false) {
        const server = new MCPServer({
          name: serverConfig.name,
          command: serverConfig.command,
          env: serverConfig.env,
          tools: serverConfig.tools,
        });

        await server.connect();
        this.servers.set(serverConfig.name, server);
      }
    }
  }

  /**
   * 获取服务器
   */
  getServer(name: string): MCPServer | undefined {
    return this.servers.get(name);
  }

  /**
   * 获取所有服务器状态
   */
  getStatus(): Array<any> {
    return Array.from(this.servers.entries()).map(([name, server]) => ({
      name,
      ...server.getStatus(),
    }));
  }

  /**
   * 调用工具
   */
  async callTool(serverName: string, toolName: string, args: any): Promise<any> {
    const server = this.servers.get(serverName);
    if (!server) {
      throw new Error(`MCP server ${serverName} not found`);
    }
    return server.callTool(toolName, args);
  }

  /**
   * 注册工具到指定服务器
   */
  registerTool(
    serverName: string,
    name: string,
    description: string,
    inputSchema: any,
    handler: MCPToolHandler
  ): void {
    const server = this.servers.get(serverName);
    if (!server) {
      throw new Error(`MCP server ${serverName} not found`);
    }
    server.registerTool(name, description, inputSchema, handler);
  }

  /**
   * 断开所有服务器
   */
  async disconnectAll(): Promise<void> {
    for (const [, server] of this.servers) {
      await server.disconnect();
    }
    this.servers.clear();
  }
}
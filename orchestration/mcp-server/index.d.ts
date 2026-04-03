/**
 * MCP Server Stub - 简化版 MCP 服务器包装器
 */
export interface MCPServerConfig {
    name: string;
    tools?: string[];
    command?: string;
    env?: Record<string, string>;
}
export declare class MCPServer {
    private config;
    private connected;
    constructor(config: MCPServerConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    callTool(tool: string, args: any): Promise<any>;
}
export interface MCPServerManagerConfig {
    servers: Array<{
        name: string;
        command?: string;
        enabled?: boolean;
        env?: Record<string, string>;
    }>;
}
export declare class MCPServerManager {
    private config;
    private servers;
    constructor(config: MCPServerManagerConfig);
    connectAll(): Promise<void>;
    getTools(): any[];
    callTool(serverName: string, toolName: string, args: any): Promise<any>;
    register(config: any): void;
}
//# sourceMappingURL=index.d.ts.map
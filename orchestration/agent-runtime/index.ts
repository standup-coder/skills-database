/**
 * Agent Runtime Stub
 */

export interface AgentRuntimeConfig {
  name?: string;
}

export class AgentRuntime {
  private config: AgentRuntimeConfig;

  constructor(config: AgentRuntimeConfig = {}) {
    this.config = config;
  }

  start(): void {
    console.log(`[AgentRuntime] ${this.config.name || 'default'} started (stub)`);
  }

  stop(): void {
    console.log(`[AgentRuntime] ${this.config.name || 'default'} stopped (stub)`);
  }
}

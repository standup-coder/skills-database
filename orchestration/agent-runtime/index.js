/**
 * Agent Runtime Stub
 */
export class AgentRuntime {
    config;
    constructor(config = {}) {
        this.config = config;
    }
    start() {
        console.log(`[AgentRuntime] ${this.config.name || 'default'} started (stub)`);
    }
    stop() {
        console.log(`[AgentRuntime] ${this.config.name || 'default'} stopped (stub)`);
    }
}
//# sourceMappingURL=index.js.map
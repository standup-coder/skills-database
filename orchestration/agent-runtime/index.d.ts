/**
 * Agent Runtime - 真正的 Agent 运行时
 * 负责加载技能定义、执行工作流、管理工具调用
 */
import { EventEmitter } from 'events';
export interface AgentRuntimeConfig {
    name?: string;
    skillsDir?: string;
    atomicSkillsDir?: string;
    tools?: Record<string, Function>;
    maxConcurrent?: number;
    debug?: boolean;
}
export interface SkillExecutionContext {
    skillId: string;
    inputs: any;
    agentId: string;
    roleId: string;
}
export interface SkillResult {
    success: boolean;
    output: any;
    error?: string;
    duration: number;
}
export interface ExecutionEvent {
    type: 'skill:start' | 'skill:complete' | 'skill:error' | 'step:start' | 'step:complete' | 'step:error';
    payload: any;
}
export declare class AgentRuntime extends EventEmitter {
    private config;
    private skillsDir;
    private atomicSkillsDir;
    private tools;
    private runningSkills;
    constructor(config?: AgentRuntimeConfig);
    private resolveDefaultDir;
    /**
     * 注册工具函数
     */
    registerTool(name: string, fn: Function): void;
    /**
     * 注册多个工具
     */
    registerTools(tools: Record<string, Function>): void;
    /**
     * 获取工具
     */
    getTool(name: string): Function | undefined;
    /**
     * 列出所有可用工具
     */
    listTools(): string[];
    /**
     * 执行技能
     */
    executeSkill(context: SkillExecutionContext): Promise<SkillResult>;
    /**
     * 执行复合技能（加载工作流）
     */
    private executeCompositeSkill;
    /**
     * 执行原子技能
     */
    private executeAtomicSkill;
    /**
     * 执行 LLM 步骤
     */
    private executeLlmStep;
    /**
     * 执行转换步骤
     */
    private executeTransformStep;
    /**
     * 评估条件
     */
    private evaluateCondition;
    /**
     * 验证输入
     */
    private validateInput;
    /**
     * 检查安全约束
     */
    private checkConstraints;
    /**
     * 启动运行时
     */
    start(): void;
    /**
     * 停止运行时
     */
    stop(): void;
    /**
     * 获取运行时状态
     */
    getStatus(): any;
}
//# sourceMappingURL=index.d.ts.map
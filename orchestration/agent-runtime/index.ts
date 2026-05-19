/**
 * Agent Runtime - 真正的 Agent 运行时
 * 负责加载技能定义、执行工作流、管理工具调用
 */

import { EventEmitter } from 'events';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { resolveTemplate } from '../utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

export class AgentRuntime extends EventEmitter {
  private config: Required<AgentRuntimeConfig>;
  private skillsDir: string;
  private atomicSkillsDir: string;
  private tools: Map<string, Function>;
  private runningSkills: Set<string>;

  constructor(config: AgentRuntimeConfig = {}) {
    super();
    this.config = {
      name: config.name || 'agent-runtime',
      skillsDir: config.skillsDir || this.resolveDefaultDir('skills'),
      atomicSkillsDir: config.atomicSkillsDir || this.resolveDefaultDir('atomic-skills'),
      tools: config.tools || {},
      maxConcurrent: config.maxConcurrent || 5,
      debug: config.debug || false
    };
    this.skillsDir = this.config.skillsDir;
    this.atomicSkillsDir = this.config.atomicSkillsDir;
    this.tools = new Map(Object.entries(this.config.tools));
    this.runningSkills = new Set();
  }

  private resolveDefaultDir(subDir: string): string {
    const projectRoot = join(__dirname, '..', '..');
    const path = join(projectRoot, subDir);
    if (existsSync(path)) return path;
    return join(__dirname, '..', '..', subDir);
  }

  /**
   * 注册工具函数
   */
  registerTool(name: string, fn: Function): void {
    this.tools.set(name, fn);
    if (this.config.debug) {
      console.log(`[AgentRuntime] Registered tool: ${name}`);
    }
  }

  /**
   * 注册多个工具
   */
  registerTools(tools: Record<string, Function>): void {
    for (const [name, fn] of Object.entries(tools)) {
      this.registerTool(name, fn);
    }
  }

  /**
   * 获取工具
   */
  getTool(name: string): Function | undefined {
    return this.tools.get(name);
  }

  /**
   * 列出所有可用工具
   */
  listTools(): string[] {
    return Array.from(this.tools.keys());
  }

  /**
   * 执行技能
   */
  async executeSkill(context: SkillExecutionContext): Promise<SkillResult> {
    const startTime = Date.now();
    const { skillId, inputs, agentId } = context;

    this.emit('skill:start', { skillId, agentId, inputs });
    this.runningSkills.add(skillId);

    try {
      // 首先尝试加载 composite skill
      const compositePath = join(this.skillsDir, `${skillId}.json`);
      if (existsSync(compositePath)) {
        const result = await this.executeCompositeSkill(skillId, inputs, agentId);
        this.runningSkills.delete(skillId);
        this.emit('skill:complete', { skillId, agentId, result, duration: Date.now() - startTime });
        return result;
      }

      // 然后尝试 atomic skill
      const atomicPath = join(this.atomicSkillsDir, `${skillId}.json`);
      if (existsSync(atomicPath)) {
        const result = await this.executeAtomicSkill(skillId, inputs);
        this.runningSkills.delete(skillId);
        this.emit('skill:complete', { skillId, agentId, result, duration: Date.now() - startTime });
        return result;
      }

      // Skill not found
      throw new Error(`Skill not found: ${skillId}`);
    } catch (error: any) {
      this.runningSkills.delete(skillId);
      this.emit('skill:error', { skillId, agentId, error: error.message, duration: Date.now() - startTime });
      return {
        success: false,
        output: null,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * 执行复合技能（加载工作流）
   */
  private async executeCompositeSkill(skillId: string, inputs: any, agentId: string): Promise<SkillResult> {
    const skillPath = join(this.skillsDir, `${skillId}.json`);
    const content = readFileSync(skillPath, 'utf-8');
    const skillDef = JSON.parse(content);

    const results: Record<string, any> = { inputs };

    for (const step of skillDef.workflow.steps) {
      this.emit('step:start', { step: step.id, skillId, agentId });

      try {
        // 检查条件
        if (step.condition) {
          const conditionMet = this.evaluateCondition(step.condition, results);
          if (!conditionMet) {
            this.emit('step:skip', { step: step.id, reason: 'condition_not_met' });
            continue;
          }
        }

        // 解析输入模板
        const stepInputs = resolveTemplate(step.input, results);

        let stepOutput: any;

        if (step.atomicSkill) {
          // 执行原子技能
          const atomicResult = await this.executeAtomicSkill(step.atomicSkill, stepInputs);
          stepOutput = atomicResult.output;
        } else if (step.type === 'llm') {
          // LLM step - 调用 chat tool 或通用 LLM
          stepOutput = await this.executeLlmStep(step, stepInputs, agentId);
        } else if (step.type === 'transform') {
          // Transform step - 数据转换
          stepOutput = this.executeTransformStep(step, stepInputs);
        } else {
          stepOutput = stepInputs;
        }

        results[step.id] = stepOutput;
        this.emit('step:complete', { step: step.id, skillId, agentId, output: stepOutput });
      } catch (error: any) {
        this.emit('step:error', { step: step.id, skillId, agentId, error: error.message });

        // 错误处理策略
        if (skillDef.errorHandling?.strategy === 'stop') {
          throw error;
        } else if (skillDef.errorHandling?.strategy === 'fallback' && skillDef.errorHandling.fallback) {
          const fallbackStep = skillDef.workflow.steps.find((s: any) => s.id === skillDef.errorHandling.fallback.step);
          if (fallbackStep) {
            const resolvedInput = resolveTemplate(fallbackStep.input, results);
            const fallbackOutput = await this.executeAtomicSkill(skillDef.errorHandling.fallback.action, resolvedInput);
            results[step.id] = fallbackOutput.output;
          }
        }
        // 'continue' 策略：继续执行下一步
      }
    }

    return {
      success: true,
      output: results,
      duration: 0
    };
  }

  /**
   * 执行原子技能
   */
  private async executeAtomicSkill(skillId: string, inputs: any): Promise<SkillResult> {
    const skillPath = join(this.atomicSkillsDir, `${skillId}.json`);

    if (!existsSync(skillPath)) {
      throw new Error(`Atomic skill not found: ${skillId}`);
    }

    const content = readFileSync(skillPath, 'utf-8');
    const skillDef = JSON.parse(content);

    // 验证输入
    this.validateInput(inputs, skillDef.input?.schema || { required: [] });

    // 安全约束检查
    this.checkConstraints(inputs, skillDef.constraints);

    const impl = skillDef.implementation;

    switch (impl.type) {
      case 'native': {
        const tool = this.tools.get(impl.function || skillId);
        if (tool) {
          const output = await tool(inputs);
          return { success: true, output, duration: 0 };
        }
        // Fall through to mock if no tool registered
        return { success: true, output: { result: `Executed native: ${impl.function || skillId}` }, duration: 0 };
      }

      case 'mcp-tool': {
        // MCP tool execution would go through MCPServerManager
        // For now, return mock result
        return { success: true, output: { result: `MCP tool: ${impl.tool}` }, duration: 0 };
      }

      case 'api': {
        // API-based skill
        return { success: true, output: { result: `API: ${impl.endpoint}` }, duration: 0 };
      }

      default:
        return { success: true, output: inputs, duration: 0 };
    }
  }

  /**
   * 执行 LLM 步骤
   */
  private async executeLlmStep(step: any, inputs: any, agentId: string): Promise<any> {
    // 获取 chat 工具
    const chatTool = this.tools.get('chat') || this.tools.get('llm');
    if (chatTool) {
      return await chatTool({
        prompt: step.prompt || `Execute step: ${step.name}`,
        context: inputs,
        agentId
      });
    }

    // 无 LLM 工具时返回占位结果
    return {
      step: step.id,
      type: 'llm',
      output: `LLM result for ${step.name}`,
      inputs
    };
  }

  /**
   * 执行转换步骤
   */
  private executeTransformStep(step: any, inputs: any): any {
    // 数据转换占位
    return {
      step: step.id,
      type: 'transform',
      output: inputs,
      transformed: true
    };
  }

  /**
   * 评估条件
   */
  private evaluateCondition(condition: string | Function, context: Record<string, any>): boolean {
    if (typeof condition === 'function') {
      return condition(context);
    }

    // 简单条件解析：检查是否包含某值
    if (typeof condition === 'string' && condition.includes('includes')) {
      const match = condition.match(/(\w+)\.includes\(["'](\w+)["']\)/);
      if (match) {
        const [obj, val] = [context[match[1]], match[2]];
        return Array.isArray(obj) && obj.includes(val);
      }
    }

    return true;
  }

  /**
   * 验证输入
   */
  private validateInput(inputs: any, schema: any): void {
    const required = schema.required || [];
    for (const key of required) {
      if (!(key in inputs)) {
        throw new Error(`Missing required input: ${key}`);
      }
    }
  }

  /**
   * 检查安全约束
   */
  private checkConstraints(inputs: any, constraints: any): void {
    if (!constraints) return;

    if (constraints.blockedPaths && inputs.path) {
      for (const blocked of constraints.blockedPaths) {
        if (inputs.path.includes(blocked.replace('**/', ''))) {
          throw new Error(`Path ${inputs.path} is blocked by security policy`);
        }
      }
    }
  }

  /**
   * 启动运行时
   */
  start(): void {
    console.log(`[AgentRuntime] ${this.config.name} started`);
    console.log(`[AgentRuntime] Skills dir: ${this.skillsDir}`);
    console.log(`[AgentRuntime] Atomic skills dir: ${this.atomicSkillsDir}`);
    console.log(`[AgentRuntime] Tools registered: ${this.listTools().join(', ') || 'none'}`);
  }

  /**
   * 停止运行时
   */
  stop(): void {
    console.log(`[AgentRuntime] ${this.config.name} stopped`);
  }

  /**
   * 获取运行时状态
   */
  getStatus(): any {
    return {
      name: this.config.name,
      runningSkills: Array.from(this.runningSkills),
      toolsCount: this.tools.size,
      skillsDir: this.skillsDir,
      atomicSkillsDir: this.atomicSkillsDir
    };
  }
}
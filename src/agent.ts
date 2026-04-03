/**
 * Agent 类 - 执行具体任务的智能体
 */

import type { AgentConfig, Role as RoleType, CompositeSkill, AtomicSkill, WorkflowConfig } from './types.js';
import { Role } from './role.js';

export interface ExecutionResult {
  success: boolean;
  data?: any;
  error?: Error;
  metadata: {
    skillId: string;
    startTime: Date;
    endTime: Date;
    tokenUsage?: number;
  };
}

export class Agent {
  private role: Role;
  private llm: string;
  private tools: any[];
  private memory: Map<string, any>;
  private debug: boolean;

  constructor(config: AgentConfig) {
    this.role = config.role instanceof Role ? config.role : Role.fromObject(config.role as RoleType);
    this.llm = config.llm || 'gpt-4';
    this.tools = config.tools || [];
    this.memory = new Map();
    this.debug = config.debug || false;
  }

  /**
   * 执行复合技能
   */
  async use(skillId: string, inputs: any): Promise<any> {
    if (this.debug) {
      console.log(`[Agent:${this.role.name}] Executing skill: ${skillId}`);
    }

    // 检查 Role 是否具备该技能
    if (!this.role.hasSkill(skillId)) {
      throw new Error(`Role ${this.role.id} does not have skill: ${skillId}`);
    }

    // 模拟执行（实际实现需要加载 skill 定义并执行工作流）
    const startTime = Date.now();
    
    try {
      // 这里会加载 skill 定义并执行
      const result = await this.executeSkill(skillId, inputs);
      
      // 保存到记忆
      this.memory.set(`skill:${skillId}`, {
        inputs,
        result,
        timestamp: new Date()
      });

      if (this.debug) {
        console.log(`[Agent:${this.role.name}] Skill ${skillId} completed in ${Date.now() - startTime}ms`);
      }

      return result;
    } catch (error) {
      if (this.debug) {
        console.error(`[Agent:${this.role.name}] Skill ${skillId} failed:`, error);
      }
      throw error;
    }
  }

  /**
   * 执行原子技能
   */
  async atomic(skillId: string, inputs: any): Promise<any> {
    if (this.debug) {
      console.log(`[Agent:${this.role.name}] Executing atomic skill: ${skillId}`);
    }

    // 模拟原子技能执行
    return {
      success: true,
      data: { result: `Executed ${skillId}` },
      metadata: {
        skillId,
        startTime: new Date(),
        endTime: new Date()
      }
    };
  }

  /**
   * 执行具体技能（内部方法）
   */
  private async executeSkill(skillId: string, inputs: any): Promise<any> {
    // 模拟不同技能的返回
    const skillOutputs: Record<string, any> = {
      'code-review': {
        score: 85,
        approval: 'comment',
        issues: [
          { severity: 'medium', category: 'performance', line: 23, message: 'Consider memoizing this component' }
        ],
        suggestions: ['Use React.memo for better performance']
      },
      'api-design': {
        openapi_spec: { /* ... */ },
        endpoints: ['/api/users', '/api/auth']
      },
      'architecture-design': {
        architecture: 'microservices',
        components: ['api-gateway', 'user-service', 'auth-service']
      }
    };

    // 返回模拟结果或通用结果
    return skillOutputs[skillId] || {
      success: true,
      skill: skillId,
      inputs,
      output: `Result from ${skillId}`
    };
  }

  /**
   * 聊天交互
   */
  async chat(message: string): Promise<string> {
    // 模拟 LLM 对话
    return `[${this.role.name}] 收到消息: "${message}"\n\n基于我的专业能力，我可以帮助你完成相关工作。请告诉我具体需求。`;
  }

  /**
   * 流式执行
   */
  async *stream(skillId: string, inputs: any): AsyncGenerator<any> {
    yield { type: 'start', skill: skillId };
    
    // 模拟流式输出
    const chunks = ['Analyzing...', 'Processing...', 'Generating...', 'Done!'];
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, 100));
      yield { type: 'chunk', content: chunk };
    }
    
    yield { type: 'end', result: await this.use(skillId, inputs) };
  }

  /**
   * 批量执行
   */
  async batch(skillId: string, inputsArray: any[]): Promise<any[]> {
    return Promise.all(inputsArray.map(inputs => this.use(skillId, inputs)));
  }

  /**
   * 获取记忆
   */
  getMemory(key: string): any {
    return this.memory.get(key);
  }

  /**
   * 生成报告
   */
  generateReport(): any {
    return {
      role: this.role.id,
      memorySize: this.memory.size,
      skillsAvailable: [...this.role.mainSkills, ...this.role.atomicSkills],
      recentExecutions: Array.from(this.memory.entries())
        .filter(([k]) => k.startsWith('skill:'))
        .slice(-5)
    };
  }
}

/**
 * Team 类 - 多 Agent 协作团队
 */

import type { TeamConfig, TeamMemberConfig, WorkflowConfig, WorkflowStepConfig } from './types.js';
import { Agent } from './agent.js';
import { Role } from './role.js';
import { EventEmitter } from 'events';

export interface TeamExecutionResult {
  success: boolean;
  outputs: any[];
  completedSteps: number;
  totalSteps: number;
  tokenUsage: { total: number };
  metrics: {
    codeLines: number;
    duration: number;
  };
}

export class Team extends EventEmitter {
  private config: TeamConfig;
  private agents: Map<string, Agent>;

  constructor(config: TeamConfig) {
    super();
    this.config = config;
    this.agents = new Map();
    this.initializeAgents();
  }

  private initializeAgents(): void {
    for (const member of this.config.members) {
      const agentId = member.id || member.role.id;
      const agent = new Agent({
        role: member.role,
        llm: member.llm,
        tools: []
      });
      
      // 保存 Agent 名称
      (agent as any).name = member.name || agentId;
      
      this.agents.set(agentId, agent);
    }
  }

  get members(): any[] {
    return this.config.members;
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  /**
   * 协作完成任务
   */
  async collaborate(params: {
    task: string;
    requirements: string;
    deliverables: string[];
  }): Promise<any> {
    this.emit('collaboration:start', { task: params.task });

    const results: any = {};
    
    // 找到 lead agent
    const leadMember = this.config.members.find(m => m.lead);
    const leadAgent = leadMember ? this.agents.get(leadMember.id || leadMember.role.id) : this.agents.values().next().value;

    if (!leadAgent) {
      throw new Error('No agents available');
    }

    // 简化的协作流程
    for (const [agentId, agent] of this.agents) {
      this.emit('agent:start', { agent: agentId });
      
      const result = await (agent as any).use(params.task, {
        requirements: params.requirements,
        deliverables: params.deliverables
      });
      
      results[agentId] = result;
      
      this.emit('agent:complete', { agent: agentId, result });
    }

    this.emit('collaboration:end', { results });
    
    return results;
  }

  /**
   * 执行工作流
   */
  async executeWorkflow(workflow: Workflow): Promise<TeamExecutionResult> {
    const startTime = Date.now();
    const outputs: any[] = [];
    let completedSteps = 0;
    const totalSteps = workflow.steps.length;

    // 拓扑排序：根据依赖关系排序步骤
    const sortedSteps = this.topologicalSort(workflow.steps);

    for (const step of sortedSteps) {
      this.emit('step:start', { step, agent: step.agent });

      try {
        if (!step.agent) {
          throw new Error(`Step ${step.id} has no agent assigned`);
        }
        const agent = this.agents.get(step.agent);
        if (!agent) {
          throw new Error(`Agent ${step.agent} not found`);
        }

        // 解析输入（支持模板语法）
        const inputs = this.resolveInputs(step.input, outputs);

        // 执行步骤
        const result = await (agent as any).use(step.skill, inputs);

        outputs.push({
          step: step.id,
          output: step.output,
          result
        });

        completedSteps++;

        this.emit('step:complete', { 
          step, 
          agent: (agent as any).name,
          duration: Date.now() - startTime 
        });

      } catch (error) {
        this.emit('step:error', { step, agent: step.agent, error });
        
        if (workflow.config.strategy?.failFast) {
          throw error;
        }
      }
    }

    return {
      success: completedSteps === totalSteps,
      outputs,
      completedSteps,
      totalSteps,
      tokenUsage: { total: 0 }, // 实际实现需要统计
      metrics: {
        codeLines: 0,
        duration: Date.now() - startTime
      }
    };
  }

  /**
   * 调用特定 Agent
   */
  async callAgent(agentId: string, skill: string, context: any): Promise<any> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    
    return (agent as any).use(skill, context);
  }

  /**
   * 拓扑排序
   */
  private topologicalSort(steps: WorkflowStepConfig[]): WorkflowStepConfig[] {
    const visited = new Set<string>();
    const result: WorkflowStepConfig[] = [];
    const stepMap = new Map(steps.map(s => [s.id, s]));

    const visit = (step: WorkflowStepConfig) => {
      if (visited.has(step.id)) return;
      visited.add(step.id);

      // 先访问依赖
      if (step.dependsOn) {
        for (const depId of step.dependsOn) {
          const dep = stepMap.get(depId);
          if (dep) visit(dep);
        }
      }

      result.push(step);
    };

    for (const step of steps) {
      visit(step);
    }

    return result;
  }

  /**
   * 解析输入模板
   */
  private resolveInputs(input: any, outputs: any[]): any {
    if (typeof input === 'string' && input.startsWith('{{') && input.endsWith('}}')) {
      // 解析模板 {{steps.stepId.output}}
      const path = input.slice(2, -2).split('.');
      // 简化的解析逻辑
      return input;
    }
    
    if (Array.isArray(input)) {
      return input.map(i => this.resolveInputs(i, outputs));
    }
    
    if (typeof input === 'object') {
      const resolved: any = {};
      for (const [key, value] of Object.entries(input)) {
        resolved[key] = this.resolveInputs(value, outputs);
      }
      return resolved;
    }
    
    return input;
  }
}

/**
 * Workflow 类
 */
export class Workflow extends EventEmitter {
  config: WorkflowConfig;
  steps: WorkflowStepConfig[];

  constructor(config: WorkflowConfig) {
    super();
    this.config = config;
    this.steps = config.steps;
  }

  async execute(context: any): Promise<any> {
    this.emit('workflow:start', { name: this.config.name });
    
    // 实际执行逻辑在 Team.executeWorkflow 中
    
    this.emit('workflow:end', { name: this.config.name });
    return { success: true };
  }
}

/**
 * 工作流类
 */

import { EventEmitter } from 'events';
import type { WorkflowConfig, WorkflowStepConfig } from './types.js';
import { topologicalSort, resolveTemplate, type JsonValue } from './utils.js';

export interface WorkflowContext {
  [key: string]: JsonValue;
}

export interface WorkflowResult {
  success: boolean;
  results: Record<string, unknown>;
}

export class Workflow extends EventEmitter {
  private config: WorkflowConfig;
  private context: WorkflowContext;
  private results: Map<string, unknown>;

  constructor(config: WorkflowConfig, initialContext: WorkflowContext = {}) {
    super();
    this.config = config;
    this.context = initialContext;
    this.results = new Map();
  }

  get name(): string {
    return this.config.name;
  }

  get steps(): WorkflowStepConfig[] {
    return this.config.steps;
  }

  get strategy() {
    return this.config.strategy;
  }

  /**
   * 执行工作流
   */
  async execute(): Promise<WorkflowResult> {
    this.emit('start', { workflow: this.config.name });

    const sortedSteps = topologicalSort(this.steps);
    
    for (const step of sortedSteps) {
      this.emit('step:start', { step: step.id });

      try {
        // 检查条件
        if (step.condition && !this.evaluateCondition(step.condition)) {
          this.emit('step:skip', { step: step.id, reason: 'condition_not_met' });
          continue;
        }

        // 解析输入
        const inputs = resolveTemplate(step.input as JsonValue, this.context);

        // 执行步骤（这里应该调用实际的 agent）
        const result = await this.executeStep(step, inputs);
        
        this.results.set(step.id, result);
        
        this.emit('step:complete', { step: step.id, result });

      } catch (error) {
        this.emit('step:error', { step: step.id, error });
        
        if (this.config.strategy?.failFast) {
          throw error;
        }
      }
    }

    this.emit('end', { workflow: this.config.name, results: this.results });

    return {
      success: true,
      results: Object.fromEntries(this.results)
    };
  }

  /**
   * 评估条件
   */
  private evaluateCondition(condition: string | ((context: WorkflowContext) => boolean)): boolean {
    if (typeof condition === 'function') {
      return condition(this.context);
    }
    
    // 简化的条件评估
    if (condition.includes('includes')) {
      // 处理 context.includes('xxx')
      return true;
    }
    
    return true;
  }

  /**
   * 执行单个步骤
   */
  private async executeStep(step: WorkflowStepConfig, inputs: unknown): Promise<{
    step: string;
    skill: string;
    inputs: unknown;
    output: string;
    timestamp: Date;
  }> {
    // 这里应该调用实际的 agent 执行
    // 目前是模拟实现
    return {
      step: step.id,
      skill: step.skill,
      inputs,
      output: `Executed ${step.skill}`,
      timestamp: new Date()
    };
  }
}

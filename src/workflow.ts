/**
 * 工作流类
 */

import type { WorkflowConfig, WorkflowStepConfig } from './types.js';
import { EventEmitter } from 'events';

export interface WorkflowContext {
  [key: string]: any;
}

export class Workflow extends EventEmitter {
  private config: WorkflowConfig;
  private context: WorkflowContext;
  private results: Map<string, any>;

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

  /**
   * 执行工作流
   */
  async execute(): Promise<any> {
    this.emit('start', { workflow: this.config.name });

    const sortedSteps = this.topologicalSort(this.steps);
    
    for (const step of sortedSteps) {
      this.emit('step:start', { step: step.id });

      try {
        // 检查条件
        if (step.condition && !this.evaluateCondition(step.condition)) {
          this.emit('step:skip', { step: step.id, reason: 'condition_not_met' });
          continue;
        }

        // 解析输入
        const inputs = this.resolveTemplate(step.input);

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
   * 拓扑排序步骤
   */
  private topologicalSort(steps: WorkflowStepConfig[]): WorkflowStepConfig[] {
    const visited = new Set<string>();
    const result: WorkflowStepConfig[] = [];
    const stepMap = new Map(steps.map(s => [s.id, s]));

    const visit = (step: WorkflowStepConfig) => {
      if (visited.has(step.id)) return;
      visited.add(step.id);

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
   * 解析模板变量
   */
  private resolveTemplate(template: any): any {
    if (typeof template === 'string') {
      // 解析 {{variable}} 语法
      if (template.startsWith('{{') && template.endsWith('}}')) {
        const path = template.slice(2, -2).trim();
        return this.getValueByPath(path);
      }
      return template;
    }

    if (Array.isArray(template)) {
      return template.map(item => this.resolveTemplate(item));
    }

    if (typeof template === 'object' && template !== null) {
      const resolved: any = {};
      for (const [key, value] of Object.entries(template)) {
        resolved[key] = this.resolveTemplate(value);
      }
      return resolved;
    }

    return template;
  }

  /**
   * 根据路径获取值
   */
  private getValueByPath(path: string): any {
    const parts = path.split('.');
    
    if (parts[0] === 'context') {
      return parts.slice(1).reduce((obj, key) => obj?.[key], this.context);
    }
    
    if (parts[0] === 'steps' && parts.length >= 2) {
      const stepId = parts[1];
      const stepResult = this.results.get(stepId);
      if (parts.length > 2) {
        return parts.slice(2).reduce((obj, key) => obj?.[key], stepResult);
      }
      return stepResult;
    }
    
    return path;
  }

  /**
   * 评估条件
   */
  private evaluateCondition(condition: string | Function): boolean {
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
  private async executeStep(step: WorkflowStepConfig, inputs: any): Promise<any> {
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

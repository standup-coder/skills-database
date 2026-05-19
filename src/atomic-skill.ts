/**
 * 原子技能类
 */

import { readFileSync } from 'fs';
import type { AtomicSkill as AtomicSkillType } from './types.js';

export class AtomicSkill {
  private data: AtomicSkillType;

  constructor(data: AtomicSkillType) {
    this.data = data;
  }

  static fromJSON(path: string): AtomicSkill {
    const content = readFileSync(path, 'utf-8');
    const data = JSON.parse(content) as AtomicSkillType;
    return new AtomicSkill(data);
  }

  get id(): string {
    return this.data.id;
  }

  get name(): string {
    return this.data.metadata.name;
  }

  get implementation(): AtomicSkillType['implementation'] {
    return this.data.implementation;
  }

  get constraints(): AtomicSkillType['constraints'] {
    return this.data.constraints;
  }

  /**
   * 验证输入参数
   */
  validateInput(input: any): boolean {
    const schema = this.data.input.schema;
    const required = schema.required || [];
    
    for (const key of required) {
      if (!(key in input)) {
        throw new Error(`Missing required input: ${key}`);
      }
    }
    
    return true;
  }

  /**
   * 检查安全约束
   */
  checkConstraints(input: any): boolean {
    const constraints = this.data.constraints;
    if (!constraints) return true;

    // 检查路径限制
    if (constraints.blockedPaths && input.path) {
      for (const blocked of constraints.blockedPaths) {
        // Handle **/ glob patterns
        const normalized = blocked.replace(/\*\*/g, '');
        if (normalized.startsWith('/')) {
          // Absolute path pattern
          const matchPart = normalized.replace(/\/$/, '');
          if (input.path.startsWith(matchPart) || input.path.includes(matchPart)) {
            throw new Error(`Path ${input.path} is blocked`);
          }
        } else {
          // Partial path match
          if (input.path.includes(blocked.replace('**/', ''))) {
            throw new Error(`Path ${input.path} is blocked`);
          }
        }
      }
    }

    return true;
  }

  toJSON(): string {
    return JSON.stringify(this.data, null, 2);
  }
}

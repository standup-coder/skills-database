/**
 * 复合技能类
 */

import { readFileSync } from 'fs';
import type { CompositeSkill as CompositeSkillType, WorkflowStep } from './types.js';

export class CompositeSkill {
  private data: CompositeSkillType;

  constructor(data: CompositeSkillType) {
    this.data = data;
  }

  static fromJSON(path: string): CompositeSkill {
    const content = readFileSync(path, 'utf-8');
    const data = JSON.parse(content) as CompositeSkillType;
    return new CompositeSkill(data);
  }

  get id(): string {
    return this.data.id;
  }

  get name(): string {
    return this.data.metadata.name;
  }

  get workflow(): { steps: WorkflowStep[] } {
    return this.data.workflow;
  }

  get requiredAtomicSkills(): string[] {
    const skills = new Set<string>();
    
    for (const step of this.data.workflow.steps) {
      if (step.atomicSkill) {
        skills.add(step.atomicSkill);
      }
    }
    
    return Array.from(skills);
  }

  validate(): boolean {
    // 验证工作流步骤的依赖关系
    const stepIds = new Set(this.data.workflow.steps.map(s => s.id));
    
    for (const step of this.data.workflow.steps) {
      if (step.dependsOn) {
        for (const depId of step.dependsOn) {
          if (!stepIds.has(depId)) {
            throw new Error(`Step ${step.id} depends on unknown step ${depId}`);
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

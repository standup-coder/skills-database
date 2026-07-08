/**
 * Role 管理类
 */

import { readFileSync, writeFileSync } from 'fs';
import type { Role as RoleType } from './types.js';

export class Role {
  private data: RoleType;

  constructor(data: RoleType) {
    this.data = data;
  }

  static fromJSON(path: string): Role {
    const content = readFileSync(path, 'utf-8');
    const data = JSON.parse(content) as RoleType;
    return new Role(data);
  }

  static fromObject(data: RoleType): Role {
    return new Role(data);
  }

  get id(): string {
    return this.data.id;
  }

  get name(): string {
    return this.data.metadata.name;
  }

  get metadata(): any {
    return this.data.metadata;
  }

  get description(): string {
    return this.data.metadata.description;
  }

  get mainSkills(): string[] {
    return this.data.capabilities.mainSkills;
  }

  get atomicSkills(): string[] {
    return this.data.capabilities.atomicSkills;
  }

  get systemPrompt(): string {
    if (!this.data.systemPrompt) {
      return `You are a ${this.name}. ${this.description}`;
    }
    
    const { role, expertise } = this.data.systemPrompt;
    return `${role}\n\nExpertise:\n${expertise.map(e => `- ${e}`).join('\n')}`;
  }

  get raw(): RoleType {
    return this.data;
  }

  hasSkill(skillId: string): boolean {
    return this.mainSkills.includes(skillId) || this.atomicSkills.includes(skillId);
  }

  toJSON(): string {
    return JSON.stringify(this.data, null, 2);
  }

  save(path: string): void {
    writeFileSync(path, this.toJSON());
  }
}

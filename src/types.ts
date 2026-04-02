/**
 * 核心类型定义
 */

// Role 定义
export interface Role {
  id: string;
  type: 'role';
  version: string;
  metadata: {
    name: string;
    nameZh?: string;
    description: string;
    descriptionZh?: string;
    author: string;
    tags: string[];
    level: 'junior' | 'mid' | 'senior' | 'lead';
  };
  jd: {
    summary: string;
    summaryZh?: string;
    responsibilities: string[];
    responsibilitiesZh?: string[];
    requirements: {
      experience?: string;
      education?: string;
      coreSkills?: string[];
    };
  };
  capabilities: {
    mainSkills: string[];
    atomicSkills: string[];
  };
  context?: Record<string, any>;
  systemPrompt?: {
    role: string;
    expertise: string[];
    communication: {
      style: string;
      language: string;
    };
  };
}

// 复合 Skill 定义
export interface CompositeSkill {
  id: string;
  type: 'composite-skill';
  version: string;
  metadata: {
    name: string;
    nameZh?: string;
    description: string;
    descriptionZh?: string;
    author: string;
    tags: string[];
    category: string;
  };
  input: {
    schema: Record<string, any>;
  };
  output: {
    schema: Record<string, any>;
  };
  workflow: {
    description: string;
    steps: WorkflowStep[];
  };
  errorHandling?: {
    strategy: 'stop' | 'continue' | 'fallback';
    fallback?: {
      step: string;
      action: string;
    };
  };
}

// 工作流步骤
export interface WorkflowStep {
  id: string;
  name: string;
  nameZh?: string;
  atomicSkill?: string;
  skill?: string;
  type?: 'llm' | 'transform' | 'api';
  input: Record<string, any>;
  output: string;
  condition?: string;
  dependsOn?: string[];
}

// 原子 Skill 定义
export interface AtomicSkill {
  id: string;
  type: 'atomic-skill';
  version: string;
  metadata: {
    name: string;
    nameZh?: string;
    description: string;
    descriptionZh?: string;
    author: string;
    tags: string[];
    category: string;
  };
  input: {
    schema: Record<string, any>;
  };
  output: {
    schema: Record<string, any>;
  };
  implementation: {
    type: 'mcp-tool' | 'native' | 'api';
    server?: string;
    tool?: string;
    function?: string;
    module?: string;
    endpoint?: string;
    method?: string;
    fallback?: any;
  };
  constraints?: {
    permissions?: string[];
    blockedPaths?: string[];
    maxFileSize?: number;
    allowedExtensions?: string[];
  };
  errors?: Record<string, {
    code: string;
    message: string;
    retryable: boolean;
  }>;
}

// Agent 配置
export interface AgentConfig {
  role: Role;
  llm?: string;
  tools?: any[];
  memory?: {
    type: 'in-memory' | 'persistent';
    store?: string;
  };
  debug?: boolean;
}

// 工作流配置
export interface WorkflowConfig {
  name: string;
  description: string;
  context?: Record<string, any>;
  steps: WorkflowStepConfig[];
  strategy?: {
    maxParallel?: number;
    failFast?: boolean;
    timeout?: string;
  };
}

export interface WorkflowStepConfig {
  id: string;
  name: string;
  agent?: string;
  skill: string;
  input?: any;
  output?: {
    path?: string;
    type?: string;
  };
  dependsOn?: string[];
  condition?: string | ((context: any) => boolean);
}

// 团队配置
export interface TeamConfig {
  name: string;
  members: TeamMemberConfig[];
}

export interface TeamMemberConfig {
  id?: string;
  role: Role;
  llm?: string;
  name?: string;
  lead?: boolean;
  condition?: (context: any) => boolean;
}

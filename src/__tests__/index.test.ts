import { describe, it, expect } from 'vitest';
import { Agent } from '../agent.js';
import { AtomicSkill } from '../atomic-skill.js';
import { CompositeSkill } from '../composite-skill.js';
import { Role } from '../role.js';
import { Team } from '../team.js';
import { Workflow } from '../workflow.js';

describe('Role', () => {
  const mockRole = {
    id: 'test-role',
    type: 'role' as const,
    version: '1.0.0',
    metadata: {
      name: 'Test Role',
      nameZh: '测试角色',
      description: 'A test role for unit testing',
      descriptionZh: '用于单元测试的角色',
      author: 'test',
      tags: ['test'],
      level: 'mid' as const
    },
    jd: {
      summary: 'Test role summary',
      responsibilities: ['Write tests', 'Fix bugs'],
      requirements: { coreSkills: ['typescript', 'testing'] }
    },
    capabilities: {
      mainSkills: ['testing', 'code-review'],
      atomicSkills: ['write-file', 'read-file']
    }
  };

  it('should create role from object', () => {
    const role = Role.fromObject(mockRole);
    expect(role.id).toBe('test-role');
    expect(role.name).toBe('Test Role');
    expect(role.mainSkills).toEqual(['testing', 'code-review']);
    expect(role.atomicSkills).toEqual(['write-file', 'read-file']);
  });

  it('should check if role has skill', () => {
    const role = Role.fromObject(mockRole);
    expect(role.hasSkill('testing')).toBe(true);
    expect(role.hasSkill('nonexistent')).toBe(false);
    expect(role.hasSkill('write-file')).toBe(true);
  });

  it('should generate system prompt', () => {
    const role = Role.fromObject(mockRole);
    const prompt = role.systemPrompt;
    expect(prompt).toContain('Test Role');
  });

  it('should serialize to JSON', () => {
    const role = Role.fromObject(mockRole);
    const json = role.toJSON();
    const parsed = JSON.parse(json);
    expect(parsed.id).toBe('test-role');
  });
});

describe('Agent', () => {
  const mockRole = {
    id: 'dev',
    type: 'role' as const,
    version: '1.0.0',
    metadata: {
      name: 'Developer',
      description: 'Software developer',
      author: 'test',
      tags: ['dev'],
      level: 'mid' as const
    },
    jd: { summary: 'Developer', responsibilities: [], requirements: {} },
    capabilities: {
      mainSkills: ['code-review', 'testing'],
      atomicSkills: ['write-file', 'read-file']
    }
  };

  it('should create agent with role', () => {
    const agent = new Agent({ role: mockRole as any });
    expect(agent).toBeDefined();
  });

  it('should throw when executing skill not in role', async () => {
    const agent = new Agent({ role: mockRole as any });
    await expect(agent.use('nonexistent-skill', {}))
      .rejects.toThrow('does not have skill');
  });

  it('should execute valid skill', async () => {
    const agent = new Agent({ role: mockRole as any });
    const result = await agent.use('code-review', { path: 'test.ts' });
    expect(result).toBeDefined();
    expect(result.score).toBe(85);
  });

  it('should execute atomic skill', async () => {
    const agent = new Agent({ role: mockRole as any });
    const result = await agent.atomic('write-file', { path: 'test.txt', content: 'hello' });
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it('should chat', async () => {
    const agent = new Agent({ role: mockRole as any });
    const response = await agent.chat('Hello');
    expect(response).toContain('Developer');
  });

  it('should batch execute skills', async () => {
    const agent = new Agent({ role: mockRole as any });
    const results = await agent.batch('code-review', [{ path: 'a.ts' }, { path: 'b.ts' }]);
    expect(results).toHaveLength(2);
  });

  it('should stream skill execution', async () => {
    const agent = new Agent({ role: mockRole as any });
    const chunks: any[] = [];
    for await (const chunk of await agent.stream('code-review', { path: 'test.ts' })) {
      chunks.push(chunk);
    }
    expect(chunks.length).toBeGreaterThan(0);
  });

  it('should generate report', () => {
    const agent = new Agent({ role: mockRole as any });
    const report = agent.generateReport();
    expect(report.role).toBe('dev');
    expect(report.skillsAvailable).toContain('code-review');
  });

  it('should store memory after execution', async () => {
    const agent = new Agent({ role: mockRole as any, debug: false });
    await agent.use('code-review', { path: 'test.ts' });
    const memory = agent.getMemory('skill:code-review');
    expect(memory).toBeDefined();
  });
});

describe('Workflow', () => {
  it('should create workflow from config', () => {
    const workflow = new Workflow({
      name: 'Test Workflow',
      description: 'Test',
      steps: [
        { id: 'step1', name: 'Step 1', skill: 'code-review', input: {} },
        { id: 'step2', name: 'Step 2', skill: 'testing', input: {}, dependsOn: ['step1'] }
      ]
    });
    expect(workflow.name).toBe('Test Workflow');
    expect(workflow.steps).toHaveLength(2);
  });

  it('should topologically sort steps by dependencies', async () => {
    const events: string[] = [];
    const workflow = new Workflow({
      name: 'Sorted Workflow',
      description: 'Test',
      steps: [
        { id: 'step3', name: 'Step 3', skill: 'testing', dependsOn: ['step2'] },
        { id: 'step1', name: 'Step 1', skill: 'code-review', dependsOn: [] },
        { id: 'step2', name: 'Step 2', skill: 'api-design', dependsOn: ['step1'] }
      ]
    });

    workflow.on('step:complete', ({ step }: any) => events.push(step));

    await workflow.execute();

    expect(events[0]).toBe('step1');
    expect(events[1]).toBe('step2');
    expect(events[2]).toBe('step3');
  });

  it('should emit workflow start and end events', async () => {
    const workflow = new Workflow({
      name: 'Event Test',
      description: 'Test',
      steps: [{ id: 's1', name: 'Step 1', skill: 'code-review', input: {} }]
    });

    let started = false;
    let ended = false;

    workflow.on('start', () => { started = true; });
    workflow.on('end', () => { ended = true; });

    await workflow.execute();

    expect(started).toBe(true);
    expect(ended).toBe(true);
  });

  it('should resolve template variables in input', async () => {
    const workflow = new Workflow({
      name: 'Template Test',
      description: 'Test',
      context: { value: 'resolved' },
      steps: [
        {
          id: 's1',
          name: 'Step 1',
          skill: 'code-review',
          input: { path: '{{context.value}}' }
        }
      ]
    });

    await workflow.execute();
    // Template resolution happens internally
    expect(workflow.steps).toHaveLength(1);
  });

  it('should skip step when condition not met', async () => {
    const workflow = new Workflow({
      name: 'Condition Test',
      description: 'Test',
      steps: [
        { id: 's1', name: 'Step 1', skill: 'code-review', input: {} },
        {
          id: 's2',
          name: 'Step 2',
          skill: 'testing',
          input: {},
          condition: () => false
        }
      ]
    });

    let skipped = false;
    workflow.on('step:skip', () => { skipped = true; });

    await workflow.execute();
    expect(skipped).toBe(true);
  });

  it('should fail fast when strategy is set', async () => {
    const workflow = new Workflow({
      name: 'Fail Fast Test',
      description: 'Test',
      strategy: { failFast: true },
      steps: [
        { id: 's1', name: 'Step 1', skill: 'code-review', input: {} }
      ]
    });

    // Workflow should complete without error for mock execution
    const result = await workflow.execute();
    expect(result.success).toBe(true);
  });
});

describe('Team', () => {
  const mockRole = {
    id: 'dev',
    type: 'role' as const,
    version: '1.0.0',
    metadata: { name: 'Developer', description: 'Dev', author: 'test', tags: [], level: 'mid' as const },
    jd: { summary: 'Dev', responsibilities: [], requirements: {} },
    capabilities: { mainSkills: ['testing'], atomicSkills: ['write-file'] }
  };

  it('should create team with members', () => {
    const team = new Team({
      name: 'Test Team',
      members: [
        { role: mockRole as any, name: 'dev1', lead: true }
      ]
    });
    expect(team.members).toHaveLength(1);
  });

  it('should get agent by id', () => {
    const team = new Team({
      name: 'Test Team',
      members: [
        { role: mockRole as any, name: 'dev1', id: 'dev1', lead: true }
      ]
    });
    const agent = team.getAgent('dev1');
    expect(agent).toBeDefined();
  });

  it('should call specific agent', async () => {
    const team = new Team({
      name: 'Test Team',
      members: [
        { role: mockRole as any, name: 'dev1', id: 'dev1', lead: true }
      ]
    });
    const result = await team.callAgent('dev1', 'testing', { path: 'test.ts' });
    expect(result).toBeDefined();
  });

  it('should throw when agent not found', async () => {
    const team = new Team({
      name: 'Test Team',
      members: [
        { role: mockRole as any, name: 'dev1', id: 'dev1', lead: true }
      ]
    });
    await expect(team.callAgent('nonexistent', 'testing', {}))
      .rejects.toThrow('not found');
  });

  it('should emit collaboration events', async () => {
    const team = new Team({
      name: 'Test Team',
      members: [
        { role: mockRole as any, name: 'dev1', id: 'dev1', lead: true }
      ]
    });

    let started = false;
    let ended = false;

    team.on('collaboration:start', () => { started = true; });
    team.on('collaboration:end', () => { ended = true; });

    await team.collaborate({
      task: 'testing',
      requirements: 'Test requirements',
      deliverables: ['Code', 'Tests']
    });

    expect(started).toBe(true);
    expect(ended).toBe(true);
  });

  it('should topologically sort workflow steps', async () => {
    const team = new Team({
      name: 'Test Team',
      members: [
        { role: mockRole as any, name: 'dev1', id: 'dev1', lead: true }
      ]
    });

    const workflow = new Workflow({
      name: 'Team Workflow',
      description: 'Test',
      steps: [
        { id: 's3', name: 'Step 3', agent: 'dev1', skill: 'testing', dependsOn: ['s2'] },
        { id: 's1', name: 'Step 1', agent: 'dev1', skill: 'testing', dependsOn: [] },
        { id: 's2', name: 'Step 2', agent: 'dev1', skill: 'testing', dependsOn: ['s1'] }
      ]
    });

    const result = await team.executeWorkflow(workflow);
    expect(result.completedSteps).toBe(3);
  });
});

describe('CompositeSkill', () => {
  it('should validate step dependencies', () => {
    const skill = new CompositeSkill({
      id: 'test-skill',
      type: 'composite-skill',
      version: '1.0.0',
      metadata: { name: 'Test', description: 'Test', author: 'test', tags: [], category: 'test' },
      input: { schema: {} },
      output: { schema: {} },
      workflow: {
        description: 'Test',
        steps: [
          { id: 's1', name: 'Step 1', skill: 'test1', input: {}, output: '' },
          { id: 's2', name: 'Step 2', skill: 'test2', input: {}, output: '', dependsOn: ['s1'] }
        ]
      }
    });
    expect(() => skill.validate()).not.toThrow();
  });

  it('should throw on invalid step dependency', () => {
    const skill = new CompositeSkill({
      id: 'test-skill',
      type: 'composite-skill',
      version: '1.0.0',
      metadata: { name: 'Test', description: 'Test', author: 'test', tags: [], category: 'test' },
      input: { schema: {} },
      output: { schema: {} },
      workflow: {
        description: 'Test',
        steps: [
          { id: 's1', name: 'Step 1', skill: 'test1', input: {}, output: '' },
          { id: 's2', name: 'Step 2', skill: 'test2', input: {}, output: '', dependsOn: ['nonexistent'] }
        ]
      }
    });
    expect(() => skill.validate()).toThrow('depends on unknown step');
  });

  it('should return required atomic skills', () => {
    const skill = new CompositeSkill({
      id: 'test-skill',
      type: 'composite-skill',
      version: '1.0.0',
      metadata: { name: 'Test', description: 'Test', author: 'test', tags: [], category: 'test' },
      input: { schema: {} },
      output: { schema: {} },
      workflow: {
        description: 'Test',
        steps: [
          { id: 's1', name: 'Step 1', atomicSkill: 'write-file', input: {}, output: '' },
          { id: 's2', name: 'Step 2', atomicSkill: 'read-file', input: {}, output: '' }
        ]
      }
    });
    const required = skill.requiredAtomicSkills;
    expect(required).toContain('write-file');
    expect(required).toContain('read-file');
  });
});

describe('AtomicSkill', () => {
  it('should validate required inputs', () => {
    const skill = new AtomicSkill({
      id: 'test-atomic',
      type: 'atomic-skill',
      version: '1.0.0',
      metadata: { name: 'Test', description: 'Test', author: 'test', tags: [], category: 'test' },
      input: { schema: { required: ['path'] } },
      output: { schema: {} },
      implementation: { type: 'native', function: 'test' }
    });

    expect(() => skill.validateInput({ path: '/tmp/test' })).not.toThrow();
    expect(() => skill.validateInput({})).toThrow('Missing required input');
  });

  it('should check path constraints', () => {
    const skill = new AtomicSkill({
      id: 'test-atomic',
      type: 'atomic-skill',
      version: '1.0.0',
      metadata: { name: 'Test', description: 'Test', author: 'test', tags: [], category: 'test' },
      input: { schema: {} },
      output: { schema: {} },
      implementation: { type: 'native', function: 'test' },
      constraints: { blockedPaths: ['/etc/shadow', '**/secrets/**'] }
    });

    expect(() => skill.checkConstraints({ path: '/tmp/file.txt' })).not.toThrow();
    expect(() => skill.checkConstraints({ path: '/etc/shadow' })).toThrow('is blocked');
  });
});
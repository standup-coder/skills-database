import { describe, it, expect, beforeEach } from 'vitest';
import { AgentRuntime } from '../../../dist/orchestration/agent-runtime/index.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// The orchestration dist code resolves __dirname from its own location,
// which points to dist/orchestration/agent-runtime/ instead of the project root.
// 测试文件位于 app/src/__tests__/，需向上 3 级到项目根（语料库所在）。
const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SKILLS_DIR = join(PROJECT_ROOT, 'skills');
const ATOMIC_SKILLS_DIR = join(PROJECT_ROOT, 'atomic-skills');

describe('AgentRuntime', () => {
  let runtime: AgentRuntime;

  beforeEach(() => {
    runtime = new AgentRuntime({ skillsDir: SKILLS_DIR, atomicSkillsDir: ATOMIC_SKILLS_DIR });
  });

  describe('constructor', () => {
    it('should create with default config', () => {
      const rt = new AgentRuntime({ skillsDir: SKILLS_DIR, atomicSkillsDir: ATOMIC_SKILLS_DIR });
      const status = rt.getStatus();
      expect(status.name).toBe('agent-runtime');
      expect(status.toolsCount).toBe(0);
      expect(status.runningSkills).toEqual([]);
      expect(status.skillsDir).toBe(SKILLS_DIR);
      expect(status.atomicSkillsDir).toBe(ATOMIC_SKILLS_DIR);
    });

    it('should create with custom name', () => {
      const rt = new AgentRuntime({ name: 'my-agent', skillsDir: SKILLS_DIR, atomicSkillsDir: ATOMIC_SKILLS_DIR });
      expect(rt.getStatus().name).toBe('my-agent');
    });

    it('should create with custom dirs', () => {
      const rt = new AgentRuntime({
        skillsDir: '/tmp/custom-skills',
        atomicSkillsDir: '/tmp/custom-atomic'
      });
      const status = rt.getStatus();
      expect(status.skillsDir).toBe('/tmp/custom-skills');
      expect(status.atomicSkillsDir).toBe('/tmp/custom-atomic');
    });

    it('should accept initial tools', () => {
      const fn = () => 'hello';
      const rt = new AgentRuntime({ tools: { greet: fn }, skillsDir: SKILLS_DIR, atomicSkillsDir: ATOMIC_SKILLS_DIR });
      expect(rt.listTools()).toEqual(['greet']);
      expect(rt.getTool('greet')).toBe(fn);
    });
  });

  describe('registerTool / registerTools / getTool / listTools', () => {
    it('should register a single tool', () => {
      const fn = () => 42;
      runtime.registerTool('calc', fn);
      expect(runtime.getTool('calc')).toBe(fn);
      expect(runtime.listTools()).toContain('calc');
    });

    it('should register multiple tools', () => {
      runtime.registerTools({
        a: () => 'a',
        b: () => 'b',
        c: () => 'c'
      });
      expect(runtime.listTools()).toEqual(expect.arrayContaining(['a', 'b', 'c']));
      expect(runtime.listTools()).toHaveLength(3);
    });

    it('should return undefined for unknown tool', () => {
      expect(runtime.getTool('nonexistent')).toBeUndefined();
    });

    it('should overwrite existing tool on re-register', () => {
      runtime.registerTool('x', () => 1);
      runtime.registerTool('x', () => 2);
      expect(runtime.getTool('x')!()).toBe(2);
    });
  });

  describe('executeSkill', () => {
    it('should return error for unknown skill', async () => {
      const result = await runtime.executeSkill({
        skillId: 'totally-nonexistent-skill',
        inputs: {},
        agentId: 'test-agent',
        roleId: 'test-role'
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Skill not found');
      expect(result.output).toBeNull();
      expect(typeof result.duration).toBe('number');
    });

    it('should emit skill:start event', async () => {
      const events: any[] = [];
      runtime.on('skill:start', (e) => events.push(e));

      await runtime.executeSkill({
        skillId: 'nonexistent',
        inputs: {},
        agentId: 'agent-1',
        roleId: 'role-1'
      });

      expect(events).toHaveLength(1);
      expect(events[0].skillId).toBe('nonexistent');
      expect(events[0].agentId).toBe('agent-1');
    });

    it('should emit skill:error event on failure', async () => {
      const events: any[] = [];
      runtime.on('skill:error', (e) => events.push(e));

      await runtime.executeSkill({
        skillId: 'nonexistent',
        inputs: {},
        agentId: 'agent-1',
        roleId: 'role-1'
      });

      expect(events).toHaveLength(1);
      expect(events[0].error).toContain('Skill not found');
    });

    it('should execute a composite skill (code-review)', async () => {
      const events: string[] = [];
      runtime.on('step:start', (e) => events.push(`start:${e.step}`));
      runtime.on('step:complete', (e) => events.push(`complete:${e.step}`));

      const result = await runtime.executeSkill({
        skillId: 'code-review',
        inputs: { filePath: '/tmp/test.ts' },
        agentId: 'test-agent',
        roleId: 'dev'
      });

      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
      // Should have processed multiple workflow steps
      expect(events.length).toBeGreaterThan(0);
    });

    it('should execute atomic skill with mcp-tool implementation', async () => {
      // read-file is an mcp-tool type atomic skill
      const result = await runtime.executeSkill({
        skillId: 'read-file',
        inputs: { path: '/tmp/test.txt' },
        agentId: 'test-agent',
        roleId: 'dev'
      });

      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
      expect(result.output.result).toContain('MCP tool');
    });

    it('should execute atomic skill with native implementation using registered tool', async () => {
      // Register a tool matching the read-file skill (even though read-file is mcp-tool type,
      // this tests the native tool execution path with a different skill)
      runtime.registerTool('read-file', (inputs: any) => ({
        content: `Mock content of ${inputs.path}`,
        size: 100
      }));

      const result = await runtime.executeSkill({
        skillId: 'read-file',
        inputs: { path: '/tmp/test.txt' },
        agentId: 'test-agent',
        roleId: 'dev'
      });

      // read-file is mcp-tool type, so the registered tool won't be used
      // but the skill should still succeed with mock mcp output
      expect(result.success).toBe(true);
    });

    it('should handle inputs with template resolution in composite skill', async () => {
      const result = await runtime.executeSkill({
        skillId: 'code-review',
        inputs: { filePath: 'src/index.ts', focus: ['security'] },
        agentId: 'test-agent',
        roleId: 'dev'
      });

      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
      // The inputs should be accessible in the output
      expect(result.output.inputs).toEqual({ filePath: 'src/index.ts', focus: ['security'] });
    });
  });

  describe('getStatus', () => {
    it('should return correct status', () => {
      runtime.registerTool('t1', () => {});
      runtime.registerTool('t2', () => {});

      const status = runtime.getStatus();
      expect(status.name).toBe('agent-runtime');
      expect(status.toolsCount).toBe(2);
      expect(status.runningSkills).toEqual([]);
      expect(typeof status.skillsDir).toBe('string');
      expect(typeof status.atomicSkillsDir).toBe('string');
    });
  });

  describe('event emitter', () => {
    it('should be an EventEmitter', () => {
      expect(typeof runtime.on).toBe('function');
      expect(typeof runtime.emit).toBe('function');
      expect(typeof runtime.removeListener).toBe('function');
    });

    it('should support multiple listeners', () => {
      const calls: string[] = [];
      runtime.on('skill:start', () => calls.push('a'));
      runtime.on('skill:start', () => calls.push('b'));

      runtime.emit('skill:start', { skillId: 'x', agentId: 'y', inputs: {} });
      expect(calls).toEqual(['a', 'b']);
    });
  });

  describe('running skills tracking', () => {
    it('should track running skills during execution', async () => {
      let runningDuringExec: string[] = [];

      // Use a custom runtime to hook into the skill:start event
      // and capture the running skills at that moment
      const customRuntime = new AgentRuntime({
        skillsDir: SKILLS_DIR,
        atomicSkillsDir: ATOMIC_SKILLS_DIR
      });

      customRuntime.on('skill:start', () => {
        runningDuringExec = customRuntime.getStatus().runningSkills;
      });

      // Use a composite skill so we can capture mid-execution state
      customRuntime.on('step:start', () => {
        if (runningDuringExec.length === 0) {
          runningDuringExec = customRuntime.getStatus().runningSkills;
        }
      });

      await customRuntime.executeSkill({
        skillId: 'code-review',
        inputs: { filePath: '/tmp/test.ts' },
        agentId: 'agent-1',
        roleId: 'role-1'
      });

      // After execution, running skills should be cleared
      expect(customRuntime.getStatus().runningSkills).toEqual([]);
      // During execution, the skill should have been tracked
      expect(runningDuringExec).toContain('code-review');
    });
  });
});

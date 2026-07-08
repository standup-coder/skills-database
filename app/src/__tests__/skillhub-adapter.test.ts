import { describe, it, expect, beforeEach } from 'vitest';
import { SkillHubAdapter, getDefaultAdapter, resetDefaultAdapter } from '../../../dist/orchestration/skillhub-adapter/index.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// The orchestration dist code resolves __dirname from its own location,
// which points to dist/orchestration/skillhub-adapter/ instead of the project root.
// We must pass explicit paths to point at the real data directories.
// 测试文件位于 app/src/__tests__/，需向上 3 级到项目根（语料库所在）。
const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SKILLS_DIR = join(PROJECT_ROOT, 'skills');
const ATOMIC_SKILLS_DIR = join(PROJECT_ROOT, 'atomic-skills');
const ROLES_DIR = join(PROJECT_ROOT, 'roles');

describe('SkillHubAdapter', () => {
  let adapter: SkillHubAdapter;

  beforeEach(() => {
    adapter = new SkillHubAdapter({
      skillsDir: SKILLS_DIR,
      atomicSkillsDir: ATOMIC_SKILLS_DIR,
      rolesDir: ROLES_DIR
    });
    // Reset singleton so each test gets a fresh instance
    resetDefaultAdapter();
  });

  describe('initialize', () => {
    it('should load skills and roles from disk', () => {
      adapter.initialize();
      const status = adapter.getStatus();
      expect(status.initialized).toBe(true);
      expect(status.totalSkills).toBeGreaterThan(0);
      expect(status.totalRoles).toBeGreaterThan(0);
    });

    it('should be idempotent (no-op on second call)', () => {
      adapter.initialize();
      const firstCount = adapter.getStatus().totalSkills;
      adapter.initialize(); // second call
      expect(adapter.getStatus().totalSkills).toBe(firstCount);
    });

    it('should auto-initialize on getSkill', () => {
      // Don't call initialize() explicitly
      const skills = adapter.getAllSkills();
      expect(skills.length).toBeGreaterThan(0);
    });
  });

  describe('getSkill', () => {
    it('should return composite skill descriptor', () => {
      const skill = adapter.getSkill('code-review');
      expect(skill).toBeDefined();
      expect(skill!.id).toBe('code-review');
      expect(skill!.type).toBe('composite-skill');
      expect(skill!.name).toBe('Code Review');
      expect(skill!.tags).toContain('review');
      expect(skill!.filePath).toContain('code-review.json');
    });

    it('should return atomic skill descriptor', () => {
      const skill = adapter.getSkill('read-file');
      expect(skill).toBeDefined();
      expect(skill!.id).toBe('read-file');
      expect(skill!.type).toBe('atomic-skill');
      expect(skill!.name).toBe('Read File');
      expect(skill!.tags).toContain('file');
    });

    it('should return undefined for unknown skill', () => {
      expect(adapter.getSkill('nonexistent-skill')).toBeUndefined();
    });
  });

  describe('getRole', () => {
    it('should return role descriptor', () => {
      const role = adapter.getRole('backend-developer');
      expect(role).toBeDefined();
      expect(role!.id).toBe('backend-developer');
      expect(role!.name).toBe('Backend Developer');
      expect(role!.level).toBe('mid');
      expect(role!.mainSkills).toContain('database-design');
      expect(role!.atomicSkills).toContain('api-development');
      expect(role!.filePath).toContain('backend-developer.json');
    });

    it('should return undefined for unknown role', () => {
      expect(adapter.getRole('nonexistent-role')).toBeUndefined();
    });
  });

  describe('getAllSkills', () => {
    it('should return all skills without filter', () => {
      const all = adapter.getAllSkills();
      expect(all.length).toBeGreaterThan(0);
      const types = new Set(all.map(s => s.type));
      expect(types.has('composite-skill')).toBe(true);
      expect(types.has('atomic-skill')).toBe(true);
    });

    it('should filter by composite-skill type', () => {
      const composites = adapter.getAllSkills('composite-skill');
      expect(composites.length).toBeGreaterThan(0);
      composites.forEach(s => expect(s.type).toBe('composite-skill'));
    });

    it('should filter by atomic-skill type', () => {
      const atomics = adapter.getAllSkills('atomic-skill');
      expect(atomics.length).toBeGreaterThan(0);
      atomics.forEach(s => expect(s.type).toBe('atomic-skill'));
    });

    it('should have more atomic skills than composite skills', () => {
      const composites = adapter.getAllSkills('composite-skill');
      const atomics = adapter.getAllSkills('atomic-skill');
      expect(atomics.length).toBeGreaterThan(composites.length);
    });
  });

  describe('getAllRoles', () => {
    it('should return all roles', () => {
      const roles = adapter.getAllRoles();
      expect(roles.length).toBeGreaterThan(0);
      const ids = roles.map(r => r.id);
      expect(ids).toContain('backend-developer');
    });
  });

  describe('getRoleSkills', () => {
    it('should return skills for a known role', () => {
      const skills = adapter.getRoleSkills('backend-developer');
      expect(skills.length).toBeGreaterThan(0);
      // Should contain skills referenced by the role
      const skillIds = skills.map(s => s.id);
      expect(skillIds).toContain('api-development');
    });

    it('should return empty array for unknown role', () => {
      const skills = adapter.getRoleSkills('nonexistent-role');
      expect(skills).toEqual([]);
    });
  });

  describe('resolveRoleSkills', () => {
    it('should resolve skills for a known role', () => {
      const result = adapter.resolveRoleSkills('backend-developer');
      expect(result.resolved.length).toBeGreaterThan(0);
      // Most skills should be resolved since they exist in the data
      expect(result.resolved).toContain('api-development');
    });

    it('should return empty arrays for unknown role', () => {
      const result = adapter.resolveRoleSkills('nonexistent-role');
      expect(result.resolved).toEqual([]);
      expect(result.missing).toEqual([]);
    });
  });

  describe('searchSkillsByTag', () => {
    it('should find skills by exact tag', () => {
      const results = adapter.searchSkillsByTag('review');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(s => {
        expect(s.tags.some(t => t.toLowerCase().includes('review'))).toBe(true);
      });
    });

    it('should find skills by partial tag match', () => {
      const results = adapter.searchSkillsByTag('file');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
      const upper = adapter.searchSkillsByTag('REVIEW');
      const lower = adapter.searchSkillsByTag('review');
      expect(upper.length).toBe(lower.length);
    });

    it('should return empty for nonexistent tag', () => {
      const results = adapter.searchSkillsByTag('zzz_nonexistent_tag_zzz');
      expect(results).toEqual([]);
    });
  });

  describe('getSkillsByCategory', () => {
    it('should return skills for a known category', () => {
      const results = adapter.getSkillsByCategory('development');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(s => expect(s.category).toBe('development'));
    });

    it('should return empty for unknown category', () => {
      const results = adapter.getSkillsByCategory('zzz_nonexistent_category_zzz');
      expect(results).toEqual([]);
    });
  });

  describe('getStatus', () => {
    it('should return correct status after initialization', () => {
      adapter.initialize();
      const status = adapter.getStatus();
      expect(status.initialized).toBe(true);
      expect(status.totalSkills).toBeGreaterThan(0);
      expect(status.totalRoles).toBeGreaterThan(0);
      expect(status.skillsDir).toBe(SKILLS_DIR);
      expect(status.rolesDir).toBe(ROLES_DIR);
    });
  });

  describe('loadSkillContent', () => {
    beforeEach(() => {
      // loadSkillContent does not auto-initialize, so we must call it explicitly
      adapter.initialize();
    });

    it('should load full JSON content for a composite skill', () => {
      const content = adapter.loadSkillContent('code-review');
      expect(content).toBeDefined();
      expect(content.id).toBe('code-review');
      expect(content.workflow).toBeDefined();
      expect(content.workflow.steps).toBeDefined();
      expect(Array.isArray(content.workflow.steps)).toBe(true);
    });

    it('should load full JSON content for an atomic skill', () => {
      const content = adapter.loadSkillContent('read-file');
      expect(content).toBeDefined();
      expect(content.id).toBe('read-file');
      expect(content.implementation).toBeDefined();
    });

    it('should throw for unknown skill', () => {
      expect(() => adapter.loadSkillContent('nonexistent')).toThrow('Skill not found');
    });
  });

  describe('loadRoleContent', () => {
    beforeEach(() => {
      // loadRoleContent does not auto-initialize, so we must call it explicitly
      adapter.initialize();
    });

    it('should load full JSON content for a role', () => {
      const content = adapter.loadRoleContent('backend-developer');
      expect(content).toBeDefined();
      expect(content.id).toBe('backend-developer');
      expect(content.capabilities).toBeDefined();
      expect(content.jd).toBeDefined();
    });

    it('should throw for unknown role', () => {
      expect(() => adapter.loadRoleContent('nonexistent')).toThrow('Role not found');
    });
  });

  describe('getMissingSkillsDetails', () => {
    it('should return missing skills with type info', () => {
      // This will list any skills referenced by a role but not found in the skills cache
      const details = adapter.getMissingSkillsDetails('backend-developer');
      expect(Array.isArray(details)).toBe(true);
      details.forEach(d => {
        expect(['mainSkills', 'atomicSkills']).toContain(d.type);
        expect(typeof d.id).toBe('string');
      });
    });

    it('should return empty for unknown role', () => {
      const details = adapter.getMissingSkillsDetails('nonexistent-role');
      expect(details).toEqual([]);
    });
  });

  describe('getSkillTypeMismatches', () => {
    it('should report no type mismatches for a well-formed role', () => {
      const result = adapter.getSkillTypeMismatches('backend-developer');
      expect(result.mainRefersAtomic).toEqual([]);
      expect(result.atomicRefersComposite).toEqual([]);
      expect(result.missing).toEqual([]);
    });

    it('should return empty arrays for unknown role', () => {
      const result = adapter.getSkillTypeMismatches('nonexistent-role');
      expect(result.mainRefersAtomic).toEqual([]);
      expect(result.atomicRefersComposite).toEqual([]);
      expect(result.missing).toEqual([]);
    });

    it('every role in the dataset should be free of type mismatches', () => {
      adapter.initialize();
      for (const role of adapter.getAllRoles()) {
        const result = adapter.getSkillTypeMismatches(role.id);
        expect(result.mainRefersAtomic).toEqual([]);
        expect(result.atomicRefersComposite).toEqual([]);
      }
    });
  });
});

describe('getDefaultAdapter', () => {
  beforeEach(() => {
    resetDefaultAdapter();
  });

  it('should return a singleton adapter (uses default paths)', () => {
    // Note: getDefaultAdapter uses default __dirname-based paths which resolve
    // to dist/orchestration/ at test time, so it may load 0 skills.
    // We only test the singleton pattern here.
    const a = getDefaultAdapter();
    const b = getDefaultAdapter();
    expect(a).toBe(b);
  });

  it('should create new instance after reset', () => {
    const a = getDefaultAdapter();
    resetDefaultAdapter();
    const b = getDefaultAdapter();
    expect(a).not.toBe(b);
  });
});

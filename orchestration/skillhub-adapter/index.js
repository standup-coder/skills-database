/**
 * SkillHub Adapter - 技能中心适配器
 * 负责角色技能解析、技能文件加载、技能注册表管理
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class SkillHubAdapter {
    skillsDir;
    atomicSkillsDir;
    rolesDir;
    skillsCache;
    rolesCache;
    initialized;
    constructor(config = {}) {
        const projectRoot = join(__dirname, '..', '..');
        this.skillsDir = config.skillsDir || join(projectRoot, 'skills');
        this.atomicSkillsDir = config.atomicSkillsDir || join(projectRoot, 'atomic-skills');
        this.rolesDir = config.rolesDir || join(projectRoot, 'roles');
        this.skillsCache = new Map();
        this.rolesCache = new Map();
        this.initialized = false;
    }
    /**
     * 初始化 - 加载所有技能和角色定义
     */
    initialize() {
        if (this.initialized)
            return;
        this.loadCompositeSkills();
        this.loadAtomicSkills();
        this.loadRoles();
        this.initialized = true;
        console.log(`[SkillHub] Initialized with ${this.skillsCache.size} skills and ${this.rolesCache.size} roles`);
    }
    /**
     * 加载所有复合技能
     */
    loadCompositeSkills() {
        if (!existsSync(this.skillsDir))
            return;
        const files = readdirSync(this.skillsDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            try {
                const filePath = join(this.skillsDir, file);
                const content = readFileSync(filePath, 'utf-8');
                const data = JSON.parse(content);
                const descriptor = {
                    id: data.id,
                    name: data.metadata?.name || data.id,
                    nameZh: data.metadata?.nameZh,
                    description: data.metadata?.description || '',
                    descriptionZh: data.metadata?.descriptionZh,
                    type: 'composite-skill',
                    category: data.metadata?.category || 'general',
                    tags: data.metadata?.tags || [],
                    version: data.version || '1.0.0',
                    filePath
                };
                this.skillsCache.set(data.id, descriptor);
            }
            catch (error) {
                console.warn(`[SkillHub] Failed to load composite skill ${file}:`, error);
            }
        }
    }
    /**
     * 加载所有原子技能
     */
    loadAtomicSkills() {
        if (!existsSync(this.atomicSkillsDir))
            return;
        const files = readdirSync(this.atomicSkillsDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            try {
                const filePath = join(this.atomicSkillsDir, file);
                const content = readFileSync(filePath, 'utf-8');
                const data = JSON.parse(content);
                const descriptor = {
                    id: data.id,
                    name: data.metadata?.name || data.id,
                    nameZh: data.metadata?.nameZh,
                    description: data.metadata?.description || '',
                    descriptionZh: data.metadata?.descriptionZh,
                    type: 'atomic-skill',
                    category: data.metadata?.category || 'atomic',
                    tags: data.metadata?.tags || [],
                    version: data.version || '1.0.0',
                    filePath
                };
                this.skillsCache.set(data.id, descriptor);
            }
            catch (error) {
                console.warn(`[SkillHub] Failed to load atomic skill ${file}:`, error);
            }
        }
    }
    /**
     * 加载所有角色
     */
    loadRoles() {
        if (!existsSync(this.rolesDir))
            return;
        const files = readdirSync(this.rolesDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            try {
                const filePath = join(this.rolesDir, file);
                const content = readFileSync(filePath, 'utf-8');
                const data = JSON.parse(content);
                const descriptor = {
                    id: data.id,
                    name: data.metadata?.name || data.id,
                    nameZh: data.metadata?.nameZh,
                    level: data.metadata?.level || 'mid',
                    mainSkills: data.capabilities?.mainSkills || [],
                    atomicSkills: data.capabilities?.atomicSkills || [],
                    filePath
                };
                this.rolesCache.set(data.id, descriptor);
            }
            catch (error) {
                console.warn(`[SkillHub] Failed to load role ${file}:`, error);
            }
        }
    }
    /**
     * 获取技能描述符
     */
    getSkill(id) {
        if (!this.initialized)
            this.initialize();
        return this.skillsCache.get(id);
    }
    /**
     * 获取角色描述符
     */
    getRole(id) {
        if (!this.initialized)
            this.initialize();
        return this.rolesCache.get(id);
    }
    /**
     * 获取所有技能
     */
    getAllSkills(type) {
        if (!this.initialized)
            this.initialize();
        const skills = Array.from(this.skillsCache.values());
        if (type)
            return skills.filter(s => s.type === type);
        return skills;
    }
    /**
     * 获取所有角色
     */
    getAllRoles() {
        if (!this.initialized)
            this.initialize();
        return Array.from(this.rolesCache.values());
    }
    /**
     * 获取角色的所有可用技能
     */
    getRoleSkills(roleId) {
        if (!this.initialized)
            this.initialize();
        const role = this.rolesCache.get(roleId);
        if (!role)
            return [];
        const skills = [];
        for (const skillId of role.mainSkills) {
            const skill = this.skillsCache.get(skillId);
            if (skill)
                skills.push(skill);
        }
        for (const skillId of role.atomicSkills) {
            const skill = this.skillsCache.get(skillId);
            if (skill)
                skills.push(skill);
        }
        return skills;
    }
    /**
     * 解析角色技能引用 - 检查技能是否存在
     */
    resolveRoleSkills(roleId) {
        if (!this.initialized)
            this.initialize();
        const role = this.rolesCache.get(roleId);
        if (!role)
            return { resolved: [], missing: [] };
        const allSkillIds = [...role.mainSkills, ...role.atomicSkills];
        const resolved = [];
        const missing = [];
        for (const skillId of allSkillIds) {
            if (this.skillsCache.has(skillId)) {
                resolved.push(skillId);
            }
            else {
                missing.push(skillId);
            }
        }
        return { resolved, missing };
    }
    /**
     * 获取缺失技能详情
     */
    getMissingSkillsDetails(roleId) {
        if (!this.initialized)
            this.initialize();
        const role = this.rolesCache.get(roleId);
        if (!role)
            return [];
        const missing = [];
        for (const skillId of role.mainSkills) {
            if (!this.skillsCache.has(skillId)) {
                missing.push({ id: skillId, type: 'mainSkills' });
            }
        }
        for (const skillId of role.atomicSkills) {
            if (!this.skillsCache.has(skillId)) {
                missing.push({ id: skillId, type: 'atomicSkills' });
            }
        }
        return missing;
    }
    /**
     * 加载技能 JSON 内容
     */
    loadSkillContent(skillId) {
        const skill = this.skillsCache.get(skillId);
        if (!skill) {
            throw new Error(`Skill not found: ${skillId}`);
        }
        const content = readFileSync(skill.filePath, 'utf-8');
        return JSON.parse(content);
    }
    /**
     * 加载角色 JSON 内容
     */
    loadRoleContent(roleId) {
        const role = this.rolesCache.get(roleId);
        if (!role) {
            throw new Error(`Role not found: ${roleId}`);
        }
        const content = readFileSync(role.filePath, 'utf-8');
        return JSON.parse(content);
    }
    /**
     * 按分类获取技能
     */
    getSkillsByCategory(category) {
        if (!this.initialized)
            this.initialize();
        return Array.from(this.skillsCache.values()).filter(s => s.category === category);
    }
    /**
     * 按标签搜索技能
     */
    searchSkillsByTag(tag) {
        if (!this.initialized)
            this.initialize();
        const lowerTag = tag.toLowerCase();
        return Array.from(this.skillsCache.values()).filter(s => s.tags.some(t => t.toLowerCase().includes(lowerTag)));
    }
    /**
     * 获取适配器状态
     */
    getStatus() {
        if (!this.initialized)
            this.initialize();
        return {
            initialized: this.initialized,
            totalSkills: this.skillsCache.size,
            totalRoles: this.rolesCache.size,
            skillsDir: this.skillsDir,
            rolesDir: this.rolesDir
        };
    }
}
/**
 * 默认实例 - 单例模式
 */
let defaultAdapter = null;
export function getDefaultAdapter() {
    if (!defaultAdapter) {
        defaultAdapter = new SkillHubAdapter();
        defaultAdapter.initialize();
    }
    return defaultAdapter;
}
export function resetDefaultAdapter() {
    defaultAdapter = null;
}
//# sourceMappingURL=index.js.map
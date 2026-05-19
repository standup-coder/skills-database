/**
 * SkillHub Adapter - 技能中心适配器
 * 负责角色技能解析、技能文件加载、技能注册表管理
 */
export interface SkillDescriptor {
    id: string;
    name: string;
    nameZh?: string;
    description: string;
    descriptionZh?: string;
    type: 'composite-skill' | 'atomic-skill';
    category: string;
    tags: string[];
    version: string;
    filePath: string;
}
export interface RoleDescriptor {
    id: string;
    name: string;
    nameZh?: string;
    level: string;
    mainSkills: string[];
    atomicSkills: string[];
    filePath: string;
}
export interface SkillHubConfig {
    skillsDir?: string;
    atomicSkillsDir?: string;
    rolesDir?: string;
}
export declare class SkillHubAdapter {
    private skillsDir;
    private atomicSkillsDir;
    private rolesDir;
    private skillsCache;
    private rolesCache;
    private initialized;
    constructor(config?: SkillHubConfig);
    /**
     * 初始化 - 加载所有技能和角色定义
     */
    initialize(): void;
    /**
     * 加载所有复合技能
     */
    private loadCompositeSkills;
    /**
     * 加载所有原子技能
     */
    private loadAtomicSkills;
    /**
     * 加载所有角色
     */
    private loadRoles;
    /**
     * 获取技能描述符
     */
    getSkill(id: string): SkillDescriptor | undefined;
    /**
     * 获取角色描述符
     */
    getRole(id: string): RoleDescriptor | undefined;
    /**
     * 获取所有技能
     */
    getAllSkills(type?: 'composite-skill' | 'atomic-skill'): SkillDescriptor[];
    /**
     * 获取所有角色
     */
    getAllRoles(): RoleDescriptor[];
    /**
     * 获取角色的所有可用技能
     */
    getRoleSkills(roleId: string): SkillDescriptor[];
    /**
     * 解析角色技能引用 - 检查技能是否存在
     */
    resolveRoleSkills(roleId: string): {
        resolved: string[];
        missing: string[];
    };
    /**
     * 获取缺失技能详情
     */
    getMissingSkillsDetails(roleId: string): Array<{
        id: string;
        type: 'mainSkills' | 'atomicSkills';
    }>;
    /**
     * 加载技能 JSON 内容
     */
    loadSkillContent(skillId: string): any;
    /**
     * 加载角色 JSON 内容
     */
    loadRoleContent(roleId: string): any;
    /**
     * 按分类获取技能
     */
    getSkillsByCategory(category: string): SkillDescriptor[];
    /**
     * 按标签搜索技能
     */
    searchSkillsByTag(tag: string): SkillDescriptor[];
    /**
     * 获取适配器状态
     */
    getStatus(): {
        initialized: boolean;
        totalSkills: number;
        totalRoles: number;
        skillsDir: string;
        rolesDir: string;
    };
}
export declare function getDefaultAdapter(): SkillHubAdapter;
export declare function resetDefaultAdapter(): void;
//# sourceMappingURL=index.d.ts.map
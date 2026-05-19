/**
 * Shared utility functions for orchestration package.
 * Duplicated from src/utils.ts since orchestration is a separate TypeScript project.
 */
/**
 * Topological sort for items with dependency relationships.
 */
export declare function topologicalSort<T extends {
    id: string;
    dependsOn?: string[];
}>(items: T[]): T[];
/**
 * Get a nested value from an object by dot-separated path.
 */
export declare function getValueByPath(path: string, obj: Record<string, any>): any;
/**
 * Resolve template variables in {{var.path}} syntax.
 */
export declare function resolveTemplate(template: any, context: Record<string, any>): any;
//# sourceMappingURL=utils.d.ts.map
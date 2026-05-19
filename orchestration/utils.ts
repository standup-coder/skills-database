/**
 * Shared utility functions for orchestration package.
 * Duplicated from src/utils.ts since orchestration is a separate TypeScript project.
 */

/**
 * Topological sort for items with dependency relationships.
 */
export function topologicalSort<T extends { id: string; dependsOn?: string[] }>(items: T[]): T[] {
  const visited = new Set<string>();
  const result: T[] = [];
  const itemMap = new Map(items.map(item => [item.id, item]));

  const visit = (item: T) => {
    if (visited.has(item.id)) return;
    visited.add(item.id);

    if (item.dependsOn) {
      for (const depId of item.dependsOn) {
        const dep = itemMap.get(depId);
        if (dep) visit(dep);
      }
    }

    result.push(item);
  };

  for (const item of items) {
    visit(item);
  }

  return result;
}

/**
 * Get a nested value from an object by dot-separated path.
 */
export function getValueByPath(path: string, obj: Record<string, any>): any {
  const parts = path.split('.');
  let value: any = obj;

  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Resolve template variables in {{var.path}} syntax.
 */
export function resolveTemplate(template: any, context: Record<string, any>): any {
  if (typeof template === 'string') {
    if (template.startsWith('{{') && template.endsWith('}}')) {
      const path = template.slice(2, -2).trim();
      return getValueByPath(path, context);
    }
    return template;
  }

  if (Array.isArray(template)) {
    return template.map(item => resolveTemplate(item, context));
  }

  if (typeof template === 'object' && template !== null) {
    const resolved: any = {};
    for (const [key, value] of Object.entries(template)) {
      resolved[key] = resolveTemplate(value, context);
    }
    return resolved;
  }

  return template;
}

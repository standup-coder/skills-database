/**
 * Shared utility functions
 */

/** 递归 JSON 值类型，用于模板解析等动态数据场景 */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/** 判定是否为 JSON 对象（非数组、非 null） */
function isJsonObject(value: JsonValue | undefined): value is { [key: string]: JsonValue } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Topological sort for items with dependency relationships.
 * Items with `dependsOn` arrays specifying IDs of items they depend on.
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
 * e.g. getValueByPath('a.b.c', { a: { b: { c: 42 } } }) => 42
 */
export function getValueByPath(path: string, obj: JsonValue): JsonValue | undefined {
  const parts = path.split('.');
  let value: JsonValue | undefined = obj;

  for (const part of parts) {
    if (isJsonObject(value) && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Resolve template variables in {{var.path}} syntax.
 * Walks the template recursively, replacing string placeholders with
 * values looked up from the provided context via getValueByPath.
 */
export function resolveTemplate(template: JsonValue, context: { [key: string]: JsonValue }): JsonValue | undefined {
  if (typeof template === 'string') {
    if (template.startsWith('{{') && template.endsWith('}}')) {
      const path = template.slice(2, -2).trim();
      return getValueByPath(path, context);
    }
    return template;
  }

  if (Array.isArray(template)) {
    return template.map(item => {
      const r = resolveTemplate(item, context);
      return r === undefined ? null : r;
    });
  }

  if (isJsonObject(template)) {
    const resolved: { [key: string]: JsonValue } = {};
    for (const [key, value] of Object.entries(template)) {
      const r = resolveTemplate(value, context);
      resolved[key] = r === undefined ? null : r;
    }
    return resolved;
  }

  return template;
}

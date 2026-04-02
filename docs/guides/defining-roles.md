# 定义 Role

本指南教你如何创建自定义 Role。

## 基本概念

Role 由以下部分组成：

1. **Metadata** - 基本信息（名称、描述、标签）
2. **JD** - 职位描述（职责、要求）
3. **Capabilities** - 能力清单（主 Skills、原子 Skills）
4. **Context** - 上下文（技术栈、规范等）

## 创建 Role 文件

创建 `my-custom-role.json`：

```json
{
  "$schema": "https://skills4coder.org/schemas/role-v1.json",
  "id": "my-custom-role",
  "type": "role",
  "version": "1.0.0",
  
  "metadata": {
    "name": "My Custom Role",
    "description": "描述这个 Role 的职责",
    "level": "mid",
    "tags": ["custom", "example"]
  },
  
  "jd": {
    "summary": "一句话描述职责",
    "responsibilities": [
      "职责 1",
      "职责 2",
      "职责 3"
    ],
    "requirements": {
      "experience": "3+ years",
      "coreSkills": ["Skill A", "Skill B"]
    }
  },
  
  "capabilities": {
    "mainSkills": ["skill-1", "skill-2"],
    "atomicSkills": ["read-file", "write-file"]
  },
  
  "context": {
    "techStack": ["React", "Node.js"]
  }
}
```

## 使用自定义 Role

```javascript
import { Role, Agent } from 'skills4coder';

// 加载自定义 Role
const role = Role.fromJSON('./my-custom-role.json');

// 创建 Agent
const agent = new Agent({ role });

// 使用
await agent.use('skill-1');
```

## 最佳实践

1. **id 命名**: 使用 kebab-case，如 `senior-frontend-dev`
2. **版本管理**: 遵循 SemVer，破坏性变更升级主版本
3. **文档**: 添加清晰的描述和示例
4. **测试**: 验证 Role 的所有 Skills 可用

[查看 Role Schema →](../reference/role-schema.md)

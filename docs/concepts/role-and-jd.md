# Role (岗位) 与 JD

**Role = JD = 主 Skills 集合**

Role 是 Skills Database 的核心概念之一，它定义了一个岗位的能力边界、职责范围和技能要求。

## 什么是 Role？

在传统软件开发中，我们通过 **Job Description (JD)** 来描述一个岗位的职责和要求。在 Skills Database 中，我们将 JD 转化为可执行、可复用、可版本管理的代码定义，这就是 **Role**。

### Role 的核心组成

```typescript
interface Role {
  // 身份标识
  id: string;           // 唯一标识符，如 "senior-frontend-dev"
  
  // 元信息
  metadata: {
    name: string;       // 显示名称
    description: string; // 描述
    level: 'junior' | 'mid' | 'senior' | 'lead';
    tags: string[];     // 标签，便于分类和搜索
  };
  
  // JD 描述
  jd: {
    summary: string;           // 职责概述
    responsibilities: string[]; // 具体职责
    requirements: {
      experience: string;      // 经验要求
      coreSkills: string[];    // 核心技能
    };
  };
  
  // 能力清单
  capabilities: {
    mainSkills: string[];      // 主 Skills（复合技能）
    atomicSkills: string[];    // 原子技能
  };
  
  // 上下文
  context: {
    techStack: string[];       // 技术栈
    codingStandards: string;   // 编码规范
    reviewCriteria: string[];  // 审查标准
  };
}
```

## Role 定义示例

### Senior Frontend Developer

```json
{
  "$schema": "../schema/role-v1.json",
  "id": "senior-frontend-dev",
  "type": "role",
  "version": "1.0.0",
  
  "metadata": {
    "name": "Senior Frontend Developer",
    "nameZh": "高级前端开发工程师",
    "description": "负责前端架构设计、代码审查、性能优化",
    "author": "skills-database-team",
    "tags": ["frontend", "react", "typescript", "architecture"],
    "level": "senior"
  },
  
  "jd": {
    "summary": "负责前端架构设计，确保代码质量和性能，推动技术演进",
    "responsibilities": [
      "设计可扩展的前端架构",
      "进行代码审查，确保代码质量",
      "优化应用性能，提升用户体验",
      "指导初中级开发者成长"
    ],
    "requirements": {
      "experience": "5+ years",
      "education": "CS or related",
      "coreSkills": ["React", "TypeScript", "State Management"]
    }
  },
  
  "capabilities": {
    "mainSkills": [
      "frontend-architecture-design",
      "code-review",
      "performance-optimization"
    ],
    "atomicSkills": [
      "read-file",
      "write-code",
      "run-linter",
      "git-operations"
    ]
  },
  
  "context": {
    "techStack": {
      "primary": ["React", "TypeScript", "Next.js"],
      "styling": ["Tailwind CSS", "Styled Components"],
      "testing": ["Jest", "React Testing Library"]
    },
    "codingStandards": "airbnb-typescript",
    "reviewCriteria": ["security", "performance", "maintainability"]
  }
}
```

## Role 的层级

我们定义了四个层级来表示不同的经验水平：

| 层级 | 标识 | 经验 | 职责 |
|------|------|------|------|
| **Junior** | `junior` | 0-2 年 | 在指导下完成具体任务 |
| **Mid** | `mid` | 2-5 年 | 独立完成任务，解决问题 |
| **Senior** | `senior` | 5+ 年 | 架构设计，指导他人，技术决策 |
| **Lead** | `lead` | 8+ 年 | 团队领导，战略规划，跨团队协作 |

## 使用 Role

### 加载 Role

```javascript
import { Role } from 'skills-database';

// 从 JSON 文件加载
const role = Role.fromJSON('./roles/senior-frontend-dev.json');

// 或者直接创建
const customRole = new Role({
  id: 'my-custom-role',
  metadata: { name: 'Custom Role', /* ... */ },
  jd: { /* ... */ },
  capabilities: { /* ... */ }
});
```

### 查询 Role 信息

```javascript
// 获取基本信息
console.log(role.id);           // "senior-frontend-dev"
console.log(role.name);         // "Senior Frontend Developer"
console.log(role.description);  // "负责前端架构设计..."

// 获取技能清单
console.log(role.mainSkills);    // ["frontend-architecture-design", ...]
console.log(role.atomicSkills);  // ["read-file", "write-code", ...]

// 检查是否具备某技能
console.log(role.hasSkill('code-review')); // true

// 获取系统提示词
console.log(role.systemPrompt);  // 用于 LLM 的系统提示
```

### 创建 Agent

```javascript
import { Agent } from 'skills-database';

const agent = new Agent({
  role: role,
  llm: 'gpt-4',
  tools: ['mcp-filesystem', 'mcp-git']
});

// Agent 现在具备了 Role 定义的所有能力
const result = await agent.use('code-review', {
  filePath: './src/App.tsx'
});
```

## Role 的组合

一个复杂的项目可能需要多个 Role 协作。你可以将多个 Role 组合成团队：

```javascript
import { Team } from 'skills-database';

const team = new Team({
  name: 'Feature Development Team',
  members: [
    { role: 'product-manager', name: 'PM' },
    { role: 'backend-architect', name: 'Architect' },
    { role: 'backend-dev', name: 'Backend' },
    { role: 'frontend-dev', name: 'Frontend' },
    { role: 'qa-engineer', name: 'QA' }
  ]
});
```

## 最佳实践

### 1. Role 设计原则

- **单一职责**: 一个 Role 专注于一个领域
- **能力边界清晰**: 明确能做什么、不能做什么
- **可验证**: 包含明确的技能评估标准

### 2. Role 复用

- 基础 Role 可以被继承和扩展
- 团队可以共享 Role 定义
- 通过版本管理追踪 Role 演进

### 3. Role 演进

```
v1.0: 基础能力
v1.1: 添加新技能
v2.0: 架构升级（破坏性变更）
```

## 预定义 Roles

Skills Database 提供了一些预定义的 Role：

### 开发者 Roles

- `frontend-dev` - 前端开发工程师
- `backend-dev` - 后端开发工程师
- `fullstack-dev` - 全栈开发工程师
- `mobile-dev` - 移动开发工程师

### 架构师 Roles

- `solution-architect` - 解决方案架构师
- `cloud-architect` - 云架构师
- `security-architect` - 安全架构师

### 测试 & 运维 Roles

- `qa-engineer` - 测试工程师
- `sre` - 站点可靠性工程师
- `devops-engineer` - DevOps 工程师

查看所有 [预定义 Roles →](../roles/)

## 下一步

- [创建你的第一个 Role →](../guides/defining-roles.md)
- [了解 Composite Skills →](./skill-composition.md)
- [查看示例 →](../examples/)

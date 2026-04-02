# Roles (岗位定义)

本目录包含所有预定义的 Role（岗位）。

## 什么是 Role？

**Role = JD = 主 Skills 集合**

Role 定义了一个岗位的能力边界、职责范围和技能要求。它是 Agent 的"身份"和"专业领域"。

## Role 结构

```json
{
  "id": "unique-role-id",
  "type": "role",
  "metadata": { ... },      // 基本信息
  "jd": { ... },            // 职位描述
  "capabilities": { ... },  // 能力清单
  "context": { ... },       // 上下文信息
  "systemPrompt": { ... }   // AI 系统提示
}
```

## 现有 Roles

| Role ID | 名称 | 级别 | 描述 |
|---------|------|------|------|
| senior-frontend-dev | 高级前端开发 | Senior | 架构设计、代码审查、性能优化 |
| backend-developer | 后端开发 | Mid | API 开发、数据库设计 |
| backend-architect | 后端架构师 | Senior | 系统架构、技术选型 |
| qa-automation | 自动化测试 | Mid | 测试策略、自动化框架 |
| product-manager | 产品经理 | Senior | 需求分析、PRD 编写 |
| sre-engineer | SRE 工程师 | Senior | 可靠性工程、运维 |

## 创建新 Role

1. 复制 `template.json` 作为起点
2. 填写岗位的基本信息
3. 定义 JD 和能力清单
4. 配置技术栈和上下文
5. 编写系统提示词

## 最佳实践

- **单一职责**: 一个 Role 专注于一个领域
- **能力边界清晰**: 明确能做什么、不能做什么
- **可评估**: 包含明确的技能评估标准
- **可组合**: 设计为可以与其他 Role 协作

## 使用示例

```javascript
import { Role } from 'skills4coder';

// 加载预定义 Role
const role = Role.fromJSON('./roles/senior-frontend-dev.json');

// 创建 Agent
const agent = new Agent({ role, llm: 'gpt-4' });
```

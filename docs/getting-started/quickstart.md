# 快速开始

在 5 分钟内上手 Skills Database，创建你的第一个 Agent。

## 安装

```bash
npm install skills-database
# 或者
yarn add skills-database
```

## 第一步：加载预定义 Role

Skills Database 提供了一些预定义的 Role，你可以直接使用：

```javascript
import { Role } from 'skills-database';

// 加载 Senior Frontend Developer Role
const role = Role.fromJSON('node_modules/skills-database/roles/senior-frontend-dev.json');

console.log(role.name);        // "Senior Frontend Developer"
console.log(role.mainSkills);  // ["frontend-architecture-design", "code-review", ...]
```

## 第二步：创建 Agent

基于 Role 创建 Agent：

```javascript
import { Agent } from 'skills-database';

const agent = new Agent({
  role: role,
  llm: 'gpt-4',  // 或其他 LLM
  tools: ['mcp-filesystem']  // MCP 工具
});
```

## 第三步：执行任务

使用 Agent 执行 Skill：

```javascript
// 执行代码审查
const result = await agent.use('code-review', {
  filePath: './src/components/Button.tsx'
});

console.log(result.score);      // 85
console.log(result.approval);   // "comment"
console.log(result.issues);     // [{ severity: "medium", ... }]
```

## 完整示例

```javascript
import { Agent, Role } from 'skills-database';

async function main() {
  // 1. 加载 Role
  const role = Role.fromJSON('./roles/code-reviewer.json');
  
  // 2. 创建 Agent
  const reviewer = new Agent({
    role,
    llm: 'gpt-4'
  });
  
  // 3. 审查代码
  const result = await reviewer.use('code-review', {
    filePath: './src/App.tsx',
    focus: ['security', 'performance']
  });
  
  // 4. 输出结果
  console.log(`评分: ${result.score}/100`);
  console.log(`建议: ${result.suggestions.length} 条`);
  
  result.issues.forEach(issue => {
    console.log(`[${issue.severity}] ${issue.message}`);
  });
}

main().catch(console.error);
```

## 下一步

- [第一个 Agent →](./first-agent.md)
- [第一个工作流 →](./first-workflow.md)
- [核心概念 →](../concepts/)

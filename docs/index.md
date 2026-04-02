---
layout: home

hero:
  name: "Skills4Coder"
  text: "Agent 技能编排框架"
  tagline: 岗位即 Skills 集合，让 AI Agent 像专业团队一样协作
  image:
    src: /images/architecture-hero.svg
    alt: Skills4Coder Architecture
  actions:
    - theme: brand
      text: 快速开始
      link: /getting-started/quickstart
    - theme: alt
      text: 核心概念
      link: /concepts/
    - theme: alt
      text: GitHub
      link: https://github.com/standup-coder/skills4coder

features:
  - icon: 🎯
    title: Role (岗位)
    details: JD 即代码。将岗位描述转化为可执行的 Agent 定义，明确能力边界和职责范围
  - icon: 🧩
    title: Composite Skills
    details: 可复用的复合技能模块。编排原子技能，实现复杂任务，支持跨 Role 复用
  - icon: ⚡
    title: Atomic Skills
    details: 最基础的能力单元。直接映射到 MCP Tools、API 调用和本地操作
  - icon: 🤖
    title: Multi-Agent 协作
    details: 多个专业 Agent 分工协作。像真实团队一样完成复杂项目
  - icon: 🔌
    title: MCP 生态
    details: 原生支持 Model Context Protocol。无缝对接各类工具和服务
  - icon: 📊
    title: 可观测性
    details: 完整的执行追踪、性能监控和调试工具。让 AI 工作透明可控
---

## 三层架构

![三层架构](/images/architecture-hero.svg)

## 为什么选择 Skills4Coder？

<div class="comparison-grid">

<div class="comparison-item">

### 🎯 专业化分工

**传统方式**: 单一 AI 助手试图成为"万能专家"
- 结果样样通样样松，代码质量参差不齐

**Skills4Coder**: 每个 Agent 专注于特定岗位
- 像专业团队一样协作，每个环节都有专家把关

</div>

<div class="comparison-item">

### 🧩 可复用组合

**传统方式**: 技能内嵌在 Prompt 中
- 每次都要重新描述，无法版本管理

**Skills4Coder**: 技能外置为可复用模块
- 一次定义，处处使用，团队共享，版本管理

</div>

<div class="comparison-item">

### ✅ 可验证评估

**传统方式**: 黑盒操作，无法评估能力
- 不知道 Agent 能做到什么程度

**Skills4Coder**: 原子技能可单独测试
- 能力可量化评估，支持认证和徽章系统

</div>

</div>

## 预定义 Roles

<div class="role-grid">

<a href="/roles/frontend-dev" class="role-card">
  <div class="role-icon">💻</div>
  <div class="role-title">Frontend Dev</div>
  <div class="role-desc">React, Vue, Angular</div>
</a>

<a href="/roles/backend-dev" class="role-card">
  <div class="role-icon">⚙️</div>
  <div class="role-title">Backend Dev</div>
  <div class="role-desc">API, Database</div>
</a>

<a href="/roles/solution-architect" class="role-card">
  <div class="role-icon">🏗️</div>
  <div class="role-title">Architect</div>
  <div class="role-desc">System Design</div>
</a>

<a href="/roles/qa-engineer" class="role-card">
  <div class="role-icon">🧪</div>
  <div class="role-title">QA Engineer</div>
  <div class="role-desc">Automation, Testing</div>
</a>

<a href="/roles/sre" class="role-card">
  <div class="role-icon">🔧</div>
  <div class="role-title">SRE</div>
  <div class="role-desc">Reliability, DevOps</div>
</a>

<a href="/roles/" class="role-card view-all">
  <div class="role-icon">→</div>
  <div class="role-title">查看全部</div>
  <div class="role-desc">20+ Roles</div>
</a>

</div>

## 使用示例

### 单 Agent 执行专业任务

```javascript
import { Agent } from 'skills4coder';

// 创建专业代码审查 Agent
const reviewer = new Agent({
  role: 'senior-frontend-dev'
});

// 执行代码审查
const result = await reviewer.use('code-review', {
  filePath: './src/components/UserProfile.tsx'
});

console.log(`评分: ${result.score}/100`);
console.log(`发现问题: ${result.issues.length} 个`);
```

### 多 Agent 协作完成项目

```javascript
import { Team, Workflow } from 'skills4coder';

// 定义项目团队
const team = new Team({
  name: 'Auth Feature Team',
  members: [
    { role: 'product-manager', name: 'PM' },
    { role: 'backend-architect', name: 'Architect' },
    { role: 'backend-dev', name: 'Backend' },
    { role: 'frontend-dev', name: 'Frontend' },
    { role: 'qa-engineer', name: 'QA' }
  ]
});

// 执行工作流
const result = await team.executeWorkflow({
  name: 'User Authentication Feature',
  steps: [
    { agent: 'PM', skill: 'write-prd', output: 'PRD.md' },
    { agent: 'Architect', skill: 'design-api', input: 'PRD.md', output: 'api-spec.yaml' },
    { agent: 'Backend', skill: 'implement-api', input: 'api-spec.yaml', output: 'backend/' },
    { agent: 'Frontend', skill: 'implement-ui', input: 'api-spec.yaml', output: 'frontend/' },
    { agent: 'QA', skill: 'write-e2e-tests', input: ['api-spec.yaml', 'frontend/'], output: 'tests/' }
  ]
});
```

[查看更多示例 →](/examples/)

## 核心特性

<div class="features-grid">

<div class="feature-card">

### 🤖 Multi-Agent 协作

多个专业 Agent 分工协作，通过工作流编排完成复杂项目。支持并行执行、条件分支、依赖管理。

</div>

<div class="feature-card">

### 🧩 Skill 编排

可视化编排 Skills，拖拽式工作流设计。支持条件执行、错误处理、重试机制。

</div>

<div class="feature-card">

### 📝 JD 即代码

岗位描述即代码，支持版本管理、代码审查、CI/CD。团队可以共享和复用 Role 定义。

</div>

<div class="feature-card">

### 🔌 MCP 生态

原生支持 Model Context Protocol，无缝对接 filesystem、git、database 等各类工具。

</div>

<div class="feature-card">

### 📊 可观测性

完整的执行追踪、性能监控、Token 消耗统计。支持导出到 Prometheus/Grafana。

</div>

<div class="feature-card">

### 🎨 可视化调试

实时查看 Agent 思考过程、技能调用链、中间结果。支持断点调试和单步执行。

</div>

</div>

## 开始使用

<div class="cta-grid">

<a href="/getting-started/quickstart" class="cta-card primary">
  <div class="cta-icon">🚀</div>
  <div class="cta-title">快速开始</div>
  <div class="cta-desc">5 分钟上手 Skills4Coder</div>
</a>

<a href="/concepts/" class="cta-card">
  <div class="cta-icon">📚</div>
  <div class="cta-title">核心概念</div>
  <div class="cta-desc">理解 Role、Skill、Agent</div>
</a>

<a href="/examples/" class="cta-card">
  <div class="cta-icon">💡</div>
  <div class="cta-title">查看示例</div>
  <div class="cta-desc">真实场景使用案例</div>
</a>

</div>

<style>
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 40px 0;
}

.comparison-item {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 24px;
}

.comparison-item h3 {
  color: var(--vp-c-brand-1);
  margin-bottom: 16px;
}

.role-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin: 40px 0;
}

.role-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

.role-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
}

.role-card.view-all {
  border-style: dashed;
}

.role-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.role-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.role-desc {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 40px 0;
}

.feature-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 24px;
}

.feature-card h3 {
  margin-bottom: 12px;
}

.cta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 40px 0;
}

.cta-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

.cta-card:hover {
  border-color: var(--vp-c-brand-1);
}

.cta-card.primary {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.cta-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.cta-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

@media (max-width: 960px) {
  .comparison-grid,
  .features-grid,
  .cta-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .role-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .comparison-grid,
  .features-grid,
  .cta-grid,
  .role-grid {
    grid-template-columns: 1fr;
  }
}
</style>

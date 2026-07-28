---
layout: home

hero:
  name: "Skills Database"
  text: "Agent 技能编排框架"
  tagline: 岗位即 Skills 集合，让 AI Agent 像专业团队一样协作
  image:
    src: /images/architecture-hero.svg
    alt: Skills Database Architecture
  actions:
    - theme: brand
      text: 快速开始
      link: /getting-started/quickstart
    - theme: alt
      text: 核心概念
      link: /concepts/
    - theme: alt
      text: GitHub
      link: https://github.com/standup-coder/skills-database

features:
  - icon: 🎯
    title: Role 岗位定义
    details: JD 即代码。将岗位描述转化为可执行的 Agent 定义，明确能力边界和职责范围，支持版本管理与团队共享。
    link: /concepts/role-and-jd
  - icon: 🧩
    title: Composite Skills
    details: 可复用的复合技能模块。编排多个原子技能实现复杂任务，一次定义处处使用，支持跨 Role 复用和嵌套组合。
    link: /concepts/
  - icon: ⚡
    title: Atomic Skills
    details: 最基础的能力单元，不可再分。直接映射到 MCP Tools、API 调用和本地操作，每个原子技能可单独测试和验证。
    link: /concepts/
  - icon: 🤖
    title: Multi-Agent 协作
    details: 多个专业 Agent 分工协作，支持并行执行与依赖管理。像真实团队一样完成从 PRD 到测试的完整开发流程。
    link: /guides/
  - icon: 🔌
    title: MCP 生态集成
    details: 原生支持 Model Context Protocol，无缝对接 filesystem、git、database 等工具。兼容 SkillHub 等第三方技能市场。
    link: /ecosystem/
  - icon: 📊
    title: 可观测性
    details: 完整的执行追踪、Token 消耗统计、性能监控与可视化调试。支持导出到 Prometheus/Grafana，让 AI 工作透明可控。
    link: /guides/
---

<div class="home-stats">
  <div class="home-stats__item">
    <span class="home-stats__number">20+</span>
    <span class="home-stats__label">预定义 Roles</span>
  </div>
  <div class="home-stats__item">
    <span class="home-stats__number">50+</span>
    <span class="home-stats__label">复合 Skills</span>
  </div>
  <div class="home-stats__item">
    <span class="home-stats__number">MCP</span>
    <span class="home-stats__label">原生协议</span>
  </div>
  <div class="home-stats__item">
    <span class="home-stats__number">MIT</span>
    <span class="home-stats__label">开源许可</span>
  </div>
</div>

---

## 三层架构

<div class="architecture-diagram">
  <div class="arch-layer arch-layer--role">
    <div class="arch-label">Role 岗位层</div>
    <div class="arch-tags">
      <span>Frontend Dev</span>
      <span>Backend Dev</span>
      <span>Architect</span>
      <span>QA Engineer</span>
      <span>SRE</span>
    </div>
  </div>
  <div class="arch-arrow">▼ 组合调用</div>
  <div class="arch-layer arch-layer--skill">
    <div class="arch-label">Composite Skills 复合技能层</div>
    <div class="arch-tags">
      <span>Code Review</span>
      <span>API Design</span>
      <span>DB Design</span>
      <span>CI/CD Setup</span>
    </div>
  </div>
  <div class="arch-arrow">▼ 编排调用</div>
  <div class="arch-layer arch-layer--atomic">
    <div class="arch-label">Atomic Skills 原子技能层</div>
    <div class="arch-tags">
      <span>read_file</span>
      <span>write_code</span>
      <span>run_test</span>
      <span>git_commit</span>
    </div>
  </div>
</div>

---

## 为什么选择 Skills Database？

<div class="home-compare">
  <div class="home-compare__card">
    <div class="home-compare__icon">🎯</div>
    <h3>专业化分工</h3>
    <div class="home-compare__row">
      <div class="home-compare__old">
        <span class="home-compare__label">传统方式</span>
        <p>单一 AI 助手做所有事情，样样通样样松</p>
      </div>
      <div class="home-compare__arrow">→</div>
      <div class="home-compare__new">
        <span class="home-compare__label">Skills Database</span>
        <p>每个 Agent 专注特定岗位，像专业团队协作</p>
      </div>
    </div>
  </div>

  <div class="home-compare__card">
    <div class="home-compare__icon">🧩</div>
    <h3>可复用组合</h3>
    <div class="home-compare__row">
      <div class="home-compare__old">
        <span class="home-compare__label">传统方式</span>
        <p>技能内嵌在 Prompt 中，每次重新描述，无法版本管理</p>
      </div>
      <div class="home-compare__arrow">→</div>
      <div class="home-compare__new">
        <span class="home-compare__label">Skills Database</span>
        <p>技能外置为可复用模块，一次定义处处使用，团队共享</p>
      </div>
    </div>
  </div>

  <div class="home-compare__card">
    <div class="home-compare__icon">✅</div>
    <h3>可验证评估</h3>
    <div class="home-compare__row">
      <div class="home-compare__old">
        <span class="home-compare__label">传统方式</span>
        <p>黑盒操作，不知道 Agent 能做到什么程度</p>
      </div>
      <div class="home-compare__arrow">→</div>
      <div class="home-compare__new">
        <span class="home-compare__label">Skills Database</span>
        <p>原子技能可单独测试，能力可量化评估，支持认证系统</p>
      </div>
    </div>
  </div>
</div>

---

## 预定义 Roles

<div class="home-roles">
  <a href="/roles/frontend-dev" class="home-role-card">
    <span class="home-role-card__icon">💻</span>
    <span class="home-role-card__title">Frontend Dev</span>
    <span class="home-role-card__stack">React · Vue · Angular</span>
  </a>
  <a href="/roles/backend-dev" class="home-role-card">
    <span class="home-role-card__icon">⚙️</span>
    <span class="home-role-card__title">Backend Dev</span>
    <span class="home-role-card__stack">API · Database · Cache</span>
  </a>
  <a href="/roles/solution-architect" class="home-role-card">
    <span class="home-role-card__icon">🏗️</span>
    <span class="home-role-card__title">Architect</span>
    <span class="home-role-card__stack">System · Cloud · Security</span>
  </a>
  <a href="/roles/qa-engineer" class="home-role-card">
    <span class="home-role-card__icon">🧪</span>
    <span class="home-role-card__title">QA Engineer</span>
    <span class="home-role-card__stack">E2E · Unit · Performance</span>
  </a>
  <a href="/roles/sre" class="home-role-card">
    <span class="home-role-card__icon">🔧</span>
    <span class="home-role-card__title">SRE / DevOps</span>
    <span class="home-role-card__stack">K8s · Docker · CI/CD</span>
  </a>
  <a href="/roles/" class="home-role-card home-role-card--more">
    <span class="home-role-card__icon">→</span>
    <span class="home-role-card__title">查看全部</span>
    <span class="home-role-card__stack">20+ Roles</span>
  </a>
</div>

---

## 快速上手

<div class="home-code-split">
  <div class="home-code-split__panel">
    <h3>单 Agent 执行专业任务</h3>
    <p>创建一个 Agent，赋予专业 Role，执行复合 Skill。</p>

```javascript
import { Agent } from 'skills-database'

// 创建专业代码审查 Agent
const reviewer = new Agent({
  role: 'senior-frontend-dev'
})

// 执行代码审查
const result = await reviewer.use('code-review', {
  filePath: './src/components/UserProfile.tsx'
})

console.log(`评分: ${result.score}/100`)
console.log(`发现 ${result.issues.length} 个问题`)
```

  </div>
  <div class="home-code-split__panel">
    <h3>多 Agent 协作完成项目</h3>
    <p>定义团队角色，编排工作流，Agent 自动协作。</p>

```javascript
import { Team } from 'skills-database'

const team = new Team({
  name: 'Auth Feature Team',
  members: [
    { role: 'product-manager', name: 'PM' },
    { role: 'backend-architect', name: 'Architect' },
    { role: 'backend-dev', name: 'Backend' },
    { role: 'frontend-dev', name: 'Frontend' },
    { role: 'qa-engineer', name: 'QA' }
  ]
})

await team.executeWorkflow({
  steps: [
    { agent: 'PM', skill: 'write-prd' },
    { agent: 'Architect', skill: 'design-api' },
    { agent: 'Backend', skill: 'implement-api' },
    { agent: 'Frontend', skill: 'implement-ui' },
    { agent: 'QA', skill: 'write-e2e-tests' }
  ]
})
```

  </div>
</div>

[查看更多示例 →](/examples/)

---

## 开始使用

<div class="home-cta">
  <a href="/getting-started/quickstart" class="home-cta__card home-cta__card--primary">
    <span class="home-cta__icon">🚀</span>
    <span class="home-cta__title">快速开始</span>
    <span class="home-cta__desc">5 分钟上手 Skills Database</span>
  </a>
  <a href="/concepts/" class="home-cta__card">
    <span class="home-cta__icon">📚</span>
    <span class="home-cta__title">核心概念</span>
    <span class="home-cta__desc">理解 Role · Skill · Agent</span>
  </a>
  <a href="/examples/" class="home-cta__card">
    <span class="home-cta__icon">💡</span>
    <span class="home-cta__title">查看示例</span>
    <span class="home-cta__desc">真实场景使用案例</span>
  </a>
</div>

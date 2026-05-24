# Skills (复合技能)

本目录包含可复用的复合技能（Composite Skills）。

## 什么是 Skill？

**Skill = 可组合的复合能力**

Skill 是完成特定任务的能力模块，由多个原子技能编排而成。

## Skill 类型

### 1. 开发类 Skills

| Skill ID | 名称 | 描述 | 原子技能 |
|----------|------|------|----------|
| code-review | 代码审查 | 审查代码质量 | read-file, analyze-code, write-comment |
| api-design | API 设计 | 设计 REST/GraphQL API | read-spec, design-schema, write-doc |
| component-design | 组件设计 | 设计 React/Vue 组件 | analyze-requirements, write-code, write-tests |

### 2. 架构类 Skills

| Skill ID | 名称 | 描述 | 原子技能 |
|----------|------|------|----------|
| system-design | 系统设计 | 设计可扩展系统 | analyze-requirements, design-architecture, draw-diagram |
| database-design | 数据库设计 | 设计数据模型 | analyze-business, design-schema, optimize-query |

### 3. 测试类 Skills

| Skill ID | 名称 | 描述 | 原子技能 |
|----------|------|------|----------|
| write-unit-tests | 单元测试 | 编写单元测试 | read-code, generate-tests, run-tests |
| write-e2e-tests | E2E 测试 | 编写端到端测试 | read-spec, record-flow, generate-tests |

### 4. 运维类 Skills

| Skill ID | 名称 | 描述 | 原子技能 |
|----------|------|------|----------|
| docker-container-management | Docker 容器管理 | 查看状态、执行命令、收集日志 | run-shell-command, docker-exec |
| k8s-deployment-review | K8s 部署审查 | 审查 Deployment 配置的正确性与安全性 | read-file, validate-k8s-manifest, analyze-code |
| terraform-plan-review | Terraform Plan 审查 | 分析 Plan 风险、成本与合规性 | read-file, parse-json-log |
| ci-pipeline-setup | CI 流水线搭建 | 生成 GitHub Actions 等 CI/CD 配置 | run-shell-command, write-file |
| monitoring-stack-setup | 监控栈搭建 | 生成 Prometheus + Grafana 配置与告警规则 | http-health-check, write-file |
| incident-diagnosis | 故障诊断 | 结合日志、指标和容器状态进行根因分析 | http-health-check, read-file, parse-json-log, run-shell-command |
| security-audit | 安全审计 | 扫描配置文件与代码的安全风险 | run-shell-command, read-file |
| log-analysis | 日志分析 | 分析应用日志，定位异常模式 | read-file, parse-json-log |
| incident-postmortem | 事故复盘 | Blameless 复盘：时间线 → RCA → 教训 → 行动项 | incident-runbook |
| release-strategy | 发布策略 | 渐进式交付：特性开关 + Canary + 自动回滚 | grafana-dashboard |

### 5. 设计类 Skills

| Skill ID | 名称 | 描述 | 原子技能 |
|----------|------|------|----------|
| design-system-build | 设计系统构建 | 以 Token 为核心搭建可治理的设计系统 | design-system, component-design, user-research |
| user-research-process | 用户研究流程 | 从计划 → 招募 → 调研 → 编码 → 洞察 | user-research |

### 6. 数据类 Skills

| Skill ID | 名称 | 描述 | 原子技能 |
|----------|------|------|----------|
| data-pipeline-build | 数据管道构建 | 契约 + 血缘 + 监控的生产级 ETL/ELT | data-pipeline, etl-development, data-quality, grafana-dashboard |
| data-warehouse-design | 数据仓库建模 | Kimball 维度建模 + 指标层 | warehouse-design |
| data-quality-management | 数据质量治理 | 剖析 → 预期 → SLA → 事件闭环 | data-quality |

### 7. 移动类 Skills

| Skill ID | 名称 | 描述 | 原子技能 |
|----------|------|------|----------|
| mobile-release-pipeline | 移动端发布流水线 | Build → Sign → Beta → Submit → Rollback | ios-development, health-monitoring |
| cross-platform-development | 跨平台开发 | 共享业务层 + 原生桥接 + 一致性 | cross-platform, performance-optimization |

### 8. 客户成功 / 营销类 Skills

| Skill ID | 名称 | 描述 | 原子技能 |
|----------|------|------|----------|
| customer-onboarding | 客户上手流程 | 围绕 TTV 的旅程图 + Playbook + 自动化 | onboarding, growth-automation, feedback-loop |
| churn-analysis | 客户流失分析 | 定义 → 队列 → 驱动 → 干预 → 影响估算 | retention, cohort-analysis, ab-testing |
| content-marketing-campaign | 内容营销战役 | 叙事 → 主题群 → 日历 → 分发 → KPI | seo-optimization, content-marketing, growth-automation, funnel-analysis |

### 9. AI / LLM 类 Skills

| Skill ID | 名称 | 描述 | 原子技能 |
|----------|------|------|----------|
| llm-app-development | LLM 应用开发 | 用例 → Prompt → RAG → 评测 → 护栏 → 上线 | prompt-engineering, rag-pipeline, llm-evaluation |
| agent-orchestration-design | Agent 编排设计 | 角色 → 工具 → 控制流 → 记忆 → 评测 → 追踪 | tool-use-design, agent-orchestration, llm-evaluation, distributed-tracing |

> **2026-05 更新**：覆盖设计/数据/移动/客户成功/营销/AI 六大零复合岗位与横向治理缺口，复合技能由 28 → 42。

## Skill 结构

```json
{
  "id": "skill-id",
  "type": "composite-skill",
  "metadata": { ... },
  "input": { ... },      // 输入参数
  "output": { ... },     // 输出格式
  "workflow": { ... },   // 工作流定义
  "errorHandling": { ... }
}
```

## 工作流编排

```json
{
  "workflow": {
    "steps": [
      { "skill": "read-file", "input": "{{input.path}}" },
      { "skill": "analyze-code", "input": "{{prev.content}}" },
      { "skill": "write-comment", "input": "{{prev.analysis}}" }
    ]
  }
}
```

## 创建新 Skill

1. 分析任务需要哪些原子技能
2. 设计工作流步骤
3. 定义输入输出格式
4. 编写 Skill 配置文件
5. 测试并验证

## 使用示例

```javascript
// 调用复合技能
const result = await agent.use('code-review', {
  filePath: './src/app.ts'
});

// 链式调用
const design = await agent.use('api-design', { requirements });
const code = await agent.use('generate-code', { spec: design });
```

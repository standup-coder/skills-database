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

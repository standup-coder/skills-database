# 知识库贡献指南

> Skills4Coder 的核心交付物是**高质量的岗位技能知识库**：16 个角色 × 28 个复合技能 × 126 个原子技能。LLM 仅作为辅助扩充工具。本指南说明如何贡献、扩充和质量量化。

## 1. 知识体系总览

```
roles/                 16 个岗位 JSON   ← JD = mainSkills + atomicSkills
skills/                28 个复合技能    ← 工作流编排
atomic-skills/         126 个原子技能   ← 单一职责，可机器消费
schema/                JSON Schema 合约
  ├── role-v1.json
  ├── composite-skill-v1.json
  └── atomic-skill-v1.json
```

每条知识资产都受 JSON Schema Draft-07 严格约束，保证可机器消费、可静态校验。

## 2. 字段约定（关键）

| 类别 | 必填核心字段 | 双语字段 | 质量字段 |
|------|--------------|----------|----------|
| Role | `metadata`, `jd`, `capabilities.mainSkills`, `capabilities.atomicSkills` | `nameZh`, `descriptionZh`, `summaryZh`, `responsibilitiesZh` | `level`, `requirements.coreSkills` |
| Composite | `metadata`, `input.schema`, `output.schema`, `workflow.steps` | `nameZh`, `descriptionZh` | `errorHandling.strategy` |
| Atomic | `metadata`, `input.schema`, `output.schema`, `implementation` | `nameZh`, `descriptionZh` | `constraints`, `errors`, `learning` |

所有 `id` 必须为 kebab-case，`version` 必须遵循 SemVer。

## 3. 贡献流程

### 3.1 新增一个原子技能

```bash
# 1. 在 atomic-skills/ 下创建 your-skill.json
# 2. 引用 schema：
#    "$schema": "../schema/atomic-skill-v1.json"
# 3. 校验
npm run validate-skills
# 4. 通过后提交 PR
```

### 3.2 新增一个岗位

```bash
# 1. 在 roles/ 下创建 your-role.json
#    "$schema": "../schema/role-v1.json"
# 2. capabilities.mainSkills / atomicSkills 必须引用已存在的 ID
npm run validate-roles
```

### 3.3 LLM 辅助扩充（可选）

LLM 仅用于补全已有条目的字段（如 `descriptionZh`、`responsibilities`、knowledgePoints 等），不用于生成全新条目。

```bash
# 模板填充：用规则补字段（无 LLM）
npm run enrich

# LLM 扩充（需 OPENAI_API_KEY 或 ANTHROPIC_API_KEY）
npm run enrich:llm
```

> ⚠️ **原则**：LLM 输出必须人工 review 后入库，避免幻觉污染知识库。

## 4. 质量量化

`validate-roles` / `validate-skills` 会输出"知识库成熟度"报表：

| 指标 | 含义 |
|------|------|
| `errors` | 必填字段缺失 / 格式错误（必须为 0） |
| `warnings` | 引用未知技能、双语缺失、constraints 缺失等 |
| `avgScore` | 综合成熟度 0-100（必填 60% + 双语 20% + 引用完整 20%） |

```bash
npm run validate-skills            # 人类可读
npm run validate-skills -- --json  # CI 友好（JSON）
npm run validate-skills -- --strict # warning 即失败
```

成熟度评分构成：

- 原子技能：必填合规 60% + （双语 nameZh + 双语 descriptionZh + constraints + errors）40%
- 复合技能：必填合规 60% + （双语 nameZh + 双语 descriptionZh + errorHandling）40%
- 岗位：必填合规 60% + 引用完整 20% + 双语 20%

## 5. 学习字段编写规范（`learning`）

原子技能 可选但强烈推荐填写 `learning` 字段，它是学习者实际消费的部分：

```jsonc
"learning": {
  "summaryZh": "一句话讲清该技能价值与核心主张",
  "keyPoints": [
    // 5–8 条关键学习要点，是面试官 / 主管会考察的维度
    // 示例：“先确立基线和 SLO，再做优化”
  ],
  "bestPractices": [
    // 4–8 条可落地的最佳实践，避免高级黑话
  ],
  "antiPatterns": [
    // 3–6 条人人都探过的坑 / 错误认知
  ],
  "resources": [
    // 3–7 条延伸学习资源，type 必须在 enum 内
    { "title": "书名 / 文档 / 网址", "url": "https://...", "type": "book|doc|article|video|course|tool" }
  ],
  "maturityLevels": {
    "junior": "初级工程师在该技能上能独立交付什么",
    "mid": "中级工程师能独立主导什么场景",
    "senior": "高级 / 专家能推动什么跨团队事项"
  }
}
```

**质量检查清单**：

- ✅ `keyPoints` 是“考察点”而非“操作步骤”
- ✅ `bestPractices` 与 `antiPatterns` 成对出现，同一问题正/反两面
- ✅ `resources` 首选业内公认经典（SRE Book、DDIA、OWASP 等）而非个人博客
- ✅ `maturityLevels` 三档差异明显，不能仅“熟练度”差别
- ❌ 不要填“需要掌握 React”这种空话

**示范参考**（业已高质量填写的高价值技能）：

- [architecture-design](../../atomic-skills/architecture-design.json)
- [api-development](../../atomic-skills/api-development.json)
- [system-design](../../atomic-skills/system-design.json)
- [performance-optimization](../../atomic-skills/performance-optimization.json)
- [frontend-architecture-design](../../atomic-skills/frontend-architecture-design.json)
- [component-design](../../atomic-skills/component-design.json)
- [security-architecture](../../atomic-skills/security-architecture.json)
- [testing-strategy](../../atomic-skills/testing-strategy.json)

## 6. 风格与命名

- `id`：kebab-case，与文件名一致（`read-file` ↔ `read-file.json`）
- `version`：SemVer，破坏性变更升 major
- `tags`：英文小写、3-6 个、避免与 `category` 重复
- `description`：50–200 字符，避免营销词，强调"做什么 / 输入 / 输出"
- `descriptionZh`：与英文等长，技术术语保留英文（如 "JWT 认证"）

## 7. 不要做什么

- ❌ 直接编辑 `data/skills4coder.db`——它由 `npm run seed` 从 JSON 重建
- ❌ 跳过 schema 校验提交 PR
- ❌ 用 LLM 自动生成新原子技能不经 review 就合入
- ❌ 在 `roles/` 中引用尚未在 `atomic-skills/` 或 `skills/` 中定义的 ID

## 8. 相关文档

- [Schema: role-v1.json](/schema/role-v1.json)
- [Schema: composite-skill-v1.json](/schema/composite-skill-v1.json)
- [Schema: atomic-skill-v1.json](/schema/atomic-skill-v1.json)
- [评估报告](/documentation/REASSESSMENT_REPORT.md)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Skills Database** 是一个**本地化的职业技能学习与挑选平台**(Personal SkillHub)。

- **核心定位**:把外部权威 skill 资源(5 个采集站点)整理为可学习、可挑选、可沉淀的 Markdown 资料库
- **领域聚焦**:这里的 skills 是**岗位胜任能力**(job competencies),**不是** Agent runtime 能力
- **数据真值**:**Markdown** 是唯一源真值;JSON 仅作为辅助 schema 存在
- **呈现层**:`tools/web/` 只是一个轻量渲染层,不持有自己的数据库

```
┌─────────────────────────────────────────┐
│          catalog/                       │
│   按领域分类的 skills MD(主数据)         │
│   217 条,14 个领域                      │
└──────────────┬──────────────────────────┘
               │ 反查
               ▼
┌─────────────────────────────────────────┐
│          sources/                       │
│   原始采集档案(5 个外部站点)             │
│   溯源,可重跑归类                       │
└─────────────────────────────────────────┘
```

## Build & Dev Commands

```bash
# 归类:把 sources/<vendor>/*.md 映射到 catalog/<domain>/
node tools/import/classify.js            # 实际归类(写文件)
node tools/import/classify.js --dry      # 预览分布,不写文件

# 校验
npm run lint          # ESLint

# 本地浏览站
cd tools/web && <启动命令>     # 待 tools/web/ 实现
```

> 历史命令 `npm run validate-roles` / `validate-skills` / `build` 不再适用——对应 JSON 资产已被 catalog 体系替代。

## Directory Map

| 路径 | 用途 | 是否提交 |
|------|------|----------|
| `catalog/` | 按领域分类的 skills MD,**主数据** | ✅ |
| `catalog/<domain>/_index.md` | 每个领域的索引(由 classify.js 生成) | ✅ |
| `sources/<vendor>/` | 原始采集档案(anthropic/mcpmarket/skills-sh/qoder/voltagent) | ✅ |
| `sources/_global_index.md` | 跨站点采集总览 + 重叠分析 | ✅ |
| `personal/` | 个人挑选状态(picked/in-progress/learned) | ❌ gitignore |
| `tools/import/classify.js` | sources → catalog 归类脚本 | ✅ |
| `tools/web/` | 静态浏览站(呈现层) | ✅ |
| `templates/` | skill MD frontmatter 模板 | ✅ |
| `documentation/` | 项目过程文档(gap 报告、采集日志) | ✅ |

## Catalog Domains(共 14 个 + uncategorized)

| Domain | 数量 | 说明 |
|--------|------|------|
| tools | 63 | 第三方 vendor 工具集成(Lark/Azure/Vercel/…) |
| testing | 25 | 测试工程 |
| security | 21 | 安全 |
| ai-ml | 19 | AI/ML/LLM |
| data | 17 | 数据工程 |
| design | 15 | 设计与创意 |
| docs | 13 | 文档 |
| frontend | 12 | 前端开发 |
| mobile | 8 | 移动开发 |
| backend | 6 | 后端工程 |
| productivity | 5 | 生产力/工具 |
| product | 2 | 产品 |
| devops | 2 | DevOps/基础设施 |
| marketing | 1 | 营销 |
| uncategorized | 8 | 待手工裁决 |

## Important Patterns

- **MD frontmatter 必填字段**:`id` / `title` / `nameZh` / `domain` / `tags` / `catalogSource`
- **`classify.js` 幂等**——改 RULES 后可整体重跑,无副作用
- **来源溯源**——每个 catalog MD 都带 `catalogSource` 字段,可反查到 `sources/<source>/<file>`
- **个人与公共分离**——`personal/` 默认 `.gitignore`,允许多人协作同一份 catalog 而不污染
- **Web 仅渲染**——`tools/web/` 直接读 `catalog/**/*.md`,**不**缓存数据到自己的存储

## Anti-patterns(避免)

- ❌ 不要在 catalog/ 里建 JSON——它是 MD 唯一真值的目录
- ❌ 不要把 `personal/` 内容提交——它是个人的,不是公共的
- ❌ 不要把 skills 当作 Agent runtime 能力来"编排"——这是职业技能库,不是 orchestration framework
- ❌ 不要绕过 classify.js 手动放文件——除非已改 RULES 并重跑
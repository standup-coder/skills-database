# Changelog

## [3.0.0] - 2026-07-26

### Changed — 重大重组:从"Agent 编排框架"转向"本地 SkillHub"

**愿景转变**
- 原:Role × Skill × Atomic 的多 Agent 编排 SDK
- 现:**本地化职业技能学习与挑选平台** — Skills 是岗位胜任能力(job competencies),不是 Agent runtime 能力

**数据模型转变**
- 原:`roles/*.json` + `skills/*.json` + `atomic-skills/*.json`(205 条结构化 JSON)
- 现:`catalog/**/*.md`(428 条 Markdown,**唯一真值**)+ `sources/<vendor>/`(原始采集档案)+ `personal/`(个人本地状态,不入库)

**目录结构转变**
- 删除:`roles/`、`skills/`、`atomic-skills/`、`skill-lists/`、`schema/`、`app/`(SDK + server + webui + orchestration)、`dist/`、`data/`(SQLite)、`scripts/`、`examples/`
- 新增:`catalog/`、`templates/`、`tools/import/`、`tools/web/`

**工具链收敛**
- 原:TypeScript build + vitest + VitePress + Express + SQLite + 多种脚本语言(`.ts`/`.js`/`.cjs`/`.mjs`)
- 现:**纯 Node ESM** + 4 个工具脚本:
  - `tools/import/classify.js` — sources → catalog 归类
  - `tools/import/json-to-md.js` — 老 JSON → MD(一次性)
  - `tools/import/regenerate-indices.js` — 重建所有 `_index.md`
  - `tools/web/build.js` — 生成单文件离线浏览站

**品牌**
- `Skills4Coder` → `Skills Database`
- npm 包:`skills4coder` → `skills-database`
- CLI 名:`skills` →(已无 CLI,纯浏览站)

**Web UI 定位**
- 原:`app/webui/`(Vue SPA + 后端,编辑/管理后台)
- 现:`tools/web/index.html`(单文件离线静态站,215KB,含搜索/筛选/15 领域导航)

**个人状态**
- 新增 `personal/` 目录,默认 `.gitignore`
- 支持 `picked.md` / `in-progress.md` / `learned.md` 三阶段追踪

**文档**
- `README.md` 完全重写
- `CLAUDE.md` 重写为 AI Agent 项目地图
- `CONTRIBUTING.md` 重写为面向贡献者的指引
- `AGENTS.md` 重新定义"Agent"含义(人类学习者,非 AI runtime)
- `templates/` 新增 4 个 skill frontmatter 模板

---

## [2.0.0] - 2026-05-19

### Added
- Agent orchestration framework rewrite
- MCP (Model Context Protocol) integration
- SkillHub adapter for skill discovery and sharing
- Web UI for visual skill management
- CLI tool for terminal-based workflows
- Role, skill, and atomic-skill JSON definition system
- Orchestration engine for composing agent capabilities
- Server/API layer

### Changed
- Transformed from a skill checklist project to a full orchestration framework
- Restructured project directories (roles/, skills/, atomic-skills/, orchestration/)
- Migrated to TypeScript with ESM modules and Vite build

---

## [1.0.0] - 2025-01-01

### Added
- Initial project structure
- Professional skill checklist definitions
- Multilingual documentation support
- Vibe Coding skills focus
- Project documentation scaffolding
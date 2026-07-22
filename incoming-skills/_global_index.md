---
generatedAt: 2026-07-22
totalCollected: 167
uniqueSkills: 158
duplicatesMerged: 9
sources: [qoder, skills-sh, anthropic, voltagent]
---

# 跨站点热门 Skills 采集总索引

> 本目录是 4 个外部站点 TOP50 采集结果的**暂存区**，未并入根目录领域分类。
> 待仓库重组（见根目录 `RESTRUCTURE_DESIGN.md`）执行阶段 4-5 时，按 frontmatter `category` 字段归入对应中文领域文件夹。

---

## 采集概览

| 来源站点 | URL | 采集数 | 排序依据 | 独占技能 |
|----------|-----|--------|----------|----------|
| **qoder-community** | https://qoder-community.pages.dev/zh/skills/ | 50 | 徽章权重（高质量/热门/精选） | 50 |
| **skills.sh** | https://www.skills.sh/ | 50 | All-Time installs 降序 | 49 |
| **anthropics/skills** | https://github.com/anthropics/skills | 17 | 官方仓库全量（不足 50） | 16 |
| **VoltAgent/awesome-agent-skills** | https://github.com/VoltAgent/awesome-agent-skills | 50 | README 收录（声称 1497+）跨类均衡 | 50 |
| **合计** | — | **167** | — | **166** |
| **去重后唯一** | — | **158** | — | — |

---

## 跨站点重叠（9 个，已识别）

> voltagent 是 awesome list，其中收录了 anthropic 官方仓库的 8 个 skill；qoder 与 skills.sh 对 "前端设计" 各有一份独立翻译。

| 技能 | 收录来源 | 处理建议 |
|------|----------|----------|
| algorithmic-art | anthropic + voltagent | 以 anthropic 官方为主，voltagent 版作参考链接 |
| docx | anthropic + voltagent | 同上 |
| frontend-design | anthropic + voltagent | 同上 |
| mcp-builder | anthropic + voltagent | 同上 |
| pdf | anthropic + voltagent | 同上 |
| pptx | anthropic + voltagent | 同上 |
| skill-creator | anthropic + voltagent | 同上 |
| xlsx | anthropic + voltagent | 同上 |
| 前端设计 | qoder + skills-sh | 保留 qoder 中文版，skills-sh 版的 installs 数据补入参考 |

---

## 分类分布（按 frontmatter category 字段粗分）

| 类别 | 数量 | 主要来源 |
|------|------|----------|
| 开发（frontend/backend/devops） | ~45 | qoder 21 + voltagent devops/backend + skills-sh 工程 |
| AI/LLM | ~25 | voltagent AI APIs + skills-sh 部分飞书 |
| 办公协同（office/文档） | ~30 | skills-sh 飞书 23 + anthropic docs 4 + qoder 文档 5 |
| 营销 | ~12 | qoder 营销 7 + voltagent 部分 |
| 数据/数据库 | ~10 | voltagent 6 + qoder 数据 1 |
| 设计/创意 | ~10 | anthropic 创意 3 + voltagent 部分 + qoder 设计 4 |
| 安全 | ~5 | qoder 安全 2 + voltagent auth |
| 测试 | ~5 | voltagent testing 3 + skills-sh 部分 |
| 自动化/集成 | ~10 | voltagent 集成 + qoder 自动化 |
| 其他（教育/区块链/视频等） | ~6 | qoder + skills-sh |

> 准确归类需在重组阶段 4 由 `category-map.cjs` 逐个判定。

---

## 各来源 _index.md 入口

- [qoder-community/_index.md](./qoder/_index.md) — 50 个，开发为主
- [skills-sh/_index.md](./skills-sh/_index.md) — 50 个，飞书 + Azure 为主
- [anthropic/_index.md](./anthropic/_index.md) — 17 个，文档 + 创意 + 工具
- [voltagent/_index.md](./voltagent/_index.md) — 50 个，AI/DB/集成均衡

---

## 后续并入计划

这批语料在重组 `RESTRUCTURE_DESIGN.md` 阶段 4-5 并入正式目录：

1. 每条 md 按 frontmatter `category` 字段查 `category-map.cjs`，得目标中文领域文件夹
2. 合并去重后的 158 个唯一技能 → 移入 `开发/`、`运维/`、`office/` 等对应文件夹
3. 各来源 `_index.md` 保留作为溯源记录，移入 `tools/web/data/sources/`
4. 跨源重叠的 9 个技能，按上表"处理建议"择优保留，其余作"参考链接"合并入正文

---

## 字段规范（供并入参考）

每个 md 必须含以下 frontmatter：

```yaml
---
source: qoder | skills-sh | anthropic | voltagent   # 原始来源
sourceUrl: <详情页完整 URL>                          # 溯源链接
title: <原始标题>                                    # 保留原文
nameZh: <中文名>                                     # 归类与索引用
category: <原始分类>                                 # 供 category-map 判定
tags: [<标签数组>]
rank: <1-50>                                        # 该来源内的热度名次
---
```

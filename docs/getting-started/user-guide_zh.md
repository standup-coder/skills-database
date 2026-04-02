# 用户手册

使用 Skills4Coder 进行职业发展的完整指南。

## 🌐 语言
- [English](user-guide.md) | [中文](user-guide_zh.md)

---

## 目录

1. [简介](#简介)
2. [理解技能树](#理解技能树)
3. [基于角色的学习路径](#基于角色的学习路径)
4. [技能生态整合](#技能生态整合)
5. [追踪学习进度](#追踪学习进度)
6. [高级用法](#高级用法)
7. [常见问题](#常见问题)

---

## 简介

Skills4Coder 是一个为技术专业人士设计的综合技能树框架。无论您是刚开始职业生涯，还是希望晋升到下一个级别，本指南将帮助您有效地导航和利用技能树。

### Skills4Coder 有什么不同？

- **全面覆盖**: 四大主要角色，详细的技能分解
- **AI 原生整合**: 直接链接到 AI 技能市场（SkillHub、Claw、MCP）
- **渐进式级别**: 从初级到专家的清晰学习路径
- **社区驱动**: 开源并持续演进
- **实用导向**: 雇主重视的真实技能

---

## 理解技能树

### 技能树结构

每个技能树遵循一致的结构：

```
角色概览
├── 技能级别 (初级 → 专家)
│   ├── 核心技能
│   ├── 工具与技术
│   ├── 最佳实践
│   └── 学习资源
└── 专业方向
    ├── 方向 A
    ├── 方向 B
    └── 方向 C
```

### 技能级别说明

| 级别 | 经验 | 关注点 |
|-------|-----------|-------|
| **初级** | 0-2 年 | 基础、基本工具、简单项目 |
| **中级** | 2-4 年 | 设计模式、测试、协作 |
| **高级** | 4-7 年 | 架构、性能、领导力 |
| **专家** | 7+ 年 | 战略、创新、组织影响 |

---

## 基于角色的学习路径

### 🧑‍💻 开发者路径

**概述**: 前端、后端和全栈软件开发。

**学习旅程**:
1. **初级**: 编程基础、Git、HTML/CSS/JavaScript
2. **中级**: 框架、数据库、测试、CI/CD 基础
3. **高级**: 系统设计、微服务、安全、指导他人
4. **专家**: 架构决策、创新、技术领导力

**专业方向**:
- [前端](../dev-skills/specializations/frontend_zh.md) - UI/UX、React/Vue/Angular
- [后端](../dev-skills/specializations/backend_zh.md) - API、数据库、服务端
- [全栈](../dev-skills/specializations/fullstack_zh.md) - 完整应用开发
- [移动](../dev-skills/specializations/mobile_zh.md) - iOS、Android、React Native
- [数据工程](../dev-skills/specializations/data_zh.md) - 大数据、ETL、分析
- [机器学习](../dev-skills/specializations/ml_zh.md) - AI/ML 模型开发

### 🏗️ 架构师路径

**概述**: 系统设计和技术决策。

**架构类型**:
- [解决方案架构](../arch-skills/skills-lists/solution-arch_zh.md) - 项目级设计
- [企业架构](../arch-skills/skills-lists/enterprise-arch_zh.md) - 组织标准
- [云架构](../arch-skills/skills-lists/cloud-arch_zh.md) - 云原生解决方案
- [安全架构](../arch-skills/skills-lists/security-arch_zh.md) - 安全设计
- [数据架构](../arch-skills/skills-lists/data-arch_zh.md) - 数据治理

### 🧪 测试路径

**概述**: 质量保证和测试策略。

**测试类型**:
- [手动测试](../testing-skills/skills-lists/manual-testing_zh.md) - 人工测试
- [自动化测试](../testing-skills/skills-lists/test-automation_zh.md) - 自动化测试框架
- [性能测试](../testing-skills/skills-lists/performance-testing_zh.md) - 负载和压力测试
- [安全测试](../testing-skills/skills-lists/security-testing_zh.md) - 漏洞评估
- [QA 流程](../testing-skills/skills-lists/qa-process_zh.md) - 质量方法论

### 🔧 运维路径

**概述**: DevOps、SRE 和平台工程。

**运维领域**:
- [基础设施](../ops-skills/skills-lists/infrastructure_zh.md) - 云、虚拟化
- [DevOps & CI/CD](../ops-skills/skills-lists/devops_zh.md) - 自动化流水线
- [监控](../ops-skills/skills-lists/monitoring_zh.md) - 可观察性、告警
- [安全运维](../ops-skills/skills-lists/secops_zh.md) - SecOps 实践
- [平台工程](../ops-skills/skills-lists/platform-engineering_zh.md) - 开发者体验

---

## 技能生态整合

### AI 原生技能

现代开发越来越多地涉及 AI 助手。Skills4Coder 整合了主要 AI 技能市场：

#### [腾讯 SkillHub](../ecosystem/skillhub_zh.md)
- 访问腾讯 AI 技能市场
- 企业级技能
- 中文语言优化

#### [Claw Hub](../ecosystem/claw-hub_zh.md)
- Lobehub 的 AI 技能生态
- 开源技能分享
- 多模态 AI 能力

#### [MCP (Model Context Protocol)](../ecosystem/mcp-registry_zh.md)
- Anthropic 的开放 AI 集成协议
- 标准化技能定义
- 跨平台兼容性

### IDE 整合

#### [GitHub Copilot](../ecosystem/github-copilot_zh.md)
- AI 结对编程助手
- 代码补全和生成
- 上下文感知建议

#### [Cursor](../ecosystem/cursor_zh.md)
- AI 优先的代码编辑器
- 自然语言转代码
- 重构辅助

#### [Lobe Chat](../ecosystem/lobe-chat_zh.md)
- 开源 AI 聊天平台
- 自定义技能插件
- 多模型支持

---

## 追踪学习进度

### 方法一：基于 Git 的追踪

1. **Fork 仓库**
   ```bash
   # 点击 GitHub 上的 "Fork"，然后：
   git clone https://github.com/YOUR_USERNAME/skills4coder.git
   cd skills4coder
   ```

2. **追踪您的技能**
   - 在 `docs/` 中编辑技能清单
   - 用 `- [x]` 标记已完成的技能
   - 添加笔记和资源

3. **提交进度**
   ```bash
   git add docs/dev-skills/skills-lists/beginner_zh.md
   git commit -m "更新：完成 Git 和 Docker 基础"
   git push
   ```

### 方法二：本地副本

简单地下载仓库并在本地编辑：

```bash
git clone https://github.com/standup-coder/skills4coder.git
# 用您喜欢的编辑器编辑文件
```

### 方法三：在线编辑器

使用 GitHub 的网页界面直接编辑：
1. 导航到任意技能列表
2. 点击铅笔图标（编辑）
3. 进行更改
4. 提交到您的 fork

---

## 高级用法

### 创建自定义技能路径

您可以为组织创建自定义技能树：

1. 复制现有技能列表作为模板
2. 根据您的技术栈定制技能
3. 添加公司特定要求
4. 与团队分享

### 技能差距分析

将当前技能与职位要求对比：

1. 查看目标角色的职位描述
2. 将所需技能映射到 Skills4Coder 分类
3. 识别差距并创建学习计划
4. 随时间追踪进度

### 团队技能评估

对于工程管理者：

1. 让团队成员完成技能清单
2. 聚合数据识别团队优势/差距
3. 相应规划培训和招聘
4. 用于绩效评估和职业发展

---

## 常见问题

### 应该多久更新一次技能？

**建议**: 每季度审查，每月更新。技术快速演进，定期审查确保您保持最新。

### 可以贡献新技能吗？

**可以！** 查看我们的[贡献指南](../community/contributing-guide_zh.md)了解详情。

### 如何在角色之间转换？

使用跨角色技能映射：
- 开发者 → 架构师: 关注系统设计和模式
- 开发者 → DevOps: 学习基础设施和自动化
- QA → 开发者: 加强编程基础

### 包含认证吗？

是的，每个技能树在适用情况下包含相关认证。

### 如何与 AI 助手一起使用？

查看我们的[生态](../ecosystem/)部分获取 AI 整合指南。

---

## 下一步

- 📊 [评估当前技能](../dev-skills/skills-lists/beginner_zh.md)
- 🎯 [设定学习目标](../dev-skills/overview_zh.md)
- 🔗 [探索 AI 技能工具](../ecosystem/)
- 🤝 [加入社区](../community/)

---

**需要帮助？**
- 💬 [GitHub Discussions](https://github.com/standup-coder/skills4coder/discussions)
- 🐛 [报告问题](https://github.com/standup-coder/skills4coder/issues)
- 📧 联系: skills4coder@example.com

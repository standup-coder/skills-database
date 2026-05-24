#!/usr/bin/env node
/**
 * 第七轮 batch 7：12 个设计 / 架构 / PM / 测试 / 领导力 placeholder 全量 enrich
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'atomic-skills');

const PATCHES = {
  'ui-design': {
    name: 'UI Design',
    nameZh: 'UI 设计',
    description: 'Visual interface design covering layout, typography, color, components and accessibility.',
    descriptionZh: '视觉界面设计：布局 / 字体 / 配色 / 组件 / 可访问性。',
    tags: ['design', 'ui', 'visual', 'layout', 'a11y'],
    category: 'design',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { type: 'string' },
      platform: { type: 'string', enum: ['web', 'ios', 'android', 'desktop'] },
      designSystem: { type: 'string' }
    }},
    output: { type: 'object', properties: { mockups: { type: 'array' }, tokens: { type: 'object' }, a11yReport: { type: 'object' } } },
    errors: { CONTRAST_FAIL: { code: 'UI_001', message: '对比度低于 WCAG AA', retryable: false } },
    learning: {
      summaryZh: 'UI 设计 80% 是约束游戏：栅格、间距、字阶、色阶、组件状态——把这五件事钉死，剩下 20% 是品牌与情感。',
      keyPoints: ['8pt grid + 4pt baseline', 'type scale 用模度系数（1.125 / 1.25）', '色阶要看对比度而非主观', 'state 完整性：default/hover/active/focus/disabled', 'token > 直接写 hex'],
      bestPractices: ['Figma 变量 / token 对接 design system', '组件先建状态矩阵再画', 'a11y 用 Stark / Contrast 插件做 lint', '与前端共享 token 文件'],
      antiPatterns: ['"差不多就行" 的 4px / 6px 混用', '颜色靠美感不查对比度', '只画 default 不画 disabled', '同一组件多版本散落'],
      resources: [
        { title: 'Refactoring UI', url: 'https://www.refactoringui.com/', type: 'book' },
        { title: 'Material 3', url: 'https://m3.material.io/', type: 'doc' },
        { title: 'Apple HIG', url: 'https://developer.apple.com/design/human-interface-guidelines/', type: 'doc' }
      ],
      maturityLevels: { junior: '能复用组件画页面', mid: '能建 token 与状态矩阵', senior: '能驱动 design system 与 a11y baseline' }
    }
  },

  'interaction-design': {
    name: 'Interaction Design',
    nameZh: '交互设计',
    description: 'Design interaction flows, micro-interactions, motion and feedback for product experiences.',
    descriptionZh: '产品体验中的交互流程 / 微交互 / 动效 / 反馈设计。',
    tags: ['design', 'interaction', 'ux', 'motion', 'flow'],
    category: 'design',
    input: { type: 'object', required: ['scenario'], properties: {
      scenario: { type: 'string' },
      goal: { type: 'string' },
      constraints: { type: 'array' }
    }},
    output: { type: 'object', properties: { flowDiagram: { type: 'string' }, prototype: { type: 'string' }, motionSpec: { type: 'object' } } },
    errors: { LOOP_DETECTED: { code: 'IX_001', message: '交互流程存在死循环', retryable: false } },
    learning: {
      summaryZh: '交互不是把页面连起来，是定义"系统对用户行为的回应"；好的交互让用户不需要思考下一步。',
      keyPoints: ['每个动作都有反馈（视觉 / 听觉 / 触觉）', '动效是因果不是装饰（200-300ms）', 'edge case 优先于 happy path', '减少决策点 > 增加引导', '可逆性 > 二次确认'],
      bestPractices: ['flow 先 happy path 再 error / empty / loading', 'Lottie / Rive 做复杂动效', 'usability test 5 人足够', '原型保真度按阶段升级（low → mid → high）'],
      antiPatterns: ['动效炫技拖慢操作', '错误信息不可恢复', '同一动作多入口结果不一致', '只做 happy path 上线'],
      resources: [
        { title: 'About Face', url: 'https://www.cooper.com/journal/2014/8/about-face-the-essentials-of-interaction-design', type: 'book' },
        { title: 'Material Motion', url: 'https://m3.material.io/styles/motion/overview', type: 'doc' },
        { title: 'NN/g Articles', url: 'https://www.nngroup.com/articles/', type: 'article' }
      ],
      maturityLevels: { junior: '能画基础流程图', mid: '能完整覆盖状态 + 动效 spec', senior: '能驱动产品交互范式与跨端一致性' }
    }
  },

  'state-management': {
    name: 'State Management',
    nameZh: '前端状态管理',
    description: 'Design and implement frontend state management patterns for complex SPAs.',
    descriptionZh: '为复杂 SPA 设计与实现前端状态管理模式。',
    tags: ['frontend', 'state', 'redux', 'zustand', 'react-query'],
    category: 'frontend',
    input: { type: 'object', required: ['app'], properties: {
      app: { type: 'string' },
      framework: { type: 'string', enum: ['react', 'vue', 'svelte', 'solid'] },
      pattern: { type: 'string', enum: ['flux', 'atomic', 'signal', 'server-state'] }
    }},
    output: { type: 'object', properties: { storeShape: { type: 'object' }, selectors: { type: 'array' }, sideEffects: { type: 'array' } } },
    errors: { STATE_DUPLICATION: { code: 'SM_001', message: 'server state 与 client state 重复', retryable: false } },
    learning: {
      summaryZh: '前端状态最大的反模式是把 server state 当 client state 管；React Query / SWR 把缓存语义还给数据层之后，全局 store 应该只剩 UI state。',
      keyPoints: ['区分 server state / UI state / form state / URL state', 'colocate state（最近共享祖先）', 'derived state 用 selector 不用 store', '不可变更新（immer）', 'memoization 要看依赖稳定性'],
      bestPractices: ['server state → React Query / SWR / RTK Query', 'UI state → Zustand / Jotai / Context', 'form → React Hook Form / Tanstack Form', 'URL → 路由参数', 'devtools 永远开'],
      antiPatterns: ['把 API 数据塞 Redux 手动同步', '一切走全局 store 引发 re-render 风暴', 'useState 链式 setState 嵌套', 'Context 滥用做高频更新'],
      resources: [
        { title: 'TkDodo blog', url: 'https://tkdodo.eu/blog/', type: 'article' },
        { title: 'Redux Style Guide', url: 'https://redux.js.org/style-guide/', type: 'doc' },
        { title: 'Zustand', url: 'https://zustand-demo.pmnd.rs/', type: 'doc' }
      ],
      maturityLevels: { junior: '能用 useState / Context', mid: '能选型 server vs client state 并落地', senior: '能驱动复杂应用状态架构与性能优化' }
    }
  },

  'prototype': {
    name: 'Prototype',
    nameZh: '原型设计',
    description: 'Build prototypes at varying fidelity to validate ideas before engineering investment.',
    descriptionZh: '在投入工程实现前，用不同保真度原型验证创意。',
    tags: ['design', 'prototype', 'figma', 'usability', 'validation'],
    category: 'design',
    input: { type: 'object', required: ['idea'], properties: {
      idea: { type: 'string' },
      fidelity: { type: 'string', enum: ['paper', 'low', 'mid', 'high'] },
      audience: { type: 'string' }
    }},
    output: { type: 'object', properties: { artifact: { type: 'string' }, testPlan: { type: 'object' }, decisions: { type: 'array' } } },
    errors: { OVERSPEC: { code: 'PR_001', message: '保真度过高陷入实现细节', retryable: false } },
    learning: {
      summaryZh: '原型的价值是"以小成本拒绝坏想法"；选错保真度等于在错误问题上投精力。',
      keyPoints: ['fidelity 与决策成本匹配', '一次只验证 1-2 个假设', '让用户用，别让用户看', 'paper > Figma > coded 渐进', '失败原型也是产出'],
      bestPractices: ['5 用户法则做 usability test', 'Figma + Maze / UserTesting 做远程测试', '记录决策日志（decided / parked / killed）', '高保真前先低保真过一轮'],
      antiPatterns: ['一上来就高保真', '只给 stakeholder 看不让用户用', '原型当成最终设计', '同一原型反复打磨不验证'],
      resources: [
        { title: 'IDEO Prototyping', url: 'https://www.ideo.com/journal/prototyping', type: 'article' },
        { title: 'Maze', url: 'https://maze.co/', type: 'doc' },
        { title: 'Sprint by Jake Knapp', url: 'https://www.thesprintbook.com/', type: 'book' }
      ],
      maturityLevels: { junior: '能做 mid-fi Figma 原型', mid: '能选 fidelity 与跑 usability test', senior: '能驱动组织级 prototype-driven 决策文化' }
    }
  },

  'roadmap-design': {
    name: 'Roadmap Design',
    nameZh: '产品路线图设计',
    description: 'Design product roadmaps balancing strategy, user value, and engineering capacity.',
    descriptionZh: '平衡战略 / 用户价值 / 工程容量来设计产品路线图。',
    tags: ['product', 'roadmap', 'strategy', 'planning', 'pm'],
    category: 'product',
    input: { type: 'object', required: ['horizon'], properties: {
      horizon: { type: 'string', enum: ['quarter', 'half', 'year'] },
      themes: { type: 'array' },
      capacity: { type: 'object' }
    }},
    output: { type: 'object', properties: { roadmap: { type: 'array' }, themes: { type: 'array' }, risks: { type: 'array' } } },
    errors: { CAPACITY_OVERFLOW: { code: 'RM_001', message: '计划项超出工程容量', retryable: false } },
    learning: {
      summaryZh: 'Roadmap 不是 feature 列表，是"问题优先级 + 可信度"；按 outcome 而非 output 编排，能避免过承诺。',
      keyPoints: ['outcome > output（NorthStar metric 驱动）', 'Now / Next / Later 替代精确日期', 'theme 比单点 feature 稳定', 'capacity 留 20-30% buffer', '每季度 review，不锁年度'],
      bestPractices: ['ProductBoard / Productplan / Linear 做工具', 'roadmap 公开 → 反馈 → 复盘形成节奏', '与 OKR 双向映射', '风险列在 roadmap 上而非藏起来'],
      antiPatterns: ['把销售承诺直接当 roadmap', 'Gantt 精确到天的年计划', 'feature factory 思维', 'roadmap 不公开内部各 stakeholder 信息差'],
      resources: [
        { title: 'Product Roadmaps Relaunched', url: 'https://www.amazon.com/Product-Roadmaps-Relaunched-Set-Direction/dp/149197172X', type: 'book' },
        { title: 'ProductPlan', url: 'https://www.productplan.com/learn/', type: 'doc' },
        { title: 'Reforge: Roadmap', url: 'https://www.reforge.com/blog/lean-roadmap', type: 'article' }
      ],
      maturityLevels: { junior: '能维护季度 roadmap', mid: '能 outcome 驱动 + theme 编排', senior: '能驱动组织级 roadmap 治理与战略对齐' }
    }
  },

  'write-prd': {
    name: 'Write PRD',
    nameZh: '撰写 PRD',
    description: 'Author Product Requirement Documents that align stakeholders on what and why before how.',
    descriptionZh: '撰写 PRD：在 how 之前对齐 what 与 why。',
    tags: ['product', 'prd', 'requirement', 'spec', 'pm'],
    category: 'product',
    input: { type: 'object', required: ['feature'], properties: {
      feature: { type: 'string' },
      template: { type: 'string', enum: ['amazon-press-release', 'lean', 'classic'] }
    }},
    output: { type: 'object', properties: { prd: { type: 'string' }, openQuestions: { type: 'array' }, successMetrics: { type: 'array' } } },
    errors: { MISSING_METRIC: { code: 'PRD_001', message: '缺少成功指标', retryable: false } },
    learning: {
      summaryZh: 'PRD 不是给工程的"任务书"，是给所有 stakeholder 的"对齐契约"；写不清楚 why，工程就只能猜。',
      keyPoints: ['Problem → User → Value → Solution 顺序', '成功指标必须可量化', 'open questions 显式列出', '边界（out of scope）与 in scope 同等重要', 'release criteria 早写'],
      bestPractices: ['Amazon working backwards / press release 模板', '与 design / eng 并行写 spike', 'review 时按 stakeholder 视角分轮', 'PRD 版本化（Git or Notion 历史）'],
      antiPatterns: ['先写 Solution 后补 Problem', '没有 metric 的 PRD', '"详细需求"列 200 条把工程压垮', '上线后 PRD 不更新成历史文档'],
      resources: [
        { title: 'Amazon Working Backwards', url: 'https://www.amazon.com/Working-Backwards-Insights-Stories-Secrets/dp/1250267595', type: 'book' },
        { title: 'Lenny PRD template', url: 'https://www.lennysnewsletter.com/p/the-ultimate-guide-to-writing-prds', type: 'article' },
        { title: 'Marty Cagan: Inspired', url: 'https://svpg.com/inspired-how-to-create-products-customers-love/', type: 'book' }
      ],
      maturityLevels: { junior: '能用模板写一份功能 PRD', mid: '能驱动 stakeholder review 并量化指标', senior: '能落地 PRD 体系并驱动 product discovery 文化' }
    }
  },

  'stakeholder-management': {
    name: 'Stakeholder Management',
    nameZh: '利益相关方管理',
    description: 'Identify, prioritize and engage stakeholders to align decisions and reduce political risk.',
    descriptionZh: '识别 / 优先级 / 沟通利益相关方，对齐决策并降低组织风险。',
    tags: ['leadership', 'stakeholder', 'communication', 'alignment', 'pm'],
    category: 'leadership',
    input: { type: 'object', required: ['initiative'], properties: {
      initiative: { type: 'string' },
      orgScope: { type: 'string' }
    }},
    output: { type: 'object', properties: { stakeholderMap: { type: 'array' }, communicationPlan: { type: 'object' }, riskRegister: { type: 'array' } } },
    errors: { MISSING_DECISION_OWNER: { code: 'SH_001', message: '缺少明确决策人', retryable: false } },
    learning: {
      summaryZh: '项目失败 80% 不是技术问题，是没人决策或决策被推翻；stakeholder map 不是政治游戏，是把决策权显式化。',
      keyPoints: ['power × interest 矩阵', 'RACI 一定有 R 和 A', '同步频率匹配影响力', '反对者比沉默者更有价值', '坏消息要早汇报'],
      bestPractices: ['每个 initiative 一份 stakeholder map', '定期 1:1 而非全员大会', 'decision log 写下 by whom + when', '红黄绿状态周报'],
      antiPatterns: ['决策靠"群里没人反对就当通过"', '不区分 informed 和 consulted', '只汇报好消息', 'stakeholder 后期才介入推翻方案'],
      resources: [
        { title: 'HBR: Stakeholder Theory', url: 'https://hbr.org/2019/07/stakeholder-capitalism', type: 'article' },
        { title: 'PMI Stakeholder Engagement', url: 'https://www.pmi.org/learning/library/stakeholder-engagement-effective-management-approach-9974', type: 'doc' },
        { title: 'Crucial Conversations', url: 'https://cruciallearning.com/crucial-conversations-book/', type: 'book' }
      ],
      maturityLevels: { junior: '能识别项目主要 stakeholder', mid: '能落地 RACI + 决策日志', senior: '能驱动跨组织 alignment 并影响战略决策' }
    }
  },

  'team-leadership': {
    name: 'Team Leadership',
    nameZh: '团队领导力',
    description: 'Lead engineering teams covering hiring, growth, performance, and culture.',
    descriptionZh: '领导工程团队：招聘 / 成长 / 绩效 / 文化。',
    tags: ['leadership', 'management', 'engineering-manager', 'culture', 'people'],
    category: 'leadership',
    input: { type: 'object', required: ['team'], properties: {
      team: { type: 'string' },
      stage: { type: 'string', enum: ['forming', 'storming', 'norming', 'performing'] }
    }},
    output: { type: 'object', properties: { teamHealth: { type: 'object' }, growthPlan: { type: 'array' }, hiringPlan: { type: 'object' } } },
    errors: { LOW_PSYCH_SAFETY: { code: 'TL_001', message: '心理安全度过低，团队不敢提问题', retryable: false } },
    learning: {
      summaryZh: 'Manager 的 KPI 是团队的产出与成长，不是自己的代码量；把 1:1、招聘、绩效做扎实，剩下 80% 时间该做"上下游对齐"。',
      keyPoints: ['1:1 是 manager 最重要的 30 分钟', 'feedback 越及时越廉价', '招聘错一个 = 三个月损失', 'psychological safety > 短期效率', 'career ladder 显式化'],
      bestPractices: ['weekly 1:1 永不取消', 'SBI 反馈模型（Situation-Behavior-Impact）', '招聘走 structured interview', '绩效与晋升脱钩到日常 feedback'],
      antiPatterns: ['1:1 变成 status update', '只在年度 review 给 feedback', '招聘"culture fit" 实际是同质化', 'manager 抢做技术活逃避管理'],
      resources: [
        { title: 'The Manager\'s Path', url: 'https://www.oreilly.com/library/view/the-managers-path/9781491973882/', type: 'book' },
        { title: 'Resilient Management', url: 'https://resilient-management.com/', type: 'book' },
        { title: 'Lara Hogan blog', url: 'https://larahogan.me/blog/', type: 'article' }
      ],
      maturityLevels: { junior: '能管理 3-5 人小组日常', mid: '能落地招聘 / 1:1 / 绩效闭环', senior: '能驱动多团队战略与组织文化' }
    }
  },

  'technical-strategy': {
    name: 'Technical Strategy',
    nameZh: '技术战略',
    description: 'Define technical strategy aligning with business goals, covering architecture, build-vs-buy, and tech investments.',
    descriptionZh: '定义与业务目标对齐的技术战略：架构 / build vs buy / 技术投入。',
    tags: ['leadership', 'strategy', 'architecture', 'cto', 'tech-investment'],
    category: 'leadership',
    input: { type: 'object', required: ['horizon'], properties: {
      horizon: { type: 'string', enum: ['1y', '3y', '5y'] },
      businessGoals: { type: 'array' }
    }},
    output: { type: 'object', properties: { strategyDoc: { type: 'string' }, bets: { type: 'array' }, kpi: { type: 'array' } } },
    errors: { MISALIGNED_GOAL: { code: 'TS_001', message: '技术战略与业务目标不对齐', retryable: false } },
    learning: {
      summaryZh: '技术战略不是技术清单，是"为什么不做某些事"的判断；好的战略让团队 80% 决策无需上层介入。',
      keyPoints: ['战略 = 诊断 + 引导政策 + 一致行动（Rumelt）', 'build vs buy vs partner 三选一', '技术债与 product velocity 的 trade-off', '技术 bets 要能落到季度', '废止策略与新增同等重要'],
      bestPractices: ['Wardley Map 看技术演进', 'tech radar 公开化', '每年回顾 bets 命中率', 'strategy memo 不超过 6 页'],
      antiPatterns: ['"我们要 AI" 这种伪战略', '战略写完锁抽屉', '什么都做的"全面战略"', '技术债持续记账不还'],
      resources: [
        { title: 'Good Strategy Bad Strategy', url: 'https://www.goodbadstrategy.com/', type: 'book' },
        { title: 'Wardley Maps', url: 'https://medium.com/wardleymaps', type: 'article' },
        { title: 'Will Larson: Engineering Strategy', url: 'https://lethain.com/strategy/', type: 'article' }
      ],
      maturityLevels: { junior: '能理解战略文档', mid: '能在团队级落地 tech bets', senior: '能驱动公司级技术战略与多年投入' }
    }
  },

  'test-strategy': {
    name: 'Test Strategy',
    nameZh: '测试策略',
    description: 'Design test strategy covering pyramid, environments, data, and shift-left / shift-right tactics.',
    descriptionZh: '设计测试策略：金字塔 / 环境 / 数据 / shift-left & shift-right。',
    tags: ['testing', 'strategy', 'qa', 'pyramid', 'shift-left'],
    category: 'testing',
    input: { type: 'object', required: ['system'], properties: {
      system: { type: 'string' },
      riskProfile: { type: 'string', enum: ['low', 'medium', 'high'] }
    }},
    output: { type: 'object', properties: { strategyDoc: { type: 'string' }, coverageGoals: { type: 'object' }, testTypes: { type: 'array' } } },
    errors: { COVERAGE_OBSESSED: { code: 'TS_001', message: '只看覆盖率不看缺陷漏出', retryable: false } },
    learning: {
      summaryZh: '测试策略的目标是"在不同阶段以最低成本拦截不同风险"；不是写更多测试，而是写对的测试在对的位置。',
      keyPoints: ['pyramid（unit > integration > e2e）', 'shift-left（IDE / pre-commit）+ shift-right（canary / observability）', '测试数据治理与生产隔离', 'flaky test 零容忍', 'risk-based 而非 coverage-driven'],
      bestPractices: ['contract testing 替代脆弱 e2e', 'feature flag + canary 做 shift-right', 'pre-commit 跑 unit + lint', 'flaky test 自动 quarantine + alert'],
      antiPatterns: ['e2e 占比过高引发雪崩', '只追求 100% line coverage', '测试数据用生产 dump', 'flaky test 长期不修'],
      resources: [
        { title: 'Test Pyramid', url: 'https://martinfowler.com/articles/practical-test-pyramid.html', type: 'article' },
        { title: 'Google Testing Blog', url: 'https://testing.googleblog.com/', type: 'article' },
        { title: 'Continuous Delivery', url: 'https://continuousdelivery.com/', type: 'book' }
      ],
      maturityLevels: { junior: '能写各类型测试', mid: '能设计金字塔与 shift-left', senior: '能驱动组织级测试战略与质量文化' }
    }
  },

  'write-unit-tests': {
    name: 'Write Unit Tests',
    nameZh: '编写单元测试',
    description: 'Author fast, isolated, deterministic unit tests covering critical paths and edge cases.',
    descriptionZh: '编写快速 / 独立 / 确定性的单元测试，覆盖关键路径与边界场景。',
    tags: ['testing', 'unit-test', 'tdd', 'quality', 'jest'],
    category: 'testing',
    input: { type: 'object', required: ['target'], properties: {
      target: { type: 'string', description: '被测代码路径' },
      framework: { type: 'string', enum: ['jest', 'vitest', 'pytest', 'go-test', 'junit'] }
    }},
    output: { type: 'object', properties: { tests: { type: 'array' }, coverage: { type: 'object' } } },
    errors: { OVER_MOCKING: { code: 'UT_001', message: '过度 mock 导致测试无意义', retryable: false } },
    learning: {
      summaryZh: '单元测试是文档 + 重构安全网；写到 mock 大于真实代码就该停，往集成测试上移。',
      keyPoints: ['AAA 模式（Arrange / Act / Assert）', '一个测试一个断言主题', 'edge case 优先于 happy path', 'mock 边界（外部 IO）而非内部实现', 'fast / isolated / deterministic'],
      bestPractices: ['测试名 should_X_when_Y 表达意图', '用 fixture / factory 而非全局 setup', '每次失败都看 message 是否清晰', 'CI 内 < 2 分钟跑完'],
      antiPatterns: ['mock 内部函数等于测 mock 自己', '一个 test 几十个断言', '测试依赖顺序 / 全局状态', '只测 happy path'],
      resources: [
        { title: 'xUnit Test Patterns', url: 'http://xunitpatterns.com/', type: 'book' },
        { title: 'Kent Beck TDD', url: 'https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530', type: 'book' },
        { title: 'Jest docs', url: 'https://jestjs.io/docs/getting-started', type: 'doc' }
      ],
      maturityLevels: { junior: '能写基础断言测试', mid: '能用 fixture + edge case 完整覆盖', senior: '能驱动 TDD 文化与可维护测试架构' }
    }
  },

  'write-e2e-tests': {
    name: 'Write E2E Tests',
    nameZh: '编写端到端测试',
    description: 'Author end-to-end tests covering critical user journeys with focus on stability over coverage.',
    descriptionZh: '编写端到端测试，覆盖关键用户旅程，稳定性优先于覆盖率。',
    tags: ['testing', 'e2e', 'playwright', 'cypress', 'qa'],
    category: 'testing',
    input: { type: 'object', required: ['app'], properties: {
      app: { type: 'string' },
      framework: { type: 'string', enum: ['playwright', 'cypress', 'webdriverio', 'puppeteer'] },
      browser: { type: 'string', enum: ['chromium', 'firefox', 'webkit'] }
    }},
    output: { type: 'object', properties: { specs: { type: 'array' }, fixtures: { type: 'array' }, ciConfig: { type: 'string' } } },
    errors: {
      FLAKY_TEST: { code: 'E2E_001', message: '测试 flaky，需修复或 quarantine', retryable: true },
      ENV_DRIFT: { code: 'E2E_002', message: '测试环境与生产偏离', retryable: false }
    },
    learning: {
      summaryZh: 'e2e 的敌人不是 bug 是 flaky；与其追求高覆盖率，不如做 5 条永远绿色的关键路径。',
      keyPoints: ['data-testid > CSS selector', 'auto-wait > sleep', 'fixtures 隔离测试数据', '关键 journey ≤ 10 条 e2e', '失败截图 / 录像 / trace 默认开'],
      bestPractices: ['Playwright 默认开 trace + retry=2', '与 backend mock 解耦或用专用环境', 'CI 串行 vs 并行做 sharding', 'flaky 自动 quarantine + 24h SLA 修复'],
      antiPatterns: ['测试依赖 sleep(3000)', '一条 e2e 覆盖整个产品', '生产数据库做 e2e', 'flaky 测试占用 main 仍合并'],
      resources: [
        { title: 'Playwright', url: 'https://playwright.dev/', type: 'doc' },
        { title: 'Cypress Best Practices', url: 'https://docs.cypress.io/guides/references/best-practices', type: 'doc' },
        { title: 'Test Automation University', url: 'https://testautomationu.applitools.com/', type: 'doc' }
      ],
      maturityLevels: { junior: '能写基础 e2e spec', mid: '能控 flaky + 设计 fixture', senior: '能驱动 e2e 战略与质量门禁' }
    }
  }
};

let updated = 0;
for (const [id, patch] of Object.entries(PATCHES)) {
  const file = path.join(ROOT, `${id}.json`);
  if (!fs.existsSync(file)) { console.error(`❌ ${id}: not found`); continue; }
  const obj = JSON.parse(fs.readFileSync(file, 'utf-8'));
  obj.metadata = obj.metadata || {};
  obj.metadata.name = patch.name;
  obj.metadata.nameZh = patch.nameZh;
  obj.metadata.description = patch.description;
  obj.metadata.descriptionZh = patch.descriptionZh;
  obj.metadata.tags = patch.tags;
  obj.metadata.category = patch.category;
  if (!obj.metadata.author) obj.metadata.author = 'skills4coder-team';
  obj.input = { schema: { ...patch.input } };
  obj.output = { schema: { ...patch.output } };
  if (!obj.implementation) obj.implementation = { type: 'native', function: id.replace(/-/g, '_') };
  if (!obj.constraints) obj.constraints = { permissions: ['read'] };
  obj.errors = patch.errors;
  obj.learning = patch.learning;
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');
  updated++;
  console.log(`✅ ${id}`);
}
console.log(`\nDone. updated=${updated}`);

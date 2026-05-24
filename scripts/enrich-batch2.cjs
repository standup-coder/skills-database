#!/usr/bin/env node
/**
 * 第五轮 batch 2：被引用 >=2 次的 placeholder atomic 全量丰富化
 * （metadata 双语 + tags 扩 + input/output schema + constraints + errors + learning）
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'atomic-skills');

const PATCHES = {
  'data-quality': {
    name: 'Data Quality Check',
    nameZh: '数据质量检查',
    description: 'Run completeness, accuracy, consistency, timeliness, uniqueness and validity checks on a dataset and report violations.',
    descriptionZh: '在数据集上执行完整性 / 准确性 / 一致性 / 时效性 / 唯一性 / 合法性六维度检查，输出违规报告与建议。',
    tags: ['data', 'quality', 'pipeline', 'governance', 'observability'],
    category: 'data',
    input: { type: 'object', required: ['dataset'], properties: {
      dataset: { type: 'string', description: '数据集 ID 或路径（table / file / view）' },
      rules: { type: 'array', items: { type: 'object' }, description: '质量规则列表（声明式）' },
      level: { enum: ['error', 'warn'], default: 'error', description: '违规处理级别' }
    }},
    output: { type: 'object', properties: {
      passed: { type: 'boolean' }, totalRows: { type: 'number' }, violations: { type: 'array' }, summaryByDimension: { type: 'object' }
    }},
    errors: {
      DATASET_NOT_FOUND: { code: 'DQ_001', message: '目标数据集不存在或不可访问', retryable: false },
      RULE_PARSE_FAIL: { code: 'DQ_002', message: '规则配置解析失败', retryable: false }
    }
  },

  'user-research': {
    name: 'User Research',
    nameZh: '用户研究',
    description: 'Conduct user research activities (interviews, surveys, usability tests) and synthesize insights into actionable findings.',
    descriptionZh: '设计与执行用户访谈 / 问卷 / 可用性测试，沉淀为可行动洞察与设计输入。',
    tags: ['ux', 'research', 'user', 'discovery', 'insight'],
    category: 'design',
    input: { type: 'object', required: ['method', 'objective'], properties: {
      method: { enum: ['interview', 'survey', 'usability-test', 'diary-study', 'card-sorting'] },
      objective: { type: 'string', description: '研究目标与决策场景' },
      sampleSize: { type: 'number', default: 8 },
      personas: { type: 'array', items: { type: 'string' } }
    }},
    output: { type: 'object', properties: {
      insights: { type: 'array' }, recommendations: { type: 'array' }, evidence: { type: 'array' }, report: { type: 'string' }
    }},
    errors: {
      LOW_SAMPLE: { code: 'UR_001', message: '样本量不足，结论可信度低', retryable: false },
      BIAS_RISK: { code: 'UR_002', message: '存在引导性问题或选择性偏差', retryable: false }
    }
  },

  'warehouse-design': {
    name: 'Data Warehouse Design',
    nameZh: '数据仓库设计',
    description: 'Design layered data warehouse with dimensional modeling (Kimball) or Data Vault patterns, covering ODS/DWD/DWS/ADS layers.',
    descriptionZh: '基于 Kimball 维度建模或 Data Vault 设计分层数仓（ODS/DWD/DWS/ADS），输出星型 / 雪花 schema 与命名规范。',
    tags: ['data', 'warehouse', 'kimball', 'modeling', 'olap'],
    category: 'data',
    input: { type: 'object', required: ['businessDomain'], properties: {
      businessDomain: { type: 'string', description: '业务域（订单 / 用户 / 财务 ...）' },
      pattern: { enum: ['star', 'snowflake', 'data-vault', 'one-big-table'], default: 'star' },
      sourceSystems: { type: 'array', items: { type: 'string' } },
      slaFreshnessHours: { type: 'number', default: 24 }
    }},
    output: { type: 'object', properties: {
      factTables: { type: 'array' }, dimensionTables: { type: 'array' }, layerMapping: { type: 'object' }, namingConvention: { type: 'string' }
    }},
    errors: {
      DOMAIN_AMBIGUOUS: { code: 'DW_001', message: '业务域边界不清，无法稳定建模', retryable: false },
      GRAIN_INCONSISTENT: { code: 'DW_002', message: '事实表粒度声明不一致', retryable: false }
    }
  },

  'ab-testing': {
    name: 'A/B Testing',
    nameZh: 'A/B 实验',
    description: 'Design and analyze A/B experiments with proper sample size, randomization, statistical significance and guardrail metrics.',
    descriptionZh: '设计与分析 A/B 实验，覆盖样本量计算、随机化、显著性检验与护栏指标。',
    tags: ['ab-test', 'experiment', 'growth', 'statistics', 'product'],
    category: 'growth',
    input: { type: 'object', required: ['hypothesis', 'metric'], properties: {
      hypothesis: { type: 'string' },
      metric: { type: 'string', description: '主要指标（OEC）' },
      mde: { type: 'number', description: '最小可检测效应' },
      alpha: { type: 'number', default: 0.05 },
      power: { type: 'number', default: 0.8 }
    }},
    output: { type: 'object', properties: {
      sampleSize: { type: 'number' }, durationDays: { type: 'number' }, result: { type: 'object' }, decision: { enum: ['ship', 'kill', 'iterate'] }
    }},
    errors: {
      UNDERPOWERED: { code: 'AB_001', message: '样本量不足以达到所需 power', retryable: false },
      SRM: { code: 'AB_002', message: '检测到 Sample Ratio Mismatch，分桶异常', retryable: false }
    }
  },

  'cohort-analysis': {
    name: 'Cohort Analysis',
    nameZh: '同期群分析',
    description: 'Group users into cohorts by acquisition date or attribute and track retention/engagement curves over time.',
    descriptionZh: '按获客日期或属性分群用户，追踪留存 / 活跃 / 收入曲线随时间变化。',
    tags: ['analytics', 'retention', 'cohort', 'product', 'growth'],
    category: 'analytics',
    input: { type: 'object', required: ['eventTable', 'cohortDimension'], properties: {
      eventTable: { type: 'string' },
      cohortDimension: { type: 'string', description: '分群维度（注册周 / 渠道 / 设备）' },
      metric: { enum: ['retention', 'revenue', 'frequency'], default: 'retention' },
      windowDays: { type: 'number', default: 90 }
    }},
    output: { type: 'object', properties: {
      cohortMatrix: { type: 'array' }, insights: { type: 'array' }, chartUrl: { type: 'string' }
    }},
    errors: {
      SPARSE_COHORT: { code: 'CO_001', message: '部分 cohort 样本太小，曲线噪声大', retryable: false }
    }
  },

  'cross-platform': {
    name: 'Cross-Platform Compatibility',
    nameZh: '跨平台兼容',
    description: 'Ensure feature works consistently across iOS/Android/Web/Desktop targets with shared business logic and platform-specific UI.',
    descriptionZh: '保证功能在 iOS / Android / Web / 桌面端表现一致，共享业务逻辑、按平台落 UI 与交互细节。',
    tags: ['mobile', 'cross-platform', 'react-native', 'flutter', 'kmp'],
    category: 'mobile',
    input: { type: 'object', required: ['feature', 'targets'], properties: {
      feature: { type: 'string' },
      targets: { type: 'array', items: { enum: ['ios', 'android', 'web', 'desktop'] } },
      framework: { enum: ['react-native', 'flutter', 'kmp', 'native'], default: 'react-native' }
    }},
    output: { type: 'object', properties: {
      platformDeltas: { type: 'object' }, sharedModules: { type: 'array' }, compatibilityMatrix: { type: 'object' }
    }},
    errors: {
      PLATFORM_API_MISSING: { code: 'XP_001', message: '目标平台缺少所需 API', retryable: false },
      UI_CONVENTION_CLASH: { code: 'XP_002', message: '与平台 HIG / Material 规范冲突', retryable: false }
    }
  },

  'funnel-analysis': {
    name: 'Funnel Analysis',
    nameZh: '漏斗分析',
    description: 'Define multi-step conversion funnels and identify the largest drop-off step to prioritize optimization.',
    descriptionZh: '定义多步转化漏斗，定位最大流失环节，输出优先级优化建议。',
    tags: ['analytics', 'funnel', 'conversion', 'growth', 'product'],
    category: 'analytics',
    input: { type: 'object', required: ['steps'], properties: {
      steps: { type: 'array', items: { type: 'string' }, description: '有序步骤事件列表' },
      windowMinutes: { type: 'number', default: 1440 },
      segment: { type: 'string' }
    }},
    output: { type: 'object', properties: {
      stepConversion: { type: 'array' }, biggestDropStep: { type: 'string' }, recommendations: { type: 'array' }
    }},
    errors: {
      EVENT_NOT_TRACKED: { code: 'FN_001', message: '某步骤事件未埋点，漏斗无法闭合', retryable: false }
    }
  },

  'grafana-dashboard': {
    name: 'Grafana Dashboard',
    nameZh: 'Grafana 仪表盘',
    description: 'Author Grafana dashboards with proper variables, panels, alerts and version control via JSON model.',
    descriptionZh: '编写 Grafana 仪表盘 JSON 模型，含变量 / 面板 / 告警，纳入版本管理与 IaC。',
    tags: ['observability', 'grafana', 'dashboard', 'monitoring', 'iac'],
    category: 'ops',
    input: { type: 'object', required: ['title', 'datasource'], properties: {
      title: { type: 'string' },
      datasource: { enum: ['prometheus', 'loki', 'elasticsearch', 'mysql'] },
      panels: { type: 'array' },
      alerts: { type: 'array' }
    }},
    output: { type: 'object', properties: {
      dashboardJson: { type: 'object' }, uid: { type: 'string' }, url: { type: 'string' }
    }},
    errors: {
      DATASOURCE_MISSING: { code: 'GR_001', message: '目标数据源未配置', retryable: false },
      INVALID_QUERY: { code: 'GR_002', message: 'PromQL/LogQL 查询语法错误', retryable: false }
    }
  },

  'growth-automation': {
    name: 'Growth Automation',
    nameZh: '增长自动化',
    description: 'Automate user lifecycle journeys (welcome / activation / re-engagement / churn-save) via triggers, segments and channels.',
    descriptionZh: '基于触发器 / 分群 / 多通道，自动化运营用户全生命周期（欢迎 / 激活 / 召回 / 挽留）。',
    tags: ['growth', 'automation', 'crm', 'lifecycle', 'marketing'],
    category: 'growth',
    input: { type: 'object', required: ['journey'], properties: {
      journey: { enum: ['welcome', 'activation', 'reengagement', 'churn-save', 'cross-sell'] },
      triggers: { type: 'array' },
      channels: { type: 'array', items: { enum: ['email', 'push', 'sms', 'in-app'] } },
      controlGroup: { type: 'boolean', default: true }
    }},
    output: { type: 'object', properties: {
      automationId: { type: 'string' }, expectedLift: { type: 'number' }, abtestPlan: { type: 'object' }
    }},
    errors: {
      NO_CONTROL: { code: 'GA_001', message: '未保留对照组，无法度量增量', retryable: false },
      OVER_MESSAGING: { code: 'GA_002', message: '触达频率超过用户疲劳阈值', retryable: false }
    }
  },

  'onboarding': {
    name: 'Customer Onboarding',
    nameZh: '客户引导',
    description: 'Design and execute a structured onboarding journey to drive customer time-to-first-value and reduce early churn.',
    descriptionZh: '设计结构化的客户引导流程，缩短首价值时间（TTFV），降低早期流失。',
    tags: ['customer-success', 'onboarding', 'activation', 'ttfv', 'lifecycle'],
    category: 'customer-success',
    input: { type: 'object', required: ['segment'], properties: {
      segment: { type: 'string', description: '客户分层（SMB / Mid / Enterprise）' },
      milestones: { type: 'array', items: { type: 'string' } },
      kickoffMode: { enum: ['self-serve', 'high-touch', 'hybrid'], default: 'self-serve' },
      durationDays: { type: 'number', default: 30 }
    }},
    output: { type: 'object', properties: {
      playbook: { type: 'string' }, ttfvDays: { type: 'number' }, healthScoreInitial: { type: 'number' }
    }},
    errors: {
      MILESTONE_VAGUE: { code: 'ON_001', message: '里程碑未量化，无法判断完成', retryable: false }
    }
  }
};

const LEARNING = {
  'data-quality': {
    summaryZh: '数据质量决定下游一切决策的可信度：六维度（完整 / 准确 / 一致 / 时效 / 唯一 / 合法）缺一不可。',
    keyPoints: ['六维度量化指标', 'pipeline 关键节点 quality gate', 'bad data 进 quarantine 而非丢弃', '与 lineage 联动定位起源', 'SLO 化数据质量'],
    bestPractices: ['Great Expectations / Soda / dbt tests 声明式校验', '上游 data contract', 'freshness 监控独立通道', '质量指标进业务 dashboard'],
    antiPatterns: ['只在最终报表层校验', 'null rate 99% 仍发布', '坏数据直接 DELETE 无回溯', '质量规则散落无 owner'],
    resources: [
      { title: 'Great Expectations', url: 'https://docs.greatexpectations.io/', type: 'doc' },
      { title: 'dbt tests', url: 'https://docs.getdbt.com/docs/build/tests', type: 'doc' }
    ],
    maturityLevels: { junior: '能写基础规则识别异常', mid: '能搭 quality gate 与 quarantine', senior: '能在组织层推 data contract 与 SLO 化数据质量' }
  },
  'user-research': {
    summaryZh: '用户研究的价值不在数据多寡，而在能不能驱动一个真实的产品决策。',
    keyPoints: ['先定决策场景，再选方法', '定性挖洞察，定量验规模', '8 人访谈可发现 80% 可用性问题', '区分用户说的 vs 用户做的', '研究输出必须有 next action'],
    bestPractices: ['每轮研究都有 hypothesis 与 kill criteria', '原始素材（录音 / 笔记）归档可回放', '与 PM/设计 共听访谈，避免转述失真', 'JTBD 框架捕捉动机'],
    antiPatterns: ['做完研究只产出"用户喜欢…"', '问引导性问题', '把 NPS 当唯一指标', '小样本就推全局结论'],
    resources: [
      { title: 'NN/g UX Research Methods', url: 'https://www.nngroup.com/articles/which-ux-research-methods/', type: 'article' },
      { title: 'JTBD framework', url: 'https://jtbd.info/', type: 'doc' }
    ],
    maturityLevels: { junior: '能执行访谈与可用性测试', mid: '能选方法、控偏差、写洞察报告', senior: '能搭研究体系、与产品决策闭环' }
  },
  'warehouse-design': {
    summaryZh: '数仓设计的核心不是表多漂亮，而是粒度稳定、口径统一、可追溯。',
    keyPoints: ['粒度先行，事实表的 grain 决定一切', '维度建模 vs Data Vault 各有适用', 'ODS/DWD/DWS/ADS 分层职责清晰', 'SCD Type 2 处理历史变化', '命名规范是治理的开始'],
    bestPractices: ['每张事实表写明 grain 描述', '为每个指标建立口径文档', '使用 dbt 管理血缘与测试', '冷热分层降存储成本'],
    antiPatterns: ['一张大宽表打天下', '事实表混合多种 grain', '维度表频繁删旧记录', '没有命名规范，下游靠猜'],
    resources: [
      { title: 'Kimball Group: Dimensional Modeling Techniques', url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/', type: 'doc' },
      { title: 'dbt 文档', url: 'https://docs.getdbt.com/', type: 'doc' }
    ],
    maturityLevels: { junior: '能按既有规范建表', mid: '能主导域建模、SCD 设计、命名规范', senior: '能设计企业级分层数仓、治理体系与成本策略' }
  },
  'ab-testing': {
    summaryZh: 'A/B 实验是因果推断工具，不是 dashboard：没有正确的样本量与护栏，结果即噪声。',
    keyPoints: ['先算样本量再开实验', '分流必须随机且可验证（SRM 检测）', 'OEC 要兼顾业务价值与长期影响', '护栏指标防止短期收益伤害长期', '不显著 ≠ 没差异'],
    bestPractices: ['minimum detectable effect 与业务影响匹配', '至少跑一个完整业务周期', '提前注册分析方案，禁止 p-hacking', '小流量长尾观察延迟效应'],
    antiPatterns: ['每天看 p 值，显著就停', '同一用户被多个实验互相污染', '只看主指标忽略护栏', '把波动当显著'],
    resources: [
      { title: 'Trustworthy Online Controlled Experiments (Kohavi)', url: 'https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/', type: 'book' },
      { title: 'Statsig docs: Sample Ratio Mismatch', url: 'https://docs.statsig.com/experiments-plus/sample-ratio-mismatch', type: 'doc' }
    ],
    maturityLevels: { junior: '能跑标准 A/B 看显著性', mid: '能设计 OEC / 护栏 / SRM 检查', senior: '能设计实验平台与治理：互斥层、CUPED、长期效应' }
  },
  'cohort-analysis': {
    summaryZh: 'Cohort 是看清增长真相的显微镜：整体平均会撒谎，分群才不会。',
    keyPoints: ['按获客日期 / 渠道 / 设备分群', '关注 D1/D7/D30 留存形状', '后期 cohort 改善 = 产品改进；恶化 = 模型恶化', '区分纯粹留存与"复活"', 'Cohort 越细，样本噪声越大'],
    bestPractices: ['用 cohort 矩阵替代单一留存数', '稳定 cohort 来对比版本变更', '与漏斗联动，定位掉队 cohort 的具体步骤', '识别"产品市场契合度"信号'],
    antiPatterns: ['只看整体 DAU 增长', '把不同获客渠道 cohort 强行平均', '缺乏长尾观察，断言 PMF'],
    resources: [
      { title: 'Andrew Chen: Power user curve', url: 'https://andrewchen.com/power-user-curve/', type: 'article' },
      { title: 'Mixpanel cohort guide', url: 'https://mixpanel.com/blog/cohort-analysis-guide/', type: 'article' }
    ],
    maturityLevels: { junior: '能跑出留存矩阵', mid: '能联动 cohort + funnel 定位', senior: '能用 cohort 驱动产品/增长决策' }
  },
  'cross-platform': {
    summaryZh: '跨平台不是"一次开发到处运行"，而是"共享逻辑 + 平台原生体验"。',
    keyPoints: ['业务逻辑 / 数据层共享，UI 层差异化', '尊重平台 HIG / Material Design', '原生模块桥接处是性能瓶颈', '版本碎片化（Android）需 minSDK 策略', 'CI 矩阵覆盖关键 OS 版本'],
    bestPractices: ['用 KMP / RN / Flutter 各有取舍，按团队栈选', '关键路径写各平台 e2e（Detox / XCUITest）', '原生模块走 typed bridge', '灰度先小流量观察'],
    antiPatterns: ['套同一套 UI 强求一致', '在桥接处频繁大对象传输', '忽视平台权限差异（iOS ATS / Android Scoped Storage）', '一个分支适配所有 OS 版本'],
    resources: [
      { title: 'React Native New Architecture', url: 'https://reactnative.dev/architecture/landing-page', type: 'doc' },
      { title: 'Flutter Platform Channels', url: 'https://docs.flutter.dev/platform-integration/platform-channels', type: 'doc' },
      { title: 'KMP Multiplatform docs', url: 'https://kotlinlang.org/docs/multiplatform.html', type: 'doc' }
    ],
    maturityLevels: { junior: '能在跨平台框架内开发常规页面', mid: '能写原生桥接、处理平台差异', senior: '能为跨平台架构选型、性能调优、灰度策略' }
  },
  'funnel-analysis': {
    summaryZh: '漏斗的价值在于让"流失"具象化，但不要忘记：漏斗外的回头客可能比漏斗内的更值钱。',
    keyPoints: ['步骤事件命名稳定', '设定合适的转化窗口', '识别"必经"vs"可选"步骤', '漏斗 + 分群（设备 / 渠道）才看得见真相', '关注绝对人数而非仅比例'],
    bestPractices: ['用统一埋点 schema 防止漂移', '与 cohort 联动看长期演化', '漏斗发现的瓶颈用 A/B 验证修复有效性', '关注非线性路径（用户跳步）'],
    antiPatterns: ['步骤定义混乱，分子分母错位', '用 7 天窗口分析 30 天周期产品', '把"漏斗"当唯一分析视角，忽略路径分析'],
    resources: [
      { title: 'Amplitude Funnel Analysis', url: 'https://amplitude.com/blog/funnel-analysis', type: 'article' },
      { title: 'Mixpanel: Path & Funnel', url: 'https://docs.mixpanel.com/docs/reports/funnels', type: 'doc' }
    ],
    maturityLevels: { junior: '能搭单一漏斗看转化率', mid: '能多维度拆解 + 识别瓶颈步骤', senior: '能驱动跨团队转化优化项目' }
  },
  'grafana-dashboard': {
    summaryZh: '好的 Dashboard 让人 5 秒看出问题；糟糕的 Dashboard 是面板坟场。',
    keyPoints: ['每个 Dashboard 围绕一个问题', 'RED / USE / Golden Signals 三套通用法则', '变量化（datasource / namespace / pod）便于复用', '告警与 Dashboard 解耦，告警走 Alerting / SLO', 'JSON 模型纳入 IaC 管理'],
    bestPractices: ['用 Provisioning + dashboards-as-code', 'Panel description 写明告警阈值含义', '链接 Runbook / 文档', '区分长期趋势与短期实时'],
    antiPatterns: ['一个 Dashboard 30+ panel 杂乱无章', '直接 import 无人维护的 community dashboard', '告警阈值硬编码到 panel', '从 UI 改完不同步回 git'],
    resources: [
      { title: 'Grafana: dashboards-as-code', url: 'https://grafana.com/docs/grafana/latest/dashboards/manage-dashboards/', type: 'doc' },
      { title: 'Google SRE: Monitoring distributed systems', url: 'https://sre.google/sre-book/monitoring-distributed-systems/', type: 'doc' }
    ],
    maturityLevels: { junior: '能拼出基础 RED Dashboard', mid: '能写 IaC、变量化、与告警解耦', senior: '能制定团队可观测性规范与 dashboards-as-code 流程' }
  },
  'growth-automation': {
    summaryZh: '增长自动化的杀手不是策略不够，而是消息疲劳与对照组缺失让 ROI 永远算不清。',
    keyPoints: ['每个 journey 必须有控制组', '渠道 + 频次 + 时段建立全局疲劳上限', '触发器与目标对齐，避免无关推送', '关注 long-term 指标而非首点击率', '自动化不能取代洞察，只能放大洞察'],
    bestPractices: ['先 A/B 验证增量再上线全量', 'unsubscribe / 偏好中心是合规底线', '与 lifecycle stage 强绑定，不重复触达', 'journey 自动化与 CRM 打分联动'],
    antiPatterns: ['全量推送一律算"自动化"', '没有对照组，无法度量增量', '渠道各自为战，用户被多次打扰', '触发器漂移而无人监控'],
    resources: [
      { title: 'Reforge Growth Series', url: 'https://www.reforge.com/programs/growth-series', type: 'doc' },
      { title: 'Braze Lifecycle Guide', url: 'https://www.braze.com/resources/articles/best-practices-customer-lifecycle-marketing', type: 'article' }
    ],
    maturityLevels: { junior: '能搭单一 journey 跑通触发', mid: '能 A/B + 控制组度量增量、设疲劳上限', senior: '能搭组织级增长自动化框架与归因体系' }
  },
  'onboarding': {
    summaryZh: '客户引导决定 12 个月续约率：首价值时间（TTFV）每缩短 1 天，留存提升肉眼可见。',
    keyPoints: ['北极星：TTFV / Activation rate', '里程碑必须可量化、有反馈', '产品引导（PLG）与人工引导（high-touch）按 ARR 分层', '健康分早期信号 > 等到流失再救', 'onboarding 是产品的一部分，不是 CSM 的私事'],
    bestPractices: ['kickoff 30 分钟内确认成功标准', '产品内引导 + 邮件序列双通道', '每个 milestone 完成自动 check-in', '把 onboarding 数据接入产品分析'],
    antiPatterns: ['一份 PDF 发完算 onboarding', '里程碑只有时间没有内容', '客户卡住无人发现，30 天后才发现没用', 'CSM 与 PM 隔离，引导 ≠ 产品改进闭环'],
    resources: [
      { title: 'Wes Bush: Product-Led Growth', url: 'https://productled.com/blog', type: 'doc' },
      { title: 'Gainsight: Customer Onboarding Best Practices', url: 'https://www.gainsight.com/customer-onboarding/', type: 'article' }
    ],
    maturityLevels: { junior: '能跑标准 onboarding playbook', mid: '能按客户分层设计 TTFV / 里程碑 / 健康分', senior: '能驱动 onboarding 与产品 / CRM / 增长闭环' }
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
  if (LEARNING[id]) obj.learning = LEARNING[id];
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');
  updated++;
  console.log(`✅ ${id}`);
}
console.log(`\nDone. updated=${updated}`);

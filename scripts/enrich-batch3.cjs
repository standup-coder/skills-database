#!/usr/bin/env node
/**
 * 第五轮 batch 3：被引用 1 次的 10 个 placeholder atomic 全量丰富化
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'atomic-skills');

const PATCHES = {
  'data-pipeline': {
    name: 'Data Pipeline',
    nameZh: '数据管道',
    description: 'Build batch or streaming data pipelines that ingest, transform and load data with reliability, idempotency and observability.',
    descriptionZh: '构建批 / 流式数据管道，覆盖采集 / 转换 / 装载，保证可靠性、幂等性与可观测性。',
    tags: ['data', 'pipeline', 'etl', 'streaming', 'orchestration'],
    category: 'data',
    input: { type: 'object', required: ['source', 'sink'], properties: {
      source: { type: 'object', description: '数据来源（DB / Kafka / API / file）' },
      sink: { type: 'object', description: '数据去向（Warehouse / Lake / Topic）' },
      mode: { enum: ['batch', 'stream', 'micro-batch'], default: 'batch' },
      schedule: { type: 'string', description: 'cron 表达式或事件触发' }
    }},
    output: { type: 'object', properties: { dagId: { type: 'string' }, latencyMs: { type: 'number' }, rowsProcessed: { type: 'number' } }},
    errors: {
      SOURCE_UNAVAILABLE: { code: 'DP_001', message: '上游数据源不可达', retryable: true },
      SCHEMA_DRIFT: { code: 'DP_002', message: '上游 schema 变化，pipeline 失败', retryable: false }
    },
    learning: {
      summaryZh: '数据管道的本质是契约：上游变 schema、下游消费方式变，都要管道在中间稳住。',
      keyPoints: ['幂等性：同一 batch 重跑结果一致', 'exactly-once 难度极高，多数场景 at-least-once + 去重更现实', '关注 backfill 能力', 'late-arriving event 用 watermark + window 处理', 'pipeline 必须可观测：lag / throughput / failure rate'],
      bestPractices: ['Airflow / Dagster / Prefect 任选其一统一编排', '把转换逻辑放进 dbt / Spark SQL，便于复用与版本化', '为关键 pipeline 设 SLA 与告警', '上下游 data contract'],
      antiPatterns: ['cron 触发但下游消费侧未就绪', '把 pipeline 当一次性脚本，无幂等', 'schema 漂移无监控，下游静默失败', '没有 backfill 机制，历史修复难'],
      resources: [
        { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', type: 'book' },
        { title: 'Airflow docs', url: 'https://airflow.apache.org/docs/', type: 'doc' },
        { title: 'dbt docs', url: 'https://docs.getdbt.com/', type: 'doc' }
      ],
      maturityLevels: { junior: '能写单条 ETL 任务并定时跑', mid: '能设计幂等 / backfill / 监控告警', senior: '能搭组织级 pipeline 平台，覆盖批流统一与 data contract' }
    }
  },

  'design-system': {
    name: 'Design System',
    nameZh: '设计系统',
    description: 'Build a design system spanning tokens, components, patterns and documentation for consistent product experience at scale.',
    descriptionZh: '搭建覆盖 token / 组件 / 模式 / 文档的设计系统，规模化保证产品一致体验。',
    tags: ['design', 'design-system', 'tokens', 'components', 'frontend'],
    category: 'design',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { enum: ['tokens', 'components', 'patterns', 'full'] },
      platforms: { type: 'array', items: { enum: ['web', 'ios', 'android'] } },
      themingMode: { enum: ['light', 'dark', 'multi-brand'], default: 'light' }
    }},
    output: { type: 'object', properties: { tokensJson: { type: 'object' }, componentLibrary: { type: 'string' }, docsUrl: { type: 'string' } } },
    errors: {
      TOKEN_NAMING_INCONSISTENT: { code: 'DS_001', message: '设计 token 命名不一致，跨平台映射失败', retryable: false }
    },
    learning: {
      summaryZh: '设计系统的难点不在画组件，而在让 100 个产品团队都愿意用、用对、用得久。',
      keyPoints: ['Token 是设计与代码的桥梁', '组件 API 设计 = 半个开源项目', '版本化 + Changelog 不可少', '文档（Storybook / Zeroheight）质量决定采纳率', '配套治理：贡献流程、review、deprecation'],
      bestPractices: ['Style Dictionary / Tokens Studio 跨平台输出', 'Storybook + a11y addon', '组件库走 SemVer + Changesets', '建立 Adoption Dashboard 跟踪覆盖率'],
      antiPatterns: ['先做组件再补 token', '一夜推翻全量重做，团队跟不上', '组件 API 跟随单业务需求频繁变化', '只发布不维护、文档过时'],
      resources: [
        { title: 'Brad Frost: Atomic Design', url: 'https://atomicdesign.bradfrost.com/', type: 'book' },
        { title: 'Style Dictionary', url: 'https://amzn.github.io/style-dictionary/', type: 'doc' },
        { title: 'Storybook Design System', url: 'https://storybook.js.org/tutorials/design-systems-for-developers/', type: 'doc' }
      ],
      maturityLevels: { junior: '能基于已有 DS 开发新组件', mid: '能设计 token 体系、组件 API、文档化', senior: '能驱动跨产品 DS 治理与采纳' }
    }
  },

  'github-actions': {
    name: 'GitHub Actions',
    nameZh: 'GitHub Actions',
    description: 'Author GitHub Actions workflows for CI, CD, release automation and reusable composite actions.',
    descriptionZh: '编写 GitHub Actions 工作流，覆盖 CI / CD / 发布自动化与可复用 composite action。',
    tags: ['ci-cd', 'github', 'actions', 'automation', 'devops'],
    category: 'devops',
    input: { type: 'object', required: ['purpose'], properties: {
      purpose: { enum: ['ci', 'cd', 'release', 'scheduled', 'reusable'] },
      runner: { enum: ['ubuntu-latest', 'macos-latest', 'windows-latest', 'self-hosted'], default: 'ubuntu-latest' },
      triggers: { type: 'array', items: { type: 'string' } }
    }},
    output: { type: 'object', properties: { workflowYaml: { type: 'string' }, jobs: { type: 'array' } } },
    errors: {
      SECRET_LEAK_RISK: { code: 'GA_001', message: '检测到 secret 可能在日志泄露', retryable: false },
      RATE_LIMIT: { code: 'GA_002', message: 'Action API 调用超限', retryable: true }
    },
    learning: {
      summaryZh: 'GitHub Actions 是开发者的瑞士军刀，但默认配置不够安全，必须主动加固。',
      keyPoints: ['pin action 到 SHA，不用 @main', '最小权限 GITHUB_TOKEN（permissions: read）', 'OIDC 联邦认证替代 long-lived secret', '关键作业用 environment + required reviewers', '复用 reusable workflow 替代 copy-paste'],
      bestPractices: ['actionlint / zizmor 静态扫', '缓存 dependency 加速 ci（actions/cache）', '失败重试用 nick-fields/retry', '把 release 切到 release-please / changesets'],
      antiPatterns: ['secret 写在 workflow 文件里', 'pull_request_target 接收 fork PR 不审计', '大仓 monorepo 全量 CI，每次 30 分钟', 'self-hosted runner 暴露在公网无沙箱'],
      resources: [
        { title: 'GitHub Actions security hardening', url: 'https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions', type: 'doc' },
        { title: 'OIDC for cloud auth', url: 'https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect', type: 'doc' }
      ],
      maturityLevels: { junior: '能写 CI 跑测试和 lint', mid: '能用 reusable workflow / matrix / cache 优化', senior: '能制定全组织 Actions 安全规范、OIDC 改造、合规审计' }
    }
  },

  'ios-development': {
    name: 'iOS Development',
    nameZh: 'iOS 开发',
    description: 'Develop iOS applications with Swift / SwiftUI, covering navigation, data persistence, networking and platform integration.',
    descriptionZh: '基于 Swift / SwiftUI 开发 iOS 应用，覆盖导航 / 持久化 / 网络 / 系统集成。',
    tags: ['mobile', 'ios', 'swift', 'swiftui', 'apple'],
    category: 'mobile',
    input: { type: 'object', required: ['feature'], properties: {
      feature: { type: 'string' },
      uiFramework: { enum: ['swiftui', 'uikit', 'mixed'], default: 'swiftui' },
      minIOS: { type: 'string', default: '15.0' },
      architecture: { enum: ['mvvm', 'tca', 'viper'], default: 'mvvm' }
    }},
    output: { type: 'object', properties: { swiftFiles: { type: 'array' }, xcodeprojDelta: { type: 'string' } } },
    errors: {
      ENTITLEMENT_MISSING: { code: 'IOS_001', message: '缺少所需 entitlement / capability', retryable: false },
      APP_STORE_GUIDELINE: { code: 'IOS_002', message: '可能违反 App Store 审核指南', retryable: false }
    },
    learning: {
      summaryZh: 'iOS 开发的"快"在于 SwiftUI 把 UI 写少，"慢"在于审核、签名、设备碎片化都跑不掉。',
      keyPoints: ['SwiftUI 优先，UIKit 兜底', 'Combine / async-await 选其一统一', 'Capability 与 Info.plist 声明权限', '本地数据：SwiftData / Core Data / Realm 各有取舍', 'TestFlight 灰度是上线前必经'],
      bestPractices: ['Xcode Cloud / fastlane 自动化签名打包', 'XCTest + ViewInspector 写单元 + UI 测试', '使用 SF Symbols 与原生组件最大化一致体验', '崩溃接 Sentry / Firebase Crashlytics'],
      antiPatterns: ['用 webview 包安卓样式 UI 上 App Store', '直接 NSLog 敏感信息', '一份代码 if Android else iOS 满天飞', '忽视 ATS、HTTP 直连、未签名网络请求'],
      resources: [
        { title: 'Apple HIG', url: 'https://developer.apple.com/design/human-interface-guidelines/', type: 'doc' },
        { title: 'SwiftUI 官方文档', url: 'https://developer.apple.com/documentation/swiftui', type: 'doc' },
        { title: 'fastlane', url: 'https://fastlane.tools/', type: 'doc' }
      ],
      maturityLevels: { junior: '能开发常规列表 / 表单 / 网络请求页面', mid: '能选架构、写测试、走完发布流程', senior: '能主导 iOS 端架构、性能调优、合规与隐私治理' }
    }
  },

  'terraform-basics': {
    name: 'Terraform Basics',
    nameZh: 'Terraform 基础',
    description: 'Provision cloud infrastructure with Terraform: providers, resources, modules, state management and remote backends.',
    descriptionZh: '使用 Terraform 声明式管理云资源：provider / resource / module / state / 远端 backend。',
    tags: ['iac', 'terraform', 'cloud', 'provisioning', 'devops'],
    category: 'devops',
    input: { type: 'object', required: ['provider'], properties: {
      provider: { enum: ['aws', 'azurerm', 'google', 'kubernetes', 'multi'] },
      module: { type: 'string', description: '模块名或路径' },
      backend: { enum: ['local', 's3', 'gcs', 'azurerm', 'remote'], default: 's3' }
    }},
    output: { type: 'object', properties: { plan: { type: 'string' }, tfFiles: { type: 'array' }, applyResult: { type: 'object' } } },
    errors: {
      STATE_LOCK: { code: 'TF_001', message: 'state 已被锁定，等待释放或强解锁', retryable: true },
      PLAN_DRIFT: { code: 'TF_002', message: '检测到带外变更，plan 与实际不符', retryable: false }
    },
    learning: {
      summaryZh: 'Terraform 的核心痛点不是语法，而是状态管理：state 一坏，整朵云都疼。',
      keyPoints: ['永远使用远端 backend + state lock', '生产环境禁用 local state', '模块化复用，但避免过度抽象', 'plan 必须人工 review 后再 apply', 'sensitive 字段标记 + secret 不入 state'],
      bestPractices: ['Atlantis / Terraform Cloud / Spacelift 做 PR-based 流程', 'tfsec / checkov 做安全扫', 'workspace 隔离 dev/stg/prod', '版本化 provider 和 module，避免 drift'],
      antiPatterns: ['多人共用一份 local state', '直接在控制台改资源（带外变更）', 'apply --auto-approve 在生产', 'secret 写在 .tf 文件入 git'],
      resources: [
        { title: 'Terraform Best Practices (Gruntwork)', url: 'https://www.terraform-best-practices.com/', type: 'doc' },
        { title: 'HashiCorp 官方文档', url: 'https://developer.hashicorp.com/terraform/docs', type: 'doc' },
        { title: 'tfsec', url: 'https://aquasecurity.github.io/tfsec/', type: 'doc' }
      ],
      maturityLevels: { junior: '能读懂并修改既有 module', mid: '能设计模块化布局、远端 state、CI/CD 流程', senior: '能制定全公司 IaC 规范、合规扫描、漂移治理' }
    }
  },

  'health-monitoring': {
    name: 'Health Monitoring',
    nameZh: '健康监控',
    description: 'Set up health monitoring covering process liveness, readiness, dependency health, and synthetic checks for SLO-backed services.',
    descriptionZh: '构建覆盖进程存活 / 流量就绪 / 依赖健康 / 合成探测的健康监控体系，支撑 SLO 服务。',
    tags: ['observability', 'health', 'sre', 'monitoring', 'slo'],
    category: 'ops',
    input: { type: 'object', required: ['service'], properties: {
      service: { type: 'string' },
      probes: { type: 'array', items: { enum: ['liveness', 'readiness', 'startup', 'synthetic'] } },
      sloTarget: { type: 'number', description: '可用性目标（如 0.999）' }
    }},
    output: { type: 'object', properties: { dashboards: { type: 'array' }, alerts: { type: 'array' }, runbookUrl: { type: 'string' } } },
    errors: {
      SLO_UNDEFINED: { code: 'HM_001', message: '服务未定义 SLO，无法配置告警阈值', retryable: false }
    },
    learning: {
      summaryZh: '健康监控的目标不是"能告警"，而是"告对警"：噪声多就等于没监控。',
      keyPoints: ['multi-window multi-burn-rate 替代单阈值告警', 'symptom-based 告警（用户感知）优先于 cause-based', '黑盒（synthetic）+ 白盒（metrics）双视角', 'runbook 必须随告警发出', '依赖健康聚合到 readiness'],
      bestPractices: ['告警分级：page / ticket / silent', '把 SLO 与告警公式直接绑定', '使用 Prometheus AlertManager 路由按团队分发', '每月做告警审计，删冗余'],
      antiPatterns: ['CPU > 80% 就 page，半夜叫醒人', '告警没 runbook，值班人靠猜', '告警全发同一群组，疲劳化', '只监控基础设施不监控业务路径'],
      resources: [
        { title: 'Google SRE: Alerting on SLOs', url: 'https://sre.google/workbook/alerting-on-slos/', type: 'doc' },
        { title: 'Prometheus AlertManager', url: 'https://prometheus.io/docs/alerting/latest/alertmanager/', type: 'doc' }
      ],
      maturityLevels: { junior: '能配基础 liveness / readiness probe', mid: '能基于 SLO 配 burn-rate 告警、写 runbook', senior: '能设计组织级监控体系、告警治理与值班规范' }
    }
  },

  'incident-runbook': {
    name: 'Incident Runbook',
    nameZh: '事件响应手册',
    description: 'Author runbooks documenting how to detect, mitigate, and recover from specific incident classes with clear ownership and steps.',
    descriptionZh: '撰写针对特定事件类的响应手册，明确检测 / 缓解 / 恢复步骤与责任人。',
    tags: ['sre', 'runbook', 'incident', 'ops', 'oncall'],
    category: 'ops',
    input: { type: 'object', required: ['incidentType'], properties: {
      incidentType: { type: 'string', description: '事件类别（DB 主从延迟 / API 5xx / payment fail）' },
      severity: { enum: ['SEV1', 'SEV2', 'SEV3'] },
      audience: { enum: ['oncall', 'sre', 'support'], default: 'oncall' }
    }},
    output: { type: 'object', properties: { runbookMd: { type: 'string' }, escalationPath: { type: 'array' }, validationSteps: { type: 'array' } } },
    errors: {
      RUNBOOK_OUTDATED: { code: 'RB_001', message: '关联指标 / dashboard 链接已失效', retryable: false }
    },
    learning: {
      summaryZh: '凌晨 3 点的告警面前，runbook 是值班人唯一可以信任的伙伴；写得不清等于没写。',
      keyPoints: ['每条 runbook 必须有：症状 / 检测 / 缓解 / 恢复 / 升级路径', '步骤要可复制粘贴执行', '工具命令固化（kubectl / psql / 自研 cli）', '与告警一对一绑定', '定期演练（GameDay）验证有效'],
      bestPractices: ['用模板（symptom / impact / detection / mitigation）保持结构', '版本化、加 lastVerified 字段', '链接到相关 dashboard / postmortem', 'oncall handoff 走 checklist'],
      antiPatterns: ['runbook 只写"重启服务"', '没有升级路径，事故扩大无人接手', '链接全部失效，半年没维护', '与告警脱节，oncall 不知道哪条 runbook 对应'],
      resources: [
        { title: 'Google SRE: Postmortem Culture', url: 'https://sre.google/sre-book/postmortem-culture/', type: 'doc' },
        { title: 'PagerDuty Runbook Template', url: 'https://response.pagerduty.com/before/runbook/', type: 'doc' }
      ],
      maturityLevels: { junior: '能照 runbook 执行恢复操作', mid: '能撰写覆盖 detect/mitigate/recover 全流程的 runbook', senior: '能制定 runbook 治理规范，驱动 GameDay 与告警-runbook 闭环' }
    }
  },

  'content-marketing': {
    name: 'Content Marketing',
    nameZh: '内容营销',
    description: 'Plan, produce and distribute content across channels to drive awareness, leads and customer education.',
    descriptionZh: '规划 / 生产 / 分发跨渠道内容，驱动认知 / 获客 / 客户教育。',
    tags: ['marketing', 'content', 'seo', 'distribution', 'demand-gen'],
    category: 'marketing',
    input: { type: 'object', required: ['theme'], properties: {
      theme: { type: 'string' },
      channels: { type: 'array', items: { enum: ['blog', 'newsletter', 'social', 'video', 'podcast', 'webinar'] } },
      audience: { type: 'string' },
      goalFunnelStage: { enum: ['awareness', 'consideration', 'decision'], default: 'awareness' }
    }},
    output: { type: 'object', properties: { editorialCalendar: { type: 'array' }, kpis: { type: 'object' }, distributionPlan: { type: 'object' } } },
    errors: {
      KEYWORD_TOO_COMPETITIVE: { code: 'CM_001', message: '关键词竞争度过高，需选 long-tail 替代', retryable: false }
    },
    learning: {
      summaryZh: '内容营销不是发文章，而是用一连串内容陪用户走完认知到决策的全旅程。',
      keyPoints: ['内容必须按漏斗阶段（TOFU / MOFU / BOFU）设计', '主题集群（pillar + cluster）替代孤岛文章', '原创 + 二次分发（newsletter / social cut / video repurpose）', 'KPI：流量 / 互动 / lead / pipeline 各阶段不同', '复用 ≥ 新写，长尾产生复利'],
      bestPractices: ['编辑日历 + 主题集群', '与 SEO 数据驱动选题（intent search）', '每篇内容标 funnel stage 与目标 CTA', '建立 distribution checklist'],
      antiPatterns: ['只写不分发，发完即死', '盲目追热点无品牌一致性', 'KPI 只看 PV，不看转化', '不做 repurpose，每次从 0 起步'],
      resources: [
        { title: 'Ahrefs Blog', url: 'https://ahrefs.com/blog/', type: 'article' },
        { title: 'HubSpot Content Marketing Guide', url: 'https://blog.hubspot.com/marketing/content-marketing', type: 'doc' }
      ],
      maturityLevels: { junior: '能按 brief 产出单篇内容', mid: '能编排主题集群与多渠道分发', senior: '能搭组织级内容引擎与漏斗化运营' }
    }
  },

  'seo-optimization': {
    name: 'SEO Optimization',
    nameZh: 'SEO 优化',
    description: 'Improve organic search visibility through technical SEO, on-page optimization, content strategy and link building.',
    descriptionZh: '通过技术 SEO / on-page / 内容策略 / 外链建设提升自然搜索可见度。',
    tags: ['seo', 'marketing', 'organic', 'growth', 'content'],
    category: 'marketing',
    input: { type: 'object', required: ['site'], properties: {
      site: { type: 'string', description: '网站域名' },
      audit: { enum: ['technical', 'on-page', 'content-gap', 'backlink', 'full'], default: 'full' },
      market: { type: 'string', default: 'global' }
    }},
    output: { type: 'object', properties: { issues: { type: 'array' }, recommendations: { type: 'array' }, prioritizedBacklog: { type: 'array' } } },
    errors: {
      INDEX_BLOCKED: { code: 'SEO_001', message: '关键页面被 robots.txt / noindex 阻止', retryable: false }
    },
    learning: {
      summaryZh: 'SEO 是技术、内容、外链三角飞轮，任一边长期失修都会让另外两边白费力气。',
      keyPoints: ['Core Web Vitals 与排名直接相关', 'search intent > keyword volume', 'internal linking 是被低估的杠杆', 'GEO（Generative Engine Optimization）成新战场', 'E-E-A-T 决定 YMYL 类目可见度'],
      bestPractices: ['用 GSC / Ahrefs / Semrush 三件套定期审计', '为关键词集群建立 pillar page + cluster', 'schema.org 标记结构化数据', '定期清理 thin / duplicate content'],
      antiPatterns: ['关键词堆砌', '买垃圾外链触发惩罚', 'JS 渲染但不做 SSR / prerender', '忽视 mobile / 速度，Core Web Vitals 全红'],
      resources: [
        { title: 'Google Search Central', url: 'https://developers.google.com/search', type: 'doc' },
        { title: 'Ahrefs SEO Guide', url: 'https://ahrefs.com/blog/seo/', type: 'doc' },
        { title: 'Core Web Vitals', url: 'https://web.dev/vitals/', type: 'doc' }
      ],
      maturityLevels: { junior: '能跑技术 SEO 审计、修基础问题', mid: '能搭关键词地图、internal linking、CWV 优化', senior: '能驱动跨团队 SEO 战略、GEO 适配、品牌可见度' }
    }
  },

  'retention': {
    name: 'Retention Strategy',
    nameZh: '留存策略',
    description: 'Diagnose retention curves, identify drivers and design experiments / lifecycle programs to lift long-term retention.',
    descriptionZh: '诊断留存曲线，识别驱动因子，设计实验 / lifecycle 项目提升长期留存。',
    tags: ['growth', 'retention', 'lifecycle', 'product', 'analytics'],
    category: 'growth',
    input: { type: 'object', required: ['product'], properties: {
      product: { type: 'string' },
      retentionType: { enum: ['n-day', 'unbounded', 'rolling', 'bracket'], default: 'n-day' },
      lookbackDays: { type: 'number', default: 90 }
    }},
    output: { type: 'object', properties: { retentionCurve: { type: 'array' }, drivers: { type: 'array' }, experiments: { type: 'array' } } },
    errors: {
      DATA_GAP: { code: 'RT_001', message: '埋点缺失导致留存计算不可信', retryable: false }
    },
    learning: {
      summaryZh: '没有留存就没有增长：获客是借钱，留存是还款，曲线压平之前所有付费投放都是漏水。',
      keyPoints: ['区分 n-day vs unbounded retention，含义不同', 'aha moment 与 magic number 是产品化留存的钥匙', 'cohort 看趋势，funnel 看断点', '"产品作为习惯"才是长期留存', 'natural frequency 决定衡量周期'],
      bestPractices: ['先把曲线压平，再考虑获客提速', 'lifecycle program（onboarding / engaged / at-risk / win-back）分层', '用因果实验验证驱动因子', '与产品 backlog 联动'],
      antiPatterns: ['只看 D1，长尾全忽略', '把短期回访当真留存', '靠 push 频率换 DAU 数字游戏', '没找到 aha moment 就大投放'],
      resources: [
        { title: 'Reforge Retention Series', url: 'https://www.reforge.com/programs/retention-engagement', type: 'doc' },
        { title: 'Andrew Chen: Power user curve', url: 'https://andrewchen.com/power-user-curve/', type: 'article' },
        { title: 'Brian Balfour: Retention as growth foundation', url: 'https://brianbalfour.com/essays/retention-engagement-growth', type: 'article' }
      ],
      maturityLevels: { junior: '能跑出留存矩阵看 D1/D7/D30', mid: '能识别 aha moment 与驱动因子、设计实验', senior: '能驱动跨产品留存战略与 lifecycle 体系' }
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

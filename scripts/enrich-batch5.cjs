#!/usr/bin/env node
/**
 * 第六轮 batch 5：再选 12 个 placeholder 全量 enrich，目标整体破 80
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'atomic-skills');

const PATCHES = {
  'feedback-loop': {
    name: 'Feedback Loop',
    nameZh: '反馈闭环',
    description: 'Design end-to-end customer feedback loops: capture, triage, prioritize, act, and close back to users.',
    descriptionZh: '设计端到端的客户反馈闭环：采集 / 分诊 / 优先级 / 行动 / 回告。',
    tags: ['product', 'feedback', 'voice-of-customer', 'closed-loop', 'cs'],
    category: 'product',
    input: { type: 'object', required: ['channels'], properties: {
      channels: { type: 'array', items: { enum: ['nps', 'csat', 'support', 'sales', 'in-app', 'community'] } },
      slaDays: { type: 'number', default: 14 }
    }},
    output: { type: 'object', properties: { intakeFlow: { type: 'string' }, prioritizationMatrix: { type: 'object' }, closeBackTemplate: { type: 'string' } } },
    errors: { CHANNEL_SILO: { code: 'FB_001', message: '反馈渠道彼此隔离，无法去重', retryable: false } },
    learning: {
      summaryZh: '没有"close back"的反馈系统是单向漏斗：用户感觉到没人听，只会沉默离开。',
      keyPoints: ['多渠道汇聚到统一入口', '量化优先级（影响 × 频率 × 客户分层）', '与 Roadmap 双向绑定', '行动后必须主动回告反馈方', '区分可执行反馈 vs 只是抱怨'],
      bestPractices: ['用 Productboard / Aha! / Linear 做汇聚', '建立 weekly triage 节奏与 SLA', '把 close-back 自动化（CRM 触发器）', 'NPS 后必接 follow-up 访谈'],
      antiPatterns: ['NPS 数字党，只看分数不看评论', 'support / sales 反馈进不了 Roadmap', '功能上线但用户不知道（无回告）'],
      resources: [
        { title: 'Reforge: Voice of Customer', url: 'https://www.reforge.com/blog/voice-of-customer', type: 'article' },
        { title: 'Productboard playbooks', url: 'https://www.productboard.com/glossary/customer-feedback-loop/', type: 'doc' }
      ],
      maturityLevels: { junior: '能采集与归档反馈', mid: '能 triage、优先级、闭环回告', senior: '能搭组织级 VoC 体系并驱动产品决策' }
    }
  },

  'analytics': {
    name: 'Analytics',
    nameZh: '产品分析',
    description: 'Design event tracking schema, build dashboards and answer product / business questions with data.',
    descriptionZh: '设计事件埋点 schema，搭建 dashboard，用数据回答产品 / 业务问题。',
    tags: ['analytics', 'event-tracking', 'data', 'product', 'dashboard'],
    category: 'analytics',
    input: { type: 'object', required: ['question'], properties: {
      question: { type: 'string', description: '业务问题' },
      dataSource: { type: 'string' },
      metric: { type: 'string' }
    }},
    output: { type: 'object', properties: { sql: { type: 'string' }, chart: { type: 'object' }, insights: { type: 'array' } } },
    errors: { EVENT_NOT_TRACKED: { code: 'AN_001', message: '所需事件未埋点', retryable: false } },
    learning: {
      summaryZh: '分析师 80% 时间在和数据质量斗争，20% 在思考；好的埋点 schema 让这个比例倒过来。',
      keyPoints: ['事件命名约定先行（Object_Action）', 'property 维度可枚举与可索引性 trade-off', '北极星指标 + 输入指标 + 护栏指标三层', '区分用户级 / 事件级 / 会话级聚合', 'self-serve dashboard > 一次性 SQL'],
      bestPractices: ['用 tracking plan（Avo / Iteratively）做埋点治理', '与产品 launch 同期上 dashboard', '关键指标做 alert，异常自动通知', '把分析查询固化为 dbt model'],
      antiPatterns: ['每个 PM 自定义事件命名', '一张大宽表回答所有问题', '一个事件几十个 property，难索引', '只看头部指标忽略 cohort / funnel 分解'],
      resources: [
        { title: 'Amplitude blog', url: 'https://amplitude.com/blog', type: 'article' },
        { title: 'Avo tracking plan', url: 'https://www.avo.app/', type: 'doc' }
      ],
      maturityLevels: { junior: '能用 BI 工具回答常见问题', mid: '能设计 tracking plan 与 self-serve dashboard', senior: '能驱动组织级数据消费文化与指标治理' }
    }
  },

  'android-development': {
    name: 'Android Development',
    nameZh: 'Android 开发',
    description: 'Develop Android apps with Kotlin / Jetpack Compose covering navigation, persistence, networking and platform integration.',
    descriptionZh: '基于 Kotlin / Jetpack Compose 开发 Android 应用，覆盖导航 / 持久化 / 网络 / 系统集成。',
    tags: ['mobile', 'android', 'kotlin', 'compose', 'jetpack'],
    category: 'mobile',
    input: { type: 'object', required: ['feature'], properties: {
      feature: { type: 'string' },
      uiFramework: { enum: ['compose', 'view', 'mixed'], default: 'compose' },
      minSdk: { type: 'number', default: 24 },
      architecture: { enum: ['mvvm', 'mvi'], default: 'mvvm' }
    }},
    output: { type: 'object', properties: { kotlinFiles: { type: 'array' }, gradleDelta: { type: 'string' } } },
    errors: { PERMISSION_MISSING: { code: 'AD_001', message: '缺少必要的运行时权限', retryable: false } },
    learning: {
      summaryZh: 'Android 的难点在碎片化与权限语义；Compose + Jetpack 改善了一切，但旧代码迁移仍是泥潭。',
      keyPoints: ['Compose 是默认选择，仅维护用 View', 'StateFlow / Flow 取代 LiveData 长期方向', 'ViewModel + UI State 单向数据流', 'foreground / background 任务区分', 'Scoped Storage / 运行时权限是合规底线'],
      bestPractices: ['Hilt 做 DI、Coroutines 做异步、Room 做本地存储', 'Baseline Profile 提冷启动性能', 'Espresso + Compose Test 写 UI 测试', 'Play Console 灰度 + Pre-launch report'],
      antiPatterns: ['Activity 一锅炖，无 ViewModel', '把所有任务都丢主线程', 'ProGuard 规则错配导致线上崩溃', 'minSdk 太低无意义维护成本'],
      resources: [
        { title: 'Android Developer Docs', url: 'https://developer.android.com/', type: 'doc' },
        { title: 'Jetpack Compose', url: 'https://developer.android.com/jetpack/compose', type: 'doc' },
        { title: 'Now in Android', url: 'https://github.com/android/nowinandroid', type: 'doc' }
      ],
      maturityLevels: { junior: '能开发常规列表 / 表单页面', mid: '能选架构、写测试、走完发布流程', senior: '能主导架构、性能调优、合规与隐私治理' }
    }
  },

  'ansible-automation': {
    name: 'Ansible Automation',
    nameZh: 'Ansible 自动化',
    description: 'Use Ansible playbooks and roles for agentless server configuration, orchestration and compliance enforcement.',
    descriptionZh: '用 Ansible playbook / role 实现无 agent 的服务器配置、编排与合规执行。',
    tags: ['devops', 'ansible', 'configuration', 'automation', 'iac'],
    category: 'devops',
    input: { type: 'object', required: ['inventory'], properties: {
      inventory: { type: 'string' },
      playbook: { type: 'string' },
      checkMode: { type: 'boolean', default: false }
    }},
    output: { type: 'object', properties: { changed: { type: 'number' }, failed: { type: 'number' }, report: { type: 'string' } } },
    errors: { SSH_UNREACHABLE: { code: 'AN_001', message: '目标主机 SSH 不可达', retryable: true } },
    learning: {
      summaryZh: 'Ansible 的卖点是简单与无 agent，但 playbook 体量一大就成 bash 升级版，模块化是命门。',
      keyPoints: ['idempotent 是 Ansible 的灵魂', 'role 化 + ansible-galaxy 复用', '--check / --diff 是夜间值班的护身符', 'tags 控制执行子集', 'Vault 加密 secrets 入库'],
      bestPractices: ['用 molecule 做 role 测试', 'CI 中 lint（ansible-lint）+ check 模式', '把 inventory 与 secrets 分离仓库', '用 dynamic inventory 接 cloud provider'],
      antiPatterns: ['shell module 满天飞，破坏幂等', 'playbook 巨型单文件无 role', '在 prod 直接 run，无 staging', 'secrets 明文写入 vars'],
      resources: [
        { title: 'Ansible Best Practices', url: 'https://docs.ansible.com/ansible/latest/tips_tricks/ansible_tips_tricks.html', type: 'doc' },
        { title: 'Molecule', url: 'https://molecule.readthedocs.io/', type: 'doc' }
      ],
      maturityLevels: { junior: '能跑现成 playbook', mid: '能写 role、用 vault、CI 集成', senior: '能设计跨百台规模的自动化体系并接 IaC / GitOps' }
    }
  },

  'azure-cli-basics': {
    name: 'Azure CLI Basics',
    nameZh: 'Azure CLI 基础',
    description: 'Use Azure CLI for resource provisioning, querying, scripting and automation across Azure services.',
    descriptionZh: '使用 Azure CLI 管理 Azure 资源，支撑脚本化与自动化。',
    tags: ['azure', 'cli', 'cloud', 'devops', 'automation'],
    category: 'devops',
    input: { type: 'object', required: ['service', 'action'], properties: {
      service: { type: 'string' },
      action: { type: 'string' },
      subscription: { type: 'string' }
    }},
    output: { type: 'object', properties: { result: { type: 'object' }, exitCode: { type: 'number' } } },
    errors: { AUTH_FAIL: { code: 'AZ_001', message: '凭据失效或权限不足', retryable: false } },
    learning: {
      summaryZh: 'Azure CLI 与 AWS CLI 模式同构，但 RBAC 与 Resource Group 边界是 Azure 独有的概念门槛。',
      keyPoints: ['az login + az account set --subscription', 'Resource Group 是部署单位与权限边界', '--query 用 JMESPath，--output table 适合 ad-hoc', 'Service Principal 替代长期密钥', 'az bicep 与 ARM template 配合使用'],
      bestPractices: ['用 Managed Identity 替代凭据', 'CLI 命令固化进 scripts 与 CI', '危险操作 --dry-run / what-if', 'tag 命名规范便于成本归属'],
      antiPatterns: ['全局 admin 用户日常使用', '把 SP 凭据写入仓库', '订阅 / RG 命名混乱难治理', '命令脚本无版本控制'],
      resources: [
        { title: 'Azure CLI docs', url: 'https://learn.microsoft.com/en-us/cli/azure/', type: 'doc' },
        { title: 'Azure RBAC', url: 'https://learn.microsoft.com/en-us/azure/role-based-access-control/overview', type: 'doc' }
      ],
      maturityLevels: { junior: '能跑常用资源管理命令', mid: '能用 SP / Managed Identity / 脚本化', senior: '能制定云资源治理与命名 / RBAC 规范' }
    }
  },

  'brand-strategy': {
    name: 'Brand Strategy',
    nameZh: '品牌战略',
    description: 'Define brand positioning, voice, identity and architecture aligned with business strategy and customer perception.',
    descriptionZh: '定义品牌定位 / 调性 / 视觉 / 架构，对齐商业战略与客户认知。',
    tags: ['marketing', 'brand', 'positioning', 'identity', 'strategy'],
    category: 'marketing',
    input: { type: 'object', required: ['stage'], properties: {
      stage: { enum: ['discovery', 'positioning', 'identity', 'rollout', 'audit'] },
      audience: { type: 'string' },
      competitors: { type: 'array' }
    }},
    output: { type: 'object', properties: { positioningStatement: { type: 'string' }, brandPillars: { type: 'array' }, identityGuide: { type: 'string' } } },
    errors: { POSITION_OVERLAP: { code: 'BS_001', message: '品牌定位与竞品高度重叠', retryable: false } },
    learning: {
      summaryZh: '品牌不是 Logo，而是客户脑中那个未被 Google 的预设答案。',
      keyPoints: ['Positioning > Identity > 视觉', 'April Dunford 五步定位法', '品牌承诺必须可被产品兑现', '一致性 > 新颖性，长期复利', '品牌架构（master / endorsed / house of brands）服务业务结构'],
      bestPractices: ['客户访谈 + 内部访谈 + 竞品扫描三角', '品牌指南覆盖 voice / tone / visual', '上线前做 brand audit 对照', 'brand 与 demand-gen 协同度量'],
      antiPatterns: ['先做 Logo 再补战略', '一年一改完全推翻', '品牌承诺浮夸，产品兑现不了', '把 brand 当 marketing 私事'],
      resources: [
        { title: 'Obviously Awesome (April Dunford)', url: 'https://www.aprildunford.com/obviously-awesome', type: 'book' },
        { title: 'Marty Neumeier: Brand Gap', url: 'https://www.martyneumeier.com/the-brand-gap', type: 'book' }
      ],
      maturityLevels: { junior: '能维护品牌指南', mid: '能主导 positioning + identity 输出', senior: '能驱动跨产品 / GTM 的品牌战略与架构' }
    }
  },

  'cloud-encryption': {
    name: 'Cloud Encryption',
    nameZh: '云加密',
    description: 'Apply encryption-at-rest, in-transit and in-use across cloud services with KMS, envelope encryption and proper key lifecycle.',
    descriptionZh: '在云上实现静态 / 传输 / 使用中加密，配合 KMS、信封加密与密钥全生命周期管理。',
    tags: ['security', 'encryption', 'kms', 'cloud', 'data-protection'],
    category: 'security',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { enum: ['at-rest', 'in-transit', 'in-use', 'full'] },
      kmsBackend: { enum: ['aws-kms', 'gcp-kms', 'azure-keyvault', 'hsm'] },
      keyRotationDays: { type: 'number', default: 365 }
    }},
    output: { type: 'object', properties: { policyDocument: { type: 'object' }, rotationSchedule: { type: 'string' } } },
    errors: { KEY_ROTATION_FAIL: { code: 'CE_001', message: '密钥轮换失败，旧数据无法解密', retryable: true } },
    learning: {
      summaryZh: '加密三态：静态、传输、使用中。多数事故不在算法弱，而在密钥管理混乱。',
      keyPoints: ['信封加密：DEK 加密数据，KEK（KMS）加密 DEK', '客户管理密钥（CMK）vs 服务托管', 'TLS 1.2+ 强制，禁用旧协议', 'confidential computing（SEV / SGX）实现 in-use 加密', '密钥生命周期：create / rotate / revoke / destroy 全审计'],
      bestPractices: ['默认开启 EBS / S3 / RDS 加密', '密钥按业务域隔离', '导入自带密钥（BYOK / HYOK）以满足合规', '与 IAM 联动控制 key 使用权'],
      antiPatterns: ['一把 KEK 解所有库', '密钥永不轮换', '把 KEK 与数据放同一账号无隔离', 'TLS 用自签证书且无验证'],
      resources: [
        { title: 'AWS KMS Best Practices', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html', type: 'doc' },
        { title: 'Google Cloud KMS', url: 'https://cloud.google.com/kms/docs', type: 'doc' },
        { title: 'NIST SP 800-57 Key Management', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r5.pdf', type: 'doc' }
      ],
      maturityLevels: { junior: '能开启服务级加密', mid: '能设计 CMK / 信封加密 / 轮换', senior: '能制定组织级密钥治理与合规对齐' }
    }
  },

  'cloud-logging-monitoring': {
    name: 'Cloud Logging & Monitoring',
    nameZh: '云端日志与监控',
    description: 'Centralize cloud-native logs and metrics (CloudWatch / Stackdriver / Azure Monitor) with retention, alerting and cost control.',
    descriptionZh: '集中化云端日志与指标（CloudWatch / Stackdriver / Azure Monitor），含保留 / 告警 / 成本控制。',
    tags: ['observability', 'cloud', 'monitoring', 'logging', 'sre'],
    category: 'ops',
    input: { type: 'object', required: ['provider'], properties: {
      provider: { enum: ['aws', 'gcp', 'azure'] },
      retentionDays: { type: 'number', default: 30 },
      alertChannels: { type: 'array' }
    }},
    output: { type: 'object', properties: { logGroups: { type: 'array' }, alertPolicies: { type: 'array' }, monthlyCost: { type: 'number' } } },
    errors: { COST_OVERRUN: { code: 'CL_001', message: '日志成本超出预算', retryable: false } },
    learning: {
      summaryZh: '云原生日志便宜入门，贵在长期：成本治理 = 保留 + 采样 + 冷热分层。',
      keyPoints: ['log group / metric namespace 明确边界', '冷热分层：CloudWatch → S3 → Glacier', 'metric filter 把日志转 metric', 'alarm 与 SLO 对齐而非阈值堆砌', '审计日志独立保留 ≥ 1 年'],
      bestPractices: ['用 OpenTelemetry collector 接入多云', '关键路径开 detailed monitoring', '配置 budgets + cost anomaly detection', '导出长期数据到 S3 / GCS 用 Athena / BigQuery 查询'],
      antiPatterns: ['默认保留 永久 + verbose 全开', '告警阈值硬编码无版本', '日志只在 Console 看，不接 SIEM', '不分 log group，权限失控'],
      resources: [
        { title: 'AWS CloudWatch Logs Best Practices', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html', type: 'doc' },
        { title: 'Google Cloud Operations', url: 'https://cloud.google.com/products/operations', type: 'doc' },
        { title: 'Azure Monitor', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/', type: 'doc' }
      ],
      maturityLevels: { junior: '能配 log / alarm 基础', mid: '能做 retention / 冷热 / metric filter / 成本控制', senior: '能建多云统一可观测性平台' }
    }
  },

  'cloudflare-manager': {
    name: 'Cloudflare Manager',
    nameZh: 'Cloudflare 管理',
    description: 'Manage DNS, CDN, WAF, Workers and Zero Trust on Cloudflare to deliver fast, secure and resilient edge applications.',
    descriptionZh: '管理 Cloudflare 上的 DNS / CDN / WAF / Workers / Zero Trust，交付快速安全韧性的边缘应用。',
    tags: ['cdn', 'cloudflare', 'edge', 'waf', 'dns'],
    category: 'devops',
    input: { type: 'object', required: ['zone'], properties: {
      zone: { type: 'string' },
      feature: { enum: ['dns', 'cdn', 'waf', 'workers', 'zero-trust', 'pages'] }
    }},
    output: { type: 'object', properties: { config: { type: 'object' }, ruleId: { type: 'string' } } },
    errors: { ZONE_NOT_OWNED: { code: 'CF_001', message: '当前账号无该 zone 权限', retryable: false } },
    learning: {
      summaryZh: 'Cloudflare 把网络栈搬到边缘，运维只需专注规则；但规则一爆，全球流量同时受影响。',
      keyPoints: ['DNS / CDN / WAF / Workers 是同一个控制面', 'WAF 必须先 log only 跑一周再 enforce', 'Cache Rules / Page Rules 优先级互通', 'Workers 适合 A/B / 鉴权 / 重写，不适合长任务', 'Zero Trust 替代 VPN 是趋势'],
      bestPractices: ['Terraform Provider 管理配置', '规则变更分 staging zone', '关键域名启 DNSSEC / Always Use HTTPS / HSTS', 'Cloudflare Tunnel 替代公网暴露'],
      antiPatterns: ['直接在 Dashboard 改规则不入 git', 'WAF 全开 enforce 误杀业务', '同一个 API token 给所有团队', 'Workers 写复杂业务逻辑无回滚'],
      resources: [
        { title: 'Cloudflare Docs', url: 'https://developers.cloudflare.com/', type: 'doc' },
        { title: 'Terraform Cloudflare provider', url: 'https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs', type: 'doc' }
      ],
      maturityLevels: { junior: '能配 DNS / 基础 cache rule', mid: '能写 Workers / WAF / IaC 化', senior: '能设计跨账号 Cloudflare 治理与边缘架构' }
    }
  },

  'community-management': {
    name: 'Community Management',
    nameZh: '社区运营',
    description: 'Build and nurture user communities (Discord / Slack / forum / GitHub) to drive engagement, advocacy and product feedback.',
    descriptionZh: '在 Discord / Slack / 论坛 / GitHub 建设与运营用户社区，驱动参与 / 拥护 / 产品反馈。',
    tags: ['community', 'devrel', 'engagement', 'advocacy', 'marketing'],
    category: 'marketing',
    input: { type: 'object', required: ['platform'], properties: {
      platform: { enum: ['discord', 'slack', 'forum', 'github', 'reddit'] },
      stage: { enum: ['launch', 'growth', 'mature'] }
    }},
    output: { type: 'object', properties: { contentCalendar: { type: 'array' }, healthMetrics: { type: 'object' }, moderationPolicy: { type: 'string' } } },
    errors: { TROLL_INFLUX: { code: 'CM_001', message: '检测到批量 troll，需启动 moderation 应急', retryable: false } },
    learning: {
      summaryZh: '社区是产品的护城河，但只有持续投入与人格化的运营才能让河水不干涸。',
      keyPoints: ['Mature 阶段健康度看 contributor / DAU / 自答比例', 'champion / MVP 计划放大种子', '内容由社区参与产出，不是单向 broadcast', '定期 office hour / AMA 强信号', '及时 / 真实 / 个性化是黄金三原则'],
      bestPractices: ['有清晰 Code of Conduct 与执行流程', '把社区反馈回灌产品 backlog', 'Onboarding 流程（welcome flow / channel guide）', '指标透明（monthly community report）'],
      antiPatterns: ['创建 Discord 后无人值守', '把社区当客服替代品', '过度 self-promotion，参与度暴跌', '出现冲突后冷处理'],
      resources: [
        { title: 'CMX: Community Industry', url: 'https://cmxhub.com/', type: 'article' },
        { title: 'David Spinks: Business of Community', url: 'https://davidspinks.substack.com/', type: 'doc' }
      ],
      maturityLevels: { junior: '能日常活跃 + moderation', mid: '能策划 program、复盘指标', senior: '能把社区接入 GTM / 产品 / DevRel 战略' }
    }
  },

  'container-image-scanning': {
    name: 'Container Image Scanning',
    nameZh: '容器镜像扫描',
    description: 'Scan container images for vulnerabilities, secrets, license risk and policy violations across CI and registry.',
    descriptionZh: '在 CI 与镜像仓库阶段扫描容器镜像的漏洞 / 凭据 / license / 策略风险。',
    tags: ['security', 'container', 'scanning', 'sbom', 'devsecops'],
    category: 'security',
    input: { type: 'object', required: ['image'], properties: {
      image: { type: 'string' },
      scanner: { enum: ['trivy', 'grype', 'snyk', 'docker-scout'], default: 'trivy' },
      severityThreshold: { enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' }
    }},
    output: { type: 'object', properties: { vulnerabilities: { type: 'array' }, sbom: { type: 'object' }, blocked: { type: 'boolean' } } },
    errors: { CRITICAL_FOUND: { code: 'CIS_001', message: '检测到 Critical 漏洞，已阻断发布', retryable: false } },
    learning: {
      summaryZh: '镜像扫描的价值不在"扫到了"而在"能不能阻断"——CI 不阻断的扫描等于没做。',
      keyPoints: ['shift-left：构建期扫 + registry 扫 + runtime 扫三道', 'SBOM（CycloneDX / SPDX）是合规基线', '优先级：Critical 立即阻断，High 7 天 fix', 'base image 是最大风险源，固定 + 定期升级', 'secrets in image 与 vuln 同样致命'],
      bestPractices: ['Trivy / Grype 接入 GH Actions / GitLab CI', 'image signing（cosign）+ verification', '建立 vulnerability triage 流程与 SLA', '与 SBOM 仓库（Dependency-Track）联动'],
      antiPatterns: ['只扫不阻断，报告石沉海底', 'allow-list 漏洞太宽', '只扫 application layer 不扫 base', 'CVE 修复用"换 base 但不测试"'],
      resources: [
        { title: 'Trivy', url: 'https://aquasecurity.github.io/trivy/', type: 'doc' },
        { title: 'cosign', url: 'https://docs.sigstore.dev/cosign/overview/', type: 'doc' },
        { title: 'CycloneDX', url: 'https://cyclonedx.org/', type: 'doc' }
      ],
      maturityLevels: { junior: '能跑 trivy scan 并读懂报告', mid: '能集成 CI 阻断 + SBOM + signing', senior: '能制定组织级镜像供应链安全策略与合规对齐' }
    }
  },

  'compliance-as-code': {
    name: 'Compliance as Code',
    nameZh: '合规即代码',
    description: 'Express and enforce compliance controls as code (OPA / Rego / Cloud Custodian) with continuous evidence collection.',
    descriptionZh: '用代码（OPA / Rego / Cloud Custodian）表达与执行合规控制点，持续收集 evidence。',
    tags: ['compliance', 'opa', 'governance', 'automation', 'devsecops'],
    category: 'security',
    input: { type: 'object', required: ['framework'], properties: {
      framework: { enum: ['soc2', 'iso27001', 'pci-dss', 'cis', 'custom'] },
      enforcement: { enum: ['advisory', 'mandatory'], default: 'advisory' }
    }},
    output: { type: 'object', properties: { policies: { type: 'array' }, evidence: { type: 'array' }, violations: { type: 'array' } } },
    errors: { POLICY_DRIFT: { code: 'CAC_001', message: '运行态资源与策略 drift', retryable: false } },
    learning: {
      summaryZh: 'Compliance as Code 把 control 从 PDF 拽进 Git，让 evidence 在 CI 里自然生长。',
      keyPoints: ['policy = code = test = evidence', 'OPA / Rego 是事实标准', 'admission control（Kyverno / Gatekeeper）拦截违规', 'Cloud Custodian / Steampipe 巡检云资源', 'control mapping 一份多用（SOC2 / ISO 复用）'],
      bestPractices: ['policy 与应用一同 PR review', 'advisory → mandatory 渐进推进', 'evidence 自动归档（Drata / Vanta API）', 'control owner + due date 落到 Jira'],
      antiPatterns: ['policy 写完不跑、不监控漂移', 'advisory 永久 advisory，不进入 mandatory', 'evidence 仍靠人工截图', '一份 control 写多次没复用'],
      resources: [
        { title: 'Open Policy Agent', url: 'https://www.openpolicyagent.org/docs/', type: 'doc' },
        { title: 'Kyverno', url: 'https://kyverno.io/docs/', type: 'doc' },
        { title: 'Cloud Custodian', url: 'https://cloudcustodian.io/', type: 'doc' }
      ],
      maturityLevels: { junior: '能写简单 OPA 策略与单测', mid: '能集成 admission / cloud scan / evidence pipeline', senior: '能把 compliance-as-code 推到组织级，并对齐多个框架' }
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

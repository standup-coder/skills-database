#!/usr/bin/env node
/**
 * 第八轮 batch 8：12 个云安全剩余 placeholder 全量 enrich
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'atomic-skills');

const PATCHES = {
  'cis-benchmarks': {
    name: 'CIS Benchmarks',
    nameZh: 'CIS 基线',
    description: 'Apply Center for Internet Security benchmarks to harden OS, cloud and Kubernetes baselines.',
    descriptionZh: '应用 CIS 基线对操作系统 / 云 / K8s 做 baseline 加固。',
    tags: ['security', 'cis', 'benchmark', 'hardening', 'compliance'],
    category: 'security',
    input: { type: 'object', required: ['target'], properties: {
      target: { type: 'string' },
      profile: { type: 'string', enum: ['level-1', 'level-2'] },
      tool: { type: 'string', enum: ['cis-cat', 'lynis', 'kube-bench', 'inspec', 'docker-bench'] }
    }},
    output: { type: 'object', properties: { passed: { type: 'array' }, failed: { type: 'array' }, score: { type: 'number' }, remediation: { type: 'array' } } },
    errors: { PROFILE_MISMATCH: { code: 'CIS_001', message: 'profile 与目标不匹配', retryable: false } },
    learning: {
      summaryZh: 'CIS Benchmarks 是一套被广泛接受的基线"最大公约数"；不要全照搬，按业务环境裁剪 Level 1 / Level 2，并把它落到 IaC 而非手册。',
      keyPoints: ['Level 1（基础）vs Level 2（深度）', '把 benchmark 转 IaC 模板可复用', 'kube-bench / docker-bench / lynis 自动化', '裁剪要保留可追溯的 rationale', '与 SOC2 / ISO / PCI 控制点映射'],
      bestPractices: ['周期性扫描入 CI/CD', '失败项必须有 owner + due date', 'IaC 修复优先于手动 patch', '把裁剪决策写入安全 runbook'],
      antiPatterns: ['Level 2 一刀切引发业务故障', '一次性扫描无后续治理', '把 benchmark 当合规终点而非起点', '不裁剪导致 false positive 淹没'],
      resources: [
        { title: 'CIS Benchmarks', url: 'https://www.cisecurity.org/cis-benchmarks', type: 'doc' },
        { title: 'kube-bench', url: 'https://github.com/aquasecurity/kube-bench', type: 'doc' },
        { title: 'Lynis', url: 'https://cisofy.com/lynis/', type: 'doc' }
      ],
      maturityLevels: { junior: '能运行 kube-bench / lynis 并解读结果', mid: '能裁剪 baseline 并 IaC 化', senior: '能驱动组织级 baseline 治理与多框架映射' }
    }
  },

  'cloud-anomaly-detection': {
    name: 'Cloud Anomaly Detection',
    nameZh: '云异常检测',
    description: 'Detect anomalous behavior across cloud accounts using flow logs, IAM events and ML-based baselines.',
    descriptionZh: '基于 flow log / IAM 事件 / ML baseline 检测云账号异常行为。',
    tags: ['security', 'anomaly', 'cloud', 'detection', 'siem'],
    category: 'security',
    input: { type: 'object', required: ['source'], properties: {
      source: { type: 'string', enum: ['cloudtrail', 'vpc-flow-logs', 'guardduty', 'cloud-audit', 'wiz'] },
      windowDays: { type: 'number', default: 30 }
    }},
    output: { type: 'object', properties: { anomalies: { type: 'array' }, severity: { type: 'object' }, suspectedActor: { type: 'string' } } },
    errors: { LOG_DELAY: { code: 'AD_001', message: '日志投递延迟，检测窗口偏移', retryable: true } },
    learning: {
      summaryZh: '异常 ≠ 攻击；80% 异常是合法新行为，关键是"baseline + 上下文"分诊而不是堆告警。',
      keyPoints: ['身份维度 baseline > 全局 baseline', 'GuardDuty / Defender / SCC 是起点不是终点', '关联 IAM event + network event 共同决策', 'time-of-day / geo / volume 三维特征', '人工 feedback 闭环训练'],
      bestPractices: ['新员工首月观察期降低 false positive', '把关键 finding 推 SOC + 自动化响应', 'detection-as-code（Sigma / Panther rules）', '定期做 detection coverage gap 分析'],
      antiPatterns: ['告警阈值常年默认值', '只看 severity 不看 actor 上下文', '不区分 dev / prod 环境基线', '检出后无 playbook 响应'],
      resources: [
        { title: 'AWS GuardDuty', url: 'https://docs.aws.amazon.com/guardduty/', type: 'doc' },
        { title: 'Sigma rules', url: 'https://github.com/SigmaHQ/sigma', type: 'doc' },
        { title: 'MITRE D3FEND', url: 'https://d3fend.mitre.org/', type: 'doc' }
      ],
      maturityLevels: { junior: '能解读 GuardDuty finding', mid: '能写 detection rule + 调阈值', senior: '能驱动组织级 detection engineering 与 SOC 协同' }
    }
  },

  'cloud-firewall-waf': {
    name: 'Cloud Firewall & WAF',
    nameZh: '云防火墙与 WAF',
    description: 'Operate cloud firewall and WAF to filter L3/L4/L7 attacks with rule tuning and rate limiting.',
    descriptionZh: '运营云防火墙与 WAF，过滤 L3/L4/L7 攻击，调优规则与速率限制。',
    tags: ['security', 'waf', 'firewall', 'ddos', 'l7'],
    category: 'security',
    input: { type: 'object', required: ['target'], properties: {
      target: { type: 'string' },
      provider: { type: 'string', enum: ['aws-waf', 'cloudflare', 'azure-frontdoor', 'gcp-armor'] },
      ruleset: { type: 'string', enum: ['owasp-crs', 'managed', 'custom'] }
    }},
    output: { type: 'object', properties: { rules: { type: 'array' }, blockedSamples: { type: 'array' }, falsePositives: { type: 'array' } } },
    errors: { TOO_RESTRICTIVE: { code: 'WAF_001', message: '规则过严导致正常流量被阻断', retryable: false } },
    learning: {
      summaryZh: 'WAF 规则不是装上就完事，是要调出业务可用的"误杀率 / 漏杀率"平衡；OWASP CRS 默认规则上线前必须 staging。',
      keyPoints: ['count mode → block mode 渐进', 'rate limit 看每身份维度（IP / token / user）', 'managed rules + custom rules 组合', 'WAF + CDN + L4 firewall 分层', 'log 入 SIEM 做长期分析'],
      bestPractices: ['CRS 部署先开 paranoia=1 观察 2 周', 'bot management 单独规则集', '紧急 rule 走 hot-fix workflow', '定期审 false positive 调整 exception'],
      antiPatterns: ['一上来 paranoia=4 直接 block', '不区分登录 / 注册 / API 端点的 rate limit', 'WAF block 但没 log 到 SIEM', 'managed rule 从不 review'],
      resources: [
        { title: 'OWASP CRS', url: 'https://coreruleset.org/', type: 'doc' },
        { title: 'AWS WAF', url: 'https://docs.aws.amazon.com/waf/', type: 'doc' },
        { title: 'Cloudflare WAF', url: 'https://developers.cloudflare.com/waf/', type: 'doc' }
      ],
      maturityLevels: { junior: '能配置基础 WAF 规则', mid: '能调优 false positive 与 rate limit', senior: '能驱动组织级 WAF 战略与 bot 管控' }
    }
  },

  'cloud-ir-playbook': {
    name: 'Cloud Incident Response Playbook',
    nameZh: '云事件响应 Playbook',
    description: 'Author and execute cloud-specific incident response playbooks for common scenarios.',
    descriptionZh: '为云常见场景撰写并执行事件响应 Playbook。',
    tags: ['security', 'ir', 'playbook', 'cloud', 'incident'],
    category: 'security',
    input: { type: 'object', required: ['scenario'], properties: {
      scenario: { type: 'string', enum: ['credential-leak', 'crypto-mining', 'data-exfil', 's3-public', 'ransomware', 'container-escape'] },
      cloud: { type: 'string', enum: ['aws', 'azure', 'gcp'] }
    }},
    output: { type: 'object', properties: { playbook: { type: 'string' }, containActions: { type: 'array' }, evidenceList: { type: 'array' } } },
    errors: { ROLE_NOT_PROVISIONED: { code: 'IR_001', message: 'IR 专用 role 未预置', retryable: false } },
    learning: {
      summaryZh: 'Playbook 不是事后再写，是事前预演；事件发生那 15 分钟你不会再想着读手册。',
      keyPoints: ['contain / eradicate / recover 三段', 'IR role + readonly + forensics 预先建好', 'snapshot 优于 destroy（forensics）', '通讯通道与正常通道分离', '复盘做 blameless post-mortem'],
      bestPractices: ['每季度跑 tabletop drill', '关键 playbook 自动化（Lambda / Step Functions）', '把 timeline 自动归档', '与法务 / PR 提前定义触发条件'],
      antiPatterns: ['事件中匆忙建 IR role', '直接 terminate 实例丢失证据', '通过日常 IM 通讯泄漏给攻击者', '没有 post-mortem 重复踩坑'],
      resources: [
        { title: 'NIST SP 800-61', url: 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final', type: 'doc' },
        { title: 'AWS IR Guide', url: 'https://docs.aws.amazon.com/security-ir/latest/userguide/welcome.html', type: 'doc' },
        { title: 'SANS Incident Handler Handbook', url: 'https://www.sans.org/white-papers/33901/', type: 'doc' }
      ],
      maturityLevels: { junior: '能执行已有 playbook 步骤', mid: '能撰写场景级 playbook 并演练', senior: '能驱动组织级 IR 体系与跨部门协同' }
    }
  },

  'cloud-risk-management': {
    name: 'Cloud Risk Management',
    nameZh: '云风险管理',
    description: 'Identify, assess, treat and monitor cloud security risks using a structured framework.',
    descriptionZh: '基于结构化框架识别 / 评估 / 处置 / 监控云安全风险。',
    tags: ['security', 'risk', 'governance', 'cloud', 'compliance'],
    category: 'security',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { type: 'string' },
      framework: { type: 'string', enum: ['nist-rmf', 'iso-27005', 'fair', 'csa-ccm'] }
    }},
    output: { type: 'object', properties: { riskRegister: { type: 'array' }, treatments: { type: 'array' }, residualRisk: { type: 'object' } } },
    errors: { RISK_OWNER_MISSING: { code: 'CRM_001', message: '风险无 owner，无法处置', retryable: false } },
    learning: {
      summaryZh: '风险管理不是"识别一堆未知威胁"，是"用 likelihood × impact 把不确定性压缩为决策"。没有 owner 的风险等于没有。',
      keyPoints: ['risk = likelihood × impact', 'treatment 四选一（accept / mitigate / transfer / avoid）', 'residual risk 一定要 owner 签字', 'risk register 持续更新而非一次性', 'inherent vs residual 区别清楚'],
      bestPractices: ['用 FAIR 做量化（货币化）风险', 'CSA CCM 对齐云控制点', 'risk register 进 GRC 工具', '每季度复盘风险变化'],
      antiPatterns: ['风险无 owner 永远 high', 'mitigate 完不更新 residual', '只看 inherent risk 不看实际控制', 'risk register 静态化'],
      resources: [
        { title: 'NIST RMF', url: 'https://csrc.nist.gov/projects/risk-management', type: 'doc' },
        { title: 'CSA CCM', url: 'https://cloudsecurityalliance.org/research/cloud-controls-matrix/', type: 'doc' },
        { title: 'FAIR Institute', url: 'https://www.fairinstitute.org/', type: 'doc' }
      ],
      maturityLevels: { junior: '能维护风险登记册', mid: '能驱动 treatment 决策与 owner 落实', senior: '能驱动组织级风险治理与高管对齐' }
    }
  },

  'cross-account-security': {
    name: 'Cross-Account Security',
    nameZh: '跨账号安全',
    description: 'Design secure cross-account access and resource sharing using assume-role and SCP guardrails.',
    descriptionZh: '基于 assume-role 与 SCP 护栏设计安全的跨账号访问与资源共享。',
    tags: ['security', 'cross-account', 'iam', 'aws-organizations', 'scp'],
    category: 'security',
    input: { type: 'object', required: ['source', 'target'], properties: {
      source: { type: 'string' },
      target: { type: 'string' },
      pattern: { type: 'string', enum: ['assume-role', 'resource-policy', 'ram', 'lake-formation'] }
    }},
    output: { type: 'object', properties: { trustPolicy: { type: 'object' }, scpPolicy: { type: 'object' }, sharedResources: { type: 'array' } } },
    errors: { CONFUSED_DEPUTY: { code: 'CA_001', message: '存在 confused deputy 风险', retryable: false } },
    learning: {
      summaryZh: '多账号架构是云安全护栏的"基石"；跨账号设计的核心是 trust + condition + SCP 三层叠加，不能只靠 trust policy。',
      keyPoints: ['ExternalId 防 confused deputy', 'Source IP / VPC condition 进一步约束', 'SCP 是组织级"不可越过"护栏', 'AWS RAM > 资源策略复杂度低', '一切跨账号走 IaC 不手工'],
      bestPractices: ['per-tenant ExternalId 不复用', 'SCP 写"deny *:*" 例外白名单', 'cross-account log 集中到 security account', '定期审 trust policy 漂移'],
      antiPatterns: ['没有 ExternalId 的 trust policy', 'SCP 不写靠 IAM 做护栏', '资源策略 Principal *', '日志 / 监控数据散在各业务账号'],
      resources: [
        { title: 'AWS Cross-Account Best Practices', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', type: 'doc' },
        { title: 'AWS Confused Deputy', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html', type: 'doc' },
        { title: 'AWS Organizations SCP', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html', type: 'doc' }
      ],
      maturityLevels: { junior: '能配置基础 assume-role', mid: '能设计 SCP + trust 多层护栏', senior: '能驱动组织级 multi-account landing zone 战略' }
    }
  },

  'data-classification-dlp': {
    name: 'Data Classification & DLP',
    nameZh: '数据分类与 DLP',
    description: 'Classify data sensitivity and prevent leakage using DLP scanning, masking, and policy controls.',
    descriptionZh: '对数据敏感度进行分类，结合 DLP 扫描 / 脱敏 / 策略控制防止泄漏。',
    tags: ['security', 'data', 'dlp', 'classification', 'pii'],
    category: 'security',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { type: 'string' },
      classes: { type: 'array', items: { enum: ['public', 'internal', 'confidential', 'restricted'] } },
      tool: { type: 'string', enum: ['macie', 'gcp-dlp', 'purview', 'bigid'] }
    }},
    output: { type: 'object', properties: { classification: { type: 'object' }, leakRisks: { type: 'array' }, policies: { type: 'array' } } },
    errors: { LABEL_DRIFT: { code: 'DLP_001', message: '数据 label 与实际内容不一致', retryable: false } },
    learning: {
      summaryZh: '没有分类的 DLP 是无差别拦截，会被业务规避；先做 classification，再 DLP，才是可执行路径。',
      keyPoints: ['四级分类（public / internal / confidential / restricted）', 'auto-tag + manual review 结合', 'DLP 在通道（email / chat / upload）拦截', 'tokenization > masking', 'data lineage 配合分类'],
      bestPractices: ['Macie / DLP 自动扫描 + label', '高敏数据走专用 KMS', 'DLP rule 与分类绑定', '每年 review 分类标准'],
      antiPatterns: ['DLP 一刀切阻断引发业务绕道', '数据无分类直接上 DLP', '只扫 storage 不扫 channel', '分类标准长期不更新'],
      resources: [
        { title: 'AWS Macie', url: 'https://docs.aws.amazon.com/macie/', type: 'doc' },
        { title: 'GCP DLP', url: 'https://cloud.google.com/dlp/docs', type: 'doc' },
        { title: 'Microsoft Purview', url: 'https://learn.microsoft.com/en-us/purview/', type: 'doc' }
      ],
      maturityLevels: { junior: '能用工具做基础分类扫描', mid: '能落地 classification + DLP policy 闭环', senior: '能驱动组织级 data governance 战略' }
    }
  },

  'multi-cloud-security': {
    name: 'Multi-Cloud Security',
    nameZh: '多云安全',
    description: 'Design unified security posture across AWS / Azure / GCP avoiding vendor lock-in and gaps.',
    descriptionZh: '在 AWS / Azure / GCP 之间设计统一安全态势，避免锁定与盲区。',
    tags: ['security', 'multi-cloud', 'governance', 'posture', 'vendor-neutral'],
    category: 'security',
    input: { type: 'object', required: ['clouds'], properties: {
      clouds: { type: 'array', items: { enum: ['aws', 'azure', 'gcp', 'oci', 'aliyun'] } },
      domain: { type: 'string', enum: ['identity', 'network', 'data', 'workload'] }
    }},
    output: { type: 'object', properties: { controlMatrix: { type: 'object' }, gaps: { type: 'array' }, unifiedTooling: { type: 'array' } } },
    errors: { TOOL_FRAGMENTATION: { code: 'MC_001', message: '工具碎片化，控制点无法对齐', retryable: false } },
    learning: {
      summaryZh: '多云安全不是把单云方案叠三遍；要先选定 control framework（CSA / NIST），再选跨云工具填齐控制点。',
      keyPoints: ['CSA CCM / NIST CSF 做 control framework', '统一 IdP（SSO + SCIM）防身份分裂', 'CSPM / CNAPP 类工具替代各家原生', '日志统一到一个 SIEM', 'IaC 多云 abstraction（Terraform 模块化）'],
      bestPractices: ['先 control matrix 再选工具', '主云 + 次云模式优于平等多云', '认证 / 网络 / 数据三层各自统一', '事件响应 playbook 跨云一致'],
      antiPatterns: ['每朵云独立 SSO', '多 SIEM 数据分裂', '只用云原生工具被锁定', '没有统一 IaC 出现配置漂移'],
      resources: [
        { title: 'CSA Cloud Controls Matrix', url: 'https://cloudsecurityalliance.org/research/cloud-controls-matrix/', type: 'doc' },
        { title: 'NIST CSF', url: 'https://www.nist.gov/cyberframework', type: 'doc' },
        { title: 'Wiz / Orca / Prisma Cloud', url: 'https://www.wiz.io/academy', type: 'doc' }
      ],
      maturityLevels: { junior: '能用 CNAPP 工具看多云态势', mid: '能落地 control matrix + 统一 IdP', senior: '能驱动组织级多云治理战略' }
    }
  },

  'privacy-engineering': {
    name: 'Privacy Engineering',
    nameZh: '隐私工程',
    description: 'Embed privacy by design into systems: data minimization, consent, retention, and DSR fulfillment.',
    descriptionZh: '把"隐私 by design"嵌入系统：数据最小化 / 同意管理 / 留存 / DSR 履行。',
    tags: ['privacy', 'gdpr', 'engineering', 'consent', 'dsr'],
    category: 'security',
    input: { type: 'object', required: ['system'], properties: {
      system: { type: 'string' },
      jurisdictions: { type: 'array', items: { enum: ['gdpr', 'ccpa', 'pipl', 'lgpd'] } }
    }},
    output: { type: 'object', properties: { dataInventory: { type: 'array' }, consentFlow: { type: 'object' }, dsrRunbook: { type: 'string' } } },
    errors: { NO_LAWFUL_BASIS: { code: 'PE_001', message: '处理无合法依据', retryable: false } },
    learning: {
      summaryZh: '隐私不是合规部门的事，是工程默认实践。"data minimization + retention + DSR API"是隐私工程三件套。',
      keyPoints: ['lawful basis 先于 collection', 'data inventory + lineage', 'DSR（access / delete / export）走自动化', 'consent 是状态而非一次性', 'pseudonymization > anonymization 易实现'],
      bestPractices: ['每新事件先做 PIA / DPIA', 'retention 写进 schema 注释 + TTL', '把 DSR 做成内部 API 给客服调用', 'consent log 不可篡改'],
      antiPatterns: ['DSR 全靠人工 SQL', 'consent 状态散落多个系统', '"反正用得到" 收集后没人删', '把隐私当法务工作不写进 sprint'],
      resources: [
        { title: 'GDPR.eu', url: 'https://gdpr.eu/', type: 'doc' },
        { title: 'NIST Privacy Framework', url: 'https://www.nist.gov/privacy-framework', type: 'doc' },
        { title: 'Privacy by Design', url: 'https://www.ipc.on.ca/wp-content/uploads/Resources/7foundationalprinciples.pdf', type: 'doc' }
      ],
      maturityLevels: { junior: '能实现 consent 与 retention 控制', mid: '能搭 DSR 自动化 + data inventory', senior: '能驱动组织级 privacy by design 与 DPIA 文化' }
    }
  },

  'shared-responsibility-model': {
    name: 'Shared Responsibility Model',
    nameZh: '共担责任模型',
    description: 'Apply the cloud shared responsibility model to clearly partition security duties between provider and customer.',
    descriptionZh: '应用云共担责任模型，清晰划分云厂商与租户在不同层的安全责任。',
    tags: ['security', 'shared-responsibility', 'cloud', 'governance', 'iaas'],
    category: 'security',
    input: { type: 'object', required: ['service'], properties: {
      service: { type: 'string' },
      model: { type: 'string', enum: ['iaas', 'paas', 'saas'] }
    }},
    output: { type: 'object', properties: { customerDuties: { type: 'array' }, providerDuties: { type: 'array' }, gaps: { type: 'array' } } },
    errors: { ASSUMPTION_GAP: { code: 'SRM_001', message: '甲乙双方对责任边界存在假设差', retryable: false } },
    learning: {
      summaryZh: '出事时永远不是"云厂商的锅"——配置 / 数据 / 身份这三件事永远在你这边；把责任清单贴到入职 onboarding 文档里。',
      keyPoints: ['IaaS / PaaS / SaaS 责任边界递进', '数据与身份永远是租户责任', '物理安全永远是 provider', 'patch 责任随服务模式变化', 'AWS / Azure / GCP 表述略有差异'],
      bestPractices: ['每服务做 responsibility map', 'onboarding 必看共担责任图', '事故复盘明确归属', '审计前先核对 provider attestation'],
      antiPatterns: ['以为 SaaS 就不需要做 IAM', 'EC2 把 OS patch 当 AWS 责任', '数据丢了找云厂商', 'serverless 不再做 input validation'],
      resources: [
        { title: 'AWS Shared Responsibility', url: 'https://aws.amazon.com/compliance/shared-responsibility-model/', type: 'doc' },
        { title: 'Azure Shared Responsibility', url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility', type: 'doc' },
        { title: 'GCP Shared Responsibility', url: 'https://cloud.google.com/architecture/framework/security/shared-responsibility-shared-fate', type: 'doc' }
      ],
      maturityLevels: { junior: '能解释 IaaS / PaaS / SaaS 边界', mid: '能落地 responsibility map 到团队', senior: '能驱动组织级共担责任治理与跨云对齐' }
    }
  },

  'storage-security': {
    name: 'Storage Security',
    nameZh: '存储安全',
    description: 'Secure cloud storage (S3/Blob/GCS) with encryption, public access blocks, lifecycle and audit.',
    descriptionZh: '通过加密 / 公开访问阻断 / 生命周期 / 审计加固云存储（S3 / Blob / GCS）。',
    tags: ['security', 'storage', 's3', 'encryption', 'lifecycle'],
    category: 'security',
    input: { type: 'object', required: ['bucket'], properties: {
      bucket: { type: 'string' },
      provider: { type: 'string', enum: ['s3', 'gcs', 'azure-blob', 'oss'] }
    }},
    output: { type: 'object', properties: { findings: { type: 'array' }, encryptionState: { type: 'string' }, publicAccess: { type: 'boolean' }, lifecyclePolicy: { type: 'object' } } },
    errors: { PUBLIC_BUCKET: { code: 'ST_001', message: '存储桶配置为公开访问', retryable: false } },
    learning: {
      summaryZh: '90% 云数据泄漏的根因是 storage 配置错误，不是 0day。把"public block + encryption + lifecycle + access log"四件事做了能拦下大多数。',
      keyPoints: ['Block Public Access 账号级开启', 'SSE-KMS 优于 SSE-S3', 'pre-signed URL 必须有 TTL', 'lifecycle 自动迁移冷数据 / 删除', 'access log + Athena 做事后审计'],
      bestPractices: ['IaC 默认所有 bucket 私有', 'CSPM 持续扫描 public bucket', 'KMS key 与 bucket 一一对应', 'object lock 防勒索篡改'],
      antiPatterns: ['"暂时" public 后忘了关', 'pre-signed URL 给 7 天 TTL', '不开 access log 出事查不到', 'lifecycle 不配置成本失控'],
      resources: [
        { title: 'AWS S3 Security Best Practices', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html', type: 'doc' },
        { title: 'GCS Security', url: 'https://cloud.google.com/storage/docs/best-practices', type: 'doc' },
        { title: 'Azure Blob Security', url: 'https://learn.microsoft.com/en-us/azure/storage/blobs/security-recommendations', type: 'doc' }
      ],
      maturityLevels: { junior: '能配置加密与 public block', mid: '能落地 IaC + CSPM + lifecycle', senior: '能驱动组织级存储安全 baseline 与勒索防护' }
    }
  },

  'vpc-security-groups': {
    name: 'VPC & Security Groups',
    nameZh: 'VPC 与安全组',
    description: 'Design VPC topology and security group rules to enforce network segmentation and least-trust.',
    descriptionZh: '设计 VPC 拓扑与安全组规则，强制网络分段与最小信任。',
    tags: ['security', 'vpc', 'security-group', 'network', 'segmentation'],
    category: 'security',
    input: { type: 'object', required: ['vpc'], properties: {
      vpc: { type: 'string' },
      tier: { type: 'string', enum: ['public', 'app', 'data'] }
    }},
    output: { type: 'object', properties: { subnetMap: { type: 'object' }, sgRules: { type: 'array' }, nacl: { type: 'array' } } },
    errors: { OPEN_TO_WORLD: { code: 'VPC_001', message: '安全组对 0.0.0.0/0 开放高危端口', retryable: false } },
    learning: {
      summaryZh: '安全组是 stateful，NACL 是 stateless，分清楚再设计；不要试图用安全组实现复杂网络策略，那是 NetworkPolicy / firewall 的活。',
      keyPoints: ['SG = stateful，NACL = stateless', 'public / app / data 三层分段', 'SG reference SG > IP allow list', '默认 deny + 最小放行', '跨 VPC 走 PrivateLink / Transit Gateway'],
      bestPractices: ['SG 名称约定 service-tier-direction', 'IaC 管理 SG 不手工改', '定期审 unused SG 删除', '高危端口（22/3389）走 bastion / SSM'],
      antiPatterns: ['0.0.0.0/0 + 22/3389 直暴露', 'app tier 直连 internet', '一个 SG 复用多服务', 'NACL 当 stateful 用配错'],
      resources: [
        { title: 'AWS VPC Best Practices', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-best-practices.html', type: 'doc' },
        { title: 'AWS Security Groups vs NACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html', type: 'doc' },
        { title: 'AWS Network Firewall', url: 'https://docs.aws.amazon.com/network-firewall/', type: 'doc' }
      ],
      maturityLevels: { junior: '能写基础 SG / NACL', mid: '能设计三层分段 + IaC 管理', senior: '能驱动组织级 landing zone 网络架构' }
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

#!/usr/bin/env node
/**
 * 第七轮 batch 6：12 个云安全 / 容器安全 / IAM 高密度领域 placeholder 全量 enrich
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'atomic-skills');

const PATCHES = {
  'cspm-tools': {
    name: 'CSPM Tools',
    nameZh: '云安全态势管理工具',
    description: 'Operate Cloud Security Posture Management tools to continuously detect and remediate cloud misconfiguration.',
    descriptionZh: '使用 CSPM 工具持续检测与修复云资源配置缺陷。',
    tags: ['cloud-security', 'cspm', 'posture', 'misconfig', 'compliance'],
    category: 'security',
    input: { type: 'object', required: ['cloud'], properties: {
      cloud: { type: 'string', enum: ['aws', 'azure', 'gcp', 'multi'] },
      tool: { type: 'string', enum: ['prisma-cloud', 'wiz', 'orca', 'aws-config', 'cloud-custodian'] },
      framework: { type: 'string', enum: ['cis', 'nist', 'soc2', 'pci'] }
    }},
    output: { type: 'object', properties: { findings: { type: 'array' }, severityCounts: { type: 'object' }, remediationPlan: { type: 'string' } } },
    errors: {
      CONNECTOR_DENIED: { code: 'CSPM_001', message: '云账号 Reader 权限不足', retryable: false },
      RATE_LIMITED: { code: 'CSPM_002', message: '云 API 限流', retryable: true }
    },
    learning: {
      summaryZh: 'CSPM 不是又一个扫描器，而是把云配置基线变成持续审计；选型看的是「能不能落地修复」而非告警数量。',
      keyPoints: ['agentless 优先，agent 仅用于 runtime', 'finding 必须打 owner 标签否则没人修', '区分 misconfig vs vulnerability', '与 IaC（Terraform / CFN）回写形成闭环', '基线对齐 CIS Benchmarks'],
      bestPractices: ['每条 finding 自动开 ticket 到 owner team', '高危按 SLA 自动升级', '把 P1 finding 接到 release gate', '定期做"漏洞老化"分析'],
      antiPatterns: ['告警一万条，修复零条', 'CSPM 只看 dashboard 不接 ticket 流', '用 CSPM 替代 IaC 静态扫描'],
      resources: [
        { title: 'Wiz Cloud Security Atlas', url: 'https://www.wiz.io/academy', type: 'doc' },
        { title: 'CIS Benchmarks', url: 'https://www.cisecurity.org/cis-benchmarks', type: 'doc' },
        { title: 'Cloud Custodian', url: 'https://cloudcustodian.io/', type: 'doc' }
      ],
      maturityLevels: { junior: '能跑 CSPM 扫描看 dashboard', mid: '能联通 ticketing + IaC 修复闭环', senior: '能驱动组织级云安全基线治理与 SLA 体系' }
    }
  },

  'iac-security-scanning': {
    name: 'IaC Security Scanning',
    nameZh: 'IaC 安全扫描',
    description: 'Statically scan Terraform / CloudFormation / Kubernetes manifests for security misconfiguration before apply.',
    descriptionZh: '在 apply 前静态扫描 Terraform / CFN / K8s manifest 的安全配置缺陷。',
    tags: ['iac', 'terraform', 'security-scanning', 'shift-left', 'devsecops'],
    category: 'security',
    input: { type: 'object', required: ['path'], properties: {
      path: { type: 'string' },
      tool: { type: 'string', enum: ['checkov', 'tfsec', 'kics', 'trivy-config', 'snyk-iac'] },
      severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] }
    }},
    output: { type: 'object', properties: { violations: { type: 'array' }, sarif: { type: 'string' }, fixSuggestions: { type: 'array' } } },
    errors: {
      PARSE_FAILED: { code: 'IAC_001', message: 'IaC 文件无法解析', retryable: false },
      POLICY_LOAD_FAILED: { code: 'IAC_002', message: '自定义策略加载失败', retryable: false }
    },
    learning: {
      summaryZh: 'IaC 扫描是 shift-left 的最高 ROI 节点：在 PR 阶段拦下 90% 云配置漏洞，比 runtime 修复便宜 100 倍。',
      keyPoints: ['PR 阶段扫描，failed → 阻塞合并', '区分 advisory（提示）vs blocking（阻塞）', '自定义策略覆盖业务约束', 'SARIF 格式上 GitHub Code Scanning', '与 OPA / Rego 共用策略'],
      bestPractices: ['Checkov + tfsec 组合提高召回', '基线规则按 severity 分级渐进推进', '每条违规附 remediation snippet', '把 baseline 文件入库管理 false positive'],
      antiPatterns: ['只扫 main 分支不扫 PR', 'severity 阈值过宽，开发被告警淹没', '扫描结果不接 review，永远 advisory'],
      resources: [
        { title: 'Checkov', url: 'https://www.checkov.io/', type: 'doc' },
        { title: 'tfsec', url: 'https://aquasecurity.github.io/tfsec/', type: 'doc' },
        { title: 'KICS', url: 'https://docs.kics.io/', type: 'doc' }
      ],
      maturityLevels: { junior: '能在 CI 跑 Checkov / tfsec', mid: '能写自定义策略并控制 false positive', senior: '能驱动组织级 IaC 安全 baseline 与 OPA 治理' }
    }
  },

  'container-runtime-security': {
    name: 'Container Runtime Security',
    nameZh: '容器运行时安全',
    description: 'Detect and respond to runtime threats inside containers using eBPF / syscall monitoring tools.',
    descriptionZh: '基于 eBPF / syscall 监控容器运行时威胁并响应。',
    tags: ['container', 'runtime-security', 'ebpf', 'falco', 'k8s'],
    category: 'security',
    input: { type: 'object', required: ['cluster'], properties: {
      cluster: { type: 'string' },
      tool: { type: 'string', enum: ['falco', 'tetragon', 'sysdig', 'aqua'] },
      ruleset: { type: 'string' }
    }},
    output: { type: 'object', properties: { events: { type: 'array' }, alerts: { type: 'array' }, response: { type: 'object' } } },
    errors: {
      KERNEL_INCOMPATIBLE: { code: 'RT_001', message: '内核不支持 eBPF / Falco 模块', retryable: false },
      NOISY_RULESET: { code: 'RT_002', message: '规则告警噪音过高', retryable: false }
    },
    learning: {
      summaryZh: 'Runtime 是最后一道防线；好的 runtime 安全工具不是看告警数量，而是看"能区分异常 vs 业务正常"。',
      keyPoints: ['eBPF 优于内核模块（无停机）', '规则按 syscall / file / network / process 维度分层', 'detect → alert → block 渐进推进', 'profile-based detection > 静态规则', '与 K8s audit log 关联'],
      bestPractices: ['先观察 2 周再上 block', '规则与命名空间 / workload 解耦', '高危事件直推 SOC / on-call', 'Falco 规则进 Git 做版本管理'],
      antiPatterns: ['默认规则一上即 block', '不区分 dev / prod 环境', '告警过载导致疲劳'],
      resources: [
        { title: 'Falco', url: 'https://falco.org/docs/', type: 'doc' },
        { title: 'Tetragon', url: 'https://tetragon.io/docs/', type: 'doc' },
        { title: 'CNCF Cloud Native Security Whitepaper', url: 'https://github.com/cncf/tag-security', type: 'doc' }
      ],
      maturityLevels: { junior: '能部署 Falco 看告警', mid: '能写自定义规则与降噪', senior: '能搭组织级 runtime detection 体系并对接 SOC' }
    }
  },

  'k8s-rbac-security': {
    name: 'Kubernetes RBAC Security',
    nameZh: 'K8s RBAC 安全',
    description: 'Design and audit Kubernetes RBAC policies to enforce least privilege.',
    descriptionZh: '设计与审计 K8s RBAC 策略，强制最小权限。',
    tags: ['kubernetes', 'rbac', 'least-privilege', 'authorization', 'security'],
    category: 'security',
    input: { type: 'object', required: ['cluster'], properties: {
      cluster: { type: 'string' },
      namespace: { type: 'string' },
      auditMode: { type: 'string', enum: ['static', 'live'] }
    }},
    output: { type: 'object', properties: { roles: { type: 'array' }, bindings: { type: 'array' }, overprivileged: { type: 'array' }, recommendations: { type: 'array' } } },
    errors: {
      AUDIT_LOG_DISABLED: { code: 'RBAC_001', message: 'Audit log 未开启，无法做 live 审计', retryable: false }
    },
    learning: {
      summaryZh: 'K8s RBAC 写起来容易，写对很难；80% 集群存在 cluster-admin 滥用，最小权限要靠工具持续审计而非人脑。',
      keyPoints: ['Role vs ClusterRole 默认选 Role', '聚合 ClusterRole 用于复用', 'wildcard verbs / resources 是反模式', 'ServiceAccount 一对一绑定 Role', '审计要看 audit log + RBAC 引用图'],
      bestPractices: ['用 audit2rbac 从日志生成最小 RBAC', 'rakkess / kubectl-who-can 做 RBAC 可视化', '禁用默认 ServiceAccount auto-mount', 'PR 模板要求列出新增权限'],
      antiPatterns: ['给应用 cluster-admin 图省事', '"verbs: [*]" 出现在生产', '一个 SA 多 namespace 复用', 'RoleBinding 漂移与代码不一致'],
      resources: [
        { title: 'K8s RBAC docs', url: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/', type: 'doc' },
        { title: 'audit2rbac', url: 'https://github.com/liggitt/audit2rbac', type: 'doc' },
        { title: 'rakkess', url: 'https://github.com/corneliusweig/rakkess', type: 'doc' }
      ],
      maturityLevels: { junior: '能写基础 Role / RoleBinding', mid: '能审计与收敛过宽权限', senior: '能驱动 RBAC 治理与最小权限文化' }
    }
  },

  'k8s-security': {
    name: 'Kubernetes Security',
    nameZh: 'K8s 集群安全',
    description: 'End-to-end Kubernetes cluster hardening: control plane, network, workload, and supply chain.',
    descriptionZh: 'K8s 集群端到端加固：控制面 / 网络 / 工作负载 / 供应链。',
    tags: ['kubernetes', 'security', 'hardening', 'network-policy', 'pss'],
    category: 'security',
    input: { type: 'object', required: ['cluster'], properties: {
      cluster: { type: 'string' },
      profile: { type: 'string', enum: ['baseline', 'restricted'] }
    }},
    output: { type: 'object', properties: { findings: { type: 'array' }, hardeningChecklist: { type: 'array' }, networkPolicies: { type: 'array' } } },
    errors: {
      KUBE_BENCH_FAILED: { code: 'K8S_001', message: 'kube-bench 执行失败', retryable: true }
    },
    learning: {
      summaryZh: 'K8s 安全是分层加固：control plane / node / network / workload / supply chain 每一层都有最小动作集，缺一环都会被打穿。',
      keyPoints: ['Pod Security Standards（baseline / restricted）替代 PSP', 'NetworkPolicy 默认 deny-all', 'kube-bench 跑 CIS Benchmark', 'admission control（OPA / Kyverno）拦截违规', '镜像签名（Cosign）+ admission 验证'],
      bestPractices: ['namespace 级 PSS = restricted', 'CNI 选支持 NetworkPolicy 的（Calico / Cilium）', '关闭 anonymous-auth、自动挂载 SA', '开启 audit log 并集中存储'],
      antiPatterns: ['namespace 不分级，所有 workload 平铺', 'NetworkPolicy 只在生产开', 'control plane 不打补丁', '镜像 latest tag 上生产'],
      resources: [
        { title: 'Pod Security Standards', url: 'https://kubernetes.io/docs/concepts/security/pod-security-standards/', type: 'doc' },
        { title: 'kube-bench', url: 'https://github.com/aquasecurity/kube-bench', type: 'doc' },
        { title: 'Kyverno', url: 'https://kyverno.io/', type: 'doc' }
      ],
      maturityLevels: { junior: '能跑 kube-bench 与 PSS', mid: '能落地 NetworkPolicy + admission 治理', senior: '能驱动组织级 K8s 安全 baseline 与供应链安全' }
    }
  },

  'vulnerability-assessment': {
    name: 'Vulnerability Assessment',
    nameZh: '漏洞评估',
    description: 'Scan, triage, and prioritize vulnerabilities across code, dependencies, containers and infrastructure.',
    descriptionZh: '对代码 / 依赖 / 容器 / 基础设施进行漏洞扫描、分诊与优先级评估。',
    tags: ['security', 'vulnerability', 'cve', 'sca', 'sbom'],
    category: 'security',
    input: { type: 'object', required: ['target'], properties: {
      target: { type: 'string' },
      scanType: { type: 'string', enum: ['sast', 'sca', 'container', 'iac', 'dast'] },
      severityThreshold: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] }
    }},
    output: { type: 'object', properties: { vulnerabilities: { type: 'array' }, sbom: { type: 'object' }, riskScore: { type: 'number' }, prioritization: { type: 'array' } } },
    errors: {
      NO_FIX_AVAILABLE: { code: 'VA_001', message: '该 CVE 无可用修复', retryable: false },
      SCAN_TIMEOUT: { code: 'VA_002', message: '扫描超时', retryable: true }
    },
    learning: {
      summaryZh: 'CVE 数量不等于风险；漏洞评估的真正价值是 reachability + exploitability + business impact 三维分诊。',
      keyPoints: ['EPSS / KEV 作为 CVSS 补充', '区分可达 vs 不可达漏洞（reachability）', 'SBOM 是分诊基础', '关注 patch latency 而非 CVE 总数', '与 ticketing + SLA 联动'],
      bestPractices: ['Trivy / Grype 做容器扫描', 'Dependabot / Renovate 自动 PR', 'KEV 名单内 CVE 进 release gate', '把 SBOM 入库可追溯'],
      antiPatterns: ['只看 CVSS 不看 reachability', '所有 CVE 一刀切 SLA', '不留 SBOM 出事查不到', '扫描频率 1 个月，patch latency 2 个月'],
      resources: [
        { title: 'CISA KEV Catalog', url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog', type: 'doc' },
        { title: 'EPSS', url: 'https://www.first.org/epss/', type: 'doc' },
        { title: 'Trivy', url: 'https://aquasecurity.github.io/trivy/', type: 'doc' }
      ],
      maturityLevels: { junior: '能跑 SCA / 容器扫描', mid: '能做 reachability 分诊与 SLA 推动', senior: '能搭组织级漏洞管理体系并对齐合规' }
    }
  },

  'penetration-testing': {
    name: 'Penetration Testing',
    nameZh: '渗透测试',
    description: 'Plan and execute penetration testing engagements covering web, API, cloud and internal networks.',
    descriptionZh: '规划与执行渗透测试项目，覆盖 Web / API / 云 / 内网。',
    tags: ['security', 'pentest', 'red-team', 'offensive', 'audit'],
    category: 'security',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { type: 'string' },
      style: { type: 'string', enum: ['black-box', 'grey-box', 'white-box'] },
      frameworks: { type: 'array', items: { enum: ['owasp', 'ptes', 'mitre-attack'] } }
    }},
    output: { type: 'object', properties: { findings: { type: 'array' }, severity: { type: 'object' }, exploitChain: { type: 'array' }, report: { type: 'string' } } },
    errors: {
      OUT_OF_SCOPE: { code: 'PT_001', message: '目标超出授权范围', retryable: false },
      LEGAL_BLOCK: { code: 'PT_002', message: '缺少书面授权', retryable: false }
    },
    learning: {
      summaryZh: '渗透不是炫技，是给防守端找具体可修复的漏洞链；没有 ROE（rules of engagement）就不要动手。',
      keyPoints: ['ROE / 授权书是底线', '区分 vuln scan vs pentest vs red team', 'PTES 七阶段 / OWASP Testing Guide', '攻击链 > 单点漏洞', '报告必须给可执行修复建议'],
      bestPractices: ['Burp / Caido + 自动化扫描组合', '每发现都要 PoC + repro 步骤', '与 blue team 做 purple teaming 复盘', '报告分管理摘要 + 技术明细两层'],
      antiPatterns: ['没授权先扫', '只交一份扫描器导出报告', '只列单点漏洞不组装链', '报告写完就走，不复测'],
      resources: [
        { title: 'OWASP Testing Guide', url: 'https://owasp.org/www-project-web-security-testing-guide/', type: 'doc' },
        { title: 'PTES', url: 'http://www.pentest-standard.org/', type: 'doc' },
        { title: 'MITRE ATT&CK', url: 'https://attack.mitre.org/', type: 'doc' }
      ],
      maturityLevels: { junior: '能用 Burp / Nmap 做基础测试', mid: '能独立完成 web / API 渗透并产出报告', senior: '能驱动 red / purple team 演练并对齐 ATT&CK' }
    }
  },

  'privileged-access-management': {
    name: 'Privileged Access Management',
    nameZh: '特权访问管理',
    description: 'Design and operate PAM solutions for privileged accounts, secrets and just-in-time access.',
    descriptionZh: '为特权账号 / Secret / JIT 访问设计与运营 PAM 体系。',
    tags: ['security', 'pam', 'privileged', 'jit', 'identity'],
    category: 'security',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { type: 'string' },
      mode: { type: 'string', enum: ['vault', 'jit', 'session-recording'] }
    }},
    output: { type: 'object', properties: { policy: { type: 'object' }, sessionLogs: { type: 'array' }, accessRequests: { type: 'array' } } },
    errors: {
      EMERGENCY_ACCESS_USED: { code: 'PAM_001', message: '触发 break-glass 账户使用', retryable: false }
    },
    learning: {
      summaryZh: 'PAM 的核心不是把密码锁起来，而是把"特权"从常驻变成临时（JIT），从口令变成会话审计。',
      keyPoints: ['永久 root → JIT root', '所有特权会话录像与审计', 'break-glass 账户必须监控', 'Vault / CyberArk / Teleport 选型', 'workflow approval（双人原则）'],
      bestPractices: ['SSH 用 short-lived cert 替代 key', '生产数据库走 bastion + session record', 'JIT 申请与 ticketing 联动', '定期回看 break-glass 审计'],
      antiPatterns: ['Excel 管理特权口令', 'shared root 账号没人负责', 'session 录像但没人看', 'JIT 永久授权变常驻'],
      resources: [
        { title: 'HashiCorp Vault', url: 'https://developer.hashicorp.com/vault', type: 'doc' },
        { title: 'Teleport', url: 'https://goteleport.com/docs/', type: 'doc' },
        { title: 'NIST PAM', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63-3.pdf', type: 'doc' }
      ],
      maturityLevels: { junior: '能用 Vault 管理 secret', mid: '能落地 JIT + session record 流程', senior: '能驱动组织级 PAM 与零信任体系' }
    }
  },

  'least-privilege-iam': {
    name: 'Least Privilege IAM',
    nameZh: '最小权限 IAM',
    description: 'Design IAM policies enforcing least privilege using policy-as-code and continuous reviews.',
    descriptionZh: '通过 policy-as-code 与持续审计落地最小权限 IAM。',
    tags: ['iam', 'least-privilege', 'policy-as-code', 'aws', 'gcp'],
    category: 'security',
    input: { type: 'object', required: ['identity'], properties: {
      identity: { type: 'string' },
      cloud: { type: 'string', enum: ['aws', 'azure', 'gcp'] },
      observationDays: { type: 'number', default: 30 }
    }},
    output: { type: 'object', properties: { recommendedPolicy: { type: 'object' }, removedPermissions: { type: 'array' }, riskBefore: { type: 'number' }, riskAfter: { type: 'number' } } },
    errors: {
      INSUFFICIENT_OBSERVATION: { code: 'LP_001', message: '观察期不足，权限收敛不安全', retryable: true }
    },
    learning: {
      summaryZh: '最小权限不是一次性收敛，而是观察 → 收敛 → 再观察的循环；过度收敛会引发 prod 故障，过度宽松会引发数据泄漏。',
      keyPoints: ['先 audit 30 天再收敛', 'IAM Access Analyzer / GCP Recommender 自动建议', 'permission boundary 限制 escalation', 'session policy 做即时收敛', '区分 human / service identity'],
      bestPractices: ['policy-as-code（Terraform + OPA）', 'service control policy 做账号级护栏', 'cross-account 用 role 不用 long-lived key', '权限变更走 PR review'],
      antiPatterns: ['"*:*" 临时加上忘了删', '一个 role 多 service 复用', '不用 boundary，开发可自己提权', 'service account key 长期常驻'],
      resources: [
        { title: 'AWS IAM Access Analyzer', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html', type: 'doc' },
        { title: 'GCP IAM Recommender', url: 'https://cloud.google.com/iam/docs/recommender-overview', type: 'doc' },
        { title: 'Cloud Security Alliance IAM', url: 'https://cloudsecurityalliance.org/research/topics/identity-access-management', type: 'doc' }
      ],
      maturityLevels: { junior: '能写基础 IAM policy', mid: '能用 Access Analyzer 收敛权限', senior: '能驱动组织级 least-privilege 与 SCP 治理' }
    }
  },

  'identity-federation': {
    name: 'Identity Federation',
    nameZh: '身份联邦',
    description: 'Implement identity federation across IdPs, clouds and SaaS using SAML / OIDC / SCIM.',
    descriptionZh: '通过 SAML / OIDC / SCIM 在 IdP / 云 / SaaS 之间实现身份联邦。',
    tags: ['identity', 'federation', 'saml', 'oidc', 'sso'],
    category: 'security',
    input: { type: 'object', required: ['idp', 'sp'], properties: {
      idp: { type: 'string' },
      sp: { type: 'string' },
      protocol: { type: 'string', enum: ['saml', 'oidc', 'scim'] }
    }},
    output: { type: 'object', properties: { trustConfig: { type: 'object' }, attributeMapping: { type: 'object' }, testResult: { type: 'object' } } },
    errors: {
      CLOCK_SKEW: { code: 'FED_001', message: 'IdP 与 SP 时钟漂移导致断言失败', retryable: true },
      ATTR_MISMATCH: { code: 'FED_002', message: '属性映射不匹配', retryable: false }
    },
    learning: {
      summaryZh: '身份联邦的复杂度不在协议，而在 attribute mapping + lifecycle；SCIM 同步比 SAML 更容易出事。',
      keyPoints: ['OIDC > SAML（新系统优先）', 'SCIM 做 lifecycle 自动化', 'NameID 选 immutable 字段', 'Just-in-Time provisioning vs SCIM 推送', 'IdP 是单点失败点要 HA'],
      bestPractices: ['certificate rotation 自动化', '断言签名 + 加密双开', 'group → role 映射可审计', 'IdP 故障要有备用本地账号 break-glass'],
      antiPatterns: ['NameID 用 email 后续改邮箱炸', '不做 SCIM 离职账号长期残留', '一个 IdP cert 永不轮换', 'SP-initiated 与 IdP-initiated 混用没 RelayState'],
      resources: [
        { title: 'OIDC Spec', url: 'https://openid.net/specs/openid-connect-core-1_0.html', type: 'spec' },
        { title: 'SAML Bindings', url: 'https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf', type: 'spec' },
        { title: 'SCIM 2.0', url: 'https://datatracker.ietf.org/doc/html/rfc7643', type: 'spec' }
      ],
      maturityLevels: { junior: '能配置一个 SAML / OIDC SP', mid: '能落地 SCIM lifecycle + attribute mapping', senior: '能驱动组织级 IdP 战略与 zero-trust 联邦' }
    }
  },

  'key-management': {
    name: 'Key Management',
    nameZh: '密钥管理',
    description: 'Design and operate cryptographic key lifecycle using KMS / HSM with rotation, revocation and audit.',
    descriptionZh: '基于 KMS / HSM 设计并运营密钥全生命周期，含轮换 / 吊销 / 审计。',
    tags: ['security', 'kms', 'hsm', 'encryption', 'key-rotation'],
    category: 'security',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { type: 'string' },
      provider: { type: 'string', enum: ['aws-kms', 'gcp-kms', 'azure-keyvault', 'hashicorp-vault', 'hsm'] },
      rotationDays: { type: 'number', default: 90 }
    }},
    output: { type: 'object', properties: { keyInventory: { type: 'array' }, rotationPlan: { type: 'object' }, auditLog: { type: 'array' } } },
    errors: {
      KEY_LOST: { code: 'KM_001', message: '密钥丢失且无 backup', retryable: false },
      ROTATION_FAILED: { code: 'KM_002', message: '密钥轮换失败', retryable: true }
    },
    learning: {
      summaryZh: '密钥管理的灾难只有两种：丢了和泄漏了；KMS 不是用来"存"密钥，是用来"使用"密钥而不暴露明文。',
      keyPoints: ['envelope encryption（DEK + KEK）', 'CMK 永远不出 KMS', '轮换不等于重新加密历史数据', 'BYOK / HYOK 适用合规场景', 'audit log 必须不可删除'],
      bestPractices: ['rotation 自动化与 alerting', 'IAM policy 限定 kms:Decrypt 范围', '使用 grant 而非 share key', '定期跑 rotate + restore drill'],
      antiPatterns: ['密钥落 git / env 文件', '一个 CMK 多业务复用', '从不 rotate', '没 backup 直接 disable key'],
      resources: [
        { title: 'AWS KMS Best Practices', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html', type: 'doc' },
        { title: 'NIST SP 800-57', url: 'https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final', type: 'doc' },
        { title: 'HashiCorp Vault Transit', url: 'https://developer.hashicorp.com/vault/docs/secrets/transit', type: 'doc' }
      ],
      maturityLevels: { junior: '能用 KMS 加解密数据', mid: '能落地 envelope + rotation + audit', senior: '能驱动组织级密钥治理与合规对齐' }
    }
  },

  'secret-detection': {
    name: 'Secret Detection',
    nameZh: '密钥泄漏检测',
    description: 'Detect and remediate exposed secrets in code, git history, logs and CI artifacts.',
    descriptionZh: '在代码 / git 历史 / 日志 / CI 产物中检测并治理泄漏密钥。',
    tags: ['security', 'secrets', 'detection', 'pre-commit', 'devsecops'],
    category: 'security',
    input: { type: 'object', required: ['repo'], properties: {
      repo: { type: 'string' },
      tool: { type: 'string', enum: ['gitleaks', 'trufflehog', 'detect-secrets', 'github-secret-scan'] },
      scanHistory: { type: 'boolean', default: true }
    }},
    output: { type: 'object', properties: { findings: { type: 'array' }, falsePositives: { type: 'array' }, remediation: { type: 'array' } } },
    errors: {
      SECRET_STILL_VALID: { code: 'SEC_001', message: '检出 secret 仍在生效，需立即吊销', retryable: false }
    },
    learning: {
      summaryZh: '检测到 secret 不是任务的终点，是起点；rotate + audit 才是真正的修复。删 commit 不能挽回已泄漏。',
      keyPoints: ['pre-commit + CI + history 三层扫描', 'rotate > rewrite history', 'allowlist 必须有 expiry 注释', '区分高熵 false positive 与真 secret', '与 IdP / KMS 联动一键吊销'],
      bestPractices: ['gitleaks pre-commit hook 默认开', 'GitHub Push Protection 一定开', 'detect 后立即 rotate + audit upstream', '把 finding 接 ticket + SLA'],
      antiPatterns: ['只删 commit 不 rotate', '把 secret rewrite history 当修复', 'allowlist 永久放行', '只扫 main 不扫 feature 分支'],
      resources: [
        { title: 'gitleaks', url: 'https://github.com/gitleaks/gitleaks', type: 'doc' },
        { title: 'TruffleHog', url: 'https://github.com/trufflesecurity/trufflehog', type: 'doc' },
        { title: 'GitHub Push Protection', url: 'https://docs.github.com/en/code-security/secret-scanning/push-protection-for-repositories-and-organizations', type: 'doc' }
      ],
      maturityLevels: { junior: '能跑 gitleaks 并修复单条', mid: '能搭三层扫描 + rotate workflow', senior: '能驱动组织级 secret 治理与零容忍文化' }
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

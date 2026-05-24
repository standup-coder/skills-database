#!/usr/bin/env node
/**
 * 第六轮 batch 4：12 个 P1 领域 0 引用 placeholder 全量 enrich
 * 覆盖：安全 / 容器 / 云 / 监控 / 数据 / 产品
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'atomic-skills');

const PATCHES = {
  'authentication': {
    name: 'Authentication',
    nameZh: '身份认证',
    description: 'Implement authentication flows covering password, OAuth2/OIDC, JWT, session, and multi-factor scenarios.',
    descriptionZh: '实现身份认证流程，覆盖密码、OAuth2/OIDC、JWT、Session 与多因子等场景。',
    tags: ['security', 'authentication', 'oauth', 'jwt', 'identity'],
    category: 'security',
    input: { type: 'object', required: ['method'], properties: {
      method: { enum: ['password', 'oauth2', 'oidc', 'magic-link', 'passkey', 'saml'] },
      mfaRequired: { type: 'boolean', default: false },
      sessionType: { enum: ['cookie', 'jwt', 'opaque-token'], default: 'cookie' }
    }},
    output: { type: 'object', properties: { tokens: { type: 'object' }, userId: { type: 'string' }, expiresAt: { type: 'string' } } },
    errors: {
      INVALID_CREDENTIAL: { code: 'AUTH_001', message: '凭据无效或过期', retryable: false },
      MFA_REQUIRED: { code: 'AUTH_002', message: '需进行多因子验证', retryable: true },
      ACCOUNT_LOCKED: { code: 'AUTH_003', message: '账户已被锁定', retryable: false }
    },
    learning: {
      summaryZh: 'Authentication 是安全的第一道闸：自己造比用 IdP 风险高十倍，能委托就别自研。',
      keyPoints: ['密码哈希用 Argon2id / bcrypt，禁用 MD5/SHA1', 'JWT 慎用：默认过期 ≤ 15min + refresh token 轮换', 'OIDC > OAuth2，标准化 id_token 验证', 'passkey / WebAuthn 是钓鱼免疫的未来', 'session 存储优先选 server-side（Redis）'],
      bestPractices: ['登录失败次数限速 + 验证码 + 账户锁定', '凭据传输强制 HTTPS + Secure / HttpOnly / SameSite cookie', '集成 IdP（Auth0 / Clerk / Cognito）替代自研', '审计登录、登出、密码重置等关键事件'],
      antiPatterns: ['明文 / 可逆加密保存密码', 'JWT 写敏感信息且永不过期', '同时支持太多第三方 IdP 但不做 SSO 整合', '把 session token 放 localStorage 暴露给 XSS'],
      resources: [
        { title: 'OWASP Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html', type: 'doc' },
        { title: 'OAuth 2.0 Security Best Current Practice', url: 'https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/', type: 'doc' },
        { title: 'WebAuthn Guide', url: 'https://webauthn.guide/', type: 'doc' }
      ],
      maturityLevels: { junior: '能集成 OAuth2 / OIDC 完成登录', mid: '能设计 session / token 体系、MFA、限速', senior: '能制定企业级身份架构：SSO / passkey / 风险引擎' }
    }
  },

  'kubernetes-basics': {
    name: 'Kubernetes Basics',
    nameZh: 'Kubernetes 基础',
    description: 'Operate core Kubernetes objects (Pod / Deployment / Service / Ingress / ConfigMap / Secret) for application workloads.',
    descriptionZh: '掌握 K8s 核心对象（Pod / Deployment / Service / Ingress / ConfigMap / Secret）部署与运维应用。',
    tags: ['kubernetes', 'container', 'orchestration', 'devops', 'cloud-native'],
    category: 'devops',
    input: { type: 'object', required: ['workload'], properties: {
      workload: { type: 'string', description: '应用名称' },
      replicas: { type: 'number', default: 2 },
      image: { type: 'string' },
      namespace: { type: 'string', default: 'default' }
    }},
    output: { type: 'object', properties: { manifests: { type: 'array' }, applyResult: { type: 'object' } } },
    errors: {
      IMAGE_PULL_FAIL: { code: 'K8S_001', message: '镜像拉取失败（认证 / 名称 / 网络）', retryable: true },
      RESOURCE_QUOTA: { code: 'K8S_002', message: '命名空间资源配额不足', retryable: false }
    },
    learning: {
      summaryZh: 'K8s 是约定优先于代码的平台：先理解对象关系图，再写 yaml 才不会迷路。',
      keyPoints: ['Pod 是最小部署单元但不直接管理；用 Deployment / StatefulSet', '一定声明 resources.requests/limits', 'liveness / readiness / startup 三种 probe', 'Service ClusterIP/NodePort/LoadBalancer/ExternalName 各有用途', 'ConfigMap 与 Secret 分开，且 Secret 用 SealedSecrets / SOPS 加密入库'],
      bestPractices: ['namespace 隔离环境与团队', '用 kustomize / helm 管理 manifest', '通过 HPA / VPA 自动扩缩', 'PodDisruptionBudget 保证发布期间可用性'],
      antiPatterns: ['不设 limits 导致单 Pod 吃光节点', '把 latest 镜像直接部署到生产', 'Secret 明文写在 manifest', '直接 kubectl edit 改生产对象不入 git'],
      resources: [
        { title: 'Kubernetes Docs', url: 'https://kubernetes.io/docs/', type: 'doc' },
        { title: 'Kubernetes Patterns (book)', url: 'https://k8spatterns.io/', type: 'book' },
        { title: 'Helm Charts', url: 'https://helm.sh/docs/', type: 'doc' }
      ],
      maturityLevels: { junior: '能写 Deployment + Service 暴露应用', mid: '能用 helm / kustomize、配置 HPA / probe', senior: '能设计平台级 K8s 治理（多租、配额、安全基线）' }
    }
  },

  'docker-essentials': {
    name: 'Docker Essentials',
    nameZh: 'Docker 基础',
    description: 'Build, ship and run application containers with Docker: Dockerfile authoring, image optimization, and registry workflows.',
    descriptionZh: '使用 Docker 构建 / 分发 / 运行容器：Dockerfile 编写、镜像优化、镜像仓库流程。',
    tags: ['docker', 'container', 'image', 'devops', 'build'],
    category: 'devops',
    input: { type: 'object', required: ['baseImage'], properties: {
      baseImage: { type: 'string' },
      multistage: { type: 'boolean', default: true },
      target: { enum: ['dev', 'prod'], default: 'prod' }
    }},
    output: { type: 'object', properties: { dockerfile: { type: 'string' }, imageSize: { type: 'number' }, layers: { type: 'array' } } },
    errors: {
      LAYER_BLOAT: { code: 'DK_001', message: '镜像层数过多或体积过大', retryable: false }
    },
    learning: {
      summaryZh: '镜像越小、越确定、越安全。Dockerfile 写法决定整个 supply chain 风险。',
      keyPoints: ['多阶段构建 (multi-stage) 分离 build 与 runtime', '基础镜像锁 digest 而非 tag', 'COPY 顺序按变更频率从低到高，优化缓存', 'USER 非 root，HEALTHCHECK 指令必备', '生产镜像禁装 curl/git/vim 等无用工具'],
      bestPractices: ['用 distroless / chainguard / alpine 做 runtime base', '用 buildx 跨架构构建', 'docker scout / trivy 扫漏洞', '镜像仓库做 retention policy 控成本'],
      antiPatterns: ['一行 RUN 跑 50 条命令难以调试', '把 secrets 写进 Dockerfile / ENV', '用 root 跑容器并 --privileged', 'COPY . /app 把 .git / node_modules 一起塞进镜像'],
      resources: [
        { title: 'Docker Best Practices', url: 'https://docs.docker.com/develop/develop-images/dockerfile_best-practices/', type: 'doc' },
        { title: 'Distroless images', url: 'https://github.com/GoogleContainerTools/distroless', type: 'doc' },
        { title: 'Chainguard images', url: 'https://www.chainguard.dev/chainguard-images', type: 'doc' }
      ],
      maturityLevels: { junior: '能写基础 Dockerfile 跑应用', mid: '能多阶段、缓存优化、漏洞扫描', senior: '能制定团队镜像规范：base、扫描、retention、SBOM' }
    }
  },

  'aws-cli-basics': {
    name: 'AWS CLI Basics',
    nameZh: 'AWS CLI 基础',
    description: 'Use AWS CLI v2 for resource provisioning, querying, scripting, and automation across S3, EC2, IAM, Lambda and more.',
    descriptionZh: '使用 AWS CLI v2 管理 S3 / EC2 / IAM / Lambda 等资源，支撑脚本化与自动化。',
    tags: ['aws', 'cli', 'cloud', 'automation', 'devops'],
    category: 'devops',
    input: { type: 'object', required: ['service', 'action'], properties: {
      service: { type: 'string', description: '服务名（s3 / ec2 / iam ...）' },
      action: { type: 'string', description: '动作（list-buckets / describe-instances ...）' },
      profile: { type: 'string', default: 'default' },
      region: { type: 'string' }
    }},
    output: { type: 'object', properties: { result: { type: 'object' }, exitCode: { type: 'number' } } },
    errors: {
      AUTH_FAIL: { code: 'AWS_001', message: '凭据失效或权限不足', retryable: false },
      THROTTLE: { code: 'AWS_002', message: 'API 调用限流', retryable: true }
    },
    learning: {
      summaryZh: 'AWS CLI 的能量等于 IAM 权限给你开了多大的口子；脚本化前先把 profile 与 SSO 整明白。',
      keyPoints: ['AWS CLI v2 默认 SSO + named profile', '--query 用 JMESPath 抽取字段，配合 --output json', '危险动作（delete / terminate）走 --dry-run 或 confirm', '脚本中通过 STS AssumeRole 跨账号', 'pagination 默认开启，长结果记得 --max-items'],
      bestPractices: ['配置 aws sso configure 替代长期 access key', '把命令固化进 Makefile / Justfile / scripts/', '用 aws-vault 管理本地凭据', '错误统一捕获 exit code 与 stderr'],
      antiPatterns: ['长期 access key 贴贴 .bashrc', '生产帐号默认 profile，误操作风险大', '脚本不带 --output json 解析失败', 'sudo 跑 aws cli 污染 root 凭据'],
      resources: [
        { title: 'AWS CLI v2 docs', url: 'https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html', type: 'doc' },
        { title: 'aws-vault', url: 'https://github.com/99designs/aws-vault', type: 'doc' },
        { title: 'JMESPath', url: 'https://jmespath.org/', type: 'doc' }
      ],
      maturityLevels: { junior: '能跑常见 service 命令并解析输出', mid: '能用 SSO / AssumeRole / 脚本化批处理', senior: '能制定团队 CLI 安全规范，与 CI/CD / IaC 协同' }
    }
  },

  'prometheus-monitoring': {
    name: 'Prometheus Monitoring',
    nameZh: 'Prometheus 监控',
    description: 'Instrument applications with Prometheus metrics, write PromQL, configure scrape jobs and alert rules.',
    descriptionZh: '为应用埋设 Prometheus 指标，编写 PromQL，配置抓取任务与告警规则。',
    tags: ['observability', 'prometheus', 'metrics', 'monitoring', 'sre'],
    category: 'ops',
    input: { type: 'object', required: ['service'], properties: {
      service: { type: 'string' },
      metricsPort: { type: 'number', default: 9090 },
      slo: { type: 'object', description: 'SLO 配置（target / window）' }
    }},
    output: { type: 'object', properties: { metricsExposed: { type: 'array' }, scrapeConfig: { type: 'string' }, alertRules: { type: 'array' } } },
    errors: {
      HIGH_CARDINALITY: { code: 'PM_001', message: '指标基数过高，存储压力大', retryable: false }
    },
    learning: {
      summaryZh: 'Prometheus 的杀手是高基数：一个 user_id 标签能让你的存储一夜爆炸。',
      keyPoints: ['四类指标：Counter / Gauge / Histogram / Summary', 'Histogram 默认配置 bucket，不要全用默认', 'label 严控：user_id / request_id 永远不上 label', 'PromQL 的 rate() 必须用 Counter，不要用 Gauge', 'recording rules 预聚合常用查询，降 query 成本'],
      bestPractices: ['遵循 USE / RED 法则建立指标', '用 Prometheus Operator 管理 K8s 内部', 'AlertManager 路由按团队 + severity 分发', '远端存储（Thanos / Mimir）做长期保留'],
      antiPatterns: ['把 traceID 当 label 用，基数爆炸', 'rate() 应用在 Gauge 上得到错误结果', '只监控基础设施不监控业务路径', 'AlertManager 不分级，告警雪片飞'],
      resources: [
        { title: 'Prometheus Best Practices', url: 'https://prometheus.io/docs/practices/naming/', type: 'doc' },
        { title: 'PromLabs PromQL guide', url: 'https://promlabs.com/promql-cheat-sheet/', type: 'article' },
        { title: 'Prometheus Operator', url: 'https://prometheus-operator.dev/', type: 'doc' }
      ],
      maturityLevels: { junior: '能埋点 Counter / Gauge 并写简单 PromQL', mid: '能设计 Histogram / SLO / 告警规则', senior: '能搭建组织级监控平台，含远端存储与告警治理' }
    }
  },

  'logging-observability': {
    name: 'Logging Observability',
    nameZh: '日志可观测性',
    description: 'Design structured logging strategies that integrate with metrics & traces and power debugging at scale.',
    descriptionZh: '设计结构化日志策略，与指标 / 链路 trace 协同，支撑大规模调试与审计。',
    tags: ['observability', 'logging', 'sre', 'troubleshooting', 'audit'],
    category: 'ops',
    input: { type: 'object', required: ['service'], properties: {
      service: { type: 'string' },
      format: { enum: ['json', 'logfmt'], default: 'json' },
      retentionDays: { type: 'number', default: 30 }
    }},
    output: { type: 'object', properties: { schemaDoc: { type: 'string' }, ingestionPipeline: { type: 'string' } } },
    errors: {
      LOG_VOLUME_EXPLOSION: { code: 'LO_001', message: '日志量超 SLA 阈值，需采样', retryable: false }
    },
    learning: {
      summaryZh: '日志是事后侦查，指标是实时报警，trace 是因果地图。三者必须共享 trace_id 才能闭环。',
      keyPoints: ['结构化日志 (JSON / logfmt) 第一守则', '统一字段：timestamp, level, service, trace_id, user_id', 'log level 控制谨慎（INFO 之上才进入索引）', '与 OpenTelemetry trace 关联', '审计日志 vs 应用日志要分开 pipeline'],
      bestPractices: ['用 ECS / OTel Logs Data Model 做 schema', '采样高频路径（debug 级 sampling）', '冷热分层：近期 ES，长期 S3 + Athena', '禁止把 PII 写日志，用 hash 或 redact'],
      antiPatterns: ['printf 大法满天飞', 'log.info(JSON.stringify(...request))', '日志当 metrics 用，靠 grep 算 QPS', '没有 retention 策略，磁盘永远 90%'],
      resources: [
        { title: 'OpenTelemetry Logs Data Model', url: 'https://opentelemetry.io/docs/specs/otel/logs/data-model/', type: 'doc' },
        { title: 'Elastic Common Schema (ECS)', url: 'https://www.elastic.co/guide/en/ecs/current/index.html', type: 'doc' }
      ],
      maturityLevels: { junior: '能写结构化日志，区分 level', mid: '能设计 schema、与 trace 关联、控制日志量', senior: '能制定组织级日志治理：合规 / 成本 / 审计' }
    }
  },

  'secrets-management': {
    name: 'Secrets Management',
    nameZh: '凭据管理',
    description: 'Securely store, distribute, rotate and audit secrets (API keys, DB credentials, TLS certs) across environments.',
    descriptionZh: '安全地存储 / 分发 / 轮换 / 审计应用凭据（API key / DB / TLS 证书等）。',
    tags: ['security', 'secrets', 'vault', 'devops', 'compliance'],
    category: 'security',
    input: { type: 'object', required: ['secretName'], properties: {
      secretName: { type: 'string' },
      backend: { enum: ['vault', 'aws-sm', 'gcp-sm', 'sealed-secrets', 'sops'], default: 'vault' },
      rotationDays: { type: 'number', default: 90 }
    }},
    output: { type: 'object', properties: { reference: { type: 'string' }, version: { type: 'string' } } },
    errors: {
      ROTATION_FAIL: { code: 'SM_001', message: '凭据轮换失败，下游可能断连', retryable: true },
      ACCESS_DENIED: { code: 'SM_002', message: '调用方无权访问此 Secret', retryable: false }
    },
    learning: {
      summaryZh: 'Secrets 的本质是"who can read what when"：泄露不是技术问题而是治理失败。',
      keyPoints: ['永远不要把 secret 写进代码 / 镜像 / 日志', '动态凭据 > 静态凭据（短期 token + 自动轮换）', '应用启动时拉取，运行时缓存，定时刷新', 'audit log 必开，谁访问了哪个 secret 何时', 'break-glass 流程预设：紧急访问可追溯'],
      bestPractices: ['HashiCorp Vault / AWS SM / GCP SM 任选其一统一', 'GitOps 用 SealedSecrets / SOPS 加密入库', 'CI/CD 通过 OIDC 动态拿 secret 而非长期 key', '凭据轮换测试自动化覆盖'],
      antiPatterns: ['secret 直接写 helm values', '所有服务共享同一个超大权限的 root token', 'rotation 半年不跑，泄露后无法快速止血', '审计日志关掉省成本'],
      resources: [
        { title: 'HashiCorp Vault', url: 'https://developer.hashicorp.com/vault', type: 'doc' },
        { title: 'AWS Secrets Manager', url: 'https://docs.aws.amazon.com/secretsmanager/', type: 'doc' },
        { title: 'SOPS', url: 'https://github.com/getsops/sops', type: 'doc' }
      ],
      maturityLevels: { junior: '能从 vault 读取 secret 注入应用', mid: '能设计轮换、动态凭据、CI OIDC 流程', senior: '能建立组织级 secret 治理：分级、审计、break-glass、合规' }
    }
  },

  'iam-core-concepts': {
    name: 'IAM Core Concepts',
    nameZh: 'IAM 核心概念',
    description: 'Understand identity, principals, policies, roles, permissions and trust relationships across cloud IAM systems.',
    descriptionZh: '掌握云 IAM 的身份 / 主体 / 策略 / 角色 / 权限 / 信任关系核心模型。',
    tags: ['security', 'iam', 'cloud', 'identity', 'access-control'],
    category: 'security',
    input: { type: 'object', required: ['provider'], properties: {
      provider: { enum: ['aws', 'gcp', 'azure', 'k8s'] },
      principalType: { enum: ['user', 'role', 'service-account', 'group'] }
    }},
    output: { type: 'object', properties: { policyDocument: { type: 'object' }, attachments: { type: 'array' } } },
    errors: {
      POLICY_TOO_BROAD: { code: 'IAM_001', message: '策略授权过宽，违反最小权限', retryable: false }
    },
    learning: {
      summaryZh: 'IAM 是云的引力场：理解 Identity / Principal / Policy / Role / Trust 五件套，才能在多账号中飞行。',
      keyPoints: ['Identity Policy（attached to who）vs Resource Policy（attached to what）', 'Role + AssumeRole 替代长期 access key', 'Service Linked Role 是云原生集成的关键', 'condition 字段控制时间 / IP / MFA', '策略求交：deny 永远胜出'],
      bestPractices: ['IAM Access Analyzer 持续审视', '所有人类身份接 SSO + MFA', '机器身份用 IAM Roles for Service Accounts (IRSA) 或 Workload Identity', '权限分层：admin / operator / readonly'],
      antiPatterns: ['给 EC2 / Pod 直接 root admin', '* on * 的 wildcard 策略', 'IAM user 多于 role，credential 散落', 'condition 写错导致默认放行'],
      resources: [
        { title: 'AWS IAM Best Practices', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', type: 'doc' },
        { title: 'GCP IAM Concepts', url: 'https://cloud.google.com/iam/docs/overview', type: 'doc' },
        { title: 'Azure RBAC', url: 'https://learn.microsoft.com/en-us/azure/role-based-access-control/overview', type: 'doc' }
      ],
      maturityLevels: { junior: '能读懂常见 policy json', mid: '能写最小权限策略 + AssumeRole 跨账号', senior: '能设计组织级 IAM 架构与持续治理' }
    }
  },

  'mfa-and-credential-management': {
    name: 'MFA & Credential Management',
    nameZh: '多因子与凭据管理',
    description: 'Roll out MFA, manage credential lifecycle (issue/rotate/revoke), and harden against phishing & credential stuffing.',
    descriptionZh: '推行 MFA，管理凭据全生命周期（签发 / 轮换 / 吊销），防钓鱼与撞库。',
    tags: ['security', 'mfa', 'credential', 'phishing', 'identity'],
    category: 'security',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { enum: ['workforce', 'customer', 'machine'] },
      mfaMethods: { type: 'array', items: { enum: ['totp', 'sms', 'push', 'webauthn', 'fido2'] } }
    }},
    output: { type: 'object', properties: { enrollmentRate: { type: 'number' }, phishingResistant: { type: 'boolean' } } },
    errors: {
      WEAK_FACTOR: { code: 'MFA_001', message: '所选 MFA 因子不足以防钓鱼', retryable: false }
    },
    learning: {
      summaryZh: 'MFA 不等于安全：SMS 与 TOTP 可被钓鱼，只有 WebAuthn / FIDO2 才是钓鱼免疫。',
      keyPoints: ['phishing-resistant 才是金标准', 'admin / privileged 必须强制 FIDO2', 'TOTP 兼容旧用户但需逐步替换', '凭据生命周期：issue → rotate → revoke 全部审计', '撞库防御：rate limit + breach password check'],
      bestPractices: ['推 passkey / FIDO2 给关键账号', '把 MFA 注册嵌入 onboarding 不可跳过', '提供 self-service backup code 与设备管理', '与 SIEM 联动，检测异常登录'],
      antiPatterns: ['只支持 SMS MFA', 'admin 与普通用户用同样 MFA 强度', '丢手机就重置全部 MFA 而无身份验证', '凭据吊销后没有 session revocation'],
      resources: [
        { title: 'NIST 800-63B Digital Identity Guidelines', url: 'https://pages.nist.gov/800-63-3/sp800-63b.html', type: 'doc' },
        { title: 'CISA: Phishing-Resistant MFA', url: 'https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf', type: 'doc' },
        { title: 'WebAuthn / passkey', url: 'https://passkeys.dev/', type: 'doc' }
      ],
      maturityLevels: { junior: '能配 TOTP / push MFA', mid: '能推 FIDO2 / passkey、设计凭据生命周期', senior: '能制定组织级身份与凭据治理：分级、自动化、合规' }
    }
  },

  'compliance': {
    name: 'Compliance Management',
    nameZh: '合规管理',
    description: 'Map controls to compliance frameworks (SOC2 / ISO27001 / GDPR / HIPAA), collect evidence and prepare audits.',
    descriptionZh: '把内部控制映射到 SOC2 / ISO27001 / GDPR / HIPAA 等合规框架，收集证据准备审计。',
    tags: ['compliance', 'governance', 'audit', 'soc2', 'gdpr'],
    category: 'security',
    input: { type: 'object', required: ['framework'], properties: {
      framework: { enum: ['soc2', 'iso27001', 'gdpr', 'hipaa', 'pci-dss', 'iso27701'] },
      stage: { enum: ['readiness', 'pre-audit', 'audit', 'remediation'] },
      scope: { type: 'string' }
    }},
    output: { type: 'object', properties: { controlMapping: { type: 'object' }, evidence: { type: 'array' }, gaps: { type: 'array' } } },
    errors: {
      EVIDENCE_STALE: { code: 'CP_001', message: '证据已过期，需重新采集', retryable: false }
    },
    learning: {
      summaryZh: '合规不是审计前突击，而是把 control 嵌入工程日常，让证据自然生成。',
      keyPoints: ['Control 是手段，evidence 是证明', 'SOC2 五原则：Security / Availability / Confidentiality / Processing Integrity / Privacy', 'compliance-as-code：control 自动化采样', 'data residency / 数据出境是 GDPR 重点', '员工培训 + 入离职流程是审计常见缺口'],
      bestPractices: ['用 Drata / Vanta / Secureframe 做持续合规', '每 control 指派 owner + due date', '把证据收集嵌入 CI/CD 与 IaC', '年审之前做 mock audit'],
      antiPatterns: ['审计前两周突击搞 evidence', 'policy 写得很美但工程根本没落实', '把合规当 security 全部，忽视实际威胁', '不同框架重复劳动而不复用 control'],
      resources: [
        { title: 'AICPA SOC 2 Trust Services Criteria', url: 'https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2', type: 'doc' },
        { title: 'GDPR official text', url: 'https://gdpr-info.eu/', type: 'doc' },
        { title: 'compliance-as-code (Cloud Custodian)', url: 'https://cloudcustodian.io/', type: 'doc' }
      ],
      maturityLevels: { junior: '能按 checklist 收集 evidence', mid: '能映射 control、补 gap、协调 audit', senior: '能搭多框架合规体系、compliance-as-code 与文化建设' }
    }
  },

  'etl-development': {
    name: 'ETL Development',
    nameZh: 'ETL 开发',
    description: 'Implement Extract / Transform / Load workflows from source systems into analytical stores with quality, lineage and SLA.',
    descriptionZh: '实现从源系统到分析存储的 ETL 流程，覆盖质量 / 血缘 / SLA。',
    tags: ['data', 'etl', 'pipeline', 'integration', 'warehouse'],
    category: 'data',
    input: { type: 'object', required: ['source', 'target'], properties: {
      source: { type: 'object' },
      target: { type: 'object' },
      pattern: { enum: ['etl', 'elt', 'cdc'], default: 'elt' },
      sla: { type: 'object' }
    }},
    output: { type: 'object', properties: { jobId: { type: 'string' }, rowsLoaded: { type: 'number' }, lineage: { type: 'object' } } },
    errors: {
      CDC_LAG: { code: 'ETL_001', message: 'CDC 滞后超过 SLA', retryable: true },
      TYPE_MISMATCH: { code: 'ETL_002', message: '源与目标 schema 类型不兼容', retryable: false }
    },
    learning: {
      summaryZh: 'ETL 已经让位 ELT：把转换放到仓库内做，复用算力又简化 pipeline。',
      keyPoints: ['ELT > ETL（让仓库的算力替你跑 transform）', 'CDC（Debezium / Fivetran）替代周期性 dump', 'idempotent + 幂等键是修复脏数据的前提', '血缘（OpenLineage）让审计与回滚成为可能', 'late-arriving data 用 watermark 与 reprocess 处理'],
      bestPractices: ['dbt 做 transform 层，版本化 SQL', 'Airflow / Dagster 编排作业', '每条作业绑定 SLA 与告警', '上游 schema 变更走 contract 审核'],
      antiPatterns: ['手写 cron 跑 SQL，无 retry / 无幂等', '转换逻辑散落在 ETL 工具与 BI 报表两层', '把脏数据直接 DELETE，事故无法复盘', 'CDC 不做去重，下游消费幂等失败'],
      resources: [
        { title: 'dbt docs', url: 'https://docs.getdbt.com/', type: 'doc' },
        { title: 'Debezium', url: 'https://debezium.io/documentation/', type: 'doc' },
        { title: 'OpenLineage', url: 'https://openlineage.io/', type: 'doc' }
      ],
      maturityLevels: { junior: '能写单条 ETL 任务并定时跑', mid: '能设计 ELT / CDC、SLA、血缘', senior: '能在组织层推 data contract / lineage 闭环' }
    }
  },

  'competitive-analysis': {
    name: 'Competitive Analysis',
    nameZh: '竞品分析',
    description: 'Systematically analyze competitor products, positioning, pricing and roadmaps to inform product strategy.',
    descriptionZh: '系统分析竞品的产品 / 定位 / 定价 / 路线，支撑产品战略与决策。',
    tags: ['product', 'strategy', 'competitive', 'research', 'positioning'],
    category: 'product',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { type: 'string', description: '分析范围（feature / pricing / GTM / full）' },
      competitors: { type: 'array', items: { type: 'string' } },
      market: { type: 'string' }
    }},
    output: { type: 'object', properties: { matrix: { type: 'object' }, swot: { type: 'object' }, recommendations: { type: 'array' } } },
    errors: {
      DATA_OUTDATED: { code: 'CA_001', message: '依赖的竞品数据已过期', retryable: false }
    },
    learning: {
      summaryZh: '竞品分析不是抄功能，而是看清自己在谁的"替代方案"上、能赢谁、不与谁正面打。',
      keyPoints: ['先定决策场景（融资 / 立项 / 定价 / 营销）', '区分 direct / indirect / aspirational 三类竞品', 'feature parity 是平庸的开始，差异化才是赢点', 'pricing 与 packaging 的差异往往最值钱', 'JTBD 视角：竞品是其他可解此 job 的方式'],
      bestPractices: ['用 SWOT / Porter 五力定方向', '每季度更新竞品 dashboard', '与销售前线 + 客户访谈交叉验证', '产出"何时选我们 / 何时不选"对照表'],
      antiPatterns: ['列功能表对比打勾，沦为参数战', '只看头部 1 家直接对手', '靠官网截图，不做实际试用与客户访谈', '竞品分析不进决策，沦为孤立报告'],
      resources: [
        { title: 'Reforge: Competitive Strategy', url: 'https://www.reforge.com/blog/competitive-positioning', type: 'article' },
        { title: 'April Dunford: Obviously Awesome (positioning)', url: 'https://www.aprildunford.com/obviously-awesome', type: 'book' },
        { title: 'JTBD', url: 'https://jtbd.info/', type: 'doc' }
      ],
      maturityLevels: { junior: '能输出竞品功能 / 定价对照表', mid: '能做 JTBD 视角分析、影响产品路线', senior: '能驱动定位与差异化战略，整合销售 / 客户 / 市场反馈' }
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

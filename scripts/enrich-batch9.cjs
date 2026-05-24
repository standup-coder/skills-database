#!/usr/bin/env node
/**
 * 第八轮 batch 9：12 个跨领域补齐 placeholder（ops / sre / k8s / iac / db / mobile）全量 enrich
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'atomic-skills');

const PATCHES = {
  'config-validator': {
    name: 'Config Validator',
    nameZh: '配置校验',
    description: 'Validate configuration files (YAML / JSON / TOML / env) against schema and policy.',
    descriptionZh: '基于 schema 与策略校验配置文件（YAML / JSON / TOML / env）。',
    tags: ['ops', 'config', 'validation', 'schema', 'lint'],
    category: 'ops',
    input: { type: 'object', required: ['file'], properties: {
      file: { type: 'string' },
      schema: { type: 'string' },
      strict: { type: 'boolean', default: true }
    }},
    output: { type: 'object', properties: { valid: { type: 'boolean' }, errors: { type: 'array' }, warnings: { type: 'array' } } },
    errors: { SCHEMA_NOT_FOUND: { code: 'CV_001', message: '未找到 schema 定义', retryable: false } },
    learning: {
      summaryZh: '配置错误是生产事故 Top3，但成本最低的拦截点是 PR 阶段的 schema 校验；写一次 schema 长期受益。',
      keyPoints: ['JSON Schema / Cue / Pkl 都可用', 'pre-commit + CI 双层校验', 'env 配置走 typed config 库', '业务约束做自定义 validator', '区分 syntax / semantic 两类错误'],
      bestPractices: ['用 Ajv / yamale / cue vet 做 lint', 'schema 与代码同 repo 版本化', 'config 失败要 fail-fast', '错误信息附 fix snippet'],
      antiPatterns: ['运行时才发现 typo', 'schema 写完不更新', '靠注释约束代替 schema', 'config 散落多处难校验'],
      resources: [
        { title: 'JSON Schema', url: 'https://json-schema.org/', type: 'doc' },
        { title: 'Cue', url: 'https://cuelang.org/docs/', type: 'doc' },
        { title: 'Pkl', url: 'https://pkl-lang.org/', type: 'doc' }
      ],
      maturityLevels: { junior: '能写 JSON Schema 校验 config', mid: '能 PR-time + runtime 双层校验', senior: '能驱动组织级 config 治理与 schema-first 文化' }
    }
  },

  'cost-optimization': {
    name: 'Cost Optimization',
    nameZh: '成本优化',
    description: 'Continuously optimize cloud / infra cost through right-sizing, commitments, autoscaling, and waste cleanup.',
    descriptionZh: '通过 right-sizing / 长期合约 / 弹性伸缩 / 废弃资源清理持续优化云与基础设施成本。',
    tags: ['ops', 'finops', 'cost', 'cloud', 'optimization'],
    category: 'ops',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { type: 'string' },
      lookbackDays: { type: 'number', default: 30 }
    }},
    output: { type: 'object', properties: { savings: { type: 'number' }, recommendations: { type: 'array' }, wasteList: { type: 'array' } } },
    errors: { OBSERVATION_TOO_SHORT: { code: 'CO_001', message: '观察期不足，优化建议不可信', retryable: true } },
    learning: {
      summaryZh: 'FinOps 的核心是把成本可视化到 owner，然后用工程力量优化；按部门分账后浪费下降 30% 是常态。',
      keyPoints: ['cost = unit cost × usage × rate', 'tag 治理是分账前提', 'commitment（RI / Savings Plan）vs spot vs on-demand', 'autoscaling > over-provisioning', '废弃资源（unattached EBS / orphan IP）每月扫'],
      bestPractices: ['tagging policy 强制执行', '每月 cost review 与 owner 对齐', 'showback → chargeback 渐进', 'spot 用于 stateless 与批处理'],
      antiPatterns: ['集中成本看板没人看', 'RI 买完未利用率', 'autoscaling 只伸不缩', '只看 invoice 不看单位经济模型'],
      resources: [
        { title: 'FinOps Foundation', url: 'https://www.finops.org/', type: 'doc' },
        { title: 'AWS Cost Explorer', url: 'https://docs.aws.amazon.com/cost-management/', type: 'doc' },
        { title: 'GCP Billing Reports', url: 'https://cloud.google.com/billing/docs/reports', type: 'doc' }
      ],
      maturityLevels: { junior: '能跑 cost report 找 top spend', mid: '能落地 tagging + 长期合约 + autoscaling', senior: '能驱动组织级 FinOps 文化与 unit economics 治理' }
    }
  },

  'docker-to-k8s': {
    name: 'Docker to Kubernetes',
    nameZh: 'Docker 迁移到 K8s',
    description: 'Migrate dockerized workloads to Kubernetes covering manifests, configs, secrets, and rollout.',
    descriptionZh: '将 Docker 容器化应用迁移至 K8s：manifest / config / secret / 上线策略全覆盖。',
    tags: ['kubernetes', 'docker', 'migration', 'manifest', 'helm'],
    category: 'ops',
    input: { type: 'object', required: ['source'], properties: {
      source: { type: 'string', description: 'compose 文件或 docker run 命令' },
      target: { type: 'string', enum: ['raw-yaml', 'helm', 'kustomize'] }
    }},
    output: { type: 'object', properties: { manifests: { type: 'array' }, secrets: { type: 'array' }, migrationPlan: { type: 'object' } } },
    errors: { STATEFUL_NOT_HANDLED: { code: 'DK_001', message: '有状态服务未处理（StatefulSet / PVC）', retryable: false } },
    learning: {
      summaryZh: 'compose → k8s 不是 1:1 翻译；网络 / 存储 / 健康检查 / lifecycle 这四件事必须按 K8s 思维重写，否则迁移即事故。',
      keyPoints: ['compose service → Deployment + Service', 'volumes → PVC + StorageClass', 'depends_on 改 readiness probe', 'env_file → ConfigMap / Secret', 'restart 策略 → Deployment / StatefulSet 选型'],
      bestPractices: ['kompose convert 起步，再人工调', 'Helm chart 抽 values 复用', '迁移前先做 dry-run + canary', 'health probe（liveness / readiness / startup）必须配齐'],
      antiPatterns: ['直接 kompose 输出上生产', '不区分 stateless / stateful', 'docker logs 习惯换成 stdout 日志规范', '把 docker-compose volume 翻译成 hostPath'],
      resources: [
        { title: 'Kompose', url: 'https://kompose.io/', type: 'doc' },
        { title: 'K8s Migration Guide', url: 'https://kubernetes.io/docs/concepts/workloads/', type: 'doc' },
        { title: 'Helm', url: 'https://helm.sh/docs/', type: 'doc' }
      ],
      maturityLevels: { junior: '能跑 kompose 输出基础 manifest', mid: '能完整迁移含状态服务并配 probe', senior: '能驱动组织级容器化与 K8s 标准化' }
    }
  },

  'generate-deployment-guide': {
    name: 'Generate Deployment Guide',
    nameZh: '生成部署指南',
    description: 'Generate a runnable deployment guide from project metadata covering env, build, deploy, rollback.',
    descriptionZh: '基于项目元数据生成可执行的部署指南：环境 / 构建 / 部署 / 回滚。',
    tags: ['ops', 'docs', 'deployment', 'runbook', 'sop'],
    category: 'ops',
    input: { type: 'object', required: ['repo'], properties: {
      repo: { type: 'string' },
      env: { type: 'string', enum: ['dev', 'staging', 'prod'] }
    }},
    output: { type: 'object', properties: { guide: { type: 'string' }, prerequisites: { type: 'array' }, rollback: { type: 'string' } } },
    errors: { MISSING_PIPELINE: { code: 'DG_001', message: '未找到部署 pipeline 元数据', retryable: false } },
    learning: {
      summaryZh: '部署指南不是给人读的小说，是给 oncall 在凌晨 3 点能照着复制粘贴的脚本；越精炼越好。',
      keyPoints: ['prereq / build / deploy / verify / rollback 五段式', '每步带具体命令而非"运行 CI"', '失败回滚必须显式可执行', '环境差异表格化', '与 runbook 链接互相引用'],
      bestPractices: ['指南放 repo 内随代码 PR 更新', 'screenshot 用极简风格不放过期 UI', '把指南做成 markdown lint 化', '与告警 runbook 链接'],
      antiPatterns: ['"按 CI 部署即可"一句话糊过去', '指南散在 wiki 跟代码不同步', '没有 rollback 段', '步骤含义不清需上下文猜'],
      resources: [
        { title: 'Google SRE Book: Postmortem', url: 'https://sre.google/sre-book/postmortem-culture/', type: 'book' },
        { title: 'GitOps deployment patterns', url: 'https://www.weave.works/technologies/gitops/', type: 'article' },
        { title: 'Diátaxis docs framework', url: 'https://diataxis.fr/', type: 'doc' }
      ],
      maturityLevels: { junior: '能写单服务部署文档', mid: '能模板化跨服务指南并随代码维护', senior: '能驱动组织级 deployment runbook 与 SOP' }
    }
  },

  'gitops-workflow': {
    name: 'GitOps Workflow',
    nameZh: 'GitOps 工作流',
    description: 'Implement GitOps workflows where Git is the single source of truth for infra and application state.',
    descriptionZh: '实施 GitOps 工作流：Git 是基础设施与应用状态的唯一真相。',
    tags: ['ops', 'gitops', 'argocd', 'flux', 'k8s'],
    category: 'ops',
    input: { type: 'object', required: ['repo'], properties: {
      repo: { type: 'string' },
      tool: { type: 'string', enum: ['argocd', 'flux', 'jenkins-x'] },
      pattern: { type: 'string', enum: ['mono-repo', 'multi-repo', 'app-of-apps'] }
    }},
    output: { type: 'object', properties: { config: { type: 'object' }, syncStatus: { type: 'object' }, drift: { type: 'array' } } },
    errors: { DRIFT_DETECTED: { code: 'GO_001', message: '集群状态与 Git 漂移', retryable: false } },
    learning: {
      summaryZh: 'GitOps 不是"用 Git 部署"，是"集群状态由 Git 单向推动"；任何 kubectl apply 直改集群都是反模式。',
      keyPoints: ['declarative > imperative', 'pull > push（agent 主动同步）', 'app-of-apps 控制 sprawl', 'sealed secret / SOPS 解决 secret 入 Git', 'drift detection + auto-heal'],
      bestPractices: ['ArgoCD app-of-apps + Helm values 分离', 'PR-based 变更 + 自动化测试', 'sync wave 控制启动顺序', 'RBAC 限制谁能改 production'],
      antiPatterns: ['kubectl apply 绕过 GitOps', 'secret 明文入库', 'auto-sync 无 review 直接 prod', '一个 ArgoCD 跨多 cluster 不分租户'],
      resources: [
        { title: 'OpenGitOps Principles', url: 'https://opengitops.dev/', type: 'doc' },
        { title: 'ArgoCD', url: 'https://argo-cd.readthedocs.io/', type: 'doc' },
        { title: 'Flux', url: 'https://fluxcd.io/flux/', type: 'doc' }
      ],
      maturityLevels: { junior: '能用 ArgoCD 部署单 app', mid: '能落地 app-of-apps + sealed secret + RBAC', senior: '能驱动组织级 GitOps 战略与多 cluster 治理' }
    }
  },

  'incident-response': {
    name: 'Incident Response',
    nameZh: '事件响应',
    description: 'Respond to production incidents covering detection, triage, communication, mitigation, and postmortem.',
    descriptionZh: '响应生产事件：检测 / 分诊 / 沟通 / 缓解 / 复盘。',
    tags: ['ops', 'incident', 'oncall', 'sre', 'postmortem'],
    category: 'ops',
    input: { type: 'object', required: ['alert'], properties: {
      alert: { type: 'string' },
      severity: { type: 'string', enum: ['sev1', 'sev2', 'sev3', 'sev4'] }
    }},
    output: { type: 'object', properties: { timeline: { type: 'array' }, mitigation: { type: 'string' }, postmortem: { type: 'string' } } },
    errors: { COMMS_DELAY: { code: 'IR_001', message: '事件沟通通道延迟', retryable: true } },
    learning: {
      summaryZh: 'Incident response 的核心是"先减损后查因"；oncall 的任务是把客户痛苦降下去，复盘的任务是别再发生。',
      keyPoints: ['IC（incident commander）单点决策', 'mitigate > root-cause（事件中）', 'comms / ops / scribe 角色分离', 'severity 决定升级路径', 'blameless postmortem 文化'],
      bestPractices: ['runbook + alert 链接互绑', 'sev1 触发自动 conf bridge', 'every postmortem with action items + owner', '每月 chaos drill 演练'],
      antiPatterns: ['事件中找 root cause 优先于 mitigate', 'oncall 无 runbook 全靠脑', 'postmortem 找替罪羊', '同类事件反复发生但不归因'],
      resources: [
        { title: 'Google SRE Book: Managing Incidents', url: 'https://sre.google/sre-book/managing-incidents/', type: 'book' },
        { title: 'PagerDuty Response', url: 'https://response.pagerduty.com/', type: 'doc' },
        { title: 'Incident.io blog', url: 'https://incident.io/blog', type: 'article' }
      ],
      maturityLevels: { junior: '能按 runbook 处理 sev3/4', mid: '能担任 IC 处理 sev1/2 并写 postmortem', senior: '能驱动组织级 IR 文化与跨部门协同' }
    }
  },

  'k8s-troubleshooting': {
    name: 'Kubernetes Troubleshooting',
    nameZh: 'K8s 故障排查',
    description: 'Diagnose Kubernetes issues across pods, services, networking, storage, and control plane.',
    descriptionZh: '排查 K8s 在 pod / service / 网络 / 存储 / 控制面层的故障。',
    tags: ['kubernetes', 'troubleshooting', 'debug', 'oncall', 'ops'],
    category: 'ops',
    input: { type: 'object', required: ['symptom'], properties: {
      symptom: { type: 'string' },
      namespace: { type: 'string' },
      cluster: { type: 'string' }
    }},
    output: { type: 'object', properties: { rootCause: { type: 'string' }, evidence: { type: 'array' }, remediation: { type: 'string' } } },
    errors: { LOG_INSUFFICIENT: { code: 'KT_001', message: '日志保留不足以诊断', retryable: true } },
    learning: {
      summaryZh: 'K8s 故障 80% 落在 4 类：镜像 / 资源 / 网络 / probe；先按这 4 类做 bisect 比直接读 etcd 快十倍。',
      keyPoints: ['kubectl describe + events 第一步', 'CrashLoopBackOff 看 logs --previous', 'pending pod 看 scheduler events', 'DNS 问题先 nslookup 再看 CoreDNS', 'OOMKilled 看 limits'],
      bestPractices: ['stern / k9s 做多 pod 日志聚合', 'ephemeral debug container 上线', 'cluster-level audit log 集中存', 'kube-state-metrics + Prometheus 看趋势'],
      antiPatterns: ['一上来 kubectl exec 改 pod', '不看 events 只看 logs', '一遇问题 restart pod', 'limits 不设导致互相挤'],
      resources: [
        { title: 'K8s Troubleshooting docs', url: 'https://kubernetes.io/docs/tasks/debug/', type: 'doc' },
        { title: 'k9s', url: 'https://k9scli.io/', type: 'doc' },
        { title: 'Stern', url: 'https://github.com/stern/stern', type: 'doc' }
      ],
      maturityLevels: { junior: '能 describe / logs 排查单 pod', mid: '能跨 namespace / 网络 / DNS 多维诊断', senior: '能驱动 K8s 平台稳定性与诊断工具体系' }
    }
  },

  'pipeline-security-automation': {
    name: 'Pipeline Security Automation',
    nameZh: '流水线安全自动化',
    description: 'Automate security checks in CI/CD pipelines: SAST, SCA, IaC scan, secret detection, and signing.',
    descriptionZh: '在 CI/CD pipeline 中自动化安全检查：SAST / SCA / IaC 扫描 / secret 检测 / 镜像签名。',
    tags: ['security', 'devsecops', 'cicd', 'shift-left', 'pipeline'],
    category: 'security',
    input: { type: 'object', required: ['pipeline'], properties: {
      pipeline: { type: 'string' },
      stages: { type: 'array', items: { enum: ['sast', 'sca', 'iac-scan', 'secret-scan', 'image-scan', 'signing'] } }
    }},
    output: { type: 'object', properties: { gates: { type: 'array' }, findings: { type: 'object' }, signedArtifacts: { type: 'array' } } },
    errors: { GATE_BYPASSED: { code: 'PSA_001', message: '安全 gate 被绕过合并', retryable: false } },
    learning: {
      summaryZh: 'DevSecOps 的本质是"安全检查与构建并轨"；速度与安全只能靠工具自动化解决，不能靠纪律。',
      keyPoints: ['shift-left 多层（pre-commit / PR / merge / build）', 'gate 分 advisory vs blocking', 'severity 阈值 + KEV 名单 release gate', 'SBOM + signing（Cosign / SLSA）', '把误报治理也自动化'],
      bestPractices: ['pre-commit hook 跑 secret + lint', 'PR 跑 SAST + IaC + SCA', 'release 必须 signed + provenance', '失败 gate 必须有 escalation 流程'],
      antiPatterns: ['gate 太严直接 disable', '一切 advisory 永远不 block', '安全工具结果不接 ticket 流', '只扫 main 不扫 PR'],
      resources: [
        { title: 'OWASP DevSecOps', url: 'https://owasp.org/www-project-devsecops-guideline/', type: 'doc' },
        { title: 'SLSA Framework', url: 'https://slsa.dev/', type: 'doc' },
        { title: 'Sigstore Cosign', url: 'https://docs.sigstore.dev/cosign/', type: 'doc' }
      ],
      maturityLevels: { junior: '能在 CI 接入单类安全扫描', mid: '能搭多层 gate + signing + provenance', senior: '能驱动组织级 DevSecOps 战略与 supply chain 治理' }
    }
  },

  'platform-healthcheck': {
    name: 'Platform Health Check',
    nameZh: '平台健康检查',
    description: 'Continuously check platform-level health across infra, services, and dependencies.',
    descriptionZh: '在基础设施 / 服务 / 依赖层面持续做平台级健康检查。',
    tags: ['ops', 'sre', 'healthcheck', 'monitoring', 'platform'],
    category: 'ops',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { type: 'string' },
      cadence: { type: 'string', enum: ['1m', '5m', '15m', '1h'] }
    }},
    output: { type: 'object', properties: { status: { type: 'object' }, degraded: { type: 'array' }, sloImpact: { type: 'object' } } },
    errors: { STALE_HEALTH_DATA: { code: 'PH_001', message: '健康数据陈旧（> 2 个 cadence）', retryable: true } },
    learning: {
      summaryZh: '平台健康检查不是 ping 服务存活，而是"端到端业务关键路径 + 依赖层 + 容量水位"三维持续观测。',
      keyPoints: ['liveness / readiness / synthetic 三层', 'dependency health 用 circuit breaker 暴露', 'SLO burn rate 是核心信号', 'multi-region 检查防单点假阳', 'health endpoint 不能拖慢业务'],
      bestPractices: ['synthetic 跑业务关键路径', 'health endpoint < 100ms', 'datadog / pingdom 多 vendor 互备', '把 health → SLO → alert 链路打通'],
      antiPatterns: ['liveness 拉 DB 引发雪崩', 'health endpoint 不区分 dep / self', '没有 synthetic 端到端验证', '一秒钟探测淹没下游'],
      resources: [
        { title: 'Google SRE Book: SLOs', url: 'https://sre.google/sre-book/service-level-objectives/', type: 'book' },
        { title: 'K8s probes', url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/', type: 'doc' },
        { title: 'Datadog Synthetics', url: 'https://docs.datadoghq.com/synthetics/', type: 'doc' }
      ],
      maturityLevels: { junior: '能配置基础 health probe', mid: '能搭 synthetic + SLO + alert 链路', senior: '能驱动平台级可用性体系与 multi-region health' }
    }
  },

  'sdk-integration': {
    name: 'SDK Integration',
    nameZh: 'SDK 集成',
    description: 'Integrate third-party SDKs into mobile / backend apps with version pinning, abstraction and observability.',
    descriptionZh: '将第三方 SDK 集成到移动 / 后端应用，含版本固定 / 抽象层 / 可观测。',
    tags: ['mobile', 'backend', 'sdk', 'integration', 'dependency'],
    category: 'engineering',
    input: { type: 'object', required: ['sdk', 'platform'], properties: {
      sdk: { type: 'string' },
      platform: { type: 'string', enum: ['ios', 'android', 'web', 'node', 'java', 'python'] },
      version: { type: 'string' }
    }},
    output: { type: 'object', properties: { integrationCode: { type: 'string' }, abstraction: { type: 'string' }, telemetry: { type: 'object' } } },
    errors: { VERSION_CONFLICT: { code: 'SDK_001', message: 'SDK 版本与现有依赖冲突', retryable: false } },
    learning: {
      summaryZh: 'SDK 是别人的代码跑在你的进程里；锁版本、抽接口、加 telemetry 这三件事不做，迟早被它的 bug 拖下水。',
      keyPoints: ['永远 pin 精确版本不要 ^/~', '在 SDK 之上做 thin wrapper', 'init 要异步 + 失败降级', 'crash / latency / error 接 APM', '法务 + 隐私 + license 提前 review'],
      bestPractices: ['每升级走 PR + e2e 验证', 'A/B test 灰度新 SDK', '把 SDK key 入 secret', 'SDK 失败不能影响主流程'],
      antiPatterns: ['SDK 抢主线程引发 ANR', '版本号 latest / floating', '没抽象 wrapper 直接散播 SDK 类', '不监控 SDK 性能'],
      resources: [
        { title: 'OWASP Mobile Top 10', url: 'https://owasp.org/www-project-mobile-top-10/', type: 'doc' },
        { title: 'Google: 12-factor SDK design', url: 'https://12factor.net/', type: 'doc' },
        { title: 'Semantic Versioning', url: 'https://semver.org/', type: 'doc' }
      ],
      maturityLevels: { junior: '能完成 SDK 基本接入', mid: '能抽象 wrapper + telemetry + 异步 init', senior: '能驱动 SDK 治理与第三方依赖战略' }
    }
  },

  'service-health-check': {
    name: 'Service Health Check',
    nameZh: '服务健康检查',
    description: 'Implement service-level health endpoints to integrate with load balancers and orchestrators.',
    descriptionZh: '实现服务级健康检查端点，与负载均衡和编排平台对接。',
    tags: ['ops', 'healthcheck', 'liveness', 'readiness', 'k8s'],
    category: 'ops',
    input: { type: 'object', required: ['service'], properties: {
      service: { type: 'string' },
      checks: { type: 'array', items: { enum: ['liveness', 'readiness', 'startup', 'dependency'] } }
    }},
    output: { type: 'object', properties: { endpoints: { type: 'array' }, response: { type: 'object' } } },
    errors: { CASCADING_FAIL: { code: 'SH_001', message: 'health 检查依赖下游引发级联失败', retryable: false } },
    learning: {
      summaryZh: 'liveness 与 readiness 写错是 K8s 最常见自伤；liveness 拉 DB = 一次 DB 抖动重启全集群。',
      keyPoints: ['liveness：进程是否存活', 'readiness：是否能接流量', 'startup：慢启动应用专用', 'liveness 不查依赖', 'readiness 可以查关键依赖'],
      bestPractices: ['liveness 仅看自身（HTTP 200）', 'readiness 查关键 dep 但 fail open', 'timeout < 探测周期 / 2', 'startup probe 给慢启动留时间'],
      antiPatterns: ['liveness 查 DB 引发雪崩', '探测周期 1s 把服务压垮', 'readiness 不区分启动 vs 退出', 'response 200 但 body 是 error'],
      resources: [
        { title: 'K8s Configure Probes', url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/', type: 'doc' },
        { title: 'Google SRE Book: Load Balancing', url: 'https://sre.google/sre-book/load-balancing-frontend/', type: 'book' },
        { title: 'Spring Boot Actuator', url: 'https://docs.spring.io/spring-boot/reference/actuator/', type: 'doc' }
      ],
      maturityLevels: { junior: '能实现 HTTP 200 端点', mid: '能正确区分 3 类 probe + dep 处理', senior: '能驱动跨服务健康检查标准与 SLO 联动' }
    }
  },

  'sql-optimization': {
    name: 'SQL Optimization',
    nameZh: 'SQL 优化',
    description: 'Analyze and optimize slow SQL queries through plans, indexes, rewrites, and schema tuning.',
    descriptionZh: '通过执行计划 / 索引 / 改写 / schema 优化分析与加速慢 SQL。',
    tags: ['database', 'sql', 'optimization', 'index', 'performance'],
    category: 'database',
    input: { type: 'object', required: ['sql'], properties: {
      sql: { type: 'string' },
      engine: { type: 'string', enum: ['postgres', 'mysql', 'sqlserver', 'oracle', 'clickhouse'] },
      plan: { type: 'string' }
    }},
    output: { type: 'object', properties: { recommendations: { type: 'array' }, rewrittenSql: { type: 'string' }, expectedSpeedup: { type: 'number' } } },
    errors: { PLAN_UNAVAILABLE: { code: 'SQL_001', message: '无法获取执行计划', retryable: true } },
    learning: {
      summaryZh: 'SQL 优化先看 plan 再看 schema 再看 index；不看 plan 就改 SQL 等于盲调。',
      keyPoints: ['EXPLAIN ANALYZE > EXPLAIN', 'covering index 大幅减少 IO', 'sargable 表达式可走索引', 'N+1 是 ORM 头号杀手', 'partition / 分库分表是最后手段'],
      bestPractices: ['慢 SQL 监控 + 自动捕获', 'index 加之前先 hypopg 模拟', '改写复杂 SQL 用 CTE 提升可读', '每次 schema 变更跑 EXPLAIN diff'],
      antiPatterns: ['"加 index 解千愁"加爆 IO', 'SELECT * 在大宽表', 'ORM 把 N+1 隐藏', '函数包裹列导致索引失效'],
      resources: [
        { title: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com/', type: 'doc' },
        { title: 'PostgreSQL EXPLAIN', url: 'https://www.postgresql.org/docs/current/using-explain.html', type: 'doc' },
        { title: 'High Performance MySQL', url: 'https://www.oreilly.com/library/view/high-performance-mysql/9781492080503/', type: 'book' }
      ],
      maturityLevels: { junior: '能读 EXPLAIN 加索引', mid: '能改写 SQL + schema tuning', senior: '能驱动数据库性能体系与 query governance' }
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

#!/usr/bin/env node
/**
 * 第九轮 batch 10：清空最后 8 个 placeholder atomic
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'atomic-skills');

const PATCHES = {
  'risk-management': {
    name: 'Risk Management',
    nameZh: '风险管理',
    description: 'General risk management framework: identify, analyze, treat and monitor risks across engineering, vendor and project domains.',
    descriptionZh: '通用风险管理框架：识别 / 分析 / 处置 / 监控工程、供应商与项目风险。',
    tags: ['leadership', 'risk', 'governance', 'project', 'process'],
    category: 'leadership',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { type: 'string' },
      domain: { type: 'string', enum: ['engineering', 'project', 'vendor', 'security', 'compliance'] }
    }},
    output: { type: 'object', properties: { riskRegister: { type: 'array' }, treatments: { type: 'array' }, residualRisk: { type: 'object' } } },
    errors: { OWNER_MISSING: { code: 'RM_001', message: '风险无 owner', retryable: false } },
    learning: {
      summaryZh: '风险管理的关键不是消灭风险，是把"未知的不确定"变成"已知的取舍"；reside risk 必须有 owner 签字才算闭环。',
      keyPoints: ['risk = likelihood × impact', '4 种处置（accept / mitigate / transfer / avoid）', 'inherent vs residual 一定区分', 'risk register 持续更新', 'red flag 早升级'],
      bestPractices: ['每 initiative 一份风险登记', '高 residual risk 走 exec 评审', '与 OKR / roadmap 绑定', '定期复盘风险预测准确度'],
      antiPatterns: ['一份 risk register 写完锁柜', '所有风险都 mitigate 不分优先级', 'owner 写「TBD」永远不落实', '只盯技术风险忽视组织 / 供应商风险'],
      resources: [
        { title: 'PMBOK Risk Management', url: 'https://www.pmi.org/pmbok-guide-standards', type: 'doc' },
        { title: 'NIST Risk Management', url: 'https://csrc.nist.gov/projects/risk-management', type: 'doc' },
        { title: 'HBR: Managing Risks', url: 'https://hbr.org/2012/06/managing-risks-a-new-framework', type: 'article' }
      ],
      maturityLevels: { junior: '能识别 / 登记项目风险', mid: '能跑 treatment 决策与 owner 闭环', senior: '能驱动组织级 risk governance 与高管对齐' }
    }
  },

  'security-scan': {
    name: 'Security Scan',
    nameZh: '安全扫描',
    description: 'Run combined security scans (SAST / SCA / container / IaC / secrets) and consolidate findings.',
    descriptionZh: '运行综合安全扫描（SAST / SCA / 容器 / IaC / secret）并合并 finding。',
    tags: ['security', 'scan', 'sast', 'sca', 'devsecops'],
    category: 'security',
    input: { type: 'object', required: ['target'], properties: {
      target: { type: 'string' },
      types: { type: 'array', items: { enum: ['sast', 'sca', 'container', 'iac', 'secret', 'dast'] } }
    }},
    output: { type: 'object', properties: { findings: { type: 'array' }, deduped: { type: 'array' }, riskScore: { type: 'number' } } },
    errors: { TOOL_TIMEOUT: { code: 'SS_001', message: '扫描工具超时', retryable: true } },
    learning: {
      summaryZh: '多类扫描的最大成本不是跑工具，而是去重与分诊；不去重的 finding 列表会让开发疲劳到放弃。',
      keyPoints: ['SAST 看代码 / SCA 看依赖 / IaC 看配置 / secret 看泄漏 / DAST 看运行时', '工具结果合并到 SARIF', 'CVE + reachability + KEV 三维分诊', 'severity threshold 渐进收紧', '把 finding 接 ticket + SLA'],
      bestPractices: ['统一 normalizer（DefectDojo / Faraday）', 'PR / merge / nightly 三档扫描节奏', '高严重度自动建 ticket', 'baseline 留住已知 false positive'],
      antiPatterns: ['每工具独立看不去重', 'severity 全 critical 引发疲劳', '扫描完不接修复流程', '不区分 reachable vs not'],
      resources: [
        { title: 'OWASP DevSecOps', url: 'https://owasp.org/www-project-devsecops-guideline/', type: 'doc' },
        { title: 'DefectDojo', url: 'https://www.defectdojo.org/', type: 'doc' },
        { title: 'SARIF Spec', url: 'https://sarifweb.azurewebsites.net/', type: 'spec' }
      ],
      maturityLevels: { junior: '能跑单类扫描', mid: '能合并多类 + 分诊 + ticket 流', senior: '能驱动组织级 security scan 平台与 SLA 治理' }
    }
  },

  'sre-engineer': {
    name: 'SRE Engineer',
    nameZh: 'SRE 工程师',
    description: 'Operate as an SRE: build SLO-driven reliability, error budgets, on-call, and toil reduction culture.',
    descriptionZh: '以 SRE 视角运营：基于 SLO 驱动可靠性、error budget、on-call 与 toil 削减。',
    tags: ['sre', 'reliability', 'slo', 'on-call', 'toil'],
    category: 'ops',
    input: { type: 'object', required: ['service'], properties: {
      service: { type: 'string' },
      sloTarget: { type: 'number' }
    }},
    output: { type: 'object', properties: { sloDoc: { type: 'string' }, errorBudget: { type: 'object' }, toilReport: { type: 'object' } } },
    errors: { ERROR_BUDGET_EXHAUSTED: { code: 'SRE_001', message: 'error budget 已耗尽', retryable: false } },
    learning: {
      summaryZh: 'SRE 不是"会写代码的运维"，是用工程方法管理可靠性；SLO + error budget 是和产品讨价还价的硬通货。',
      keyPoints: ['SLI → SLO → SLA 由内向外', 'error budget 是发布速度与稳定性 trade-off 单位', 'toil < 50% 工作量', 'blameless culture', 'oncall 健康度同等重要'],
      bestPractices: ['每服务 1-3 个 SLI 不要堆', '错预算耗尽冻发布', '把 toil 季度盘点列优先级', 'oncall 轮换 + handoff 模板'],
      antiPatterns: ['SLO 写了不与产品挂钩', 'error budget 没人看', 'toil 占 80% 工作', 'oncall 长期一两个人扛'],
      resources: [
        { title: 'Google SRE Book', url: 'https://sre.google/sre-book/table-of-contents/', type: 'book' },
        { title: 'SLO Calculator', url: 'https://sre.google/workbook/implementing-slos/', type: 'doc' },
        { title: 'Increment: On-Call', url: 'https://increment.com/on-call/', type: 'article' }
      ],
      maturityLevels: { junior: '能轮 oncall + 写 runbook', mid: '能搭 SLO + error budget 与产品对齐', senior: '能驱动组织级 SRE 文化与跨团队 reliability 战略' }
    }
  },

  'system-watchdog': {
    name: 'System Watchdog',
    nameZh: '系统看门狗',
    description: 'Implement watchdog mechanisms to detect hung processes, stuck queues, and silent failures.',
    descriptionZh: '实现看门狗机制，检测进程卡死 / 队列阻塞 / 静默失败。',
    tags: ['ops', 'watchdog', 'liveness', 'monitoring', 'recovery'],
    category: 'ops',
    input: { type: 'object', required: ['target'], properties: {
      target: { type: 'string' },
      check: { type: 'string', enum: ['heartbeat', 'queue-depth', 'progress-counter', 'log-tail'] },
      intervalSec: { type: 'number', default: 30 }
    }},
    output: { type: 'object', properties: { status: { type: 'string' }, lastBeat: { type: 'string' }, recoveryAction: { type: 'string' } } },
    errors: { NO_HEARTBEAT: { code: 'WD_001', message: '心跳缺失超阈值', retryable: false } },
    learning: {
      summaryZh: '最危险的故障不是 crash，是"还活着但啥都不干"；watchdog 是抓静默失败的最后一道网。',
      keyPoints: ['heartbeat 必须由"工作完成"事件驱动而非定时器', 'queue 深度 + 消费速率两维监控', 'progress counter 比 timestamp 更可信', 'recovery 默认 restart，复杂场景走 playbook', 'self-watchdog 没用，必须外部 watcher'],
      bestPractices: ['systemd watchdog / Kubernetes liveness probe 配齐', 'Dead Man\'s Snitch 反向告警', 'queue lag SLO 化', 'recovery 后必发 alert 不能静默'],
      antiPatterns: ['liveness 内查 DB 自伤', 'heartbeat 是定时器不是任务驱动', 'recovery 不发 alert', 'watchdog 与被监控同进程'],
      resources: [
        { title: 'Dead Man\'s Snitch', url: 'https://deadmanssnitch.com/', type: 'doc' },
        { title: 'Google SRE Book: Monitoring Distributed Systems', url: 'https://sre.google/sre-book/monitoring-distributed-systems/', type: 'book' },
        { title: 'systemd watchdog', url: 'https://www.freedesktop.org/software/systemd/man/sd_notify.html', type: 'doc' }
      ],
      maturityLevels: { junior: '能配置 liveness probe', mid: '能搭 heartbeat + queue lag + dead man switch', senior: '能驱动组织级静默失败治理体系' }
    }
  },

  'tencent-cloud-lighthouse': {
    name: 'Tencent Cloud Lighthouse',
    nameZh: '腾讯云轻量应用服务器',
    description: 'Provision and operate Tencent Cloud Lighthouse instances for small business and prototyping workloads.',
    descriptionZh: '为中小业务与原型场景开通并运营腾讯云轻量应用服务器。',
    tags: ['cloud', 'tencent', 'lighthouse', 'iaas', 'lightweight'],
    category: 'ops',
    input: { type: 'object', required: ['region'], properties: {
      region: { type: 'string' },
      bundle: { type: 'string' },
      image: { type: 'string', enum: ['ubuntu', 'centos', 'debian', 'wordpress', 'docker'] }
    }},
    output: { type: 'object', properties: { instanceId: { type: 'string' }, publicIp: { type: 'string' }, snapshot: { type: 'object' } } },
    errors: { BUNDLE_UNAVAILABLE: { code: 'TCL_001', message: '所选套餐在当前 region 不可用', retryable: false } },
    learning: {
      summaryZh: 'Lighthouse 是腾讯云的"轻量套餐机"，便宜上手快，但弹性 / 安全组 / IAM 比 CVM 弱；适合个人站、原型，不适合生产关键链路。',
      keyPoints: ['套餐式计费（不可拆分）', '内置防火墙 ≠ 完整 SG', '可平滑升级到 CVM', '快照与回滚是基本能力', '海外节点流量套餐有限'],
      bestPractices: ['首次开通走 image 模板减少手动安装', '快照 + 备份双保险', '与 COS / CDN 配套用降成本', 'sshd / fail2ban 必装'],
      antiPatterns: ['当生产 K8s / 高可用使用', '不开快照直接升级被坑', '把同一套餐多业务挤一台', '默认密码不改'],
      resources: [
        { title: '腾讯云 Lighthouse 文档', url: 'https://cloud.tencent.com/document/product/1207', type: 'doc' },
        { title: 'Lighthouse vs CVM', url: 'https://cloud.tencent.com/document/product/1207/45449', type: 'doc' },
        { title: '腾讯云控制台', url: 'https://console.cloud.tencent.com/lighthouse', type: 'doc' }
      ],
      maturityLevels: { junior: '能开通 + SSH 部署应用', mid: '能落地快照备份 + 自动化部署', senior: '能驱动多区域 + 套餐选型策略' }
    }
  },

  'vendor-management': {
    name: 'Vendor Management',
    nameZh: '供应商管理',
    description: 'Evaluate, contract, monitor and exit third-party vendors covering SaaS, infra, and services.',
    descriptionZh: '评估 / 签约 / 监控 / 退出第三方供应商：SaaS / 基础设施 / 服务。',
    tags: ['leadership', 'vendor', 'procurement', 'sla', 'governance'],
    category: 'leadership',
    input: { type: 'object', required: ['vendor'], properties: {
      vendor: { type: 'string' },
      stage: { type: 'string', enum: ['evaluate', 'onboard', 'monitor', 'exit'] }
    }},
    output: { type: 'object', properties: { scorecard: { type: 'object' }, sla: { type: 'object' }, exitPlan: { type: 'string' } } },
    errors: { NO_EXIT_PLAN: { code: 'VM_001', message: '签约时未约定退出策略', retryable: false } },
    learning: {
      summaryZh: '供应商管理的失败 80% 不是选错，是签约时没定义"如何退出"；data export + 替代方案应在合同附件里。',
      keyPoints: ['evaluate（POC + reference）', 'contract（SLA + DPA + exit）', 'monitor（QBR + scorecard）', 'exit（data export + 替代方案）', 'SOC2 / ISO 是入门票'],
      bestPractices: ['scorecard 量化 5-10 项', 'QBR 季度定期', 'critical 供应商必须有 backup', 'price review 每年触发'],
      antiPatterns: ['评估只看 demo 不做 POC', '合同没 exit 条款', 'critical SaaS 单 vendor 锁定', '不监控就续约'],
      resources: [
        { title: 'Gartner Vendor Management', url: 'https://www.gartner.com/en/insights/vendor-management', type: 'article' },
        { title: 'CSA Vendor Risk', url: 'https://cloudsecurityalliance.org/research/topics/third-party-risk-management', type: 'doc' },
        { title: 'NIST SP 800-161', url: 'https://csrc.nist.gov/publications/detail/sp/800-161/rev-1/final', type: 'doc' }
      ],
      maturityLevels: { junior: '能跟单一 vendor onboard', mid: '能跑 evaluate → contract → monitor 全流程', senior: '能驱动组织级 vendor governance 与 third-party risk' }
    }
  },

  'performance-testing': {
    name: 'Performance Testing',
    nameZh: '性能测试',
    description: 'Design and execute performance tests covering load, stress, spike, soak with realistic workload modeling.',
    descriptionZh: '设计并执行性能测试：负载 / 压力 / 突发 / 长时，配合真实 workload 建模。',
    tags: ['testing', 'performance', 'load', 'stress', 'k6'],
    category: 'testing',
    input: { type: 'object', required: ['target'], properties: {
      target: { type: 'string' },
      pattern: { type: 'string', enum: ['load', 'stress', 'spike', 'soak'] },
      tool: { type: 'string', enum: ['k6', 'jmeter', 'gatling', 'locust', 'wrk'] }
    }},
    output: { type: 'object', properties: { metrics: { type: 'object' }, bottleneck: { type: 'string' }, recommendation: { type: 'array' } } },
    errors: { UNREALISTIC_LOAD: { code: 'PT_001', message: '负载模型与生产差异过大', retryable: false } },
    learning: {
      summaryZh: '性能测试最大谎言是"压不出问题"——往往不是系统强，而是 workload 不真实；rps 数字之外的 think time / 分布更关键。',
      keyPoints: ['load / stress / spike / soak 各有目的', 'percentile（p95/p99）> 平均值', '基于真实流量生成 workload 模型', '区分 closed model（吞吐）vs open model（到达）', 'soak 暴露内存泄漏'],
      bestPractices: ['k6 / Gatling 写代码化场景', '与 APM 联动找瓶颈', '压测前先做基线', '失败注入 + 性能并行做'],
      antiPatterns: ['只发 GET 不发 POST', 'rps 拉满没 think time', '只看平均不看 p99', '一次跑完不复测变化'],
      resources: [
        { title: 'k6.io', url: 'https://k6.io/docs/', type: 'doc' },
        { title: 'Brendan Gregg: Performance', url: 'https://www.brendangregg.com/methodology.html', type: 'article' },
        { title: 'Performance Testing Guidance', url: 'https://learn.microsoft.com/en-us/previous-versions/msp-n-p/bb924375(v=pandp.10)', type: 'doc' }
      ],
      maturityLevels: { junior: '能跑基础 k6 / wrk', mid: '能建 workload 模型 + 找瓶颈', senior: '能驱动组织级容量规划与性能基线' }
    }
  },

  'zero-trust-cloud': {
    name: 'Zero Trust Cloud',
    nameZh: '零信任云',
    description: 'Implement zero trust architecture in cloud: identity-aware proxy, micro-segmentation, continuous verification.',
    descriptionZh: '在云端实施零信任架构：身份感知代理 / 微分段 / 持续验证。',
    tags: ['security', 'zero-trust', 'cloud', 'identity', 'micro-segmentation'],
    category: 'security',
    input: { type: 'object', required: ['scope'], properties: {
      scope: { type: 'string' },
      pillar: { type: 'string', enum: ['identity', 'device', 'network', 'application', 'data'] }
    }},
    output: { type: 'object', properties: { architecture: { type: 'object' }, policies: { type: 'array' }, gaps: { type: 'array' } } },
    errors: { LEGACY_TRUST_PRESENT: { code: 'ZT_001', message: '存在隐式信任的遗留路径', retryable: false } },
    learning: {
      summaryZh: '零信任不是产品，是"never trust, always verify"的实施路线；先收身份与网络，再收设备与数据，最后是应用。',
      keyPoints: ['身份是新边界（identity-first）', 'BeyondCorp / NIST SP 800-207 是标准', 'IAP（Identity-Aware Proxy）替代 VPN', 'micro-segmentation 替代扁平网络', '持续验证 > 一次认证'],
      bestPractices: ['SSO + MFA + 设备状态绑定', 'IAP 灰度替换 VPN', '应用层做 mTLS + service mesh', '日志统一到 SIEM 做 continuous verification'],
      antiPatterns: ['VPN 一通就是 flat 网络', '设备状态不进 trust 决策', 'mTLS 只在新服务，旧服务豁免', '一次认证终身有效'],
      resources: [
        { title: 'NIST SP 800-207', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf', type: 'doc' },
        { title: 'BeyondCorp', url: 'https://cloud.google.com/beyondcorp', type: 'doc' },
        { title: 'Cloudflare Zero Trust', url: 'https://www.cloudflare.com/zero-trust/', type: 'doc' }
      ],
      maturityLevels: { junior: '能解释 zero trust 五支柱', mid: '能落地 IAP + MFA + 微分段', senior: '能驱动组织级 zero trust 战略与多年路线图' }
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

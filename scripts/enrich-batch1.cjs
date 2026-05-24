#!/usr/bin/env node
/**
 * 第五轮 batch 1：Top 12 高频 atomic 注入 learning 节（六字段）。
 * 仅追加 learning，不破坏既有字段；若文件已有 learning 则跳过。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'atomic-skills');

const LEARNING = {
  'write-file': {
    summaryZh: '写文件是 agent 与外部世界交互的最危险动作之一：一次错误的覆盖足以让一整天的工作付诸东流。',
    keyPoints: [
      '区分 create / overwrite / append 三种语义，不能混用',
      '写之前先校验目标路径白名单与禁写名单（.env / secrets/ / *.key）',
      '大文件写入应分块（streaming），避免一次性占满内存',
      '原子写入需 write-temp + rename，避免中途崩溃产生半文件',
      '编码必须显式指定（UTF-8），不要依赖系统默认',
      '权限必须最小化：默认 0644，敏感文件 0600'
    ],
    bestPractices: [
      '所有写操作必须先经 dryRun / diff 阶段供人类确认',
      '失败回滚：写前快照原内容，失败时恢复',
      '为 agent 配置 sandbox：把 workspace 之外路径全部 deny',
      '对二进制写入使用 Buffer 而非 string 拼接',
      '日志中只记录 path + bytesWritten，不要把 content 全文落盘'
    ],
    antiPatterns: [
      '直接 fs.writeFileSync 全量覆盖未做幂等校验',
      '把用户输入路径直接拼接到目标地址（路径穿越）',
      '为了"一次成功"而把 maxFileSize 上限调到无穷',
      '在循环里同步写小文件（应改为批量或异步并发）',
      '失败后无回滚，留下半文件污染下游'
    ],
    resources: [
      { title: 'Node.js fs.promises 官方文档', url: 'https://nodejs.org/api/fs.html#promises-api', type: 'doc' },
      { title: 'Atomic file writes (write-file-atomic)', url: 'https://github.com/npm/write-file-atomic', type: 'doc' },
      { title: 'OWASP Path Traversal', url: 'https://owasp.org/www-community/attacks/Path_Traversal', type: 'article' }
    ],
    maturityLevels: {
      junior: '能正确调用 writeFile 写入指定路径，知道处理 ENOENT / EACCES',
      mid: '能实现原子写入、路径白名单、回滚机制，处理大文件流式写入',
      senior: '能为 agent runtime 设计沙箱写入策略，包含审计日志、配额控制、敏感路径拦截'
    }
  },

  'run-shell-command': {
    summaryZh: '执行 shell 命令是 agent 能力最强但最危险的操作；输入消毒、超时、白名单是三道生死线。',
    keyPoints: [
      '永远不要用 string 拼接构造命令，必须用 argv 数组',
      '必须设超时（默认 ≤30s），无超时等于无穷阻塞',
      '必须设最大输出缓冲（防止 OOM 和日志爆炸）',
      'env 显式传递，避免污染来自宿主的敏感变量',
      'shell: false 是默认值，shell: true 仅在显式需要管道时打开',
      '退出码非 0 ≠ 失败：grep / diff 等以非 0 表达正常状态'
    ],
    bestPractices: [
      '建立命令白名单（git / ls / cat...）+ 黑名单（rm -rf / curl ... | sh）',
      '通过 spawn 而非 exec 处理大输出，stream 转 line-by-line',
      '为高危命令引入二次确认（destructive=true 标记）',
      '所有命令执行落审计日志：cmd / args / cwd / exitCode / duration',
      '在容器或 chroot 中跑非可信命令'
    ],
    antiPatterns: [
      'execSync(`rm -rf ${userInput}`) — 命令注入经典反例',
      '不设超时导致 agent 卡死',
      '把 stdout 全量塞回 LLM context 导致 token 爆炸',
      '依赖 shell 解析特殊字符却没引号转义',
      '在生产环境直接以 root 跑 agent 命令'
    ],
    resources: [
      { title: 'Node.js child_process 官方文档', url: 'https://nodejs.org/api/child_process.html', type: 'doc' },
      { title: 'OWASP Command Injection', url: 'https://owasp.org/www-community/attacks/Command_Injection', type: 'article' },
      { title: 'execa: better child_process', url: 'https://github.com/sindresorhus/execa', type: 'doc' }
    ],
    maturityLevels: {
      junior: '能用 spawn 安全执行预定义命令，处理 exit code 和超时',
      mid: '能设计命令白名单 + 沙箱，处理流式大输出与跨平台差异',
      senior: '能为 agent 平台制定命令安全规范，含审计、配额、危险动作拦截策略'
    }
  },

  'read-file': {
    summaryZh: '读文件看似简单，但路径穿越、编码错乱、超大文件三类问题足以让一个 agent 失控。',
    keyPoints: [
      '路径必须 resolve + 校验是否落在 workspace 内',
      '默认 UTF-8，遇二进制（图片/PDF）走专用 reader',
      '超过阈值的大文件应只读前 N 行或返回 stream 句柄',
      '隐私敏感文件（.env / id_rsa / *.pem）默认禁读',
      '读到的内容不应直接喂给 LLM，要先做 size / 类型判断'
    ],
    bestPractices: [
      'fs.promises.readFile + 显式 encoding，避免 Buffer 误用',
      '提供 lineRange 参数（startLine / endLine）以支持节选',
      '对超大文件用 readline 流式读取，每读一行可终止',
      '检测 BOM 并正确处理 UTF-16 / GBK 等遗留编码',
      '审计日志记录被读取的 path 与 byteCount'
    ],
    antiPatterns: [
      '把 10GB 日志一次 readFile 进内存导致 OOM',
      '不校验路径直接读取 ../../etc/passwd',
      '盲目把整个文件塞进 LLM prompt 触发上下文超限',
      '忽略 EISDIR / ENOENT / EACCES 错误统一抛 generic error',
      '读取二进制文件不做 base64 转码导致下游解析错乱'
    ],
    resources: [
      { title: 'Node.js readline streaming', url: 'https://nodejs.org/api/readline.html', type: 'doc' },
      { title: 'How big is too big? File size in LLM context', url: 'https://www.anthropic.com/news/contextual-retrieval', type: 'article' }
    ],
    maturityLevels: {
      junior: '能正确读取小文件、处理常见错误码、识别编码',
      mid: '能流式读大文件、实现 lineRange / 节选、设计路径沙箱',
      senior: '能为 agent 设计读文件策略：分级阈值、敏感路径拦截、与 LLM context 协同'
    }
  },

  'api-call': {
    summaryZh: 'API 调用是 agent 与外部系统对接的主要通道，重试、限流、超时、签名是基本功。',
    keyPoints: [
      '必须设连接超时与读取超时，且 < 上游 SLA',
      '幂等性：GET/PUT/DELETE 天然幂等，POST 需 Idempotency-Key',
      '重试策略用指数退避 + jitter，并区分可重试错误（5xx / 429 / 网络）与不可重试（4xx 业务）',
      '认证凭据从 Secret Manager 拉取，禁止硬编码',
      '响应必须设最大 size，避免攻击者用大响应体打爆',
      '所有出站请求要走统一 HTTP Client（共享重试、metrics、tracing）'
    ],
    bestPractices: [
      '使用熔断器（circuit breaker）保护下游，连续失败自动切断',
      '为每个出站调用注入 trace_id / x-request-id',
      '记录 latency / status / size 三件套指标到 Prometheus',
      '实现 rate-limit 客户端：尊重 Retry-After 与 X-RateLimit-* 响应头',
      '对外部 API 写 contract test，依赖更新前先跑'
    ],
    antiPatterns: [
      '不设超时导致 agent 整体卡死',
      '4xx 也无脑重试，浪费配额',
      '把响应全量塞 LLM context',
      'API key 写在代码或日志里',
      '对幂等性无概念，重复扣费 / 双发邮件'
    ],
    resources: [
      { title: 'Google SRE: Handling Overload', url: 'https://sre.google/sre-book/handling-overload/', type: 'doc' },
      { title: 'AWS Architecture: Exponential Backoff and Jitter', url: 'https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/', type: 'article' },
      { title: 'Stripe Idempotent Requests', url: 'https://stripe.com/docs/api/idempotent_requests', type: 'doc' }
    ],
    maturityLevels: {
      junior: '能正确发起 GET/POST 请求、处理 status / 超时 / 基础认证',
      mid: '能实现重试 / 熔断 / 限流客户端、写 contract test',
      senior: '能设计跨服务出站调用治理：统一 client / 全局 SLO / 熔断策略 / 凭据轮换'
    }
  },

  'run-tests': {
    summaryZh: '跑测试不只是 npm test：它是 agent 决定"我是否完成"的核心信号源，必须可信、快速、可重放。',
    keyPoints: [
      'unit / integration / e2e 必须分层独立可跑',
      '测试必须可在隔离沙箱跑，不依赖宿主网络与共享数据库',
      '失败信号要清晰：exitCode + 结构化报告（JUnit XML / JSON）',
      '关注 flaky test：连续 3 次结果不一致的应隔离',
      'coverage 不是越高越好，关键路径优先于 100%'
    ],
    bestPractices: [
      'CI 先跑 unit（< 1 分钟），通过后再跑 integration / e2e',
      '使用 --bail 让首个失败立即终止，节省反馈时间',
      '为 e2e 提供独立 fixture，每次跑前重建',
      '把 flaky test 标记为 quarantine 而非禁用，持续修复',
      '保留最近 N 次运行 trend，识别回归与缓慢退化'
    ],
    antiPatterns: [
      '所有测试一锅端跑，反馈周期 > 30 分钟',
      '为了让 CI 绿色而 skip 失败用例',
      '测试依赖外部真实网络，导致本地无法重放',
      '靠 sleep 等异步事件，造成 flaky',
      'coverage 数字游戏：写无断言的"伪测试"刷指标'
    ],
    resources: [
      { title: 'Google Testing Blog: Test Sizes', url: 'https://testing.googleblog.com/2010/12/test-sizes.html', type: 'article' },
      { title: 'Martin Fowler: Test Pyramid', url: 'https://martinfowler.com/articles/practical-test-pyramid.html', type: 'article' },
      { title: 'Flaky Tests at Google', url: 'https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html', type: 'article' }
    ],
    maturityLevels: {
      junior: '能本地跑 unit / e2e，读懂失败报告并修复',
      mid: '能维护 CI pipeline、设计测试分层、处理 flaky test',
      senior: '能为团队制定测试策略：金字塔层级、coverage 政策、flaky 治理、隔离沙箱建设'
    }
  },

  'analyze-code': {
    summaryZh: '代码分析是 agent 修改代码前的必修课：先读懂依赖、调用图、测试覆盖，再动刀。',
    keyPoints: [
      '静态分析（AST / linter / type checker）+ 动态分析（profile / trace）双管齐下',
      'agent 应先建立"修改半径"：哪些文件、哪些 caller 受影响',
      'circular dependency / dead code / 重复代码是常见信号',
      '复杂度指标（cyclomatic / cognitive）作为 review 触发阈值',
      '安全分析单独一档（CodeQL / Semgrep），不与质量分析混淆'
    ],
    bestPractices: [
      '用语言官方 LSP / type checker 拿到精确符号信息',
      '用 ts-morph / tree-sitter 做跨语言 AST 分析',
      '把分析结果存为 graph，便于 agent 多轮查询',
      '为热点函数建立 baseline 性能指标，回归时报警',
      '分析结果应可解释：每条结论附文件 + 行号 + 引用'
    ],
    antiPatterns: [
      '只用 grep 找用法，错过反射 / 字符串调用',
      '改完代码不重新分析依赖，连锁断裂',
      '把分析报告整段塞 LLM 而不抽取关键事实',
      '忽略 type warning，认为"能跑就行"',
      '安全扫描结果石沉大海，无人 triage'
    ],
    resources: [
      { title: 'tree-sitter: incremental parsing', url: 'https://tree-sitter.github.io/tree-sitter/', type: 'doc' },
      { title: 'Semgrep: lightweight static analysis', url: 'https://semgrep.dev/', type: 'doc' },
      { title: 'Sourcegraph code intelligence', url: 'https://sourcegraph.com/docs/code-search', type: 'doc' }
    ],
    maturityLevels: {
      junior: '能读懂 linter / type checker 报告，找到调用点',
      mid: '能用 AST 工具分析跨文件依赖，识别循环引用与 dead code',
      senior: '能设计 agent 的代码分析 pipeline：图建模 / 修改半径 / baseline 性能 / 安全闭环'
    }
  },

  'http-health-check': {
    summaryZh: '健康检查是服务的脉搏：liveness / readiness / startup 三类语义不能混淆。',
    keyPoints: [
      'liveness：进程是否活着（失败重启）',
      'readiness：是否准备好接流量（失败摘流）',
      'startup：是否完成启动（避免启动期 liveness 误杀）',
      '健康端点本身必须超快、无外部依赖',
      '健康检查不应消耗业务配额或写日志'
    ],
    bestPractices: [
      '健康端点路径标准化：/healthz / /readyz / /startupz',
      'readiness 应聚合关键依赖（DB / cache / 上游）状态',
      '响应体保持极简（200 / 503 + JSON），便于 LB 解析',
      '为 K8s 配置合理 periodSeconds + failureThreshold',
      '加入 timeout，避免被慢检查拖死'
    ],
    antiPatterns: [
      'liveness 检查跑业务查询，导致雪崩自杀',
      'readiness 不检查依赖，启动后立即收流但 500 全部',
      '健康端点开认证，自检失败',
      '把健康检查日志当业务日志输出，刷爆磁盘',
      'failureThreshold = 1，网络抖动直接重启'
    ],
    resources: [
      { title: 'Kubernetes Liveness/Readiness Probes', url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/', type: 'doc' },
      { title: 'Microsoft: Health Endpoint Monitoring Pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/health-endpoint-monitoring', type: 'article' }
    ],
    maturityLevels: {
      junior: '能实现 /healthz 返回 200，理解 liveness vs readiness',
      mid: '能设计聚合依赖的 readiness、配置合理 K8s probe 参数',
      senior: '能为大型系统设计健康检查体系：分级语义 / 雪崩保护 / 与 SLO 关联'
    }
  },

  'parse-json-log': {
    summaryZh: 'JSON 日志解析是可观测性入口：schema 漂移、超大行、嵌套字段是三大坑。',
    keyPoints: [
      '日志单行 JSON（NDJSON）是事实标准，禁用多行 pretty print',
      '必须容忍 schema 漂移：未知字段忽略、缺失字段默认值',
      '超长行（> 1MB）应截断或转 reference 存对象存储',
      '时间字段用 ISO 8601 + 时区，禁用本地时间',
      'level / service / trace_id 是检索黄金三件套'
    ],
    bestPractices: [
      '解析失败的行进 dead-letter，不丢弃，便于回溯',
      '用 streaming JSON parser 处理大批量日志',
      '把嵌套对象 flatten 成 dot notation，方便索引',
      '为关键字段建立 schema 版本，向后兼容',
      '解析后注入 ingestion_time，识别延迟链路'
    ],
    antiPatterns: [
      '用 JSON.parse 一行一行同步 parse 100k 行，CPU 拉满',
      '解析失败直接 drop 日志，事故复盘无证据',
      '把整个 message 字段 base64 后塞进搜索引擎',
      '不区分 level，全部当 INFO 索引爆磁盘',
      'trace_id 缺失却号称"我们有可观测"'
    ],
    resources: [
      { title: 'NDJSON spec', url: 'http://ndjson.org/', type: 'doc' },
      { title: 'OpenTelemetry Logs Data Model', url: 'https://opentelemetry.io/docs/specs/otel/logs/data-model/', type: 'doc' },
      { title: 'Elastic Common Schema (ECS)', url: 'https://www.elastic.co/guide/en/ecs/current/index.html', type: 'doc' }
    ],
    maturityLevels: {
      junior: '能 parse NDJSON、提取 level / message / timestamp',
      mid: '能处理 schema 漂移、dead-letter、流式 parse 大文件',
      senior: '能制定全公司日志规范：schema 版本 / 关键字段 / 与 trace 关联'
    }
  },

  'database-query': {
    summaryZh: '数据库查询是 agent 接触真实业务的关键路径，注入、慢查询、锁三把刀必须先收好。',
    keyPoints: [
      '永远使用参数化查询，禁止字符串拼接',
      '只读连接与读写连接分离，agent 默认走只读',
      '所有查询必须有超时与最大行数限制',
      'EXPLAIN 是改 SQL 前的必修课',
      '事务保持短小，避免 long-running transaction 锁表'
    ],
    bestPractices: [
      '为 agent 配置 row-level / column-level 权限，限制可见数据',
      '关键查询加 statement_timeout（PG）/ MAX_EXECUTION_TIME（MySQL）',
      'N+1 查询用 JOIN / IN / DataLoader 批量化',
      '使用 read replica 跑分析型查询，避免影响 OLTP',
      '把慢查询日志接入 Prometheus 与告警'
    ],
    antiPatterns: [
      '`SELECT * FROM users WHERE id=` + userInput — 注入经典',
      'SELECT * 拉百万行进 agent context',
      '在循环里跑单条 SQL（N+1）',
      '事务里 sleep 或调外部 API，长时间持锁',
      '生产库直连 agent 无审计无配额'
    ],
    resources: [
      { title: 'Use The Index, Luke', url: 'https://use-the-index-luke.com/', type: 'doc' },
      { title: 'PostgreSQL EXPLAIN', url: 'https://www.postgresql.org/docs/current/using-explain.html', type: 'doc' },
      { title: 'OWASP SQL Injection', url: 'https://owasp.org/www-community/attacks/SQL_Injection', type: 'article' }
    ],
    maturityLevels: {
      junior: '能写参数化查询，看懂 EXPLAIN 主要算子',
      mid: '能优化索引、消除 N+1、配置超时与行数限制',
      senior: '能为 agent 平台设计数据库访问治理：行列权限 / 审计 / 慢查询闭环 / 读写分离'
    }
  },

  'docker-exec': {
    summaryZh: '在容器里跑命令是 agent 隔离危险动作的首选沙箱，但配置错了反而是最大攻击面。',
    keyPoints: [
      '默认非 root（USER 1000），禁用 --privileged',
      '只挂载必要 volume，禁挂 docker.sock 与 / 根目录',
      '设资源限制：--cpus / --memory / --pids-limit',
      '网络默认 none 或专属 bridge，按需开放',
      '执行前 image digest 锁定，避免 latest tag 被偷换'
    ],
    bestPractices: [
      '为每次 exec 创建一次性容器（--rm），不复用',
      '使用 read-only 文件系统 + tmpfs /tmp',
      'Capabilities drop ALL，按需 add',
      '采集容器 stdout/stderr 到统一日志，不落容器内',
      '为高危镜像跑 trivy / grype 扫漏洞'
    ],
    antiPatterns: [
      '挂 -v /:/host 直接逃逸',
      '--privileged + --network host 给 agent，等同裸跑',
      '镜像用 :latest，无版本固定',
      '一个容器里跑多个 exec，状态污染',
      '把 secrets 通过 ENV 传入并 docker inspect 暴露'
    ],
    resources: [
      { title: 'Docker security best practices', url: 'https://docs.docker.com/engine/security/', type: 'doc' },
      { title: 'CIS Docker Benchmark', url: 'https://www.cisecurity.org/benchmark/docker', type: 'doc' },
      { title: 'gVisor: container sandbox', url: 'https://gvisor.dev/', type: 'doc' }
    ],
    maturityLevels: {
      junior: '能 docker run 跑命令、理解 -v / -e / --rm 含义',
      mid: '能配置非 root、资源限制、capabilities drop、image 锁定',
      senior: '能为 agent 平台设计容器沙箱体系：镜像扫描 / runtime 加固 / 逃逸检测 / 配额治理'
    }
  },

  'validate-k8s-manifest': {
    summaryZh: 'K8s manifest 校验是阻止"上线即事故"的最后一道闸：schema / 策略 / 安全三层都要过。',
    keyPoints: [
      'schema 校验（kubeval / kubeconform）确保字段合法',
      '策略校验（OPA / Kyverno）确保符合组织规则',
      '安全校验（kube-linter / Polaris）防 privileged / 无 limits',
      '配置校验（kustomize build）确保 overlay 渲染正确',
      'CI 中失败即阻断，不发布破坏性 manifest'
    ],
    bestPractices: [
      '把 kubeconform + kyverno + kube-linter 放进 pre-commit',
      '为不同环境维护 policy bundle（dev / stg / prod 严苛度递增）',
      'mutating policy 自动注入 limits / probes，减少人为失误',
      '与 GitOps 联动：违反策略的 PR 自动 block',
      '校验报告附文件 + 行号 + 修复建议，便于研发修复'
    ],
    antiPatterns: [
      '只跑 kubectl apply --dry-run=client，错过策略层问题',
      'CI 校验失败但不阻断，问题滚到生产',
      '所有环境共享同一套策略，导致 dev 限制过死或 prod 太松',
      '每次新建集群手写 manifest，无 schema check',
      '安全策略只测试不强制，开发绕过即可'
    ],
    resources: [
      { title: 'kubeconform', url: 'https://github.com/yannh/kubeconform', type: 'doc' },
      { title: 'Kyverno', url: 'https://kyverno.io/docs/', type: 'doc' },
      { title: 'kube-linter', url: 'https://docs.kubelinter.io/', type: 'doc' }
    ],
    maturityLevels: {
      junior: '能用 kubeconform 跑 schema 校验，看懂常见报错',
      mid: '能编写 Kyverno / OPA 策略，整合到 CI',
      senior: '能为平台设计多环境策略体系，覆盖 schema / 策略 / 安全 / GitOps 闭环'
    }
  },

  'data-quality': {
    summaryZh: '数据质量决定下游一切决策的可信度：完整性、准确性、一致性、时效性是四大支柱。',
    keyPoints: [
      '六维度：completeness / accuracy / consistency / timeliness / uniqueness / validity',
      '质量指标必须可量化（pass rate %、null rate %、freshness lag）',
      '质量检查应分层：schema / 行级 / 业务规则 / 跨表',
      '坏数据进 quarantine 而非直接丢弃，便于回溯修复',
      'SLA 化数据质量：每条核心数据集都有 freshness / accuracy SLO'
    ],
    bestPractices: [
      '使用 Great Expectations / Soda / dbt tests 做声明式校验',
      '在 pipeline 关键节点设 quality gate，不达标即停',
      '与 lineage 工具（OpenLineage）联动定位坏数据起源',
      '建立 data contract：上游对 schema / 频率 / 含义负责',
      '质量指标与业务指标一起进 dashboard，让 PM 也看得见'
    ],
    antiPatterns: [
      '只在最终报表层做校验，污染早已扩散',
      'null rate 99% 也照样发出去，第二天用户投诉',
      '坏数据直接 DELETE，事后无法复盘',
      '没有 freshness 监控，仪表盘显示昨天的"今日数据"',
      '质量规则散落各处，无人 owner'
    ],
    resources: [
      { title: 'Great Expectations 文档', url: 'https://docs.greatexpectations.io/', type: 'doc' },
      { title: 'dbt tests', url: 'https://docs.getdbt.com/docs/build/tests', type: 'doc' },
      { title: 'Data Contracts (Chad Sanderson)', url: 'https://dataproducts.substack.com/p/the-rise-of-data-contracts', type: 'article' }
    ],
    maturityLevels: {
      junior: '能写 not-null / unique / range 等基础规则，识别明显异常',
      mid: '能搭建 quality gate、quarantine 机制、freshness 监控',
      senior: '能在组织层推动 data contract / SLO 化数据质量 / lineage 闭环'
    }
  }
};

let updated = 0, skipped = 0;
for (const [id, learning] of Object.entries(LEARNING)) {
  const file = path.join(ROOT, `${id}.json`);
  if (!fs.existsSync(file)) {
    console.error(`❌ ${id}: file not found`);
    continue;
  }
  const raw = fs.readFileSync(file, 'utf-8');
  const obj = JSON.parse(raw);
  if (obj.learning) {
    skipped++;
    console.log(`⏭  ${id}: already has learning, skip`);
    continue;
  }
  obj.learning = learning;
  if (!obj.errors) obj.errors = {};
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');
  updated++;
  console.log(`✅ ${id}: learning injected`);
}
console.log(`\nDone. updated=${updated} skipped=${skipped}`);

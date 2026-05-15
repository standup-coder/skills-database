#!/usr/bin/env python3
"""Add resources to skills that have knowledgePoints but no resources."""

import re

SKILL_RESOURCES = {
    'prometheus-monitoring': [
        {'title': 'Prometheus 官方文档', 'url': 'https://prometheus.io/docs/', 'type': 'doc', 'source': 'Prometheus'},
        {'title': 'PromQL 查询语言', 'url': 'https://prometheus.io/docs/prometheus/latest/querying/basics/', 'type': 'doc', 'source': 'Prometheus'},
        {'title': 'Alertmanager 配置指南', 'url': 'https://prometheus.io/docs/alerting/latest/configuration/', 'type': 'doc', 'source': 'Prometheus'},
        {'title': 'Grafana + Prometheus 教程', 'url': 'https://grafana.com/docs/grafana/latest/datasources/prometheus/', 'type': 'doc', 'source': 'Grafana'},
        {'title': 'Prometheus 监控实战（Bilibili）', 'url': 'https://www.bilibili.com/video/BV1yV411p7F4/', 'type': 'video', 'source': 'Bilibili'},
        {'title': 'Node Exporter 监控', 'url': 'https://github.com/prometheus/node_exporter', 'type': 'doc', 'source': 'Prometheus'}
    ],
    'grafana-dashboard': [
        {'title': 'Grafana 官方文档', 'url': 'https://grafana.com/docs/', 'type': 'doc', 'source': 'Grafana'},
        {'title': 'Grafana 面板配置', 'url': 'https://grafana.com/docs/grafana/latest/panels/', 'type': 'doc', 'source': 'Grafana'},
        {'title': 'Dashboard 模板', 'url': 'https://grafana.com/dashboards', 'type': 'tutorial', 'source': 'Grafana'},
        {'title': 'Grafana Loki 日志', 'url': 'https://grafana.com/docs/loki/latest/', 'type': 'doc', 'source': 'Grafana'},
        {'title': '变量与模板', 'url': 'https://grafana.com/docs/grafana/latest/dashboards/variables/', 'type': 'doc', 'source': 'Grafana'},
        {'title': 'Provisioning 自动化', 'url': 'https://grafana.com/docs/grafana/latest/administration/provisioning/', 'type': 'doc', 'source': 'Grafana'}
    ],
    'logging-observability': [
        {'title': '可观测性三大支柱', 'url': 'https://opentelemetry.io/docs/concepts/observability/', 'type': 'doc', 'source': 'OpenTelemetry'},
        {'title': 'Loki 日志系统', 'url': 'https://grafana.com/docs/loki/latest/', 'type': 'doc', 'source': 'Grafana'},
        {'title': 'Elasticsearch 官方文档', 'url': 'https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html', 'type': 'doc', 'source': 'Elastic'},
        {'title': 'OpenTelemetry 官方', 'url': 'https://opentelemetry.io/docs/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'Jaeger 分布式追踪', 'url': 'https://www.jaegertracing.io/docs/', 'type': 'doc', 'source': 'Jaeger'},
        {'title': '日志分析教程（GitHub）', 'url': 'https://github.com/nyaapantsu/anti-patterns-logging', 'type': 'tutorial', 'source': 'GitHub'}
    ],
    'incident-response': [
        {'title': 'Google SRE 故障响应', 'url': 'https://sre.google/workbook/incident-response/', 'type': 'tutorial', 'source': 'Google SRE'},
        {'title': 'PagerDuty 故障管理', 'url': 'https://www.pagerduty.com/resources/learn/incident-response/', 'type': 'tutorial', 'source': 'PagerDuty'},
        {'title': 'Status Page 最佳实践', 'url': 'https://www.atlassian.com/incident-management/incident-response/communication', 'type': 'tutorial', 'source': 'Atlassian'},
        {'title': '故障复盘指南', 'url': 'https://sre.google/resources/simplify-complexity/conducting-effective-and-constructive-critiques/', 'type': 'tutorial', 'source': 'Google SRE'},
        {'title': 'Chaos Engineering 入门', 'url': 'https://principlesofchaos.org/', 'type': 'tutorial', 'source': 'Chaos Engineering'},
        {'title': 'GameDay 演练实践', 'url': 'https://www.gremlin.com/company/blog/run-game-days-like-netflix', 'type': 'tutorial', 'source': 'Gremlin'}
    ],
    'incident-runbook': [
        {'title': 'Runbook 模板库', 'url': 'https://www.atlassian.com/itsm/knowledge-management/runbook', 'type': 'tutorial', 'source': 'Atlassian'},
        {'title': 'Runbook 自动化指南', 'url': 'https://www.pagerduty.com/blog/automated-runbooks/', 'type': 'tutorial', 'source': 'PagerDuty'},
        {'title': 'SOAR 集成教程', 'url': 'https://www.paloaltonetworks.com/cybermesh/what-is-soar', 'type': 'tutorial', 'source': 'Palo Alto Networks'},
        {'title': 'Incident Runbook 示例', 'url': 'https://github.com/pagerduty/runbook-templates', 'type': 'tutorial', 'source': 'GitHub'},
        {'title': 'SRE Runbook 最佳实践', 'url': 'https://sre.google/workbook/how-to-run-a-production-review/', 'type': 'tutorial', 'source': 'Google SRE'},
        {'title': 'Runbook 工具对比', 'url': 'https://www.atlassian.com/software/confluence/compare/runbook-tools', 'type': 'tutorial', 'source': 'Atlassian'}
    ],
    'oncall-management': [
        {'title': 'On-Call 最佳实践', 'url': 'https://www.pagerduty.com/resources/learn/on-call-best-practices/', 'type': 'tutorial', 'source': 'PagerDuty'},
        {'title': 'Alert Fatigue 指南', 'url': 'https://sre.google/workbook/managing-alert-quality/', 'type': 'tutorial', 'source': 'Google SRE'},
        {'title': 'Oncall 工具配置', 'url': 'https://www.pagerduty.com/docs/', 'type': 'doc', 'source': 'PagerDuty'},
        {'title': '值班轮转设计', 'url': 'https://devops.com/how-to-design-an-on-call-schedule/', 'type': 'tutorial', 'source': 'DevOps'},
        {'title': 'MTTR 改进指南', 'url': 'https://www.atlassian.com/incident-management/kpis/mean-time-to-resolution', 'type': 'tutorial', 'source': 'Atlassian'},
        {'title': 'Oncall 健康与福祉', 'url': 'https://sre.google/workbook/implementing-slo/', 'type': 'tutorial', 'source': 'Google SRE'}
    ],
    'slo-management': [
        {'title': 'Google SRE SLO 指南', 'url': 'https://sre.google/workbook/implementing-slo/', 'type': 'tutorial', 'source': 'Google SRE'},
        {'title': 'SLO 官方文档', 'url': 'https://cloud.google.com/blog/products/containers-kubernetes/understanding-slos', 'type': 'tutorial', 'source': 'Google Cloud'},
        {'title': 'Error Budget 策略', 'url': 'https://www.atlassian.com/incident-management/kpis/error-budget', 'type': 'tutorial', 'source': 'Atlassian'},
        {'title': 'Burn Rate Alert 教程', 'url': 'https://sre.google/workbook/slo-document/', 'type': 'tutorial', 'source': 'Google SRE'},
        {'title': 'SLO 工具箱', 'url': 'https://github.com/prometheus/slo-alerts', 'type': 'tutorial', 'source': 'GitHub'},
        {'title': 'SLO 实现指南', 'url': 'https://www.youtube.com/watch?v=n2y4P7E5VH0', 'type': 'video', 'source': 'YouTube'}
    ],
    'cost-optimization': [
        {'title': 'AWS 成本优化指南', 'url': 'https://docs.aws.amazon.com/cost-management/', 'type': 'doc', 'source': 'AWS'},
        {'title': 'FinOps 最佳实践', 'url': 'https://www.finops.org/framework/', 'type': 'tutorial', 'source': 'FinOps Foundation'},
        {'title': 'Kubecost 监控', 'url': 'https://www.kubecost.com/docs/', 'type': 'doc', 'source': 'Kubecost'},
        {'title': 'Reserved Instance 策略', 'url': 'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ri-basics.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'Spot 实例最佳实践', 'url': 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html', 'type': 'doc', 'source': 'AWS'},
        {'title': '云成本优化视频课程', 'url': 'https://www.bilibili.com/video/BV1f54y1m7Tx/', 'type': 'video', 'source': 'Bilibili'}
    ],
    'platform-healthcheck': [
        {'title': 'Kubernetes 检查清单', 'url': 'https://kubernetes.io/docs/tasks/debug/debug-cluster/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'kube-bench 安全基准', 'url': 'https://github.com/aquasecurity/kube-bench', 'type': 'tutorial', 'source': 'Aqua Security'},
        {'title': 'ETCD 健康检查', 'url': 'https://etcd.io/docs/v3.5/op-guide/maintenance/', 'type': 'doc', 'source': 'ETCD'},
        {'title': 'K8s 巡检脚本示例', 'url': 'https://github.com/m kneeling/k8s-health-check', 'type': 'tutorial', 'source': 'GitHub'},
        {'title': 'Cert-manager 证书管理', 'url': 'https://cert-manager.io/docs/', 'type': 'doc', 'source': 'Cert Manager'},
        {'title': 'Velero 备份恢复', 'url': 'https://velero.io/docs/', 'type': 'doc', 'source': 'Velero'}
    ],
    'k8s-security': [
        {'title': 'Kubernetes 安全基准', 'url': 'https://www.cisecurity.org/benchmark/kubernetes', 'type': 'doc', 'source': 'CIS'},
        {'title': 'Pod Security Standards', 'url': 'https://kubernetes.io/docs/concepts/security/pod-security-standards/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'RBAC 文档', 'url': 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'Network Policy 指南', 'url': 'https://kubernetes.io/docs/concepts/services-networking/network-policies/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'Trivy 镜像扫描', 'url': 'https://github.com/aquasecurity/trivy', 'type': 'tutorial', 'source': 'Aqua Security'},
        {'title': 'K8s 审计日志', 'url': 'https://kubernetes.io/docs/tasks/debug-application-cluster/audit/', 'type': 'doc', 'source': 'CNCF'}
    ],
    'k8s-troubleshooting': [
        {'title': 'K8s 故障排查官方文档', 'url': 'https://kubernetes.io/docs/tasks/debug/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'kubectl 调试指南', 'url': 'https://kubernetes.io/docs/reference/kubectl/cheatsheet/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'ETCD 故障排查', 'url': 'https://etcd.io/docs/v3.5/op-guide//', 'type': 'doc', 'source': 'ETCD'},
        {'title': 'CoreDNS 故障排查', 'url': 'https://kubernetes.io/docs/tasks/network/validate-nsetup/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'CNI 插件文档', 'url': 'https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'K9s 终端 UI', 'url': 'https://k9scli.io/', 'type': 'tutorial', 'source': 'K9s'}
    ],
    'security-scan': [
        {'title': 'SAST 工具对比', 'url': 'https://owasp.org/www-project-code-crisis/', 'type': 'tutorial', 'source': 'OWASP'},
        {'title': 'Trivy 镜像扫描', 'url': 'https://aquasecurity.github.io/trivy/', 'type': 'doc', 'source': 'Aqua Security'},
        {'title': 'Checkov IaC 扫描', 'url': 'https://www.checkov.io/', 'type': 'doc', 'source': 'Bridgecrew'},
        {'title': 'TruffleHog 密钥检测', 'url': 'https://github.com/trufflesecurity/trufflehog', 'type': 'tutorial', 'source': 'GitHub'},
        {'title': 'OWASP ZAP 安全扫描', 'url': 'https://www.zaproxy.org/docs/', 'type': 'doc', 'source': 'OWASP'},
        {'title': 'SonarQube 官方文档', 'url': 'https://docs.sonarqube.org/', 'type': 'doc', 'source': 'SonarSource'}
    ],
    'log-parser': [
        {'title': 'LogQL 查询语言', 'url': 'https://grafana.com/docs/loki/latest/logql/', 'type': 'doc', 'source': 'Grafana'},
        {'title': 'ELK Stack 教程', 'url': 'https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html', 'type': 'doc', 'source': 'Elastic'},
        {'title': 'Fluentd 配置指南', 'url': 'https://docs.fluentd.org/', 'type': 'doc', 'source': 'Fluentd'},
        {'title': 'Grok 模式语法', 'url': 'https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html', 'type': 'doc', 'source': 'Elastic'},
        {'title': '日志分析最佳实践', 'url': 'https://www.sumologic.com/blog/log-analysis-best-practices/', 'type': 'tutorial', 'source': 'Sumo Logic'},
        {'title': '结构化日志教程', 'url': 'https://www.honeycomb.io/blog/getting-started-with-structured-logging', 'type': 'tutorial', 'source': 'Honeycomb'}
    ],
    'service-health-check': [
        {'title': 'K8s 探针配置', 'url': 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'gRPC 健康检查协议', 'url': 'https://github.com/grpc/grpc/blob/master/doc/health-checking.md', 'type': 'doc', 'source': 'gRPC'},
        {'title': 'HTTP 探针设计', 'url': 'https://kubernetes.io/docs/concepts/services-networking/service/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'Prometheus 黑盒监控', 'url': 'https://github.com/prometheus/blackbox_exporter', 'type': 'tutorial', 'source': 'Prometheus'},
        {'title': '健康检查最佳实践', 'url': 'https://cloud.google.com/blog/products/containers-kubernetes/kubernetes-best-practices', 'type': 'tutorial', 'source': 'Google Cloud'},
        {'title': 'Readiness Probe 教程', 'url': 'https://kubernetes.io/docs/concepts/services-networking/service/#discovering-services', 'type': 'doc', 'source': 'CNCF'}
    ],
    'system-watchdog': [
        {'title': '熔断器模式详解', 'url': 'https://martinfowler.com/bliki/CircuitBreaker.html', 'type': 'tutorial', 'source': 'Martin Fowler'},
        {'title': 'Hystrix 文档', 'url': 'https://github.com/Netflix/Hystrix/wiki', 'type': 'doc', 'source': 'Netflix'},
        {'title': 'Linux watchdog 守护进程', 'url': 'https://linux.die.net/man/8/watchdog', 'type': 'doc', 'source': 'Linux'},
        {'title': 'Resilience4j 熔断器', 'url': 'https://resilience4j.readme.io/docs/circuitbreaker', 'type': 'doc', 'source': 'Resilience4j'},
        {'title': '分布式锁设计', 'url': 'https://redis.io/docs/manual/patterns/distributed-locks/', 'type': 'doc', 'source': 'Redis'},
        {'title': '健康检查模式', 'url': 'https://docs.microsoft.com/zh-cn/azure/architecture/patterns/health-endpoint-monitoring', 'type': 'tutorial', 'source': 'Microsoft'}
    ],
    'docker-container-management': [
        {'title': 'Docker 官方文档', 'url': 'https://docs.docker.com/', 'type': 'doc', 'source': 'Docker'},
        {'title': 'Docker CLI 参考', 'url': 'https://docs.docker.com/engine/reference/commandline/docker/', 'type': 'doc', 'source': 'Docker'},
        {'title': 'Docker 网络配置', 'url': 'https://docs.docker.com/network/', 'type': 'doc', 'source': 'Docker'},
        {'title': 'Docker 日志驱动', 'url': 'https://docs.docker.com/config/containers/logging/', 'type': 'doc', 'source': 'Docker'},
        {'title': 'Docker 清理指南', 'url': 'https://docs.docker.com/engine/reference/commandline/system/', 'type': 'doc', 'source': 'Docker'},
        {'title': 'Docker 进阶教程', 'url': 'https://www.bilibili.com/video/BV1R7411F7pa/', 'type': 'video', 'source': 'Bilibili'}
    ],
    'k8s-deployment-review': [
        {'title': 'K8s Deployment 官方文档', 'url': 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/', 'type': 'doc', 'source': 'CNCF'},
        {'title': '探针配置指南', 'url': 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'PodDisruptionBudget', 'url': 'https://kubernetes.io/docs/concepts/workloads/pods/disruptions/', 'type': 'doc', 'source': 'CNCF'},
        {'title': '安全上下文', 'url': 'https://kubernetes.io/docs/tasks/security/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'K8s YAML 验证', 'url': 'https://kubernetes.io/docs/reference/kubectl/validation/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'kubectl diff 教程', 'url': 'https://kubernetes.io/docs/reference/kubectl/generated/kubectl_diff/', 'type': 'doc', 'source': 'CNCF'}
    ],
    'terraform-plan-review': [
        {'title': 'Terraform 官方文档', 'url': 'https://developer.hashicorp.com/terraform/docs', 'type': 'doc', 'source': 'HashiCorp'},
        {'title': 'Terraform Plan 解析', 'url': 'https://developer.hashicorp.com/terraform/tutorials/configuration-language/plan', 'type': 'tutorial', 'source': 'HashiCorp'},
        {'title': 'tfsec 安全扫描', 'url': 'https://aquasecurity.github.io/tfsec/', 'type': 'doc', 'source': 'Aqua Security'},
        {'title': 'Checkov Terraform 扫描', 'url': 'https://www.checkov.io/2.Boundaries/Overview.html', 'type': 'doc', 'source': 'Bridgecrew'},
        {'title': 'Terraform State 管理', 'url': 'https://developer.hashicorp.com/terraform/language/state', 'type': 'doc', 'source': 'HashiCorp'},
        {'title': 'IaC 安全最佳实践', 'url': 'https://www.practical-devsecops.com/blog/devsecops-for-terraform', 'type': 'tutorial', 'source': 'DevSecOps'}
    ],
    'ci-pipeline-setup': [
        {'title': 'GitHub Actions 文档', 'url': 'https://docs.github.com/en/actions', 'type': 'doc', 'source': 'GitHub'},
        {'title': 'Actions 市场', 'url': 'https://github.com/marketplace?type=actions', 'type': 'tutorial', 'source': 'GitHub'},
        {'title': 'Docker 构建 Action', 'url': 'https://github.com/docker/build-push-action', 'type': 'tutorial', 'source': 'Docker'},
        {'title': 'CI/CD 安全扫描', 'url': 'https://owasp.org/www-project-devsecops/', 'type': 'tutorial', 'source': 'OWASP'},
        {'title': 'GitHub Actions 教程', 'url': 'https://www.bilibili.com/video/BV1R64y1f7Sz/', 'type': 'video', 'source': 'Bilibili'},
        {'title': 'Matrix 构建策略', 'url': 'https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategy', 'type': 'doc', 'source': 'GitHub'}
    ],
    'monitoring-stack-setup': [
        {'title': 'Prometheus 安装指南', 'url': 'https://prometheus.io/docs/prometheus/latest/getting_started/', 'type': 'doc', 'source': 'Prometheus'},
        {'title': 'Grafana 安装配置', 'url': 'https://grafana.com/docs/grafana/latest/setup-grafana/', 'type': 'doc', 'source': 'Grafana'},
        {'title': 'Alertmanager 配置', 'url': 'https://prometheus.io/docs/alerting/latest/configuration/', 'type': 'doc', 'source': 'Prometheus'},
        {'title': 'Docker Compose 监控栈', 'url': 'https://github.com/prometheus/prometheus/tree/main/docker', 'type': 'tutorial', 'source': 'GitHub'},
        {'title': '监控最佳实践', 'url': 'https://sre.google/workbook/monitoring-distributed-systems/', 'type': 'tutorial', 'source': 'Google SRE'},
        {'title': 'Alert 规则设计', 'url': 'https://awesome-prometheus-alerts.sh/', 'type': 'tutorial', 'source': 'GitHub'}
    ],
    'incident-diagnosis': [
        {'title': '故障排查方法论', 'url': 'https://landing.google.com/sre/sre-book/chapters/monitoring-distributed-systems/', 'type': 'tutorial', 'source': 'Google SRE'},
        {'title': '5 Whys 根因分析', 'url': 'https://www.atlassian.com/incident-management/postmortem/root-cause-analysis', 'type': 'tutorial', 'source': 'Atlassian'},
        {'title': '日志分析技巧', 'url': 'https://www.honeycomb.io/blog/how-to-debug-with-distributed-tracing', 'type': 'tutorial', 'source': 'Honeycomb'},
        {'title': '容器故障排查', 'url': 'https://kubernetes.io/docs/tasks/debug/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'HTTP 健康检查', 'url': 'https://github.com/prometheus/blackbox_exporter/blob/master/README.md', 'type': 'tutorial', 'source': 'Prometheus'},
        {'title': '故障诊断工具箱', 'url': 'https://github.com/linkedin/FlightSchool', 'type': 'tutorial', 'source': 'GitHub'}
    ],
    'security-audit': [
        {'title': 'K8s 安全审计指南', 'url': 'https://kubernetes.io/docs/tasks/debug-application-cluster/audit/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'Trivy 安全扫描', 'url': 'https://aquasecurity.github.io/trivy/', 'type': 'doc', 'source': 'Aqua Security'},
        {'title': 'Kubesec 安全评分', 'url': 'https://kubesec.io/', 'type': 'tutorial', 'source': 'Kubesec'},
        {'title': 'OPA Gatekeeper', 'url': 'https://open-policy-agent.github.io/gatekeeper/', 'type': 'doc', 'source': 'OPA'},
        {'title': 'CIS K8s 基准', 'url': 'https://www.cisecurity.org/benchmark/kubernetes', 'type': 'doc', 'source': 'CIS'},
        {'title': '安全扫描工具对比', 'url': 'https://owasp.org/www-project-devsecops/', 'type': 'tutorial', 'source': 'OWASP'}
    ],
    'log-analysis': [
        {'title': '日志分析教程', 'url': 'https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html', 'type': 'doc', 'source': 'Elastic'},
        {'title': 'Loki LogQL', 'url': 'https://grafana.com/docs/loki/latest/logql/', 'type': 'doc', 'source': 'Grafana'},
        {'title': '异常检测方法', 'url': 'https://www.honeycomb.io/blog/anomaly-detection-101', 'type': 'tutorial', 'source': 'Honeycomb'},
        {'title': 'ELK Stack 教程', 'url': 'https://www.elastic.co/webinars/getting-started-kibana', 'type': 'tutorial', 'source': 'Elastic'},
        {'title': '日志模式识别', 'url': 'https://logging.apache.org/docs/latest/', 'type': 'doc', 'source': 'Apache'},
        {'title': '分布式日志追踪', 'url': 'https://opentelemetry.io/docs/', 'type': 'doc', 'source': 'OpenTelemetry'}
    ],
    'docker-to-k8s': [
        {'title': 'Kompose 转换工具', 'url': 'https://kompose.io/', 'type': 'tutorial', 'source': 'Kompose'},
        {'title': 'Docker Compose K8s 对应关系', 'url': 'https://kubernetes.io/docs/tutorials/', 'type': 'doc', 'source': 'CNCF'},
        {'title': '迁移指南', 'url': 'https://www.docker.com/blog/docker-compose-to-kubernetes/', 'type': 'tutorial', 'source': 'Docker'},
        {'title': 'Helm Chart 迁移', 'url': 'https://helm.sh/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'K8s 部署最佳实践', 'url': 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/', 'type': 'doc', 'source': 'CNCF'},
        {'title': '有状态应用迁移', 'url': 'https://kubernetes.io/docs/tasks/run-application/', 'type': 'doc', 'source': 'CNCF'}
    ],
    'terraform-basics': [
        {'title': 'Terraform 官方文档', 'url': 'https://developer.hashicorp.com/terraform/docs', 'type': 'doc', 'source': 'HashiCorp'},
        {'title': 'Terraform 入门教程', 'url': 'https://developer.hashicorp.com/terraform/tutorials/getting-started', 'type': 'tutorial', 'source': 'HashiCorp'},
        {'title': 'HCL 语法参考', 'url': 'https://developer.hashicorp.com/terraform/language/syntax', 'type': 'doc', 'source': 'HashiCorp'},
        {'title': 'Terraform State 最佳实践', 'url': 'https://developer.hashicorp.com/terraform/language/state', 'type': 'doc', 'source': 'HashiCorp'},
        {'title': 'Terraform Module 开发', 'url': 'https://developer.hashicorp.com/terraform/language/modules', 'type': 'doc', 'source': 'HashiCorp'},
        {'title': 'Terraform 导入存量资源', 'url': 'https://developer.hashicorp.com/terraform/language/import', 'type': 'doc', 'source': 'HashiCorp'}
    ],
    'ansible-automation': [
        {'title': 'Ansible 官方文档', 'url': 'https://docs.ansible.com/', 'type': 'doc', 'source': 'Red Hat'},
        {'title': 'Ansible Playbook 教程', 'url': 'https://docs.ansible.com/ansible/latest/user_guide/playbooks.html', 'type': 'doc', 'source': 'Red Hat'},
        {'title': 'Ansible Galaxy', 'url': 'https://galaxy.ansible.com/', 'type': 'tutorial', 'source': 'Ansible'},
        {'title': 'Ansible Role 开发', 'url': 'https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse_roles.html', 'type': 'doc', 'source': 'Red Hat'},
        {'title': 'Ansible 技巧集', 'url': 'https://www.ansible.com/blog', 'type': 'tutorial', 'source': 'Ansible'},
        {'title': 'Ansible Tower 介绍', 'url': 'https://www.ansible.com/products/automation-controller', 'type': 'tutorial', 'source': 'Red Hat'}
    ],
    'github-actions': [
        {'title': 'GitHub Actions 官方文档', 'url': 'https://docs.github.com/en/actions', 'type': 'doc', 'source': 'GitHub'},
        {'title': 'Workflow 语法参考', 'url': 'https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions', 'type': 'doc', 'source': 'GitHub'},
        {'title': 'Actions 市场', 'url': 'https://github.com/marketplace?type=actions', 'type': 'tutorial', 'source': 'GitHub'},
        {'title': '自托管 Runner', 'url': 'https://docs.github.com/en/actions/hosting-your-own-runners/', 'type': 'doc', 'source': 'GitHub'},
        {'title': '缓存优化', 'url': 'https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows', 'type': 'doc', 'source': 'GitHub'},
        {'title': 'Reusable Workflows', 'url': 'https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions', 'type': 'doc', 'source': 'GitHub'}
    ],
    'gitops-workflow': [
        {'title': 'ArgoCD 官方文档', 'url': 'https://argo-cd.readthedocs.io/', 'type': 'doc', 'source': 'ArgoCD'},
        {'title': 'Flux 官方文档', 'url': 'https://fluxcd.io/docs/', 'type': 'doc', 'source': 'Flux'},
        {'title': 'GitOps 最佳实践', 'url': 'https://www.gitops.tech/', 'type': 'tutorial', 'source': 'GitOps'},
        {'title': 'ArgoCD 应用集', 'url': 'https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/', 'type': 'doc', 'source': 'ArgoCD'},
        {'title': 'GitOps 入门教程', 'url': 'https://www.weave.works/blog/getting-started-with-gitops', 'type': 'tutorial', 'source': 'Weaveworks'},
        {'title': '多集群 GitOps', 'url': 'https://fluxcd.io/docs/guides/multi-tenancy/', 'type': 'tutorial', 'source': 'Flux'}
    ],
    'secrets-management': [
        {'title': 'HashiCorp Vault 文档', 'url': 'https://developer.hashicorp.com/vault/docs', 'type': 'doc', 'source': 'HashiCorp'},
        {'title': 'Vault HA 部署', 'url': 'https://developer.hashicorp.com/vault/docs/internals/architecture', 'type': 'doc', 'source': 'HashiCorp'},
        {'title': 'AWS Secrets Manager', 'url': 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/', 'type': 'doc', 'source': 'AWS'},
        {'title': 'External Secrets Operator', 'url': 'https://external-secrets.io/latest/', 'type': 'doc', 'source': 'ESO'},
        {'title': 'Sealed Secrets 文档', 'url': 'https://github.com/bitnami-labs/sealed-secrets', 'type': 'tutorial', 'source': 'GitHub'},
        {'title': '密钥轮转最佳实践', 'url': 'https://developer.hashicorp.com/vault/docs/secretsrotation', 'type': 'tutorial', 'source': 'HashiCorp'}
    ],
    'config-validator': [
        {'title': 'OPA 官方文档', 'url': 'https://www.openpolicyagent.org/docs/', 'type': 'doc', 'source': 'OPA'},
        {'title': 'Gatekeeper 文档', 'url': 'https://open-policy-agent.github.io/gatekeeper/', 'type': 'doc', 'source': 'OPA'},
        {'title': 'Kyverno 官方文档', 'url': 'https://kyverno.io/docs/', 'type': 'doc', 'source': 'Kyverno'},
        {'title': 'Polaris 配置评分', 'url': 'https://www.polaris，盛txt.io/docs/', 'type': 'tutorial', 'source': 'Fairwinds'},
        {'title': 'Kube-score 工具', 'url': 'https://github.com/zegl/kube-score', 'type': 'tutorial', 'source': 'GitHub'},
        {'title': 'Checkov IaC 扫描', 'url': 'https://www.checkov.io/', 'type': 'doc', 'source': 'Bridgecrew'}
    ],
    'aws-cli-basics': [
        {'title': 'AWS CLI 官方文档', 'url': 'https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'EC2 用户指南', 'url': 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'S3 开发指南', 'url': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'IAM 用户指南', 'url': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'VPC 用户指南', 'url': 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'EKS 用户指南', 'url': 'https://docs.aws.amazon.com/eks/latest/userguide/what-is.html', 'type': 'doc', 'source': 'AWS'}
    ],
    'azure-cli-basics': [
        {'title': 'Azure CLI 官方文档', 'url': 'https://learn.microsoft.com/zh-cn/cli/azure/', 'type': 'doc', 'source': 'Microsoft'},
        {'title': 'Azure VM 文档', 'url': 'https://learn.microsoft.com/zh-cn/azure/virtual-machines/', 'type': 'doc', 'source': 'Microsoft'},
        {'title': 'AKS 文档', 'url': 'https://learn.microsoft.com/zh-cn/azure/aks/', 'type': 'doc', 'source': 'Microsoft'},
        {'title': 'Azure Storage 文档', 'url': 'https://learn.microsoft.com/zh-cn/azure/storage/', 'type': 'doc', 'source': 'Microsoft'},
        {'title': 'Azure Monitor 文档', 'url': 'https://learn.microsoft.com/zh-cn/azure/azure-monitor/', 'type': 'doc', 'source': 'Microsoft'},
        {'title': 'Azure CLI 教程', 'url': 'https://learn.microsoft.com/zh-cn/training/paths/azure-cli/', 'type': 'tutorial', 'source': 'Microsoft'}
    ],
    'tencent-cloud-lighthouse': [
        {'title': '腾讯云轻量应用服务器文档', 'url': 'https://cloud.tencent.com/document/product/1207', 'type': 'doc', 'source': 'Tencent Cloud'},
        {'title': '轻量服务器快速入门', 'url': 'https://cloud.tencent.com/document/product/1207/49263', 'type': 'tutorial', 'source': 'Tencent Cloud'},
        {'title': '防火墙配置指南', 'url': 'https://cloud.tencent.com/document/product/1207/45139', 'type': 'doc', 'source': 'Tencent Cloud'},
        {'title': '快照管理文档', 'url': 'https://cloud.tencent.com/document/product/1207/48515', 'type': 'doc', 'source': 'Tencent Cloud'},
        {'title': 'DNSPod 解析文档', 'url': 'https://cloud.tencent.com/document/product/302', 'type': 'doc', 'source': 'Tencent Cloud'},
        {'title': 'SSL 证书配置', 'url': 'https://cloud.tencent.com/document/product/400/4143', 'type': 'doc', 'source': 'Tencent Cloud'}
    ],
    'cloudflare-manager': [
        {'title': 'Cloudflare 官方文档', 'url': 'https://developers.cloudflare.com/', 'type': 'doc', 'source': 'Cloudflare'},
        {'title': 'DNS 管理指南', 'url': 'https://developers.cloudflare.com/dns/', 'type': 'doc', 'source': 'Cloudflare'},
        {'title': 'WAF 配置教程', 'url': 'https://developers.cloudflare.com/waf/', 'type': 'doc', 'source': 'Cloudflare'},
        {'title': 'CDN 缓存规则', 'url': 'https://developers.cloudflare.com/cache/', 'type': 'doc', 'source': 'Cloudflare'},
        {'title': 'SSL/TLS 配置', 'url': 'https://developers.cloudflare.com/ssl/', 'type': 'doc', 'source': 'Cloudflare'},
        {'title': 'Cloudflare Workers', 'url': 'https://developers.cloudflare.com/workers/', 'type': 'doc', 'source': 'Cloudflare'}
    ],
    'api-design': [
        {'title': 'RESTful API 设计', 'url': 'https://restfulapi.net/', 'type': 'tutorial', 'source': 'RESTful API'},
        {'title': 'OpenAPI 规范', 'url': 'https://swagger.io/specification/', 'type': 'doc', 'source': 'Swagger'},
        {'title': 'GraphQL 官方文档', 'url': 'https://graphql.org/learn/', 'type': 'doc', 'source': 'GraphQL'},
        {'title': 'API 版本管理', 'url': 'https://apisyouwonthate.com/blog/api-versioning-has-to-be-hard/', 'type': 'tutorial', 'source': 'APIs You Won\'t Hate'},
        {'title': 'API 安全设计', 'url': 'https://www.owasp.org/index.php/REST_Security', 'type': 'tutorial', 'source': 'OWASP'},
        {'title': 'Webhook 设计指南', 'url': 'https://developers.web.com/guides/webhooks/', 'type': 'tutorial', 'source': 'Webhook'}
    ],
    'generate-deployment-guide': [
        {'title': '部署最佳实践', 'url': 'https://cloud.google.com/solutions/sap-deployment-automation', 'type': 'tutorial', 'source': 'Google Cloud'},
        {'title': 'GitOps 部署指南', 'url': 'https://www.gitops.tech/', 'type': 'tutorial', 'source': 'GitOps'},
        {'title': 'ArgoCD 部署', 'url': 'https://argo-cd.readthedocs.io/en/stable/', 'type': 'doc', 'source': 'ArgoCD'},
        {'title': '部署检查清单', 'url': 'https://landing.google.com/sre/sre-book/chapters/automation/', 'type': 'tutorial', 'source': 'Google SRE'},
        {'title': '回滚策略设计', 'url': 'https://spinnaker.io/docs/setup/rollback/', 'type': 'doc', 'source': 'Spinnaker'},
        {'title': 'CI/CD 部署模板', 'url': 'https://github.com/awslabs/aws-codedeploy-samples', 'type': 'tutorial', 'source': 'GitHub'}
    ],
    'testing': [
        {'title': 'Jest 官方文档', 'url': 'https://jestjs.io/docs/getting-started', 'type': 'doc', 'source': 'Meta'},
        {'title': 'Vitest 官方文档', 'url': 'https://vitest.dev/guide/', 'type': 'doc', 'source': 'Vitest'},
        {'title': 'Testcontainers', 'url': 'https://testcontainers.com/guides/', 'type': 'tutorial', 'source': 'Testcontainers'},
        {'title': 'Playwright 测试', 'url': 'https://playwright.dev/docs/writing-tests', 'type': 'doc', 'source': 'Microsoft'},
        {'title': '测试覆盖率工具', 'url': 'https://istanbul.js.org/', 'type': 'tutorial', 'source': 'Istanbul'},
        {'title': 'TDD 实战指南', 'url': 'https://www.youtube.com/watch?v=qP9HbxQ51V0', 'type': 'video', 'source': 'YouTube'}
    ],
    'api-development': [
        {'title': 'Express 官方文档', 'url': 'https://expressjs.com/', 'type': 'doc', 'source': 'Express'},
        {'title': 'Fastify 官方文档', 'url': 'https://fastify.io/', 'type': 'doc', 'source': 'Fastify'},
        {'title': 'NestJS 官方文档', 'url': 'https://docs.nestjs.com/', 'type': 'doc', 'source': 'NestJS'},
        {'title': 'Zod 数据校验', 'url': 'https://zod.dev/', 'type': 'doc', 'source': 'Zod'},
        {'title': 'gRPC 官方文档', 'url': 'https://grpc.io/docs/', 'type': 'doc', 'source': 'gRPC'},
        {'title': 'Node.js 最佳实践', 'url': 'https://github.com/goldbergyoni/nodebestpractices', 'type': 'tutorial', 'source': 'GitHub'}
    ],
    'component-design': [
        {'title': 'React 组件设计', 'url': 'https://react.dev/learn', 'type': 'doc', 'source': 'React'},
        {'title': 'Headless UI 组件', 'url': 'https://headlessui.com/', 'type': 'tutorial', 'source': 'Headless UI'},
        {'title': 'Storybook 官方文档', 'url': 'https://storybook.js.org/docs/', 'type': 'doc', 'source': 'Storybook'},
        {'title': 'Radix UI 组件库', 'url': 'https://www.radix-ui.com/', 'type': 'doc', 'source': 'Radix'},
        {'title': 'Design Tokens 规范', 'url': 'https://www.smashingmagazine.com/2023/02/design-tokens-beginners-guide/', 'type': 'tutorial', 'source': 'Smashing Magazine'},
        {'title': '无障碍访问指南', 'url': 'https://www.w3.org/WAI/WCAG21/quickref/', 'type': 'tutorial', 'source': 'W3C'}
    ],
    'state-management': [
        {'title': 'Zustand 官方文档', 'url': 'https://zustand.docs.pmnd.rs/', 'type': 'doc', 'source': 'Zustand'},
        {'title': 'Redux Toolkit 文档', 'url': 'https://redux-toolkit.js.org/', 'type': 'doc', 'source': 'Redux'},
        {'title': 'TanStack Query', 'url': 'https://tanstack.com/query/latest', 'type': 'doc', 'source': 'TanStack'},
        {'title': 'Pinia 官方文档', 'url': 'https://pinia.vuejs.org/', 'type': 'doc', 'source': 'Pinia'},
        {'title': 'XState 状态机', 'url': 'https://xstate.js.org/docs/', 'type': 'doc', 'source': 'XState'},
        {'title': 'React Hook Form', 'url': 'https://react-hook-form.com/', 'type': 'doc', 'source': 'React Hook Form'}
    ],
    'write-unit-tests': [
        {'title': 'Jest 单元测试', 'url': 'https://jestjs.io/docs/getting-started', 'type': 'doc', 'source': 'Meta'},
        {'title': 'Vitest 高性能测试', 'url': 'https://vitest.dev/guide/', 'type': 'doc', 'source': 'Vitest'},
        {'title': 'Testing Library', 'url': 'https://testing-library.com/docs/', 'type': 'doc', 'source': 'Testing Library'},
        {'title': 'Mock 实战指南', 'url': 'https://github.com/NYTimes/jest-extended', 'type': 'tutorial', 'source': 'GitHub'},
        {'title': '单元测试覆盖率', 'url': 'https://istanbul.js.org/', 'type': 'tutorial', 'source': 'Istanbul'},
        {'title': '快照测试教程', 'url': 'https://jestjs.io/docs/snapshot-testing', 'type': 'doc', 'source': 'Meta'}
    ],
    'write-e2e-tests': [
        {'title': 'Playwright 官方文档', 'url': 'https://playwright.dev/docs/intro', 'type': 'doc', 'source': 'Microsoft'},
        {'title': 'Cypress E2E 测试', 'url': 'https://docs.cypress.io/guides/overview/why-cypress', 'type': 'doc', 'source': 'Cypress'},
        {'title': 'Page Object 模式', 'url': 'https://martinfowler.com/bliki/PageObject.html', 'type': 'tutorial', 'source': 'Martin Fowler'},
        {'title': 'Playwright CI 集成', 'url': 'https://playwright.dev/docs/ci', 'type': 'doc', 'source': 'Microsoft'},
        {'title': 'API 测试指南', 'url': 'https://www.postman.com/api-testing/', 'type': 'tutorial', 'source': 'Postman'},
        {'title': 'Contract Testing', 'url': 'https://pact.io/', 'type': 'tutorial', 'source': 'Pact'}
    ],
    'performance-testing': [
        {'title': 'k6 性能测试', 'url': 'https://k6.io/docs/', 'type': 'doc', 'source': 'k6'},
        {'title': 'JMeter 教程', 'url': 'https://jmeter.apache.org/usermanual/index.html', 'type': 'doc', 'source': 'Apache'},
        {'title': 'Lighthouse CI', 'url': 'https://developer.chrome.com/docs/lighthouse/', 'type': 'doc', 'source': 'Google'},
        {'title': 'WebPageTest 使用', 'url': 'https://docs.webpagetest.org/', 'type': 'tutorial', 'source': 'WebPageTest'},
        {'title': 'k6 负载测试教程', 'url': 'https://www.bilibili.com/video/BV1pM41197tK/', 'type': 'video', 'source': 'Bilibili'},
        {'title': 'Artillery 压力测试', 'url': 'https://www.artillery.io/docs', 'type': 'doc', 'source': 'Artillery'}
    ],
    'test-strategy': [
        {'title': '测试金字塔', 'url': 'https://martinfowler.com/articles/practical-test-pyramid.html', 'type': 'tutorial', 'source': 'Martin Fowler'},
        {'title': 'Kent C. Dodds 测试奖杯', 'url': 'https://kentcdodds.com/blog/the-testing-trophy', 'type': 'tutorial', 'source': 'Kent C. Dodds'},
        {'title': '测试左移策略', 'url': 'https://www.devops.com/testing-left-shift-testing-becomes-priority/', 'type': 'tutorial', 'source': 'DevOps'},
        {'title': '持续测试实践', 'url': 'https://www.jamesshore.com/v2/blog/2019/continuous-testing', 'type': 'tutorial', 'source': 'James Shore'},
        {'title': 'Code Coverage 指南', 'url': 'https://www.atlassian.com/continuous-delivery/quality-assurance/test-coverage', 'type': 'tutorial', 'source': 'Atlassian'},
        {'title': '质量门禁设计', 'url': 'https://testing.google/blog quality-gates', 'type': 'tutorial', 'source': 'Google Testing'}
    ],
    'write-prd': [
        {'title': 'PRD 模板与指南', 'url': 'https://www.atlassian.com.cn/software/jira/features/requirements', 'type': 'tutorial', 'source': 'Atlassian'},
        {'title': '用户故事地图', 'url': 'https://www.jpattonassociates.com/user-story-mapping/', 'type': 'tutorial', 'source': 'Jeff Patton'},
        {'title': 'MoSCoW 优先级', 'url': 'https://www.productplan.com/glossary/moscow-prioritization/', 'type': 'tutorial', 'source': 'Product Plan'},
        {'title': 'RICE 评分模型', 'url': 'https://www.productboard.com/glossary/rice-prioritization/', 'type': 'tutorial', 'source': 'Productboard'},
        {'title': 'PRD 写作技巧', 'url': 'https://www.youtube.com/watch?v=YqSfEtv0QZ0', 'type': 'video', 'source': 'YouTube'},
        {'title': 'Kano 模型解析', 'url': 'https://www.interaction-design.org/literature/article/kano-model', 'type': 'tutorial', 'source': 'Interaction Design'}
    ],
    'user-research': [
        {'title': '用户访谈技巧', 'url': 'https://www.nngroup.com/articles/interviewing-users/', 'type': 'tutorial', 'source': 'Nielsen Norman Group'},
        {'title': '问卷设计指南', 'url': 'https://www.surveymonkey.com/mp/survey-question-design/', 'type': 'tutorial', 'source': 'SurveyMonkey'},
        {'title': '可用性测试', 'url': 'https://www.nngroup.com/articles/usability-testing/', 'type': 'tutorial', 'source': 'Nielsen Norman Group'},
        {'title': '用户画像创建', 'url': 'https://www.intercom.com/resources/guides/persona', 'type': 'tutorial', 'source': 'Intercom'},
        {'title': '5 Whys 分析法', 'url': 'https://www.productplan.com/glossary/five-whys/', 'type': 'tutorial', 'source': 'Product Plan'},
        {'title': '远程用户测试', 'url': 'https://www.nngroup.com/articles/remote-usability-testing/', 'type': 'tutorial', 'source': 'Nielsen Norman Group'}
    ],
    'competitive-analysis': [
        {'title': '竞品分析方法', 'url': 'https://www.coursera.org/learn/product-management', 'type': 'tutorial', 'source': 'Coursera'},
        {'title': 'SWOT 分析模板', 'url': 'https://www.smart sheets.com/swot-analysis-template', 'type': 'tutorial', 'source': 'Smartsheet'},
        {'title': '功能对比矩阵', 'url': 'https://www.productplan.com/glossary/feature-matrix/', 'type': 'tutorial', 'source': 'Product Plan'},
        {'title': '差异化定位策略', 'url': 'https://www.aha.io/blog/competitive-positioning', 'type': 'tutorial', 'source': 'Aha!'},
        {'title': '市场分析指南', 'url': 'https://www.forbes.com/sites/chuckbandong/10 steps to analyze competitors', 'type': 'tutorial', 'source': 'Forbes'},
        {'title': '价值主张画布', 'url': 'https://www.strategyzer.com/value-proposition-canvas', 'type': 'tutorial', 'source': 'Strategyzer'}
    ],
    'roadmap-design': [
        {'title': '产品路线图设计', 'url': 'https://www.productplan.com/what-is-a-product-roadmap/', 'type': 'tutorial', 'source': 'Product Plan'},
        {'title': 'OKR 制定指南', 'url': 'https://www.what matters.com/okr', 'type': 'tutorial', 'source': 'What Matters'},
        {'title': 'Now-Next-Later 框架', 'url': 'https://www.productplan.com/glossary/now-next-later/', 'type': 'tutorial', 'source': 'Product Plan'},
        {'title': 'Sprint 规划技巧', 'url': 'https://www.scrum.org/resources/sprint-planning', 'type': 'tutorial', 'source': 'Scrum.org'},
        {'title': 'Feature Flag 策略', 'url': 'https://www.optimizely.com/feature-flags', 'type': 'tutorial', 'source': 'Optimizely'},
        {'title': '利益相关方管理', 'url': 'https://www.pmi.org/pmbok-guide-standards/foundational/stakeholder', 'type': 'tutorial', 'source': 'PMI'}
    ],
    'cloud-security-fundamentals': [
        {'title': '云安全共担责任', 'url': 'https://aws.amazon.com/compliance/shared-responsibility-model/', 'type': 'doc', 'source': 'AWS'},
        {'title': 'CIS 云安全基准', 'url': 'https://www.cisecurity.org/benchmark', 'type': 'doc', 'source': 'CIS'},
        {'title': 'NIST CSF 指南', 'url': 'https://www.nist.gov/cyberframework', 'type': 'doc', 'source': 'NIST'},
        {'title': '云威胁全景', 'url': 'https://www.cloudflare.com/learning/security/cloud-security-threats/', 'type': 'tutorial', 'source': 'Cloudflare'},
        {'title': '云安全生命周期', 'url': 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final', 'type': 'doc', 'source': 'NIST'},
        {'title': 'AWS 安全最佳实践', 'url': 'https://docs.aws.amazon.com/security/latest/best-practices.html', 'type': 'doc', 'source': 'AWS'}
    ],
    'cloud-iam-basics': [
        {'title': 'AWS IAM 文档', 'url': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'Azure AD 指南', 'url': 'https://learn.microsoft.com/zh-cn/azure/active-directory/fundamentals/', 'type': 'doc', 'source': 'Microsoft'},
        {'title': 'GCP IAM 文档', 'url': 'https://cloud.google.com/iam/docs', 'type': 'doc', 'source': 'Google Cloud'},
        {'title': '最小权限原则', 'url': 'https://aws.amazon.com/blogs/security/iam-minimum-permission-checker/', 'type': 'tutorial', 'source': 'AWS'},
        {'title': 'IRSA 最佳实践', 'url': 'https://aws.amazon.com/blogs/opensource/introducing-fine-grained-iam-roles-service-accounts/', 'type': 'tutorial', 'source': 'AWS'},
        {'title': 'MFA 配置指南', 'url': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html', 'type': 'doc', 'source': 'AWS'}
    ],
    'cloud-network-security-basics': [
        {'title': 'AWS VPC 文档', 'url': 'https://docs.aws.amazon.com/vpc/latest/userguide/', 'type': 'doc', 'source': 'AWS'},
        {'title': '安全组配置', 'url': 'https://docs.aws.amazon.com/vpc/latest/userguide/security-groups.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'AWS WAF 文档', 'url': 'https://docs.aws.amazon.com/waf/latest/developerguide/', 'type': 'doc', 'source': 'AWS'},
        {'title': 'Cloudflare WAF', 'url': 'https://developers.cloudflare.com/waf/', 'type': 'doc', 'source': 'Cloudflare'},
        {'title': 'VPC Endpoint 配置', 'url': 'https://docs.aws.amazon.com/vpc/latest/privatelink/', 'type': 'doc', 'source': 'AWS'},
        {'title': 'Transit Gateway 文档', 'url': 'https://docs.aws.amazon.com/vpc/latest/tgw/', 'type': 'doc', 'source': 'AWS'}
    ],
    'cloud-data-protection-basics': [
        {'title': 'AWS KMS 文档', 'url': 'https://docs.aws.amazon.com/kms/latest/developerguide/', 'type': 'doc', 'source': 'AWS'},
        {'title': 'Azure Key Vault', 'url': 'https://learn.microsoft.com/zh-cn/azure/key-vault/', 'type': 'doc', 'source': 'Microsoft'},
        {'title': 'GCP KMS', 'url': 'https://cloud.google.com/kms/docs', 'type': 'doc', 'source': 'Google Cloud'},
        {'title': 'S3 加密配置', 'url': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html', 'type': 'doc', 'source': 'AWS'},
        {'title': '数据分类最佳实践', 'url': 'https://aws.amazon.com/blogs/security/how-to-classify-your-data-using-amazon-macie/', 'type': 'tutorial', 'source': 'AWS'},
        {'title': '数据脱敏技术', 'url': 'https://www.imperva.com/learn/data-security/data-masking/', 'type': 'tutorial', 'source': 'Imperva'}
    ],
    'cloud-logging-monitoring-basics': [
        {'title': 'AWS CloudTrail', 'url': 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/', 'type': 'doc', 'source': 'AWS'},
        {'title': 'Azure 活动日志', 'url': 'https://learn.microsoft.com/zh-cn/azure/azure-monitor/essentials/', 'type': 'doc', 'source': 'Microsoft'},
        {'title': 'GCP 审计日志', 'url': 'https://cloud.google.com/logging/docs/audit', 'type': 'doc', 'source': 'Google Cloud'},
        {'title': 'CloudWatch 告警', 'url': 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'VPC Flow Logs', 'url': 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'SIEM 集成指南', 'url': 'https://www.splunk.com/en_us/blog/cloud/security-siem-cloud.html', 'type': 'tutorial', 'source': 'Splunk'}
    ],
    'cloud-compute-security-basics': [
        {'title': 'EC2 安全加固', 'url': 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'IMDSv2 配置', 'url': 'https://docs.aws.amazon.com/imds/latest/developerguide/configuring-imds-v2.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'AWS SSM 补丁管理', 'url': 'https://docs.aws.amazon.com/systems-manager/latest/userguide/patch.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'CIS 基准镜像', 'url': 'https://www.cisecurity.org/benchmark/amazon_web_services', 'type': 'doc', 'source': 'CIS'},
        {'title': 'Spot 实例安全', 'url': 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html', 'type': 'doc', 'source': 'AWS'},
        {'title': '自动伸缩安全', 'url': 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/security.html', 'type': 'doc', 'source': 'AWS'}
    ],
    'cloud-security-tools': [
        {'title': 'Checkov 官方文档', 'url': 'https://www.checkov.io/', 'type': 'doc', 'source': 'Bridgecrew'},
        {'title': 'Trivy 容器扫描', 'url': 'https://aquasecurity.github.io/trivy/', 'type': 'doc', 'source': 'Aqua Security'},
        {'title': 'Gitleaks 密钥检测', 'url': 'https://github.com/gitleaks/gitleaks', 'type': 'tutorial', 'source': 'GitHub'},
        {'title': 'OWASP ZAP', 'url': 'https://www.zaproxy.org/docs/', 'type': 'doc', 'source': 'OWASP'},
        {'title': 'AWS Security Hub', 'url': 'https://docs.aws.amazon.com/securityhub/latest/userguide/', 'type': 'doc', 'source': 'AWS'},
        {'title': 'CSPM 工具对比', 'url': 'https://www.gartner.com/reviews/category/cloud-security-posture-management', 'type': 'tutorial', 'source': 'Gartner'}
    ],
    'advanced-cloud-iam': [
        {'title': 'AWS IAM Identity Center', 'url': 'https://docs.aws.amazon.com/singlesignon/latest/userguide/', 'type': 'doc', 'source': 'AWS'},
        {'title': 'SAML 联邦配置', 'url': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_saml.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'OAuth2 联合身份', 'url': 'https://oauth.net/2/federation/', 'type': 'doc', 'source': 'OAuth.net'},
        {'title': 'PAM 最佳实践', 'url': 'https://www.beyondtrust.com/blog/ Privileged-Access-Management', 'type': 'tutorial', 'source': 'BeyondTrust'},
        {'title': 'OPA 策略引擎', 'url': 'https://www.openpolicyagent.org/docs/', 'type': 'doc', 'source': 'OPA'},
        {'title': 'ABAC 策略设计', 'url': 'https://aws.amazon.com/blogs/security/how-to-use-attribute-based-access-control/', 'type': 'tutorial', 'source': 'AWS'}
    ],
    'cspm-compliance-automation': [
        {'title': 'AWS Security Hub', 'url': 'https://docs.aws.amazon.com/securityhub/latest/userguide/', 'type': 'doc', 'source': 'AWS'},
        {'title': 'Azure 安全中心', 'url': 'https://learn.microsoft.com/zh-cn/azure/defender-for-cloud/', 'type': 'doc', 'source': 'Microsoft'},
        {'title': 'GCP Security Command Center', 'url': 'https://cloud.google.com/security-command-center', 'type': 'doc', 'source': 'Google Cloud'},
        {'title': 'CIS 基准自动化', 'url': 'https://www.cisecurity.org/automated-scanning', 'type': 'tutorial', 'source': 'CIS'},
        {'title': 'AWS Config Rules', 'url': 'https://docs.aws.amazon.com/config/latest/developerguide/', 'type': 'doc', 'source': 'AWS'},
        {'title': '合规即代码实践', 'url': 'https://www.hashicorp.com/blog/automating-compliance-as-code', 'type': 'tutorial', 'source': 'HashiCorp'}
    ],
    'container-cloud-security': [
        {'title': 'K8s RBAC 文档', 'url': 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/', 'type': 'doc', 'source': 'CNCF'},
        {'title': 'Falco 运行时安全', 'url': 'https://falco.org/docs/', 'type': 'doc', 'source': 'Falco'},
        {'title': 'Istio 服务网格安全', 'url': 'https://istio.io/latest/docs/tasks/security/', 'type': 'doc', 'source': 'Istio'},
        {'title': 'Cosign 镜像签名', 'url': 'https://github.com/sigstore/cosign', 'type': 'tutorial', 'source': 'Sigstore'},
        {'title': 'SBOM 生成工具', 'url': 'https://cyclonedx.org/', 'type': 'tutorial', 'source': 'CycloneDX'},
        {'title': 'Sigstore 供应链安全', 'url': 'https://sigstore.dev/', 'type': 'tutorial', 'source': 'Sigstore'}
    ],
    'serverless-security': [
        {'title': 'Lambda 安全最佳实践', 'url': 'https://docs.aws.amazon.com/lambda/latest/dg/security.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'API Gateway 安全', 'url': 'https://docs.aws.amazon.com/apigateway/latest/developerguide/rest-api.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'Cloudflare Workers 安全', 'url': 'https://developers.cloudflare.com/workers/security/', 'type': 'doc', 'source': 'Cloudflare'},
        {'title': '事件驱动架构安全', 'url': 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-security.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'Step Functions 安全', 'url': 'https://docs.aws.amazon.com/step-functions/latest/dg/security.html', 'type': 'doc', 'source': 'AWS'},
        {'title': '无服务器安全工具', 'url': 'https://www.puresec.io/serverless-security', 'type': 'tutorial', 'source': 'PureSec'}
    ],
    'cloud-database-security': [
        {'title': 'RDS 安全最佳实践', 'url': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'DynamoDB 安全', 'url': 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/security.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'Aurora 安全配置', 'url': 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora/security.html', 'type': 'doc', 'source': 'AWS'},
        {'title': 'NoSQL 数据库安全', 'url': 'https://www.mongodb.com/docs/manual/security/', 'type': 'doc', 'source': 'MongoDB'},
        {'title': 'Redis 安全加固', 'url': 'https://redis.io/docs/management/security/', 'type': 'doc', 'source': 'Redis'},
        {'title': '数据仓库安全', 'url': 'https://www.snowflake.com/blog/data-warehouse-security-best-practices/', 'type': 'tutorial', 'source': 'Snowflake'}
    ],
}


def format_resources(resources):
    """Format resources array as a string."""
    lines = ["          resources: ["]
    for r in resources:
        lines.append(f"            {{ title: '{r['title']}', url: '{r['url']}', type: '{r['type']}', source: '{r['source']}' }},")
    lines.append("          ]")
    return '\n'.join(lines)


def add_resources_to_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to find skills that have knowledgePoints but not resources
    # Match: { id: 'skill-id' ... knowledgePoints: [ ... ] }
    # The skill ends when we see ] followed by optional whitespace then }

    # Find all skill blocks with knowledgePoints
    skill_pattern = r"\{\s*id:\s*'([^']+)'[^}]*knowledgePoints:\s*\[([\s\S]*?)\]\n\s*\}"

    # Process replacements in reverse order to preserve positions
    matches = list(re.finditer(skill_pattern, content))

    # Work backwards so replacements don't mess up positions
    for m in reversed(matches):
        skill_id = m.group(1)
        full_match = m.group(0)

        # Check if this skill already has resources
        if 'resources:' in full_match:
            continue

        # Check if we have resources for this skill
        if skill_id not in SKILL_RESOURCES:
            continue

        # Find where to insert resources - after knowledgePoints ] and before the closing }
        # The match ends with ]\n        } but we need to insert resources after the ]

        # Find the position of the closing }
        end_brace = full_match.rfind('}')
        # Find the position of the ]
        end_bracket = full_match.rfind(']')

        # Insert resources between ] and }
        resources_str = format_resources(SKILL_RESOURCES[skill_id])

        # The pattern is: knowledgePoints: [...]    }
        # We want: knowledgePoints: [...], resources: [...] }
        # But actually based on the actual pattern we see:
        #           ]
        #         },
        # So we need to replace the trailing ,\n        } with ,\n        resources: [...]\n        },

        # Find the last ] in the match
        # We need to insert after ] but before the ,\n        }
        # The match ends with: ]\n        }
        # Actually looking at the pattern more carefully - the closing ] is the end of knowledgePoints array
        # Then there may be a comma before the closing }

        # Let's look at what's after the ]
        after_kp = full_match[end_bracket+1:]

        # Find the closing } for this skill block
        # We need to be careful because each skill is in a list, so it may end with }, or just }

        # Find the pattern ]\n          } or ]\n        },
        rest_of_skill = full_match[end_bracket:]

        if rest_of_skill.strip().startswith(']'):
            # Find the closing brace
            # It should be after the ]
            closing_idx = full_match.find('}', end_bracket)
            if closing_idx != -1:
                # Check what comes before }
                before_close = full_match[closing_idx-1]
                if before_close == ',':
                    # Ends with } after ], so we need to insert resources after ],
                    # replacing the ,} with , resources: [...] }
                    insert_pos = end_bracket + 1
                    resources_text = '\n' + resources_str + '\n        '
                    new_match = full_match[:insert_pos] + resources_text + full_match[closing_idx:]
                else:
                    # Just }
                    insert_pos = end_bracket + 1
                    resources_text = '\n' + resources_str + '\n        '
                    new_match = full_match[:insert_pos] + resources_text + full_match[closing_idx:]

                # Replace in content
                content = content[:m.start()] + new_match + content[m.end():]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)


if __name__ == '__main__':
    filepath = '/Users/allengaller/Documents/GitHub/standup-coder/skills4coder/webui/index.html'
    add_resources_to_file(filepath)
    print("Done! Resources added to skills.")
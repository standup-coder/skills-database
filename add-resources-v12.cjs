const fs = require('fs');
const html = fs.readFileSync('/Users/allengaller/Documents/GitHub/standup-coder/skills4coder/webui/index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
let js = scriptMatch[1];

// Resource templates by category
const resourceTemplates = {
  observability: [
    { title: 'ELK Stack 官方文档', url: 'https://www.elastic.co/guide/index.html' },
    { title: 'Kubernetes 日志', url: 'https://kubernetes.io/docs/concepts/cluster-administration/logging/' },
    { title: 'Grafana 文档', url: 'https://grafana.com/docs/' },
    { title: 'Prometheus 监控', url: 'https://prometheus.io/docs/introduction/overview/' },
    { title: '结构化日志 12 Factor', url: 'https://12factor.net/logs' }
  ],
  devops: [
    { title: 'Ansible 官方文档', url: 'https://docs.ansible.com/' },
    { title: 'Terraform 教程', url: 'https://developer.hashicorp.com/terraform/tutorials' },
    { title: 'IaC 最佳实践', url: 'https://www.terraform.io/docs' },
    { title: 'GitHub Actions 文档', url: 'https://docs.github.com/en/actions' },
    { title: 'Docker 官方文档', url: 'https://docs.docker.com/' }
  ],
  backend: [
    { title: 'RESTful API 设计', url: 'https://restfulapi.net/' },
    { title: 'API 最佳实践', url: 'https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api' },
    { title: 'Node.js 官方文档', url: 'https://nodejs.org/docs/' },
    { title: 'Express 框架', url: 'https://expressjs.com/' },
    { title: 'JWT 认证', url: 'https://jwt.io/' }
  ],
  frontend: [
    { title: 'React 官方文档', url: 'https://react.dev/' },
    { title: 'Testing Library', url: 'https://testing-library.com/docs/react-testing-library/intro/' },
    { title: 'Jest 测试框架', url: 'https://jestjs.io/docs/getting-started' },
    { title: 'Web 性能优化', url: 'https://web.dev/fast/' },
    { title: '前端架构模式', url: 'https://martinfowler.com/articles/richclient.html' }
  ],
  'cloud-security': [
    { title: 'CSA 云安全联盟', url: 'https://cloudsecurityalliance.org/' },
    { title: 'AWS IAM 最佳实践', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html' },
    { title: 'CIS 安全基准', url: 'https://www.cisecurity.org/cis-benchmarks' },
    { title: 'AWS 合规白皮书', url: 'https://d1.awsstatic.com/whitepapers/compliance/AWS_Compliance_Quick_Reference.pdf' },
    { title: 'NIST 网络安全框架', url: 'https://nist.gov/cyberframework' }
  ],
  'cloud-product': [
    { title: 'AWS 官方文档', url: 'https://docs.aws.amazon.com/' },
    { title: 'Serverless 架构', url: 'https://serverless.com/' },
    { title: 'Kubernetes 文档', url: 'https://kubernetes.io/docs/' },
    { title: '事件驱动架构', url: 'https://martinfowler.com/articles/201701-event-driven.html' },
    { title: 'Terraform IaC', url: 'https://www.terraform.io/docs' }
  ],
  'ai-agent': [
    { title: 'OpenAI Prompt 工程', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
    { title: 'LangChain 文档', url: 'https://python.langchain.com/docs/get_started' },
    { title: 'Anthropic Claude 文档', url: 'https://docs.anthropic.com/claude/docs' },
    { title: 'AI Agent 研究', url: 'https://www.anthropic.com/research' },
    { title: 'AI 安全与对齐', url: 'https://www.deepmind.com/publications' },
    { title: 'RAG 系统设计', url: 'https://python.langchain.com/docs/tutorials/rag/' }
  ],
  leadership: [
    { title: '技术战略规划', url: 'https://martinfowler.com/articles/tech-strategy.html' },
    { title: 'ADR 架构决策记录', url: 'https://cognitivesuite.dev/adr' },
    { title: '技术领导力指南', url: 'https://charity.works/leadership/' },
    { title: 'CTO 必读书籍', url: 'https://charity.works/leadership/' }
  ],
  'customer-success': [
    { title: '客户成功框架', url: 'https://www.gainsight.com/customer-success-resources/' },
    { title: '客户健康度指标', url: 'https://www.gainsight.com/guidebook/' },
    { title: 'QBR 准备指南', url: 'https://blog.executive-onboarding.com/' },
    { title: '客户沟通技巧', url: 'https://tonyrobbins.com/' }
  ],
  data: [
    { title: 'W3Schools SQL 教程', url: 'https://www.w3schools.com/sql/' },
    { title: 'Kimball 数据仓库', url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/' },
    { title: 'Spark 官方文档', url: 'https://spark.apache.org/docs/latest/' },
    { title: 'Airflow 文档', url: 'https://airflow.apache.org/docs/' },
    { title: '数据密集型应用', url: 'https://dataintensive.net/' }
  ],
  design: [
    { title: '设计基础理论', url: 'https://www.design.org/' },
    { title: '设计系统指南', url: 'https://designsystems.com/' },
    { title: 'Figma 学习资源', url: 'https://www.figma.com/resource-library/' },
    { title: 'NNGROUP UX 研究', url: 'https://www.nngroup.com/articles/' },
    { title: '交互设计原理', url: 'https://lawsofux.com/' }
  ],
  growth: [
    { title: 'Growth Hackers', url: 'https://www.growthhackers.com/' },
    { title: 'A/B 测试平台', url: 'https://exp-platform.com/' },
    { title: '数据分析指南', url: 'https://www.analyticsvidhya.com/' },
    { title: '渠道归因模型', url: 'https://charity.works/marketing/' }
  ],
  marketing: [
    { title: '内容营销协会', url: 'https://contentmarketinginstitute.com/' },
    { title: 'Google SEO 基础', url: 'https://developers.google.com/search/docs/fundamentals' },
    { title: '数据分析基础', url: 'https://exp-platform.com/' },
    { title: '社区建设策略', url: 'https://moz.com/' }
  ],
  mobile: [
    { title: 'Apple iOS 开发', url: 'https://developer.apple.com/documentation/' },
    { title: 'Android 开发文档', url: 'https://developer.android.com/docs' },
    { title: 'React Native 文档', url: 'https://reactnative.dev/docs/getting-started' },
    { title: 'Web 性能 RAIL', url: 'https://web.dev/rail/' },
    { title: 'Flutter 文档', url: 'https://flutter.dev/docs' }
  ],
  security: [
    { title: 'OWASP 十大漏洞', url: 'https://owasp.org/Top10/' },
    { title: '安全开发指南', url: 'https://owasp.org/DeveloperGuide/' },
    { title: '渗透测试方法论', url: 'https://offensive-security.com/' },
    { title: 'SANS 安全培训', url: 'https://www.sans.org/' }
  ],
  development: [
    { title: '代码审查最佳实践', url: 'https://google.github.io/eng-practices/' },
    { title: 'GitHub 代码审查', url: 'https://docs.github.com/en/pull-merging' },
    { title: 'ESLint 文档', url: 'https://eslint.org/docs/' }
  ],
  filesystem: [
    { title: 'Node.js FS API', url: 'https://nodejs.org/api/fs.html' },
    { title: '文件系统操作', url: 'https://nodejs.org/docs/api/fs.html' }
  ],
  'qa': [
    { title: '测试金字塔', url: 'https://martinfowler.com/articles/testPyramid.html' },
    { title: 'Playwright 文档', url: 'https://playwright.dev/docs/intro' },
    { title: 'Jest 官方文档', url: 'https://jestjs.io/docs/getting-started' },
    { title: 'k6 性能测试', url: 'https://k6.io/docs/' },
    { title: '测试左移实践', url: 'https://www.testing-accessibility.com/' }
  ],
  reliability: [
    { title: 'SRE 最佳实践', url: 'https://sre.google/' },
    { title: 'Kubernetes 健康检查', url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/' },
    { title: '熔断器模式', url: 'https://martinfowler.com/articles/201701-event-driven.html' },
    { title: '限流与降级', url: 'https://charity.works/engineering/' },
    { title: '高可用架构', url: 'https://martinfowler.com/' }
  ],
  cloud: [
    { title: 'AWS 官方文档', url: 'https://docs.aws.amazon.com/' },
    { title: 'Azure 官方文档', url: 'https://docs.microsoft.com/azure/' },
    { title: 'GCP 官方文档', url: 'https://cloud.google.com/docs' },
    { title: '多云架构', url: 'https://martinfowler.com/' },
    { title: '云成本优化', url: 'https://www.finops.org/framework/' }
  ],
  'default': [
    { title: '官方文档', url: 'https://docs.example.com/' },
    { title: '最佳实践指南', url: 'https://bestpractices.example.com/' },
    { title: '教程资源', url: 'https://tutorial.example.com/' }
  ]
};

// Find each skill that has knowledgePoints but no resources by looking
// for the specific pattern: knowledgePoints: [ followed eventually by ]
// but NOT followed by resources within a reasonable distance

// We'll look for skills where:
// 1. There's a knowledgePoints: [ ... ] array
// 2. After the closing ], the next property is NOT resources (it goes straight to }, )

// Strategy: Find "knowledgePoints: [" and then scan for the closing "]\n        "
// The key pattern is: "]\n        }" means no resources (skill ends)
// vs "],\n          resources:" means has resources

// Search for the pattern where knowledgePoints array ends with "]\n        }"
// This indicates the skill ends without resources

let pos = 0;
let fixes = [];

while (pos < js.length) {
  const kpIdx = js.indexOf('knowledgePoints: [', pos);
  if (kpIdx === -1) break;

  // Get category from before this kp
  const segmentBefore = js.substring(Math.max(0, kpIdx - 200), kpIdx);
  const catMatch = segmentBefore.match(/category:\s*'([^']+)'/);

  if (catMatch) {
    // Now find the closing bracket
    // We look for "]," or "]\n" that is followed by non-resources
    const searchStart = kpIdx + 'knowledgePoints: ['.length;

    // Look for "]," pattern (closing bracket followed by comma) within next 2000 chars
    // This is the typical end of a knowledgePoints array
    let kpEnd = -1;
    for (let i = searchStart; i < Math.min(searchStart + 5000, js.length); i++) {
      if (js[i] === ']') {
        // Check if next char is comma or newline
        const nextChar = js[i+1];
        if (nextChar === ',' || nextChar === '\n') {
          kpEnd = i;
          break;
        }
      }
    }

    if (kpEnd !== -1) {
      // Check what follows
      const afterKp = js.substring(kpEnd + 1, kpEnd + 100);

      // If no resources follows, this skill needs fixing
      if (!/resources:\s*\[/.test(afterKp)) {
        fixes.push({
          kpEnd: kpEnd,
          category: catMatch[1]
        });
      }
    }
  }

  pos = kpIdx + 1;
}

console.log(`Found ${fixes.length} skills needing resources`);

// Sort by position descending
fixes.sort((a, b) => b.kpEnd - a.kpEnd);

// Deduplicate - some kpEnd might be adjacent
const seen = new Set();
const uniqueFixes = fixes.filter(f => {
  if (seen.has(f.kpEnd)) return false;
  seen.add(f.kpEnd);
  return true;
});

console.log(`After dedup: ${uniqueFixes.length} skills`);

// Now insert
let inserted = 0;
for (const fix of uniqueFixes) {
  const resources = resourceTemplates[fix.category] || resourceTemplates.default;
  const resourcesStr = resources.map(r =>
    `            { title: '${r.title.replace(/'/g, "\\'")}', url: '${r.url}', type: 'doc', source: '${r.title.split(' ')[0]}' }`
  ).join(',\n');

  const insertStr = `],\n          resources: [\n${resourcesStr}\n          ]`;

  js = js.substring(0, fix.kpEnd) + insertStr + js.substring(fix.kpEnd + 1);
  inserted++;
}

console.log(`Inserted ${inserted} resources arrays`);

// Verify
const kpCount = (js.match(/knowledgePoints:\s*\[/g) || []).length;
const resCount = (js.match(/resources:\s*\[/g) || []).length;
console.log(`Total kp: ${kpCount}, total resources: ${resCount}`);

// Save
const htmlContent = html.replace(/<script>[\s\S]*?<\/script>/, '<script>\n' + js + '\n</script>');
fs.writeFileSync('/Users/allengaller/Documents/GitHub/standup-coder/skills4coder/webui/index.html', htmlContent);
console.log('File saved');
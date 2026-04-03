/**
 * 示例：Ops Agent 运维技能演示
 *
 * 演示如何：
 * 1. 加载 DevOps Engineer 和 SRE Engineer 角色
 * 2. 执行 Docker 容器管理
 * 3. 执行 K8s 部署审查
 * 4. 生成运维报告
 */

import { Agent, Role } from 'skills4coder';

async function main() {
  console.log('🚀 启动 Ops Agent 运维技能演示\n');

  // 1. 加载 DevOps Engineer 角色
  const devopsRole = Role.fromJSON('./roles/devops-engineer.json');
  const devopsAgent = new Agent({
    role: devopsRole,
    llm: 'gpt-4',
    tools: [],
    debug: true
  });

  // 2. 加载 SRE Engineer 角色
  const sreRole = Role.fromJSON('./roles/sre-engineer.json');
  const sreAgent = new Agent({
    role: sreRole,
    llm: 'gpt-4',
    tools: [],
    debug: true
  });

  console.log('👤 角色加载完成');
  console.log(`   - DevOps: ${devopsRole.name}`);
  console.log(`   - SRE:    ${sreRole.name}\n`);

  // 3. DevOps Agent 执行 Docker 容器管理
  console.log('🐳 [DevOps] 执行 Docker 容器状态检查...');
  try {
    const dockerResult = await devopsAgent.use('docker-container-management', {
      action: 'status',
      container: 'nginx'
    });
    console.log('   结果:', JSON.stringify(dockerResult, null, 2));
  } catch (err) {
    console.error('   ❌ 失败:', err.message);
  }

  // 4. SRE Agent 执行 K8s 部署审查
  console.log('\n☸️  [SRE] 执行 K8s Deployment 安全审查...');
  try {
    const k8sResult = await sreAgent.use('k8s-deployment-review', {
      manifestPath: './examples/deployment.yaml',
      focus: ['security', 'best-practice']
    });
    console.log('   通过:', k8sResult.valid);
    console.log('   评分:', k8sResult.score);
    console.log('   问题数:', k8sResult.issues?.length || 0);
  } catch (err) {
    console.error('   ❌ 失败:', err.message);
  }

  // 5. SRE Agent 执行日志分析
  console.log('\n📜 [SRE] 执行日志分析...');
  try {
    const logResult = await sreAgent.use('log-analysis', {
      logFilePath: './examples/app.log',
      logFormat: 'json',
      query: '找出最近1小时的5xx错误原因'
    });
    console.log('   摘要:', logResult.summary);
    console.log('   异常数:', logResult.anomalies?.length || 0);
  } catch (err) {
    console.error('   ❌ 失败:', err.message);
  }

  // 6. 生成 Agent 报告
  console.log('\n📊 Agent 能力报告');
  console.log('─'.repeat(40));

  const devopsReport = devopsAgent.generateReport();
  console.log(`\n[DevOps Agent] 可用技能数: ${devopsReport.skillsAvailable.length}`);
  console.log('   技能示例:', devopsReport.skillsAvailable.slice(0, 6).join(', '));

  const sreReport = sreAgent.generateReport();
  console.log(`\n[SRE Agent] 可用技能数: ${sreReport.skillsAvailable.length}`);
  console.log('   技能示例:', sreReport.skillsAvailable.slice(0, 6).join(', '));

  console.log('\n✅ Ops Demo 完成！');
}

main().catch(console.error);

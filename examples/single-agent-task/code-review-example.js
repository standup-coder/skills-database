/**
 * 示例：使用 Code Reviewer Agent 审查代码
 * 
 * 演示如何：
 * 1. 加载 Role 定义
 * 2. 创建专业 Agent
 * 3. 执行代码审查任务
 */

import { Agent, Role } from 'skills4coder';
import { MCPServer } from 'skills4coder/orchestration/mcp-server';

async function main() {
  // 1. 初始化 MCP Server（用于文件操作）
  const mcpServer = new MCPServer({
    name: 'filesystem-server',
    tools: ['read_file', 'list_directory']
  });
  
  await mcpServer.connect();
  
  // 2. 加载 Role 定义
  const reviewerRole = Role.fromJSON('../../roles/senior-frontend-dev.json');
  
  // 3. 创建专业 Code Reviewer Agent
  const reviewer = new Agent({
    role: reviewerRole,
    llm: 'gpt-4',
    tools: [mcpServer],
    config: {
      focus: ['security', 'performance', 'maintainability']
    }
  });
  
  // 4. 要审查的文件
  const filesToReview = [
    './src/components/UserProfile.tsx',
    './src/hooks/useAuth.ts',
    './src/utils/api.ts'
  ];
  
  console.log('🔍 开始代码审查...\n');
  
  // 5. 执行代码审查
  for (const filePath of filesToReview) {
    console.log(`📄 审查文件: ${filePath}`);
    
    try {
      const result = await reviewer.use('code-review', {
        filePath,
        focus: ['security', 'performance']
      });
      
      // 6. 输出审查结果
      console.log(`   评分: ${result.score}/100`);
      console.log(`   状态: ${result.approval}`);
      console.log(`   发现 ${result.issues.length} 个问题:`);
      
      result.issues.forEach(issue => {
        const icon = issue.severity === 'critical' ? '🔴' :
                     issue.severity === 'high' ? '🟠' :
                     issue.severity === 'medium' ? '🟡' : '🔵';
        console.log(`   ${icon} [${issue.category}] 第${issue.line}行: ${issue.message}`);
      });
      
      if (result.suggestions.length > 0) {
        console.log('   💡 建议:');
        result.suggestions.forEach(s => console.log(`      - ${s}`));
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`   ❌ 审查失败: ${error.message}`);
    }
  }
  
  // 7. 生成审查报告
  const report = reviewer.generateReport();
  console.log('📊 审查统计:');
  console.log(`   - 审查文件数: ${report.totalFiles}`);
  console.log(`   - 发现问题数: ${report.totalIssues}`);
  console.log(`   - 平均评分: ${report.averageScore}`);
  console.log(`   - Token 消耗: ${report.tokenUsage}`);
  
  // 8. 断开连接
  await mcpServer.disconnect();
}

// 运行示例
main().catch(console.error);

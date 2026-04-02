/**
 * 示例：多 Agent 协作开发新功能
 * 
 * 场景：开发一个用户认证功能，需要 PM、后端、前端、QA 协作
 */

import { Agent, Role, Team, Workflow } from 'skills4coder';

async function main() {
  console.log('🚀 启动多 Agent 协作开发流程\n');
  
  // 1. 定义项目团队
  const team = new Team({
    name: 'Auth Feature Team',
    members: [
      {
        id: 'pm-agent',
        role: Role.fromJSON('../../roles/product-manager.json'),
        llm: 'gpt-4',
        name: '产品经理小P'
      },
      {
        id: 'architect-agent',
        role: Role.fromJSON('../../roles/backend-architect.json'),
        llm: 'gpt-4',
        name: '架构师小A'
      },
      {
        id: 'backend-agent',
        role: Role.fromJSON('../../roles/backend-developer.json'),
        llm: 'gpt-4',
        name: '后端开发小B'
      },
      {
        id: 'frontend-agent',
        role: Role.fromJSON('../../roles/senior-frontend-dev.json'),
        llm: 'gpt-4',
        name: '前端开发小F'
      },
      {
        id: 'qa-agent',
        role: Role.fromJSON('../../roles/qa-automation.json'),
        llm: 'gpt-4',
        name: '测试工程师小Q'
      }
    ]
  });
  
  // 2. 定义开发工作流
  const devWorkflow = new Workflow({
    name: 'User Authentication Feature',
    description: '实现完整的用户认证功能',
    
    context: {
      project: 'MyApp',
      techStack: {
        backend: ['Node.js', 'Express', 'PostgreSQL'],
        frontend: ['React', 'TypeScript', 'Tailwind CSS']
      }
    },
    
    steps: [
      // Step 1: PM 编写需求文档
      {
        id: 'write-prd',
        name: '编写需求文档',
        agent: 'pm-agent',
        skill: 'write-prd',
        input: {
          feature: '用户认证系统',
          requirements: [
            '支持邮箱/密码登录',
            '支持 OAuth (GitHub, Google)',
            '支持 JWT Token',
            '支持密码重置'
          ]
        },
        output: {
          path: './output/PRD.md',
          type: 'markdown'
        }
      },
      
      // Step 2: 架构师设计系统（依赖 PRD）
      {
        id: 'design-architecture',
        name: '系统架构设计',
        agent: 'architect-agent',
        skill: 'design-system',
        dependsOn: ['write-prd'],
        input: {
          prd: '{{steps.write-prd.output}}',
          constraints: {
            scalability: '100k users',
            security: 'OWASP Top 10'
          }
        },
        output: {
          path: './output/architecture.md',
          type: 'markdown'
        }
      },
      
      // Step 3: 架构师设计 API（依赖 PRD）
      {
        id: 'design-api',
        name: 'API 设计',
        agent: 'architect-agent',
        skill: 'design-api',
        dependsOn: ['write-prd'],
        input: {
          prd: '{{steps.write-prd.output}}',
          style: 'RESTful',
          format: 'OpenAPI 3.0'
        },
        output: {
          path: './output/api-spec.yaml',
          type: 'yaml'
        }
      },
      
      // Step 4: 后端开发（依赖 API 设计）
      {
        id: 'implement-backend',
        name: '后端实现',
        agent: 'backend-agent',
        skill: 'implement-api',
        dependsOn: ['design-api'],
        input: {
          apiSpec: '{{steps.design-api.output}}',
          language: 'TypeScript',
          framework: 'Express'
        },
        output: {
          path: './output/backend/',
          type: 'code'
        }
      },
      
      // Step 5: 数据库设计（依赖架构设计）
      {
        id: 'design-database',
        name: '数据库设计',
        agent: 'architect-agent',
        skill: 'design-database',
        dependsOn: ['design-architecture'],
        input: {
          requirements: '{{steps.write-prd.output}}',
          dbType: 'PostgreSQL'
        },
        output: {
          path: './output/schema.sql',
          type: 'sql'
        }
      },
      
      // Step 6: 前端开发（依赖 API 设计，可与后端并行）
      {
        id: 'implement-frontend',
        name: '前端实现',
        agent: 'frontend-agent',
        skill: 'implement-ui',
        dependsOn: ['design-api'],
        input: {
          apiSpec: '{{steps.design-api.output}}',
          pages: ['login', 'register', 'forgot-password', 'profile'],
          techStack: ['React', 'TypeScript', 'Tailwind CSS']
        },
        output: {
          path: './output/frontend/',
          type: 'code'
        }
      },
      
      // Step 7: 代码审查（依赖前后端实现）
      {
        id: 'code-review',
        name: '代码审查',
        agent: 'architect-agent',
        skill: 'review-code',
        dependsOn: ['implement-backend', 'implement-frontend'],
        input: {
          backendCode: '{{steps.implement-backend.output}}',
          frontendCode: '{{steps.implement-frontend.output}}',
          focus: ['security', 'performance']
        },
        output: {
          path: './output/code-review.md',
          type: 'markdown'
        }
      },
      
      // Step 8: 修复问题（依赖代码审查）
      {
        id: 'fix-issues',
        name: '修复问题',
        agent: 'backend-agent',
        skill: 'fix-issues',
        dependsOn: ['code-review'],
        input: {
          code: '{{steps.implement-backend.output}}',
          issues: '{{steps.code-review.output.issues}}'
        },
        output: {
          path: './output/backend-fixed/',
          type: 'code'
        }
      },
      
      // Step 9: 编写测试（依赖前后端实现）
      {
        id: 'write-tests',
        name: '编写测试',
        agent: 'qa-agent',
        skill: 'write-e2e-tests',
        dependsOn: ['fix-issues', 'implement-frontend'],
        input: {
          prd: '{{steps.write-prd.output}}',
          apiSpec: '{{steps.design-api.output}}',
          testType: 'e2e'
        },
        output: {
          path: './output/tests/',
          type: 'code'
        }
      },
      
      // Step 10: 生成部署文档
      {
        id: 'deployment-docs',
        name: '生成部署文档',
        agent: 'architect-agent',
        skill: 'generate-deployment-guide',
        dependsOn: ['fix-issues', 'write-tests'],
        input: {
          architecture: '{{steps.design-architecture.output}}',
          backend: '{{steps.fix-issues.output}}',
          frontend: '{{steps.implement-frontend.output}}',
          database: '{{steps.design-database.output}}'
        },
        output: {
          path: './output/DEPLOYMENT.md',
          type: 'markdown'
        }
      }
    ],
    
    // 执行策略
    strategy: {
      maxParallel: 3,      // 最多并行 3 个任务
      failFast: false,     // 遇到错误不立即停止
      timeout: '30m'       // 总超时 30 分钟
    }
  });
  
  // 3. 注册事件监听
  devWorkflow.on('step:start', ({ step, agent }) => {
    console.log(`[${new Date().toLocaleTimeString()}] 🟡 ${agent.name} 开始: ${step.name}`);
  });
  
  devWorkflow.on('step:complete', ({ step, agent, duration }) => {
    console.log(`[${new Date().toLocaleTimeString()}] ✅ ${agent.name} 完成: ${step.name} (${duration}s)`);
  });
  
  devWorkflow.on('step:error', ({ step, agent, error }) => {
    console.log(`[${new Date().toLocaleTimeString()}] ❌ ${agent.name} 失败: ${step.name}`);
    console.error(`   错误: ${error.message}`);
  });
  
  // 4. 执行工作流
  console.log('📋 项目需求: 实现用户认证系统\n');
  console.log('👥 团队成员:');
  team.members.forEach(m => console.log(`   - ${m.name} (${m.role.metadata.name})`));
  console.log('');
  
  const startTime = Date.now();
  
  try {
    const result = await team.executeWorkflow(devWorkflow);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ 项目开发完成！');
    console.log('='.repeat(50));
    console.log(`⏱️  总耗时: ${duration}s`);
    console.log(`📁 输出目录: ./output/`);
    console.log('\n📦 交付物:');
    result.outputs.forEach(output => {
      console.log(`   - ${output.path}`);
    });
    
    console.log('\n📊 统计信息:');
    console.log(`   - 完成任务: ${result.completedSteps}/${result.totalSteps}`);
    console.log(`   - Token 消耗: ${result.tokenUsage.total}`);
    console.log(`   - 代码生成: ${result.metrics.codeLines} 行`);
    
  } catch (error) {
    console.error('\n❌ 项目失败:', error.message);
    process.exit(1);
  }
}

// 运行示例
main().catch(console.error);

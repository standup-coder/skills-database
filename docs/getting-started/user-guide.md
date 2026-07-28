# 用户手册

Complete guide to using Skills Database for your professional development.

## 🌐 Languages
- [English](user-guide.md) | [中文](user-guide_zh.md)

---

## Table of Contents

1. [Introduction](#introduction)
2. [Understanding Skill Trees](#understanding-skill-trees)
3. [Role-Based Learning Paths](#role-based-learning-paths)
4. [Skill Ecosystem Integration](#skill-ecosystem-integration)
5. [Tracking Your Progress](#tracking-your-progress)
6. [Advanced Usage](#advanced-usage)
7. [Frequently Asked Questions](#frequently-asked-questions)

---

## Introduction

Skills Database is a comprehensive skill tree framework designed for technology professionals. Whether you're starting your career or looking to advance to the next level, this guide will help you navigate and utilize the skill trees effectively.

### What Makes Skills Database Different?

- **Comprehensive Coverage**: Four major roles with detailed skill breakdowns
- **AI-Native Integration**: Direct links to AI skill markets (SkillHub, Claw, MCP)
- **Progressive Levels**: Clear learning paths from beginner to expert
- **Community-Driven**: Open source and constantly evolving
- **Practical Focus**: Real-world skills that employers value

---

## Understanding Skill Trees

### Skill Tree Structure

Each skill tree follows a consistent structure:

```
Role Overview
├── Skill Level (Beginner → Expert)
│   ├── Core Skills
│   ├── Tools & Technologies
│   ├── Best Practices
│   └── Learning Resources
└── Specializations
    ├── Track A
    ├── Track B
    └── Track C
```

### Skill Levels Explained

| Level | Experience | Focus |
|-------|-----------|-------|
| **Beginner** | 0-2 years | Fundamentals, basic tools, simple projects |
| **Intermediate** | 2-4 years | Design patterns, testing, collaboration |
| **Advanced** | 4-7 years | Architecture, performance, leadership |
| **Expert** | 7+ years | Strategy, innovation, organizational impact |

---

## Role-Based Learning Paths

### 🧑‍💻 Developer Path

**Overview**: Software development across frontend, backend, and full-stack.

**Learning Journey**:
1. **Beginner**: Programming fundamentals, Git, HTML/CSS/JavaScript
2. **Intermediate**: Frameworks, databases, testing, CI/CD basics
3. **Advanced**: System design, microservices, security, mentoring
4. **Expert**: Architecture decisions, innovation, technical leadership

**Specializations**:
- [Frontend](../dev-skills/specializations/frontend.md) - UI/UX, React/Vue/Angular
- [Backend](../dev-skills/specializations/backend.md) - APIs, databases, server-side
- [Full Stack](../dev-skills/specializations/fullstack.md) - Complete application development
- [Mobile](../dev-skills/specializations/mobile.md) - iOS, Android, React Native
- [Data Engineering](../dev-skills/specializations/data.md) - Big data, ETL, analytics
- [Machine Learning](../dev-skills/specializations/ml.md) - AI/ML model development

### 🏗️ Architect Path

**Overview**: System design and technical decision-making.

**Architecture Types**:
- [Solution Architecture](../arch-skills/skills-lists/solution-arch.md) - Project-level design
- [Enterprise Architecture](../arch-skills/skills-lists/enterprise-arch.md) - Organizational standards
- [Cloud Architecture](../arch-skills/skills-lists/cloud-arch.md) - Cloud-native solutions
- [Security Architecture](../arch-skills/skills-lists/security-arch.md) - Security-by-design
- [Data Architecture](../arch-skills/skills-lists/data-arch.md) - Data governance

### 🧪 Testing Path

**Overview**: Quality assurance and testing strategies.

**Testing Types**:
- [Manual Testing](../testing-skills/skills-lists/manual-testing.md) - Human-driven testing
- [Test Automation](../testing-skills/skills-lists/test-automation.md) - Automated test frameworks
- [Performance Testing](../testing-skills/skills-lists/performance-testing.md) - Load and stress testing
- [Security Testing](../testing-skills/skills-lists/security-testing.md) - Vulnerability assessment
- [QA Process](../testing-skills/skills-lists/qa-process.md) - Quality methodologies

### 🔧 Operations Path

**Overview**: DevOps, SRE, and platform engineering.

**Operations Areas**:
- [Infrastructure](../ops-skills/skills-lists/infrastructure.md) - Cloud, virtualization
- [DevOps & CI/CD](../ops-skills/skills-lists/devops.md) - Automation pipelines
- [Monitoring](../ops-skills/skills-lists/monitoring.md) - Observability, alerting
- [Security Operations](../ops-skills/skills-lists/secops.md) - SecOps practices
- [Platform Engineering](../ops-skills/skills-lists/platform-engineering.md) - Developer experience

---

## Skill Ecosystem Integration

### AI-Native Skills

Modern development increasingly involves AI assistants. Skills Database integrates with major AI skill markets:

#### [Tencent SkillHub](../ecosystem/skillhub.md)
- Access Tencent's AI skill marketplace
- Enterprise-focused skills
- Chinese language optimization

#### [Claw Hub](../ecosystem/claw-hub.md)
- Lobehub's AI skill ecosystem
- Open source skill sharing
- Multi-modal AI capabilities

#### [MCP (Model Context Protocol)](../ecosystem/mcp-registry.md)
- Anthropic's open protocol for AI integrations
- Standardized skill definitions
- Cross-platform compatibility

### IDE Integration

#### [GitHub Copilot](../ecosystem/github-copilot.md)
- AI pair programming assistant
- Code completion and generation
- Context-aware suggestions

#### [Cursor](../ecosystem/cursor.md)
- AI-first code editor
- Natural language to code
- Refactoring assistance

#### [Lobe Chat](../ecosystem/lobe-chat.md)
- Open source AI chat platform
- Custom skill plugins
- Multi-model support

---

## Tracking Your Progress

### Method 1: Git-Based Tracking

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/skills-database.git
   cd skills-database
   ```

2. **Track Your Skills**
   - Edit skill checklists in `docs/`
   - Mark completed skills with `- [x]`
   - Add notes and resources

3. **Commit Progress**
   ```bash
   git add docs/dev-skills/skills-lists/beginner.md
   git commit -m "Update: Completed Git and Docker fundamentals"
   git push
   ```

### Method 2: Local Copy

Simply download the repository and edit files locally:

```bash
git clone https://github.com/standup-coder/skills-database.git
# Edit files with your favorite editor
```

### Method 3: Online Editor

Use GitHub's web interface to edit files directly:
1. Navigate to any skill list
2. Click the pencil icon (Edit)
3. Make your changes
4. Commit to your fork

---

## Advanced Usage

### Creating Custom Skill Paths

You can create custom skill trees for your organization:

1. Copy an existing skill list as template
2. Customize skills based on your tech stack
3. Add company-specific requirements
4. Share with your team

### Skill Gap Analysis

Compare your current skills with job requirements:

1. Review job descriptions in your target role
2. Map required skills to Skills Database categories
3. Identify gaps and create learning plan
4. Track progress over time

### Team Skill Assessment

For engineering managers:

1. Have team members complete skill checklists
2. Aggregate data to identify team strengths/gaps
3. Plan training and hiring accordingly
4. Use for performance reviews and career development

---

## Frequently Asked Questions

### How often should I update my skills?

**Recommendation**: Review quarterly, update monthly. Technology evolves rapidly, so regular reviews ensure you stay current.

### Can I contribute new skills?

**Yes!** See our [Contributing Guide](../community/contributing-guide.md) for details.

### How do I transition between roles?

Use the cross-role skill mappings:
- Developer → Architect: Focus on system design and patterns
- Developer → DevOps: Learn infrastructure and automation
- QA → Developer: Strengthen programming fundamentals

### Are certifications covered?

Yes, each skill tree includes relevant certifications where applicable.

### How do I use this with AI assistants?

See our [Ecosystem](../ecosystem/) section for AI integration guides.

---

## Next Steps

- 📊 [Assess your current skills](../dev-skills/skills-lists/beginner.md)
- 🎯 [Set learning goals](../dev-skills/overview.md)
- 🔗 [Explore AI skill tools](../ecosystem/)
- 🤝 [Join the community](../community/)

---

**Need Help?**
- 💬 [GitHub Discussions](https://github.com/standup-coder/skills-database/discussions)
- 🐛 [Report Issues](https://github.com/standup-coder/skills-database/issues)
- 📧 Contact: skills-database@example.com

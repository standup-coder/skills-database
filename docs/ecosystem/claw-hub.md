# Claw Hub (Lobehub)

Explore the open-source AI skill ecosystem from Lobehub.

## 🌐 Languages
- [English](claw-hub.md) | [中文](claw-hub_zh.md)

---

## Overview

**Claw Hub** (also known as Lobehub) is an open-source AI skill marketplace that emphasizes community-driven development and multi-modal AI capabilities.

### What is Claw Hub?

Claw Hub provides:
- **Open Source Skills**: Community-contributed AI assistants
- **Multi-Modal Support**: Text, image, audio, and video processing
- **Plugin Architecture**: Extensible framework for custom capabilities
- **Self-Hosting Options**: Run skills on your own infrastructure

---

## Key Features

### 1. Open Source Philosophy

All skills are:
- Open source (MIT License)
- Community-reviewed
- Transparent in functionality
- Forkable and customizable

### 2. Multi-Modal AI

Skills can process:
- **Text**: Chat, analysis, generation
- **Images**: Vision, OCR, generation
- **Audio**: Speech recognition, synthesis
- **Video**: Analysis, transcription

### 3. Plugin System

Extend functionality with:
- Custom API integrations
- Database connections
- External service hooks
- Custom UI components

---

## Popular Skills

### Development

| Skill | Description | GitHub Stars |
|-------|-------------|--------------|
| Code Copilot | Pair programming assistant | ⭐ 5.2k |
| Code Reviewer | Automated PR reviews | ⭐ 3.1k |
| API Designer | REST/GraphQL design help | ⭐ 2.8k |
| Regex Master | Regex generation & explanation | ⭐ 2.4k |

### Productivity

| Skill | Description | Use Case |
|-------|-------------|----------|
| Meeting Scribe | Auto-transcribe and summarize | Post-meeting docs |
| Email Assistant | Draft and refine emails | Communication |
| Research Helper | Summarize papers & articles | Learning |
| Task Planner | Break down projects | Project management |

### Creative

| Skill | Description | Use Case |
|-------|-------------|----------|
| Story Weaver | Creative writing assistant | Content creation |
| Image Prompt | Generate DALL-E/Midjourney prompts | AI art |
| Presentation | Create slide outlines | Deck creation |

---

## Getting Started

### Installation

#### Via Web

1. Visit [lobehub.com](https://lobehub.com)
2. Create free account
3. Browse skill marketplace
4. Click "Install" on desired skills

#### Self-Hosted

```bash
# Clone the repository
git clone https://github.com/lobehub/lobe-chat.git
cd lobe-chat

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
pnpm dev
```

### Using Skills

#### In Chat Interface

```
1. Start a new conversation
2. Type @ to see available skills
3. Select skill (e.g., @code-copilot)
4. Interact with the specialized assistant
```

#### Via API

```javascript
const response = await fetch('https://api.lobehub.com/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    skill: 'code-copilot',
    messages: [
      { role: 'user', content: 'Review this code: ...' }
    ]
  })
});
```

---

## Creating Custom Skills

### Skill Manifest

```json
{
  "name": "my-custom-skill",
  "version": "1.0.0",
  "description": "What this skill does",
  "author": "your-github-username",
  "license": "MIT",
  "skills": [
    {
      "identifier": "code-optimizer",
      "name": "Code Optimizer",
      "description": "Optimizes code for performance",
      "systemRole": "You are an expert code optimizer...",
      "plugins": ["filesystem", "api-caller"],
      "parameters": {
        "properties": {
          "language": {
            "type": "string",
            "enum": ["javascript", "python", "go"]
          }
        }
      }
    }
  ]
}
```

### Publishing

```bash
# 1. Fork lobehub/lobe-chat
# 2. Add your skill to /src/skills/
# 3. Create pull request
# 4. Wait for community review
```

---

## Integration with Skills4Coder

### Mapped Skills

| Skills4Coder | Claw Hub Skill | Notes |
|--------------|----------------|-------|
| Code Review | Code Reviewer | Open source, customizable |
| Learning | Research Helper | Paper summarization |
| Documentation | Meeting Scribe | Auto-documentation |
| Testing | Code Copilot | TDD assistance |

### Workflow Example

```
Developer Workflow with Claw Hub:

1. Planning → @task-planner
   "Break down this feature: user authentication"

2. Coding → @code-copilot
   "Help implement JWT middleware"

3. Review → @code-reviewer
   "Review this PR for security issues"

4. Documentation → @meeting-scribe
   "Summarize standup meeting"
```

---

## Pricing

| Plan | Cost | Features |
|------|------|----------|
| Free | $0 | Public skills, basic usage |
| Pro | $9/month | Priority access, more tokens |
| Enterprise | Custom | Self-hosted, SSO, support |

---

## Resources

### Documentation
- [Official Docs](https://lobehub.com/docs)
- [Skill Creation Guide](https://github.com/lobehub/lobe-chat/wiki)
- [API Reference](https://lobehub.com/docs/api)

### Community
- [GitHub Discussions](https://github.com/lobehub/lobe-chat/discussions)
- [Discord](https://discord.gg/lobehub)
- [Twitter/X](https://twitter.com/lobehub)

### Contributing
- [Contribution Guide](https://github.com/lobehub/lobe-chat/blob/main/CONTRIBUTING.md)
- [Skill Template](https://github.com/lobehub/lobe-chat/tree/main/src/skills/_template)

---

## Comparison

| Aspect | Claw Hub | SkillHub | MCP |
|--------|----------|----------|-----|
| Open Source | ✅ Fully | Partial | Protocol only |
| Self-Host | ✅ Yes | Limited | ✅ Yes |
| Multi-Modal | ✅ Yes | Limited | Depends |
| Community | Very active | Growing | Technical |

---

**Next**: Learn about [MCP - Model Context Protocol](./mcp-registry.md)

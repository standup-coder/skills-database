# Lobe Chat

Open-source AI chat framework with plugin ecosystem.

## 🌐 Languages
- [English](lobe-chat.md) | [中文](lobe-chat_zh.md)

---

## Overview

**Lobe Chat** is an open-source, modern-design AI chat application that supports multiple AI providers and extensive plugin capabilities.

### What is Lobe Chat?

- **Multi-Model Support**: OpenAI, Claude, Gemini, Ollama, and more
- **Plugin System**: Extend functionality with custom plugins
- **Self-Hostable**: Deploy on your own infrastructure
- **Modern UI**: Beautiful, responsive interface
- **Mobile Ready**: PWA support for mobile devices

---

## Key Features

### 1. Multi-Model Support

Connect to various AI providers:
- **OpenAI**: GPT-4, GPT-3.5
- **Anthropic**: Claude 3 family
- **Google**: Gemini Pro
- **Local**: Ollama, LM Studio
- **Azure**: OpenAI Service

### 2. Plugin System

Extend capabilities with plugins:
- **Search**: Web search, Google, Bing
- **Vision**: Image generation, analysis
- **Database**: Query databases
- **Custom**: Build your own

### 3. Agent System

Create specialized AI assistants:
- Custom system prompts
- Knowledge base integration
- Tool calling capabilities
- Shareable configurations

### 4. Knowledge Base

Upload and chat with documents:
- PDF, Word, Markdown support
- Vector search
- Source citations
- Multi-document chat

---

## Deployment Options

### Option 1: LobeChat Cloud (Hosted)

1. Visit [chat-preview.lobehub.com](https://chat-preview.lobehub.com)
2. Sign up for free account
3. Add your API keys
4. Start chatting

### Option 2: Self-Hosted with Docker

```bash
# Quick start with Docker
docker run -d -p 3210:3210 \
  -e OPENAI_API_KEY=your_key \
  lobehub/lobe-chat

# Or with docker-compose
wget https://raw.githubusercontent.com/lobehub/lobe-chat/main/docker-compose.yml
docker-compose up -d
```

### Option 3: Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat)

### Option 4: Local Development

```bash
# Clone repository
git clone https://github.com/lobehub/lobe-chat.git
cd lobe-chat

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
pnpm dev
```

---

## Configuration

### Environment Variables

```bash
# Required - at least one AI provider
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
GOOGLE_API_KEY=...

# Optional - access control
ACCESS_CODE=your-access-code

# Optional - database (for persistence)
DATABASE_URL=postgresql://...
```

### Adding AI Providers

Settings → Language Model → Add Provider:

| Provider | Configuration |
|----------|---------------|
| OpenAI | API Key + Base URL (optional) |
| Azure | Endpoint + Key + Deployment |
| Anthropic | API Key |
| Google | API Key |
| Ollama | Local URL |

---

## Plugin Development

### Plugin Manifest

```json
{
  "identifier": "my-plugin",
  "name": "My Custom Plugin",
  "description": "What this plugin does",
  "author": "your-name",
  "version": "1.0.0",
  "runtime": "node",
  "entry": "index.js",
  "skills": [
    {
      "name": "search_database",
      "description": "Search the company database",
      "parameters": {
        "type": "object",
        "properties": {
          "query": { "type": "string" }
        }
      }
    }
  ]
}
```

### Example Plugin

```javascript
// index.js
module.exports = {
  async search_database({ query }) {
    // Implementation
    const results = await db.search(query);
    return { results };
  }
};
```

### Publishing

1. Fork [lobehub/lobe-chat-plugins](https://github.com/lobehub/lobe-chat-plugins)
2. Add your plugin manifest
3. Submit pull request

---

## Creating Custom Agents

### Agent Configuration

```json
{
  "name": "Code Reviewer",
  "description": "Expert code reviewer with security focus",
  "systemRole": "You are an expert code reviewer...",
  "plugins": ["github", "web-search"],
  "model": "gpt-4",
  "temperature": 0.3
}
```

### Sharing Agents

Agents can be shared via:
- JSON export/import
- Direct links
- Community marketplace

---

## Integration with Skills Database

### Custom Agents for Developers

Create specialized agents for each skill:

```json
{
  "name": "System Design Assistant",
  "description": "Helps with system design interviews and architecture",
  "systemRole": "You are a system design expert...",
  "plugins": ["diagram-generator", "web-search"]
}
```

### Skill Learning Workflow

```
1. Create Agent for Skill Topic
   Example: "Python Best Practices Agent"

2. Upload Knowledge Base
   - Python documentation
   - Best practice guides
   - Code examples

3. Interactive Learning
   - Ask questions
   - Get code reviews
   - Practice exercises

4. Track Progress
   - Export conversations
   - Document learnings
   - Share with team
```

### Plugin Ideas for Skills Database

| Plugin | Purpose |
|--------|---------|
| Skill Tracker | Track learning progress |
| Code Quiz | Generate practice questions |
| Resource Finder | Find learning materials |
| Interview Prep | Mock technical interviews |

---

## Best Practices

### Security

- Use access codes for self-hosted instances
- Rotate API keys regularly
- Don't share sensitive data in chats
- Review plugin permissions

### Performance

- Use local models (Ollama) for sensitive data
- Enable caching for repeated queries
- Monitor API usage and costs
- Use appropriate model for task complexity

### Organization

- Create topic-specific agents
- Use folders to organize conversations
- Export important conversations
- Share agent configurations with team

---

## Pricing

| Option | Cost | Notes |
|--------|------|-------|
| Self-Hosted | Free | Pay only for AI API usage |
| LobeHub Cloud | Free tier | Limited usage |
| API Costs | Variable | Depends on provider and usage |

---

## Resources

### Official
- [Documentation](https://lobehub.com/docs)
- [GitHub](https://github.com/lobehub/lobe-chat)
- [Plugin Docs](https://github.com/lobehub/lobe-chat-plugins)

### Community
- [Discord](https://discord.gg/lobehub)
- [Twitter/X](https://twitter.com/lobehub)
- [Discussions](https://github.com/lobehub/lobe-chat/discussions)

### Plugins
- [Plugin Marketplace](https://chat-preview.lobehub.com/market)
- [Plugin Development Guide](https://github.com/lobehub/lobe-chat/wiki/Plugin-Development)

---

## Comparison

| Feature | Lobe Chat | ChatGPT | Claude |
|---------|-----------|---------|--------|
| Open Source | ✅ Yes | ❌ No | ❌ No |
| Self-Host | ✅ Yes | ❌ No | ❌ No |
| Multi-Model | ✅ Yes | ❌ No | ❌ No |
| Plugins | ✅ Yes | Limited | Limited |
| Price | Free (self) | $20/mo | $20/mo |

---

**Summary**: Lobe Chat offers maximum flexibility for developers who want control over their AI tools and data.

---

Return to [Ecosystem Overview](./) | [Skills Database Home](../index.md)

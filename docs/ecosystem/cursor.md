# Cursor

The AI-first code editor built for pair programming with AI.

## 🌐 Languages
- [English](cursor.md) | [中文](cursor_zh.md)

---

## Overview

**Cursor** is a code editor built from the ground up for AI-assisted programming, combining the familiarity of VSCode with powerful AI capabilities.

### What is Cursor?

- **VSCode Fork**: Familiar interface with AI superpowers
- **Native AI Integration**: Built-in AI chat, composer, and prediction
- **Context-Aware**: Understands your entire codebase
- **Multi-Model**: Choose between GPT-4, Claude, and more

---

## Key Features

### 1. Cursor Chat

AI chat panel with codebase awareness:
- Ask about any file or function
- Get code explanations
- Debug errors
- Plan implementations

### 2. Cursor Composer

AI-powered multi-file editing:
- Describe features in natural language
- AI suggests changes across multiple files
- Review and accept changes
- One-click implementation

### 3. Tab Prediction

Smart code completion:
- Predicts entire code blocks
- Learns from your coding style
- Context from open files

### 4. Codebase Understanding

AI has context of:
- All open files
- Project structure
- Import relationships
- Function definitions

---

## Getting Started

### Installation

#### Download

1. Visit [cursor.sh](https://cursor.sh)
2. Download for your platform (macOS, Windows, Linux)
3. Install and launch

#### From VSCode

1. Install Cursor
2. Import VSCode settings and extensions
3. Sign in with Cursor account

### Initial Setup

```bash
# Sign in
cursor login

# Configure AI provider
cursor settings ai.provider openai  # or anthropic

# Set API key (optional, for custom models)
cursor settings ai.apiKey your-key-here
```

### Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Open Chat | `Ctrl + L` | `Cmd + L` |
| Open Composer | `Ctrl + I` | `Cmd + I` |
| Accept Prediction | `Tab` | `Tab` |
| Reject Prediction | `Esc` | `Esc` |
| Inline Edit | `Ctrl + K` | `Cmd + K` |
| Explain Code | `Ctrl + Shift + L` | `Cmd + Shift + L` |

---

## Effective Usage

### Cursor Chat

```
User: "How does the authentication flow work in this project?"
Cursor: Analyzes auth files and explains:
- Login endpoint (/api/login)
- JWT token generation
- Middleware verification
- Session management
```

### Cursor Composer

```
User: "Add user profile page with avatar upload"

Cursor suggests:
1. Create /profile/page.tsx
2. Add avatar upload component
3. Update API routes
4. Add database schema

Review each change and click Apply
```

### Inline Editing

1. Select code
2. Press `Ctrl + K` / `Cmd + K`
3. Type instruction: "Add error handling"
4. Review and accept changes

### Codebase-Wide Changes

```
"Refactor all API calls to use the new httpClient"

Cursor finds:
- All fetch calls
- Axios usages
- Updates to new pattern
- Handles edge cases
```

---

## AI Models

### Available Models

| Model | Provider | Best For |
|-------|----------|----------|
| GPT-4 | OpenAI | General coding, complex tasks |
| GPT-4o | OpenAI | Fast responses, most tasks |
| Claude 3.5 Sonnet | Anthropic | Long contexts, analysis |
| Claude 3 Opus | Anthropic | Complex reasoning |
| Cursor Small | Cursor | Fast completions |

### Switching Models

```
In chat: @gpt4, @claude, @cursor-small
Or: Settings → AI → Model
```

---

## Advanced Features

### .cursorrules

Project-specific AI instructions:

```markdown
# .cursorrules

Always use TypeScript strict mode
Prefer functional components in React
Use async/await over promises
Follow existing file naming conventions
```

Place in project root for codebase-wide context.

### Context Providers

```
@file - Reference specific file
@code - Reference code snippet
@docs - Reference documentation
@web - Search web for information
```

Example:
```
"Update @file:auth.ts to use the new @file:types.ts interfaces"
```

### Notepads

Save common prompts and contexts:
- Team coding standards
- Project architecture
- Common patterns

---

## Integration with Skills Database

### Learning Path Support

| Skills Database Level | Cursor Features |
|-------------------|-----------------|
| Beginner | Code explanation, syntax help |
| Intermediate | Refactoring, pattern suggestions |
| Advanced | Architecture planning, optimization |
| Expert | System design, code review |

### Skill Development Workflow

```
Learning New Technology:
1. Ask Cursor to explain concepts
2. Request code examples
3. Implement with inline help
4. Review and optimize

Building Features:
1. Describe feature in Composer
2. Review generated plan
3. Apply changes iteratively
4. Test and refine
```

### Prompt Templates

```markdown
## For Learning
"Explain [concept] like I'm a beginner"
"What's the difference between [A] and [B]?"
"Show me best practices for [technology]"

## For Implementation
"Implement [feature] following existing patterns"
"Refactor [code] to be more [maintainable/testable]"
"Add [functionality] with proper error handling"

## For Review
"Review this code for [security/performance]"
"Identify potential bugs in [file]"
"Suggest improvements for [function]"
```

---

## Best Practices

### Project Setup

1. **Create .cursorrules**
   - Document team conventions
   - Define code patterns
   - Set quality standards

2. **Use Context**
   - Reference relevant files
   - Provide clear instructions
   - Review AI suggestions

3. **Iterate**
   - Start with small changes
   - Review before applying
   - Test thoroughly

### Security

- Review all generated code
- Don't paste secrets in chat
- Use environment variables
- Audit AI-suggested dependencies

---

## Pricing

| Plan | Cost | Features |
|------|------|----------|
| Free | $0 | 2000 completions, 50 slow requests/month |
| Pro | $20/month | Unlimited fast requests, priority support |
| Business | $40/user/month | Team features, admin controls |

---

## Resources

### Official
- [Cursor Documentation](https://cursor.sh/docs)
- [Blog](https://cursor.sh/blog)
- [Changelog](https://cursor.sh/changelog)

### Community
- [Discord](https://discord.gg/cursor)
- [Twitter/X](https://twitter.com/cursor_ai)
- [Reddit r/cursor](https://reddit.com/r/cursor)

### Tutorials
- [Getting Started](https://cursor.sh/tutorials/getting-started)
- [Advanced Tips](https://cursor.sh/tutorials/advanced)

---

## Comparison with Copilot

| Feature | Cursor | Copilot |
|---------|--------|---------|
| Editor | Full IDE | Extension |
| Chat | Native | Separate panel |
| Multi-file | Composer | Limited |
| Pricing | Free tier | Paid only |
| Customization | High | Medium |

---

**Next**: Check out [Lobe Chat](./lobe-chat.md) for open-source AI conversations.

# GitHub Copilot

AI pair programming assistant powered by OpenAI Codex.

## 🌐 Languages
- [English](github-copilot.md) | [中文](github-copilot_zh.md)

---

## Overview

**GitHub Copilot** is an AI-powered code completion and generation tool that helps developers write code faster and with less effort.

### What is Copilot?

- **AI Pair Programmer**: Suggests code completions in real-time
- **Code Generation**: Writes entire functions from comments
- **Multi-Language**: Supports 50+ programming languages
- **Context-Aware**: Understands your codebase and patterns

---

## Key Features

### 1. Code Completion

As you type, Copilot suggests:
- Entire lines of code
- Complete functions
- Test cases
- Documentation

### 2. Chat Interface (Copilot Chat)

Ask questions about:
- Code explanation
- Debugging help
- Refactoring suggestions
- Best practices

### 3. Copilot Workspace

Experimental features:
- Natural language to code
- Multi-file editing
- Task planning

---

## Supported Languages

Top supported languages:
- Python
- JavaScript/TypeScript
- Ruby
- Go
- Rust
- Java
- C/C++
- C#
- PHP
- Shell

---

## Getting Started

### Installation

#### VSCode

1. Install [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
2. Sign in with GitHub account
3. Start coding!

#### JetBrains IDEs

1. Open Settings → Plugins
2. Search "GitHub Copilot"
3. Install and restart
4. Sign in

#### Neovim

```lua
-- Using packer
use {'github/copilot.vim'}
```

#### CLI (Copilot in Terminal)

```bash
# Install GitHub CLI
brew install gh

# Install Copilot extension
gh extension install github/gh-copilot

# Use Copilot
gh copilot suggest "create Express server"
gh copilot explain "git rebase"
```

### Configuration

```json
// VSCode settings.json
{
  "github.copilot.enable": {
    "*": true,
    "markdown": true,
    "plaintext": false
  },
  "github.copilot.advanced": {
    "suggestionDelay": 50
  }
}
```

---

## Effective Usage

### Writing Good Comments

```python
# Bad ❌
def process():
    # Copilot has no context

# Good ✅
def calculate_total_price(items, tax_rate):
    """
    Calculate total price including tax.
    
    Args:
        items: List of dicts with 'price' and 'quantity'
        tax_rate: Decimal tax rate (e.g., 0.08 for 8%)
    
    Returns:
        Total price as float
    """
    # Copilot generates based on docstring
```

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Accept suggestion | `Tab` |
| Dismiss suggestion | `Esc` |
| Next suggestion | `Alt + ]` |
| Previous suggestion | `Alt + [` |
| Open Copilot panel | `Ctrl + Enter` |
| Open chat | `Ctrl + Shift + I` |

---

## Copilot Chat

### Available Commands

```
/explain - Explain selected code
/fix - Propose fix for errors
/tests - Generate unit tests
/doc - Generate documentation
/optimize - Optimize code performance
```

### Example Interactions

```
User: /explain this function
Copilot: This function implements the Fisher-Yates shuffle algorithm...

User: /tests for UserService
Copilot: [generates test cases]

User: How do I handle rate limiting in Python?
Copilot: [explains with code examples]
```

---

## Copilot for Specific Skills

### Code Review

```
Prompt: "Review this code for security issues"
Copilot: Analyzes for:
- SQL injection risks
- XSS vulnerabilities
- Insecure dependencies
- Hardcoded secrets
```

### Learning New Technologies

```
Prompt: "Explain how async/await works in Python"
Copilot: Provides:
- Concept explanation
- Code examples
- Common pitfalls
- Best practices
```

### Refactoring

```
Prompt: "Refactor this to use dependency injection"
Copilot: Shows:
- Refactored code
- Explanation of changes
- Benefits of the pattern
```

---

## Integration with Skills4Coder

### Skill Development Workflow

| Skills4Coder Skill | Copilot Usage |
|-------------------|---------------|
| Programming Fundamentals | Learn syntax, common patterns |
| Design Patterns | Generate pattern implementations |
| Testing | Auto-generate test cases |
| Code Review | AI-assisted code analysis |
| Documentation | Generate docstrings, README |
| Debugging | Explain errors, suggest fixes |

### Prompt Library for Developers

```markdown
## For Beginners
"Explain what this code does step by step"
"What's the difference between let and const?"
"How do I fix this error: [paste error]"

## For Intermediate
"Refactor this to be more maintainable"
"Add error handling to this function"
"Convert this callback to async/await"

## For Advanced
"Implement this using design pattern X"
"Optimize this algorithm for better performance"
"Review this architecture for scalability"
```

---

## Best Practices

### Do's ✅

- Review all generated code
- Write descriptive comments
- Use specific function names
- Keep functions focused
- Test generated code thoroughly

### Don'ts ❌

- Blindly copy suggestions
- Use for security-critical code without review
- Rely on it for learning fundamentals
- Ignore licensing implications

---

## Pricing

| Plan | Cost | Features |
|------|------|----------|
| Free Trial | 30 days | Full features |
| Individual | $10/month | Unlimited suggestions |
| Business | $19/user/month | Team management, policies |
| Enterprise | $39/user/month | SSO, audit logs, support |

**Free for**: Open source maintainers, students, teachers

---

## Resources

### Official
- [Copilot Documentation](https://docs.github.com/copilot)
- [Getting Started Guide](https://docs.github.com/copilot/getting-started)
- [Best Practices](https://docs.github.com/copilot/using-github-copilot/best-practices)

### Community
- [GitHub Community](https://github.com/community)
- [Copilot Discussions](https://github.com/orgs/community/discussions/categories/copilot)

### Learning
- [Copilot Cookbook](https://github.com/github/copilot-cookbook)
- [Example Prompts](https://github.com/github/copilot-prompts)

---

## Comparison

| Feature | Copilot | Cursor | Codeium |
|---------|---------|--------|---------|
| Base Model | OpenAI Codex | Custom/Various | Custom |
| Chat | ✅ Yes | ✅ Yes | ✅ Yes |
| Free Tier | Trial only | Limited | ✅ Yes |
| Privacy | Configurable | Local option | Cloud |
| Accuracy | High | High | Good |

---

**Next**: Explore [Cursor](./cursor.md) - the AI-first code editor.

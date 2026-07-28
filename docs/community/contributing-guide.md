# Contributing Guide

Thank you for your interest in contributing to Skills Database! This guide will help you get started.

## 🌐 Languages
- [English](contributing-guide.md) | [中文](contributing-guide_zh.md)

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Contribution Guidelines](#contribution-guidelines)
- [Review Process](#review-process)
- [Recognition](#recognition)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual orientation.

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what's best for the community

**Unacceptable behaviors include:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## Ways to Contribute

### 1. Report Issues

Found a bug or have a suggestion?

- Check if the issue already exists
- Use the issue templates
- Provide detailed information:
  - What you expected vs what happened
  - Steps to reproduce
  - Your environment (OS, browser)

### 2. Suggest New Skills

Technology evolves rapidly! Help us stay current.

**Skill Suggestion Format:**
```markdown
**Skill Name**: [Name]
**Category**: [Dev/Arch/Testing/Ops]
**Level**: [Beginner/Intermediate/Advanced/Expert]
**Description**: [Brief description]
**Why Include**: [Justification]
**Resources**: [Links to learning materials]
```

### 3. Improve Documentation

- Fix typos and grammar
- Clarify confusing sections
- Add examples and illustrations
- Translate to other languages

### 4. Add Skill Ecosystem Content

Help expand our AI skill ecosystem coverage:

- Research new AI tools and platforms
- Write integration guides
- Create comparison matrices
- Document best practices

### 5. Build Tools

Technical contributors can help with:

- Website development (VitePress)
- CLI tools
- Skill validation scripts
- CI/CD improvements

---

## Getting Started

### Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/skills-database.git
cd skills-database
```

### Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### Make Changes

- Edit files with your preferred editor
- Follow our formatting guidelines
- Test your changes locally

### Commit

```bash
git add .
git commit -m "type: description

Detailed explanation of what and why"
```

**Commit Types:**
- `feat`: New feature or skill
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Contribution Guidelines

### Skill List Format

When adding or modifying skills, follow this format:

```markdown
- [ ] **Skill Name** - Brief description of the skill
  - Sub-skill or detail
  - Another detail
- [ ] **Another Skill** - Description
```

### Documentation Standards

**Structure:**
- Use clear, concise language
- Include practical examples
- Add learning resources
- Maintain bilingual support (EN/ZH)

**Formatting:**
- Use Markdown properly
- Maximum line length: 100 characters
- Use semantic line breaks

### File Organization

```
docs/
├── role-skills/           # Role-specific content
│   ├── overview.md        # English version
│   └── overview_zh.md     # Chinese version
├── ecosystem/             # AI tool integrations
│   ├── tool-name.md
│   └── tool-name_zh.md
└── community/             # Community docs
    ├── faq.md
    └── faq_zh.md
```

### Naming Conventions

- Files: `lowercase-with-hyphens.md`
- Images: `descriptive-name.png`
- Branches: `type/brief-description`

### Content Guidelines

**Do:**
- Research thoroughly before adding skills
- Provide multiple learning resources
- Consider different experience levels
- Include both free and paid resources
- Credit original sources

**Don't:**
- Add promotional content without value
- Include outdated information
- Use biased language
- Violate copyrights

---

## Review Process

### What Happens After You Submit

1. **Automated Checks**
   - Markdown linting
   - Link validation
   - Spell checking

2. **Maintainer Review**
   - Content accuracy
   - Format compliance
   - Scope alignment

3. **Feedback and Iteration**
   - Address review comments
   - Make requested changes
   - Push updates to your branch

4. **Approval and Merge**
   - At least one maintainer approval required
   - Squash merge for clean history

### Review Timeline

- Initial response: 3-5 business days
- Full review: 1-2 weeks
- Complex changes may take longer

---

## Recognition

### Contributors Hall of Fame

All contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Eligible for contributor badges

### Levels of Contribution

| Level | Criteria | Recognition |
|-------|----------|-------------|
| 🌱 First-Time | 1+ merged PR | Listed in contributors |
| 🌿 Regular | 5+ merged PRs | Mentioned in README |
| 🌳 Core | 20+ merged PRs | Become a maintainer |

---

## Specific Contribution Areas

### Adding New Skills

1. Check if skill already exists
2. Determine appropriate category and level
3. Write skill description
4. Add learning resources
5. Update related documentation

**Template:**
```markdown
## New Skill Category

- [ ] **Skill Name** - What it is and why it matters
  - Key concept 1
  - Key concept 2
  - Common tools/frameworks

### Learning Resources

1. **Beginner**: [Resource name](link) - Brief description
2. **Intermediate**: [Resource name](link)
3. **Advanced**: [Resource name](link)
```

### Translating Content

1. Copy English file
2. Rename with `_zh.md` suffix
3. Translate content
4. Update language selector links
5. Maintain formatting

### Adding Ecosystem Content

Structure for new AI tool pages:

```markdown
# Tool Name

## Overview
- What it does
- Key features
- Pricing model

## Skills Available
List relevant skills

## Integration Guide
Setup instructions

## Best Practices
Tips for effective use

## Resources
Official docs, tutorials, community
```

---

## Questions?

- 💬 [GitHub Discussions](https://github.com/standup-coder/skills-database/discussions)
- 🐛 [Open an Issue](https://github.com/standup-coder/skills-database/issues)
- 📧 Email: skills-database@example.com

---

**Thank you for helping make Skills Database better for everyone!** 🙏

# Contributing to Skills4Coder

Thank you for your interest in contributing! Skills4Coder is an agent skill orchestration framework that helps organize, compose, and deploy coding agent capabilities.

## Prerequisites

- Node.js 20+
- npm 10+
- Git

## Getting Started

```bash
git clone https://github.com/your-org/skills4coder.git
cd skills4coder
npm install
npm run build
npm test
```

## Project Structure

```
roles/  skills/  atomic-skills/   # 语料库（JSON 资产，根目录主体）
schema/  skill-lists/  data/      # 语料约束 / 清单 / 派生数据
app/                            # 所有代码（SDK + Web）
├── src/                        #   SDK 核心库
├── orchestration/              #   编排运行时 (agent-runtime / mcp-server / skillhub-adapter)
├── server/                     #   Web API 层
├── webui/                      #   Web UI
├── skills-cli.ts               #   CLI 入口
└── start.sh                    #   Web 服务启停
dist/                           # 编译产物（npm 发布入口，留根）
docs/                           # 文档
```

## Development Workflow

Start the dev server with watch mode:

```bash
npm run dev
```

Run the full build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Lint the codebase:

```bash
npm run lint
```

## Code Style

- **TypeScript** with strict mode enabled
- **ESLint** for linting — fix all warnings before submitting
- **Import order**: built-in modules, external packages, internal modules
- 2-space indentation, LF line endings (see `.editorconfig`)
- Use ESM (`import`/`export`), no CommonJS

## Testing

Tests use [Vitest](https://vitest.dev/). Place test files next to the module they test with a `.test.ts` suffix.

```bash
npm test            # run all tests
npm test -- --watch # watch mode
```

## Adding a New Role, Skill, or Atomic Skill

1. Create a JSON file in the appropriate directory (`roles/`, `skills/`, or `atomic-skills/`).
2. Follow the existing schema — check neighboring files for reference.
3. Register it in the orchestration config if needed.
4. Add tests verifying the definition loads and validates correctly.

### JSON File Format

```json
{
  "id": "my-new-skill",
  "name": "My New Skill",
  "description": "What this skill does",
  "version": "1.0.0",
  "parameters": {}
}
```

## Adding a New Orchestration Module

1. Create your module in `app/orchestration/`.
2. Export a public API surface with clear TypeScript types.
3. Wire it into the orchestration engine entry point.
4. Add unit and integration tests.
5. Update docs if the module changes user-facing behavior.

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new role for code review
fix: resolve skill loading race condition
docs: update orchestration guide
refactor: simplify atomic-skill resolver
test: add coverage for CLI commands
chore: update dependencies
```

## Pull Request Process

1. Fork the repo and create a feature branch from `main`.
2. Make your changes following the guidelines above.
3. Ensure `npm run build`, `npm test`, and `npm run lint` all pass.
4. Write a clear PR description explaining what and why.
5. Link any related issues.
6. Request review from a maintainer.

## Questions?

Open an issue or start a discussion. We're happy to help!

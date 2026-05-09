# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Skills4Coder is an AI Agent orchestration framework that transforms traditional job descriptions (JDs) into composable, reusable skill units. The core concept: **Role = JD = Main Skills Set**. Multiple specialized agents collaborate like a professional team.

```
┌─────────────────────────────────────────┐
│                 Role (岗位)              │
│  JD = 主 Skills 集合                      │
└─────────────┬───────────────────────────┘
              │ 组合调用
              ▼
┌─────────────────────────────────────────┐
│          Composite Skills (复合技能)      │
└─────────────┬───────────────────────────┘
              │ 编排调用
              ▼
┌─────────────────────────────────────────┐
│            Atomic Skills (原子技能)      │
│  read-file, write-file, run-tests       │
└─────────────────────────────────────────┘
```

## Build & Dev Commands

```bash
npm run build        # TypeScript compilation (main + orchestration)
npm run dev          # Watch mode for development
npm run test         # Run vitest tests
npm run lint         # ESLint check
npm run validate-roles    # Validate role JSON schemas
npm run validate-skills   # Validate skill JSON schemas
npm run docs:dev         # VitePress dev server (port 5173)
npm run docs:build        # Build VitePress docs
```

## Architecture

### Core Type System (`src/types.ts`)
- **Role**: Job description with responsibilities, mainSkills, atomicSkills
- **CompositeSkill**: Workflow of atomic skills with input/output schemas
- **AtomicSkill**: Lowest-level capability mapped to MCP tools or native functions
- **WorkflowStep**: Has `atomicSkill`, `type` (llm/transform/api), `dependsOn` for dependency graph

### Core Classes (`src/`)
- `Agent` (`agent.ts`): Executes skills using a role + LLM + tools
- `Team` (`team.ts`): Manages multi-agent collaboration with `collaborate()` and `executeWorkflow()`
- `Workflow` (`workflow.ts`): Event-driven workflow execution with topological sort on step dependencies
- `Role` (`role.ts`): Role definition loader
- `CompositeSkill` / `AtomicSkill`: Skill definition loaders

### Key Directories
| Directory | Purpose |
|-----------|---------|
| `roles/` | 16 JSON role definitions (JD = mainSkills + atomicSkills) |
| `skills/` | Composite skill definitions with workflow steps |
| `atomic-skills/` | Atomic skill definitions (e.g., read-file, run-shell-command) |
| `skill-lists/` | 3-level skill trees (beginner/intermediate/advanced) per role |
| `orchestration/` | Runtime for agent execution, MCP server, SkillHub adapter |

## Roles (16 total)

Product lifecycle coverage: `创意 → 客户 → 产品 → 发布 → 运维 → 销售/商业化 → 运营`

| Category | Roles |
|----------|-------|
| Product | product-manager, senior-frontend-dev, backend-developer, backend-architect, ui-ux-designer, mobile-developer |
| Engineering | devops-engineer, sre-engineer, qa-automation, security-engineer, data-engineer |
| Business | cto, growth-engineer, marketing-manager, customer-success |

## Important Patterns

- **Role references skills by string ID** - actual skill resolution happens at runtime via `agent.use()`
- **Team.topologicalSort()** resolves step dependencies before execution
- **Workflow emits events**: `workflow:start`, `step:start`, `step:complete`, `step:error`
- **Skill definitions use `{{ }}` template syntax** for input interpolation between steps
# Agents.md

## Purpose

Defines how humans and AI agents (e.g., Claude, ChatGPT) must behave in this project.

This project enforces structured, disciplined development.

---

# Core Rules (MANDATORY)

## 1. Always Utilize Markdown Docs

All agents and developers MUST use and follow:

- QA-TestAutomation.md
- DevOps-CICD.md
- Git-conventions.md
- Repo-Standards.md
- Agents.md
- Todos.md
- `.agents/skills/` skill library (see Rule 9)

No exceptions.

If a change conflicts with docs → update docs FIRST, then implement.

---

## 2. Branch Before Task

Before starting ANY task:

1. Create a new branch
2. Then start work

Never code directly on main/dev.

---

## 3. Push After Task

After finishing a task:

1. Commit properly
2. Push branch to GitHub
3. Open PR if applicable

---

# Agent Behavior

AI agents must:

- Respect architecture
- Avoid overengineering
- Follow DRY/KISS/YAGNI
- Prefer simple solutions
- Not introduce new dependencies without justification

---

# Task Execution Flow (MANDATORY — follow in order)

1. **Read all docs** — Read every file in `docs/` before generating any plan
2. **Understand requirement** — Clarify scope, ask if architecture changes are needed
3. **Create branch** — `feature/<name>`, `fix/<name>`, or `chore/<name>` before writing any code
4. **Implement** — Follow all architecture, patterns, and quality rules
5. **Test** — Run relevant unit/E2E tests
6. **Check against docs** — Verify every change complies with all docs in `docs/`; fix anything that conflicts
7. **Push branch** — Push only if docs check passes
8. **User merges manually** — Never merge, never auto-merge; the user handles merging and pulling

---

# Rule 9 — Use `.agents` Skill Library (MANDATORY)

The project ships a curated skill library at `.agents/skills/` (project root).

**When to reference:**

| Phase | Action |
|-------|--------|
| Before planning | Read relevant SKILL.md files for any React/web work |
| During implementation | Check rules in skill files against code being written |
| After implementation | Run compliance check — verify finished code against all applicable rules |

**Skills and what they cover:**

| Skill | When to Use |
|-------|-------------|
| `vercel-react-best-practices` | React 19 / TypeScript web app — components, hooks, state, performance, accessibility |
| `react-components` | Component design patterns, props, composition, reusability |
| `react-native-best-practices` | Reference only — app is web, not mobile |
| `react-native-architecture` | Reference only — app is web, not mobile |
| `react-native-design` | Reference only — app is web, not mobile |
| `vercel-react-native-skills` | Reference only — app is web, not mobile |

**Most relevant skills for VistaFi:** `vercel-react-best-practices`, `react-components`

**Critical rules from `vercel-react-best-practices` (always check these):**

- Never use `dangerouslySetInnerHTML` — React escapes output by default; keep it that way
- Validate all user inputs at the form boundary (amount > 0, description non-empty)
- Keep components focused — one responsibility per component
- Lift state only as far as needed — `App.tsx` owns shared state
- Prefer controlled form inputs with explicit `value` + `onChange`
- Use TypeScript types for all props and state — no implicit `any`

---

# Philosophy

Discipline > Speed
Consistency > Cleverness
Clarity > Complexity

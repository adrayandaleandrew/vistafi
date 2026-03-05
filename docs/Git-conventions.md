# Git Conventions

---

# Branching

Always branch before work.

Format:

feature/short-description
fix/bug-name
chore/maintenance-task

Examples:

feature/edit-transaction-modal
fix/index-css-dark-mode-conflict
chore/update-page-title

---

# Commits

Use conventional commit format:

feat: add edit transaction modal
fix: resolve index.css dark background conflict
fix: correct balance calculation when no income items
refactor: extract summary calculation to hook
chore: update page title to VistaFi
docs: update Todos.md with Phase 4 tasks
test: add unit tests for calculateBudgetSummary

---

# Rules

- Small commits
- One concern per commit
- Clear messages

---

# Pull Requests

- Clear description
- Link issue if exists
- Self-review before PR

---

# Never

- Commit secrets
- Push broken builds
- Force push to main

---

# Golden Rule

Clean history = professional repo.

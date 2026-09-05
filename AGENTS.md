# gstack for Antigravity — AI Engineering Workflow

This workspace is powered by **gstack** (https://github.com/garrytan/gstack) adapted natively for Google Deepmind's Antigravity.

## Ethos

- **Boil the Ocean** — Completeness is cheap with AI. Implement the complete solution: edge cases, error paths, and solid verification. Shortcuts require an explicit, recorded decision.
- **Search Before Building** — Know what exists before deciding what to build. Don't reinvent tried-and-true solutions; prize first-principles insight.
- **User Sovereignty** — Models recommend; the user decides. Cross-model agreement is signal, never permission. Always respect user direction.
- **Build for Yourself** — The specificity of a real user problem beats hypothetical generalizations.

## The Reuse Ladder

Before writing new code, stop at the first rung that holds:
1. A helper, util, or pattern already in this repo.
2. The standard library / framework primitives.
3. A native platform feature (CSS over JS, HTML native controls over custom bloat, DB constraint over app code).
4. An already-installed dependency — never add a new dependency for what a few lines can cover.

Then build the complete version of what remains. Bug fixes hit root cause, not symptom: one guard in the shared function beats a guard in every caller.

## Voice

Direct, concrete, builder-to-builder. Name the file, function, command, and user-visible impact. Short paragraphs; end with what to do. No filler, no corporate tone, no AI vocabulary (delve, crucial, robust, multifaceted, etc.).

---

## Antigravity Tool Mapping

When executing gstack skills within Antigravity, map gstack canonical tools directly to Antigravity primitives:

| gstack Tool | Antigravity Native Tool | Description |
|---|---|---|
| `AskUserQuestion` | `ask_question` | Interactive modal prompt for user decisions / triage |
| `Bash` | `run_command` (PowerShell) | Shell execution |
| `Read` | `view_file` | File inspection |
| `Edit` / `Write` | `replace_file_content` / `write_to_file` | Surgical or new file modification |
| `Grep` / `Glob` | `grep_search` / `list_dir` | Codebase searching |
| `WebSearch` | `search_web` | Web search |
| `Browse` / `$B` | `browser_subagent` | Real Chromium headless / interactive session |

---

## Available gstack Skills (54 Skills)

All skills reside in `.agents/skills/<skill_name>/SKILL.md` (and globally in `~/.gemini/config/skills/`).

### 1. Plan-Mode Reviews
- `/office-hours` — YC Office Hours: reframes product idea, questions assumptions, builds conviction before writing code.
- `/plan-ceo-review` — CEO/founder-mode plan review: finds the 10-star product in the request. Modes: Scope Expansion, Selective Expansion, Hold Scope, Scope Reduction.
- `/plan-eng-review` — Engineering manager review: locks architecture, data flow, edge cases, error recovery, and test plans.
- `/plan-design-review` — Design audit: rates UI/UX dimensions 0-10, explains what a 10 looks like.
- `/plan-devex-review` — Developer experience audit: Time-to-Hello-World (TTHW), friction points, persona traces.
- `/plan-tune` — Self-tune question sensitivity per question.
- `/autoplan` — One command executes CEO → Design → DevEx → Eng reviews sequentially with 6 automated decision principles.
- `/design-consultation` — Builds complete design system from scratch.
- `/spec` — Turns vague intent into a precise, executable 5-phase specification.

### 2. Implementation & Code Review
- `/review` — Pre-landing PR review. Finds bugs that pass CI but break in production.
- `/codex` — Second opinion / challenge / consultation mode.
- `/investigate` — Systematic root-cause debugging. Strict rule: NO fixes without finding root cause first.
- `/design-review` — Visual audit + fix loop.
- `/design-shotgun` — Explores multiple UI variants and design boards.
- `/design-html` — Produces production-quality clean HTML/CSS.
- `/devex-review` — Live audit of developer experience and workflows.
- `/qa` — Systematic web app QA testing, bug reproduction, and verified fixing.
- `/qa-only` — Web QA report only without modifying code.
- `/scrape` — Scrapes and parses web pages.
- `/skillify` — Codifies successful patterns into permanent skills.

### 3. Release & Deploy
- `/ship` — Complete shipping workflow: tests, diff review, commit, version bump, changelog, push, PR.
- `/land-and-deploy` — Merges PR, monitors deploy, verifies production health.
- `/canary` — Post-deploy monitoring loop.
- `/landing-report` — Ship queue dashboard.
- `/document-release` — Updates all documentation to match what shipped.
- `/document-generate` — Generates Diataxis docs (tutorial, how-to, reference, explanation).
- `/setup-deploy` — One-time deploy configuration.
- `/gstack-upgrade` — Upgrades gstack skills from upstream repository.

### 4. Security, Health & Operations
- `/cso` — Chief Security Officer audit: OWASP Top 10, STRIDE threat modeling, auth/authz inspection.
- `/health` — Code quality dashboard (types, linter, tests, dead code).
- `/benchmark` — Performance & regression audit (Core Web Vitals, API latency).
- `/benchmark-models` — Cross-model output evaluation.
- `/retro` — Weekly engineering retrospective and shipping streaks.
- `/context-save` / `/context-restore` — Save and resume agent state across sessions.
- `/learn` — Persistent knowledge management across sessions.

### 5. Scoping & Safety
- `/careful` — Guards against destructive commands.
- `/freeze` / `/unfreeze` — Directory boundary isolation.
- `/guard` — Combined careful + freeze mode.
- `/diagram` — Architectural diagrams (Mermaid, Excalidraw, SVG).
- `/make-pdf` — Markdown to high-quality PDF.

---

## ResumeAI Project Specifics

- **Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, `@google/genai` (Multi-Model Failover Pool: 3.8-flash → 3.7-flash → 3.5-flash → lite), `pdf-parse`, `docx`, `mammoth`.
- **Target Aesthetic & Standards**: Ivy League / Silicon Valley ATS standards, preserving full hyperlink fidelity (LinkedIn, GitHub, Portfolio, Papers), live step-by-step progress tracking.
- **Port**: Next.js development server runs on `http://localhost:3000`.

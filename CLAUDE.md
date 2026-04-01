# Hefner Executive Job Architect — Project Context

> This file loads automatically into every Claude Code session.
> It is the primary orientation document — read before taking any action.

---

## Project Identity

**Tool:** Hefner Executive Job Architect
**Purpose:** AI-powered job posting form builder for Hefner Machine & Tool, Inc.
**Stack:** React + TypeScript (TSX), Claude API (claude-sonnet-4-20250514), inline CSS-in-JS
**Working directory:** `/home/lucasmhefner/job/Job application dashboard/`

---

## Active State

| Item | Value |
|------|-------|
| Active component | `resource examples/hefner_job_architect_v73.tsx` |
| Rollback baseline | `resource examples/hefner_job_architect_v72.tsx` — **do not modify** |
| Next version | `v74` — increment from v73 for any promoted change |
| Theme status | Fully token-driven (v7.0) — 34 tokens (28 color + 6 radius), zero inline values |
| Priority action | Artifact-ready — API key gate added, direct browser access headers in place |
| Design tokens | `.claude/tokens/DESIGN_TOKENS.md` |
| Skill index | `.claude/TOOLKIT.md` |

---

## Development Loop — Follow Every Session

```
1. SCOPE   → Name the one change and every file it touches
2. READ    → One grep pass per file — collect ALL needed patterns at once. Never re-scan
             a file already scanned this session.
3. PLAN    → Write plan file, get approval (cheap — always do this)
4. EDIT    → Surgical Edit calls; Write only if >40% of lines change
5. VERIFY  → Check only the changed lines
6. MEMORY  → Save only non-obvious decisions to memory
```

**When re-reading IS justified:**
- Reading a new version file after it's been written (verifying the edit landed correctly)
- Reading a specific line range not covered in the original scan because it was out of scope
- Reading a file in a new session after context has been cleared

**Never** start editing without a confirmed scope. **Never** mix styling changes with functional/prompt changes in the same version increment.

---

## Skills — Use These, Not Ad-Hoc Edits

| Skill | Trigger | When to use |
|-------|---------|-------------|
| `/version-promote` | "new version", "bump version" | Any change that warrants a new TSX file |
| `/theme-inject` | "inject theme", "centralize tokens" | **Run this next** — converts inline hex to THEME block |
| `/theme-audit` | "audit theme", "check tokens" | After any styling change to detect drift |
| `/file-audit` | "audit files", "check structure" | End of session or after creating new files |
| `/project-sync` | "sync project", "integration check" | Validates all cross-references and indexes |
| `/feature-add` | "add feature", "new field", "new mode" | Any functional addition to the component |
| `/prompt-update` | "update prompt", "change COLLECT mode" | Any change to `buildSystem()` — isolated workflow |
| `/make-it-happen` | "make it happen", "ship it", "archive this", "lock this version in" | Silent full-file archive snapshot — no questions, one output line |

---

## Token Efficiency Rules

- **Edit over Write.** If fewer than 40% of lines change, use Edit tool.
- **Grep before Read.** Find the specific lines before reading whole sections.
- **One agent max.** Agents are expensive. One Explore pass per unknown area, then work directly.
- **THEME block = multiplier.** Once `/theme-inject` runs, all future style changes are 1-line edits to the THEME block. This is the highest-leverage action available.
- **Plans are free.** Always write a plan file. Prevents expensive re-exploration next session.

---

## Architecture — Key Areas

| Area | Location in TSX | Risk level |
|------|----------------|------------|
| Company constants | Lines 3–15 | Low — data only |
| Field definitions | Lines 17–23 | Medium — affects sidebar + system prompt |
| System prompt | `buildSystem()` fn | **High** — changes affect AI behavior in production |
| State management | `useState` block | Medium — changes propagate widely |
| Rendering / styles | Lines 380–653 | Low for style-only changes |
| Markdown renderer | `fmt()` / `inl()` | Low |

**FACT-LOCK rule:** Never alter numeric values, rates, named values, or contact info inside any string content — `buildSystem()`, `COMPANY`, `FOOTER`, `THREAD_INTROS`.

---

## File Structure

```
Job application dashboard/
├── CLAUDE.md                              ← this file (auto-loads every session)
├── PROJECT.md                             ← master project vision and orientation
├── arch.md                                ← system architecture and memory bank
├── resource examples/
│   ├── hefner_job_architect_v68.tsx       ← ACTIVE — work from this
│   └── hefner_job_architect_v67.tsx       ← ROLLBACK — do not modify
└── .claude/
    ├── TOOLKIT.md                         ← full skill/agent index
    ├── tokens/
    │   └── DESIGN_TOKENS.md              ← canonical brand token registry
    └── archive/                           ← ⛔ DO NOT READ — historical versions only
        ├── hefner_job_architect_v66.tsx   ← auto-archived (was rollback, now superseded)
        ├── hefner_job_architect_v65.tsx   ← archived
        └── hefner_job_architect_v64.tsx   ← archived
```

> **Version Rule:** Every approved change creates a new file (`v69`, `v70`, etc.).
> The previous active becomes the rollback. The previous rollback moves to `.claude/archive/`.
> Update the Active/Rollback rows in the Active State table above each time a version is promoted.

> **Archive Rule:** `.claude/archive/` is a backup-only folder. **Never auto-read files here.**
> Load a specific archived version only when the user explicitly requests it by name or number.
> All versions accumulate here permanently for safety — they do not affect the active conversation.

**Memory:** `~/.claude/projects/-home-lucasmhefner-job-Job-application-dashboard/memory/`
**Plans:** `~/.claude/plans/`
**Skills:** `~/.claude/skills/`

---

## Versioning Convention

- Files named `hefner_job_architect_v{N}.tsx` where N is an integer.
- Increment N by 1 for every promoted change.
- `resource examples/` holds exactly 2 files: active + rollback.
- All older versions live in `.claude/archive/` — never delete, only archive.
- Style changes and functional changes get **separate** version increments.
- Prompt (`buildSystem`) changes always get their own version increment via `/prompt-update`.

# Make-It-Happen Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `/make-it-happen` skill that silently archives the current TSX component as a new versioned file with a single output line.

**Architecture:** A new skill file at `~/.claude/skills/make-it-happen/SKILL.md` handles all logic. Two supporting edits register it in CLAUDE.md and TOOLKIT.md so it appears in the session skill list and trigger detection.

**Tech Stack:** Markdown skill file (no code), Claude Code Skill tool invocation, CLAUDE.md + TOOLKIT.md as registration targets.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `~/.claude/skills/make-it-happen/SKILL.md` | Full skill logic — trigger detection, execution flow, output format |
| Modify | `/home/lucasmhefner/job/Job application dashboard/CLAUDE.md` | Add skill to Skills table (lines 54–61) |
| Modify | `/home/lucasmhefner/job/Job application dashboard/.claude/TOOLKIT.md` | Add skill to Skills table (lines 17–25) and Skill Interaction Map |

---

## Task 1: Create the skill file

**Files:**
- Create: `~/.claude/skills/make-it-happen/SKILL.md`

- [ ] **Step 1: Create the skill directory and file**

```bash
mkdir -p ~/.claude/skills/make-it-happen
```

Then write `~/.claude/skills/make-it-happen/SKILL.md` with the following exact content:

```markdown
---
name: make-it-happen
description: >
  Use this skill to archive the current Hefner Job Architect component as a new
  complete version file. Trigger when the user says "make it happen", "/make-it-happen",
  "ship it", "produce the output", "lock this version in", "archive this", "I'm ready
  to archive this", or expresses clear intent to snapshot the current development state.
  DO NOT trigger for version-promote, feature-add, or prompt-update workflows — those
  have their own skills. This skill is purely for archiving a complete milestone snapshot.
---

# Make It Happen — Archive Workflow

You are the milestone archiving handler for the Hefner Executive Job Architect component.
Your job: snapshot the current complete component as the next version file, silently.

---

## Phase 1: Locate Active File

Silently perform the following — do NOT announce these steps:

1. Use Glob to list all `.tsx` files in `/home/lucasmhefner/job/Job application dashboard/resource examples/`.
2. Identify the highest version number (e.g., `v68` > `v67`). This is `CURRENT_VERSION`.
3. Record the full path as `CURRENT_FILE`.
4. Increment by 1. Record as `NEXT_VERSION`.
5. Construct new path: `/home/lucasmhefner/job/Job application dashboard/resource examples/hefner_job_architect_v{NEXT_VERSION}.tsx`. Record as `NEW_FILE`.

---

## Phase 2: Archive

Silently execute — do NOT announce these steps:

1. Read the complete contents of `CURRENT_FILE` in full.
2. Write the entire contents to `NEW_FILE` as a single Write call. No changes to content.
3. Update `CLAUDE.md` at `/home/lucasmhefner/job/Job application dashboard/CLAUDE.md`:
   - Active component row → `resource examples/hefner_job_architect_v{NEXT_VERSION}.tsx`
   - Rollback baseline row → `resource examples/hefner_job_architect_v{CURRENT_VERSION}.tsx — **do not modify**`
   - Next version row → `v{NEXT_VERSION + 1} — increment from v{NEXT_VERSION} for any promoted change`

---

## Phase 3: Output

Output exactly this — nothing more, nothing less:

```
Archived → resource examples/hefner_job_architect_v{NEXT_VERSION}.tsx
```

Do not add commentary, version reports, change summaries, or tool mechanics.

---

## Rules

- Always a full file Write — never a surgical Edit
- Never modify `CURRENT_FILE`
- Never ask for a change description
- Never output anything beyond the single confirmation line
- CLAUDE.md update is mandatory on every run
```

- [ ] **Step 2: Verify the file was written**

Use Read tool on `~/.claude/skills/make-it-happen/SKILL.md`. Confirm:
- Frontmatter block is present and valid
- All three phases are present
- Phase 3 output line is exactly: `Archived → resource examples/hefner_job_architect_v{NEXT_VERSION}.tsx`

- [ ] **Step 3: Commit**

```bash
cd /home/lucasmhefner
git -C .claude add skills/make-it-happen/SKILL.md
git -C .claude commit -m "feat: add make-it-happen skill for silent milestone archiving"
```

If `.claude` is not a git repo, skip the commit — the file is already saved.

---

## Task 2: Register skill in CLAUDE.md

**Files:**
- Modify: `/home/lucasmhefner/job/Job application dashboard/CLAUDE.md` lines 54–61

- [ ] **Step 1: Add skill row to CLAUDE.md Skills table**

Current table ends with:

```markdown
| `/project-sync` | "sync project", "integration check" | Validates all cross-references and indexes |
| `/feature-add` | "add feature", "new field", "add a mode" | Any functional addition to the component |
| `/prompt-update` | "update prompt", "change COLLECT mode" | Any change to `buildSystem()` — isolated workflow |
```

Add one row after `/prompt-update`:

```markdown
| `/make-it-happen` | "make it happen", "ship it", "archive this", "lock this version in" | Silent full-file archive snapshot — no questions, one output line |
```

- [ ] **Step 2: Verify the edit**

Read the Skills table section of CLAUDE.md. Confirm `/make-it-happen` row is present and the table is not broken (pipe alignment, no missing cells).

---

## Task 3: Register skill in TOOLKIT.md

**Files:**
- Modify: `/home/lucasmhefner/job/Job application dashboard/.claude/TOOLKIT.md` lines 17–25 (Skills table) and lines 116–126 (Skill Interaction Map)

- [ ] **Step 1: Add skill row to TOOLKIT.md Skills table**

Current table ends with:

```markdown
| `/project-sync` | "sync project", "integration check", "validate structure" | Validates all skill paths, cross-references, and index files across the full toolkit. |
```

Add one row after `/project-sync`:

```markdown
| `/make-it-happen` | "make it happen", "ship it", "archive this", "lock this version in" | Silent full-file archive snapshot of current active TSX. No interaction. Single output line. Preserves prior version as rollback. |
```

- [ ] **Step 2: Add to Skill Interaction Map**

Current map ends with:

```markdown
End-of-session cleanup:
  /file-audit → confirm structure → update MEMORY.md if needed
```

Add after it:

```markdown
Milestone archiving:
  [develop with version-promote / feature-add / prompt-update] → /make-it-happen
```

- [ ] **Step 3: Verify both edits**

Read the Skills table and Skill Interaction Map sections of TOOLKIT.md. Confirm:
- `/make-it-happen` row is present in the table
- Milestone archiving entry is present in the map

---

## Task 4: Smoke test

- [ ] **Step 1: Verify skill is discoverable**

In a fresh message, type `/make-it-happen` and confirm the Skill tool loads `~/.claude/skills/make-it-happen/SKILL.md` without error.

- [ ] **Step 2: Dry-run check**

Confirm the skill's Phase 1 would correctly identify `v68` as `CURRENT_VERSION` and `v69` as `NEXT_VERSION` by reading:

```
/home/lucasmhefner/job/Job application dashboard/resource examples/
```

Confirm `hefner_job_architect_v68.tsx` is the highest version present.

- [ ] **Step 3: Confirm CLAUDE.md will be updated correctly**

Re-read CLAUDE.md Active State table. Confirm it currently shows `v68` as active and `v69` as next — matching what the skill will produce on first run.

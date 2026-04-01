# Design: `/make-it-happen` Skill

**Date:** 2026-04-01
**Status:** Approved
**Project:** Hefner Executive Job Architect

---

## Purpose

A developer archiving tool that produces a complete, self-contained TSX artifact at any development milestone. Creates a full snapshot of the component as the next version file — silently, with no interaction required.

---

## Trigger

Two activation modes, identical behavior:

1. **Hard trigger:** User types `/make-it-happen`
2. **Contextual trigger:** User expresses clear shipping intent in conversation (e.g., "make it happen", "ship it", "produce the output", "lock this version in", "I'm ready to archive this")

---

## Execution Flow

Runs silently — no questions, no back-and-forth:

1. Locate current active TSX file (`resource examples/hefner_job_architect_v{N}.tsx`)
2. Read complete file contents in full
3. Write entire contents as `resource examples/hefner_job_architect_v{N+1}.tsx`
4. Update `CLAUDE.md` Active State table:
   - Active component → `v{N+1}`
   - Rollback baseline → `v{N} — do not modify`
   - Next version → `v{N+2}`
5. Output single confirmation line

---

## Output

```
Archived → resource examples/hefner_job_architect_v{N+1}.tsx
```

Nothing else. No report, no commentary, no tool mechanics visible.

---

## Constraints

- Always a full file Write — never a surgical Edit
- Never modifies the prior active version (rollback preserved)
- Does not ask for a change description
- Does not produce a version report
- CLAUDE.md update is the only side effect beyond the new file

---

## Relationship to Existing Skills

| Skill | Purpose | When to use |
|-------|---------|-------------|
| `/version-promote` | Surgical edits, token-efficient, interactive | Small targeted changes |
| `/make-it-happen` | Full archive snapshot, silent, complete file | Milestone archiving, artifact export |

These are complementary, not overlapping. Different jobs, different triggers.

---

## Artifact Use

The output file (`v{N+1}.tsx`) is a complete, paste-ready artifact suitable for:
- Direct use in a Claude artifact chat conversation
- Live artifact tool deployment
- Development rollback reference

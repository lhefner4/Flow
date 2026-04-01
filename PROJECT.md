# Hefner Executive Job Architect — Project Vision

> This is the master orientation document for the project.
> Read this first if you are new to the codebase, resuming after a break,
> or need to understand the "why" behind any technical decision.

---

## What This Is

The **Hefner Executive Job Architect** is an AI-powered job posting and resume preparation tool built specifically for **Hefner Machine & Tool, Inc.** It is a single-component React/TypeScript web application that guides users through a structured, multi-mode workflow — collecting job posting details, drafting executive-grade output, and refining it through a guided editing interface — all powered by the Claude API.

This is not a generic job board tool. It is a purpose-built, corporate-grade document generation engine designed to produce ATS-optimized, quantified, professionally toned job content that meets the standards of industrial manufacturing leadership.

---

## Who It Serves

- **Primary user:** Hefner Machine & Tool management and HR
- **Use case:** Building job postings, preparing application materials, and generating structured executive summaries for open roles
- **Audience of outputs:** Hiring managers, ATS systems, and professional recruitment pipelines

---

## Core Design Philosophy

| Principle | Implementation |
|-----------|---------------|
| Professional, authoritative tone | Passive voice throughout; zero corporate jargon |
| Quantified results | Every output follows: [Action] + [Context] + [Metric/Result] |
| ATS compatibility | Standard headers, no nested tables, keyword-optimized |
| Executive presentation | Corporate-grade visual design; light/professional color theme |
| Zero hallucination | FACT-LOCK rule: no numeric values or contact info may be altered |

---

## Output Architecture

Every document produced by this tool is structured across five modular sections:

1. **Executive Summary** — The "Why" and "What" in under 150 words. Strategic overview and value proposition.
2. **Core Competency Map** — Scannable matrix of technical and soft skills, keyword-optimized for ATS.
3. **Quantifiable Performance** — Metric-backed accomplishments in the [Action + Context + Result] formula.
4. **Compliance & Quality** — Industry standards coverage: ISO, AS9100, Lean, and related frameworks.
5. **Technical Stack** — Specific software, hardware, and digital tools relevant to the role.

---

## Application Modes

The component operates in four distinct modes, each with a dedicated AI behavior:

| Mode | Purpose |
|------|---------|
| **COLLECT** | Guided intake — gathers job details through structured conversation |
| **DRAFT** | First-pass generation — produces full structured output from collected data |
| **EDIT** | Refinement loop — targeted revisions to specific sections |
| **HELP** | Reference mode — explains tool behavior and output structure |

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + TypeScript (TSX) |
| Styling | Inline CSS-in-JS with centralized THEME block (27+ design tokens) |
| AI Engine | Claude API (`claude-sonnet-4-20250514`) |
| Build target | Single-file standalone component |
| Deployment | Direct browser access (no build pipeline required) |

---

## Project Document Map

| File | Purpose | Modify? |
|------|---------|---------|
| `PROJECT.md` | This file — master vision and orientation | Yes, keep current |
| `CLAUDE.md` | Session operations — active version, dev loop, skills | Yes, update Active State each version |
| `arch.md` | AI operational logic — output structure, style guide, init protocol | No — system memory bank |
| `.claude/TOOLKIT.md` | Skill index — what each skill does and when to use it | Yes, when skills are added |
| `.claude/tokens/DESIGN_TOKENS.md` | Canonical design token registry — all brand colors and spacing | Yes, when tokens change |

---

## File Structure

```
Job application dashboard/
├── PROJECT.md                             ← this file (master vision)
├── CLAUDE.md                              ← session ops (auto-loads)
├── arch.md                                ← AI logic / memory bank (do not modify)
├── resource examples/
│   ├── hefner_job_architect_v68.tsx       ← ACTIVE
│   └── hefner_job_architect_v67.tsx       ← ROLLBACK (do not modify)
└── .claude/
    ├── TOOLKIT.md                         ← skill/agent index
    ├── tokens/
    │   └── DESIGN_TOKENS.md              ← brand token registry
    └── archive/                           ← ⛔ DO NOT READ — load only on explicit request
        ├── hefner_job_architect_v66.tsx   ← auto-archived (superseded rollback)
        ├── hefner_job_architect_v65.tsx   ← archived
        └── hefner_job_architect_v64.tsx   ← archived
```

---

## Version Convention

- Files named `hefner_job_architect_v{N}.tsx` — increment N by 1 per promoted change.
- Style changes and functional changes get **separate** version increments.
- Prompt (`buildSystem`) changes always get their own version via `/prompt-update`.
- Minimum retained: active version + 1 rollback. Archive anything older.

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| v68 | 2026-04-01 | Active — API key gate, direct browser headers, 33 design tokens |
| v67 | 2026-04-01 | Rollback baseline |
| v66 | 2026-04-01 | THEME block injected, 27 tokens fully routed |
| v65 | 2026-04-01 | Prior stable baseline |

---

## Development Rules (Quick Reference)

1. **Never edit without a confirmed scope** — name every file touched before starting.
2. **Edit over Write** — use surgical Edit calls unless >40% of lines change.
3. **Grep before Read** — find specific lines before reading full sections.
4. **FACT-LOCK** — never alter numeric values, rates, or contact info in any string content.
5. **One version per change type** — no mixing style + functional in the same increment.
6. **Use skills** — `/version-promote`, `/theme-audit`, `/feature-add`, `/prompt-update` exist for a reason.

# Requirements Quality Checklist: STAR Defense Cheat-Sheet & Metric Justification

> **Feature Name:** STAR Defense Cheat-Sheet & Metric Justification (Phao Cứu Sinh Giải Trình Số Liệu Phỏng Vấn)  
> **Created:** 2026-11-04  
> **Type:** Requirements Quality Validation ("Unit Tests for English")  
> **Target Artifacts:** [`plan.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/plans/2026-11-04-star-defense-cheat-sheet-plan.md), [`data-model.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-04-star-defense-cheat-sheet/data-model.md), [`contracts/star-defense-api.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-04-star-defense-cheat-sheet/contracts/star-defense-api.md), [`tasks.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-04-star-defense-cheat-sheet/tasks.md)  
> **Governing Constitution:** [`ROLES_AND_GOVERNANCE_RULES.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/architecture/ROLES_AND_GOVERNANCE_RULES.md)

---

## 1. Requirement Completeness

- [x] CHK001 Are extraction rules specified for all metric types (percentages %, latency ms/s, throughput req/s, data volume records/tables, score/ratings) in arbitrary bullet statements? [Completeness, Spec §DataModel.1]
- [x] CHK002 Are the specific measurement tools (e.g. Chrome DevTools Network Tab, Lighthouse CI, Apache Bench `ab`, PostgreSQL `EXPLAIN ANALYZE`) explicitly mapped to their corresponding technology domains? [Completeness, Spec §DataModel.1]
- [x] CHK003 Are requirements defined for synthesizing Before and After baseline states when the candidate's original bullet only states the end result? [Completeness, Spec §Contracts.1]
- [x] CHK004 Are the three core components of each trap question item (interviewer question, hidden intent/what they are probing, 30-second model answer) fully required for all generated items? [Completeness, Spec §DataModel.2]
- [x] CHK005 Are requirements specified for handling non-metric bullet points (e.g., pure feature implementation or architecture setup statements)? [Completeness, Spec §Plan.EdgeCases]

---

## 2. Requirement Clarity & Measurability

- [x] CHK006 Is the 30-second model answer length quantified with a specific word count threshold (e.g., 60–120 words readable in 30 seconds)? [Clarity, Spec §DataModel.2]
- [x] CHK007 Are the risk criteria for red-flag buzzwords (`high`, `medium`, `low`) mathematically or rule-defined without subjective ambiguity? [Clarity, Spec §DataModel.3]
- [x] CHK008 Is the calculation formula for `overallReadinessScore` (0–100%) in `ProjectDefenseOverview` mathematically quantified? [Clarity, Spec §DataModel.5]
- [x] CHK009 Is the Markdown export schema explicitly specified with exact heading levels, bullet markers, and code block formatting? [Clarity, Spec §Contracts.5]
- [x] CHK010 Are maximum character length constraints defined for candidate custom defense notes stored in browser storage? [Clarity, Gap]

---

## 3. Requirement Consistency & Alignment

- [x] CHK011 Do the entity interfaces (`MetricBasisInfo`, `TrapQuestionItem`, `RedFlagWarning`, `StarDefenseItem`) align consistently between data model, contracts, and task breakdowns without naming drift? [Consistency, Spec §DataModel vs §Contracts]
- [x] CHK012 Does the defense generation logic integrate seamlessly with `projectDefenseService` and `starBulletService` without duplicating conflicting technology dictionaries? [Consistency, Spec §Plan.Deduplication]
- [x] CHK013 Is the `userId` partitioning key (`profilehub_star_defense_notes_${userId}`) strictly aligned with the multi-user isolation rules across the project? [Consistency, Constitution §I.4]
- [x] CHK014 Are the UI component styles (modal layout, tabs, badges, icons) consistent with existing Tailwind CSS and Lucide React conventions in `ProjectDefenseModal.tsx`? [Consistency, Spec §Plan.Architecture]

---

## 4. Scenario & Edge Case Coverage

- [x] CHK015 Are requirements defined for when a bullet point contains multiple conflicting metrics or technologies (e.g., "React frontend with Redis caching and PostgreSQL")? [Scenario Coverage, Spec §Plan.Architecture]
- [x] CHK016 Are requirements specified for completely empty bullet strings or whitespace-only inputs passed to the analysis service? [Edge Case, Gap]
- [x] CHK017 Are requirements specified for offline execution (Zero Network Connectivity) ensuring 100% functionality without network requests or API key dependencies? [Coverage, Spec §Research.Decisions]
- [x] CHK018 Are storage quota exhaustion and error recovery behaviors defined for `localStorage` write operations on candidate defense notes? [Exception Flow, Gap]
- [x] CHK019 Is the behavior defined when a user modifies a bullet point in the CV editor after previously saving custom defense notes for that line? [Edge Case, Gap]

---

## 5. Non-Functional, Accessibility & Performance

- [x] CHK020 Is execution latency for bullet defense analysis specified with a measurable upper bound (< 30ms client-side execution)? [Non-Functional, Spec §Contracts.1]
- [x] CHK021 Are responsive layout requirements specified for mobile viewports (< 375px) for Flashcard flip interactions and modal action bars? [Non-Functional, Spec §Tasks.T013]
- [x] CHK022 Are WCAG AA color contrast ratios (≥ 4.5:1) specified for all risk level badges (High = Red, Medium = Amber, Low = Emerald) in both Light and Dark themes? [Accessibility, a11y]
- [x] CHK023 Are keyboard navigation shortcuts (Spacebar/Enter to flip flashcard, Arrow keys to switch questions) specified with accessible ARIA announcements? [Accessibility, Gap]

---

## 6. Dependencies & Assumptions

- [x] CHK024 Is the Single-Player architectural assumption validated that candidate defense cheat-sheets require zero external human reviewer involvement? [Assumption, Spec §Plan.Goal]
- [x] CHK025 Is the Zero-Cost principle confirmed with zero paid third-party API dependencies required for core defense generation? [Dependency, Constitution §I.5]

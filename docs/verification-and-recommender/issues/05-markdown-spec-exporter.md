# 05 — 1-Click Markdown Spec Exporter (`README-spec.md`)

**What to build:** A "Tải File Spec (.md)" button on the AI recommendation UI that formats the project recommendation JSON into a clean, complete GitHub-flavored Markdown file (`README-spec.md`) and downloads it to the student's computer.

**Blocked by:** 04 — AI Knowledge-Gap Project Recommender Engine & UI Widget.

**Status:** completed

- [x] "Tải File Spec (.md)" CTA button integrated into the AI recommendation widget.
- [x] `markdownExporter.ts` utility formats recommendation title, rationale, tech stack, feature checklist, and definition of done into standard Markdown.
- [x] Triggers browser blob download for file named `README-spec.md` (or `<project-slug>-spec.md`).
- [x] Downloaded file is ready to be used as `README.md` in student's GitHub repository.

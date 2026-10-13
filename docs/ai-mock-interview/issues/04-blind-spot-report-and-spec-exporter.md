# 04 — Blind Spot Report Modal & Project Spec Markdown Exporter

**What to build:** Build `BlindSpotReportModal` displaying score, Knowledge Blind Spot Matrix (severity chips + explanation), and 1-Click "Tạo Spec Đồ Án Khắc Phục (.md)" button connecting to the AI Project Recommendation flow.

**Blocked by:** Issue 02, Issue 03

**Status:** completed

- [x] Create `BlindSpotReportModal` with 3 sections: Overall Score Gauge, Blind Spot Matrix cards with severity badges (High/Med/Low), and Action Plan.
- [x] Implement 1-Click "Tải File Spec (.md)" button triggering `downloadProjectSpecMarkdown(spec)` to download `README-spec.md`.

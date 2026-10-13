# 04 — AI Knowledge-Gap Project Recommender Engine & UI Widget

**What to build:** An AI-powered project recommendation widget in the student dashboard/interview-prep portal that aggregates Knowledge Blind Spots from recruiter feedback & low-scoring practice interview items to generate targeted project proposals.

**Blocked by:** None — can start immediately.

**Status:** completed

- [x] `aiRecommendationService` fetches student's latest `interview_feedbacks` (blind spots) and weak practice interview items.
- [x] AI prompt generates a structured recommendation: title, rationale (citing recruiter feedback), recommended tech stack, difficulty level, and key feature backlog.
- [x] Student UI widget displays the recommendation card clearly, highlighting why this project was suggested.
- [x] Graceful fallback if student has no interview feedback yet (suggests trending industry project templates).

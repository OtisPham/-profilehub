# 02 — Gemini AI Mock Interview & Blind Spot Analysis Service

**What to build:** Implement `mockInterviewService.ts` to call Gemini API for adaptive chat question generation and JSON-structured blind spot report synthesis. Handle missing/invalid API key errors gracefully.

**Blocked by:** Issue 01

**Status:** completed

- [x] Implement `generateNextQuestion(topic, level, jdContent, conversationHistory)` using Gemini API.
- [x] Implement `generateBlindSpotReport(topic, level, conversationHistory)` returning structured `{ overall_score, summary, blind_spots, recommended_project_spec }`.
- [x] Add explicit error handling for missing/invalid Gemini API Key with clear user error messages.

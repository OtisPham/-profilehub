# Specification: Verification Gateway & AI Knowledge-Gap Project Recommender

## Problem Statement

1. **Lack of Instant Public Verification:** External recruiters and third parties cannot easily verify whether a student's project and skills were genuinely evaluated and endorsed by a university lecturer without creating an account or going through manual email checks.
2. **Disconnected Skill Improvement:** After a student receives interview feedback identifying technical weak spots (Knowledge Blind Spots) from recruiters or AI practice sessions, they lack a clear, actionable path to translate those findings into concrete, practice-oriented projects to bridge their skill gaps.

## Solution

1. **Public Verification Gateway (`/verify/:verificationCode`):** An unauthenticated, standalone public view displaying verified project authenticity, lecturer endorsement details, verification hash, and public document preview. Includes an automated QR code generator for students to place on CVs and slide decks.
2. **AI Knowledge-Gap Project Recommender & Spec Exporter:** An intelligent recommendation widget integrated into the Student portal that synthesizes recent Recruiter Feedback and AI Interview results, generates a targeted project proposal, and allows 1-click export of a structured `README-spec.md` file for GitHub repository setup.

## User Stories

1. As an external recruiter, I want to open a project verification link without logging in, so that I can immediately confirm the project was verified by an authentic university lecturer.
2. As an external recruiter, I want to view the verifying lecturer's name, title, department, and timestamp on the public verification page, so that I can trust the credibility of the student's claimed skills.
3. As a student, I want to generate and download a QR Code image for any of my verified projects, so that I can embed it into my printed CV, PDF resume, or presentation slides.
4. As a student, I want my private information (such as GPA, personal phone number, email, and recruiter interview notes) to be strictly hidden from the public verification page, so that my personal data remains protected.
5. As a student, I want the system to generate a unique cryptographic verification hash when a lecturer approves my project, so that the authenticity cannot be forged or altered.
6. As a student, I want the AI to analyze my Knowledge Blind Spots from recruiter feedback, so that I get project suggestions tailored to my exact weaknesses.
7. As a student, I want each AI project recommendation to cite the specific reason and feedback source, so that I understand why the project was suggested to me.
8. As a student, I want to see a recommended tech stack, difficulty level, and feature backlog for the suggested project, so that I have a clear roadmap for implementation.
9. As a student, I want to click a single button ("Tải File Spec (.md)") to download a formatted `README-spec.md` file, so that I can immediately initialize my GitHub repository with a complete specification.
10. As a student, I want to upload my completed project through the standard project submission flow once I finish implementing the recommended spec, so that my lecturer can evaluate and award the Verified Badge 🛡️.
11. As a lecturer, I want my verification action to automatically generate the project's unique `verification_code` and `verified_at` timestamp in the database, so that no manual code creation is required.
12. As a platform administrator, I want the public verification link domain to be configurable via environment variables (`VITE_APP_URL`), so that it works seamlessly in development (`localhost`) and production (`profilehub.vn`).

## Implementation Decisions

### 1. Database Schema Changes (Supabase `projects` table)
- Add column `verification_code` (type: `TEXT`, `UNIQUE`, `NULLABLE` until verified). Format: `PH-VER-XXXXXX` (base62 random string).
- Add column `verification_hash` (type: `TEXT`, `NULLABLE`). Cryptographic SHA-256 hash derived from `id + student_id + teacher_id + verified_at`.
- Add column `verified_at` (type: `TIMESTAMPTZ`, `NULLABLE`). Recorded when status transitions to `verified`.

### 2. Standalone Public Verification Route
- Register new route `/verify/:verificationCode` in `App.tsx` outside `MainLayout` to ensure zero sidebar or internal nav rendering for unauthenticated visitors.
- Component `PublicVerificationView.tsx`:
  - Fetches project record matching `verification_code`.
  - Displays Student Name, University/Faculty, Verifying Lecturer Name & Title, Project Title & Abstract, Tech Stack, Verification Timestamp, Cryptographic Verification Hash, and Public Document Preview.
  - Returns 404 / Invalid Badge notice if `verification_code` does not exist or status is not `verified`.

### 3. QR Code Generator Component
- Integrate `qrcode.react` into student project detail modal/view (`ProjectQRCodeModal.tsx`).
- Constructs URL using `import.meta.env.VITE_APP_URL + '/verify/' + project.verification_code`.
- Provides canvas export helper to download PNG/SVG file with branded frame and logo.

### 4. AI Project Recommender Service & Markdown Exporter
- Module `aiRecommendationService.ts`:
  - Aggregates `interview_feedbacks` (blind spots, technical ratings) and low-score items from `ai_interview_logs`.
  - Prompts AI model to return JSON schema containing: `project_title`, `rationale`, `tech_stack`, `difficulty`, `feature_backlog`, `definition_of_done`.
- Module `markdownExporter.ts`:
  - Formats AI recommendation JSON into clean GitHub-flavored Markdown text.
  - Triggers browser blob download for `README-spec.md`.

## Testing Decisions

### Seams for Testing
- **High-Level Service Seams (`verificationService` & `aiRecommendationService`):** Primary seam for verifying business logic, hash generation, verification lookup, and Markdown formatting without requiring full DOM rendering.
- **Component Render Seam (`PublicVerificationView`):** Primary seam for verifying privacy boundaries (ensuring GPA, phone, and email are NEVER rendered in public view).

### Testing Guidelines
- Tests must assert observable behavior (e.g., correct fields returned for valid `verification_code`, 404 state for invalid code, non-null values for public fields, absolute exclusion of private fields).
- Avoid testing internal component state or private helper functions.

## Out of Scope

- Automatic creation of draft projects in the database upon downloading the Markdown spec (Student manually uploads completed project via existing submission flow).
- Custom domain purchasing or DNS record management within code (Handled at deployment infrastructure level).
- Blockchain ledger anchoring for verification hashes (Standard cryptographic hashing with Supabase DB is sufficient for MVP).

## Further Notes

- The `VITE_APP_URL` environment variable should be documented in `.env.example`.
- All verification badges and public records must adhere to existing UI theme styling (Lucide icons, Verified Badge 🛡️ branding).

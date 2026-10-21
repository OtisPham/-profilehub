# Contextual Application Pitch Embedded in CV State

Instead of a standalone cover letter document with separate routing and database tables, ProfileHub provides a Contextual Application Pitch derived directly from the active CV Project Instances and target Job Description (JD), stored as an embedded field within `SavedCVData`.

## Status
Accepted

## Context
A generic Cover Letter generator was previously pruned from ProfileHub to eliminate unneeded complexity and prevent generic AI fluff. However, candidates still need a concise, high-impact introductory note when submitting CVs through email, LinkedIn, or recruiter portals. Introducing a standalone document editor with its own database tables would reintroduce the over-engineering and scope bloat that was previously eliminated.

## Decision
1. **Derivation over Standalone:** The pitch is strictly a derived artifact from a pair of `(CV Project Instance, JD)`, designated as a **Contextual Application Pitch**.
2. **Evidence-First Structure:** Content is constrained to a concise 3-part technical pitch (< 250 words): Hook & Alignment, Project Evidence Spotlight (with live demo/repo links), and a Technical Call to Action.
3. **Embedded Persistence:** Pitch content is persisted directly within `SavedCVData.applicationPitch` as an optional field in existing JSON storage (Supabase + LocalStorage), avoiding new database tables or migrations.
4. **Export Separation:** The pitch is accessed via a dedicated Drawer/Modal on the `CVBuilder` export toolbar, offering 1-click clipboard copy and optional separate export, strictly preserving the 1-page A4 mandate of `Page-Budget Guard` for the primary CV.
5. **Hard-Gated Generation:** The generator requires both an active target JD and at least one project entry. Incomplete contexts trigger guidance alerts rather than generic hallucinated text.

## Consequences
- **Positive:** Zero database migration overhead and no maintenance burden of a secondary document editor.
- **Positive:** Complete alignment with Anti-Hallucination Guard and Project-Driven ethos.
- **Positive:** Seamless candidate workflow: 1-click copy directly into job application notes.
- **Trade-off:** Candidates cannot compose arbitrary, ungrounded cover letters unlinked to a project and JD.

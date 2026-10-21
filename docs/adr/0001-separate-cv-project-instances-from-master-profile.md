# Separate CV Project Instances from Master Profile

CV project entries are derived, specialized instances of master portfolio projects rather than directly bound foreign references, allowing customized STAR phrasing, tech stack highlighting, and project subsetting per Job Description without corrupting master records. Reverse sync is explicitly opt-in.

## Status
Accepted

## Context
Candidates frequently apply for different roles (e.g., Frontend React Developer vs. Backend Node.js Developer) and need to tailor their project descriptions according to each specific Job Description (JD). If CV project items directly referenced the master projects with two-way automatic mutation, tailoring a project for one role would overwrite and corrupt the narrative needed for another role.

## Decision
1. **Master Project** records in the candidate's profile library (`projects`) serve as the baseline source of truth for portfolio data.
2. When a project is added to a CV, a **CV Project Instance** is created as an independent, decoupled copy within the CV's section state.
3. Edits, STAR bullet adaptations, and tech stack re-ordering made within a specific CV remain strictly local to that CV.
4. An explicit **Reverse Sync** action is provided so candidates can deliberately update or publish an improved project instance back to their master profile library.

## Consequences
- **Positive:** Candidates can maintain multiple targeted CV versions simultaneously without cross-CV data contamination.
- **Positive:** Safe experimentation with AI bullet point optimization without fear of losing original portfolio notes.
- **Trade-off:** The system maintains independent project copies in CV state rather than fully normalized database references, requiring intentional sync mechanisms when candidates want global updates.

# Profile Hub — Recruiter Information Architecture & User Flow

## 1. Product concept

Profile Hub is a talent discovery platform connecting recruiters with students through public profiles, real-world projects, and verified information.

### Core recruiter journey

**DISCOVER → EVALUATE → SHORTLIST → CONTACT → INTERVIEW → HIRE**

The main UX goal is to help recruiters:
1. Find relevant candidates quickly.
2. Evaluate candidates using project evidence, not only CV information.
3. Organize and manage candidates through a recruitment pipeline.

---

# 2. Recruiter Information Architecture

```text
RECRUITER
│
├── Dashboard
│   ├── Overview
│   ├── Recommended Candidates
│   ├── Recent Activity
│   └── Recruitment Statistics
│
├── Discover
│   ├── Search Candidates
│   ├── Filters
│   ├── Recommended
│   └── Recently Updated
│
├── Candidates
│   ├── All Candidates
│   ├── Shortlisted
│   ├── Contacted
│   ├── Interview
│   └── Hired
│
├── Saved
│   ├── Saved Candidates
│   └── Candidate Folders
│
├── Jobs
│   ├── My Jobs
│   ├── Create Job
│   └── Job Candidates
│
├── Messages
│   ├── Conversations
│   └── Invitations
│
└── Settings
    ├── Company Profile
    ├── Account
    ├── Notifications
    └── Privacy
```

## Main navigation

```text
┌──────────────────────────────┐
│ PROFILE HUB                  │
│                              │
│ 🏠 Dashboard                 │
│ 🔍 Discover                  │
│ 👥 Candidates                │
│ ⭐ Saved                     │
│ 💼 Jobs                      │
│ 💬 Messages                  │
│                              │
│ ───────────────              │
│ ⚙ Settings                  │
│                              │
│ Recruiter Profile            │
└──────────────────────────────┘
```

---

# 3. Dashboard

The dashboard is the recruiter home screen after login.

```text
Dashboard

Good morning, ABC Company

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 128      │ │ 24       │ │ 8        │ │ 2        │
│Candidates│ │Shortlisted│ │Interview │ │ Hired    │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

Recommended Candidates

┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Nguyễn A       │ │ Trần B         │ │ Lê C           │
│ UI/UX Designer │ │ Frontend Dev   │ │ Marketing      │
│ Figma • UX     │ │ React • JS     │ │ SEO • Content  │
│ [View Profile] │ │ [View Profile] │ │ [View Profile] │
└────────────────┘ └────────────────┘ └────────────────┘

Recent Activity

• Nguyễn A added a new project
• Trần B updated their profile
• Lê C responded to your message
```

### Dashboard goals

- **Continue recruitment:** quickly return to active candidates.
- **Discover talent:** show recommended candidates.
- **Monitor activity:** show profile, project, and message updates.

---

# 4. Discover

Discover is the most important screen for candidate discovery.

## Search

```text
Search candidates...
[ UI/UX Designer                         🔍 ]

Filters

Major
☐ Design
☐ Computer Science
☐ Marketing

Skills
☐ Figma
☐ Photoshop
☐ React
☐ Python

University
☐ HCMUT
☐ UIT
☐ RMIT

Experience
☐ No experience
☐ Internship
☐ 1+ year

Availability
☐ Available now

Location
☐ Ho Chi Minh City
☐ Hanoi
```

## Search result

```text
128 candidates found

[Sort by: Relevance ▼]

┌─────────────────────────────────────┐
│ Nguyễn Văn A                        │
│ UI/UX Designer                      │
│                                     │
│ Figma  UX Research  Photoshop      │
│                                     │
│ 5 Projects   2 Certificates         │
│                                     │
│ [View Profile]       [☆ Save]       │
└─────────────────────────────────────┘
```

### Recommended search filters

- Keyword
- Major
- Skills
- University
- Graduation year
- Location
- Experience
- Availability
- Certificates
- Project type

---

# 5. Core Search User Flow

```text
Discover
   │
   ▼
Enter keyword
"UI/UX Designer"
   │
   ▼
Apply filters
   │
   ▼
Search Results
   │
   ├───────────────┐
   ▼               ▼
View Profile      Save
   │               │
   ▼               ▼
Evaluate         Saved Folder
   │
   ▼
View Projects
   │
   ▼
Shortlist
```

---

# 6. Candidate Profile

The candidate profile should be evidence-based rather than simply a digital CV.

## Profile structure

```text
┌──────────────────────────────────────────────┐
│ [Avatar]                                     │
│                                              │
│ Nguyễn Văn A                                 │
│ UI/UX Designer                               │
│ Ho Chi Minh City                             │
│                                              │
│ Figma • UX Research • Photoshop              │
│                                              │
│ [☆ Save Candidate]  [Contact]                │
└──────────────────────────────────────────────┘

ABOUT

EDUCATION

SKILLS

PROJECTS

EXPERIENCE

CERTIFICATES

ACHIEVEMENTS
```

### Projects should be highly visible

```text
Featured Projects

┌────────────────────────────┐
│ E-commerce Mobile App      │
│                            │
│ [Project image]            │
│                            │
│ UI/UX Design               │
│ Figma                      │
│                            │
│ View Case Study →          │
└────────────────────────────┘
```

---

# 7. Project Detail

Recruiters should be able to understand what the candidate actually did.

```text
E-commerce Mobile App

Student's Role
UI/UX Designer

Duration
3 months

Tools
Figma / Photoshop

Problem
...

Process
...

Solution
...

Final Design
[Images]

Outcome
...

[View Figma]
```

## Important UX principle

The evaluation journey should be:

**Profile → Project → Evidence**

instead of:

**Profile → CV → Recruiter has to guess the candidate's ability**

---

# 8. Candidate Evaluation

After reviewing a profile, the recruiter should have three clear actions:

```text
                 Candidate Profile
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
        Save          Contact       Reject
          │             │
          ▼             ▼
      Shortlist       Message
```

Recommended CTA hierarchy:

- **Primary:** Contact Candidate
- **Secondary:** Save Candidate

---

# 9. Saved Candidates

Recruiters can save promising candidates and organize them into folders.

```text
Saved Candidates

All candidates (24)

Folders

⭐ UI/UX Intern
   8 candidates

💻 Frontend
   6 candidates

📢 Marketing
   10 candidates
```

Inside a folder:

```text
UI/UX Intern

8 candidates

[Compare] [Contact] [Move to pipeline]

Candidate cards...
```

---

# 10. Candidate Pipeline

This is a core candidate-management feature.

Recommended Kanban stages:

```text
DISCOVERED       SHORTLISTED       CONTACTED       INTERVIEW       HIRED
──────────       ───────────       ─────────       ─────────       ──────

Candidate A      Candidate C       Candidate E     Candidate G    Candidate J
Candidate B      Candidate D       Candidate F     Candidate H

                                                  Candidate I
```

Recruiters can move candidates between stages.

```text
SHORTLISTED
     ↓
CONTACTED
     ↓
INTERVIEW
     ↓
HIRED
```

This gives the recruiter one central place to manage the recruitment process.

---

# 11. Candidate Detail in Pipeline

When a recruiter opens a candidate from the pipeline:

```text
Candidate: Nguyễn A

Status
● Interview

Job
UI/UX Intern

────────────────────

Profile
Projects
Messages
Notes
Activity

────────────────────

Recruiter Notes

"Strong portfolio.
Good communication."

[Add Note]

────────────────────

Next step

Interview: 25 Sep
10:00 AM

[Reschedule] [Complete Interview]
```

## Private notes

Recruiters should be able to add private notes such as:

- Portfolio observations
- Interview notes
- Follow-up reminders
- Hiring team feedback

These notes should not be visible to the candidate.

---

# 12. Contact / Messaging Flow

Keep contacting a candidate simple.

```text
Candidate Profile
       │
       ▼
    Contact
       │
       ▼
Select Job
       │
       ▼
Write Message
       │
       ▼
Send Invitation
       │
       ▼
Candidate receives notification
       │
       ▼
Conversation
```

Example message:

> Hi Nguyễn A,  
> We were impressed by your UI/UX projects and would like to discuss an internship opportunity at ABC Company.

---

# 13. Jobs

Adding job management makes the recruiter experience more complete.

## Create Job

```text
Create Job

Job title
[UI/UX Intern]

Department
[Design]

Required skills
[Figma] [UX Research]

Location
[Ho Chi Minh City]

Description
[...]

[Publish Job]
```

## Job overview

```text
UI/UX Intern

32 Applicants

Recommended
12

Shortlisted
8

Interview
4

Hired
1
```

### Job → Candidate relationship

```text
JOB
 │
 ├── Applicants
 │
 ├── Recommended Candidates
 │
 ├── Shortlisted
 │
 ├── Interview
 │
 └── Hired
```

---

# 14. Complete Recruiter User Flow

```text
                         LOGIN
                           │
                           ▼
                      DASHBOARD
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
           DISCOVER                    JOBS
              │                         │
              ▼                         ▼
           SEARCH                    JOB DETAIL
              │                         │
              ▼                         ▼
           FILTER                   CANDIDATES
              │                         │
              └────────────┬────────────┘
                           ▼
                   CANDIDATE PROFILE
                           │
                 ┌─────────┼─────────┐
                 │         │         │
                 ▼         ▼         ▼
              PROJECT     SAVE     CONTACT
                 │         │         │
                 ▼         ▼         ▼
             PROJECT    FOLDER    MESSAGE
             DETAIL        │         │
                           ▼         ▼
                       SHORTLIST  RESPOND
                           │
                           ▼
                        PIPELINE
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
          CONTACTED     INTERVIEW     HIRED
```

---

# 15. The 3 Most Important Screens

If this is a UX/UI case study or university project, prioritize these screens:

## 01 — Discover

Question:

> **How can recruiters find relevant candidates?**

Key features:
- Search
- Filter
- Sort
- Candidate cards
- Save

## 02 — Candidate Profile

Question:

> **How can recruiters evaluate a candidate?**

Key features:
- About
- Skills
- Education
- Projects
- Experience
- Certificates
- Verified information
- Contact

## 03 — Candidate Pipeline

Question:

> **How can recruiters manage candidates?**

Key features:
- Kanban stages
- Candidate status
- Notes
- Interview
- Contact history
- Next actions

The core UX loop becomes:

**FIND → EVALUATE → MANAGE**

---

# 16. Profile Hub's Differentiator

Because Profile Hub has three user types:

```text
             STUDENT
                │
                ▼
          Create Profile
                │
                ▼
          Upload Project
                │
                ▼
             LECTURER
                │
                ▼
          Verify Project
                │
                ▼
          PUBLIC PROFILE
                │
                ▼
            RECRUITER
                │
        ┌───────┼────────┐
        ▼       ▼        ▼
      Search  Projects  Skills
        │       │        │
        └───────┼────────┘
                ▼
             Evaluate
                │
                ▼
            Shortlist
                │
                ▼
             Contact
                │
                ▼
              Hired
```

## Potential USP

**Verified Project / Profile**

Instead of only showing a CV created by a student, Profile Hub can combine:

**Student Profile + Real Project Evidence + Lecturer Verification**

This gives the recruiter more context when evaluating early-career candidates.

---

# 17. MVP Feature Priority

For the first version, don't build everything.

### Must Have

1. Recruiter Dashboard
2. Candidate Search
3. Candidate Filters
4. Public Candidate Profile
5. Project Showcase
6. Save Candidate
7. Candidate Folders
8. Candidate Pipeline
9. Private Notes
10. Contact / Messaging

### Should Have

11. Job Posting
12. Job-specific Candidate Management
13. Candidate Compare
14. Recommended Candidates
15. Notifications

### Later

16. Candidate matching/recommendation
17. Advanced analytics
18. AI-assisted candidate search
19. Automated screening
20. Recruitment reports

---

# 18. Product Architecture Summary

The recruiter side can be summarized into three major systems:

```text
┌──────────────────────────────────────────────┐
│                PROFILE HUB                   │
├──────────────────────────────────────────────┤
│                                              │
│  DISCOVERY          EVALUATION     MANAGEMENT│
│                                              │
│  Search             Profile        Pipeline  │
│  Filter             Projects       Shortlist │
│  Recommend          Skills         Interview │
│  Browse             Experience     Notes     │
│                     Verification   Contact   │
│                                              │
└──────────────────────────────────────────────┘
```

The strongest overall product flow is:

**DISCOVER → VIEW PROFILE → REVIEW PROJECT → SAVE → SHORTLIST → CONTACT → INTERVIEW → HIRE**

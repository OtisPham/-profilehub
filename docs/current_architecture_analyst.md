# Generate Current Architecture Analysis

## Objective

Analyze the entire codebase and generate a comprehensive architecture analysis document.

DO NOT refactor any code.

DO NOT move files.

DO NOT rename anything.

Your only goal is to understand the existing system and produce a detailed architecture report for review by a Software Architect (Copilot).

The output file will be:

```text
docs/CURRENT_ARCHITECTURE_ANALYSIS.md
```

---

# Project Context

Technology Stack:

```yaml
Frontend:
  React
  TypeScript

Backend:
  NodeJS

Database:
  Supabase PostgreSQL

Authentication:
  Supabase Auth
  JWT

Storage:
  Supabase Storage
```

---

# Task 1

## Discover Entire Application Structure

Analyze:

```text
Folder Structure
Business Modules
Services
Components
Hooks
Stores
Contexts
Routes
API Calls
Database Access
Authentication
External Integrations
```

Generate:

```markdown
# Current Project Structure
```

Include:

- root folders
- folder responsibilities
- module ownership
- dependency relationships

---

# Task 2

## Discover Frontend Architecture

Analyze all frontend source code.

Identify:

```text
Pages
Routes
Layouts
Components
Feature Modules
State Management
Hooks
API Services
Contexts
Reusable Utilities
```

Generate:

```markdown
# Frontend Architecture
```

Include:

### Routing Strategy

Example:

```text
App
↓
Router
↓
Page
↓
Feature
↓
Service
↓
API
```

### Component Strategy

Identify:

```text
Page Components
Feature Components
Shared Components
```

### State Management

Identify:

```text
Redux
Zustand
Context API
React Query
Local State
```

Describe relationships.

---

# Task 3

## Discover Backend Architecture

Analyze all backend code.

Identify:

```text
Routes
Controllers
Services
Repositories
Models
Middleware
Auth Logic
Validation Logic
Integrations
Jobs
Events
```

Generate:

```markdown
# Backend Architecture
```

Trace execution flow.

Example:

```text
Route
↓
Middleware
↓
Controller
↓
Service
↓
Repository
↓
Database
```

---

# Task 4

## Discover Authentication Flow

Analyze authentication completely.

Generate:

```markdown
# Authentication Flow
```

Document:

### Login

```text
User
↓
Frontend
↓
API
↓
Supabase Auth
↓
JWT
↓
Response
```

### Register

### Logout

### Refresh Token

### Password Reset

### Role Validation

### Permission Checks

---

# Task 5

## Discover Database Flow

Analyze:

```text
Supabase
Tables
Relations
Views
Policies
Triggers
Functions
```

Generate:

```markdown
# Database Architecture
```

For each table:

```text
Purpose
Relations
Used By
Potential Issues
```

---

# Task 6

## Trace Business Flows

Identify every major business process.

Examples:

### User Flow

```text
Create User
Update User
Delete User
Manage Profile
```

### Project Flow

```text
Create
Read
Update
Delete
```

### File Flow

```text
Upload
Download
Delete
```

### Notification Flow

### Reporting Flow

### Admin Flow

Generate diagrams.

Example:

```text
Frontend
↓
API
↓
Service
↓
Database
↓
Response
```

---

# Task 7

## Dependency Analysis

Detect:

### Circular Dependencies

Example:

```text
A → B → C → A
```

---

### Tight Coupling

Example:

```text
UI directly accessing database
```

---

### Layer Violations

Example:

```text
Frontend directly calling Supabase
without backend abstraction
```

---

### Duplicate Logic

Example:

```text
Validation repeated
Business rule repeated
```

---

Generate:

```markdown
# Dependency Analysis
```

---

# Task 8

## Identify Architectural Problems

Create:

```markdown
# Architecture Problems
```

Classify into:

### Critical

### High

### Medium

### Low

For each issue:

```text
Description
Location
Impact
Recommended Fix
```

---

# Task 9

## Identify Refactoring Opportunities

Create:

```markdown
# Refactoring Opportunities
```

Examples:

### Frontend

```text
Move to Feature-Based Architecture
```

### Backend

```text
Move to Module-Based Architecture
```

### Database

```text
Separate infrastructure layer
```

---

# Task 10

## Generate Architecture Metrics

Estimate:

### Frontend

```text
Pages
Components
Features
Stores
Services
Contexts
```

### Backend

```text
Routes
Controllers
Services
Repositories
Modules
```

### Database

```text
Tables
Views
Policies
Functions
```

Generate:

```markdown
# Architecture Metrics
```

---

# Task 11

## Create AI Collaboration Report

Create:

```markdown
# AI Ownership Recommendation
```

Recommend:

### Gemini

Responsible for:

```text
frontend/**
```

---

### Claude

Responsible for:

```text
backend/**
infrastructure/**
```

---

### Copilot

Responsible for:

```text
docs/**
architecture/**
shared/**
```

---

### Refactoring Agent

Responsible for:

```text
moving files
fixing imports
dependency cleanup
```

---

# Final Deliverable

Generate:

```text
docs/CURRENT_ARCHITECTURE_ANALYSIS.md
```

The document must contain:

1. Project Structure
2. Frontend Architecture
3. Backend Architecture
4. Authentication Flow
5. Database Architecture
6. Business Flows
7. Dependency Analysis
8. Architecture Problems
9. Refactoring Opportunities
10. Architecture Metrics
11. AI Ownership Recommendation
12. Executive Summary

---

# Critical Rules

Do NOT modify source code.

Do NOT refactor.

Do NOT move files.

Do NOT create new architecture.

First understand the current architecture.

Then document it.

The report will be reviewed by Copilot before any refactoring work begins.
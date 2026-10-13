# 📐 System Design Document — ProfileHub

## 1. High-Level Architecture
ProfileHub áp dụng mô hình kiến trúc Client-Server hiện đại:
* **Frontend:** Single-Page Application (SPA) xây dựng trên React 18, TypeScript, Vite và Tailwind CSS.
* **Backend:** Serverless Architecture sử dụng Supabase (PostgreSQL 15, Auth Service, Edge Functions, Storage).
* **Security Layer:** Row Level Security (RLS) bảo vệ truy cập dữ liệu trực tiếp từ database.

## 2. Component Interactions
```
┌────────────────────────────────────────────────────────┐
│                   React Frontend App                   │
│  (Single-Layout Architecture: MainLayout + Sidebar)    │
└───────────────────────────┬────────────────────────────┘
                            │ REST / Supabase Client
                            ▼
┌────────────────────────────────────────────────────────┐
│               Supabase BaaS / Edge Functions           │
│  - Auth (JWT / Session)                                │
│  - Edge Functions (Business Logic & Validation)        │
│  - PostgreSQL 15 Database (RLS Enforcement)            │
│  - Supabase Storage (PDF Documents & Attachments)      │
└────────────────────────────────────────────────────────┘
```

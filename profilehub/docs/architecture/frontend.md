# 🖥️ Frontend Architecture Document

## 1. Directory Structure
```
src/
├── components/          # Tái sử dụng UI theo phân hệ (auth, common, layout, projects, recruiter)
├── hooks/               # Custom hooks quản lý logic và state (useAuth, useProjects,...)
├── pages/               # Trang hiển thị theo vai trò (student, teacher, recruiter, auth)
├── services/            # Tầng giao tiếp dữ liệu (Supabase Client, API services)
├── types/               # Kiểu dữ liệu TypeScript tập trung
└── utils/               # Helpers, formatters, validation
```

## 2. Key Design Patterns
* **Single-Layout Pattern:** Bọc tất cả các trang chức năng trong `MainLayout.tsx` với `Sidebar.tsx` đồng bộ để tránh chớp màn hình hay trùng lặp thanh menu.
* **Role-Based Routing:** Kiểm soát điều hướng dựa trên role (`student`, `teacher`, `recruiter`) và trạng thái session.
* **Graceful Degradation:** Hỗ trợ Mock Fallback khi offline hoặc chưa kết nối cơ sở dữ liệu.

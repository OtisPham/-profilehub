# 🚀 SPEC: Xây Dựng Hệ Thống Caching & Indexing Tối Ưu Truy Vấn Dữ Liệu Lớn

> **Nguồn Đề Xuất:** Trần Văn Nam (Senior HR Lead) • FPT Software & Technology  
> **Điểm Mù Kiến Thức Cần Khắc Phục:** `SQL Indexing & Query Optimization`  
> **Mức Độ Kỹ Thuật:** Nâng cao | **Thời Gian Dự Kiến:** 10 - 14 ngày  
> **Ngày Tạo:** 23/9/2026

---

## 🎯 1. Lý Do Đề Xuất (Rationale)

Dựa trên phản hồi từ phỏng vấn thực tế của Trần Văn Nam (Senior HR Lead) (FPT Software & Technology): "Ứng viên trình bày tự tin, nắm chắc kiến thứVc ReactJS và cấu trúc component. Cần rèn luyện thêm kỹ năng truy vấn nâng cao SQL và tối ưu hoá Indexing."

---

## 🛠️ 2. Công Nghệ Trọng Tâm (Recommended Tech Stack)

- `Node.js`
- `PostgreSQL`
- `Redis`
- `Docker`
- `Prisma ORM`

---

## 📋 3. Danh Sách Tính Năng Cần Thực Hiện (Feature Backlog)

1. [ ] **Thiết kế Cấu trúc B-Tree Index cho các bảng có lượt đọc lớn (> 1,000,000 dòng)**
2. [ ] **Tích hợp Redis Cache Layer (Read-Through & Write-Through caching patterns)**
3. [ ] **Viết script Benchmark đo thời gian phản hồi (Response Time) trước và sau tối ưu**
4. [ ] **Xây dựng Dashboard giám sát tỷ lệ Cache Hit/Miss Rate realtime**

---

## ✅ 4. Tiêu Chí Hoàn Thành (Definition of Done)

- [ ] Thời gian phản hồi truy vấn giảm từ > 500ms xuống < 30ms
- [ ] Tỷ lệ Cache Hit Rate đạt tối thiểu 85% dưới tải mô phỏng 500 RPS
- [ ] Kèm file báo cáo so sánh chi tiết kèm lệnh EXPLAIN ANALYZE

---

## 🛡️ 5. Hướng Dẫn Nộp Đồ Án Lên ProfileHub

1. Khởi tạo Git Repository trên máy tính và đưa file này làm `README.md`.
2. Tiến hành gõ code và xây dựng ứng dụng theo đúng danh sách tính năng trên.
3. Push mã nguồn lên GitHub / GitLab.
4. Đăng nhập **ProfileHub** $\rightarrow$ **Quản Lý Đồ Án** $\rightarrow$ Bấm **"Đăng Tải Đồ Án Mới"** và gửi yêu cầu xác thực tới Giảng viên hướng dẫn để cấp con dấu **Verified Badge 🛡️**.

---
*Generated automatically by ProfileHub AI Knowledge-Gap Career Engine.*

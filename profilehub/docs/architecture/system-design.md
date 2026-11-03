# 📐 System Design & Technical Architecture Document — ProfileHub v1.0
> **Tài liệu đặc tả kiến trúc kỹ thuật & phân rã chức năng hệ thống sau khi tiếp thu và khắc phục phản hồi người dùng thực tế (Post-Feedback Refined Architecture).**  
> **Cập nhật:** Chuẩn hóa kiến trúc Đăng nhập trước (Login-First), Tinh gọn giao diện (Clean Workspace), AI Copilot, Đa dạng hóa 6 Template và Bộ máy in PDF A4 chuẩn ATS.

---

## 🏛️ 1. Kiến Trúc Kỹ Thuật Tổng Thể (Overall Technical Architecture)

Hệ thống ProfileHub được thiết kế theo mô hình **Client-Serverless & Micro-Services Layered Architecture**, kết hợp cơ chế kiểm soát truy cập dữ liệu đa tầng (**Multi-Tier Data Protection**):

```mermaid
flowchart TB
    subgraph ClientLayer ["1. CLIENT LAYER (React 18 SPA + TypeScript + Vite)"]
        direction TB
        subgraph PublicZone ["Public Surface"]
            LandingPage["Trang Chủ Giới Thiệu (Landing Page)"]
            PublicShowcase["Public Showcase Hồ Sơ (/showcase/:id)"]
            PublicVerify["Cổng Tra Cứu Bảo Chứng (/verify/:code)"]
        end

        subgraph WorkspaceZone ["Candidate Workspace (Login-First Protected)"]
            Dashboard["Bàn Điều Khiển (Dashboard + War Room)"]
            ProjectHub["Kho Đồ Án Proof-of-Work (/my-projects)"]
            CVStudio["Trình Soạn Thảo CV Studio (/cv-builder)"]
            CVManager["Kho Đa Phiên Bản CV (/cv-management)"]
        end

        subgraph PresentationEngines ["UI & Export Core Engines"]
            TailwindCSS["Tailwind CSS 3.4 (Theming & Contrast Safe)"]
            PrintEngine["A4 Print Engine (@media print fidelity)"]
            StateMgmt["React Context & State Purge Management"]
        end
    end

    subgraph SecurityGate ["2. SECURITY & AUTH GATEWAY"]
        AuthGuard["ProtectedRoute (Login-First Enforcement)"]
        SessionManager["Session Cache Isolator (Anti-Cross-Session Leakage)"]
        SupabaseAuth["Supabase Auth (OAuth Google, GitHub & Email/Password)"]
    end

    subgraph BackendLayer ["3. BACKEND SERVERLESS & STORAGE (Supabase BaaS)"]
        EdgeFunctions["Supabase Edge Functions (Deno Runtime)"]
        PostgresDB[("PostgreSQL 15 Database")]
        StorageBucket["Supabase Storage (PDF Documents & Attachments)"]
        RLS["Row Level Security (RLS Engine)"]
    end

    subgraph AIServiceLayer ["4. AI & INTELLIGENCE SERVICES LAYER"]
        StarDiag["STAR Diagnostic & Google XYZ Refinement"]
        AtsParser["ATS Parser Eye & Plain-Text Normalizer"]
        SalaryCrawler["Real Market Salary Benchmark Engine"]
        MockInterview["Adaptive 4-Stage AI Mock Interviewer"]
        LevelCalib["AI Level Calibration & Promotion Engine"]
        HeatmapEngine["CV Heatmap & Attention Analytics Tracker"]
    end

    %% Connections
    PublicZone --> AuthGuard
    AuthGuard --> WorkspaceZone
    WorkspaceZone --> PresentationEngines
    PresentationEngines --> StateMgmt
    StateMgmt --> SessionManager
    SessionManager --> SupabaseAuth

    WorkspaceZone -->|REST / Realtime SDK| EdgeFunctions
    WorkspaceZone -->|Direct Secure Client| PostgresDB
    WorkspaceZone -->|Upload / Download| StorageBucket
    PostgresDB --- RLS

    WorkspaceZone <--> AIServiceLayer
    EdgeFunctions <--> AIServiceLayer
```

---

## 🔐 2. Sơ Đồ Luồng Dữ Liệu & Xác Thực Bảo Vệ (Data Isolation & Auth Flow)

Khắc phục triệt để lỗi **BUG-03** (Rò rỉ dữ liệu phiên khách) và **BUG-05** (Mất dữ liệu khi chưa đăng nhập) bằng luồng **Login-First & Session Isolation**:

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant UI as Giao diện Web (SPA)
    participant Auth as Auth Gate (ProtectedRoute)
    participant Cache as Session Cache (Memory / Local)
    participant Cloud as Supabase PostgreSQL (RLS)

    User->>UI: Truy cập Trang chủ (Landing Page)
    UI-->>User: Hiển thị Public Header (Chỉ có Đăng nhập / Đăng ký)
    
    alt Truy cập tính năng Workspace (/cv-builder, /dashboard)
        User->>UI: Bấm "Tạo CV" hoặc "Vào Không Gian Làm Việc"
        UI->>Auth: Kiểm tra Session Token hiện tại
        alt Chưa đăng nhập
            Auth-->>UI: Bật Modal Đăng nhập / Đăng ký (Google / GitHub)
            User->>Auth: Xác thực thành công qua Google OAuth
            Auth->>Cache: Khởi tạo phân vùng `profilehub_user_cvs_{userId}`
            Auth-->>UI: Cấp Session JWT & Chuyển hướng vào Workspace
        else Đã đăng nhập
            Auth-->>UI: Cho phép truy cập trực tiếp
        end
    end

    User->>UI: Thao tác soạn thảo CV trong Canvas
    UI->>Cache: Tự động lưu bản nháp theo `userId` (Auto-save)
    User->>UI: Bấm nút [Lưu CV]
    UI->>Cloud: Đồng bộ bản ghi CV lên Supabase (Gán chặt chẽ với auth.uid())
    Cloud-->>UI: Phản hồi 200 OK + Timestamp lưu thành công
    UI-->>User: Tắt sạch backdrop, cập nhật trạng thái "Đã lưu đám mây an toàn"

    alt Người dùng Đăng xuất (Logout)
        User->>UI: Bấm Đăng xuất
        UI->>Cache: Purge sạch toàn bộ State & Cache người dùng
        UI->>Cloud: Hủy bỏ Session Token
        UI-->>User: Điều hướng về Landing Page (Không còn lưu vết trên máy)
    end
```

---

## 📑 3. Sơ Đồ Kiến Trúc In Ấn & Xuất PDF A4 (Print Engine Fidelity)

Khắc phục **BUG-09** (Lệch giao diện, chém đôi khối văn bản, bay màu khi in/xuất PDF):

```mermaid
flowchart TD
    Trigger["Người dùng bấm [Xuất PDF] (hoặc Ctrl + P)"] --> CSSInject["Kích hoạt Engine @media print"]
    
    subgraph IsolationRules ["1. Cô Lập Khung Giấy Chuẩn"]
        HideWeb["Ẩn 100% Giao Diện Ngoài:\nHeader, Footer, Toolbar, AI Copilot Panel\n(visibility: hidden)"]
        ShowA4["Chỉ Cho Phép Hiển Thị:\n#cv-preview-a4 và con của nó\n(visibility: visible, position: absolute, top: 0, left: 0)"]
    end

    subgraph QualityControl ["2. Bảo Toàn Màu Sắc & Định Dạng"]
        ForceColor["Ép Buộc In 100% Màu Nền & Đường Kẻ:\n-webkit-print-color-adjust: exact !important\nprint-color-adjust: exact !important"]
        PageDim["Khóa Khổ Giấy Chuẩn A4 Quốc Tế:\nsize: A4 portrait; margin: 8mm 10mm;"]
    end

    subgraph AntiSplit ["3. Chống Rách Khối Nội Dung (Orphan Prevention)"]
        AvoidBreak["break-inside: avoid !important;\npage-break-inside: avoid !important;\nÁp dụng cho: .cv-section-block, .cv-item-block, li"]
    end

    CSSInject --> IsolationRules
    IsolationRules --> QualityControl
    QualityControl --> AntiSplit
    AntiSplit --> BrowserPrint["Hộp Thoại In Trình Duyệt / Xuất PDF Đẹp Tuyệt Đối Từng Pixel"]
```

---

## 🧩 4. Sơ Đồ Phân Rã Chức Năng Hệ Thống (Functional Architecture Breakdown)

Hệ thống được tinh giản, gom nhóm logic và phân định rõ ràng giữa các chức năng soạn thảo và chuẩn bị phỏng vấn:

```mermaid
flowchart LR
    subgraph ProfileHub ["HỆ THỐNG PROFILEHUB v1.0"]
        direction TB

        subgraph ModuleCV ["1. PHÂN HỆ CV STUDIO (ĐÃ KHẮC PHỤC)"]
            CV_Toolbar["Thanh Công Cụ Tinh Gọn (Bỏ Lương & Phỏng vấn)"]
            CV_Templates["6 Cấu Trúc Mẫu CV Thực Chất\n(Top-Banner, Harvard, Terminal, Timeline, Sidebar, Compact)"]
            CV_Copilot["🤖 Bảng AI Copilot (3 Tab)\n• Soi lỗi & ATS\n• Nâng cấp câu chữ\n• Gợi ý phỏng vấn"]
            CV_Budget["Page Budget Bar (Kiểm soát tràn trang A4)"]
            CV_Print["Engine Xuất PDF Chuẩn In"]
        end

        subgraph ModuleProof ["2. PHÂN HỆ PROOF-OF-WORK (KHO ĐỒ ÁN)"]
            Proj_List["Quản Lý Đồ Án Kỹ Thuật"]
            Proj_Verify["Gửi Duyệt Học Thuật Giảng Viên"]
            Proj_Badge["Huy Hiệu Verified 🛡️ & Cryptographic Hash"]
            Proj_Showcase["Public Showcase & Mã Smart QR"]
        end

        subgraph ModuleWarRoom ["3. PHÂN HỆ TRẠM TÁC CHIẾN (WAR ROOM)"]
            War_Salary["AI Salary Benchmark (Khảo sát lương P50-P85)"]
            War_Interview["AI Mock Interviewer 4 Chặng Thích Ứng\n(Pitch, STAR Deep-Dive, Live Incident, Gap Defense)"]
            War_Calib["AI Level Calibration (Đôn cấp / Giữ cấp / Bồi dưỡng)"]
            War_Reschedule["Đồng Bộ Lịch Phỏng Vấn 2 Chiều với NTD"]
        end

        subgraph ModuleTracking ["4. PHÂN HỆ CV HEATMAP & ANALYTICS"]
            Track_Dwell["Đo Thời Gian Đọc Trung Bình (Avg Dwell Time)"]
            Track_Heatmap["Bản Đồ Nhiệt Điểm Dừng Mắt Của NTD"]
            Track_LiveFeed["Nhật Ký Xem Hồ Sơ Thời Gian Thực"]
        end
    end
```

---

## 🗺️ 5. Sơ Đồ Hành Trình Trải Nghiệm Khép Kín (End-to-End User Journey)

```mermaid
flowchart TD
    A["1. Đăng Nhập Hệ Thống (Login-First Workspace)"] --> B["2. Quản Lý Đồ Án & Nhận Huy Hiệu Verified 🛡️"]
    B --> C["3. Vào CV Studio (/cv-builder) May Đo CV"]
    C --> D["4. Sử Dụng AI Copilot:\nKiểm Tra Lỗi ATS & Nâng Cấp Câu Chữ Định Lượng"]
    D --> E["5. Chọn 1 trong 6 Mẫu Layout Độc Đáo & Khóa Page Budget A4"]
    E --> F["6. Xuất In PDF Chuẩn Xác Kèm Smart QR Link Showcase"]
    F --> G["7. Theo Dõi Lượt Xem Qua CV Heatmap Analytics"]
    G --> H["8. Vào War Room Tại Dashboard:\nKhảo Sát Dải Lương & Luyện Phỏng Vấn AI 4 Chặng"]
    H --> I["9. Nhận Báo Cáo Radar 5 Trục & Tái Hiệu Chuẩn Cấp Bậc Offer"]
```

---

## 📊 6. Bảng Ánh Xạ Khắc Phục 9 Điểm Góp Ý (Feedback Resolution Matrix)

| Mã Phản Hồi | Phân Loại | Vấn Đề Gốc | Giải Pháp Kỹ Thuật Đã Chuẩn Hóa | Trạng Thái Kiến Trúc |
| :---: | :--- | :--- | :--- | :---: |
| **BUG-01** | Luồng & Header | Lộ menu Tìm việc làm & Công cụ dang dở | Tách biệt Header 2 trạng thái: Public Landing vs Candidate Workspace (chỉ 3 menu: Dashboard, Đồ án, Quản lý CV). | ✅ Đã khắc phục triệt để |
| **BUG-02** | CV Toolbar | Hơn 12 icon rối mắt, nhồi nhét Khảo sát lương & Phỏng vấn | Gỡ bỏ 2 nút ngoài luồng; gom toàn bộ kiểm tra chất lượng về nút trạng thái duy nhất `[🛡️ Chuẩn ATS: xx%]`. | ✅ Đã khắc phục triệt để |
| **BUG-03** | Bảo Mật & Cache | Rò rỉ dữ liệu phiên khách sang tài khoản khác | Triển khai phân vùng cache theo `userId`, thiết lập hàm Purge State toàn cục khi Logout. | ✅ Đã khắc phục triệt để |
| **BUG-04** | Thuật Ngữ UX | Khái niệm "STAR Coach" khó hiểu | Quy chuẩn thành **🤖 AI Copilot (Trợ lý CV)** với 3 tab: Soi lỗi/ATS, Viết lại câu chữ, Ôn tập đồ án. | ✅ Đã khắc phục triệt để |
| **BUG-05** | Luồng Xác Thực | Bấm Lưu bị mất khi chưa đăng nhập | Cài đặt Auth Gate bắt buộc khi Lưu; tự động đồng bộ lên Supabase Cloud sau khi login thành công. | ✅ Đã khắc phục triệt để |
| **BUG-06** | Mẫu CV | Quảng cáo 6 mẫu nhưng chỉ có 2 kiểu bố cục | Thiết kế 6 mẫu cấu trúc layout riêng biệt (Top-Banner, Harvard, Terminal, Timeline, Sidebar, Compact). | ✅ Đã khắc phục triệt để |
| **BUG-07** | Hiển Thị | Dropdown chọn CV/Dự án bị tối đen | Fix triệt để CSS style và thuộc tính màu nền/chữ cho `<select>` và từng `<option>`. | ✅ Đã khắc phục triệt để |
| **BUG-08** | Giới Hạn AI | Badge 20/20 gây áp lực; đơ màn mờ sau lưu | Ẩn badge quota tĩnh; chỉ hiện modal khi hết hạn mức; reset triệt để backdrop overlay khi lưu xong. | ✅ Đã khắc phục triệt để |
| **BUG-09** | Xuất In PDF | In bị dính giao diện web, chém đôi chữ | Chuẩn hóa `@media print`, khóa khổ A4, chống cắt dòng `break-inside: avoid`, ép 100% màu in. | ✅ Đã khắc phục triệt để |

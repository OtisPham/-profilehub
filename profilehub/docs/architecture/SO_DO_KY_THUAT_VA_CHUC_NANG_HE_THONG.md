# 🏛️ ĐẶC TẢ KIẾN TRÚC KỸ THUẬT & PHÂN RÃ CHỨC NĂNG HỆ THỐNG PROFILEHUB v1.0
## (Technical & Functional Architecture Specification — Post-Feedback Refactored)

> **Tài liệu tham chiếu:**  
> - Báo cáo phản hồi người dùng thực tế: `profilehub/docs/product/Fix.md`  
> - Quy chuẩn nâng cấp giao diện & luồng đăng nhập: `profilehub/docs/product/updateui.md`  
> - Đặc tả luồng chính toàn hệ thống: `profilehub/docs/product/luong_chinh_he_thong.md`  
> - Báo cáo thẩm định tính năng CV: `profilehub/DANH_GIA_TINH_NANG_CV_PROFILEHUB.md`  
>  
> **Trạng thái:** Tài liệu chính thức (Official Technical Architecture Specification)  
> **Phiên bản:** v1.0 (Đã khắc phục hoàn toàn 9 nhóm vấn đề người dùng phản ánh)

---

## 📑 MỤC LỤC
1. [Tổng Quan Khắc Phục 9 Điểm Góp Ý Thực Tế](#1-tổng-quan-khắc-phục-9-điểm-góp-ý-thực-tế)
2. [Sơ Đồ Kiến Trúc Kỹ Thuật Tổng Thể (System Technical Architecture)](#2-sơ-đồ-kiến-trúc-kỹ-thuật-tổng-thể-system-technical-architecture)
3. [Sơ Đồ Luồng Xác Thực & Phân Vùng Dữ Liệu An Toàn (Login-First Flow)](#3-sơ-đồ-luồng-xác-thực--phân-vùng-dữ-liệu-an-toàn-login-first-flow)
4. [Sơ Đồ Kiến Trúc Bộ Máy In Ấn & Xuất PDF A4 Chuẩn ATS (Print Engine)](#4-sơ-đồ-kiến-trúc-bộ-máy-in-ấn--xuất-pdf-a4-chuẩn-ats-print-engine)
5. [Sơ Đồ Phân Rã Chức Năng Hệ Thống (Functional Architecture Breakdown)](#5-sơ-đồ-phân-rã-chức-năng-hệ-thống-functional-architecture-breakdown)
6. [Sơ Đồ Hành Trình Trải Nghiệm Khép Kín Của Ứng Viên (End-to-End User Journey)](#6-sơ-đồ-hành-trình-trải-nghiệm-khép-kín-của-ứng-viên-end-to-end-user-journey)
7. [Đặc Tả Chi Tiết 6 Mẫu CV Bố Cục Thực Chất](#7-đặc-tả-chi-tiết-6-mẫu-cv-bố-cục-thực-chất)
8. [Bảng Ánh Xạ Module Mã Nguồn Thực Tế (Source Code Mapping)](#8-bảng-ánh-xạ-module-mã-nguồn-thực-tế-source-code-mapping)
---

## 1. TỔNG QUAN KHẮC PHỤC 9 ĐIỂM GÓP Ý THỰC TẾ

Sau các đợt chạy thử nghiệm thực tế với ứng viên và sinh viên, hệ thống đã ghi nhận 9 vấn đề và xử lý dứt điểm theo bảng ánh xạ sau:

| STT | Mã Lỗi | Phân Loại | Vấn Đề Người Dùng Phản Ánh | Giải Pháp Kỹ Thuật Đã Triển Khai |
| :---: | :---: | :--- | :--- | :--- |
| **01** | `BUG-01` | **Điều hướng** | Header & Sidebar chứa menu "Tìm việc làm" và dropdown "Công cụ nghề nghiệp" dang dở gây loãng luồng. | Chuẩn hóa **Header 2 trạng thái**: Public (Landing) & Workspace (Đã đăng nhập chỉ còn 3 menu cốt lõi: *Tổng Quan*, *Kho Đồ Án*, *Quản Lý CV*). |
| **02** | `BUG-02` | **Giao diện soạn thảo** | Toolbar Canvas nhồi nhét hơn 12 icon trùng lặp, lẫn cả nút *Khảo sát lương* và *Phỏng vấn AI*. | Dọn sạch nút ngoài ngữ cảnh; gom toàn bộ kiểm tra chất lượng về **1 nút trạng thái duy nhất: `[🛡️ Chuẩn ATS: xx%]`**. |
| **03** | `BUG-03` | **Bảo mật dữ liệu** | Đăng nhập tài khoản mới vẫn thấy CV của phiên khách trước hoặc tài khoản khác. | Phân vùng bộ nhớ theo `userId` (`profilehub_user_cvs_${userId}`), tích hợp cơ chế **Purge State toàn cục** khi Đăng xuất. |
| **04** | `BUG-04` | **Thuật ngữ UX** | Khái niệm "STAR Coach" mang tính hàn lâm, gây khó hiểu cho sinh viên ngoài ngành. | Quy chuẩn thành **🤖 AI Copilot** với 3 tab trực quan: *Kiểm tra lỗi & ATS*, *Nâng cấp câu chữ*, *Ôn tập phỏng vấn đồ án*. |
| **05** | `BUG-05` | **Luồng xác thực** | Soạn CV xong bấm Lưu nhưng chưa đăng nhập dẫn đến mất dữ liệu khi đổi máy. | Kích hoạt **Auth Gate Modal** bắt buộc đăng nhập để đồng bộ an toàn lên Cloud qua Supabase RLS. |
| **06** | `BUG-06` | **Mẫu CV** | Quảng cáo 6 mẫu nhưng thực chất chỉ có 2 kiểu bố cục (1 cột và 2 cột). | Thiết kế **6 cấu trúc layout thực chất**: Top-Banner, Harvard Minimalist, Tech Terminal, Timeline Milestone, Left Sidebar, Compact ATS. |
| **07** | `BUG-07` | **Lỗi tương phản** | Ô chọn (Dropdown `<select>`) CV/Dự án trong Modal Phỏng vấn bị đen chữ trên nền đen. | Ép màu chữ và màu nền trực tiếp cho cả thẻ `<select>` lẫn từng thẻ con `<option>` trên cả Light và Dark mode. |
| **08** | `BUG-08` | **Tâm lý & Giới hạn AI** | Huy hiệu `Còn 20/20 lượt AI` gây áp lực sắp thu phí; lỗi đơ màn mờ (backdrop) sau khi lưu. | Ẩn badge quota tĩnh; chỉ hiện thông báo khi hết lượt (`remainingCredits <= 0`); reset triệt để backdrop khi đóng modal. |
| **09** | `BUG-09` | **Xuất in PDF** | Xuất PDF bị dính menu web, chém đôi khối đồ án giữa 2 trang, bay màu nền. | Chuẩn hóa bộ máy `@media print`: cô lập khung `#cv-preview-a4`, ép in 100% màu nền, khóa khổ A4, chống cắt dòng `break-inside: avoid`. |

---

## 2. SƠ ĐỒ KIẾN TRÚC KỸ THUẬT TỔNG THỂ (SYSTEM TECHNICAL ARCHITECTURE)

Hệ thống ProfileHub được kiến trúc theo mô hình **Client-Serverless Layered Architecture** phân định rành mạch giữa Presentation, Security Gateway, BaaS Cloud Storage và Tầng Dịch vụ Trí tuệ Nhân tạo (AI Intelligence):

```mermaid
flowchart TB
    subgraph ClientLayer ["1. CLIENT LAYER (React 18 SPA + TypeScript + Vite)"]
        direction TB
        subgraph PublicZone ["Public Surface (Truy Cập Mở)"]
            LandingPage["Trang Chủ Giới Thiệu (Landing Page - /)"]
            PublicShowcase["Public Showcase Hồ Sơ (/showcase/:id)"]
            PublicVerify["Cổng Tra Cứu Bảo Chứng (/verify/:code)"]
        end

        subgraph WorkspaceZone ["Candidate Workspace (Bảo Vệ Bởi ProtectedRoute)"]
            Dashboard["Bàn Điều Khiển (Dashboard & War Room)"]
            ProjectHub["Kho Đồ Án Proof-of-Work (/my-projects)"]
            CVStudio["Trình Soạn Thảo CV Studio (/cv-builder)"]
            CVManager["Kho Đa Phiên Bản CV (/cv-management)"]
        end

        subgraph CoreEngines ["UI & Export Core Engines"]
            TailwindCSS["Tailwind CSS 3.4 (Theming & Contrast Safe)"]
            PrintEngine["A4 Print Engine (@media print Fidelity)"]
            StateMgmt["React Context & State Purge System"]
        end
    end

    subgraph SecurityGate ["2. SECURITY & AUTH GATEWAY"]
        AuthGuard["ProtectedRoute (Login-First Enforcement)"]
        SessionCache["Session Isolator (Anti-Cross-Session Leakage)"]
        SupabaseAuth["Supabase Auth (OAuth Google, GitHub & JWT)"]
    end

    subgraph BackendLayer ["3. BACKEND SERVERLESS & STORAGE (Supabase BaaS)"]
        EdgeFunctions["Supabase Edge Functions (Deno Runtime)"]
        PostgresDB[("PostgreSQL 15 Database")]
        StorageBucket["Supabase Storage (PDF Documents & Proof Assets)"]
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

    %% Luồng tương tác
    PublicZone --> AuthGuard
    AuthGuard --> WorkspaceZone
    WorkspaceZone --> CoreEngines
    CoreEngines --> StateMgmt
    StateMgmt --> SessionCache
    SessionCache --> SupabaseAuth

    WorkspaceZone -->|REST / Realtime SDK| EdgeFunctions
    WorkspaceZone -->|Client kết nối an toàn| PostgresDB
    WorkspaceZone -->|Tải lên / Xuất file| StorageBucket
    PostgresDB --- RLS

    WorkspaceZone <--> AIServiceLayer
    EdgeFunctions <--> AIServiceLayer
```

---

## 3. SƠ ĐỒ LUỒNG XÁC THỰC & PHÂN VÙNG DỮ LIỆU AN TOÀN (LOGIN-FIRST FLOW)

Khắc phục triệt để lỗi **BUG-03** (rò rỉ dữ liệu phiên khách) và **BUG-05** (mất bản thảo khi chưa đăng nhập):

```mermaid
sequenceDiagram
    autonumber
    actor User as Ứng Viên / Người Dùng
    participant UI as Giao Diện Web (SPA)
    participant Guard as Auth Guard (ProtectedRoute)
    participant Cache as Session Cache (Memory / Local)
    participant DB as Supabase Cloud (PostgreSQL 15 + RLS)

    User->>UI: Truy cập Trang chủ ProfileHub
    UI-->>User: Hiển thị Public Header (Chỉ hiện nút Đăng nhập / Đăng ký)
    
    alt Người dùng thao tác vào Workspace (/cv-builder, /dashboard)
        User->>UI: Bấm "Tạo CV Ngay" hoặc "Kho Đồ Án"
        UI->>Guard: Kiểm tra trạng thái Session hiện hành
        alt Chưa đăng nhập
            Guard-->>UI: Bật Modal Đăng Nhập / Đăng Ký (Google / GitHub)
            User->>Guard: Xác thực tài khoản thành công qua OAuth
            Guard->>Cache: Khởi tạo phân vùng riêng biệt `profilehub_user_cvs_{userId}`
            Guard-->>UI: Cấp JWT Session và điều hướng vào Không Gian Làm Việc
        else Đã đăng nhập
            Guard-->>UI: Cho phép truy cập ngay
        end
    end

    User->>UI: Thao tác soạn thảo nội dung trên Canvas
    UI->>Cache: Tự động lưu bản nháp theo `userId` (Auto-save an toàn)
    User->>UI: Bấm nút [Lưu CV]
    UI->>DB: Gửi truy vấn lưu CV gắn chặt chẽ với auth.uid()
    DB-->>UI: 200 OK + Phản hồi timestamp lưu thành công
    UI-->>User: Tắt sạch màn mờ, hiển thị trạng thái "Đã lưu đám mây an toàn"

    alt Người dùng Đăng Xuất (Logout)
        User->>UI: Bấm Đăng Xuất
        UI->>Cache: Purge sạch toàn bộ State & Cache người dùng
        UI->>DB: Thu hồi JWT Token
        UI-->>User: Chuyển hướng về Landing Page (Không còn lưu vết chéo tài khoản)
    end
```

---

## 4. SƠ ĐỒ KIẾN TRÚC BỘ MÁY IN ẤN & XUẤT PDF A4 CHUẨN ATS (PRINT ENGINE)

Khắc phục lỗi **BUG-09** (lệch lề, cắt ngang dòng chữ giữa 2 trang, mất màu nền khi in):

```mermaid
flowchart TD
    Trigger["Người dùng bấm [Xuất PDF] (hoặc nhấn Ctrl + P)"] --> CSSInject["Kích hoạt Engine @media print Chuyên Dụng"]
    
    subgraph IsolationRules ["1. Cô Lập Khung Giấy Chuẩn A4"]
        HideWeb["Ẩn 100% Giao Diện Ngoài:\nHeader, Footer, Toolbar, AI Copilot Panel\n(visibility: hidden)"]
        ShowA4["Chỉ Cho Phép Hiển Thị:\nKhung #cv-preview-a4 và các thẻ con\n(visibility: visible, position: absolute, top: 0, left: 0)"]
    end

    subgraph QualityControl ["2. Bảo Toàn Màu Sắc & Định Dạng"]
        ForceColor["Ép Buộc In 100% Màu Nền & Đường Kẻ:\n-webkit-print-color-adjust: exact !important;\nprint-color-adjust: exact !important;"]
        PageDim["Khóa Khổ Giấy Chuẩn A4 Quốc Tế:\nsize: A4 portrait; margin: 8mm 10mm;"]
    end

    subgraph AntiSplit ["3. Chống Rách Khối Nội Dung (Orphan Prevention)"]
        AvoidBreak["break-inside: avoid !important;\npage-break-inside: avoid !important;\nÁp dụng cho: .cv-section-block, .cv-item-block, li, tr"]
    end

    CSSInject --> IsolationRules
    IsolationRules --> QualityControl
    QualityControl --> AntiSplit
    AntiSplit --> BrowserPrint["Hộp Thoại In Trình Duyệt / Xuất File PDF Đạt Chuẩn Sắc Nét Từng Pixel"]
```

---

## 5. SƠ ĐỒ PHÂN RÃ CHỨC NĂNG HỆ THỐNG (FUNCTIONAL ARCHITECTURE BREAKDOWN)

Hệ thống được tổ chức thành 4 phân hệ chính, loại bỏ hoàn toàn các chức năng ngoài ngữ cảnh khỏi thanh soạn thảo:

```mermaid
flowchart LR
    subgraph ProfileHub ["HỆ THỐNG PROFILEHUB v1.0"]
        direction TB

        subgraph ModuleCV ["1. PHÂN HỆ CV STUDIO (ĐÃ KHẮC PHỤC)"]
            CV_Toolbar["Toolbar Tinh Gọn (Gom nút [🛡️ Chuẩn ATS: xx%])"]
            CV_Templates["6 Cấu Trúc Mẫu CV Thực Chất\n• Modern Top-Banner\n• Minimalist Harvard\n• Tech Terminal Bento\n• Timeline Milestone\n• Left Solid Sidebar\n• Compact 1-Page ATS"]
            CV_Copilot["🤖 Bảng AI Copilot (3 Tab)\n• Tab 1: Soi lỗi & Chuẩn ATS\n• Tab 2: Nâng cấp câu chữ định lượng\n• Tab 3: Gợi ý phỏng vấn đồ án"]
            CV_Budget["Page Budget Bar (Kiểm soát tràn trang A4)"]
            CV_Print["Engine In Ấn & Xuất PDF A4 Chuẩn In"]
        end

        subgraph ModuleProof ["2. PHÂN HỆ KHO ĐỒ ÁN (PROOF-OF-WORK)"]
            Proj_List["Quản Lý Đồ Án Kỹ Thuật & Mã Nguồn"]
            Proj_Verify["Quy Trình Gửi Duyệt Học Thuật Giảng Viên"]
            Proj_Badge["Cấp Mã Bảo Chứng Cryptographic Hash & Huy Hiệu 🛡️"]
            Proj_Showcase["Public Showcase & Mã Smart QR in lên CV"]
        end

        subgraph ModuleWarRoom ["3. PHÂN HỆ TRẠM TÁC CHIẾN (WAR ROOM)"]
            War_Salary["AI Salary Benchmark (Khảo sát dải lương P50-P85 & đòn bẩy đồ án)"]
            War_Interview["AI Mock Interviewer 4 Chặng Thích Ứng\n(1. Pitch ➔ 2. STAR Deep-Dive ➔ 3. Live Incident ➔ 4. Gap Defense)"]
            War_Calib["AI Level Calibration (Đôn cấp Up-Level / Xác nhận / Bồi dưỡng)"]
            War_Sync["Đồng Bộ Lịch Phỏng Vấn 2 Chiều với Nhà Tuyển Dụng"]
        end

        subgraph ModuleTracking ["4. PHÂN HỆ CV HEATMAP & ANALYTICS"]
            Track_Dwell["Đo Lường Thời Gian Đọc Trung Bình (Avg Dwell Time)"]
            Track_Heatmap["Bản Đồ Nhiệt Mức Độ Dừng Mắt Của NTD"]
            Track_Feed["Nhật Ký Xem Hồ Sơ Thời Gian Thực (Recruiter Live Feed)"]
        end
    end
```

---

## 6. SƠ ĐỒ HÀNH TRÌNH TRẢI NGHIỆM KHÉP KÍN CỦA ỨNG VIÊN (END-TO-END USER JOURNEY)

```mermaid
flowchart TD
    A["1. Đăng Nhập Hệ Thống (Login-First Workspace)"] --> B["2. Quản Lý Đồ Án Kỹ Thuật & Nhận Huy Hiệu Verified 🛡️"]
    B --> C["3. Mở Trình Soạn Thảo CV (/cv-builder)"]
    C --> D["4. Kích Hoạt AI Copilot:\nSoi Lỗi Chuẩn ATS & Viết Lại Câu Chữ Theo Google XYZ"]
    D --> E["5. Chọn 1 trong 6 Mẫu Layout Riêng Biệt & Khóa Page Budget A4"]
    E --> F["6. Xuất In PDF Chuẩn Xác Kèm Smart QR Link Tới Showcase Đồ Án"]
    F --> G["7. Theo Dõi Mức Độ Quan Tâm Của NTD Qua CV Heatmap Analytics"]
    G --> H["8. Vào Trạm Tác Chiến War Room Tại Dashboard:\nKhảo Sát Dải Lương & Luyện Phỏng Vấn Giả Lập 4 Chặng"]
    H --> I["9. Nhận Báo Cáo Radar 5 Trục Năng Lực & Tái Hiệu Chuẩn Cấp Bậc Offer"]
```

---

## 7. ĐẶC TẢ CHI TIẾT 6 MẪU CV BỐ CỤC THỰC CHẤT

Khắc phục lỗi **BUG-06** (quảng cáo 6 mẫu nhưng chỉ có 2 kiểu layout):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. MODERN TOP-BANNER         2. MINIMALIST HARVARD          3. TECH TERMINAL           │
│ ┌────────────────────────┐   ┌──────────────────────────┐   ┌────────────────────────┐ │
│ │████ TOP BANNER ████████│   │        HỌ VÀ TÊN         │   │ > developer_portfolio  │ │
│ ├───────────┬────────────┤   │ Email - Phone - GitHub   │   ├───────────┬────────────┤ │
│ │ Sidebar   │ Nội dung   │   ├──────────────────────────┤   │ [TAGS]    │ [BENTO]    │ │
│ │ (35%)     │ chính (65%)│   │ 1 Cột chuẩn ATS          │   │ TechStack │ GitCommit  │ │
│ └───────────┴────────────┘   └──────────────────────────┘   └───────────┴────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. TIMELINE MILESTONE        5. LEFT SOLID SIDEBAR          6. COMPACT 1-PAGE ATS      │
│ ┌────────────────────────┐   ┌────────────┬─────────────┐   ┌────────────────────────┐ │
│ │ HỌ TÊN & LIÊN HỆ       │   │██ NỀN TỐI █│ NỀN TRẮNG   │   │ HỌ TÊN - ROLE - LINK   │ │
│ ├──┬─────────────────────┤   │██ Cột trái█│ Kinh nghiệm │   ├───────────┬────────────┤ │
│ │●─│ 2024: Đồ án tốt nghiệp  │██ Kỹ năng  █│ Đồ án      │   │ Skill 50% │ Skill 50%  │ │
│ │●─│ 2023: Dự án thực tế │   │██ Liên hệ  █│ Học vấn     │   ├───────────┴────────────┤ │
│ └──┴─────────────────────┘   └────────────┴─────────────┘   │ 3 Đồ án vừa vặn 1 trang│ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Mẫu 1: Modern Top-Banner (TopCV Pro):** Khối Header màu đậm trải ngang toàn màn hình trên cùng, Avatar lớn bo tròn, thân chia 2 cột bất đối xứng (35% - 65%).
2. **Mẫu 2: Minimalist Harvard (Academic & Finance):** 1 cột thuần túy, font Serif (Lora), đường kẻ hairline 0.5px tinh tế, căn lề lùi đầu dòng chuẩn mực Ivy League.
3. **Mẫu 3: Tech Developer Terminal (IT Specialist):** Khối hiển thị Tech Stack dạng thẻ tag bo góc, hiển thị link GitHub/Commit rõ ràng, chia khối đồ án dạng Bento Grid nhỏ.
4. **Mẫu 4: Timeline Milestone (Trục thời gian dọc):** Có đường sinh kẻ dọc nối các năm học tập và làm việc bằng các chấm tròn (Milestone dots).
5. **Mẫu 5: Left Solid Sidebar (European Style):** Cột trái có màu nền đồng nhất từ đầu đến chân trang (xanh Navy/xám chì) chứa Liên hệ và Kỹ năng; cột phải nền trắng chứa Kinh nghiệm và Đồ án.
6. **Mẫu 6: Compact 1-Page ATS (Student & Fresher):** Tối ưu hóa padding/margin siêu gọn gàng, bố cục 2 cột cân xứng 50-50 ở phần kỹ năng, đảm bảo nhét vừa vặn 3 đồ án trong đúng 1 trang A4 duy nhất.

---

## 8. BẢNG ÁNH XẠ MODULE MÃ NGUỒN THỰC TẾ (SOURCE CODE MAPPING)

| Phân Hệ / Chức Năng | Tệp Giao Diện (UI Component) | Tệp Xử Lý Nghiệp Vụ (Service / Engine) | Kiểm Thử Tự Động (Vitest Suites) |
| :--- | :--- | :--- | :--- |
| **Login-First & Điều Hướng** | `src/components/layout/HeaderBar.tsx`<br>`src/components/layout/Sidebar.tsx` | `src/components/layout/headerNavigation.ts`<br>`src/context/AuthContext.tsx` | Đã kiểm thử phân quyền 2 trạng thái |
| **Soạn Thảo CV Canvas** | `src/pages/student/CVBuilder.tsx`<br>`src/components/cv/InteractiveCVCanvas.tsx` | `src/services/cvService.ts`<br>`src/services/pageBudgetService.ts` | `cvManagement.test.ts`<br>`pageBudgetService.test.ts` |
| **AI Copilot (STAR & ATS)** | `src/pages/student/CVBuilder.tsx` (Side Panel)<br>`src/components/cv/StarCvDiagnosticModal.tsx` | `src/services/starDiagnosticService.ts`<br>`src/services/cvQualityCheckService.ts` | `starDiagnosticService.test.ts`<br>`cvQualityCheckService.test.ts` |
| **Mắt Thần ATS Parser** | `src/components/cv/AtsParserEyeModal.tsx` | `src/services/atsParserEyeService.ts` | `atsParserEyeService.test.ts` |
| **Khảo Sát Lương JD** | `src/components/student/SalaryBenchmarkModal.tsx` | `src/services/salaryBenchmarkService.ts` | `salaryBenchmarkService.test.ts` |
| **Phỏng Vấn AI 4 Chặng** | `src/components/student/AiMockInterviewModal.tsx`<br>`src/components/student/InterviewWarRoomModal.tsx` | `src/services/aiMockInterviewService.ts`<br>`src/utils/pipelineSync.ts` | `aiMockInterviewService.test.ts` |
| **Heatmap & Analytics** | `src/components/student/CvHeatmapWidget.tsx` | `src/services/cvTrackingAnalyticsService.ts` | `cvTrackingAnalyticsService.test.ts` |
| **Proof-of-Work Showcase** | `src/pages/public/PublicShowcase.tsx`<br>`src/components/qr/BusinessCardModal.tsx` | `src/services/projectService.ts` | `evidenceShowcase.test.ts` |
| **6 Mẫu CV Templates** | `src/components/cv/CVTemplates.tsx` | `src/types/cv.ts` | Đã kiểm định in ấn A4 |

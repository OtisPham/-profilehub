# 🌐 TÀI LIỆU TỔNG HỢP TOÀN BỘ CÁC LUỒNG CHÍNH CỦA HỆ THỐNG PROFILEHUB
## Verified Academic & AI Career Ecosystem (Tài Liệu Đặc Tả Luồng Vận Hành Toàn Diện)

---

## 📑 MỤC LỤC
1. [Tổng Quan Kiến Trúc & 3 Tác Tử Hệ Thống](#1-tổng-quan-kiến-trúc--3-tác-tử-hệ-thống)
2. [LUỒNG 1: Quản Lý Đồ Án & Xác Thực Giảng Viên (Academic Verification & Integrity Gateway)](#2-luồng-1-quản-lý-đồ-án--xác-thực-giảng-viên)
3. [LUỒNG 2: AI CV Builder & Đối Soát Khớp CV-JD 4 Trụ Cột (Evidence-Based CV-JD Matching)](#3-luồng-2-ai-cv-builder--đối-soát-khớp-cv-jd-4-trụ-cột)
4. [LUỒNG 3: Nhà Tuyển Dụng Thông Minh & Đánh Giá Văn Hóa Dual-MBTI](#4-luồng-3-nhà-tuyển-dụng-thông-minh--đánh-giá-văn-hóa-dual-mbti)
5. [LUỒNG 4: Phòng Luyện Phỏng Vấn AI Thích Ứng 4 Chặng & Tái Hiệu Chuẩn Cấp Bậc](#5-luồng-4-phòng-luyện-phỏng-vấn-ai-thích-ứng-4-chặng--tái-hiệu-chuẩn-cấp-bậc)
6. [LUỒNG 5: Vòng Lặp Phản Hồi Tuyển Dụng & AI Đề Xuất Đồ Án Bổ Trợ](#6-luồng-5-vòng-lặp-phản-hồi-tuyển-dụng--ai-đề-xuất-đồ-án-bổ-trợ)
7. [Bảng Tổng Hợp Ma Trận Dữ Liệu & Điểm Chạm (Touchpoints)](#7-bảng-tổng-hợp-ma-trận-dữ-liệu--điểm-chạm)

---

## 1. TỔNG QUAN KIẾN TRÚC & 3 TÁC TỬ HỆ THỐNG

Hệ thống **ProfileHub** vận hành dựa trên tam giác liên kết giá trị giữa **Sinh viên**, **Giảng viên** và **Doanh nghiệp tuyển dụng**:

```mermaid
flowchart TD
    subgraph SinhVien ["👨‍🎓 1. SINH VIÊN (STUDENT)"]
        S_Proj["Quản lý Đồ án & Chứng chỉ"]
        S_CV["AI CV Builder (Xuất PDF A4)"]
        S_Match["Đối soát Matching CV-JD 4 Trụ Cột"]
        S_Mock["Phòng Luyện Phỏng Vấn AI 4 Chặng"]
        S_Level["Tái Hiệu Chuẩn Cấp Bậc & Lương Mới"]
        S_Reco["AI Gợi ý Đồ án Khắc phục Điểm mù"]
    end

    subgraph GiangVien ["👨‍🏫 2. GIẢNG VIÊN (TEACHER / VERIFIER)"]
        T_Inbox["Hộp Thư Tiếp Nhận Đồ Án"]
        T_Grade["Thẩm Định Mã Nguồn & Chấm Điểm"]
        T_Hash["Cấp Mã Bảo Chứng Cryptographic Hash"]
        T_Badge["Gắn Huy Hiệu Verified Badge 🛡️"]
    end

    subgraph DoanhNghiep ["🏢 3. NHÀ TUYỂN DỤNG (RECRUITER)"]
        R_Prompt["AI Sinh JD từ Prompt Tuyển Dụng"]
        R_Bulk["Nạp Hàng Loạt 100 CV (XLSX)"]
        R_Match["Thuật Toán Khớp Bằng Chứng 4 Trụ Cột"]
        R_MBTI["Đánh Giá Văn Hóa Dual-MBTI Fit"]
        R_Calib["Đề Xuất Offer Đôn Cấp (Up-Level)"]
        R_Kanban["Kanban Pipeline & Gửi Feedback Lỗ Hổng"]
    end

    S_Proj -->|"Nộp hồ sơ duyệt đồ án"| T_Inbox
    T_Badge -->|"Xác thực bảo chứng"| S_Proj
    T_Badge -->|"Cung cấp bằng chứng thực tế"| R_Match
    S_CV -->|"Ứng tuyển"| R_Bulk
    R_Calib -->|"Khuyến nghị gửi Offer"| S_Level
    R_Kanban -->|"Gửi phản hồi phỏng vấn & Blind spots"| S_Reco
```

---

## 2. LUỒNG 1: QUẢN LÝ ĐỒ ÁN & XÁC THỰC GIẢNG VIÊN (ACADEMIC VERIFICATION & INTEGRITY GATEWAY)

### 📌 Mục tiêu:
Biến các bài tập lớn/đồ án của sinh viên thành tài sản số được bảo chứng học thuật bởi Giảng viên đại học, loại bỏ hoàn toàn việc gian lận đồ án trong CV.

```mermaid
sequenceDiagram
    autonumber
    actor SV as Sinh Viên
    participant Sys as ProfileHub Platform
    participant DB as Supabase PostgreSQL
    actor GV as Giảng Viên
    actor NTD as Nhà Tuyển Dụng / Công Chúng

    SV->>Sys: Đăng tải Đồ án (Tiêu đề, Stack, Demo link, GitHub, File PDF minh chứng)
    SV->>Sys: Chọn Giảng viên hướng dẫn & bấm "🛡️ Gửi Duyệt Đồ Án"
    Sys->>DB: Lưu trạng thái `verification_status = 'pending'`, gán `teacher_email`
    Sys-->>GV: Đồ án xuất hiện tại `VerificationInbox.tsx` của Giảng viên
    GV->>Sys: Kiểm tra mã nguồn, chạy thử Demo & tài liệu PDF
    GV->>Sys: Nhập Điểm số (Score), Lời nhận xét & bấm "Phê Duyệt (Approve)"
    Sys->>Sys: Sinh mã xác thực `PH-VER-XXXXXX` & Chuỗi Hash mã hóa
    Sys->>DB: Cập nhật `is_verified = true`, lưu `verification_code`, `verification_hash`
    Sys-->>SV: Đồ án hiển thị huy hiệu `Verified Badge 🛡️` kèm nút Xuất Mã QR
    SV->>Sys: Tải ảnh QR Code (PNG) dán vào CV PDF
    NTD->>Sys: Quét QR hoặc truy cập `/verify/:verificationCode`
    Sys->>DB: Truy vấn dữ liệu công khai (Ẩn GPA, SĐT, Email riêng tư)
    Sys-->>NTD: Hiển thị chứng chỉ xác thực, con dấu Giảng viên & Điểm bảo chứng
```

---

## 3. LUỒNG 2: AI CV BUILDER & ĐỐI SOÁT KHỚP CV-JD 4 TRỤ CỘT (EVIDENCE-BASED MATCHING)

### 📌 Mục tiêu:
Giúp sinh viên tạo CV chuẩn ATS từ đồ án Verified và đối soát chính xác mức độ phù hợp với JD doanh nghiệp dựa trên **4 Trụ Cột Bằng Chứng (v6.1)**.

```mermaid
flowchart TD
    A["Sinh viên chọn Đồ Án Verified + Dán văn bản JD Tuyển Dụng"] --> B["AI CV Engine (aiCvService.ts)"]
    B --> C["1. Bóc tách Kỹ năng cốt lõi & Từ khóa trọng tâm JD"]
    B --> D["2. Tự động liên kết Đồ án Verified sát nhất với bài toán JD"]
    B --> E["3. Render bản xem trước A4 Live Preview (4 Mẫu Template)"]
    E --> F["4. Xuất file in PDF chuẩn ATS sắc nét (react-to-print)"]

    A --> G["EVIDENCE-BASED MATCHING ENGINE (v6.1)"]
    G --> H["Trụ cột 1: Kỹ Năng Yêu Cầu (Skill Fit - Trọng số 30%)"]
    G --> I["Trụ cột 2: Độ Sâu Bằng Chứng Đồ Án (Evidence Depth - Trọng số 40%)"]
    G --> J["Trụ cột 3: Chỉ Số Đo Lường Định Lượng (Impact Metrics - Trọng số 20%)"]
    G --> K["Trụ cột 4: Cấp Độ Kinh Nghiệm (Alignment - Trọng số 10%)"]

    H & I & J & K --> L{"Tính Tổng Điểm Matching (Match Score %)"}
    L -->|"Match Score >= 80% & Có Verified Project"| M["🟢 Trust Tier: VERIFIED_ELITE (Nhân hệ số x1.35)"]
    L -->|"Match Score 50% - 79%"| N["🔵 Standard Match (Đạt yêu cầu phỏng vấn)"]
    L -->|"Match Score < 50%"| O["🔴 CẢNH BÁO ĐỎ: Thiếu hụt kỹ năng nghiêm trọng"]
    L -->|"Phát hiện nhồi nhét từ khóa nhưng không có đồ án"| P["⚠️ CẢNH BÁO ANTI-KEYWORD STUFFING (Phạt điểm)"]
```

---

## 4. LUỒNG 3: NHÀ TUYỂN DỤNG THÔNG MINH & ĐÁNH GIÁ VĂN HÓA DUAL-MBTI

### 📌 Mục tiêu:
Hỗ trợ Nhà tuyển dụng sinh JD nhanh chóng, nạp hàng loạt 100 CV từ Excel và đánh giá toàn diện cả **Kỹ thuật thực chiến (85%)** lẫn **Văn hóa làm việc Dual-MBTI (15%)**.

```mermaid
sequenceDiagram
    autonumber
    actor HR as Nhà Tuyển Dụng (Recruiter)
    participant UI as AIRecruitmentAssistant
    participant Engine as AI Recruitment & MBTI Service
    participant Pipe as Kanban Pipeline

    HR->>UI: Nhập Prompt tuyển dụng ngắn gọn (ví dụ: "Tuyển Frontend React 1-2 năm")
    UI->>Engine: Gọi `parseHiringPrompt` & `generateJobDescription`
    Engine-->>UI: Tự động sinh JD đầy đủ (Mô tả, Trách nhiệm, Yêu cầu, Must-have skills)
    HR->>UI: Bấm "Nạp 100 CV (XLSX)" và chọn file `Mau_100_CV_ProfileHub.xlsx`
    UI->>Engine: Phân tích hàng loạt hồ sơ, tính điểm 4 Trụ Cột Kỹ Thuật (85%)
    UI->>Engine: Nhận diện Role MBTI lý tưởng & So sánh với MBTI Ứng viên (Dual-MBTI Model 2)
    Engine-->>UI: Xuất bảng danh sách ứng viên xếp hạng theo Overall Score %
    HR->>UI: Bấm xem chi tiết (Inspect Candidate)
    UI-->>HR: Hiển thị Thẻ Thấu Cảm MBTI (4 Chiều E/I, S/N, T/F, J/P, Ma trận xung đột & Mẹo quản lý)
    UI-->>HR: Hiển thị Đề Xuất Chiến Lược Offer: UP-LEVEL CANDIDATE (Fast-Track)
    HR->>Pipe: Kéo thả ứng viên qua các cột: Discovered ➔ Shortlisted ➔ Interview ➔ Hired
    HR->>UI: Nhập Feedback & Điểm mù sau phỏng vấn gửi phản hồi cho Sinh viên
```

---

## 5. LUỒNG 4: PHÒNG LUYỆN PHỎNG VẤN AI THÍCH ỨNG 4 CHẶNG & TÁI HIỆU CHUẨN CẤP BẬC

### 📌 Mục tiêu:
Mô phỏng chân thực buổi Tech Interview 45 phút của các tập đoàn công nghệ; loại bỏ câu hỏi lý thuyết sách vở; hỏi xoáy vào quyết định kiến trúc, xử lý khủng hoảng live crash và tái định giá cấp bậc ứng viên.

```mermaid
flowchart TD
    Start["Sinh viên chọn: Đồ Án Verified + JD Mục Tiêu + Cấp Bậc CV (Intern/Fresher/Junior/Mid)"] --> Gen["AI ENGINE SINH 4 CHẶNG THÍCH ỨNG (Framework v2.0)"]

    Gen --> S1["🟢 CHẶNG 1: KHỞI ĐỘNG & ĐỊNH VỊ NĂNG LỰC\n• Trình bày Elevator Pitch 60–90s\n• Gắn kết Core Stack với bài toán JD"]
    S1 --> S2["🔵 CHẶNG 2: ĐÀO SÂU ĐỒ ÁN & QUYẾT ĐỊNH KIẾN TRÚC\n• Phân tích Trade-offs (Ưu/Nhược điểm khi chọn giải pháp)\n• Bóc tách số liệu đo lường hiệu năng thực tế"]
    S2 --> S3["🟠 CHẶNG 3: GIẢ LẬP SỰ CỐ & KHỦNG HOẢNG HỆ THỐNG\n• Tình huống sập server giờ cao điểm: HTTP 504 Timeout, CPU 99%\n• 3 bước cô lập lỗi, giảm thiểu thiệt hại và quy trình Rollback an toàn"]
    S3 --> S4["🟣 CHẶNG 4: BÀO CHỮA LỖ HỔNG KỸ NĂNG SO VỚI JD\n• Đối mặt với kỹ năng JD yêu cầu mà CV còn thiếu\n• Thể hiện Transferable Skills & Kế hoạch tự học 14 ngày"]

    S1 & S2 & S3 & S4 --> Probe{"Ứng viên trả lời mơ hồ hoặc thiếu số liệu?"}
    Probe -->|"CÓ"| Probing["🎯 AI HỎI XOÁY THÁCH THỨC (Follow-up Probing)\n(Yêu cầu làm rõ cơ chế kỹ thuật bên dưới, phản xạ tốt +10đ)"]
    Probe -->|"KHÔNG"| StarEval["ĐÁNH GIÁ CẤU TRÚC STAR (Situation, Action, Result)"]
    Probing --> StarEval

    StarEval --> Radar["XUẤT BÁO CÁO RADAR 5 TRỤC NĂNG LỰC:\n1. Core Tech • 2. Project Grounding • 3. Crisis Incident\n4. STAR Communication • 5. Growth Mindset"]

    Radar --> LevelEngine{"CƠ CHẾ TÁI HIỆU CHUẨN CẤP BẬC (AI LEVEL CALIBRATION)"}
    LevelEngine -->|"Điểm phỏng vấn >= 85% & Kiến trúc/Sự cố xuất sắc"| Up["🚀 UP-LEVEL PROMOTION (Đôn Cấp)\nVí dụ: Fresher ➔ Junior (+35% Lương đề xuất)"]
    LevelEngine -->|"Điểm 70% - 84% & Khớp chuẩn"| Confirmed["✅ LEVEL CONFIRMED (Đúng Cấp)\nGiữ nguyên level mục tiêu"]
    LevelEngine -->|"Điểm 50% - 69% & Lúng túng sự cố"| Down["🛡️ SAFE DOWN-LEVEL & NURTURING\nTuyển Fresher/Intern có Senior kèm cặp 3 tháng"]

    Up & Confirmed & Down --> CalibCard["Xuất Thẻ AI Level Calibration Card\n(Kèm Dải lương thị trường mới & Gợi ý chiến lược Offer cho HR)"]
```

---

## 6. LUỒNG 5: VÒNG LẶP PHẢN HỒI TUYỂN DỤNG & AI ĐỀ XUẤT ĐỒ ÁN BỔ TRỢ (FEEDBACK LOOP & REMEDIAL RECOMMENDER)

### 📌 Mục tiêu:
Biến các đánh giá từ chối hoặc góp ý của Nhà tuyển dụng thành lộ trình học tập cụ thể, tự động gợi ý đồ án thực chiến để bù đắp điểm mù (Knowledge Blind Spots).

```mermaid
flowchart TD
    A["Nhà tuyển dụng phỏng vấn & nhập Feedback"] --> B["Hệ thống lưu trữ Technical Score, Soft Score & Thẻ Blind Spots"]
    B --> C["AI Feedback Analyzer (feedbackService.ts)"]
    C --> D["Tổng hợp Báo Cáo Điểm Mù Toàn Diện Của Sinh Viên"]
    D --> E["AI Project Recommender Widget (AIProjectRecommenderWidget.tsx)"]
    E --> F["Gợi ý Đề tài Đồ án Mới sát với Điểm mù kiến thức"]
    F --> G["Chi tiết Tech Stack, Cấu trúc Module & User Stories"]
    G --> H["1-Click Xuất File Tài Liệu README-spec.md Chuẩn GitHub"]
    H --> I["Sinh viên tải file về ➔ Thực hiện đồ án mới ➔ Nộp Giảng viên duyệt lại vòng mới"]
```

---

## 7. BẢNG TỔNG HỢP MA TRẬN DỮ LIỆU & ĐIỂM CHẠM (TOUCHPOINTS)

| Luồng Nghiệp Vụ | Tác Tử Chính | Input Đầu Vào | Xử Lý Trọng Tâm (Processing Engine) | Output Đầu Ra (Deliverables) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Xác Thực Đồ Án** | Sinh viên, Giảng viên | Mã nguồn GitHub, Demo URL, File PDF môn học | Kiểm định mã nguồn, sinh mã `PH-VER-XXXXXX` & chuỗi băm Cryptographic Hash | Huy hiệu `Verified Badge 🛡️`, Link xác thực công khai, Ảnh QR Code |
| **2. AI CV & Matching** | Sinh viên | Đồ án Verified, Văn bản JD tuyển dụng | Thuật toán 4 Trụ Cột v6.1 (Kỹ năng 30%, Bằng chứng 40%, Chỉ số 20%, Cấp độ 10%) | CV PDF chuẩn in A4, Điểm Match %, Cảnh báo đỏ $<50\%$, Cảnh báo Anti-Stuffing |
| **3. AI Tuyển Dụng & MBTI** | Nhà tuyển dụng | Prompt tuyển dụng, File 100 CV Excel (XLSX) | Parse JD tự động, Chấm điểm Matching hàng loạt, Đối sánh Dual-MBTI Model 2 | Bảng xếp hạng ứng viên, Thẻ Thấu Cảm MBTI 4 tab, Đề xuất chiến lược Up-Level |
| **4. Phỏng Vấn & Leveling** | Sinh viên, AI Engine | Đồ án Verified, JD mục tiêu, Cấp bậc CV ban đầu | Luyện phỏng vấn 4 chặng, AI Hỏi Xoáy, Chấm điểm STAR, Radar 5 trục, Tái hiệu chuẩn cấp bậc | Báo cáo Phỏng vấn 5 trục Radar, Thẻ Đôn/Hạ cấp bậc (Leveling Card), Dải lương mới |
| **5. Feedback & Gợi Ý Đồ Án** | Sinh viên, Nhà tuyển dụng | Nhận xét phỏng vấn, Điểm mù (Blind Spots) | Tổng hợp lỗ hổng kiến thức, phân tích khoảng cách kỹ năng so với thị trường | Lộ trình tự học khắc phục, Đồ án đề xuất, File `README-spec.md` tải về |

---

> 💡 **Kết luận:** Hệ thống **ProfileHub** tạo ra một hệ sinh thái khép kín: **Học tập $\rightarrow$ Xác thực đồ án $\rightarrow$ Xuất CV $\rightarrow$ Luyện phỏng vấn thích ứng $\rightarrow$ Tái hiệu chuẩn cấp bậc $\rightarrow$ Kết nối tuyển dụng $\rightarrow$ Nhận phản hồi & Tiếp tục phát triển đồ án mới**.

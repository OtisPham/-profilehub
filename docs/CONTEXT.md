# Context: ProfileHub Core Domain

## Glossary

### Verification Gateway
An unauthenticated public route (`/verify/:verificationCode`) allowing external viewers (e.g. recruiters, external partners) to instantly verify an academic project's authenticity without logging in.

### Verification Badge 🛡️
A certified status (`verified`) stamped on a project when a verified Lecturer (`teacher`) approves the student's submission request with feedback.

### Public Verified Record
The public-facing, privacy-scoped summary rendered on the Verification Gateway.
- **Included (Public):** Student Full Name, University/Faculty, Verifying Lecturer Name & Title, Project Title & Abstract, Tech Stack, Verification Timestamp, Cryptographic Verification Hash, Public Document Preview & Demo Link.
- **Excluded (Private / Protected):** Student GPA, Phone Number, Personal Email, and Recruiter Interview Feedback & Knowledge Blind Spots.

### Knowledge Blind Spot (Điểm mù kiến thức)
Lỗ hổng kiến thức hoặc kỹ năng thực hành do Nhà tuyển dụng đánh giá và gửi về qua luồng phản hồi phỏng vấn (Recruiter Feedback Loop) hoặc do AI phân tích từ bài phỏng vấn thử.

### AI Project Recommendation
Đề xuất đề tài đồ án thực hành cá nhân hóa do AI khởi tạo nhằm giúp sinh viên khắc phục đúng Điểm mù kiến thức. 

### Project Spec Markdown Export (.md)
Bản tài liệu mô tả đồ án gợi ý được tự động đóng gói dưới dạng file Markdown (`.md`).
- **Luồng hành động (Action Flow):** Sinh viên bấm nút **"Tải File Spec (.md)"** để tải file `README-spec.md` về máy, đính kèm vào Repository GitHub hoặc công cụ cá nhân.
- **Quy trình tiếp theo:** Khi sinh viên hoàn thành đồ án, sinh viên sẽ đăng tải đồ án lên ProfileHub theo luồng Upload Đồ Án tiêu chuẩn hiện có để gửi Giảng viên duyệt xác thực (**Verified Badge 🛡️**). Không tự động khởi tạo draft project.

### Lecturer Verification Inbox & Batch Actions
Hệ thống xử lý phê duyệt đồ án cho Giảng viên tại `/teacher/inbox`:
- **Bộ lọc & Tìm kiếm đa năng:** Cho phép tìm kiếm theo Tên sinh viên, Email, Tên đồ án, Công nghệ/Tags; Lọc theo Loại đồ án (`project_type`).
- **Tác vụ duyệt hàng loạt (Batch Approve / Reject - 1-Click):**
  - Tích chọn nhiều đồ án cùng lúc (Select All / Single Select).
  - **Duyệt nhanh hàng loạt (Batch Approve):** 1-click cập nhật ngay lập tức tất cả đồ án đã chọn sang `verified`, gán nhận xét mặc định *"Đã xác thực đồ án bởi Giảng viên"*, tự động tạo mã xác thực `verification_code` & `verification_hash`.
  - **Từ chối hàng loạt (Batch Reject):** 1-click chuyển trạng thái sang `rejected` kèm nhận xét *"Cần bổ sung và chỉnh sửa thêm nội dung đồ án"*.
- **Phím tắt Mẫu nhận xét nhanh (Quick Feedback Preset Chips & Custom Presets):** Bổ sung hàng nút gợi ý mẫu nhận xét nhanh ngay phía trên khung nhập nhận xét (Modal Chấm điểm & Phê duyệt). Cho phép Giảng viên:
  - 1-click chèn các mẫu mặc định (*"Đạt yêu cầu xác thực", "Hoàn thành xuất sắc", "Cần bổ sung README", "Cần cải thiện UI/UX"*).
  - **Tự khởi tạo & Quản lý mẫu cá nhân (+ Thêm mẫu mới):** Giảng viên có thể tự nhập thêm các câu nhận xét hay dùng của riêng mình để lưu lại (lưu theo bộ nhớ `localStorage` cá nhân) và xóa mẫu tùy chỉnh khi không sử dụng.

### Global Responsive Design Specifications (Màn hình Linh hoạt)
- **Quy tắc Breakpoints**:
  - **Desktop (>= 1024px)**: Sidebar mở cố định bên trái (`240px`), bố cục 2–3 cột tiêu chuẩn.
  - **Mobile & Tablet (< 1024px và nhỏ hơn 360px)**: Ẩn Sidebar cố định, thay bằng **Header Bar cố định trên cùng** có **Nút Menu 3 gạch (☰ Hamburger)**. Khi bấm nút 3 gạch, Sidebar mở ra dạng trượt Sidebar Drawer Overlay (chiếm 80%-85% chiều rộng màn hình).
- **Quy tắc Single-column Stack trên Màn hình nhỏ (< 768px & < 360px)**:
  - Tự động chuyển tất cả các Grid / Flex Layout thành **1 cột dọc duy nhất**.
  - Giảm padding lề trang từ `30px` xuống `12px–16px` để tối ưu không gian hiển thị.
  - Các ô tìm kiếm, dropdown bộ lọc, card đồ án, nút bấm tác vụ tự động co giãn 100% chiều rộng (`width: 100%`) không gây vỡ giao diện.

### Full Project Showcase & GitHub Code Tree Inspector (Bộ Đồ Án Hoàn Chỉnh)
- **Trọn bộ 4 Link Tài Nguyên Đồ Án (`Multi-Link Showcase Bar`)**:
  - `github_url`: Mã nguồn dự án (GitHub Repository URL).
  - `demo_url`: Bản Web Live Demo trực quan.
  - `figma_url`: Bản thiết kế UI/UX trên Figma.
  - `doc_url`: Tài liệu Báo cáo / Đặc tả đồ án Spec (.md / PDF).
- **Trình Đọc Cây Thư Mục GitHub (`GitHub Repo Tree & VS Code Inspector`)**:
  - Tự động kết nối GitHub REST API để lấy danh sách cây thư mục (File Tree Explorer) từ repository công khai.
  - Tích hợp thanh Sidebar duyệt file VS Code ngay trong Modal.
  - Cho phép Nhà tuyển dụng & Giảng viên bấm đọc mã nguồn từng file (`.tsx`, `.ts`, `.css`, `.json`, `.md`) với giao diện tô màu cú pháp chuẩn VS Code Dark+ Theme trực tiếp trên ProfileHub.
- **Phạm vi hiển thị đồng bộ**: Tích hợp trên Sinh viên (`MyProjects`), Giảng viên (`VerificationInbox`), Nhà tuyển dụng (`CandidateSearch`) và Cổng Xác thực Công khai (`PublicVerificationView`).

### AI Mock Interview & Knowledge Blind Spot Engine (AI Phỏng Vấn Giả Lập & Phân Tích Điểm Mù Kiến Thức)
- **Giao diện & Trải nghiệm Phỏng vấn (Real-time Adaptive Chat)**:
  - Phỏng vấn hội thoại từng câu tương tác trực tiếp: AI hỏi -> Sinh viên nhập câu trả lời text (kèm code snippet) -> AI phân tích thích ứng và đưa ra câu hỏi tiếp theo.
  - Mỗi phiên kéo dài 5–7 câu hỏi với thanh Progress Bar (`Câu X/5`). Sinh viên có thể bấm **"Kết thúc & Phân tích ngay"** bất kỳ lúc nào.
- **Cấu hình Chủ đề (Topic & Level Setup)**:
  - Tự động gợi ý chủ đề dựa trên Tech Stack trong Hồ sơ/Đồ án sinh viên.
  - Cho phép chọn vị trí (Frontend/Backend/Fullstack...), Cấp độ (Intern/Fresher/Junior) hoặc dán Job Description (JD) bất kỳ để phỏng vấn sát thực tế.
- **Báo cáo Phân tích Điểm mù Kiến thức (Blind Spot Report)**:
  - **Phần 1**: Điểm số tổng quan (0–100) + Nhận xét năng lực phỏng vấn.
  - **Phần 2**: Ma trận Điểm mù (Danh sách kiến thức hổng + Mức độ nghiêm trọng + Giải thích nguyên nhân).
  - **Phần 3**: Nút 1-Click **"Tạo Spec Đồ Án Khắc Phục (.md)"** kết nối trực tiếp tới luồng `AI Project Recommendation`.
- **Lịch sử Phỏng vấn & Tua lại (Interview History & Replay Log)**:
  - Quản lý danh sách các phiên phỏng vấn đã thực hiện tại `/student/mock-interviews`.
  - Cho phép chọn lại bất kỳ phiên nào để xem lại (Replay) toàn bộ đối thoại chat và báo cáo điểm mù chi tiết.
  - Bảo mật riêng tư cá nhân (Student-only).
- **Kiến trúc Dữ liệu (Supabase Payload)**:
  - Lưu gộp JSON trong 1 bảng `mock_interviews` chứa thông tin session metadata, `messages` (JSONB payload) và `report` (JSONB payload).
- **Tích hợp LLM API**: Tích hợp trực tiếp Gemini API; báo lỗi UI rõ ràng nếu thiếu hoặc hỏng API Key.

### Recruiter Interview Scheduling & Executive Dashboard (Quản Lý & Hiển Thị Lịch Phỏng Vấn Nhà Tuyển Dụng)
- **Modal Lên Lịch Phỏng Vấn & Quản Lý Lịch (`CandidatePipeline.tsx`)**:
  - Cho phép Nhà tuyển dụng bấm nút **"Hẹn Lịch"** trên ứng viên ở bất kỳ giai đoạn nào hoặc khi chuyển ứng viên sang cột **Phỏng vấn**.
  - Nhập đầy đủ thông tin: Ngày phỏng vấn (`interview_date`), Giờ phỏng vấn (`interview_time`), Hình thức / Địa điểm (`interview_location`), Link họp trực tuyến Google Meet/Zoom (`meeting_link`).
  - Thẻ ứng viên hiển thị Badge nổi bật thông tin lịch hẹn kèm nút 1-click **"Vào cuộc họp (Meet)"** và nút **"🗑️ Xóa / Hủy Lịch"**.
- **Widget Lịch Phỏng Vấn & Component Lịch Tháng Nhỏ (`RecruiterDashboard.tsx`)**:
  - Hiển thị trực quan danh sách các buổi phỏng vấn sắp tới (Upcoming Interviews) kết hợp **Component Lịch Tháng Nhỏ (Mini Monthly Calendar)** ngay tại Executive Dashboard (`/recruiter/profile` hoặc `/dashboard`).
  - Tự động đánh dấu (dot badge) các ngày có lịch hẹn trên Lịch tháng. Khi bấm chọn 1 ngày, danh sách phỏng vấn sẽ tự động lọc hiển thị các cuộc hẹn trong ngày đó (kèm nút Hủy lọc nhanh).
  - Cho phép Nhà tuyển dụng bấm **"Vào Meet"**, bấm **"Feedback"** gửi nhận xét, hoặc bấm nút **"Trash / Xóa"** để hủy cuộc hẹn.
- **Trung Tâm Thông Báo Lịch Phỏng Vấn Dành Cho Sinh Viên (`MainLayout.tsx` & `Dashboard.tsx`)**:
  - **Banner Thông Báo Lịch Phỏng Vấn trên Student Dashboard (`Dashboard.tsx`)**: Hiển thị nổi bật khối thông báo lịch hẹn từ Nhà tuyển dụng đối tác gồm Tên Công ty, Vị trí ứng tuyển, Thời gian phỏng vấn, Địa điểm/Hình thức họp, Nút 1-click **"Tham gia Meet"** và nút **"Xác nhận tham gia"**.
  - **Chuông Thông Báo trên Header Tong (`MainLayout.tsx`)**: Biểu tượng chuông kèm Badge đỏ thông báo số lượng lịch phỏng vấn mới chưa đọc. Cho phép bấm mở Dropdown danh sách thông báo để xem chi tiết và xác nhận tham gia trực tiếp trên tất cả các trang của Sinh viên.








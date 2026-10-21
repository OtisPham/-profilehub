# Context: ProfileHub Core Domain

## Glossary

### Master Project (Dự án gốc)
Bản ghi dự án chuẩn lưu trữ trong kho Hồ sơ cá nhân của ứng viên (`projects` library), đóng vai trò là nguồn dữ liệu gốc duy nhất để tái sử dụng trên nhiều bản CV.

### CV Project Instance (Bản thể hiện dự án trên CV)
Phiên bản dự án được chọn lọc, tùy biến câu từ và cấu trúc cho một bản CV cụ thể. Bản ghi này độc lập với Master Project, không tự ý làm thay đổi Master Project trừ khi có hành động Reverse Sync.

### Reverse Sync (Đồng bộ ngược)
Hành động có chủ đích của người dùng cho phép lưu một dự án mới hoặc phiên bản dự án đã tinh chỉnh trên CV ngược về kho Master Projects trong hồ sơ gốc.

### Project Fit Explainer (Bảng giải trình độ khớp dự án)
Bảng đối chiếu minh bạch hiển thị điểm tương thích (%) giữa từng Master Project với JD, kèm căn cứ đối chiếu cụ thể (các công nghệ trùng khớp và kỹ năng còn thiếu), cho phép ứng viên chủ động duyệt hoặc thay đổi danh sách dự án trước khi đưa vào CV.

### STAR Project Adaptation (Tối ưu mô tả dự án theo STAR)
Quy trình AI cấu trúc lại mô tả dự án thành các câu hành động kỹ thuật có số liệu định lượng (Tình huống $\to$ Nhiệm vụ $\to$ Giải pháp $\to$ Kết quả), tích hợp từ khóa công nghệ của JD nhưng tuyệt đối không suy diễn sai lệch khỏi dữ liệu gốc.

### Project Diff Review (Duyệt so sánh mô tả dự án)
Giao diện hiển thị song song giữa câu văn gốc của ứng viên và câu văn do AI đề xuất, cho phép phê duyệt, từ chối hoặc tinh chỉnh theo từng gạch đầu dòng (bullet point).

### Anti-Hallucination Guard (Rào chắn chống bịa đặt năng lực)
Quy tắc bảo mật nội dung bắt buộc: AI không được tự ý thêm kỹ năng hoặc công nghệ mà ứng viên chưa từng khai báo trong hồ sơ; nếu đề xuất thêm số liệu chưa có trong mô tả gốc, hệ thống phải yêu cầu ứng viên kiểm chứng và xác nhận trước khi đưa vào CV.

### Interactive Evidence Pill (Huy hiệu minh chứng tương tác)
Thành phần giao diện nhỏ gọn trên bản CV kỹ thuật số (PDF/Web) chứa liên kết trực tiếp (Hyperlink chuẩn ATS) dẫn tới Live Demo hoặc GitHub Repository mà không làm tốn diện tích hay vỡ cấu trúc văn bản.

### Project Quick-Verify QR (Mã QR kiểm chứng nhanh dự án)
Mã QR thu nhỏ được tích hợp tinh tế bên cạnh dự án trên bản in A4, cho phép Nhà tuyển dụng dùng camera điện thoại quét và trải nghiệm ngay bản demo thực tế của dự án.

### Page-Budget Guard (Trợ lý kiểm soát dung lượng trang A4)
Thanh công cụ giám sát chiều cao và tỷ lệ lấp đầy trang A4 theo thời gian thực (0–100%), cảnh báo khi vượt ngưỡng trang và cung cấp các hành động 1-click để cô đọng từ ngữ hoặc thu gọn khoảng cách dòng (`spacingDensity: compact`).

### Adaptive Layout Switcher (Bộ chuyển đổi bố cục thích ứng)
Tính năng cho phép ứng viên tự do luân chuyển giữa bố cục 1 cột truyền thống (tối ưu tính tuần tự cho ATS) và bố cục 2 cột (phân tách nội dung) theo sở thích cá nhân, tuyệt đối không áp đặt hay ép buộc cứng một loại giao diện.

### Scoped Contribution (Phân tầng đóng góp dự án)
Cấu trúc trình bày dự án bóc tách thành 2 tầng: Bối cảnh quy mô tổng thể của sản phẩm (System Scope) và Các gạch đầu dòng trách nhiệm kỹ thuật cụ thể do chính ứng viên trực tiếp đảm nhiệm (Individual Ownership), phân định rõ giữa đồ án cá nhân và đồ án nhóm để tránh nhầm lẫn khi phỏng vấn chuyên sâu.

### Cold-Start Project Onboarding (Trợ lý khởi tạo dự án bước đầu)
Cơ chế hỗ trợ kích hoạt khi ứng viên chưa có bất kỳ dự án nào trong kho, cung cấp 2 giải pháp khởi động nhanh: Kết nối quét Repository từ GitHub hoặc cung cấp các Khung dự án tiêu chuẩn theo chuyên ngành (Industry Starter Templates) để ứng viên có ngay dự án chuẩn mực đầu tiên trên CV.

### Non-blocking Sync Toast (Thông báo đồng bộ không gián đoạn)
Thành phần thông báo trượt nhẹ nhàng ở góc màn hình xuất hiện sau khi lưu CV, thông báo sự hiện diện của dự án mới và cung cấp nút 1-click để đồng bộ về Master Projects mà không chặn luồng soạn thảo của người dùng.

### Explicit Opt-Out Respect (Tôn trọng quyết định từ chối)
Quy tắc trải nghiệm cốt lõi: khi người dùng chủ động gạt tắt công tắc đồng bộ dự án trong form nhập, hệ thống tin tưởng tuyệt đối ý định đó và không bao giờ bật thông báo hay hỏi lại lúc lưu CV.

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
### Contextual Application Pitch (Thư ứng tuyển theo ngữ cảnh JD)
Văn bản thuyết trình ứng tuyển ngắn gọn (dưới 250 từ) được tạo tự động từ sự kết hợp giữa Job Description (JD) và một bản CV Project Instance cụ thể, đóng vai trò giải trình nhanh lý do ứng viên phù hợp với vị trí dựa trên các minh chứng thực tế trong hồ sơ.
- **Cấu trúc 3 phần (Evidence-First 3-Part Pitch)**:
  1. _Hook & Alignment_: Vị trí ứng tuyển + 2-3 công nghệ cốt lõi trùng khớp với JD.
  2. _Project Evidence Spotlight_: 1-2 đồ án trọng tâm từ bản CV đang mở, giải thích bài toán kỹ thuật đã giải quyết và đính kèm hyperlink Demo/Repo.
  3. _Technical Call to Action_: Sẵn sàng trao đổi sâu hơn về các quyết định kiến trúc trong buổi phỏng vấn.
- **Điểm chạm kích hoạt (Delivery Mechanism)**:
  - Tích hợp tại thanh công cụ xuất bản của `CVBuilder.tsx` cạnh nút xuất PDF (`Application Pitch Drawer / Modal`).
  - Cung cấp tính năng xem trước, chỉnh sửa trực tiếp (inline edit), nút **1-Click Copy** (để dán nhanh vào email hoặc ô ghi chú ứng tuyển) và tùy chọn xuất file `.pdf` / `.txt` độc lập, bảo toàn nguyên tắc 1 trang A4 của `Page-Budget Guard` trên file CV chính.
- **Lưu trữ & Bền vững dữ liệu (Persistence Model)**:
  - Nhúng trực tiếp như một trường tùy chọn (`applicationPitch?: string`, `targetJdText?: string`) trong cấu trúc `SavedCVData` của bản CV đó.
  - Không tạo bảng mới trong CSDL Supabase; đồng bộ tự nhiên qua Supabase JSON column và LocalStorage fallback; mỗi bản CV điều chỉnh cho 1 JD sẽ tự động lưu giữ đúng bản Pitch Letter tương ứng của nó.
- **Xử lý Biên & Rào chắn (Edge Cases & Fallback Guard)**:
  - _Yêu cầu đầu vào bắt buộc_: Phải có Job Description (JD) và CV phải chứa tối thiểu 1 đồ án (`ProjectItem`). Nếu thiếu một trong hai, hệ thống chặn kích hoạt tính năng viết thư và hiển thị hộp hướng dẫn (Guidance Alert) kèm nút dán JD hoặc chọn đồ án.
  - _Cơ chế Fallback khi ngắt kết nối AI_: Khi mất mạng hoặc vượt hạn ngạch API, hệ thống kích hoạt Khuôn mẫu Kỹ thuật Xác định (Deterministic Technical Scaffold) tự động điền sẵn các biến nội suy từ CV (`role`, `tech_stack`, `project_title`, `demo_link`) để ứng viên không bị gián đoạn quy trình ứng tuyển.
- _Tránh dùng (Avoid)_: Standalone Cover Letter, General Motivation Letter, Thư xin việc chung chung (tự do không gắn với JD/CV cụ thể).

### Project Technical Defense Briefing (Bản Lĩnh Phòng Thủ Đồ Án)
Bộ công cụ huấn luyện kỹ thuật chuyên sâu được kích hoạt trực tiếp từ từng đồ án trên CV, chuẩn bị cho ứng viên vượt qua các vòng phỏng vấn kỹ thuật khắt khe của Tech Lead:
- **Top 3 Câu hỏi bẫy (Trap Questions)**: Bóc tách rủi ro kiến trúc theo từng công nghệ cụ thể (Redis Cache Invalidation, PostgreSQL EXPLAIN & Indexing, React Re-render, Node.js Event Loop bottleneck).
- **Bản giải trình Trade-offs**: Luận điểm kỹ thuật lý giải vì sao chọn công nghệ này thay vì công nghệ khác (ví dụ: PostgreSQL vs MongoDB, Docker vs Bare Metal).
- **Kịch bản gỡ lỗi (Debugging Incident Scaffold)**: Cấu trúc 4 pha (Tình huống $\to$ Nguyên nhân gốc rễ $\to$ Giải pháp $\to$ Bài học rút ra) giúp ứng viên kể lại con bug khó nhất một cách chuyên nghiệp.
- **Điểm hạn chế cần thừa nhận (Senior Humility)**: Những lỗ hổng kỹ thuật ứng viên nên chủ động thừa nhận trước khi bị người phỏng vấn vặn vẹo.
- _Tránh dùng (Avoid)_: Mock Interview chung chung dạng câu hỏi sách giáo khoa, Trắc nghiệm lý thuyết không gắn với đồ án thực tế.




# Hướng Dẫn Nghiệm Thu Nhanh: Smart Job Studio & Candidate Match Engine (Quickstart)
> **Mã tài liệu:** `QUICKSTART-20261105-SMART-JOB-STUDIO`  
> **Tính năng:** Smart Job Studio, Standardized Job Posting, Automated Skill Tagging & Instant Candidate Matching  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Môi Trường & Điều Kiện Tiên Quyết

* Node.js $\ge 18.0.0$, npm $\ge 9.0.0$.
* Trình duyệt Google Chrome / Edge phiên bản mới.
* Nhánh hiện tại: `profilehub_v1`.

---

## 2. Kịch Bản Nghiệm Thu 1: Kiểm Thử Đơn Vị Tự Động (Automated Unit Tests)

Chạy bộ kiểm thử tự động của dịch vụ `jobStudioService`:

```powershell
npx vitest run src/services/jobStudioService.test.ts
```

### Các tiêu chí kiểm thử bắt buộc (Pass 100%):
1. **Trích xuất kỹ năng chính xác:**
   - JD chứa `React, typescript, node.js, docker, postgresql, figma` $\to$ bóc tách thành công đủ 6 kỹ năng dạng canonical: `['ReactJS', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Figma']`.
   - JD chứa từ lóng/viết tắt: `k8s, golang, tailwind` $\to$ chuẩn hóa thành `['Kubernetes', 'Golang', 'Tailwind CSS']`.
   - Không bị nhận nhầm các từ tiếng Anh thông dụng (ví dụ từ `go` trong "we go to school" không bị nhận thành Golang nếu không có ngữ cảnh công nghệ).
2. **Định dạng dải lương đa dạng:**
   - `salary_min: 8000000, salary_max: 12000000, currency: 'VND'` $\to$ `"8 - 12 Triệu VNĐ"`.
   - `is_negotiable: true` $\to$ `"Thỏa thuận"`.
   - `salary_min: 15000000` $\to$ `"Từ 15 Triệu VNĐ"`.
   - `salary_max: 20000000` $\to$ `"Lên đến 20 Triệu VNĐ"`.
   - `salary_min: 800, salary_max: 1500, currency: 'USD'` $\to$ `"$800 - $1,500 USD"`.
3. **Tính toán điểm phù hợp ứng viên:**
   - Ứng viên có 3/4 kỹ năng yêu cầu ($3/4 \times 70 = 52.5$) và 2 đồ án Verified ($2 \times 10 = 20$) $\to$ Match score xấp xỉ $73\%$.
   - Ứng viên tắt `is_open_to_work` $\to$ Bị loại khỏi danh sách tìm kiếm ứng viên tiềm năng của Recruiter.
   - Ứng viên chặn công ty Recruiter $\to$ Bị loại hoàn toàn khỏi kết quả.
4. **Kế thừa Tích Xanh pháp nhân:**
   - Khi Recruiter có Tích Xanh Kim Cương (`full`) và MST hợp lệ $\to$ Bài đăng tạo ra tự động sở hữu `is_tax_verified = true` và `tax_verification_tier = 'full'`.

---

## 3. Kịch Bản Nghiệm Thu 2: Trải Nghiệm Đăng Tin Tuyển Dụng (Recruiter Flow)

1. Đăng nhập tài khoản Nhà tuyển dụng và truy cập trang `/recruiter/jobs`.
2. Bấm nút **`[ + Đăng Tin Tuyển Dụng ]`**.
3. Dán một đoạn mô tả công việc (JD) thực tế vào ô **Mô tả công việc (Description)**, ví dụ:
   ```text
   Tuyển dụng Thực tập sinh Frontend ReactJS.
   Yêu cầu: Thành thạo ReactJS, TypeScript, Tailwind CSS, biết sử dụng Git và Docker.
   Ưu tiên ứng viên có đồ án thực tế đã Verified trên ProfileHub.
   ```
4. Bấm nút **`[ ✨ AI Bóc Tách Kỹ Năng ]`**:
   - Quan sát ô Kỹ năng tự động được điền: `ReactJS, TypeScript, Tailwind CSS, Git, Docker`.
5. Điền mức lương:
   - Nhập `salary_min: 8000000`, `salary_max: 12000000`.
   - Chọn hình thức: `🌐 Linh hoạt (Hybrid)`.
   - Chọn cấp bậc: `🌱 Thực tập sinh (Intern)`.
6. Bấm **`[ Lưu Bài Đăng ]`**:
   - Thẻ bài đăng mới xuất hiện đầu danh sách với huy hiệu dải lương `8 - 12 Triệu VNĐ`, tag `Hybrid`, tag `Intern`.
   - Hiển thị chip số lượng ứng viên tiềm năng: `[ 👥 X ứng viên phù hợp ]`.
   - Bấm vào chip này: Chuyển hướng ngay sang `/recruiter/candidates?jobId=...` với danh sách ứng viên đã được chấm điểm phù hợp.

---

## 4. Kịch Bản Nghiệm Thu 3: Trải Nghiệm Khám Phá Việc Làm (Student Flow)

1. Đăng nhập tài khoản Sinh viên và truy cập trang `/jobs`.
2. Quan sát danh sách việc làm:
   - Mỗi thẻ tuyển dụng hiển thị rõ ràng dải lương (`8 - 12 Triệu VNĐ` hoặc `Thỏa thuận`).
   - Huy hiệu hình thức (`🏢 On-site`, `🌐 Hybrid`, `🏠 Remote`) và cấp bậc (`🌱 Thực tập sinh`, `🚀 Fresher`).
   - Huy hiệu độ phù hợp cá nhân: `[ 🎯 85% Phù hợp với bạn ]` dựa trên các kỹ năng trong hồ sơ Master Profile của sinh viên.
3. Bấm **`[ 🛡️ Chỉ Xem Công Ty Tích Xanh ]`**:
   - Danh sách chỉ lọc ra các bài đăng có tích xanh doanh nghiệp uy tín.

---

## 5. Lệnh Kiểm Tra Chất Lượng Mã Nguồn (Quality Gates)

```powershell
# 1. Chạy toàn bộ test suites
npm test -- --run

# 2. Kiểm tra lỗi kiểu TypeScript
npx tsc --noEmit

# 3. Biên dịch Production Build
npm run build
```
* Tiêu chuẩn nghiệm thu: **100% Tests Pass**, **0 Lỗi TypeScript**, **Build Production Thành Công**.

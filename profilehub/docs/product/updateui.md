# 🎨 Kế Hoạch Nâng Cấp Giao Diện & Chuẩn Hóa Luồng Người Dùng (updateui.md)

> **Tài liệu tham chiếu:** Quy chuẩn thiết kế giao diện tinh gọn (Clean SaaS UI/UX), luồng bảo vệ dữ liệu bắt buộc đăng nhập (Login-First Architecture) và tối ưu hóa trải nghiệm ứng viên trên ProfileHub.  
> **Thư mục lưu trữ:** `profilehub/docs/product/updateui.md`  
> **Trạng thái:** Đặc tả nâng cấp giao diện chính thức (Active UI Upgrade Spec).

---

## 📌 1. Triết Lý Thiết Kế & Luồng Bắt Buộc Đăng Nhập (Login-First)

### 1.1. Chuyển đổi từ "Dùng thử vãng lai" sang "Bảo vệ dữ liệu vĩnh viễn"
* **Bài học từ đợt người dùng dùng thử:** Cho phép khách vãng lai (Guest) tạo CV mà không đăng nhập dẫn đến 3 hệ lụy nghiêm trọng:
  1. Khách ngồi gõ CV cả tiếng, lỡ tay đóng trình duyệt hoặc đổi máy là mất sạch dữ liệu $\rightarrow$ Gây ức chế.
  2. Dữ liệu nháp của khách bị rò rỉ hoặc lẫn lộn vào tài khoản của người đăng nhập sau (`BUG-03`).
  3. ProfileHub là **Hệ sinh thái nghề nghiệp có bảo chứng (Proof-of-Work)**: Đồ án phải gắn với sinh viên thật, trường lớp thật, tài khoản thật. Không thể để dữ liệu trôi nổi vô danh.
* **Quy chuẩn mới (Login-First Workspace):**
  * **Trang chủ (`/`):** Hoàn toàn công khai để giới thiệu uy tín, giải thích thuật toán JEV và tính năng War Room.
  * **Tất cả các trang làm việc (`/dashboard`, `/cv-builder`, `/cv-management`, `/my-projects`):** Bắt buộc người dùng phải đăng nhập trước khi vào thao tác.
  * Hỗ trợ **Đăng nhập 1-Click bằng Google & GitHub** (mất đúng 2 giây để bắt đầu).
  * **Cam kết an toàn:** Mọi ký tự ứng viên gõ đều được tự động lưu (Auto-save) an toàn lên Supabase Cloud của đúng tài khoản đó, đổi máy hay vào bằng điện thoại đều xem lại được.

---

## 🧭 2. Chuẩn Hóa Thanh Điều Hướng (HeaderBar) 2 Trạng Thái

Để Header không bị "xấu, chật chội và lộ điểm yếu", Header sẽ **tự động biến hình theo 2 trạng thái người dùng**:

```
[TRẠNG THÁI 1: CHƯA ĐĂNG NHẬP - PUBLIC LANDING HEADER]
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [Logo] ProfileHub v1.0   |   Về Chúng Tôi    Tính Năng JEV   |   [Đăng Nhập]  [Đăng Ký Miễn Phí]│
└────────────────────────────────────────────────────────────────────────────────────────┘

[TRẠNG THÁI 2: ĐÃ ĐĂNG NHẬP - CANDIDATE WORKSPACE HEADER]
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [Logo] ProfileHub [Ứng Viên] |  📊 Tổng Quan    📂 Kho Đồ Án    📄 Quản Lý CV  |  [☀️/🌙]  [🔔]  [Avatar]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1. Trạng thái 1: Khi Chưa Đăng Nhập (Public Landing Page)
* **Mục tiêu:** Giới thiệu sản phẩm, tạo sự tin cậy và thúc đẩy đăng ký tài khoản.
* **Bên trái:** Logo ProfileHub + phiên bản `v1.0`.
* **Ở giữa:** 2 liên kết cuộn trang nhẹ nhàng: *Về Chúng Tôi* và *Tính Năng JEV*.
* **Bên phải:** 
  * Nút chữ: `Đăng Nhập`
  * Nút bấm nổi bật (Primary CTA): `[Đăng Ký Miễn Phí]` (hoặc `[Bắt Đầu Ngay]`).
* **Tuyệt đối ẩn:** Không để lộ các liên kết nghiệp vụ nội bộ (không hiện Dashboard, Quản lý CV hay Công cụ dang dở).

### 2.2. Trạng thái 2: Khi Đã Đăng Nhập (Candidate Workspace)
* **Mục tiêu:** Đưa người dùng vào không gian làm việc chuyên nghiệp, thoáng đãng và tập trung cao độ.
* **Bên trái:** Logo ProfileHub + Huy hiệu nhỏ `Ứng Viên` (nền xanh dịu).
* **Ở giữa: Đúng 3 Menu Cốt Lõi Duy Nhất (Không Dropdown, Không Bị Vỡ Giao Diện):**
  1. 📊 **Tổng Quan (`/dashboard`)**: Xem nhịp đập hồ sơ và vào **Trạm tác chiến phỏng vấn (War Room)**.
  2. 📂 **Kho Đồ Án (`/my-projects`)**: Nơi quản lý bằng chứng năng lực (Proof-of-Work), mã nguồn GitHub, link live demo.
  3. 📄 **Quản Lý CV (`/cv-management`)**: Kho chứa các bản CV đã may đo theo từng công ty, nhân bản và xuất in.
* **Bên phải (Tiện ích cá nhân):**
  * Nút gạt chế độ Sáng / Tối (`ThemeToggleSwitch`).
  * Chuông Thông Báo (`Bell Notification`): Hiển thị chấm đỏ khi có lịch phỏng vấn mới.
  * Avatar Ứng Viên (Dropdown tài khoản): Bấm vào mở menu:
    * 👤 *Hồ Sơ Năng Lực Gốc (`/my-profile`)*
    * 🌐 *Xem Trang Portfolio Công Khai (`/showcase`)*
    * 🚪 *Đăng Xuất*

### 2.3. Loại bỏ vĩnh viễn 2 menu gây nhiễu trên Header
* ❌ **Ẩn mục "Tìm Việc Làm":** Vì nguồn việc doanh nghiệp thật chưa mở đại trà, click vào thấy trang trống gây cụt hứng.
* ❌ **Xóa bỏ dropdown "Công Cụ Nghề Nghiệp":** Chứa các liên kết phụ chưa hoàn thiện backend (MBTI, Khớp hồ sơ), làm phân tán sự chú ý khỏi 4 giá trị cốt lõi của website.

---

## ✍️ 3. Tinh Giản Thanh Công Cụ Soạn Thảo CV Canvas (`CVBuilder.tsx`)

Thanh công cụ dàn trang A4 được tổ chức lại theo mô hình chuẩn của **Canva / Google Docs / Notion**, loại bỏ tình trạng nhồi nhét hơn 12 nút bấm:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [PH] AI ATS CV Studio  |  Đã tự động lưu 15:30  |  [↶ Undo] [↷ Redo]  |  [👁️ Xem Trước]  [📄 Xuất PDF]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Mẫu CV ▾]  [Font & Màu ▾]  [📑 2 Cột / 📄 1 Cột]  [Sắp Xếp Mục]  [Kéo Từ Hồ Sơ]  | [🛡️ ATS: 98%]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Gỡ bỏ triệt để 2 nút ngoài luồng:**
   * Xóa nút `Khảo Sát Lương` và `Phỏng Vấn AI` khỏi thanh vẽ CV. (2 tính năng này được kích hoạt đúng ngữ cảnh tại War Room ở Dashboard).
2. **Gom các nút phân tích ATS/Lỗi/STAR thành 1 nút trạng thái duy nhất:**
   * Thay vì chia làm 3 nút (*Mắt thần ATS, Quality Check, STAR Coach*), gom thành:  
     👉 **`[🛡️ Chuẩn ATS: 98%]`** (Click vào sẽ tự động mở bảng AI Copilot bên phải).
3. **Đổi tên toàn bộ Panel bên phải thành "AI Copilot":**
   * Xóa bỏ nhãn "⭐ STAR Coach" gây khó hiểu cho sinh viên ngoài ngành.
   * Quy về bảng **🤖 AI Copilot** với 3 tab rõ ràng:
     * *Tab 1:* Soi lỗi chính tả & Từ khóa ATS.
     * *Tab 2:* Nâng cấp câu chữ đo lường (Action Verbs).
     * *Tab 3:* Ôn tập câu hỏi bẫy đồ án.
4. **Ẩn con số gây áp lực tâm lý "Còn 20/20 lượt AI":**
   * Xóa badge quota tĩnh trên Header.
   * Chỉ khi người dùng thực sự dùng hết 20 lượt (`remainingCredits === 0`) thì mới hiện **Modal Nạp Lượt AI / Nâng Cấp Gói**.
5. **Khắc phục lỗi màn mờ (Dimmed Overlay):**
   * Tự động tắt sạch lớp phủ đen mờ (`backdrop`) sau khi người dùng đăng nhập và lưu thành công.

---

## 👁️ 4. Sửa Lỗi Hiển Thị & Hoạt Họa Trực Quan

### 4.1. Sửa lỗi màu Dropdown trong Modal Phỏng Vấn (`BUG-07`)
* **Vấn đề:** Thẻ `<select>` chọn CV hoặc số lượng đồ án bị chữ đen trên nền đen trong Dark Mode hoặc chữ trắng trên nền trắng.
* **Xử lý:** Áp đặt màu chữ và màu nền trực tiếp cho cả thẻ `<select>` lẫn từng thẻ `<option>`:
  ```tsx
  <select className="w-full px-3.5 py-2.5 bg-white dark:bg-[#161f36] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl">
    {availableCvs.map(cv => (
      <option key={cv.id} value={cv.id} className="bg-white dark:bg-[#161f36] text-slate-900 dark:text-slate-100">
        {cv.title} ({cv.targetRole})
      </option>
    ))}
  </select>
  ```

### 4.2. Chuẩn hóa `@media print` cho nút Xuất PDF (`BUG-09`)
* **Vấn đề:** In bị dính thanh Header/Copilot, văn bản đồ án bị chém đôi giữa trang 1 và trang 2, màu sắc bị bay màu.
* **Xử lý:**
  * Ép buộc in 100% màu nền và font chữ: `-webkit-print-color-adjust: exact !important;`.
  * Chống cắt ngang khối đồ án: `break-inside: avoid !important; page-break-inside: avoid !important;`.
  * Ẩn 100% các thanh công cụ, chỉ in khung giấy `#cv-preview-a4`.

### 4.3. Hiệu ứng Intro 2D Elevated CV Nổi Lên Sắc Nét
* Tích hợp CSS Hardware Acceleration từ `ui.md`: Khi mở modal khởi tạo hoặc vào trang soạn thảo, tờ CV A4 nổi bổng từ dưới lên (`translateY(28px) → 0`) với bóng đổ đa tầng 2D, giữ trọn vẹn 100% độ sắc nét của font chữ.

---

## 🚀 5. Danh Mục File Cần Tác Động Mã Nguồn

| Thứ tự | Tệp mã nguồn | Nội dung cập nhật cụ thể |
| :---: | :--- | :--- |
| **01** | `src/components/layout/headerNavigation.ts` | Tinh giản danh sách menu ứng viên về đúng 3 mục: **Tổng Quan, Kho Đồ Án, Quản Lý CV**; loại bỏ "Tìm Việc Làm" và dropdown "Công Cụ Nghề Nghiệp". |
| **02** | `src/components/layout/HeaderBar.tsx` | Xử lý hiển thị 2 trạng thái: Chưa đăng nhập (Hiện nút Đăng nhập/Đăng ký) vs Đã đăng nhập (Hiện 3 menu + Avatar). |
| **03** | `src/pages/student/CVBuilder.tsx` | Gỡ bỏ 2 nút Khảo sát lương & Phỏng vấn AI; gom icon ATS; đổi tên panel thành AI Copilot; ẩn badge 20/20 AI; chuẩn hóa `@media print`. |
| **04** | `src/components/student/InterviewWarRoomModal.tsx` | Khắc phục triệt để lỗi màu chữ/nền cho thẻ `<select>` và `<option>`. |
| **05** | `src/App.tsx` | Thiết lập bọc `ProtectedRoute` cho các trang nghiệp vụ nội bộ để kích hoạt luồng bắt buộc đăng nhập (Login-First). |

---

> 🎯 **Kết luận:**  
> Tệp `updateui.md` đóng vai trò là kim chỉ nam hoàn thiện diện mạo của ProfileHub: **Header tối giản đẳng cấp, luồng đăng nhập chặt chẽ bảo vệ dữ liệu, trình soạn thảo A4 thoáng đãng và bản in PDF đạt chuẩn sắc nét tuyệt đối.**

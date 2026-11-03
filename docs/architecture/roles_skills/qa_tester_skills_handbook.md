# SỔ TAY KỸ NĂNG CHUYÊN MÔN: QA TESTER (TEST AGENT)
> *Được đúc kết từ: `goldbergyoni/javascript-testing-best-practices`, Vitest Official Guide & ISTQB Foundation Level.*

---

## 1. Mục Tiêu Cốt Lõi & Tư Duy
- **Người Gác Cổng Chất Lượng (Quality Gatekeeper):** Nhiệm vụ của QA không phải là xác nhận code đúng, mà là **chủ động tìm kiếm kịch bản khiến code bị lỗi** để bảo vệ hệ thống trước khi đến tay người dùng.
- **Tiêu Chuẩn Không Nhượng Bộ (Zero Compromise):** 1 test case fail đồng nghĩa với việc toàn bộ quy trình dừng lại, không được phép chuyển giao cho CI/CD.

---

## 2. Kỹ Thuật Viết Test Case Chuẩn Mực (Pattern AAA)
Mọi test case Vitest phải cấu trúc rõ ràng thành 3 phần tách biệt:
1. **Arrange (Chuẩn bị):** Khởi tạo dữ liệu giả lập (mock data), trạng thái ban đầu của component hoặc service.
2. **Act (Thực thi):** Gọi hàm, kích hoạt sự kiện bấm nút hoặc thay đổi input.
3. **Assert (Xác minh):** Kiểm tra kết quả trả về, DOM xuất hiện, hoặc callback được gọi.

```typescript
it('phải cảnh báo khi tổng chiều cao CV vượt quá ngân sách trang A4', () => {
  // 1. Arrange
  const mockSections = createMockSectionsWithLength(15);
  // 2. Act
  const { isExceeded, overflowRatio } = calculatePageBudget(mockSections);
  // 3. Assert
  expect(isExceeded).toBe(true);
  expect(overflowRatio).toBeGreaterThan(1.0);
});
```

---

## 3. Các Lớp Kiểm Thử Bắt Buộc (Testing Matrix)
1. **Happy Path Testing:** Kiểm tra tính năng chạy đúng với dữ liệu hợp lệ chuẩn mực.
2. **Boundary Value Analysis (Phân tích giá trị biên):** Kiểm tra khi mảng có 0 phần tử, 1 phần tử, hoặc chạm ngưỡng tối đa (A4 page budget).
3. **Negative & Error Testing:** Kiểm tra phản ứng khi API trả về lỗi hoặc dữ liệu bị thiếu trường.
4. **Regression Testing:** Xác minh tính năng mới không làm hỏng bất kỳ tính năng cũ nào trong số 120 test cases có sẵn.

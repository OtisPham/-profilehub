# 📊 Đặc Tả Kỹ Thuật: Hệ Thống AI & Python Crawler Thu Thập Bảng Lương Thị Trường Thực Tế (Real Market Salary Spec)

> **Tài liệu tham chiếu:** Hệ thống định giá năng lực & khảo sát dải lương thực tế dựa trên dữ liệu tuyển dụng mở (Proof-of-Work to Market Value).  
> **Thư mục lưu trữ:** `profilehub/docs/product/real_market_salary_spec.md`  
> **Trạng thái:** Đặc tả kỹ thuật & Kiến trúc mã nguồn Python (Technical Specification).

---

## 📌 1. Bối Cảnh & Mục Tiêu

### 1.1. Vấn đề của hệ thống hiện tại
* Tính năng "Khảo sát lương" (`salaryBenchmarkService.ts` & `SalaryBenchmarkModal.tsx`) hiện đang tính toán dựa trên **bảng hằng số giả định (Hardcoded Heuristic Table)**:
  ```typescript
  // Công thức giả định cũ:
  intern: { min: 4tr, median: 7tr, max: 10tr }
  fresher: { min: 9tr, median: 14tr, max: 18tr }
  junior: { min: 16tr, median: 24tr, max: 32tr }
  ...
  ```
* **Hậu quả:** 
  1. Người dùng cảm thấy con số mang tính "ảo", thiếu cơ sở thuyết phục và không phản ánh đúng biến động thực tế của thị trường tuyển dụng tại Việt Nam.
  2. **Dữ liệu tĩnh (Static Data) bị lỗi thời:** Thị trường lương công nghệ thay đổi liên tục theo từng quý. Việc lưu bảng số cố định trong code khiến hệ thống AI hiển thị sai lệch hoàn toàn thực tế sau một thời gian vận hành.

### 1.2. Mục tiêu hệ thống mới
1. **100% Dữ liệu thực tế (Evidence-Based):** Thu thập trực tiếp từ các cổng báo cáo lương chuyên dụng và sàn tuyển dụng lớn: **VietSalary (VietnamSalary - CareerViet)**, **TopCV**, **ITviec**, **TopDev**, **VietnamWorks**.
2. **Chu kỳ cào chuẩn công nghiệp (1 lần / tháng):** Tránh spam gây sập máy chủ đối tác, không lo bị chặn IP, đồng thời đảm bảo dữ liệu luôn tươi mới theo từng tháng.
3. **Cơ chế Dữ liệu Động (Dynamic Lifecycle & TTL):** Không để dữ liệu tĩnh trong file; mỗi tập dữ liệu đều có vòng đời (Time-to-Live = 30 ngày), tự động cảnh báo và kích hoạt cào mới khi hết hạn.
4. **Hàng đợi cào động theo yêu cầu (On-Demand Dynamic Queue):** Khi ứng viên tra cứu vị trí/kỹ năng mới chưa có trong cache tháng, bot sẽ đưa vào hàng đợi ưu tiên để cào động bổ sung, AI tuyệt đối không tự "đoán mò" con số.
5. **Minh bạch mẫu thu thập (Sample Size Transparency):** Hiển thị rõ số lượng tin và thời điểm cập nhật (Ví dụ: *"Dữ liệu động tháng 10/2026 • Phân tích từ 1.420 tin tuyển dụng thực tế"*).
6. **Bằng chứng đối chiếu người thật việc thật (Evidence Verification):** Hiển thị 3–5 công ty thực tế đang mở tuyển ở vị trí tương ứng kèm link bài tuyển dụng và dải lương công khai.

---

## ⏰ 2. Lịch Trình Cào & Cơ Chế Quản Lý Dữ Liệu Động (Dynamic Data Engine)

### 2.1. Chu kỳ cào định kỳ: 1 Lần / Tháng (Monthly Cron Schedule)
Mức lương thị trường không biến động theo từng giờ. Chu kỳ tối ưu nhất về chi phí và tài nguyên là **1 lần / tháng**:
* **Thời điểm kích hoạt:** **02:00 sáng ngày 01 hàng tháng** (Thời điểm máy chủ ít tải nhất).
* **Lệnh Cron Expression:** `0 2 1 * *`
* **Thời gian hoàn thành:** ~15–25 phút cho toàn bộ danh mục ~100 chức danh IT & Đa ngành.
* **Thời gian giãn cách giữa các lượt cào (Rate Limit):** `random.uniform(2.5, 5.0)` giây giữa mỗi từ khóa để đảm bảo tôn trọng máy chủ của đối tác và không bao giờ bị Cloudflare khóa IP.

```
+-------------------------------------------------------------------------+
|                  VÒNG ĐỜI DỮ LIỆU ĐỘNG (TTL = 30 NGÀY)                  |
|                                                                         |
| Ngày 01 hàng tháng:             Ngày 02 -> Ngày 25:    Ngày 30 -> 31:   |
| [Bot Python cào dữ liệu] -----> [Dữ liệu Động Tươi] -> [Hết hạn TTL]   |
| Cập nhật `crawled_at`           `is_stale: false`      `is_stale: true` |
| và `expires_at = +30d`          Hiển thị bình thường   Kích hoạt cào mới|
+-------------------------------------------------------------------------+
```

### 2.2. Cơ chế phân biệt Dữ Liệu Động vs Dữ Liệu Tĩnh (Tránh AI hiển thị sai)

Hệ thống ProfileHub quy định 3 trạng thái của dữ liệu lương:

| Trạng thái | Điều kiện thời gian | Hành vi của Hệ thống & AI | Hiển thị trên Giao diện |
| :--- | :--- | :--- | :--- |
| 🟢 **ACTIVE_DYNAMIC** (Dữ liệu Động tươi mới) | Tuổi dữ liệu $\le 30$ ngày | AI sử dụng 100% dữ liệu phân vị đã cào để gợi ý deal lương và phân tích thị trường. | Badge: *"🟢 Dữ liệu tháng 10/2026 (Cập nhật 5 ngày trước)"* |
| 🟡 **NEEDS_REFRESH** (Sắp hết hạn) | Tuổi dữ liệu từ $31 - 40$ ngày | AI vẫn sử dụng nhưng gửi thông báo nền (Background Notification) cho Admin/Scheduler để chạy cào cập nhật. | Badge: *"🟡 Dữ liệu tháng trước • Đang lên lịch đồng bộ"* |
| 🔴 **STALE_EXPIRED** (Dữ liệu Tĩnh quá hạn) | Tuổi dữ liệu $> 40$ ngày | **KHÔNG CHO PHÉP AI LẤY SỐ CŨ NÓI BỪA**. Hệ thống tự động kích hoạt Worker Python chạy ngay lập tức; giao diện hiển thị thông báo đang đồng bộ thay vì hiện số ảo. | Badge: *"🔄 Đang cập nhật dữ liệu mới nhất từ thị trường..."* |

### 2.3. Cơ chế cào động theo yêu cầu (On-Demand Dynamic Queue)
Khi ứng viên nhập một công nghệ mới nổi (ví dụ: `Rust WebAssembly`, `Solana Developer`, `LangChain Agent`):
1. Hệ thống kiểm tra trong `real_market_salaries.json`. Nếu chưa có:
2. **Không bịa ra con số**: Hệ thống push từ khóa này vào hàng đợi `dynamic_crawl_queue.json`.
3. Worker Python chạy nền (Playwright) sẽ truy cập **VietSalary** hoặc **ITviec** để lấy dữ liệu cho riêng từ khóa này trong vòng 1–2 phút.
4. Cập nhật động bản ghi mới vào file JSON và thông báo cho người dùng: *"Đã thu thập dữ liệu thị trường mới nhất cho vị trí của bạn!"*.

---

## 🌐 3. Thiết Kế Setup Thu Thập Dữ Liệu Từ Các Trang Lớn (VietSalary / CareerViet)

### 3.1. Phân tích nền tảng VietSalary (`vietnamsalary.careerviet.vn`)
VietSalary của CareerViet là chuyên trang khảo sát lương uy tín hàng đầu Việt Nam. Điểm đặc thù của VietSalary:
* Có dữ liệu phân vị chuẩn: **Thấp nhất, Trung bình thấp (P25), Trung bình (P50), Trung bình cao (P75), Cao nhất**.
* Phân chia theo số năm kinh nghiệm và địa điểm (Hà Nội, TP.HCM, Toàn quốc).
* **Cơ chế bảo vệ:** Không mở Public REST API; giao diện dùng AJAX hoặc render mã nguồn động.

### 3.2. Setup Phương Pháp 1: Bóc tách qua Reverse-Engineering Internal AJAX
Dùng Python gọi trực tiếp vào API nội bộ của VietSalary:

```python
# server/python/salary_crawler/sources/vietsalary_api.py
import requests
import json
import time
import random

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Referer': 'https://vietnamsalary.careerviet.vn/',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json, text/javascript, */*; q=0.01'
}

def fetch_vietsalary_by_keyword(job_title: str, location_id: int = 1):
    """
    location_id: 1 = TP.HCM, 2 = Hà Nội, 0 = Toàn quốc
    """
    endpoint = "https://vietnamsalary.careerviet.vn/ajax/tra-cuu-luong"
    payload = {
        'keyword': job_title,
        'location': location_id,
        'experience': 'all'
    }
    
    response = requests.post(endpoint, data=payload, headers=HEADERS, timeout=12)
    if response.status_code == 200:
        res = response.json()
        return {
            "source": "VietnamSalary (CareerViet)",
            "role": job_title,
            "min_vnd": res.get("min_salary", 0),
            "p25_vnd": res.get("low_average", 0),
            "median_p50_vnd": res.get("average", 0),
            "p75_vnd": res.get("high_average", 0),
            "max_vnd": res.get("max_salary", 0),
            "sample_count": res.get("sample_size", 50)
        }
    return None
```

### 3.3. Setup Phương Pháp 2: Playwright Headless Browser (Chống Block 100%)
Nếu website thay đổi token bảo vệ CSRF hoặc Cloudflare Challenge, chuyển sang chế độ Playwright trình duyệt ẩn danh:

```python
# server/python/salary_crawler/sources/vietsalary_browser.py
from playwright.sync_api import sync_playwright
import time
import random
import re

def clean_currency(val_str: str) -> int:
    digits = re.sub(r'[^\d]', '', val_str)
    return int(digits) if digits else 0

def crawl_vietsalary_browser(keywords: list):
    scraped_data = {}
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        for kw in keywords:
            try:
                page.goto("https://vietnamsalary.careerviet.vn/", timeout=25000)
                page.fill("input[name='keyword']", kw)
                page.click("button[type='submit']")
                
                # Chờ kết quả hiển thị
                page.wait_for_selector(".salary-chart-result", timeout=8000)
                
                low = page.locator(".salary-min-val").inner_text()
                avg = page.locator(".salary-avg-val").inner_text()
                high = page.locator(".salary-max-val").inner_text()

                scraped_data[kw] = {
                    "min_vnd": clean_currency(low),
                    "median_p50_vnd": clean_currency(avg),
                    "max_vnd": clean_currency(high),
                    "source": "VietnamSalary (CareerViet)"
                }
                
                # Giãn cách 2.5 - 4.5s để tôn trọng máy chủ đối tác
                time.sleep(random.uniform(2.5, 4.5))
            except Exception as e:
                print(f"Bỏ qua {kw} do lỗi: {e}")
                
        browser.close()
    return scraped_data
```

---

## 🏗️ 4. Kiến Trúc Pipeline & Thư Mục Dự Án

```
profilehub/
└── server/
    └── python/
        └── salary_crawler/
            ├── __init__.py
            ├── config.py                 # Cấu hình chu kỳ 1 tháng, danh sách ~100 vị trí cần cào
            ├── run_monthly_crawler.py    # File thực thi chính chạy ngày mùng 1 hàng tháng
            ├── normalizer.py             # Bóc tách chuỗi tiền tệ VND/USD & Seniority Level
            ├── aggregator.py             # Tính toán phân vị P25 - P50 - P75
            ├── sources/
            │   ├── vietsalary_crawler.py # Module cào VietSalary (CareerViet)
            │   ├── topcv_crawler.py      # Module cào TopCV Jobs
            │   └── itviec_crawler.py     # Module cào ITviec
            └── data/
                ├── dynamic_queue.json    # Hàng đợi cào động các từ khóa mới do user yêu cầu
                └── real_market_salaries.json # Dữ liệu động chuẩn hóa cho ProfileHub Frontend
```

---

## 💾 5. Cấu Trúc File Dữ Liệu Động (`real_market_salaries.json`)

Tệp này được thiết kế với đầy đủ trường kiểm tra tính tươi mới (Freshness check) để AI không bao giờ dùng dữ liệu quá hạn:

```json
{
  "_schema_version": "2.0.0",
  "metadata": {
    "crawled_at": "2026-10-01T02:00:00Z",
    "expires_at": "2026-11-01T02:00:00Z",
    "ttl_days": 30,
    "crawl_cadence": "MONTHLY_ONCE",
    "is_stale": false,
    "total_jobs_analyzed": 1680,
    "sources": [
      "VietnamSalary (CareerViet)",
      "ITviec",
      "TopCV",
      "TopDev"
    ],
    "usd_exchange_rate": 25400
  },
  "roles": {
    "backend_nodejs": {
      "role_name": "Node.js Backend Developer",
      "levels": {
        "fresher": {
          "sample_size": 156,
          "p25_vnd": 10000000,
          "median_p50_vnd": 14000000,
          "p75_proof_of_work_vnd": 18500000,
          "p90_max_vnd": 24000000,
          "top_tech_premiums": [
            { "tech": "Docker", "premium_percent": 12 },
            { "tech": "PostgreSQL", "premium_percent": 8 },
            { "tech": "Redis", "premium_percent": 10 }
          ],
          "evidence_samples": [
            {
              "company_name": "VNG Corporation",
              "job_title": "Fresher Backend Engineer (NodeJS/Golang)",
              "salary_raw": "14 - 18 triệu VND",
              "salary_min_vnd": 14000000,
              "salary_max_vnd": 18000000,
              "source": "VietnamSalary & ITviec",
              "verified_date": "2026-10-15"
            },
            {
              "company_name": "FPT Software",
              "job_title": "Junior Node.js Software Engineer",
              "salary_raw": "15 - 22 triệu",
              "salary_min_vnd": 15000000,
              "salary_max_vnd": 22000000,
              "source": "TopCV",
              "verified_date": "2026-10-18"
            }
          ]
        }
      }
    }
  }
}
```

---

## 🖥️ 6. Giao Diện Người Dùng & Nguyên Tắc Bảo Vệ AI (`SalaryBenchmarkModal.tsx`)

Để triệt tiêu hoàn toàn cảm giác "ảo", giao diện tuân thủ 3 nguyên tắc:

1. **Hiển thị Rõ Thời Điểm & Hạn Sử Dụng Dữ Liệu:**
   * Hiển thị: *"Báo cáo mức lương thực tế tháng 10/2026 (Nguồn: VietnamSalary, ITviec, TopCV)"*.
   * Có dòng trạng thái: *"Dữ liệu được cập nhật tự động 1 lần/tháng vào ngày 01. Còn hiệu lực 12 ngày nữa."*
2. **Nguyên tắc "Cấm AI Đoán Mò":**
   * Nếu người dùng chọn một vị trí hoàn toàn mới lạ chưa có trong đợt cào tháng:
   * AI sẽ **KHÔNG hiển thị con số bừa bãi**.
   * Hệ thống sẽ hiển thị: *"ProfileHub đang đưa vị trí này vào hàng đợi thu thập thị trường. Kết quả sẽ được cập nhật trong ít phút."* Đồng thời kích hoạt bot cào bổ sung ngay lập tức.
3. **Phân vị Proof-of-Work P75:**
   * Làm nổi bật mức lương P75 dành riêng cho ứng viên có đồ án đã xác thực (Verified) trên ProfileHub:
   * *"Nhờ có 2 đồ án được giảng viên chứng thực (Level 3 Proof-of-Work), mức định giá đề xuất của bạn đạt 18.500.000 đ (nằm trong Top 25% ứng viên xuất sắc nhất thị trường)."*

---

## 🚀 7. Lộ Trình Triển Khai Thực Tế

1. **Tuần 1:** Tạo thư mục `server/python/salary_crawler/` và viết module `vietsalary_crawler.py` theo cả 2 cách (API nội bộ + Playwright).
2. **Tuần 2:** Lên lịch chạy tự động định kỳ vào ngày 01 hàng tháng bằng cronjob/script Python.
3. **Tuần 3:** Kết nối `real_market_salaries.json` vào `salaryBenchmarkService.ts` để thay thế hoàn toàn bảng hằng số giả định.
4. **Tuần 4:** Nâng cấp Modal giao diện để hiển thị thông tin bằng chứng thực tế và thời gian hiệu lực dữ liệu.

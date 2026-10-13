# Career Discovery Question Bank v1

**Dự án:** AI CV Builder & AI Interview Coach
**Mục đích:** Bộ câu hỏi giúp AI hiểu sâu người dùng trước khi tạo CV hoặc luyện phỏng vấn.

## Cách dùng tài liệu

- **Tầng 1: Core Questions** dùng cho mọi ngành (Phần 1 đến 3).
- **Tầng 2: Industry Modules** đào sâu KPI, công cụ, tình huống đặc thù theo ngành (Phần 4).
- **Follow-up Probes** dùng khi câu trả lời còn chung chung (Phần 5).
- Mỗi câu có **ID** và **trường dữ liệu đích** (`→ field`) để ánh xạ vào Career Data Model.
- Cột **Ưu tiên**: `P0` = bắt buộc hỏi, `P1` = nên hỏi, `P2` = hỏi nếu còn thời gian/phù hợp.
- Cột **Dùng cho**: `CV` = tạo CV, `PV` = luyện phỏng vấn, `Cả hai`.

---

## Phần 1: Core Questions

### 1. Achievement (Thành tích)

| ID | Câu hỏi | → field | Ưu tiên | Dùng cho |
|---|---|---|---|---|
| ACH-01 | Thành tích bạn tự hào nhất trong công việc/học tập là gì? | `achievements[].title` | P0 | Cả hai |
| ACH-02 | Khi đó bạn giữ vai trò gì, cụ thể bạn làm gì (không phải cả nhóm)? | `achievements[].role`, `action` | P0 | Cả hai |
| ACH-03 | Có ai (sếp, khách hàng, giảng viên) ghi nhận hoặc khen thành tích đó không? | `achievements[].evidence` | P1 | CV |
| ACH-04 | Bạn từng nhận giải thưởng, học bổng hay danh hiệu nào? | `awards[]` | P1 | CV |
| ACH-05 | Việc nào bạn làm tốt hơn mức được yêu cầu? | `achievements[].beyond_scope` | P1 | Cả hai |

### 2. Impact (Kết quả tạo ra)

| ID | Câu hỏi | → field | Ưu tiên | Dùng cho |
|---|---|---|---|---|
| IMP-01 | Kết quả đó thay đổi điều gì? (tăng/giảm bao nhiêu %, tiết kiệm bao nhiêu thời gian/tiền) | `impact.metric`, `value` | P0 | Cả hai |
| IMP-02 | So với trước khi bạn làm, tình hình khác thế nào? | `impact.before_after` | P0 | Cả hai |
| IMP-03 | Bao nhiêu người, khách hàng hoặc phòng ban được hưởng lợi? | `impact.scale` | P1 | CV |
| IMP-04 | Nếu không có số liệu, bạn thấy thay đổi rõ nhất ở đâu? (chất lượng, tốc độ, sự hài lòng…) | `impact.qualitative` | P1 | Cả hai |
| IMP-05 | Kết quả này kéo dài bao lâu? Có được nhân rộng không? | `impact.sustainability` | P2 | Cả hai |

### 3. Leadership (Lãnh đạo)

| ID | Câu hỏi | → field | Ưu tiên | Dùng cho |
|---|---|---|---|---|
| LEAD-01 | Bạn đã từng dẫn dắt nhóm, dự án hay hoạt động nào? Quy mô bao nhiêu người? | `leadership[].scope` | P0 | Cả hai |
| LEAD-02 | Bạn phân công và theo dõi tiến độ như thế nào? | `leadership[].method` | P1 | PV |
| LEAD-03 | Kể về lần bạn phải giải quyết mâu thuẫn trong nhóm. | `leadership[].conflict_story` | P1 | PV |
| LEAD-04 | Bạn từng hướng dẫn, đào tạo người mới chưa? Kết quả ra sao? | `leadership[].mentoring` | P2 | Cả hai |
| LEAD-05 | Nếu chưa có chức danh quản lý, bạn có lần nào tự đứng ra dẫn dắt chưa? | `leadership[].informal` | P0 (fresher) | Cả hai |

### 4. Problem Solving (Giải quyết vấn đề)

| ID | Câu hỏi | → field | Ưu tiên | Dùng cho |
|---|---|---|---|---|
| PS-01 | Vấn đề khó nhất bạn từng gặp là gì? | `problems[].situation` | P0 | Cả hai |
| PS-02 | Bạn phân tích nguyên nhân bằng cách nào? | `problems[].analysis` | P1 | PV |
| PS-03 | Bạn đã cân nhắc những phương án nào và vì sao chọn phương án cuối? | `problems[].options`, `decision` | P1 | PV |
| PS-04 | Kết quả ra sao? Nếu làm lại bạn sẽ đổi điều gì? | `problems[].result`, `reflection` | P0 | Cả hai |
| PS-05 | Kể về lần bạn phải quyết định khi thiếu thông tin. | `problems[].ambiguity` | P2 | PV |

### 5. Learning Ability (Khả năng học hỏi và thất bại)

| ID | Câu hỏi | → field | Ưu tiên | Dùng cho |
|---|---|---|---|---|
| LRN-01 | Kỹ năng khó nhất bạn tự học gần đây là gì? Học trong bao lâu, bằng cách nào? | `learning[].skill`, `method`, `duration` | P1 | Cả hai |
| LRN-02 | Kể về một thất bại hoặc sai lầm lớn của bạn. | `failures[].story` | P0 | PV |
| LRN-03 | Bạn rút ra bài học gì và đã áp dụng vào lần sau ra sao? | `failures[].lesson`, `applied` | P0 | PV |
| LRN-04 | Bạn nhận feedback tiêu cực gần nhất khi nào, và phản ứng thế nào? | `learning[].feedback_handling` | P1 | PV |
| LRN-05 | Bạn đang học hoặc muốn học gì trong 6-12 tháng tới? | `learning[].current_goal` | P2 | Cả hai |
| LRN-06 | Bạn có chứng chỉ, khóa học nào? Bạn đã dùng chúng vào việc gì? | `certifications[]` | P1 | CV |

### 6. Career Goal (Mục tiêu nghề nghiệp)

| ID | Câu hỏi | → field | Ưu tiên | Dùng cho |
|---|---|---|---|---|
| GOAL-01 | 1 năm và 3-5 năm tới bạn muốn ở vị trí nào? | `goals.short_term`, `long_term` | P0 | Cả hai |
| GOAL-02 | Bạn muốn công việc tiếp theo mang lại điều gì? (kỹ năng, thu nhập, môi trường, ảnh hưởng) | `goals.priorities` | P1 | Cả hai |
| GOAL-03 | Loại công ty/văn hóa nào phù hợp và không phù hợp với bạn? | `goals.culture_fit` | P2 | PV |
| GOAL-04 | Vị trí bạn đang nhắm tới là gì? Bạn thấy mình còn thiếu gì cho vị trí đó? | `goals.target_role`, `gaps` | P0 | Cả hai |
| GOAL-05 | Bạn có ràng buộc nào cần lưu ý không? (địa điểm, mức lương, thời gian) | `goals.constraints` | P2 | PV |

---

## Phần 2: Nền tảng (Kinh nghiệm, Kỹ năng, Ngoại khóa, Dự án)

| ID | Câu hỏi | → field | Ưu tiên | Dùng cho |
|---|---|---|---|---|
| EXP-01 | Liệt kê các công việc/thực tập (công ty, chức danh, thời gian). | `experience[]` | P0 | Cả hai |
| EXP-02 | Ở mỗi nơi, 3 việc bạn làm nhiều nhất và 1 việc bạn làm tốt nhất là gì? | `experience[].responsibilities`, `highlight` | P0 | CV |
| SKL-01 | Kỹ năng chuyên môn/công cụ bạn dùng thành thạo? Tự chấm 1-5 và cho ví dụ đã dùng. | `skills.hard[]` | P0 | Cả hai |
| SKL-02 | Kỹ năng mềm nào đồng nghiệp hay nhận xét ở bạn? Cho một tình huống chứng minh. | `skills.soft[].evidence` | P1 | Cả hai |
| ACT-01 | Bạn có tham gia CLB, tình nguyện, cuộc thi nào không? Vai trò và kết quả? | `activities[]` | P1 | CV |
| PRJ-01 | Dự án cá nhân/side project nào bạn muốn nhà tuyển dụng thấy? Vì sao bạn làm nó? | `projects[]` | P1 | Cả hai |
| PRJ-02 | Bạn dùng công nghệ/phương pháp gì, và có sản phẩm hay link để xem không? | `projects[].stack`, `link` | P1 | CV |

---

## Phần 3: Career Story

| ID | Câu hỏi | → field | Ưu tiên | Dùng cho |
|---|---|---|---|---|
| STORY-01 | Hãy kể hành trình của bạn theo thứ tự thời gian, từ lúc bắt đầu học/làm đến hiện tại. | `timeline[]` | P0 | Cả hai |
| STORY-02 | Mỗi giai đoạn: bạn muốn gì, làm gì, học được gì, vì sao chuyển sang giai đoạn sau? | `timeline[].motivation`, `transition` | P1 | PV |
| STORY-03 | Bước ngoặt lớn nhất trong sự nghiệp của bạn là gì? Điều gì thay đổi sau đó? | `turning_points[]` | P0 | Cả hai |
| STORY-04 | 3 điều mọi người hay nhờ bạn giúp hoặc khen bạn giỏi nhất là gì? | `strengths.raw` | P0 | Cả hai |
| STORY-05 | Nếu tự giới thiệu trong 30 giây, bạn muốn nhà tuyển dụng nhớ điều gì? | `narrative.hook` | P1 | Cả hai |
| STORY-06 | Giá trị/động lực xuyên suốt các lựa chọn nghề nghiệp của bạn là gì? | `narrative.theme` | P1 | PV |

---

## Phần 4: Industry Modules

Hệ thống chọn module theo ngành người dùng chọn ở đầu flow. Mã câu hỏi có dạng `[MÃ NGÀNH]-[NHÓM]-[SỐ]`.

### A. IT / Software / Data (`IT`)

| ID | Nhóm | Câu hỏi | → field |
|---|---|---|---|
| IT-IMP-01 | Impact | Sản phẩm bạn làm có bao nhiêu người dùng? | `impact.scale` |
| IT-IMP-02 | Impact | Bạn cải thiện hiệu năng, độ ổn định hay chi phí ở mức nào? (latency, uptime, bug rate, chi phí cloud) | `impact.metric` |
| IT-PS-01 | Problem solving | Kể về một bug/sự cố production khó nhất. Bạn debug thế nào? | `problems[].situation`, `analysis` |
| IT-PS-02 | Problem solving | Bạn làm gì để sự cố đó không tái diễn? | `problems[].prevention` |
| IT-TECH-01 | Technical depth | Bạn từng thiết kế kiến trúc hoặc chọn công nghệ nào? Trade-off là gì? | `industry.architecture` |
| IT-COL-01 | Collaboration | Bạn review code, viết tài liệu, làm việc với PM/Design như thế nào? | `industry.collaboration` |
| IT-DATA-01 | Data/AI | Bài toán dữ liệu bạn đã giải, mô hình và metric đánh giá? (accuracy, F1, uplift) | `industry.data_projects` |
| IT-LRN-01 | Learning | Bạn cập nhật công nghệ mới bằng cách nào? Có đóng góp open source không? | `learning[]`, `projects[]` |

### B. Marketing / Content / Truyền thông (`MKT`)

| ID | Nhóm | Câu hỏi | → field |
|---|---|---|---|
| MKT-IMP-01 | Impact | Chiến dịch nào bạn phụ trách? Ngân sách và kênh? | `industry.campaigns` |
| MKT-IMP-02 | Impact | KPI đạt được? (reach, CTR, CPL, ROAS, conversion, doanh thu) | `impact.metric` |
| MKT-PS-01 | Problem solving | Kể về chiến dịch không đạt KPI. Bạn phân tích và điều chỉnh ra sao? | `problems[]` |
| MKT-CRE-01 | Creative | Ý tưởng sáng tạo nào của bạn được triển khai? Insight khách hàng đằng sau nó? | `industry.creative` |
| MKT-TOOL-01 | Tools | Bạn dùng công cụ nào? (GA, Meta Ads, Google Ads, SEO tools, CRM) | `skills.hard[]` |
| MKT-LEAD-01 | Leadership | Bạn điều phối agency/freelancer/designer như thế nào? | `leadership[]` |

### C. Sales / Kinh doanh / Chăm sóc khách hàng (`SAL`)

| ID | Nhóm | Câu hỏi | → field |
|---|---|---|---|
| SAL-ACH-01 | Achievement | Doanh số/target bạn đạt được, so với chỉ tiêu (%), xếp hạng trong đội? | `achievements[]` |
| SAL-IMP-01 | Impact | Giá trị hợp đồng lớn nhất, số khách hàng mới? | `impact.metric` |
| SAL-IMP-02 | Impact | Tỷ lệ chốt, tỷ lệ giữ chân khách hàng? | `impact.metric` |
| SAL-PS-01 | Problem solving | Kể về lần bạn thuyết phục được khách hàng khó hoặc cứu một hợp đồng sắp mất. | `problems[]` |
| SAL-PRC-01 | Process | Quy trình bán hàng của bạn từ tìm khách đến chốt là gì? | `industry.process` |
| SAL-FAIL-01 | Failure | Deal thất bại lớn nhất và bài học? | `failures[]` |

### D. Tài chính / Kế toán / Kiểm toán (`FIN`)

| ID | Nhóm | Câu hỏi | → field |
|---|---|---|---|
| FIN-IMP-01 | Impact | Bạn quản lý hoặc phân tích khoản tiền/ngân sách quy mô nào? | `impact.scale` |
| FIN-IMP-02 | Impact | Bạn tiết kiệm hoặc phát hiện sai sót bao nhiêu? | `impact.metric` |
| FIN-PS-01 | Problem solving | Kể về lần bạn phát hiện sai lệch số liệu hoặc rủi ro. Bạn xử lý thế nào? | `problems[]` |
| FIN-TECH-01 | Technical | Chuẩn mực (VAS/IFRS), phần mềm (Excel nâng cao, SAP, MISA, ERP), quy trình đóng sổ? | `skills.hard[]` |
| FIN-PRS-01 | Pressure | Bạn xử lý áp lực deadline (quyết toán, kiểm toán) ra sao? | `industry.pressure_handling` |
| FIN-CERT-01 | Certifications | ACCA, CFA, CPA: tiến độ hoàn thành? | `certifications[]` |

### E. Nhân sự (HR) / Tuyển dụng (`HR`)

| ID | Nhóm | Câu hỏi | → field |
|---|---|---|---|
| HR-IMP-01 | Impact | Bạn tuyển bao nhiêu vị trí, time-to-hire là bao lâu? | `impact.metric` |
| HR-IMP-02 | Impact | Tỷ lệ offer được chấp nhận, tỷ lệ nghỉ việc thay đổi thế nào? | `impact.metric` |
| HR-PS-01 | Problem solving | Kể về lần tuyển vị trí khó hoặc xử lý mâu thuẫn nội bộ. | `problems[]` |
| HR-PRG-01 | Programs | Bạn triển khai chương trình đào tạo, onboarding, đánh giá hiệu suất nào? | `industry.programs` |
| HR-LEAD-01 | Leadership | Bạn tư vấn cho quản lý ra sao khi họ không đồng ý với bạn? | `leadership[]` |

### F. Giáo dục / Đào tạo (`EDU`)

| ID | Nhóm | Câu hỏi | → field |
|---|---|---|---|
| EDU-ACH-01 | Achievement | Kết quả học viên (điểm, tỷ lệ đỗ, tiến bộ) dưới sự giảng dạy của bạn? | `achievements[]` |
| EDU-IMP-01 | Impact | Bạn thiết kế giáo trình, khóa học nào? | `industry.curricula` |
| EDU-IMP-02 | Impact | Số học viên, mức độ hài lòng? | `impact.scale`, `metric` |
| EDU-PS-01 | Problem solving | Kể về học viên khó hoặc lớp học gặp vấn đề. Bạn xử lý thế nào? | `problems[]` |
| EDU-LRN-01 | Learning | Phương pháp giảng dạy bạn thử nghiệm và cải tiến từ feedback? | `learning[]` |

### G. Y tế / Dược / Chăm sóc sức khỏe (`MED`)

> Lưu ý: nhắc người dùng không nêu thông tin định danh bệnh nhân.

| ID | Nhóm | Câu hỏi | → field |
|---|---|---|---|
| MED-EXP-01 | Experience | Chuyên khoa, quy mô bệnh nhân/ca mỗi ngày, môi trường (bệnh viện, phòng khám, nhà thuốc)? | `experience[]` |
| MED-PS-01 | Problem solving | Kể về ca/tình huống khẩn cấp hoặc phức tạp bạn xử lý. | `problems[]` |
| MED-IMP-01 | Impact | Cải tiến quy trình, giảm sai sót, nâng chỉ số hài lòng của người bệnh? | `impact.metric` |
| MED-CMP-01 | Compliance | Chứng chỉ hành nghề, đào tạo liên tục, quy định bạn tuân thủ? | `certifications[]` |

### H. Thiết kế / Sáng tạo: UI/UX, Graphic, Video (`DES`)

| ID | Nhóm | Câu hỏi | → field |
|---|---|---|---|
| DES-ACH-01 | Achievement | Dự án/sản phẩm thiết kế nổi bật nhất? Portfolio link? | `projects[]`, `link` |
| DES-IMP-01 | Impact | Thiết kế của bạn cải thiện điều gì? (conversion, retention, thời gian hoàn thành tác vụ, nhận diện thương hiệu) | `impact.metric` |
| DES-PRC-01 | Process | Quy trình từ brief đến bàn giao? Bạn xử lý phản hồi, chỉnh sửa liên tục thế nào? | `industry.process` |
| DES-RES-01 | Research | Bạn dùng user research, A/B test, usability test không? | `industry.research` |
| DES-TOOL-01 | Tools | Figma, Adobe, Blender, After Effects… bạn dùng thành thạo công cụ nào? | `skills.hard[]` |

### I. Vận hành / Logistics / Sản xuất / Chuỗi cung ứng (`OPS`)

| ID | Nhóm | Câu hỏi | → field |
|---|---|---|---|
| OPS-IMP-01 | Impact | Bạn cải thiện năng suất, tỷ lệ lỗi, thời gian giao hàng, chi phí tồn kho bao nhiêu %? | `impact.metric` |
| OPS-PS-01 | Problem solving | Kể về lần gián đoạn chuỗi cung ứng hoặc dây chuyền. Bạn xử lý thế nào? | `problems[]` |
| OPS-MTH-01 | Methods | Lean, Six Sigma, 5S, Kaizen, ERP/WMS: bạn đã áp dụng cái nào, vào việc gì? | `skills.hard[]` |
| OPS-LEAD-01 | Leadership | Bạn quản lý ca, nhóm công nhân/nhà cung cấp ra sao? | `leadership[]` |
| OPS-QLT-01 | Safety/Quality | Bạn đảm bảo an toàn và chất lượng (ISO, HACCP…) thế nào? | `certifications[]`, `industry.quality` |

### J. Sinh viên mới ra trường / Chuyển ngành (`FRS`)

| ID | Nhóm | Câu hỏi | → field |
|---|---|---|---|
| FRS-ACH-01 | Achievement | Điểm nổi bật trong học tập, đồ án, luận văn, cuộc thi? | `achievements[]` |
| FRS-TRF-01 | Transferable | Việc nào ở trường, CLB, làm thêm cho thấy kỹ năng phù hợp với vị trí mục tiêu? | `skills.transferable[]` |
| FRS-MOT-01 | Motivation | Vì sao bạn chọn ngành/vị trí này? Điều gì chứng minh bạn nghiêm túc? | `goals.motivation` |
| FRS-CHG-01 | Career change | Vì sao chuyển ngành, và bạn đã làm gì để chuẩn bị? (khóa học, dự án, mentor) | `turning_points[]`, `goals.gaps` |

---

## Phần 5: Thư viện Follow-up Probes

AI dùng khi câu trả lời còn chung chung. Tối đa **2 probe mỗi câu hỏi**.

| Loại | Câu probe | Dùng khi |
|---|---|---|
| Cụ thể hóa | "Bạn có thể cho một ví dụ cụ thể không?" | Câu trả lời trừu tượng |
| Định lượng | "Con số hoặc mức độ thay đổi là bao nhiêu?" | Thiếu số liệu |
| Vai trò cá nhân | "Phần nào do riêng bạn làm?" | Dùng "chúng tôi", "nhóm mình" |
| Bối cảnh | "Lúc đó khó khăn hoặc giới hạn là gì?" | Thiếu bối cảnh |
| Hệ quả | "Sau đó chuyện gì xảy ra?" | Câu chuyện dừng giữa chừng |
| Bằng chứng | "Có tài liệu hay người nào xác nhận không?" | Cần xác thực |

**Quy tắc khi thiếu số liệu:** AI gợi ý ước lượng ("khoảng bao nhiêu?") và gắn cờ `estimated: true`. AI không tự bịa số.

---

## Thống kê nhanh

| Hạng mục | Số câu |
|---|---|
| Core (Achievement, Impact, Leadership, Problem Solving, Learning, Career Goal) | 31 |
| Nền tảng (Experience, Skills, Activities, Projects) | 7 |
| Career Story | 6 |
| Industry Modules (10 ngành) | 54 |
| **Tổng** | **98** |

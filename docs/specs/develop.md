Mình sẽ tách lộ trình Application Hub của ProfileHub thành từng tính năng độc lập theo góc nhìn Business Analyst và Product Developer, để bạn có thể đưa vào tài liệu đặc tả rồi phát triển từng phần mà không bị chồng chéo.

Điểm quan trọng nhất: không nên xem 5 màn hình MVP là 5 tính năng riêng biệt. Một màn hình có thể chứa nhiều tính năng, và một tính năng có thể xuất hiện ở nhiều màn hình. Vì vậy, mình sẽ phân tách theo module → tính năng → hành vi người dùng → quy tắc nghiệp vụ → dữ liệu → thứ tự triển khai.

# 1. Tổng quan kiến trúc tính năng Application Hub

## Application Hub

Trung tâm quản lý toàn bộ hành trình ứng tuyển

1\. Dashboard

Tổng quan và công việc cần làm

2\. Application Management

Tạo, xem, sửa, lưu trữ hồ sơ ứng tuyển

3\. Pipeline

Theo dõi và cập nhật trạng thái

4\. CV & JD

Liên kết JD và phiên bản CV

5\. Interview Workspace

Lịch phỏng vấn, ghi chú, phản hồi

6\. Analytics

Thống kê và tỷ lệ chuyển đổi

Các module AI mở rộng

AI phân tích JD · Gợi ý CV · Chuẩn bị phỏng vấn · So sánh Offer · Phân tích nghề nghiệp

Đây là kiến trúc đề xuất, chưa phải quyết định kỹ thuật bắt buộc. Với MVP, nên ưu tiên quản lý ứng tuyển, trạng thái, JD và CV trước; các module AI nâng cao phát triển sau khi dữ liệu nền đã ổn định.

# 2. Phân tách chi tiết từng module

## Module 1 — Application Management (Quản lý hồ sơ ứng tuyển)

[JobTrakr - Track Your Job Applications](https://images.openai.com/static-rsc-4/ij_euZNKiIToYBlkgSJGS9fqMCnnGnVdb5Kn1AApjcr3kRug1NRzs74FxyP8mTyBBS4hJaOg0dgR1kOZ5WkdloPTErW4TYgOD_PCNjUDiKJFrvDEUN0V8EUQ3pLhugPLR_Gw-bCMwPT4MnsxSWf0JusVvdZOYmpZDjwRogYAEH4?purpose=inline)

Mục tiêu: Cho phép ứng viên quản lý mỗi cơ hội việc làm thành một hồ sơ ứng tuyển riêng.

Đây là module nền tảng. Các module Pipeline, Interview, Dashboard và Analytics đều sử dụng dữ liệu từ đây.

### 1.1. Tạo hồ sơ ứng tuyển — Create Application

Người dùng bấm `+ Thêm ứng tuyển` và nhập thông tin công việc.

| Trường dữ liệu       | Bắt buộc?      | Mô tả                               |
| -------------------- | -------------- | ----------------------------------- |
| Company              | Có             | Tên công ty                         |
| Position             | Có             | Vị trí ứng tuyển                    |
| Job Description (JD) | Không          | Nội dung JD hoặc tệp JD             |
| Job URL              | Không          | Đường dẫn tin tuyển dụng            |
| Source               | Không          | LinkedIn, TopCV, Website công ty... |
| CV version           | Không          | Phiên bản CV sử dụng                |
| Applied date         | Tùy trạng thái | Ngày ứng tuyển thực tế              |
| Status               | Có             | Trạng thái ban đầu                  |
| Notes                | Không          | Ghi chú cá nhân                     |

Quy tắc nghiệp vụ cần xác định:

- Tạo hồ sơ mới mặc định ở trạng thái `Saved`.
- Chỉ ghi nhận ngày ứng tuyển thực tế khi người dùng xác nhận đã ứng tuyển.
- Nếu chưa có CV, người dùng vẫn được tạo hồ sơ và bổ sung CV sau.
- Một công ty có thể có nhiều vị trí tuyển dụng; không được coi tên công ty là khóa duy nhất.
- Nếu người dùng nhập JD hoặc URL đã tồn tại, có thể cảnh báo trùng lặp nhưng không tự động gộp hai hồ sơ.

### 1.2. Xem danh sách — Application List

Các chức năng cần phát triển:

- Hiển thị danh sách hồ sơ ứng tuyển.
- Tìm kiếm theo công ty hoặc vị trí.
- Lọc theo trạng thái, nguồn tuyển dụng, ngày ứng tuyển.
- Sắp xếp theo ngày tạo, ngày ứng tuyển hoặc lần cập nhật gần nhất.
- Chuyển nhanh sang trang chi tiết.
- Chỉnh sửa và lưu trữ hồ sơ.
- Xóa hồ sơ sau khi xác nhận.

Tiêu chí nghiệm thu: Khi người dùng chỉnh sửa hoặc thay đổi trạng thái, danh sách phải hiển thị dữ liệu mới nhất sau khi máy chủ xác nhận lưu thành công.

### 1.3. Chi tiết hồ sơ — Application Detail

Đây là trang trung tâm cho từng công việc, có thể chia thành các tab:

Overview

Thông tin công ty, vị trí, trạng thái, ngày ứng tuyển

Job Description

Nội dung JD, URL nguồn và thời điểm lưu JD

CV & Documents

CV được sử dụng, phiên bản và tệp đính kèm

Activity History

Lịch sử đổi trạng thái, chỉnh sửa và sự kiện quan trọng

### 1.4. Sửa, lưu trữ và xóa

Tách thành ba hành vi khác nhau:

- Edit: Cập nhật thông tin công việc.
- Archive: Đưa hồ sơ không còn hoạt động ra khỏi danh sách chính nhưng vẫn giữ dữ liệu.
- Delete: Xóa hồ sơ sau khi xác nhận, theo chính sách lưu trữ dữ liệu đã quy định.

Đề xuất: ưu tiên Archive trong MVP. Xóa cần xử lý rõ các dữ liệu liên quan như ghi chú, lịch phỏng vấn và tài liệu đính kèm.

## Module 2 — Pipeline (Quản lý tiến trình ứng tuyển)

[JobTrakr - Track Your Job Applications](https://images.openai.com/static-rsc-4/GBz0SdcV-rKOoe3N5-7sYAIUhwMo_CQ2rWAe9z15OWRFECqNX-X0zPcYJE3x0qbzAtHO1HMNinoFRxv207uguRHWx-BT8Z4QpdAz9I1xStcPi5OdxlXZD82XkIzQNvwj1Qw_-5MEsr97jjpqg5-itk3_FEe9FVPM2i5Vs9eOjBg?purpose=inline)

Mục tiêu: Giúp ứng viên biết mỗi hồ sơ đang ở giai đoạn nào và cập nhật trạng thái nhanh chóng.

Đây là cách hiển thị trực quan dữ liệu Application Management, không phải một bộ dữ liệu độc lập.

### 2.1. Định nghĩa trạng thái

Lộ trình gốc có nhiều trạng thái. Để MVP dễ dùng và dễ phát triển, mình đề xuất:

| Trạng thái          | Ý nghĩa                                |
| ------------------- | -------------------------------------- |
| Saved               | Đã lưu cơ hội việc làm                 |
| Preparing           | Đang chuẩn bị CV, hồ sơ hoặc kiến thức |
| Applied             | Đã nộp hồ sơ                           |
| HR Interview        | Đang ở vòng phỏng vấn HR               |
| Technical Interview | Đang ở vòng chuyên môn                 |
| Final Interview     | Đang ở vòng cuối                       |
| Offer               | Đã nhận được đề nghị công việc         |
| Rejected            | Đã nhận thông báo không tiếp tục       |
| Withdrawn           | Ứng viên chủ động rút hồ sơ            |

`Withdrawn` là trạng thái bổ sung đề xuất để phân biệt việc ứng viên chủ động dừng với việc bị từ chối.

### 2.2. Kéo thả thẻ Kanban

Mỗi thẻ thể hiện tối thiểu:

- Tên công ty.
- Vị trí.
- Ngày ứng tuyển.
- CV đã sử dụng.
- Ngày phỏng vấn tiếp theo nếu có.
- Trạng thái hiện tại.

Khi kéo một thẻ sang cột mới, hệ thống phải:

1. Kiểm tra quyền cập nhật.
2. Kiểm tra trạng thái mới hợp lệ.
3. Lưu trạng thái lên máy chủ.
4. Ghi lịch sử chuyển trạng thái.
5. Cập nhật Dashboard và Analytics.
6. Nếu lưu thất bại, khôi phục thẻ về trạng thái trước đó và thông báo lỗi.

Lưu ý: Kéo thả chỉ là một cách cập nhật. Người dùng cũng cần có thể thay đổi trạng thái trong trang chi tiết để hỗ trợ mobile và accessibility.

### 2.3. Lịch sử trạng thái

Mỗi lần chuyển trạng thái cần lưu:

- Trạng thái cũ.
- Trạng thái mới.
- Thời điểm chuyển.
- Người thực hiện.
- Nguồn thay đổi, ví dụ thao tác trong Kanban hoặc trang chi tiết.

Không nên chỉ lưu trạng thái mới nhất vì sau này Analytics cần biết hồ sơ đã mất bao lâu ở từng giai đoạn.

### 2.4. Quy tắc chuyển trạng thái

Đây là vấn đề cần chốt trước khi code:

- Có cho phép chuyển từ `Rejected` về `Applied` không?
- Có cho phép chuyển thẳng từ `Saved` sang `Technical Interview` không?
- Có cho phép sửa trạng thái nếu người dùng nhập sai không?

Đề xuất MVP: Cho phép chuyển linh hoạt giữa các trạng thái, nhưng yêu cầu xác nhận khi chuyển sang `Rejected`, `Withdrawn` hoặc `Offer`. Mọi thay đổi đều phải lưu lịch sử. Cách này linh hoạt hơn việc ép mọi hồ sơ phải đi qua từng cột.

## Module 3 — CV & JD Management (Quản lý CV theo công việc)

[Resumatic Features, Pricing, and Alternatives | AI Tools](https://images.openai.com/static-rsc-4/PLMqp_QbHGfrwXeP2BFpWxe4ZZLo3AN6N5LBNFSmLKXPx9g3mwAOHbqcXOJvFP487Y9lzkC-xw3wGQfpjOzdudeW0-RKO4yUq9nqxVMc7ur6t7mSohT0gPd-fpCRddWcZ_yjVXYeUHjTusgXo14f-5xTVF_qmD7LtVwEUR0k9YE?purpose=inline)

Mục tiêu: Biết chính xác ứng viên đã dùng phiên bản CV nào để ứng tuyển từng vị trí.

Module này kết nối Application Hub với CV Builder hiện có trong định hướng ProfileHub.

### 3.1. Gắn CV vào hồ sơ ứng tuyển

Các chức năng:

- Chọn CV từ danh sách CV của người dùng.
- Hiển thị tên phiên bản, ngày cập nhật và trạng thái.
- Xem trước CV đã chọn.
- Thay đổi CV trước khi ứng tuyển.
- Đánh dấu CV được sử dụng khi nộp hồ sơ.
- Xem lại CV đã dùng sau khi ứng tuyển.

Ví dụ:

| Application               | CV sử dụng |
| ------------------------- | ---------- |
| Shopee — Backend Engineer | Backend v3 |
| VNG — Backend Developer   | Backend v4 |
| FPT — Java Developer      | Java v2    |

### 3.2. Bảo toàn lịch sử CV

Đây là quy tắc quan trọng về dữ liệu.

Giả sử người dùng nộp CV `Backend v3` cho Shopee, sau đó chỉnh sửa Master Profile và tạo `Backend v4`.

Hệ thống không được tự động thay đổi nội dung CV v3 đã nộp.

Đề xuất thiết kế:

- Mỗi Application tham chiếu đến một phiên bản CV cụ thể.
- Phiên bản CV đã chốt được giữ nguyên nội dung.
- Chỉnh sửa CV tạo bản nháp hoặc phiên bản mới.
- Thay đổi CV gắn với Application đã nộp phải có thao tác xác nhận rõ ràng.
- Nếu chưa có CV, Application vẫn hoạt động bình thường.

### 3.3. Lưu JD theo từng Application

Các tính năng:

- Dán nội dung JD.
- Nhập URL JD.
- Chỉnh sửa nội dung JD đã lưu.
- Ghi nhận nguồn và thời điểm thu thập.
- Xem lại JD ngay cả khi tin tuyển dụng gốc không còn truy cập được.

Nếu sau này hệ thống có chức năng tự lấy JD từ URL, cần xử lý URL không hợp lệ, trang yêu cầu đăng nhập, nội dung bị chặn và JD đã thay đổi. Không nên mặc định rằng hệ thống có thể đọc được mọi trang tuyển dụng.

### 3.4. Liên kết với AI phân tích JD

Đây là phần mở rộng sau MVP:

1. Đọc JD đã lưu.
2. Trích xuất kỹ năng, kinh nghiệm và yêu cầu.
3. So sánh với CV được gắn vào Application.
4. Đưa ra mức độ phù hợp và bằng chứng giải thích.
5. Gợi ý chỉnh sửa CV.
6. Cho phép người dùng chấp nhận hoặc từ chối từng đề xuất.

AI chỉ đưa ra đề xuất; không tự ghi đè CV đã chốt hoặc tự thay đổi thông tin cá nhân, kinh nghiệm của ứng viên.

## Module 4 — Interview Workspace (Quản lý phỏng vấn)

[Poised for Interviewing](https://images.openai.com/static-rsc-4/th1HEpv5zNBogC_mcUnmO0f9QBFrHvjSkIIFq2t6AzNBLw4b9_ym8uTIlYaMnwSd6pFx68TcLUgJsRWvAVpns2fWxrg0AaQy-121OyKg5gmUKKCSwJqjTMbYRJBFWYJc2JRKINKSKsn2Jd8wMAGC2OXwcmrqtlDRK_GmKeMKD4M?purpose=inline)

Mục tiêu: Lưu toàn bộ thông tin trước, trong và sau mỗi vòng phỏng vấn.

Mỗi lần phỏng vấn phải là một bản ghi riêng, thay vì ghi đè thông tin của vòng trước.

### 4.1. Quản lý lịch phỏng vấn

Các trường dữ liệu:

- Ngày và giờ.
- Hình thức: online hoặc trực tiếp.
- Loại vòng: HR, Technical, Final hoặc Other.
- Người phỏng vấn.
- Link họp hoặc địa điểm.
- Trạng thái lịch: dự kiến, đã diễn ra, đã hủy hoặc đổi lịch.

Các thao tác:

- Tạo lịch.
- Chỉnh sửa lịch.
- Hủy hoặc đổi lịch.
- Xem lịch theo từng Application.
- Sắp xếp theo ngày gần nhất.

Thông báo nhắc lịch hoặc đồng bộ Google Calendar có thể phát triển ở giai đoạn sau, không cần đưa vào MVP ban đầu.

### 4.2. Interview Notes

Mỗi buổi phỏng vấn có một trang ghi chú riêng:

| Nhóm thông tin | Nội dung                                  |
| -------------- | ----------------------------------------- |
| Questions      | Câu hỏi đã được hỏi                       |
| My Answers     | Cách ứng viên đã trả lời                  |
| Feedback       | Phản hồi nhận được                        |
| Self-review    | Tự đánh giá điểm mạnh, điểm cần cải thiện |
| Next Steps     | Việc cần chuẩn bị cho vòng tiếp theo      |

Cần hỗ trợ lưu nháp và chỉnh sửa ghi chú mà không làm mất nội dung trước đó.

### 4.3. AI Interview Preparation — giai đoạn sau

Khi Application chuyển sang `Technical Interview`, hệ thống có thể đề xuất:

- Câu hỏi theo yêu cầu trong JD.
- Câu hỏi theo kỹ năng trong CV đã nộp.
- Câu hỏi dựa trên dự án thực tế của ứng viên.
- Bài tập tình huống phù hợp với vị trí.
- Gợi ý chủ đề cần ôn tập.

Sau buổi phỏng vấn, AI có thể tổng hợp ghi chú thành các nhóm kỹ năng cần cải thiện. Các đánh giá phải dựa trên dữ liệu có sẵn, không tự khẳng định ứng viên thiếu kỹ năng nếu chưa có bằng chứng.

## Module 5 — Application Dashboard (Tổng quan ứng tuyển)

[Jobflow - Job Application Management Dashboard | Raya Aldyen Dessario](https://images.openai.com/static-rsc-4/ghr3wROZVdisTu1S5hcwnQg-OWBoZV4tYuSiWYtgdRiUHM5DF-se692TC0t_A3eVvto9jwKm63-W7BawQ7J79eAgyQF_pr91zmCQ1r4GhN6_hRdITvqvLctRe0UOszqM1xGgAnViNBYWzN9Yy-NlkatuZa_2jqko_alCeVuIxPA?purpose=inline)

Mục tiêu: Giúp người dùng hiểu tình hình ứng tuyển ngay khi mở ProfileHub.

Dashboard chủ yếu tổng hợp dữ liệu từ các module khác, không cần một hệ thống nhập liệu riêng.

### 5.1. KPI Cards

Các chỉ số đề xuất:

- Tổng số cơ hội đã lưu.
- Số hồ sơ đã ứng tuyển.
- Số hồ sơ đang trong quy trình.
- Số vòng phỏng vấn.
- Số Offer.
- Số hồ sơ bị từ chối.

Phải định nghĩa rõ cách đếm. Ví dụ, một Application đi qua ba vòng phỏng vấn vẫn chỉ là một hồ sơ ứng tuyển, nhưng có thể có ba bản ghi phỏng vấn.

### 5.2. Công việc cần thực hiện

Dashboard có thể hiển thị:

- Lịch phỏng vấn sắp tới.
- Hồ sơ đang chuẩn bị nhưng chưa nộp.
- Hồ sơ cần cập nhật ghi chú.
- Application chưa có CV được gắn.
- Các công việc người dùng tự đánh dấu cần theo dõi.

Đây là nhóm tính năng giúp Application Hub có lý do để người dùng quay lại hàng ngày.

### 5.3. Bộ lọc thời gian

Cho phép xem dữ liệu theo:

- 7 ngày gần nhất.
- 30 ngày gần nhất.
- 90 ngày gần nhất.
- Khoảng thời gian tùy chỉnh.

Cần thống nhất cách tính theo ngày tạo hồ sơ hay ngày ứng tuyển. Hai cách này phản ánh hai hành vi khác nhau.

## Module 6 — Analytics (Phân tích hiệu quả ứng tuyển)

Khác Dashboard, Analytics tập trung vào xu hướng, tỷ lệ chuyển đổi và những điều người dùng có thể cải thiện.

### 6.1. Các chỉ số cơ bản

| Chỉ số                 | Cách tính đề xuất                                                  |
| ---------------------- | ------------------------------------------------------------------ |
| Applications submitted | Số Application có ngày ứng tuyển trong khoảng thời gian            |
| Interview rate         | Số Application đã vào vòng phỏng vấn / số Application đã ứng tuyển |
| Offer rate             | Số Application có Offer / số Application đã ứng tuyển              |
| Rejection rate         | Số Application bị từ chối / số Application đã ứng tuyển            |
| Average response time  | Thời gian trung bình từ ngày ứng tuyển đến phản hồi đầu tiên       |

Các tỷ lệ cần được tính theo từng Application, không tính mỗi vòng phỏng vấn thành một hồ sơ riêng. Nên quy định cách xử lý hồ sơ vẫn đang chờ kết quả và hồ sơ đã rút.

### 6.2. Phân tích nâng cao

Sau khi có đủ dữ liệu, có thể phát triển:

- So sánh tỷ lệ phản hồi theo nguồn tuyển dụng.
- So sánh kết quả theo nhóm vị trí.
- Thời gian trung bình ở mỗi giai đoạn.
- Kỹ năng xuất hiện thường xuyên trong JD.
- Mối liên hệ giữa kỹ năng trong CV và kết quả ứng tuyển.

Ví dụ, nhận định “AWS xuất hiện trong 65% JD” chỉ có ý nghĩa nếu hệ thống đã thu thập và phân tích JD của một tập dữ liệu xác định. Không được mặc định rằng AWS là nguyên nhân khiến ứng viên bị loại.

# 3. Các module mở rộng của ProfileHub

Các tính năng dưới đây không nên phát triển cùng lúc với MVP, nhưng cần thiết kế Application Hub sao cho có thể mở rộng.

[AI Job Matching Analyzer: Score Your Resume Against Any Job | Resume Optimizer Pro](https://images.openai.com/static-rsc-4/4Re4HdhA3iW2GUb4v-5vWC4lQJdFs6U06aajSjyMgfaazAPIp5-zK6Eb5LpkZOJuy_GQN6Nrwl4LrD7Q0FI4MH5sZlhXC6wdj5jWazV2LBAj5Aodl490prKObj8kPPzzS3kSflhW46XGZQeJja2QM--3g6LXupO4IsCW2tU1VqE?purpose=inline)

7\. AI Job & CV Matching

- Phân tích JD.
- So sánh với CV đã chọn.
- Hiển thị kỹ năng đáp ứng và kỹ năng chưa có bằng chứng.
- Gợi ý sửa CV và giải thích từng đề xuất.
- Lưu kết quả phân tích theo phiên bản JD/CV.

[Job Offer Comparison Tool - How to Evaluate Job Offers](https://images.openai.com/static-rsc-4/ANtBHgnjACrfz8YEojxKmzFVOD2fsDQcW2apAStSq08kmMwUwe1WV5rr1a65a0JoMnuJ-_ikUzeRWRSm7-Mgsz8Fkir7mf-ranka9cW8iUhO5CEctZ09zNteKhZynQcYCBvYVcwJl46wDUPVZC49Yj-YugyiIH4ttjacl5IYctw?purpose=inline)

8\. Offer Comparison

- Lưu nhiều Offer.
- So sánh lương, thưởng, phúc lợi và địa điểm.
- Theo dõi hạn phản hồi.
- Ghi chú ưu tiên cá nhân.
- Hỗ trợ so sánh, không tự quyết định thay ứng viên.

[ResumeForgeAI](https://images.openai.com/static-rsc-4/FmuLcafMzEg2hv8Ujz_5jo6-8v47Nz69glr2wQODX4PXsKSkBLNF1v2J4R0T5uTYt1JB7s-MXr_5tdPFFZLNxzohEeuTMuySndefVh00sFXwFLrEce6igk8r60cCg1HwRA7cNKLowSgQy5LTYHQjKyaniucyUHAWnHvnqlatia8?purpose=inline)

9\. Career Analytics & Career Copilot

- Phân tích lịch sử ứng tuyển.
- Tổng hợp kỹ năng xuất hiện trong các JD.
- Tìm các điểm yếu có bằng chứng trong hồ sơ.
- Gợi ý kỹ năng nên học.
- Theo dõi tiến bộ theo thời gian.

# 4. Phân tách 5 màn hình MVP thành các chức năng cụ thể

Đây là danh sách để bạn đưa vào backlog phát triển.

| Màn hình              | Các chức năng                                                  |
| --------------------- | -------------------------------------------------------------- |
| 1. Dashboard          | KPI, lịch phỏng vấn, việc cần làm, lối tắt tạo Application     |
| 2. Application List   | Danh sách, tìm kiếm, lọc, sắp xếp, tạo mới, chỉnh sửa, lưu trữ |
| 3. Application Detail | Thông tin công việc, JD, CV, ghi chú, lịch sử trạng thái       |
| 4. Kanban Board       | Hiển thị theo cột, kéo thả, cập nhật trạng thái, ghi lịch sử   |
| 5. Analytics          | Số hồ sơ ứng tuyển, tỷ lệ phỏng vấn, Offer và từ chối          |

Lưu ý: Interview Workspace là một nhóm chức năng có thể nằm bên trong Application Detail trong MVP, chưa nhất thiết cần thêm màn hình chính thứ sáu.

# 5. Thiết kế dữ liệu trước khi phát triển

Với định hướng ProfileHub, bạn nên tách các thực thể nghiệp vụ như sau.

User

Chủ sở hữu dữ liệu

Application

Company · Position · Status · Applied date · JD snapshot

Application CV

Liên kết phiên bản CV đã chọn

Status History

Lịch sử chuyển trạng thái

Interview

Lịch, câu hỏi, ghi chú, feedback

Application Activity

Sự kiện và thao tác quan trọng

Đây là mô hình khái niệm, chưa phải ERD cuối cùng. Khi chuyển thành database, cần chốt thêm các trường ID, khóa ngoại, kiểu dữ liệu, trạng thái xóa, quy tắc phân quyền và tính nhất quán giao dịch.

Một số nguyên tắc cần giữ:

- Mọi Application phải thuộc đúng User sở hữu.
- Mỗi CV được gắn vào Application phải tham chiếu đúng phiên bản CV.
- Việc cập nhật trạng thái và ghi lịch sử cần nhất quán: không để trạng thái đổi nhưng lịch sử bị mất.
- Dashboard và Analytics phải lấy từ dữ liệu nghiệp vụ đã lưu, không lưu các số tổng hợp thủ công làm nguồn chính.
- Nếu một JD có thể thay đổi theo thời gian, cần phân biệt nội dung JD đang lưu với các phiên bản JD được dùng để phân tích.

# 6. Thứ tự phát triển đề xuất

1Giai đoạn 1 — Nền tảng ApplicationƯu tiên đầu tiênChốt Use Case và quy tắc nghiệp vụThiết kế database và APITạo ApplicationXem, sửa, tìm kiếm, lọc và lưu trữ hồ sơGắn JD và CV phiên bản cụ thểĐiều kiện hoàn thành: Người dùng có thể quản lý hồ sơ ứng tuyển hoàn chỉnh mà chưa cần AI.

2Giai đoạn 2 — PipelineSau giai đoạn 1

3Giai đoạn 3 — Interview WorkspaceSau Pipeline

4Giai đoạn 4 — Dashboard & AnalyticsSau khi dữ liệu nền ổn định

5Giai đoạn 5 — AI Career CopilotMở rộng sau MVP

# 7. Các vấn đề cần chốt trước khi code

Không nên tự quyết định tất cả những điểm sau trong lúc lập trình. Đây là các câu hỏi nghiệp vụ có thể ảnh hưởng đến kiến trúc.

1\. Một Application đại diện cho điều gì?

Một lần ứng tuyển vào một vị trí

Một vị trí tuyển dụng, có thể có nhiều lần ứng tuyển

Đề xuất ban đầu: Một lần ứng tuyển vào một vị trí

2\. Quản lý CV đã nộp như thế nào?

Giữ nguyên snapshot của phiên bản CV đã nộp

Luôn hiển thị CV mới nhất

Đề xuất ban đầu: Giữ nguyên snapshot của phiên bản CV đã nộp

3\. Quản lý JD như thế nào?

Lưu nội dung JD theo từng Application

Chỉ lưu URL của JD

Đề xuất ban đầu: Lưu nội dung JD theo từng Application

4\. Quản lý trạng thái?

Cho phép chuyển linh hoạt và ghi lịch sử

Bắt buộc đi tuần tự từng trạng thái

Đề xuất ban đầu: Cho phép chuyển linh hoạt và ghi lịch sử

5\. Khi người dùng ngừng theo dõi?

Archive để giữ lịch sử

Xóa ngay hồ sơ

Đề xuất ban đầu: Archive để giữ lịch sử

Tiếp tục đặc tả theo lựa chọn

## Kết luận

Mình đề xuất bạn phát triển theo thứ tự: Application Management → Pipeline → Interview Workspace → Dashboard & Analytics → AI Career Copilot.

Điểm cần làm kỹ nhất không phải giao diện Kanban mà là mô hình dữ liệu và quy tắc nghiệp vụ của Application: trạng thái, lịch sử, JD snapshot, phiên bản CV, dữ liệu phỏng vấn và quyền sở hữu. Nếu nền tảng này đúng, các tính năng AI sau này sẽ dễ mở rộng hơn và ít phải sửa kiến trúc.
# ProfileHub --- Tài liệu khám phá vấn đề và xác định yêu cầu hệ thống

> **Phiên bản:** 0.1 --- Bản khởi đầu để khai thác yêu cầu\
> **Trạng thái:** Ý tưởng / chưa bắt đầu code\
> **Mục tiêu tài liệu:** Làm rõ bài toán, người dùng, phạm vi sản phẩm,
> chức năng, quy tắc AI, dữ liệu, rủi ro và các quyết định cần chốt
> trước khi thiết kế chi tiết hoặc phát triển.

------------------------------------------------------------------------

## 1. Bối cảnh dự án

ProfileHub là ý tưởng xây dựng một nền tảng hỗ trợ người dùng tạo, quản
lý và điều chỉnh CV theo vị trí tuyển dụng. Thay vì chỉ là công cụ tạo
CV theo mẫu, ProfileHub hướng đến việc giúp ứng viên hiểu JD, nhận diện
kinh nghiệm/kỹ năng phù hợp, chọn bằng chứng phù hợp từ hồ sơ của mình
và tạo ra phiên bản CV có mục tiêu cho từng vị trí.

AI đóng vai trò hỗ trợ đọc hiểu JD, trích xuất yêu cầu, đối chiếu với hồ
sơ ứng viên, gợi ý cách trình bày và giải thích lý do đề xuất. Hệ thống
không được tự tạo ra kinh nghiệm, kỹ năng, chứng chỉ, số liệu thành tích
hoặc thông tin cá nhân không có căn cứ trong dữ liệu của ứng viên.

Đây là tài liệu khám phá yêu cầu, không phải bản đặc tả cuối cùng. Những
điểm chưa được người sở hữu dự án xác nhận phải được ghi là **Chưa
chốt**, không tự xem là quyết định chính thức.

## 2. Tầm nhìn và mục tiêu

### 2.1 Tầm nhìn dự kiến

Trở thành nơi ứng viên xây dựng một hồ sơ nghề nghiệp gốc, quản lý nhiều
phiên bản CV và tạo CV có định hướng theo từng JD một cách minh bạch, có
kiểm soát.

### 2.2 Mục tiêu sản phẩm dự kiến

1.  Cho phép người dùng tạo, nhập, chỉnh sửa và lưu hồ sơ nghề nghiệp.
2.  Cho phép tạo CV từ hồ sơ gốc và các mẫu trình bày.
3.  Cho phép dán hoặc tải lên JD để hệ thống phân tích vị trí tuyển
    dụng.
4.  Đối chiếu yêu cầu JD với bằng chứng có trong hồ sơ.
5.  Đề xuất phiên bản CV phù hợp với JD mà không bóp méo sự thật.
6.  Cho phép người dùng xem, chấp nhận, sửa hoặc từ chối từng đề xuất
    của AI.
7.  Lưu lịch sử phiên bản CV theo từng vị trí ứng tuyển.
8.  Hỗ trợ xuất CV để nộp ứng tuyển.
9.  Giúp người dùng hiểu điểm mạnh, khoảng trống thông tin và những yêu
    cầu chưa có bằng chứng.

### 2.3 Các kết quả cần kiểm chứng

-   Người dùng có thể tạo CV đầu tiên dễ dàng hơn so với tự định dạng từ
    đầu.
-   Người dùng hiểu vì sao một kinh nghiệm hoặc kỹ năng được đề xuất cho
    JD.
-   Các đề xuất của AI có căn cứ truy ngược về dữ liệu gốc.
-   CV sau khi điều chỉnh vẫn đúng sự thật và do người dùng kiểm soát.
-   Người dùng có thể quản lý nhiều CV mà không làm mất hồ sơ gốc.

**Câu hỏi cần chốt:** Đâu là kết quả quan trọng nhất của phiên bản đầu
tiên: tạo CV, phân tích JD, hay đề xuất CV phù hợp JD?

## 3. Vấn đề người dùng và giả thuyết

### 3.1 Vấn đề giả định

-   Ứng viên chưa biết nên đưa kinh nghiệm nào lên CV cho từng vị trí.
-   CV có thể quá chung chung, chưa làm nổi bật bằng chứng liên quan đến
    JD.
-   Người dùng phải chỉnh sửa và sao chép nhiều phiên bản CV thủ công.
-   JD thường có yêu cầu dài, trộn lẫn yêu cầu bắt buộc và ưu tiên.
-   Công cụ AI có thể viết câu nghe chuyên nghiệp nhưng thêm thông tin
    không đúng.
-   Người dùng khó biết một đề xuất dựa trên dữ liệu nào và có nên tin
    hay không.

### 3.2 Giả thuyết cần kiểm chứng

  -----------------------------------------------------------------------
  Mã                      Giả thuyết              Cách kiểm chứng
  ----------------------- ----------------------- -----------------------
  H1                      Người dùng muốn lưu một Phỏng vấn ứng viên,
                          hồ sơ nghề nghiệp gốc   kiểm thử prototype
                          và tái sử dụng cho      
                          nhiều CV                

  H2                      Phân tích JD trước khi  So sánh quy trình có và
                          sửa CV giúp người dùng  không có phân tích JD
                          ra quyết định tốt hơn   

  H3                      Người dùng cần biết lý  Kiểm thử khả năng hiểu
                          do đằng sau mỗi gợi ý   và mức độ tin cậy
                          AI                      

  H4                      Người dùng muốn chỉnh   Kiểm thử tác vụ chỉnh
                          sửa từng section thay   sửa
                          vì chấp nhận toàn bộ CV 
                          do AI tạo               

  H5                      Xuất PDF là định dạng   Phỏng vấn và khảo sát
                          cần có ở phiên bản đầu  nhu cầu thực tế
  -----------------------------------------------------------------------

Không coi các giả thuyết trên là sự thật cho đến khi có dữ liệu kiểm
chứng.

## 4. Đối tượng người dùng

### 4.1 Ứng viên

Người tạo và quản lý hồ sơ, phân tích JD, tạo CV và chuẩn bị ứng tuyển.

Nhu cầu dự kiến: - Quản lý thông tin cá nhân, học vấn, kinh nghiệm, dự
án, kỹ năng và chứng chỉ. - Tạo CV từ thông tin đã lưu. - Chọn JD để tạo
CV có mục tiêu. - Xem mức độ phù hợp theo từng nhóm yêu cầu và bằng
chứng. - Kiểm soát nội dung AI đề xuất. - Xuất, sao chép hoặc quản lý
phiên bản CV.

### 4.2 Nhà tuyển dụng --- phạm vi cần xác nhận

Có thể mở rộng để nhà tuyển dụng tạo hồ sơ công ty, đăng JD, quản lý ứng
viên hoặc tìm kiếm hồ sơ. Tuy nhiên, đây là một sản phẩm/phạm vi nghiệp
vụ đáng kể và có thể làm phức tạp phiên bản đầu tiên.

**Câu hỏi cần chốt:** ProfileHub ban đầu chỉ phục vụ ứng viên, hay cần
phục vụ cả nhà tuyển dụng ngay từ phiên bản đầu?

### 4.3 Quản trị viên

Có thể chịu trách nhiệm quản lý tài khoản, báo cáo sự cố, kiểm soát nội
dung hệ thống, cấu hình giới hạn sử dụng AI và theo dõi hoạt động vận
hành. Phạm vi quyền hạn phải được xác định rõ để tránh truy cập dữ liệu
CV quá mức cần thiết.

## 5. Nguyên tắc sản phẩm

1.  **Hồ sơ gốc là nguồn dữ liệu chuẩn:** CV theo JD là một phiên bản
    dẫn xuất, không ghi đè hồ sơ gốc.
2.  **AI đề xuất, người dùng quyết định:** Người dùng phải có quyền chấp
    nhận, chỉnh sửa hoặc từ chối nội dung.
3.  **Không bịa thông tin:** Không tự thêm kỹ năng, số năm kinh nghiệm,
    chứng chỉ, thành tích, số liệu hoặc công việc chưa được xác nhận.
4.  **Có thể truy vết:** Đề xuất quan trọng cần chỉ ra dữ liệu hồ sơ nào
    làm căn cứ.
5.  **Tách yêu cầu bắt buộc và ưu tiên:** Không gộp mọi yêu cầu JD thành
    một danh sách có trọng số tùy tiện.
6.  **Không đánh đồng thiếu dữ liệu với thiếu năng lực:** Nếu CV không
    nêu React, chẳng hạn, hệ thống chỉ nên kết luận "chưa thấy bằng
    chứng trong hồ sơ", không khẳng định người đó không biết React.
7.  **Minh bạch điểm số:** Nếu hiển thị điểm phù hợp, phải giải thích ý
    nghĩa, giới hạn và các yếu tố ảnh hưởng.
8.  **Bảo vệ dữ liệu:** CV và thông tin cá nhân cần có quyền truy cập,
    lưu trữ, xóa và xử lý rõ ràng.

## 6. Phạm vi sản phẩm

### 6.1 Phạm vi MVP đề xuất

MVP là phiên bản nhỏ nhất dùng để kiểm chứng giá trị cốt lõi.

-   Đăng ký, đăng nhập và đăng xuất.
-   Tạo và cập nhật hồ sơ nghề nghiệp gốc.
-   Quản lý section CV: thêm, sửa, xóa, sắp xếp.
-   Tạo CV từ hồ sơ gốc.
-   Nhập JD bằng cách dán văn bản; tải tệp có thể để sau nếu làm tăng độ
    phức tạp.
-   AI phân tích JD thành các yêu cầu có cấu trúc.
-   Đối chiếu từng yêu cầu với bằng chứng trong hồ sơ.
-   Đề xuất chọn lọc, sắp xếp hoặc viết lại nội dung CV dựa trên thông
    tin đã có.
-   Người dùng duyệt từng đề xuất.
-   Lưu phiên bản CV theo JD.
-   Xem trước và xuất PDF.
-   Xóa dữ liệu hoặc tài khoản theo chính sách được công bố.

### 6.2 Ngoài phạm vi MVP --- cần xác nhận

-   Cổng tuyển dụng và đăng tin tuyển dụng.
-   Nhà tuyển dụng tìm kiếm, lọc và chấm ứng viên.
-   Nộp hồ sơ trực tiếp tới doanh nghiệp.
-   Đồng bộ LinkedIn hoặc các nền tảng việc làm.
-   Tạo thư xin việc, email ứng tuyển hoặc hồ sơ phỏng vấn.
-   Tự động gửi CV tới nhà tuyển dụng.
-   Phân tích thị trường lao động hoặc dự đoán khả năng trúng tuyển.
-   Thanh toán, gói thuê bao và hệ thống tín dụng AI.
-   Ứng dụng di động.
-   Đa ngôn ngữ toàn diện.

Không phát triển các mục này trước khi xác nhận nhu cầu, chi phí và thứ
tự ưu tiên.

## 7. Luồng nghiệp vụ chính

### 7.1 Luồng tạo CV cơ bản

1.  Người dùng đăng nhập.
2.  Tạo hồ sơ nghề nghiệp gốc.
3.  Thêm thông tin vào các section.
4.  Chọn mẫu CV và thứ tự section.
5.  Xem trước CV.
6.  Chỉnh sửa nội dung và định dạng.
7.  Lưu phiên bản.
8.  Xuất PDF.

### 7.2 Luồng tạo CV theo JD bằng AI

1.  Người dùng chọn hồ sơ gốc hoặc CV hiện có.
2.  Dán JD vào hệ thống.
3.  Hệ thống kiểm tra đầu vào và lưu JD theo quyền riêng tư đã công bố.
4.  AI trích xuất chức danh, kỹ năng, kinh nghiệm, học vấn, chứng chỉ và
    yêu cầu khác.
5.  Hệ thống chuẩn hóa yêu cầu, phân biệt bắt buộc, ưu tiên và thông tin
    không rõ.
6.  Hệ thống đối chiếu từng yêu cầu với bằng chứng trong hồ sơ.
7.  Hệ thống hiển thị:
    -   Yêu cầu JD.
    -   Mức độ bằng chứng: có bằng chứng, bằng chứng một phần, chưa tìm
        thấy bằng chứng, cần người dùng xác nhận.
    -   Trích dẫn hoặc tham chiếu đến section/đoạn hồ sơ làm căn cứ.
    -   Đề xuất hành động.
8.  AI gợi ý chọn nội dung, điều chỉnh thứ tự và cải thiện cách diễn
    đạt, chỉ dựa trên bằng chứng đã có.
9.  Người dùng duyệt từng đề xuất.
10. Hệ thống tạo một phiên bản CV riêng gắn với JD.
11. Người dùng xem trước, chỉnh sửa, lưu và xuất PDF.
12. Hệ thống giữ nguyên hồ sơ gốc và ghi nhận lịch sử phiên bản.

### 7.3 Luồng xử lý khi thiếu bằng chứng

Nếu JD yêu cầu kỹ năng hoặc kinh nghiệm chưa thấy trong CV: - Không tự
thêm kỹ năng đó vào CV. - Hiển thị "Chưa tìm thấy bằng chứng trong hồ
sơ". - Có thể hỏi người dùng có kinh nghiệm liên quan hay không. - Nếu
người dùng xác nhận, yêu cầu họ cung cấp mô tả hoặc bằng chứng trước khi
đưa vào CV. - Nếu người dùng chưa xác nhận, không được trình bày nội
dung đó như một sự thật.

### 7.4 Luồng đưa dự án vào CV và đồng bộ ngược (Project-Driven CV & Reverse Sync)

1. **Phân tách thực thể dữ liệu:**
   - **Master Project:** Dự án gốc lưu trong kho Hồ sơ cá nhân (`projects`), làm nguồn dữ liệu chuẩn.
   - **CV Project Instance:** Bản sao chép độc lập trên từng CV, cho phép tùy biến câu từ và chọn lọc công nghệ phù hợp với JD mà không làm biến đổi Master Project (theo ADR 0001).
2. **Tuyển chọn dự án minh bạch (Project Fit Explainer):**
   - Khi có JD, AI đối chiếu và chấm điểm độ khớp (%) của từng dự án trong kho, nêu rõ lý do (từ khóa trùng khớp, từ khóa thiếu).
   - Ứng viên chủ động xem lý do và tích chọn dự án phù hợp vào CV.
3. **Tối ưu câu chữ STAR & Duyệt so sánh (STAR Adaptation & Diff Review):**
   - AI viết lại câu mô tả theo chuẩn hành động kỹ thuật STAR (Bối cảnh $\to$ Nhiệm vụ $\to$ Giải pháp $\to$ Kết quả số liệu).
   - Hiển thị bảng so sánh Diff Review (câu gốc $\leftrightarrow$ câu AI đề xuất) cho phép duyệt hoặc sửa từng dòng.
   - Tuân thủ Anti-Hallucination Guard: Cấm AI tự ý bịa đặt công nghệ ứng viên chưa từng khai báo.
4. **Phân tầng đóng góp dự án (Scoped Contribution):**
   - Tầng 1: Quy mô sản phẩm chung của nhóm.
   - Tầng 2: Trách nhiệm kỹ thuật cá nhân do ứng viên tự tay thực hiện.
5. **Cơ chế Đồng bộ ngược (Reverse Sync UX):**
   - Form nhập dự án có công tắc mặc định: `[x] Lưu vào Kho Quản lý dự án của tôi`.
   - Nếu ứng viên giữ bật: Khi lưu CV, hệ thống tự động đẩy dự án vào kho `projects`.
   - Nếu ứng viên chủ động gạt **TẮT**: Hệ thống tuyệt đối tôn trọng quyết định của người dùng và **không hỏi lại**.
   - Khi lưu CV có dự án mới chưa được gạt lưu: Hệ thống hiển thị **Non-blocking Action Toast** trượt nhẹ ở góc màn hình có nút `[Đồng bộ ngay ↗]` trong 5 giây, không dùng popup chặn giữa màn hình làm đứt gãy luồng soạn thảo.
6. **Kiểm soát dung lượng trang (Page-Budget Guard):**
   - Thanh đo tỷ lệ đầy trang A4 thời gian thực (0-100%).
   - Khi vượt ngưỡng (> 100%), hỗ trợ 1-click AI Auto-Condense (rút gọn 10-15% giữ nguyên từ khóa) và co khoảng cách dòng (`spacingDensity: compact`).
   - Tự do luân chuyển giữa bố cục 1 cột và 2 cột theo mong muốn của ứng viên.

## 8. Danh mục chức năng dự kiến

  ------------------------------------------------------------------------
  Mã                Nhóm              Chức năng          Ưu tiên MVP
  ----------------- ----------------- ------------------ -----------------
  F-01              Tài khoản         Đăng ký, đăng      Cao
                                      nhập, đăng xuất    

  F-02              Hồ sơ             Tạo/cập nhật hồ sơ Cao
                                      nghề nghiệp gốc    

  F-03              Hồ sơ             Thêm/sửa/xóa/sắp   Cao
                                      xếp section        

  F-04              CV Builder        Chọn mẫu, xem      Cao
                                      trước CV           

  F-05              CV Builder        Chỉnh sửa nội dung Cao
                                      và bố cục          

  F-06              JD                Nhập và quản lý JD Cao

  F-07              AI/JD             Trích xuất yêu cầu Cao
                                      có cấu trúc        

  F-08              Matching          Đối chiếu JD với   Cao
                                      bằng chứng hồ sơ   

  F-09              AI/CV             Đề xuất nội dung   Cao
                                      CV theo JD         

  F-10              Kiểm soát         Duyệt/từ chối/sửa  Cao
                                      đề xuất AI         

  F-11              Phiên bản         Lưu CV riêng theo  Cao
                                      JD                 

  F-12              Xuất              Xuất PDF           Cao

  F-13              Lịch sử           Xem lại phiên bản  Trung bình
                                      và thay đổi        

  F-14              Tệp               Nhập CV từ         Cần xác nhận
                                      PDF/DOCX           

  F-15              Nhà tuyển dụng    Đăng JD và quản lý Chưa chốt
                                      ứng viên           

  F-16              Quản trị          Quản lý người dùng Tối thiểu cần
                                      và vận hành        thiết
  ------------------------------------------------------------------------

## 9. Quy tắc nghiệp vụ cần định nghĩa

### 9.1 Hồ sơ gốc và phiên bản CV

-   Hồ sơ gốc lưu thông tin nghề nghiệp đã xác nhận.
-   CV theo JD tham chiếu đến dữ liệu gốc nhưng có thể chọn lọc section,
    thay đổi thứ tự và có phần diễn đạt riêng.
-   Chỉnh sửa CV theo JD không được tự động ghi đè dữ liệu gốc.
-   Khi dữ liệu gốc thay đổi, hệ thống cần xác định phiên bản CV nào
    được giữ nguyên và phiên bản nào có thể cập nhật.
-   Người dùng cần biết CV nào là bản gốc, bản nháp và bản đã xuất.

### 9.2 Đối chiếu yêu cầu JD

Mỗi yêu cầu JD nên có tối thiểu: - Mã định danh do backend cấp. - Nội
dung yêu cầu gốc. - Nội dung đã chuẩn hóa. - Nhóm yêu cầu: kỹ năng, kinh
nghiệm, học vấn, chứng chỉ, trách nhiệm, ngôn ngữ hoặc yêu cầu khác. -
Phân loại: bắt buộc, ưu tiên, không rõ. - Bằng chứng liên quan trong hồ
sơ. - Trạng thái bằng chứng. - Trạng thái xác nhận của người dùng. -
Giải thích và đề xuất tiếp theo.

Không nên để AI tự tạo điểm số cuối cùng hoặc tự quyết định kết quả
nghiệp vụ mà không qua kiểm tra backend.

### 9.3 Phân biệt trạng thái

Không dùng một nhãn "không phù hợp" cho tất cả tình huống. Cần phân
biệt: - **Có bằng chứng:** Hồ sơ thể hiện rõ yêu cầu. - **Bằng chứng một
phần:** Có nội dung liên quan nhưng chưa đủ để kết luận đáp ứng hoàn
toàn. - **Chưa tìm thấy bằng chứng:** CV hiện tại không thể hiện thông
tin. - **Cần xác nhận:** Có thể liên quan nhưng cần người dùng làm rõ. -
**Không đáp ứng theo thông tin đã xác nhận:** Chỉ dùng khi có căn cứ rõ
ràng từ người dùng hoặc dữ liệu đã xác nhận. - **Không áp dụng/không
rõ:** Không thể phân loại chắc chắn từ JD.

### 9.4 Điểm phù hợp

Trước khi xây dựng điểm số, phải quyết định: - Điểm thể hiện mức độ bằng
chứng trong CV hay mức độ phù hợp tổng thể? - Yêu cầu bắt buộc có phải
là điều kiện chặn hay chỉ là yếu tố giảm điểm? - Nhóm yêu cầu nào được
tính và trọng số do ai xác định? - Thiếu thông tin có làm giảm điểm
không, hay được thể hiện riêng? - Làm sao giải thích điểm cho người
dùng? - Làm sao kiểm thử tính nhất quán và hạn chế thiên lệch?

**Khuyến nghị:** Ở MVP, ưu tiên bảng đối chiếu yêu cầu và bằng chứng có
giải thích. Chỉ thêm điểm tổng hợp sau khi định nghĩa được công thức,
kiểm thử được và tránh tạo cảm giác chính xác giả.

## 10. Ranh giới trách nhiệm AI và backend

### 10.1 AI có thể làm

-   Trích xuất yêu cầu từ JD.
-   Chuẩn hóa cách diễn đạt và ánh xạ các từ đồng nghĩa.
-   Phân loại sơ bộ yêu cầu.
-   Tìm các đoạn hồ sơ có khả năng liên quan.
-   Đề xuất cách diễn đạt lại nội dung có căn cứ.
-   Giải thích mối liên hệ giữa yêu cầu và bằng chứng.
-   Nêu rõ chỗ thiếu thông tin hoặc cần hỏi người dùng.

### 10.2 Backend phải kiểm soát

-   Xác thực người dùng và quyền truy cập.
-   Cấp ID cho bản ghi và yêu cầu.
-   Kiểm tra schema, kiểu dữ liệu và giá trị hợp lệ của đầu ra AI.
-   Kiểm tra bằng chứng có tồn tại trong hồ sơ hay không.
-   Áp dụng quy tắc nghiệp vụ và công thức điểm đã được xác nhận.
-   Lưu lịch sử, phiên bản và trạng thái duyệt.
-   Ngăn nội dung chưa được xác nhận đi vào CV cuối cùng.
-   Ghi log cần thiết mà không lưu thừa dữ liệu nhạy cảm.
-   Giới hạn chi phí, tần suất và kích thước yêu cầu AI.

### 10.3 Nguyên tắc chống bịa đặt

-   Đầu ra AI được xem là dữ liệu đầu vào chưa đáng tin cậy.
-   Không chấp nhận một con số thành tích chỉ vì AI tạo ra.
-   Không suy ra số năm kinh nghiệm chỉ từ số năm lịch hoặc cách diễn
    đạt mơ hồ.
-   Không tự kết luận một kỹ năng đã thành thạo chỉ vì xuất hiện một lần
    trong dự án.
-   Nội dung được viết lại phải giữ nguyên ý nghĩa thực tế.
-   Mọi bổ sung thông tin mới phải được người dùng xác nhận.
-   Lưu liên kết từ nội dung đề xuất về nguồn dữ liệu để có thể kiểm
    tra.

## 11. Dữ liệu chính dự kiến

Đây là các thực thể nghiệp vụ ở mức khái niệm, chưa phải thiết kế
database cuối cùng.

-   **User:** tài khoản và trạng thái.
-   **CandidateProfile:** hồ sơ nghề nghiệp gốc.
-   **ProfileSection:** các section như học vấn, kinh nghiệm, dự án, kỹ
    năng, chứng chỉ.
-   **ProfileEvidence:** đoạn nội dung/bằng chứng có thể được dùng để
    đối chiếu.
-   **Resume:** CV hoặc phiên bản CV.
-   **ResumeSection:** section và thứ tự hiển thị trong một CV cụ thể.
-   **JobDescription:** JD người dùng đã nhập hoặc lưu.
-   **JobRequirement:** yêu cầu được trích xuất và chuẩn hóa từ JD.
-   **RequirementEvidenceMatch:** liên kết giữa yêu cầu JD và bằng chứng
    hồ sơ.
-   **AIRecommendation:** đề xuất do AI tạo, nguồn căn cứ và trạng thái
    duyệt.
-   **ResumeVersion:** lịch sử phiên bản và quan hệ giữa các bản.
-   **ExportJob:** trạng thái tạo tệp xuất.
-   **AuditEvent:** sự kiện bảo mật/nghiệp vụ cần lưu để kiểm tra.

Cần xác định quyền sở hữu, quan hệ, vòng đời, quy tắc xóa và thời gian
lưu dữ liệu cho từng thực thể trước khi thiết kế schema vật lý.

## 12. Yêu cầu phi chức năng

### Bảo mật và quyền riêng tư

-   Người dùng chỉ truy cập hồ sơ và CV thuộc quyền của mình.
-   Tệp tải lên phải được kiểm tra loại, dung lượng và nội dung phù hợp.
-   Có chính sách lưu trữ, xóa, sao lưu và phục hồi dữ liệu.
-   Không dùng dữ liệu CV để huấn luyện mô hình bên ngoài nếu chưa có cơ
    sở pháp lý và sự đồng ý phù hợp.
-   Xác định dữ liệu nào được gửi đến nhà cung cấp AI.
-   Có cơ chế xử lý yêu cầu xóa tài khoản và dữ liệu.

### Độ tin cậy

-   Đầu ra AI phải được xác thực trước khi lưu hoặc hiển thị ở vị trí
    quan trọng.
-   Xử lý được trường hợp AI trả lời sai định dạng, thiếu trường,
    timeout hoặc lỗi.
-   Không làm mất bản CV đã lưu nếu quá trình AI thất bại.
-   Có trạng thái tiến trình rõ ràng khi phân tích JD hoặc xuất PDF.

### Hiệu năng và khả năng mở rộng

-   Xác định thời gian phản hồi mục tiêu cho các thao tác thông thường.
-   Xác định thời gian chấp nhận được cho phân tích JD và xuất PDF.
-   Có giới hạn kích thước hồ sơ/JD và số lần gọi AI.
-   Các tác vụ tốn thời gian có thể chạy nền nếu cần.

### Khả năng sử dụng

-   Giao diện rõ ràng, hỗ trợ tiếng Việt trước nếu đây là thị trường ban
    đầu.
-   CV phải xem trước gần với tệp xuất.
-   Người dùng dễ hoàn tác thay đổi và so sánh phiên bản.
-   Gợi ý AI không được che khuất quyền chỉnh sửa thủ công.

### Khả năng bảo trì

-   Quy tắc nghiệp vụ được tách khỏi prompt AI.
-   Có phiên bản hóa prompt/schema đầu ra.
-   Có kiểm thử tự động cho các trường hợp AI lỗi hoặc trả dữ liệu bất
    thường.
-   Theo dõi được lỗi, chi phí AI và chất lượng đề xuất.

## 13. Chỉ số đánh giá thành công

Không đặt mục tiêu số cụ thể trước khi có dữ liệu nền. Cần thống nhất
cách đo các chỉ số sau:

-   Tỷ lệ người dùng hoàn thành hồ sơ gốc.
-   Tỷ lệ người dùng tạo được CV đầu tiên.
-   Tỷ lệ người dùng hoàn thành luồng CV theo JD.
-   Thời gian trung vị để tạo một CV theo JD.
-   Tỷ lệ đề xuất AI được chấp nhận, chỉnh sửa hoặc từ chối.
-   Tỷ lệ đề xuất có nguồn bằng chứng hợp lệ.
-   Tỷ lệ nội dung không có căn cứ bị phát hiện trong kiểm thử.
-   Tỷ lệ lỗi phân tích JD, lưu CV và xuất PDF.
-   Chi phí AI trung bình cho mỗi lần phân tích JD.
-   Tỷ lệ người dùng quay lại tạo CV cho JD khác.

Không dùng tỷ lệ chấp nhận AI đơn lẻ làm bằng chứng chất lượng; người
dùng có thể chấp nhận một đề xuất sai nếu không nhận ra lỗi.

## 14. Rủi ro và cách giảm thiểu

  -----------------------------------------------------------------------
  Rủi ro                  Hậu quả                 Hướng giảm thiểu
  ----------------------- ----------------------- -----------------------
  AI bịa kinh nghiệm hoặc CV sai sự thật, mất     Bắt buộc có nguồn bằng
  thành tích              niềm tin                chứng và xác nhận người
                                                  dùng

  JD mơ hồ hoặc chứa nội  Phân loại yêu cầu sai   Cho phép đánh dấu
  dung nhiễu                                      "không rõ" và yêu cầu
                                                  người dùng sửa

  Điểm phù hợp gây hiểu   Người dùng tin điểm số  Giải thích công thức,
  nhầm                    tuyệt đối               giới hạn và bằng chứng

  CV gốc bị ghi đè        Mất dữ liệu             Tách hồ sơ gốc và phiên
                                                  bản CV

  Tệp tải lên độc hại     Rủi ro bảo mật          Kiểm tra tệp, giới hạn
  hoặc sai định dạng                              dung lượng, xử lý an
                                                  toàn

  Lộ thông tin cá nhân    Ảnh hưởng người dùng    Phân quyền, mã hóa phù
                                                  hợp, chính sách lưu/xóa

  Chi phí AI vượt dự kiến Không bền vững về vận   Hạn mức, cache phù hợp,
                          hành                    đo chi phí và chọn mô
                                                  hình theo tác vụ

  Phạm vi quá lớn         Chậm ra MVP             Chốt nhóm người dùng và
                                                  luồng cốt lõi

  Xuất PDF khác bản xem   CV kém chất lượng       Kiểm thử mẫu, font,
  trước                                           trang và nội dung tràn
  -----------------------------------------------------------------------

## 15. Câu hỏi khám phá yêu cầu

Hãy trả lời theo thực tế mong muốn. Có thể ghi "Chưa biết" nếu chưa
quyết định.

### A. Tầm nhìn và người dùng

1.  ProfileHub trước tiên dành cho ai: sinh viên mới ra trường, người đã
    đi làm, người chuyển ngành hay tất cả?
2.  Thị trường đầu tiên là Việt Nam hay đa quốc gia?
3.  Chỉ ứng viên sử dụng trong MVP, hay nhà tuyển dụng cũng cần tài
    khoản?
4.  Điểm khác biệt quan trọng nhất so với các website tạo CV hiện có là
    gì?
5.  Người dùng có thể dùng sản phẩm miễn phí hoàn toàn, hay dự kiến có
    gói trả phí?

### B. Bài toán CV

6.  Người dùng tạo CV từ đầu, nhập CV có sẵn, hay cần cả hai?
7.  Có cần nhập dữ liệu từ PDF/DOCX không? Nếu có, những định dạng nào
    bắt buộc?
8.  Các section bắt buộc gồm những gì? Có cho phép tạo section tùy chỉnh
    không?
9.  Có cần nhiều mẫu CV, hay ưu tiên một mẫu tốt cho MVP?
10. Định dạng xuất bắt buộc là PDF, DOCX hay cả hai?
11. Có cần hỗ trợ CV tiếng Việt và tiếng Anh ngay từ đầu?
12. Người dùng có cần tạo nhiều hồ sơ gốc cho nhiều hướng nghề nghiệp
    khác nhau không?

### C. Tính năng "CV theo JD bằng AI"

13. Người dùng sẽ dán JD, tải tệp JD, nhập URL hay sử dụng cả ba cách?
14. AI chỉ phân tích và đề xuất, hay được phép tạo một bản nháp CV hoàn
    chỉnh?
15. Người dùng muốn AI đề xuất theo từng section hay toàn bộ CV một lần?
16. Có cần giải thích từng đề xuất dựa trên đoạn nào trong CV gốc không?
17. Khi JD có yêu cầu chưa thấy trong hồ sơ, hệ thống nên hỏi người
    dùng, bỏ qua hay đề xuất cách bổ sung bằng chứng?
18. AI có được viết lại câu chữ không? Giới hạn nào để bảo toàn ý nghĩa?
19. Có cần so sánh CV trước và sau khi tối ưu không?
20. Có cần lưu mỗi JD thành một hồ sơ ứng tuyển riêng?
21. Người dùng muốn thấy bảng đối chiếu yêu cầu hay một điểm phù hợp
    tổng thể, hay cả hai?
22. Nếu có điểm số, người dùng kỳ vọng điểm đó phản ánh điều gì?

### D. Quy tắc đánh giá và độ tin cậy

23. Những yêu cầu nào được xem là "bắt buộc" và cách xác định là gì?
24. Một yêu cầu kỹ năng có thể được chứng minh bằng dự án cá nhân, môn
    học hoặc công việc thực tế ở mức nào?
25. Có cần phân biệt kinh nghiệm chuyên nghiệp với dự án học tập/cá nhân
    không?
26. Có yêu cầu số năm kinh nghiệm thì hệ thống được tính từ dữ liệu nào?
27. Khi thông tin không rõ hoặc mâu thuẫn, ai có quyền xác nhận?
28. Có cần người dùng xác nhận từng nội dung mới trước khi đưa vào CV
    cuối cùng?
29. Có cần lưu lịch sử AI đã đề xuất gì, người dùng đã duyệt gì và khi
    nào?

### E. Trải nghiệm và luồng sử dụng

30. Sau khi đăng nhập, màn hình đầu tiên nên là hồ sơ, danh sách CV hay
    công cụ tạo CV theo JD?
31. Người dùng có cần dashboard để quản lý các JD và CV ứng tuyển không?
32. Có cần chức năng nhân bản CV, hoàn tác và so sánh phiên bản?
33. CV Builder cần kéo-thả section hay chỉ cần nút thêm/sửa/xóa và sắp
    xếp?
34. Có cần xem trước trực tiếp khi chỉnh sửa?
35. Người dùng có cần checklist hoàn thiện hồ sơ không?

### F. Tài khoản, quyền và riêng tư

36. Đăng nhập bằng email/mật khẩu là đủ hay cần Google?
37. Có cần vai trò quản trị viên ngay trong MVP?
38. Người dùng có thể chia sẻ CV bằng liên kết công khai không?
39. Nếu chia sẻ, có cần đặt thời hạn hoặc thu hồi liên kết?
40. Người dùng cần tải xuống và xóa toàn bộ dữ liệu bằng cách nào?
41. Dữ liệu CV có được gửi tới nhà cung cấp AI bên ngoài không, và cần
    thông báo/đồng ý như thế nào?

### G. Kỹ thuật và vận hành

42. Bạn đã chọn stack công nghệ chưa? Nếu có, frontend, backend,
    database và dịch vụ lưu tệp là gì?
43. Bạn muốn tự tích hợp API mô hình AI hay cần thiết kế lớp có thể đổi
    nhà cung cấp?
44. Ngân sách dự kiến cho hosting và AI mỗi tháng là bao nhiêu?
45. Có giới hạn số lần phân tích JD cho mỗi người dùng không?
46. Ai sẽ vận hành, theo dõi lỗi và xử lý yêu cầu hỗ trợ?
47. Bạn muốn ưu tiên ra MVP nhanh hay xây kiến trúc có khả năng mở rộng
    ngay từ đầu?

### H. Phạm vi và ưu tiên

48. Nếu MVP chỉ làm tốt ba việc, bạn chọn ba việc nào?
49. Chức năng nào chắc chắn chưa làm trong giai đoạn đầu?
50. Bạn muốn đánh giá MVP thành công sau bao lâu và bằng chỉ số nào?

## 16. Tài liệu cần tạo sau giai đoạn khám phá

Không cần viết tất cả ngay. Nên đi theo thứ tự sau:

1.  **Product Brief:** vấn đề, người dùng mục tiêu, giá trị cốt lõi, mục
    tiêu và ngoài phạm vi.
2.  **Decision Log:** danh sách quyết định đã chốt, lý do, người quyết
    định và ngày.
3.  **Use Case Story:** luồng nghiệp vụ của từng tác nhân và các trường
    hợp ngoại lệ.
4.  **Functional Requirements:** yêu cầu chức năng có mã, mô tả và tiêu
    chí chấp nhận.
5.  **Business Rules:** quy tắc hồ sơ gốc, phiên bản CV, đối chiếu JD và
    xác nhận nội dung AI.
6.  **Information Architecture:** sitemap và cấu trúc màn hình.
7.  **Wireframes/Prototype:** các màn hình và luồng tương tác chính.
8.  **Data Model:** thực thể, thuộc tính, quan hệ, quyền sở hữu và vòng
    đời dữ liệu.
9.  **AI Contract:** đầu vào/đầu ra có schema, quy tắc kiểm tra, xử lý
    lỗi và nguồn bằng chứng.
10. **API Specification:** endpoint, quyền truy cập, request/response và
    mã lỗi.
11. **Security & Privacy Checklist:** dữ liệu, quyền, lưu trữ, xóa và
    chia sẻ.
12. **Test Plan:** happy path, edge cases, lỗi AI, bảo mật, xuất PDF và
    hồi quy.
13. **MVP Backlog:** user story, độ ưu tiên, phụ thuộc và tiêu chí hoàn
    thành.

## 17. Điều kiện sẵn sàng bắt đầu code

Chỉ nên bắt đầu xây dựng luồng cốt lõi khi đã trả lời hoặc ghi rõ quyết
định tạm thời cho các mục sau:

-   [ ] Đã xác định người dùng mục tiêu của MVP.
-   [ ] Đã xác định vấn đề chính cần giải quyết.
-   [ ] Đã chốt phạm vi MVP và các chức năng để sau.
-   [ ] Đã mô tả luồng tạo CV cơ bản và luồng CV theo JD.
-   [ ] Đã thống nhất hồ sơ gốc khác gì CV theo JD.
-   [ ] Đã thống nhất cách xử lý nội dung AI chưa có bằng chứng.
-   [ ] Đã định nghĩa đầu ra phân tích JD ở mức dữ liệu có cấu trúc.
-   [ ] Đã xác định cách người dùng duyệt đề xuất AI.
-   [ ] Đã có tiêu chí chấp nhận cho các chức năng MVP.
-   [ ] Đã chọn stack kỹ thuật và phương án lưu trữ dữ liệu/tệp.
-   [ ] Đã xác định yêu cầu quyền riêng tư và phân quyền tối thiểu.
-   [ ] Đã có wireframe cho các màn hình cốt lõi.
-   [ ] Đã xác định kế hoạch kiểm thử và cách đánh giá chất lượng AI.

Nếu còn mục chưa rõ, có thể bắt đầu prototype hoặc spike kỹ thuật để
giảm bất định; không nên giả định rằng mọi quyết định nghiệp vụ đã được
chốt.

## 18. Cách sử dụng tài liệu này

1.  Trả lời các câu hỏi trong Mục 15, ưu tiên phần A, B, C và H.
2.  Đánh dấu từng quyết định là **Đã chốt**, **Tạm thời** hoặc **Chưa
    chốt**.
3.  Cập nhật phạm vi MVP dựa trên câu trả lời.
4.  Chuyển các luồng đã thống nhất thành Use Case Story.
5.  Chuyển từng use case thành yêu cầu và tiêu chí chấp nhận.
6.  Chỉ sau đó mới thiết kế schema/API và chia backlog phát triển.

------------------------------------------------------------------------

## 19. Nhật ký quyết định

  ------------------------------------------------------------------------------------------
  Mã          Chủ đề      Quyết định  Trạng thái  Lý do / ghi chú                Ngày
  ----------- ----------- ----------- ----------- ------------------------------ -----------
  D-001       Người dùng  Chưa chốt   Chưa chốt   Ứng viên hay cả ứng viên và    
              MVP                                 nhà tuyển dụng                 

  D-002       Luồng nhập  Chưa chốt   Chưa chốt   Dán văn bản, tải tệp hay URL   
              JD                                                                 

  D-003       Đầu ra AI   Chưa chốt   Chưa chốt   Bảng đối chiếu, bản nháp CV,   
                                                  điểm phù hợp                   

  D-004       Xuất CV     PDF là đề   Tạm thời    Cần xác nhận có cần DOCX       
                          xuất ban                                               
                          đầu                                                    

  D-005       Công nghệ   Chưa chốt   Chưa chốt   Ghi rõ                         
                                                  frontend/backend/database/AI   
  ------------------------------------------------------------------------------------------

## 20. Tóm tắt định hướng đề xuất

Hướng đi an toàn để kiểm chứng giá trị ProfileHub là bắt đầu với **ứng
viên**, tập trung vào **hồ sơ nghề nghiệp gốc → nhập JD → phân tích yêu
cầu → đối chiếu bằng chứng → người dùng duyệt đề xuất → lưu CV riêng
theo JD → xuất PDF**.

Không nên bắt đầu bằng một hệ thống tuyển dụng hai chiều quá rộng hoặc
một thuật toán chấm điểm phức tạp. Trước tiên hãy chứng minh rằng
ProfileHub có thể giúp ứng viên tạo CV liên quan hơn đến JD mà không bịa
thông tin, giải thích được đề xuất và giữ quyền quyết định trong tay
người dùng.

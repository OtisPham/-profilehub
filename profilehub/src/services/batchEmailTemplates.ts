import type { BatchEmailTemplate } from '../types/database';

export const BATCH_EMAIL_TEMPLATES: BatchEmailTemplate[] = [
  {
    id: 'template_interview_invite',
    title: 'Mời Phỏng Vấn & Chọn Khung Giờ Linh Hoạt',
    category: 'interview_invite',
    subject: '[{company_name}] Thư Mời Phỏng Vấn Vị Trí {job_title} - {candidate_name}',
    body: `Chào {candidate_name},

Bộ phận Tuyển dụng tại {company_name} rất ấn tượng với hồ sơ năng lực và các đồ án bảo chứng thực tế của bạn, đặc biệt là dự án "{top_project_name}".

Chúng tôi trân trọng mời bạn tham gia buổi Phỏng vấn Kỹ thuật cho vị trí {job_title}.

Để thuận tiện nhất cho lịch trình học tập và làm việc của bạn, chúng tôi đã mở sẵn một số khung giờ phỏng vấn linh hoạt trên hệ thống ProfileHub. Bạn vui lòng truy cập Dashboard cá nhân để chọn một khung giờ phù hợp nhất với mình nhé:

👉 Khung giờ đề xuất: {interview_slot_time}
👉 Hình thức: Phỏng vấn trực tuyến qua Google Meet

Nếu có bất kỳ câu hỏi nào cần hỗ trợ trước buổi phỏng vấn, bạn đừng ngần ngại phản hồi lại email này.

Chúc bạn có một buổi phỏng vấn thành công!

Trân trọng,
Bộ phận Tuyển dụng {company_name}`,
  },
  {
    id: 'template_challenge_issue',
    title: 'Giao Bài Thử Thách Kỹ Thuật (Take-home Challenge)',
    category: 'challenge_issue',
    subject: '[{company_name}] Bài Thử Thách Kỹ Thuật Vị Trí {job_title} - {candidate_name}',
    body: `Chào {candidate_name},

Cảm ơn bạn đã ứng tuyển vào vị trí {job_title} tại {company_name}.

Dựa trên các kỹ năng thực chiến được thể hiện qua đồ án của bạn, chúng tôi trân trọng gửi đến bạn một Thử thách Kỹ thuật (Take-home Challenge) thực tế.

Thông tin chi tiết về thử thách:
- Vị trí: {job_title}
- Hạn chót nộp bài: {challenge_deadline}
- Hướng dẫn nộp bài: Bạn vui lòng thực hiện trên nhánh Git mới của đồ án và nộp link GitHub Pull Request trực tiếp trên hệ thống ProfileHub.

Chúng tôi rất mong chờ được xem giải pháp kiến trúc và phong cách viết mã nguồn của bạn.

Chúc bạn hoàn thành thật tốt bài thử thách!

Trân trọng,
Hội đồng Kỹ thuật {company_name}`,
  },
  {
    id: 'template_rejection_courtesy',
    title: 'Thư Cảm Ơn & Lưu Trữ Hồ Sơ Talent Pool',
    category: 'rejection_courtesy',
    subject: '[{company_name}] Cảm Ơn Bạn Đã Ứng Tuyển Vị Trí {job_title}',
    body: `Chào {candidate_name},

Lời đầu tiên, {company_name} xin gửi lời cảm ơn chân thành đến bạn vì đã dành thời gian và sự quan tâm đến vị trí {job_title}.

Chúng tôi đánh giá rất cao sự chuẩn bị chu đáo và năng lực thực tế qua đồ án "{top_project_name}" của bạn. Tuy nhiên, ở thời điểm hiện tại, chúng tôi đã tìm được ứng viên có mức độ phù hợp sát sao hơn với các yêu cầu đặc thù của dự án đợt này.

Hồ sơ của bạn đã được chúng tôi lưu trữ trang trọng trong Kho Tài Năng (Talent Pool) của {company_name}. Khi có các cơ hội mới phù hợp với thế mạnh công nghệ của bạn, chúng tôi sẽ chủ động liên hệ trước.

Chúc {candidate_name} luôn giữ vững nhiệt huyết và gặt hái nhiều thành công trên con đường phát triển sự nghiệp!

Trân trọng,
Đội ngũ Tuyển dụng {company_name}`,
  },
  {
    id: 'template_offer_congrats',
    title: 'Thông Báo Thư Mời Nhận Việc (Job Offer)',
    category: 'offer_letter',
    subject: '[{company_name}] Chúc Mừng! Thư Mời Làm Việc Vị Trí {job_title} - {candidate_name}',
    body: `Chào {candidate_name},

Sau các vòng trao đổi và phỏng vấn kỹ thuật, {company_name} vô cùng ấn tượng với năng lực, tư duy giải quyết vấn đề và sự phù hợp văn hóa của bạn.

Chúng tôi rất vui mừng thông báo: Bạn đã chính thức được chọn cho vị trí {job_title}!

Thư mời nhận việc chính thức (Digital Offer Letter) kèm chi tiết về mức đãi ngộ, phúc lợi và ngày bắt đầu đã được phát hành trên Cổng Ký Nhận Kỹ Thuật Số của ProfileHub. Bạn có thể xem chi tiết và ký xác nhận trực tuyến tại tài khoản của mình.

Chào mừng bạn gia nhập đại gia đình {company_name}!

Trân trọng,
Ban Giám Đốc & Phòng Nhân Sự {company_name}`,
  },
];

export type OfferLetterTone = 'tech_startup' | 'corporate_standard' | 'executive_premium' | 'friendly_fresher';

export interface OfferLetterToneConfig {
  id: OfferLetterTone;
  label: string;
  icon: string;
  desc: string;
}

export const OFFER_LETTER_TONES: OfferLetterToneConfig[] = [
  {
    id: 'corporate_standard',
    label: 'Chuẩn Mực Doanh Nghiệp',
    icon: '🏛️',
    desc: 'Trang trọng, chuẩn xác pháp lý, rõ ràng từng điều khoản quyền lợi và nghĩa vụ.'
  },
  {
    id: 'tech_startup',
    label: 'Tech Startup Hiện Đại',
    icon: '🚀',
    desc: 'Trẻ trung, nhiệt huyết, truyền cảm hứng văn hóa đổi mới và chào đón gia nhập.'
  },
  {
    id: 'friendly_fresher',
    label: 'Thân Thiện Cho Fresher',
    icon: '🎓',
    desc: 'Ấm áp, hỗ trợ tối đa cho sinh viên mới tốt nghiệp, lộ trình đào tạo rõ ràng.'
  },
  {
    id: 'executive_premium',
    label: 'Trọng Dụng Nhân Tài',
    icon: '⭐',
    desc: 'Đề cao giá trị chiến lược của ứng viên đối với sự phát triển của công ty.'
  }
];

export interface OfferLetterInput {
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateLocation?: string;
  companyName: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  recruiterName?: string;
  recruiterTitle?: string;
  jobTitle: string;
  department?: string;
  employmentType?: string; // 'Toàn thời gian (Full-time)' | 'Thực tập sinh (Intern)' | 'Bán thời gian (Part-time)'
  startDate: string;
  baseSalary: string; // VD: "18,000,000 VNĐ / tháng"
  probationDuration?: string; // "2 tháng (hưởng 85% lương)"
  probationSalary?: string;
  workLocation?: string; // "Trụ sở chính & Hybrid"
  workHours?: string; // "Thứ 2 - Thứ 6 (08:30 - 17:30)"
  benefits?: string[];
  responseDeadline: string; // VD: "17:00 ngày 15/10/2026"
  tone: OfferLetterTone;
  customNotes?: string;
}

export interface GeneratedOfferLetter {
  documentTitle: string;
  dateStr: string;
  salutation: string;
  opening: string;
  positionDetailsText: string;
  compensationText: string;
  benefitsText: string;
  confidentialityText: string;
  acceptanceDeadlineText: string;
  closing: string;
  employerSignOffName: string;
  employerSignOffTitle: string;
  candidateSignOffPrompt: string;
  fullContent: string;
}

export const DEFAULT_OFFER_BENEFITS = [
  'Đóng đầy đủ BHXH, BHYT, BHTN theo Luật Lao Động trên 100% lương chính thức',
  'Gói bảo hiểm sức khỏe cao cấp (PVI / Bảo Việt) cho nhân viên và người thân',
  '14 ngày phép năm hưởng nguyên lương + 1 ngày phép sinh nhật',
  'Thưởng lương tháng 13 + Thưởng hiệu suất dự án (KPI Bonus 1 - 3 tháng lương)',
  'Cấp máy tính làm việc cấu hình cao (MacBook Pro / Dell XPS) & phụ cấp thiết bị',
  'Trợ cấp ăn trưa, gửi xe miễn phí tại tòa nhà công ty',
  'Tài trợ 100% kinh phí thi các chứng chỉ quốc tế chuyên môn (AWS, GCP, PMP, Scrum)',
  'Du lịch thường niên (Company Trip) và các hoạt động Team Building hàng quý'
];

/**
 * Generates an automated, professional Vietnamese & International Job Offer Letter
 */
export function generateOfferLetter(input: OfferLetterInput): GeneratedOfferLetter {
  const {
    candidateName,
    companyName,
    recruiterName = 'Ban Giám Đốc Nhân Sự',
    recruiterTitle = 'Head of Human Resources',
    jobTitle,
    department = 'Khối Công Nghệ & Phát Triển Phần Mềm',
    employmentType = 'Toàn thời gian chính thức (Full-time)',
    startDate,
    baseSalary,
    probationDuration = '02 tháng (hưởng 85% lương chính thức)',
    probationSalary,
    workLocation = 'Tòa nhà văn phòng Công ty & Chế độ làm việc linh hoạt (Hybrid)',
    workHours = 'Thứ Hai đến Thứ Sáu (08:30 - 17:30), nghỉ Thứ Bảy và Chủ Nhật',
    benefits = DEFAULT_OFFER_BENEFITS,
    responseDeadline,
    tone = 'corporate_standard',
    customNotes
  } = input;

  const dateStr = `Ngày ${new Date().toLocaleDateString('vi-VN')}`;

  let opening = '';
  let positionDetailsText = '';
  let compensationText = '';
  let benefitsText = '';
  let confidentialityText = '';
  let acceptanceDeadlineText = '';
  let closing = '';

  const benefitsBulletPoints = benefits.map((b, i) => `   ${i + 1}. ${b}`).join('\n');

  switch (tone) {
    case 'tech_startup':
      opening = `Thay mặt toàn thể đội ngũ tại ${companyName}, tôi vô cùng vui mừng và tự hào được gửi đến bạn Thư Mời Nhận Việc cho vị trí ${jobTitle}. Qua các vòng trao đổi và đánh giá hồ sơ năng lực cũng như đồ án thực tế của bạn, chúng tôi vô cùng ấn tượng với tư duy kiến trúc, sự đam mê công nghệ và tinh thần đổi mới sáng tạo mà bạn thể hiện. Chúng tôi tin tưởng sâu sắc rằng bạn sẽ là một mảnh ghép xuất sắc, cùng chúng tôi tạo nên những sản phẩm công nghệ đột phá!`;
      
      positionDetailsText = `1. VỊ TRÍ & ĐIỀU KIỆN LÀM VIỆC:\n- Chức danh công việc: ${jobTitle}\n- Phòng ban trực thuộc: ${department}\n- Hình thức làm việc: ${employmentType}\n- Ngày bắt đầu làm việc (Onboarding Date): ${startDate}\n- Địa điểm làm việc: ${workLocation}\n- Thời gian làm việc: ${workHours}\n- Thời gian thử việc: ${probationDuration}`;

      compensationText = `2. CHẾ ĐỘ ĐÃI NGỘ & THU NHẬP:\n- Mức lương chính thức (Gross): ${baseSalary}\n${probationSalary ? `- Mức lương trong thời gian thử việc: ${probationSalary}\n` : ''}- Chu kỳ chi trả: Ngày 05 hàng tháng qua tài khoản ngân hàng cá nhân.\n- Đánh giá tăng lương & hiệu suất: 02 lần/năm theo đóng góp và thành tựu dự án.`;

      benefitsText = `3. CHÍNH SÁCH PHÚC LỢI NỔI BẬT:\n${benefitsBulletPoints}`;

      confidentialityText = `4. BẢO MẬT & CAM KẾT ĐỒNG HÀNH:\nBạn sẽ được tiếp cận các công nghệ và giải pháp cốt lõi của công ty. Thư mời này cùng toàn bộ thông tin thu nhập được bảo mật nghiêm ngặt theo chính sách văn hóa doanh nghiệp.`;

      acceptanceDeadlineText = `5. HƯỚNG DẪN XÁC NHẬN NHẬN VIỆC:\nVui lòng ký xác nhận đồng ý thư mời này và gửi lại cho chúng tôi trước ${responseDeadline}. Chúng tôi đang rất háo hức được chào đón bạn vào ngày đầu tiên!`;

      closing = `Chào mừng bạn gia nhập hành trình kiến tạo tương lai cùng ${companyName}!`;
      break;

    case 'friendly_fresher':
      opening = `Công Ty Cổ Phần ${companyName} xin trân trọng chúc mừng bạn đã xuất sắc vượt qua các vòng đánh giá tuyển dụng và trúng tuyển vào vị trí ${jobTitle}! Chúng tôi đánh giá rất cao nền tảng kiến thức vững chắc, kết quả đồ án tiêu biểu được chứng thực và tinh thần ham học hỏi của bạn. Tại ${companyName}, bạn sẽ được đồng hành cùng các Senior Mentor giàu kinh nghiệm trong một môi trường cởi mở, thân thiện và giàu cơ hội phát triển vượt bậc.`;

      positionDetailsText = `1. THÔNG TIN VỊ TRÍ VÀ THỜI GIAN NHẬN VIỆC:\n- Vị trí công tác: ${jobTitle}\n- Khối chuyên môn: ${department}\n- Loại hợp đồng: ${employmentType}\n- Ngày chính thức gia nhập: ${startDate}\n- Địa điểm công tác: ${workLocation}\n- Khung giờ làm việc: ${workHours}\n- Lộ trình thử việc & đào tạo: ${probationDuration}`;

      compensationText = `2. GÓI THU NHẬP VÀ ĐÃI NGỘ:\n- Mức lương chính thức: ${baseSalary}\n${probationSalary ? `- Lương trong thời gian thử việc & đào tạo: ${probationSalary}\n` : ''}- Xét duyệt nâng bậc lương định kỳ: Sau mỗi 6 tháng dựa trên sự tiến bộ và đóng góp.`;

      benefitsText = `3. QUYỀN LỢI VÀ HỖ TRỢ PHÁT TRIỂN NGHỀ NGHIỆP:\n${benefitsBulletPoints}`;

      confidentialityText = `4. ĐIỀU KHOẢN CHUNG:\nCác điều khoản chi tiết về quyền và nghĩa vụ sẽ được quy định cụ thể tại Hợp đồng Lao động ký kết theo đúng Bộ luật Lao động Việt Nam.`;

      acceptanceDeadlineText = `5. THỜI HẠN XÁC NHẬN:\nĐể công ty chuẩn bị trang thiết bị và kế hoạch chào đón chu đáo nhất, xin vui lòng phản hồi xác nhận trước ${responseDeadline}.`;

      closing = `Chúc bạn có một khởi đầu sự nghiệp thật rực rỡ và thành công tại ${companyName}!`;
      break;

    case 'executive_premium':
      opening = `Hội đồng Tuyển dụng ${companyName} trân trọng gửi đến Quý Ứng viên Thư Mời Nhận Việc chính thức cho cương vị ${jobTitle}. Qua quá trình trao đổi chuyên sâu, chúng tôi đặc biệt đánh giá cao năng lực chuyên môn, tầm nhìn chiến lược và bề dày thành tích thực tế mà Quý Ứng viên đã đạt được. Chúng tôi tin tưởng rằng sự góp mặt của Quý Ứng viên sẽ mang lại giá trị to lớn và đóng vai trò nòng cốt trong việc hiện thực hóa các mục tiêu chiến lược của công ty.`;

      positionDetailsText = `1. CƯƠNG VỊ & PHẠM VI CÔNG TÁC:\n- Chức vụ đảm nhiệm: ${jobTitle}\n- Đơn vị công tác: ${department}\n- Phân loại nhân sự: ${employmentType}\n- Ngày bắt đầu nhiệm kỳ: ${startDate}\n- Trụ sở làm việc: ${workLocation}\n- Thời gian làm việc: ${workHours}\n- Chế độ thử thách / Bổ nhiệm: ${probationDuration}`;

      compensationText = `2. CHẾ ĐỘ ĐÃI NGỘ XỨNG TẦM:\n- Mức lương căn bản (Base Salary): ${baseSalary}\n${probationSalary ? `- Mức đãi ngộ giai đoạn đầu: ${probationSalary}\n` : ''}- Thưởng hiệu quả kinh doanh & Thưởng sáng kiến chiến lược: Căn cứ vào hiệu quả hoạt động hàng năm của Tập đoàn.`;

      benefitsText = `3. QUYỀN LỢI ĐẶC QUYỀN:\n${benefitsBulletPoints}`;

      confidentialityText = `4. BẢO MẬT & TRÁCH NHIỆM NGHỀ NGHIỆP:\nThư mời này là văn kiện mang tính bảo mật cao nhất giữa Ban Lãnh đạo Công ty và Quý Ứng viên.`;

      acceptanceDeadlineText = `5. PHƯƠNG THỨC XÁC NHẬN:\nKính đề nghị Quý Ứng viên ký duyệt và hoàn hồi văn bản này trước ${responseDeadline}.`;

      closing = `Rất vinh hạnh được đồng hành và hợp tác cùng Quý Ứng viên trên chặng đường phát triển sắp tới!`;
      break;

    case 'corporate_standard':
    default:
      opening = `Công Ty ${companyName} xin trân trọng gửi lời chúc mừng và thông báo: Bạn đã chính thức trúng tuyển vào vị trí ${jobTitle}. Chúng tôi đánh giá cao năng lực chuyên môn, kinh nghiệm thực tiễn và tinh thần trách nhiệm mà bạn đã thể hiện trong suốt quá trình tuyển dụng. Ban Giám Đốc Công ty trân trọng gửi đến bạn bản Thư Mời Nhận Việc với các điều khoản chi tiết dưới đây:`;

      positionDetailsText = `1. VỊ TRÍ CÔNG TÁC VÀ ĐIỀU KIỆN TUYỂN DỤNG:\n- Chức danh công việc: ${jobTitle}\n- Bộ phận trực thuộc: ${department}\n- Loại hình hợp đồng: ${employmentType}\n- Ngày bắt đầu làm việc: ${startDate}\n- Địa điểm làm việc: ${workLocation}\n- Thời giờ làm việc: ${workHours}\n- Thời gian thử việc: ${probationDuration}`;

      compensationText = `2. TIỀN LƯƠNG VÀ CÁC KHOẢN PHỤ CẤP:\n- Tiền lương chính thức: ${baseSalary}\n${probationSalary ? `- Tiền lương trong thời gian thử việc: ${probationSalary}\n` : ''}- Hình thức chi trả: Chuyển khoản ngân hàng vào ngày làm việc đầu tiên của tháng kế tiếp.\n- Xét duyệt tăng lương: Định kỳ hàng năm theo Quy chế tiền lương của Công ty.`;

      benefitsText = `3. CHẾ ĐỘ PHÚC LỢI VÀ BẢO HIỂM:\n${benefitsBulletPoints}`;

      confidentialityText = `4. QUY ĐỊNH BẢO MẬT THÔNG TIN:\nỨng viên có trách nhiệm bảo mật toàn bộ nội dung của Thư mời này cũng như các thông tin kinh doanh, kỹ thuật của Công ty theo quy định pháp luật.`;

      acceptanceDeadlineText = `5. XÁC NHẬN VÀ HIỆU LỰC CỦA THƯ MỜI:\nVui lòng ký tên xác nhận vào phần dưới của Thư này và gửi lại cho Phòng Nhân sự trước ${responseDeadline}. Sau thời hạn nêu trên, Thư mời sẽ tự động hết hiệu lực nếu không có thỏa thuận gia hạn khác.`;

      closing = `Trân trọng chào đón bạn gia nhập đại gia đình ${companyName}!`;
      break;
  }

  if (customNotes && customNotes.trim()) {
    opening += `\n\n[Ghi chú đặc biệt từ Nhà tuyển dụng]: ${customNotes.trim()}`;
  }

  const documentTitle = `THƯ MỜI NHẬN VIỆC (JOB OFFER LETTER)`;
  const salutation = `Kính gửi Anh/Chị: ${candidateName.toUpperCase()},`;
  const employerSignOffName = recruiterName;
  const employerSignOffTitle = `${recruiterTitle} - ${companyName}`;
  const candidateSignOffPrompt = `TÔI ĐÃ ĐỌC, HIỂU VÀ ĐỒNG Ý VỚI CÁC ĐIỀU KHOẢN NÊU TRÊN:\n\nKý và ghi rõ họ tên: ........................................................\nNgày xác nhận: ................................................................`;

  const fullContent = `${documentTitle}\n${dateStr}\n\n${salutation}\n\n${opening}\n\n${positionDetailsText}\n\n${compensationText}\n\n${benefitsText}\n\n${confidentialityText}\n\n${acceptanceDeadlineText}\n\n${closing}\n\nĐẠI DIỆN CÔNG TY:\n${employerSignOffName}\n${employerSignOffTitle}\n\n${candidateSignOffPrompt}`;

  return {
    documentTitle,
    dateStr,
    salutation,
    opening,
    positionDetailsText,
    compensationText,
    benefitsText,
    confidentialityText,
    acceptanceDeadlineText,
    closing,
    employerSignOffName,
    employerSignOffTitle,
    candidateSignOffPrompt,
    fullContent
  };
}

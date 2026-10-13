import { INDUSTRY_DOMAINS, type IndustryDomainId } from './aiCvCoachService';

export type CoverLetterTone = 'confident' | 'polite' | 'passionate' | 'concise';

export interface CoverLetterToneOption {
  id: CoverLetterTone;
  label: string;
  desc: string;
  icon: string;
}

export const COVER_LETTER_TONES: CoverLetterToneOption[] = [
  {
    id: 'confident',
    label: 'Chuyên Nghiệp & Tự Tin',
    desc: 'Nhấn mạnh năng lực giải quyết vấn đề và bằng chứng thực tế.',
    icon: '💼'
  },
  {
    id: 'passionate',
    label: 'Nhiệt Huyết & Đam Mê',
    desc: 'Bày tỏ khát khao học hỏi và cống hiến cho sứ mệnh công ty.',
    icon: '🔥'
  },
  {
    id: 'polite',
    label: 'Lịch Sự & Tôn Trọng',
    desc: 'Văn phong trang trọng, khiêm nhường chuẩn mực doanh nghiệp.',
    icon: '🤝'
  },
  {
    id: 'concise',
    label: 'Súc Tích & Hướng Kết Quả',
    desc: 'Ngắn gọn, đi thẳng vào các chỉ số và giải pháp đóng góp.',
    icon: '⚡'
  }
];

export interface CoverLetterInput {
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateLocation?: string;
  targetRole: string;
  targetCompany?: string;
  hiringManager?: string;
  targetJd?: string;
  skills?: string[];
  featuredProjectTitle?: string;
  featuredProjectDesc?: string;
  domainId?: IndustryDomainId;
  tone?: CoverLetterTone;
  customNotes?: string;
}

export interface GeneratedCoverLetter {
  salutation: string;
  opening: string;
  bodyParagraph1: string;
  bodyParagraph2: string;
  closing: string;
  signoff: string;
  fullContent: string;
}

/**
 * Generate high-conversion, industry-tailored Cover Letter based on candidate profile and target job.
 */
export function generateCoverLetter(input: CoverLetterInput): GeneratedCoverLetter {
  const name = input.candidateName || 'Nguyễn Văn An';
  const role = input.targetRole || 'Chuyên Viên';
  const company = input.targetCompany?.trim() || 'Quý Công Ty';
  const manager = input.hiringManager?.trim() || 'Ban Tuyển Dụng';
  const tone = input.tone || 'confident';
  const domain = input.domainId && INDUSTRY_DOMAINS[input.domainId]
    ? INDUSTRY_DOMAINS[input.domainId]
    : INDUSTRY_DOMAINS.it_software;

  const topSkills = input.skills && input.skills.length > 0
    ? input.skills.slice(0, 4).join(', ')
    : domain.coreSkills.slice(0, 4).join(', ');

  const projectTitle = input.featuredProjectTitle || 'Đồ Án Nền Tảng Chuyên Ngành';
  const projectDesc = input.featuredProjectDesc || 'được triển khai bám sát quy trình thực tế với kết quả đo lường cụ thể';

  // 1. Salutation
  const salutation = `Kính gửi ${manager} và Bộ phận Tuyển dụng ${company},`;

  // 2. Opening based on tone
  let opening = '';
  switch (tone) {
    case 'confident':
      opening = `Tôi viết thư này để bày tỏ nguyện vọng ứng tuyển vào vị trí ${role} tại ${company}. Với nền tảng chuyên môn vững chắc, tư duy định hướng kết quả cùng kinh nghiệm thực chiến với các kỹ năng trọng tâm (${topSkills}), tôi tự tin có thể đóng góp giá trị thiết thực và nhanh chóng bắt nhịp cùng mục tiêu phát triển của đội ngũ.`;
      break;
    case 'passionate':
      opening = `Tôi rất hào hứng khi biết ${company} đang tìm kiếm ứng viên cho vị trí ${role}. Theo dõi sự phát triển và văn hóa đổi mới của công ty trong thời gian qua, tôi luôn ấp ủ mong muốn được đem nhiệt huyết, tinh thần trách nhiệm cùng nền tảng chuyên môn vững vàng (${topSkills}) để cống hiến cho các dự án sắp tới của quý doanh nghiệp.`;
      break;
    case 'polite':
      opening = `Qua tìm hiểu thông tin tuyển dụng từ ${company}, tôi được biết Quý công ty đang có nhu cầu tuyển dụng vị trí ${role}. Với tinh thần cầu thị, sự chuẩn bị chu đáo về kiến thức chuyên môn (${topSkills}) và thái độ làm việc nghiêm túc, tôi xin phép được gửi hồ sơ và thư ứng tuyển này với mong muốn có cơ hội được cống hiến tại công ty.`;
      break;
    case 'concise':
      opening = `Tôi xin gửi hồ sơ ứng tuyển vị trí ${role} tại ${company}. Với chuyên môn cốt lõi về ${topSkills} và kinh nghiệm triển khai dự án bám sát thực tế, tôi tin rằng năng lực của mình đáp ứng tốt các yêu cầu trọng yếu của vị trí.`;
      break;
  }

  // 3. Body Paragraph 1: Hard Evidence / STAR Project Highlight
  let bodyParagraph1 = '';
  if (input.featuredProjectTitle && input.featuredProjectDesc) {
    bodyParagraph1 = `Trong quá trình học tập và làm việc, tôi đặc biệt chú trọng việc biến lý thuyết thành giải pháp thực tế. Điển hình là dự án "${projectTitle}", nơi tôi ${projectDesc}. Qua đó, tôi không chỉ làm chủ các công cụ chuyên ngành mà còn rèn luyện kỹ năng phân tích logic, tối ưu hóa quy trình và giải quyết triệt để các thách thức phát sinh.`;
  } else {
    bodyParagraph1 = `Tại các dự án thực hành chuyên ngành (${domain.shortName}), tôi luôn áp dụng mô hình giải quyết vấn đề có hệ thống: xác định bài toán mục tiêu, chuẩn hóa quy trình và đo lường kết quả cụ thể. Năng lực làm chủ các kỹ năng ${topSkills} đã giúp tôi hoàn thành xuất sắc các chỉ tiêu chất lượng và phối hợp hiệu quả trong môi trường làm việc đội nhóm.`;
  }

  // 4. Body Paragraph 2: Value Proposition to Company
  let bodyParagraph2 = '';
  switch (tone) {
    case 'confident':
      bodyParagraph2 = `Điều khiến tôi đặc biệt mong muốn gia nhập ${company} là môi trường làm việc năng động và tiêu chuẩn chất lượng cao mà công ty luôn gìn giữ. Tôi tin rằng với khả năng tiếp thu nhanh, tinh thần chủ động cao cùng bộ kỹ năng bám sát thực tế, tôi sẽ nhanh chóng tạo ra những đóng góp tích cực cho các mục tiêu của phòng ban.`;
      break;
    case 'passionate':
      bodyParagraph2 = `Tôi tin rằng sự đam mê nghề nghiệp kết hợp cùng phương pháp làm việc kỷ luật sẽ là nền tảng để tôi không ngừng nâng cao hiệu suất làm việc, sẵn sàng đón nhận những thách thức mới và đồng hành lâu dài cùng sự phát triển bền vững của ${company}.`;
      break;
    case 'polite':
      bodyParagraph2 = `Tôi luôn trân trọng văn hóa doanh nghiệp hướng tới giá trị thực chất của ${company} và mong muốn được rèn luyện, hoàn thiện bản thân dưới sự dẫn dắt của các chuyên gia hàng đầu trong ngành, qua đó cống hiến tối đa cho thành công chung.`;
      break;
    case 'concise':
      bodyParagraph2 = `Mục tiêu của tôi là nhanh chóng thích nghi, nắm bắt quy trình làm việc tại ${company} và áp dụng trực tiếp các kỹ năng chuyên môn để tối ưu hóa hiệu quả công việc ngay từ những giai đoạn đầu.`;
      break;
  }

  // 5. Closing & Call to action
  const closing = `Tôi rất trân trọng thời gian Quý công ty đã dành để xem xét hồ sơ của tôi và hy vọng sẽ có cơ hội được trao đổi chi tiết hơn trong một buổi phỏng vấn trực tiếp.`;
  const signoff = `Trân trọng cảm ơn,\n${name}`;

  const fullContent = `${salutation}\n\n${opening}\n\n${bodyParagraph1}\n\n${bodyParagraph2}\n\n${closing}\n\n${signoff}`;

  return {
    salutation,
    opening,
    bodyParagraph1,
    bodyParagraph2,
    closing,
    signoff,
    fullContent
  };
}

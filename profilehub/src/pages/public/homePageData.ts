export interface CorePillarItem {
  id: string;
  title: string;
  headline: string;
  description: string;
  badge: string;
  badgeColor: string;
  iconName: string;
  details: string[];
}

export interface ComparisonRow {
  criterion: string;
  conventional: string;
  profileHub: string;
}

export interface TrustMetric {
  value: string;
  label: string;
  subtext: string;
}

export const TRUST_METRICS: TrustMetric[] = [
  {
    value: '100%',
    label: 'Anti-Hallucination Guard',
    subtext: 'Chặn đứng AI bịa đặt công nghệ lạ hay số liệu ảo'
  },
  {
    value: 'A4 Khổ Chuẩn',
    label: 'Khống Chế Khổ In A4',
    subtext: 'Dấu ngắt trang trực quan, không bao giờ tràn trang xấu xí'
  },
  {
    value: 'Smart QR Code',
    label: 'Quét Demo Sản Phẩm',
    subtext: 'Mã QR trên bản in dẫn thẳng về Live Demo & GitHub Repo'
  },
  {
    value: '100+ Mẫu',
    label: 'Mẫu CV ATS Đa Ngành',
    subtext: 'Tương thích 100% hệ thống ATS tuyển dụng doanh nghiệp'
  }
];

export const CORE_PILLARS: CorePillarItem[] = [
  {
    id: 'github_extraction',
    title: '⚡ 1-Click Bóc Tách Từ GitHub Repo',
    headline: 'Biến repository thực tế thành gạch đầu dòng chuẩn Google XYZ',
    description: 'Chỉ cần dán link GitHub, hệ thống tự động đọc cấu trúc dự án, nhận diện tech stack và phân tích commit tác giả để tổng hợp câu văn chuẩn STAR.',
    badge: 'Tự Động Hóa',
    badgeColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/80',
    iconName: 'Github',
    details: [
      'Phân tích file manifest và package.json',
      'Đếm commit tác giả minh chứng vai trò',
      'Cấu trúc câu theo động từ hành động kỹ thuật'
    ]
  },
  {
    id: 'anti_hallucination',
    title: '🛡️ Anti-Hallucination & Zero Fake Metrics',
    headline: 'Kiên định Lean MVP: Tuyệt đối không bịa số liệu kinh doanh viển vông',
    description: 'Nói không với các con số ảo diệu gây mất uy tín khi phỏng vấn. ProfileHub khơi gợi các số liệu kỹ thuật có thể tái hiện được: Lighthouse, query time, coverage.',
    badge: 'Độ Tin Cậy Tuyệt Đối',
    badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
    iconName: 'ShieldCheck',
    details: [
      'Tập trung vào chỉ số kỹ thuật đo lường được',
      'Bảo vệ ứng viên không bị vạch trần khi đối chất',
      'Cơ chế STAR Diff Review so sánh trước khi chấp nhận'
    ]
  },
  {
    id: 'page_budget_guard',
    title: '📄 Page-Budget Guard & Dấu Ngắt Trang A4',
    headline: 'Khống chế trang in vừa vặn, không bao giờ để CV bị rách sang trang 2',
    description: 'Hệ thống đo lường chiều cao render theo thời gian thực và cung cấp vạch ngắt trang trực quan. Cho phép chủ động phân trang và rút gọn thông minh chỉ với 1 click.',
    badge: 'Chuẩn ATS Doanh Nghiệp',
    badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
    iconName: 'FileCheck2',
    details: [
      'Vạch chỉ báo trang A4 rõ nét ngay trên Canvas',
      'Tính năng 1-Click AI Auto-Condense co vừa 1 trang',
      'Mã QR 28px thu nhỏ quét xem demo thực tế'
    ]
  },
  {
    id: 'project_defense',
    title: '🎙️ Project Technical Defense Briefing',
    headline: 'Trang bị bản lĩnh bảo vệ đồ án trước câu hỏi xoáy của Tech Lead',
    description: 'Không dừng lại ở việc tạo CV, hệ thống chuẩn bị sẵn Top 3 câu hỏi xoáy theo Tech Stack, bản giải trình Trade-off và kịch bản gỡ lỗi (Debugging Scaffold) 4 pha.',
    badge: 'Vũ Khí Phỏng Vấn',
    badgeColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/80',
    iconName: 'Sparkles',
    details: [
      'Dự đoán trước câu hỏi bẫy theo ngôn ngữ lập trình',
      'Kịch bản phân tích đánh đổi kiến trúc (Trade-off)',
      'Thừa nhận giới hạn để thể hiện thái độ trung thực'
    ]
  }
];

export const BEFORE_AFTER_COMPARISON: ComparisonRow[] = [
  {
    criterion: 'Mô tả dự án & kinh nghiệm',
    conventional: 'Dùng câu văn bị động, chung chung ("Tham gia phát triển module...", "Hỗ trợ sửa lỗi..."), thiếu chiều sâu kỹ thuật.',
    profileHub: 'Chuẩn STAR hành động ("Tối ưu hóa API endpoint giảm 40% latency bằng Redis caching"), nêu rõ vai trò cá nhân.'
  },
  {
    criterion: 'Tính xác thực của dữ liệu',
    conventional: 'Tự khai báo kỹ năng hoặc bịa số liệu doanh thu, triệu users ảo mà người phỏng vấn dễ dàng phát hiện.',
    profileHub: 'Đính kèm liên kết Live Demo, GitHub Repo, tỷ lệ commit và mã QR quét trực tiếp trên bản in giấy A4.'
  },
  {
    criterion: 'Kiểm soát định dạng trang in',
    conventional: 'Xuống dòng ngẫu nhiên, tràn 1-2 dòng sang trang thứ hai tạo cảm giác cẩu thả, thiếu chỉn chu.',
    profileHub: 'Vạch ngắt trang A4 trực quan, đo lường ngân sách chiều cao và 1-Click rút gọn bảo toàn 100% từ khóa.'
  },
  {
    criterion: 'Vòng phỏng vấn kỹ thuật',
    conventional: 'Quên mất mình đã viết gì trên CV, ấp úng khi bị Tech Lead hỏi sâu về kiến trúc và cách xử lý sự cố.',
    profileHub: 'Được trang bị sẵn kịch bản Technical Defense Briefing, sẵn sàng trả lời tự tin mọi câu hỏi xoáy.'
  }
];

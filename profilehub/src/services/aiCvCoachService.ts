import type { Project } from '../types/database';
import type { CVSection, PersonalInfoData } from '../types/cvSection';

export type CVCoachSection = 'summary' | 'project' | 'skills' | 'contact';

export type IndustryDomainId =
  | 'marketing'
  | 'it_software'
  | 'finance_accounting'
  | 'design_creative'
  | 'business_sales'
  | 'human_resources'
  | 'logistics_supply_chain'
  | 'data_analytics'
  | 'healthcare_nursing'
  | 'general';

export interface CriterionResult {
  id: string;
  criterion: string;
  passed: boolean;
  feedback: string;
}

export interface AICoachEvaluation {
  section: CVCoachSection;
  status: 'pass' | 'needs_improvement';
  score: number; // 0 - 100
  criteriaChecklist: CriterionResult[];
  conciseFeedback: string;
  suggestedImprovement?: string;
  nextPrompt?: string;
  detectedDomain?: {
    id: IndustryDomainId;
    name: string;
    icon: string;
  };
}

export interface StepGuidance {
  section: CVCoachSection;
  stepNumber: number;
  title: string;
  subtitle: string;
  instructions: string[];
  tips: string[];
  sampleGood: string;
  sampleBad: string;
}

export interface IndustryDomainConfig {
  id: IndustryDomainId;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  keywords: string[];
  coreSkills: string[];
  skillCategories: Array<{
    categoryName: string;
    skills: string[];
  }>;
  powerActionVerbs: string[];
  industryMetrics: string[];
  metricRegex: RegExp;
  sampleObjective: string;
  sampleProject: string;
  sampleSkills: string;
  avoidBuzzwords: string[];
}

/**
 * Multi-Industry Domain Knowledge Base
 * Automatically powers the AI CV Coach, skill recommendations, and STAR formula evaluation across different sectors
 */
export const INDUSTRY_DOMAINS: Record<IndustryDomainId, IndustryDomainConfig> = {
  marketing: {
    id: 'marketing',
    name: 'Marketing, Truyền Thông & Digital Media',
    shortName: 'Marketing & Media',
    icon: '📣',
    description: 'Digital Marketing, Content Strategy, SEO/SEM, Social Media, PR & Branding',
    keywords: [
      'market', 'digital', 'seo', 'sem', 'content', 'quảng cáo', 'truyền thông', 'copywriter',
      'social', 'media', 'branding', 'pr', 'tiktok', 'facebook', 'ads', 'campaign', 'chiến dịch',
      'traffic', 'roas', 'ctr', 'hubspot', 'mailchimp', 'koc', 'kol', 'crm', 'growth'
    ],
    coreSkills: [
      'SEO / SEM', 'Google Ads & Meta Ads', 'Google Analytics 4 (GA4)', 'Content Strategy & Planning',
      'Copywriting & Storytelling', 'Social Media Marketing', 'Email Marketing Automation',
      'A/B Testing & Conversion Rate Optimization (CRO)', 'Market Research & Competitor Analysis',
      'Influencer (KOL/KOC) Campaign Management', 'Canva & Video Editing (CapCut)'
    ],
    skillCategories: [
      {
        categoryName: 'Quảng Cáo & Paid Media (Performance Ads)',
        skills: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Re-targeting', 'Tối ưu Budget & CPA']
      },
      {
        categoryName: 'Nội Dung & SEO (Content & Inbound Marketing)',
        skills: ['SEO On-page / Off-page', 'Nghiên cứu Keyword', 'Copywriting', 'Content Calendar', 'Email Marketing']
      },
      {
        categoryName: 'Dữ Liệu & Công Cụ (Analytics & Tools)',
        skills: ['Google Analytics 4 (GA4)', 'Google Search Console', 'HubSpot CRM', 'Mailchimp', 'Canva / CapCut']
      }
    ],
    powerActionVerbs: [
      'Triển khai chiến dịch', 'Tối ưu hóa chuyển đổi', 'Tăng trưởng', 'Sản xuất nội dung',
      'Thúc đẩy doanh số', 'Phân tích hành vi khách hàng', 'Định vị thương hiệu', 'Quản lý ngân sách',
      'Mở rộng tệp đối tượng', 'Điều phối hợp tác KOL/KOC'
    ],
    industryMetrics: [
      'ROAS 4.2x', 'CTR tăng 28%', 'Tăng 150% Organic Traffic', 'Giảm 30% chi phí CPA',
      'Thu hút 1,500 leads', 'Đạt 500k lượt tiếp cận (Reach)', 'Tỷ lệ chuyển đổi CR +18%'
    ],
    metricRegex: /(\d+(\.\d+)?\s*(%|x|k|m|triệu|tỷ|lead|leads|roas|ctr|cpa|cpc|traffic|lượt|người|view|reach|share|click))/i,
    sampleObjective: 'Chuyên viên Digital Marketing với thế mạnh về SEO, Quảng cáo đa kênh (Meta/Google Ads) và Chiến lược nội dung chuyển đổi cao. Đã trực tiếp quản lý các chiến dịch thực tế đạt ROAS 4.2x và tăng trưởng 120% traffic tự nhiên. Sẵn sàng mang tư duy tối ưu chi phí và tăng trưởng doanh thu vào doanh nghiệp.',
    sampleProject: 'Triển khai chiến dịch ra mắt sản phẩm trên Meta Ads & TikTok Ads; nghiên cứu insight khách hàng, sản xuất 15+ video ngắn và tối ưu tệp đối tượng giúp đạt ROAS 4.5x, thu về 1,200 leads tiềm năng với CPA giảm 30% so với KPI ban đầu.',
    sampleSkills: '• Paid Media: Meta Ads, Google Ads, TikTok Ads, Re-targeting\n• Content & SEO: SEO On-page, Keyword Research, Copywriting, Content Calendar\n• Analytics & Tools: Google Analytics 4, HubSpot CRM, Canva, CapCut',
    avoidBuzzwords: ['chăm chỉ', 'nhiệt tình', 'ham học hỏi', 'sáng tạo vô hạn', 'nói chung là biết làm marketing']
  },

  it_software: {
    id: 'it_software',
    name: 'Công Nghệ Thông Tin & Lập Trình Phần Mềm',
    shortName: 'IT & Software',
    icon: '💻',
    description: 'Frontend, Backend, Full-stack, Mobile, DevOps, QA/Tester, Cloud Engineering',
    keywords: [
      'developer', 'lập trình', 'kỹ sư', 'phần mềm', 'software', 'frontend', 'backend', 'fullstack',
      'code', 'dev', 'web', 'mobile', 'tester', 'qa', 'devops', 'react', 'node', 'python', 'java',
      'c#', 'golang', 'docker', 'aws', 'sql', 'typescript', 'javascript', 'next.js', 'vue', 'spring'
    ],
    coreSkills: [
      'JavaScript (ES6+) / TypeScript', 'React.js / Next.js', 'Node.js / Express',
      'PostgreSQL / MySQL / MongoDB', 'Docker & CI/CD Pipelines', 'RESTful API & GraphQL',
      'Git / GitHub Workflow', 'TailwindCSS / UI Components', 'Clean Code & Design Patterns'
    ],
    skillCategories: [
      {
        categoryName: 'Ngôn Ngữ & Nền Tảng (Languages & Core)',
        skills: ['TypeScript', 'JavaScript (ES6+)', 'HTML5/CSS3', 'SQL']
      },
      {
        categoryName: 'Frontend & Frameworks',
        skills: ['React.js', 'Next.js', 'TailwindCSS', 'Redux Toolkit / Zustand']
      },
      {
        categoryName: 'Backend & Cơ Sở Dữ Liệu',
        skills: ['Node.js', 'Express', 'PostgreSQL', 'Supabase / Firebase', 'RESTful API']
      },
      {
        categoryName: 'DevOps & Công Cụ (Tools)',
        skills: ['Git / GitHub', 'Docker', 'Postman', 'Vite', 'Vercel']
      }
    ],
    powerActionVerbs: [
      'Phát triển', 'Xây dựng', 'Thiết kế kiến trúc', 'Tối ưu hóa', 'Tích hợp', 'Triển khai',
      'Tái cấu trúc (Refactor)', 'Bảo mật hóa', 'Đóng gói Docker'
    ],
    industryMetrics: [
      'Giảm 35% thời gian phản hồi API', 'Tải trang dưới 1.2s', 'Uptime 99.9%',
      'Phục vụ 10,000+ người dùng', 'Xử lý 500 requests/s', 'Đạt điểm 9.5/10 kiểm định'
    ],
    metricRegex: /(\d+(\.\d+)?\s*(%|ms|s|giây|phút|user|users|người|tps|request|requests|điểm|star|stars|commit))/i,
    sampleObjective: 'Kỹ sư phần mềm Full-stack với nền tảng React, TypeScript và Node.js vững chắc. Có kinh nghiệm xây dựng ứng dụng web hiệu năng cao, tối ưu cơ sở dữ liệu PostgreSQL và tích hợp API thanh toán. Sẵn sàng đóng góp tư duy giải quyết vấn đề và năng lực kỹ thuật vào dự án thực tế.',
    sampleProject: 'Phát triển hệ thống E-commerce bằng React, Node.js và PostgreSQL; tích hợp thanh toán VNPay và tối ưu câu truy vấn giúp giảm 35% thời gian phản hồi API. Đồ án đạt điểm 9.5/10 và được Giảng viên cấp nhãn Verified.',
    sampleSkills: '• Languages: TypeScript, JavaScript (ES6+), SQL\n• Frontend: ReactJS, Next.js, TailwindCSS, Redux Toolkit\n• Backend & Database: Node.js, Express, PostgreSQL, Supabase\n• Tools & DevOps: Git, Docker, Postman, Vercel',
    avoidBuzzwords: ['chăm chỉ', 'ham học hỏi', 'thật thà', 'biết code sơ sơ', 'đam mê công nghệ từ nhỏ']
  },

  finance_accounting: {
    id: 'finance_accounting',
    name: 'Tài Chính, Kế Toán & Kiểm Toán',
    shortName: 'Tài Chính - Kế Toán',
    icon: '📊',
    description: 'Kế toán tổng hợp, Kế toán thuế, Phân tích tài chính, Kiểm toán, Quản trị dòng tiền',
    keywords: [
      'kế toán', 'tài chính', 'kiểm toán', 'thuế', 'ngân hàng', 'finance', 'accounting', 'audit',
      'cfa', 'acca', 'misa', 'báo cáo tài chính', 'dòng tiền', 'hóa đơn', 'sổ sách', 'chứng từ',
      'fast', 'sap', 'quyết toán', 'vas', 'ifrs', 'ngân sách'
    ],
    coreSkills: [
      'Lập Báo Cáo Tài Chính (VAS / IFRS)', 'Kế Toán Thuế & Quyết Toán Thuế',
      'Phân Tích Dòng Tiền & Quản Trị Chi Phí', 'Excel Nâng Cao (VBA, Pivot Table, VLOOKUP)',
      'Phần mềm MISA, SAP ERP, Fast Accounting', 'Thẩm Định Dự Toán & Kiểm Soát Rủi Ro',
      'Lập Kế Hoạch Ngân Sách Hàng Năm'
    ],
    skillCategories: [
      {
        categoryName: 'Nghiệp Vụ Kế Toán & Thuế (Accounting & Tax)',
        skills: ['Báo cáo tài chính (VAS)', 'Kế toán thuế TNCN/TNDN/GTGT', 'Quyết toán thuế', 'Hạch toán sổ sách']
      },
      {
        categoryName: 'Phân Tích Tài Chính & Dự Toán (Financial Analysis)',
        skills: ['Phân tích dòng tiền', 'Lập kế hoạch ngân sách', 'Kiểm soát chi phí', 'Thẩm định tài chính']
      },
      {
        categoryName: 'Phần Mềm & Công Cụ (Software & ERP)',
        skills: ['MISA SME.NET', 'Excel VBA & PivotTable', 'SAP ERP', 'Fast Accounting']
      }
    ],
    powerActionVerbs: [
      'Quyết toán', 'Kiểm toán', 'Dự báo tài chính', 'Phân tích dòng tiền', 'Tối ưu hóa chi phí',
      'Phân bổ ngân sách', 'Kiểm soát rủi ro', 'Rà soát chứng từ', 'Cân đối sổ sách'
    ],
    industryMetrics: [
      'Tiết kiệm 12% chi phí vận hành', 'Xử lý chính xác 100% chứng từ', 'Rút ngắn 3 ngày lập báo cáo tháng',
      'Quyết toán thuế cho 50+ hồ sơ', 'Độ chính xác dự toán đạt 98%', 'Quản lý ngân sách 5 tỷ VNĐ'
    ],
    metricRegex: /(\d+(\.\d+)?\s*(%|tỷ|triệu|vnđ|vnd|usd|hồ sơ|chứng từ|ngày|tháng|hóa đơn))/i,
    sampleObjective: 'Chuyên viên Kế toán - Tài chính nắm vững chuẩn mực kế toán Việt Nam (VAS) và quy trình quyết toán thuế. Thành thạo phần mềm MISA, Excel tài chính nâng cao và kỹ năng phân tích dòng tiền giúp tối ưu hóa chi phí và đảm bảo tính minh bạch, tuân thủ pháp lý.',
    sampleProject: 'Rà soát hệ thống chứng từ và xây dựng bảng tính Excel tự động hóa phân bổ chi phí cho 4 phòng ban; phát hiện và cắt giảm 12% chi phí lãng phí định kỳ, đồng thời rút ngắn 2 ngày lập báo cáo tài chính hàng tháng.',
    sampleSkills: '• Kế toán & Thuế: Báo cáo tài chính (VAS), Kế toán thuế GTGT/TNDN, Quyết toán sổ sách\n• Phân tích: Phân tích dòng tiền, Dự toán ngân sách, Kiểm soát chi phí\n• Công cụ: MISA SME.NET, Excel VBA/Pivot, Fast Accounting',
    avoidBuzzwords: ['trung thực', 'thật thà', 'chăm chỉ', 'cẩn thận', 'tính toán nhanh']
  },

  design_creative: {
    id: 'design_creative',
    name: 'Thiết Kế Đồ Họa, UI/UX & Multimedia',
    shortName: 'Thiết Kế & UI/UX',
    icon: '🎨',
    description: 'UI/UX Design, Graphic Design, Brand Identity, Motion & Video Editing, 3D Design',
    keywords: [
      'design', 'ui', 'ux', 'đồ họa', 'multimedia', 'figma', 'photoshop', 'illustrator', 'banner',
      'video', 'chỉnh sửa ảnh', 'prototype', 'wireframe', 'mỹ thuật', 'sáng tạo', 'visual', 'premiere',
      'after effects', 'design system', 'typography', 'branding'
    ],
    coreSkills: [
      'Figma (Auto Layout, Variants, Design Systems)', 'Adobe Photoshop & Illustrator',
      'Adobe Premiere Pro & After Effects', 'User Research & Persona Development',
      'Wireframing & Interactive Prototyping', 'Usability Testing & Design Handoff',
      'Typography, Grid Systems & Color Theory', 'Micro-interactions & Motion Design'
    ],
    skillCategories: [
      {
        categoryName: 'Giao Diện & Trải Nghiệm (UI/UX Design)',
        skills: ['Figma Master', 'Design System', 'Wireframe & Prototype', 'User Research', 'Usability Testing']
      },
      {
        categoryName: 'Đồ Họa & Nhận Diện (Graphic & Branding)',
        skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Brand Guidelines', 'Typography', 'Ấn phẩm in ấn']
      },
      {
        categoryName: 'Video & Chuyển Động (Motion & Media)',
        skills: ['Adobe Premiere Pro', 'After Effects', 'CapCut Pro', 'Motion Graphics']
      }
    ],
    powerActionVerbs: [
      'Thiết kế', 'Nghiên cứu hành vi người dùng', 'Xây dựng Design System', 'Sáng tạo nhận diện thương hiệu',
      'Tối ưu hóa trải nghiệm', 'Phát triển Prototype', 'Trực quan hóa ý tưởng', 'Kiểm thử khả năng sử dụng'
    ],
    industryMetrics: [
      'Điểm SUS đạt 86/100', 'Tăng 25% tỷ lệ hoàn thành tác vụ', 'Giảm 30% drop-off rate',
      'Thiết kế 50+ bộ ấn phẩm', 'Rút ngắn 40% thời gian handoff dev'
    ],
    metricRegex: /(\d+(\.\d+)?\s*(%|điểm|sus|màn hình|screens|components|bộ|ấn phẩm|drop-off))/i,
    sampleObjective: 'UI/UX Designer với tư duy thiết kế lấy người dùng làm trung tâm (User-Centered Design). Thành thạo Figma, xây dựng Design System đồng nhất và thực hiện kiểm thử người dùng (Usability Testing) để tạo ra các giao diện thẩm mỹ, tinh gọn và gia tăng tỷ lệ chuyển đổi.',
    sampleProject: 'Tái thiết kế luồng thanh toán Checkout cho ứng dụng đặt hàng trên Figma; phỏng vấn 15 người dùng, xây dựng Design System 40+ components giúp tăng 25% tỷ lệ hoàn tất đơn hàng và giảm 30% thời gian thao tác của khách hàng.',
    sampleSkills: '• UI/UX: Figma (Auto Layout, Design Systems), Wireframe, Prototyping, Usability Testing\n• Graphic: Adobe Photoshop, Illustrator, Brand Identity, Typography\n• Video: Premiere Pro, After Effects, CapCut',
    avoidBuzzwords: ['đầy tính nghệ thuật', 'gu thẩm mỹ tuyệt vời', 'yêu cái đẹp', 'chăm chỉ']
  },

  business_sales: {
    id: 'business_sales',
    name: 'Kinh Doanh, Bán Hàng & CSKH (Sales / BD)',
    shortName: 'Kinh Doanh & Sales',
    icon: '💼',
    description: 'B2B/B2C Sales, Business Development, Account Management, Telesales, Chăm sóc khách hàng',
    keywords: [
      'sales', 'kinh doanh', 'bán hàng', 'b2b', 'b2c', 'cskh', 'chăm sóc khách hàng', 'telesale',
      'phát triển thị trường', 'account executive', 'deal', 'doanh thu', 'hợp đồng', 'đàm phán',
      'crm', 'closing', 'khách hàng', 'kpi'
    ],
    coreSkills: [
      'B2B & B2C Solution Selling', 'Kỹ Năng Đàm Phán & Chốt Hợp Đồng (Closing)',
      'Quản Trị Quan Hệ Khách Hàng (CRM Hubspot/Salesforce)', 'Tư Vấn Giải Pháp & Thuyết Trình',
      'Tìm Kiếm Khách Hàng Tiềm Năng (Prospecting)', 'Chăm Sóc & Duy Trì Khách Hàng VIP',
      'Phân Tích Nhu Cầu & Xử Lý Từ Chối (Objection Handling)'
    ],
    skillCategories: [
      {
        categoryName: 'Kỹ Năng Bán Hàng (Sales Execution)',
        skills: ['B2B Solution Selling', 'Kỹ năng đàm phán & Closing', 'Xử lý từ chối', 'Cold Calling & Pitching']
      },
      {
        categoryName: 'Quản Trị Mối Quan Hệ (Account Management)',
        skills: ['CRM (HubSpot, Salesforce)', 'Chăm sóc khách hàng VIP', 'Gia tăng giá trị đơn (Upsell/Cross-sell)']
      },
      {
        categoryName: 'Nghiên Cứu & Phát Triển (Business Development)',
        skills: ['Nghiên cứu thị trường', 'Mở rộng đối tác kênh', 'Lập kế hoạch doanh số']
      }
    ],
    powerActionVerbs: [
      'Thương lượng', 'Chốt hợp đồng', 'Mở rộng thị trường', 'Đạt doanh số', 'Xây dựng mối quan hệ',
      'Tư vấn giải pháp', 'Gia tăng tỷ lệ giữ chân', 'Khai thác tệp khách hàng'
    ],
    industryMetrics: [
      'Đạt 135% chỉ tiêu doanh số', 'Doanh thu 1.5 tỷ VNĐ', 'Tỷ lệ chốt deal đạt 32%',
      'Ký kết thành công 25 hợp đồng doanh nghiệp', 'Tỷ lệ hài lòng khách hàng CSAT 96%'
    ],
    metricRegex: /(\d+(\.\d+)?\s*(%|tỷ|triệu|vnđ|vnd|usd|hợp đồng|deals|deal|khách hàng|csat|kpi))/i,
    sampleObjective: 'Chuyên viên Phát triển Kinh doanh / B2B Sales năng động với kỹ năng đàm phán, phân tích nhu cầu và xây dựng mạng lưới đối tác chiến lược. Có kinh nghiệm tiếp cận khách hàng doanh nghiệp, duy trì tỷ lệ vượt KPI trung bình 125% và tối ưu quy trình bán hàng.',
    sampleProject: 'Tiếp cận và đàm phán cung cấp giải pháp chuyển đổi số cho 30+ doanh nghiệp vừa và nhỏ; thành công ký kết 12 hợp đồng năm với tổng giá trị 850 triệu VNĐ, vượt 20% chỉ tiêu KPI quý được giao.',
    sampleSkills: '• Sales Skills: B2B Solution Selling, Đàm phán & Chốt hợp đồng, Xử lý từ chối\n• Account & CRM: HubSpot CRM, Chăm sóc khách hàng VIP, Upsell\n• Phân tích: Đánh giá nhu cầu thị trường, Lập kế hoạch doanh số',
    avoidBuzzwords: ['hoạt ngôn', 'chém gió giỏi', 'chăm chỉ gọi điện', 'nhiệt tình']
  },

  human_resources: {
    id: 'human_resources',
    name: 'Quản Trị Nhân Sự & Tuyển Dụng (HR / Talent Acquisition)',
    shortName: 'Nhân Sự & HR',
    icon: '👥',
    description: 'Talent Acquisition, Headhunting, C&B, L&D Đào tạo, Văn hóa doanh nghiệp, Luật Lao động',
    keywords: [
      'nhân sự', 'tuyển dụng', 'hr', 'human resource', 'c&b', 'talent', 'đào tạo', 'headhunt',
      'lương', 'phúc lợi', 'luật lao động', 'onboarding', 'đánh giá kpi', 'l&d', 'employer branding'
    ],
    coreSkills: [
      'Thu Hút Tài Năng & Săn Đầu Người (Talent Acquisition / Headhunting)',
      'Phỏng Vấn & Đánh Giá Ứng Viên (STAR Interviewing)',
      'C&B (Tiền Lương, Thưởng, BHXH & Phúc Lợi)', 'Nắm Vững Luật Lao Động Việt Nam',
      'Tổ Chức Chương Trình Đào Tạo & Phát Triển (L&D)',
      'Xây Dựng Văn Hóa Doanh Nghiệp & Quy Trình Onboarding',
      'Xây Dựng Thương Hiệu Nhà Tuyển Dụng (Employer Branding)'
    ],
    skillCategories: [
      {
        categoryName: 'Tuyển Dụng & Thu Hút Tài Năng (Recruitment)',
        skills: ['Sourcing đa kênh (LinkedIn, TopCV)', 'Phỏng vấn theo mô hình STAR', 'Headhunting chuyên sâu']
      },
      {
        categoryName: 'C&B & Pháp Lý Lao Động (Compensation & Labor Law)',
        skills: ['Tính lương & BHXH', 'Chế độ phúc lợi', 'Hợp đồng lao động & Pháp lý']
      },
      {
        categoryName: 'Đào Tạo & Văn Hóa (L&D & Culture)',
        skills: ['Quy trình Onboarding', 'Tổ chức Workshop đào tạo', 'Gắn kết nhân viên (Engagement)']
      }
    ],
    powerActionVerbs: [
      'Tuyển dụng', 'Sàng lọc hồ sơ', 'Tổ chức đào tạo', 'Chuẩn hóa quy trình', 'Gắn kết nhân sự',
      'Đánh giá năng lực', 'Phát triển thương hiệu nhà tuyển dụng', 'Thương lượng đãi ngộ'
    ],
    industryMetrics: [
      'Tuyển dụng thành công 40+ vị trí chuyên môn', 'Giảm 25% thời gian tuyển dụng (Time-to-hire)',
      'Tỷ lệ vượt thử việc 92%', 'Tổ chức 8 buổi workshop nội bộ', 'Điểm eNPS tăng 18 điểm'
    ],
    metricRegex: /(\d+(\.\d+)?\s*(%|nhân sự|ứng viên|vị trí|ngày|tháng|buổi|workshop|enps|pass))/i,
    sampleObjective: 'Chuyên viên Nhân sự & Tuyển dụng (HR) với am hiểu sâu về quy trình tuyển dụng đa kênh, văn hóa doanh nghiệp và Luật Lao động Việt Nam. Định hướng chuyên sâu về Employer Branding và phát triển lộ trình đào tạo giữ chân nhân tài cho tổ chức.',
    sampleProject: 'Chủ trì chiến dịch tuyển dụng thực tập sinh tài năng quy mô 200+ ứng viên; chuẩn hóa quy trình phỏng vấn 2 vòng và tổ chức chuỗi Onboarding 14 ngày, giúp 100% ứng viên được chọn hòa nhập nhanh và vượt qua kỳ thử việc.',
    sampleSkills: '• Tuyển dụng: Sourcing đa kênh (LinkedIn, TopCV), Phỏng vấn STAR, Headhunt\n• C&B & Pháp lý: Tính lương & BHXH, Luật Lao động, Hợp đồng lao động\n• Đào tạo & Văn hóa: Onboarding, Workshop nội bộ, Employer Branding',
    avoidBuzzwords: ['thích nói chuyện với con người', 'hoạt bát', 'nhiệt tình', 'vui vẻ']
  },

  logistics_supply_chain: {
    id: 'logistics_supply_chain',
    name: 'Logistics, Xuất Nhập Khẩu & Chuỗi Cung Ứng',
    shortName: 'Logistics & Chuỗi Cung Ứng',
    icon: '🚚',
    description: 'Thủ tục hải quan, Xuất nhập khẩu (XNK), Quản lý kho bãi, Điều phối vận tải, Incoterms',
    keywords: [
      'logistics', 'xuất nhập khẩu', 'xnk', 'hải quan', 'chuỗi cung ứng', 'supply chain', 'kho bãi',
      'warehouse', 'forwarder', 'incoterms', 'vận tải', 'tồn kho', 'chứng từ', 'vnaccs', 'cước tàu',
      'b/l', 'bill of lading', 'co', 'cq', 'hàng hóa'
    ],
    coreSkills: [
      'Thủ Tục Hải Quan Điện Tử (VNACCS/VCIS)', 'Quy Tắc Thương Mại Quốc Tế (Incoterms 2020)',
      'Bộ Chứng Từ Xuất Nhập Khẩu (B/L, C/O, Invoice, Packing List)',
      'Quản Lý Kho Bãi & Hàng Tồn Kho (WMS / ERP)', 'Điều Phối Vận Tải Đa Phương Thức (Air/Sea/Trucking)',
      'Đàm Phán Cước Tàu & Hãng Vận Chuyển', 'Kiểm Soát Chi Phí & Tối Ưu Lộ Trình'
    ],
    skillCategories: [
      {
        categoryName: 'Xuất Nhập Khẩu & Hải Quan (Customs & Foreign Trade)',
        skills: ['Khai báo hải quan VNACCS', 'Incoterms 2020', 'Chứng từ XNK (B/L, C/O, Inv/PKL)', 'Thanh toán quốc tế (L/C, T/T)']
      },
      {
        categoryName: 'Kho Bãi & Tồn Kho (Warehouse & Inventory)',
        skills: ['Quản trị kho WMS', 'Kiểm soát hàng tồn kho (FIFO/LIFO)', 'An toàn hàng hóa']
      },
      {
        categoryName: 'Vận Tải & Điều Phối (Freight & Dispatching)',
        skills: ['Điều phối xe tải / cước tàu', 'Tối ưu tuyến đường', 'Đàm phán Forwarder']
      }
    ],
    powerActionVerbs: [
      'Điều phối', 'Xử lý thủ tục hải quan', 'Tối ưu hóa tuyến vận tải', 'Quản lý tồn kho',
      'Đàm phán cước phí', 'Giám sát giao nhận', 'Rút ngắn thời gian thông quan', 'Kiểm soát chi phí logistics'
    ],
    industryMetrics: [
      'Rút ngắn 24 giờ thời gian thông quan', 'Cắt giảm 14% chi phí lưu kho', 'Độ chính xác soạn hàng 99.8%',
      'Xử lý thành công 150+ bộ tờ khai hải quan', 'Tỷ lệ giao hàng đúng hạn On-time Delivery đạt 98.5%'
    ],
    metricRegex: /(\d+(\.\d+)?\s*(%|tờ khai|chuyến|cont|container|tấn|kg|giờ|ngày|đơn|on-time))/i,
    sampleObjective: 'Cử nhân chuyên ngành Logistics & Quản lý Chuỗi cung ứng với kiến thức thực tế về Incoterms, thủ tục hải quan điện tử VNACCS và quy trình điều phối vận chuyển quốc tế. Định hướng nâng cao hiệu suất chuỗi cung ứng và giảm thiểu chi phí lưu kho.',
    sampleProject: 'Tối ưu hóa quy trình phân loại hàng tồn kho và điều phối 3 nhà xe liên tỉnh; giảm 15% chi phí phát sinh do lưu kho và nâng tỷ lệ giao hàng đúng hẹn tới các đại lý từ 91% lên 98.5%.',
    sampleSkills: '• XNK & Hải quan: Khai báo VNACCS, Incoterms 2020, Bộ chứng từ B/L, C/O, L/C\n• Kho bãi & Tồn kho: Quản lý WMS, Định mức tồn kho, Kiểm đếm FIFO\n• Vận tải: Điều phối đội xe, Đàm phán cước tàu, Tối ưu chi phí logistics',
    avoidBuzzwords: ['chịu khó đi lại', 'chăm chỉ', 'sức khỏe tốt']
  },

  data_analytics: {
    id: 'data_analytics',
    name: 'Phân Tích Dữ Liệu & Business Intelligence (Data Analyst)',
    shortName: 'Data Analyst & BI',
    icon: '📈',
    description: 'Data Analysis, SQL, Power BI / Tableau, Python Data Science, Statistical Modeling, ETL',
    keywords: [
      'data', 'dữ liệu', 'bi', 'business intelligence', 'power bi', 'tableau', 'phân tích dữ liệu',
      'data analyst', 'sql', 'python', 'pandas', 'dashboard', 'insight', 'a/b testing', 'etl',
      'statistical', 'mô hình dữ liệu', 'dax', 'excel advanced'
    ],
    coreSkills: [
      'SQL Truy Vấn & Tối Ưu Hóa (Complex Queries, Window Functions)',
      'Trực Quan Hóa Dữ Liệu (Power BI, Tableau, Looker Studio)',
      'Python for Data Analysis (Pandas, NumPy, Matplotlib, Seaborn)',
      'Xử Lý & Làm Sạch Dữ Liệu (Data Cleaning & ETL Pipelines)',
      'Phân Tích Xu Hướng & Dự Báo (Time-series Forecasting)',
      'Thống Kê Ứng Dụng & A/B Testing', 'Data Storytelling & Trình Bày Insight Cho C-level'
    ],
    skillCategories: [
      {
        categoryName: 'Truy Vấn & Xử Lý Dữ Liệu (Data Querying & ETL)',
        skills: ['SQL nâng cao (PostgreSQL, MySQL)', 'Python (Pandas, NumPy)', 'ETL Pipeline', 'Excel nâng cao (Power Query, DAX)']
      },
      {
        categoryName: 'Trực Quan Hóa & Báo Cáo (BI & Visualization)',
        skills: ['Power BI (DAX, Data Modeling)', 'Tableau Dashboard', 'Looker Studio', 'Data Storytelling']
      },
      {
        categoryName: 'Thống Kê & Phân Tích (Analytics & Methods)',
        skills: ['A/B Testing', 'Phân tích Cohort', 'Phân đoạn khách hàng (RFM)', 'Dự báo kinh doanh']
      }
    ],
    powerActionVerbs: [
      'Trực quan hóa', 'Xây dựng Dashboard', 'Khai phá dữ liệu (Mining)', 'Phân tích xu hướng',
      'Tối ưu câu truy vấn', 'Cung cấp Insight chiến lược', 'Mô hình hóa dữ liệu', 'Tự động hóa báo cáo'
    ],
    industryMetrics: [
      'Xây dựng 12+ Automated Dashboards phục vụ C-level', 'Xử lý tập dữ liệu 3M+ dòng',
      'Phát hiện insight giúp tăng 14% tỷ lệ giữ chân', 'Rút ngắn 80% thời gian tổng hợp báo cáo thủ công'
    ],
    metricRegex: /(\d+(\.\d+)?\s*(%|dòng|records|báo cáo|dashboards|dashboard|tỷ|triệu|giờ|ngày))/i,
    sampleObjective: 'Data Analyst với thế mạnh về SQL, Power BI và phân tích dữ liệu kinh doanh bằng Python. Khả năng chuyển hóa dữ liệu thô thành các Dashboard trực quan và Insight giá trị, giúp Ban lãnh đạo đưa ra các quyết định chiến lược dựa trên dữ liệu (Data-Driven).',
    sampleProject: 'Thiết kế hệ thống Báo cáo Dashboard tự động trên Power BI kết nối SQL Server; phân tích hành vi mua sắm của 50,000 khách hàng, tìm ra phân khúc khách hàng tiềm năng giúp đội Sales tăng 18% doanh số bán chéo.',
    sampleSkills: '• Query & Code: SQL (PostgreSQL, MySQL), Python (Pandas, NumPy), Power Query\n• BI Tools: Power BI (DAX, Data Modeling), Tableau, Looker Studio\n• Analysis: A/B Testing, Phân tích RFM, Tự động hóa báo cáo định kỳ',
    avoidBuzzwords: ['chăm chỉ', 'thích nhìn số liệu', 'biết excel căn bản']
  },

  healthcare_nursing: {
    id: 'healthcare_nursing',
    name: 'Y Tế, Điều Dưỡng & Dược (Healthcare / Pharma)',
    shortName: 'Y Dược & Điều Dưỡng',
    icon: '🩺',
    description: 'Dược sĩ lâm sàng, tư vấn y dược, điều dưỡng, chăm sóc người bệnh, kiểm soát nhiễm khuẩn & quản lý thuốc',
    keywords: [
      'dược', 'dược sĩ', 'lâm sàng', 'tư vấn y dược', 'y tế', 'điều dưỡng', 'y tá', 'bệnh viện', 'bác sĩ',
      'tiêm truyền', 'kê đơn', 'thuốc', 'nhà thuốc', 'gpp', 'adr', 'vô khuẩn', 'bệnh nhân', 'y khoa',
      'icu', 'phòng khám', 'pharma', 'dược phẩm'
    ],
    coreSkills: [
      'Dược Lý Học & Phân Tích Tương Tác Thuốc', 'Tư Vấn Sử Dụng Thuốc An Toàn, Hợp Lý',
      'Quy Chuẩn Thực Hành Tốt Nhà Thuốc (GPP / GSP)', 'Dược Lâm Sàng & Giám Sát Phản Ứng Có Hại (ADR)',
      'Quy Trình Chăm Sóc Y Tế Chuẩn Bộ Y Tế', 'Kiểm Soát Nhiễm Khuẩn Bệnh Viện',
      'Quản Lý & Cấp Phát Thuốc An Toàn (Quy tắc 5 Đúng)', 'Ghi Chép Hồ Sơ Bệnh Án Điện Tử (HIS / EMR)'
    ],
    skillCategories: [
      {
        categoryName: 'Dược Lâm Sàng & Tư Vấn (Clinical Pharmacy)',
        skills: ['Phân tích đơn thuốc', 'Giám sát phản ứng ADR', 'Tư vấn sử dụng thuốc an toàn', 'Tra cứu Dược thư & Micromedex', 'Thực hành chuẩn GPP']
      },
      {
        categoryName: 'Chăm Sóc & Kỹ Thuật Y Khoa (Healthcare & Nursing)',
        skills: ['Đo dấu hiệu sinh tồn', 'Kỹ thuật tiêm truyền vô khuẩn', 'Hồi sức tim phổi (CPR/BLS)', 'Kiểm soát nhiễm khuẩn']
      },
      {
        categoryName: 'Quản Trị & Hồ Sơ Y Tế (Medical Management)',
        skills: ['Hệ thống bệnh án điện tử (HIS/EMR)', 'Quy tắc 5 đúng cấp phát thuốc', 'Y đức & Luật Khám chữa bệnh', 'Quản lý kho dược GSP']
      }
    ],
    powerActionVerbs: [
      'Tư vấn y dược', 'Phân tích tương tác thuốc', 'Giám sát phản ứng ADR', 'Chăm sóc người bệnh',
      'Cấp phát thuốc an toàn', 'Kiểm soát nhiễm khuẩn', 'Tối ưu hóa phác đồ', 'Phối hợp điều trị'
    ],
    industryMetrics: [
      'Tư vấn an toàn 100% đơn thuốc', 'Phát hiện & can thiệp 15+ ca tương tác thuốc', '0 sự cố sai sót cấp phát',
      'Tỷ lệ bệnh nhân hài lòng 98%', 'Đạt 500+ giờ thực hành lâm sàng tại bệnh viện'
    ],
    metricRegex: /(\d+(\.\d+)?\s*(%|bệnh nhân|ca|đơn|thuốc|giờ|phút|giường|hồ sơ|lượt))/i,
    sampleObjective: 'Dược sĩ Lâm sàng tốt nghiệp Đại học Y Dược với kiến thức chuyên sâu về Dược lý học, tương tác thuốc và tư vấn điều trị an toàn, hợp lý. Nắm vững quy chuẩn GPP, kỹ năng phân tích đơn thuốc và giám sát phản ứng có hại (ADR), sẵn sàng cống hiến cho công tác chăm sóc sức khỏe cộng đồng và nâng cao chất lượng điều trị.',
    sampleProject: 'Chủ trì đề tài tối ưu hóa quy trình tư vấn và giám sát tương tác thuốc cho 120+ bệnh nhân tim mạch - đái tháo đường; phát hiện và can thiệp kịp thời 15 ca tương tác thuốc bất lợi tiềm tàng, nâng cao tỷ lệ tuân thủ điều trị của người bệnh lên 94%.',
    sampleSkills: '• Dược lâm sàng: Phân tích đơn thuốc, Giám sát ADR, Tư vấn sử dụng thuốc, Tra cứu Micromedex\n• Quy chuẩn Y Dược: Tiêu chuẩn GPP / GSP, Luật Dược 2016, Quản lý kho thuốc bệnh viện\n• Kỹ năng mềm & Công nghệ: Giao tiếp bệnh nhân, Hệ thống bệnh án điện tử HIS/EMR',
    avoidBuzzwords: ['thương người', 'chăm chỉ', 'thật thà', 'nhiệt tình']
  },

  general: {
    id: 'general',
    name: 'Đa Ngành Nghề / Tổng Quát',
    shortName: 'Tổng Quát',
    icon: '✨',
    description: 'Áp dụng cho mọi vị trí công việc, chú trọng phương pháp STAR và kết quả định lượng',
    keywords: [],
    coreSkills: [
      'Kỹ năng giao tiếp chuyên nghiệp', 'Giải quyết vấn đề linh hoạt',
      'Quản lý thời gian & Tiến độ', 'Làm việc nhóm & Phối hợp liên phòng ban',
      'Tin học văn phòng & Báo cáo số liệu', 'Ngoại ngữ giao tiếp (Tiếng Anh)'
    ],
    skillCategories: [
      {
        categoryName: 'Kỹ Năng Chuyên Môn Cốt Lõi',
        skills: ['Kỹ năng nghiệp vụ chính', 'Quy trình công việc chuẩn', 'Quản lý dự án']
      },
      {
        categoryName: 'Kỹ Năng Mềm & Hiệu Suất',
        skills: ['Giao tiếp chuyên nghiệp', 'Tư duy giải quyết vấn đề', 'Quản lý thời gian']
      }
    ],
    powerActionVerbs: [
      'Thực hiện', 'Tổ chức', 'Quản lý', 'Hoàn thành', 'Hỗ trợ', 'Nâng cao', 'Đạt được', 'Phối hợp'
    ],
    industryMetrics: ['Tăng 20% hiệu suất', 'Tiết kiệm thời gian xử lý', 'Đạt đánh giá xuất sắc 95%'],
    metricRegex: /(\d+(\.\d+)?\s*(%|người|dự án|kpi|điểm|giờ|ngày))/i,
    sampleObjective: 'Ứng viên chuyên nghiệp với tinh thần trách nhiệm cao, kỹ năng tổ chức công việc khoa học và tư duy giải quyết vấn đề linh hoạt. Mong muốn cống hiến năng lực và kinh nghiệm để tạo ra giá trị bền vững cho tổ chức.',
    sampleProject: 'Chủ trì tổ chức chương trình sự kiện quy mô 300+ người tham dự; phân bổ ngân sách, phối hợp với các ban chuyên môn đảm bảo 100% hoạt động diễn ra đúng tiến độ và nhận phản hồi hài lòng 96%.',
    sampleSkills: '• Chuyên môn: Quản lý dự án, Phân tích nhu cầu, Lập kế hoạch\n• Kỹ năng mềm: Giao tiếp, Làm việc nhóm, Giải quyết vấn đề\n• Công cụ: MS Office nâng cao, Trello, Google Workspace',
    avoidBuzzwords: ['chăm chỉ', 'nhiệt tình', 'ham học hỏi']
  }
};

/**
 * Automatically detects the student's industry domain from their Job Title, Major, or CV content
 */
export function detectIndustryDomain(inputText?: string): IndustryDomainConfig {
  if (!inputText) return INDUSTRY_DOMAINS.it_software;

  const text = inputText.toLowerCase();

  for (const [id, config] of Object.entries(INDUSTRY_DOMAINS)) {
    if (id === 'general') continue;
    const matchCount = config.keywords.filter(kw => text.includes(kw)).length;
    if (matchCount > 0) {
      return config;
    }
  }

  return INDUSTRY_DOMAINS.it_software;
}

/**
 * Default step guidances for backward compatibility
 */
export const CV_STEP_GUIDANCES: Record<CVCoachSection, StepGuidance> = {
  summary: {
    section: 'summary',
    stepNumber: 1,
    title: '1. Tóm Tắt Nghề Nghiệp & Mục Tiêu',
    subtitle: 'Tạo ấn tượng đầu tiên mạnh mẽ trong 2 - 4 câu đúng trọng tâm chuyên môn',
    instructions: [
      'Nêu rõ vị trí ứng tuyển mục tiêu.',
      'Liệt kê 3 - 4 kỹ năng / công cụ thế mạnh nhất.',
      'Khẳng định giá trị định lượng bạn mang lại cho doanh nghiệp.',
      'Tuyệt đối tránh các từ ngữ sáo rỗng cảm tính như: "chăm chỉ", "ham học hỏi".'
    ],
    tips: [
      'Mở đầu bằng vị trí + cấp độ / số năm kinh nghiệm.',
      'Độ dài lý tưởng từ 40 - 80 từ súc tích.'
    ],
    sampleGood: INDUSTRY_DOMAINS.it_software.sampleObjective,
    sampleBad: 'Em là sinh viên mới tốt nghiệp, rất chăm chỉ, thật thà, ham học hỏi và mong muốn tìm công việc phù hợp để học hỏi thêm kinh nghiệm từ các anh chị.'
  },
  project: {
    section: 'project',
    stepNumber: 2,
    title: '2. Mô Tả Dự Án / Kinh Nghiệm Thực Tế',
    subtitle: 'Áp dụng công thức STAR: Động từ hành động + Nghiệp vụ/Công cụ + Con số đo lường',
    instructions: [
      'Bắt đầu bằng động từ hành động mạnh.',
      'Nêu rõ các nghiệp vụ & công cụ đã áp dụng.',
      'Bắt buộc có ít nhất 1 con số / KPI đo lường cụ thể.',
      'Đính kèm link bằng chứng, sản phẩm hoặc nhãn Verified nếu có.'
    ],
    tips: [
      'Dùng tỷ lệ % tăng trưởng hoặc chỉ số đo lường để gây ấn tượng mạnh.',
      'Nhấn mạnh vào kết quả thực tế đạt được thay vì chỉ liệt kê nhiệm vụ.'
    ],
    sampleGood: INDUSTRY_DOMAINS.it_software.sampleProject,
    sampleBad: 'Tham gia làm bài tập lớn với nhóm bạn, làm việc nhóm vui vẻ và nộp bài đúng hạn.'
  },
  skills: {
    section: 'skills',
    stepNumber: 3,
    title: '3. Kỹ Năng Chuyên Môn',
    subtitle: 'Phân loại kỹ năng theo các nhóm chuyên môn rõ ràng và mạch lạc',
    instructions: [
      'Phân chia kỹ năng theo các nhóm chuẩn ngành.',
      'Tập trung vào các kỹ năng cốt lõi được săn đón.',
      'Lược bỏ các kỹ năng cơ bản không liên quan đến vị trí ứng tuyển.'
    ],
    tips: [
      'Format chuẩn: [Nhóm kỹ năng]: Skill 1, Skill 2, Skill 3...',
      'Đưa kỹ năng bạn tự tin và thành thạo nhất lên đầu danh sách.'
    ],
    sampleGood: INDUSTRY_DOMAINS.it_software.sampleSkills,
    sampleBad: 'Biết tin học văn phòng Word, Excel, biết làm việc nhóm, giao tiếp tốt, chăm chỉ.'
  },
  contact: {
    section: 'contact',
    stepNumber: 4,
    title: '4. Thông Tin Liên Hệ & Bằng Chứng Số',
    subtitle: 'Tối giản thông tin liên lạc và bổ sung liên kết kiểm chứng sản phẩm',
    instructions: [
      'Cung cấp Họ tên, Email chuyên nghiệp, Số điện thoại và Tỉnh/Thành phố sinh sống.',
      'KHÔNG ghi địa chỉ nhà chi tiết (số nhà, ngõ ngách) để bảo mật thông tin.',
      'Cung cấp các đường link kiểm chứng: LinkedIn, Portfolio, GitHub hoặc sản phẩm thực tế.'
    ],
    tips: [
      'Email nên có định dạng chuyên nghiệp.',
      'Đảm bảo tất cả các đường link đính kèm đều truy cập được bình thường.'
    ],
    sampleGood: 'Nguyễn Văn A | Software Developer\nEmail: nguyenvana.dev@gmail.com | SĐT: 0912 345 678 | TP. Hồ Chí Minh\nLinkedIn: linkedin.com/in/nguyenvana | GitHub: github.com/nguyenvana',
    sampleBad: 'Nguyễn Văn A - Sinh viên\nSố nhà 123/45/6 đường ABC, Phường X, Quận Y, TP. HCM\nEmail: boykute_deptrai99@yahoo.com | Facebook cá nhân: fb.com/profile123'
  }
};

/**
 * Returns list of all available industry domains
 */
export function getAvailableIndustryDomains(): IndustryDomainConfig[] {
  return Object.values(INDUSTRY_DOMAINS);
}

/**
 * Get dynamic step guidance customized to the candidate's industry domain
 */
export function getStepGuidance(section: CVCoachSection, domainInput?: string): StepGuidance {
  const domain = detectIndustryDomain(domainInput);

  switch (section) {
    case 'summary':
      return {
        section: 'summary',
        stepNumber: 1,
        title: `1. Tóm Tắt Nghề Nghiệp (${domain.shortName})`,
        subtitle: 'Tạo ấn tượng đầu tiên mạnh mẽ trong 2 - 4 câu đúng trọng tâm chuyên môn',
        instructions: [
          `Nêu rõ vị trí ứng tuyển mục tiêu thuộc lĩnh vực ${domain.name}.`,
          `Liệt kê 3 - 4 kỹ năng / công cụ thế mạnh nhất (ví dụ: ${domain.coreSkills.slice(0, 3).join(', ')}).`,
          'Khẳng định giá trị định lượng bạn mang lại cho doanh nghiệp.',
          'Tuyệt đối tránh các từ ngữ sáo rỗng cảm tính như: "chăm chỉ", "ham học hỏi".'
        ],
        tips: [
          `Mở đầu bằng vị trí + cấp độ / số năm kinh nghiệm.`,
          'Độ dài lý tưởng từ 40 - 80 từ súc tích.'
        ],
        sampleGood: domain.sampleObjective,
        sampleBad: 'Em là sinh viên mới tốt nghiệp, rất chăm chỉ, thật thà, ham học hỏi và mong muốn tìm công việc phù hợp để học hỏi thêm kinh nghiệm từ các anh chị.'
      };

    case 'project':
      return {
        section: 'project',
        stepNumber: 2,
        title: `2. Mô Tả Dự Án / Kinh Nghiệm Thực Tế (${domain.shortName})`,
        subtitle: 'Áp dụng công thức STAR: Động từ hành động + Nghiệp vụ/Công cụ + Con số đo lường',
        instructions: [
          `Bắt đầu bằng động từ hành động mạnh: ${domain.powerActionVerbs.slice(0, 4).join(', ')}...`,
          `Nêu rõ các nghiệp vụ & công cụ đã áp dụng (ví dụ: ${domain.coreSkills.slice(0, 3).join(', ')}).`,
          `Bắt buộc có ít nhất 1 con số / KPI đo lường cụ thể (ví dụ: ${domain.industryMetrics.slice(0, 3).join(', ')}).`,
          'Đính kèm link bằng chứng, sản phẩm hoặc nhãn Verified nếu có.'
        ],
        tips: [
          'Dùng tỷ lệ % tăng trưởng hoặc chỉ số đo lường để gây ấn tượng mạnh.',
          'Nhấn mạnh vào kết quả thực tế đạt được thay vì chỉ liệt kê nhiệm vụ.'
        ],
        sampleGood: domain.sampleProject,
        sampleBad: 'Tham gia làm bài tập lớn với nhóm bạn, làm việc nhóm vui vẻ và nộp bài đúng hạn.'
      };

    case 'skills':
      return {
        section: 'skills',
        stepNumber: 3,
        title: `3. Kỹ Năng Chuyên Môn (${domain.shortName})`,
        subtitle: 'Phân loại kỹ năng theo các nhóm chuyên môn rõ ràng và mạch lạc',
        instructions: [
          `Phân chia kỹ năng theo các nhóm chuẩn ngành: ${domain.skillCategories.map(c => c.categoryName.split('(')[0].trim()).join(', ')}.`,
          `Tập trung vào các kỹ năng cốt lõi được săn đón: ${domain.coreSkills.slice(0, 4).join(', ')}.`,
          'Lược bỏ các kỹ năng cơ bản không liên quan đến vị trí ứng tuyển.'
        ],
        tips: [
          'Format chuẩn: [Nhóm kỹ năng]: Skill 1, Skill 2, Skill 3...',
          'Đưa kỹ năng bạn tự tin và thành thạo nhất lên đầu danh sách.'
        ],
        sampleGood: domain.sampleSkills,
        sampleBad: 'Biết tin học văn phòng Word, Excel, biết làm việc nhóm, giao tiếp tốt, chăm chỉ.'
      };

    case 'contact':
    default:
      return {
        section: 'contact',
        stepNumber: 4,
        title: '4. Thông Tin Liên Hệ & Bằng Chứng Số',
        subtitle: 'Tối giản thông tin liên lạc và bổ sung liên kết kiểm chứng sản phẩm',
        instructions: [
          'Cung cấp Họ tên, Email chuyên nghiệp, Số điện thoại và Tỉnh/Thành phố sinh sống.',
          'KHÔNG ghi địa chỉ nhà chi tiết (số nhà, ngõ ngách) để bảo mật thông tin.',
          'Cung cấp các đường link kiểm chứng: LinkedIn, Portfolio, GitHub hoặc sản phẩm thực tế.'
        ],
        tips: [
          'Email nên có định dạng chuyên nghiệp (ví dụ: `nguyenvan.marketing@gmail.com`).',
          'Đảm bảo tất cả các đường link đính kèm đều truy cập được bình thường.'
        ],
        sampleGood: 'Nguyễn Văn A | Chuyên Viên Marketing\nEmail: nguyenvana.mkt@gmail.com | SĐT: 0912 345 678 | TP. Hồ Chí Minh\nLinkedIn: linkedin.com/in/nguyenvana | Portfolio: nguyenvana.me',
        sampleBad: 'Nguyễn Văn A - Sinh viên\nSố nhà 123/45/6 đường ABC, Phường X, Quận Y, TP. HCM\nEmail: boykute_deptrai99@yahoo.com | Facebook cá nhân: fb.com/profile123'
      };
  }
}

/**
 * Evaluates a CV section against domain-specific rubrics
 */
export function evaluateCvSection(
  section: CVCoachSection,
  content: string,
  context?: {
    jobTarget?: string;
    verifiedProjects?: Project[];
    domainId?: IndustryDomainId;
  }
): AICoachEvaluation {
  const text = (content || '').trim();
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const domain = context?.domainId
    ? INDUSTRY_DOMAINS[context.domainId] || detectIndustryDomain(context?.jobTarget)
    : detectIndustryDomain(context?.jobTarget || text);

  console.log(`🤖 [AI CV Coach] Đang đánh giá phần [${section.toUpperCase()}] bằng AI Coach Barem Engine (Ngành: ${domain.name})`);

  if (wordCount < 6) {
    const guidance = getStepGuidance(section, domain.id);
    return {
      section,
      status: 'needs_improvement',
      score: 30,
      criteriaChecklist: [
        {
          id: 'length_min',
          criterion: 'Độ dài tối thiểu',
          passed: false,
          feedback: 'Nội dung quá ngắn. Vui lòng viết câu hoàn chỉnh theo hướng dẫn chuyên môn.'
        }
      ],
      conciseFeedback: `Nội dung phần ${guidance.title} còn quá ngắn, chưa đủ dữ liệu để đánh giá chuyên môn.`,
      suggestedImprovement: guidance.sampleGood,
      nextPrompt: 'Hãy thử viết lại dựa theo mẫu chuẩn ngành gợi ý bên dưới nhé!',
      detectedDomain: {
        id: domain.id,
        name: domain.name,
        icon: domain.icon
      }
    };
  }

  let evaluation: AICoachEvaluation;

  switch (section) {
    case 'summary':
      evaluation = evaluateSummary(text, lower, wordCount, domain, context?.jobTarget);
      break;
    case 'project':
      evaluation = evaluateProject(text, lower, wordCount, domain);
      break;
    case 'skills':
      evaluation = evaluateSkills(text, lower, wordCount, domain);
      break;
    case 'contact':
      evaluation = evaluateContact(text, lower, domain);
      break;
    default:
      evaluation = {
        section,
        status: 'pass',
        score: 80,
        criteriaChecklist: [],
        conciseFeedback: 'Nội dung hợp lệ.'
      };
  }

  evaluation.detectedDomain = {
    id: domain.id,
    name: domain.name,
    icon: domain.icon
  };

  return evaluation;
}

/**
 * 1. Evaluate Professional Summary with Domain Awareness
 */
function evaluateSummary(
  text: string,
  lower: string,
  wordCount: number,
  domain: IndustryDomainConfig,
  jobTarget?: string
): AICoachEvaluation {
  const checklist: CriterionResult[] = [];
  let score = 50;

  // Criterion 1: Length (ideal 20 - 90 words)
  const isGoodLength = wordCount >= 20 && wordCount <= 90;
  if (isGoodLength) {
    score += 15;
    checklist.push({
      id: 'c_length',
      criterion: 'Độ dài chuẩn (2 - 4 câu súc tích)',
      passed: true,
      feedback: `Độ dài chuẩn (${wordCount} từ).`
    });
  } else {
    checklist.push({
      id: 'c_length',
      criterion: 'Độ dài chuẩn (2 - 4 câu súc tích)',
      passed: false,
      feedback: wordCount < 20 ? 'Hơi ngắn, nên viết từ 2-4 câu để nêu bật năng lực.' : 'Hơi dài dòng, nên tinh gọn lại dưới 90 từ.'
    });
  }

  // Criterion 2: Job target / Role orientation
  const hasRole = domain.keywords.some(kw => lower.includes(kw)) || (jobTarget && lower.includes(jobTarget.toLowerCase()));
  if (hasRole) {
    score += 15;
    checklist.push({
      id: 'c_role',
      criterion: `Nêu rõ vị trí/định hướng nghề nghiệp (${domain.shortName})`,
      passed: true,
      feedback: `Đã xác định rõ định hướng chuyên môn ${domain.shortName}.`
    });
  } else {
    checklist.push({
      id: 'c_role',
      criterion: `Nêu rõ vị trí/định hướng nghề nghiệp (${domain.shortName})`,
      passed: false,
      feedback: `Chưa nêu rõ vị trí ứng tuyển mục tiêu thuộc lĩnh vực ${domain.name}.`
    });
  }

  // Criterion 3: Domain Core Skills mentioned
  const matchedSkills = domain.coreSkills.filter(sk => lower.includes(sk.toLowerCase().split('/')[0].trim()));
  const keywordMatches = domain.keywords.filter(kw => lower.includes(kw));
  const hasSkills = matchedSkills.length >= 1 || keywordMatches.length >= 2;

  if (hasSkills) {
    score += 15;
    checklist.push({
      id: 'c_tech',
      criterion: `Nêu bật 3-4 kỹ năng cốt lõi ngành ${domain.shortName}`,
      passed: true,
      feedback: `Đã nêu rõ thế mạnh chuyên môn (${(matchedSkills.length > 0 ? matchedSkills : keywordMatches).slice(0, 3).join(', ')}).`
    });
  } else {
    checklist.push({
      id: 'c_tech',
      criterion: `Nêu bật 3-4 kỹ năng cốt lõi ngành ${domain.shortName}`,
      passed: false,
      feedback: `Nên bổ sung tên các kỹ năng/công cụ ${domain.shortName} nổi bật (ví dụ: ${domain.coreSkills.slice(0, 3).join(', ')}).`
    });
  }

  // Criterion 4: Avoid cliché buzzwords
  const foundCliches = domain.avoidBuzzwords.filter(cl => lower.includes(cl));
  if (foundCliches.length === 0) {
    score += 10;
    checklist.push({
      id: 'c_cliche',
      criterion: 'Văn phong chuyên nghiệp (tránh từ ngữ sáo rỗng)',
      passed: true,
      feedback: 'Văn phong tự tin, tập trung vào giá trị thực tế.'
    });
  } else {
    score -= 10;
    checklist.push({
      id: 'c_cliche',
      criterion: 'Văn phong chuyên nghiệp (tránh từ ngữ sáo rỗng)',
      passed: false,
      feedback: `Nên loại bỏ các từ tự khen cảm tính: "${foundCliches.join(', ')}". Hãy thay bằng kết quả công việc.`
    });
  }

  const finalScore = Math.min(Math.max(score, 40), 98);
  const isPass = finalScore >= 75 && checklist.filter(c => c.passed).length >= 3;

  return {
    section: 'summary',
    status: isPass ? 'pass' : 'needs_improvement',
    score: finalScore,
    criteriaChecklist: checklist,
    conciseFeedback: isPass
      ? `Phần Tóm tắt nghề nghiệp ngành ${domain.shortName} rất ấn tượng, súc tích và đúng trọng tâm!`
      : `Phần Tóm tắt cần bổ sung thêm kỹ năng đặc thù ngành ${domain.shortName} để nổi bật hơn trong mắt nhà tuyển dụng.`,
    suggestedImprovement: !isPass ? domain.sampleObjective : undefined,
    nextPrompt: isPass ? 'Tuyệt vời! Bây giờ chúng ta sẽ chuyển sang phần mô tả Đồ án / Kinh nghiệm thực tế.' : 'Bạn hãy chỉnh sửa lại theo các góp ý ở trên nhé!'
  };
}

/**
 * 2. Evaluate Project / Experience Description with Domain Metrics & Action Verbs
 */
function evaluateProject(
  text: string,
  lower: string,
  wordCount: number,
  domain: IndustryDomainConfig
): AICoachEvaluation {
  const checklist: CriterionResult[] = [];
  let score = 50;

  // Criterion 1: Action Verbs (Động từ hành động)
  const hasActionVerb = domain.powerActionVerbs.some(verb => lower.includes(verb.toLowerCase()));
  if (hasActionVerb) {
    score += 15;
    checklist.push({
      id: 'p_action',
      criterion: 'Sử dụng động từ hành động mạnh mẽ',
      passed: true,
      feedback: 'Mở đầu câu rõ ràng với động từ hành động chuyên môn.'
    });
  } else {
    checklist.push({
      id: 'p_action',
      criterion: 'Sử dụng động từ hành động mạnh mẽ',
      passed: false,
      feedback: `Nên bắt đầu câu bằng các động từ hành động mạnh như: ${domain.powerActionVerbs.slice(0, 3).map(v => `"${v}..."`).join(', ')}.`
    });
  }

  // Criterion 2: Domain Skills / Tools used
  const matchedSkills = domain.coreSkills.filter(sk => lower.includes(sk.toLowerCase().split('/')[0].trim()));
  const matchedKeywords = domain.keywords.filter(kw => lower.includes(kw));
  const hasTools = matchedSkills.length >= 1 || matchedKeywords.length >= 2;

  if (hasTools) {
    score += 15;
    checklist.push({
      id: 'p_tech',
      criterion: `Nêu rõ công cụ & nghiệp vụ (${domain.shortName})`,
      passed: true,
      feedback: `Công cụ & nghiệp vụ rõ ràng: ${(matchedSkills.length > 0 ? matchedSkills : matchedKeywords).slice(0, 3).join(', ')}.`
    });
  } else {
    checklist.push({
      id: 'p_tech',
      criterion: `Nêu rõ công cụ & nghiệp vụ (${domain.shortName})`,
      passed: false,
      feedback: `Chưa nêu cụ thể các công cụ/nghiệp vụ ${domain.shortName} đã áp dụng (ví dụ: ${domain.coreSkills.slice(0, 3).join(', ')}).`
    });
  }

  // Criterion 3: Quantified Impact / Domain Metric
  const hasMetric = domain.metricRegex.test(text) || /\d+(%|\+|\s*(người|user|lượt|ms|giây|phút|s|đáp ứng|điểm|tỷ|triệu|leads|roas|ctr|cpa|doanh thu|đơn))/i.test(text);
  if (hasMetric) {
    score += 15;
    checklist.push({
      id: 'p_metric',
      criterion: 'Có số liệu định lượng hoặc % tăng trưởng',
      passed: true,
      feedback: 'Đã có số liệu minh chứng kết quả cụ thể theo công thức STAR.'
    });
  } else {
    checklist.push({
      id: 'p_metric',
      criterion: 'Có số liệu định lượng hoặc % tăng trưởng',
      passed: false,
      feedback: `Nên bổ sung con số đo lường hiệu quả (ví dụ: ${domain.industryMetrics.slice(0, 3).join(', ')}).`
    });
  }

  // Criterion 4: Evidence / Verification
  const hasProof = lower.includes('verified') || lower.includes('kiểm định') || lower.includes('http') || lower.includes('link') || lower.includes('github') || lower.includes('demo') || lower.includes('báo cáo') || lower.includes('kết quả');
  if (hasProof) {
    score += 10;
    checklist.push({
      id: 'p_proof',
      criterion: 'Minh chứng thực tế (Link / Kết quả kiểm chứng)',
      passed: true,
      feedback: 'Có dẫn chứng kiểm tra thực tế tin cậy.'
    });
  } else {
    checklist.push({
      id: 'p_proof',
      criterion: 'Minh chứng thực tế (Link / Kết quả kiểm chứng)',
      passed: false,
      feedback: 'Khuyến khích đính kèm link sản phẩm, báo cáo kết quả hoặc nhãn kiểm định của Giảng viên/Quản lý.'
    });
  }

  const finalScore = Math.min(Math.max(score, 45), 98);
  const isPass = finalScore >= 75 && checklist.filter(c => c.passed).length >= 3;

  return {
    section: 'project',
    status: isPass ? 'pass' : 'needs_improvement',
    score: finalScore,
    criteriaChecklist: checklist,
    conciseFeedback: isPass
      ? `Mô tả dự án ngành ${domain.shortName} rất xuất sắc, chuẩn công thức STAR!`
      : `Mô tả dự án cần bổ sung thêm số liệu đo lường hoặc công cụ nghiệp vụ ${domain.shortName}.`,
    suggestedImprovement: !isPass ? domain.sampleProject : undefined,
    nextPrompt: isPass ? 'Tuyệt vời! Chúng ta sẽ chuyển sang phần sắp xếp Kỹ năng chuyên môn.' : 'Bạn hãy thử bổ sung thêm số liệu kết quả nhé!'
  };
}

/**
 * 3. Evaluate Technical / Professional Skills with Domain Categorization
 */
function evaluateSkills(
  text: string,
  lower: string,
  wordCount: number,
  domain: IndustryDomainConfig
): AICoachEvaluation {
  const checklist: CriterionResult[] = [];
  let score = 55;

  // Criterion 1: Categorization
  const hasFormatting = text.includes(':') || text.includes('•') || text.includes('-') || text.includes('\n');
  const matchedCategories = domain.skillCategories.filter(cat => lower.includes(cat.categoryName.toLowerCase().split('(')[0].trim()));

  if (hasFormatting || matchedCategories.length >= 1) {
    score += 20;
    checklist.push({
      id: 's_cat',
      criterion: 'Phân nhóm kỹ năng rõ ràng',
      passed: true,
      feedback: 'Đã phân loại thành các nhóm chuyên môn dễ quét mắt.'
    });
  } else {
    checklist.push({
      id: 's_cat',
      criterion: 'Phân nhóm kỹ năng rõ ràng',
      passed: false,
      feedback: `Nên phân nhóm rõ ràng (ví dụ: ${domain.skillCategories.map(c => c.categoryName.split('(')[0].trim()).join(', ')}) thay vì viết thành đoạn văn liền.`
    });
  }

  // Criterion 2: Relevant Core Skills Focus
  const foundIrrelevant = domain.avoidBuzzwords.filter(w => lower.includes(w));
  if (foundIrrelevant.length === 0) {
    score += 15;
    checklist.push({
      id: 's_relevant',
      criterion: `Tập trung vào kỹ năng chuyên môn ${domain.shortName}`,
      passed: true,
      feedback: `Danh sách kỹ năng tập trung đúng trọng tâm ngành ${domain.shortName}.`
    });
  } else {
    score -= 10;
    checklist.push({
      id: 's_relevant',
      criterion: `Tập trung vào kỹ năng chuyên môn ${domain.shortName}`,
      passed: false,
      feedback: `Nên lược bỏ các từ ngữ tự khen cảm tính không cần thiết: "${foundIrrelevant.join(', ')}".`
    });
  }

  const finalScore = Math.min(Math.max(score, 50), 98);
  const isPass = finalScore >= 75;

  return {
    section: 'skills',
    status: isPass ? 'pass' : 'needs_improvement',
    score: finalScore,
    criteriaChecklist: checklist,
    conciseFeedback: isPass
      ? `Cấu trúc phần kỹ năng ${domain.shortName} rất sạch sẽ và chuyên nghiệp!`
      : `Hãy cấu trúc lại danh sách kỹ năng ${domain.shortName} theo từng nhóm chuyên môn để nhà tuyển dụng dễ đánh giá.`,
    suggestedImprovement: !isPass ? domain.sampleSkills : undefined,
    nextPrompt: isPass ? 'Rất tốt! Bước cuối cùng là kiểm tra thông tin liên hệ và các liên kết bằng chứng.' : 'Hãy phân nhóm kỹ năng theo mẫu gợi ý nhé!'
  };
}

/**
 * 4. Evaluate Contact & Evidence Links
 */
function evaluateContact(text: string, lower: string, domain: IndustryDomainConfig): AICoachEvaluation {
  const checklist: CriterionResult[] = [];
  let score = 60;

  // Criterion 1: Email & Phone
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(0|\+84)[0-9\s.-]{8,13}/.test(text);

  if (hasEmail && hasPhone) {
    score += 15;
    checklist.push({
      id: 'c_contact',
      criterion: 'Email & Số điện thoại đầy đủ',
      passed: true,
      feedback: 'Thông tin liên lạc cơ bản đầy đủ và rõ ràng.'
    });
  } else {
    checklist.push({
      id: 'c_contact',
      criterion: 'Email & Số điện thoại đầy đủ',
      passed: false,
      feedback: 'Thiếu Email hoặc Số điện thoại liên hệ hợp lệ.'
    });
  }

  // Criterion 2: Portfolio / Professional Links
  const hasLinks = lower.includes('linkedin') || lower.includes('portfolio') || lower.includes('http') || lower.includes('github') || lower.includes('.me') || lower.includes('.dev');
  if (hasLinks) {
    score += 15;
    checklist.push({
      id: 'c_links',
      criterion: 'Có link LinkedIn / Portfolio kiểm chứng',
      passed: true,
      feedback: 'Đã có đường link dẫn đến hồ sơ chuyên môn và sản phẩm thực tế.'
    });
  } else {
    checklist.push({
      id: 'c_links',
      criterion: 'Có link LinkedIn / Portfolio kiểm chứng',
      passed: false,
      feedback: 'Khuyến khích bổ sung link LinkedIn hoặc Portfolio sản phẩm để chứng minh năng lực.'
    });
  }

  // Criterion 3: Privacy
  const detailedAddressKeywords = ['số nhà', 'ngõ', 'hẻm', 'đường', 'phường', 'thôn', 'xóm'];
  const hasDetailedAddress = detailedAddressKeywords.some(kw => lower.includes(kw));
  if (!hasDetailedAddress) {
    score += 10;
    checklist.push({
      id: 'c_privacy',
      criterion: 'Không để lộ địa chỉ nhà chi tiết',
      passed: true,
      feedback: 'Bảo mật tốt, chỉ ghi tỉnh/thành phố sinh sống.'
    });
  } else {
    checklist.push({
      id: 'c_privacy',
      criterion: 'Không để lộ địa chỉ nhà chi tiết',
      passed: false,
      feedback: 'Nên bỏ số nhà / ngõ ngách chi tiết, chỉ cần ghi Tỉnh/Thành phố sinh sống.'
    });
  }

  const finalScore = Math.min(Math.max(score, 50), 100);
  const isPass = finalScore >= 75;

  return {
    section: 'contact',
    status: isPass ? 'pass' : 'needs_improvement',
    score: finalScore,
    criteriaChecklist: checklist,
    conciseFeedback: isPass
      ? 'Thông tin liên lạc chuẩn xác và an toàn!'
      : 'Vui lòng kiểm tra lại định dạng email, số điện thoại hoặc các liên kết đính kèm.',
    suggestedImprovement: !isPass ? getStepGuidance('contact', domain.id).sampleGood : undefined,
    nextPrompt: isPass ? '🎉 Chúc mừng bạn đã hoàn thành tất cả các mục của CV theo đúng chuẩn!' : 'Hãy hoàn thiện thông tin liên hệ nhé!'
  };
}

/**
 * AI Content Optimizer: Rewrites a sentence into a high-converting STAR bullet
 * dynamically customized to the candidate's industry domain
 */
export function optimizeCvContentWithAi(
  sectionType: CVCoachSection,
  currentText: string,
  jobTarget?: string,
  domainId?: IndustryDomainId
): {
  improvedText: string;
  appliedTechniques: string[];
  scoreLift: number;
} {
  const domain = domainId
    ? INDUSTRY_DOMAINS[domainId] || detectIndustryDomain(jobTarget)
    : detectIndustryDomain(jobTarget || currentText);

  if (sectionType === 'summary') {
    return {
      improvedText: domain.sampleObjective,
      appliedTechniques: [
        `Định vị chuẩn chức danh ngành ${domain.shortName}`,
        `Bổ sung 3-4 kỹ năng cốt lõi: ${domain.coreSkills.slice(0, 3).join(', ')}`,
        `Thêm kết quả định lượng: ${domain.industryMetrics[0]}`,
        'Loại bỏ hoàn toàn các từ sáo rỗng cảm tính'
      ],
      scoreLift: 30
    };
  }

  if (sectionType === 'skills') {
    return {
      improvedText: domain.sampleSkills,
      appliedTechniques: [
        `Phân loại kỹ năng theo các nhóm chuyên môn ${domain.shortName}`,
        'Đưa kỹ năng quan trọng nhất lên đầu danh sách',
        'Chuẩn hóa cấu trúc gạch đầu dòng dễ quét mắt'
      ],
      scoreLift: 25
    };
  }

  // Default: Project / Experience STAR rewrite
  return {
    improvedText: domain.sampleProject,
    appliedTechniques: [
      `Mở đầu bằng động từ hành động mạnh: "${domain.powerActionVerbs[0]}"`,
      `Lồng ghép công cụ & nghiệp vụ: ${domain.coreSkills.slice(0, 2).join(', ')}`,
      `Gắn liền con số đo lường hiệu quả: ${domain.industryMetrics[0]}`,
      'Chuẩn hóa theo công thức STAR chuẩn quốc tế'
    ],
    scoreLift: 35
  };
}

export interface FullCvEvaluationResult {
  overallScore: number;
  sectionEvaluations: {
    summary: AICoachEvaluation;
    projects: AICoachEvaluation;
    skills: AICoachEvaluation;
    contact: AICoachEvaluation;
  };
  passedCriteriaCount: number;
  totalCriteriaCount: number;
  summaryFeedback: string;
}

/**
 * Performs a comprehensive multi-criteria evaluation of the entire CV
 * based on the candidate's chosen industry domain and calculates the overall ATS score.
 */
export function evaluateFullCv(
  personalInfo: PersonalInfoData,
  sections: CVSection[],
  domainId?: IndustryDomainId
): FullCvEvaluationResult {
  const domain = domainId
    ? INDUSTRY_DOMAINS[domainId] || detectIndustryDomain(personalInfo?.jobTitle)
    : detectIndustryDomain(personalInfo?.jobTitle);

  // 1. Evaluate Contact / Personal Info
  const contactText = `${personalInfo?.fullName || ''} ${personalInfo?.jobTitle || ''} ${personalInfo?.email || ''} ${personalInfo?.phone || ''} ${personalInfo?.linkedin || ''} ${personalInfo?.website || ''} ${personalInfo?.location || ''}`;
  const contactEval = evaluateCvSection('contact', contactText, {
    jobTarget: personalInfo?.jobTitle,
    domainId: domain.id
  });

  // 2. Evaluate Objective / Summary
  const objectiveSec = sections.find(s => s.type === 'objective');
  const summaryText = objectiveSec?.content || '';
  const summaryEval = evaluateCvSection('summary', summaryText, {
    jobTarget: personalInfo?.jobTitle,
    domainId: domain.id
  });

  // 3. Evaluate Projects & Work Experience
  const projectSec = sections.find(s => s.type === 'projects');
  const expSec = sections.find(s => s.type === 'work_experience');

  const projectTexts: string[] = [];
  if (projectSec?.items && Array.isArray(projectSec.items)) {
    projectSec.items.forEach((p: any) => {
      if (p.description) projectTexts.push(p.description);
      if (p.bullets && Array.isArray(p.bullets)) projectTexts.push(p.bullets.join(' '));
    });
  }
  if (expSec?.items && Array.isArray(expSec.items)) {
    expSec.items.forEach((e: any) => {
      if (e.description) projectTexts.push(e.description);
      if (e.bullets && Array.isArray(e.bullets)) projectTexts.push(e.bullets.join(' '));
    });
  }
  const combinedProjectText = projectTexts.join('\n') || (projectSec?.content || '');
  const projectEval = evaluateCvSection('project', combinedProjectText, {
    jobTarget: personalInfo?.jobTitle,
    domainId: domain.id
  });

  // 4. Evaluate Skills
  const skillSec = sections.find(s => s.type === 'skills');
  let skillText = '';
  if (skillSec?.items && Array.isArray(skillSec.items)) {
    skillText = skillSec.items
      .map((g: any) => `${g.groupName || ''}: ${Array.isArray(g.skills) ? g.skills.join(', ') : ''}`)
      .join('\n');
  } else {
    skillText = skillSec?.content || '';
  }
  const skillEval = evaluateCvSection('skills', skillText, {
    jobTarget: personalInfo?.jobTitle,
    domainId: domain.id
  });

  // Bonus for education and certifications
  const eduSec = sections.find(s => s.type === 'education');
  const certSec = sections.find(s => s.type === 'certifications');
  let bonus = 0;
  if (eduSec?.items && eduSec.items.length > 0) bonus += 3;
  if (certSec?.items && certSec.items.length > 0) bonus += 2;

  // Weighted score calculation:
  // Summary: 25%, Projects/Exp: 35%, Skills: 25%, Contact: 15% + bonus
  const weightedScore = Math.round(
    summaryEval.score * 0.25 +
    projectEval.score * 0.35 +
    skillEval.score * 0.25 +
    contactEval.score * 0.15 +
    bonus
  );

  const allCriteria = [
    ...(summaryEval.criteriaChecklist || []),
    ...(projectEval.criteriaChecklist || []),
    ...(skillEval.criteriaChecklist || []),
    ...(contactEval.criteriaChecklist || [])
  ];

  const passedCriteriaCount = allCriteria.filter(c => c.passed).length;
  const totalCriteriaCount = allCriteria.length;

  return {
    overallScore: Math.min(Math.max(weightedScore, 35), 98),
    sectionEvaluations: {
      summary: summaryEval,
      projects: projectEval,
      skills: skillEval,
      contact: contactEval
    },
    passedCriteriaCount,
    totalCriteriaCount,
    summaryFeedback: `Đã đánh giá toàn bộ CV theo chuẩn ngành ${domain.name}.`
  };
}


import * as XLSX from 'xlsx';
import type { MBTIType } from '../types/mbti';
import { MBTI_PROFILES } from './mbtiService';
import type { PersonalInfoData, CVSection } from '../types/cvSection';

export interface ImportedCandidateCv {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  university: string;
  major: string;
  gpa: string;
  target_role: string;
  skills: string[];
  mbti_type: MBTIType;
  verified_projects_count: number;
  summary?: string;
  experience_company?: string;
  experience_position?: string;
  experience_desc?: string;
  experience_start?: string;
  experience_end?: string;
  certifications?: Array<{ name: string; organization?: string; year?: string }>;
  projects: Array<{
    title: string;
    description: string;
    github_url?: string;
    demo_url?: string;
    metrics?: string[];
    is_verified: boolean;
  }>;
  created_at: string;
}

const BULK_CV_STORAGE_KEY = 'profilehub_bulk_imported_cvs';

const UNIVERSITIES = [
  'Đại học Bách Khoa TP.HCM',
  'Đại học Y Dược TP.HCM',
  'Đại học Khoa Học Tự Nhiên TP.HCM',
  'Đại học Công Nghệ Thông Tin (UIT)',
  'Đại học Y Hà Nội',
  'Đại học FPT',
  'Đại học Bách Khoa Hà Nội',
  'Đại học Sư Phạm Kỹ Thuật TP.HCM',
  'Đại học Kinh Tế Quốc Dân (NEU)',
  'Đại học Y Dược Cần Thơ',
  'Đại học RMIT',
  'Đại học Văn Lang'
];

const ROLES_AND_SKILLS: Array<{
  role: string;
  major: string;
  university: string;
  skills: string[];
  projects: Array<{ title: string; desc: string; metrics: string[] }>;
}> = [
  {
    role: 'Điều Dưỡng Viên Đa Khoa / General Nurse',
    major: 'Điều Dưỡng & Chăm Sóc Sức Khỏe',
    university: 'Đại học Y Dược TP.HCM',
    skills: ['Quy trình điều dưỡng', 'Đo dấu hiệu sinh tồn', 'Tiêm truyền vô khuẩn', 'Chăm sóc vết thương', 'Hồi sức cấp cứu cơ bản', 'Giao tiếp người bệnh', 'Hồ sơ bệnh án'],
    projects: [
      {
        title: 'Quy Trình Chăm Sóc Toàn Diện Người Bệnh Hậu Phẫu',
        desc: 'Thực hiện kế hoạch theo dõi và chăm sóc toàn diện cho 150+ bệnh nhân hậu phẫu, kiểm soát nhiễm khuẩn và hỗ trợ phục hồi chức năng sớm.',
        metrics: ['Giảm 35% tỷ lệ biến chứng hậu phẫu', '100% bệnh nhân đánh giá hài lòng thái độ y đức']
      },
      {
        title: 'Đề Án Nâng Cao An Toàn Tiêm Truyền & Quy Chuẩn Vô Khuẩn',
        desc: 'Nghiên cứu và áp dụng quy tắc 5 đúng và quy chuẩn vô khuẩn tại Khoa Nội Tổng Hợp Bệnh Viện.',
        metrics: ['0 sự cố y khoa trong đợt lâm sàng', 'Đạt điểm thực tập lâm sàng xuất sắc 9.2/10']
      }
    ]
  },
  {
    role: 'Điều Dưỡng Cấp Cứu & Hồi Sức Tích Cực (ICU Nurse)',
    major: 'Điều Dưỡng Đa Khoa - Hồi Sức Cấp Cứu',
    university: 'Đại học Y Hà Nội',
    skills: ['Cấp cứu ngừng tuần hoàn CPR', 'Theo dõi Monitor & Máy thở', 'Phân loại bệnh nhân cấp cứu (Triage)', 'Giao tiếp khẩn cấp', 'Quản lý thuốc cấp cứu', 'Đặt đường truyền trung tâm'],
    projects: [
      {
        title: 'Phân Loại & Xử Trí Khẩn Cấp Bệnh Nhân Khoa Cấp Cứu',
        desc: 'Áp dụng thang điểm phân loại bệnh nhân cấp cứu Triage, rút ngắn thời gian tiếp cận y tế cho các trường hợp nguy kịch.',
        metrics: ['Rút ngắn 40% thời gian tiếp nhận ca cấp cứu', 'Tham gia hỗ trợ 120+ ca hồi sức tích cực']
      }
    ]
  },
  {
    role: 'Dược Sĩ Lâm Sàng & Tư Vấn Thuốc (Pharmacist)',
    major: 'Dược Học Lâm Sàng',
    university: 'Đại học Dược Hà Nội',
    skills: ['Tư vấn sử dụng thuốc', 'Dược lý học', 'Quản lý kho thuốc GPP', 'Tương tác thuốc & ADR', 'Tra cứu Dược thư Quốc gia', 'Kê đơn an toàn'],
    projects: [
      {
        title: 'Hệ Thống Cảnh Báo Tương Tác Thuốc & Giảm Thiểu Tác Dụng Phụ',
        desc: 'Xây dựng quy trình rà soát đơn thuốc ngoại trú, phát hiện tương tác thuốc bất lợi và tư vấn phác đồ thay thế an toàn cho bác sĩ.',
        metrics: ['Phát hiện và ngăn ngừa 45+ ca tương tác thuốc nguy hiểm', 'Tăng 28% tuân thủ điều trị của bệnh nhân mãn tính']
      }
    ]
  },
  {
    role: 'Chuyên Viên Marketing & Digital Media',
    major: 'Marketing & Truyền Thông Đa Phương Tiện',
    university: 'Đại học RMIT Việt Nam',
    skills: ['Content Marketing', 'SEO / SEM', 'Google Analytics 4', 'Meta Ads', 'Social Media Strategy', 'Copywriting', 'Tiktok & Video Ads'],
    projects: [
      {
        title: 'Chiến Dịch Truyền Thông Ra Mắt Sản Phẩm Đa Kênh',
        desc: 'Lập kế hoạch nội dung và triển khai chiến dịch đa kênh trên Facebook, TikTok và Google Ads với ngân sách 100M.',
        metrics: ['Tiếp cận 250,000+ người dùng mục tiêu', 'ROAS đạt 4.8x, tăng 85% tương tác chuyển đổi']
      }
    ]
  },
  {
    role: 'Chuyên Viên Nhân Sự & Tuyển Dụng (HR Recruiter)',
    major: 'Quản Trị Nhân Lực',
    university: 'Đại học Kinh Tế TP.HCM (UEH)',
    skills: ['Talent Acquisition', 'Sourcing ứng viên', 'Phỏng vấn hành vi (STAR)', 'Onboarding', 'Xây dựng EVP thương hiệu tuyển dụng', 'Luật Lao Động'],
    projects: [
      {
        title: 'Chương Trình Tuyển Dụng Management Trainee & Thực Tập Sinh',
        desc: 'Thiết kế quy trình tuyển chọn tài năng trẻ qua 3 vòng sàng lọc CV, phỏng vấn nhóm và đánh giá năng lực thực chiến.',
        metrics: ['Thu hút 1,200+ hồ sơ ứng tuyển', 'Tuyển đủ 100% headcount vượt tiến độ 2 tuần']
      }
    ]
  },
  {
    role: 'Chuyên Viên Kế Toán & Phân Tích Tài Chính',
    major: 'Kế Toán & Kiểm Toán',
    university: 'Đại học Kinh Tế Quốc Dân (NEU)',
    skills: ['Báo cáo tài chính', 'Thuế TNDN & TNCN', 'Phần mềm MISA / SAP', 'Excel Advanced & VBA', 'Kế toán quản trị', 'Kiểm soát chi phí'],
    projects: [
      {
        title: 'Mô Hình Tối Ưu Hóa Dòng Tiền & Quyết Toán Thuế Doanh Nghiệp',
        desc: 'Lập báo cáo tài chính định kỳ, rà soát chứng từ kế toán và tối ưu hóa chi phí vận hành cho doanh nghiệp bán lẻ.',
        metrics: ['Tiết kiệm 15% chi phí vận hành lãng phí', '100% báo cáo nộp đúng hạn không sai sót']
      }
    ]
  },
  {
    role: 'UI/UX & Product Designer',
    major: 'Thiết Kế Đồ Họa & Mỹ Thuật Số',
    university: 'Đại học Mỹ Thuật TP.HCM',
    skills: ['Figma', 'User Research', 'Design System', 'Wireframing', 'Prototyping', 'Usability Testing', 'Mobile & Web UI'],
    projects: [
      {
        title: 'Redesign Trải Nghiệm Ứng Dụng Đặt Khám Bệnh Trực Tuyến',
        desc: 'Khảo sát người dùng, xây dựng Design System và thiết kế lại luồng đặt lịch khám bệnh giảm 50% thao tác thừa.',
        metrics: ['Tăng tỷ lệ hoàn tất đặt khám 68%', 'SUS Usability Score đạt 88/100']
      }
    ]
  },
  {
    role: 'Frontend ReactJS Developer',
    major: 'Công Nghệ Phần Mềm',
    university: 'Đại học Bách Khoa TP.HCM',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Next.js', 'REST API', 'Git'],
    projects: [
      {
        title: 'E-Commerce Marketplace Frontend Platform',
        desc: 'Xây dựng giao diện web bán hàng đa nền tảng tối ưu Core Web Vitals, tích hợp giỏ hàng và thanh toán Stripe.',
        metrics: ['Tăng tốc độ tải trang 42%', 'Phục vụ 5,000+ lượt truy cập/ngày']
      }
    ]
  },
  {
    role: 'Backend Node.js / Golang Engineer',
    major: 'Khoa Học Máy Tính',
    university: 'Đại học Khoa Học Tự Nhiên TP.HCM',
    skills: ['Node.js', 'Golang', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'JWT', 'REST API', 'Microservices'],
    projects: [
      {
        title: 'Microservices Payment & Order Processing Engine',
        desc: 'Hệ thống xử lý đơn hàng và thanh toán chịu tải cao, tích hợp Redis Caching và RabbitMQ Message Queue.',
        metrics: ['Xử lý 1,500 RPS ổn định', 'Giảm độ trễ truy vấn CSDL 65%']
      }
    ]
  },
  {
    role: 'AI / Data Scientist & Machine Learning',
    major: 'Trí Tuệ Nhân Tạo & Khoa Học Dữ Liệu',
    university: 'Đại học Công Nghệ Thông Tin (UIT)',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'FastAPI', 'Pandas', 'Computer Vision', 'Hugging Face'],
    projects: [
      {
        title: 'Mô Hình AI Nhận Diện Bệnh Lý Phổi Tự Động Từ X-Quang',
        desc: 'Mô hình Deep Learning nhận diện và phân đoạn tổn thương phổi từ ảnh X-quang y tế độ chính xác cao.',
        metrics: ['F1-Score đạt 94.5%', 'Inference time < 75ms trên GPU']
      }
    ]
  },
  {
    role: 'Chuyên Viên Tư Vấn Bán Hàng & CSKH (Sales / Account Executive)',
    major: 'Quản Trị Kinh Doanh',
    university: 'Đại học Ngoại Thương (FTU)',
    skills: ['Đàm phán & Thuyết phục', 'Quản lý quan hệ khách hàng (CRM)', 'Chốt sale B2B / B2C', 'Chăm sóc khách hàng VIP', 'Kỹ năng giải quyết khiếu nại'],
    projects: [
      {
        title: 'Chiến Lược Mở Rộng Kênh Bán Hàng B2B & Chăm Sóc Khách Hàng VIP',
        desc: 'Tìm kiếm khách hàng doanh nghiệp tiềm năng, tư vấn giải pháp chuyển đổi số và duy trì mối quan hệ đối tác dài hạn.',
        metrics: ['Đạt 145% chỉ tiêu KPI doanh số quý', 'Tỷ lệ khách hàng tái ký hợp đồng đạt 92%']
      }
    ]
  },
  {
    role: 'Kỹ Sư Nông Nghiệp Công Nghệ Cao & Quản Lý Trang Trại',
    major: 'Nông Nghiệp Công Nghệ Cao',
    university: 'Học Viện Nông Nghiệp Việt Nam',
    skills: ['Hệ thống tưới tự động IoT', 'Kỹ thuật thủy canh', 'Bảo vệ thực vật sinh học', 'Quản lý chất lượng VietGAP', 'Phân tích thổ nhưỡng'],
    projects: [
      {
        title: 'Ứng Dụng Cảm Biến IoT & Tự Động Hóa Nhà Màng Trồng Dưa Lưới',
        desc: 'Triển khai hệ thống giám sát nhiệt độ, độ ẩm và dinh dưỡng tự động đạt chuẩn VietGAP cho nông trại 2 hecta.',
        metrics: ['Tiết kiệm 35% nước tưới và phân bón', 'Tăng năng suất cây trồng 22%']
      }
    ]
  }
];

const MBTI_LIST: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

const VIETNAMESE_NAMES = [
  'Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoàng Nam', 'Phạm Minh Đức', 'Võ Thị Mai',
  'Hoàng Tuấn Kiệt', 'Đặng Thảo Nguyên', 'Bùi Quốc Bảo', 'Đỗ Thanh Hà', 'Hồ Quang Dũng',
  'Dương Ngọc Lan', 'Ngô Đình Trí', 'Vũ Khánh Linh', 'Lý Gia Huy', 'Trịnh Cẩm Tú',
  'Đoàn Bảo Long', 'Phan Hoài Thương', 'Lâm Chí Cường', 'Mai Phương Thảo', 'Cao Nhật Quang',
  'Nguyễn Thị Hồng', 'Trần Hữu Phúc', 'Lê Thị Thu', 'Phạm Công Thành', 'Võ Hoàng Yến',
  'Hoàng Đức Thắng', 'Đặng Kim Ngân', 'Bùi Văn Hùng', 'Đỗ Thị Quyên', 'Hồ Minh Trí'
];

/**
 * Detect profession type from target role or major
 */
export function detectProfessionType(role: string = '', major: string = ''): 'medical' | 'business' | 'design' | 'tech' | 'general' {
  const combined = `${role} ${major}`.toLowerCase();

  if (
    combined.includes('nurse') || combined.includes('điều dưỡng') || combined.includes('y tá') ||
    combined.includes('y tế') || combined.includes('doctor') || combined.includes('bác sĩ') ||
    combined.includes('dược') || combined.includes('pharma') || combined.includes('health') ||
    combined.includes('hospital') || combined.includes('bệnh viện') || combined.includes('y khoa') ||
    combined.includes('lâm sàng') || combined.includes('hộ sinh')
  ) {
    return 'medical';
  }

  if (
    combined.includes('design') || combined.includes('thiết kế') || combined.includes('ui/ux') ||
    combined.includes('đồ họa') || combined.includes('graphic') || combined.includes('architect') ||
    combined.includes('kiến trúc') || combined.includes('art')
  ) {
    return 'design';
  }

  if (
    combined.includes('marketing') || combined.includes('sales') || combined.includes('kinh doanh') ||
    combined.includes('kế toán') || combined.includes('accounting') || combined.includes('nhân sự') ||
    combined.includes('hr') || combined.includes('finance') || combined.includes('tài chính') ||
    combined.includes('quản trị') || combined.includes('logistics') || combined.includes('truyền thông')
  ) {
    return 'business';
  }

  if (
    combined.includes('developer') || combined.includes('engineer') || combined.includes('lập trình') ||
    combined.includes('kỹ sư') || combined.includes('frontend') || combined.includes('backend') ||
    combined.includes('fullstack') || combined.includes('devops') || combined.includes('software') ||
    combined.includes('cntt') || combined.includes('it') || combined.includes('ai') || combined.includes('data')
  ) {
    return 'tech';
  }

  return 'general';
}

/**
 * Normalizes string for fuzzy key lookup (removes accents, spaces, symbols)
 */
function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Retrieves value from a raw Excel row by matching against multiple potential key aliases
 */
function getRowValue(row: Record<string, any>, possibleKeys: string[]): string | undefined {
  const rowKeys = Object.keys(row);
  const normalizedMap = new Map<string, string>();
  for (const k of rowKeys) {
    normalizedMap.set(normalizeKey(k), k);
  }

  for (const pk of possibleKeys) {
    if (row[pk] !== undefined && row[pk] !== null && String(row[pk]).trim() !== '') {
      return String(row[pk]).trim();
    }
    const norm = normalizeKey(pk);
    const actualKey = normalizedMap.get(norm);
    if (actualKey) {
      const val = row[actualKey];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        return String(val).trim();
      }
    }
  }
  return undefined;
}

/**
 * Generates 100 sample candidates with diverse roles (Tech, Medical/Nurse, Design, Business)
 */
export function generate100SampleCandidates(): ImportedCandidateCv[] {
  const candidates: ImportedCandidateCv[] = [];

  for (let i = 0; i < 100; i++) {
    const roleConfig = ROLES_AND_SKILLS[i % ROLES_AND_SKILLS.length];
    const name = VIETNAMESE_NAMES[i % VIETNAMESE_NAMES.length] + (i >= VIETNAMESE_NAMES.length ? ` (Nhóm ${Math.floor(i / VIETNAMESE_NAMES.length) + 1})` : '');
    const university = roleConfig.university || UNIVERSITIES[i % UNIVERSITIES.length];
    const gpaVal = (3.2 + (i % 8) * 0.1).toFixed(2);
    const mbti = MBTI_LIST[i % MBTI_LIST.length];

    const isVerified1 = (i % 3 === 0 || i % 5 === 0);
    const isVerified2 = (i % 2 === 0);

    const projects = roleConfig.projects.map((p, pIdx) => ({
      title: p.title,
      description: p.desc,
      github_url: roleConfig.role.toLowerCase().includes('nurse') ? '' : `https://github.com/candidate-${i + 1}/project-${pIdx + 1}`,
      demo_url: `https://demo.profilehub.dev/p/${i + 1}/${pIdx + 1}`,
      metrics: p.metrics,
      is_verified: pIdx === 0 ? isVerified1 : isVerified2,
    }));

    const verifiedCount = projects.filter(p => p.is_verified).length;

    candidates.push({
      id: `sample_candidate_${i + 1}`,
      full_name: name,
      email: `candidate.${i + 1}@profilehub.dev`,
      phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      university,
      major: roleConfig.major,
      gpa: gpaVal,
      target_role: roleConfig.role,
      skills: roleConfig.skills,
      mbti_type: mbti,
      verified_projects_count: verifiedCount,
      projects,
      created_at: new Date(Date.now() - i * 3600000).toISOString()
    });
  }

  return candidates;
}

/**
 * Exports candidates to standardized Excel (.xlsx) file
 */
export function exportSampleXlsx(candidates?: ImportedCandidateCv[]): void {
  const dataToExport = candidates && candidates.length > 0 ? candidates : generate100SampleCandidates();

  const rows = dataToExport.map((c, idx) => ({
    'STT': idx + 1,
    'Họ và tên': c.full_name,
    'Email': c.email,
    'Số điện thoại': c.phone || '0901234567',
    'Trường Đại Học': c.university,
    'Chuyên ngành': c.major,
    'Điểm GPA': c.gpa,
    'Vị trí ứng tuyển': c.target_role,
    'Kỹ năng chuyên môn': c.skills.join(', '),
    'Mục tiêu nghề nghiệp': c.summary || '',
    'Nơi làm việc / Bệnh viện / Công ty': c.experience_company || '',
    'Kinh nghiệm - Chức vụ': c.experience_position || '',
    'Mô tả kinh nghiệm thực tế': c.experience_desc || '',
    'Nhóm tính cách MBTI': c.mbti_type,
    'Đồ án / Ca lâm sàng 1 - Tên': c.projects[0]?.title || '',
    'Đồ án / Ca lâm sàng 1 - Mô tả': c.projects[0]?.description || '',
    'Đồ án / Ca lâm sàng 1 - Link Demo': c.projects[0]?.demo_url || '',
    'Đồ án / Ca lâm sàng 1 - Số liệu đo lường': (c.projects[0]?.metrics || []).join(' | '),
    'Đồ án / Ca lâm sàng 1 - Giảng viên đã duyệt (1=Có, 0=Không)': c.projects[0]?.is_verified ? 1 : 0,
    'Đồ án / Ca lâm sàng 2 - Tên': c.projects[1]?.title || '',
    'Đồ án / Ca lâm sàng 2 - Mô tả': c.projects[1]?.description || '',
    'Đồ án / Ca lâm sàng 2 - Link Demo': c.projects[1]?.demo_url || '',
    'Đồ án / Ca lâm sàng 2 - Số liệu đo lường': (c.projects[1]?.metrics || []).join(' | '),
    'Đồ án / Ca lâm sàng 2 - Giảng viên đã duyệt (1=Có, 0=Không)': c.projects[1]?.is_verified ? 1 : 0,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh_Sach_CV_Ung_Vien');

  const colWidths = Object.keys(rows[0] || {}).map(k => ({ wch: Math.max(k.length + 4, 18) }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, `ProfileHub_CV_Candidates_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Parses uploaded .xlsx, .xls or .csv file into ImportedCandidateCv[]
 * Universal column matcher supports Medical/Nursing, Business, Tech, Design and Custom formats
 */
export async function parseXlsxFile(file: File): Promise<ImportedCandidateCv[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet);

  if (!rawRows || rawRows.length === 0) {
    throw new Error('File Excel rỗng hoặc không đúng định dạng.');
  }

  const parsedCandidates: ImportedCandidateCv[] = rawRows.map((row, idx) => {
    // 1. Basic Info
    const fullName = getRowValue(row, [
      'Họ và tên', 'Họ tên', 'Full Name', 'Name', 'Candidate Name', 'Tên ứng viên', 'Tên', 'Ứng viên', 'Candidate'
    ]) || `Ứng viên #${idx + 1}`;

    const email = getRowValue(row, [
      'Email', 'E-mail', 'Mail', 'Thư điện tử', 'Địa chỉ email'
    ]) || `candidate.${idx + 1}@profilehub.dev`;

    const phone = getRowValue(row, [
      'Số điện thoại', 'Điện thoại', 'Phone', 'Mobile', 'Tel', 'SĐT', 'Telephone'
    ]) || '0901234567';

    // 2. Target Role & Profession
    let targetRole = getRowValue(row, [
      'Vị trí ứng tuyển', 'Vị trí', 'Chức danh', 'Nghề nghiệp', 'Job Title', 'Position', 'Role', 'Target Role', 'Chuyên môn', 'Ngành nghề', 'Vị trí công việc', 'Ngành', 'Khoa', 'Công việc', 'Nghề', 'Profession', 'Title', 'Chức vụ', 'Bộ phận'
    ]);

    const university = getRowValue(row, [
      'Trường Đại Học', 'Trường', 'University', 'School', 'College', 'Academy', 'Nơi đào tạo', 'Đơn vị đào tạo', 'Cơ sở đào tạo'
    ]) || 'Đại Học';

    const major = getRowValue(row, [
      'Chuyên ngành', 'Ngành học', 'Major', 'Field of Study', 'Ngành', 'Khoa', 'Lĩnh vực'
    ]) || targetRole || 'Chuyên môn';

    if (!targetRole || targetRole.toLowerCase() === 'chuyên viên' || targetRole.toLowerCase() === 'ứng viên') {
      if (major && major.toLowerCase() !== 'chuyên môn') {
        targetRole = major;
      } else {
        const prof = detectProfessionType('', `${fullName} ${university}`);
        if (prof === 'medical') targetRole = 'Điều Dưỡng Viên / Y Tế';
        else if (prof === 'business') targetRole = 'Chuyên Viên Kinh Doanh';
        else if (prof === 'design') targetRole = 'Thiết Kế Đồ Họa';
        else targetRole = 'Chuyên Viên';
      }
    }

    const gpa = String(getRowValue(row, [
      'Điểm GPA', 'GPA', 'Điểm', 'Grade', 'Xếp loại'
    ]) || '3.50');

    // 3. Skills
    const rawSkills = getRowValue(row, [
      'Kỹ năng chuyên môn', 'Kỹ năng', 'Skills', 'Competencies', 'Kỹ năng chính', 'Chuyên môn kỹ thuật'
    ]);
    const skills = rawSkills
      ? rawSkills.split(/[,;|•\n]/).map(s => s.trim()).filter(s => s.length > 0)
      : [targetRole, 'Làm việc nhóm', 'Giao tiếp chuyên môn'];

    // 4. Summary & Objective
    const summary = getRowValue(row, [
      'Mục tiêu nghề nghiệp', 'Mục tiêu', 'Tóm tắt', 'Giới thiệu', 'Summary', 'Objective', 'Bio', 'About', 'Giới thiệu bản thân'
    ]);

    // 5. Work Experience Fields
    const experience_company = getRowValue(row, [
      'Nơi làm việc / Bệnh viện / Công ty', 'Công ty', 'Nơi làm việc', 'Bệnh viện', 'Cơ quan', 'Cơ sở y tế', 'Company', 'Hospital', 'Organization', 'Employer', 'Workplace'
    ]);

    const experience_position = getRowValue(row, [
      'Kinh nghiệm - Chức vụ', 'Chức vụ', 'Vị trí công tác', 'Vị trí kinh nghiệm', 'Position', 'Experience Position'
    ]);

    const experience_desc = getRowValue(row, [
      'Mô tả kinh nghiệm thực tế', 'Mô tả kinh nghiệm', 'Kinh nghiệm làm việc', 'Trách nhiệm', 'Nhiệm vụ', 'Work Experience', 'Experience Description', 'Responsibilities'
    ]);

    const experience_start = getRowValue(row, ['Thời gian bắt đầu', 'Từ ngày', 'Start Date']);
    const experience_end = getRowValue(row, ['Thời gian kết thúc', 'Đến ngày', 'End Date', 'Hiện tại']);

    // 6. MBTI
    const rawMbti = String(getRowValue(row, ['Nhóm tính cách MBTI', 'MBTI', 'Tính cách']) || 'INTJ').toUpperCase().trim() as MBTIType;
    const mbti_type: MBTIType = MBTI_PROFILES[rawMbti] ? rawMbti : 'INTJ';

    // 7. Projects / Clinical Cases / Professional Portfolios
    const p1Title = getRowValue(row, [
      'Đồ án / Ca lâm sàng 1 - Tên', 'Đồ án 1 - Tên', 'Dự án 1', 'Đồ án 1', 'Project 1 Title', 'Project 1', 'Case 1', 'Đề tài 1'
    ]);
    const p1Desc = getRowValue(row, [
      'Đồ án / Ca lâm sàng 1 - Mô tả', 'Đồ án 1 - Mô tả', 'Project 1 Description', 'Mô tả dự án 1', 'Nội dung công việc 1'
    ]);
    const p1Git = getRowValue(row, ['Đồ án 1 - Link GitHub', 'Project 1 GitHub', 'Link GitHub', 'GitHub 1']) || '';
    const p1Demo = getRowValue(row, ['Đồ án / Ca lâm sàng 1 - Link Demo', 'Đồ án 1 - Link Demo', 'Project 1 Demo', 'Link Demo', 'Demo 1', 'Báo cáo 1']) || '';
    const p1MetricsRaw = getRowValue(row, ['Đồ án / Ca lâm sàng 1 - Số liệu đo lường', 'Đồ án 1 - Số liệu đo lường', 'Project 1 Metrics', 'Kết quả 1']) || '';
    const p1Metrics = p1MetricsRaw.length > 0 ? p1MetricsRaw.split(/[,|;]/).map(m => m.trim()) : [];
    const p1VerRaw = getRowValue(row, ['Đồ án / Ca lâm sàng 1 - Giảng viên đã duyệt (1=Có, 0=Không)', 'Đồ án 1 - Giảng viên đã duyệt (1=Có, 0=Không)', 'Project 1 Verified', 'Verified 1']);
    const p1Verified = Boolean(p1VerRaw === '1' || p1VerRaw === 'true' || p1VerRaw === 'Có' || p1VerRaw === 'Verified');

    const p2Title = getRowValue(row, [
      'Đồ án / Ca lâm sàng 2 - Tên', 'Đồ án 2 - Tên', 'Dự án 2', 'Đồ án 2', 'Project 2 Title', 'Project 2', 'Case 2', 'Đề tài 2'
    ]);
    const p2Desc = getRowValue(row, [
      'Đồ án / Ca lâm sàng 2 - Mô tả', 'Đồ án 2 - Mô tả', 'Project 2 Description', 'Mô tả dự án 2'
    ]);
    const p2Git = getRowValue(row, ['Đồ án 2 - Link GitHub', 'Project 2 GitHub', 'Link GitHub 2']) || '';
    const p2Demo = getRowValue(row, ['Đồ án / Ca lâm sàng 2 - Link Demo', 'Đồ án 2 - Link Demo', 'Project 2 Demo', 'Link Demo 2']) || '';
    const p2MetricsRaw = getRowValue(row, ['Đồ án / Ca lâm sàng 2 - Số liệu đo lường', 'Đồ án 2 - Số liệu đo lường', 'Project 2 Metrics', 'Kết quả 2']) || '';
    const p2Metrics = p2MetricsRaw.length > 0 ? p2MetricsRaw.split(/[,|;]/).map(m => m.trim()) : [];
    const p2VerRaw = getRowValue(row, ['Đồ án / Ca lâm sàng 2 - Giảng viên đã duyệt (1=Có, 0=Không)', 'Đồ án 2 - Giảng viên đã duyệt (1=Có, 0=Không)', 'Project 2 Verified']);
    const p2Verified = Boolean(p2VerRaw === '1' || p2VerRaw === 'true' || p2VerRaw === 'Có' || p2VerRaw === 'Verified');

    const projects = [];

    if (p1Title) {
      projects.push({
        title: p1Title,
        description: p1Desc || `Thực hiện dự án/ca chuyên môn ${p1Title} đạt kết quả cao.`,
        github_url: p1Git,
        demo_url: p1Demo,
        metrics: p1Metrics.length > 0 ? p1Metrics : ['Đạt kết quả xuất sắc'],
        is_verified: p1Verified
      });
    }

    if (p2Title) {
      projects.push({
        title: p2Title,
        description: p2Desc || `Thực hiện dự án/ca chuyên môn ${p2Title}.`,
        github_url: p2Git,
        demo_url: p2Demo,
        metrics: p2Metrics.length > 0 ? p2Metrics : ['Hoàn thành tốt nhiệm vụ'],
        is_verified: p2Verified
      });
    }

    const verifiedProjectsCount = projects.filter(p => p.is_verified).length;

    return {
      id: `bulk_cv_${idx + 1}_${Date.now()}`,
      full_name: fullName,
      email,
      phone,
      university,
      major,
      gpa,
      target_role: targetRole,
      skills,
      mbti_type,
      verified_projects_count: verifiedProjectsCount,
      summary,
      experience_company,
      experience_position,
      experience_desc,
      experience_start,
      experience_end,
      projects,
      created_at: new Date().toISOString()
    };
  });

  return parsedCandidates;
}

/**
 * Saves imported candidates to local storage
 */
export function saveImportedCandidates(candidates: ImportedCandidateCv[]): void {
  try {
    const existing = getStoredImportedCandidates();
    const merged = [...candidates, ...existing.filter(e => !candidates.some(c => c.id === e.id))].slice(0, 300);
    localStorage.setItem(BULK_CV_STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.warn('Failed to save bulk CVs to localStorage:', e);
  }
}

/**
 * Retrieves all stored imported candidates
 */
export function getStoredImportedCandidates(): ImportedCandidateCv[] {
  try {
    const raw = localStorage.getItem(BULK_CV_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ImportedCandidateCv[];
  } catch {
    return [];
  }
}

/**
 * Clears stored imported candidates
 */
export function clearImportedCandidates(): void {
  try {
    localStorage.removeItem(BULK_CV_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear bulk CVs:', e);
  }
}

/**
 * Converts an ImportedCandidateCv into structured PersonalInfoData & CVSection[] for AI CV Builder
 * Dynamically tailored to the exact profession (Medical/Nursing, Tech, Business, Design, etc.)
 */
export function convertImportedCvToCvBuilderState(imported: ImportedCandidateCv): {
  personalInfo: PersonalInfoData;
  sections: CVSection[];
} {
  const profession = detectProfessionType(imported.target_role, imported.major);
  const mbtiInfo = MBTI_PROFILES[imported.mbti_type] || MBTI_PROFILES.INTJ;

  const personalInfo: PersonalInfoData = {
    fullName: imported.full_name,
    jobTitle: imported.target_role,
    email: imported.email,
    phone: imported.phone || '0901 234 567',
    facebook: '',
    linkedin: `linkedin.com/in/${imported.full_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    website: profession === 'tech' ? `github.com/${imported.full_name.toLowerCase().replace(/[^a-z0-9]/g, '')}` : '',
    location: 'TP. Hồ Chí Minh',
    avatarUrl: '',
    visibleFields: {
      phone: true,
      email: true,
      facebook: false,
      linkedin: true,
      website: Boolean(profession === 'tech'),
      location: true,
      avatarUrl: false,
    },
  };

  const defaultSettings = {
    showTitle: true,
    showDivider: true,
    spacing: 'normal' as const,
    titleStyle: 'bold' as const,
    titleCase: 'uppercase' as const,
  };

  // 1. Generate Context-Aware Objective
  let objectiveContent = imported.summary;
  if (!objectiveContent) {
    const skillsSummary = imported.skills.slice(0, 4).join(', ');
    if (profession === 'medical') {
      objectiveContent = `Chuyên viên ${imported.target_role} tốt nghiệp từ ${imported.university} với GPA ${imported.gpa} / 4.0. Nắm vững quy trình chuyên môn, kỹ thuật chăm sóc và y đức chuẩn mực. Có kinh nghiệm thực hành với: ${skillsSummary}. Định hướng rèn luyện chuyên sâu và cống hiến lâu dài trong công tác chăm sóc sức khỏe người bệnh.`;
    } else if (profession === 'design') {
      objectiveContent = `Nhà thiết kế ${imported.target_role} tốt nghiệp ${imported.university} (GPA: ${imported.gpa}/4.0). Thành thạo tư duy thiết kế trải nghiệm và các công cụ: ${skillsSummary}. Mong muốn sáng tạo các giải pháp sản phẩm số chất lượng cao và tối ưu sự hài lòng của người dùng.`;
    } else if (profession === 'business') {
      objectiveContent = `Chuyên viên ${imported.target_role} tốt nghiệp ${imported.university} (GPA: ${imported.gpa}/4.0). Nắm vững tư duy phân tích, quản lý mục tiêu và thành thạo: ${skillsSummary}. Sẵn sàng học hỏi và đóng góp vào sự tăng trưởng của tổ chức.`;
    } else {
      objectiveContent = `Kỹ sư ${imported.target_role} tốt nghiệp từ ${imported.university} (GPA: ${imported.gpa}/4.0). Nắm vững nền tảng kiến trúc và các công nghệ: ${skillsSummary}. Giàu kinh nghiệm triển khai các dự án thực tế và cam kết tạo ra giá trị bền vững cho doanh nghiệp.`;
    }
  }

  // 2. Generate Context-Aware Projects / Clinical Cases
  const projectItems = imported.projects.length > 0
    ? imported.projects.map((p, idx) => ({
        id: `proj_${Date.now()}_${idx}`,
        projectName: p.title,
        role: profession === 'medical'
          ? 'Điều dưỡng viên / Phụ trách chuyên môn'
          : profession === 'tech'
          ? 'Lập trình viên / Phụ trách kỹ thuật'
          : 'Chuyên viên thực hiện / Trưởng nhóm',
        startDate: '2025',
        endDate: '2026',
        technologies: imported.skills.slice(0, 4),
        description: `• ${p.description}\n• Kết quả đo lường: ${p.metrics?.join(' | ') || 'Hoàn thành xuất sắc chỉ tiêu chuyên môn.'}`,
        githubUrl: p.github_url || '',
        projectUrl: p.demo_url || '',
        is_verified: p.is_verified,
        bullets: p.metrics || ['Đạt kết quả xuất sắc'],
      }))
    : [
        {
          id: `proj_${Date.now()}_0`,
          projectName: profession === 'medical'
            ? `Đề Án & Thực Hành Lâm Sàng (${imported.target_role})`
            : `Đồ Án & Dự Án Thực Tế (${imported.target_role})`,
          role: profession === 'medical' ? 'Điều dưỡng viên / Chuyên viên chăm sóc' : 'Chuyên viên phụ trách',
          startDate: '2025',
          endDate: '2026',
          technologies: imported.skills.slice(0, 4),
          description: profession === 'medical'
            ? '• Thực hiện quy trình theo dõi dấu hiệu sinh tồn, chăm sóc bệnh nhân và quản lý hồ sơ bệnh án theo chuẩn an toàn y tế.\n• Phối hợp hiệu quả với đội ngũ y bác sĩ trong công tác điều trị.'
            : '• Nghiên cứu, thiết kế và triển khai dự án chuyên môn đáp ứng các yêu cầu chất lượng thực tế.\n• Tối ưu hóa quy trình và phối hợp nhóm hiệu quả.',
          githubUrl: '',
          projectUrl: '',
          is_verified: true,
          bullets: ['Đạt đánh giá xuất sắc trong kỳ thực tập'],
        }
      ];

  // 3. Generate Context-Aware Work Experience
  const companyName = imported.experience_company || (
    profession === 'medical'
      ? 'Bệnh Viện Đa Khoa / Cơ Sở Y Tế (Thực tập sinh)'
      : profession === 'tech'
      ? 'Công Ty Công Nghệ / Tech Startup (Thực tập sinh)'
      : 'Doanh Nghiệp / Cơ Quan Chuyên Môn (Thực tập sinh)'
  );

  const positionName = imported.experience_position || `Thực tập sinh ${imported.target_role}`;

  const experienceDesc = imported.experience_desc || (
    profession === 'medical'
      ? `• Tham gia trực ban, hỗ trợ thăm khám, đo các chỉ số sinh tồn và quản lý việc dùng thuốc của người bệnh.\n• Phối hợp với điều dưỡng trưởng và tuân thủ tuyệt đối quy định kiểm soát nhiễm khuẩn.`
      : `• Tham gia thực hiện các nhiệm vụ chuyên môn và phát triển các sản phẩm với ${imported.skills.slice(0, 3).join(', ')}.\n• Phối hợp làm việc nhóm và hoàn thành tốt các mục tiêu được giao.`
  );

  const sections: CVSection[] = [
    // 1. Objective / Summary
    {
      id: 'sec_objective',
      type: 'objective',
      title: 'MỤC TIÊU NGHỀ NGHIỆP',
      order_index: 0,
      is_visible: true,
      settings: defaultSettings,
      content: objectiveContent,
    },

    // 2. Technical Skills
    {
      id: 'sec_skills',
      type: 'skills',
      title: 'KỸ NĂNG CHUYÊN MÔN',
      order_index: 1,
      is_visible: true,
      settings: defaultSettings,
      items: [
        {
          id: `grp_tech_${Date.now()}`,
          groupName: profession === 'medical' ? 'Kỹ Năng Chuyên Môn Y Tế & Điều Dưỡng' : 'Kỹ Năng Chuyên Môn (Core Skills)',
          skills: imported.skills,
        },
        {
          id: `grp_soft_${Date.now() + 1}`,
          groupName: `Năng Lực & Phong Cách Làm Việc (MBTI ${imported.mbti_type})`,
          skills: mbtiInfo.strengths.slice(0, 5),
        },
      ],
    },

    // 3. Projects (Evidence-Based)
    {
      id: 'sec_projects',
      type: 'projects',
      title: profession === 'medical' ? 'CA LÂM SÀNG & ĐỀ ÁN THỰC HÀNH (VERIFIED)' : 'ĐỒ ÁN & DỰ ÁN THỰC TẾ (VERIFIED PROJECTS)',
      order_index: 2,
      is_visible: true,
      settings: defaultSettings,
      items: projectItems,
    },

    // 4. Education
    {
      id: 'sec_education',
      type: 'education',
      title: 'HỌC VẤN & BẰNG CẤP',
      order_index: 3,
      is_visible: true,
      settings: defaultSettings,
      items: [
        {
          id: `edu_${Date.now()}`,
          institution: imported.university,
          major: imported.major,
          degree: profession === 'medical' ? `Cử nhân Điều dưỡng / Y khoa ${imported.major}` : `Cử nhân / Kỹ sư ${imported.major}`,
          startDate: '2021',
          endDate: '2025',
          gpa: `${imported.gpa} / 4.0`,
          description: `• Tốt nghiệp chuyên ngành ${imported.major} tại ${imported.university}.\n• Hoàn thành các học phần thực hành chuyên sâu và đạt thành tích học tập xuất sắc.`,
        },
      ],
    },

    // 5. Work Experience
    {
      id: 'sec_work_exp',
      type: 'work_experience',
      title: 'KINH NGHIỆM LÀM VIỆC & THỰC TẬP',
      order_index: 4,
      is_visible: true,
      settings: defaultSettings,
      items: [
        {
          id: `work_${Date.now()}`,
          company: companyName,
          position: positionName,
          startDate: imported.experience_start || '06/2025',
          endDate: imported.experience_end || 'Hiện tại',
          description: experienceDesc,
        },
      ],
    },

    // 6. Certifications & Achievements
    {
      id: 'sec_certifications',
      type: 'certifications',
      title: 'CHỨNG CHỈ & THÀNH TÍCH',
      order_index: 5,
      is_visible: true,
      settings: defaultSettings,
      items: (imported.certifications && imported.certifications.length > 0)
        ? imported.certifications.map((c, cIdx) => ({
            id: `cert_${Date.now()}_${cIdx}`,
            certificateName: c.name,
            organization: c.organization || imported.university,
            issueDate: c.year || '2025',
            credentialUrl: 'https://profilehub.dev/verify',
          }))
        : [
            {
              id: `cert_${Date.now()}`,
              certificateName: profession === 'medical' ? `Chứng chỉ Hành nghề / Thực hành ${imported.target_role}` : `Chứng chỉ Chuyên môn ${imported.target_role}`,
              organization: imported.university,
              issueDate: '2025',
              credentialUrl: 'https://profilehub.dev/verify',
            },
          ],
    },
  ];

  return {
    personalInfo,
    sections,
  };
}

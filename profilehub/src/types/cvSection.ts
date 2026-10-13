export type CVSectionType =
  | 'personal_info'
  | 'objective'
  | 'education'
  | 'work_experience'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'activities'
  | 'awards'
  | 'languages'
  | 'references'
  | 'custom';

export interface PersonalInfoData {
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
  location: string;
  avatarUrl?: string;
  visibleFields: {
    phone: boolean;
    email: boolean;
    facebook: boolean;
    linkedin: boolean;
    website: boolean;
    location: boolean;
    avatarUrl: boolean;
  };
}

export interface EducationItem {
  id: string;
  institution: string;
  degree?: string;
  major: string;
  startDate: string;
  endDate: string;
  location?: string;
  gpa?: string;
  description?: string;
  bullets?: string[];
  is_verified?: boolean;
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  position: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description?: string;
  bullets?: string[];
}

export interface ProjectItem {
  id: string;
  projectName: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets?: string[];
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  is_verified?: boolean;
}

export interface SkillGroupItem {
  id: string;
  groupName: string;
  skills: string[];
}

export interface CertificationItem {
  id: string;
  certificateName: string;
  organization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface ActivityItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description?: string;
  bullets?: string[];
}

export interface AwardItem {
  id: string;
  awardName: string;
  organization: string;
  date: string;
  description?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  level: string; // 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Elementary'
}

export interface ReferenceItem {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets?: string[];
}

export interface SectionSettings {
  showTitle: boolean;
  showDivider: boolean;
  spacing: 'compact' | 'normal' | 'relaxed';
  titleStyle: 'bold' | 'normal';
  titleCase: 'uppercase' | 'capitalize' | 'none';
}

export interface CVSection {
  id: string;
  type: CVSectionType;
  title: string;
  order_index: number;
  is_visible: boolean;
  settings: SectionSettings;
  content?: string; // For objective or text-based custom sections
  items?: Array<any>; // Typed items depending on section type
}

export interface SectionTemplateMeta {
  type: CVSectionType;
  defaultTitle: string;
  description: string;
  iconName: string;
  isDefault: boolean;
  allowMultiple: boolean;
}

export const SECTION_METADATA: SectionTemplateMeta[] = [
  {
    type: 'objective',
    defaultTitle: 'Mục Tiêu Nghề Nghiệp',
    description: 'Tóm tắt mục tiêu, đam mê và định hướng chuyên môn.',
    iconName: 'Target',
    isDefault: true,
    allowMultiple: false
  },
  {
    type: 'education',
    defaultTitle: 'Học Vấn',
    description: 'Trường đại học, chuyên ngành, GPA, đồ án tốt nghiệp.',
    iconName: 'GraduationCap',
    isDefault: true,
    allowMultiple: false
  },
  {
    type: 'work_experience',
    defaultTitle: 'Kinh Nghiệm Làm Việc',
    description: 'Công ty, vị trí, trách nhiệm và thành tích đạt được.',
    iconName: 'Briefcase',
    isDefault: true,
    allowMultiple: false
  },
  {
    type: 'projects',
    defaultTitle: 'Dự Án & Đồ Án',
    description: 'Đồ án môn học, sản phẩm cá nhân, công nghệ sử dụng, huy hiệu Verified.',
    iconName: 'FolderGit2',
    isDefault: true,
    allowMultiple: false
  },
  {
    type: 'skills',
    defaultTitle: 'Kỹ Năng Chuyên Môn',
    description: 'Kỹ năng theo nhóm: Frontend, Backend, Tools, Soft Skills.',
    iconName: 'Layers',
    isDefault: true,
    allowMultiple: false
  },
  {
    type: 'certifications',
    defaultTitle: 'Chứng Chỉ',
    description: 'Chứng chỉ ngoại ngữ, chứng chỉ công nghệ quốc tế (AWS, Google, Coursera).',
    iconName: 'Award',
    isDefault: true,
    allowMultiple: false
  },
  {
    type: 'activities',
    defaultTitle: 'Hoạt Động',
    description: 'Câu lạc bộ, hoạt động tình nguyện, cuộc thi học thuật.',
    iconName: 'Users',
    isDefault: true,
    allowMultiple: false
  },
  {
    type: 'awards',
    defaultTitle: 'Giải Thưởng',
    description: 'Học bổng, giải thưởng nghiên cứu khoa học, Hackathon.',
    iconName: 'Trophy',
    isDefault: true,
    allowMultiple: false
  },
  {
    type: 'languages',
    defaultTitle: 'Ngoại Ngữ',
    description: 'Tiếng Anh, Tiếng Nhật, Tiếng Hàn và trình độ chứng chỉ.',
    iconName: 'Languages',
    isDefault: true,
    allowMultiple: false
  },
  {
    type: 'references',
    defaultTitle: 'Người Tham Chiếu',
    description: 'Giảng viên hướng dẫn, mentor, quản lý trực tiếp.',
    iconName: 'UserCheck',
    isDefault: true,
    allowMultiple: false
  },
  {
    type: 'custom',
    defaultTitle: 'Mục Tùy Chỉnh',
    description: 'Tự do tạo mục mới: Sở thích, Bài báo khoa học, Đóng góp Open-Source...',
    iconName: 'PlusCircle',
    isDefault: false,
    allowMultiple: true
  }
];

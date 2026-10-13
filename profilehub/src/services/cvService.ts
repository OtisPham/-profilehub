import { supabase } from './supabase';
import type {
  CVSection,
  CVSectionType,
  PersonalInfoData,
  EducationItem,
  WorkExperienceItem,
  ProjectItem,
  SkillGroupItem,
  CertificationItem,
  ActivityItem,
  AwardItem,
  LanguageItem,
  ReferenceItem,
  CustomSectionItem
} from '../types/cvSection';
import type { CVTemplateType } from '../components/cv/CVTemplates';
import { convertImportedCvToCvBuilderState } from './bulkCvImportService';

export interface SavedCVData {
  personalInfo: PersonalInfoData;
  sections: CVSection[];
  selectedTemplate: CVTemplateType;
  primaryColor: string;
  selectedFontId: string;
  spacingDensity: 'compact' | 'standard' | 'relaxed';
  fontSizeLevel: 'small' | 'medium' | 'large';
  savedAt: string;
}

export interface ManagedCVItem {
  id: string;
  title: string;
  targetRole: string;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
  data: SavedCVData;
}

export interface StudentProfileData {
  profile: {
    id?: string;
    full_name?: string;
    major?: string;
    university?: string;
    gpa?: string;
    skills?: string[];
    bio?: string;
  } | null;
  projects: Array<{
    id: string;
    title: string;
    role?: string;
    project_type?: string;
    description?: string;
    is_verified?: boolean;
    instructor?: string;
    tags?: string[];
    created_at?: string;
  }>;
  certificates: Array<{
    id: string;
    title: string;
    issuer: string;
    issue_date?: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    category?: string;
  }>;
}

const MULTI_CV_STORAGE_PREFIX = 'profilehub_managed_cvs_';
const ACTIVE_CV_ID_PREFIX = 'profilehub_active_cv_id_';

/**
 * CV Data Service
 * Dedicated frontend service for managing, synchronizing, cloning and persisting multiple CVs
 */
export const cvService = {
  /**
   * Fetch all relevant portfolio data for a student from Supabase
   */
  async fetchStudentCVSourceData(userId?: string): Promise<StudentProfileData> {
    if (!userId) {
      return {
        profile: null,
        projects: [],
        certificates: [],
        achievements: []
      };
    }

    try {
      const [studentProfRes, userRes, projRes, certRes, achRes] = await Promise.all([
        supabase.from('student_profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('users').select('*').eq('id', userId).maybeSingle(),
        supabase.from('projects').select('*').eq('student_id', userId),
        supabase.from('certificates').select('*').eq('student_id', userId),
        supabase.from('achievements').select('*').eq('student_id', userId)
      ]);

      const profile = studentProfRes.data || userRes.data || null;

      return {
        profile,
        projects: projRes.data || [],
        certificates: certRes.data || [],
        achievements: achRes.data || []
      };
    } catch (error) {
      console.error('[cvService] Error fetching source data:', error);
      return {
        profile: null,
        projects: [],
        certificates: [],
        achievements: []
      };
    }
  },

  /**
   * Build initial CV Sections from student profile data
   */
  buildInitialSections(data: StudentProfileData, userEmail?: string): {
    personalInfo: PersonalInfoData;
    sections: CVSection[];
  } {
    const { profile, projects, certificates, achievements } = data;

    const personalInfo: PersonalInfoData = {
      fullName: profile?.full_name || 'HỌ VÀ TÊN ỨNG VIÊN',
      jobTitle: profile?.major || 'Kỹ Sư Phần Mềm / Software Engineer',
      email: userEmail || 'candidate@example.com',
      phone: '0912 345 678',
      location: 'TP. Hồ Chí Minh',
      linkedin: 'linkedin.com/in/candidate',
      website: 'candidate.dev',
      visibleFields: {
        phone: true,
        email: true,
        facebook: false,
        linkedin: true,
        website: true,
        location: true,
        avatarUrl: false
      }
    };

    const initialSummary = profile?.bio ||
      `Kỹ sư chuyên ngành ${profile?.major || 'Công nghệ Thông tin'} với nền tảng tư duy cấu trúc dữ liệu và giải thuật vững chắc. Có kinh nghiệm triển khai các dự án thực tế đã được kiểm định chất lượng bởi Giảng viên. Sẵn sàng tiếp thu công nghệ mới và đóng góp vào mục tiêu phát triển của doanh nghiệp.`;

    const projectItems: ProjectItem[] = projects.length > 0
      ? projects.map(p => ({
          id: p.id,
          projectName: p.title,
          role: p.role || 'Full-stack Developer',
          startDate: '2025',
          endDate: '2026',
          description: p.description || '• Phát triển hệ thống và xử lý logic nghiệp vụ...',
          technologies: p.tags && p.tags.length > 0 ? p.tags : ['React', 'TypeScript', 'Node.js'],
          is_verified: p.is_verified
        }))
      : [
          {
            id: `proj_${Date.now()}`,
            projectName: 'Hệ Thống Quản Lý Hồ Sơ Năng Lực Sinh Viên',
            role: 'Trưởng nhóm phát triển',
            startDate: '2025',
            endDate: '2026',
            description: '• Thiết kế kiến trúc module, tích hợp xác thực số hóa và chấm điểm ATS tự động.\n• Tối ưu hóa hiệu năng render phân trang A4 và xuất PDF đạt chuẩn 100%.',
            technologies: ['React', 'TypeScript', 'TailwindCSS', 'PostgreSQL'],
            is_verified: true
          }
        ];

    const skillItems: SkillGroupItem[] = [
      {
        id: `grp_tech_${Date.now()}`,
        groupName: 'Kỹ Năng Kỹ Thuật (Technical Skills)',
        skills: profile?.skills && profile.skills.length > 0
          ? profile.skills
          : ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'PostgreSQL', 'Git']
      },
      {
        id: `grp_soft_${Date.now() + 1}`,
        groupName: 'Kỹ Năng Mềm & Ngoại Ngữ',
        skills: ['Làm việc nhóm', 'Tư duy phản biện', 'Giao tiếp tiếng Anh (B2)']
      }
    ];

    const certItems: CertificationItem[] = certificates.length > 0
      ? certificates.map(c => ({
          id: c.id,
          certificateName: c.title,
          organization: c.issuer,
          issueDate: c.issue_date || '2025'
        }))
      : [
          {
            id: `cert_${Date.now()}`,
            certificateName: 'Chứng chỉ Lập trình Web Full-stack Chuyên Nghiệp',
            organization: 'Đại Học Quốc Gia TP.HCM',
            issueDate: '2025'
          }
        ];

    const sections: CVSection[] = [
      {
        id: 'sec_objective',
        type: 'objective',
        title: 'MỤC TIÊU NGHỀ NGHIỆP',
        order_index: 0,
        is_visible: true,
        settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
        content: initialSummary
      },
      {
        id: 'sec_skills',
        type: 'skills',
        title: 'KỸ NĂNG CHUYÊN MÔN',
        order_index: 1,
        is_visible: true,
        settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
        items: skillItems
      },
      {
        id: 'sec_projects',
        type: 'projects',
        title: 'ĐỒ ÁN & DỰ ÁN THỰC TẾ (VERIFIED PROJECTS)',
        order_index: 2,
        is_visible: true,
        settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
        items: projectItems
      },
      {
        id: 'sec_work_exp',
        type: 'work_experience',
        title: 'KINH NGHIỆM LÀM VIỆC',
        order_index: 3,
        is_visible: true,
        settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
        items: [
          {
            id: `work_${Date.now()}`,
            company: 'Công Ty Công Nghệ / Tech Startup',
            position: 'Thực tập sinh Phát triển Phần mềm',
            startDate: '06/2025',
            endDate: 'Hiện tại',
            description: '• Tham gia phát triển các tính năng phía Frontend bằng React & TypeScript.\n• Phối hợp với đội ngũ Backend thiết kế RESTful API và tối ưu trải nghiệm người dùng.'
          }
        ]
      },
      {
        id: 'sec_education',
        type: 'education',
        title: 'HỌC VẤN & BẰNG CẤP',
        order_index: 4,
        is_visible: true,
        settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
        items: [
          {
            id: `edu_${Date.now()}`,
            institution: profile?.university || 'Trường Đại Học Công Nghệ',
            major: profile?.major || 'Công Nghệ Thông Tin',
            startDate: '2022',
            endDate: '2026',
            gpa: profile?.gpa || '3.5 / 4.0',
            description: '• Tốt nghiệp loại Giỏi, tích cực tham gia các đề tài nghiên cứu khoa học.'
          }
        ]
      },
      {
        id: 'sec_certs',
        type: 'certifications',
        title: 'CHỨNG CHỈ & BẰNG CẤP',
        order_index: 5,
        is_visible: true,
        settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
        items: certItems
      }
    ];

    if (achievements.length > 0) {
      sections.push({
        id: 'sec_awards',
        type: 'awards',
        title: 'GIẢI THƯỞNG & THÀNH TÍCH',
        order_index: 6,
        is_visible: true,
        settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
        items: achievements.map(a => ({
          id: a.id,
          awardName: a.title,
          organization: a.category || 'Cuộc thi Học thuật',
          date: '2025'
        }))
      });
    }

    return { personalInfo, sections };
  },

  /* ─────────────────────────────────────────────────────────────────────────────
   * 🗂️ MULTI-CV MANAGEMENT SYSTEM (QUẢN LÝ NHIỀU CV: CŨ, MỚI, NHÂN BẢN)
   * ────────────────────────────────────────────────────────────────────────────*/

  /**
   * Get all managed CVs for a user
   */
  getAllCVs(userId?: string): ManagedCVItem[] {
    try {
      const storageKey = `${MULTI_CV_STORAGE_PREFIX}${userId || 'guest'}`;
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const items = JSON.parse(raw) as ManagedCVItem[];
        if (Array.isArray(items) && items.length > 0) {
          return items;
        }
      }

      // Backward compatibility: migrate single saved CV if available
      const legacyKey = `profilehub_saved_cv_${userId || 'guest'}`;
      const legacy = localStorage.getItem(legacyKey) || localStorage.getItem('profilehub_saved_cv_latest');
      if (legacy) {
        const legacyData = JSON.parse(legacy) as SavedCVData;
        const initialCV: ManagedCVItem = {
          id: `cv_default_${Date.now()}`,
          title: 'CV Chính (Mặc Định)',
          targetRole: legacyData.personalInfo?.jobTitle || 'Kỹ Sư Phần Mềm',
          createdAt: legacyData.savedAt || new Date().toISOString(),
          updatedAt: legacyData.savedAt || new Date().toISOString(),
          isDefault: true,
          data: legacyData,
        };
        this.saveAllCVs([initialCV], userId);
        this.setActiveCVId(initialCV.id, userId);
        return [initialCV];
      }
    } catch (e) {
      console.warn('[cvService] Failed to load multi-CVs list:', e);
    }
    return [];
  },

  /**
   * Save array of all CVs
   */
  saveAllCVs(cvs: ManagedCVItem[], userId?: string): void {
    try {
      const storageKey = `${MULTI_CV_STORAGE_PREFIX}${userId || 'guest'}`;
      localStorage.setItem(storageKey, JSON.stringify(cvs));
    } catch (e) {
      console.error('[cvService] Failed to save multi-CVs list:', e);
    }
  },

  /**
   * Get specific CV by ID
   */
  getCVById(id: string, userId?: string): ManagedCVItem | null {
    const list = this.getAllCVs(userId);
    return list.find(c => c.id === id) || null;
  },

  /**
   * Get active CV ID
   */
  getActiveCVId(userId?: string): string | null {
    try {
      const key = `${ACTIVE_CV_ID_PREFIX}${userId || 'guest'}`;
      const activeId = localStorage.getItem(key);
      if (activeId) return activeId;

      const list = this.getAllCVs(userId);
      if (list.length > 0) {
        const defaultCV = list.find(c => c.isDefault) || list[0];
        localStorage.setItem(key, defaultCV.id);
        return defaultCV.id;
      }
    } catch {
      // Ignore
    }
    return null;
  },

  /**
   * Set active CV ID
   */
  setActiveCVId(id: string, userId?: string): void {
    try {
      const key = `${ACTIVE_CV_ID_PREFIX}${userId || 'guest'}`;
      localStorage.setItem(key, id);
    } catch {
      // Ignore
    }
  },

  /**
   * Get active ManagedCVItem
   */
  getActiveCV(userId?: string): ManagedCVItem | null {
    const activeId = this.getActiveCVId(userId);
    if (activeId) {
      const cv = this.getCVById(activeId, userId);
      if (cv) return cv;
    }
    const list = this.getAllCVs(userId);
    return list.length > 0 ? list[0] : null;
  },

  /**
   * Saves or updates a specific CV Item
   */
  saveManagedCV(item: ManagedCVItem, userId?: string): ManagedCVItem {
    const list = this.getAllCVs(userId);
    const now = new Date().toISOString();
    const index = list.findIndex(c => c.id === item.id);

    const updatedItem: ManagedCVItem = {
      ...item,
      updatedAt: now,
      data: {
        ...item.data,
        savedAt: now,
      }
    };

    if (index >= 0) {
      list[index] = updatedItem;
    } else {
      list.unshift(updatedItem);
    }

    this.saveAllCVs(list, userId);
    this.setActiveCVId(updatedItem.id, userId);

    // Also update legacy key for compatibility
    try {
      const legacyKey = `profilehub_saved_cv_${userId || 'guest'}`;
      localStorage.setItem(legacyKey, JSON.stringify(updatedItem.data));
      localStorage.setItem('profilehub_saved_cv_latest', JSON.stringify(updatedItem.data));
    } catch {
      // Ignore
    }

    return updatedItem;
  },

  /**
   * Creates a brand new CV from profile data or scratch
   */
  createNewCV(options: {
    title: string;
    targetRole: string;
    data: SavedCVData;
    userId?: string;
    isDefault?: boolean;
  }): ManagedCVItem {
    const now = new Date().toISOString();
    const newCV: ManagedCVItem = {
      id: `cv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: options.title || 'CV Mới Chưa Đặt Tên',
      targetRole: options.targetRole || 'Kỹ Sư Phần Mềm',
      createdAt: now,
      updatedAt: now,
      isDefault: options.isDefault || false,
      data: {
        ...options.data,
        savedAt: now,
      }
    };

    const list = this.getAllCVs(options.userId);
    if (options.isDefault) {
      list.forEach(c => { c.isDefault = false; });
    }
    list.unshift(newCV);
    this.saveAllCVs(list, options.userId);
    this.setActiveCVId(newCV.id, options.userId);
    return newCV;
  },

  /**
   * Clones / Duplicates an existing (old) CV
   */
  duplicateCV(sourceId: string, newTitle?: string, userId?: string): ManagedCVItem | null {
    const source = this.getCVById(sourceId, userId);
    if (!source) return null;

    const now = new Date().toISOString();
    const clonedCV: ManagedCVItem = {
      id: `cv_clone_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: newTitle || `${source.title} (Bản Sao)`,
      targetRole: source.targetRole,
      createdAt: now,
      updatedAt: now,
      isDefault: false,
      data: {
        ...JSON.parse(JSON.stringify(source.data)),
        savedAt: now,
      }
    };

    const list = this.getAllCVs(userId);
    list.unshift(clonedCV);
    this.saveAllCVs(list, userId);
    this.setActiveCVId(clonedCV.id, userId);
    return clonedCV;
  },

  /**
   * Renames a CV
   */
  renameCV(id: string, newTitle: string, newRole?: string, userId?: string): boolean {
    const list = this.getAllCVs(userId);
    const item = list.find(c => c.id === id);
    if (!item) return false;

    item.title = newTitle.trim();
    if (newRole) item.targetRole = newRole.trim();
    item.updatedAt = new Date().toISOString();
    this.saveAllCVs(list, userId);
    return true;
  },

  /**
   * Sets a CV as Default
   */
  setDefaultCV(id: string, userId?: string): boolean {
    const list = this.getAllCVs(userId);
    const exists = list.some(c => c.id === id);
    if (!exists) return false;

    list.forEach(c => {
      c.isDefault = (c.id === id);
    });
    this.saveAllCVs(list, userId);
    return true;
  },

  /**
   * Deletes a CV
   */
  deleteCV(id: string, userId?: string): boolean {
    const list = this.getAllCVs(userId);
    const filtered = list.filter(c => c.id !== id);
    if (filtered.length === list.length) return false;

    this.saveAllCVs(filtered, userId);

    // If active was deleted, point to first available
    const activeId = this.getActiveCVId(userId);
    if (activeId === id) {
      if (filtered.length > 0) {
        this.setActiveCVId(filtered[0].id, userId);
      } else {
        localStorage.removeItem(`${ACTIVE_CV_ID_PREFIX}${userId || 'guest'}`);
      }
    }
    return true;
  },

  /**
   * Clears all bulk imported CVs, keeping only default/first CV
   */
  clearAllBulkCVs(userId?: string): void {
    const list = this.getAllCVs(userId);
    const keep = list.filter(c => c.isDefault || !c.id.startsWith('cv_bulk_'));
    const finalList = keep.length > 0 ? keep : (list.length > 0 ? [list[0]] : []);
    this.saveAllCVs(finalList, userId);
    if (finalList.length > 0) {
      this.setActiveCVId(finalList[0].id, userId);
    }
  },

  /**
   * Bulk import candidate CVs into managed CVs list (Batch push 100 CVs at once)
   */
  bulkImportCandidates(
    candidates: any[],
    userId?: string,
    options?: { replaceAll?: boolean; targetTemplate?: CVTemplateType }
  ): ManagedCVItem[] {
    const now = new Date().toISOString();
    const newItems: ManagedCVItem[] = candidates.map((cand, idx) => {
      let personalInfo: PersonalInfoData;
      let sections: CVSection[];

      if (cand.data && cand.data.sections) {
        personalInfo = cand.data.personalInfo;
        sections = cand.data.sections;
      } else {
        const converted = convertImportedCvToCvBuilderState(cand);
        personalInfo = converted.personalInfo;
        sections = converted.sections;
      }

      return {
        id: `cv_bulk_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        title: cand.title || `CV ${cand.target_role || personalInfo.jobTitle || 'Chuyên Viên'} (${personalInfo.fullName})`,
        targetRole: cand.target_role || personalInfo.jobTitle || 'Chuyên Viên',
        createdAt: now,
        updatedAt: now,
        isDefault: idx === 0 && options?.replaceAll ? true : false,
        data: {
          personalInfo,
          sections,
          selectedTemplate: options?.targetTemplate || 'classic',
          primaryColor: '#1e3a8a',
          selectedFontId: 'be-vietnam-pro',
          spacingDensity: 'standard',
          fontSizeLevel: 'medium',
          savedAt: now,
        },
      };
    });

    const currentList = options?.replaceAll ? [] : this.getAllCVs(userId);
    const combined = [...newItems, ...currentList];
    this.saveAllCVs(combined, userId);

    if (newItems.length > 0) {
      this.setActiveCVId(newItems[0].id, userId);
    }
    return newItems;
  },

  /**
   * Save CV data (backward compatibility)
   */
  async saveCV(data: SavedCVData, userId?: string): Promise<{ success: boolean; savedAt: string }> {
    const savedAt = new Date().toISOString();
    const payload: SavedCVData = { ...data, savedAt };

    try {
      const activeId = this.getActiveCVId(userId);
      const list = this.getAllCVs(userId);
      const current = list.find(c => c.id === activeId);

      if (current) {
        current.data = payload;
        current.updatedAt = savedAt;
        if (data.personalInfo?.jobTitle) {
          current.targetRole = data.personalInfo.jobTitle;
        }
        this.saveAllCVs(list, userId);
      } else {
        const newCV: ManagedCVItem = {
          id: `cv_${Date.now()}`,
          title: 'CV Chính',
          targetRole: data.personalInfo?.jobTitle || 'Kỹ Sư Phần Mềm',
          createdAt: savedAt,
          updatedAt: savedAt,
          isDefault: true,
          data: payload,
        };
        this.saveAllCVs([newCV], userId);
        this.setActiveCVId(newCV.id, userId);
      }

      const storageKey = `profilehub_saved_cv_${userId || 'guest'}`;
      localStorage.setItem(storageKey, JSON.stringify(payload));
      localStorage.setItem('profilehub_saved_cv_latest', JSON.stringify(payload));

      if (userId) {
        try {
          await supabase.from('profiles').update({
            updated_at: savedAt
          }).eq('id', userId);
        } catch {
          // Non-blocking
        }
      }

      return { success: true, savedAt };
    } catch (error) {
      console.error('[cvService] Save CV failed:', error);
      return { success: false, savedAt };
    }
  },

  /**
   * Load saved CV data from storage (active or latest)
   */
  loadSavedCV(userId?: string): SavedCVData | null {
    try {
      const activeId = this.getActiveCVId(userId);
      if (activeId) {
        const item = this.getCVById(activeId, userId);
        if (item?.data) return item.data;
      }

      const storageKey = `profilehub_saved_cv_${userId || 'guest'}`;
      const saved = localStorage.getItem(storageKey) || localStorage.getItem('profilehub_saved_cv_latest');
      if (saved) {
        return JSON.parse(saved) as SavedCVData;
      }
    } catch (error) {
      console.warn('[cvService] Failed to parse saved CV data:', error);
    }
    return null;
  },

  /**
   * Create an initial item for a newly added section
   */
  createDefaultSectionItem(type: CVSectionType): any {
    const now = Date.now();
    switch (type) {
      case 'work_experience':
        return {
          id: `work_${now}`,
          company: 'Tên Công Ty / Doanh Nghiệp',
          position: 'Vị Trí Công Việc',
          startDate: '2025',
          endDate: 'Hiện tại',
          description: '• Trách nhiệm và thành tích đạt được theo công thức: Hành động + Công nghệ + Con số.'
        };
      case 'education':
        return {
          id: `edu_${now}`,
          institution: 'Tên Trường Đại Học / Cơ Sở Đào Tạo',
          major: 'Chuyên Ngành',
          startDate: '2022',
          endDate: '2026',
          gpa: '3.5 / 4.0',
          description: '• Tốt nghiệp loại Giỏi, hoàn thành các đề tài nghiên cứu...'
        };
      case 'projects':
        return {
          id: `proj_${now}`,
          projectName: 'Tên Đồ Án / Sản Phẩm',
          role: 'Full-stack Developer',
          startDate: '2025',
          endDate: '2026',
          description: '• Xây dựng và triển khai hệ thống giải quyết vấn đề...',
          technologies: ['React', 'TypeScript', 'Node.js']
        };
      case 'skills':
        return {
          id: `grp_${now}`,
          groupName: 'Kỹ Năng Kỹ Thuật (Technical Skills)',
          skills: ['JavaScript', 'TypeScript', 'React', 'Node.js']
        };
      case 'certifications':
        return {
          id: `cert_${now}`,
          certificateName: 'Tên Chứng Chỉ',
          organization: 'Đơn Vị Cấp',
          issueDate: '2026'
        };
      case 'activities':
        return {
          id: `act_${now}`,
          organization: 'Câu Lạc Bộ / Tổ Chức Tình Nguyện',
          role: 'Thành viên ban tổ chức',
          startDate: '2024',
          endDate: '2025',
          description: '• Hỗ trợ tổ chức các sự kiện học thuật...'
        };
      case 'awards':
        return {
          id: `award_${now}`,
          awardName: 'Tên Giải Thưởng',
          organization: 'Đơn Vị Trao Giải',
          date: '2025'
        };
      case 'languages':
        return { id: `lang_${now}`, language: 'Tiếng Anh', level: 'Thành thạo (Fluent / B2)' };
      case 'references':
        return {
          id: `ref_${now}`,
          name: 'Họ và Tên Người Tham Chiếu',
          position: 'Giảng viên / Quản lý',
          company: 'Trường Đại Học / Công Ty',
          email: 'mentor@example.com',
          phone: '0912 345 678'
        };
      case 'custom':
      default:
        return {
          id: `custom_${now}`,
          title: 'Tiêu đề nội dung',
          date: '2026',
          description: 'Mô tả chi tiết nội dung...'
        };
    }
  }
};

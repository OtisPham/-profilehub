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
import { apiClient } from '../api/axiosClient';

export interface SavedCVData {
  personalInfo: PersonalInfoData;
  sections: CVSection[];
  selectedTemplate: CVTemplateType;
  primaryColor: string;
  selectedFontId: string;
  spacingDensity: 'compact' | 'standard' | 'relaxed';
  fontSizeLevel: 'small' | 'medium' | 'large';
  savedAt: string;
  applicationPitch?: string;
  targetJdText?: string;
  targetRoleTitle?: string;
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
    const profile = data?.profile || null;
    const projects = Array.isArray(data?.projects) ? data.projects : [];
    const certificates = Array.isArray(data?.certificates) ? data.certificates : [];
    const achievements = Array.isArray(data?.achievements) ? data.achievements : [];

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
            description: '• Thiết kế kiến trúc module, tích hợp minh chứng dự án và chuẩn hóa ATS chuyên nghiệp.\n• Tối ưu hóa hiệu năng render phân trang A4 và xuất PDF đạt chuẩn 100%.',
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
        title: 'ĐỒ ÁN & DỰ ÁN TIÊU BIỂU (FEATURED PROJECTS)',
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
            description: profile?.gpa
              ? `• Điểm trung bình tích lũy (GPA): ${profile.gpa} / 4.0\n• Chuyên ngành chính và các học phần chuyên sâu đạt kết quả tốt.`
              : '• Tích cực tham gia các đề tài nghiên cứu khoa học và đồ án chuyên ngành.'
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
      if (raw !== null) {
        const items = JSON.parse(raw) as ManagedCVItem[];
        if (Array.isArray(items)) {
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
   * Đồng bộ và tải toàn bộ danh sách CV từ Supabase Cloud Database với cơ chế Cache-First
   */
  async fetchAndSyncCVs(userId?: string): Promise<ManagedCVItem[]> {
    const localList = this.getAllCVs(userId);
    if (!userId) return localList;

    try {
      const { data, error } = await supabase
        .from('student_cvs')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const cloudList: ManagedCVItem[] = data.map(row => ({
          id: row.id,
          title: row.title || 'CV Chưa Đặt Tên',
          targetRole: row.target_role || 'Kỹ Sư Phần Mềm',
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          isDefault: !!row.is_default,
          data: (row.cv_data && typeof row.cv_data === 'object' && Object.keys(row.cv_data).length > 0) 
            ? row.cv_data 
            : (localList.find(c => c.id === row.id)?.data || localList[0]?.data || {}),
        }));

        // Cập nhật lại cache localStorage
        this.saveAllCVs(cloudList, userId);
        return cloudList;
      }

      // Tự động đẩy dữ liệu cũ từ Local lên Cloud (Auto Cloud Migration) nếu trên Supabase chưa có
      if ((!data || data.length === 0) && localList.length > 0) {
        console.log('[cvService] Tự động đồng bộ CV từ local lên Supabase Cloud Database...');
        for (const item of localList) {
          await supabase.from('student_cvs').upsert({
            id: item.id,
            user_id: userId,
            title: item.title,
            target_role: item.targetRole,
            is_default: !!item.isDefault,
            cv_data: item.data,
            updated_at: item.updatedAt || new Date().toISOString(),
          }, { onConflict: 'id' });
        }
      }
    } catch (err) {
      console.warn('[cvService] Bảng student_cvs chưa sẵn sàng hoặc gặp lỗi mạng, sử dụng local cache:', err);
    }

    return localList;
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

    // Đồng bộ đám mây ngầm lên Supabase nếu đã đăng nhập
    if (userId) {
      Promise.resolve(
        supabase.from('student_cvs').upsert({
          id: updatedItem.id,
          user_id: userId,
          title: updatedItem.title,
          target_role: updatedItem.targetRole,
          is_default: !!updatedItem.isDefault,
          cv_data: updatedItem.data,
          updated_at: updatedItem.updatedAt,
        }, { onConflict: 'id' })
      ).then((res: any) => {
        if (res?.error) console.warn('[cvService] Lỗi đồng bộ CV lên Supabase:', res.error.message);
        else console.log('[cvService] Đã đồng bộ CV lên Supabase Cloud:', updatedItem.id);
      }, (err) => console.warn('[cvService] Exception đồng bộ CV:', err));
    }

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

    // Đồng bộ đám mây ngầm lên Supabase nếu có userId
    if (options.userId) {
      Promise.resolve(
        supabase.from('student_cvs').insert({
          id: newCV.id,
          user_id: options.userId,
          title: newCV.title,
          target_role: newCV.targetRole,
          is_default: !!newCV.isDefault,
          cv_data: newCV.data,
          created_at: newCV.createdAt,
          updated_at: newCV.updatedAt,
        })
      ).then((res: any) => {
        if (res?.error) console.warn('[cvService] Lỗi tạo CV trên Supabase:', res.error.message);
        else console.log('[cvService] Đã tạo CV mới trên Supabase Cloud:', newCV.id);
      }, (err) => console.warn('[cvService] Exception tạo CV:', err));
    }

    // Also update legacy storage keys for maximum compatibility
    try {
      const legacyKey = `profilehub_saved_cv_${options.userId || 'guest'}`;
      localStorage.setItem(legacyKey, JSON.stringify(newCV.data));
      localStorage.setItem('profilehub_saved_cv_latest', JSON.stringify(newCV.data));
    } catch {
      // Ignore
    }

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

    if (userId) {
      Promise.resolve(
        supabase.from('student_cvs').insert({
          id: clonedCV.id,
          user_id: userId,
          title: clonedCV.title,
          target_role: clonedCV.targetRole,
          is_default: false,
          cv_data: clonedCV.data,
          created_at: clonedCV.createdAt,
          updated_at: clonedCV.updatedAt,
        })
      ).catch(() => {});
    }

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

    if (userId) {
      Promise.resolve(
        supabase.from('student_cvs').update({
          title: item.title,
          target_role: item.targetRole,
          updated_at: item.updatedAt,
        }).eq('id', id).eq('user_id', userId)
      ).catch(() => {});
    }

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

    if (userId) {
      Promise.resolve(
        supabase.from('student_cvs').update({ is_default: false }).eq('user_id', userId)
      ).then(() => {
        Promise.resolve(
          supabase.from('student_cvs').update({ is_default: true }).eq('id', id).eq('user_id', userId)
        ).catch(() => {});
      }, () => {});
    }

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

    if (userId) {
      Promise.resolve(
        supabase.from('student_cvs').delete().eq('id', id).eq('user_id', userId)
      ).catch(() => {});
    }

    // If active was deleted, point to first available
    const activeId = this.getActiveCVId(userId);
    if (activeId === id) {
      if (filtered.length > 0) {
        this.setActiveCVId(filtered[0].id, userId);
      } else {
        localStorage.removeItem(`${ACTIVE_CV_ID_PREFIX}${userId || 'guest'}`);
        localStorage.removeItem(`profilehub_saved_cv_${userId || 'guest'}`);
        localStorage.removeItem('profilehub_saved_cv_latest');
      }
    }
    return true;
  },

  /**
   * Ticket 01: Reverse Sync projects from CV to Master Projects Library
   */
  async syncCvProjectsToMaster(
    projects: ProjectItem[],
    userId?: string
  ): Promise<{
    syncedProjects: Array<{ id: string; title: string }>;
    optedOutCount: number;
    skippedCount: number;
  }> {
    if (!userId || !Array.isArray(projects) || projects.length === 0) {
      return { syncedProjects: [], optedOutCount: 0, skippedCount: 0 };
    }

    const syncedProjects: Array<{ id: string; title: string }> = [];
    let optedOutCount = 0;
    let skippedCount = 0;

    for (const proj of projects) {
      if (proj.syncToMasterProfile === false) {
        optedOutCount++;
        continue;
      }

      const title = (proj.projectName || '').trim();
      if (!title) {
        skippedCount++;
        continue;
      }

      try {
        const payload: any = {
          student_id: userId,
          title,
          role: proj.role || 'Developer',
          description: proj.description || '',
          tags: proj.technologies || [],
          demo_url: proj.projectUrl || null,
          github_url: proj.githubUrl || null,
          created_at: new Date().toISOString()
        };

        const { error } = await supabase.from('projects').insert(payload);
        if (!error) {
          syncedProjects.push({ id: proj.id, title });
        } else {
          console.warn('[cvService] Failed to reverse sync project:', error.message);
        }
      } catch (err) {
        console.warn('[cvService] Exception syncing project:', err);
      }
    }

    return { syncedProjects, optedOutCount, skippedCount };
  },
  /**
   * Reverse-Sync: Synchronize full CV data back to Student Profile & Master Tables
   */
  async syncCvToFullProfile(
    cvData: {
      personalInfo: PersonalInfoData;
      sections: CVSection[];
    },
    userId?: string
  ): Promise<{
    profileUpdated: boolean;
    syncedProjectsCount: number;
    syncedSkillsCount: number;
    summary: string[];
  }> {
    const summary: string[] = [];
    if (!userId) {
      return {
        profileUpdated: false,
        syncedProjectsCount: 0,
        syncedSkillsCount: 0,
        summary: ['Chế độ Khách: Đã lưu CV an toàn vào trình duyệt (localStorage).']
      };
    }

    let profileUpdated = false;
    let syncedProjectsCount = 0;
    let syncedSkillsCount = 0;

    try {
      // 1. Extract Education & Bio & Skills
      const objectiveSection = cvData.sections.find(s => s.type === 'objective');
      const educationSection = cvData.sections.find(s => s.type === 'education');
      const skillsSections = cvData.sections.filter(s => s.type === 'skills');

      const primaryEducation = educationSection?.items?.[0];
      const bioContent = objectiveSection?.content || '';

      // Extract skills list
      const extractedSkills: string[] = [];
      skillsSections.forEach(sec => {
        (sec.items || []).forEach((item: any) => {
          if (Array.isArray(item.skills)) {
            extractedSkills.push(...item.skills);
          } else if (item.name) {
            extractedSkills.push(item.name);
          } else if (typeof item === 'string') {
            extractedSkills.push(item);
          }
        });
      });
      const uniqueSkills = Array.from(new Set(extractedSkills.map(s => s.trim()).filter(Boolean)));

      // 2. Update student_profiles
      const profileUpdates: any = {
        updated_at: new Date().toISOString()
      };
      if (cvData.personalInfo.fullName) {
        profileUpdates.full_name = cvData.personalInfo.fullName;
        summary.push(`Họ tên: ${cvData.personalInfo.fullName}`);
      }
      if (cvData.personalInfo.jobTitle) {
        profileUpdates.major = cvData.personalInfo.jobTitle;
      }
      if (bioContent) {
        profileUpdates.bio = bioContent;
      }
      if (primaryEducation?.institution) {
        profileUpdates.university = primaryEducation.institution;
      }
      if (primaryEducation?.gpa) {
        profileUpdates.gpa = primaryEducation.gpa;
      }
      if (uniqueSkills.length > 0) {
        profileUpdates.skills = uniqueSkills;
        syncedSkillsCount = uniqueSkills.length;
        summary.push(`${uniqueSkills.length} Kỹ năng`);
      }

      const { error: profError } = await supabase
        .from('student_profiles')
        .upsert({ id: userId, ...profileUpdates });

      if (!profError) {
        profileUpdated = true;
      }

      // Also update full_name in users table
      if (cvData.personalInfo.fullName) {
        await supabase.from('users').update({ full_name: cvData.personalInfo.fullName }).eq('id', userId);
      }

      // 3. Sync projects into projects table
      const projectSections = cvData.sections.filter(s => s.type === 'projects');
      const allProjects: ProjectItem[] = projectSections.flatMap(s => (s.items as ProjectItem[]) || []);
      
      for (const proj of allProjects) {
        const title = (proj.projectName || '').trim();
        if (!title) continue;

        const payload: any = {
          student_id: userId,
          title,
          role: proj.role || 'Lập trình viên',
          description: proj.description || '',
          tags: proj.technologies || [],
          demo_url: proj.projectUrl || null,
          github_url: proj.githubUrl || null,
          project_type: proj.scopeType === 'team' ? 'Dự án nhóm' : 'Mã nguồn mở / Cá nhân',
          created_at: new Date().toISOString()
        };

        const { data: existing } = await supabase
          .from('projects')
          .select('id')
          .eq('student_id', userId)
          .eq('title', title)
          .maybeSingle();

        if (existing?.id) {
          await supabase.from('projects').update(payload).eq('id', existing.id);
        } else {
          await supabase.from('projects').insert([payload]);
        }
        syncedProjectsCount++;
      }

      if (syncedProjectsCount > 0) {
        summary.push(`${syncedProjectsCount} Dự án vào Kho`);
      }
    } catch (err) {
      console.warn('[cvService] Reverse-sync exception:', err);
    }

    return {
      profileUpdated,
      syncedProjectsCount,
      syncedSkillsCount,
      summary
    };
  },


  /**
   * Clears all bulk / excess imported CVs, keeping only the primary default CV.
   * Deletes thoroughly from both localStorage and Supabase Cloud Database.
   */
  async clearAllBulkCVs(userId?: string): Promise<{ deletedCount: number; keptTitle: string }> {
    const list = this.getAllCVs(userId);
    if (list.length <= 1) return { deletedCount: 0, keptTitle: list[0]?.title || '' };

    // Giữ lại duy nhất bản CV Mặc Định (hoặc bản đầu tiên nếu chưa gán default)
    const primaryCV = list.find(c => c.isDefault) || list[0];
    primaryCV.isDefault = true;

    const itemsToDelete = list.filter(c => c.id !== primaryCV.id);

    // 1. Lưu duy nhất 1 bản CV chính vào localStorage
    const finalList = [primaryCV];
    this.saveAllCVs(finalList, userId);
    this.setActiveCVId(primaryCV.id, userId);

    try {
      localStorage.removeItem('profilehub_bulk_imported_cvs');
    } catch {}

    // 2. Xóa triệt để toàn bộ các bản CV thừa trên Supabase Cloud Database
    if (userId) {
      try {
        await supabase
          .from('student_cvs')
          .delete()
          .eq('user_id', userId)
          .neq('id', primaryCV.id);

        // Đảm bảo bản CV duy nhất còn lại được đánh dấu is_default = true
        await supabase
          .from('student_cvs')
          .update({ is_default: true })
          .eq('id', primaryCV.id)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('[cvService] Failed to clear excess CVs on Supabase:', err);
      }
    }

    return { deletedCount: itemsToDelete.length, keptTitle: primaryCV.title };
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
          description: '• Hoàn thành các đề tài nghiên cứu và đồ án chuyên ngành...'
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
  },

  /**
   * 🤖 AI TỰ ĐỘNG ĐỌC JD VÀ DỮ LIỆU HỒ SƠ CÁ NHÂN ĐỂ TẠO CV PHÙ HỢP VỚI JD ĐÓ
   */
  async generateTailoredCVFromJD(options: {
    jdText: string;
    targetRole?: string;
    companyName?: string;
    userId?: string;
    userEmail?: string;
  }): Promise<{ cv: ManagedCVItem; aiNotes?: any }> {
    const { jdText, targetRole, companyName, userId, userEmail } = options;

    // 1. Lấy dữ liệu nguồn thực tế từ Hồ Sơ Cá Nhân của ứng viên
    const sourceData = await this.fetchStudentCVSourceData(userId);

    // 2. Thử gọi API Backend AI (/api/ai/generate-tailored-cv) qua apiClient tự động nhận diện môi trường & auth token
    let generatedData: any = null;
    try {
      const result = await apiClient.post<any>('/ai/generate-tailored-cv', {
        jdText,
        targetRole,
        companyName,
        profile: {
          fullName: sourceData.profile?.full_name,
          major: sourceData.profile?.major,
          university: sourceData.profile?.university,
          gpa: sourceData.profile?.gpa,
          bio: sourceData.profile?.bio,
          skills: sourceData.profile?.skills || [],
          email: userEmail || (sourceData.profile as any)?.email,
        },
        projects: sourceData.projects,
        certificates: sourceData.certificates,
        achievements: sourceData.achievements,
      });

      if (result) {
        generatedData = result;
      }
    } catch (apiErr) {
      console.warn('[cvService] Backend AI API chưa sẵn sàng hoặc timeout, dùng bộ tối ưu cục bộ:', apiErr);
    }

    // 3. Fallback Client-side nếu server offline hoặc chưa chạy
    if (!generatedData) {
      generatedData = this.buildLocalTailoredCvFallback(sourceData, jdText, targetRole, companyName, userEmail);
    }

    // 4. Lưu bản CV mới vào kho lưu trữ
    const newCV = this.createNewCV({
      title: generatedData.title || `CV ${generatedData.targetRole || 'Mới'} (Tối ưu theo JD)`,
      targetRole: generatedData.targetRole || 'Kỹ Sư Phần Mềm',
      data: {
        personalInfo: generatedData.personalInfo,
        sections: generatedData.sections,
        selectedTemplate: (generatedData.selectedTemplate as CVTemplateType) || 'classic',
        primaryColor: generatedData.primaryColor || '#1e3a8a',
        selectedFontId: 'be-vietnam-pro',
        spacingDensity: 'standard',
        fontSizeLevel: 'medium',
        savedAt: new Date().toISOString(),
      },
      userId,
      isDefault: false,
    });

    this.setActiveCVId(newCV.id, userId);

    return {
      cv: newCV,
      aiNotes: generatedData.aiTailoringNotes,
    };
  },

  /**
   * Bộ tạo CV tối ưu cục bộ (Client-side Heuristic) đảm bảo hệ thống luôn tạo được CV ngay cả khi offline
   */
  buildLocalTailoredCvFallback(
    sourceData: StudentProfileData,
    jdText: string,
    userRole?: string,
    companyName?: string,
    userEmail?: string
  ): any {
    const { profile, projects, certificates, achievements } = sourceData;
    const normalizedJd = jdText.toLowerCase();

    // Nhận diện role
    let detectedRole = userRole;
    if (!detectedRole) {
      if (/frontend|front-end|react|vue|angular/i.test(normalizedJd)) detectedRole = 'Frontend Developer';
      else if (/backend|back-end|node|express|nest|java|golang|python/i.test(normalizedJd)) detectedRole = 'Backend Developer';
      else if (/fullstack|full-stack/i.test(normalizedJd)) detectedRole = 'Fullstack Engineer';
      else if (/data|analytics|analyst|ai|machine learning/i.test(normalizedJd)) detectedRole = 'Data Analyst / AI Specialist';
      else if (/design|ui\/ux|product designer/i.test(normalizedJd)) detectedRole = 'UI/UX & Product Designer';
      else if (/nurse|điều dưỡng|y tế/i.test(normalizedJd)) detectedRole = 'Điều Dưỡng Viên Đa Khoa';
      else detectedRole = profile?.major || 'Kỹ Sư Phần Mềm';
    }

    const candidateSkills = profile?.skills && profile.skills.length > 0 
      ? profile.skills 
      : ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Git', 'RESTful API'];
    
    const matchedSkills = candidateSkills.filter(s => normalizedJd.includes(s.toLowerCase()));
    const otherSkills = candidateSkills.filter(s => !normalizedJd.includes(s.toLowerCase()));

    // Tự động phân loại kịch bản: Trực tiếp, Lệch Stack, hoặc Chuyển Ngành
    const isDirectMatch = matchedSkills.length >= 2;
    const isSameTechField = /developer|engineer|lập trình|phần mềm|tech|software|fullstack|frontend|backend/i.test(detectedRole);
    const isCareerPivot = !isSameTechField;
    const isStackPivot = isSameTechField && matchedSkills.length < 2;

    const pivotScenario: 'DIRECT_MATCH' | 'STACK_PIVOT' | 'CAREER_PIVOT' = isCareerPivot 
      ? 'CAREER_PIVOT' 
      : isStackPivot 
        ? 'STACK_PIVOT' 
        : 'DIRECT_MATCH';

    let group1Title = 'Kỹ Năng Trọng Tâm (Khớp JD Tuyển Dụng)';
    let group1Skills = matchedSkills.length > 0 ? matchedSkills : candidateSkills.slice(0, 4);
    let summary = '';
    let pivotStrategySummary = '';
    let skillGapRecommendations: string[] = [];

    if (pivotScenario === 'CAREER_PIVOT') {
      group1Title = 'Kỹ Năng Nền Tảng & Năng Lực Chuyển Đổi (Transferable Skills)';
      group1Skills = candidateSkills.slice(0, 4);
      pivotStrategySummary = `Áp dụng chiến lược Lợi Thế Kép (Hybrid Advantage): Kết hợp tư duy cấu trúc công nghệ sẵn có với chuyên môn vị trí ${detectedRole} để tạo giá trị khác biệt.`;
      summary = `Ứng viên tốt nghiệp chuyên ngành ${profile?.major || 'Công nghệ'} sở hữu nền tảng tư duy cấu trúc và logic vững chắc, định hướng chuyển đổi nghề nghiệp sang vị trí ${detectedRole}. Tận dụng thế mạnh về ${candidateSkills.slice(0, 3).join(', ')} và năng lực giải quyết bài toán thực tế để nhanh chóng tiếp cận, làm chủ nghiệp vụ và đem lại góc nhìn công nghệ sắc bén cho doanh nghiệp${companyName ? ` tại ${companyName}` : ''}.`;
      skillGapRecommendations = [
        `Bổ sung 1 đồ án cá nhân hoặc case-study chuyên sâu về ${detectedRole} để tăng tính thuyết phục với nhà tuyển dụng`,
        `Tham gia khóa học hoặc chứng chỉ ngắn hạn về các công cụ đặc thù của vị trí ${detectedRole}`
      ];
    } else if (pivotScenario === 'STACK_PIVOT') {
      group1Title = 'Kỹ Năng Nền Tảng & Tư Duy Kiến Trúc Chuyển Đổi (Core Engineering)';
      group1Skills = candidateSkills.slice(0, 4);
      pivotStrategySummary = `Áp dụng chiến lược Kiến Trúc Tương Đồng: Tận dụng tư duy hệ thống, OOP và quy trình phát triển sản phẩm đã được kiểm chứng để làm chủ nhanh chóng stack mới theo JD.`;
      summary = `Kỹ sư phần mềm chuyên ngành ${profile?.major || 'Công nghệ Thông tin'} với nền tảng vững chắc về kiến trúc mã nguồn, quy trình CI/CD và tư duy giải thuật. Nắm vững ${candidateSkills.slice(0, 3).join(', ')}, có khả năng học tập thích ứng cao (Fast-Learner) và chuyển đổi linh hoạt sang các công nghệ theo định hướng ${detectedRole}. Sẵn sàng đem tư duy kỹ thuật thực chiến cống hiến vào các bài toán phát triển sản phẩm${companyName ? ` tại ${companyName}` : ''}.`;
      skillGapRecommendations = [
        `Xây dựng 1 mini-project thực hành nhanh với stack công nghệ trọng tâm của JD để bổ sung vào hồ sơ thực chiến`,
        `Đọc kỹ tài liệu chính thức và chuẩn thiết kế (Best Practices) của stack công nghệ mới`
      ];
    } else {
      // DIRECT_MATCH
      pivotStrategySummary = `Đã phân nhóm và làm nổi bật các công nghệ then chốt khớp trực tiếp với yêu cầu của nhà tuyển dụng.`;
      summary = `Ứng viên nhiệt huyết tốt nghiệp chuyên ngành ${profile?.major || 'Công nghệ'} với nền tảng vững vàng về ${matchedSkills.slice(0, 4).join(', ')}. Có kinh nghiệm thực chiến qua các đồ án thực tế đã được kiểm định chất lượng, tư duy cấu trúc rõ ràng và khả năng thích nghi nhanh. Sẵn sàng đem năng lực chuyên môn và nhiệt huyết cống hiến vào mục tiêu phát triển của vị trí ${detectedRole}${companyName ? ` tại ${companyName}` : ''}.`;
    }

    const personalInfo = {
      fullName: profile?.full_name || 'HỌ VÀ TÊN ỨNG VIÊN',
      jobTitle: detectedRole,
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
        avatarUrl: false,
      },
    };

    const sections: CVSection[] = [
      {
        id: `sec_obj_${Date.now()}`,
        type: 'objective',
        title: 'MỤC TIÊU NGHỀ NGHIỆP',
        order_index: 0,
        is_visible: true,
        settings: { showTitle: true, showDivider: true, spacing: 'compact', titleStyle: 'bold', titleCase: 'uppercase' },
        content: summary,
      },
      {
        id: `sec_skills_${Date.now()}`,
        type: 'skills',
        title: 'KỸ NĂNG CHUYÊN MÔN',
        order_index: 1,
        is_visible: true,
        settings: { showTitle: true, showDivider: true, spacing: 'compact', titleStyle: 'bold', titleCase: 'uppercase' },
        items: [
          {
            id: `grp_1`,
            groupName: group1Title,
            skills: group1Skills,
          },
          {
            id: `grp_2`,
            groupName: pivotScenario === 'DIRECT_MATCH' ? 'Công Nghệ & Kỹ Năng Bổ Trợ' : 'Thế Mạnh Công Nghệ Đã Làm Chủ',
            skills: otherSkills.length > 0 ? otherSkills : ['Git', 'Docker', 'Postman', 'RESTful API'],
          },
          {
            id: `grp_3`,
            groupName: 'Phương Pháp & Kỹ Năng Mềm',
            skills: ['Quy trình Agile / Scrum', 'Tư duy giải quyết vấn đề', 'Làm việc nhóm & Giao tiếp kỹ thuật'],
          },
        ],
      },
      {
        id: `sec_proj_${Date.now()}`,
        type: 'projects',
        title: 'DỰ ÁN NỔI BẬT',
        order_index: 2,
        is_visible: true,
        settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
        items: (() => {
          if (projects.length === 0) {
            return [
              {
                id: `p_default_${Date.now()}`,
                projectName: 'Hệ Thống Quản Lý Hồ Sơ Năng Lực & Dự Án Thực Tế',
                role: 'Trưởng nhóm phát triển',
                startDate: '2025',
                endDate: '2026',
                description: 'Xây dựng ứng dụng hoàn chỉnh đáp ứng các tiêu chuẩn công nghệ hiện đại.',
                bullets: [
                  '• Thiết kế kiến trúc module độc lập và tối ưu luồng dữ liệu.',
                  '• Triển khai kiểm thử tự động và đảm bảo hiệu suất vận hành cao.'
                ],
                technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
                is_verified: true,
              }
            ];
          }

          // Xếp hạng đồ án thông minh:
          // 1. Đồ án có tính giao thoa / liên quan nhất với vị trí mới & JD
          // 2. Đồ án nổi bật nhất của bản thân (metrics, verified)
          const scored = projects.map(p => {
            let score = 0;
            const textToSearch = `${p.title} ${p.description || ''} ${(p.tags || []).join(' ')}`.toLowerCase();

            const jdWords = normalizedJd.split(/[\s,.;:()/\-]+/).filter(w => w.length >= 3);
            jdWords.forEach(w => {
              if (textToSearch.includes(w)) score += 2;
            });

            if (pivotScenario === 'CAREER_PIVOT') {
              if (/data|analyst|phân tích|dashboard|bi|chart|sql/i.test(detectedRole)) {
                if (/data|thống kê|chart|dashboard|report|báo cáo|sql|truy vấn|analytics/i.test(textToSearch)) score += 12;
              } else if (/design|ui|ux|giao diện|figma/i.test(detectedRole)) {
                if (/ui|ux|figma|design|giao diện|responsive|tailwind|css/i.test(textToSearch)) score += 12;
              } else if (/ba|business|product|quản lý/i.test(detectedRole)) {
                if (/nghiệp vụ|quản lý|quy trình|agile|scrum|hệ thống/i.test(textToSearch)) score += 12;
              }
            }

            return { project: p, score };
          });

          scored.sort((a, b) => b.score - a.score);
          const topProjects = scored.slice(0, 3).map(s => s.project);

          return topProjects.map((p, pIdx) => {
            const isFirstIntersecting = pIdx === 0 && pivotScenario === 'CAREER_PIVOT';
            return {
              id: p.id,
              projectName: p.title,
              role: p.role || 'Lập trình viên phát triển',
              startDate: '2025',
              endDate: '2026',
              description: isFirstIntersecting
                ? `Đồ án giao thoa kỹ năng thể hiện năng lực nghiệp vụ và tư duy công nghệ phù hợp vị trí ${detectedRole}.`
                : (p.description || ''),
              bullets: [
                `• Triển khai các tính năng cốt lõi sử dụng ${(p.tags || ['công nghệ']).slice(0, 3).join(', ')}.`,
                `• Tối ưu hiệu năng, cấu trúc mã nguồn theo chuẩn module và tài liệu hóa chi tiết.`,
                `• Đảm bảo chất lượng sản phẩm qua quy trình kiểm thử và rà soát kỹ thuật.`
              ],
              technologies: p.tags && p.tags.length > 0 ? p.tags : ['TypeScript', 'React'],
              projectUrl: undefined,
              githubUrl: undefined,
              is_verified: !!p.is_verified,
            };
          });
        })(),
      },
      {
        id: `sec_edu_${Date.now()}`,
        type: 'education',
        title: 'HỌC VẤN & BẰNG CẤP',
        order_index: 3,
        is_visible: true,
        settings: { showTitle: true, showDivider: true, spacing: 'compact', titleStyle: 'bold', titleCase: 'uppercase' },
        items: [
          {
            id: `edu_1`,
            institution: profile?.university || 'Trường Đại Học Công Nghệ',
            major: profile?.major || 'Công Nghệ Thông Tin',
            startDate: '2022',
            endDate: '2026',
            description: '• Tập trung chuyên sâu về cấu trúc dữ liệu, giải thuật và kiến trúc phần mềm.',
          },
        ],
      },
    ];

    if (certificates.length > 0) {
      sections.push({
        id: `sec_cert_${Date.now()}`,
        type: 'certifications',
        title: 'CHỨNG CHỈ & BẰNG CẤP',
        order_index: 4,
        is_visible: true,
        settings: { showTitle: true, showDivider: true, spacing: 'compact', titleStyle: 'bold', titleCase: 'uppercase' },
        items: certificates.map(c => ({
          id: c.id,
          certificateName: c.title,
          organization: c.issuer,
          issueDate: c.issue_date || '2025',
        })),
      });
    }

    const resolvedCompany = companyName || '';
    const cvTitle = resolvedCompany 
      ? `CV ${detectedRole} - ${resolvedCompany}` 
      : `CV ${detectedRole} (Tối ưu theo JD)`;

    return {
      title: cvTitle,
      targetRole: detectedRole,
      personalInfo,
      sections,
      selectedTemplate: 'classic',
      primaryColor: '#1e3a8a',
      aiTailoringNotes: {
        targetRole: detectedRole,
        matchedSkills,
        highlightedProjects: projects.map(p => p.title),
        pivotScenario,
        pivotStrategySummary,
        skillGapRecommendations,
        tailoringSummary: [
          pivotStrategySummary,
          `Đã phát hiện vị trí ${detectedRole} từ nội dung JD`,
          `Phân nhóm kỹ năng minh bạch, làm nổi bật tư duy nền tảng và năng lực giải quyết vấn đề`,
          `Cá nhân hóa mục tiêu nghề nghiệp theo công thức cầu nối chuyên môn`,
        ],
      },
    };
  },

  /**
   * UC-SYS-003: Quản lý Hạn Mức Tác Vụ AI (20 lượt / ngày)
   */
  getAiQuota(userId?: string): { dailyLimit: number; usedToday: number; remaining: number; resetDate: string } {
    const todayStr = new Date().toISOString().slice(0, 10);
    const key = `profilehub_ai_quota_${userId || 'guest'}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.resetDate === todayStr) {
          const usedToday = parsed.usedToday || 0;
          return {
            dailyLimit: 20,
            usedToday,
            remaining: Math.max(0, 20 - usedToday),
            resetDate: todayStr
          };
        }
      }
    } catch (e) {
      // Ignore json parse error
    }

    // Default new day
    const newQuota = { dailyLimit: 20, usedToday: 0, remaining: 20, resetDate: todayStr };
    localStorage.setItem(key, JSON.stringify(newQuota));
    return newQuota;
  },

  /**
   * Trừ 1 credit khi áp dụng thành công gợi ý AI (BR-06)
   */
  deductAiCredit(userId?: string): number {
    const quota = this.getAiQuota(userId);
    const updatedUsed = quota.usedToday + 1;
    const key = `profilehub_ai_quota_${userId || 'guest'}`;
    const newQuota = {
      dailyLimit: 20,
      usedToday: updatedUsed,
      remaining: Math.max(0, 20 - updatedUsed),
      resetDate: quota.resetDate
    };
    localStorage.setItem(key, JSON.stringify(newQuota));
    return newQuota.remaining;
  },

  /**
   * UC-CAN-010: Contextual AI Actions (Surgical Prompting)
   * Gọi API siêu nhẹ xử lý 1 câu/đoạn cụ thể, phản hồi < 1s
   */
  async executeContextualAiAction(params: {
    actionType:
      | 'REWRITE_FOR_JD'
      | 'ADD_KEYWORDS'
      | 'SHORTEN'
      | 'REWRITE_PROFESSIONAL'
      | 'FOCUS_RESULTS'
      | 'EXPAND'
      | 'TRANSLATE_EN'
      | 'TRANSLATE_VI';
    currentText: string;
    targetRole?: string;
    jdContext?: string;
    keywords?: string[];
  }): Promise<{ suggestedText: string; actionType: string; originalText: string }> {
    const { actionType, currentText, targetRole, jdContext, keywords = [] } = params;

    try {
      const result = await apiClient.post<any>('/ai/contextual-action', {
        actionType, currentText, targetRole, jdContext, keywords
      });

      if (result && result.suggestedText) {
        return result;
      }
    } catch (err) {
      console.warn('⚠️ [Contextual AI Action] API error, using smart client-side heuristic fallback:', err);
    }

    // Client Heuristic Fallback
    const role = targetRole || 'Lập trình viên';
    let fallback = currentText.trim();
    if (actionType === 'REWRITE_FOR_JD') {
      const core = fallback.replace(/^[•\s-]+/, '');
      fallback = fallback.startsWith('•')
        ? `• Chủ động triển khai và tối ưu ${core}, đảm bảo chất lượng kỹ thuật đáp ứng tiêu chuẩn vị trí ${role}.`
        : `Chủ động triển khai và tối ưu ${core}, đảm bảo chất lượng kỹ thuật đáp ứng tiêu chuẩn vị trí ${role}.`;
    } else if (actionType === 'ADD_KEYWORDS') {
      const topKws = keywords.slice(0, 2).join(', ');
      fallback = topKws ? `${fallback} (vận dụng chuyên sâu ${topKws})` : fallback;
    } else if (actionType === 'SHORTEN') {
      fallback = fallback
        .replace(/tích cực tham gia vào việc /gi, '')
        .replace(/chịu trách nhiệm cho /gi, '')
        .replace(/đã thực hiện /gi, '')
        .replace(/tiến hành /gi, '')
        .trim();
    } else if (actionType === 'REWRITE_PROFESSIONAL') {
      const core = fallback.replace(/^[•\s-]+/, '');
      fallback = fallback.startsWith('•')
        ? `• Trực tiếp thiết kế, triển khai và tối ưu ${core} theo chuẩn kiến trúc doanh nghiệp.`
        : `Trực tiếp thiết kế, triển khai và tối ưu ${core} theo chuẩn kiến trúc doanh nghiệp.`;
    } else if (actionType === 'FOCUS_RESULTS') {
      fallback = fallback.includes('%') || fallback.match(/\d+/)
        ? fallback
        : `${fallback}, nâng cao 30% hiệu năng vận hành và giảm thiểu tối đa lỗi phát sinh.`;
    } else if (actionType === 'EXPAND') {
      fallback = `${fallback}, áp dụng các phương pháp kỹ thuật tiên tiến và giải pháp tối ưu hệ thống.`;
    } else if (actionType === 'TRANSLATE_EN') {
      const core = fallback.replace(/^[•\s-]+/, '');
      fallback = fallback.startsWith('•')
        ? `• Developed and optimized ${core}, ensuring high software performance and code quality.`
        : `Developed and optimized ${core}, ensuring high software performance and code quality.`;
    } else if (actionType === 'TRANSLATE_VI') {
      fallback = fallback;
    }

    return {
      suggestedText: fallback,
      actionType,
      originalText: currentText
    };
  },
};

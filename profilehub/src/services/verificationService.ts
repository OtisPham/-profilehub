/**
 * verificationService.ts
 * Dịch vụ Cổng Tra Cứu Bảo Chứng Đồ Án Công Khai (Public Verification Gateway)
 * Kiến trúc: Single-Player Utility, Dual-Storage Seam, Zero Data Leak Privacy Boundary
 */

import type { PublicVerifiedProjectRecord } from '../types/projects.types';

const STORAGE_KEY = 'profilehub_verified_projects';

/**
 * Danh mục đồ án mẫu được chứng thực sẵn để tra cứu tức thì khi chạy offline hoặc demo
 */
const DEFAULT_VERIFIED_PROJECTS: PublicVerifiedProjectRecord[] = [
  {
    verificationCode: 'PH-VER-A8B9C2',
    verificationHash: '4f7a93bc6d291e0a84b5c7e1fa6291a8e937d10b741ca62c4b8e192a83e74b21',
    verifiedAt: '2026-10-18T14:30:00.000Z',
    isValid: true,
    project: {
      id: 'proj_ecommerce_redis',
      title: 'Hệ Thống Thương Mại Điện Tử & Đặt Hàng Thời Gian Thực (High-Throughput Order Engine)',
      projectType: 'enterprise',
      description: 'Nền tảng xử lý 10,000 req/s áp dụng Redis Caching Cluster, hàng đợi sự kiện RabbitMQ và PostgreSQL tối ưu hóa Partitioning. Giảm 35% response time và triệt tiêu race-condition.',
      tags: ['React 18', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      demoUrl: 'https://demo-ecommerce.profilehub.io',
      githubUrl: 'https://github.com/OtisPham/ecommerce-realtime-engine',
      figmaUrl: 'https://figma.com/@profilehub/ecommerce-spec',
      docUrl: 'https://docs.profilehub.io/projects/ecommerce-realtime'
    },
    student: {
      name: 'Phạm Thái Bảo',
      university: 'Đại học Hoa Sen',
      faculty: 'Khoa Công Nghệ Thông Tin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    instructor: {
      name: 'TS. Nguyễn Văn Hùng',
      title: 'Trưởng Bộ Môn Kỹ Thuật Phần Mềm',
      department: 'Khoa Công Nghệ Thông Tin'
    }
  },
  {
    verificationCode: 'PH-VER-882194',
    verificationHash: '9e12c84a20b78df49204bc9102847a19284710bc4728192a849102bc48192a11',
    verifiedAt: '2026-10-25T09:15:00.000Z',
    isValid: true,
    project: {
      id: 'proj_profilehub_ai',
      title: 'ProfileHub — Project-Driven AI CV Builder & Interview Diagnostic Engine',
      projectType: 'enterprise',
      description: 'Nền tảng tạo CV A4 định hướng đồ án thực tế với công cụ chẩn đoán STAR 4 bậc, phân tích từ khóa JD và phao cứu sinh giải trình số liệu phỏng vấn ngoại tuyến.',
      tags: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vitest', 'Supabase'],
      demoUrl: 'https://profilehub-phi.vercel.app',
      githubUrl: 'https://github.com/OtisPham/-profilehub',
      docUrl: 'https://profilehub-phi.vercel.app/docs'
    },
    student: {
      name: 'Phạm Thái Bảo',
      university: 'Đại học Hoa Sen',
      faculty: 'Khoa Công Nghệ Thông Tin'
    },
    instructor: {
      name: 'ThS. Trần Minh Đức',
      title: 'Giảng viên Hướng dẫn Đồ Án Tốt Nghiệp',
      department: 'Khoa Công Nghệ Thông Tin'
    }
  }
];

class VerificationService {
  private inMemoryCache: Map<string, PublicVerifiedProjectRecord> = new Map();

  constructor() {
    // Nạp sẵn dữ liệu mặc định vào bộ nhớ tạm
    DEFAULT_VERIFIED_PROJECTS.forEach(proj => {
      this.inMemoryCache.set(proj.verificationCode.toUpperCase(), this.sanitizeRecord(proj));
    });
  }
  /**
   * Tính toán chuỗi băm bất biến SHA-256 từ 4 tham số gốc
   * SHA-256(projectId + "|" + studentId + "|" + teacherId + "|" + verifiedAt)
   * Tương thích kép: Trình duyệt (Web Crypto) và Node.js test runner
   */
  async computeVerificationHash(payload: {
    projectId: string;
    studentId: string;
    teacherId: string;
    verifiedAt: string;
  }): Promise<string> {
    const rawMessage = `${payload.projectId}|${payload.studentId}|${payload.teacherId}|${payload.verifiedAt}`;

    if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(rawMessage);
      const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase();
    }

    // Fallback nếu không có Web Crypto API
    let hash = 0;
    for (let i = 0; i < rawMessage.length; i++) {
      hash = ((hash << 5) - hash) + rawMessage.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  /**
   * Sinh mã tra cứu ngẫu nhiên định dạng chuẩn Base62: PH-VER-[A-Z0-9]{6}
   */
  generateVerificationCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Loại bỏ ký tự dễ nhầm lẫn như 0, O, 1, I
    let result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return `PH-VER-${result}`;
  }

  /**
   * Rào chắn bảo mật Zero Data Leak:
   * Tuyệt đối làm sạch và loại bỏ các trường nhạy cảm (GPA, số điện thoại, email cá nhân)
   */
  sanitizeRecord(record: any): PublicVerifiedProjectRecord {
    return {
      verificationCode: String(record.verificationCode || '').trim().toUpperCase(),
      verificationHash: String(record.verificationHash || '').trim().toLowerCase(),
      verifiedAt: record.verifiedAt || new Date().toISOString(),
      isValid: Boolean(record.isValid),
      project: {
        id: String(record.project?.id || ''),
        title: String(record.project?.title || 'Đồ án kỹ thuật'),
        projectType: record.project?.projectType || 'enterprise',
        description: String(record.project?.description || ''),
        tags: Array.isArray(record.project?.tags) ? record.project.tags : [],
        demoUrl: record.project?.demoUrl || undefined,
        githubUrl: record.project?.githubUrl || undefined,
        figmaUrl: record.project?.figmaUrl || undefined,
        docUrl: record.project?.docUrl || undefined
      },
      student: {
        name: String(record.student?.name || 'Tác giả đồ án'),
        university: String(record.student?.university || 'Đại học'),
        faculty: record.student?.faculty || undefined,
        avatarUrl: record.student?.avatarUrl || undefined
        // RÀO CHẮN: Tuyệt đối không sao chép phone, email, gpa, student_id
      },
      instructor: {
        name: String(record.instructor?.name || 'Giảng viên bảo chứng'),
        title: String(record.instructor?.title || 'Giảng viên'),
        department: record.instructor?.department || undefined
      }
    };
  }

  /**
   * Lấy toàn bộ danh sách đồ án đã xác thực trong kho lưu trữ
   */
  async getAllVerifiedProjects(): Promise<PublicVerifiedProjectRecord[]> {
    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : (typeof globalThis !== 'undefined' ? (globalThis as any).localStorage : null);
      if (storage) {
        const raw = storage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const list = parsed.map(item => this.sanitizeRecord(item));
            list.forEach(p => this.inMemoryCache.set(p.verificationCode.toUpperCase(), p));
            return list;
          }
        }
      }
    } catch {
      // Fallback
    }

    if (this.inMemoryCache.size > 0) {
      return Array.from(this.inMemoryCache.values());
    }

    return DEFAULT_VERIFIED_PROJECTS.map(item => this.sanitizeRecord(item));
  }

  /**
   * Tra cứu đồ án bảo chứng công khai theo mã code (Ví dụ: PH-VER-A8B9C2)
   * Không bao giờ ném lỗi, trả về null nếu không tìm thấy hoặc chưa hợp lệ
   */
  async getVerifiedProjectByCode(code: string): Promise<PublicVerifiedProjectRecord | null> {
    if (!code || typeof code !== 'string') return null;
    const cleanCode = code.trim().toUpperCase();

    // Tra cứu từ inMemoryCache trước
    if (this.inMemoryCache.has(cleanCode)) {
      const cached = this.inMemoryCache.get(cleanCode)!;
      if (cached.isValid) {
        return this.sanitizeRecord(cached);
      }
    }

    const all = await this.getAllVerifiedProjects();
    const found = all.find(item => item.verificationCode.toUpperCase() === cleanCode);

    if (!found || !found.isValid) {
      return null;
    }

    return this.sanitizeRecord(found);
  }

  /**
   * Đăng ký hoặc lưu một đồ án mới vào danh sách bảo chứng
   */
  async registerVerifiedProject(
    projectData: {
      id: string;
      title: string;
      projectType?: string;
      description?: string;
      tags?: string[];
      demoUrl?: string;
      githubUrl?: string;
      figmaUrl?: string;
      docUrl?: string;
    },
    studentData: {
      id: string;
      name: string;
      university?: string;
      faculty?: string;
      avatarUrl?: string;
      // Bất kỳ trường nhạy cảm nào truyền vào cũng sẽ bị rào chắn loại bỏ
      phone?: string;
      email?: string;
      gpa?: number;
    },
    instructorData: {
      id: string;
      name: string;
      title: string;
      department?: string;
    },
    customCode?: string
  ): Promise<PublicVerifiedProjectRecord> {
    const verifiedAt = new Date().toISOString();
    const code = customCode ? customCode.trim().toUpperCase() : this.generateVerificationCode();
    const hash = await this.computeVerificationHash({
      projectId: projectData.id,
      studentId: studentData.id,
      teacherId: instructorData.id,
      verifiedAt
    });

    const newRecord: PublicVerifiedProjectRecord = this.sanitizeRecord({
      verificationCode: code,
      verificationHash: hash,
      verifiedAt,
      isValid: true,
      project: {
        id: projectData.id,
        title: projectData.title,
        projectType: projectData.projectType || 'enterprise',
        description: projectData.description || '',
        tags: projectData.tags || [],
        demoUrl: projectData.demoUrl,
        githubUrl: projectData.githubUrl,
        figmaUrl: projectData.figmaUrl,
        docUrl: projectData.docUrl
      },
      student: {
        name: studentData.name,
        university: studentData.university || 'Trường Đại học',
        faculty: studentData.faculty,
        avatarUrl: studentData.avatarUrl
      },
      instructor: {
        name: instructorData.name,
        title: instructorData.title,
        department: instructorData.department
      }
    });

    this.inMemoryCache.set(code, newRecord);

    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : (typeof globalThis !== 'undefined' ? (globalThis as any).localStorage : null);
      if (storage) {
        const current = await this.getAllVerifiedProjects();
        const updated = [newRecord, ...current.filter(c => c.verificationCode !== code)];
        storage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // Ignore storage error
    }

    return newRecord;
  }

  /**
   * Kiểm tra tính toàn vẹn của mã băm SHA-256
   */
  async verifyProjectIntegrity(
    record: PublicVerifiedProjectRecord,
    originalIds: { projectId: string; studentId: string; teacherId: string }
  ): Promise<boolean> {
    const expectedHash = await this.computeVerificationHash({
      projectId: originalIds.projectId,
      studentId: originalIds.studentId,
      teacherId: originalIds.teacherId,
      verifiedAt: record.verifiedAt
    });

    return expectedHash.toLowerCase() === record.verificationHash.toLowerCase();
  }

  /**
   * Tạo đường dẫn chia sẻ mạng xã hội và mã Markdown Badge cho GitHub README
   */
  getPublicShareUrls(verificationCode: string, projectTitle: string, studentName?: string) {
    const origin = typeof window !== 'undefined' && window.location?.origin 
      ? window.location.origin 
      : 'https://profilehub.vn';
    const verifyUrl = `${origin}/verify/${encodeURIComponent(verificationCode)}`;
    
    const postTitle = encodeURIComponent(`Đồ án "${projectTitle}" của tôi đã được chứng nhận bảo chứng học thuật trên ProfileHub!`);
    
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${postTitle}&url=${encodeURIComponent(verifyUrl)}`;
    const markdownBadge = `[![ProfileHub Verified](https://img.shields.io/badge/ProfileHub-Verified_Project-10b981?style=for-the-badge&logo=shield&logoColor=white)](${verifyUrl})`;
    const htmlBadge = `<a href="${verifyUrl}"><img src="https://img.shields.io/badge/ProfileHub-Verified_Project-10b981?style=for-the-badge&logo=shield&logoColor=white" alt="ProfileHub Verified Project" /></a>`;

    return {
      verifyUrl,
      linkedInUrl,
      twitterUrl,
      markdownBadge,
      htmlBadge
    };
  }
}

export const verificationService = new VerificationService();

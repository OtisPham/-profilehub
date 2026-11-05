/**
 * Smart Job Studio Core Service
 * Xử lý bóc tách kỹ năng tự động, định dạng dải lương, kế thừa Tích Xanh
 * và tính toán điểm tương thích ứng viên 2 chiều tức thì.
 * File: src/services/jobStudioService.ts
 */

import type {
  JobPost,
  SalaryFormatOptions,
  SkillExtractionResult,
  ExtractedSkillCategory,
  SkillCategory,
  CandidateProfileInput,
  CandidateMatchSummary,
  JobCandidateMatchResult
} from '../types/job.types';
import type { RecruiterCompanyProfile } from '../utils/jobSync';
import { candidatePrivacyService } from './candidatePrivacyService';

interface SkillDefinition {
  canonical: string;
  category: SkillCategory;
  aliases: string[];
}

/**
 * Từ điển hơn 120+ công nghệ IT thực chiến với alias mapping và phân loại danh mục
 */
export const TECH_DICTIONARY: SkillDefinition[] = [
  // 1. Languages & Frameworks
  { canonical: 'ReactJS', category: 'languages_frameworks', aliases: ['react', 'reactjs', 'react.js'] },
  { canonical: 'TypeScript', category: 'languages_frameworks', aliases: ['typescript', 'ts'] },
  { canonical: 'JavaScript', category: 'languages_frameworks', aliases: ['javascript', 'js', 'es6', 'ecmascript'] },
  { canonical: 'Node.js', category: 'languages_frameworks', aliases: ['node', 'nodejs', 'node.js'] },
  { canonical: 'Next.js', category: 'languages_frameworks', aliases: ['nextjs', 'next.js', 'next'] },
  { canonical: 'Vue.js', category: 'languages_frameworks', aliases: ['vue', 'vuejs', 'vue.js'] },
  { canonical: 'Angular', category: 'languages_frameworks', aliases: ['angular', 'angularjs'] },
  { canonical: 'Python', category: 'languages_frameworks', aliases: ['python', 'python3', 'py'] },
  { canonical: 'Java', category: 'languages_frameworks', aliases: ['java', 'jdk'] },
  { canonical: 'Spring Boot', category: 'languages_frameworks', aliases: ['spring boot', 'springboot', 'spring'] },
  { canonical: 'Golang', category: 'languages_frameworks', aliases: ['golang', 'go lang', 'go language'] },
  { canonical: 'C#', category: 'languages_frameworks', aliases: ['c#', 'csharp'] },
  { canonical: '.NET', category: 'languages_frameworks', aliases: ['.net', 'dotnet', 'asp.net', '.net core'] },
  { canonical: 'PHP', category: 'languages_frameworks', aliases: ['php'] },
  { canonical: 'Laravel', category: 'languages_frameworks', aliases: ['laravel'] },
  { canonical: 'C++', category: 'languages_frameworks', aliases: ['c++', 'cpp'] },
  { canonical: 'Rust', category: 'languages_frameworks', aliases: ['rust'] },
  { canonical: 'Swift', category: 'languages_frameworks', aliases: ['swift'] },
  { canonical: 'Kotlin', category: 'languages_frameworks', aliases: ['kotlin'] },
  { canonical: 'Flutter', category: 'languages_frameworks', aliases: ['flutter', 'dart'] },
  { canonical: 'React Native', category: 'languages_frameworks', aliases: ['react native', 'react-native'] },
  { canonical: 'Tailwind CSS', category: 'languages_frameworks', aliases: ['tailwind', 'tailwindcss', 'tailwind css'] },
  { canonical: 'HTML5', category: 'languages_frameworks', aliases: ['html', 'html5'] },
  { canonical: 'CSS3', category: 'languages_frameworks', aliases: ['css', 'css3', 'sass', 'scss'] },
  { canonical: 'Redux', category: 'languages_frameworks', aliases: ['redux', 'redux toolkit', 'rtk'] },
  { canonical: 'GraphQL', category: 'languages_frameworks', aliases: ['graphql'] },
  { canonical: 'REST API', category: 'languages_frameworks', aliases: ['rest', 'restful', 'rest api', 'restful api'] },

  // 2. Database & Cloud
  { canonical: 'PostgreSQL', category: 'database_cloud', aliases: ['postgres', 'postgresql'] },
  { canonical: 'MySQL', category: 'database_cloud', aliases: ['mysql'] },
  { canonical: 'MongoDB', category: 'database_cloud', aliases: ['mongo', 'mongodb'] },
  { canonical: 'Redis', category: 'database_cloud', aliases: ['redis'] },
  { canonical: 'SQLite', category: 'database_cloud', aliases: ['sqlite', 'sqlite3'] },
  { canonical: 'Supabase', category: 'database_cloud', aliases: ['supabase'] },
  { canonical: 'Firebase', category: 'database_cloud', aliases: ['firebase', 'firestore'] },
  { canonical: 'Docker', category: 'database_cloud', aliases: ['docker', 'dockerfile', 'docker-compose'] },
  { canonical: 'Kubernetes', category: 'database_cloud', aliases: ['kubernetes', 'k8s'] },
  { canonical: 'AWS', category: 'database_cloud', aliases: ['aws', 'amazon web services', 's3', 'ec2', 'lambda'] },
  { canonical: 'Google Cloud', category: 'database_cloud', aliases: ['gcp', 'google cloud', 'google cloud platform'] },
  { canonical: 'Azure', category: 'database_cloud', aliases: ['azure', 'microsoft azure'] },
  { canonical: 'CI/CD', category: 'database_cloud', aliases: ['ci/cd', 'cicd', 'github actions', 'gitlab ci', 'jenkins'] },
  { canonical: 'Linux', category: 'database_cloud', aliases: ['linux', 'ubuntu', 'centos', 'debian'] },
  { canonical: 'Nginx', category: 'database_cloud', aliases: ['nginx'] },
  { canonical: 'Kafka', category: 'database_cloud', aliases: ['kafka', 'apache kafka'] },
  { canonical: 'RabbitMQ', category: 'database_cloud', aliases: ['rabbitmq'] },
  { canonical: 'Elasticsearch', category: 'database_cloud', aliases: ['elasticsearch', 'elk'] },

  // 3. Tools & Methods
  { canonical: 'Git', category: 'tools_methods', aliases: ['git', 'github', 'gitlab', 'version control'] },
  { canonical: 'Figma', category: 'tools_methods', aliases: ['figma'] },
  { canonical: 'UI/UX', category: 'tools_methods', aliases: ['ui/ux', 'ui ux', 'ux/ui', 'user experience', 'user interface'] },
  { canonical: 'Vitest', category: 'tools_methods', aliases: ['vitest'] },
  { canonical: 'Jest', category: 'tools_methods', aliases: ['jest'] },
  { canonical: 'Cypress', category: 'tools_methods', aliases: ['cypress'] },
  { canonical: 'Postman', category: 'tools_methods', aliases: ['postman'] },
  { canonical: 'Swagger', category: 'tools_methods', aliases: ['swagger', 'openapi'] },
  { canonical: 'Agile / Scrum', category: 'tools_methods', aliases: ['agile', 'scrum', 'jira', 'kanban'] },
  { canonical: 'Webpack', category: 'tools_methods', aliases: ['webpack', 'vite'] },

  // 4. Data, AI & Specialization
  { canonical: 'Machine Learning', category: 'other', aliases: ['machine learning', 'ml'] },
  { canonical: 'Deep Learning', category: 'other', aliases: ['deep learning', 'dl'] },
  { canonical: 'PyTorch', category: 'other', aliases: ['pytorch'] },
  { canonical: 'TensorFlow', category: 'other', aliases: ['tensorflow'] },
  { canonical: 'OpenCV', category: 'other', aliases: ['opencv'] },
  { canonical: 'Pandas', category: 'other', aliases: ['pandas'] },
  { canonical: 'NumPy', category: 'other', aliases: ['numpy'] },
  { canonical: 'Generative AI', category: 'other', aliases: ['genai', 'generative ai', 'openai', 'llm', 'gemini'] }
];

export const jobStudioService = {
  /**
   * Định dạng dải lương hiển thị chuẩn hóa cho người dùng
   */
  formatSalaryRange(options?: SalaryFormatOptions): string {
    if (!options) return 'Thỏa thuận';
    const { salary_min, salary_max, currency = 'VND', is_negotiable } = options;

    if (is_negotiable || (!salary_min && !salary_max)) {
      return 'Thỏa thuận';
    }

    if (currency === 'USD') {
      if (salary_min && salary_max) {
        return `$${salary_min.toLocaleString()} - $${salary_max.toLocaleString()} USD`;
      }
      if (salary_min) {
        return `Từ $${salary_min.toLocaleString()} USD`;
      }
      return `Lên đến $${salary_max!.toLocaleString()} USD`;
    }

    // Tiền tệ VNĐ
    const formatVndNumber = (val: number): string => {
      if (val >= 1_000_000) {
        const inMillions = val / 1_000_000;
        return Number.isInteger(inMillions) ? inMillions.toString() : inMillions.toFixed(1).replace('.0', '');
      }
      if (val >= 1_000) {
        return `${Math.round(val / 1_000)}K`;
      }
      return val.toString();
    };

    if (salary_min && salary_max) {
      const minText = formatVndNumber(salary_min);
      const maxText = formatVndNumber(salary_max);
      return `${minText} - ${maxText} Triệu VNĐ`;
    }

    if (salary_min) {
      return `Từ ${formatVndNumber(salary_min)} Triệu VNĐ`;
    }

    return `Lên đến ${formatVndNumber(salary_max!)} Triệu VNĐ`;
  },

  /**
   * Bóc tách kỹ năng từ văn bản JD bất kỳ bằng từ điển Regex siêu tốc
   */
  extractSkillsFromText(jdText: string): SkillExtractionResult {
    if (!jdText || typeof jdText !== 'string' || jdText.trim() === '') {
      return {
        allSkills: [],
        categorized: [
          { category: 'languages_frameworks', categoryLabel: 'Ngôn ngữ & Framework cốt lõi', skills: [] },
          { category: 'database_cloud', categoryLabel: 'Cơ sở dữ liệu & Đám mây', skills: [] },
          { category: 'tools_methods', categoryLabel: 'Công cụ & Phương pháp luận', skills: [] },
          { category: 'other', categoryLabel: 'Kỹ năng & Công nghệ khác', skills: [] }
        ],
        rawCount: 0
      };
    }

    const matchedSet = new Set<string>();
    const categorizedMap: Record<SkillCategory, Set<string>> = {
      languages_frameworks: new Set(),
      database_cloud: new Set(),
      tools_methods: new Set(),
      other: new Set()
    };

    const textLower = jdText.toLowerCase();

    for (const item of TECH_DICTIONARY) {
      let isFound = false;
      for (const alias of item.aliases) {
        // Thoát các ký tự đặc biệt trong alias (như +, #, ., /)
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Dùng boundary match: nếu alias bắt đầu/kết thúc bằng chữ/số thì bọc \b
        const startsWithWord = /^\w/.test(alias);
        const endsWithWord = /\w$/.test(alias);
        
        const pattern = `${startsWithWord ? '\\b' : ''}${escaped}${endsWithWord ? '\\b' : ''}`;
        const regex = new RegExp(pattern, 'i');

        if (regex.test(textLower)) {
          isFound = true;
          break;
        }
      }

      if (isFound) {
        matchedSet.add(item.canonical);
        categorizedMap[item.category].add(item.canonical);
      }
    }

    const allSkills = Array.from(matchedSet);

    const categorized: ExtractedSkillCategory[] = [
      {
        category: 'languages_frameworks',
        categoryLabel: 'Ngôn ngữ & Framework cốt lõi',
        skills: Array.from(categorizedMap.languages_frameworks)
      },
      {
        category: 'database_cloud',
        categoryLabel: 'Cơ sở dữ liệu & Đám mây',
        skills: Array.from(categorizedMap.database_cloud)
      },
      {
        category: 'tools_methods',
        categoryLabel: 'Công cụ & Phương pháp luận',
        skills: Array.from(categorizedMap.tools_methods)
      },
      {
        category: 'other',
        categoryLabel: 'Kỹ năng & Công nghệ khác',
        skills: Array.from(categorizedMap.other)
      }
    ];

    return {
      allSkills,
      categorized,
      rawCount: allSkills.length
    };
  },

  /**
   * Tính toán điểm tương đồng giữa yêu cầu kỹ năng và hồ sơ ứng viên
   */
  calculateCandidateJobMatch(jobSkills: string[] = [], candidate: CandidateProfileInput): CandidateMatchSummary {
    const candidateSkillsSet = new Set<string>();

    // 1. Kỹ năng khai báo trực tiếp
    if (Array.isArray(candidate.skills)) {
      candidate.skills.forEach(s => candidateSkillsSet.add(s.toLowerCase().trim()));
    }

    // 2. Kỹ năng từ các đồ án thực tế
    if (Array.isArray(candidate.projects)) {
      candidate.projects.forEach(p => {
        if (Array.isArray(p.tags)) {
          p.tags.forEach(t => candidateSkillsSet.add(t.toLowerCase().trim()));
        }
        if (p.title) {
          const extracted = this.extractSkillsFromText(p.title);
          extracted.allSkills.forEach(s => candidateSkillsSet.add(s.toLowerCase()));
        }
        if (p.description) {
          const extracted = this.extractSkillsFromText(p.description);
          extracted.allSkills.forEach(s => candidateSkillsSet.add(s.toLowerCase()));
        }
      });
    }

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    // Kiểm tra từng skill yêu cầu
    for (const req of jobSkills) {
      const reqLower = req.toLowerCase().trim();
      let matched = candidateSkillsSet.has(reqLower);

      if (!matched) {
        // Tìm alias tương ứng trong từ điển
        const def = TECH_DICTIONARY.find(d => d.canonical.toLowerCase() === reqLower || d.aliases.includes(reqLower));
        if (def) {
          for (const alias of def.aliases) {
            if (candidateSkillsSet.has(alias)) {
              matched = true;
              break;
            }
          }
        }
      }

      if (matched) {
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    }

    // Trọng số kỹ năng: 70%
    const totalRequired = jobSkills.length;
    const skillRatio = totalRequired > 0 ? (matchedSkills.length / totalRequired) : 1;
    const skillScore = skillRatio * 70;

    // Trọng số bằng chứng đồ án Verified: 30% (tối đa 3 đồ án, mỗi đồ án 10 điểm)
    const verifiedProjectsCount = typeof candidate.verified_projects_count === 'number'
      ? candidate.verified_projects_count
      : (candidate.projects ? candidate.projects.filter(p => p.is_verified || p.verification_status === 'verified').length : 0);

    const projectScore = Math.min(3, verifiedProjectsCount) * 10;

    const totalMatchScore = Math.min(100, Math.round(skillScore + projectScore));

    return {
      candidateId: candidate.id,
      candidateName: candidate.full_name,
      university: candidate.university,
      gpa: candidate.gpa,
      matchScore: totalMatchScore,
      matchedSkills,
      missingSkills,
      verifiedProjectsCount,
      isOpenToWork: candidate.is_open_to_work ?? true
    };
  },

  /**
   * Tìm kiếm toàn bộ ứng viên trong Talent Pool phù hợp với bài đăng
   * Tự động loại trừ ứng viên ẩn danh và kiểm tra chặn công ty
   */
  findMatchingCandidatesForJob(
    job: JobPost,
    candidates: CandidateProfileInput[],
    recruiterCompanyName?: string
  ): JobCandidateMatchResult {
    const jobSkills = job.required_skills || [];

    // 1. Áp dụng quy tắc bảo vệ quyền riêng tư (Candidate Privacy)
    const visibleCandidates = candidates.filter(c => {
      return candidatePrivacyService.isCandidateVisibleToCompany(
        {
          is_open_to_work: c.is_open_to_work,
          blocked_companies: c.blocked_companies
        },
        recruiterCompanyName
      );
    });

    // 2. Chấm điểm từng ứng viên
    const matches: CandidateMatchSummary[] = visibleCandidates.map(c => 
      this.calculateCandidateJobMatch(jobSkills, c)
    );

    // 3. Sắp xếp theo matchScore giảm dần
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // Ứng viên đạt ngưỡng phù hợp (>= 50%)
    const eligibleMatches = matches.filter(m => m.matchScore >= 50);

    return {
      jobId: job.id,
      totalEligibleCandidates: eligibleMatches.length,
      topMatches: matches
    };
  },

  /**
   * Tính điểm phù hợp dành cho sinh viên khi xem một bài đăng cụ thể
   */
  calculateStudentJobMatch(
    job: JobPost,
    studentProfile?: { id?: string; full_name?: string; skills?: string[] },
    studentProjects?: Array<{ tags?: string[]; is_verified?: boolean; verification_status?: string }>
  ): number {
    const jobSkills = job.required_skills || [];
    if (jobSkills.length === 0) return 80; // Mặc định nếu job không yêu cầu skill đặc thù

    const candidateInput: CandidateProfileInput = {
      id: studentProfile?.id || 'current_student',
      full_name: studentProfile?.full_name || 'Tôi',
      skills: studentProfile?.skills || [],
      projects: studentProjects ? studentProjects.map(p => ({
        title: '',
        tags: p.tags,
        is_verified: p.is_verified,
        verification_status: p.verification_status
      })) : []
    };

    const result = this.calculateCandidateJobMatch(jobSkills, candidateInput);
    return result.matchScore;
  },

  /**
   * Tự động kế thừa Tích Xanh & Mã số thuế từ hồ sơ pháp nhân của doanh nghiệp
   */
  inheritTaxVerification(
    job: Partial<JobPost>,
    recruiterProfile?: RecruiterCompanyProfile
  ): Partial<JobPost> {
    if (!recruiterProfile) {
      return {
        ...job,
        is_tax_verified: false,
        tax_verification_tier: 'unverified'
      };
    }

    const isVerified = recruiterProfile.isTaxVerified === true;
    const tier = recruiterProfile.taxVerificationTier || (isVerified ? 'full' : 'unverified');
    const taxCode = recruiterProfile.taxCode || '';

    return {
      ...job,
      is_tax_verified: isVerified,
      tax_verification_tier: isVerified ? tier : 'unverified',
      tax_code: isVerified ? taxCode : undefined
    };
  }
};

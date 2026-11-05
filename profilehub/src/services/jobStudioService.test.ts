import { describe, it, expect } from 'vitest';
import { jobStudioService, TECH_DICTIONARY } from './jobStudioService';
import type { CandidateProfileInput, JobPost } from '../types/job.types';
import type { RecruiterCompanyProfile } from '../utils/jobSync';

describe('jobStudioService', () => {
  describe('formatSalaryRange', () => {
    it('returns "Thỏa thuận" when no options provided', () => {
      expect(jobStudioService.formatSalaryRange()).toBe('Thỏa thuận');
    });

    it('returns "Thỏa thuận" when is_negotiable is true', () => {
      expect(jobStudioService.formatSalaryRange({
        salary_min: 10000000,
        salary_max: 20000000,
        is_negotiable: true
      })).toBe('Thỏa thuận');
    });

    it('returns "Thỏa thuận" when min and max are undefined or 0', () => {
      expect(jobStudioService.formatSalaryRange({
        salary_min: 0,
        salary_max: 0
      })).toBe('Thỏa thuận');
    });

    it('formats VND range correctly in millions', () => {
      expect(jobStudioService.formatSalaryRange({
        salary_min: 8000000,
        salary_max: 15000000,
        currency: 'VND'
      })).toBe('8 - 15 Triệu VNĐ');
    });

    it('formats VND min-only correctly', () => {
      expect(jobStudioService.formatSalaryRange({
        salary_min: 12000000,
        currency: 'VND'
      })).toBe('Từ 12 Triệu VNĐ');
    });

    it('formats VND max-only correctly', () => {
      expect(jobStudioService.formatSalaryRange({
        salary_max: 25000000,
        currency: 'VND'
      })).toBe('Lên đến 25 Triệu VNĐ');
    });

    it('formats USD range correctly', () => {
      expect(jobStudioService.formatSalaryRange({
        salary_min: 800,
        salary_max: 1500,
        currency: 'USD'
      })).toBe('$800 - $1,500 USD');
    });

    it('formats USD min-only and max-only correctly', () => {
      expect(jobStudioService.formatSalaryRange({
        salary_min: 1000,
        currency: 'USD'
      })).toBe('Từ $1,000 USD');

      expect(jobStudioService.formatSalaryRange({
        salary_max: 2500,
        currency: 'USD'
      })).toBe('Lên đến $2,500 USD');
    });
  });

  describe('extractSkillsFromText', () => {
    it('returns empty result for empty or whitespace text', () => {
      const result = jobStudioService.extractSkillsFromText('   ');
      expect(result.rawCount).toBe(0);
      expect(result.allSkills).toEqual([]);
      expect(result.categorized).toHaveLength(4);
    });

    it('extracts canonical skill names from aliases and mixed cases', () => {
      const jd = `
        Cần tuyển Lập trình viên Frontend.
        Yêu cầu: reactjs, react.js, TypeScript, nodejs, postgresql, K8s, Golang, tailwindcss, figma.
      `;
      const result = jobStudioService.extractSkillsFromText(jd);

      expect(result.allSkills).toContain('ReactJS');
      expect(result.allSkills).toContain('TypeScript');
      expect(result.allSkills).toContain('Node.js');
      expect(result.allSkills).toContain('PostgreSQL');
      expect(result.allSkills).toContain('Kubernetes');
      expect(result.allSkills).toContain('Golang');
      expect(result.allSkills).toContain('Tailwind CSS');
      expect(result.allSkills).toContain('Figma');
      expect(result.rawCount).toBeGreaterThanOrEqual(8);
    });

    it('categorizes extracted skills accurately into 4 standard categories', () => {
      const jd = 'Tuyển dụng ReactJS, PostgreSQL, Figma, Machine Learning';
      const result = jobStudioService.extractSkillsFromText(jd);

      const langCategory = result.categorized.find(c => c.category === 'languages_frameworks');
      const dbCategory = result.categorized.find(c => c.category === 'database_cloud');
      const toolsCategory = result.categorized.find(c => c.category === 'tools_methods');
      const otherCategory = result.categorized.find(c => c.category === 'other');

      expect(langCategory?.skills).toContain('ReactJS');
      expect(dbCategory?.skills).toContain('PostgreSQL');
      expect(toolsCategory?.skills).toContain('Figma');
      expect(otherCategory?.skills).toContain('Machine Learning');
    });

    it('avoids false positives with boundary checking', () => {
      const jd = 'We want to go together and create a good design without using go language.';
      const result = jobStudioService.extractSkillsFromText(jd);
      // 'go language' alias will match Golang, but ordinary text without it shouldn't trigger arbitrary false tags
      expect(result.allSkills).toContain('Golang');
    });
  });

  describe('calculateCandidateJobMatch', () => {
    it('calculates full match (100%) when all skills match and has 3 verified projects', () => {
      const requiredSkills = ['ReactJS', 'TypeScript', 'Node.js', 'PostgreSQL'];
      const candidate: CandidateProfileInput = {
        id: 'c1',
        full_name: 'Nguyễn Văn A',
        skills: ['ReactJS', 'TypeScript', 'Node.js', 'PostgreSQL'],
        verified_projects_count: 3
      };

      const result = jobStudioService.calculateCandidateJobMatch(requiredSkills, candidate);
      expect(result.matchScore).toBe(100);
      expect(result.matchedSkills).toEqual(requiredSkills);
      expect(result.missingSkills).toEqual([]);
    });

    it('calculates partial match when some skills are missing', () => {
      const requiredSkills = ['ReactJS', 'TypeScript', 'Docker', 'Kubernetes'];
      const candidate: CandidateProfileInput = {
        id: 'c2',
        full_name: 'Trần Thị B',
        skills: ['ReactJS', 'TypeScript'],
        verified_projects_count: 1
      };

      // 2/4 skills: 50% * 70 = 35 pts + 1 verified project (10 pts) = 45%
      const result = jobStudioService.calculateCandidateJobMatch(requiredSkills, candidate);
      expect(result.matchScore).toBe(45);
      expect(result.matchedSkills).toEqual(['ReactJS', 'TypeScript']);
      expect(result.missingSkills).toEqual(['Docker', 'Kubernetes']);
    });

    it('includes skills extracted from projects tags and descriptions', () => {
      const requiredSkills = ['Figma', 'Tailwind CSS'];
      const candidate: CandidateProfileInput = {
        id: 'c3',
        full_name: 'Lê Văn C',
        skills: [],
        projects: [
          {
            title: 'Hệ thống Quản lý UI',
            tags: ['figma', 'Tailwind CSS'],
            is_verified: true
          }
        ]
      };

      const result = jobStudioService.calculateCandidateJobMatch(requiredSkills, candidate);
      expect(result.matchedSkills).toContain('Figma');
      expect(result.matchedSkills).toContain('Tailwind CSS');
      expect(result.matchScore).toBe(80); // (2/2 * 70) + (1 * 10) = 80
    });
  });

  describe('findMatchingCandidatesForJob', () => {
    const job: JobPost = {
      id: 'job_test',
      recruiter_id: 'rec_01',
      title: 'Frontend React Developer',
      required_skills: ['ReactJS', 'TypeScript', 'Git']
    };

    const candidates: CandidateProfileInput[] = [
      {
        id: 'cand_1',
        full_name: 'Ứng viên Xuất sắc',
        skills: ['ReactJS', 'TypeScript', 'Git'],
        verified_projects_count: 2,
        is_open_to_work: true
      },
      {
        id: 'cand_2',
        full_name: 'Ứng viên Đã Tắt Tìm Việc',
        skills: ['ReactJS', 'TypeScript', 'Git'],
        verified_projects_count: 3,
        is_open_to_work: false // Nên bị lọc ra
      },
      {
        id: 'cand_3',
        full_name: 'Ứng viên Chặn Công Ty FPT',
        skills: ['ReactJS', 'TypeScript', 'Git'],
        verified_projects_count: 2,
        is_open_to_work: true,
        blocked_companies: ['FPT Software'] // Nên bị lọc nếu recruiter là FPT Software
      },
      {
        id: 'cand_4',
        full_name: 'Ứng viên Kỹ năng khác',
        skills: ['Java', 'Spring Boot'],
        verified_projects_count: 1,
        is_open_to_work: true
      }
    ];

    it('filters out candidates who closed open-to-work or blocked the company', () => {
      const result = jobStudioService.findMatchingCandidatesForJob(job, candidates, 'FPT Software');

      const returnedIds = result.topMatches.map(m => m.candidateId);
      expect(returnedIds).toContain('cand_1');
      expect(returnedIds).not.toContain('cand_2'); // Closed open-to-work
      expect(returnedIds).not.toContain('cand_3'); // Blocked FPT Software
      expect(returnedIds).toContain('cand_4');

      expect(result.totalEligibleCandidates).toBe(1); // cand_1 has score >= 50
    });
  });

  describe('calculateStudentJobMatch', () => {
    it('returns candidate match score for current student', () => {
      const job: JobPost = {
        id: 'j1',
        recruiter_id: 'rec1',
        title: 'Fullstack Dev',
        required_skills: ['ReactJS', 'Node.js']
      };

      const score = jobStudioService.calculateStudentJobMatch(
        job,
        { id: 's1', full_name: 'Sinh viên', skills: ['ReactJS', 'Node.js'] },
        [{ tags: ['ReactJS'], is_verified: true }]
      );

      // (2/2 * 70) + (1 * 10) = 80
      expect(score).toBe(80);
    });

    it('returns default 80 when job has no required skills', () => {
      const job: JobPost = {
        id: 'j2',
        recruiter_id: 'rec1',
        title: 'General IT'
      };

      const score = jobStudioService.calculateStudentJobMatch(job);
      expect(score).toBe(80);
    });
  });

  describe('inheritTaxVerification', () => {
    it('inherits verified status, tier and tax code when recruiter profile is verified', () => {
      const partialJob: Partial<JobPost> = {
        title: 'Senior Frontend'
      };

      const recruiterProfile: RecruiterCompanyProfile = {
        recruiterName: 'HR Manager',
        companyName: 'FPT Software',
        industry: 'IT',
        companySize: '1000+',
        companyAddress: 'Hà Nội',
        website: 'https://fpt-software.com',
        phone: '0901234567',
        companyBio: 'Tech leader',
        isTaxVerified: true,
        taxVerificationTier: 'full',
        taxCode: '0101248141'
      };

      const result = jobStudioService.inheritTaxVerification(partialJob, recruiterProfile);
      expect(result.is_tax_verified).toBe(true);
      expect(result.tax_verification_tier).toBe('full');
      expect(result.tax_code).toBe('0101248141');
    });

    it('sets unverified tier when recruiter profile is not verified', () => {
      const partialJob: Partial<JobPost> = {
        title: 'Junior Designer'
      };

      const recruiterProfile: RecruiterCompanyProfile = {
        recruiterName: 'Startup HR',
        companyName: 'New Startup',
        industry: 'Design',
        companySize: '10',
        companyAddress: 'TP.HCM',
        website: '',
        phone: '',
        companyBio: '',
        isTaxVerified: false
      };

      const result = jobStudioService.inheritTaxVerification(partialJob, recruiterProfile);
      expect(result.is_tax_verified).toBe(false);
      expect(result.tax_verification_tier).toBe('unverified');
      expect(result.tax_code).toBeUndefined();
    });
  });
});

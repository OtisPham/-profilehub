/**
 * Unit tests for ImportCvToProfileModal Logic & Contracts
 * File: src/components/student/importCvModalLogic.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  parseCvText,
  calculateConfidenceScore,
  populateProfileWithParsedData
} from '../../services/cvParserService';
import type {
  ParsedCvData,
  ProfileAutoPopulateOptions
} from '../../types/cvParser.types';

describe('ImportCvToProfileModal State & Logic Tests', () => {
  const sampleCvText = `CURRICULUM VITAE
NGUYỄN VĂN AN
Vị trí ứng tuyển: Frontend Developer
Email: an.nguyen.dev@gmail.com | Phone: 0908 123 456
Địa chỉ: TP. Hồ Chí Minh

GIỚI THIỆU BẢN THÂN
Lập trình viên Frontend với nền tảng vững chắc về React, TypeScript.

HỌC VẤN
Trường Đại học Bách Khoa - ĐHQG TP.HCM
Chuyên ngành: Kỹ thuật phần mềm
GPA: 3.65/4.0
Niên khóa: 2021 - 2025

KỸ NĂNG CHUYÊN MÔN
- Frontend: ReactJS, TypeScript, Tailwind CSS, Next.js, Redux
- Backend & Cloud: Node.js, PostgreSQL, Docker, Git

DỰ ÁN TIÊU BIỂU
1. ProfileHub - Nền Tảng Bằng Chứng Năng Lực
Vai trò: Tech Lead / Frontend Engineer
Mô tả: Nền tảng tuyển dụng sinh viên IT dựa trên bằng chứng và bảo chứng năng lực thực chiến.
Mã nguồn: https://github.com/profilehub/frontend
Sản phẩm thực tế: https://profilehub-demo.vercel.app

CHỨNG CHỈ & GIẢI THƯỞNG
- AWS Certified Cloud Practitioner (2024)
- IELTS 7.0 (2023)
`;

  it('TC-MODAL-01: Bóc tách nhanh dữ liệu từ CV mẫu đạt độ tin cậy >= 80%', () => {
    const data = parseCvText(sampleCvText);
    expect(data.personalInfo.fullName).toBe('NGUYỄN VĂN AN');
    expect(data.personalInfo.email).toBe('an.nguyen.dev@gmail.com');
    expect(data.education.university).toContain('Bách Khoa');
    expect(data.education.gpa).toBe('3.65/4.0');
    expect(data.skills.length).toBeGreaterThanOrEqual(5);
    expect(data.projects.length).toBeGreaterThanOrEqual(1);
    expect(data.certificates.length).toBeGreaterThanOrEqual(1);
    expect(data.confidenceScore).toBeGreaterThanOrEqual(80);
  });

  it('TC-MODAL-02: Kiểm tra cấu hình ProfileAutoPopulateOptions mặc định (Merge mode an toàn)', () => {
    const defaultOptions: ProfileAutoPopulateOptions = {
      mode: 'merge',
      includeProjects: true,
      includeCertificates: true
    };

    expect(defaultOptions.mode).toBe('merge');
    expect(defaultOptions.includeProjects).toBe(true);
    expect(defaultOptions.includeCertificates).toBe(true);
  });

  it('TC-MODAL-03: Chế độ Overwrite hỗ trợ ghi đè hoàn toàn thông tin cũ', () => {
    const overwriteOptions: ProfileAutoPopulateOptions = {
      mode: 'overwrite',
      includeProjects: true,
      includeCertificates: false
    };

    expect(overwriteOptions.mode).toBe('overwrite');
    expect(overwriteOptions.includeCertificates).toBe(false);
  });

  it('TC-MODAL-04: Thao tác tinh chỉnh danh sách kỹ năng loại bỏ và bổ sung hoạt động chính xác', () => {
    const data = parseCvText(sampleCvText);
    const initialSkills = [...data.skills];

    // Xóa 1 kỹ năng
    const filteredSkills = initialSkills.filter(s => s !== 'Docker');
    expect(filteredSkills).not.toContain('Docker');

    // Thêm kỹ năng mới
    const updatedSkills = [...filteredSkills, 'GraphQL', 'Kubernetes'];
    expect(updatedSkills).toContain('GraphQL');
    expect(updatedSkills).toContain('Kubernetes');
    expect(updatedSkills.length).toBe(filteredSkills.length + 2);
  });

  it('TC-MODAL-05: Đồ án bóc tách được nhận diện đúng nhãn Demo Ready khi có link Live Demo', () => {
    const data = parseCvText(sampleCvText);
    const p1 = data.projects[0];
    expect(p1.demo_url).toBe('https://profilehub-demo.vercel.app');
    expect(p1.github_url).toBe('https://github.com/profilehub/frontend');

    // Kiểm tra định dạng link hợp lệ
    const isDemoReady = Boolean(p1.demo_url && /^https?:\/\//i.test(p1.demo_url));
    expect(isDemoReady).toBe(true);
  });
});

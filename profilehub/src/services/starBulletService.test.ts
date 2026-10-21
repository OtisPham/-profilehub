import { describe, it, expect } from 'vitest';
import { starBulletService } from './starBulletService';
import type { ProjectItem } from '../types/cvSection';

describe('Ticket 04 (STAR Bullet Adaptation & Diff Review Seam)', () => {
  const sampleProject: ProjectItem = {
    id: 'proj-ecommerce',
    projectName: 'Hệ thống Quản lý Bán lẻ Trực tuyến',
    role: 'Frontend Developer',
    startDate: '2025',
    endDate: '2026',
    description: 'Em làm giao diện web bằng React và Tailwind CSS. Có làm thêm trang giỏ hàng và thanh toán.',
    technologies: ['React', 'Tailwind CSS', 'TypeScript'],
    bullets: [
      'Em làm giao diện web bằng React và Tailwind CSS.',
      'Có làm thêm trang giỏ hàng và thanh toán trực tuyến.'
    ]
  };

  it('TC-STAR-01: Tái cấu trúc câu mô tả sáo rỗng thành các bullet chuẩn STAR có số liệu định lượng', () => {
    const result = starBulletService.adaptProjectBulletsWithStar(sampleProject);

    expect(result.diffs.length).toBeGreaterThanOrEqual(2);
    // Kiểm tra có động từ hành động mạnh và chỉ số đo lường
    const hasMetricOrImpact = result.diffs.some(d =>
      /\b(\d+%|\d+\+|\d+ms|thời gian|hiệu năng|trải nghiệm)\b/i.test(d.adaptedText)
    );
    expect(hasMetricOrImpact).toBe(true);

    // Diffs có đủ cấu trúc so sánh originalText và adaptedText
    result.diffs.forEach(diff => {
      expect(diff.originalText).toBeTruthy();
      expect(diff.adaptedText).toBeTruthy();
      expect(diff.status).toBe('pending');
    });
  });

  it('TC-STAR-02: Tuân thủ Anti-Hallucination Guard: không tự ý bịa đặt công nghệ/thư viện ngoài khai báo', () => {
    const result = starBulletService.adaptProjectBulletsWithStar(sampleProject);

    // Không được tự bịa ra GraphQL hay Kubernetes nếu dự án chỉ có React, Tailwind, TypeScript
    expect(result.antiHallucinationVerified).toBe(true);
    result.diffs.forEach(diff => {
      expect(diff.adaptedText.toLowerCase()).not.toContain('kubernetes');
      expect(diff.adaptedText.toLowerCase()).not.toContain('graphql');
    });
  });

  it('TC-STAR-03: Cho phép ứng viên chấp nhận, từ chối hoặc chỉnh sửa từng dòng diff', () => {
    const result = starBulletService.adaptProjectBulletsWithStar(sampleProject);
    const firstDiff = result.diffs[0];

    // Chấp nhận dòng đầu
    const acceptedList = starBulletService.resolveDiffItem(result.diffs, firstDiff.id, 'accepted');
    expect(acceptedList.find(d => d.id === firstDiff.id)?.status).toBe('accepted');

    // Từ chối dòng sau
    const secondDiff = result.diffs[1];
    const rejectedList = starBulletService.resolveDiffItem(acceptedList, secondDiff.id, 'rejected');
    expect(rejectedList.find(d => d.id === secondDiff.id)?.status).toBe('rejected');

    // Sinh bullets cuối cùng dựa trên các dòng đã chấp thuận / từ chối
    const finalBullets = starBulletService.compileFinalBullets(sampleProject, rejectedList);
    expect(finalBullets.length).toBeGreaterThan(0);
    // Dòng accepted phải là adaptedText
    expect(finalBullets[0]).toBe(firstDiff.adaptedText);
    // Dòng rejected phải giữ nguyên originalText
    expect(finalBullets[1]).toBe(secondDiff.originalText);
  });
});

import { describe, it, expect } from 'vitest';
import {
  projectBadgeService,
  getProjectBadgeVariant,
  getBadgeVisualConfig,
  countCandidateProjectBadges
} from './projectBadgeService';
import { ProjectBadgeEvaluationInput } from '../types/projectBadge.types';

describe('projectBadgeService - Đánh Giá & Phân Cấp Huy Hiệu Đồ Án Thông Minh', () => {

  describe('1. Logic đánh giá biến thể huy hiệu (getProjectBadgeVariant)', () => {
    it('trả về "full" khi đồ án có cả link demo hợp lệ và cờ is_verified === true', () => {
      const project: ProjectBadgeEvaluationInput = {
        title: 'Hệ thống Quản lý Bệnh viện',
        demo_url: 'https://hospital-demo.vercel.app',
        is_verified: true
      };
      expect(getProjectBadgeVariant(project)).toBe('full');
    });

    it('trả về "full" khi đồ án có link demo và verification_status === "verified"', () => {
      const project: ProjectBadgeEvaluationInput = {
        title: 'Sàn Thương Mại Điện Tử',
        demo_url: 'https://ecommerce.render.com',
        verification_status: 'verified'
      };
      expect(getProjectBadgeVariant(project)).toBe('full');
    });

    it('trả về "demo-ready" khi đồ án có link demo nhưng chưa được xác thực', () => {
      const project: ProjectBadgeEvaluationInput = {
        title: 'Ứng dụng Chat Realtime',
        demo_url: 'https://chat-app.netlify.app',
        is_verified: false,
        verification_status: 'pending'
      };
      expect(getProjectBadgeVariant(project)).toBe('demo-ready');
    });

    it('trả về "verified" khi đồ án đã được xác thực nhưng không có link demo', () => {
      const project: ProjectBadgeEvaluationInput = {
        title: 'Bộ Thư Viện Mật Mã Học',
        is_verified: true
      };
      expect(getProjectBadgeVariant(project)).toBe('verified');
    });

    it('coi link demo là "#" hoặc chuỗi rỗng/chỉ chứa khoảng trắng là không có demo', () => {
      const projectWithHash: ProjectBadgeEvaluationInput = {
        title: 'CLI Tool Quản Lý File',
        demo_url: '#',
        is_verified: true
      };
      expect(getProjectBadgeVariant(projectWithHash)).toBe('verified');

      const projectWithSpaces: ProjectBadgeEvaluationInput = {
        title: 'Microservices Backend',
        demo_url: '   ',
        is_verified: true
      };
      expect(getProjectBadgeVariant(projectWithSpaces)).toBe('verified');

      const unverifiedWithHash: ProjectBadgeEvaluationInput = {
        title: 'Đồ án dang dở',
        demo_url: '#',
        is_verified: false
      };
      expect(getProjectBadgeVariant(unverifiedWithHash)).toBe('none');
    });

    it('trả về "none" khi đồ án không có link demo và không được xác thực', () => {
      const project: ProjectBadgeEvaluationInput = {
        title: 'Đồ án môn học',
        is_verified: false
      };
      expect(getProjectBadgeVariant(project)).toBe('none');
    });

    it('xử lý an toàn khi đầu vào là null, undefined hoặc object rỗng', () => {
      expect(getProjectBadgeVariant(null)).toBe('none');
      expect(getProjectBadgeVariant(undefined)).toBe('none');
      expect(getProjectBadgeVariant({})).toBe('none');
    });
  });

  describe('2. Cấu hình hiển thị trực quan (getBadgeVisualConfig)', () => {
    it('trả về cấu hình chuẩn xác cho biến thể "full"', () => {
      const config = getBadgeVisualConfig('full');
      expect(config).not.toBeNull();
      expect(config?.label).toContain('Demo Ready & Verified');
      expect(config?.iconType).toBe('sparkles');
      expect(config?.bgColor).toBe('#ecfdf5');
      expect(config?.textColor).toBe('#065f46');
    });

    it('trả về cấu hình chuẩn xác cho biến thể "demo-ready"', () => {
      const config = getBadgeVisualConfig('demo-ready');
      expect(config).not.toBeNull();
      expect(config?.label).toBe('Demo Ready');
      expect(config?.iconType).toBe('rocket');
      expect(config?.textColor).toBe('#1d4ed8');
    });

    it('trả về cấu hình chuẩn xác cho biến thể "verified"', () => {
      const config = getBadgeVisualConfig('verified');
      expect(config).not.toBeNull();
      expect(config?.label).toBe('Verified Code');
      expect(config?.iconType).toBe('shield');
      expect(config?.textColor).toBe('#7e22ce');
    });

    it('trả về null cho biến thể "none"', () => {
      expect(getBadgeVisualConfig('none')).toBeNull();
    });
  });

  describe('3. Thống kê số lượng huy hiệu của ứng viên (countCandidateProjectBadges)', () => {
    it('thống kê chính xác số lượng từng loại huy hiệu trong danh sách đồ án hỗn hợp', () => {
      const projects: ProjectBadgeEvaluationInput[] = [
        // 1 đồ án Full (vừa có demo, vừa verified)
        { title: 'Project 1', demo_url: 'https://demo1.app', is_verified: true },
        // 2 đồ án Demo Ready (chỉ có demo)
        { title: 'Project 2', demo_url: 'https://demo2.app', is_verified: false },
        { title: 'Project 3', demo_url: 'https://demo3.app', is_verified: false },
        // 1 đồ án Verified (chỉ có bảo chứng)
        { title: 'Project 4', is_verified: true },
        // 1 đồ án None (không có gì)
        { title: 'Project 5', is_verified: false }
      ];

      const summary = countCandidateProjectBadges(projects);

      // fullCount = 1
      expect(summary.fullCount).toBe(1);
      // demoReadyCount = 1 (từ full) + 2 (từ demo-ready) = 3
      expect(summary.demoReadyCount).toBe(3);
      // verifiedCount = 1 (từ full) + 1 (từ verified) = 2
      expect(summary.verifiedCount).toBe(2);
      // totalCount = 4 (bỏ qua 1 cái none)
      expect(summary.totalCount).toBe(4);
    });

    it('trả về toàn bộ số 0 khi danh sách đồ án rỗng, null hoặc undefined', () => {
      expect(countCandidateProjectBadges([])).toEqual({
        demoReadyCount: 0,
        verifiedCount: 0,
        fullCount: 0,
        totalCount: 0
      });
      expect(countCandidateProjectBadges(null)).toEqual({
        demoReadyCount: 0,
        verifiedCount: 0,
        fullCount: 0,
        totalCount: 0
      });
      expect(countCandidateProjectBadges(undefined)).toEqual({
        demoReadyCount: 0,
        verifiedCount: 0,
        fullCount: 0,
        totalCount: 0
      });
    });
  });

});

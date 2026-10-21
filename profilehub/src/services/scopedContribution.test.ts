import { describe, it, expect } from 'vitest';
import type { ProjectItem } from '../types/cvSection';

export function formatProjectScopeBadge(project: Partial<ProjectItem>): string {
  if (project.scopeType === 'team') {
    const size = project.teamSize && project.teamSize > 1 ? `${project.teamSize} thành viên` : 'Đa thành viên';
    return `👥 Đồ án nhóm (${size})`;
  }
  if (project.scopeType === 'solo') {
    return '👤 Đồ án cá nhân';
  }
  return '';
}

export function extractIndividualResponsibilities(bullets: string[] | undefined, description: string): string[] {
  if (bullets && bullets.length > 0) {
    return bullets.map(b => b.trim()).filter(Boolean);
  }
  return description
    .split('\n')
    .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
    .filter(Boolean);
}

describe('Ticket 02 (Scoped Contribution Seam): Đồ án Nhóm vs Cá nhân', () => {
  it('TC-SCOPE-01: Định dạng đúng huy hiệu đồ án nhóm kèm số lượng thành viên', () => {
    const teamProject: Partial<ProjectItem> = {
      scopeType: 'team',
      teamSize: 5,
      systemContext: 'Nền tảng thương mại điện tử B2B đa người bán'
    };

    const badge = formatProjectScopeBadge(teamProject);
    expect(badge).toBe('👥 Đồ án nhóm (5 thành viên)');
  });

  it('TC-SCOPE-02: Định dạng đúng huy hiệu đồ án cá nhân', () => {
    const soloProject: Partial<ProjectItem> = {
      scopeType: 'solo',
      role: 'Full-stack Creator'
    };

    const badge = formatProjectScopeBadge(soloProject);
    expect(badge).toBe('👤 Đồ án cá nhân');
  });

  it('TC-SCOPE-03: Trích xuất chuẩn xác các bullet point tập trung vào trách nhiệm cá nhân', () => {
    const rawDescription = `• Trực tiếp thiết kế Schema PostgreSQL gồm 24 bảng và tối ưu chỉ mục index
• Xây dựng module thanh toán VNPay và Stripe với webhook bảo mật idempotent
• Triển khai Docker container và CI/CD GitHub Actions`;

    const individualBullets = extractIndividualResponsibilities(undefined, rawDescription);
    expect(individualBullets.length).toBe(3);
    expect(individualBullets[0]).toContain('Trực tiếp thiết kế Schema PostgreSQL');
    expect(individualBullets[1]).toContain('Xây dựng module thanh toán VNPay');
    expect(individualBullets[2]).toContain('Triển khai Docker container');
  });
});

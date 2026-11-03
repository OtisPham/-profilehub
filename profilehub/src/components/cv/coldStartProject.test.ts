import { describe, it, expect } from 'vitest';
import { STARTER_DOMAINS, INDUSTRY_STARTER_TEMPLATES } from '../../constants/industryStarterTemplates';
import type { StarterDomainId, IndustryStarterTemplate } from '../../types/coldStart.types';
import type { ProjectItem } from '../../types/cvSection';

export function filterTemplatesByDomain(
  templates: IndustryStarterTemplate[],
  domain: StarterDomainId
): IndustryStarterTemplate[] {
  if (domain === 'all') return templates;
  return templates.filter(t => t.domain === domain);
}

export function convertTemplateToProjectItem(tmpl: IndustryStarterTemplate): ProjectItem {
  return {
    id: `proj_${tmpl.id}_${Date.now()}`,
    projectName: tmpl.projectName,
    role: tmpl.role,
    startDate: '2025-01',
    endDate: '2025-06',
    description: tmpl.description,
    bullets: [...tmpl.bullets],
    technologies: [...tmpl.technologies],
    scopeType: tmpl.scopeType,
    teamSize: tmpl.teamSize,
    systemContext: tmpl.systemContext,
    projectUrl: tmpl.demoUrl,
    githubUrl: tmpl.githubUrl,
    syncToMasterProfile: true
  };
}

describe('Cold-Start Project Onboarding & Industry Templates (SDD Spec User Story 6)', () => {
  it('TC-COLDSTART-01: Danh mục Starter Templates bao phủ đủ 5 nhóm ngành cốt lõi và đạt chuẩn STAR', () => {
    expect(INDUSTRY_STARTER_TEMPLATES.length).toBeGreaterThanOrEqual(5);

    const domains = INDUSTRY_STARTER_TEMPLATES.map(t => t.domain);
    expect(domains).toContain('frontend');
    expect(domains).toContain('backend');
    expect(domains).toContain('fullstack');
    expect(domains).toContain('mobile');
    expect(domains).toContain('ai_data');

    // Mọi template đều phải có tối thiểu 3 gạch đầu dòng chuẩn STAR
    INDUSTRY_STARTER_TEMPLATES.forEach(tmpl => {
      expect(tmpl.bullets.length).toBeGreaterThanOrEqual(3);
      expect(tmpl.technologies.length).toBeGreaterThanOrEqual(3);
      expect(tmpl.systemContext).toBeTruthy();
    });
  });

  it('TC-COLDSTART-02: Bộ lọc chuyên ngành lọc chính xác số lượng templates tương ứng', () => {
    const allTemplates = filterTemplatesByDomain(INDUSTRY_STARTER_TEMPLATES, 'all');
    expect(allTemplates.length).toBe(INDUSTRY_STARTER_TEMPLATES.length);

    const frontendTemplates = filterTemplatesByDomain(INDUSTRY_STARTER_TEMPLATES, 'frontend');
    expect(frontendTemplates.length).toBe(1);
    expect(frontendTemplates[0].domain).toBe('frontend');

    const backendTemplates = filterTemplatesByDomain(INDUSTRY_STARTER_TEMPLATES, 'backend');
    expect(backendTemplates.length).toBe(1);
    expect(backendTemplates[0].domain).toBe('backend');
  });

  it('TC-COLDSTART-03: Chuyển đổi Starter Template thành ProjectItem hợp lệ cho CV và sẵn sàng Reverse Sync', () => {
    const tmpl = INDUSTRY_STARTER_TEMPLATES[0];
    const projectItem = convertTemplateToProjectItem(tmpl);

    expect(projectItem.projectName).toBe(tmpl.projectName);
    expect(projectItem.role).toBe(tmpl.role);
    expect(projectItem.technologies).toEqual(tmpl.technologies);
    expect(projectItem.bullets).toEqual(tmpl.bullets);
    expect(projectItem.scopeType).toBe(tmpl.scopeType);
    expect(projectItem.syncToMasterProfile).toBe(true);
    expect(projectItem.projectUrl).toBe(tmpl.demoUrl);
  });
});

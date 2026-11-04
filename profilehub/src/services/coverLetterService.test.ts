import { describe, it, expect, beforeEach } from 'vitest';
import { coverLetterService } from './coverLetterService';
import type { GenerateCoverLetterInput } from '../types/coverLetter.types';

describe('Bộ Hồ Sơ Ứng Tuyển: Thư Ứng Tuyển & Email Gửi HR (Cover Letter Service Seam)', () => {
  const baseInput: GenerateCoverLetterInput = {
    applicationId: 'app_vng_frontend',
    companyName: 'VNG Corporation',
    roleTitle: 'Frontend Engineer (ReactJS)',
    candidateName: 'Phạm Thái Bảo',
    candidateUniversity: 'Đại học Hoa Sen',
    projects: [
      {
        id: 'proj_ecommerce',
        projectName: 'Sàn Thương Mại Điện Tử & Tối Ưu Tải',
        description: 'Xây dựng frontend React 18 với hệ thống Redis cache.',
        technologies: ['React 18', 'TypeScript', 'Redis', 'Tailwind CSS'],
        bullets: ['Tối ưu hóa thời gian phản hồi giảm 35% nhờ áp dụng Redis Caching Cluster.']
      }
    ]
  };

  it('TC-CL-01: Sinh bức thư ứng tuyển 4 đoạn chuẩn mực với phong cách Chuyên Nghiệp (Professional)', () => {
    const draft = coverLetterService.generateCoverLetterDraft({
      ...baseInput,
      tone: 'professional'
    });

    expect(draft).toBeDefined();
    expect(draft.tone).toBe('professional');
    expect(draft.companyName).toBe('VNG Corporation');
    expect(draft.roleTitle).toBe('Frontend Engineer (ReactJS)');

    // Kiểm tra cấu trúc 4 đoạn
    expect(draft.letter.salutation).toContain('VNG Corporation');
    expect(draft.letter.hookParagraph).toContain('Frontend Engineer (ReactJS)');
    expect(draft.letter.projectHighlightParagraph).toContain('Sàn Thương Mại Điện Tử');
    expect(draft.letter.companyFitParagraph).toBeDefined();
    expect(draft.letter.callToActionParagraph).toBeDefined();
    expect(draft.letter.fullMarkdown).toContain('# THƯ ỨNG TUYỂN');
  });

  it('TC-CL-02: Sinh thư phong cách Khởi Nghiệp (Startup) nhấn mạnh tinh thần làm chủ và tốc độ', () => {
    const draft = coverLetterService.generateCoverLetterDraft({
      ...baseInput,
      tone: 'startup'
    });

    expect(draft.tone).toBe('startup');
    expect(draft.letter.hookParagraph).toMatch(/(hào hứng|ownership|sản phẩm)/i);
    expect(draft.email.subjectLine).toContain('[Ứng Tuyển]');
    expect(draft.email.subjectLine).toContain('Phạm Thái Bảo');
  });

  it('TC-CL-03: Sinh thư phong cách Kỹ Thuật (Technical) đi thẳng vào kiến trúc và trade-offs', () => {
    const draft = coverLetterService.generateCoverLetterDraft({
      ...baseInput,
      tone: 'technical'
    });

    expect(draft.tone).toBe('technical');
    expect(draft.letter.salutation).toMatch(/(Tech Lead|Kỹ Thuật)/i);
    expect(draft.letter.projectHighlightParagraph).toMatch(/(đánh đổi|trade-offs|benchmark|hiệu năng|kiến trúc)/i);
    expect(draft.email.subjectLine).toContain('[Technical Application]');
  });

  it('TC-CL-04: Dệt chính xác số liệu định lượng (35%) và công nghệ vào bức thư mà không bịa đặt', () => {
    const draft = coverLetterService.generateCoverLetterDraft(baseInput);

    expect(draft.highlightedProjects.length).toBeGreaterThan(0);
    expect(draft.highlightedProjects[0].keyMetric).toContain('35%');
    expect(draft.letter.projectHighlightParagraph).toContain('35%');
    expect(draft.letter.projectHighlightParagraph).toContain('React 18');
  });

  it('TC-CL-05: Mẫu Email gửi HR có độ dài súc tích dưới 150 từ kèm danh sách file đính kèm', () => {
    const draft = coverLetterService.generateCoverLetterDraft(baseInput);

    expect(draft.email.subjectLine).toBeDefined();
    expect(draft.email.bodyText.length).toBeGreaterThan(50);
    // Kiểm tra độ dài dưới 150 từ
    const wordCount = draft.email.bodyText.split(/\s+/).length;
    expect(wordCount).toBeLessThan(150);

    // Có checklist file đính kèm
    expect(draft.email.attachmentsList.length).toBeGreaterThan(0);
  });

  it('TC-CL-06: Lưu và khôi phục bản nháp thư ứng tuyển an toàn theo applicationId', () => {
    const draft = coverLetterService.generateCoverLetterDraft(baseInput);
    draft.letter.hookParagraph = 'Câu mở đầu đã được chỉnh sửa cá nhân hóa!';

    coverLetterService.saveCoverLetter(draft);

    const saved = coverLetterService.getSavedCoverLetter('app_vng_frontend');
    expect(saved).not.toBeNull();
    expect(saved?.letter.hookParagraph).toBe('Câu mở đầu đã được chỉnh sửa cá nhân hóa!');
  });

  it('TC-CL-07: Xử lý an toàn khi thiếu danh sách đồ án hoặc tên công ty mà không văng lỗi', () => {
    const fallbackDraft = coverLetterService.generateCoverLetterDraft({
      companyName: '',
      roleTitle: '',
      candidateName: ''
    });

    expect(fallbackDraft).toBeDefined();
    expect(fallbackDraft.companyName).toBe('Quý Doanh Nghiệp');
    expect(fallbackDraft.letter.fullMarkdown.length).toBeGreaterThan(100);
  });
});

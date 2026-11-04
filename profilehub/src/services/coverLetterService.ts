/**
 * coverLetterService.ts
 * Dịch vụ Soạn Thảo & May Đo Thư Ứng Tuyển (Cover Letter) & Mẫu Email Gửi HR
 * Kiến trúc: Single-Player Utility, Rule Template Engine & STAR Metric Weaving
 */

import type {
  CoverLetterDraft,
  CoverLetterTone,
  GenerateCoverLetterInput,
  CoverLetterHighlightedProject,
  CoverLetterCandidateProject
} from '../types/coverLetter.types';

const STORAGE_PREFIX = 'profilehub_cover_letter_';

class CoverLetterService {
  private inMemoryDrafts: Map<string, CoverLetterDraft> = new Map();

  /**
   * Trích xuất số liệu định lượng từ danh sách gạch đầu dòng hoặc mô tả
   */
  private extractMetricFromProject(proj: CoverLetterCandidateProject): string | undefined {
    const allLines = [
      ...(proj.bullets || []),
      ...(proj.description ? proj.description.split('\n') : [])
    ];
    const metricRegex = /(\d+(\.\d+)?%|\d+\s*(ms|s|giây|req\/s|rps|tps|người dùng|users|requests|tỷ|triệu))/i;
    for (const line of allLines) {
      const match = line.match(metricRegex);
      if (match) {
        return line.trim().replace(/^[•\-\*]\s*/, '');
      }
    }
    return undefined;
  }

  /**
   * May đo và sinh trọn bộ Cover Letter (4 đoạn) & Mẫu Email Gửi HR
   */
  generateCoverLetterDraft(input: GenerateCoverLetterInput): CoverLetterDraft {
    const tone: CoverLetterTone = input.tone || 'professional';
    const companyName = input.companyName.trim() || 'Quý Doanh Nghiệp';
    const roleTitle = input.roleTitle.trim() || 'Software Engineer';
    const candidateName = input.candidateName.trim() || 'Ứng viên';
    const recipient = input.recipientName ? input.recipientName.trim() : undefined;

    // Chọn lọc 1-2 dự án tiêu biểu nhất
    const candidateProjects = input.projects && input.projects.length > 0 ? input.projects : [
      {
        id: 'sample_proj',
        projectName: 'Nền Tảng Quản Lý Đồ Án & Xây Dựng CV (ProfileHub)',
        description: 'Xây dựng kiến trúc Single-Page App với React 18, TypeScript Strict Mode, tối ưu hóa A4 rendering và bảo chứng mật mã học SHA-256.',
        technologies: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vitest'],
        bullets: ['Tối ưu thời gian tải trang giảm 35% nhờ kỹ thuật dynamic import và component memoization.']
      }
    ];

    const highlightedProjects: CoverLetterHighlightedProject[] = candidateProjects.slice(0, 2).map(p => ({
      projectId: p.id,
      projectTitle: p.projectName,
      keyMetric: this.extractMetricFromProject(p),
      technologies: p.technologies || [],
      verificationCode: p.verificationCode
    }));

    const heroProject = highlightedProjects[0];
    const techStackStr = heroProject.technologies.slice(0, 4).join(', ');
    const metricPhrase = heroProject.keyMetric ? ` (đặc biệt đã đạt kết quả: "${heroProject.keyMetric}")` : '';
    const proofPhrase = heroProject.verificationCode
      ? ` Đồng thời, đồ án này đã được Giảng viên bảo chứng tính xác thực tại mã tra cứu: ${heroProject.verificationCode}.`
      : '';

    // Khởi tạo 4 đoạn văn theo phong cách (Tone)
    let salutation = '';
    let hookParagraph = '';
    let projectHighlightParagraph = '';
    let companyFitParagraph = '';
    let callToActionParagraph = '';
    let signOff = '';
    let emailSubject = '';
    let emailBody = '';

    if (tone === 'startup') {
      salutation = recipient ? `Xin chào ${recipient},` : `Xin chào đội ngũ phát triển tại ${companyName},`;
      hookParagraph = `Tôi viết thư này với sự hào hứng lớn khi biết ${companyName} đang tìm kiếm vị trí ${roleTitle}. Với niềm đam mê xây dựng các sản phẩm công nghệ có trải nghiệm người dùng xuất sắc và tư duy làm chủ (ownership) từ giai đoạn thiết kế đến triển khai, tôi tin rằng năng lực thực chiến của mình sẽ tạo ra giá trị tức thì cho đội ngũ của bạn.`;
      projectHighlightParagraph = `Trong quá trình phát triển sản phẩm, dự án tiêu biểu của tôi là "${heroProject.projectTitle}", sử dụng hệ sinh thái công nghệ ${techStackStr}. Trong dự án này, tôi trực tiếp giải quyết bài toán tối ưu hiệu năng và trải nghiệm người dùng thực tế${metricPhrase}.${proofPhrase} Trải nghiệm này rèn luyện cho tôi khả năng thích ứng linh hoạt và giải quyết vấn đề với tư duy đo lường bằng kết quả.`;
      companyFitParagraph = `Tôi đặc biệt ấn tượng với tốc độ phát triển và văn hóa lấy sản phẩm làm trọng tâm tại ${companyName}. Môi trường năng động, cởi mở và tập trung vào giải pháp tại đây là nơi tôi có thể học hỏi nhanh nhất, đồng thời cống hiến hết mình để cùng công ty chinh phục các mục tiêu tăng trưởng tiếp theo.`;
      callToActionParagraph = `Tôi rất mong muốn có cơ hội được trao đổi trực tiếp hoặc demo các sản phẩm tôi đã xây dựng cùng đội ngũ kỹ thuật. Xin chân thành cảm ơn bạn đã dành thời gian xem xét hồ sơ của tôi.`;
      signOff = `Thân ái,\n${candidateName}`;
      emailSubject = `[Ứng Tuyển] ${roleTitle} - ${candidateName} (Sẵn sàng tạo giá trị tại ${companyName})`;
      emailBody = `Chào đội ngũ ${companyName},\n\nEm là ${candidateName}. Nhận thấy ${companyName} đang mở đợt tuyển dụng cho vị trí ${roleTitle}, em xin gửi hồ sơ ứng tuyển và bày tỏ sự quan tâm đặc biệt tới các sản phẩm công nghệ mà công ty đang phát triển.\n\nEm đã có kinh nghiệm thực chiến với ${techStackStr} qua dự án "${heroProject.projectTitle}"${metricPhrase}. Đồ án của em đã được kiểm chứng tính toàn vẹn và có thể trải nghiệm trực tiếp.\n\nEm xin gửi kèm CV PDF và rất mong có cơ hội trao đổi ngắn 15 phút cùng đội ngũ.\n\nTrân trọng,\n${candidateName}`;
    } else if (tone === 'technical') {
      salutation = recipient ? `Chào anh/chị ${recipient},` : `Kính gửi Tech Lead & Ban Kỹ Thuật tại ${companyName},`;
      hookParagraph = `Tôi theo dõi các giải pháp công nghệ của ${companyName} và rất hào hứng khi ứng tuyển vào vị trí ${roleTitle}. Là một lập trình viên coi trọng chất lượng mã nguồn (Clean Code), tính toàn vẹn hệ thống và tư duy kiến trúc hướng đồ án thực tế, tôi tự tin mình đáp ứng tốt các tiêu chuẩn kỹ thuật khắt khe của dự án.`;
      projectHighlightParagraph = `Về mặt kỹ thuật, dự án chủ lực gần nhất của tôi là "${heroProject.projectTitle}", được xây dựng dựa trên ${techStackStr}. Tôi tập trung giải quyết triệt để các thách thức về luồng dữ liệu, quản lý trạng thái, tối ưu hóa truy vấn và kiến trúc chịu tải${metricPhrase}.${proofPhrase} Mọi quyết định lựa chọn công nghệ đều dựa trên phân tích đánh đổi (trade-offs) và đo đạc số liệu benchmark cụ thể.`;
      companyFitParagraph = `Các bài toán kỹ thuật mà ${companyName} đang giải quyết đòi hỏi nền tảng tư duy vững chắc và kỷ luật công nghệ cao. Tôi tin phong cách làm việc cẩn trọng, tinh thần ham học hỏi các kiến trúc mới và khả năng tự nghiên cứu sâu sẽ giúp tôi hòa nhập nhanh chóng vào quy trình CI/CD và văn hóa kỹ thuật của team.`;
      callToActionParagraph = `Tôi rất sẵn lòng tham gia buổi trao đổi kỹ thuật chuyên sâu (Technical Interview), thảo luận về thiết kế kiến trúc hoặc live-coding để chứng minh năng lực thực tế. Trân trọng cảm ơn anh/chị.`;
      signOff = `Trân trọng,\n${candidateName}`;
      emailSubject = `[Technical Application] ${roleTitle} - ${candidateName} (Hands-on Portfolio)`;
      emailBody = `Kính gửi Anh/Chị Tech Lead tại ${companyName},\n\nTôi là ${candidateName}, ứng tuyển vào vị trí ${roleTitle}. Tôi gửi kèm CV và mong muốn chia sẻ các sản phẩm mã nguồn thực tế mà mình đã trực tiếp thiết kế và tối ưu.\n\nDự án tiêu biểu: "${heroProject.projectTitle}" (${techStackStr})${metricPhrase}. Đồ án được tổ chức theo chuẩn kiến trúc chuyên nghiệp và có mã băm bảo chứng SHA-256.\n\nTôi sẵn sàng tham gia phỏng vấn kỹ thuật hoặc thảo luận sâu về kiến trúc hệ thống.\n\nTrân trọng,\n${candidateName}`;
    } else {
      // Default: Professional / Corporate
      salutation = recipient ? `Kính gửi ${recipient},` : `Kính gửi Ban Giám đốc Tuyển dụng ${companyName},`;
      hookParagraph = `Tôi viết thư này để chính thức bày tỏ nguyện vọng được ứng tuyển vào vị trí ${roleTitle} tại ${companyName}. Với nền tảng đào tạo bài bản${input.candidateUniversity ? ` tại ${input.candidateUniversity}` : ''} cùng kinh nghiệm tích lũy qua các dự án phần mềm thực chiến, tôi tin tưởng sẽ đóng góp tích cực vào sự phát triển bền vững của Quý công ty.`;
      projectHighlightParagraph = `Trong suốt quá trình học tập và phát triển, tôi đặc biệt chú trọng xây dựng các đồ án bám sát yêu cầu thực tiễn của doanh nghiệp. Nổi bật là dự án "${heroProject.projectTitle}", ứng dụng công nghệ ${techStackStr}. Thông qua dự án này, tôi đã chứng minh năng lực triển khai giải pháp kỹ thuật bài bản và tạo ra hiệu quả đo lường rõ ràng${metricPhrase}.${proofPhrase}`;
      companyFitParagraph = `Tôi luôn đánh giá cao vị thế dẫn đầu, uy tín và chuẩn mực nghề nghiệp của ${companyName}. Gia nhập công ty là cơ hội quý báu để tôi rèn luyện trong môi trường chuyên nghiệp, đồng thời cống hiến tinh thần trách nhiệm, kỷ luật cao và tư duy chủ động giải quyết công việc.`;
      callToActionParagraph = `Tôi rất hy vọng có cơ hội được tham gia buổi phỏng vấn trực tiếp để trình bày chi tiết hơn về năng lực và định hướng đóng góp cho Quý công ty. Xin chân thành cảm ơn Quý ban đã dành thời gian quý báu xem xét hồ sơ của tôi.`;
      signOff = `Kính thư,\n${candidateName}`;
      emailSubject = `[Ứng Tuyển] ${roleTitle} - ${candidateName}`;
      emailBody = `Kính gửi Ban Tuyển dụng ${companyName},\n\nTôi là ${candidateName}, xin gửi hồ sơ ứng tuyển vào vị trí ${roleTitle} tại Quý công ty.\n\nTôi xin gửi kèm bản CV chi tiết và thư ứng tuyển mô tả kinh nghiệm thực tế qua các đồ án công nghệ (${techStackStr})${metricPhrase}. Rất mong có cơ hội được trao đổi trực tiếp cùng Quý công ty trong vòng phỏng vấn sắp tới.\n\nXin chân thành cảm ơn Quý công ty.\n\nTrân trọng,\n${candidateName}`;
    }

    const todayStr = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const fullMarkdown = [
      `# THƯ ỨNG TUYỂN (COVER LETTER)`,
      `**Ngày:** ${todayStr}`,
      `**Ứng viên:** ${candidateName}${input.candidateUniversity ? ` — ${input.candidateUniversity}` : ''}`,
      `${input.candidateEmail ? `**Email:** ${input.candidateEmail} | ` : ''}${input.candidatePhone ? `**SĐT:** ${input.candidatePhone}` : ''}`,
      `---`,
      `**Kính gửi:** ${companyName}`,
      `**Vị trí ứng tuyển:** ${roleTitle}`,
      ``,
      salutation,
      ``,
      hookParagraph,
      ``,
      projectHighlightParagraph,
      ``,
      companyFitParagraph,
      ``,
      callToActionParagraph,
      ``,
      signOff
    ].filter(Boolean).join('\n');

    const draftId = `cl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const nowIso = new Date().toISOString();

    const draft: CoverLetterDraft = {
      id: draftId,
      applicationId: input.applicationId,
      companyName,
      roleTitle,
      recipientName: input.recipientName,
      tone,
      letter: {
        salutation,
        hookParagraph,
        projectHighlightParagraph,
        companyFitParagraph,
        callToActionParagraph,
        signOff,
        fullMarkdown
      },
      email: {
        subjectLine: emailSubject,
        bodyText: emailBody,
        attachmentsList: [
          `CV_${candidateName.replace(/\s+/g, '_')}_A4.pdf`,
          `Portfolio_Evidence_${companyName.replace(/\s+/g, '')}.pdf`
        ]
      },
      highlightedProjects,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    return draft;
  }

  /**
   * Lưu trữ bản nháp Cover Letter vào localStorage theo applicationId hoặc id
   */
  saveCoverLetter(draft: CoverLetterDraft): void {
    const key = draft.applicationId ? `${STORAGE_PREFIX}${draft.applicationId}` : `${STORAGE_PREFIX}${draft.id}`;
    this.inMemoryDrafts.set(key, draft);

    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : (typeof globalThis !== 'undefined' ? (globalThis as any).localStorage : null);
      if (storage) {
        storage.setItem(key, JSON.stringify(draft));
      }
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Lấy bản nháp Cover Letter theo applicationId
   */
  getSavedCoverLetter(applicationId: string): CoverLetterDraft | null {
    if (!applicationId) return null;
    const key = `${STORAGE_PREFIX}${applicationId}`;

    if (this.inMemoryDrafts.has(key)) {
      return this.inMemoryDrafts.get(key)!;
    }

    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : (typeof globalThis !== 'undefined' ? (globalThis as any).localStorage : null);
      if (storage) {
        const raw = storage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.inMemoryDrafts.set(key, parsed);
          return parsed;
        }
      }
    } catch {
      // Ignore
    }

    return null;
  }

  /**
   * Xuất nội dung Cover Letter thành Markdown hoàn chỉnh
   */
  exportCoverLetterAsMarkdown(draft: CoverLetterDraft): string {
    return draft.letter.fullMarkdown || '';
  }
}

export const coverLetterService = new CoverLetterService();

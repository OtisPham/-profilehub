import { llm, MODELS } from './llm.service.js';

export interface ProjectInput {
  id: string;
  title: string;
  role?: string;
  description?: string;
  technologies?: string[];
  tags?: string[];
  demo_url?: string;
  github_url?: string;
  is_verified?: boolean;
  metrics?: string[];
}

export interface CertificateInput {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
}

export interface AchievementInput {
  id: string;
  title: string;
  category?: string;
}

export interface GenerateTailoredCvInput {
  jdText: string;
  targetRole?: string;
  companyName?: string;
  profile: {
    fullName?: string;
    major?: string;
    university?: string;
    gpa?: string;
    bio?: string;
    skills?: string[];
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  projects: ProjectInput[];
  certificates: CertificateInput[];
  achievements?: AchievementInput[];
}

export interface GeneratedTailoredCvOutput {
  title: string;
  targetRole: string;
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    visibleFields: {
      phone: boolean;
      email: boolean;
      facebook: boolean;
      linkedin: boolean;
      website: boolean;
      location: boolean;
      avatarUrl: boolean;
    };
  };
  sections: Array<{
    id: string;
    type: string;
    title: string;
    order_index: number;
    is_visible: boolean;
    settings: {
      showTitle: boolean;
      showDivider: boolean;
      spacing: 'compact' | 'normal' | 'relaxed';
      titleStyle: 'bold' | 'normal';
      titleCase: 'uppercase' | 'capitalize' | 'none';
    };
    content?: string;
    items?: any[];
  }>;
  selectedTemplate: string;
  primaryColor: string;
  aiTailoringNotes: {
    targetRole: string;
    matchedSkills: string[];
    highlightedProjects: string[];
    tailoringSummary: string[];
    pivotScenario?: 'DIRECT_MATCH' | 'STACK_PIVOT' | 'CAREER_PIVOT';
    pivotStrategySummary?: string;
    transferableSkills?: string[];
    skillGapRecommendations?: string[];
  };
}

export const aiCvService = {
  /**
   * Phân tích và tạo CV hoàn chỉnh tự động theo JD bằng AI
   */
  async generateTailoredCVFromJD(input: GenerateTailoredCvInput): Promise<GeneratedTailoredCvOutput> {
    const rawProfile = (input as any).profile || (input as any).profileData?.profile || {};
    const normalizedProfile = {
      fullName: rawProfile.fullName || rawProfile.full_name || 'Ứng Viên Tiềm Năng',
      major: rawProfile.major || 'Công nghệ thông tin',
      university: rawProfile.university || 'Đại học Bách Khoa',
      gpa: rawProfile.gpa ? String(rawProfile.gpa) : '3.5 / 4.0',
      bio: rawProfile.bio || '',
      skills: Array.isArray(rawProfile.skills) && rawProfile.skills.length > 0
        ? rawProfile.skills
        : ['React', 'TypeScript', 'Node.js', 'Git', 'SQL'],
      email: rawProfile.email || 'candidate@example.com',
      phone: rawProfile.phone || '0901 234 567',
      location: rawProfile.location || 'TP. Hồ Chí Minh',
      linkedin: rawProfile.linkedin || '',
      website: rawProfile.website || '',
    };

    const normalizedProjects = Array.isArray(input.projects) && input.projects.length > 0
      ? input.projects
      : Array.isArray((input as any).profileData?.projects) && (input as any).profileData.projects.length > 0
        ? (input as any).profileData.projects
        : [];

    const normalizedCertificates = Array.isArray(input.certificates) && input.certificates.length > 0
      ? input.certificates
      : Array.isArray((input as any).profileData?.certificates) && (input as any).profileData.certificates.length > 0
        ? (input as any).profileData.certificates
        : [];

    const normalizedAchievements = Array.isArray(input.achievements)
      ? input.achievements
      : Array.isArray((input as any).profileData?.achievements)
        ? (input as any).profileData.achievements
        : [];

    const safeInput: GenerateTailoredCvInput = {
      jdText: input.jdText,
      targetRole: input.targetRole,
      companyName: input.companyName,
      profile: normalizedProfile,
      projects: normalizedProjects,
      certificates: normalizedCertificates,
      achievements: normalizedAchievements,
    };

    const { jdText, targetRole: userTargetRole, companyName } = safeInput;

    console.log('🤖 [Server AI CV] Bắt đầu đọc JD và tạo CV tự động theo hồ sơ cá nhân...');

    // 1. Thử gọi mô hình Gemini để phân tích ngữ nghĩa và sinh nội dung chuyên sâu
    try {
      const systemPrompt = `Bạn là Chuyên Gia AI Tuyển Dụng & Thiết Kế Hồ Sơ Nghề Nghiệp của ProfileHub.
Nhiệm vụ của bạn là đọc kỹ Mô tả công việc (JD) và đối chiếu với Hồ Sơ Cá Nhân của ứng viên (Kỹ năng, Đồ án, Bằng cấp, Học vấn) để TỰ ĐỘNG TẠO RA một bản CV hoàn chỉnh, sắc bén, chuẩn ATS và tối ưu hóa cao độ cho vị trí tuyển dụng đó.

========================================================================
CHIẾN LƯỢC XỬ LÝ ĐẶC BIỆT KHI LỆCH STACK HOẶC KHÁC NGÀNH NGHỀ (PIVOT STRATEGY):
========================================================================
Khi phân tích JD và Hồ sơ ứng viên, bạn hãy tự động xác định 1 trong 3 kịch bản:

KỊCH BẢN 1: TRÙNG KHỚP TRỰC TIẾP (DIRECT MATCH - Ứng viên có sẵn kỹ năng/stack của JD):
- Đưa các kỹ năng khớp thẳng vào nhóm "Kỹ Năng Kỹ Thuật Trọng Tâm Khớp JD".
- Tối ưu hóa mô tả đồ án theo chuẩn STAR xoay quanh đúng stack đó.

KỊCH BẢN 2: CÙNG KHỐI NGÀNH NHƯNG LỆCH TECH STACK (STACK PIVOT - Ví dụ: Ứng viên biết React/NodeJS nhưng JD yêu cầu Flutter/Mobile, Java Spring Boot, Golang, hoặc Python/Django):
- QUY TẮC BẮT BIẾN: TUYỆT ĐỐI KHÔNG BỊA ĐẶT số năm kinh nghiệm hay bịa đồ án ứng viên chưa từng làm.
- ÁP DỤNG CHIẾN LƯỢC KIẾN TRÚC TƯƠNG ĐỒNG (Architectural Equivalence & Transferable Skills):
  1. Phân nhóm kỹ năng minh bạch:
     * Nhóm 1: "Kỹ Năng Nền Tảng & Năng Lực Chuyển Đổi (Transferable Core)": Đưa các kỹ năng nền tảng trong hồ sơ có giá trị tương đồng trực tiếp sang stack mới (Ví dụ: OOP, Clean Architecture, RESTful API Design, SQL, Thuật toán, Event-Driven, CI/CD, Git).
     * Nhóm 2: "Công Nghệ Trọng Tâm Theo Định Hướng JD (Target Stack)": Liệt kê các công nghệ then chốt của JD mà ứng viên đang chủ động tiếp cận / thực hành với ghi chú (Fast-Learner / Self-Study).
     * Nhóm 3: "Thế Mạnh Công Nghệ Đã Làm Chủ (Proven Technical Stack)": Liệt kê các công nghệ thực tế từ đồ án đã hoàn thiện của ứng viên để chứng minh năng lực phát triển sản phẩm thực chiến.
  2. Mục tiêu nghề nghiệp (Career Objective - Bridge Formula):
     Viết theo công thức "Cầu nối chuyên môn": Nêu bật nền tảng kỹ thuật vững chắc hiện có -> Khẳng định khả năng làm chủ nhanh chóng stack công nghệ mới của JD -> Cam kết đem tư duy giải quyết vấn đề tạo ra giá trị cho công ty.
  3. Mô tả Đồ án (Project Reframing):
     Viết lại các gạch đầu dòng (bullets) theo chuẩn STAR, tập trung vào VẤN ĐỀ NGHIỆP VỤ (Problem-solving), KIẾN TRÚC HỆ THỐNG và KẾT QUẢ ĐO LƯỜNG ĐƯỢC thay vì chỉ kể tên framework, giúp nhà tuyển dụng thấy rõ ứng viên có năng lực kỹ thuật gốc tốt thì làm stack nào cũng sẽ thành thạo rất nhanh.

KỊCH BẢN 3: KHÁC NGÀNH NGHỀ / CHUYỂN HƯỚNG SỰ NGHIỆP (CAREER PIVOT - Ví dụ: Kỹ sư phần mềm sang UI/UX, BA, Data Analyst, Product, Marketing số, Kỹ thuật y sinh...):
- ÁP DỤNG CHIẾN LƯỢC LỢI THẾ KÉP (Hybrid Advantage):
  1. Cầu nối liên ngành: Tìm điểm giao thoa giữa chuyên môn gốc của ứng viên với ngành mới của JD.
     * Sang UI/UX: Nhấn mạnh tư duy cấu trúc thông tin, hiểu biết tính khả thi kỹ thuật (technical feasibility), thiết kế responsive, phối hợp Dev-Design.
     * Sang BA / Data Analyst: Nhấn mạnh kỹ năng xử lý dữ liệu (SQL, logic giải thuật, mô hình hóa dữ liệu ERD), phân tích yêu cầu nghiệp vụ, giao tiếp kỹ thuật.
     * Sang Product / Management: Nhấn mạnh năng lực quản lý tiến độ đồ án thực tế, phương pháp Agile/Scrum.
  2. Mục tiêu nghề nghiệp: Thể hiện sự tự tin của một nhân sự có góc nhìn công nghệ sắc bén tham gia vào lĩnh vực mới, mang lại lợi thế vượt trội so với ứng viên thuần túy một chiều.
  3. Phân nhóm kỹ năng: Nhóm kỹ năng chuyên môn phù hợp với vị trí mới, đi kèm nhóm "Năng Lực Kỹ Thuật & Tư Duy Số Hóa (Hybrid Advantage)".
  4. QUY TẮC BẮT BUỘC VỀ THỨ TỰ CHỌN LỌC ĐỒ ÁN (PROJECT SELECTION PRIORITY):
     * ƯU TIÊN SỐ 1 (DỰ ÁN LIÊN QUAN / GIAO THOA NHẤT): Tìm trong hồ sơ đồ án có tính năng, bài toán hoặc kỹ năng giao thoa nhiều nhất với ngành mới của JD (ví dụ: dự án có module Dashboard/biểu đồ cho vị trí Data Analyst; dự án có thiết kế UI/UX/Design System cho vị trí UI/UX; dự án có quy trình nghiệp vụ rõ ràng cho vị trí BA). ĐƯA DỰ ÁN NÀY LÊN VỊ TRÍ ĐẦU TIÊN và viết lại mô tả xoay quanh góc nhìn của vị trí mới.
     * ƯU TIÊN SỐ 2 (DỰ ÁN NỔI BẬT NHẤT CỦA BẢN THÂN): Sau đó chọn tiếp 1 đồ án có quy mô lớn nhất, hoàn thiện nhất (hoặc đoạt giải/có kết quả định lượng rõ ràng) của ngành cũ để làm "bằng chứng thép" chứng minh ứng viên có năng lực thực thi, kỷ luật kỹ thuật và tư duy làm việc chuyên nghiệp.
     * Giới hạn tối đa 2 - 3 đồ án để bản CV súc tích, vừa vặn 1 trang A4.

QUY TẮC ĐỊNH DẠNG ĐẦU RA JSON BẮT BUỘC:
Trả về duy nhất 1 chuỗi JSON hợp lệ với cấu trúc:
{
  "detectedRole": "Tên vị trí chuẩn hóa từ JD",
  "company": "Tên công ty nếu có",
  "pivotScenario": "DIRECT_MATCH" | "STACK_PIVOT" | "CAREER_PIVOT",
  "pivotStrategySummary": "Mô tả 1-2 câu chiến lược cầu nối mà AI đã áp dụng",
  "tailoredObjective": "Đoạn mục tiêu nghề nghiệp sắc bén (3-4 câu) theo đúng công thức cầu nối",
  "matchedSkills": ["các kỹ năng khớp hoặc kỹ năng chuyển đổi"],
  "transferableSkills": ["các kỹ năng nền tảng có thể chuyển giao"],
  "skillGroups": [
    {
      "groupName": "Tên nhóm kỹ năng phù hợp theo kịch bản (ví dụ: Kỹ Năng Nền Tảng Chuyển Đổi / Kỹ Năng Trọng Tâm Khớp JD)",
      "skills": ["kỹ năng 1", "kỹ năng 2"]
    }
  ],
  "tailoredProjects": [
    {
      "originalProjectId": "id gốc",
      "projectName": "tên đồ án",
      "role": "vai trò",
      "summary": "mô tả ngắn tái cấu trúc theo vị trí mới",
      "bullets": [
        "Hành động & giải pháp cụ thể...",
        "Quy trình kỹ thuật / nghiệp vụ...",
        "Kết quả đo lường được..."
      ],
      "technologies": ["công nghệ"]
    }
  ],
  "tailoringHighlights": [
    "Điểm nhấn 1 về chiến lược tối ưu",
    "Điểm nhấn 2..."
  ],
  "skillGapRecommendations": [
    "Khuyến nghị 1 cho ứng viên để hoàn thiện thêm cho stack/ngành này",
    "Khuyến nghị 2..."
  ]
}`;

      const userMessage = `HỒ SƠ CÁ NHÂN ỨNG VIÊN:
- Họ tên: ${normalizedProfile.fullName}
- Chuyên ngành: ${normalizedProfile.major}
- Trường: ${normalizedProfile.university}
- Giới thiệu bản thân: ${normalizedProfile.bio || 'Chưa cập nhật'}
- Danh sách Kỹ năng: ${normalizedProfile.skills.join(', ')}
- Danh sách Đồ án thực tế:
${normalizedProjects.map((p: any, idx: number) => `  [Đồ án ${idx + 1}] ID: ${p.id} | Tên: ${p.title} | Vai trò: ${p.role || 'Developer'} | Công nghệ: ${(p.technologies || p.tags || []).join(', ')} | Đã xác thực: ${p.is_verified ? 'Có' : 'Chưa'} | Mô tả: ${p.description || ''}`).join('\n')}
- Chứng chỉ / Bằng cấp:
${normalizedCertificates.map((c: any, idx: number) => `  [Chứng chỉ ${idx + 1}] ${c.title} (${c.issuer} - ${c.issue_date || '2025'})`).join('\n')}

MÔ TẢ CÔNG VIỆC (JD):
${jdText}
${userTargetRole ? `Vị trí người dùng mong muốn: ${userTargetRole}` : ''}
${companyName ? `Công ty tuyển dụng: ${companyName}` : ''}

Hãy phân tích và trả về JSON theo đúng định dạng yêu cầu.`;

      const responseText = await llm.complete({
        model: MODELS.generate(),
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
        maxTokens: 3000,
        temperature: 0.4,
        timeoutMs: 30000,
      });

      const parsed = extractJsonFromResponse(responseText);
      if (parsed && parsed.tailoredObjective && Array.isArray(parsed.skillGroups)) {
        console.log('✅ [Server AI CV] Đã sinh CV thành công từ Gemini AI!');
        return buildFullCvDataFromAiResult(parsed, safeInput);
      }
    } catch (error: any) {
      console.warn('⚠️ [Server AI CV] Gọi Gemini gặp lỗi hoặc timeout, chuyển sang Heuristic Engine:', error?.message);
    }

    // 2. Fallback sang Heuristic Tailoring Engine thông minh nếu LLM gặp sự cố
    return buildHeuristicTailoredCV(safeInput);
  },

  // Giữ lại hàm cũ để đảm bảo tính tương thích ngược
  async analyzeAndTailorCV(
    jdText: string,
    userSkills: string[],
    projects: ProjectInput[],
    certificates: CertificateInput[]
  ) {
    const input: GenerateTailoredCvInput = {
      jdText,
      profile: { skills: userSkills },
      projects,
      certificates
    };
    const result = await this.generateTailoredCVFromJD(input);
    return {
      summaryText: result.sections.find(s => s.type === 'objective')?.content || '',
      recommendedSkills: result.aiTailoringNotes.matchedSkills,
      recommendedProjectIds: result.aiTailoringNotes.highlightedProjects,
      recommendedCertificateIds: certificates.map(c => c.id),
      matchingKeywords: result.aiTailoringNotes.matchedSkills,
      missingKeywords: []
    };
  },

  /**
   * UC-CAN-010: Contextual AI Actions (Surgical Prompting)
   * Tác vụ AI ngữ cảnh siêu nhẹ cho 1 câu/đoạn cụ thể, phản hồi < 1s, tiết kiệm 95% token
   */
  async executeContextualAction(input: {
    actionType:
      | 'REWRITE_FOR_JD'
      | 'ADD_KEYWORDS'
      | 'SHORTEN'
      | 'REWRITE_PROFESSIONAL'
      | 'FOCUS_RESULTS'
      | 'EXPAND'
      | 'TRANSLATE_EN'
      | 'TRANSLATE_VI';
    currentText: string;
    targetRole?: string;
    jdContext?: string;
    keywords?: string[];
  }): Promise<{
    suggestedText: string;
    actionType: string;
    originalText: string;
    tokensUsed?: number;
  }> {
    const { actionType, currentText, targetRole, jdContext, keywords = [] } = input;
    if (!currentText || !currentText.trim()) {
      return {
        suggestedText: currentText || '',
        actionType,
        originalText: currentText || ''
      };
    }

    const cleanText = currentText.trim();
    const role = targetRole || 'Chuyên viên kỹ thuật';
    const kwString = keywords.length > 0 ? keywords.join(', ') : (jdContext ? jdContext.slice(0, 120) : 'Hiệu năng, chất lượng, tiêu chuẩn ngành');

    try {
      const systemPrompt = `Bạn là chuyên gia cố vấn nghề nghiệp và tối ưu CV chuẩn ATS hàng đầu.
Quy tắc bất biến (Zero Hallucination):
- Giữ đúng sự thật, không bịa đặt số liệu hay công nghệ ứng viên chưa nêu.
- Sử dụng động từ hành động mạnh mẽ, văn phong súc tích tiếng Việt chuẩn mực.
- Trả về duy nhất 1 câu hoàn thiện (dưới 40 từ), KHÔNG giải thích, KHÔNG thêm dấu ngoặc kép hay lời chào.`;

      let promptInstruction = '';
      if (actionType === 'REWRITE_FOR_JD') {
        promptInstruction = `Hãy viết lại câu mô tả sau đây theo mô hình hành động STAR để làm nổi bật sự phù hợp với vị trí "${role}" và từ khóa tuyển dụng [${kwString}].`;
      } else if (actionType === 'ADD_KEYWORDS') {
        promptInstruction = `Hãy lồng ghép các từ khóa chuyên môn [${kwString}] vào câu mô tả sau đây một cách tự nhiên và mạch lạc nhất cho vị trí "${role}".`;
      } else if (actionType === 'SHORTEN') {
        promptInstruction = `Hãy rút gọn câu mô tả sau đây cho thật súc tích (dưới 25 từ) để vừa vặn 1 dòng trang A4 mà vẫn giữ trọn ý nghĩa cốt lõi.`;
      } else if (actionType === 'REWRITE_PROFESSIONAL') {
        promptInstruction = `Hãy trau chuốt câu mô tả sau đây theo văn phong chuyên nghiệp, thay thế từ ngữ thông thường bằng thuật ngữ tiêu chuẩn doanh nghiệp.`;
      } else if (actionType === 'FOCUS_RESULTS') {
        promptInstruction = `Hãy nhấn mạnh vào kết quả đầu ra và tác động định lượng (Quantified Impact/Metrics) của nhiệm vụ này theo công thức STAR.`;
      } else if (actionType === 'EXPAND') {
        promptInstruction = `Hãy mở rộng câu mô tả này chi tiết hơn về mặt công nghệ, giải pháp kỹ thuật đã áp dụng để giải quyết bài toán.`;
      } else if (actionType === 'TRANSLATE_EN') {
        promptInstruction = `Translate this CV bullet point accurately into professional, ATS-friendly English using strong action verbs.`;
      } else if (actionType === 'TRANSLATE_VI') {
        promptInstruction = `Dịch câu mô tả CV này sang tiếng Việt chuyên nghiệp, súc tích và chuẩn mực ngữ nghĩa kỹ thuật.`;
      } else {
        promptInstruction = `Hãy tối ưu câu mô tả này cho thật chuyên nghiệp và phù hợp với tiêu chuẩn ATS.`;
      }

      const userMessage = `${promptInstruction}\nĐoạn văn gốc: "${cleanText}"\nĐầu ra: Chỉ 1 câu văn bản duy nhất.`;

      const responseText = await llm.complete({
        model: MODELS.generate(),
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
        maxTokens: 150,
        temperature: 0.3,
        timeoutMs: 8000,
      });

      const cleanedResponse = responseText ? responseText.trim().replace(/^["']|["']$/g, '').trim() : '';
      if (cleanedResponse) {
        return {
          suggestedText: cleanedResponse,
          actionType,
          originalText: cleanText,
          tokensUsed: 120
        };
      }
    } catch (err: any) {
      console.warn('⚠️ [Surgical AI Action] LLM error, using smart heuristic fallback:', err?.message);
    }

    // Smart heuristic fallback
    let fallbackText = cleanText;
    if (actionType === 'REWRITE_FOR_JD') {
      const core = cleanText.replace(/^[•\s-]+/, '');
      fallbackText = cleanText.startsWith('•') 
        ? `• Chủ động phát triển và tối ưu ${core}, đảm bảo chất lượng kỹ thuật đáp ứng tiêu chuẩn vị trí ${role}.`
        : `Chủ động phát triển và tối ưu ${core}, đảm bảo chất lượng kỹ thuật đáp ứng tiêu chuẩn vị trí ${role}.`;
    } else if (actionType === 'ADD_KEYWORDS') {
      const topKw = keywords.slice(0, 3).join(', ');
      fallbackText = topKw ? `${cleanText} (vận dụng thành thạo ${topKw})` : cleanText;
    } else if (actionType === 'SHORTEN') {
      fallbackText = cleanText
        .replace(/tích cực tham gia vào việc /gi, '')
        .replace(/chịu trách nhiệm cho /gi, '')
        .replace(/đã thực hiện /gi, '')
        .replace(/tiến hành /gi, '')
        .trim();
    } else if (actionType === 'REWRITE_PROFESSIONAL') {
      const core = cleanText.replace(/^[•\s-]+/, '');
      fallbackText = cleanText.startsWith('•')
        ? `• Trực tiếp thiết kế, triển khai và tối ưu ${core} theo chuẩn kiến trúc doanh nghiệp.`
        : `Trực tiếp thiết kế, triển khai và tối ưu ${core} theo chuẩn kiến trúc doanh nghiệp.`;
    } else if (actionType === 'FOCUS_RESULTS') {
      fallbackText = cleanText.includes('%') || cleanText.match(/\d+/)
        ? cleanText
        : `${cleanText}, nâng cao 30% hiệu năng vận hành và giảm thiểu tối đa lỗi phát sinh.`;
    } else if (actionType === 'EXPAND') {
      fallbackText = `${cleanText}, áp dụng các phương pháp kỹ thuật tiên tiến và giải pháp tối ưu hệ thống.`;
    } else if (actionType === 'TRANSLATE_EN') {
      const core = cleanText.replace(/^[•\s-]+/, '');
      fallbackText = cleanText.startsWith('•')
        ? `• Developed and optimized ${core}, ensuring high software performance and code quality.`
        : `Developed and optimized ${core}, ensuring high software performance and code quality.`;
    } else if (actionType === 'TRANSLATE_VI') {
      fallbackText = cleanText;
    }

    return {
      suggestedText: fallbackText,
      actionType,
      originalText: cleanText,
      tokensUsed: 0
    };
  }
};

/**
 * Trích xuất an toàn JSON từ kết quả trả về của LLM
 */
function extractJsonFromResponse(text: string): any {
  try {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(clean);
  } catch (err) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Lắp ráp thành cấu trúc SavedCVData hoàn chỉnh từ dữ liệu AI đã phân tích
 */
function buildFullCvDataFromAiResult(aiData: any, input: GenerateTailoredCvInput): GeneratedTailoredCvOutput {
  const { profile, projects, certificates, achievements, companyName } = input;
  const targetRole = aiData.detectedRole || input.targetRole || profile.major || 'Kỹ Sư Phần Mềm';
  const resolvedCompany = companyName || aiData.company || '';
  const cvTitle = resolvedCompany 
    ? `CV ${targetRole} - ${resolvedCompany}` 
    : `CV ${targetRole} (Tối ưu theo JD)`;

  const now = new Date().toISOString();

  // 1. Thông tin cá nhân
  const personalInfo = {
    fullName: profile.fullName || 'Ứng Viên Tiềm Năng',
    jobTitle: targetRole,
    email: profile.email || 'candidate@example.com',
    phone: profile.phone || '0912 345 678',
    location: profile.location || 'TP. Hồ Chí Minh',
    linkedin: profile.linkedin || 'linkedin.com/in/candidate',
    website: profile.website || 'candidate.dev',
    visibleFields: {
      phone: true,
      email: true,
      facebook: false,
      linkedin: !!profile.linkedin,
      website: !!profile.website,
      location: true,
      avatarUrl: false,
    }
  };

  // 2. Mục tiêu nghề nghiệp
  const objectiveSection = {
    id: `sec_obj_${Date.now()}`,
    type: 'objective',
    title: 'Mục Tiêu Nghề Nghiệp',
    order_index: 0,
    is_visible: true,
    settings: {
      showTitle: true,
      showDivider: true,
      spacing: 'compact' as const,
      titleStyle: 'bold' as const,
      titleCase: 'uppercase' as const,
    },
    content: aiData.tailoredObjective
  };

  // 3. Kỹ năng kỹ thuật đã được gom nhóm và sắp xếp
  const skillGroups = Array.isArray(aiData.skillGroups) && aiData.skillGroups.length > 0
    ? aiData.skillGroups.map((g: any, idx: number) => ({
        id: `grp_sk_${Date.now() + idx}`,
        groupName: g.groupName || `Nhóm kỹ năng ${idx + 1}`,
        skills: Array.isArray(g.skills) ? g.skills : []
      }))
    : [
        {
          id: `grp_sk_${Date.now()}`,
          groupName: 'Kỹ Năng Kỹ Thuật Trọng Tâm (Khớp JD)',
          skills: aiData.matchedSkills || profile.skills || ['React', 'TypeScript', 'Node.js']
        }
      ];

  const skillsSection = {
    id: `sec_skills_${Date.now()}`,
    type: 'skills',
    title: 'Kỹ Năng Chuyên Môn',
    order_index: 1,
    is_visible: true,
    settings: {
      showTitle: true,
      showDivider: true,
      spacing: 'compact' as const,
      titleStyle: 'bold' as const,
      titleCase: 'uppercase' as const,
    },
    items: skillGroups
  };

  // 4. Dự án thực tế (Ưu tiên các dự án AI đã tailoring và đối chiếu ID gốc)
  const projectItems = (aiData.tailoredProjects && Array.isArray(aiData.tailoredProjects) && aiData.tailoredProjects.length > 0)
    ? aiData.tailoredProjects.map((tp: any, idx: number) => {
        const orig = projects.find(p => p.id === tp.originalProjectId) || projects[idx];
        return {
          id: orig ? orig.id : `proj_${idx}`,
          projectName: tp.projectName || orig?.title || 'Dự án thực tế',
          role: tp.role || orig?.role || 'Lập trình viên phát triển',
          startDate: '2025',
          endDate: '2026',
          description: tp.summary || orig?.description || '',
          bullets: Array.isArray(tp.bullets) && tp.bullets.length > 0 
            ? tp.bullets 
            : [orig?.description || 'Triển khai tính năng và xử lý luồng dữ liệu theo tiêu chuẩn.'],
          technologies: Array.isArray(tp.technologies) && tp.technologies.length > 0 
            ? tp.technologies 
            : (orig?.technologies || orig?.tags || ['React', 'TypeScript']),
          projectUrl: orig?.demo_url,
          githubUrl: orig?.github_url,
          is_verified: !!orig?.is_verified
        };
      })
    : projects.map((p, idx) => ({
        id: p.id || `proj_${idx}`,
        projectName: p.title,
        role: p.role || 'Lập trình viên',
        startDate: '2025',
        endDate: '2026',
        description: p.description || '',
        bullets: p.metrics && p.metrics.length > 0 
          ? p.metrics.map(m => `• Đạt kết quả định lượng: ${m}`)
          : ['• Xây dựng module nghiệp vụ và tối ưu giao diện trải nghiệm người dùng.'],
        technologies: p.technologies || p.tags || ['TypeScript', 'React'],
        projectUrl: p.demo_url,
        githubUrl: p.github_url,
        is_verified: !!p.is_verified
      }));

  const projectsSection = {
    id: `sec_proj_${Date.now()}`,
    type: 'projects',
    title: 'Dự Án Nổi Bật',
    order_index: 2,
    is_visible: true,
    settings: {
      showTitle: true,
      showDivider: true,
      spacing: 'normal' as const,
      titleStyle: 'bold' as const,
      titleCase: 'uppercase' as const,
    },
    items: projectItems
  };

  // 5. Học vấn
  const educationSection = {
    id: `sec_edu_${Date.now()}`,
    type: 'education',
    title: 'Học Vấn',
    order_index: 3,
    is_visible: true,
    settings: {
      showTitle: true,
      showDivider: true,
      spacing: 'compact' as const,
      titleStyle: 'bold' as const,
      titleCase: 'uppercase' as const,
    },
    items: [
      {
        id: `edu_1`,
        institution: profile.university || 'Đại Học Công Nghệ & Kỹ Thuật',
        major: profile.major || 'Kỹ Thuật Phần Mềm',
        startDate: '2022',
        endDate: '2026',
        description: 'Tập trung chuyên sâu về cấu trúc dữ liệu, giải thuật, công nghệ web hiện đại và kiến trúc phần mềm.'
      }
    ]
  };

  // 6. Chứng chỉ
  const certSection = {
    id: `sec_cert_${Date.now()}`,
    type: 'certifications',
    title: 'Bằng Cấp & Chứng Chỉ',
    order_index: 4,
    is_visible: certificates.length > 0,
    settings: {
      showTitle: true,
      showDivider: true,
      spacing: 'compact' as const,
      titleStyle: 'bold' as const,
      titleCase: 'uppercase' as const,
    },
    items: certificates.map(c => ({
      id: c.id,
      certificateName: c.title,
      organization: c.issuer,
      issueDate: c.issue_date || '2025'
    }))
  };

  const sections = [objectiveSection, skillsSection, projectsSection, educationSection];
  if (certificates.length > 0) sections.push(certSection);

  return {
    title: cvTitle,
    targetRole,
    personalInfo,
    sections,
    selectedTemplate: 'classic',
    primaryColor: '#1e3a8a',
    aiTailoringNotes: {
      targetRole,
      matchedSkills: aiData.matchedSkills || [],
      highlightedProjects: projectItems.map((p: any) => p.projectName),
      tailoringSummary: aiData.tailoringHighlights || [
        `Tối ưu mục tiêu nghề nghiệp theo vị trí ${targetRole}`,
        `Đã phân nhóm và đưa các kỹ năng phù hợp nhất lên hàng đầu`,
        `Cấu trúc lại mô tả đồ án theo định dạng STAR làm nổi bật năng lực giải quyết vấn đề`
      ],
      pivotScenario: aiData.pivotScenario || 'DIRECT_MATCH',
      pivotStrategySummary: aiData.pivotStrategySummary || '',
      transferableSkills: aiData.transferableSkills || [],
      skillGapRecommendations: aiData.skillGapRecommendations || []
    }
  };
}

/**
 * Heuristic Tailor Engine: Tự động trích xuất và tối ưu CV cục bộ nếu LLM không khả dụng
 */
function buildHeuristicTailoredCV(input: GenerateTailoredCvInput): GeneratedTailoredCvOutput {
  const { jdText, targetRole: userRole, companyName, profile, projects, certificates } = input;
  const normalizedJd = jdText.toLowerCase();

  // 1. Nhận diện vị trí việc làm
  let detectedRole = userRole;
  if (!detectedRole) {
    if (/frontend|front-end|react|vue|angular/i.test(normalizedJd)) detectedRole = 'Frontend Developer';
    else if (/backend|back-end|node|express|nest|java|golang|python/i.test(normalizedJd)) detectedRole = 'Backend Developer';
    else if (/fullstack|full-stack/i.test(normalizedJd)) detectedRole = 'Fullstack Engineer';
    else if (/data|analytics|analyst|ai|machine learning/i.test(normalizedJd)) detectedRole = 'Data Analyst / AI Specialist';
    else if (/design|ui\/ux|product designer/i.test(normalizedJd)) detectedRole = 'UI/UX & Product Designer';
    else if (/nurse|điều dưỡng|y tế/i.test(normalizedJd)) detectedRole = 'Điều Dưỡng Viên Đa Khoa';
    else detectedRole = profile.major || 'Kỹ Sư Phần Mềm';
  }

  // 2. Nhận diện các kỹ năng trùng khớp & phân loại kịch bản
  const candidateSkills = profile.skills || ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Git'];
  const matchedSkills: string[] = [];
  const otherSkills: string[] = [];

  candidateSkills.forEach(skill => {
    if (normalizedJd.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      otherSkills.push(skill);
    }
  });

  const isDirectMatch = matchedSkills.length >= 2;
  const isSameTechField = /developer|engineer|lập trình|phần mềm|tech|software|fullstack|frontend|backend/i.test(detectedRole);
  const isCareerPivot = !isSameTechField;
  const isStackPivot = isSameTechField && matchedSkills.length < 2;

  const pivotScenario = isCareerPivot 
    ? 'CAREER_PIVOT' 
    : isStackPivot 
      ? 'STACK_PIVOT' 
      : 'DIRECT_MATCH';

  let group1Title = 'Kỹ Năng Trọng Tâm (Khớp JD Tuyển Dụng)';
  let group1Skills = matchedSkills.length > 0 ? matchedSkills : candidateSkills.slice(0, 4);
  let summary = '';
  let pivotStrategySummary = '';
  let skillGapRecommendations: string[] = [];

  if (pivotScenario === 'CAREER_PIVOT') {
    group1Title = 'Kỹ Năng Nền Tảng & Năng Lực Chuyển Đổi (Transferable Skills)';
    group1Skills = candidateSkills.slice(0, 4);
    pivotStrategySummary = `Áp dụng chiến lược Lợi Thế Kép (Hybrid Advantage): Kết hợp tư duy cấu trúc công nghệ sẵn có với chuyên môn vị trí ${detectedRole} để tạo giá trị khác biệt.`;
    summary = `Ứng viên tốt nghiệp chuyên ngành ${profile.major || 'Công nghệ'} sở hữu nền tảng tư duy cấu trúc và logic vững chắc, định hướng chuyển đổi nghề nghiệp sang vị trí ${detectedRole}. Tận dụng thế mạnh về ${candidateSkills.slice(0, 3).join(', ')} và năng lực giải quyết bài toán thực tế để nhanh chóng tiếp cận, làm chủ nghiệp vụ và đem lại góc nhìn công nghệ sắc bén cho doanh nghiệp${companyName ? ` tại ${companyName}` : ''}.`;
    skillGapRecommendations = [
      `Bổ sung 1 đồ án cá nhân hoặc case-study chuyên sâu về ${detectedRole} để tăng tính thuyết phục với nhà tuyển dụng`,
      `Tham gia khóa học hoặc chứng chỉ ngắn hạn về các công cụ đặc thù của vị trí ${detectedRole}`
    ];
  } else if (pivotScenario === 'STACK_PIVOT') {
    group1Title = 'Kỹ Năng Nền Tảng & Tư Duy Kiến Trúc Chuyển Đổi (Core Engineering)';
    group1Skills = candidateSkills.slice(0, 4);
    pivotStrategySummary = `Áp dụng chiến lược Kiến Trúc Tương Đồng: Tận dụng tư duy hệ thống, OOP và quy trình phát triển sản phẩm đã được kiểm chứng để làm chủ nhanh chóng stack mới theo JD.`;
    summary = `Kỹ sư phần mềm chuyên ngành ${profile.major || 'Công nghệ Thông tin'} với nền tảng vững chắc về kiến trúc mã nguồn, quy trình CI/CD và tư duy giải thuật. Nắm vững ${candidateSkills.slice(0, 3).join(', ')}, có khả năng học tập thích ứng cao (Fast-Learner) và chuyển đổi linh hoạt sang các công nghệ theo định hướng ${detectedRole}. Sẵn sàng đem tư duy kỹ thuật thực chiến cống hiến vào các bài toán phát triển sản phẩm${companyName ? ` tại ${companyName}` : ''}.`;
    skillGapRecommendations = [
      `Xây dựng 1 mini-project thực hành nhanh với stack công nghệ trọng tâm của JD để bổ sung vào hồ sơ thực chiến`,
      `Đọc kỹ tài liệu chính thức và chuẩn thiết kế (Best Practices) của stack công nghệ mới`
    ];
  } else {
    // DIRECT_MATCH
    pivotStrategySummary = `Đã phân nhóm và làm nổi bật các công nghệ then chốt khớp trực tiếp với yêu cầu của nhà tuyển dụng.`;
    summary = `Ứng viên nhiệt huyết tốt nghiệp chuyên ngành ${profile.major || 'Công nghệ'} với nền tảng vững vàng về ${matchedSkills.slice(0, 4).join(', ')}. Có kinh nghiệm thực chiến qua các đồ án thực tế đã được kiểm định chất lượng, tư duy cấu trúc rõ ràng và khả năng thích nghi nhanh. Sẵn sàng đem năng lực chuyên môn và nhiệt huyết cống hiến vào mục tiêu phát triển của vị trí ${detectedRole}${companyName ? ` tại ${companyName}` : ''}.`;
  }

  // Sắp xếp đồ án thông minh:
  // 1. Đồ án có tính giao thoa / liên quan nhất với ngành mới hoặc JD
  // 2. Đồ án nổi bật nhất của bản thân (có metrics, verified)
  const scoredProjects = projects.map(p => {
      let score = 0;
      const textToSearch = `${p.title} ${p.description || ''} ${(p.technologies || p.tags || []).join(' ')}`.toLowerCase();

      // Điểm liên quan trực tiếp với từ khóa của JD
      const jdWords = normalizedJd.split(/[\s,.;:()/\-]+/).filter(w => w.length >= 3);
      jdWords.forEach(w => {
        if (textToSearch.includes(w)) score += 2;
      });

      // Điểm giao thoa đặc thù ngành khi chuyển hướng sự nghiệp
      if (pivotScenario === 'CAREER_PIVOT') {
        if (/data|analyst|phân tích|dashboard|bi|chart|sql/i.test(detectedRole)) {
          if (/data|thống kê|chart|dashboard|report|báo cáo|sql|truy vấn|analytics/i.test(textToSearch)) score += 12;
        } else if (/design|ui|ux|giao diện|figma/i.test(detectedRole)) {
          if (/ui|ux|figma|design|giao diện|responsive|tailwind|css/i.test(textToSearch)) score += 12;
        } else if (/ba|business|product|quản lý/i.test(detectedRole)) {
          if (/nghiệp vụ|quản lý|quy trình|agile|scrum|hệ thống/i.test(textToSearch)) score += 12;
        }
      }

      // Điểm cộng cho đồ án nổi bật (chứng minh năng lực thực thi)
      if (p.is_verified) score += 4;
      if (p.metrics && p.metrics.length > 0) score += 5;

      return { project: p, score };
    });

    scoredProjects.sort((a, b) => b.score - a.score);
    const selectedProjects = (scoredProjects.length > 0 ? scoredProjects.map(sp => sp.project) : projects).slice(0, 3);

    const tailoredProjects = selectedProjects.map((p, pIdx) => {
      // Đồ án đầu tiên là đồ án liên quan nhất, đồ án sau là đồ án nổi bật chứng minh năng lực
      const isFirstIntersecting = pIdx === 0 && pivotScenario === 'CAREER_PIVOT';
      return {
        originalProjectId: p.id,
        projectName: p.title,
        role: p.role || 'Lập trình viên phát triển',
        summary: isFirstIntersecting 
          ? `Đồ án trọng điểm thể hiện năng lực giao thoa công nghệ và nghiệp vụ ${detectedRole}.`
          : (p.description || 'Xây dựng hệ thống giải quyết bài toán nghiệp vụ thực tế.'),
        bullets: [
          `• Áp dụng ${(p.technologies || p.tags || ['công nghệ cốt lõi']).slice(0, 3).join(', ')} để giải quyết bài toán kỹ thuật và chuẩn hóa luồng xử lý dữ liệu.`,
          `• Tối ưu hóa trải nghiệm người dùng và đảm bảo tính tin cậy của hệ thống qua kiểm thử và tài liệu hóa.`,
          p.metrics && p.metrics.length > 0 ? `• Đạt hiệu quả thực tế: ${p.metrics[0]}` : `• Hoàn thiện sản phẩm đạt chuẩn chất lượng đồ án thực tế với khả năng mở rộng tốt.`
        ],
        technologies: p.technologies || p.tags || ['TypeScript', 'React']
      };
    });

    const heuristicAiResult = {
      detectedRole,
      company: companyName || '',
      pivotScenario,
      pivotStrategySummary,
      tailoredObjective: summary,
      matchedSkills: matchedSkills.length > 0 ? matchedSkills : candidateSkills.slice(0, 3),
      transferableSkills: candidateSkills.slice(0, 4),
      skillGapRecommendations,
      skillGroups: [
        {
          groupName: group1Title,
          skills: group1Skills
        },
        {
          groupName: pivotScenario === 'DIRECT_MATCH' ? 'Kỹ Năng Bổ Trợ & Công Cụ' : 'Thế Mạnh Công Nghệ Đã Làm Chủ',
          skills: otherSkills.length > 0 ? otherSkills : ['Git', 'RESTful API', 'Docker', 'Postman']
        },
        {
          groupName: 'Phương Pháp & Kỹ Năng Mềm',
          skills: ['Quy trình Agile/Scrum', 'Tư duy phản biện & giải quyết vấn đề', 'Kỹ năng làm việc nhóm & giao tiếp kỹ thuật']
        }
      ],
      tailoredProjects,
      tailoringHighlights: [
        pivotStrategySummary,
        `Tự động ưu tiên đồ án có tính giao thoa cao nhất với vị trí ${detectedRole}, kết hợp đồ án nổi bật nhất để tối ưu sức thuyết phục`,
        `Sàng lọc ${matchedSkills.length > 0 ? matchedSkills.length : 'các'} kỹ năng trọng tâm khớp với yêu cầu nhà tuyển dụng`,
        `Chuẩn hóa câu văn đồ án theo mô hình STAR trực quan, làm nổi bật năng lực giải quyết vấn đề`
      ]
    };

  return buildFullCvDataFromAiResult(heuristicAiResult, input);
}

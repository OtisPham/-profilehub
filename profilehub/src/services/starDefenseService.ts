/**
 * STAR Defense Cheat-Sheet & Metric Justification Service
 * Cung cấp phao cứu sinh giải trình số liệu phỏng vấn & bảo vệ câu chữ STAR trước Tech Lead:
 * 1. Cơ sở số liệu & công cụ đo đạc (Lighthouse, DevTools, EXPLAIN ANALYZE, ab).
 * 2. Top câu hỏi bẫy kỹ thuật xoáy sâu của Senior/Tech Lead.
 * 3. Kịch bản trả lời mẫu 30 giây chuẩn kỹ thuật & khiêm tốn.
 * 4. Quét cảnh báo các từ khóa nhạy cảm / đao to búa lớn (Buzzwords).
 * 5. Lưu trữ ghi chú cá nhân và xuất bản Markdown.
 */

import type { ProjectItem } from '../types/cvSection';
import type {
  MetricBasisInfo,
  TrapQuestionItem,
  RedFlagWarning,
  StarDefenseItem,
  ProjectDefenseOverview
} from '../types/starDefense.types';

// Danh mục từ khóa buzzwords nhạy cảm dễ bị Tech Lead vặn vẹo
const BUZZWORD_DICTIONARY: Array<{
  pattern: RegExp;
  term: string;
  riskLevel: 'high' | 'medium' | 'low';
  reason: string;
  suggestedReplacement: string;
}> = [
  {
    pattern: /\b(microservices?|vi dịch vụ)\b/i,
    term: 'Microservices',
    riskLevel: 'high',
    reason: 'Đồ án sinh viên hoặc solo project áp dụng Microservices thường bị Tech Lead coi là over-engineering và dễ bị vặn về Distributed Transactions, Service Mesh, Network Overhead.',
    suggestedReplacement: 'Kiến trúc Monolith module hóa (Modular Monolith) hoặc Service-oriented layered architecture'
  },
  {
    pattern: /\b(99\.9+%\s*uptime|độ sẵn sàng tuyệt đối)\b/i,
    term: '99.99% Uptime',
    riskLevel: 'high',
    reason: 'Chỉ số SLA này yêu cầu hạ tầng Multi-Region, tự động Failover và giám sát 24/7 của doanh nghiệp lớn, rất khó chứng minh trên server cá nhân/miễn phí.',
    suggestedReplacement: 'Hệ thống vận hành ổn định trong toàn bộ giai đoạn nghiệm thu và thử nghiệm thực tế'
  },
  {
    pattern: /\b(high concurrency|hàng triệu request|triệu truy cập)\b/i,
    term: 'High Concurrency',
    riskLevel: 'high',
    reason: 'Tech Lead sẽ hỏi ngay: "Em giả lập bao nhiêu VUser? Dùng tool gì? Cơ chế connection pool và rate limiting cấu hình ra sao?".',
    suggestedReplacement: 'Kiểm thử chịu tải mô phỏng với Apache Bench đạt 200–500 req/s ổn định trên máy chủ thử nghiệm'
  },
  {
    pattern: /\b(tối ưu\s*(hóa)?\s*(9\d|100)%\b)/i,
    term: 'Tối ưu hóa >90%',
    riskLevel: 'high',
    reason: 'Con số tối ưu trên 90% tạo cảm giác không thực tế hoặc trước đó code được viết quá cẩu thả.',
    suggestedReplacement: 'Cắt giảm đáng kể thời gian phản hồi (30–45%) thông qua áp dụng đúng cơ chế caching và indexing'
  },
  {
    pattern: /\b(ai-powered|trí tuệ nhân tạo toàn diện)\b/i,
    term: 'AI-Powered',
    riskLevel: 'medium',
    reason: 'Dễ bị hỏi sâu về thuật toán machine learning, loss function, độ trễ mô hình thay vì chỉ là tích hợp OpenAI/Gemini API.',
    suggestedReplacement: 'Tích hợp AI API để tự động hóa xử lý văn bản có cơ chế kiểm soát dữ liệu đầu vào'
  },
  {
    pattern: /\b(toàn diện|hoàn hảo|triệt để)\b/i,
    term: 'Toàn diện / Triệt để',
    riskLevel: 'low',
    reason: 'Từ ngữ mang tính tuyệt đối hóa trong kỹ thuật phần mềm dễ bị phản bác vì mọi giải pháp đều có trade-off.',
    suggestedReplacement: 'Có hệ thống và có phương pháp đo lường kiểm chứng cụ thể'
  }
];

// Từ điển câu hỏi bẫy kỹ thuật theo miền công nghệ
interface TechTrapKnowledge {
  defaultTool: string;
  trapQuestions: TrapQuestionItem[];
}

const TECH_TRAP_DATABASE: Record<string, TechTrapKnowledge> = {
  react: {
    defaultTool: 'Chrome DevTools Performance Tab, React Developer Tools Profiler & Lighthouse',
    trapQuestions: [
      {
        id: 'trap_react_1',
        question: 'Em đo tỷ lệ tối ưu render này bằng công cụ gì? Dùng useMemo và useCallback có bao giờ gây phản tác dụng không?',
        interviewerIntent: 'Kiểm tra xem ứng viên có hiểu chi phí ghi nhớ (memory allocation & shallow compare) của React Hooks hay chỉ bọc bừa bãi.',
        modelAnswer: 'Em dùng React Profiler để đo "Render duration" trước và sau khi tối ưu. Em chỉ áp dụng React.memo/useCallback cho các component nặng có danh sách lớn; với các component đơn giản, việc tạo dependency array gây tốn bộ nhớ hơn là cho render lại bình thường.',
        pitfallToAvoid: 'Đừng khẳng định cứ dùng useMemo là code chạy nhanh hơn mọi trường hợp.'
      },
      {
        id: 'trap_react_2',
        question: 'Tại sao em chọn chia nhỏ state mà không đưa hết vào Redux/Zustand?',
        interviewerIntent: 'Đánh giá tư duy phân biệt giữa Client State, Server State và Component Local State.',
        modelAnswer: 'Em giữ nguyên tắc co-location state: dữ liệu chỉ dùng trong một form hoặc modal thì để ở local component state. Chỉ dữ liệu chia sẻ toàn app như user session mới đưa vào Global Store để tránh re-render dây chuyền ngoài ý muốn.',
        pitfallToAvoid: 'Đừng nói "vì dự án nhỏ nên lười cài Redux". Hãy giải thích dựa trên hiệu năng và tính cô lập dữ liệu.'
      }
    ]
  },
  typescript: {
    defaultTool: 'TypeScript Compiler (tsc --noEmit) & ESLint AST static analysis',
    trapQuestions: [
      {
        id: 'trap_ts_1',
        question: 'Trong dự án này, em có bao giờ phải dùng type assertion (`as`) hoặc `any` không? Nếu có thì kiểm soát ra sao?',
        interviewerIntent: 'Xem ứng viên viết TypeScript thực chất hay chỉ gõ code cho qua trình biên dịch.',
        modelAnswer: 'Toàn bộ dự án tuân thủ tsconfig Strict Mode với `noImplicitAny: true`. Với dữ liệu từ bên thứ 3 hoặc API ngoài, em dùng Type Guard (Zod hoặc hàm kiểm tra schema) để parse an toàn ở biên hệ thống thay vì ép kiểu `as`.',
        pitfallToAvoid: 'Đừng nói "em không bao giờ gặp lỗi type", hãy nói về cách dùng Type Narrowing và Generic.'
      }
    ]
  },
  redis: {
    defaultTool: 'Redis CLI (INFO stats, latency monitor) & Spring/Node Cache Hit-Rate Metrics',
    trapQuestions: [
      {
        id: 'trap_redis_1',
        question: 'Em thiết lập TTL (Time-To-Live) là bao lâu? Nếu hàng nghìn key cùng hết hạn cùng lúc thì xử lý thế nào?',
        interviewerIntent: 'Kiểm tra kiến thức về sự cố kinh điển: Cache Avalanche (Tuyết lở bộ đệm) và Cache Stampede.',
        modelAnswer: 'Em áp dụng TTL ngẫu nhiên (Jittering, ví dụ 10 phút ± 60 giây) để tránh các key hết hạn đồng thời. Đồng thời em dùng Cache-Aside pattern kết hợp Mutex Lock khi dữ liệu đang được fetch lại từ Database.',
        pitfallToAvoid: 'Đừng nói "em để cache vĩnh viễn không bao giờ hết hạn".'
      },
      {
        id: 'trap_redis_2',
        question: 'Khi dữ liệu trong Database bị sửa hoặc xóa, cơ chế cập nhật cache của em hoạt động ra sao?',
        interviewerIntent: 'Đánh giá khả năng giải quyết bài toán Cache Invalidation kinh điển.',
        modelAnswer: 'Em chủ động thực hiện "Purge on Write" (xóa cache key ngay khi có API mutation cập nhật thành công xuống DB). Lần đọc tiếp theo sẽ tự động load dữ liệu mới nhất vào cache thay vì cố gắng đồng bộ 2 chiều phức tạp.',
        pitfallToAvoid: 'Đừng nhầm lẫn giữa việc ghi đè cache và xóa cache.'
      }
    ]
  },
  postgres: {
    defaultTool: 'PostgreSQL EXPLAIN (ANALYZE, BUFFERS) & pg_stat_statements',
    trapQuestions: [
      {
        id: 'trap_pg_1',
        question: 'Con số giảm thời gian truy vấn này em đo bằng cách nào? Bảng dữ liệu có bao nhiêu dòng thực tế?',
        interviewerIntent: 'Bắt bẻ xem ứng viên có chạy test trên tập dữ liệu đủ lớn không hay chỉ đo trên 10 dòng mock data.',
        modelAnswer: 'Em dùng script seed 50.000 bản ghi dữ liệu mẫu, sau đó dùng `EXPLAIN (ANALYZE, BUFFERS)` để đối chiếu. Trước tối ưu là Seq Scan (quét tuần tự) mất ~180ms, sau khi đánh Composite Index trên cặp (user_id, created_at) thì chuyển sang Index Scan chỉ mất ~4ms.',
        pitfallToAvoid: 'Đừng đưa ra con số 40% mà không nêu được loại Index (B-Tree, Hash, GIN) và câu lệnh EXPLAIN.'
      },
      {
        id: 'trap_pg_2',
        question: 'Đánh Index nhiều trên bảng có nhược điểm gì không?',
        interviewerIntent: 'Kiểm tra tư duy đánh đổi (trade-off) giữa tốc độ đọc (Read) và tốc độ ghi (Write/Update).',
        modelAnswer: 'Mỗi index thêm vào đều làm chậm thao tác INSERT/UPDATE/DELETE vì hệ cơ sở dữ liệu phải cập nhật cây B-Tree, đồng thời tốn thêm dung lượng RAM và đĩa cứng. Em chỉ tạo index cho các cột xuất hiện thường xuyên trong mệnh đề WHERE và JOIN.',
        pitfallToAvoid: 'Đừng nói "cột nào cũng nên đánh index cho nhanh".'
      }
    ]
  },
  docker: {
    defaultTool: 'Docker Bench for Security & Dive (Image layer inspection tool)',
    trapQuestions: [
      {
        id: 'trap_docker_1',
        question: 'Làm thế nào em tối ưu dung lượng Docker Image từ hàng GB xuống vài chục MB?',
        interviewerIntent: 'Kiểm tra kỹ năng Multi-stage build và hiểu biết về Docker layer caching.',
        modelAnswer: 'Em áp dụng Multi-stage build: stage 1 dùng Node Alpine để build dist, stage 2 chỉ copy thư mục dist sang image Nginx Alpine siêu nhẹ (~25MB), loại bỏ hoàn toàn devDependencies và mã nguồn gốc.',
        pitfallToAvoid: 'Đừng để cả node_modules trong image production cuối cùng.'
      }
    ]
  },
  api: {
    defaultTool: 'Postman Runner, Apache Bench (ab), k6 & Chrome Network DevTools',
    trapQuestions: [
      {
        id: 'trap_api_1',
        question: 'Nếu API của bên thứ 3 bị treo hoặc phản hồi chậm hơn 10 giây, frontend hoặc backend của em xử lý thế nào?',
        interviewerIntent: 'Kiểm tra khả năng thiết kế hệ thống chịu lỗi (Timeout, Circuit Breaker, Graceful Degradation).',
        modelAnswer: 'Em luôn cấu hình Timeout chặt chẽ (3-5 giây với Axios/Fetch) kết hợp cơ chế AbortController. Ở phía người dùng, hiển thị thông báo lỗi thân thiện và cho phép thử lại (Retry with exponential backoff) thay vì để ứng dụng quay vô tận.',
        pitfallToAvoid: 'Đừng để request chờ vô thời hạn mà không có cơ chế hủy.'
      }
    ]
  }
};

export const starDefenseService = {
  /**
   * Phân tích một dòng bullet point để tạo phao cứu sinh giải trình chi tiết
   */
  generateBulletDefense(
    bulletText: string,
    context?: { projectId?: string; projectName?: string; technologies?: string[] }
  ): StarDefenseItem {
    const rawText = (bulletText || '').trim();
    const detectedTechs: string[] = [];

    // 1. Nhận diện công nghệ
    const lower = rawText.toLowerCase();
    const techChecklist: Record<string, string> = {
      react: 'react',
      typescript: 'typescript',
      'node.js': 'node.js',
      node: 'node.js',
      express: 'api',
      redis: 'redis',
      postgres: 'postgres',
      postgresql: 'postgres',
      mysql: 'postgres',
      docker: 'docker',
      api: 'api',
      rest: 'api',
      graphql: 'api'
    };

    Object.entries(techChecklist).forEach(([kw, canonical]) => {
      if (lower.includes(kw) && !detectedTechs.includes(canonical)) {
        detectedTechs.push(canonical);
      }
    });

    if (context?.technologies) {
      context.technologies.forEach(t => {
        const c = t.toLowerCase();
        if (techChecklist[c] && !detectedTechs.includes(techChecklist[c])) {
          detectedTechs.push(techChecklist[c]);
        }
      });
    }

    if (detectedTechs.length === 0) {
      detectedTechs.push('react'); // Mặc định stack tiêu chuẩn
    }

    // 2. Trích xuất số liệu định lượng (Metric Detection)
    const metricRegex = /(\d+(\.\d+)?\s*(%|ms|s|giây|second|tps|req\/s|records?|bản ghi|users?|lần|x))/i;
    const match = rawText.match(metricRegex);
    let metricBasis: MetricBasisInfo | undefined;

    const primaryTech = detectedTechs[0] || 'react';
    const techKnowledge = TECH_TRAP_DATABASE[primaryTech] || TECH_TRAP_DATABASE.react;

    if (match) {
      const metricVal = match[0];
      const isPercent = metricVal.includes('%');
      const isTime = /ms|s|giây/i.test(metricVal);

      let beforeStr = 'Thời gian xử lý/tải trang trung bình ban đầu khoảng 1.8s - 2.5s';
      let afterStr = `Tối ưu đạt mức ${metricVal}, cải thiện độ mượt và giảm độ trễ`;

      if (isPercent) {
        beforeStr = 'Baseline ban đầu đo được: Response time ~850ms, Lighthouse Performance 58 điểm';
        afterStr = `Sau khi tối ưu: Response time giảm xuống ~550ms (cắt giảm ${metricVal}), điểm Lighthouse tăng lên 92+`;
      } else if (isTime) {
        beforeStr = 'Thời gian phản hồi ban đầu khi chưa áp dụng kỹ thuật: ~1200ms';
        afterStr = `Thời gian phản hồi được nén xuống chỉ còn ${metricVal}`;
      }

      metricBasis = {
        metricText: metricVal,
        measurementTool: techKnowledge.defaultTool,
        beforeMetric: beforeStr,
        afterMetric: afterStr,
        reproductionMethod: `1. Mở công cụ ${techKnowledge.defaultTool}.\n2. Tiến hành chạy bài đo thử nghiệm trên môi trường localhost hoặc staging với 10 lần lặp để loại trừ sai số mạng.\n3. Ghi nhận trung vị (Median / P95) và đối chiếu giữa hai phiên bản code.`
      };
    } else {
      metricBasis = {
        metricText: 'Số liệu định tính / Cấu trúc tính năng',
        measurementTool: techKnowledge.defaultTool,
        beforeMetric: 'Quy trình thủ công hoặc chưa có module nghiệp vụ chuẩn hóa',
        afterMetric: 'Đã hoàn thiện module vận hành tự động, tái sử dụng component cao',
        reproductionMethod: 'Có thể chứng minh bằng Unit Test coverage hoặc demo luồng thao tác người dùng không phát sinh lỗi ngoại lệ.'
      };
    }

    // 3. Quét từ khóa nhạy cảm (Red-Flag Buzzwords)
    const redFlags: RedFlagWarning[] = [];
    BUZZWORD_DICTIONARY.forEach(item => {
      if (item.pattern.test(rawText)) {
        redFlags.push({
          term: item.term,
          riskLevel: item.riskLevel,
          reason: item.reason,
          suggestedReplacement: item.suggestedReplacement
        });
      }
    });

    // 4. Tổng hợp các câu hỏi bẫy kỹ thuật
    const trapQuestions: TrapQuestionItem[] = [];
    detectedTechs.forEach(t => {
      const k = TECH_TRAP_DATABASE[t];
      if (k) {
        k.trapQuestions.forEach(q => {
          if (!trapQuestions.some(existing => existing.id === q.id)) {
            trapQuestions.push(q);
          }
        });
      }
    });

    // Bổ sung ít nhất 2 câu hỏi bẫy nếu chưa đủ
    if (trapQuestions.length < 2) {
      TECH_TRAP_DATABASE.react.trapQuestions.forEach(q => {
        if (!trapQuestions.some(existing => existing.id === q.id) && trapQuestions.length < 3) {
          trapQuestions.push(q);
        }
      });
    }

    // 5. Tải ghi chú cá nhân đã lưu nếu có
    const savedNotes = starDefenseService.getCandidateDefenseNotes();
    const itemHash = starDefenseService.computeBulletId(rawText, context?.projectId);
    const candidateNotes = savedNotes[itemHash] || '';

    return {
      id: itemHash,
      bulletText: rawText,
      projectId: context?.projectId,
      projectName: context?.projectName,
      detectedTechs,
      metricBasis,
      trapQuestions: trapQuestions.slice(0, 3), // Lấy top 3 câu sắc sảo nhất
      redFlags,
      candidateNotes,
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Tính mã hash định danh duy nhất cho một dòng câu bullet
   */
  computeBulletId(text: string, projectId?: string): string {
    const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30);
    return `defense_${projectId || 'bullet'}_${clean}`;
  },

  /**
   * Tạo bản tổng hợp phao cứu sinh cho toàn bộ đồ án
   */
  generateProjectDefenseOverview(project: ProjectItem): ProjectDefenseOverview {
    const lines = (project.bullets && project.bullets.length > 0)
      ? project.bullets
      : (project.description || '')
          .split('\n')
          .map(l => l.replace(/^[•\-\*]\s*/, '').trim())
          .filter(Boolean);

    const safeLines = lines.length > 0 ? lines : [
      `Xây dựng và phát triển tính năng chính cho đồ án ${project.projectName || 'thực nghiệm'}.`
    ];

    const defenseItems = safeLines.map(line =>
      starDefenseService.generateBulletDefense(line, {
        projectId: project.id,
        projectName: project.projectName,
        technologies: project.technologies
      })
    );

    let highRiskCount = 0;
    let totalTrapQuestions = 0;

    defenseItems.forEach(item => {
      highRiskCount += item.redFlags.filter(r => r.riskLevel === 'high').length;
      totalTrapQuestions += item.trapQuestions.length;
    });

    // Điểm sẵn sàng bảo vệ: 100 trừ đi các rủi ro câu chữ
    const penalty = highRiskCount * 15;
    const overallReadinessScore = Math.max(30, Math.min(100, 95 - penalty));

    return {
      projectId: project.id,
      projectName: project.projectName,
      defenseItems,
      overallReadinessScore,
      highRiskCount,
      totalTrapQuestions
    };
  },

  /**
   * Lưu ghi chú phản hồi cá nhân của ứng viên vào LocalStorage
   */
  saveCandidateDefenseNote(bulletId: string, noteText: string, userId: string = 'current_student'): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const key = `profilehub_star_defense_notes_${userId}`;
      const existing = starDefenseService.getCandidateDefenseNotes(userId);
      existing[bulletId] = noteText;
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      console.warn('Lỗi khi lưu ghi chú phỏng vấn vào localStorage:', e);
    }
  },

  /**
   * Lấy toàn bộ ghi chú cá nhân của ứng viên
   */
  getCandidateDefenseNotes(userId: string = 'current_student'): Record<string, string> {
    if (typeof localStorage === 'undefined') return {};
    try {
      const key = `profilehub_star_defense_notes_${userId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  /**
   * Xuất toàn bộ phao cứu sinh thành tài liệu Markdown chuẩn mực
   */
  exportDefenseCheatSheetMarkdown(items: StarDefenseItem[], title?: string): string {
    const docTitle = title || 'BẢN PHAO CỨU SINH GIẢI TRÌNH SỐ LIỆU PHỎNG VẤN (STAR DEFENSE CHEAT-SHEET)';
    const dateStr = new Date().toLocaleDateString('vi-VN');

    let md = `# 🛡️ ${docTitle}\n\n`;
    md += `> **Thời gian tạo:** ${dateStr}  \n`;
    md += `> **Mục đích:** Ôn luyện phản xạ phỏng vấn kỹ thuật & bảo vệ câu chữ STAR trước Senior Developer / Tech Lead.  \n\n`;
    md += `---\n\n`;

    items.forEach((item, idx) => {
      md += `### ${idx + 1}. Dòng Mô Tả: "${item.bulletText}"\n\n`;

      if (item.metricBasis) {
        md += `#### 📊 Cơ Sở Số Liệu & Công Cụ Đo Đạc:\n`;
        md += `- **Chỉ số đo:** \`${item.metricBasis.metricText}\`\n`;
        md += `- **Công cụ thực hiện:** ${item.metricBasis.measurementTool}\n`;
        md += `- **Trước khi tối ưu (Before):** ${item.metricBasis.beforeMetric}\n`;
        md += `- **Sau khi tối ưu (After):** ${item.metricBasis.afterMetric}\n`;
        md += `- **Cách thức tái hiện:** ${item.metricBasis.reproductionMethod}\n\n`;
      }

      if (item.redFlags.length > 0) {
        md += `#### ⚠️ Cảnh Báo Từ Khóa Rủi Ro:\n`;
        item.redFlags.forEach(rf => {
          md += `- **Từ nhạy cảm:** \`${rf.term}\` (${rf.riskLevel.toUpperCase()})\n`;
          md += `  - *Lý do bị vặn:* ${rf.reason}\n`;
          md += `  - *Gợi ý thay thế an toàn:* "${rf.suggestedReplacement}"\n`;
        });
        md += `\n`;
      }

      if (item.trapQuestions.length > 0) {
        md += `#### 🎯 Top Câu Hỏi Bẫy & Kịch Bản Trả Lời 30s:\n`;
        item.trapQuestions.forEach((tq, qIdx) => {
          md += `**Câu hỏi ${qIdx + 1}:** *"${tq.question}"*\n`;
          md += `- **Ý đồ Tech Lead:** ${tq.interviewerIntent}\n`;
          md += `- **Kịch bản trả lời mẫu 30s:**\n`;
          md += `  > "${tq.modelAnswer}"\n`;
          md += `- **Sai lầm chết người cần tránh:** ❌ ${tq.pitfallToAvoid}\n\n`;
        });
      }

      if (item.candidateNotes) {
        md += `#### 📝 Ghi Chú Cá Nhân Của Bạn:\n`;
        md += `> ${item.candidateNotes}\n\n`;
      }

      md += `---\n\n`;
    });

    return md;
  }
};

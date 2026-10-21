/**
 * Project Technical Defense Briefing Service
 * Huấn luyện ứng viên bản lĩnh phòng thủ đồ án trước Senior Developer / Tech Lead:
 * 1. Top 3 câu hỏi xoáy (Trap Questions) dựa trên Tech Stack thực tế.
 * 2. Khung giải trình Trade-off công nghệ (Tại sao chọn A mà không chọn B).
 * 3. Kịch bản gỡ lỗi thực chiến (Debugging & Incident Story) giúp ghi điểm chuyên nghiệp.
 * 4. Điểm hạn chế kỹ thuật nên chủ động thừa nhận (Known Limitations).
 */

import type { ProjectItem } from '../types/cvSection';

export interface DefenseQuestion {
  question: string;
  trapContext: string;
  recommendedAngle: string;
}

export interface TradeOffInsight {
  technology: string;
  comparedTo: string;
  defenseReason: string;
}

export interface ProjectDefensePlan {
  projectId: string;
  projectName: string;
  targetRole?: string;
  trapQuestions: DefenseQuestion[];
  tradeOffs: TradeOffInsight[];
  debuggingStoryScaffold: {
    situation: string;
    rootCause: string;
    resolution: string;
    takeaway: string;
  };
  knownLimitations: string[];
}

// Bảng từ điển tri thức câu hỏi bẫy kỹ thuật theo từng công nghệ
const TECH_TRAP_MATRIX: Record<string, { questions: DefenseQuestion[]; tradeOffs: TradeOffInsight[] }> = {
  react: {
    questions: [
      {
        question: 'Làm thế nào để bạn phát hiện và tối ưu tình trạng thừa re-render trong các component phức tạp?',
        trapContext: 'Tech Lead muốn kiểm tra bạn có hiểu sâu về Virtual DOM, useMemo, useCallback hay chỉ bọc bừa bãi.',
        recommendedAngle: 'Chia sẻ việc dùng React DevTools Profiler để đo lường render time trước khi tối ưu, giải thích rõ khi nào memo hóa thực sự có lợi.'
      },
      {
        question: 'Tại sao bạn chọn giải pháp quản lý state này thay vì các thư viện khác?',
        trapContext: 'Kiểm tra xem bạn có bị phụ thuộc vào Redux/Zustand theo thói quen hay hiểu đúng bài toán.',
        recommendedAngle: 'Phân định rõ server state (React Query) và client state cục bộ (useState), tránh đưa toàn bộ dữ liệu vào global store.'
      }
    ],
    tradeOffs: [
      {
        technology: 'React',
        comparedTo: 'Vue / Angular',
        defenseReason: 'Hệ sinh thái thư viện khổng lồ, tính linh hoạt cao trong thiết kế component và kiểm soát luồng dữ liệu 1 chiều (unidirectional data flow).'
      }
    ]
  },
  'node.js': {
    questions: [
      {
        question: 'Nếu có một tác vụ tính toán CPU-heavy làm nghẽn Event Loop của Node.js, bạn sẽ xử lý thế nào?',
        trapContext: 'Tech Lead kiểm tra bạn có hiểu kiến trúc Single-threaded và cơ chế non-blocking I/O không.',
        recommendedAngle: 'Nêu giải pháp offload tác vụ nặng sang Worker Threads, tách microservice độc lập hoặc dùng Background Queue (BullMQ/RabbitMQ).'
      }
    ],
    tradeOffs: [
      {
        technology: 'Node.js',
        comparedTo: 'Java Spring / Golang',
        defenseReason: 'Tốc độ phát triển I/O-intensive nhanh chóng, chia sẻ code TypeScript giữa client và server, tối ưu tài nguyên cho các ứng dụng RESTful thời gian thực.'
      }
    ]
  },
  postgresql: {
    questions: [
      {
        question: 'Khi bảng dữ liệu tăng lên hàng triệu dòng và truy vấn bắt đầu chậm, bạn dùng công cụ gì để chẩn đoán và khắc phục?',
        trapContext: 'Phát hiện ứng viên chỉ biết viết SELECT mà không biết đọc Execution Plan (EXPLAIN ANALYZE).',
        recommendedAngle: 'Dùng EXPLAIN (ANALYZE, BUFFERS) để kiểm tra Sequential Scan vs Index Scan, đánh giá tạo B-Tree / Composite Index phù hợp với WHERE clause.'
      }
    ],
    tradeOffs: [
      {
        technology: 'PostgreSQL',
        comparedTo: 'MongoDB',
        defenseReason: 'Đảm bảo tính toàn vẹn dữ liệu tuyệt đối (ACID compliance), hỗ trợ quan hệ khóa ngoại phức tạp và khả năng lưu trữ linh hoạt cả JSONB khi cần mở rộng.'
      }
    ]
  },
  redis: {
    questions: [
      {
        question: 'Chiến lược xóa cache (Cache Invalidation) của bạn hoạt động như thế nào khi dữ liệu gốc thay đổi?',
        trapContext: 'Người ta thường nói: "Chỉ có 2 điều khó trong Computer Science: Cache invalidation và đặt tên biến".',
        recommendedAngle: 'Áp dụng Cache-Aside pattern kết hợp thiết lập Time-To-Live (TTL) ngắn hạn và chủ động purge cache key khi có mutation event.'
      }
    ],
    tradeOffs: [
      {
        technology: 'Redis',
        comparedTo: 'In-Memory Cache cục bộ',
        defenseReason: 'Cho phép chia sẻ bộ nhớ đệm tập trung giữa nhiều instance server, hỗ trợ các cấu trúc dữ liệu nâng cao (Hashes, Sorted Sets) và pub/sub.'
      }
    ]
  },
  docker: {
    questions: [
      {
        question: 'Bạn đã làm những gì để tối ưu kích thước Docker Image và tốc độ build trong CI/CD?',
        trapContext: 'Kiểm tra bạn có biết viết Dockerfile chuẩn production hay chỉ copy file mẫu 1GB.',
        recommendedAngle: 'Sử dụng Multi-stage builds, chọn Alpine / Distroless base image nhẹ, tận dụng layer caching hiệu quả cho file dependency.'
      }
    ],
    tradeOffs: [
      {
        technology: 'Docker',
        comparedTo: 'Chạy trực tiếp trên VM / Bare Metal',
        defenseReason: 'Đảm bảo môi trường phát triển (Dev) đồng nhất 100% với môi trường kiểm thử (Staging) và triển khai (Production), loại bỏ hoàn toàn lỗi "chạy được trên máy em".'
      }
    ]
  }
};

export const projectDefenseService = {
  /**
   * Sinh bản kế hoạch phòng thủ kỹ thuật cho 1 đồ án
   */
  generateDefenseBriefing(project: ProjectItem, targetRole?: string): ProjectDefensePlan {
    const projName = project.projectName || 'Dự án không tên';
    const techs = (project.technologies || []).map(t => t.toLowerCase());

    const trapQuestions: DefenseQuestion[] = [];
    const tradeOffs: TradeOffInsight[] = [];

    // 1. Quét tìm câu hỏi bẫy theo từng công nghệ có trong đồ án
    for (const [techKey, data] of Object.entries(TECH_TRAP_MATRIX)) {
      if (techs.some(t => t.includes(techKey) || techKey.includes(t))) {
        trapQuestions.push(...data.questions);
        tradeOffs.push(...data.tradeOffs);
      }
    }

    // Nếu không khớp công nghệ trong từ điển, cung cấp bộ câu hỏi cấu trúc kiến trúc chuẩn
    if (trapQuestions.length === 0) {
      trapQuestions.push(
        {
          question: `Kiến trúc tổng thể của ${projName} được tổ chức như thế nào và đâu là nút thắt cổ chai tiềm ẩn (bottleneck)?`,
          trapContext: 'Tech Lead muốn kiểm tra tầm nhìn bao quát của bạn về luồng dữ liệu giữa các module.',
          recommendedAngle: 'Vẽ nhanh sơ đồ luồng dữ liệu (Client -> API Gateway -> Service -> DB), chỉ ra điểm chịu tải lớn nhất và cách bạn dự phòng.'
        },
        {
          question: 'Nếu lượng người dùng đồng thời tăng gấp 10 lần, phần nào của hệ thống này sẽ sụp đổ đầu tiên?',
          trapContext: 'Đánh giá tư duy mở rộng (scalability) và khả năng nhìn nhận giới hạn kỹ thuật của ứng viên.',
          recommendedAngle: 'Thừa nhận giới hạn tài nguyên ở CSDL hoặc băng thông, đề xuất giải pháp bổ sung Caching và Load Balancing.'
        }
      );

      tradeOffs.push({
        technology: (project.technologies || [])[0] || 'Kiến trúc hiện tại',
        comparedTo: 'Các giải pháp thay thế',
        defenseReason: 'Phù hợp nhất với thời gian thực hiện đồ án, tận dụng tối đa thế mạnh thành thạo của nhóm và đáp ứng đúng phạm vi bài toán.'
      });
    }

    // Giới hạn tối đa 3-4 câu hỏi trọng tâm nhất để ứng viên không bị ngợp
    const finalQuestions = trapQuestions.slice(0, 3);
    const finalTradeOffs = tradeOffs.slice(0, 2);

    // 2. Xây dựng kịch bản Bug nhớ đời (Debugging Story Scaffold)
    const primaryTech = (project.technologies || [])[0] || 'hệ thống';
    const debuggingStoryScaffold = {
      situation: `Trong quá trình phát triển tính năng cốt lõi cho ${projName}, hệ thống gặp sự cố bất ngờ khi xử lý dữ liệu phức tạp.`,
      rootCause: `Sau khi theo dõi logs và tái hiện lỗi, tôi phát hiện nguyên nhân bắt nguồn từ việc xử lý bất đồng bộ hoặc xung đột cấu hình dữ liệu trên ${primaryTech}.`,
      resolution: `Tôi đã viết lại logic xử lý lỗi, bổ sung kiểm tra biên (boundary validation) và viết thêm test case tự động để ngăn chặn tái phát.`,
      takeaway: `Bài học lớn nhất là luôn log có ngữ cảnh rõ ràng và không bao giờ giả định dữ liệu đầu vào luôn hoàn hảo.`
    };

    // 3. Khai báo điểm hạn chế kỹ thuật nên chủ động thừa nhận (Known Limitations)
    const knownLimitations = [
      `Dự án hiện tại chưa triển khai đầy đủ bộ kiểm thử tự động (Unit / Integration Tests) cho toàn bộ các ca kiểm thử biên.`,
      `Chưa áp dụng cơ chế xử lý hàng đợi bất đồng bộ (Message Queue) khi xử lý khối lượng lớn tác vụ nặng, hiện tại vẫn xử lý theo luồng trực tiếp.`
    ];

    return {
      projectId: project.id,
      projectName: projName,
      targetRole: targetRole || project.role || 'Developer',
      trapQuestions: finalQuestions,
      tradeOffs: finalTradeOffs,
      debuggingStoryScaffold,
      knownLimitations
    };
  }
};

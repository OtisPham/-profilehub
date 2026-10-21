import { describe, it, expect } from 'vitest';
import { projectDefenseService } from './projectDefenseService';
import type { ProjectItem } from '../types/cvSection';

describe('Tầng Dịch Vụ: Project Technical Defense Briefing (Trụ Cột 3)', () => {
  const backendProject: ProjectItem = {
    id: 'proj_ecommerce_core',
    projectName: 'Hệ thống E-Commerce Microservices',
    role: 'Backend Node.js Developer',
    startDate: '2025-01',
    endDate: '2025-06',
    technologies: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    description: 'Thiết kế REST API xử lý giao dịch đơn hàng và cache danh mục sản phẩm.',
    projectUrl: 'https://ecommerce.dev',
    githubUrl: 'https://github.com/student/ecommerce'
  };

  const frontendProject: ProjectItem = {
    id: 'proj_frontend_portal',
    projectName: 'Cổng Quản Trị Khách Hàng',
    role: 'Frontend Developer',
    startDate: '2025-02',
    endDate: '2025-05',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    description: 'Xây dựng giao diện Dashboard tương tác người dùng mượt mà.'
  };

  it('TC-DEF-01: Sinh câu hỏi bẫy kỹ thuật bám sát đúng Tech Stack của đồ án', () => {
    const defense = projectDefenseService.generateDefenseBriefing(backendProject, 'Backend Engineer');

    expect(defense.projectId).toBe(backendProject.id);
    expect(defense.projectName).toBe('Hệ thống E-Commerce Microservices');
    expect(defense.trapQuestions.length).toBeGreaterThanOrEqual(1);
    expect(defense.trapQuestions.length).toBeLessThanOrEqual(3);

    // Phải có câu hỏi liên quan đến Node.js Event Loop, PostgreSQL indexing hoặc Redis cache
    const allQuestionsText = defense.trapQuestions.map(q => q.question + ' ' + q.trapContext).join(' ');
    expect(allQuestionsText).toMatch(/Event Loop|re-render|EXPLAIN|cache|tối ưu|truy vấn/i);
  });

  it('TC-DEF-02: Cung cấp bản giải trình Trade-off công nghệ có căn cứ', () => {
    const defense = projectDefenseService.generateDefenseBriefing(backendProject);

    expect(defense.tradeOffs.length).toBeGreaterThan(0);
    const postgresTradeOff = defense.tradeOffs.find(t => t.technology.toLowerCase().includes('postgresql') || t.technology.toLowerCase().includes('node.js'));
    expect(postgresTradeOff).toBeDefined();
    expect(postgresTradeOff?.defenseReason).toBeDefined();
  });

  it('TC-DEF-03: Cung cấp khung kịch bản gỡ lỗi (Debugging Scaffold) và Điểm hạn chế nên thừa nhận', () => {
    const defense = projectDefenseService.generateDefenseBriefing(frontendProject, 'Frontend React Developer');

    // Kịch bản gỡ lỗi phải có đủ 4 pha (Tình huống -> Nguyên nhân -> Giải pháp -> Bài học)
    expect(defense.debuggingStoryScaffold.situation).toContain('Cổng Quản Trị Khách Hàng');
    expect(defense.debuggingStoryScaffold.rootCause).toBeDefined();
    expect(defense.debuggingStoryScaffold.resolution).toBeDefined();
    expect(defense.debuggingStoryScaffold.takeaway).toBeDefined();

    // Điểm hạn chế phải có ít nhất 1-2 ý để ứng viên thừa nhận trung thực
    expect(defense.knownLimitations.length).toBeGreaterThanOrEqual(2);
  });

  it('TC-DEF-04: Xử lý an toàn khi đồ án có công nghệ lạ không nằm trong từ điển', () => {
    const customProject: ProjectItem = {
      id: 'proj_embedded',
      projectName: 'Hệ thống IoT Nhúng STM32',
      role: 'Embedded Developer',
      startDate: '2024-09',
      endDate: '2024-12',
      technologies: ['C/C++', 'FreeRTOS', 'I2C'],
      description: 'Lập trình firmware đo nhiệt độ và truyền dữ liệu qua giao thức MQTT.'
    };

    const defense = projectDefenseService.generateDefenseBriefing(customProject);

    expect(defense.trapQuestions.length).toBeGreaterThan(0);
    // Vẫn có câu hỏi về kiến trúc tổng thể và khả năng chịu tải
    expect(defense.trapQuestions[0].question).toContain('Hệ thống IoT Nhúng STM32');
    expect(defense.tradeOffs.length).toBeGreaterThan(0);
  });
});

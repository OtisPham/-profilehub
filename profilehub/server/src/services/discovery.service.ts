import crypto from 'crypto';

export const discoveryService = {
  async processMessage(sessionId: string, message: string) {
    const simulatedFacts: any[] = [];
    const lower = message.toLowerCase();

    if (lower.includes('react') || lower.includes('frontend') || lower.includes('web')) {
      simulatedFacts.push({
        id: crypto.randomUUID(),
        temp_id: `fact_${Date.now()}`,
        intent: 'add',
        entity_type: 'project',
        data: {
          title: 'Dự án Frontend Web Application',
          techStack: ['React', 'TypeScript', 'TailwindCSS'],
          context: 'Xây dựng giao diện ứng dụng web tối ưu trải nghiệm người dùng',
        },
        confidence: 'high',
        status: 'pending',
        created_at: new Date().toISOString(),
      });
    }

    const reply = `Tôi đã ghi nhận định hướng của bạn: "${message}". Dựa trên thông tin này, hệ thống đã trích xuất các kỹ năng & đồ án phù hợp vào hồ sơ của bạn.`;

    return {
      reply,
      facts: simulatedFacts,
      updatedDNA: {
        lastAnalyzedAt: new Date().toISOString(),
      },
    };
  },
};

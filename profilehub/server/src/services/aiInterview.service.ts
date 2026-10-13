import { supabase } from '../config/supabase.js';
import type { Project, JobPost } from '../types/index.js';
import { gemini } from './llm.service.js';
import { ENV } from '../config/env.js';

export interface TailoredQuestion {
  id: string;
  projectId?: string;
  projectTitle?: string;
  jobId?: string;
  jobTitle?: string;
  category: string;
  question: string;
  sampleAnswer: string;
  keyPoints: string[];
}

export interface AIEvaluationResult {
  score: number;
  grade: 'Xuất Sắc' | 'Tốt' | 'Khá' | 'Cần Cải Thiện';
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
}

export const aiInterviewService = {
  async fetchVerifiedProjects(studentId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('student_id', studentId);

      if (error || !data || data.length === 0) {
        return [
          {
            id: 'p-verified-1',
            student_id: studentId,
            title: 'PROFILEHUB - Nền Tảng Portfolio & Xác Thực Bằng Cấp',
            description: 'Hệ thống quản lý hồ sơ sinh viên, xác thực đồ án với Giảng viên và kết nối AI tuyển dụng.',
            is_verified: true,
            verification_status: 'verified',
            tags: ['ReactJS', 'TypeScript', 'Supabase', 'TailwindCSS'],
            project_type: 'Đồ Án Tốt Nghiệp',
            score: '9.5',
          },
        ];
      }

      return data
        .filter((p) => p.is_verified || p.verification_status === 'verified')
        .map((p) => ({ ...p, tags: p.tags || [] }));
    } catch {
      return [];
    }
  },

  async generateTailoredQuestionsAsync(project?: Project, job?: JobPost): Promise<TailoredQuestion[]> {
    const pTitle = project?.title || 'Đồ án Chuyên ngành của bạn';
    const pTags = project?.tags?.join(', ') || 'ReactJS, TypeScript, REST API';
    const jTitle = job?.title || 'Vị trí ứng tuyển';
    const jSkills = job?.required_skills?.join(', ') || 'Kỹ năng chuyên môn';

    if (ENV.GEMINI_API_KEY) {
      try {
        const prompt = `Dựa vào đồ án của sinh viên và tin tuyển dụng của doanh nghiệp:
- Đồ án: "${pTitle}" (Công nghệ: ${pTags}, Mô tả: ${project?.description || 'N/A'})
- Vị trí ứng tuyển (JD): "${jTitle}" (Yêu cầu kỹ năng: ${jSkills})

Hãy sinh ra 2 câu hỏi phỏng vấn đào sâu năng lực thực chiến theo phương pháp STAR.`;

        const toolSpec = {
          name: 'generate_interview_questions',
          description: 'Sinh danh sách câu hỏi phỏng vấn cá nhân hoá',
          input_schema: {
            type: 'object',
            properties: {
              questions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    category: { type: 'string' },
                    question: { type: 'string' },
                    sampleAnswer: { type: 'string' },
                    keyPoints: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                  required: ['category', 'question', 'sampleAnswer', 'keyPoints'],
                },
              },
            },
            required: ['questions'],
          },
        };

        const result: any = await gemini.callTool({
          model: ENV.GEMINI_MODEL || 'gemini-2.5-flash',
          system: 'Bạn là Senior Technical Interviewer. Hãy sinh câu hỏi phỏng vấn chuẩn, sắc bén bám sát đồ án và JD.',
          messages: [{ role: 'user', content: prompt }],
          maxTokens: 1000,
          temperature: 0.4,
          tool: toolSpec,
        });

        if (result?.questions && Array.isArray(result.questions) && result.questions.length > 0) {
          return result.questions.map((q: any, idx: number) => ({
            id: `q-gemini-${Date.now()}-${idx}`,
            projectId: project?.id,
            projectTitle: pTitle,
            jobId: job?.id,
            jobTitle: jTitle,
            category: q.category || '🔎 Phỏng Vấn Chuyên Sâu',
            question: q.question,
            sampleAnswer: q.sampleAnswer,
            keyPoints: q.keyPoints || [],
          }));
        }
      } catch (err) {
        console.error('Gemini generate questions failed, falling back to rule-based:', err);
      }
    }

    return this.generateTailoredQuestions(project, job);
  },

  generateTailoredQuestions(project?: Project, job?: JobPost): TailoredQuestion[] {
    const pTitle = project?.title || 'Đồ án Chuyên ngành của bạn';
    const pTags = project?.tags?.join(', ') || 'ReactJS, TypeScript, REST API';
    const jTitle = job?.title || 'Vị trí ứng tuyển';
    const jSkills = job?.required_skills?.join(', ') || 'Kỹ năng chuyên môn';

    return [
      {
        id: `q-tailored-1-${Date.now()}`,
        projectId: project?.id,
        projectTitle: pTitle,
        jobId: job?.id,
        jobTitle: jTitle,
        category: '🔎 Thiết Kế Kiến Trúc Đồ Án Verified',
        question: `Trong đồ án "${pTitle}" (sử dụng ${pTags}), bạn đã tổ chức cấu trúc thư mục và quản lý luồng dữ liệu như thế nào để đảm bảo tính mở rộng cho "${jTitle}"?`,
        sampleAnswer: `Tôi chia ứng dụng thành các module độc lập: Presentation Layer, Business Logic, và Data Access. State được quản lý tập trung bằng Context API / Zustand, giúp dễ bảo trì và mở rộng khi quy mô ứng dụng lớn hơn.`,
        keyPoints: [
          'Cấu trúc dự án theo Layered Architecture',
          'Phân tách UI và Logic',
          'Quản lý State tập trung',
          'Tối ưu kết nối API',
        ],
      },
      {
        id: `q-tailored-2-${Date.now()}`,
        projectId: project?.id,
        projectTitle: pTitle,
        jobId: job?.id,
        jobTitle: jTitle,
        category: '⚡ Tình Huống Xử Lý Sự Cố & Tối Ưu',
        question: `Theo JD vị trí "${jTitle}", yêu cầu kỹ năng: [${jSkills}]. Hãy chia sẻ 1 thách thức kỹ thuật lớn nhất bạn gặp phải khi phát triển "${pTitle}" và cách giải quyết?`,
        sampleAnswer: `Thách thức lớn nhất là tối ưu tốc độ tải trang khi dữ liệu lớn. Tôi đã áp dụng Lazy Loading, kết hợp Pagination và Caching ở phía Frontend, giảm 40% thời gian tải trang.`,
        keyPoints: [
          'Mô tả sự cố cụ thể',
          'Cách phân tích nguyên nhân gốc rễ (Root cause)',
          'Giải pháp áp dụng (Lazy load, Caching...)',
          'Kết quả đo lường được',
        ],
      },
    ];
  },

  async evaluateStudentAnswerAsync(question: TailoredQuestion, answerText: string): Promise<AIEvaluationResult> {
    if (ENV.GEMINI_API_KEY && answerText.trim().length > 10) {
      try {
        const prompt = `Đánh giá câu trả lời phỏng vấn của ứng viên:
- Câu hỏi: "${question.question}"
- Các ý trọng tâm mong đợi: ${JSON.stringify(question.keyPoints)}
- Câu trả lời của ứng viên: "${answerText}"

Hãy chấm điểm từ 0 đến 100, chỉ ra điểm mạnh, điểm cần cải thiện và đưa ra gợi ý câu trả lời mẫu xuất sắc.`;

        const toolSpec = {
          name: 'evaluate_interview_answer',
          description: 'Đánh giá câu trả lời phỏng vấn',
          input_schema: {
            type: 'object',
            properties: {
              score: { type: 'number' },
              grade: { type: 'string', enum: ['Xuất Sắc', 'Tốt', 'Khá', 'Cần Cải Thiện'] },
              strengths: { type: 'array', items: { type: 'string' } },
              improvements: { type: 'array', items: { type: 'string' } },
              sampleAnswer: { type: 'string' },
            },
            required: ['score', 'grade', 'strengths', 'improvements', 'sampleAnswer'],
          },
        };

        const result: any = await gemini.callTool({
          model: ENV.GEMINI_MODEL || 'gemini-2.5-flash',
          system: 'Bạn là Chuyên gia Đánh giá Phỏng vấn Tuyển dụng. Hãy đánh giá công tâm, chính xác và xây dựng.',
          messages: [{ role: 'user', content: prompt }],
          maxTokens: 1000,
          temperature: 0.2,
          tool: toolSpec,
        });

        if (result?.score !== undefined) {
          return {
            score: Math.round(result.score),
            grade: result.grade || (result.score >= 85 ? 'Xuất Sắc' : result.score >= 75 ? 'Tốt' : result.score >= 60 ? 'Khá' : 'Cần Cải Thiện'),
            strengths: result.strengths || [],
            improvements: result.improvements || [],
            sampleAnswer: result.sampleAnswer || question.sampleAnswer,
          };
        }
      } catch (err) {
        console.error('Gemini evaluate answer failed, falling back to rule-based:', err);
      }
    }

    return this.evaluateStudentAnswer(question, answerText);
  },

  evaluateStudentAnswer(question: TailoredQuestion, answerText: string): AIEvaluationResult {
    const text = answerText.trim().toLowerCase();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    if (wordCount < 10) {
      return {
        score: 40,
        grade: 'Cần Cải Thiện',
        strengths: ['Đã có câu trả lời bước đầu'],
        improvements: [
          'Câu trả lời quá ngắn gọn. Cần giải thích chi tiết hơn về các bước thực hiện và công nghệ.',
          'Thiếu các ví dụ cụ thể từ đồ án thực tế.',
        ],
        sampleAnswer: question.sampleAnswer,
      };
    }

    let matchedPointsCount = 0;
    const strengths: string[] = [];
    const improvements: string[] = [];

    question.keyPoints.forEach((kp) => {
      const keywords = kp.toLowerCase().split(' ');
      const match = keywords.some((kw) => kw.length > 3 && text.includes(kw));
      if (match) {
        matchedPointsCount++;
        strengths.push(`Nêu được ý trọng tâm: "${kp}"`);
      } else {
        improvements.push(`Nên bổ sung thêm phân tích về: "${kp}"`);
      }
    });

    const baseScore = Math.min(50 + (matchedPointsCount / question.keyPoints.length) * 40 + Math.min(wordCount, 50) * 0.2, 98);
    const score = Math.round(baseScore);

    let grade: AIEvaluationResult['grade'] = 'Khá';
    if (score >= 85) grade = 'Xuất Sắc';
    else if (score >= 75) grade = 'Tốt';
    else if (score >= 60) grade = 'Khá';
    else grade = 'Cần Cải Thiện';

    return {
      score,
      grade,
      strengths: strengths.length ? strengths : ['Trình bày trôi chảy, đúng cú pháp'],
      improvements,
      sampleAnswer: question.sampleAnswer,
    };
  },
};

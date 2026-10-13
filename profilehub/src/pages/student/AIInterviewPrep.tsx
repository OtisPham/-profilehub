import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import {
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Award,
  RotateCcw,
  Lightbulb,
  Send,
  ShieldCheck,
  Briefcase,
  Zap,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Star,
  Building,
  Flame,
  ChevronRight,
  FileText,
  Target,
  Cpu,
  Clock,
  HelpCircle,
  TrendingUp,
  Sliders,
  Check
} from 'lucide-react';
import {
  fetchVerifiedProjects,
  fetchRecruiterJobs,
  generate4StageInterviewSession,
  evaluateStudentAnswer,
  generateFinalInterviewReport,
  type StageQuestion,
  type StageEvaluation,
  type ComprehensiveInterviewReport,
  type CandidateLevel
} from '../../services/aiInterviewService';
import { fetchStudentFeedbacks, analyzeStudentBlindSpots, type BlindSpotAnalysis } from '../../services/feedbackService';
import type { Project, JobPost, InterviewFeedback } from '../../types/database';
import AIProjectRecommenderWidget from '../../components/student/AIProjectRecommenderWidget';
import AILevelCalibrationCard from '../../components/student/AILevelCalibrationCard';

interface StandardQuestionItem {
  id: string;
  category: string;
  question: string;
  sampleAnswer: string;
  keyPoints: string[];
}

export default function AIInterviewPrep() {
  const { user } = useAuth();

  // Mode Selection: 'ai_4stage' | 'standard' | 'blind_spot'
  const [activeMode, setActiveMode] = useState<'ai_4stage' | 'standard' | 'blind_spot'>('ai_4stage');

  // ==========================================
  // 🚀 MODE 1: AI 4-STAGE INTERVIEW PRACTICE ENGINE (v2.0)
  // ==========================================
  const [verifiedProjects, setVerifiedProjects] = useState<Project[]>([]);
  const [recruiterJobs, setRecruiterJobs] = useState<JobPost[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [selectedCandidateLevel, setSelectedCandidateLevel] = useState<CandidateLevel>('Fresher');

  const [stageQuestions, setStageQuestions] = useState<StageQuestion[]>([]);
  const [stageIndex, setStageIndex] = useState(0);
  const [currentStageAnswer, setCurrentStageAnswer] = useState('');
  const [stageAnswers, setStageAnswers] = useState<Record<string, string>>({});
  const [stageEvaluations, setStageEvaluations] = useState<Record<string, StageEvaluation>>({});

  // Follow-up Probing (AI Hỏi Xoáy)
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [followUpEvaluations, setFollowUpEvaluations] = useState<Record<string, string>>({});

  const [isGeneratingSession, setIsGeneratingSession] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [completed4StageSession, setCompleted4StageSession] = useState(false);
  const [finalReport, setFinalReport] = useState<ComprehensiveInterviewReport | null>(null);

  // Practice Timer
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // ==========================================
  // 📚 MODE 2: STANDARD QUESTION BANK
  // ==========================================
  const [selectedRole, setSelectedRole] = useState<'frontend' | 'uiux' | 'backend' | 'data'>('frontend');
  const [standardIndex, setStandardIndex] = useState(0);
  const [standardUserAnswer, setStandardUserAnswer] = useState('');
  const [standardSubmittedAnswers, setStandardSubmittedAnswers] = useState<Record<string, string>>({});
  const [showStandardSample, setShowStandardSample] = useState(false);
  const [completedStandardSession, setCompletedStandardSession] = useState(false);

  // ==========================================
  // 📊 MODE 3: RECRUITER FEEDBACK & BLIND SPOTS
  // ==========================================
  const [feedbacks, setFeedbacks] = useState<InterviewFeedback[]>([]);
  const [blindSpotReport, setBlindSpotReport] = useState<BlindSpotAnalysis | null>(null);

  // Standard Question Banks
  const standardQuestionBanks: Record<string, StandardQuestionItem[]> = {
    frontend: [
      {
        id: 'fe-1',
        category: 'Kỹ Thuật Core',
        question: 'Bạn hãy giải thích sự khác biệt giữa Virtual DOM và Real DOM trong ReactJS? Khi nào React re-render?',
        sampleAnswer: 'Virtual DOM là một bản sao nhẹ nằm trong bộ nhớ của Real DOM. Khi state thay đổi, React tạo ra một Virtual DOM tree mới, so sánh (Diffing Algorithm) với bản cũ và chỉ cập nhật những phần thay đổi thực sự lên Real DOM (Reconciliation), giúp tối ưu hiệu năng.',
        keyPoints: ['Khái niệm Virtual DOM & Memory', 'Thuật toán Diffing Algorithm', 'Khái niệm Reconciliation', 'Cách React tránh render không cần thiết (React.memo, useMemo)']
      },
      {
        id: 'fe-2',
        category: 'Tối Ưu Hiệu Năng',
        question: 'Làm thế nào để bạn tối ưu tốc độ tải trang (Page Load Speed) cho ứng dụng React/Web?',
        sampleAnswer: 'Tôi tối ưu bằng cách áp dụng Code Splitting (React.lazy/Suspense), nén & lazy load hình ảnh, tối ưu bundle size, tận dụng browser caching, và hạn chế re-render thừa bằng useMemo/useCallback.',
        keyPoints: ['Code Splitting & Lazy loading', 'Image Optimization', 'Bundle analysis', 'Memoization']
      },
      {
        id: 'fe-3',
        category: 'Quản Lý Trạng Thái',
        question: 'Khi nào bạn nên dùng Redux/Zustand thay vì React Context API?',
        sampleAnswer: 'React Context phù hợp cho dữ liệu ít thay đổi như Theme, Auth state. Khi ứng dụng có state phức tạp, tần suất cập nhật cao và cần devtools debug nhiều component độc lập, Zustand/Redux sẽ hiệu quả hơn để tránh re-render toàn bộ provider.',
        keyPoints: ['Tần suất re-render của Context', 'State phức tạp & Async actions', 'Redux DevTools debugging']
      }
    ],
    uiux: [
      {
        id: 'ux-1',
        category: 'Quy Trình Thiết Kế',
        question: 'Bạn áp dụng quy trình Design Thinking như thế nào khi bắt đầu một dự án mới?',
        sampleAnswer: 'Tôi tuân theo 5 bước: Empathize (Thấu hiểu người dùng qua phỏng vấn/survey), Define (Xác định đúng bài toán), Ideate (Sáng tạo giải pháp), Prototype (Tạo bản vẽ wireframe/Figma) và Test (Thử nghiệm với người dùng thật).',
        keyPoints: ['5 bước Design Thinking', 'User Research methodology', 'Iterative Prototyping']
      },
      {
        id: 'ux-2',
        category: 'Design System',
        question: 'Làm thế nào bạn xây dựng và duy trì một Design System đồng bộ cho đội ngũ phát triển?',
        sampleAnswer: 'Tôi xây dựng bộ Color Tokens, Typography, Spacing Grid và Reusable Components trên Figma, đóng gói theo chuẩn DESIGN.md và phối hợp chặt chẽ với Frontend Dev để đồng bộ component library.',
        keyPoints: ['Design Tokens', 'Reusable Components', 'Đồng bộ Figma với Code']
      }
    ],
    backend: [
      {
        id: 'be-1',
        category: 'Cơ Sở Dữ Liệu',
        question: 'Bạn xử lý bài toán N+1 Query trong ORM/Database như thế nào?',
        sampleAnswer: 'Lỗi N+1 xảy ra khi truy vấn dữ liệu quan hệ trong vòng lặp. Tôi khắc phục bằng cách áp dụng Eager Loading (JOIN / include) hoặc Dataloader để gộp truy vấn thành 1 câu SQL duy nhất.',
        keyPoints: ['Nguyên nhân N+1 query', 'Eager Loading vs Lazy Loading', 'JOIN / Dataloader']
      },
      {
        id: 'be-2',
        category: 'Bảo Mật API',
        question: 'Làm sao để bảo mật các API Endpoints chống lại tấn công SQL Injection và XSS?',
        sampleAnswer: 'Dùng Parameterized Queries / ORM để chống SQL Injection, Validate & Sanitize toàn bộ input đầu vào, và cài đặt JWT Token cùng CORS policy cho API.',
        keyPoints: ['Parameterized Query', 'Input Sanitization', 'JWT Authentication & CORS']
      }
    ],
    data: [
      {
        id: 'da-1',
        category: 'Phân Tích Dữ Liệu',
        question: 'Khi dữ liệu đầu vào bị thiếu (Missing Values), bạn xử lý như thế nào?',
        sampleAnswer: 'Tùy thuộc tỷ lệ thiếu: nếu ít có thể điền bằng Mean/Median/Mode hoặc dùng mô hình KNN Imputer. Nếu thiếu quá nhiều (>50%) có thể xem xét loại bỏ biến hoặc tạo biến cờ báo thiếu.',
        keyPoints: ['Imputation techniques (Mean/Median)', 'KNN Imputer', 'Đánh giá tỷ lệ mất dữ liệu']
      }
    ]
  };

  // Load Data on Mount
  useEffect(() => {
    const loadInitialData = async () => {
      if (user?.id) {
        const projects = await fetchVerifiedProjects(user.id);
        setVerifiedProjects(projects);
        if (projects.length > 0) setSelectedProjectId(projects[0].id);

        const fbs = await fetchStudentFeedbacks(user.id);
        setFeedbacks(fbs);
        setBlindSpotReport(analyzeStudentBlindSpots(fbs));
      }
      const jobs = await fetchRecruiterJobs();
      setRecruiterJobs(jobs);
      if (jobs.length > 0) setSelectedJobId(jobs[0].id);
    };
    loadInitialData();
  }, [user?.id]);

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timerSeconds]);

  // Handle Starting 4-Stage Interview Session
  const handleStart4StageSession = () => {
    setIsGeneratingSession(true);
    const targetProject = verifiedProjects.find(p => p.id === selectedProjectId) || verifiedProjects[0];
    const targetJob = recruiterJobs.find(j => j.id === selectedJobId) || recruiterJobs[0];

    const questions = generate4StageInterviewSession(targetProject, targetJob);
    setStageQuestions(questions);
    setStageIndex(0);
    setCurrentStageAnswer('');
    setStageAnswers({});
    setStageEvaluations({});
    setFollowUpAnswer('');
    setFollowUpEvaluations({});
    setCompleted4StageSession(false);
    setFinalReport(null);
    setTimerSeconds(90);
    setIsTimerActive(true);
    setIsGeneratingSession(false);
  };

  // Evaluate Current Stage Answer
  const handleEvaluateCurrentStage = () => {
    const currentQ = stageQuestions[stageIndex];
    if (!currentQ || !currentStageAnswer.trim()) return;

    setIsEvaluating(true);
    const evalResult = evaluateStudentAnswer(currentQ, currentStageAnswer, false);

    setStageAnswers(prev => ({ ...prev, [currentQ.id]: currentStageAnswer }));
    setStageEvaluations(prev => ({ ...prev, [currentQ.id]: evalResult }));
    setIsEvaluating(false);
  };

  // Submit Follow-up Probe Answer
  const handleAnswerFollowUp = () => {
    const currentQ = stageQuestions[stageIndex];
    if (!currentQ || !followUpAnswer.trim()) return;

    setFollowUpEvaluations(prev => ({
      ...prev,
      [currentQ.id]: followUpAnswer
    }));

    // Bonus score boost for answering follow-up
    const currentEval = stageEvaluations[currentQ.id];
    if (currentEval) {
      const updatedScore = Math.min(100, currentEval.score + 10);
      const updatedEval: StageEvaluation = {
        ...currentEval,
        score: updatedScore,
        grade: updatedScore >= 85 ? 'Xuất Sắc' : updatedScore >= 75 ? 'Tốt' : 'Khá',
        strengths: [...currentEval.strengths, 'Đã phản xạ và làm rõ chi tiết kỹ thuật qua câu hỏi xoáy (Follow-up Probe).'],
        needsFollowUp: false
      };
      setStageEvaluations(prev => ({ ...prev, [currentQ.id]: updatedEval }));
    }
  };

  // Move to next stage
  const handleNextStage = () => {
    const nextIdx = stageIndex + 1;
    if (nextIdx < stageQuestions.length) {
      setStageIndex(nextIdx);
      setCurrentStageAnswer(stageAnswers[stageQuestions[nextIdx]?.id] || '');
      setFollowUpAnswer(followUpEvaluations[stageQuestions[nextIdx]?.id] || '');
      setTimerSeconds(90);
      setIsTimerActive(true);
    } else {
      // Complete 4-stage interview & generate final comprehensive report
      const targetJob = recruiterJobs.find(j => j.id === selectedJobId);
      const report = generateFinalInterviewReport(
        stageQuestions,
        stageAnswers,
        stageEvaluations,
        selectedCandidateLevel,
        targetJob
      );
      setFinalReport(report);
      setCompleted4StageSession(true);
      setIsTimerActive(false);
    }
  };

  // Standard Mode Handlers
  const standardQuestions = standardQuestionBanks[selectedRole] || standardQuestionBanks.frontend;
  const currentStandardQ = standardQuestions[standardIndex] || standardQuestions[0];

  const handleNextStandard = () => {
    if (standardIndex < standardQuestions.length - 1) {
      setStandardIndex(standardIndex + 1);
      setStandardUserAnswer(standardSubmittedAnswers[standardQuestions[standardIndex + 1]?.id] || '');
      setShowStandardSample(false);
    } else {
      setCompletedStandardSession(true);
    }
  };

  const handlePrevStandard = () => {
    if (standardIndex > 0) {
      setStandardIndex(standardIndex - 1);
      setStandardUserAnswer(standardSubmittedAnswers[standardQuestions[standardIndex - 1]?.id] || '');
      setShowStandardSample(false);
    }
  };

  const currentQ = stageQuestions[stageIndex];
  const currentEval = currentQ ? stageEvaluations[currentQ.id] : null;

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1120px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Top Header */}
      <div style={{ marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#4f46e5', letterSpacing: '1px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#4f46e5" /> AI ADAPTIVE INTERVIEW ENGINE (FRAMEWORK V2.0)
          </div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '26px', color: '#0f172a', fontWeight: '800' }}>
            Phòng Luyện Phỏng Vấn AI Thích Ứng & Phân Tích Điểm Mù
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Mô phỏng phỏng vấn 4 chặng từ Đồ án Verified & JD thực tế: Pitching ➔ Quyết định kiến trúc ➔ Xử lý sự cố Live Crash ➔ Bào chữa lỗ hổng kỹ năng.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            to="/mock-interview"
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#4f46e5',
              backgroundColor: '#eef2ff',
              padding: '7px 14px',
              borderRadius: '20px',
              border: '1px solid #c7d2fe',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📜 Xem Lịch Sử Phỏng Vấn
          </Link>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a8a', backgroundColor: '#eff6ff', padding: '7px 14px', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
            👨‍🎓 {user?.email || 'Student User'}
          </span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            setActiveMode('ai_4stage');
            if (stageQuestions.length === 0) handleStart4StageSession();
          }}
          style={{
            flex: 1.2,
            minWidth: '220px',
            padding: '14px 16px',
            borderRadius: '10px',
            border: activeMode === 'ai_4stage' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
            backgroundColor: activeMode === 'ai_4stage' ? '#f5f3ff' : 'white',
            color: activeMode === 'ai_4stage' ? '#4338ca' : '#475569',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: activeMode === 'ai_4stage' ? '0 3px 10px rgba(79, 70, 229, 0.15)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Zap size={16} color="#4f46e5" /> 🎯 AI Phỏng Vấn Thích Ứng 4 Chặng (Mới)
        </button>

        <button
          onClick={() => setActiveMode('standard')}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '14px 16px',
            borderRadius: '10px',
            border: activeMode === 'standard' ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
            backgroundColor: activeMode === 'standard' ? '#eff6ff' : 'white',
            color: activeMode === 'standard' ? '#1e3a8a' : '#475569',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: activeMode === 'standard' ? '0 2px 8px rgba(30, 58, 138, 0.15)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <BookOpen size={16} color="#1e3a8a" /> 📚 Câu Hỏi Chuẩn Theo Ngành
        </button>

        <button
          onClick={() => setActiveMode('blind_spot')}
          style={{
            flex: 1,
            minWidth: '220px',
            padding: '14px 16px',
            borderRadius: '10px',
            border: activeMode === 'blind_spot' ? '2px solid #059669' : '1px solid #cbd5e1',
            backgroundColor: activeMode === 'blind_spot' ? '#ecfdf5' : 'white',
            color: activeMode === 'blind_spot' ? '#047857' : '#475569',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: activeMode === 'blind_spot' ? '0 2px 8px rgba(5, 150, 105, 0.15)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <BarChart3 size={16} color="#059669" /> 📊 Báo Cáo Điểm Mù & Feedback Loop
        </button>
      </div>

      {/* ======================================================== */}
      {/* 🚀 MODE 1: AI 4-STAGE INTERVIEW PRACTICE ROOM           */}
      {/* ======================================================== */}
      {activeMode === 'ai_4stage' && (
        <div>
          {/* Target Configuration Panel */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '22px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                <Sliders size={18} color="#4f46e5" /> Cấu Hình Đối Sánh Đồ Án Verified & Mục Tiêu JD Tuyển Dụng
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '12px' }}>
                Hệ thống sẽ bóc tách sâu Stack & Chỉ số đo lường
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              {/* Select Verified Project */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="#059669" /> Đồ Án Verified Của Bạn:
                </label>
                <select
                  value={selectedProjectId}
                  onChange={e => setSelectedProjectId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#f8fafc', color: '#0f172a' }}
                >
                  {verifiedProjects.map(proj => (
                    <option key={proj.id} value={proj.id}>
                      🛡️ {proj.title} ({proj.tags?.join(', ') || 'Web Project'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Initial CV Level */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={15} color="#2563eb" /> Cấp Bậc CV Ban Đầu (Level):
                </label>
                <select
                  value={selectedCandidateLevel}
                  onChange={e => setSelectedCandidateLevel(e.target.value as CandidateLevel)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#f8fafc', color: '#0f172a' }}
                >
                  <option value="Intern">🌱 Intern (Thực tập sinh)</option>
                  <option value="Fresher">🎓 Fresher (Mới tốt nghiệp)</option>
                  <option value="Junior">⚡ Junior (1 - 2 năm kinh nghiệm)</option>
                  <option value="Mid-Level">🚀 Mid-Level (2 - 4 năm kinh nghiệm)</option>
                  <option value="Senior">👑 Senior (4+ năm kinh nghiệm)</option>
                </select>
              </div>

              {/* Select Recruiter JD */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={15} color="#4f46e5" /> Tin Tuyển Dụng Target:
                </label>
                <select
                  value={selectedJobId}
                  onChange={e => setSelectedJobId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#f8fafc', color: '#0f172a' }}
                >
                  {recruiterJobs.map(job => (
                    <option key={job.id} value={job.id}>
                      🏢 {job.title} - {job.location || 'Hybrid'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleStart4StageSession}
              disabled={isGeneratingSession}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)'
              }}
            >
              <Sparkles size={18} /> {isGeneratingSession ? 'AI Đang Bóc Tách Đồ Án & Thiết Lập 4 Chặng...' : '🚀 Bắt Đầu Phiên Phỏng Vấn Thích Ứng 4 Chặng'}
            </button>
          </div>

          {!completed4StageSession && stageQuestions.length > 0 && currentQ ? (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              
              {/* 4-Stage Visual Stepper Header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
                {stageQuestions.map((q, idx) => {
                  const isCurrent = idx === stageIndex;
                  const isDone = Boolean(stageEvaluations[q.id]);
                  return (
                    <div
                      key={q.id}
                      onClick={() => {
                        if (isDone || idx <= stageIndex) {
                          setStageIndex(idx);
                          setCurrentStageAnswer(stageAnswers[q.id] || '');
                          setFollowUpAnswer(followUpEvaluations[q.id] || '');
                        }
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: isCurrent ? '2px solid #4f46e5' : isDone ? '1px solid #86efac' : '1px solid #e2e8f0',
                        backgroundColor: isCurrent ? '#f5f3ff' : isDone ? '#f0fdf4' : '#f8fafc',
                        cursor: (isDone || idx <= stageIndex) ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: isCurrent ? '#4338ca' : isDone ? '#15803d' : '#94a3b8' }}>
                          CHẶNG {idx + 1}
                        </span>
                        {isDone ? (
                          <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#15803d', backgroundColor: '#dcfce7', padding: '1px 6px', borderRadius: '10px' }}>
                            ✓ {stageEvaluations[q.id]?.score}đ
                          </span>
                        ) : isCurrent ? (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'inline-block' }} />
                        ) : null}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: isCurrent ? '#1e1b4b' : isDone ? '#166534' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {idx === 0 ? '🎯 Pitching' : idx === 1 ? '📐 Kiến Trúc' : idx === 2 ? '🚨 Sự Cố Crash' : '🛡️ Gap Defense'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stage Title & Timer Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4338ca', backgroundColor: '#e0e7ff', padding: '5px 12px', borderRadius: '6px', border: '1px solid #c7d2fe' }}>
                    {currentQ.stageBadge}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>
                    Chặng {stageIndex + 1}/4: {currentQ.category}
                  </span>
                </div>

                {/* 90s Countdown Timer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: timerSeconds < 20 ? '#fee2e2' : '#f1f5f9', padding: '5px 12px', borderRadius: '20px', border: timerSeconds < 20 ? '1px solid #fca5a5' : '1px solid #e2e8f0' }}>
                  <Clock size={15} color={timerSeconds < 20 ? '#dc2626' : '#475569'} />
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: timerSeconds < 20 ? '#dc2626' : '#334155' }}>
                    Thời gian chuẩn: {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => setIsTimerActive(!isTimerActive)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#6366f1', textDecoration: 'underline', padding: 0 }}
                  >
                    {isTimerActive ? 'Tạm dừng' : 'Chạy tiếp'}
                  </button>
                </div>
              </div>

              {/* Dynamic Question Body */}
              <div style={{ backgroundColor: '#f8fafc', padding: '18px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '16px', color: '#0f172a', margin: '0 0 10px 0', lineHeight: '1.6', fontWeight: '700' }}>
                  {currentQ.question}
                </h2>
                <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'flex-start', gap: '6px', backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                  <Lightbulb size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Gợi ý phỏng vấn viên:</strong> {currentQ.contextPrompt}
                  </div>
                </div>
              </div>

              {/* STAR Answer Input Textarea */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={16} color="#4f46e5" /> Câu trả lời của bạn (Khuyên dùng cấu trúc STAR):
                  </label>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {currentStageAnswer.trim().split(/\s+/).filter(Boolean).length} từ
                  </span>
                </div>
                <textarea
                  rows={6}
                  placeholder="Ví dụ theo STAR: 
- Situation: Bối cảnh dự án, bài toán cần giải quyết...
- Task: Nhiệm vụ chính bạn chịu trách nhiệm...
- Action: Giải pháp kỹ thuật, công nghệ và trade-off bạn đã chọn...
- Result: Kết quả đo lường cụ thể (tốc độ ms, tỷ lệ % giảm tải, trải nghiệm)..."
                  value={currentStageAnswer}
                  onChange={e => setCurrentStageAnswer(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    lineHeight: '1.6',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '10px' }}>
                <button
                  onClick={() => {
                    if (stageIndex > 0) {
                      setStageIndex(stageIndex - 1);
                      setCurrentStageAnswer(stageAnswers[stageQuestions[stageIndex - 1]?.id] || '');
                      setFollowUpAnswer(followUpEvaluations[stageQuestions[stageIndex - 1]?.id] || '');
                    }
                  }}
                  disabled={stageIndex === 0}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'white',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    cursor: stageIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: stageIndex === 0 ? 0.5 : 1,
                    fontWeight: 'bold',
                    fontSize: '13px',
                    color: '#475569'
                  }}
                >
                  ← Chặng trước
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleEvaluateCurrentStage}
                    disabled={isEvaluating || !currentStageAnswer.trim()}
                    style={{
                      padding: '10px 18px',
                      backgroundColor: '#f5f3ff',
                      color: '#4f46e5',
                      border: '1px solid #ddd6fe',
                      borderRadius: '8px',
                      cursor: (!currentStageAnswer.trim() || isEvaluating) ? 'not-allowed' : 'pointer',
                      opacity: (!currentStageAnswer.trim() || isEvaluating) ? 0.6 : 1,
                      fontWeight: 'bold',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Zap size={15} color="#4f46e5" /> {isEvaluating ? 'AI Đang Chấm STAR...' : '⚡ Chấm Điểm STAR & Phản Xạ Ngay'}
                  </button>

                  <button
                    onClick={handleNextStage}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {stageIndex === stageQuestions.length - 1 ? 'Hoàn Thành & Xem Báo Cáo 5 Trục →' : 'Tiếp Theo (Chặng Kế) →'}
                  </button>
                </div>
              </div>

              {/* Instant Evaluation Card */}
              {currentEval && (
                <div style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '22px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#4338ca', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} color="#4f46e5" /> Kết Quả Đánh Giá Chặng {stageIndex + 1}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#581c87', backgroundColor: '#f3e8ff', padding: '4px 10px', borderRadius: '12px' }}>
                        Xếp loại: {currentEval.grade}
                      </span>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: '#4338ca', backgroundColor: 'white', border: '1px solid #c7d2fe', padding: '4px 12px', borderRadius: '12px' }}>
                        {currentEval.score} / 100 Điểm
                      </span>
                    </div>
                  </div>

                  {/* STAR Breakdown Mini Bars */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px', backgroundColor: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Situation & Task (Bối cảnh)</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{currentEval.starBreakdown.situationTask}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Action Taken (Hành động)</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{currentEval.starBreakdown.actionTaken}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Result Metrics (Chỉ số)</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{currentEval.starBreakdown.resultMetrics}%</div>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#15803d', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={15} /> Điểm mạnh ghi nhận:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#166534', lineHeight: '1.5' }}>
                      {currentEval.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#b45309', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={15} /> Góp ý hoàn thiện:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#92400e', lineHeight: '1.5' }}>
                      {currentEval.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Dynamic Follow-up Probing Banner (Hỏi Xoáy) */}
                  {currentEval.needsFollowUp && currentEval.followUpQuestion && (
                    <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#c2410c', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Flame size={16} color="#ea580c" /> 🎯 AI Hỏi Xoáy Thách Thức (Follow-up Probing):
                      </div>
                      <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#7c2d12', fontWeight: '600', lineHeight: '1.5' }}>
                        "{currentEval.followUpQuestion}"
                      </p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Trả lời câu hỏi xoáy để được cộng điểm kỹ thuật (+10đ)..."
                          value={followUpAnswer}
                          onChange={e => setFollowUpAnswer(e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #fdba74', fontSize: '13px' }}
                        />
                        <button
                          onClick={handleAnswerFollowUp}
                          disabled={!followUpAnswer.trim()}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: '#ea580c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: followUpAnswer.trim() ? 'pointer' : 'not-allowed',
                            opacity: followUpAnswer.trim() ? 1 : 0.6
                          }}
                        >
                          Gửi Phản Hồi
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Benchmark Senior Answer */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#4338ca', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Lightbulb size={15} /> Đáp án mẫu chuẩn Senior:
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#334155', backgroundColor: 'white', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e9d5ff', lineHeight: '1.6' }}>
                      {currentEval.sampleAnswer}
                    </p>
                  </div>

                </div>
              )}

            </div>
          ) : null}

          {/* ======================================================== */}
          {/* 📊 FINAL COMPREHENSIVE 5-AXIS RADAR REPORT              */}
          {/* ======================================================== */}
          {completed4StageSession && finalReport && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              
              {/* Verdict Header */}
              <div style={{ textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f5f3ff', color: '#4f46e5', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 14px auto' }}>
                  <Award size={34} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#6366f1', letterSpacing: '1px', marginBottom: '4px' }}>
                  BÁO CÁO PHỎNG VẤN THÍCH ỨNG 4 CHẶNG HOÀN TẤT
                </div>
                <h2 style={{ fontSize: '24px', color: '#0f172a', margin: '0 0 10px 0', fontWeight: '800' }}>
                  Kết Quả Tổng Thể: <span style={{ color: finalReport.verdictColor }}>{finalReport.verdict}</span> ({finalReport.overallScore}/100 Điểm)
                </h2>
                <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                  {finalReport.summaryConclusion}
                </p>
              </div>

              {/* 5-Axis Radar Matrix Bars */}
              <div style={{ backgroundColor: '#f8fafc', padding: '22px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="#4f46e5" /> Biểu Đồ 5 Trục Năng Lực Phỏng Vấn (5-Axis Competency Matrix)
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { label: '1. Kỹ thuật chuyên môn cốt lõi (Core Technical)', score: finalReport.radarScores.coreTechnical, icon: Cpu, color: '#4f46e5' },
                    { label: '2. Nắm chắc & bảo vệ đồ án (Project Grounding)', score: finalReport.radarScores.projectGrounding, icon: ShieldCheck, color: '#059669' },
                    { label: '3. Phản xạ sự cố & khủng hoảng (Crisis Incident)', score: finalReport.radarScores.crisisIncident, icon: Flame, color: '#ea580c' },
                    { label: '4. Giao tiếp mạch lạc chuẩn STAR (Communication)', score: finalReport.radarScores.starCommunication, icon: MessageSquare, color: '#0284c7' },
                    { label: '5. Tinh thần học hỏi & bù đắp lỗ hổng (Growth Mindset)', score: finalReport.radarScores.growthMindset, icon: TrendingUp, color: '#8b5cf6' },
                  ].map((axis, i) => (
                    <div key={i} style={{ backgroundColor: 'white', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <axis.icon size={14} color={axis.color} /> {axis.label}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: axis.color }}>{axis.score}/100</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${axis.score}%`, height: '100%', backgroundColor: axis.color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Post-Interview Level Calibration Card */}
              {finalReport.levelCalibration && (
                <AILevelCalibrationCard
                  calibration={finalReport.levelCalibration}
                  candidateName={user?.email || 'Sinh Viên'}
                />
              )}

              {/* Stage-by-stage Review Cards */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="#4f46e5" /> Chi Tiết Câu Trả Lời & Đáp Án Mẫu 4 Chặng
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {finalReport.stageResults.map((st, idx) => (
                    <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#4338ca' }}>
                          {st.stageTitle}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#15803d', backgroundColor: '#dcfce7', padding: '3px 8px', borderRadius: '6px' }}>
                          {st.score}đ - {st.grade}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                        ❓ {st.question}
                      </div>
                      <div style={{ fontSize: '12px', color: '#334155', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', marginBottom: '8px' }}>
                        <strong>Câu trả lời của bạn:</strong> {st.userAnswer}
                      </div>
                      <div style={{ fontSize: '12px', color: '#047857', backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                        <strong>💡 Benchmark Senior:</strong> {st.benchmarkAnswer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Steps */}
              <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Target size={16} /> Các Bước Hành Động Cải Thiện Đề Xuất Từ AI:
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#0c4a6e', lineHeight: '1.6' }}>
                  {finalReport.nextActionSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleStart4StageSession}
                  style={{
                    padding: '11px 22px',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCcw size={15} /> Luyện Tập Lại Phiên Này
                </button>
                <Link
                  to="/mock-interview"
                  style={{
                    padding: '11px 22px',
                    backgroundColor: 'white',
                    color: '#4f46e5',
                    border: '1px solid #c7d2fe',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  📜 Lưu Vào Lịch Sử Phỏng Vấn
                </Link>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* 📚 MODE 2: STANDARD QUESTION BANK (INDUSTRY)            */}
      {/* ======================================================== */}
      {activeMode === 'standard' && (
        <>
          {/* Role Selector Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', backgroundColor: 'white', padding: '8px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            {[
              { id: 'frontend', label: '💻 Frontend Developer' },
              { id: 'uiux', label: '🎨 UI/UX Designer' },
              { id: 'backend', label: '⚙️ Backend Developer' },
              { id: 'data', label: '📊 Data Analyst' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedRole(tab.id as 'frontend' | 'uiux' | 'backend' | 'data');
                  setStandardIndex(0);
                  setStandardUserAnswer('');
                  setShowStandardSample(false);
                  setCompletedStandardSession(false);
                }}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: selectedRole === tab.id ? '#1e3a8a' : 'transparent',
                  color: selectedRole === tab.id ? 'white' : '#475569',
                  fontWeight: selectedRole === tab.id ? 'bold' : 'normal',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {!completedStandardSession ? (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#3b82f6', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '6px' }}>
                  {currentStandardQ.category}
                </span>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                  Câu hỏi {standardIndex + 1} / {standardQuestions.length}
                </span>
              </div>

              <h2 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '20px', lineHeight: '1.5' }}>
                {currentStandardQ.question}
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={16} /> Câu trả lời của bạn:
                </label>
                <textarea
                  rows={5}
                  placeholder="Nhập câu trả lời của bạn tại đây..."
                  value={standardUserAnswer}
                  onChange={e => setStandardUserAnswer(e.target.value)}
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', lineHeight: '1.5' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <button
                  onClick={handlePrevStandard}
                  disabled={standardIndex === 0}
                  style={{ padding: '10px 18px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: standardIndex === 0 ? 'not-allowed' : 'pointer', opacity: standardIndex === 0 ? 0.5 : 1, fontWeight: 'bold', fontSize: '13px', color: '#475569' }}
                >
                  ← Câu trước
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setStandardSubmittedAnswers(prev => ({ ...prev, [currentStandardQ.id]: standardUserAnswer }));
                      setShowStandardSample(true);
                    }}
                    style={{ padding: '10px 18px', backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Send size={15} /> Kiểm tra & Xem gợi ý đáp án
                  </button>
                  <button
                    onClick={handleNextStandard}
                    style={{ padding: '10px 20px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {standardIndex === standardQuestions.length - 1 ? 'Hoàn thành phiên' : 'Câu tiếp theo →'}
                  </button>
                </div>
              </div>

              {showStandardSample && (
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginTop: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#059669', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lightbulb size={18} /> Gợi Ý Đáp Án Mẫu & Điểm Trọng Tâm Từ AI:
                  </div>
                  <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6', marginBottom: '15px', backgroundColor: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    {currentStandardQ.sampleAnswer}
                  </p>

                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>📌 Các Ý Chính Cần Có Trong Câu Trả Lời:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {currentStandardQ.keyPoints.map((point, idx) => (
                      <span key={idx} style={{ fontSize: '12px', padding: '4px 10px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> {point}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto' }}>
                <Award size={32} />
              </div>
              <h2 style={{ fontSize: '22px', color: '#0f172a', margin: '0 0 10px 0' }}>Hoàn Thành Phiên Luyện Tập Phỏng Vấn!</h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>
                Bạn đã hoàn thành toàn bộ {standardQuestions.length} câu hỏi phỏng vấn vị trí <strong>{selectedRole.toUpperCase()}</strong>.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <button
                  onClick={() => {
                    setCompletedStandardSession(false);
                    setStandardIndex(0);
                    setStandardUserAnswer('');
                    setStandardSubmittedAnswers({});
                    setShowStandardSample(false);
                  }}
                  style={{ padding: '12px 24px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RotateCcw size={16} /> Luyện Tập Lại Phiên Này
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ======================================================== */}
      {/* 📊 MODE 3: RECRUITER FEEDBACK LOOP & BLIND SPOT ANALYSIS */}
      {/* ======================================================== */}
      {activeMode === 'blind_spot' && (
        <div>
          {/* AI Project Recommendation & Markdown Spec Exporter Widget */}
          <div style={{ marginBottom: '25px' }}>
            <AIProjectRecommenderWidget studentId={user?.id || 'std-default'} />
          </div>

          {/* Top Score Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} color="#eab308" /> ĐIỂM KỸ THUẬT TRUNG BÌNH
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>
                {blindSpotReport?.averageTechScore || '8.0'}<span style={{ fontSize: '14px', color: '#64748b' }}> / 10</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={16} color="#3b82f6" /> ĐIỂM KỸ NĂNG MỀM TRUNG BÌNH
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>
                {blindSpotReport?.averageSoftScore || '8.5'}<span style={{ fontSize: '14px', color: '#64748b' }}> / 10</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#059669" /> XẾP LOẠI TỔNG THỂ AI
              </div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#047857', marginTop: '4px' }}>
                🛡️ {blindSpotReport?.overallGrade || 'Tốt'}
              </div>
            </div>
          </div>

          {/* AI Remedial Action Plan & Knowledge Blind Spots */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '25px', marginBottom: '25px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#dc2626" /> Báo Cáo Điểm Mù Kiến Thức & Lộ Trình Đồ Án Khắc Phục
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
              Hệ thống AI tự động tổng hợp lỗ hổng kỹ năng được nhận xét bởi các Nhà tuyển dụng và đề xuất lộ trình tự học + đồ án thực chiến.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {blindSpotReport?.remedialRecommendations.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#9f1239', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={16} /> Điểm mù #{idx + 1}: {item.spot}
                  </div>
                  
                  <div style={{ fontSize: '13px', color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <BookOpen size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div><strong>Lộ trình học khắc phục:</strong> {item.actionPlan}</div>
                  </div>

                  <div style={{ fontSize: '13px', color: '#15803d', display: 'flex', alignItems: 'flex-start', gap: '6px', backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                    <Zap size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div><strong>Đồ án bổ trợ đề xuất:</strong> {item.recommendedProject}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Interview Feedback Cards */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '25px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} color="#8b5cf6" /> Lịch Sử Đánh Giá Phỏng Vấn Thực Tế Từ Nhà Tuyển Dụng
            </h3>

            {feedbacks.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '20px' }}>Chưa có đánh giá phỏng vấn nào.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {feedbacks.map(fb => (
                  <div key={fb.id} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>
                          🏢 {fb.company_name || 'Doanh Nghiệp Tuyển Dụng'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          👨‍💼 Người phỏng vấn: {fb.recruiter_name || 'HR Team'} • {new Date(fb.created_at || '').toLocaleDateString('vi-VN')}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#8b5cf6', backgroundColor: '#f5f3ff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #ddd6fe' }}>
                          Kỹ thuật: {fb.technical_score}/10
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#3b82f6', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                          Kỹ năng mềm: {fb.soft_skills_score}/10
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5', margin: '0 0 10px 0', backgroundColor: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      "{fb.recruiter_comment}"
                    </p>

                    {fb.blind_spots && fb.blind_spots.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#dc2626' }}>📌 Điểm còn yếu:</span>
                        {fb.blind_spots.map((spot, i) => (
                          <span key={i} style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', border: '1px solid #fca5a5' }}>
                            {spot}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

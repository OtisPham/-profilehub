import React, { useState, useEffect } from 'react';
import { 
  MBTI_QUESTIONS, 
  MBTI_PROFILES, 
  calculateMBTI, 
  saveCandidateMBTI, 
  getCandidateMBTI 
} from '../../services/mbtiService';
import type { CandidateMBTIResult } from '../../types/mbti';
import { 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  Target, 
  HelpCircle, 
  ShieldAlert, 
  Compass, 
  Briefcase, 
  MessageSquareQuote 
} from 'lucide-react';

export default function MBTIAssessment() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [result, setResult] = useState<CandidateMBTIResult | null>(null);

  useEffect(() => {
    const saved = getCandidateMBTI();
    if (saved) {
      setResult(saved);
      setCurrentStep('result');
    }
  }, []);

  const handleSelectOption = (value: string) => {
    const q = MBTI_QUESTIONS[currentQuestionIdx];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIdx < MBTI_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Calculate and display result
      const calculated = calculateMBTI(newAnswers);
      setResult(calculated);
      saveCandidateMBTI(calculated);
      setCurrentStep('result');
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIdx(0);
    setCurrentStep('quiz');
  };

  const currentQ = MBTI_QUESTIONS[currentQuestionIdx];
  const progressPercent = Math.round(((currentQuestionIdx + 1) / MBTI_QUESTIONS.length) * 100);

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
        borderRadius: '16px',
        padding: '30px',
        color: 'white',
        marginBottom: '28px',
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '10px', borderRadius: '12px' }}>
            <Brain size={28} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Đánh Giá Nhóm Tính Cách & Phong Cách Làm Việc (MBTI)</h1>
            <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
              Khám phá xu hướng tư duy, phong cách hợp tác và vai trò lý tưởng trong đội ngũ công nghệ.
            </p>
          </div>
        </div>
      </div>

      {/* INTRO SCREEN */}
      {currentStep === 'intro' && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '36px', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '50%', marginBottom: '20px' }}>
              <Compass size={48} color="#2563eb" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
              Sẵn sàng khám phá phong cách làm việc của bạn?
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              Bài trắc nghiệm gồm <strong>16 câu hỏi ngắn gọn</strong> (chỉ mất ~3 phút). Hãy chọn câu trả lời tự nhiên nhất theo thói quen thực tế của bạn, không có đáp án đúng hay sai!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', textAlign: 'left', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 'bold', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Sparkles size={16} color="#3b82f6" /> 16 Nhóm Tính Cách
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Được chuẩn hóa riêng cho môi trường làm việc kỹ thuật & lập trình.</div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 'bold', color: '#047857', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Users size={16} color="#10b981" /> Team & Culture Fit
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Giúp nhà tuyển dụng hiểu cách giao tiếp và đồng hành tốt nhất cùng bạn.</div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('quiz')}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              Bắt Đầu Làm Trắc Nghiệm <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* QUIZ SCREEN */}
      {currentStep === 'quiz' && currentQ && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
          {/* Progress Bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>
              <span>Câu hỏi {currentQuestionIdx + 1} / {MBTI_QUESTIONS.length}</span>
              <span>{progressPercent}% hoàn thành</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#3b82f6', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          {/* Question Title */}
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px', lineHeight: '1.5' }}>
            {currentQ.question}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
            <button
              onClick={() => handleSelectOption(currentQ.optionA.value)}
              style={{
                textAlign: 'left',
                padding: '18px 20px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#1e293b',
                lineHeight: '1.5',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontWeight: 'bold', color: '#2563eb', minWidth: '24px' }}>A.</span>
                <span>{currentQ.optionA.text}</span>
              </div>
            </button>

            <button
              onClick={() => handleSelectOption(currentQ.optionB.value)}
              style={{
                textAlign: 'left',
                padding: '18px 20px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#1e293b',
                lineHeight: '1.5',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontWeight: 'bold', color: '#2563eb', minWidth: '24px' }}>B.</span>
                <span>{currentQ.optionB.text}</span>
              </div>
            </button>
          </div>

          {/* Navigation */}
          {currentQuestionIdx > 0 && (
            <button
              onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              <ArrowLeft size={16} /> Quay lại câu trước
            </button>
          )}
        </div>
      )}

      {/* RESULT SCREEN */}
      {currentStep === 'result' && result && (
        <div>
          {/* Main Personality Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: result.profile.badgeBg,
                  color: result.profile.badgeColor,
                  fontWeight: 'bold',
                  fontSize: '18px',
                  padding: '6px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${result.profile.badgeColor}33`,
                  marginBottom: '10px'
                }}>
                  {result.mbtiType} • {result.profile.vietnameseTitle}
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 6px 0' }}>
                  {result.profile.title}
                </h2>
                <p style={{ color: '#475569', fontSize: '15px', margin: 0, fontStyle: 'italic' }}>
                  "{result.profile.tagline}"
                </p>
              </div>

              <button
                onClick={handleRetake}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={14} /> Làm Lại Trắc Nghiệm
              </button>
            </div>

            {/* 4 Dimension Breakdown Bars */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Phân Bố 4 Chiều Tính Cách (Dimensions)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* E vs I */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                    <span style={{ color: result.dimensions.extraversion >= 50 ? '#2563eb' : '#64748b' }}>
                      Hướng Ngoại (E) {result.dimensions.extraversion}%
                    </span>
                    <span style={{ color: result.dimensions.introversion > 50 ? '#7c3aed' : '#64748b' }}>
                      {result.dimensions.introversion}% Hướng Nội (I)
                    </span>
                  </div>
                  <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                    <div style={{ width: `${result.dimensions.extraversion}%`, backgroundColor: '#3b82f6' }} />
                    <div style={{ width: `${result.dimensions.introversion}%`, backgroundColor: '#8b5cf6' }} />
                  </div>
                </div>

                {/* S vs N */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                    <span style={{ color: result.dimensions.sensing >= 50 ? '#059669' : '#64748b' }}>
                      Thực Tế (S) {result.dimensions.sensing}%
                    </span>
                    <span style={{ color: result.dimensions.intuition > 50 ? '#d97706' : '#64748b' }}>
                      {result.dimensions.intuition}% Trực Giác (N)
                    </span>
                  </div>
                  <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                    <div style={{ width: `${result.dimensions.sensing}%`, backgroundColor: '#10b981' }} />
                    <div style={{ width: `${result.dimensions.intuition}%`, backgroundColor: '#f59e0b' }} />
                  </div>
                </div>

                {/* T vs F */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                    <span style={{ color: result.dimensions.thinking >= 50 ? '#0284c7' : '#64748b' }}>
                      Lý Trí / Logic (T) {result.dimensions.thinking}%
                    </span>
                    <span style={{ color: result.dimensions.feeling > 50 ? '#db2777' : '#64748b' }}>
                      {result.dimensions.feeling}% Cảm Xúc / Đồng Cảm (F)
                    </span>
                  </div>
                  <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                    <div style={{ width: `${result.dimensions.thinking}%`, backgroundColor: '#0ea5e9' }} />
                    <div style={{ width: `${result.dimensions.feeling}%`, backgroundColor: '#ec4899' }} />
                  </div>
                </div>

                {/* J vs P */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                    <span style={{ color: result.dimensions.judging >= 50 ? '#4f46e5' : '#64748b' }}>
                      Nguyên Tắc / Kế Hoạch (J) {result.dimensions.judging}%
                    </span>
                    <span style={{ color: result.dimensions.perceiving > 50 ? '#ea580c' : '#64748b' }}>
                      {result.dimensions.perceiving}% Linh Hoạt / Ứng Biến (P)
                    </span>
                  </div>
                  <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                    <div style={{ width: `${result.dimensions.judging}%`, backgroundColor: '#6366f1' }} />
                    <div style={{ width: `${result.dimensions.perceiving}%`, backgroundColor: '#f97316' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Deep Insights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '12px' }}>
                  <Sparkles size={18} color="#2563eb" /> Thế Mạnh Nổi Bật
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#334155', fontSize: '14px', lineHeight: '1.7' }}>
                  {result.profile.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#047857', marginBottom: '12px' }}>
                  <Briefcase size={18} color="#059669" /> Phong Cách & Vai Trò Lý Tưởng
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>
                  <strong>Phong cách:</strong> {result.profile.workStyle}
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>
                  <strong>Vị trí gợi ý:</strong> {result.profile.idealTeamRole}
                </p>
              </div>
            </div>

            {/* Communication & Interview Guide */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#475569', marginBottom: '10px' }}>
                <MessageSquareQuote size={18} color="#64748b" /> Giao Tiếp & Phỏng Vấn Hiệu Quả
              </div>
              <p style={{ fontSize: '14px', color: '#334155', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                {result.profile.communicationStyle}
              </p>

              <div style={{ fontSize: '13px', color: '#64748b', backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong>Gợi ý câu hỏi phỏng vấn thường gặp cho nhóm của bạn:</strong>
                <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px' }}>
                  {result.profile.behavioralQuestions.map((q, idx) => (
                    <li key={idx} style={{ marginTop: '4px' }}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

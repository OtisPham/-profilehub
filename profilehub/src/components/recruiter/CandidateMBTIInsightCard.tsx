import React, { useState, useMemo } from 'react';
import {
  getMockMBTIForCandidate,
  getCandidateMBTI,
  calculateDualMBTIJobFit,
  getAllRoleMBTIPresets,
  MBTI_PROFILES,
} from '../../services/mbtiService';
import type { CandidateMBTIResult, MBTIType } from '../../types/mbti';
import {
  Brain,
  Sparkles,
  Users,
  MessageSquareQuote,
  ShieldAlert,
  CheckCircle2,
  ArrowRightLeft,
  Target,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronDown,
  Layers,
} from 'lucide-react';

interface CandidateMBTIInsightCardProps {
  candidateId?: string;
  candidateName?: string;
  mbtiResult?: CandidateMBTIResult | null;
  jobTitle?: string;
  rawJdText?: string;
  initialRoleKey?: string;
}

export default function CandidateMBTIInsightCard({
  candidateId,
  candidateName = 'Ứng viên',
  mbtiResult,
  jobTitle,
  rawJdText,
  initialRoleKey,
}: CandidateMBTIInsightCardProps) {
  // Use provided result or fallback to stored/mock candidate result
  const candidateData = useMemo(() => {
    return mbtiResult || getCandidateMBTI() || getMockMBTIForCandidate(candidateId);
  }, [mbtiResult, candidateId]);

  const allPresets = useMemo(() => getAllRoleMBTIPresets(), []);
  
  // Selected Role Preset for interactive "What-If" exploration by Recruiter
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>(initialRoleKey || '');
  const [activeTab, setActiveTab] = useState<'matrix' | 'strengths' | 'probes' | 'manager'>('matrix');

  // Compute Dual MBTI Match Analysis
  const dualAnalysis = useMemo(() => {
    return calculateDualMBTIJobFit(
      candidateData,
      jobTitle,
      rawJdText,
      selectedPresetKey || undefined
    );
  }, [candidateData, jobTitle, rawJdText, selectedPresetKey]);

  const cProfile = dualAnalysis.candidateMBTI.profile;
  const rProfile = dualAnalysis.idealProfileInfo;
  const rolePersona = dualAnalysis.rolePersona;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
      marginTop: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* ─────────────────────────────────────────────────────────────
          1. DUAL MBTI HERO COMPARISON BANNER
      ───────────────────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {/* Role Selector Toolbar for Recruiter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '6px', borderRadius: '8px', color: '#1d4ed8' }}>
              <ArrowRightLeft size={16} />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>
                So Khớp Tính Cách Kép (Dual-MBTI Fit Analysis)
              </span>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                Đánh giá mức độ ăn ý tự nhiên giữa Ứng viên ⟷ Vị trí tuyển dụng
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11.5px', color: '#475569', fontWeight: '600' }}>Hình mẫu vị trí:</span>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedPresetKey || rolePersona.roleKey}
                onChange={(e) => setSelectedPresetKey(e.target.value)}
                style={{
                  padding: '6px 28px 6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#0f172a',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                }}
              >
                {allPresets.map((p) => (
                  <option key={p.roleKey} value={p.roleKey}>
                    {p.roleTitle} ({p.primaryIdealType})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* Dual Side-by-Side Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          alignItems: 'stretch',
        }}>
          {/* Left: Candidate Persona */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: `1.5px solid ${cProfile.badgeColor}40`,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>
                  1. Ứng Viên ({candidateName})
                </span>
                <span style={{ fontSize: '10.5px', color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <CheckCircle2 size={11} /> Đã kiểm chứng
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  backgroundColor: cProfile.badgeBg,
                  color: cProfile.badgeColor,
                  fontWeight: '900',
                  fontSize: '15px',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${cProfile.badgeColor}40`,
                }}>
                  {dualAnalysis.candidateMBTI.mbtiType}
                </span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>
                    {cProfile.vietnameseTitle}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                    {cProfile.title}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '6px', borderLeft: `3px solid ${cProfile.badgeColor}` }}>
              "{cProfile.tagline}"
            </div>
          </div>

          {/* Right: Job Ideal Persona */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: `1.5px solid ${rProfile.badgeColor}40`,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>
                  2. Hình Mẫu Vị Trí Tuyển Dụng
                </span>
                <span style={{ fontSize: '10.5px', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                  {rolePersona.roleTitle.split('/')[0]}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  backgroundColor: rProfile.badgeBg,
                  color: rProfile.badgeColor,
                  fontWeight: '900',
                  fontSize: '15px',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${rProfile.badgeColor}40`,
                }}>
                  {rolePersona.primaryIdealType}
                </span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>
                    {rolePersona.roleArchetypeVi}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                    Nhóm lý tưởng: {rolePersona.idealTypes.join(', ')}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#475569', backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '6px', borderLeft: `3px solid ${rProfile.badgeColor}` }}>
              🎯 {rolePersona.workEnvironmentDescription}
            </div>
          </div>
        </div>

        {/* Overall Synergy Metric Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: dualAnalysis.synergyScore >= 85 ? '#ecfdf5' : dualAnalysis.synergyScore >= 70 ? '#eff6ff' : '#fffbeb',
              color: dualAnalysis.synergyScore >= 85 ? '#059669' : dualAnalysis.synergyScore >= 70 ? '#1d4ed8' : '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '18px',
              border: `1.5px solid ${dualAnalysis.synergyScore >= 85 ? '#a7f3d0' : dualAnalysis.synergyScore >= 70 ? '#bfdbfe' : '#fde68a'}`,
            }}>
              {dualAnalysis.synergyScore}%
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} color="#eab308" fill="#eab308" />
                <span>Độ Tương Thích Phong Cách Làm Việc: {dualAnalysis.fitLevelLabel}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {rolePersona.idealTypes.includes(dualAnalysis.candidateMBTI.mbtiType)
                  ? `✓ Ứng viên thuộc nhóm tính cách tự nhiên ưu tú cho vị trí ${rolePersona.roleTitle}.`
                  : `Ứng viên có các nét tính cách bổ trợ tốt, cần lưu ý phong cách phối hợp công việc.`}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {rolePersona.idealTypes.map((t) => {
              const isMatch = t === dualAnalysis.candidateMBTI.mbtiType;
              return (
                <span
                  key={t}
                  style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: isMatch ? '#ecfdf5' : '#f1f5f9',
                    color: isMatch ? '#047857' : '#64748b',
                    border: `1px solid ${isMatch ? '#a7f3d0' : '#e2e8f0'}`,
                  }}
                >
                  {isMatch ? `✓ ${t}` : t}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. INTERACTIVE TAB NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '8px', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('matrix')}
          style={{
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 'bold',
            color: activeTab === 'matrix' ? '#1e3a8a' : '#64748b',
            borderBottom: activeTab === 'matrix' ? '2.5px solid #1e3a8a' : '2.5px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <Layers size={15} /> 1. Ma Trận So Sánh 4 Trục
        </button>

        <button
          onClick={() => setActiveTab('strengths')}
          style={{
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 'bold',
            color: activeTab === 'strengths' ? '#1e3a8a' : '#64748b',
            borderBottom: activeTab === 'strengths' ? '2.5px solid #1e3a8a' : '2.5px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <Target size={15} /> 2. Điểm Mạnh & Vùng Lưu Ý ({dualAnalysis.strengthsInRole.length})
        </button>

        <button
          onClick={() => setActiveTab('probes')}
          style={{
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 'bold',
            color: activeTab === 'probes' ? '#1e3a8a' : '#64748b',
            borderBottom: activeTab === 'probes' ? '2.5px solid #1e3a8a' : '2.5px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <MessageSquareQuote size={15} /> 3. Câu Hỏi Phỏng Vấn Tình Huống
        </button>

        <button
          onClick={() => setActiveTab('manager')}
          style={{
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 'bold',
            color: activeTab === 'manager' ? '#1e3a8a' : '#64748b',
            borderBottom: activeTab === 'manager' ? '2.5px solid #1e3a8a' : '2.5px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <Lightbulb size={15} /> 4. Bí Quyết Quản Lý & Onboarding
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TAB CONTENT
      ───────────────────────────────────────────────────────────── */}

      {/* TAB 1: 4-DIMENSION ALIGNMENT MATRIX */}
      {activeTab === 'matrix' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {dualAnalysis.dimensionComparisons.map((dim) => (
            <div
              key={dim.dimension}
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#0f172a' }}>
                    {dim.title}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: dim.status === 'ALIGNED' ? '#ecfdf5' : dim.status === 'BALANCED' ? '#eff6ff' : '#fff7ed',
                    color: dim.status === 'ALIGNED' ? '#047857' : dim.status === 'BALANCED' ? '#1d4ed8' : '#c2410c',
                    border: `1px solid ${dim.status === 'ALIGNED' ? '#a7f3d0' : dim.status === 'BALANCED' ? '#bfdbfe' : '#fed7aa'}`,
                  }}>
                    {dim.statusText} ({dim.score}%)
                  </span>
                </div>

                {/* Expectation vs Candidate */}
                <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px' }}>
                  <div>
                    <strong style={{ color: '#1e3a8a' }}>Yêu cầu vị trí:</strong> {dim.roleExpectation}
                  </div>
                  <div>
                    <strong style={{ color: '#059669' }}>Xu hướng ứng viên:</strong> {dim.candidatePreference}
                  </div>
                </div>

                {/* Visual Progress Meter */}
                <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginTop: '6px' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${dim.score}%`,
                      backgroundColor: dim.status === 'ALIGNED' ? '#10b981' : dim.status === 'BALANCED' ? '#3b82f6' : '#f97316',
                      borderRadius: '3px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              <div style={{ fontSize: '11.5px', color: '#64748b', fontStyle: 'italic', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                💡 {dim.insightComment}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: STRENGTHS IN ROLE & POTENTIAL FRICTION */}
      {activeTab === 'strengths' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {/* Strengths */}
          <div style={{ backgroundColor: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', padding: '16px' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 'bold', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Sparkles size={16} color="#059669" />
              Điểm Mạnh Tự Nhiên Phát Huy Trong Vị Trí
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#064e3b', lineHeight: '1.6' }}>
              {dualAnalysis.strengthsInRole.map((s, idx) => (
                <li key={idx} style={{ marginTop: '6px' }}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Friction / Stressors */}
          <div style={{ backgroundColor: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a', padding: '16px' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 'bold', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <AlertTriangle size={16} color="#d97706" />
              Rủi Ro Áp Lực & Điểm Cần Lưu Ý
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#78350f', lineHeight: '1.6' }}>
              {dualAnalysis.potentialFrictionOrStress.map((f, idx) => (
                <li key={idx} style={{ marginTop: '6px' }}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM BEHAVIORAL INTERVIEW PROBES */}
      {activeTab === 'probes' && (
        <div style={{ backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd', padding: '18px' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <MessageSquareQuote size={18} color="#0284c7" />
            Bộ Câu Hỏi Phỏng Vấn Tình Huống Tùy Biến Theo Vị Trí ({rolePersona.roleTitle})
          </div>
          <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 12px 0' }}>
            Được thiết kế riêng để NTD kiểm chứng cách ứng viên ({dualAnalysis.candidateMBTI.mbtiType}) phản ứng trước các áp lực thực tế của công việc:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dualAnalysis.behavioralInterviewProbes.map((probe, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e0f2fe',
                  padding: '12px 14px',
                  fontSize: '13px',
                  color: '#0f172a',
                  lineHeight: '1.5',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ backgroundColor: '#0284c7', color: '#ffffff', fontSize: '11px', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  {idx + 1}
                </span>
                <span>{probe}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MANAGEMENT & ONBOARDING TIPS */}
      {activeTab === 'manager' && (
        <div style={{ backgroundColor: '#faf5ff', borderRadius: '12px', border: '1px solid #e9d5ff', padding: '18px' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b21a8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Lightbulb size={18} color="#9333ea" />
            Cẩm Nang Huấn Luyện & Giao Việc Dành Cho Quản Lý Trực Tiếp
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dualAnalysis.managerOnboardingTips.map((tip, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #f3e8ff',
                  padding: '12px 14px',
                  fontSize: '13px',
                  color: '#3b0764',
                  lineHeight: '1.5',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                }}
              >
                <Check size={16} color="#9333ea" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. ANTI-BIAS COMPLIANCE FOOTER
      ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
        <ShieldAlert size={14} color="#94a3b8" />
        <span>
          <strong>Nguyên tắc đạo đức AI:</strong> Mô hình MBTI kép là công cụ tham vấn nhằm tối ưu hóa phong cách làm việc và gắn kết đội ngũ, không phải là điều kiện phân biệt hay loại trừ ứng viên.
        </span>
      </div>
    </div>
  );
}


import React from 'react';
import {
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Briefcase,
  Zap,
  Sparkles
} from 'lucide-react';
import type { LevelCalibrationResult } from '../../services/aiInterviewService';

interface AILevelCalibrationCardProps {
  calibration: LevelCalibrationResult;
  candidateName?: string;
}

export default function AILevelCalibrationCard({
  calibration,
  candidateName = 'Ứng Viên'
}: AILevelCalibrationCardProps) {
  const isUpLevel = calibration.calibrationDirection === 'UP_LEVEL';
  const isDownLevel = calibration.calibrationDirection === 'DOWN_LEVEL';
  const isConfirmed = calibration.calibrationDirection === 'LEVEL_CONFIRMED';

  const themeBg = isUpLevel ? '#f0fdf4' : isDownLevel ? '#fff7ed' : '#eff6ff';
  const themeBorder = isUpLevel ? '#bbf7d0' : isDownLevel ? '#fed7aa' : '#bfdbfe';
  const themeColor = isUpLevel ? '#166534' : isDownLevel ? '#9a3412' : '#1e40af';

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '14px',
        border: `2px solid ${themeBorder}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        marginTop: '24px',
        marginBottom: '24px'
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: themeBg,
          padding: '18px 24px',
          borderBottom: `1px solid ${themeBorder}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: `1px solid ${themeBorder}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}
          >
            {isUpLevel ? (
              <TrendingUp size={22} color="#16a34a" />
            ) : isDownLevel ? (
              <ShieldCheck size={22} color="#ea580c" />
            ) : (
              <Award size={22} color="#2563eb" />
            )}
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: themeColor, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              HẬU PHỎNG VẤN • TÁI HIỆU CHUẨN CẤP BẬC NĂNG LỰC (AI TALENT CALIBRATION)
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              {calibration.directionLabel}
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: calibration.directionColor,
            padding: '6px 14px',
            borderRadius: '20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          {isUpLevel ? '🌟 Fast-Track Promotion' : isDownLevel ? '🛡️ Safe Hiring & Nurturing' : '🎯 Level Confirmed'}
        </span>
      </div>

      {/* Body Content */}
      <div style={{ padding: '24px' }}>
        
        {/* Level Comparison & Salary Benchmark Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '22px' }}>
          
          {/* Level Transition Box */}
          <div style={{ backgroundColor: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '10px' }}>
              CHUYỂN ĐỔI CẤP BẬC MỤC TIÊU:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              
              {/* Initial Level */}
              <div style={{ backgroundColor: 'white', padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center', minWidth: '100px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>CV Khai Báo</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#475569' }}>{calibration.initialLevel}</div>
              </div>

              <div style={{ color: themeColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={22} />
              </div>

              {/* Recommended Level */}
              <div style={{ backgroundColor: 'white', padding: '10px 18px', borderRadius: '8px', border: `2px solid ${calibration.directionColor}`, textAlign: 'center', minWidth: '120px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '11px', color: calibration.directionColor, fontWeight: 'bold' }}>AI Đề Xuất Thực Tế</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: calibration.directionColor }}>{calibration.recommendedLevel}</div>
              </div>

            </div>
          </div>

          {/* Salary Benchmark Box */}
          <div style={{ backgroundColor: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={15} color="#059669" /> DẢI LƯƠNG THỊ TRƯỜNG ĐỀ XUẤT:
            </div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>
              {calibration.suggestedSalaryRange.min} - {calibration.suggestedSalaryRange.max} <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'normal' }}>{calibration.suggestedSalaryRange.currency}/tháng</span>
            </div>
            {isUpLevel && (
              <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 'bold', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} /> Tăng ~35% so với mức {calibration.initialLevel} ban đầu
              </div>
            )}
            {isDownLevel && (
              <div style={{ fontSize: '12px', color: '#c2410c', fontWeight: '600', marginTop: '4px' }}>
                Mức lương an toàn thử việc có Senior kèm cặp
              </div>
            )}
          </div>

        </div>

        {/* AI Calibration Reasoning */}
        <div style={{ backgroundColor: '#ffffff', padding: '16px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={16} color="#d97706" /> Căn Cứ Phân Tích & Đối Soát Đồ Án Của AI:
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
            {calibration.calibrationReasoning}
          </p>
        </div>

        {/* Strengths & Growth Areas Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          
          {/* Demonstrated Strengths */}
          <div style={{ backgroundColor: '#f0fdf4', padding: '14px 16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#15803d', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} /> Điểm nổi bật được chứng minh qua 4 chặng:
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#166534', lineHeight: '1.5' }}>
              {calibration.keyStrengthsDemonstrated.map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          </div>

          {/* Growth Areas */}
          <div style={{ backgroundColor: '#fff7ed', padding: '14px 16px', borderRadius: '8px', border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#c2410c', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={15} /> Điểm cần bồi đắp thêm:
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#9a3412', lineHeight: '1.5' }}>
              {calibration.growthAreas.map((area, idx) => (
                <li key={idx}>{area}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Recruiter Strategy Banner */}
        <div style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#6d28d9', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Briefcase size={16} color="#7c3aed" /> Chiến Lược Tuyển Dụng Dành Cho Nhà Tuyển Dụng (Offer Strategy):
          </div>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#4c1d95', lineHeight: '1.5', fontWeight: '600' }}>
            {calibration.recruiterOfferStrategy}
          </p>
          <div style={{ fontSize: '12px', color: '#5b21b6' }}>
            <strong>Kế hoạch giao việc & kèm cặp:</strong> {calibration.recommendedActionPlan}
          </div>
        </div>

        {/* Suggested Matching Roles */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={15} color="#4f46e5" /> Vị Trí Công Việc Phù Hợp Với Cấp Bậc Mới ({calibration.recommendedLevel}):
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {calibration.suggestedRoles.map((role, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#4338ca',
                  backgroundColor: '#e0e7ff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #c7d2fe'
                }}
              >
                💼 {role}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

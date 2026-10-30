import React, { useState } from 'react';
import { 
  X, Copy, Check, AlertTriangle, CheckCircle2, 
  Terminal, ShieldCheck, ArrowRight, Sparkles, AlertCircle, FileText
} from 'lucide-react';
import type { AtsParserAuditResult } from '../../services/atsParserEyeService';
import type { CVTemplateType } from './CVTemplates';

interface AtsParserEyeModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: AtsParserAuditResult;
  currentTemplate: CVTemplateType;
  onSwitchToSingleColumn: () => void;
}

export default function AtsParserEyeModal({
  isOpen,
  onClose,
  auditResult,
  currentTemplate,
  onSwitchToSingleColumn
}: AtsParserEyeModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'plaintext' | 'audit'>('plaintext');

  if (!isOpen) return null;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(auditResult.rawPlainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Không thể sao chép văn bản:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  ATS Parser Eye-View
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 uppercase">
                  Mô phỏng máy quét Taleo / Workday
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Hiển thị chính xác chuỗi văn bản thô (Plain-Text) mà hệ thống bóc tách CV tự động của nhà tuyển dụng sẽ đọc được.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary & Action Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Score Pill */}
            <div className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-2 ${getScoreColor(auditResult.parseabilityScore)}`}>
              <ShieldCheck className="w-4 h-4" />
              <span>Độ đọc hiểu ATS: {auditResult.parseabilityScore}/100</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-md bg-white/60 font-extrabold">
                {auditResult.rating}
              </span>
            </div>

            {/* Template warning if two-column */}
            {auditResult.hasTwoColumnRisk && (
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Mẫu hiện tại ({currentTemplate}) có nguy cơ đọc chéo cột trên ATS cũ.</span>
                <button
                  type="button"
                  onClick={() => {
                    onSwitchToSingleColumn();
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Đổi sang Harvard 1 cột</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Tab buttons & Copy */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-200/80 p-0.5 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('plaintext')}
                className={`px-3 py-1 rounded-lg transition ${
                  activeTab === 'plaintext'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Văn Bản Thô (Plain-Text)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('audit')}
                className={`px-3 py-1 rounded-lg transition ${
                  activeTab === 'audit'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kiểm Toán & Từ Khóa ({auditResult.warnings.length + auditResult.extractedKeywords.length})
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"
              title="Sao chép toàn bộ văn bản để dán vào cổng tuyển dụng trực tuyến"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép Plain-Text'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'plaintext' ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono">Chuỗi văn bản bóc tách tuần tự theo luồng đọc ATS:</span>
                <span>{auditResult.rawPlainText.split('\n').length} dòng • {auditResult.rawPlainText.length} ký tự</span>
              </div>
              <div className="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner border border-slate-800 selection:bg-indigo-600 selection:text-white max-h-[55vh]">
                <pre className="whitespace-pre-wrap">{auditResult.rawPlainText}</pre>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Warnings List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-indigo-600" />
                  Cảnh Báo & Khuyến Nghị Tối Ưu ATS ({auditResult.warnings.length})
                </h4>
                {auditResult.warnings.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Tuyệt vời! CV của bạn đạt độ tương thích ATS hoàn hảo.</p>
                      <p className="text-emerald-700 mt-0.5">Không phát hiện rủi ro phân giải cột hay lỗi tiêu đề nào.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {auditResult.warnings.map(w => (
                      <div 
                        key={w.id} 
                        className={`p-3.5 rounded-xl border text-xs ${
                          w.type === 'danger'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : w.type === 'warning'
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : 'bg-blue-50 border-blue-200 text-blue-900'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-2">
                          {w.type === 'danger' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                          {w.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                          {w.type === 'info' && <Sparkles className="w-4 h-4 text-blue-600" />}
                          <span>{w.title}</span>
                        </div>
                        <p className="mt-1 text-slate-700 leading-normal">{w.description}</p>
                        {w.suggestion && (
                          <div className="mt-2 p-2 rounded-lg bg-white/70 border border-slate-200 font-medium text-slate-800">
                            💡 {w.suggestion}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Extracted Tech Keywords */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Từ Khóa Kỹ Thuật Máy Quét Nhận Diện ({auditResult.extractedKeywords.length})
                </h4>
                {auditResult.extractedKeywords.length === 0 ? (
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-xs">
                    Chưa bóc tách được từ khóa công nghệ phổ biến nào.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {auditResult.extractedKeywords.map(kw => (
                      <span 
                        key={kw}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Sections Recognized */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h5 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tiêu đề chuẩn nhận diện tốt
                  </h5>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {auditResult.recognizedSections.map(s => (
                      <li key={s} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h5 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-600" /> Tiêu đề ngoài chuẩn ATS
                  </h5>
                  {auditResult.unrecognizedSections.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Không có. Tất cả tiêu đề đều khớp với barem chuẩn.</p>
                  ) : (
                    <ul className="text-xs text-amber-700 space-y-1">
                      {auditResult.unrecognizedSections.map(s => (
                        <li key={s} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tiêu chuẩn bóc tách: ATS Workday, Taleo, Greenhouse & Lever Compatibility Spec</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

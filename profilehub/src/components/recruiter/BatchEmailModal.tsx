import React, { useState } from 'react';
import type { CandidatePipelineItem, BatchEmailTemplate } from '../../types/database';
import { BATCH_EMAIL_TEMPLATES } from '../../services/batchEmailTemplates';
import {
  buildMergedEmail,
  generateMailtoLink,
  copyToClipboardSafe,
} from '../../services/batchEmailService';
import { X, Mail, Copy, Check, Users, Sparkles, Send } from 'lucide-react';

interface BatchEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: CandidatePipelineItem[];
  companyName?: string;
}

export const BatchEmailModal: React.FC<BatchEmailModalProps> = ({
  isOpen,
  onClose,
  candidates,
  companyName = 'Doanh nghiệp Công nghệ',
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(BATCH_EMAIL_TEMPLATES[0].id);
  const [previewCandidateIndex, setPreviewCandidateIndex] = useState<number>(0);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen || candidates.length === 0) return null;

  const currentTemplate =
    BATCH_EMAIL_TEMPLATES.find((t) => t.id === selectedTemplateId) || BATCH_EMAIL_TEMPLATES[0];

  const previewCandidate = candidates[previewCandidateIndex] || candidates[0];
  const mergedPreview = buildMergedEmail(currentTemplate, previewCandidate, companyName);

  const handleCopyAll = async () => {
    const allMerged = candidates.map((c) => {
      const merged = buildMergedEmail(currentTemplate, c, companyName);
      return `--------------------------------------------------\nNGƯỜI NHẬN: ${merged.recipientEmail} (${merged.candidateName})\nTIÊU ĐỀ: ${merged.subject}\n\n${merged.body}\n--------------------------------------------------\n`;
    }).join('\n');

    const ok = await copyToClipboardSafe(allMerged);
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    }
  };

  const handleOpenMailto = () => {
    const link = generateMailtoLink(mergedPreview.recipientEmail, mergedPreview.subject, mergedPreview.body);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Gửi Email Tuyển Dụng Hàng Loạt (Batch Outbound)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-semibold">
                  {candidates.length} ứng viên được chọn
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tự động cá nhân hóa biến động theo tên và đồ án thực tế của từng ứng viên
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Template Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              1. Chọn Mẫu Thư Tuyển Dụng Chuẩn Mực:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {BATCH_EMAIL_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {tmpl.title}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {tmpl.subject}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Candidate Switcher for Live Preview */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Xem trước bản thảo cho:</span>
            </div>
            <select
              value={previewCandidateIndex}
              onChange={(e) => setPreviewCandidateIndex(Number(e.target.value))}
              className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white"
            >
              {candidates.map((cand, idx) => (
                <option key={cand.id} value={idx}>
                  #{idx + 1}: {cand.student?.full_name || 'Ứng viên'} ({cand.job?.title || 'Kỹ sư'})
                </option>
              ))}
            </select>
          </div>

          {/* Email Preview Box */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 font-sans">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Tiêu đề email (Subject):
              </span>
              <div className="font-semibold text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5">
                {mergedPreview.subject}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Nội dung thư (Body with Auto-Merge):
              </span>
              <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
                {mergedPreview.body}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Các biến `{'{candidate_name}'}`, `{'{job_title}'}`, `{'{top_project_name}'}` đã được thay thế thành công.</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
          <div className="text-xs text-slate-500">
            Tổng cộng: <strong className="text-slate-800 dark:text-slate-200">{candidates.length} email</strong> sẵn sàng gửi
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyAll}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copiedAll ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAll ? 'Đã sao chép tất cả!' : 'Sao chép toàn bộ vào Clipboard'}</span>
            </button>

            <button
              onClick={handleOpenMailto}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Mở Mail Client ({mergedPreview.candidateName})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Building, Plus, X, Check, Lock, AlertCircle } from 'lucide-react';
import { candidatePrivacyService } from '../../services/candidatePrivacyService';
import type { CandidatePrivacySettings } from '../../types/privacy.types';

interface CandidatePrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function CandidatePrivacyModal({ isOpen, onClose, userId }: CandidatePrivacyModalProps) {
  const [settings, setSettings] = useState<CandidatePrivacySettings>({
    is_open_to_work: true,
    blocked_companies: [],
    hide_contact_info_until_interview: false,
  });
  const [loading, setLoading] = useState(true);
  const [companyInput, setCompanyInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) return;
    let isMounted = true;
    setLoading(true);
    setSavedSuccess(false);

    candidatePrivacyService.getPrivacySettings(userId).then((res) => {
      if (isMounted) {
        setSettings(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleToggleOpenToWork = async () => {
    const nextVal = !settings.is_open_to_work;
    setSettings((prev) => ({ ...prev, is_open_to_work: nextVal }));
    setSaving(true);
    try {
      await candidatePrivacyService.toggleOpenToWork(userId, nextVal);
      triggerSuccess();
    } finally {
      setSaving(false);
    }
  };

  const handleAddCompany = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = companyInput.trim();
    if (!trimmed) return;

    setSaving(true);
    try {
      const updated = await candidatePrivacyService.addBlockedCompany(userId, trimmed);
      setSettings(updated);
      setCompanyInput('');
      triggerSuccess();
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveCompany = async (companyName: string) => {
    setSaving(true);
    try {
      const updated = await candidatePrivacyService.removeBlockedCompany(userId, companyName);
      setSettings(updated);
      triggerSuccess();
    } finally {
      setSaving(false);
    }
  };

  const triggerSuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 id="privacy-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                Bảo Mật & Quyền Riêng Tư Ứng Viên
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kiểm soát hiển thị hồ sơ đồ án với Nhà tuyển dụng (RBAC)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {loading ? (
            <div className="py-8 text-center text-slate-400">Đang tải cài đặt quyền riêng tư...</div>
          ) : (
            <>
              {/* Section 1: Open to Work */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {settings.is_open_to_work ? (
                      <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        <Eye className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-lg bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                        <EyeOff className="w-4 h-4" />
                      </span>
                    )}
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        Chế độ "Sẵn sàng nhận việc" (Open to Work)
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {settings.is_open_to_work
                          ? 'Đang bật — Hồ sơ xuất hiện trong Kho Tìm Ứng Viên'
                          : 'Đang tắt — Ẩn hoàn toàn khỏi kho ứng viên công khai'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleOpenToWork}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      settings.is_open_to_work ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.is_open_to_work ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
                  💡 <strong>Gợi ý:</strong> Khi bạn đã nhận việc hoặc muốn tạm dừng nhận lời mời phỏng vấn, hãy gạt tắt công tắc này.
                </p>
              </div>

              {/* Section 2: Blocked Companies */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <label className="font-semibold text-slate-900 dark:text-white">
                    Ẩn hồ sơ khỏi công ty chỉ định (Company Blacklist)
                  </label>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nhập tên các công ty bạn không muốn họ tìm thấy CV hay đồ án của bạn (ví dụ: công ty hiện tại đang thực tập hoặc các doanh nghiệp cạnh tranh):
                </p>

                <form onSubmit={handleAddCompany} className="flex gap-2">
                  <input
                    type="text"
                    value={companyInput}
                    onChange={(e) => setCompanyInput(e.target.value)}
                    placeholder="Ví dụ: FPT Software, VNG, Shopee..."
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={saving || !companyInput.trim()}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm Chặn
                  </button>
                </form>

                {/* Danh sách công ty bị chặn */}
                {settings.blocked_companies.length === 0 ? (
                  <div className="py-3 px-4 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                    Chưa có công ty nào trong danh sách chặn. Hồ sơ của bạn được phép hiển thị với mọi nhà tuyển dụng đã xác minh.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {settings.blocked_companies.map((company) => (
                      <span
                        key={company}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/40"
                      >
                        <Lock className="w-3 h-3" />
                        {company}
                        <button
                          type="button"
                          onClick={() => handleRemoveCompany(company)}
                          disabled={saving}
                          className="hover:text-red-900 dark:hover:text-red-100 p-0.5 rounded-full"
                          title="Hủy chặn công ty này"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Feedback */}
              {savedSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Đã lưu cài đặt bảo mật và đồng bộ chính sách phân quyền thành công!</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Chính sách RLS có hiệu lực tức thì</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

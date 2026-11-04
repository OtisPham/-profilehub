import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, DollarSign, MapPin, Globe, FileText, Calendar, Plus } from 'lucide-react';
import type { ApplicationSource, ApplicationStage, CandidateApplicationItem } from '../../types/application.types';
import { cvService, type ManagedCVItem } from '../../services/cvService';
import { useAuth } from '../../context/AuthProvider';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (item: CandidateApplicationItem) => void;
  defaultStage?: ApplicationStage;
}

export default function AddApplicationModal({
  isOpen,
  onClose,
  onCreated,
  defaultStage = 'applied'
}: AddApplicationModalProps) {
  const { user } = useAuth();
  const [cvList, setCvList] = useState<ManagedCVItem[]>([]);

  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [jobLocation, setJobLocation] = useState('Toàn quốc');
  const [applicationSource, setApplicationSource] = useState<ApplicationSource>('topcv');
  const [stage, setStage] = useState<ApplicationStage>(defaultStage);
  const [selectedCvId, setSelectedCvId] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const list = cvService.getAllCVs(user?.id);
      setCvList(list);
      if (list.length > 0 && !selectedCvId) {
        setSelectedCvId(list[0].id);
      }
      setStage(defaultStage);
      setError(null);
    }
  }, [isOpen, user?.id, defaultStage]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError('Vui lòng nhập tên công ty.');
      return;
    }
    if (!roleTitle.trim()) {
      setError('Vui lòng nhập vị trí ứng tuyển.');
      return;
    }

    const linkedCv = cvList.find(c => c.id === selectedCvId);

    const newItem: Omit<CandidateApplicationItem, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: user?.id || 'default',
      companyName: companyName.trim(),
      roleTitle: roleTitle.trim(),
      salaryExpectation: salaryExpectation.trim() || undefined,
      jobLocation: jobLocation.trim() || undefined,
      applicationSource,
      stage,
      linkedCvId: linkedCv?.id,
      linkedCvTitle: linkedCv ? (linkedCv.title || linkedCv.targetRole || 'Bản CV đã lưu') : undefined,
      appliedDate: new Date().toISOString().split('T')[0],
      interviewDate: interviewDate.trim() || undefined,
      notes: notes.trim() || undefined
    };

    onCreated(newItem as CandidateApplicationItem);
    onClose();

    // Reset form
    setCompanyName('');
    setRoleTitle('');
    setSalaryExpectation('');
    setNotes('');
    setInterviewDate('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Thêm Đơn Ứng Tuyển Mới
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ghi chú và theo dõi tiến trình tuyển dụng cá nhân
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Row 1: Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tên Công Ty <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="VD: VNG, FPT, MoMo..."
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vị Trí Ứng Tuyển <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="VD: Frontend React Fresher"
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Source & Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nguồn Nộp Đơn
              </label>
              <select
                value={applicationSource}
                onChange={e => setApplicationSource(e.target.value as ApplicationSource)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              >
                <option value="profilehub">ProfileHub Tuyển Dụng</option>
                <option value="topcv">TopCV</option>
                <option value="itviec">ITviec</option>
                <option value="linkedin">LinkedIn</option>
                <option value="referral">Người quen giới thiệu</option>
                <option value="other">Kênh khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Trạng Thái Ban Đầu
              </label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as ApplicationStage)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              >
                <option value="applied">1. Đã nộp hồ sơ</option>
                <option value="screening">2. HR phản hồi / Sơ vấn</option>
                <option value="assessment">3. Bài test kỹ thuật</option>
                <option value="interview">4. Phỏng vấn</option>
                <option value="offer">5. Nhận Offer</option>
                <option value="rejected">6. Tạm dừng / Từ chối</option>
              </select>
            </div>
          </div>

          {/* Row 3: Linked CV Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Bản CV Gắn Liền (Để mở xem lại trước khi phỏng vấn)
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <select
                value={selectedCvId}
                onChange={e => setSelectedCvId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              >
                {cvList.length === 0 && (
                  <option value="">(Chưa có CV nào trong kho - Sẽ dùng CV mặc định)</option>
                )}
                {cvList.map(cv => (
                  <option key={cv.id} value={cv.id}>
                    {cv.title || cv.targetRole || 'Bản CV không tiêu đề'}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Gắn đúng bản CV giúp bạn 1-chạm mở lại câu từ đã viết khi nhà tuyển dụng gọi điện thoại.
            </p>
          </div>

          {/* Row 4: Salary & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lương Kỳ Vọng / Đã Deal
              </label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="VD: 12 - 15 Triệu"
                  value={salaryExpectation}
                  onChange={e => setSalaryExpectation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Địa Điểm Làm Việc
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="VD: TP. Hồ Chí Minh / Hà Nội"
                  value={jobLocation}
                  onChange={e => setJobLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Optional: Interview Date if Stage is interview */}
          {stage === 'interview' && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
              <label className="block text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1">
                Lịch Hẹn Phỏng Vấn (Tự động đồng bộ vào War Room)
              </label>
              <input
                type="text"
                placeholder="VD: 2026-11-10 14:30"
                value={interviewDate}
                onChange={e => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ghi Chú Riêng Tư
            </label>
            <textarea
              rows={2}
              placeholder="VD: HR dặn chuẩn bị kỹ về Redux Toolkit và mang laptop có demo đồ án..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs resize-none"
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              Lưu Đơn Ứng Tuyển
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

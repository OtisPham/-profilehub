import React, { useState } from 'react';
import type { CandidatePipelineItem, InterviewSlot } from '../../types/database';
import { X, Calendar, Plus, Trash2, Clock, Check, Sparkles, Video } from 'lucide-react';

interface SmartSlotPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidatePipelineItem | null;
  onSaveSlots: (candidateId: string, slots: InterviewSlot[]) => void;
}

export const SmartSlotPickerModal: React.FC<SmartSlotPickerModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onSaveSlots,
}) => {
  const [meetUrl, setMeetUrl] = useState('https://meet.google.com/new');

  // Khởi tạo sẵn 3 khung giờ mẫu
  const [slots, setSlots] = useState<Array<{ date: string; startTime: string; endTime: string }>>([
    { date: '2026-11-20', startTime: '09:00', endTime: '10:00' },
    { date: '2026-11-20', startTime: '14:00', endTime: '15:00' },
    { date: '2026-11-21', startTime: '10:00', endTime: '11:00' },
  ]);

  if (!isOpen || !candidate) return null;

  const handleAddSlot = () => {
    if (slots.length >= 5) return;
    setSlots((prev) => [
      ...prev,
      { date: '2026-11-22', startTime: '15:00', endTime: '16:00' },
    ]);
  };

  const handleRemoveSlot = (index: number) => {
    if (slots.length <= 1) return;
    setSlots((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateSlot = (index: number, field: 'date' | 'startTime' | 'endTime', value: string) => {
    setSlots((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, [field]: value } : s))
    );
  };

  const handleConfirm = () => {
    const formattedSlots: InterviewSlot[] = slots.map((s, idx) => ({
      id: `slot_${Date.now()}_${idx}`,
      candidatePipelineId: candidate.id,
      startTime: `${s.date}T${s.startTime}:00.000Z`,
      endTime: `${s.date}T${s.endTime}:00.000Z`,
      status: 'available',
      meetUrl,
    }));

    onSaveSlots(candidate.id, formattedSlots);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mở Khung Giờ Phỏng Vấn Tự Động (Smart Slot Picker)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cho phép ứng viên <strong>{candidate.student?.full_name || 'Ứng viên'}</strong> tự chọn khung giờ phù hợp
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

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Meeting Link input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Liên kết phòng họp trực tuyến (Google Meet):
            </label>
            <div className="relative">
              <Video className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="url"
                value={meetUrl}
                onChange={(e) => setMeetUrl(e.target.value)}
                placeholder="https://meet.google.com/abc-xyz"
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Slot list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Các Khung Giờ Rảnh Đề Xuất (Tối đa 5 khung giờ):
              </label>
              <button
                type="button"
                onClick={handleAddSlot}
                disabled={slots.length >= 5}
                className="text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 hover:underline disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm khung giờ</span>
              </button>
            </div>

            <div className="space-y-2">
              {slots.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40"
                >
                  <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 w-6">
                    #{idx + 1}
                  </span>
                  <input
                    type="date"
                    value={s.date}
                    onChange={(e) => handleUpdateSlot(idx, 'date', e.target.value)}
                    className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="time"
                      value={s.startTime}
                      onChange={(e) => handleUpdateSlot(idx, 'startTime', e.target.value)}
                      className="text-xs px-1.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-20"
                    />
                    <span className="text-slate-400 text-xs">-</span>
                    <input
                      type="time"
                      value={s.endTime}
                      onChange={(e) => handleUpdateSlot(idx, 'endTime', e.target.value)}
                      className="text-xs px-1.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-20"
                    />
                  </div>
                  {slots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 rounded-xl p-3">
            <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span>
              Ứng viên sẽ nhận được thông báo để chọn 1 khung giờ. Khi ứng viên xác nhận, hệ thống tự động khóa lịch và cập nhật Pipeline tức thì.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Phát Hành {slots.length} Khung Giờ Đến Ứng Viên</span>
          </button>
        </div>
      </div>
    </div>
  );
};

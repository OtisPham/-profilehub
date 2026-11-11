import React, { useState } from 'react';
import type { InterviewSlot } from '../../types/database';
import {
  generateGoogleCalendarUrl,
  downloadIcsFile,
  createSlotExportPayload,
} from '../../services/calendarExportService';
import { X, Calendar, Clock, CheckCircle2, Video, ExternalLink, Download } from 'lucide-react';

interface CandidateSlotBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  companyName: string;
  jobTitle: string;
  slots: InterviewSlot[];
  onConfirmSlot: (selectedSlot: InterviewSlot) => void;
}

export const CandidateSlotBookingModal: React.FC<CandidateSlotBookingModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  companyName,
  jobTitle,
  slots,
  onConfirmSlot,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>(slots[0]?.id || '');
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);
  const [confirmedSlot, setConfirmedSlot] = useState<InterviewSlot | null>(null);

  if (!isOpen || slots.length === 0) return null;

  const currentSlot = slots.find((s) => s.id === selectedSlotId) || slots[0];

  const handleConfirm = () => {
    if (!currentSlot) return;
    const booked = { ...currentSlot, status: 'booked' as const, bookedAt: new Date().toISOString() };
    setConfirmedSlot(booked);
    setIsBookedSuccess(true);
    onConfirmSlot(booked);
  };

  const formatSlotTime = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '09:00';
    }
  };

  const formatSlotDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isBookedSuccess ? 'Xác Nhận Lịch Phỏng Vấn Thành Công!' : 'Chọn Khung Giờ Phỏng Vấn Phù Hợp'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {companyName} • Vị trí: {jobTitle}
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
        <div className="p-6 space-y-4">
          {!isBookedSuccess ? (
            <>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Nhà tuyển dụng đã mở sẵn các khung giờ rảnh dưới đây. Bạn vui lòng chọn <strong>1 khung giờ</strong> vừa vặn nhất với lịch học/lịch thi của mình:
              </p>

              <div className="space-y-2">
                {slots.map((s) => {
                  const isSelected = s.id === selectedSlotId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSlotId(s.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                            {formatSlotDate(s.startTime)}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>
                              {formatSlotTime(s.startTime)} - {formatSlotTime(s.endTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {s.meetUrl && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <Video className="w-3 h-3 text-purple-600" />
                          Meet Online
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Để sau
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Khung Giờ Này</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-5 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lịch phỏng vấn đã được khóa thành công!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {confirmedSlot && `${formatSlotDate(confirmedSlot.startTime)} (${formatSlotTime(confirmedSlot.startTime)} - ${formatSlotTime(confirmedSlot.endTime)})`}
                </p>
              </div>

              {/* 1-Click Calendar Sync */}
              {confirmedSlot && (
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2.5 text-left">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Đồng bộ ngay vào lịch cá nhân của bạn:
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <a
                      href={generateGoogleCalendarUrl(
                        createSlotExportPayload(confirmedSlot, jobTitle, companyName, candidateName)
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Thêm vào Google Calendar</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>

                    <button
                      onClick={() =>
                        downloadIcsFile(
                          createSlotExportPayload(confirmedSlot, jobTitle, companyName, candidateName),
                          `phong-van-${companyName}.ics`
                        )
                      }
                      className="w-full sm:w-1/2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải file Apple/Outlook (.ics)</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all"
              >
                Đóng & Quay lại Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

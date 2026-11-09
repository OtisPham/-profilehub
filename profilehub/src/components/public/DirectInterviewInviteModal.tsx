import React, { useState } from 'react';
import { 
  Building2, Mail, Calendar, Clock, Video, Send, X, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { submitInboundInterviewInvite } from '../../utils/pipelineSync';
import type { PublicVerifiedProjectRecord } from '../../types/projects.types';

interface DirectInterviewInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PublicVerifiedProjectRecord;
  onSuccess: (companyName: string) => void;
}

export default function DirectInterviewInviteModal({
  isOpen,
  onClose,
  record,
  onSuccess
}: DirectInterviewInviteModalProps) {
  const { user, userRole } = useAuth();

  // Mặc định ngày phỏng vấn là 3 ngày sau
  const defaultDate = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [companyName, setCompanyName] = useState(
    (user?.user_metadata?.company_name as string) || (userRole === 'recruiter' ? 'Doanh Nghiệp Tuyển Dụng' : '')
  );
  const [recruiterEmail, setRecruiterEmail] = useState(user?.email || '');
  const [roleTitle, setRoleTitle] = useState(`${record.project.tags?.[0] || 'Phần Mềm'} Developer`);
  const [proposedDate, setProposedDate] = useState(defaultDate);
  const [proposedTime, setProposedTime] = useState('10:00 AM');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/phb-tech-meet');
  const [message, setMessage] = useState(
    `Chào ${record.student.name}, chúng tôi rất ấn tượng với đồ án "${record.project.title}" đã được Giảng viên thẩm định bảo chứng (Mã: ${record.verificationCode}). Công ty muốn mời bạn tham gia buổi phỏng vấn trao đổi cơ hội nghề nghiệp!`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!companyName.trim()) {
      setErrorMsg('Vui lòng nhập tên công ty / doanh nghiệp.');
      return;
    }
    if (!recruiterEmail.trim() || !recruiterEmail.includes('@')) {
      setErrorMsg('Vui lòng nhập email liên hệ hợp lệ.');
      return;
    }
    if (!roleTitle.trim()) {
      setErrorMsg('Vui lòng nhập vị trí công việc tuyển dụng.');
      return;
    }
    if (!proposedDate) {
      setErrorMsg('Vui lòng chọn ngày phỏng vấn dự kiến.');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = submitInboundInterviewInvite({
        verification_code: record.verificationCode,
        student_id: (record.student as any).id || record.project.id || 'student_verified_inbound',
        student_name: record.student.name,
        recruiter_id: user?.id,
        company_name: companyName.trim(),
        recruiter_email: recruiterEmail.trim(),
        role_title: roleTitle.trim(),
        proposed_date: proposedDate,
        proposed_time: proposedTime,
        meeting_link: meetingLink.trim() || undefined,
        message: message.trim()
      });

      if (success) {
        onSuccess(companyName.trim());
        onClose();
      } else {
        setErrorMsg('Không thể gửi lời mời. Vui lòng thử lại sau.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Có lỗi xảy ra khi gửi lời mời.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Mời Phỏng Vấn Trực Tiếp</h3>
              <p className="text-xs text-slate-400">
                Gửi lời mời trực tiếp đến tác giả đồ án <span className="text-purple-300 font-semibold">{record.student.name}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-medium text-[11px]">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tên Doanh Nghiệp / Công Ty <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="VNG, FPT Software, MoMo..."
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Email Nhà Tuyển Dụng <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="recruiter@company.com"
                  value={recruiterEmail}
                  onChange={e => setRecruiterEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Vị Trí Công Việc Đề Xuất <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Frontend Developer Fresher / Intern..."
              value={roleTitle}
              onChange={e => setRoleTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Ngày Phỏng Vấn Dự Kiến <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="date"
                  required
                  value={proposedDate}
                  onChange={e => setProposedDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs transition [color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Khung Giờ Dự Kiến <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="10:00 AM hoặc 14:30"
                  value={proposedTime}
                  onChange={e => setProposedTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Đường Dẫn Họp Online (Google Meet / Zoom / MS Teams)
            </label>
            <div className="relative">
              <Video className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="url"
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={e => setMeetingLink(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs transition"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Thông Điệp Gửi Ứng Viên
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs transition resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/20 active:scale-95 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>Đang Gửi...</>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Lời Mời Phỏng Vấn</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

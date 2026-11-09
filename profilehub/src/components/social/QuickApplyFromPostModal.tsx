import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  DollarSign, 
  Award,
  FileText
} from 'lucide-react';
import type { SocialPost } from '../../types/database';
import { socialFeedService } from '../../services/socialFeedService';
import { useAuth } from '../../context/AuthProvider';

interface QuickApplyFromPostModalProps {
  post: SocialPost | null;
  onClose: () => void;
  onAppliedSuccess?: (message: string) => void;
}

export default function QuickApplyFromPostModal({
  post,
  onClose,
  onAppliedSuccess
}: QuickApplyFromPostModalProps) {
  const { user } = useAuth();
  if (!post) return null;

  const [applicantName, setApplicantName] = useState(user?.user_metadata?.full_name || 'Nguyễn Văn An');
  const [applicantMajor, setApplicantMajor] = useState('Kỹ thuật Phần mềm / CNTT');
  const [applicantGpa, setApplicantGpa] = useState('3.6/4.0');
  const [includeVerifiedProjects, setIncludeVerifiedProjects] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = socialFeedService.quickApplyJobFromPost(post.id, {
      studentId: user?.id || `stu_${Date.now()}`,
      studentName: applicantName.trim(),
      major: applicantMajor,
      gpa: applicantGpa,
      verifiedProjectsCount: includeVerifiedProjects ? 3 : 1
    });

    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage(res.message);
      if (onAppliedSuccess) onAppliedSuccess(res.message);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setStatusMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden my-auto animate-in zoom-in-95 duration-150 text-left">
        
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-blue-950 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Ứng Tuyển Nhanh 1-Click</h3>
              <p className="text-[11px] text-blue-200">Đồng bộ hồ sơ năng lực & đồ án bảo chứng đến HR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleApply} className="p-6 space-y-4">
          
          {/* Target Job Info */}
          <div className="p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-2xl">
            <span className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">Vị trí ứng tuyển:</span>
            <h4 className="font-bold text-slate-900 text-sm">{post.title}</h4>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> {post.company_name || post.author_name}
              </span>
              <span className="font-bold text-emerald-600">
                {post.job_salary_range || 'Lương Thỏa Thuận'}
              </span>
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Họ và Tên Ứng Viên:</label>
            <input
              type="text"
              required
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chuyên Ngành:</label>
              <input
                type="text"
                value={applicantMajor}
                onChange={(e) => setApplicantMajor(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Điểm GPA / Bậc:</label>
              <input
                type="text"
                value={applicantGpa}
                onChange={(e) => setApplicantGpa(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
              />
            </div>
          </div>

          {/* Evidence Attach Guarantee */}
          <label className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
            <input
              type="checkbox"
              checked={includeVerifiedProjects}
              onChange={(e) => setIncludeVerifiedProjects(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-indigo-600 rounded-md"
            />
            <div className="text-xs">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Đính kèm Bằng chứng Đồ án Thực Chiến (Demo-Ready)
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tự động gửi link Live Demo và điểm số bảo chứng của Giảng viên để được ưu tiên phỏng vấn.
              </p>
            </div>
          </label>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Xác Nhận Nộp Hồ Sơ
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

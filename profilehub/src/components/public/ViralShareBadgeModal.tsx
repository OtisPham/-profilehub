import React, { useState } from 'react';
import { 
  Share2, Copy, Check, ExternalLink, Github, Linkedin, Twitter, X, Award, ShieldCheck 
} from 'lucide-react';
import { verificationService } from '../../services/verificationService';
import type { PublicVerifiedProjectRecord } from '../../types/projects.types';

interface ViralShareBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PublicVerifiedProjectRecord;
}

export default function ViralShareBadgeModal({
  isOpen,
  onClose,
  record
}: ViralShareBadgeModalProps) {
  const [activeTab, setActiveTab] = useState<'social' | 'badge' | 'link'>('social');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  if (!isOpen) return null;

  const shareUrls = verificationService.getPublicShareUrls(
    record.verificationCode,
    record.project.title,
    record.student.name
  );

  const handleCopy = (text: string, type: 'link' | 'badge' | 'html') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === 'badge') {
      setCopiedBadge(true);
      setTimeout(() => setCopiedBadge(false), 2000);
    } else {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Glow Background */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Lan Tỏa & Khoe Đồ Án</h3>
              <p className="text-xs text-slate-400">
                Chia sẻ thành tích bảo chứng của đồ án <span className="text-emerald-300 font-semibold">{record.verificationCode}</span>
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'social'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>Mạng Xã Hội</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('badge')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'badge'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub README Badge</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'link'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Link Rút Gọn</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 text-xs">
          {activeTab === 'social' && (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Đăng bài lên trang cá nhân để nhà tuyển dụng, đồng nghiệp và mạng lưới kết nối dễ dàng tiếp cận và kiểm chứng năng lực code của bạn:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={shareUrls.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0077b5] hover:bg-[#006396] text-white font-bold transition shadow-lg shadow-blue-500/20"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>Khoe Trên LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <a
                  href={shareUrls.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 transition"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Chia Sẻ Lên X / Twitter</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                💡 <strong className="text-slate-200">Gợi ý:</strong> Bài đăng trên LinkedIn có đính kèm mã bảo chứng học thuật thường nhận được lượt tương tác và phản hồi từ các Tech Lead cao hơn 4 lần so với bài viết thông thường.
              </div>
            </div>
          )}

          {activeTab === 'badge' && (
            <div className="space-y-3.5">
              <p className="text-slate-300">
                Chèn huy hiệu bảo chứng chính thức vào đầu file <code className="text-emerald-300 font-mono">README.md</code> của repository GitHub:
              </p>

              {/* Badge Preview */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Bản xem trước hiển thị:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600 text-white font-bold text-[10px] tracking-wide shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                  PROFILEHUB | VERIFIED PROJECT
                </span>
              </div>

              {/* Markdown Code */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-400 text-[11px]">Mã Markdown:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(shareUrls.markdownBadge, 'badge')}
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {copiedBadge ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBadge ? 'Đã sao chép' : 'Sao chép mã'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[10.5px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all select-all">
                  {shareUrls.markdownBadge}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'link' && (
            <div className="space-y-3.5">
              <p className="text-slate-300">
                Đường dẫn công khai dùng để gửi cho HR, in lên CV hoặc gắn vào portfolio:
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrls.verifyUrl}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-[11px] font-mono select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(shareUrls.verifyUrl, 'link')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Đã Copy' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end pt-4 mt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

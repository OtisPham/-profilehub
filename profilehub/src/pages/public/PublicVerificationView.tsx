import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  Github,
  Globe,
  FileText,
  Figma,
  GraduationCap,
  Award,
  ArrowLeft,
  Calendar,
  Lock,
  Search,
  Sparkles,
  Share2
} from 'lucide-react';
import { verificationService } from '../../services/verificationService';
import type { PublicVerifiedProjectRecord } from '../../types/projects.types';

export default function PublicVerificationView() {
  const { code } = useParams<{ code: string }>();
  const [record, setRecord] = useState<PublicVerifiedProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchCodeInput, setSearchCodeInput] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    if (code) {
      verificationService.getVerifiedProjectByCode(code).then(res => {
        if (isMounted) {
          setRecord(res);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [code]);

  const handleCopyHash = () => {
    if (!record?.verificationHash) return;
    navigator.clipboard.writeText(record.verificationHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formattedDate = record?.verifiedAt
    ? new Date(record.verifiedAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Top Brand Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-white font-extrabold text-base tracking-tight hover:opacity-90 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              P
            </div>
            <span>ProfileHub</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Proof
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition"
              title="Sao chép liên kết chứng nhận"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Đã chép link' : 'Chia sẻ'}</span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md shadow-emerald-600/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về ProfileHub</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {loading ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-400">
              Đang xác thực mã bảo chứng từ chuỗi băm mật mã học...
            </p>
          </div>
        ) : record ? (
          /* TRƯỜNG HỢP 1: TÌM THẤY BẢO CHỨNG HỢP LỆ */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Certificate Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/30 p-6 sm:p-10 shadow-2xl shadow-emerald-950/40">
              {/* Background ambient glow */}
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                {/* Gold Shield Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-bold tracking-wide shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>ĐÃ BẢO CHỨNG BỞI GIẢNG VIÊN ĐẠI HỌC • VERIFIED PROOF</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug max-w-2xl">
                  {record.project.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {record.project.description}
                </p>

                {/* Tech Stack Pills */}
                {record.project.tags && record.project.tags.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                    {record.project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800/90 text-slate-300 border border-slate-700/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Proof Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tác giả sinh viên */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Tác Giả Đồ Án (Sinh Viên)</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-base shrink-0 shadow-md">
                    {record.student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {record.student.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {record.student.university}
                    </p>
                    {record.student.faculty && (
                      <p className="text-[11px] text-slate-500">
                        {record.student.faculty}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-400 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Zero Data Leak: Thông tin liên hệ cá nhân & GPA được bảo vệ an toàn.</span>
                </div>
              </div>

              {/* Giảng viên / Mentor bảo chứng */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Người Bảo Chứng Kỹ Thuật</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-base shrink-0 shadow-md">
                    🏛️
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {record.instructor.name}
                    </h3>
                    <p className="text-xs text-amber-400 font-medium">
                      {record.instructor.title}
                    </p>
                    {record.instructor.department && (
                      <p className="text-[11px] text-slate-400">
                        {record.instructor.department}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-400 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Thời điểm duyệt bảo chứng: <strong>{formattedDate}</strong></span>
                </div>
              </div>
            </div>

            {/* Cryptographic Proof SHA-256 Panel */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>MÃ BĂM TOÀN VẸN MẬT MÃ HỌC (SHA-256 IMMUTABLE HASH)</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  {record.verificationCode}
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-[11px] text-slate-300 break-all select-all">
                <span className="flex-1">{record.verificationHash}</span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition shrink-0 flex items-center gap-1 cursor-pointer"
                  title="Sao chép SHA-256 Hash"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-sans font-bold">{copiedHash ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Mã băm được sinh bằng giải thuật SHA-256 khóa liên kết giữa định danh đồ án, tác giả, giảng viên và thời điểm duyệt. Bất kỳ thay đổi trái phép nào đều sẽ làm sai lệch mã băm này.
              </p>
            </div>

            {/* Direct Project Links Action Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-wrap items-center justify-center gap-3">
              {record.project.demoUrl && (
                <a
                  href={record.project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/20"
                >
                  <Globe className="w-4 h-4" />
                  <span>Trải Nghiệm Live Demo</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}

              {record.project.githubUrl && (
                <a
                  href={record.project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition"
                >
                  <Github className="w-4 h-4" />
                  <span>Mã Nguồn GitHub</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}

              {record.project.figmaUrl && (
                <a
                  href={record.project.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition"
                >
                  <Figma className="w-4 h-4" />
                  <span>Bản Thiết Kế Figma</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}

              {record.project.docUrl && (
                <a
                  href={record.project.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>Tài Liệu Đồ Án</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}
            </div>
          </div>
        ) : (
          /* TRƯỜNG HỢP 2: KHÔNG TÌM THẤY HOẶC MÃ SAI */
          <div className="max-w-md mx-auto text-center space-y-6 py-12 px-6 rounded-3xl bg-slate-900/60 border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">
                Không Tìm Thấy Mã Bảo Chứng
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mã tra cứu <code className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">{code || 'rỗng'}</code> không tồn tại trên hệ thống hoặc chưa được Giảng viên phê duyệt bảo chứng.
              </p>
            </div>

            {/* Quick search input */}
            <form
              onSubmit={e => {
                e.preventDefault();
                if (searchCodeInput.trim()) {
                  window.location.href = `/verify/${encodeURIComponent(searchCodeInput.trim())}`;
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={searchCodeInput}
                onChange={e => setSearchCodeInput(e.target.value)}
                placeholder="Nhập mã khác (VD: PH-VER-A8B9C2)"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Tra cứu</span>
              </button>
            </form>

            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại trang chủ ProfileHub</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <p>© 2026 ProfileHub. Project-Driven AI CV Builder & Verification Gateway.</p>
      </footer>
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import {
  X,
  FileText,
  Copy,
  Check,
  Download,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Target,
  Code2
} from 'lucide-react';
import type { ProjectItem } from '../../types/cvSection';
import { applicationPitchService, type PitchResult } from '../../services/applicationPitchService';

interface ApplicationPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
  targetRole: string;
  initialJd?: string;
  projects: ProjectItem[];
  savedPitch?: string;
  onSavePitch: (pitch: string, jdText: string) => void;
}

export default function ApplicationPitchModal({
  isOpen,
  onClose,
  applicantName,
  targetRole,
  initialJd = '',
  projects,
  savedPitch = '',
  onSavePitch
}: ApplicationPitchModalProps) {
  if (!isOpen) return null;

  const [jdText, setJdText] = useState(initialJd);
  const [pitchText, setPitchText] = useState(savedPitch);
  const [pitchData, setPitchData] = useState<PitchResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Validation
  const validation = useMemo(() => {
    return applicationPitchService.validateInput(jdText, projects);
  }, [jdText, projects]);

  const wordCount = useMemo(() => {
    return applicationPitchService.countWords(pitchText);
  }, [pitchText]);

  // Tự động sinh nếu chưa có bản thảo lưu và đủ điều kiện
  useEffect(() => {
    if (isOpen) {
      if (savedPitch && savedPitch.trim().length > 0) {
        setPitchText(savedPitch);
      } else if (validation.isValid && !pitchText) {
        handleGenerate();
      }
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    if (!validation.isValid) return;
    setIsGenerating(true);
    try {
      const res = await applicationPitchService.generatePitch({
        applicantName: applicantName || 'Ứng viên',
        targetRole: targetRole || 'Lập trình viên',
        targetJd: jdText,
        projects
      });
      setPitchData(res);
      setPitchText(res.content);
    } catch (err) {
      console.error('Lỗi khi sinh thư ứng tuyển:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!pitchText) return;
    try {
      await navigator.clipboard.writeText(pitchText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Không thể sao chép vào clipboard:', err);
    }
  };

  const handleSaveToCv = () => {
    onSavePitch(pitchText, jdText);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDownloadTxt = () => {
    if (!pitchText) return;
    const blob = new Blob([pitchText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (applicantName || 'Ung-vien').replace(/\s+/g, '-');
    link.download = `Application-Pitch-${safeName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Contextual Application Pitch
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Chuẩn Evidence-First
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Thư ứng tuyển cô đọng dưới 250 từ, định vị bằng chứng từ đồ án thực tế khớp với JD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* HARD-GATING ALERT: When Missing JD or Projects */}
          {!validation.isValid && (
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    Cần bổ sung thông tin để kích hoạt rào chắn Anti-Hallucination
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    ProfileHub chỉ tạo thư ứng tuyển khi có đủ căn cứ mục tiêu (JD) và minh chứng thực tế (Đồ án), ngăn chặn tuyệt đối việc sinh văn mẫu sáo rỗng:
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-amber-800 dark:text-amber-200 list-disc list-inside">
                    {validation.missingRequirements.map((req, idx) => (
                      <li key={idx} className="font-medium">{req}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quick JD Input box inside modal if missing */}
              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40">
                <label className="block text-xs font-bold text-amber-900 dark:text-amber-200 mb-1.5">
                  Dán nhanh nội dung Job Description (JD) vào đây:
                </label>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Dán yêu cầu tuyển dụng (JD) từ công ty mục tiêu..."
                  className="w-full h-24 p-2.5 text-xs rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Context Badges Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Vị trí:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {targetRole || 'Lập trình viên'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Đồ án đưa vào minh chứng:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {projects.length > 0 ? `${projects.length} đồ án trên CV` : 'Chưa có đồ án'}
              </span>
            </div>
          </div>

          {/* Editor Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Nội dung thư thuyết trình (Có thể chỉnh sửa trực tiếp):
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                  wordCount <= 250
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}>
                  {wordCount} / 250 từ {wordCount <= 250 ? '✓ Đạt chuẩn' : '⚠️ Nên rút gọn'}
                </span>
              </div>
            </div>

            <textarea
              value={pitchText}
              onChange={(e) => setPitchText(e.target.value)}
              disabled={isGenerating || !validation.isValid}
              placeholder={validation.isValid ? 'Nội dung thư sẽ hiển thị tại đây...' : 'Vui lòng bổ sung JD hoặc đồ án để tạo thư...'}
              rows={11}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans resize-y shadow-2xs"
            />
          </div>

          {/* 3-Part Architecture Blueprint Explainer */}
          <div className="p-3 bg-slate-50/80 dark:bg-slate-850/60 rounded-xl border border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">
              💡 Cấu trúc 3 phần Evidence-First Pitch:
            </div>
            <div>• <strong className="text-slate-800 dark:text-slate-200">Phần 1 (Hook & Alignment):</strong> Nêu trực diện vị trí và 2-3 công nghệ cốt lõi trùng khớp với JD.</div>
            <div>• <strong className="text-slate-800 dark:text-slate-200">Phần 2 (Project Evidence Spotlight):</strong> Bằng chứng giải quyết bài toán thực tế kèm link Demo/Repo.</div>
            <div>• <strong className="text-slate-800 dark:text-slate-200">Phần 3 (Call to Action):</strong> Sẵn sàng bảo vệ các quyết định kiến trúc tại buổi phỏng vấn.</div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          
          <button
            onClick={handleGenerate}
            disabled={!validation.isValid || isGenerating}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Đang tạo...' : 'Tạo lại nội dung'}</span>
          </button>

          <div className="flex items-center gap-2">
            
            {/* Tải .txt */}
            <button
              onClick={handleDownloadTxt}
              disabled={!pitchText}
              className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Tải văn bản dạng file text (.txt)"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Tải .txt</span>
            </button>

            {/* Lưu vào CV */}
            <button
              onClick={handleSaveToCv}
              disabled={!pitchText}
              className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Lưu bản thảo thư vào bộ nhớ CV này"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{saveSuccess ? 'Đã lưu vào CV!' : 'Lưu vào CV'}</span>
            </button>

            {/* Main Action: 1-Click Copy */}
            <button
              onClick={handleCopy}
              disabled={!pitchText}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Đã sao chép vào bộ nhớ tạm!' : '1-Click Sao chép'}</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

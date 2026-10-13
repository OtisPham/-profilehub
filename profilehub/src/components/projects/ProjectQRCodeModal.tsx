import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Copy, Check, Download, ShieldCheck, ExternalLink } from 'lucide-react';

interface ProjectQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  verificationCode: string;
  teacherName?: string;
  score?: number;
}

export const ProjectQRCodeModal: React.FC<ProjectQRCodeModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  verificationCode,
  teacherName,
  score,
}) => {
  const [copied, setCopied] = React.useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://profilehub.vn';
  const verifyUrl = `${baseUrl}/verify/${verificationCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `QR-Verification-${verificationCode}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Mã QR Bảo Chứng Đồ Án</h3>
            <p className="text-xs text-emerald-700 font-mono font-bold">{verificationCode}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
          <p className="text-xs text-slate-500 mb-0.5">Đồ án được xác thực:</p>
          <p className="text-sm font-bold text-slate-800 line-clamp-1">{projectTitle}</p>
          {(teacherName || score !== undefined) && (
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
              {teacherName && <span>GV: <strong className="text-slate-900">{teacherName}</strong></span>}
              {score !== undefined && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-200">
                  Điểm: {score}/10
                </span>
              )}
            </div>
          )}
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner mb-6" ref={canvasRef}>
          <QRCodeCanvas
            value={verifyUrl}
            size={190}
            level="H"
            includeMargin={true}
          />
          <span className="text-[11px] font-mono text-slate-500 mt-2.5 font-bold tracking-wider uppercase">
            SCAN TO VERIFY ACADEMIC RECORD
          </span>
        </div>

        {/* Verification URL Bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mb-5">
          <input
            type="text"
            readOnly
            value={verifyUrl}
            className="flex-1 bg-transparent px-2.5 text-xs font-mono text-slate-700 outline-none truncate"
          />
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadQR}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Tải ảnh PNG</span>
          </button>

          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Cổng Tra Cứu</span>
          </a>
        </div>
      </div>
    </div>
  );
};

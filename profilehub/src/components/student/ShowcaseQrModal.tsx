import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Download, QrCode, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';

interface ShowcaseQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userName?: string;
  major?: string;
}

export const ShowcaseQrModal: React.FC<ShowcaseQrModalProps> = ({
  isOpen,
  onClose,
  userId = 'demo',
  userName = 'Ứng Viên',
  major = 'Chuyên Ngành'
}) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const showcaseUrl = `${window.location.origin}/showcase/${userId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(showcaseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQrPng = () => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    // Chuyển đổi SVG thành Canvas rồi tải về dạng ảnh PNG chất lượng cao
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Vẽ QR code với padding 60px
        ctx.drawImage(img, 60, 60, 880, 880);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `ProfileHub-Showcase-QR-${userId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-[#090d16] dark:via-[#0c101c] dark:to-[#111728] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-sm">
              <QrCode size={18} />
            </div>
            <div>
              <h3 id="qr-modal-title" className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Smart QR Code Showcase</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Live
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bảo chứng năng lực thực tế (Proof-of-Work)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center justify-center cursor-pointer"
            title="Đóng modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center text-center space-y-5">
          {/* QR Container */}
          <div 
            ref={qrRef} 
            className="p-5 bg-white rounded-2xl shadow-xl shadow-indigo-950/10 border-4 border-indigo-100 dark:border-slate-700 relative group transition-transform hover:scale-102"
          >
            <QRCodeSVG
              value={showcaseUrl}
              size={210}
              level="H"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#0f172a"
            />
            {/* Watermark logo ProfileHub giữa QR */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl shadow-md border-2 border-indigo-600 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs">
                PH
              </div>
            </div>
          </div>

          {/* User info info tag */}
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
              <span>{userName}</span>
              <ShieldCheck size={15} className="text-emerald-500" />
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {major} • Hồ sơ bảo chứng năng lực trực tuyến
            </p>
          </div>

          {/* Tips banner */}
          <div className="w-full text-left bg-blue-50/70 dark:bg-[#111728] border border-blue-100 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
            <div className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500 shrink-0" />
              <span>Cách sử dụng đạt hiệu quả phỏng vấn cao nhất:</span>
            </div>
            <ul className="text-[11.5px] text-slate-600 dark:text-slate-300 list-disc list-inside space-y-0.5 leading-relaxed">
              <li>In mã QR này lên góc trên CV giấy khi đi phỏng vấn trực tiếp.</li>
              <li>Nhà tuyển dụng quét QR là mở ra video demo, GitHub commits và chứng chỉ thật.</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={handleDownloadQrPng}
              className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Download size={14} />
              <span>Tải Ảnh QR (In CV)</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  <span>Đã chép link!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Chép Link Web</span>
                </>
              )}
            </button>
          </div>

          <a
            href={showcaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Mở trang Showcase công khai trong tab mới</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseQrModal;

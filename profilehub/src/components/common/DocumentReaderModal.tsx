import React from 'react';
import { X, ExternalLink, Download, FileText, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface DocumentReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileUrl: string;
  fileType?: 'pdf' | 'image' | 'generic';
  subtitle?: string;
}

export const DocumentReaderModal: React.FC<DocumentReaderModalProps> = ({
  isOpen,
  onClose,
  title,
  fileUrl,
  fileType,
  subtitle,
}) => {
  const [zoom, setZoom] = React.useState<number>(100);

  if (!isOpen) return null;

  const isPdf = fileType === 'pdf' || fileUrl.toLowerCase().endsWith('.pdf');
  const isImage = fileType === 'image' || /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(fileUrl);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white border border-slate-200 rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 line-clamp-1">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls for Images */}
            {isImage && (
              <div className="flex items-center gap-1 bg-white rounded-xl px-2.5 py-1 border border-slate-200 text-xs text-slate-700 mr-2 shadow-2xs">
                <button
                  onClick={handleZoomOut}
                  title="Thu nhỏ"
                  className="p-1 hover:text-blue-600 transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-mono font-medium">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  title="Phóng to"
                  className="p-1 hover:text-blue-600 transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetZoom}
                  title="Đặt lại"
                  className="p-1 hover:text-blue-600 transition-colors ml-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở tab mới</span>
            </a>

            <a
              href={fileUrl}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải về</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 bg-slate-100/60 p-4 overflow-auto flex items-center justify-center">
          {isPdf ? (
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=0`}
              title={title}
              className="w-full h-full rounded-2xl border border-slate-200 bg-white shadow-sm"
            />
          ) : isImage ? (
            <div className="w-full h-full flex items-center justify-center overflow-auto">
              <img
                src={fileUrl}
                alt={title}
                style={{ transform: `scale(${zoom / 100})`, transition: 'transform 0.15s ease' }}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-md border border-slate-200 origin-center bg-white"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm">
              <FileText className="w-16 h-16 text-slate-400 mb-4" />
              <h4 className="text-lg font-bold text-slate-800 mb-2">Tài liệu đính kèm</h4>
              <p className="text-sm text-slate-500 mb-6">
                Định dạng tệp tin không hỗ trợ xem trực tiếp. Bạn có thể mở tệp tin trong tab mới hoặc tải về máy.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs"
              >
                Mở tệp tin
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

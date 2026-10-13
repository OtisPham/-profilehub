import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, AlertCircle, Eye } from 'lucide-react';

interface FileUploadDropzoneProps {
  onFileUploaded: (fileUrl: string, fileName: string) => void;
  acceptedFormats?: string;
  maxSizeMB?: number;
  label?: string;
  currentUrl?: string;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFileUploaded,
  acceptedFormats = '.pdf,image/png,image/jpeg,image/webp',
  maxSizeMB = 15,
  label = 'Tải lên tài liệu minh chứng (PDF hoặc Hình ảnh)',
  currentUrl,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    setErrorMsg(null);

    // Validate size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMsg(`Tệp tin vượt quá dung lượng cho phép (${maxSizeMB}MB). Vui lòng chọn tệp nhỏ hơn.`);
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    // Simulate upload progress
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          // Generate usable Object URL
          const objectUrl = URL.createObjectURL(file);
          onFileUploaded(objectUrl, file.name);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setFileName('');
    setFileSize('');
    setUploadProgress(null);
    setErrorMsg(null);
    onFileUploaded('', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>

      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all text-center ${
          isDragging
            ? 'border-amber-500 bg-amber-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-amber-600">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900">
              Kéo thả tệp tin PDF/Hình ảnh vào đây, hoặc <span className="text-amber-700 underline">duyệt từ máy tính</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Hỗ trợ định dạng .PDF, .PNG, .JPG, .WEBP (Tối đa {maxSizeMB}MB)
            </p>
          </div>
        </div>
      </div>

      {/* Progress or Uploaded State */}
      {uploadProgress !== null && (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <FileText className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">{fileName}</p>
                <span className="text-[10px] text-slate-500 font-mono">{fileSize}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {uploadProgress === 100 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sẵn sàng</span>
                </span>
              ) : (
                <span className="text-xs font-mono font-bold text-amber-700">{uploadProgress}%</span>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Hủy tệp tin"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {uploadProgress < 100 && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadDropzone;

import React, { useState } from 'react';
import {
  X,
  Plus,
  Target,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Layers,
  Award,
  Users,
  Trophy,
  Languages,
  UserCheck,
  PlusCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SECTION_METADATA, type CVSectionType, type CVSection } from '../../types/cvSection';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingSections: CVSection[];
  onAddSection: (type: CVSectionType, customTitle?: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Target,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Layers,
  Award,
  Users,
  Trophy,
  Languages,
  UserCheck,
  PlusCircle
};

export default function AddSectionModal({
  isOpen,
  onClose,
  existingSections,
  onAddSection
}: AddSectionModalProps) {
  const [selectedType, setSelectedType] = useState<CVSectionType>('work_experience');
  const [customTitle, setCustomTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const existingTypes = new Set(existingSections.map(s => s.type));

  const handleSelect = (type: CVSectionType) => {
    setSelectedType(type);
    setErrorMsg(null);
    if (type !== 'custom' && existingTypes.has(type)) {
      setErrorMsg(`Mục này đã tồn tại trong CV của bạn. Mỗi mục mặc định chỉ được tạo một lần.`);
    }
  };

  const handleConfirm = () => {
    if (selectedType !== 'custom' && existingTypes.has(selectedType)) {
      setErrorMsg(`Mục này đã có trong CV. Vui lòng chọn mục khác hoặc tạo Mục Tùy Chỉnh.`);
      return;
    }

    if (selectedType === 'custom' && !customTitle.trim()) {
      setErrorMsg('Vui lòng nhập tên cho Mục Tùy Chỉnh (ví dụ: Thành Tích Nổi Bật, Bài Báo Khoa Học...)');
      return;
    }

    onAddSection(selectedType, selectedType === 'custom' ? customTitle.trim() : undefined);
    setCustomTitle('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Thêm Mục Mới Vào CV (Add Section)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn loại nội dung bạn muốn bổ sung vào cấu trúc CV.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Selection Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div>{errorMsg}</div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECTION_METADATA.map((meta) => {
              const IconComponent = ICON_MAP[meta.iconName] || PlusCircle;
              const isAlreadyAdded = !meta.allowMultiple && existingTypes.has(meta.type);
              const isSelected = selectedType === meta.type;

              return (
                <button
                  key={meta.type}
                  type="button"
                  onClick={() => handleSelect(meta.type)}
                  className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between relative ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-xs'
                      : isAlreadyAdded
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40 opacity-60 hover:opacity-80'
                      : 'border-slate-200 dark:border-slate-750 hover:border-blue-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : isAlreadyAdded
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {meta.defaultTitle.split('(')[0].trim()}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {meta.defaultTitle.includes('(') ? `(${meta.defaultTitle.split('(')[1]}` : ''}
                        </div>
                      </div>
                    </div>

                    {isAlreadyAdded ? (
                      <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold shrink-0">
                        Đã có
                      </span>
                    ) : isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : null}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {meta.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* If Custom Section is selected, show custom title input */}
          {selectedType === 'custom' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 animate-in fade-in duration-150">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                Tên Mục Tùy Chỉnh:
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => {
                  setCustomTitle(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Ví dụ: THÀNH TÍCH NỔI BẬT / HOẠT ĐỘNG TÌNH NGUYỆN / SỞ THÍCH"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold"
                autoFocus
              />
              <p className="text-[10.5px] text-slate-400">
                Bạn có thể tạo nhiều Mục Tùy Chỉnh với tên gọi và định dạng tự do theo mong muốn.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Thêm Vào CV Ngay
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Settings, X, Check, Eye, EyeOff } from 'lucide-react';
import type { CVSection, SectionSettings } from '../../types/cvSection';

interface SectionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: CVSection | null;
  onSave: (sectionId: string, updatedTitle: string, updatedSettings: SectionSettings) => void;
}

export default function SectionSettingsModal({
  isOpen,
  onClose,
  section,
  onSave
}: SectionSettingsModalProps) {
  const [title, setTitle] = useState('');
  const [settings, setSettings] = useState<SectionSettings>({
    showTitle: true,
    showDivider: true,
    spacing: 'normal',
    titleStyle: 'bold',
    titleCase: 'uppercase'
  });

  useEffect(() => {
    if (section) {
      setTitle(section.title);
      setSettings(section.settings || {
        showTitle: true,
        showDivider: true,
        spacing: 'normal',
        titleStyle: 'bold',
        titleCase: 'uppercase'
      });
    }
  }, [section]);

  if (!isOpen || !section) return null;

  const handleSave = () => {
    onSave(section.id, title.trim() || section.title, settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cài Đặt Mục (Section Settings)
              </h3>
              <p className="text-xs text-slate-500">
                Tùy biến cách hiển thị tiêu đề và khoảng cách của mục này.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Section Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tiêu đề mục (Section Title)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề mục..."
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Display Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 cursor-pointer hover:bg-slate-100/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.showTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, showTitle: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Hiện tiêu đề mục
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 cursor-pointer hover:bg-slate-100/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.showDivider}
                onChange={(e) => setSettings(prev => ({ ...prev, showDivider: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Hiện đường kẻ phân cách
              </span>
            </label>
          </div>

          {/* Title Case Style */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Định dạng chữ tiêu đề (Title Case)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'uppercase', label: 'IN HOA (ABC)' },
                { id: 'capitalize', label: 'Viết Hoa Đầu (Abc)' },
                { id: 'none', label: 'Tự nhiên (abc)' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, titleCase: style.id as any }))}
                  className={`py-2 px-2 text-xs rounded-xl font-semibold border transition-all text-center ${
                    settings.titleCase === style.id
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spacing density for this section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Khoảng cách nội bộ (Spacing)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'compact', label: 'Gọn (Compact)' },
                { id: 'normal', label: 'Chuẩn (Normal)' },
                { id: 'relaxed', label: 'Thoáng (Relaxed)' },
              ].map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, spacing: sp.id as any }))}
                  className={`py-2 px-2 text-xs rounded-xl font-semibold border transition-all text-center ${
                    settings.spacing === sp.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Lưu Cài Đặt
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Settings, X, Check, Eye, EyeOff, Scissors } from 'lucide-react';
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
    titleCase: 'uppercase',
    pageBreakBefore: false
  });

  useEffect(() => {
    if (section) {
      setTitle(section.title);
      setSettings(section.settings || {
        showTitle: true,
        showDivider: true,
        spacing: 'normal',
        titleStyle: 'bold',
        titleCase: 'uppercase',
        pageBreakBefore: false
      });
    }
  }, [section]);

  if (!isOpen || !section) return null;

  const handleSave = () => {
    onSave(section.id, title.trim() || section.title, settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-sky-50/40 to-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-[#1e3a8a]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Cài Đặt Mục (Section Settings)
              </h3>
              <p className="text-xs text-slate-500">
                Tùy biến hiển thị tiêu đề, ngắt trang và khoảng cách của mục.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Section Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề mục (Section Title)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề mục..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] font-semibold text-slate-900"
            />
          </div>

          {/* Display Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.showTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, showTitle: e.target.checked }))}
                className="w-4 h-4 text-[#1e3a8a] rounded focus:ring-[#1e3a8a] cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700">
                Hiện tiêu đề mục
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.showDivider}
                onChange={(e) => setSettings(prev => ({ ...prev, showDivider: e.target.checked }))}
                className="w-4 h-4 text-[#1e3a8a] rounded focus:ring-[#1e3a8a] cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700">
                Hiện đường kẻ phân cách
              </span>
            </label>

            {/* Page Break Toggle */}
            <label className="col-span-2 flex items-start gap-3 p-3 rounded-xl border-2 border-blue-200 bg-blue-50/40 cursor-pointer hover:bg-blue-50/70 transition-colors">
              <input
                type="checkbox"
                checked={Boolean(settings.pageBreakBefore)}
                onChange={(e) => setSettings(prev => ({ ...prev, pageBreakBefore: e.target.checked }))}
                className="mt-0.5 w-4 h-4 text-[#1e3a8a] rounded focus:ring-[#1e3a8a] cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#1e3a8a]" />
                  ✂️ Dấu Ngắt Trang (Bắt Đầu Trang Mới)
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Đẩy toàn bộ mục này sang đầu trang A4 kế tiếp, tránh trường hợp nội dung bị cắt đôi lưng chừng trang.
                </p>
              </div>
            </label>
          </div>

          {/* Title Case Style */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
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
                      ? 'bg-blue-50 border-[#1e3a8a] text-[#1e40af] ring-1 ring-blue-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spacing density for this section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
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
                      ? 'bg-blue-50 border-[#1e3a8a] text-[#1e40af] ring-1 ring-blue-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-[#1e3a8a] hover:bg-[#1e40af] rounded-xl shadow-md shadow-blue-900/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Lưu Cài Đặt
          </button>
        </div>

      </div>
    </div>
  );
}

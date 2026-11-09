import React, { useState } from 'react';
import { jobTemplateBank } from '../../services/jobTemplateBank';
import type { JobTemplateItem } from '../../types/database';
import { Sparkles, Check, DollarSign, Briefcase, ChevronRight, Layers } from 'lucide-react';

interface JobTemplatePickerProps {
  onSelectTemplate: (template: JobTemplateItem) => void;
  selectedTemplateId?: string;
}

export default function JobTemplatePicker({
  onSelectTemplate,
  selectedTemplateId
}: JobTemplatePickerProps) {
  const templates = jobTemplateBank.getAllTemplates();
  const [activeId, setActiveId] = useState<string>(selectedTemplateId || templates[0]?.id || '');

  const formatSalary = (min: number, max: number, curr: string) => {
    if (curr === 'USD') return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    return `${(min / 1000000).toFixed(0)} - ${(max / 1000000).toFixed(0)} triệu VND`;
  };

  return (
    <div className="space-y-3 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 p-3.5 sm:p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
            <Sparkles size={14} />
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Chọn Mẫu JD Chuẩn Ngành IT (1-Click Quick Picker)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Điền sẵn tiêu đề, mô tả, từ khóa công nghệ và dải lương thị trường chuẩn.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 shrink-0">
          6 mẫu sẵn có
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
        {templates.map(tpl => {
          const isSelected = activeId === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => {
                setActiveId(tpl.id);
                onSelectTemplate(tpl);
              }}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {tpl.title}
                  </span>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-indigo-600 text-white shrink-0">
                      <Check size={10} />
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold uppercase text-slate-700 dark:text-slate-300">
                    {tpl.experienceLevel}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    💰 {formatSalary(tpl.salaryMin, tpl.salaryMax, tpl.currency)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {tpl.requiredSkills.slice(0, 4).map((sk, idx) => (
                    <span 
                      key={idx} 
                      className="text-[9.5px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                  {tpl.requiredSkills.length > 4 && (
                    <span className="text-[9px] text-slate-400 font-mono self-center">
                      +{tpl.requiredSkills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                <span>{isSelected ? '✓ Đang áp dụng' : 'Áp dụng mẫu này'}</span>
                <ChevronRight size={13} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

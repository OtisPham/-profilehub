import React, { useState, useRef, useEffect } from 'react';
import {
  generateGoogleCalendarUrl,
  downloadIcsFile,
  type CalendarExportPayload,
} from '../../services/calendarExportService';
import { Calendar, Download, ExternalLink, ChevronDown } from 'lucide-react';

interface CalendarSyncDropdownProps {
  payload: CalendarExportPayload;
  filename?: string;
  size?: 'sm' | 'md';
}

export const CalendarSyncDropdown: React.FC<CalendarSyncDropdownProps> = ({
  payload,
  filename = 'lich-phong-van-profilehub.ics',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const googleUrl = generateGoogleCalendarUrl(payload);

  const isSmall = size === 'sm';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors shadow-xs ${
          isSmall ? 'text-[11px] px-2 py-1' : 'text-xs px-3 py-1.5'
        }`}
      >
        <Calendar className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>Đồng bộ Lịch</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-30 py-1.5 text-xs animate-in fade-in zoom-in-95 duration-100">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Google Calendar</span>
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            type="button"
            onClick={() => {
              downloadIcsFile(payload, filename);
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors text-left"
          >
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4 text-purple-600" />
              <span>Apple / Outlook (.ics)</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

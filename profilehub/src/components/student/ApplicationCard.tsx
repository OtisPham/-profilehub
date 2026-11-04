import React from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  FileText, 
  Mic, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Clock,
  ExternalLink
} from 'lucide-react';
import type { CandidateApplicationItem, ApplicationStage, ApplicationSource } from '../../types/application.types';

interface ApplicationCardProps {
  application: CandidateApplicationItem;
  onViewCv: (app: CandidateApplicationItem) => void;
  onPracticeAi: (app: CandidateApplicationItem) => void;
  onUpdateStage: (id: string, newStage: ApplicationStage) => void;
  onDelete: (id: string) => void;
  onEdit?: (app: CandidateApplicationItem) => void;
}

const STAGES: ApplicationStage[] = ['applied', 'screening', 'assessment', 'interview', 'offer', 'rejected'];

export const getSourceBadge = (source: ApplicationSource) => {
  switch (source) {
    case 'topcv':
      return { label: 'TopCV', bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
    case 'itviec':
      return { label: 'ITviec', bg: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' };
    case 'linkedin':
      return { label: 'LinkedIn', bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
    case 'profilehub':
      return { label: 'ProfileHub', bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
    case 'referral':
      return { label: 'Giới thiệu', bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
    default:
      return { label: 'Khác', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
  }
};

export default function ApplicationCard({
  application,
  onViewCv,
  onPracticeAi,
  onUpdateStage,
  onDelete,
  onEdit
}: ApplicationCardProps) {
  const currentStageIndex = STAGES.indexOf(application.stage);
  const sourceInfo = getSourceBadge(application.applicationSource);

  const handlePrevStage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentStageIndex > 0) {
      onUpdateStage(application.id, STAGES[currentStageIndex - 1]);
    }
  };

  const handleNextStage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentStageIndex < STAGES.length - 1) {
      onUpdateStage(application.id, STAGES[currentStageIndex + 1]);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between">
      <div>
        {/* Header: Company & Source Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 font-bold text-xs">
              {application.companyName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate" title={application.companyName}>
                {application.companyName}
              </h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate" title={application.roleTitle}>
                {application.roleTitle}
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${sourceInfo.bg}`}>
            {sourceInfo.label}
          </span>
        </div>

        {/* Metadata info */}
        <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          {application.salaryExpectation && (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <DollarSign size={13} className="shrink-0" />
              <span>{application.salaryExpectation}</span>
            </div>
          )}

          {application.jobLocation && (
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <MapPin size={13} className="shrink-0" />
              <span className="truncate">{application.jobLocation}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Calendar size={13} className="shrink-0" />
            <span>Nộp ngày: {application.appliedDate}</span>
          </div>

          {/* Linked CV Chip */}
          {application.linkedCvTitle && (
            <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-700 dark:text-slate-300">
              <FileText size={12} className="text-indigo-500 shrink-0" />
              <span className="truncate flex-1">{application.linkedCvTitle}</span>
            </div>
          )}

          {/* Interview Date Highlight */}
          {application.interviewDate && (
            <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
              <Clock size={12} className="shrink-0" />
              <span className="truncate">PV: {application.interviewDate}</span>
            </div>
          )}

          {/* Notes Preview */}
          {application.notes && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              "{application.notes}"
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
        {/* Quick buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onViewCv(application)}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            title="Mở đúng bản CV đã gửi cho công ty này"
          >
            <FileText size={12} />
            <span>Xem CV</span>
          </button>

          <button
            onClick={() => onPracticeAi(application)}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors"
            title="Luyện phỏng vấn AI cho công ty này"
          >
            <Mic size={12} />
            <span>Luyện AI</span>
          </button>
        </div>

        {/* Stage transition arrows & delete */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <button
            disabled={currentStageIndex <= 0}
            onClick={handlePrevStage}
            className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              currentStageIndex <= 0 ? 'opacity-30 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300'
            }`}
            title="Lùi về bước trước"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 capitalize">
            {application.stage}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onDelete(application.id)}
              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-colors"
              title="Xóa đơn ứng tuyển này"
            >
              <Trash2 size={13} />
            </button>

            <button
              disabled={currentStageIndex >= STAGES.length - 1}
              onClick={handleNextStage}
              className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                currentStageIndex >= STAGES.length - 1 ? 'opacity-30 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300'
              }`}
              title="Chuyển sang bước tiếp theo"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

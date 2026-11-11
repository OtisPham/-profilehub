import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

interface ChallengeCountdownWidgetProps {
  deadlineDateStr?: string;
  deadlineHours?: number;
  createdAtStr?: string;
  compact?: boolean;
}

export const ChallengeCountdownWidget: React.FC<ChallengeCountdownWidgetProps> = ({
  deadlineDateStr,
  deadlineHours = 48,
  createdAtStr,
  compact = false,
}) => {
  // Tính toán thời điểm hết hạn
  const calculateTargetTime = (): number => {
    if (deadlineDateStr) {
      const parsed = new Date(deadlineDateStr).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    const created = createdAtStr ? new Date(createdAtStr).getTime() : Date.now();
    return created + deadlineHours * 60 * 60 * 1000;
  };

  const targetTime = calculateTargetTime();
  const [timeLeftMs, setTimeLeftMs] = useState<number>(() => Math.max(0, targetTime - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, targetTime - Date.now());
      setTimeLeftMs(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  const totalHours = Math.floor(timeLeftMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

  const isExpired = timeLeftMs <= 0;
  const isUrgent = totalHours < 12 && !isExpired;
  const isWarning = totalHours >= 12 && totalHours < 24;

  // Màu sắc theo trạng thái
  const badgeColors = isExpired
    ? 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900'
    : isUrgent
    ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 animate-pulse'
    : isWarning
    ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-mono font-semibold ${badgeColors}`}
        title={`Thời gian còn lại: ${totalHours}h ${minutes}m ${seconds}s`}
      >
        <Clock className="w-3 h-3 flex-shrink-0" />
        <span>
          {isExpired ? 'Hết hạn nộp' : `${totalHours}h ${minutes}m`}
        </span>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${badgeColors}`}>
      <div className="flex items-center gap-2 font-medium">
        {isExpired ? (
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
        ) : isUrgent ? (
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400 animate-bounce" />
        ) : (
          <Clock className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
        )}
        <span>
          {isExpired
            ? 'Đã hết thời hạn nộp bài giải thử thách'
            : isUrgent
            ? 'Cảnh báo: Sắp đến hạn chót nộp bài!'
            : 'Thời gian làm bài thử thách còn lại:'}
        </span>
      </div>

      <div className="font-mono font-bold text-sm tracking-wider">
        {isExpired ? (
          <span className="text-xs">00:00:00</span>
        ) : (
          <span>
            {String(totalHours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        )}
      </div>
    </div>
  );
};

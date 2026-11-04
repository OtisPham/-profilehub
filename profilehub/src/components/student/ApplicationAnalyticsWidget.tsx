import React from 'react';
import { Send, Users, Mic, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { ApplicationAnalyticsData } from '../../types/application.types';

interface ApplicationAnalyticsWidgetProps {
  analytics: ApplicationAnalyticsData;
}

export default function ApplicationAnalyticsWidget({ analytics }: ApplicationAnalyticsWidgetProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* 1. Total Applications */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span className="text-xs font-medium">Tổng Đơn Nộp</span>
          <Send size={14} className="text-slate-400" />
        </div>
        <div className="text-xl font-bold text-slate-900 dark:text-white">
          {analytics.total}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">Tất cả các kênh</div>
      </div>

      {/* 2. Active Pipelines */}
      <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-1">
          <span className="text-xs font-medium">Đang Tiến Hành</span>
          <Users size={14} className="text-indigo-500" />
        </div>
        <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
          {analytics.active}
        </div>
        <div className="text-[10px] text-indigo-500/80 mt-0.5">Trong phễu tuyển dụng</div>
      </div>

      {/* 3. Interviews */}
      <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
        <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-1">
          <span className="text-xs font-medium">Được Phỏng Vấn</span>
          <Mic size={14} className="text-amber-500" />
        </div>
        <div className="text-xl font-bold text-amber-800 dark:text-amber-300">
          {analytics.interviews}
        </div>
        <div className="text-[10px] text-amber-600/80 mt-0.5">Vòng kỹ thuật & HR</div>
      </div>

      {/* 4. Offers */}
      <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
        <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-1">
          <span className="text-xs font-medium">Nhận Offer</span>
          <Award size={14} className="text-emerald-500" />
        </div>
        <div className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
          {analytics.offers}
        </div>
        <div className="text-[10px] text-emerald-600/80 mt-0.5">Lời mời nhận việc</div>
      </div>

      {/* 5. Response Rate */}
      <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
        <div className="flex items-center justify-between text-purple-700 dark:text-purple-400 mb-1">
          <span className="text-xs font-medium">Tỷ Lệ Phản Hồi</span>
          <TrendingUp size={14} className="text-purple-500" />
        </div>
        <div className="text-xl font-bold text-purple-800 dark:text-purple-300">
          {analytics.responseRate}%
        </div>
        <div className="w-full bg-purple-200 dark:bg-purple-900/50 h-1.5 rounded-full mt-1.5 overflow-hidden">
          <div 
            className="bg-purple-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, analytics.responseRate)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

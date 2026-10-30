import React, { useState, useEffect } from 'react';
import { 
  Eye, Clock, Flame, Users, CheckCircle2, TrendingUp, 
  Sparkles, Building, ArrowUpRight, BarChart3, RefreshCw
} from 'lucide-react';
import { 
  getTrackingAnalytics, 
  recordCvView, 
  TRACKING_EVENT_NAME, 
  type CvTrackingAnalyticsData 
} from '../../services/cvTrackingAnalyticsService';

interface CvHeatmapWidgetProps {
  compact?: boolean;
}

export default function CvHeatmapWidget({ compact = false }: CvHeatmapWidgetProps) {
  const [analytics, setAnalytics] = useState<CvTrackingAnalyticsData>(getTrackingAnalytics());
  const [simulatedToast, setSimulatedToast] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setAnalytics(e.detail);
      } else {
        setAnalytics(getTrackingAnalytics());
      }
    };
    window.addEventListener(TRACKING_EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(TRACKING_EVENT_NAME, handleUpdate);
  }, []);

  const handleSimulateView = () => {
    const companies = [
      { name: 'VNG Corporation', recruiter: 'Hoàng Anh (Technical Talent Partner)', focused: 'Đồ án Microservices & NestJS' },
      { name: 'Tiki Engineering', recruiter: 'Mai Phương (Lead Recruiter)', focused: 'Kinh nghiệm tối ưu hóa React P99' },
      { name: 'MoMo Payment Platform', recruiter: 'Trần Đạt (Engineering Manager)', focused: 'Tech Stack: TypeScript, Docker, Redis' }
    ];
    const picked = companies[Math.floor(Math.random() * companies.length)];
    const updated = recordCvView({
      recruiterCompany: picked.name,
      recruiterName: picked.recruiter,
      focusedSection: picked.focused
    });
    setAnalytics(updated);
    setSimulatedToast(`Vừa ghi nhận 1 lượt xem mới từ ${picked.name}!`);
    setTimeout(() => setSimulatedToast(null), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 relative overflow-hidden transition-colors">
      {/* Toast simulated */}
      {simulatedToast && (
        <div className="absolute top-4 right-4 z-10 bg-indigo-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{simulatedToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                CV & Portfolio View Tracking & Heatmap
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Live Tracking
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Đo lường thời gian đọc thực tế của Nhà tuyển dụng và bản đồ nhiệt mức độ chú ý từng phần trong hồ sơ.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSimulateView}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          title="Tạo giả lập lượt đọc CV từ nhà tuyển dụng để xem cập nhật thời gian thực"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Mô Phỏng HR Xem CV</span>
        </button>
      </div>

      {/* 4 Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase">
            <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Tổng Lượt Xem
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
            {analytics.totalViews}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            +18% so với tuần trước
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Doanh Nghiệp Độc Lập
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
            {analytics.uniqueRecruiters} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">công ty</span>
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            Shopee, FPT, MoMo, Techcombank...
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Thời Gian Đọc TB
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
            {analytics.avgDwellTimeSeconds} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">giây</span>
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-1">
            ✓ Đạt chuẩn thẩm định chuyên sâu
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Đọc Hết Trang
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
            {analytics.readThroughRate}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Bố cục 1 trang giữ chân HR xuất sắc
          </div>
        </div>
      </div>

      {/* Heatmap Section & AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Section Heatmap Bars (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-100 dark:border-slate-800">
            <span>BẢN ĐỒ NHIỆT MỨC ĐỘ CHÚ Ý (ENGAGEMENT HEATMAP)</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal">Tỷ lệ thời gian dừng</span>
          </div>

          <div className="space-y-3">
            {analytics.heatmap.map(item => (
              <div key={item.sectionId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                    {item.isHotspot && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-rose-500" />
                        HOTSPOT
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-mono font-semibold">
                    <span>{item.percentage}%</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">({item.dwellSeconds}s)</span>
                  </div>
                </div>

                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.intensityColor,
                      boxShadow: item.isHotspot ? `0 0 10px ${item.intensityColor}66` : 'none'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Behavioral Insight Box */}
          <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-slate-800 dark:text-slate-200">
            <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Góc Nhìn Cố Vấn AI:
            </div>
            <p className="leading-relaxed text-amber-950 dark:text-amber-200">
              Nhà tuyển dụng dành đến <strong>75% tổng thời gian</strong> vào 2 mục <em>[Kinh Nghiệm]</em> và <em>[Đồ Án Thực Chiến]</em>. Việc các gạch đầu dòng của bạn đã được chuẩn hóa theo mô hình <strong>STAR/Google XYZ</strong> và đính kèm <strong>Mã QR Live Demo</strong> đã giúp tăng độ tin cậy và thúc đẩy quyết định mời phỏng vấn nhanh hơn 40%.
            </p>
          </div>
        </div>

        {/* Right: Recent Recruiter Visits (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
              <span>NHẬT KÝ HR GHÉ THĂM GẦN ĐÂY</span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{analytics.recentActivities.length} sự kiện</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {analytics.recentActivities.map(log => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">
                        {log.logoText}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{log.company}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{log.recruiterName}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      {log.viewedAt}
                    </span>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="truncate max-w-[190px]">
                      🎯 Chú ý: {log.focusedSection}
                    </span>
                    <span className="font-mono font-semibold text-indigo-700 dark:text-indigo-300 shrink-0">
                      {log.durationSeconds}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>Cập nhật thời gian thực</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Tự động đồng bộ với Showcase</span>
          </div>
        </div>

      </div>
    </div>
  );
}

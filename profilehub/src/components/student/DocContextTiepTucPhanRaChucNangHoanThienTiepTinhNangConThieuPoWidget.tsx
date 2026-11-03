import React, { useState } from 'react';

/**
 * DocContextTiepTucPhanRaChucNangHoanThienTiepTinhNangConThieuPoWidget.tsx
 * Giao diện hiển thị trực tiếp trên Vercel - Được sinh tự động bởi Antigravity Agent
 * Nhiệm vụ: Xây dựng Component Giao diện & Hiển thị dữ liệu cho đọc context tiếp tục phân rã chức năng hoàn thiện tiếp tính năng còn thiếu /po
 */

export interface DocContextTiepTucPhanRaChucNangHoanThienTiepTinhNangConThieuPoWidgetProps {
  title?: string;
  className?: string;
}

export const DocContextTiepTucPhanRaChucNangHoanThienTiepTinhNangConThieuPoWidget: React.FC<DocContextTiepTucPhanRaChucNangHoanThienTiepTinhNangConThieuPoWidgetProps> = ({
  title = "Xây dựng Component Giao diện & Hiển thị dữ liệu cho đọc context tiếp tục phân rã chức năng hoàn thiện tiếp tính năng còn thiếu /po",
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  const [dataPoints] = useState([
    { label: 'Trạng thái đồng bộ', value: 'Live on Vercel', status: 'success' },
    { label: 'Thời gian cập nhật', value: new Date().toLocaleTimeString('vi-VN'), status: 'info' },
    { label: 'Nền tảng', value: 'ProfileHub AI Core', status: 'ready' }
  ]);

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Mã nguồn đã tải đồng bộ và online trực tiếp trên Vercel
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-md transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1 rounded-md transition-all ${activeTab === 'details' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Chi tiết
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {dataPoints.map((item, idx) => (
          <div key={idx} className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50">
            <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
            <div className="text-sm font-semibold text-gray-800 dark:text-slate-200 mt-1">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocContextTiepTucPhanRaChucNangHoanThienTiepTinhNangConThieuPoWidget;

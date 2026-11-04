import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Send, 
  MessageSquare, 
  Code, 
  Mic, 
  Award, 
  Archive,
  RefreshCw,
  FolderKanban
} from 'lucide-react';
import type { 
  CandidateApplicationItem, 
  ApplicationStage, 
  ApplicationSource, 
  StageColumnConfig 
} from '../../types/application.types';
import { applicationTrackerService, APPLICATION_EVENT_NAME } from '../../services/applicationTrackerService';
import ApplicationCard from './ApplicationCard';
import AddApplicationModal from './AddApplicationModal';
import ApplicationAnalyticsWidget from './ApplicationAnalyticsWidget';
import CvQuickViewModal from '../cv/CvQuickViewModal';
import AiMockInterviewModal from './AiMockInterviewModal';
import { cvService, type ManagedCVItem } from '../../services/cvService';
import { useAuth } from '../../context/AuthProvider';

const STAGE_COLUMNS: StageColumnConfig[] = [
  {
    key: 'applied',
    label: 'Đã Nộp Hồ Sơ',
    description: 'Chờ nhà tuyển dụng mở và duyệt CV',
    colorClass: 'border-slate-300 dark:border-slate-700',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-700 dark:text-slate-300',
    iconName: 'Send'
  },
  {
    key: 'screening',
    label: 'HR Liên Hệ / Sơ Vấn',
    description: 'Trao đổi sơ bộ về thời gian & đãi ngộ',
    colorClass: 'border-blue-300 dark:border-blue-700',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/50',
    badgeText: 'text-blue-700 dark:text-blue-300',
    iconName: 'MessageSquare'
  },
  {
    key: 'assessment',
    label: 'Bài Test Kỹ Thuật',
    description: 'Live coding / Take-home assignment',
    colorClass: 'border-indigo-300 dark:border-indigo-700',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    iconName: 'Code'
  },
  {
    key: 'interview',
    label: 'Vòng Phỏng Vấn',
    description: 'Phỏng vấn chuyên sâu hoặc Giám đốc',
    colorClass: 'border-amber-300 dark:border-amber-700',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
    badgeText: 'text-amber-700 dark:text-amber-300',
    iconName: 'Mic'
  },
  {
    key: 'offer',
    label: 'Nhận Offer 🎉',
    description: 'Thư mời làm việc & Thỏa thuận hợp đồng',
    colorClass: 'border-emerald-300 dark:border-emerald-700',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    iconName: 'Award'
  },
  {
    key: 'rejected',
    label: 'Tạm Dừng / Lưu Trữ',
    description: 'Hồ sơ tạm dừng hoặc ứng viên từ chối',
    colorClass: 'border-slate-200 dark:border-slate-800',
    badgeBg: 'bg-slate-50 dark:bg-slate-900',
    badgeText: 'text-slate-500 dark:text-slate-400',
    iconName: 'Archive'
  }
];

export default function ApplicationKanbanBoard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<CandidateApplicationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | ApplicationSource>('all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalDefaultStage, setAddModalDefaultStage] = useState<ApplicationStage>('applied');
  
  const [quickViewCv, setQuickViewCv] = useState<ManagedCVItem | null>(null);
  const [isCvQuickViewOpen, setIsCvQuickViewOpen] = useState(false);

  const [mockInterviewData, setMockInterviewData] = useState<{
    isOpen: boolean;
    companyName: string;
    roleTitle: string;
  }>({
    isOpen: false,
    companyName: '',
    roleTitle: ''
  });

  const loadData = useCallback(() => {
    const list = applicationTrackerService.getApplications(user?.id);
    setApplications(list);
  }, [user?.id]);

  useEffect(() => {
    loadData();
    window.addEventListener(APPLICATION_EVENT_NAME, loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener(APPLICATION_EVENT_NAME, loadData);
      window.removeEventListener('storage', loadData);
    };
  }, [loadData]);

  const handleUpdateStage = (id: string, newStage: ApplicationStage) => {
    applicationTrackerService.updateStage(id, newStage, user?.id);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn ứng tuyển này không?')) {
      applicationTrackerService.deleteApplication(id, user?.id);
      loadData();
    }
  };

  const handleOpenAddModal = (stage: ApplicationStage = 'applied') => {
    setAddModalDefaultStage(stage);
    setIsAddModalOpen(true);
  };

  const handleViewCv = (app: CandidateApplicationItem) => {
    let targetCv: ManagedCVItem | null = null;
    if (app.linkedCvId) {
      targetCv = cvService.getCVById(app.linkedCvId, user?.id);
    }
    if (!targetCv) {
      targetCv = cvService.getActiveCV(user?.id);
    }

    if (targetCv) {
      setQuickViewCv(targetCv);
      setIsCvQuickViewOpen(true);
    } else {
      alert('Chưa tìm thấy bản CV liên kết trong kho. Vui lòng kiểm tra lại trang Quản lý CV.');
    }
  };

  const handlePracticeAi = (app: CandidateApplicationItem) => {
    setMockInterviewData({
      isOpen: true,
      companyName: app.companyName,
      roleTitle: app.roleTitle
    });
  };

  // Filtering
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.roleTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === 'all' || app.applicationSource === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const analytics = applicationTrackerService.getAnalytics(user?.id);

  return (
    <div className="space-y-6">
      {/* 1. Analytics Funnel Banner */}
      <ApplicationAnalyticsWidget analytics={analytics} />

      {/* 2. Top Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-1 items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên công ty hoặc vị trí..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Source Filter Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tất cả nguồn nộp</option>
              <option value="profilehub">ProfileHub</option>
              <option value="topcv">TopCV</option>
              <option value="itviec">ITviec</option>
              <option value="linkedin">LinkedIn</option>
              <option value="referral">Người quen</option>
              <option value="other">Kênh khác</option>
            </select>
          </div>
        </div>

        {/* Action Button: Add Application */}
        <button
          onClick={() => handleOpenAddModal('applied')}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all shrink-0"
        >
          <Plus size={16} />
          <span>Thêm Đơn Ứng Tuyển</span>
        </button>
      </div>

      {/* 3. Horizontal Kanban Columns */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px]">
          {STAGE_COLUMNS.map(column => {
            const columnApps = filteredApps.filter(app => app.stage === column.key);

            return (
              <div
                key={column.key}
                className="flex-1 min-w-[240px] max-w-[280px] bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 flex flex-col"
              >
                {/* Column Header */}
                <div className="pb-3 border-b border-slate-200/80 dark:border-slate-700/60 mb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      {column.label}
                    </h3>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${column.badgeBg} ${column.badgeText}`}>
                      {columnApps.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {column.description}
                  </p>
                </div>

                {/* Column Body: Cards List */}
                <div className="space-y-3 flex-1 min-h-[300px]">
                  {columnApps.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl flex flex-col items-center justify-center p-3 text-center">
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        Chưa có đơn ở chặng này
                      </p>
                      <button
                        onClick={() => handleOpenAddModal(column.key)}
                        className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        + Thêm đơn vào đây
                      </button>
                    </div>
                  ) : (
                    columnApps.map(app => (
                      <ApplicationCard
                        key={app.id}
                        application={app}
                        onViewCv={handleViewCv}
                        onPracticeAi={handlePracticeAi}
                        onUpdateStage={handleUpdateStage}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </div>

                {/* Column Quick Add Footer */}
                <button
                  onClick={() => handleOpenAddModal(column.key)}
                  className="mt-3 w-full py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Thêm công ty</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Modals */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultStage={addModalDefaultStage}
        onCreated={() => loadData()}
      />

      {/* Linked CV Quick View Modal */}
      {quickViewCv && (
        <CvQuickViewModal
          isOpen={isCvQuickViewOpen}
          onClose={() => setIsCvQuickViewOpen(false)}
          cv={quickViewCv}
        />
      )}

      {/* AI Mock Interview Modal */}
      <AiMockInterviewModal
        isOpen={mockInterviewData.isOpen}
        onClose={() => setMockInterviewData({ isOpen: false, companyName: '', roleTitle: '' })}
        companyName={mockInterviewData.companyName}
        roleTitle={mockInterviewData.roleTitle}
      />
    </div>
  );
}

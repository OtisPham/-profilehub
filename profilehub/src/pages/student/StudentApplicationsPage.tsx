import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { 
  applicationService, 
  type StudentApplication, 
  type StudentApplicationStatus,
  type ApplicationAnalyticsSummary,
  type InterviewSchedule
} from '../../services/applicationService';
import { cvService } from '../../services/cvService';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  ExternalLink, 
  FileText, 
  ChevronRight, 
  Archive, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Video, 
  MapPin, 
  Award, 
  TrendingUp, 
  Layers, 
  History,
  X,
  MessageSquare,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import ProjectDefenseModal from '../../components/cv/ProjectDefenseModal';
import type { ProjectItem } from '../../types/cvSection';

interface ColumnDef {
  id: StudentApplicationStatus | 'interview_all';
  label: string;
  statuses: StudentApplicationStatus[];
  color: string;
  badgeBg: string;
}

const COLUMNS: ColumnDef[] = [
  { id: 'preparing', label: 'Chuẩn Bị & Đã Lưu', statuses: ['saved', 'preparing'], color: '#64748b', badgeBg: '#f1f5f9' },
  { id: 'applied', label: 'Đã Nộp Hồ Sơ', statuses: ['applied'], color: '#2563eb', badgeBg: '#eff6ff' },
  { id: 'hr_interview', label: 'Phỏng Vấn HR', statuses: ['hr_interview'], color: '#7c3aed', badgeBg: '#f5f3ff' },
  { id: 'tech_interview', label: 'Phỏng Vấn Kỹ Thuật', statuses: ['tech_interview', 'final_interview'], color: '#4f46e5', badgeBg: '#eef2ff' },
  { id: 'offer', label: 'Nhận Đề Nghị (Offer)', statuses: ['offer'], color: '#059669', badgeBg: '#ecfdf5' },
  { id: 'rejected', label: 'Dừng Tuyển / Đã Rút', statuses: ['rejected', 'withdrawn'], color: '#dc2626', badgeBg: '#fef2f2' },
];

export default function StudentApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [analytics, setAnalytics] = useState<ApplicationAnalyticsSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'kanban' | 'list' | 'interviews' | 'analytics'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<StudentApplication | null>(null);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<StudentApplication | null>(null);
  const [selectedAppForDefense, setSelectedAppForDefense] = useState<StudentApplication | null>(null);

  // Form State Tạo mới Application
  const [newCompany, setNewCompany] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newSource, setNewSource] = useState('TopCV');
  const [newJobUrl, setNewJobUrl] = useState('');
  const [newJdText, setNewJdText] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newStatus, setNewStatus] = useState<StudentApplicationStatus>('applied');
  const [newCvId, setNewCvId] = useState('');
  const [availableCvs, setAvailableCvs] = useState<any[]>([]);

  // Form State Thêm phỏng vấn
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewRound, setInterviewRound] = useState<'hr' | 'technical' | 'final' | 'other'>('technical');
  const [interviewFormat, setInterviewFormat] = useState<'online' | 'offline'>('online');
  const [meetingLink, setMeetingLink] = useState('');
  const [interviewerName, setInterviewerName] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState('');
  const [interviewAnswers, setInterviewAnswers] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState('');
  const [interviewSelfReview, setInterviewSelfReview] = useState('');
  const [interviewNextSteps, setInterviewNextSteps] = useState('');

  const loadData = () => {
    const list = applicationService.getApplications(user?.id, false);
    setApplications(list);
    const summary = applicationService.computeAnalytics(user?.id);
    setAnalytics(summary);
  };

  useEffect(() => {
    loadData();
    const cvs = cvService.getAllCVs(user?.id);
    setAvailableCvs(cvs);
    if (cvs.length > 0 && !newCvId) {
      setNewCvId(cvs[0].id);
    }

    const handleStorage = () => loadData();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user?.id]);

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newPosition.trim()) {
      alert('Vui lòng nhập tên công ty và vị trí ứng tuyển');
      return;
    }

    const chosenCv = availableCvs.find(c => c.id === newCvId);

    applicationService.createApplication({
      studentId: user?.id || 'std_curr',
      companyName: newCompany.trim(),
      position: newPosition.trim(),
      source: newSource,
      jobUrl: newJobUrl.trim(),
      jobDescription: newJdText.trim(),
      status: newStatus,
      priority: newPriority,
      appliedDate: newStatus === 'applied' ? new Date().toISOString().split('T')[0] : undefined,
      cvId: chosenCv?.id,
      cvTitle: chosenCv?.title,
      cvSnapshot: chosenCv?.data,
      notes: `Hồ sơ tạo qua cổng quản lý ứng tuyển cá nhân.`
    }, 'Khởi tạo hồ sơ ứng tuyển');

    setIsCreateModalOpen(false);
    setNewCompany('');
    setNewPosition('');
    setNewJobUrl('');
    setNewJdText('');
    loadData();
  };

  const handleStatusChange = (appId: string, toStatus: StudentApplicationStatus) => {
    applicationService.updateStatus(appId, toStatus, `Chuyển trạng thái sang ${toStatus}`, 'kanban', user?.id);
    loadData();
    if (selectedAppForDetail && selectedAppForDetail.id === appId) {
      setSelectedAppForDetail(applicationService.getApplicationById(appId, user?.id));
    }
  };

  const handleArchive = (appId: string) => {
    applicationService.toggleArchive(appId, user?.id);
    loadData();
    if (selectedAppForDetail?.id === appId) {
      setSelectedAppForDetail(null);
    }
  };

  const handleDelete = (appId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ ứng tuyển này?')) {
      applicationService.deleteApplication(appId, user?.id);
      loadData();
      if (selectedAppForDetail?.id === appId) {
        setSelectedAppForDetail(null);
      }
    }
  };

  const handleSaveInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForInterview || !interviewDate) {
      alert('Vui lòng chọn ngày phỏng vấn');
      return;
    }

    applicationService.addInterview(selectedAppForInterview.id, {
      roundType: interviewRound,
      interviewDate,
      interviewTime,
      format: interviewFormat,
      meetingLink: meetingLink.trim(),
      interviewer: interviewerName.trim(),
      status: 'scheduled',
      notes: {
        questions: interviewQuestions.split('\n').filter(q => q.trim()),
        myAnswers: interviewAnswers.trim(),
        feedback: interviewFeedback.trim(),
        selfReview: interviewSelfReview.trim(),
        nextSteps: interviewNextSteps.trim()
      }
    }, user?.id);

    setSelectedAppForInterview(null);
    setInterviewDate('');
    setInterviewTime('');
    setMeetingLink('');
    setInterviewerName('');
    setInterviewQuestions('');
    setInterviewAnswers('');
    setInterviewFeedback('');
    setInterviewSelfReview('');
    setInterviewNextSteps('');
    loadData();
  };

  const filteredApps = applications.filter(app => {
    const matchSearch = 
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.cvTitle && app.cvTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedStatusFilter === 'all') return matchSearch;
    return matchSearch && app.status === selectedStatusFilter;
  });

  return (
    <div style={{ padding: '24px 30px', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px 28px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Briefcase size={20} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Trung Tâm Quản Lý Ứng Tuyển & Phỏng Vấn
            </h1>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid #bfdbfe'
            }}>
              APPLICATION HUB
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Bảo toàn phiên bản CV snapshot đã nộp, theo dõi tiến trình hồ sơ và chuẩn bị bản lĩnh phỏng vấn kỹ thuật.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            fontWeight: '600',
            fontSize: '13.5px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          <Plus size={16} />
          <span>+ Thêm Cơ Hội / Đơn Mới</span>
        </button>
      </div>

      {/* KPI Analytics Summary Cards */}
      {analytics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              Tổng Cơ Hội Lưu
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
              {analytics.total}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              {analytics.saved + analytics.preparing} đang chuẩn bị CV
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#2563eb', textTransform: 'uppercase', marginBottom: '6px' }}>
              Đã Nộp Hồ Sơ
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb' }}>
              {analytics.applied}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Chờ phản hồi từ HR
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#7c3aed', textTransform: 'uppercase', marginBottom: '6px' }}>
              Vòng Phỏng Vấn
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#7c3aed' }}>
              {analytics.interviewing}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Tỷ lệ vào PV: <strong style={{ color: '#7c3aed' }}>{analytics.interviewRate}%</strong>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#059669', textTransform: 'uppercase', marginBottom: '6px' }}>
              Đề Nghị Việc Làm
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669' }}>
              {analytics.offers}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Tỷ lệ Offer: <strong style={{ color: '#059669' }}>{analytics.offerRate}%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs & Controls */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '12px 16px',
        border: '1px solid #e2e8f0',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('kanban')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'kanban' ? '#eff6ff' : 'transparent',
              color: activeTab === 'kanban' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'kanban' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={15} />
            <span>Bảng Kanban Tiến Trình</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'list' ? '#eff6ff' : 'transparent',
              color: activeTab === 'list' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'list' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={15} />
            <span>Danh Sách Chi Tiết ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('interviews')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'interviews' ? '#eff6ff' : 'transparent',
              color: activeTab === 'interviews' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'interviews' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Calendar size={15} />
            <span>Lịch & Không Gian Phỏng Vấn</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Tìm công ty, vị trí, CV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 32px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '12.5px',
              backgroundColor: '#ffffff',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="saved">Đã lưu (Saved)</option>
            <option value="preparing">Đang chuẩn bị</option>
            <option value="applied">Đã nộp (Applied)</option>
            <option value="hr_interview">Phỏng vấn HR</option>
            <option value="tech_interview">Phỏng vấn Kỹ thuật</option>
            <option value="offer">Đã nhận Offer</option>
            <option value="rejected">Bị từ chối</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {activeTab === 'kanban' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          alignItems: 'start'
        }}>
          {COLUMNS.map(col => {
            const colApps = filteredApps.filter(app => col.statuses.includes(app.status));
            return (
              <div 
                key={col.id}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '14px',
                  minHeight: '400px'
                }}
              >
                {/* Column Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: `2px solid ${col.color}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
                      {col.label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    backgroundColor: col.badgeBg,
                    color: col.color,
                    padding: '2px 7px',
                    borderRadius: '10px'
                  }}>
                    {colApps.length}
                  </span>
                </div>

                {/* Cards List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {colApps.map(app => (
                    <div
                      key={app.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        padding: '14px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        transition: 'transform 0.1s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                          {app.position}
                        </div>
                        {app.priority === 'high' && (
                          <span style={{ fontSize: '9.5px', fontWeight: '800', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1.5px 5px', borderRadius: '4px' }}>
                            HOT
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#2563eb', marginBottom: '8px' }}>
                        {app.companyName}
                      </div>

                      {/* Snapshot CV Info */}
                      {app.cvTitle && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '11px',
                          color: '#475569',
                          backgroundColor: '#f1f5f9',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          marginBottom: '8px'
                        }}>
                          <FileText size={12} color="#64748b" />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {app.cvTitle}
                          </span>
                        </div>
                      )}

                      {/* Date & Interview quick info */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94a3b8', marginBottom: '10px' }}>
                        <span>Nộp: {app.appliedDate || app.createdAt.split('T')[0]}</span>
                        {app.interviews && app.interviews.length > 0 && (
                          <span style={{ color: '#7c3aed', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Calendar size={11} />
                            {app.interviews[0].interviewDate}
                          </span>
                        )}
                      </div>

                      {/* Quick Action Buttons */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                        <button
                          onClick={() => setSelectedAppForDetail(app)}
                          style={{
                            fontSize: '11.5px',
                            fontWeight: '600',
                            color: '#2563eb',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px 0'
                          }}
                        >
                          Chi Tiết & Snapshot →
                        </button>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            title="Lên lịch phỏng vấn & Ghi chép câu hỏi"
                            onClick={() => setSelectedAppForInterview(app)}
                            style={{
                              backgroundColor: '#f5f3ff',
                              color: '#7c3aed',
                              border: '1px solid #ddd6fe',
                              borderRadius: '5px',
                              padding: '3px 6px',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                          >
                            <Calendar size={12} />
                          </button>

                          <button
                            title="Bản lĩnh phòng thủ đồ án trước Tech Lead"
                            onClick={() => setSelectedAppForDefense(app)}
                            style={{
                              backgroundColor: '#eef2ff',
                              color: '#4338ca',
                              border: '1px solid #c7d2fe',
                              borderRadius: '5px',
                              padding: '3px 6px',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                          >
                            <ShieldAlert size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colApps.length === 0 && (
                    <div style={{ padding: '24px 10px', textAlign: 'center', color: '#cbd5e1', fontSize: '12px', fontStyle: 'italic' }}>
                      Không có hồ sơ ở cột này
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: APPLICATION LIST */}
      {activeTab === 'list' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '700', fontSize: '11.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Công Ty & Vị Trí</th>
                <th style={{ padding: '12px 16px' }}>Trạng Thái</th>
                <th style={{ padding: '12px 16px' }}>Bản CV Snapshot</th>
                <th style={{ padding: '12px 16px' }}>Nguồn & Ngày</th>
                <th style={{ padding: '12px 16px' }}>Phỏng Vấn</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{app.position}</div>
                    <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '500' }}>{app.companyName}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as StudentApplicationStatus)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        backgroundColor: 
                          app.status === 'offer' ? '#ecfdf5' :
                          app.status === 'applied' ? '#eff6ff' :
                          app.status.includes('interview') ? '#f5f3ff' :
                          app.status === 'rejected' ? '#fef2f2' : '#f8fafc',
                        color:
                          app.status === 'offer' ? '#059669' :
                          app.status === 'applied' ? '#1d4ed8' :
                          app.status.includes('interview') ? '#6d28d9' :
                          app.status === 'rejected' ? '#b91c1c' : '#475569',
                      }}
                    >
                      <option value="saved">Đã lưu (Saved)</option>
                      <option value="preparing">Đang chuẩn bị</option>
                      <option value="applied">Đã nộp (Applied)</option>
                      <option value="hr_interview">Phỏng vấn HR</option>
                      <option value="tech_interview">Phỏng vấn Kỹ thuật</option>
                      <option value="final_interview">Phỏng vấn Final</option>
                      <option value="offer">Nhận Offer 🎉</option>
                      <option value="rejected">Bị từ chối</option>
                      <option value="withdrawn">Đã rút hồ sơ</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FileText size={13} color="#2563eb" />
                      <span style={{ color: '#334155', fontWeight: '500' }}>
                        {app.cvTitle || 'CV Mặc Định'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12px' }}>
                    <div>{app.source || 'Trực tiếp'}</div>
                    <div style={{ color: '#94a3b8' }}>{app.appliedDate || app.createdAt.split('T')[0]}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {app.interviews && app.interviews.length > 0 ? (
                      <span style={{ fontSize: '12px', color: '#7c3aed', fontWeight: '600' }}>
                        {app.interviews[0].interviewDate} ({app.interviews[0].roundType})
                      </span>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: '#94a3b8', fontStyle: 'italic' }}>Chưa lên lịch</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedAppForDetail(app)}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Chi Tiết
                      </button>
                      <button
                        onClick={() => handleArchive(app.id)}
                        title="Lưu trữ hồ sơ"
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer' }}
                      >
                        <Archive size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        title="Xóa hồ sơ"
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fff5f5', color: '#dc2626', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 3: INTERVIEW WORKSPACE */}
      {activeTab === 'interviews' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {applications.filter(a => a.interviews && a.interviews.length > 0).map(app => (
            <div key={app.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{app.companyName}</h3>
                  <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>{app.position}</div>
                </div>
                <button
                  onClick={() => setSelectedAppForInterview(app)}
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  + Cập Nhật Ghi Chú
                </button>
              </div>

              {app.interviews.map(int => (
                <div key={int.id} style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', marginTop: '10px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Calendar size={14} color="#7c3aed" />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#4338ca' }}>
                      {int.interviewDate} {int.interviewTime ? `lúc ${int.interviewTime}` : ''}
                    </span>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', backgroundColor: '#eef2ff', color: '#4f46e5', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                      Vòng {int.roundType}
                    </span>
                  </div>

                  {int.meetingLink && (
                    <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                      <a href={int.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                        <Video size={13} />
                        <span>Link Google Meet / Zoom</span>
                      </a>
                    </div>
                  )}

                  {int.notes?.questions && int.notes.questions.length > 0 && (
                    <div style={{ marginTop: '8px', fontSize: '12px' }}>
                      <div style={{ fontWeight: '700', color: '#334155', marginBottom: '4px' }}>❓ Câu hỏi đã hỏi:</div>
                      <ul style={{ margin: 0, paddingLeft: '18px', color: '#475569' }}>
                        {int.notes.questions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {int.notes?.selfReview && (
                    <div style={{ marginTop: '8px', fontSize: '12px', backgroundColor: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <strong style={{ color: '#b45309' }}>💡 Tự rút kinh nghiệm:</strong> {int.notes.selfReview}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {applications.filter(a => a.interviews && a.interviews.length > 0).length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <Calendar size={36} color="#94a3b8" style={{ marginBottom: '10px' }} />
              <h4 style={{ margin: '0 0 6px 0', color: '#475569' }}>Chưa có lịch phỏng vấn nào</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                Bấm nút biểu tượng lịch trên từng thẻ hồ sơ ứng tuyển để thêm lịch phỏng vấn và ghi chú chuẩn bị.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: TẠO MỚI ỨNG TUYỂN */}
      {isCreateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Thêm Hồ Sơ Ứng Tuyển Mới</h2>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Tên Công Ty *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Shopee, VNG, FPT Software, Grab..."
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Vị Trí Tuyển Dụng *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Backend Node.js Developer, React Frontend Engineer..."
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    Nguồn Ứng Tuyển
                  </label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#fff' }}
                  >
                    <option value="TopCV">TopCV</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="ITviec">ITviec</option>
                    <option value="ProfileHub">ProfileHub Jobs</option>
                    <option value="Website Công Ty">Website Công Ty</option>
                    <option value="Referral">Người quen giới thiệu</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    Trạng Thái Khởi Tạo
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as StudentApplicationStatus)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#fff' }}
                  >
                    <option value="saved">Đã lưu cơ hội (Saved)</option>
                    <option value="preparing">Đang sửa CV & Chuẩn bị</option>
                    <option value="applied">Đã nộp hồ sơ (Applied)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Gắn Phiên Bản CV (Bảo toàn Snapshot)
                </label>
                <select
                  value={newCvId}
                  onChange={(e) => setNewCvId(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#fff' }}
                >
                  {availableCvs.map(cv => (
                    <option key={cv.id} value={cv.id}>
                      {cv.title} ({cv.targetRole || 'Chung'}) - {cv.isDefault ? '[Mặc định]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Nội Dung JD Tuyển Dụng (Để đối chiếu từ khóa & câu hỏi phỏng vấn)
                </label>
                <textarea
                  rows={4}
                  placeholder="Dán nội dung mô tả công việc (JD)..."
                  value={newJdText}
                  onChange={(e) => setNewJdText(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
                >
                  Lưu Hồ Sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHI TIẾT ỨNG TUYỂN & SNAPSHOT CV */}
      {selectedAppForDetail && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', color: '#2563eb', letterSpacing: '0.04em' }}>
                  CHI TIẾT HỒ SƠ ỨNG TUYỂN
                </span>
                <h2 style={{ margin: '4px 0', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                  {selectedAppForDetail.position}
                </h2>
                <div style={{ fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                  {selectedAppForDetail.companyName}
                </div>
              </div>
              <button onClick={() => setSelectedAppForDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Snapshot CV Info Card */}
              <div style={{ backgroundColor: '#eff6ff', borderRadius: '10px', padding: '14px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#1d4ed8', marginBottom: '4px' }}>
                  📄 BẢN CV SNAPSHOT BẤT BIẾN TẠI THỜI ĐIỂM NỘP:
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                  {selectedAppForDetail.cvTitle || 'CV Mặc Định'}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                  Bản ghi này được đóng băng dữ liệu, đảm bảo ứng viên luôn biết rõ mình đã nộp thông tin đồ án nào cho doanh nghiệp này.
                </div>
              </div>

              {/* JD Box */}
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                  Mô Tả Công Việc (JD Đã Lưu):
                </h4>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12.5px', color: '#475569', whiteSpace: 'pre-wrap', maxHeight: '160px', overflowY: 'auto' }}>
                  {selectedAppForDetail.jobDescription || 'Không có nội dung JD được lưu'}
                </div>
              </div>

              {/* Status History */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <History size={15} color="#64748b" />
                  <span>Lịch Sử Chuyển Đổi Trạng Thái (Status History):</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(selectedAppForDetail.statusHistory || []).map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '12px' }}>
                      <div>
                        <strong style={{ color: '#0f172a' }}>{h.toStatus}</strong>: {h.note || 'Chuyển trạng thái'}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                        {new Date(h.changedAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: LÊN LỊCH & GHI CHÚ PHỎNG VẤN */}
      {selectedAppForInterview && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                  Lịch Phỏng Vấn & Ghi Chép Chiến Lược
                </h3>
                <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>
                  {selectedAppForInterview.companyName} - {selectedAppForInterview.position}
                </div>
              </div>
              <button onClick={() => setSelectedAppForInterview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveInterview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Ngày Phỏng Vấn *
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Giờ Phỏng Vấn
                  </label>
                  <input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Vòng Phỏng Vấn
                  </label>
                  <select
                    value={interviewRound}
                    onChange={(e) => setInterviewRound(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#fff' }}
                  >
                    <option value="hr">Vòng 1: HR Sàng Lọc & Phù Hợp Văn Hóa</option>
                    <option value="technical">Vòng 2: Phỏng Vấn Kỹ Thuật (Tech Lead)</option>
                    <option value="final">Vòng 3: Final với CTO / Giám Đốc</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Hình Thức
                  </label>
                  <select
                    value={interviewFormat}
                    onChange={(e) => setInterviewFormat(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#fff' }}
                  >
                    <option value="online">Online (Google Meet / Zoom / MS Teams)</option>
                    <option value="offline">Trực tiếp tại văn phòng</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Link Họp / Địa Chỉ Phỏng Vấn
                </label>
                <input
                  type="text"
                  placeholder="https://meet.google.com/..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  ❓ Câu Hỏi Phỏng Vấn Dự Kiến Hoặc Đã Hỏi (Mỗi dòng 1 câu)
                </label>
                <textarea
                  rows={3}
                  placeholder="- Giải thích kiến trúc đồ án của bạn?&#10;- Xử lý cache invalidation trong Redis thế nào?&#10;- Điểm yếu lớn nhất của hệ thống bạn từng làm?"
                  value={interviewQuestions}
                  onChange={(e) => setInterviewQuestions(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  💡 Tự Đánh Giá & Rút Kinh Nghiệm (Self-Review Sau Buổi Phỏng Vấn)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi nhận điểm trả lời tốt, điểm lúng túng cần tra cứu lại..."
                  value={interviewSelfReview}
                  onChange={(e) => setInterviewSelfReview(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedAppForInterview(null)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '13px' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#7c3aed', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
                >
                  Lưu Lịch & Ghi Chú
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PHÒNG THỦ ĐỒ ÁN TRƯỚC TECH LEAD */}
      {selectedAppForDefense && (
        <ProjectDefenseModal
          isOpen={!!selectedAppForDefense}
          onClose={() => setSelectedAppForDefense(null)}
          project={
            selectedAppForDefense.cvSnapshot?.sections?.find((s: any) => s.type === 'projects')?.items?.[0] || {
              id: 'p_def',
              projectName: `Đồ án ứng tuyển cho ${selectedAppForDefense.companyName}`,
              role: selectedAppForDefense.position,
              technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
              description: selectedAppForDefense.jobDescription || 'Dự án thực tế'
            }
          }
          targetRole={selectedAppForDefense.position}
        />
      )}

    </div>
  );
}

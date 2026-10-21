import React, { useState, useMemo } from 'react';
import {
  X,
  FolderKanban,
  Award,
  CheckCircle2,
  CheckSquare,
  Square,
  Search,
  ArrowRight,
  ShieldCheck,
  Tag,
  Calendar,
  Sparkles
} from 'lucide-react';
import type { StudentProfileData } from '../../services/cvService';
import type { CVSection, ProjectItem, CertificationItem } from '../../types/cvSection';

interface ProfileDataPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: StudentProfileData | null;
  currentSections: CVSection[];
  onImport: (selectedProjects: ProjectItem[], selectedCerts: CertificationItem[]) => void;
}

export default function ProfileDataPickerModal({
  isOpen,
  onClose,
  profileData,
  currentSections,
  onImport
}: ProfileDataPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'certificates'>('projects');
  const [projectSearch, setProjectSearch] = useState('');
  const [certSearch, setCertSearch] = useState('');

  // Extract all available items from profile
  const allProjects = useMemo(() => profileData?.projects || [], [profileData]);
  const allCerts = useMemo(() => profileData?.certificates || [], [profileData]);

  // Existing item titles in current CV to detect duplicates
  const existingProjectNames = useMemo(() => {
    const projSec = currentSections.find(s => s.type === 'projects');
    const items = (projSec?.items as ProjectItem[]) || [];
    return new Set(items.map(p => p.projectName?.trim().toLowerCase()));
  }, [currentSections]);

  const existingCertNames = useMemo(() => {
    const certSec = currentSections.find(s => s.type === 'certifications');
    const items = (certSec?.items as CertificationItem[]) || [];
    return new Set(items.map(c => c.certificateName?.trim().toLowerCase()));
  }, [currentSections]);

  // Checkbox selection state
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);

  // When modal opens, pre-select items that are NOT yet in the CV
  React.useEffect(() => {
    if (isOpen) {
      const nonDuplicateProjIds = allProjects
        .filter(p => !existingProjectNames.has(p.title?.trim().toLowerCase()))
        .map(p => p.id);
      setSelectedProjectIds(nonDuplicateProjIds.length > 0 ? nonDuplicateProjIds : allProjects.map(p => p.id));

      const nonDuplicateCertIds = allCerts
        .filter(c => !existingCertNames.has(c.title?.trim().toLowerCase()))
        .map(c => c.id);
      setSelectedCertIds(nonDuplicateCertIds.length > 0 ? nonDuplicateCertIds : allCerts.map(c => c.id));
    }
  }, [isOpen, allProjects, allCerts, existingProjectNames, existingCertNames]);

  if (!isOpen) return null;

  // Filtered lists
  const filteredProjects = allProjects.filter(p =>
    projectSearch === '' ||
    p.title?.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.role?.toLowerCase().includes(projectSearch.toLowerCase()) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(projectSearch.toLowerCase())))
  );

  const filteredCerts = allCerts.filter(c =>
    certSearch === '' ||
    c.title?.toLowerCase().includes(certSearch.toLowerCase()) ||
    c.issuer?.toLowerCase().includes(certSearch.toLowerCase())
  );

  // Toggle helpers
  const handleToggleProject = (id: string) => {
    setSelectedProjectIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllProjects = () => {
    setSelectedProjectIds(allProjects.map(p => p.id));
  };

  const handleDeselectAllProjects = () => {
    setSelectedProjectIds([]);
  };

  const handleToggleCert = (id: string) => {
    setSelectedCertIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllCerts = () => {
    setSelectedCertIds(allCerts.map(c => c.id));
  };

  const handleDeselectAllCerts = () => {
    setSelectedCertIds([]);
  };

  // Submit Handler
  const handleConfirmImport = () => {
    const chosenProjects = allProjects.filter(p => selectedProjectIds.includes(p.id));
    const chosenCerts = allCerts.filter(c => selectedCertIds.includes(c.id));

    const convertedProjects: ProjectItem[] = chosenProjects.map(p => ({
      id: `proj_import_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectName: p.title,
      role: p.role || 'Full-stack Developer',
      startDate: '2025',
      endDate: '2026',
      description: p.description || '• Phát triển hệ thống và xử lý logic nghiệp vụ...',
      technologies: p.tags && p.tags.length > 0 ? p.tags : ['React', 'TypeScript', 'Node.js'],
      is_verified: p.is_verified
    }));

    const convertedCerts: CertificationItem[] = chosenCerts.map(c => ({
      id: `cert_import_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      certificateName: c.title,
      organization: c.issuer,
      issueDate: c.issue_date || '2025'
    }));

    onImport(convertedProjects, convertedCerts);
    onClose();
  };

  const totalSelected = selectedProjectIds.length + selectedCertIds.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <FolderKanban size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Kéo Dự Án & Chứng Chỉ Từ Hồ Sơ Cá Nhân
              </h2>
              <p className="text-xs text-slate-500">
                Tick chọn các mục bạn muốn thêm vào bản CV hiện tại. Chỉ các mục được tick mới được lấy qua.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'projects'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderKanban size={16} />
            <span>Dự Án / Đồ Án</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              selectedProjectIds.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {selectedProjectIds.length}/{allProjects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'certificates'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award size={16} />
            <span>Chứng Chỉ & Bằng Cấp</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              selectedCertIds.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {selectedCertIds.length}/{allCerts.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Tìm theo tên dự án, vai trò, công nghệ..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllProjects}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition"
                  >
                    Chọn tất cả ({allProjects.length})
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAllProjects}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition"
                  >
                    Bỏ chọn
                  </button>
                </div>
              </div>

              {/* Projects List */}
              {allProjects.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <FolderKanban size={36} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Chưa có dự án nào trong Hồ Sơ Cá Nhân</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                    Bạn có thể cập nhật thêm đồ án tại trang Hồ Sơ Cá Nhân để đồng bộ qua CV bất cứ lúc nào.
                  </p>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Không tìm thấy dự án nào khớp với từ khóa "{projectSearch}".
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredProjects.map((proj) => {
                    const isSelected = selectedProjectIds.includes(proj.id);
                    const isAlreadyInCV = existingProjectNames.has(proj.title?.trim().toLowerCase());

                    return (
                      <div
                        key={proj.id}
                        onClick={() => handleToggleProject(proj.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        {/* Checkbox Icon */}
                        <div className="mt-0.5 text-blue-600 shrink-0">
                          {isSelected ? (
                            <CheckSquare size={18} className="fill-blue-600 text-white" />
                          ) : (
                            <Square size={18} className="text-slate-300" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {proj.title}
                            </span>
                            {proj.is_verified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                <ShieldCheck size={11} />
                                Verified Project
                              </span>
                            )}
                            {isAlreadyInCV && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                Đã có trong CV
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-500 font-medium mt-1">
                            Vai trò: <span className="text-slate-700 font-semibold">{proj.role || 'Full-stack Developer'}</span>
                          </div>

                          {proj.description && (
                            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {proj.description}
                            </p>
                          )}

                          {proj.tags && proj.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {proj.tags.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={certSearch}
                    onChange={(e) => setCertSearch(e.target.value)}
                    placeholder="Tìm theo tên chứng chỉ, đơn vị cấp..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllCerts}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition"
                  >
                    Chọn tất cả ({allCerts.length})
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAllCerts}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition"
                  >
                    Bỏ chọn
                  </button>
                </div>
              </div>

              {/* Certificates List */}
              {allCerts.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Award size={36} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Chưa có chứng chỉ nào trong Hồ Sơ Cá Nhân</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                    Bạn có thể cập nhật các chứng chỉ đạt được tại mục Chứng Chỉ để tự động đồng bộ sang CV.
                  </p>
                </div>
              ) : filteredCerts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Không tìm thấy chứng chỉ nào khớp với từ khóa "{certSearch}".
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredCerts.map((cert) => {
                    const isSelected = selectedCertIds.includes(cert.id);
                    const isAlreadyInCV = existingCertNames.has(cert.title?.trim().toLowerCase());

                    return (
                      <div
                        key={cert.id}
                        onClick={() => handleToggleCert(cert.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="mt-0.5 text-blue-600 shrink-0">
                          {isSelected ? (
                            <CheckSquare size={18} className="fill-blue-600 text-white" />
                          ) : (
                            <Square size={18} className="text-slate-300" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {cert.title}
                            </span>
                            {isAlreadyInCV && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                Đã có trong CV
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span>Đơn vị cấp: <strong className="text-slate-700">{cert.issuer}</strong></span>
                            {cert.issue_date && (
                              <span className="flex items-center gap-1 text-slate-400">
                                <Calendar size={11} />
                                {cert.issue_date}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            Tổng cộng đã chọn:{' '}
            <strong className="text-blue-700 font-bold">
              {selectedProjectIds.length} dự án
            </strong>
            {' và '}
            <strong className="text-blue-700 font-bold">
              {selectedCertIds.length} chứng chỉ
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition"
            >
              Hủy
            </button>

            <button
              type="button"
              disabled={totalSelected === 0}
              onClick={handleConfirmImport}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition active:scale-95"
            >
              <span>📥 Kéo Vào Bản CV Ngay ({totalSelected})</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

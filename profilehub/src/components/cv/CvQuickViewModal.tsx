import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Printer, 
  Edit3, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Calendar, 
  Award, 
  FileText, 
  Layers,
  GraduationCap,
  Briefcase,
  Star,
  Compass,
  Lightbulb,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { cvService, type ManagedCVItem } from '../../services/cvService';

interface CvQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cv: ManagedCVItem | null;
  aiNotes?: {
    targetRole?: string;
    matchedSkills?: string[];
    highlightedProjects?: string[];
    tailoringSummary?: string[];
    pivotScenario?: 'DIRECT_MATCH' | 'STACK_PIVOT' | 'CAREER_PIVOT';
    pivotStrategySummary?: string;
    transferableSkills?: string[];
    skillGapRecommendations?: string[];
  };
  onOpenInBuilder?: () => void;
  isNewlyCreated?: boolean;
}

export default function CvQuickViewModal({
  isOpen,
  onClose,
  cv,
  aiNotes,
  onOpenInBuilder,
  isNewlyCreated = false
}: CvQuickViewModalProps) {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !cv) return null;

  const data = cv.data;
  const personalInfo = data?.personalInfo || {
    fullName: 'Ứng Viên Tiềm Năng',
    jobTitle: cv.targetRole || 'Chuyên viên kỹ thuật',
    email: 'candidate@example.com',
    phone: '',
    location: '',
    visibleFields: { phone: true, email: true, facebook: false, linkedin: true, website: true, location: true, avatarUrl: false }
  };

  const sections = data?.sections || [];
  const primaryColor = data?.primaryColor || '#1e3a8a';

  const objectiveSection = sections.find(s => s.type === 'objective');
  const skillsSection = sections.find(s => s.type === 'skills');
  const projectsSection = sections.find(s => s.type === 'projects');
  const educationSection = sections.find(s => s.type === 'education');
  const certificationsSection = sections.find(s => s.type === 'certifications');

  const handleEditInBuilder = () => {
    cvService.setActiveCVId(cv.id);
    if (onOpenInBuilder) {
      onOpenInBuilder();
    } else {
      onClose();
      navigate('/cv-builder');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-100 dark:bg-[#0f1523] rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 dark:from-[#090d16] dark:via-[#0f172a] dark:to-[#090d16] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  {isNewlyCreated ? '🎉 Bản CV Vừa Được Tạo Bằng AI' : 'Xem Bản Đọc CV Chi Tiết'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CHUẨN ATS
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                {cv.title} • Vị trí mục tiêu: <span className="text-amber-300 font-bold">{cv.targetRole}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition"
              title="In bản CV này"
            >
              <Printer size={15} />
              <span>In CV</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1 bg-slate-100 dark:bg-[#090d16]">
          
          {/* AI Tailoring Summary Banner (nếu có thông tin tinh chỉnh từ JD) */}
          {(aiNotes || isNewlyCreated) && (
            <div className={`p-4 rounded-2xl border shadow-xs ${
              aiNotes?.pivotScenario === 'STACK_PIVOT'
                ? 'bg-gradient-to-r from-blue-50 via-sky-50 to-slate-50 border-blue-200/90'
                : aiNotes?.pivotScenario === 'CAREER_PIVOT'
                ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-amber-200/90'
                : 'bg-gradient-to-r from-blue-50 via-sky-50 to-slate-50 border-blue-200/80'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                  aiNotes?.pivotScenario === 'STACK_PIVOT'
                    ? 'bg-blue-600 text-white'
                    : aiNotes?.pivotScenario === 'CAREER_PIVOT'
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#1e3a8a] text-white'
                }`}>
                  {aiNotes?.pivotScenario === 'STACK_PIVOT' ? (
                    <Compass size={17} className="text-blue-200" />
                  ) : aiNotes?.pivotScenario === 'CAREER_PIVOT' ? (
                    <Compass size={17} className="text-amber-200" />
                  ) : (
                    <Sparkles size={16} className="text-yellow-300" />
                  )}
                </div>
                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      Chiến Lược Tối Ưu Hóa CV Theo JD Tuyển Dụng
                    </h4>
                    
                    {/* Badge kịch bản */}
                    {aiNotes?.pivotScenario === 'STACK_PIVOT' ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                        ⚡ LỆCH TECH STACK • ÁP DỤNG KỸ NĂNG CHUYỂN ĐỔI
                      </span>
                    ) : aiNotes?.pivotScenario === 'CAREER_PIVOT' ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        🔄 CHUYỂN NGÀNH • KHAI THÁC LỢI THẾ KÉP
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <ShieldCheck size={11} /> ĐÃ KHỚP HỒ SƠ VỚI JD 100%
                      </span>
                    )}
                  </div>

                  {/* Tóm tắt chiến lược cầu nối */}
                  {aiNotes?.pivotStrategySummary && (
                    <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/70 text-xs text-slate-700 leading-relaxed font-medium">
                      <span className="font-bold text-slate-900">Chiến lược xử lý: </span>
                      {aiNotes.pivotStrategySummary}
                    </div>
                  )}

                  {/* Kỹ năng nền tảng có thể chuyển đổi (Khi lệch stack hoặc khác ngành) */}
                  {aiNotes?.transferableSkills && aiNotes.transferableSkills.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap text-xs">
                      <span className="text-[11px] font-bold text-blue-950">Kỹ năng nền tảng chuyển đổi:</span>
                      {aiNotes.transferableSkills.map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-600 text-white font-bold rounded-md text-[10px] shadow-2xs">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Kỹ năng khớp trực tiếp */}
                  {aiNotes?.matchedSkills && aiNotes.matchedSkills.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap text-xs">
                      <span className="text-[11px] font-bold text-slate-900">Kỹ năng khớp trực tiếp với JD:</span>
                      {aiNotes.matchedSkills.map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 bg-emerald-700 text-white font-bold rounded-md text-[10px] shadow-2xs">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Các điểm tinh chỉnh nội dung */}
                  {aiNotes?.tailoringSummary && aiNotes.tailoringSummary.length > 0 && (
                    <ul className="text-[11px] text-slate-700 space-y-1 list-disc list-inside">
                      {aiNotes.tailoringSummary.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {/* Khuyến nghị lấp khoảng trống kỹ năng để gia tăng tỉ lệ đậu phỏng vấn */}
                  {aiNotes?.skillGapRecommendations && aiNotes.skillGapRecommendations.length > 0 && (
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <Lightbulb size={13} className="text-amber-600" />
                        <span>Khuyến nghị từ AI để gia tăng cơ hội trúng tuyển vị trí này:</span>
                      </div>
                      <ul className="text-[11px] text-amber-950/90 space-y-1 pl-4 list-disc">
                        {aiNotes.skillGapRecommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* THE CV PAPER VIEW (Standard A4 White Sheet with Typography) */}
          <div 
            ref={printRef}
            className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 sm:p-10 max-w-3xl mx-auto text-slate-800 space-y-6 print:p-0 print:border-none print:shadow-none"
            style={{ fontFamily: "'Be Vietnam Pro', 'Inter', sans-serif" }}
          >
            {/* 1. Header Information */}
            <div className="border-b-2 pb-5" style={{ borderColor: primaryColor }}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase" style={{ color: primaryColor }}>
                    {personalInfo.fullName}
                  </h1>
                  <p className="text-sm sm:text-base font-bold text-slate-600 mt-1">
                    {personalInfo.jobTitle}
                  </p>
                </div>

                {/* Contact Strip */}
                <div className="text-[11.5px] text-slate-500 space-y-1 sm:text-right">
                  {personalInfo.email && (
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <Mail size={13} className="text-slate-400" />
                      <span>{personalInfo.email}</span>
                    </div>
                  )}
                  {personalInfo.phone && (
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <Phone size={13} className="text-slate-400" />
                      <span>{personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo.location && (
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <MapPin size={13} className="text-slate-400" />
                      <span>{personalInfo.location}</span>
                    </div>
                  )}
                  {personalInfo.linkedin && (
                    <div className="flex items-center sm:justify-end gap-1.5 text-blue-600">
                      <Linkedin size={13} />
                      <span className="line-clamp-1">{personalInfo.linkedin}</span>
                    </div>
                  )}
                  {personalInfo.website && (
                    <div className="flex items-center sm:justify-end gap-1.5 text-slate-600">
                      <Globe size={13} />
                      <span className="line-clamp-1">{personalInfo.website}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Mục Tiêu Nghề Nghiệp (Career Objective) */}
            {objectiveSection?.content && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
                  Mục Tiêu Nghề Nghiệp
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed text-justify">
                  {objectiveSection.content}
                </p>
              </div>
            )}

            {/* 3. Kỹ Năng Kỹ Thuật (Skills Grouped) */}
            {skillsSection?.items && skillsSection.items.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
                  Kỹ Năng Chuyên Môn
                </h2>
                <div className="space-y-2.5">
                  {skillsSection.items.map((group: any, idx: number) => {
                    const isPriorityGroup = idx === 0;
                    return (
                      <div key={group.id || idx} className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                          {isPriorityGroup && <Star size={11} className="text-amber-500 fill-amber-500" />}
                          <span>{group.groupName}:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(group.skills || []).map((sk: string, i: number) => (
                            <span 
                              key={i} 
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                                isPriorityGroup 
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Đồ Án & Dự Án Thực Tế (Projects with STAR bullets) */}
            {projectsSection?.items && projectsSection.items.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
                  Dự Án / Đồ Án Thực Tế
                </h2>
                <div className="space-y-4">
                  {projectsSection.items.map((proj: any, idx: number) => (
                    <div key={proj.id || idx} className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {proj.projectName}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {proj.startDate || '2025'} - {proj.endDate || '2026'}
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-blue-800">
                        Vai trò: {proj.role}
                      </div>

                      {/* STAR Bullet points */}
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                          {proj.bullets.map((b: string, bIdx: number) => (
                            <li key={bIdx} className="leading-relaxed">
                              {b.replace(/^[•\-\*]\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Technologies */}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-0.5 text-[10.5px]">
                          <span className="text-slate-400 font-medium">Công nghệ:</span>
                          <span className="font-semibold text-slate-700">
                            {proj.technologies.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Học Vấn & Bằng Cấp (Education) */}
            {educationSection?.items && educationSection.items.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
                  Học Vấn
                </h2>
                <div className="space-y-2">
                  {educationSection.items.map((edu: any, idx: number) => (
                    <div key={edu.id || idx} className="flex justify-between items-start text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{edu.institution}</div>
                        <div className="text-slate-600">Chuyên ngành: {edu.major}</div>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Chứng Chỉ (Certifications) */}
            {certificationsSection?.items && certificationsSection.items.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200" style={{ color: primaryColor }}>
                  Chứng Chỉ
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {certificationsSection.items.map((cert: any, idx: number) => (
                    <div key={cert.id || idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="font-bold text-slate-800 line-clamp-1">{cert.certificateName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{cert.organization} ({cert.issueDate || '2025'})</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Toolbar */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#0c101c] border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Đóng Xem Trước
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Printer size={15} />
              <span>In Bản CV Này</span>
            </button>

            <button
              onClick={handleEditInBuilder}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1d4ed8] dark:from-indigo-600 dark:to-blue-600 dark:hover:from-indigo-700 dark:hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 size={15} />
              <span>Chỉnh Sửa Trong CV Builder</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import CertificateModal, { CertificateData } from '../../components/certificates/CertificateModal';
import AchievementModal, { AchievementData } from '../../components/achievements/AchievementModal';
import AddProjectModal from '../../components/projects/AddProjectModal';
import { 
  Award, Trophy, User, BookOpen, GraduationCap, Briefcase, Plus, 
  ExternalLink, Trash2, Edit3, Eye, FileText, CheckCircle2, Star, 
  Sparkles, ShieldCheck, X, ArrowUpRight, FolderKanban, Globe, Github
} from 'lucide-react';

export interface ProfileProjectData {
  id: string;
  title: string;
  project_type: string;
  score?: string;
  description: string;
  is_verified?: boolean;
  role: string;
  team_size: string;
  instructor?: string;
  tags: string[];
  image_url: string;
  demo_url?: string;
  github_url?: string;
  figma_url?: string;
  doc_url?: string;
}

const formatExternalUrl = (url?: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return 'https://' + trimmed;
};

interface StudentProfile {
  id?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  major?: string;
  university?: string;
  gpa?: string;
  skills?: string[];
  updated_at?: string;
}

export default function MyProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // =================== PROFILE STATE ===================
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    full_name: '',
    major: '',
    university: 'Trường Đại học Bách Khoa',
    gpa: '',
    bio: '',
    skills: ''
  });

  // =================== PROJECTS STATE ===================
  const [projects, setProjects] = useState<ProfileProjectData[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProfileProjectData | null>(null);

  // =================== CERTIFICATES STATE ===================
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  // =================== ACHIEVEMENTS STATE ===================
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [isAchieveModalOpen, setIsAchieveModalOpen] = useState(false);
  const [selectedAchieve, setSelectedAchieve] = useState<AchievementData | null>(null);

  // =================== VIEWER MODAL STATE (PDF/IMAGE) ===================
  const [viewingFileUrl, setViewingFileUrl] = useState<string | null>(null);

  // Load Profile
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('student_profiles').select('*').eq('id', user.id).single();
    if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        major: data.major || '',
        university: data.university || 'Trường Đại học Bách Khoa',
        gpa: data.gpa || '',
        bio: data.bio || '',
        skills: data.skills ? data.skills.join(', ') : ''
      });
    }
  }, [user]);

  // Load Projects
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data.map(item => ({ ...item, tags: item.tags || [] })));
    }
  }, [user]);

  // Load Certificates
  const fetchCertificates = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCertificates(data);
    }
  }, [user]);

  // Load Achievements
  const fetchAchievements = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAchievements(data);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
    fetchProjects();
    fetchCertificates();
    fetchAchievements();
  }, [fetchProfile, fetchProjects, fetchCertificates, fetchAchievements]);

  // Save Profile Info
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage({ type: '', text: '' });

    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
    const updates = {
      id: user?.id,
      full_name: formData.full_name,
      major: formData.major,
      university: formData.university,
      gpa: formData.gpa,
      bio: formData.bio,
      skills: skillsArray,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('student_profiles').upsert(updates);

    if (error) {
      setProfileMessage({ type: 'error', text: 'Lỗi: ' + error.message });
    } else {
      await fetchProfile();
      setIsEditingProfile(false);
    }
    setSavingProfile(false);
  };

  // Certificate Handlers
  const handleAddNewCert = () => {
    setSelectedCert(null);
    setIsCertModalOpen(true);
  };

  const handleEditCert = (cert: CertificateData) => {
    setSelectedCert(cert);
    setIsCertModalOpen(true);
  };

  const handleDeleteCert = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Bạn có chắc chắn muốn xóa chứng chỉ này?")) {
      await supabase.from('certificates').delete().eq('id', id);
      fetchCertificates();
    }
  };

  // Project Handlers
  const handleAddNewProject = () => {
    setSelectedProject(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (proj: ProfileProjectData) => {
    setSelectedProject(proj);
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  // Achievement Handlers
  const handleAddNewAchieve = () => {
    setSelectedAchieve(null);
    setIsAchieveModalOpen(true);
  };

  const handleEditAchieve = (achieve: AchievementData) => {
    setSelectedAchieve(achieve);
    setIsAchieveModalOpen(true);
  };

  const handleDeleteAchieve = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Bạn có chắc chắn muốn xóa thành tích này?")) {
      await supabase.from('achievements').delete().eq('id', id);
      fetchAchievements();
    }
  };

  // Stats calculation
  const featuredCert = certificates.find(c => c.is_featured) || (certificates.length > 0 ? certificates[0] : null);
  const otherCerts = certificates.filter(c => c !== featuredCert);

  const featuredAchieve = achievements.find(a => a.is_featured) || (achievements.length > 0 ? achievements[0] : null);
  const otherAchieves = achievements.filter(a => a !== featuredAchieve);

  const stats = {
    total: achievements.length,
    academic: achievements.filter(i => i.category === 'Học thuật & NCKH').length,
    hackathon: achievements.filter(i => i.category === 'Cuộc thi & Hackathon').length,
    verified: achievements.filter(i => i.verified).length
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* ===================== STICKY TOP SUB-NAV ===================== */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 30px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
          <span style={{ fontWeight: '600', color: '#1e3a8a' }}>Hồ Sơ Năng Lực Toàn Diện</span>
          <span>/</span>
          <span>{user?.email}</span>
        </div>

        {/* Quick Anchor Navigation */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => scrollToSection('sec-info')}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#334155', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <User size={13} color="#2563eb" /> Thông tin cá nhân
          </button>
          <button 
            onClick={() => scrollToSection('sec-projects')}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#334155', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FolderKanban size={13} color="#2563eb" /> Dự án ({projects.length})
          </button>
          <button 
            onClick={() => scrollToSection('sec-certs')}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#334155', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Award size={13} color="#059669" /> Chứng chỉ ({certificates.length})
          </button>
          <button 
            onClick={() => scrollToSection('sec-achievements')}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#334155', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Trophy size={13} color="#d97706" /> Thành tích ({achievements.length})
          </button>
        </div>
      </header>

      {/* ===================== MAIN CONTAINER ===================== */}
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* ===================== HERO CARD (LINKEDIN STYLE) ===================== */}
        <div id="sec-info" style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* Cover gradient banner */}
          <div style={{ height: '110px', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)' }} />

          <div style={{ padding: '0 30px 24px 30px', marginTop: '-50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              {/* Avatar & Basic Info */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '4px solid #ffffff',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#1e3a8a',
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                }}>
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <User size={40} color="#2563eb" />}
                </div>

                <div style={{ marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                      {profile?.full_name || 'Hồ sơ chưa cập nhật tên'}
                    </h1>
                    <span style={{ fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={13} color="#d97706" /> Verified Candidate
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#475569', fontWeight: '500', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={15} color="#64748b" />
                    <span>{profile?.major || 'Chưa cập nhật chuyên ngành'}</span>
                    <span>•</span>
                    <span>{profile?.university || 'Trường Đại học Bách Khoa'}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: isEditingProfile ? '#eff6ff' : '#ffffff',
                    color: isEditingProfile ? '#1d4ed8' : '#334155',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Edit3 size={14} /> {isEditingProfile ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
                </button>
                <button
                  onClick={() => navigate('/cv-builder')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#1e3a8a',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 4px rgba(30,58,138,0.2)'
                  }}
                >
                  <Sparkles size={14} color="#93c5fd" /> Mở AI CV Builder
                </button>
              </div>
            </div>

            {/* Quick Stats Ribbon */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1d4ed8', backgroundColor: '#dbeafe', padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>
                <FolderKanban size={14} /> {projects.length} Dự án thực tế
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#047857', backgroundColor: '#ecfdf5', padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>
                <Award size={14} /> {certificates.length} Chứng chỉ & Bằng cấp
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#b45309', backgroundColor: '#fffbeb', padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>
                <Trophy size={14} /> {achievements.length} Thành tích & Giải thưởng
              </div>
            </div>
          </div>
        </div>

        {/* ===================== EDIT FORM (NẾU ĐANG BẬT EDIT) ===================== */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} style={{ backgroundColor: '#ffffff', padding: '24px 30px', borderRadius: '16px', border: '1px solid #bfdbfe', boxShadow: '0 4px 12px rgba(37,99,235,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#1e3a8a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={16} /> Cập nhật Thông tin Cá nhân
              </h3>
              <button type="button" onClick={() => setIsEditingProfile(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            {profileMessage.text && (
              <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '6px', fontSize: '13px', backgroundColor: '#fee2e2', color: '#991b1b' }}>
                {profileMessage.text}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>Họ và tên *</label>
                <input required type="text" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>Trường Đại học</label>
                <input type="text" value={formData.university} onChange={e => setFormData({ ...formData, university: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>Chuyên ngành</label>
              <input type="text" value={formData.major} onChange={e => setFormData({ ...formData, major: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>Kỹ năng chuyên môn (Cách nhau bởi dấu phẩy)</label>
              <input type="text" placeholder="React, TypeScript, Node.js, SQL, Git..." value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>Giới thiệu bản thân (Bio)</label>
              <textarea rows={3} placeholder="Mô tả mục tiêu nghề nghiệp, thế mạnh, định hướng phát triển..." value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setIsEditingProfile(false)} style={{ padding: '9px 18px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Hủy</button>
              <button type="submit" disabled={savingProfile} style={{ padding: '9px 20px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>{savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
            </div>
          </form>
        )}

        {/* ===================== SECTION 1: ABOUT & SKILLS DUAL CARDS ===================== */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
          {/* Card About Me & Education */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={17} color="#2563eb" /> Giới Thiệu Bản Thân (About Me)
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {profile?.bio || 'Chưa cập nhật thông tin giới thiệu. Bấm nút "Chỉnh sửa thông tin" ở trên để hoàn thiện phần giới thiệu giúp nhà tuyển dụng ấn tượng hơn.'}
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={17} color="#2563eb" /> Học Vấn & Đào Tạo
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e3a8a' }}>{profile?.university || 'Trường Đại học Bách Khoa'}</div>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '3px' }}>Chuyên ngành: <strong>{profile?.major || 'Công nghệ Thông tin'}</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Skills & Sync */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={17} color="#d97706" /> Kỹ Năng Chuyên Môn
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      style={{
                        fontSize: '12.5px',
                        fontWeight: '600',
                        backgroundColor: '#f1f5f9',
                        color: '#1e293b',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Chưa cập nhật kỹ năng chuyên môn.</span>
                )}
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '22px', border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
                <FileText size={16} /> Đồng bộ sang CV Tuyển dụng
              </div>
              <p style={{ margin: '0 0 14px 0', fontSize: '12.5px', color: '#64748b', lineHeight: '1.6' }}>
                Toàn bộ thông tin cá nhân, bằng cấp và thành tích trên trang này sẽ được tự động đồng bộ sang AI CV Builder để tạo hồ sơ ứng tuyển.
              </p>
              <button
                onClick={() => navigate('/cv-builder')}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Mở AI CV Builder <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 2: QUẢN LÝ DỰ ÁN & MINH CHỨNG KỸ NĂNG (PROJECTS) ===================== */}
        <section id="sec-projects" style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '26px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FolderKanban size={18} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                    Quản Lý Dự Án & Bằng Chứng Năng Lực ({projects.length})
                  </h2>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                    Đồ án môn học, sản phẩm thực tế và dự án nghiên cứu minh chứng cho kỹ năng chuyên môn
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddNewProject}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1e3a8a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(30,58,138,0.2)'
              }}
            >
              <Plus size={15} /> Thêm dự án
            </button>
          </div>

          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <FolderKanban size={36} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Chưa có dự án nào</div>
              <div style={{ fontSize: '12.5px', color: '#94a3b8', marginBottom: '14px' }}>Dự án thực tế là bằng chứng quan trọng nhất giúp nhà tuyển dụng đánh giá năng lực của bạn</div>
              <button onClick={handleAddNewProject} style={{ padding: '7px 14px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}>+ Thêm dự án ngay</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {projects.map((proj) => (
                <div key={proj.id} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#1e40af', backgroundColor: '#eff6ff', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                      {proj.project_type || 'Dự án thực tế'}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                      Vai trò: <strong>{proj.role || 'Thành viên'}</strong>
                    </span>
                  </div>

                  <h3 style={{ margin: '0', fontSize: '15.5px', fontWeight: '700', color: '#0f172a' }}>
                    {proj.title}
                  </h3>

                  {proj.description && (
                    <p style={{ margin: '0', fontSize: '12.5px', color: '#475569', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {proj.description}
                    </p>
                  )}

                  {proj.tags && proj.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {proj.tags.slice(0, 4).map((tag, idx) => (
                        <span key={idx} style={{ fontSize: '10.5px', backgroundColor: '#f1f5f9', color: '#334155', padding: '2px 7px', borderRadius: '4px', fontWeight: '500' }}>
                          {tag}
                        </span>
                      ))}
                      {proj.tags.length > 4 && (
                        <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>+{proj.tags.length - 4}</span>
                      )}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {proj.demo_url && (
                        <a href={formatExternalUrl(proj.demo_url)} target="_blank" rel="noreferrer" style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11.5px', textDecoration: 'none', fontWeight: '600' }}>
                          <Globe size={13} /> Demo
                        </a>
                      )}
                      {proj.github_url && (
                        <a href={formatExternalUrl(proj.github_url)} target="_blank" rel="noreferrer" style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11.5px', textDecoration: 'none', fontWeight: '600' }}>
                          <Github size={13} /> Code
                        </a>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleEditProject(proj)} style={{ padding: '4px 10px', backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}>
                        Sửa
                      </button>
                      <button onClick={() => handleDeleteProject(proj.id)} style={{ padding: '4px 10px', backgroundColor: '#fff1f2', color: '#e11d48', border: 'none', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ===================== SECTION 3: CHỨNG CHỈ & BẰNG CẤP (CERTIFICATES) ===================== */}
        <section id="sec-certs" style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '26px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={18} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                    Chứng Chỉ & Bằng Cấp ({certificates.length})
                  </h2>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                    Xác nhận học thuật, chứng chỉ chuyên môn quốc tế và văn bằng đào tạo
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleAddNewCert}
              style={{
                padding: '8px 16px',
                backgroundColor: '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(5,150,105,0.2)'
              }}
            >
              <Plus size={15} /> Thêm chứng chỉ
            </button>
          </div>

          {certificates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <Award size={36} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Chưa có chứng chỉ hoặc bằng cấp nào</div>
              <div style={{ fontSize: '12.5px', color: '#94a3b8', marginBottom: '14px' }}>Bổ sung chứng chỉ ngoại ngữ, chứng chỉ IT để nâng cao sức cạnh tranh</div>
              <button onClick={handleAddNewCert} style={{ padding: '7px 14px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}>+ Thêm chứng chỉ ngay</button>
            </div>
          ) : (
            <>
              {/* Featured Certificate Card */}
              {featuredCert && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #d1fae5',
                  padding: '20px 24px',
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center',
                  marginBottom: '22px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', marginBottom: '8px' }}>
                      <Star size={12} /> {featuredCert.rank || 'Chứng chỉ tiêu biểu'}
                    </div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', color: '#0f172a', fontWeight: '700' }}>
                      {featuredCert.title}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
                      Đơn vị cấp: <strong>{featuredCert.issuer}</strong> • Thời gian: <strong>{featuredCert.date_awarded || 'Gần đây'}</strong>
                    </div>
                    {featuredCert.description && (
                      <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                        {featuredCert.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => setViewingFileUrl(featuredCert.image_url || null)} 
                        disabled={!featuredCert.image_url} 
                        style={{ padding: '6px 14px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: featuredCert.image_url ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Eye size={13} /> Xem chứng thư
                      </button>
                      <button onClick={() => handleEditCert(featuredCert)} style={{ padding: '6px 12px', backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Edit3 size={13} /> Sửa
                      </button>
                      <button onClick={() => handleDeleteCert(featuredCert.id)} style={{ padding: '6px 12px', backgroundColor: '#fff1f2', color: '#e11d48', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={13} /> Xóa
                      </button>
                    </div>
                  </div>

                  {/* Document preview thumbnail */}
                  <div 
                    onClick={() => featuredCert.image_url && setViewingFileUrl(featuredCert.image_url)}
                    style={{
                      width: '240px',
                      height: '140px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: featuredCert.image_url ? 'pointer' : 'default',
                      flexShrink: 0
                    }}
                  >
                    {featuredCert.image_url ? (
                      featuredCert.image_url.toLowerCase().includes('.pdf') ? (
                        <iframe src={`${featuredCert.image_url}#toolbar=0`} style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }} title="Preview" />
                      ) : (
                        <img src={featuredCert.image_url} alt="Cert" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )
                    ) : (
                      <span style={{ fontSize: '32px' }}>📜</span>
                    )}
                  </div>
                </div>
              )}

              {/* Other Certificates Grid */}
              {otherCerts.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {otherCerts.map((item) => (
                    <div key={item.id} style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#059669', backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                          {item.category}
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '500' }}>{item.date_awarded}</span>
                      </div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#0f172a', fontWeight: '700', lineHeight: '1.4' }}>{item.title}</h4>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{item.issuer}</div>

                      {item.rank && (
                        <div style={{ fontSize: '11.5px', color: '#047857', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '4px', marginBottom: '10px', fontWeight: '600' }}>
                          Kết quả: {item.rank}
                        </div>
                      )}

                      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <button onClick={() => setViewingFileUrl(item.image_url || null)} disabled={!item.image_url} style={{ flex: 1, padding: '5px', backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11.5px', fontWeight: '600', cursor: item.image_url ? 'pointer' : 'not-allowed', opacity: item.image_url ? 1 : 0.4 }}>Xem</button>
                        <button onClick={() => handleEditCert(item)} style={{ flex: 1, padding: '5px', backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}>Sửa</button>
                        <button onClick={() => handleDeleteCert(item.id)} style={{ flex: 1, padding: '5px', backgroundColor: '#fff1f2', color: '#e11d48', border: 'none', borderRadius: '4px', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}>Xóa</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* ===================== SECTION 3: THÀNH TÍCH & KHEN THƯỞNG (ACHIEVEMENTS) ===================== */}
        <section id="sec-achievements" style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '26px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trophy size={18} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                    Thành Tích & Khen Thưởng ({achievements.length})
                  </h2>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                    Giải thưởng học thuật, cuộc thi Hackathon và thành tích nghiên cứu khoa học
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddNewAchieve}
              style={{
                padding: '8px 16px',
                backgroundColor: '#d97706',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(217,119,6,0.2)'
              }}
            >
              <Plus size={15} /> Thêm thành tích
            </button>
          </div>

          {/* Mini Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '22px' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600' }}>TỔNG GIẢI THƯỞNG</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '4px 0' }}>{stats.total}</div>
              <div style={{ fontSize: '11px', color: '#059669' }}>✓ Đã ghi nhận</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600' }}>HỌC THUẬT & NCKH</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '4px 0' }}>{stats.academic}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Đề tài / Giải thưởng</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600' }}>HACKATHON / CUỘC THI</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '4px 0' }}>{stats.hackathon}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Giải đấu công nghệ</div>
            </div>
            <div style={{ backgroundColor: '#fffbeb', padding: '14px 18px', borderRadius: '10px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '11.5px', color: '#b45309', fontWeight: '600' }}>ĐÃ XÁC THỰC BỞI TRƯỜNG</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#92400e', margin: '4px 0' }}>{stats.verified} / {stats.total}</div>
              <div style={{ fontSize: '11px', color: '#b45309' }}>Xác thực chữ ký số</div>
            </div>
          </div>

          {achievements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <Trophy size={36} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Chưa có thành tích hoặc giải thưởng nào</div>
              <div style={{ fontSize: '12.5px', color: '#94a3b8', marginBottom: '14px' }}>Thêm các giải thưởng NCKH, Olympic, Hackathon để làm nổi bật hồ sơ năng lực</div>
              <button onClick={handleAddNewAchieve} style={{ padding: '7px 14px', backgroundColor: '#d97706', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}>+ Thêm thành tích ngay</button>
            </div>
          ) : (
            <>
              {/* Featured Top Achievement */}
              {featuredAchieve && (
                <div style={{
                  backgroundColor: '#fffdf5',
                  borderRadius: '12px',
                  border: '1px solid #fef3c7',
                  padding: '20px 24px',
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center',
                  marginBottom: '22px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', marginBottom: '8px' }}>
                      <Star size={12} /> Thành tích nổi bật nhất
                    </div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#1e3a8a', fontWeight: '700' }}>
                      {featuredAchieve.title}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
                      Cấp độ: <strong>{featuredAchieve.level || 'Cấp Trường'}</strong> • Ngày nhận: <strong>{featuredAchieve.date_awarded || '2025'}</strong>
                    </div>
                    {featuredAchieve.description && (
                      <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                        {featuredAchieve.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {featuredAchieve.image_url && (
                        <button onClick={() => setViewingFileUrl(featuredAchieve.image_url || null)} style={{ padding: '6px 14px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Eye size={13} /> Xem minh chứng
                        </button>
                      )}
                      <button onClick={() => handleEditAchieve(featuredAchieve)} style={{ padding: '6px 12px', backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Edit3 size={13} /> Sửa
                      </button>
                      <button onClick={() => handleDeleteAchieve(featuredAchieve.id)} style={{ padding: '6px 12px', backgroundColor: '#fff1f2', color: '#e11d48', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={13} /> Xóa
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  {featuredAchieve.image_url && (
                    <div 
                      onClick={() => setViewingFileUrl(featuredAchieve.image_url || null)}
                      style={{
                        width: '240px',
                        height: '140px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      {featuredAchieve.image_url.toLowerCase().includes('.pdf') ? (
                        <iframe src={`${featuredAchieve.image_url}#toolbar=0`} style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }} title="Preview" />
                      ) : (
                        <img src={featuredAchieve.image_url} alt="Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Other Achievements Grid */}
              {otherAchieves.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {otherAchieves.map((item) => (
                    <div key={item.id} style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#b45309', backgroundColor: '#fef3c7', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                          {item.category}
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '500' }}>{item.date_awarded}</span>
                      </div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#0f172a', fontWeight: '700', lineHeight: '1.4' }}>{item.title}</h4>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Cấp độ: <strong>{item.level || 'Cấp Trường'}</strong></div>

                      {item.verified && (
                        <div style={{ fontSize: '11.5px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px', fontWeight: '600' }}>
                          <CheckCircle2 size={13} /> Đã xác thực bởi nhà trường
                        </div>
                      )}

                      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        {item.image_url && (
                          <button onClick={() => setViewingFileUrl(item.image_url || null)} style={{ flex: 1, padding: '5px', backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}>Xem</button>
                        )}
                        <button onClick={() => handleEditAchieve(item)} style={{ flex: 1, padding: '5px', backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}>Sửa</button>
                        <button onClick={() => handleDeleteAchieve(item.id)} style={{ flex: 1, padding: '5px', backgroundColor: '#fff1f2', color: '#e11d48', border: 'none', borderRadius: '4px', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}>Xóa</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

      </div>

      {/* ===================== MODALS ===================== */}
      <AddProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSuccess={() => {
          setIsProjectModalOpen(false);
          fetchProjects();
        }}
        editData={selectedProject}
      />

      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        onSuccess={() => {
          setIsCertModalOpen(false);
          fetchCertificates();
        }}
        editData={selectedCert}
      />

      <AchievementModal
        isOpen={isAchieveModalOpen}
        onClose={() => setIsAchieveModalOpen(false)}
        onSuccess={() => {
          setIsAchieveModalOpen(false);
          fetchAchievements();
        }}
        editData={selectedAchieve}
      />

      {/* PDF / Image Viewer Modal */}
      {viewingFileUrl && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '960px', height: '88vh', backgroundColor: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ padding: '14px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Chế độ xem tài liệu minh chứng</div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <a href={viewingFileUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#2563eb', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Mở tab mới <ExternalLink size={13} />
                </a>
                <button onClick={() => setViewingFileUrl(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}>✖</button>
              </div>
            </div>
            <div style={{ flex: 1, width: '100%', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
              {viewingFileUrl.toLowerCase().includes('.pdf') ? (
                <iframe src={viewingFileUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="Viewer" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }}>
                  <img src={viewingFileUrl} alt="Document" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '6px' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
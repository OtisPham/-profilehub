import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import AddProjectModal from '../../components/projects/AddProjectModal';
import VerifiedBadge from '../../components/common/VerifiedBadge';
import ProjectFilePreviewHeader from '../../components/projects/ProjectFilePreviewHeader';
import ProjectQRCodeModal from '../../components/student/ProjectQRCodeModal';
import type { VerificationStatus } from '../../types/database';
import { 
  Building2, Code2, GraduationCap, Shield, Search, Plus, 
  ExternalLink, Github, Figma, FileText, Sparkles, QrCode, 
  Edit3, Trash2, Target, Layers, TrendingUp, Users
} from 'lucide-react';

interface Project {
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
  verification_status?: VerificationStatus;
  teacher_feedback?: string;
}

export default function MyProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [qrModalProject, setQrModalProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Projects from Supabase
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('student_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formattedData = data.map(item => ({
        ...item,
        tags: item.tags || []
      }));
      setProjects(formattedData);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  const handleDelete = async (projectId: string) => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa Case Study dự án này không?");
    if (!isConfirm) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      alert("Lỗi khi xóa: " + error.message);
    } else {
      fetchProjects();
    }
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (proj: Project) => {
    setEditingProject(proj);
    setIsModalOpen(true);
  };

  // Helper to parse STAR framework from description
  const parseSTAR = (desc: string) => {
    if (!desc) return null;
    const challenge = desc.match(/🎯\s*Bài toán & Thách thức:\s*([\s\S]*?)(?=⚙️\s*Giải pháp & Kiến trúc:|$)/i);
    const architecture = desc.match(/⚙️\s*Giải pháp & Kiến trúc:\s*([\s\S]*?)(?=📈\s*Tác động & Chỉ số:|$)/i);
    const impact = desc.match(/📈\s*Tác động & Chỉ số:\s*([\s\S]*?)$/i);

    if (challenge || architecture || impact) {
      return {
        challenge: challenge ? challenge[1].trim() : '',
        architecture: architecture ? architecture[1].trim() : '',
        impact: impact ? impact[1].trim() : ''
      };
    }
    return null;
  };

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(proj => {
      const pType = (proj.project_type || '').toLowerCase();
      const matchSearch = (
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proj.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proj.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      if (!matchSearch) return false;

      if (selectedFilter === 'enterprise') {
        return pType.includes('doanh nghiệp') || pType.includes('khách hàng') || pType.includes('production');
      }
      if (selectedFilter === 'opensource') {
        return pType.includes('mã nguồn mở') || pType.includes('cá nhân') || pType.includes('open source');
      }
      if (selectedFilter === 'academic') {
        return pType.includes('học thuật') || pType.includes('tốt nghiệp') || pType.includes('nckh') || pType.includes('môn học');
      }
      return true;
    });
  }, [projects, searchQuery, selectedFilter]);

  return (
    <div style={{ padding: '0', width: '100%', boxSizing: 'border-box', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Top Header */}
      <header style={{ height: '64px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '13.5px', color: '#64748b' }}>
          <span style={{ fontWeight: '600', color: '#1e3a8a' }}>Technical Case Studies</span> 
          <span style={{ margin: '0 8px' }}>/</span> 
          <span style={{ color: '#0f172a', fontWeight: '500' }}>Architecture & Project Portfolio</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>{user?.email}</span>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1e3a8a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div style={{ padding: '26px 30px', maxWidth: '1240px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Banner Định hướng Cấp bậc (Intern -> Lead) */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e3a8a' }}>
                Hồ Sơ Năng Lực Chuẩn Kỹ Thuật (Từ Intern đến Tech Lead)
              </div>
              <div style={{ fontSize: '12.5px', color: '#3b82f6', marginTop: '2px' }}>
                Nhà tuyển dụng đánh giá cao: <strong>Bài toán hóc búa</strong>, <strong>Kiến trúc hệ thống (System Design)</strong> và <strong>Tác động đo lường được</strong>. Hỗ trợ dự án bảo mật (NDA).
              </div>
            </div>
          </div>
          <button 
            onClick={handleAddNew}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#1e3a8a', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontSize: '13px', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(30,58,138,0.2)'
            }}
          >
            <Plus size={16} /> + Thêm Case Study Dự án
          </button>
        </div>

        {/* Thanh Tìm kiếm & Bộ lọc Cấp bậc */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          
          {/* Tabs Filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedFilter('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: '600',
                border: selectedFilter === 'all' ? '1px solid #1e3a8a' : '1px solid #cbd5e1',
                backgroundColor: selectedFilter === 'all' ? '#1e3a8a' : '#ffffff',
                color: selectedFilter === 'all' ? '#ffffff' : '#475569',
                cursor: 'pointer'
              }}
            >
              Tất cả ({projects.length})
            </button>
            <button
              onClick={() => setSelectedFilter('enterprise')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: '600',
                border: selectedFilter === 'enterprise' ? '1px solid #2563eb' : '1px solid #cbd5e1',
                backgroundColor: selectedFilter === 'enterprise' ? '#eff6ff' : '#ffffff',
                color: selectedFilter === 'enterprise' ? '#1d4ed8' : '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Building2 size={14} /> Doanh nghiệp & Production
            </button>
            <button
              onClick={() => setSelectedFilter('opensource')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: '600',
                border: selectedFilter === 'opensource' ? '1px solid #059669' : '1px solid #cbd5e1',
                backgroundColor: selectedFilter === 'opensource' ? '#ecfdf5' : '#ffffff',
                color: selectedFilter === 'opensource' ? '#047857' : '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Code2 size={14} /> Mã nguồn mở & Cá nhân
            </button>
            <button
              onClick={() => setSelectedFilter('academic')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: '600',
                border: selectedFilter === 'academic' ? '1px solid #7c3aed' : '1px solid #cbd5e1',
                backgroundColor: selectedFilter === 'academic' ? '#f5f3ff' : '#ffffff',
                color: selectedFilter === 'academic' ? '#6d28d9' : '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <GraduationCap size={14} /> Đồ án & NCKH
            </button>
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input 
              type="text" 
              placeholder="Tìm theo tên hệ thống, vai trò, công nghệ..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px 12px 8px 34px', 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1', 
                fontSize: '12.5px',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
              }} 
            />
          </div>
        </div>

        {/* Lưới hiển thị các Case Study Dự án */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '22px', marginBottom: '40px' }}>
          
          {loading ? (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
              Đang tải danh sách Case Study...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '50px 20px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <Code2 size={40} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Chưa có dự án nào trong mục này</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Thêm dự án doanh nghiệp, pet project hoặc đồ án tốt nghiệp để phỏng vấn tuyển dụng</div>
              <button onClick={handleAddNew} style={{ padding: '8px 16px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>+ Thêm dự án ngay</button>
            </div>
          ) : (
            filteredProjects.map((proj) => {
              const isNDA = (proj.title || '').includes('[NDA]') || (proj.description || '').includes('[Confidential]');
              const cleanTitle = (proj.title || '').replace('[NDA]', '').trim();
              const starData = parseSTAR(proj.description);

              const isEnterpriseType = (proj.project_type || '').toLowerCase().includes('doanh nghiệp') || (proj.project_type || '').toLowerCase().includes('khách hàng');
              const isOpenSourceType = (proj.project_type || '').toLowerCase().includes('mã nguồn mở');

              return (
                <div key={proj.id} style={{ backgroundColor: 'white', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}>
                  
                  {/* Header Thumbnail / Architecture Diagram */}
                  <ProjectFilePreviewHeader project={proj} />

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Row Badges: Type & NDA & Verified */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {isEnterpriseType ? (
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#1d4ed8', backgroundColor: '#eff6ff', padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Building2 size={12} /> Doanh Nghiệp
                          </span>
                        ) : isOpenSourceType ? (
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#047857', backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Code2 size={12} /> Open Source
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#6d28d9', backgroundColor: '#f5f3ff', padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <GraduationCap size={12} /> Học Thuật
                          </span>
                        )}

                        {isNDA && (
                          <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#b45309', backgroundColor: '#fef3c7', padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Shield size={11} color="#d97706" /> NDA Protected
                          </span>
                        )}
                      </div>

                      {(proj.verification_status === 'verified' || proj.is_verified) && (
                        <VerifiedBadge size="sm" />
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a', lineHeight: '1.4' }}>
                      {cleanTitle}
                    </h3>

                    {/* Role & Team Size Ribbon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#475569', marginBottom: '14px', backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                      <div>
                        Vai trò: <strong style={{ color: '#0f172a' }}>{proj.role || 'Kỹ sư phát triển'}</strong>
                      </div>
                      <span>•</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} color="#64748b" /> {proj.team_size || '1 thành viên'}
                      </div>
                    </div>

                    {/* Case Study Details (STAR Model Highlight) */}
                    {starData ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', fontSize: '12.5px' }}>
                        {starData.challenge && (
                          <div style={{ backgroundColor: '#fffbeb', padding: '8px 10px', borderRadius: '6px', border: '1px solid #fef3c7' }}>
                            <div style={{ fontWeight: '700', color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', marginBottom: '2px' }}>
                              <Target size={12} /> Bài toán & Thách thức:
                            </div>
                            <div style={{ color: '#78350f', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {starData.challenge}
                            </div>
                          </div>
                        )}

                        {starData.architecture && (
                          <div style={{ backgroundColor: '#eff6ff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dbeafe' }}>
                            <div style={{ fontWeight: '700', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', marginBottom: '2px' }}>
                              <Layers size={12} /> Giải pháp & Kiến trúc:
                            </div>
                            <div style={{ color: '#1e3a8a', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {starData.architecture}
                            </div>
                          </div>
                        )}

                        {starData.impact && (
                          <div style={{ backgroundColor: '#ecfdf5', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1fae5' }}>
                            <div style={{ fontWeight: '700', color: '#047857', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', marginBottom: '2px' }}>
                              <TrendingUp size={12} /> Tác động & Chỉ số:
                            </div>
                            <div style={{ color: '#064e3b', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {starData.impact}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {proj.description ? proj.description.replace('[Confidential / NDA Protected]', '').trim() : 'Chưa có mô tả chi tiết.'}
                      </p>
                    )}

                    {/* Tech Stack Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {proj.tags && proj.tags.map((tag, idx) => (
                        <span key={idx} style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links Row */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      {proj.github_url && (
                        <a href={proj.github_url} target="_blank" rel="noreferrer" style={{ fontSize: '11.5px', color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f8fafc', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: '600' }}>
                          <Github size={12} /> Repo
                        </a>
                      )}
                      {proj.demo_url && (
                        <a href={proj.demo_url} target="_blank" rel="noreferrer" style={{ fontSize: '11.5px', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#eff6ff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #bfdbfe', fontWeight: '600' }}>
                          <ExternalLink size={12} /> Live System
                        </a>
                      )}
                      {proj.figma_url && (
                        <a href={proj.figma_url} target="_blank" rel="noreferrer" style={{ fontSize: '11.5px', color: '#9333ea', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#faf5ff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e9d5ff', fontWeight: '600' }}>
                          <Figma size={12} /> UI Design
                        </a>
                      )}
                      {proj.doc_url && (
                        <a href={proj.doc_url} target="_blank" rel="noreferrer" style={{ fontSize: '11.5px', color: '#059669', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#ecfdf5', padding: '4px 8px', borderRadius: '4px', border: '1px solid #a7f3d0', fontWeight: '600' }}>
                          <FileText size={12} /> Spec/RFC
                        </a>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                      <button
                        onClick={() => setQrModalProject(proj as any)}
                        style={{ padding: '7px 10px', backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <QrCode size={13} /> QR
                      </button>
                      <button 
                        onClick={() => handleEdit(proj)} 
                        style={{ flex: 1, padding: '7px', backgroundColor: '#ffffff', color: '#1e3a8a', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <Edit3 size={13} /> Sửa Case Study
                      </button>
                      <button 
                        onClick={() => handleDelete(proj.id)} 
                        style={{ padding: '7px 10px', backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }} 
                        title="Xóa dự án"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}

          {/* Thẻ Thêm nhanh Case Study Mới */}
          <div 
            onClick={handleAddNew} 
            style={{ 
              backgroundColor: '#f8fafc', 
              borderRadius: '14px', 
              border: '2px dashed #cbd5e1', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: '40px 24px', 
              textAlign: 'center', 
              cursor: 'pointer', 
              minHeight: '380px', 
              transition: 'all 0.15s ease' 
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', marginBottom: '14px', boxShadow: '0 2px 6px rgba(37,99,235,0.15)' }}>
              +
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>
              Khởi tạo Case Study Kỹ Thuật Mới
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '18px', lineHeight: '1.6', maxWidth: '280px' }}>
              Trình bày bài toán quy mô, sơ đồ kiến trúc và các chỉ số đo lường thực tế để chinh phục nhà tuyển dụng cấp cao.
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); handleAddNew(); }} 
              style={{ padding: '9px 18px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}
            >
              Soạn thảo Case Study →
            </button>
          </div>

        </div>

      </div>

      {/* Modals */}
      <AddProjectModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingProject(null); }} 
        onSuccess={fetchProjects} 
        editData={editingProject} 
      />

      {qrModalProject && (
        <ProjectQRCodeModal project={qrModalProject as any} onClose={() => setQrModalProject(null)} />
      )}

    </div>
  );
}

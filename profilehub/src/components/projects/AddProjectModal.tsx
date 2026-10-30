import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthProvider';
import type { VerificationStatus } from '../../types/database';
import { 
  Building2, Globe, GraduationCap, Shield, Code2, 
  FileText, Sparkles, Upload, Zap, Github, X, Check, ArrowRight, Layers, Target, TrendingUp
} from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: {
    id?: string;
    title?: string;
    project_type?: string;
    description?: string;
    role?: string;
    team_size?: string;
    instructor?: string;
    score?: string;
    tags?: string[];
    image_url?: string;
    demo_url?: string;
    github_url?: string;
    figma_url?: string;
    doc_url?: string;
    is_verified?: boolean;
    verification_status?: VerificationStatus;
  } | null;
}

export default function AddProjectModal({ isOpen, onClose, onSuccess, editData }: AddProjectModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [projectType, setProjectType] = useState('Dự án doanh nghiệp / Khách hàng');
  const [isNDAProtected, setIsNDAProtected] = useState(false);
  // GitHub Auto-Fill State
  const [isScanningGitHub, setIsScanningGitHub] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleScanGitHub = async () => {
    setScanFeedback(null);
    let clean = (formData.github_url || '').trim();
    clean = clean.replace(/^https?:\/\//i, '').replace(/^github\.com\//i, '').replace(/\/$/, '').replace(/\.git$/i, '');
    const parts = clean.split('/');
    if (parts.length < 2 || !parts[0] || !parts[1]) {
      setScanFeedback({ type: 'error', message: 'Vui lòng nhập định dạng: github.com/owner/repo hoặc owner/repo' });
      return;
    }

    const owner = parts[0];
    const repo = parts[1];
    setIsScanningGitHub(true);

    try {
      // 1. Fetch Repo info
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoRes.ok) {
        throw new Error(`Không thể tìm thấy repo public "${owner}/${repo}". Hãy kiểm tra lại link.`);
      }
      const repoData = await repoRes.json();

      // 2. Fetch package.json
      let detectedTechs: string[] = [];
      let detectedRole = 'Fullstack Developer';
      let backendScore = 0;
      let frontendScore = 0;

      if (repoData.language) detectedTechs.push(repoData.language);

      try {
        const pkgRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/package.json`);
        if (pkgRes.ok) {
          const pkg = await pkgRes.json();
          const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
          const depNames = Object.keys(allDeps);

          if (depNames.some(d => d.includes('react'))) { detectedTechs.push('React'); frontendScore += 2; }
          if (depNames.some(d => d.includes('vue'))) { detectedTechs.push('Vue.js'); frontendScore += 2; }
          if (depNames.some(d => d.includes('next'))) { detectedTechs.push('Next.js'); frontendScore += 2; }
          if (depNames.some(d => d.includes('tailwind'))) { detectedTechs.push('Tailwind CSS'); frontendScore += 1; }
          if (depNames.some(d => d.includes('express'))) { detectedTechs.push('Express.js'); backendScore += 2; }
          if (depNames.some(d => d.includes('nest'))) { detectedTechs.push('NestJS'); backendScore += 2; }
          if (depNames.some(d => d.includes('prisma'))) { detectedTechs.push('Prisma ORM'); backendScore += 2; }
          if (depNames.some(d => d.includes('mongodb') || d.includes('mongoose'))) { detectedTechs.push('MongoDB'); backendScore += 2; }
          if (depNames.some(d => d.includes('typescript')) && !detectedTechs.includes('TypeScript')) detectedTechs.push('TypeScript');
        }
      } catch {
        // Continue
      }

      if (frontendScore > backendScore + 1) detectedRole = 'Frontend Developer';
      else if (backendScore > frontendScore + 1) detectedRole = 'Backend Developer';

      detectedTechs = Array.from(new Set(detectedTechs));
      const cleanTitle = repoData.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      const techString = detectedTechs.join(', ');

      setFormData(prev => ({
        ...prev,
        title: prev.title || cleanTitle,
        role: prev.role || detectedRole,
        team_size: prev.team_size || '3',
        tags: prev.tags ? prev.tags : techString,
        github_url: repoData.html_url || `https://github.com/${owner}/${repo}`,
        demo_url: prev.demo_url || repoData.homepage || '',
        challenge: prev.challenge || (repoData.description || `Xây dựng giải pháp ${cleanTitle} phục vụ nhu cầu nghiệp vụ với hiệu năng cao.`),
        architecture: prev.architecture || `Triển khai bằng ${techString}, thiết kế theo mô hình mô-đun hóa, tối ưu truy vấn và khả năng tái sử dụng component.`,
        impact: prev.impact || `Hệ thống triển khai ổn định với đầy đủ mã nguồn và quản lý qua Git version control.`
      }));

      setScanFeedback({
        type: 'success',
        message: `✓ Đã tự động điền Tên, Tags (${techString}), Vai trò (${detectedRole}) và khung STAR!`
      });
    } catch (err: any) {
      setScanFeedback({ type: 'error', message: err.message || 'Lỗi khi quét repo GitHub.' });
    } finally {
      setIsScanningGitHub(false);
    }
  };

  const [describeMode, setDescribeMode] = useState<'star' | 'freeform'>('star');

  const [formData, setFormData] = useState({
    title: '',
    role: '',
    team_size: '',
    instructor: '',
    score: '',
    tags: '',
    github_url: '',
    demo_url: '',
    figma_url: '',
    doc_url: '',
    // STAR Framework fields
    challenge: '',
    architecture: '',
    impact: '',
    // Freeform description
    freeform_desc: ''
  });

  // Helper function to extract STAR fields from existing formatted description
  const parseDescription = (desc: string) => {
    if (!desc) return { challenge: '', architecture: '', impact: '', freeform: '' };
    
    const challengeMatch = desc.match(/🎯\s*Bài toán & Thách thức:\s*([\s\S]*?)(?=⚙️\s*Giải pháp & Kiến trúc:|$)/i);
    const architectureMatch = desc.match(/⚙️\s*Giải pháp & Kiến trúc:\s*([\s\S]*?)(?=📈\s*Tác động & Chỉ số:|$)/i);
    const impactMatch = desc.match(/📈\s*Tác động & Chỉ số:\s*([\s\S]*?)$/i);

    if (challengeMatch || architectureMatch || impactMatch) {
      return {
        challenge: challengeMatch ? challengeMatch[1].trim() : '',
        architecture: architectureMatch ? architectureMatch[1].trim() : '',
        impact: impactMatch ? impactMatch[1].trim() : '',
        freeform: desc
      };
    }
    return { challenge: '', architecture: '', impact: '', freeform: desc };
  };

  useEffect(() => {
    if (editData && isOpen) {
      const parsed = parseDescription(editData.description || '');
      const isStar = Boolean(parsed.challenge || parsed.architecture || parsed.impact);
      
      setProjectType(editData.project_type || 'Dự án doanh nghiệp / Khách hàng');
      setIsNDAProtected((editData.title || '').includes('[NDA]') || (editData.description || '').includes('[Confidential]'));
      setDescribeMode(isStar ? 'star' : 'freeform');

      setFormData({
        title: (editData.title || '').replace('[NDA]', '').trim(),
        role: editData.role || '',
        team_size: editData.team_size || '',
        instructor: editData.instructor || '',
        score: editData.score || '',
        tags: editData.tags ? editData.tags.join(', ') : '',
        github_url: editData.github_url || '',
        demo_url: editData.demo_url || '',
        figma_url: editData.figma_url || '',
        doc_url: editData.doc_url || '',
        challenge: parsed.challenge,
        architecture: parsed.architecture,
        impact: parsed.impact,
        freeform_desc: parsed.freeform
      });
      setFilePreviewUrl(editData.image_url || null);
    } else if (isOpen) {
      setProjectType('Dự án doanh nghiệp / Khách hàng');
      setIsNDAProtected(false);
      setDescribeMode('star');
      setFormData({
        title: '',
        role: 'Tech Lead / Senior Engineer',
        team_size: '6 - 10 thành viên',
        instructor: '',
        score: '',
        tags: 'Microservices, Docker, Kafka, PostgreSQL, React, Node.js',
        github_url: '',
        demo_url: '',
        figma_url: '',
        doc_url: '',
        challenge: '',
        architecture: '',
        impact: '',
        freeform_desc: ''
      });
      setSelectedFile(null);
      setFilePreviewUrl(null);
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const validateAndSetFile = (file: File) => {
    setError(null);
    const validExtensions = ['pdf', 'html', 'png', 'jpg', 'jpeg', 'webp'];
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    if (validExtensions.includes(fileExt) || file.type.startsWith('image/')) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFilePreviewUrl(URL.createObjectURL(file));
      }
    } else {
      setError('Hệ thống hỗ trợ ảnh Sơ đồ kiến trúc (.PNG, .JPG, .WebP) hoặc tài liệu (.PDF, .HTML)');
    }
  };

  const handleDrag = (e: React.DragEvent) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); 
    else if (e.type === "dragleave") setDragActive(false); 
  };

  const handleDrop = (e: React.DragEvent) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    setDragActive(false); 
    if (e.dataTransfer.files && e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    e.preventDefault(); 
    if (e.target.files && e.target.files[0]) validateAndSetFile(e.target.files[0]); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let finalImageUrl = editData ? editData.image_url : '';
    let finalDocUrl = formData.doc_url || (editData ? editData.doc_url : '');

    // Handle File Upload
    if (selectedFile) {
      setUploadStatus(`Đang tải lên tài liệu / sơ đồ: ${selectedFile.name}...`);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`; 

      const { error: uploadError } = await supabase.storage.from('portfolio_files').upload(filePath, selectedFile);

      if (uploadError) {
        setError(`Lỗi upload file: ${uploadError.message}`);
        setLoading(false); 
        setUploadStatus(null); 
        return;
      }
      const { data: urlData } = supabase.storage.from('portfolio_files').getPublicUrl(filePath);
      
      if (selectedFile.type.startsWith('image/')) {
        finalImageUrl = urlData.publicUrl;
      } else {
        finalDocUrl = urlData.publicUrl;
      }
      setUploadStatus('Upload thành công! Đang lưu hồ sơ dự án...');
    }

    // Build structured description if STAR mode
    let finalDescription = '';
    if (describeMode === 'star') {
      const parts = [];
      if (formData.challenge.trim()) {
        parts.push(`🎯 Bài toán & Thách thức:\n${formData.challenge.trim()}`);
      }
      if (formData.architecture.trim()) {
        parts.push(`⚙️ Giải pháp & Kiến trúc:\n${formData.architecture.trim()}`);
      }
      if (formData.impact.trim()) {
        parts.push(`📈 Tác động & Chỉ số:\n${formData.impact.trim()}`);
      }
      finalDescription = parts.join('\n\n') || formData.freeform_desc;
    } else {
      finalDescription = formData.freeform_desc;
    }

    if (isNDAProtected && !finalDescription.includes('[Confidential]')) {
      finalDescription = `[Confidential / NDA Protected]\n${finalDescription}`;
    }

    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const cleanTitle = isNDAProtected && !formData.title.startsWith('[NDA]') 
      ? `[NDA] ${formData.title.trim()}` 
      : formData.title.trim();

    const defaultThumbnail = finalImageUrl || (editData ? editData.image_url : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=60');

    const projectPayload = {
      student_id: user?.id,
      title: cleanTitle,
      project_type: projectType,
      description: finalDescription,
      role: formData.role,
      team_size: formData.team_size || '1 thành viên',
      instructor: projectType.includes('Học thuật') ? formData.instructor : '',
      score: projectType.includes('Học thuật') ? formData.score : '',
      tags: tagsArray,
      image_url: defaultThumbnail, 
      demo_url: formData.demo_url || null,
      github_url: formData.github_url || null,
      figma_url: formData.figma_url || null,
      doc_url: finalDocUrl || null,
      is_verified: editData ? editData.is_verified : true,
      verification_status: editData?.verification_status || 'verified'
    };

    const { error: dbError } = editData
      ? await supabase.from('projects').update(projectPayload).eq('id', editData.id)
      : await supabase.from('projects').insert([projectPayload]);

    if (dbError) {
      setError(dbError.message);
    } else {
      onSuccess(); 
      onClose();   
    }
    setLoading(false);
  };

  const isEnterprise = projectType.includes('doanh nghiệp') || projectType.includes('Khách hàng');
  const isAcademic = projectType.includes('Học thuật') || projectType.includes('Đồ án tốt nghiệp');

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '820px', borderRadius: '14px', padding: '28px 32px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
        
        {/* Header Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#2563eb', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
              Technical Portfolio & Case Study Showcase
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: '700' }}>
              {editData ? "Cập nhật Case Study Dự án" : "Khởi tạo Case Study & Dự án Năng Lực"}
            </h2>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
              Thể hiện chiều sâu tư duy giải quyết bài toán, kiến trúc hệ thống và tác động thực tế (Từ Intern đến Lead)
            </div>
          </div>
          <button onClick={onClose} disabled={loading} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {error && <div style={{ padding: '10px 14px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: '500' }}>{error}</div>}
        {uploadStatus && <div style={{ padding: '10px 14px', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: '600' }}>⏳ {uploadStatus}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
          
          {/* 1. Chọn loại dự án (Segmented Cards) */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
              Loại hình dự án & Bối cảnh *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div 
                onClick={() => setProjectType('Dự án doanh nghiệp / Khách hàng')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isEnterprise ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  backgroundColor: isEnterprise ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '13px', color: isEnterprise ? '#1d4ed8' : '#0f172a', marginBottom: '3px' }}>
                  <Building2 size={16} color={isEnterprise ? '#2563eb' : '#64748b'} /> Doanh nghiệp / Sản phẩm
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Production, Enterprise, B2B/B2C (NDA Friendly)</div>
              </div>

              <div 
                onClick={() => setProjectType('Mã nguồn mở (Open Source)')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: projectType.includes('Mã nguồn mở') ? '2px solid #059669' : '1px solid #cbd5e1',
                  backgroundColor: projectType.includes('Mã nguồn mở') ? '#ecfdf5' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '13px', color: projectType.includes('Mã nguồn mở') ? '#047857' : '#0f172a', marginBottom: '3px' }}>
                  <Code2 size={16} color={projectType.includes('Mã nguồn mở') ? '#059669' : '#64748b'} /> Mã nguồn mở / Cá nhân
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Side project, thư viện GitHub, tool cộng đồng</div>
              </div>

              <div 
                onClick={() => setProjectType('Đồ án tốt nghiệp / Học thuật')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isAcademic ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                  backgroundColor: isAcademic ? '#f5f3ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '13px', color: isAcademic ? '#6d28d9' : '#0f172a', marginBottom: '3px' }}>
                  <GraduationCap size={16} color={isAcademic ? '#7c3aed' : '#64748b'} /> Đồ án & NCKH
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Khóa luận tốt nghiệp, đồ án môn học, đề tài</div>
              </div>
            </div>
          </div>

          {/* 2. NDA Friendly Banner nếu là dự án doanh nghiệp */}
          {isEnterprise && (
            <div style={{ backgroundColor: isNDAProtected ? '#fef3c7' : '#f8fafc', border: isNDAProtected ? '1px solid #fde68a' : '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={18} color={isNDAProtected ? '#b45309' : '#64748b'} />
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: isNDAProtected ? '#92400e' : '#334155' }}>
                    Chế độ Tuân thủ Thỏa thuận Bảo mật (NDA-Friendly Mode)
                  </div>
                  <div style={{ fontSize: '11.5px', color: isNDAProtected ? '#b45309' : '#64748b' }}>
                    Tự động dán nhãn bảo mật, cho phép ẩn danh đối tác và hoàn toàn không yêu cầu tải lên mã nguồn.
                  </div>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: '#1e3a8a' }}>
                <input 
                  type="checkbox" 
                  checked={isNDAProtected} 
                  onChange={e => setIsNDAProtected(e.target.checked)} 
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Bật bảo mật NDA
              </label>
            </div>
          )}

          
          {/* ⚡ Quick GitHub Auto-Fill Bar */}
          <div style={{ backgroundColor: '#0f172a', color: 'white', borderRadius: '10px', padding: '12px 16px', marginBottom: '18px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px' }}>⚡</span>
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#60a5fa' }}>Điền Nhanh Từ GitHub Repo (Tự động 80%)</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Bóc tách Tech-Stack & STAR</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Dán link GitHub (ví dụ: github.com/username/project)..."
                value={formData.github_url}
                onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: 'white', fontSize: '12px', outline: 'none' }}
              />
              <button
                type="button"
                onClick={handleScanGitHub}
                disabled={isScanningGitHub || !formData.github_url.trim()}
                style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              >
                {isScanningGitHub ? 'Đang quét...' : '🚀 Quét & Điền Tự Động'}
              </button>
            </div>
            {scanFeedback && (
              <div style={{ marginTop: '8px', fontSize: '11px', color: scanFeedback.type === 'success' ? '#34d399' : '#f87171', fontWeight: '600' }}>
                {scanFeedback.message}
              </div>
            )}
          </div>

          {/* 3. Tên dự án & Vai trò & Quy mô */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                Tên Dự án / Hệ thống *
              </label>
              <input 
                type="text" 
                required 
                placeholder={isNDAProtected ? "VD: Nền tảng Core Banking đa kênh (Ngân hàng TMCP)" : "VD: Nền tảng E-Commerce Omni-channel"} 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                Vai trò / Cấp bậc đảm nhiệm *
              </label>
              <input 
                type="text" 
                required
                placeholder="VD: Tech Lead, Senior Backend, Fullstack..." 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})} 
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                Quy mô đội ngũ
              </label>
              <input 
                type="text" 
                placeholder="VD: 8 dev, 2 QA" 
                value={formData.team_size} 
                onChange={e => setFormData({...formData, team_size: e.target.value})} 
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' }} 
              />
            </div>
          </div>

          {/* Nếu là đồ án học thuật: Hiển thị Giảng viên & Điểm số */}
          {isAcademic && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', backgroundColor: '#f5f3ff', padding: '12px 14px', borderRadius: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#5b21b6', marginBottom: '4px' }}>Giảng viên hướng dẫn (Nếu có)</label>
                <input type="text" placeholder="VD: TS. Nguyễn Văn A" value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd6fe', fontSize: '12.5px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#5b21b6', marginBottom: '4px' }}>Điểm số / Đánh giá hội đồng</label>
                <input type="text" placeholder="VD: 9.5 / 10 hoặc A+" value={formData.score} onChange={e => setFormData({...formData, score: e.target.value})} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd6fe', fontSize: '12.5px', boxSizing: 'border-box' }} />
              </div>
            </div>
          )}

          {/* 4. Khối Case Study Tư Duy Kỹ Thuật (STAR Framework) */}
          <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#2563eb" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                  Cấu Trúc Case Study & Tư Duy Giải Quyết Bài Toán (STAR Model)
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setDescribeMode('star')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: describeMode === 'star' ? '1px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: describeMode === 'star' ? '#eff6ff' : '#ffffff',
                    color: describeMode === 'star' ? '#1d4ed8' : '#64748b',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Chuẩn STAR (Khuyên dùng)
                </button>
                <button
                  type="button"
                  onClick={() => setDescribeMode('freeform')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: describeMode === 'freeform' ? '1px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: describeMode === 'freeform' ? '#eff6ff' : '#ffffff',
                    color: describeMode === 'freeform' ? '#1d4ed8' : '#64748b',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Viết tự do
                </button>
              </div>
            </div>

            {describeMode === 'star' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 1. Bài toán */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#b45309', marginBottom: '4px' }}>
                    <Target size={14} color="#d97706" /> 1. Bài toán & Thách thức kỹ thuật (The Challenge / Problem) *
                  </label>
                  <textarea 
                    rows={2} 
                    required={describeMode === 'star'}
                    placeholder="VD: Hệ thống cũ gặp tình trạng nghẽn cổ chai khi lưu lượng đạt 5.000 đơn/phút, thời gian phản hồi tăng lên 2.5s và tỷ lệ timeout 6%..." 
                    value={formData.challenge} 
                    onChange={e => setFormData({...formData, challenge: e.target.value})} 
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box', lineHeight: '1.5' }} 
                  />
                </div>

                {/* 2. Giải pháp & Kiến trúc */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
                    <Layers size={14} color="#2563eb" /> 2. Giải pháp kỹ thuật & Kiến trúc thiết kế (Solution & Architecture) *
                  </label>
                  <textarea 
                    rows={2} 
                    required={describeMode === 'star'}
                    placeholder="VD: Tái thiết kế sang kiến trúc Event-driven dùng Kafka, áp dụng Redis distributed cache và worker chạy Go để xử lý bất đồng bộ, tối ưu chỉ mục Postgres..." 
                    value={formData.architecture} 
                    onChange={e => setFormData({...formData, architecture: e.target.value})} 
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box', lineHeight: '1.5' }} 
                  />
                </div>

                {/* 3. Tác động & Chỉ số */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#047857', marginBottom: '4px' }}>
                    <TrendingUp size={14} color="#059669" /> 3. Tác động kinh doanh & Chỉ số đo lường (Business Impact & Metrics)
                  </label>
                  <textarea 
                    rows={2} 
                    placeholder="VD: Giảm p95 latency từ 2.5s xuống 180ms; hệ thống chịu tải ổn định 20.000 TPS; tỷ lệ lỗi thanh toán giảm về 0.02%, tiết kiệm 30% chi phí hạ tầng AWS." 
                    value={formData.impact} 
                    onChange={e => setFormData({...formData, impact: e.target.value})} 
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box', lineHeight: '1.5' }} 
                  />
                </div>
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Mô tả chi tiết dự án *</label>
                <textarea 
                  rows={4} 
                  required={describeMode === 'freeform'}
                  placeholder="Mô tả bối cảnh, chức năng chính, công nghệ và thành quả đạt được..." 
                  value={formData.freeform_desc} 
                  onChange={e => setFormData({...formData, freeform_desc: e.target.value})} 
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box', lineHeight: '1.5' }} 
                />
              </div>
            )}
          </div>

          {/* 5. Upload Sơ đồ kiến trúc / Tài liệu kỹ thuật */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Minh chứng Sơ đồ kiến trúc (System Diagram) hoặc Báo cáo kỹ thuật (.PNG, .JPG, .PDF)
            </label>
            <div 
              onDragEnter={handleDrag} 
              onDragLeave={handleDrag} 
              onDragOver={handleDrag} 
              onDrop={handleDrop} 
              onClick={() => inputRef.current?.click()} 
              style={{ 
                border: dragActive ? '2px dashed #2563eb' : '2px dashed #cbd5e1', 
                backgroundColor: dragActive ? '#eff6ff' : '#f8fafc', 
                borderRadius: '8px', 
                padding: '16px', 
                textAlign: 'center', 
                cursor: 'pointer', 
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px'
              }}
            >
              <input ref={inputRef} type="file" accept="image/*,.pdf,.html" style={{ display: 'none' }} onChange={handleChange} />
              
              {filePreviewUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={filePreviewUrl} alt="Architecture Preview" style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#059669' }}>
                      {selectedFile ? `Đã chọn: ${selectedFile.name}` : 'Đã có hình ảnh sơ đồ kiến trúc'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Bấm vào để chọn lại ảnh hoặc tài liệu khác</div>
                  </div>
                </div>
              ) : selectedFile ? (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#059669' }}>📄 Đã đính kèm: {selectedFile.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Upload size={24} color="#64748b" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#0f172a' }}>Kéo thả Sơ đồ kiến trúc (Architecture Diagram) hoặc file PDF vào đây</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Giúp nhà tuyển dụng trực quan hóa năng lực System Design của bạn</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 6. Công nghệ sử dụng (Tech stack tags) */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
              Công nghệ & Nền tảng sử dụng (Cách nhau bởi dấu phẩy) *
            </label>
            <input 
              type="text" 
              required
              placeholder="VD: Golang, Kafka, Redis, PostgreSQL, Kubernetes, AWS, Docker..." 
              value={formData.tags} 
              onChange={e => setFormData({...formData, tags: e.target.value})} 
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' }} 
            />
          </div>

          {/* 7. Bộ Links Sản phẩm & Báo cáo kỹ thuật (Tất cả đều tùy chọn, ghi chú NDA rõ ràng) */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px 16px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e3a8a', textTransform: 'uppercase' }}>
                🔗 Bộ Link Minh Chứng & Sản Phẩm (Tùy chọn)
              </div>
              {isNDAProtected && (
                <span style={{ fontSize: '11px', color: '#b45309', fontWeight: '600' }}>
                  * Dự án bảo mật: Có thể bỏ trống các trường này
                </span>
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '3px' }}>
                  💻 GitHub / GitLab Repo (Tùy chọn)
                </label>
                <input type="url" placeholder="https://github.com/username/repo" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '3px' }}>
                  🌐 Live Production / Demo URL (Tùy chọn)
                </label>
                <input type="url" placeholder="https://my-system.com" value={formData.demo_url} onChange={e => setFormData({...formData, demo_url: e.target.value})} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '3px' }}>
                  🎨 Figma Design / Sơ đồ luồng UI (Tùy chọn)
                </label>
                <input type="url" placeholder="https://figma.com/file/..." value={formData.figma_url} onChange={e => setFormData({...formData, figma_url: e.target.value})} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '3px' }}>
                  📄 Technical Spec / RFC / Doc URL (Tùy chọn)
                </label>
                <input type="url" placeholder="https://notion.so/... hoặc link Google Docs" value={formData.doc_url} onChange={e => setFormData({...formData, doc_url: e.target.value})} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={onClose} disabled={loading} style={{ padding: '9px 18px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              Hủy
            </button>
            <button type="submit" disabled={loading} style={{ padding: '9px 22px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {loading ? 'Đang xử lý...' : (editData ? 'Lưu cập nhật Case Study' : 'Khởi tạo Case Study')} <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
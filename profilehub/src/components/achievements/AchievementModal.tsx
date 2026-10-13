import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthProvider';
import { Upload, X, Check } from 'lucide-react';

export interface AchievementData {
  id?: string;
  title: string;
  category: string;
  level: string;
  date_awarded: string;
  description: string;
  is_featured: boolean;
  image_url?: string;
  verified?: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: AchievementData | null;
}

export default function AchievementModal({ isOpen, onClose, onSuccess, editData }: Props) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [formData, setFormData] = useState<AchievementData>({
    title: '',
    category: 'Học thuật & NCKH',
    level: 'Cấp Trường',
    date_awarded: '',
    description: '',
    is_featured: false,
    image_url: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        title: '',
        category: 'Học thuật & NCKH',
        level: 'Cấp Trường',
        date_awarded: '',
        description: '',
        is_featured: false,
        image_url: ''
      });
    }
    setFile(null);
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    let finalImageUrl = formData.image_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-achieve-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio_files')
        .upload(`achievements/${fileName}`, file);

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('portfolio_files')
          .getPublicUrl(`achievements/${fileName}`);
        finalImageUrl = publicUrlData.publicUrl;
      }
    }

    const payload = {
      user_id: user.id,
      title: formData.title,
      category: formData.category,
      level: formData.level,
      date_awarded: formData.date_awarded,
      description: formData.description,
      is_featured: formData.is_featured,
      image_url: finalImageUrl
    };

    if (formData.id) {
      await supabase.from('achievements').update(payload).eq('id', formData.id);
    } else {
      await supabase.from('achievements').insert([payload]);
    }

    setSaving(false);
    onSuccess();
  };

  const previewUrl = file ? URL.createObjectURL(file) : formData.image_url;
  const isPdf = file ? file.type === 'application/pdf' : formData.image_url?.toLowerCase().includes('.pdf');

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', gap: '30px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        
        {/* FORM */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>{editData ? 'Chỉnh sửa Thành tích' : 'Thêm Thành tích / Khen thưởng'}</h2>
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
          </div>

          <form id="achieve-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Tên giải thưởng / Thành tích *</label>
              <input required type="text" placeholder="VD: Giải Nhất Nghiên cứu Khoa học Sinh viên" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Danh mục *</label>
                <select value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                  <option>Học thuật & NCKH</option>
                  <option>Cuộc thi & Hackathon</option>
                  <option>Hoạt động ngoại khóa</option>
                  <option>Học bổng & Danh hiệu</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Cấp độ giải thưởng</label>
                <select value={formData.level} onChange={e => setFormData(prev => ({ ...prev, level: e.target.value }))} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                  <option>Cấp Quốc tế</option>
                  <option>Cấp Quốc gia</option>
                  <option>Cấp Thành phố / Tỉnh</option>
                  <option>Cấp Đại học Quốc gia</option>
                  <option>Cấp Trường</option>
                  <option>Cấp Khoa</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Thời gian nhận giải</label>
              <input type="text" placeholder="VD: 10/2025 hoặc Năm 2025" value={formData.date_awarded} onChange={e => setFormData(prev => ({ ...prev, date_awarded: e.target.value }))} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Mô tả chi tiết / Đóng góp nổi bật</label>
              <textarea rows={3} placeholder="Mô tả đề tài, quy mô cuộc thi, thành tích cá nhân hoặc nhóm..." value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
              <input type="checkbox" id="achieve-featured" checked={formData.is_featured} onChange={e => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label htmlFor="achieve-featured" style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: '600', cursor: 'pointer' }}>⭐ Đánh dấu là thành tích nổi bật nhất (Top Award)</label>
            </div>
          </form>
        </div>

        {/* UPLOAD & PREVIEW */}
        <div style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>Minh chứng (Ảnh / Giấy khen)</label>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={e => e.target.files && e.target.files.length > 0 && setFile(e.target.files[0])} 
            accept="image/*,.pdf" 
            style={{ display: 'none' }} 
          />

          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              flex: 1, 
              minHeight: '220px', 
              border: isDragging ? '2px dashed #2563eb' : '2px dashed #cbd5e1', 
              backgroundColor: isDragging ? '#eff6ff' : '#f8fafc',
              borderRadius: '8px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: '20px', 
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {previewUrl ? (
              isPdf ? (
                <iframe src={`${previewUrl}#toolbar=0`} style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }} title="Preview" />
              ) : (
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              )
            ) : (
              <>
                <Upload size={32} color="#94a3b8" style={{ marginBottom: '10px' }} />
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Tải lên giấy khen/chứng nhận</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Kéo thả hoặc bấm để chọn tệp (Ảnh / PDF)</div>
              </>
            )}
          </div>

          {file && (
            <div style={{ fontSize: '12px', color: '#059669', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={14} /> Đã chọn: {file.name}
            </div>
          )}

          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '20px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Hủy</button>
            <button form="achieve-form" type="submit" disabled={saving} style={{ flex: 1, padding: '10px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>{saving ? 'Đang lưu...' : 'Lưu thành tích'}</button>
          </div>
        </div>

      </div>
    </div>
  );
}

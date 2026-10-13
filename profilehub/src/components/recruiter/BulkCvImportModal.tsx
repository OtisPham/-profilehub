import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  Zap, 
  CheckCircle2, 
  X, 
  Search, 
  ShieldCheck, 
  Brain, 
  Trash2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { 
  generate100SampleCandidates, 
  exportSampleXlsx, 
  parseXlsxFile, 
  saveImportedCandidates, 
  getStoredImportedCandidates, 
  clearImportedCandidates,
  type ImportedCandidateCv 
} from '../../services/bulkCvImportService';

interface BulkCvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (candidates: ImportedCandidateCv[]) => void;
  onSelectCandidate?: (candidate: ImportedCandidateCv) => void;
  onBatchPushAll?: (candidates: ImportedCandidateCv[]) => void;
  title?: string;
  subtitle?: string;
}

export default function BulkCvImportModal({
  isOpen,
  onClose,
  onImportSuccess,
  onSelectCandidate,
  onBatchPushAll,
  title,
  subtitle
}: BulkCvImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<ImportedCandidateCv[]>(() => getStoredImportedCandidates());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  if (!isOpen) return null;

  const handleBatchPush = () => {
    if (candidates.length === 0) {
      setErrorMsg('Chưa có CV nào để đẩy vào Quản Lý. Hãy nhấn nút nạp 100 CV mẫu hoặc tải file Excel trước.');
      return;
    }
    if (onBatchPushAll) {
      onBatchPushAll(candidates);
    }
    setSuccessMsg(`🚀 Đã đẩy thành công ${candidates.length} CV vào hệ thống Quản Lý CV!`);
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const parsed = await parseXlsxFile(file);
      setCandidates(parsed);
      saveImportedCandidates(parsed);
      setSuccessMsg(`🎉 Đã nhập thành công ${parsed.length} CV từ file "${file.name}"!`);
      if (onImportSuccess) onImportSuccess(parsed);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi đọc file Excel.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Instant 100 Sample Seed
  const handleSeed100 = () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const samples = generate100SampleCandidates();
      setCandidates(samples);
      saveImportedCandidates(samples);
      setSuccessMsg(`🚀 Đã nạp thành công bộ 100 CV mẫu chuẩn hóa đa ngành nghề!`);
      if (onImportSuccess) onImportSuccess(samples);
    } catch (err: any) {
      setErrorMsg('Lỗi khi nạp dữ liệu mẫu.');
    } finally {
      setLoading(false);
    }
  };

  // Clear data
  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách CV đã nạp?')) {
      clearImportedCandidates();
      setCandidates([]);
      setSuccessMsg('Đã làm trống danh sách CV.');
      if (onImportSuccess) onImportSuccess([]);
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter(c => {
    const matchSearch = searchTerm === '' || 
      c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.target_role.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchRole = true;
    if (filterRole === 'ALL') {
      matchRole = true;
    } else if (filterRole === 'GROUP_MEDICAL') {
      matchRole = /nurse|điều dưỡng|y tế|y tá|dược|bệnh viện|y khoa|lâm sàng|hồi sức/i.test(c.target_role);
    } else if (filterRole === 'GROUP_BUSINESS') {
      matchRole = /marketing|nhân sự|hr|kế toán|tài chính|kinh doanh|sales|quản trị|truyền thông/i.test(c.target_role);
    } else if (filterRole === 'GROUP_DESIGN') {
      matchRole = /design|thiết kế|ui\/ux|đồ họa|graphic|mỹ thuật/i.test(c.target_role);
    } else if (filterRole === 'GROUP_TECH') {
      matchRole = /developer|engineer|frontend|backend|fullstack|lập trình|kỹ sư|ai|data|mobile|qa|cloud|devops/i.test(c.target_role);
    } else {
      matchRole = c.target_role.toLowerCase().includes(filterRole.toLowerCase());
    }

    return matchSearch && matchRole;
  });

  const verifiedCount = candidates.filter(c => c.verified_projects_count > 0).length;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        maxWidth: '1050px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '22px 28px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#10b981', color: 'white', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {title || 'Nhập Hàng Loạt CV Bằng File Excel (.xlsx) / Nạp 100 CV Mẫu'}
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                {subtitle || 'Hỗ trợ tải lên file Excel dữ liệu ứng viên hoặc nạp ngay 100 CV chuẩn hóa để test matching AI & MBTI.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Action Top Grid: 3 Methods */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            
            {/* Action 1: 1-Click Seed 100 CVs */}
            <div style={{ backgroundColor: '#f5f3ff', border: '1.5px dashed #c084fc', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Zap size={18} color="#7c3aed" />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#581c87' }}>Nạp Nhanh 100 CV Mẫu (1-Click)</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b21a8', lineHeight: '1.5' }}>
                  Tạo tức thì 100 hồ sơ đầy đủ kỹ năng (Frontend, Backend, AI, Mobile, UI/UX...), đồ án Verified và MBTI.
                </p>
              </div>
              <button
                onClick={handleSeed100}
                disabled={loading}
                style={{ marginTop: '14px', padding: '9px 14px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12.5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Zap size={14} /> ⚡ Nạp Ngay 100 CV Mẫu Test
              </button>
            </div>

            {/* Action 2: Upload custom XLSX */}
            <div style={{ backgroundColor: '#eff6ff', border: '1.5px dashed #93c5fd', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <UploadCloud size={18} color="#2563eb" />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e3a8a' }}>Tải Lên File Excel (.xlsx / .csv)</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#1d4ed8', lineHeight: '1.5' }}>
                  Chọn file Excel chứa danh sách ứng viên từ máy tính của bạn để phân tích và lưu trữ.
                </p>
              </div>
              <label style={{ marginTop: '14px', padding: '9px 14px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', fontSize: '12.5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textAlign: 'center' }}>
                <UploadCloud size={14} /> Chọn File Excel Tải Lên
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Action 3: Download XLSX Template */}
            <div style={{ backgroundColor: '#ecfdf5', border: '1.5px dashed #6ee7b7', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Download size={18} color="#059669" />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#065f46' }}>Tải File Mẫu 100 CV (.xlsx)</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#047857', lineHeight: '1.5' }}>
                  Xuất file Excel mẫu chuẩn hóa 100 ứng viên về máy tính để chỉnh sửa dữ liệu nếu cần.
                </p>
              </div>
              <button
                onClick={() => exportSampleXlsx(candidates.length > 0 ? candidates : undefined)}
                style={{ marginTop: '14px', padding: '9px 14px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12.5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Download size={14} /> Tải File Excel Mẫu (.xlsx)
              </button>
            </div>

          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ padding: '12px 16px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#047857', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          {/* Batch Push Callout Banner */}
          {candidates.length > 0 && onBatchPushAll && (
            <div style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
              color: 'white',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 10px 20px -5px rgba(30, 58, 138, 0.35)'
            }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} color="#fbbf24" />
                  <span>ĐẨY HÀNG LOẠT VÀO MỤC QUẢN LÝ CV</span>
                  <span style={{ backgroundColor: '#3b82f6', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                    {candidates.length} CV SẴN SÀNG
                  </span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#bfdbfe' }}>
                  Tự động chuyển toàn bộ {candidates.length} hồ sơ ứng viên thành các bản CV độc lập trong mục Quản Lý CV chỉ bằng 1 cú bấm!
                </p>
              </div>

              <button
                onClick={handleBatchPush}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Zap size={16} /> ĐẨY {candidates.length} CV VÀO QUẢN LÝ NGAY
              </button>
            </div>
          )}

          {/* Candidates Summary & Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>
                📋 Danh sách {candidates.length} CV hiện có
              </span>
              <span style={{ fontSize: '12px', backgroundColor: '#ecfdf5', color: '#059669', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold', border: '1px solid #a7f3d0' }}>
                🛡️ {verifiedCount} có đồ án Verified
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Search input */}
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Tìm theo tên, kỹ năng..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px 7px 32px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Role filter */}
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', backgroundColor: 'white' }}
              >
                <option value="ALL">🌐 Tất cả ngành nghề ({candidates.length})</option>
                <optgroup label="── NHÓM LĨNH VỰC ──">
                  <option value="GROUP_MEDICAL">🏥 Y Tế & Điều Dưỡng (Nurse / Health)</option>
                  <option value="GROUP_BUSINESS">💼 Kinh Doanh, Marketing & HR</option>
                  <option value="GROUP_DESIGN">🎨 Thiết Kế & Sáng Tạo (UI/UX)</option>
                  <option value="GROUP_TECH">💻 CNTT & Phần Mềm</option>
                </optgroup>
                <optgroup label="── VỊ TRÍ CHI TIẾT ──">
                  <option value="Điều Dưỡng">Điều Dưỡng Viên Đa Khoa</option>
                  <option value="ICU Nurse">Điều Dưỡng Cấp Cứu ICU</option>
                  <option value="Dược">Dược Sĩ Lâm Sàng</option>
                  <option value="Marketing">Marketing & Digital Media</option>
                  <option value="Nhân Sự">Nhân Sự & Tuyển Dụng</option>
                  <option value="Kế Toán">Kế Toán & Tài Chính</option>
                  <option value="Bán Hàng">Tư Vấn Bán Hàng (Sales)</option>
                  <option value="Design">UI/UX Designer</option>
                  <option value="Frontend">Frontend ReactJS</option>
                  <option value="Backend">Backend Node.js / Go</option>
                  <option value="AI">AI & Data Scientist</option>
                  <option value="Nông Nghiệp">Nông Nghiệp Công Nghệ Cao</option>
                </optgroup>
              </select>

              {candidates.length > 0 && (
                <button
                  onClick={handleClearAll}
                  style={{ padding: '7px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={13} /> Xóa hết
                </button>
              )}
            </div>
          </div>

          {/* Candidates Table Preview */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', maxHeight: '350px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead style={{ backgroundColor: '#f1f5f9', position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 'bold' }}>STT</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 'bold' }}>Ứng viên</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 'bold' }}>Trường & GPA</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 'bold' }}>Vị trí & MBTI</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 'bold' }}>Kỹ năng</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 'bold' }}>Đồ án</th>
                  {onSelectCandidate && (
                    <th style={{ padding: '10px 14px', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 'bold', textAlign: 'center' }}>Hành Động</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={onSelectCandidate ? 7 : 6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                      {candidates.length === 0 ? 'Chưa có CV nào. Hãy nhấn "Nạp Ngay 100 CV Mẫu" hoặc tải file Excel lên!' : 'Không tìm thấy ứng viên phù hợp với từ khóa.'}
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((c, idx) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '10px 14px', color: '#64748b', fontWeight: 'bold', width: '40px' }}>{idx + 1}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{c.full_name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{c.email}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ color: '#334155' }}>{c.university}</div>
                        <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>GPA: {c.gpa}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: '600', color: '#1e3a8a' }}>{c.target_role}</div>
                        <span style={{ fontSize: '10.5px', backgroundColor: '#f5f3ff', color: '#7c3aed', padding: '1px 6px', borderRadius: '6px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                          <Brain size={11} /> {c.mbti_type}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', maxWidth: '220px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {c.skills.slice(0, 4).map((sk, sIdx) => (
                            <span key={sIdx} style={{ fontSize: '10.5px', backgroundColor: '#f1f5f9', color: '#334155', padding: '1px 6px', borderRadius: '4px' }}>
                              {sk}
                            </span>
                          ))}
                          {c.skills.length > 4 && (
                            <span style={{ fontSize: '10px', color: '#64748b' }}>+{c.skills.length - 4}</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11.5px', fontWeight: 'bold', color: c.verified_projects_count > 0 ? '#047857' : '#475569' }}>
                            {c.projects.length} đồ án
                          </span>
                          {c.verified_projects_count > 0 && (
                            <span style={{ fontSize: '10px', backgroundColor: '#ecfdf5', color: '#047857', padding: '1px 6px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <ShieldCheck size={11} /> {c.verified_projects_count} Verified
                            </span>
                          )}
                        </div>
                      </td>
                      {onSelectCandidate && (
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => {
                              onSelectCandidate(c);
                              onClose();
                            }}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#2563eb',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
                            }}
                          >
                            <Zap size={12} /> Nạp Vào CV
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
        }}>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            Tổng số: <strong style={{ color: '#0f172a' }}>{candidates.length}</strong> CV sẵn sàng cho AI Matching & Lọc tự động.
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onClose}
              style={{ padding: '10px 18px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', color: '#334155' }}
            >
              Đóng
            </button>

            {onBatchPushAll && candidates.length > 0 && (
              <button
                onClick={handleBatchPush}
                style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(16,185,129,0.3)' }}
              >
                <Zap size={15} /> Đẩy Toàn Bộ {candidates.length} CV Vào Quản Lý
              </button>
            )}

            <button
              onClick={() => {
                if (onImportSuccess) onImportSuccess(candidates);
                if (onSelectCandidate && candidates.length > 0) {
                  onSelectCandidate(candidates[0]);
                }
                onClose();
              }}
              style={{ padding: '10px 22px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CheckCircle2 size={16} /> Áp Dụng & Sử Dụng Ngay ({candidates.length} CV)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

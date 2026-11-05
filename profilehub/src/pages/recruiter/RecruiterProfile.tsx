import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  KeyRound, 
  X, 
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { 
  taxVerificationService, 
  SANDBOX_TAX_REGISTRY 
} from '../../services/taxVerificationService';
import type { TaxVerificationTier, TaxVerificationStatus } from '../../types/taxVerification.types';

export default function RecruiterProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [taxError, setTaxError] = useState<string | null>(null);
  const [isVerifyingTax, setIsVerifyingTax] = useState(false);

  // Form State
  const [recruiterName, setRecruiterName] = useState('');
  const [companyName, setCompanyName] = useState('TechCorp Solutions Vietnam');
  const [industry, setIndustry] = useState('Công Nghệ Thông Tin & Phần Mềm');
  const [companySize, setCompanySize] = useState('100 - 500 nhân viên');
  const [companyAddress, setCompanyAddress] = useState('Tòa nhà Innovation, Quận 1, TP. Hồ Chí Minh');
  const [website, setWebsite] = useState('https://techcorp.example.com');
  const [phone, setPhone] = useState('028 3822 9999');
  const [companyBio, setCompanyBio] = useState('TechCorp là tập đoàn công nghệ tiên phong cung cấp giải pháp phần mềm doanh nghiệp, điện toán đám mây và trí tuệ nhân tạo (AI). Chúng tôi tìm kiếm các tài năng trẻ thực hành đồ án thực tế.');

  // Enterprise Tax Verification State
  const [taxCode, setTaxCode] = useState('0316892345');
  const [isTaxVerified, setIsTaxVerified] = useState(true);
  const [taxLegalName, setTaxLegalName] = useState('CÔNG TY CỔ PHẦN TECHCORP SOLUTIONS VIỆT NAM');
  const [taxRegisteredAddress, setTaxRegisteredAddress] = useState('Tòa nhà Innovation, Tầng 12, Quận 1, TP. Hồ Chí Minh');
  const [taxVerificationStatus, setTaxVerificationStatus] = useState<TaxVerificationStatus>('verified');
  const [taxVerificationTier, setTaxVerificationTier] = useState<TaxVerificationTier>('full');
  const [taxVerifiedAt, setTaxVerifiedAt] = useState<string | undefined>(undefined);
  const [workEmail, setWorkEmail] = useState('hr@techcorp.example.com');
  const [isWorkEmailVerified, setIsWorkEmailVerified] = useState(true);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpHint, setOtpHint] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecruiterProfile = async () => {
      if (!user) return;
      try {
        const { data } = await supabase.from('recruiter_profiles').select('*').eq('id', user.id).single();
        if (data) {
          setRecruiterName(data.recruiter_name || '');
          setCompanyName(data.company_name || 'TechCorp Solutions Vietnam');
          setIndustry(data.industry || 'Công Nghệ Thông Tin & Phần Mềm');
          setCompanySize(data.company_size || '100 - 500 nhân viên');
          setCompanyAddress(data.company_address || '');
          setWebsite(data.website || '');
          setPhone(data.phone || '');
          setCompanyBio(data.company_bio || '');
          setTaxCode(data.tax_code || '0316892345');
          setIsTaxVerified(Boolean(data.is_tax_verified));
          setTaxLegalName(data.tax_legal_name || '');
          setTaxRegisteredAddress(data.tax_registered_address || '');
          setTaxVerificationStatus(data.tax_verification_status || 'unverified');
          setTaxVerificationTier(data.tax_verification_tier || 'unverified');
          setTaxVerifiedAt(data.tax_verified_at || undefined);
          setWorkEmail(data.work_email || '');
          setIsWorkEmailVerified(Boolean(data.is_work_email_verified));
        } else {
          // Local storage fallback
          const localData = localStorage.getItem(`recruiter_profile_${user.id}`);
          if (localData) {
            const parsed = JSON.parse(localData);
            setRecruiterName(parsed.recruiterName || '');
            setCompanyName(parsed.companyName || 'TechCorp Solutions Vietnam');
            setIndustry(parsed.industry || 'Công Nghệ Thông Tin & Phần Mềm');
            setCompanySize(parsed.companySize || '100 - 500 nhân viên');
            setCompanyAddress(parsed.companyAddress || '');
            setWebsite(parsed.website || '');
            setPhone(parsed.phone || '');
            setCompanyBio(parsed.companyBio || '');
            setTaxCode(parsed.taxCode || '0316892345');
            setIsTaxVerified(parsed.isTaxVerified !== undefined ? parsed.isTaxVerified : true);
            setTaxLegalName(parsed.taxLegalName || 'CÔNG TY CỔ PHẦN TECHCORP SOLUTIONS VIỆT NAM');
            setTaxRegisteredAddress(parsed.taxRegisteredAddress || 'Tòa nhà Innovation, Tầng 12, Quận 1, TP. Hồ Chí Minh');
            setTaxVerificationStatus(parsed.taxVerificationStatus || 'verified');
            setTaxVerificationTier(parsed.taxVerificationTier || 'full');
            setTaxVerifiedAt(parsed.taxVerifiedAt);
            setWorkEmail(parsed.workEmail || 'hr@techcorp.example.com');
            setIsWorkEmailVerified(parsed.isWorkEmailVerified !== undefined ? parsed.isWorkEmailVerified : true);
          } else {
            setRecruiterName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Nhà Tuyển Dụng');
          }
        }
      } catch (err) {
        console.warn("Load recruiter profile fallback:", err);
      }
    };

    loadRecruiterProfile();
  }, [user]);

  // Xử lý gửi yêu cầu xác thực MST
  const handleVerifyTax = async () => {
    setIsVerifyingTax(true);
    setTaxError(null);

    const recruiterId = user?.id || 'rec1';
    const result = await taxVerificationService.verifyAndSaveRecruiterTax(
      recruiterId,
      taxCode,
      companyName,
      workEmail
    );

    setIsVerifyingTax(false);

    if (result.success && result.profile) {
      setIsTaxVerified(true);
      setTaxLegalName(result.profile.taxLegalName || '');
      setTaxRegisteredAddress(result.profile.taxRegisteredAddress || '');
      setTaxVerificationStatus('verified');
      setTaxVerificationTier(result.tier);
      setTaxVerifiedAt(result.profile.taxVerifiedAt);
      setSuccessMsg(`Xác thực thành công! Đã cấp ${result.tier === 'full' ? 'Tích Xanh Toàn Phần 🛡️' : 'Tích Bạc Tự Khai 🏷️'}`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setTaxError(result.error || 'Xác thực mã số thuế thất bại. Vui lòng kiểm tra lại.');
    }
  };

  // Mở modal gửi OTP xác minh Work Email
  const handleOpenOtpModal = () => {
    if (!workEmail || !workEmail.includes('@')) {
      setTaxError('Vui lòng nhập địa chỉ Work Email hợp lệ trước khi gửi mã xác thực.');
      return;
    }

    const recruiterId = user?.id || 'rec1';
    const otp = taxVerificationService.generateWorkEmailOtp(recruiterId, workEmail);
    setOtpHint(`Mã OTP mô phỏng gửi tới ${workEmail}: ${otp}`);
    setOtpInput('');
    setOtpError(null);
    setShowOtpModal(true);
  };

  // Xác nhận OTP Work Email
  const handleConfirmOtp = async () => {
    const recruiterId = user?.id || 'rec1';
    const isOk = taxVerificationService.verifyWorkEmailOtp(recruiterId, otpInput);

    if (isOk) {
      setIsWorkEmailVerified(true);
      setShowOtpModal(false);
      // Nâng cấp lên Tích Xanh Toàn Phần
      if (isTaxVerified) {
        await taxVerificationService.verifyAndSaveRecruiterTax(
          recruiterId,
          taxCode,
          companyName,
          workEmail,
          otpInput
        );
        setTaxVerificationTier('full');
      }
      setSuccessMsg('Đã xác minh Email Tên Miền Doanh Nghiệp thành công! Đã nâng cấp lên Tích Xanh Toàn Phần 🛡️');
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setOtpError('Mã OTP không chính xác hoặc đã hết hạn.');
    }
  };

  // Lưu thông tin hồ sơ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);

    const recruiterId = user?.id || 'default';
    const localKey = `recruiter_profile_${recruiterId}`;
    const rawLocal = localStorage.getItem(localKey);
    const existing = rawLocal ? JSON.parse(rawLocal) : {};

    // Kiểm tra xem tên công ty hoặc MST có bị sửa đổi so với trạng thái đã verify không
    const updated = taxVerificationService.handleCompanyInfoMutation(
      recruiterId,
      {
        ...existing,
        recruiterName,
        companyName: existing.companyName || companyName,
        industry,
        companySize,
        companyAddress,
        website,
        phone,
        companyBio,
        taxCode: existing.taxCode || taxCode,
        isTaxVerified
      },
      companyName,
      taxCode
    );

    if (!updated.isTaxVerified && isTaxVerified) {
      setIsTaxVerified(false);
      setTaxVerificationStatus('reverification_required');
      setTaxVerificationTier('unverified');
    }

    const payload = {
      id: user?.id,
      recruiter_name: recruiterName,
      company_name: companyName,
      industry,
      company_size: companySize,
      company_address: companyAddress,
      website,
      phone,
      company_bio: companyBio,
      tax_code: taxCode,
      is_tax_verified: updated.isTaxVerified,
      tax_legal_name: taxLegalName,
      tax_registered_address: taxRegisteredAddress,
      tax_verification_status: updated.taxVerificationStatus,
      tax_verification_tier: updated.taxVerificationTier,
      tax_verified_at: taxVerifiedAt,
      work_email: workEmail,
      is_work_email_verified: isWorkEmailVerified,
      updated_at: new Date().toISOString()
    };

    localStorage.setItem(localKey, JSON.stringify({
      recruiterName,
      companyName,
      industry,
      companySize,
      companyAddress,
      website,
      phone,
      companyBio,
      taxCode,
      isTaxVerified: updated.isTaxVerified,
      taxLegalName,
      taxRegisteredAddress,
      taxVerificationStatus: updated.taxVerificationStatus,
      taxVerificationTier: updated.taxVerificationTier,
      taxVerifiedAt,
      workEmail,
      isWorkEmailVerified
    }));
    window.dispatchEvent(new Event('storage'));

    try {
      if (user?.id) {
        await supabase.from('recruiter_profiles').upsert([payload]);
      }
    } catch (err) {
      console.warn("DB Upsert error fallback to local:", err);
    }

    setLoading(false);
    setSuccessMsg('Đã lưu thông tin Doanh Nghiệp thành công!');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header Banner */}
      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#8b5cf6', letterSpacing: '1px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={16} /> RECRUITER COMPANY PROFILE & TRUST CENTER
          </div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '26px', color: '#0f172a' }}>
            Hồ Sơ Doanh Nghiệp & Xác Thực Pháp Lý
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Xác thực Mã Số Thuế và Email Doanh Nghiệp để nhận Tích Xanh Uy Tín, xây dựng niềm tin với ứng viên sinh viên.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isTaxVerified ? (
            taxVerificationTier === 'full' ? (
              <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#15803d', backgroundColor: '#dcfce7', padding: '6px 14px', borderRadius: '20px', border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} /> Verified Enterprise (Tích Xanh)
              </span>
            ) : (
              <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#b45309', backgroundColor: '#fef3c7', padding: '6px 14px', borderRadius: '20px', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} /> Tích Bạc (Chờ Xác Minh Email)
              </span>
            )
          ) : (
            <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#64748b', backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '20px', border: '1px solid #cbd5e1' }}>
              Chưa Xác Thực MST
            </span>
          )}
        </div>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', color: '#6d28d9', padding: '14px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 'bold' }}>
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {taxError && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '14px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
          <AlertTriangle size={18} /> {taxError}
        </div>
      )}

      {/* Profile Form Card */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        
        {/* Section 1: Thông tin Doanh Nghiệp */}
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#6d28d9', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <Building2 size={18} /> 1. Thông Tin Thương Hiệu Doanh Nghiệp
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>Tên Thương Hiệu Công Ty *</label>
            <input
              type="text"
              required
              placeholder="VD: Tập đoàn Công nghệ FPT / VNG Corporation"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>Đại Diện Tuyển Dụng / Nhân Sự *</label>
            <input
              type="text"
              required
              placeholder="VD: Tran Van B - Talent Acquisition Manager"
              value={recruiterName}
              onChange={e => setRecruiterName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Section 2: Xác Thực Pháp Lý Doanh Nghiệp & Tích Xanh */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#7c3aed" /> 2. Xác Thực Pháp Lý MST & Tích Xanh Doanh Nghiệp
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Quy chuẩn Thông tư 105/2020/TT-BTC
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr auto', gap: '15px', alignItems: 'flex-end', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                Mã Số Thuế (MST) Doanh Nghiệp *
              </label>
              <input
                type="text"
                placeholder="Nhập 10 hoặc 13 số (VD: 0305011749)"
                value={taxCode}
                onChange={e => setTaxCode(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                Email Công Vụ (Work Email - Tên miền riêng)
              </label>
              <input
                type="email"
                placeholder="VD: hr@fpt.com / tuyendung@vng.com.vn"
                value={workEmail}
                onChange={e => setWorkEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="button"
              onClick={handleVerifyTax}
              disabled={isVerifyingTax}
              style={{ padding: '10px 18px', backgroundColor: '#6d28d9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', height: '40px' }}
            >
              <RefreshCw size={15} className={isVerifyingTax ? 'animate-spin' : ''} />
              {isVerifyingTax ? 'Đang Tra Cứu...' : 'Xác Thực MST'}
            </button>
          </div>

          {/* Hộp hiển thị kết quả thẩm định */}
          {isTaxVerified && (
            <div style={{ backgroundColor: taxVerificationTier === 'full' ? '#f0fdf4' : '#fffbeb', border: `1px solid ${taxVerificationTier === 'full' ? '#bbf7d0' : '#fef08a'}`, borderRadius: '8px', padding: '14px 16px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 'bold', color: taxVerificationTier === 'full' ? '#166534' : '#854d0e', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <ShieldCheck size={18} /> 
                    {taxVerificationTier === 'full' ? 'Đã Xác Thực Pháp Nhân Toàn Phần (Tích Xanh)' : 'Đã Xác Thực Pháp Nhân MST (Tích Bạc)'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
                    <div><strong>Tên Pháp Nhân ĐKKD:</strong> {taxLegalName || companyName}</div>
                    <div><strong>Địa Chỉ Trụ Sở Đăng Ký:</strong> {taxRegisteredAddress || companyAddress}</div>
                  </div>
                </div>

                {taxVerificationTier === 'silver' && (
                  <button
                    type="button"
                    onClick={handleOpenOtpModal}
                    style={{ padding: '6px 12px', backgroundColor: '#d97706', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <KeyRound size={14} /> Xác Minh OTP Work Email
                  </button>
                )}
              </div>
            </div>
          )}

          {taxVerificationStatus === 'reverification_required' && (
            <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} /> Tên công ty hoặc MST đã được chỉnh sửa. Vui lòng bấm [Xác Thực MST] lại để kích hoạt lại Tích Xanh.
            </div>
          )}
        </div>

        {/* Section 3: Quy mô & Lĩnh vực */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>Lĩnh vực hoạt động</label>
            <input
              type="text"
              placeholder="VD: Công Nghệ Thông Tin, FinTech, E-commerce"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>Quy mô Công ty</label>
            <select
              value={companySize}
              onChange={e => setCompanySize(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: 'white' }}
            >
              <option>10 - 50 nhân viên</option>
              <option>50 - 100 nhân viên</option>
              <option>100 - 500 nhân viên</option>
              <option>500 - 1000 nhân viên</option>
              <option>1000+ nhân viên (Tập đoàn Enterprise)</option>
            </select>
          </div>
        </div>

        {/* Section 4: Trụ sở & Kênh liên hệ */}
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#6d28d9', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginTop: '10px' }}>
          <MapPin size={18} /> 3. Trụ Sở & Kênh Truyền Thông
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>Địa chỉ Trụ sở chính *</label>
          <input
            type="text"
            required
            placeholder="VD: Tòa nhà Innovation Center, Công viên Phần mềm Quang Trung, Q.12, TP.HCM"
            value={companyAddress}
            onChange={e => setCompanyAddress(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>Website Công ty</label>
            <input
              type="text"
              placeholder="VD: https://company.com"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>Số điện thoại liên hệ</label>
            <input
              type="text"
              placeholder="VD: 028 3822 9999"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Section 5: Giới thiệu công ty & Văn hóa */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>Giới thiệu về Công ty & Văn hóa tuyển dụng</label>
          <textarea
            rows={4}
            placeholder="Nhập tầm nhìn, cơ hội phát triển cho thực tập sinh/junior và chế độ đãi ngộ..."
            value={companyBio}
            onChange={e => setCompanyBio(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '12px 24px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={18} /> {loading ? 'Đang lưu...' : 'Lưu Thông Tin Doanh Nghiệp'}
          </button>
        </div>

      </form>

      {/* Modal Xác Thực OTP Work Email */}
      {showOtpModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', maxWidth: '440px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={20} color="#7c3aed" /> Xác Minh Email Tên Miền Công Ty
              </div>
              <button type="button" onClick={() => setShowOtpModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '14px', lineHeight: '1.5' }}>
              Để nâng cấp lên <strong>Tích Xanh Toàn Phần 🛡️</strong> và khẳng định tư cách nhân sự trực thuộc, vui lòng nhập mã xác thực 6 chữ số:
            </p>

            {otpHint && (
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '14px', fontWeight: 'bold' }}>
                💡 {otpHint}
              </div>
            )}

            {otpError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '14px' }}>
                ⚠️ {otpError}
              </div>
            )}

            <div style={{ marginBottom: '18px' }}>
              <input
                type="text"
                maxLength={6}
                placeholder="Nhập 6 số OTP (VD: 123456)"
                value={otpInput}
                onChange={e => setOtpInput(e.target.value)}
                style={{ width: '100%', padding: '12px', textAlign: 'center', fontSize: '20px', letterSpacing: '4px', fontWeight: 'bold', borderRadius: '8px', border: '2px solid #7c3aed', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmOtp}
                style={{ padding: '8px 18px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Xác Nhận OTP
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

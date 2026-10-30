export type CVTemplateType = 'classic' | 'minimal' | 'tech' | 'executive' | 'pro_split' | 'compact_ats';

export interface CVDataProps {
  profile: {
    full_name?: string;
    major?: string;
    university?: string;
    gpa?: string;
    skills?: string[];
    bio?: string;
  } | null;
  userEmail: string;
  summary: string;
  primaryColor: string;
  selectedProjects: Array<{
    id: string;
    title: string;
    role?: string;
    project_type?: string;
    description?: string;
    is_verified?: boolean;
    instructor?: string;
    tags?: string[];
  }>;
  certificates: Array<{
    id: string;
    title: string;
    issuer: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    category?: string;
  }>;
}

export function RenderCVTemplate({ template, data }: { template: CVTemplateType; data: CVDataProps }) {
  const { profile, userEmail, summary, primaryColor, selectedProjects, certificates, achievements } = data;

  // =========================================================================
  // TEMPLATE 1: MODERN TOP-BANNER (Phong cách TopCV Pro)
  // Khối Header màu đậm trải ngang, Avatar bo tròn, thân chia 2 cột bất đối xứng (35% - 65%)
  // =========================================================================
  if (template === 'classic') {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Khối Top Banner đậm màu trải ngang */}
        <div style={{ backgroundColor: primaryColor, color: 'white', padding: '18px 22px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '800', flexShrink: 0 }}>
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '22px', color: 'white', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {profile?.full_name || 'HỌ VÀ TÊN SINH VIÊN'}
            </h1>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.92)', marginTop: '2px', fontWeight: '600' }}>
              {profile?.major || 'Chuyên ngành Công nghệ thông tin'}
            </div>
            <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.85)', marginTop: '4px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>📧 {userEmail}</span>
              <span>📍 {profile?.university || 'Trường Đại Học'}</span>
              {profile?.gpa && <span>🎯 GPA: {profile.gpa}</span>}
            </div>
          </div>
        </div>

        {/* Tóm tắt bản thân AI */}
        {summary && (
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '12px', color: primaryColor, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', fontWeight: 'bold' }}>
              Mục Tiêu & Tóm Tắt Chuyên Môn
            </h3>
            <p style={{ margin: 0, fontSize: '11px', color: '#334155', lineHeight: '1.5' }}>{summary}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Cột Trái CV (35%) */}
          <div style={{ width: '35%' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '12px', color: primaryColor, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', fontWeight: 'bold' }}>Học Vấn</h3>
              <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: '#0f172a' }}>{profile?.university}</div>
              <div style={{ fontSize: '10.5px', color: '#475569', margin: '2px 0' }}>Chuyên ngành: {profile?.major}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '12px', color: primaryColor, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', fontWeight: 'bold' }}>Kỹ Năng Chuyên Môn</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {profile?.skills?.map((s, idx) => (
                  <span key={idx} style={{ fontSize: '9.5px', padding: '2px 7px', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '4px', fontWeight: '500' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {certificates.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '12px', color: primaryColor, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', fontWeight: 'bold' }}>Chứng Chỉ</h3>
                {certificates.map(c => (
                  <div key={c.id} style={{ marginBottom: '5px', fontSize: '10.5px' }}>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{c.title}</strong>
                    <span style={{ color: '#64748b' }}>{c.issuer}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cột Phải CV (65%) */}
          <div style={{ width: '65%' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '12px', color: primaryColor, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', fontWeight: 'bold' }}>
                Đồ Án & Dự Án Thực Tế (Proof of Work)
              </h3>

              {selectedProjects.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Chưa chọn đồ án nào.</div>
              ) : (
                selectedProjects.map(p => (
                  <div key={p.id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '11.5px', color: '#0f172a' }}>{p.title}</strong>
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic', margin: '1px 0 3px 0' }}>
                      Vai trò: {p.role || 'Thành viên'} | Loại: {p.project_type || 'Đồ án'}
                    </div>
                    <p style={{ margin: 0, fontSize: '10.5px', color: '#334155', lineHeight: '1.4' }}>{p.description}</p>
                  </div>
                ))
              )}
            </div>

            {achievements.length > 0 && (
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '12px', color: primaryColor, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', fontWeight: 'bold' }}>Giải Thưởng & Thành Tích</h3>
                {achievements.map(a => (
                  <div key={a.id} style={{ marginBottom: '4px', fontSize: '10.5px' }}>
                    <strong style={{ color: '#0f172a' }}>{a.title}</strong> — <span style={{ color: '#64748b' }}>{a.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TEMPLATE 2: MINIMALIST HARVARD (Phong cách Học thuật / Tài chính)
  // 1 cột thuần túy, font Serif (Lora), đường kẻ ngang hairline 0.5px, căn lề Ivy League
  // =========================================================================
  if (template === 'minimal') {
    return (
      <div style={{ fontFamily: "'Lora', 'Georgia', serif", color: '#1e293b' }}>
        {/* Header Centered with 0.5px hairline */}
        <div style={{ textAlign: 'center', borderBottom: '0.5px solid #94a3b8', paddingBottom: '12px', marginBottom: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            {profile?.full_name || 'HỌ VÀ TÊN SINH VIÊN'}
          </h1>
          <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#475569', margin: '4px 0 6px 0' }}>
            {profile?.major} • {profile?.university}
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <span>📧 {userEmail}</span>
            {profile?.gpa && <span>GPA: {profile.gpa}</span>}
          </div>
        </div>

        {/* Tóm tắt */}
        {summary && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '11.5px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold', borderBottom: '0.5px solid #cbd5e1', paddingBottom: '2px' }}>
              I. TÓM TẮT NĂNG LỰC
            </h3>
            <p style={{ margin: 0, fontSize: '10.5px', color: '#334155', lineHeight: '1.5', textIndent: '15px' }}>{summary}</p>
          </div>
        )}

        {/* Học vấn */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '11.5px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold', borderBottom: '0.5px solid #cbd5e1', paddingBottom: '2px' }}>
            II. HỌC VẤN & BẰNG CẤP
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>
            <span>{profile?.university}</span>
            <span>2022 – 2026</span>
          </div>
          <div style={{ fontSize: '10.5px', color: '#475569', fontStyle: 'italic', paddingLeft: '15px' }}>
            Chuyên ngành: {profile?.major} {profile?.gpa && `• Điểm tích lũy: ${profile.gpa}/4.0`}
          </div>
        </div>

        {/* Đồ án Verified */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '11.5px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold', borderBottom: '0.5px solid #cbd5e1', paddingBottom: '2px' }}>
            III. CÔNG TRÌNH & ĐỒ ÁN NGHIÊN CỨU TIÊU BIỂU
          </h3>
          {selectedProjects.map(p => (
            <div key={p.id} style={{ marginBottom: '10px', paddingLeft: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '11px', color: '#0f172a' }}>{p.title}</strong>
                <span style={{ fontSize: '9.5px', color: '#64748b' }}>Vai trò: {p.role || 'Thành viên'}</span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#334155', lineHeight: '1.4' }}>{p.description}</p>
            </div>
          ))}
        </div>

        {/* Kỹ năng */}
        <div style={{ marginBottom: '14px' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '11.5px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold', borderBottom: '0.5px solid #cbd5e1', paddingBottom: '2px' }}>
            IV. KỸ NĂNG & CHỨNG CHỈ HỌC THUẬT
          </h3>
          <div style={{ fontSize: '10.5px', color: '#334155', paddingLeft: '15px', lineHeight: '1.5' }}>
            <strong>Kỹ năng:</strong> {profile?.skills?.join(' • ')}
          </div>
          {certificates.length > 0 && (
            <div style={{ fontSize: '10px', color: '#475569', paddingLeft: '15px', marginTop: '4px' }}>
              <strong>Chứng chỉ:</strong> {certificates.map(c => `${c.title} (${c.issuer})`).join(' • ')}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // TEMPLATE 3: TECH DEVELOPER TERMINAL (Dành Riêng Cho IT)
  // Thẻ tag Tech Stack bo góc, GitHub/Commit link, chia khối đồ án Bento Grid
  // =========================================================================
  if (template === 'tech') {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', monospace", color: '#0f172a' }}>
        {/* Terminal Window Header */}
        <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '14px 18px', borderRadius: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: '9.5px', fontFamily: 'monospace', color: '#94a3b8', marginLeft: '6px' }}>~/profilehub/candidate_terminal.sh</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#38bdf8' }}>
                {profile?.full_name || 'DEVELOPER CANDIDATE'}
              </h1>
              <div style={{ fontSize: '11.5px', color: '#a5b4fc', fontFamily: 'monospace', marginTop: '2px' }}>
                &gt; {profile?.major || 'Software Engineer'} [Ready to Ship]
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '9.5px', color: '#94a3b8' }}>
              <div>📧 {userEmail}</div>
              <div>📍 {profile?.university}</div>
            </div>
          </div>
        </div>

        {/* Bento Grid: 2 Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          {/* Tech Stack Bento Card */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '10.5px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase' }}>
              ⚡ Tech Stack & Kỹ Năng Code
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {profile?.skills?.map((s, idx) => (
                <span key={idx} style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: '4px', fontWeight: '600' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Education & Certs Bento Card */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '10.5px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase' }}>
              🎓 Học Vấn & Bằng Cấp
            </h4>
            <div style={{ fontSize: '10.5px', fontWeight: 'bold', color: '#0f172a' }}>{profile?.university}</div>
            <div style={{ fontSize: '9.5px', color: '#64748b' }}>{profile?.major} {profile?.gpa && `• GPA: ${profile.gpa}`}</div>
            {certificates.slice(0, 2).map(c => (
              <div key={c.id} style={{ fontSize: '9.5px', color: '#334155', marginTop: '3px' }}>
                📜 {c.title} ({c.issuer})
              </div>
            ))}
          </div>
        </div>

        {/* Đồ án Bento Grid */}
        <div style={{ marginBottom: '14px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '11.5px', color: primaryColor, textTransform: 'uppercase', fontWeight: 'bold' }}>
            📦 Kho Đồ Án Kỹ Thuật (GitHub Repositories)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {selectedProjects.map(p => (
              <div key={p.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '9px', backgroundColor: '#ffffff' }}>
                <strong style={{ fontSize: '11px', color: '#0f172a', display: 'block' }}>{p.title}</strong>
                <span style={{ fontSize: '9px', color: '#64748b' }}>Vai trò: {p.role || 'Dev'} | Stack: {p.tags?.join(', ') || 'Fullstack'}</span>
                <p style={{ margin: '3px 0 0 0', fontSize: '9.5px', color: '#334155', lineHeight: '1.4' }}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TEMPLATE 4: TIMELINE MILESTONE (Trục Thời Gian Dọc)
  // Trục kẻ dọc nối các mốc năm bằng các chấm tròn (Milestone dots)
  // =========================================================================
  if (template === 'executive') {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif", color: '#0f172a' }}>
        {/* Header Clean */}
        <div style={{ borderBottom: `2.5px solid ${primaryColor}`, paddingBottom: '12px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', color: primaryColor, fontWeight: '800', textTransform: 'uppercase' }}>
              {profile?.full_name || 'HỌ VÀ TÊN SINH VIÊN'}
            </h1>
            <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '2px', fontWeight: '600' }}>
              {profile?.major}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>
            <div>📧 {userEmail}</div>
            <div>📍 {profile?.university}</div>
          </div>
        </div>

        {/* Trục Sinh Kẻ Dọc (Timeline Axis) */}
        <div style={{ borderLeft: `2px solid ${primaryColor}`, paddingLeft: '16px', marginLeft: '6px' }}>
          {/* Mốc 1: Học vấn */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{ position: 'absolute', left: '-22px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: primaryColor, border: '2px solid white', boxShadow: `0 0 0 1.5px ${primaryColor}` }} />
            <h4 style={{ margin: '0 0 3px 0', fontSize: '11.5px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase' }}>
              Giai Đoạn Học Tập & Nền Tảng (2022 - 2026)
            </h4>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>{profile?.university}</div>
            <div style={{ fontSize: '10px', color: '#475569' }}>Chuyên ngành: {profile?.major} {profile?.gpa && `• GPA: ${profile.gpa}`}</div>
          </div>

          {/* Mốc 2: Các dự án tiêu biểu theo tiến trình */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{ position: 'absolute', left: '-22px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: primaryColor, border: '2px solid white', boxShadow: `0 0 0 1.5px ${primaryColor}` }} />
            <h4 style={{ margin: '0 0 6px 0', fontSize: '11.5px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase' }}>
              Dấu Mốc Đồ Án & Dự Án Triển Khai
            </h4>
            {selectedProjects.map((p, pIdx) => (
              <div key={p.id} style={{ marginBottom: '10px' }}>
                <strong style={{ fontSize: '11px', color: '#0f172a' }}>{pIdx + 1}. {p.title}</strong>
                <span style={{ fontSize: '9.5px', color: '#64748b', marginLeft: '6px' }}>({p.role || 'Thành viên'} - {p.project_type || 'Đồ án'})</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#334155', lineHeight: '1.4' }}>{p.description}</p>
              </div>
            ))}
          </div>

          {/* Mốc 3: Thành tích & Kỹ năng */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-22px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: primaryColor, border: '2px solid white', boxShadow: `0 0 0 1.5px ${primaryColor}` }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '11.5px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase' }}>
              Kỹ Năng & Bằng Cấp Tích Lũy
            </h4>
            <div style={{ fontSize: '10px', color: '#334155', lineHeight: '1.5' }}>
              <strong>Kỹ năng:</strong> {profile?.skills?.join(' • ')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TEMPLATE 5: LEFT SOLID SIDEBAR (Phong Cách Châu Âu)
  // Cột trái màu nền đồng nhất từ đầu đến chân trang (xanh Navy/chì), cột phải nền trắng
  // =========================================================================
  if (template === 'pro_split') {
    return (
      <div style={{ display: 'flex', minHeight: '270mm', fontFamily: "'Be Vietnam Pro', 'Inter', sans-serif" }}>
        {/* Cột trái solid màu từ đầu đến chân */}
        <div style={{ width: '34%', backgroundColor: primaryColor, color: 'white', padding: '20px 16px', boxSizing: 'border-box', borderRadius: '8px 0 0 8px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'white' }}>
            {profile?.full_name || 'HỌ TÊN SINH VIÊN'}
          </h1>
          <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px', fontWeight: '600' }}>
            {profile?.major}
          </div>

          <div style={{ fontSize: '9.5px', opacity: 0.85, lineHeight: '1.6', margin: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
            <div>📧 {userEmail}</div>
            <div>📍 {profile?.university}</div>
            {profile?.gpa && <div>🎯 GPA: {profile.gpa}</div>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: '#93c5fd' }}>Kỹ Năng</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {profile?.skills?.map((s, idx) => (
                <span key={idx} style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: '3px' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {certificates.length > 0 && (
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: '#93c5fd' }}>Chứng Chỉ</h3>
              {certificates.map(c => (
                <div key={c.id} style={{ marginBottom: '6px', fontSize: '9.5px' }}>
                  <div style={{ fontWeight: 'bold' }}>{c.title}</div>
                  <div style={{ opacity: 0.8 }}>{c.issuer}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cột phải nền trắng */}
        <div style={{ width: '66%', padding: '20px 22px', boxSizing: 'border-box' }}>
          {summary && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '12px', color: primaryColor, textTransform: 'uppercase', fontWeight: 'bold', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '3px' }}>
                Mục Tiêu Nghề Nghiệp
              </h3>
              <p style={{ margin: 0, fontSize: '10.5px', color: '#334155', lineHeight: '1.5' }}>{summary}</p>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '12px', color: primaryColor, textTransform: 'uppercase', fontWeight: 'bold', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '3px' }}>
              Dự Án & Đồ Án Tiêu Biểu
            </h3>
            {selectedProjects.map(p => (
              <div key={p.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '11.5px', color: '#0f172a' }}>{p.title}</strong>
                </div>
                <div style={{ fontSize: '9.5px', color: '#64748b', fontStyle: 'italic', margin: '1px 0' }}>
                  {p.role || 'Thành viên'} | {p.project_type || 'Đồ án'}
                </div>
                <p style={{ margin: 0, fontSize: '10.5px', color: '#334155', lineHeight: '1.4' }}>{p.description}</p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '12px', color: primaryColor, textTransform: 'uppercase', fontWeight: 'bold', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '3px' }}>
              Học Vấn
            </h3>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>{profile?.university}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Chuyên ngành: {profile?.major}</div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TEMPLATE 6: COMPACT 1-PAGE ATS (Tối Ưu Tuyệt Đối Cho Sinh Viên)
  // Tối ưu hóa padding/margin siêu gọn gàng, bố cục 2 cột cân xứng 50-50 ở phần kỹ năng
  // =========================================================================
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#1e293b', lineHeight: '1.35' }}>
      {/* Header Compact */}
      <div style={{ borderBottom: `2px solid ${primaryColor}`, paddingBottom: '6px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', color: primaryColor, fontWeight: 'bold', textTransform: 'uppercase' }}>
            {profile?.full_name || 'HỌ TÊN SINH VIÊN'}
          </h1>
          <div style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>{profile?.major}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '9.5px', color: '#475569' }}>
          <div>📧 {userEmail} | 📍 {profile?.university}</div>
          {profile?.gpa && <div>🎯 GPA: {profile.gpa}</div>}
        </div>
      </div>

      {summary && (
        <div style={{ marginBottom: '8px' }}>
          <h4 style={{ margin: '0 0 2px 0', fontSize: '10.5px', color: primaryColor, textTransform: 'uppercase', fontWeight: 'bold' }}>Tóm Tắt Năng Lực</h4>
          <p style={{ margin: 0, fontSize: '10px', color: '#334155' }}>{summary}</p>
        </div>
      )}

      {/* 2 Cột Cân Xứng 50-50 Cho Kỹ Năng & Bằng Cấp */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
        <div>
          <h4 style={{ margin: '0 0 3px 0', fontSize: '10.5px', color: primaryColor, textTransform: 'uppercase', fontWeight: 'bold' }}>Kỹ Năng</h4>
          <div style={{ fontSize: '9.5px', color: '#334155' }}>{profile?.skills?.join(', ')}</div>
        </div>
        <div>
          <h4 style={{ margin: '0 0 3px 0', fontSize: '10.5px', color: primaryColor, textTransform: 'uppercase', fontWeight: 'bold' }}>Học Vấn & Bằng Cấp</h4>
          <div style={{ fontSize: '9.5px', color: '#334155' }}>
            <strong>{profile?.university}</strong> — {profile?.major}
            {certificates.length > 0 && ` | ${certificates.map(c => c.title).join(', ')}`}
          </div>
        </div>
      </div>

      {/* Đồ án: Đảm bảo vừa 3 đồ án trong 1 trang A4 */}
      <div>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '10.5px', color: primaryColor, textTransform: 'uppercase', fontWeight: 'bold' }}>Đồ Án Tiêu Biểu</h4>
        {selectedProjects.map(p => (
          <div key={p.id} style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: '10.5px', color: '#0f172a' }}>{p.title}</strong>
              <span style={{ fontSize: '9px', color: '#64748b' }}>Vai trò: {p.role || 'Thành viên'}</span>
            </div>
            <p style={{ margin: '1px 0 0 0', fontSize: '9.5px', color: '#475569', lineHeight: '1.3' }}>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

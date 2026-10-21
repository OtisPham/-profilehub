import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import {
  parseHiringPrompt,
  generateJobDescription,
  matchCandidatesWithJob,
  type HiringBrief,
  type GeneratedJD,
  type CandidateMatchResult
} from '../../services/aiRecruitmentService';
import { 
  Sparkles, 
  Mail, 
  Star, 
  Kanban, 
  Edit3, 
  ShieldCheck, 
  Target, 
  BarChart3, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  ExternalLink,
  Brain,
  Eye,
  User,
  FileText,
  FileSpreadsheet,
  TrendingUp
} from 'lucide-react';
import { addToSharedPipeline } from '../../utils/pipelineSync';
import BulkCvImportModal from '../../components/recruiter/BulkCvImportModal';
import { getStoredImportedCandidates, type ImportedCandidateCv } from '../../services/bulkCvImportService';

interface CandidateProfileData {
  id: string;
  full_name: string;
  university?: string;
  major?: string;
  gpa?: string;
  email?: string;
  skills?: string[];
  verified_projects_count: number;
  projects: Array<{ 
    title: string; 
    description?: string;
    is_verified?: boolean;
    demo_url?: string;
    github_url?: string;
    metrics?: string[];
  }>;
}

export default function AIRecruitmentAssistant() {
  const { user } = useAuth();

  // Step flow state: 1: Input -> 2: Brief & JD -> 3: Matched Candidates
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // User input prompt
  const [promptText, setPromptText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  // Hiring Brief & JD State
  const [hiringBrief, setHiringBrief] = useState<HiringBrief | null>(null);
  const [generatedJD, setGeneratedJD] = useState<GeneratedJD | null>(null);

  // Editable JD State
  const [jdTitle, setJdTitle] = useState('');
  const [jdAbout, setJdAbout] = useState('');

  // Candidates & Matching State
  const [candidatesList, setCandidatesList] = useState<CandidateProfileData[]>([]);
  const [matchedResults, setMatchedResults] = useState<CandidateMatchResult[]>([]);
  const [matchingLoading, setMatchingLoading] = useState(false);

  // Detailed Candidate JEV Modal
  const [inspectCandidateResult, setInspectCandidateResult] = useState<CandidateMatchResult | null>(null);

  // Bulk XLSX Import Modal
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  // Fetch candidates from Supabase or Fallback Mock Data + Stored Bulk CSVs
  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const { data: projectsData } = await supabase.from('projects').select('*');
        const { data: profilesData } = await supabase.from('student_profiles').select('*');
        const { data: usersData } = await supabase.from('users').select('id, email, full_name');

        let baseCandidates: CandidateProfileData[] = [];

        if (profilesData && profilesData.length > 0) {
          const userMap = new Map(usersData?.map(u => [u.id, u]) || []);
          const projectsByStudent = new Map<string, Array<{ 
            title: string; 
            description?: string;
            is_verified?: boolean; 
            verification_status?: string;
            demo_url?: string;
            github_url?: string;
          }>>();

          projectsData?.forEach((p: { 
            student_id: string; 
            title: string; 
            description?: string;
            is_verified?: boolean; 
            verification_status?: string;
            demo_url?: string;
            github_url?: string;
          }) => {
            const list = projectsByStudent.get(p.student_id) || [];
            list.push(p);
            projectsByStudent.set(p.student_id, list);
          });

          baseCandidates = profilesData.map(p => {
            const u = userMap.get(p.id);
            const pList = projectsByStudent.get(p.id) || [];
            return {
              id: p.id,
              full_name: p.full_name || u?.full_name || 'Ứng viên Sinh viên',
              university: p.university || 'Đại Học Bách Khoa',
              major: p.major || 'Công Nghệ Thông Tin',
              gpa: p.gpa || '3.6 / 4.0',
              email: u?.email || '',
              skills: p.skills || ['React', 'TypeScript', 'Tailwind', 'Git'],
              verified_projects_count: pList.filter(proj => proj.is_verified || proj.verification_status === 'verified').length,
              projects: pList.map(proj => ({
                title: proj.title,
                description: proj.description,
                is_verified: proj.is_verified || proj.verification_status === 'verified',
                demo_url: proj.demo_url,
                github_url: proj.github_url,
              }))
            };
          });
        }

        // Check for local stored bulk imported CVs (e.g. 100 sample candidates)
        const storedBulk = getStoredImportedCandidates();
        const formattedBulk: CandidateProfileData[] = storedBulk.map(c => ({
          id: c.id,
          full_name: c.full_name,
          university: c.university,
          major: c.major,
          gpa: c.gpa,
          email: c.email,
          skills: c.skills,
          verified_projects_count: c.verified_projects_count,
          projects: c.projects
        }));

        if (baseCandidates.length > 0 || formattedBulk.length > 0) {
          const existingIds = new Set(baseCandidates.map(b => b.id));
          const merged = [...baseCandidates, ...formattedBulk.filter(f => !existingIds.has(f.id))];
          setCandidatesList(merged);
        } else {
          // Fallback rich candidate dataset with Verified Badges & Metrics for recruiter testing
          setCandidatesList([
            {
              id: 'c_elite_1',
              full_name: 'Nguyễn Văn Minh (Verified Elite)',
              university: 'Đại Học Bách Khoa TP.HCM',
              major: 'Kỹ Thuật Phần Mềm',
              gpa: '3.75 / 4.0',
              email: 'minh.nguyen@example.com',
              skills: ['React', 'TypeScript', 'Tailwind CSS', 'REST API', 'Next.js', 'Git'],
              verified_projects_count: 2,
              projects: [
                {
                  title: 'E-Commerce Platform SPA',
                  description: 'Xây dựng với React và TypeScript, giảm 35% response time, 500+ sinh viên thử nghiệm.',
                  is_verified: true,
                  demo_url: 'https://demo.example.com',
                  github_url: 'https://github.com/minh/ecommerce',
                },
                {
                  title: 'ProfileHub Student Management',
                  description: 'Đồ án môn học đạt 9.5/10 điểm, có chứng nhận của GVHD.',
                  is_verified: true,
                  demo_url: 'https://profilehub.dev',
                }
              ]
            },
            {
              id: 'c_stuffing_2',
              full_name: 'Trần Hoàng Long (Tự khai kỹ năng)',
              university: 'Đại Học CNTT (UIT)',
              major: 'Khoa Học Máy Tính',
              gpa: '3.4 / 4.0',
              email: 'long.tran@example.com',
              skills: ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'Docker', 'Kubernetes', 'AWS', 'Next.js'],
              verified_projects_count: 0,
              projects: [
                {
                  title: 'Website Cá Nhân',
                  description: 'Trang giới thiệu bản thân cơ bản bằng HTML/CSS.',
                  is_verified: false,
                }
              ]
            }
          ]);
        }
      } catch (err) {
        console.error("Load candidates error:", err);
      }
    };

    loadCandidates();
  }, []);

  // Step 1 -> Step 2: Parse Prompt & Generate Brief + JD
  const handleAnalyzePrompt = () => {
    if (!promptText.trim()) {
      alert('Vui lòng nhập mô tả nhu cầu tuyển dụng của bạn!');
      return;
    }

    setAnalyzing(true);
    setTimeout(() => {
      const brief = parseHiringPrompt(promptText);
      const jd = generateJobDescription(brief);

      setHiringBrief(brief);
      setGeneratedJD(jd);
      setJdTitle(jd.title);
      setJdAbout(jd.aboutRole);

      setAnalyzing(false);
      setStep(2);
    }, 600);
  };

  // Step 2 -> Step 3: Run Candidate Matching
  const handleRunMatching = () => {
    if (!hiringBrief) return;
    setMatchingLoading(true);

    setTimeout(() => {
      const results = matchCandidatesWithJob(hiringBrief, candidatesList);
      setMatchedResults(results);
      setMatchingLoading(false);
      setStep(3);
    }, 800);
  };

  const handleSelectSamplePrompt = (sample: string) => {
    setPromptText(sample);
  };

  const handleBulkImportSuccess = (newBulk: ImportedCandidateCv[]) => {
    const formattedBulk: CandidateProfileData[] = newBulk.map(c => ({
      id: c.id,
      full_name: c.full_name,
      university: c.university,
      major: c.major,
      gpa: c.gpa,
      email: c.email,
      skills: c.skills,
      verified_projects_count: c.verified_projects_count,
      projects: c.projects
    }));

    setCandidatesList(prev => {
      const existingIds = new Set(formattedBulk.map(b => b.id));
      return [...formattedBulk, ...prev.filter(p => !existingIds.has(p.id))];
    });

    if (step === 3 && hiringBrief) {
      const results = matchCandidatesWithJob(hiringBrief, formattedBulk);
      setMatchedResults(results);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px 28px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        marginBottom: '25px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>
            <Sparkles size={14} /> AI RECRUITMENT ENGINE v2.0
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🤖 AI Trợ Lý Tuyển Dụng & Sàng Lọc Ứng Viên
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
            Đánh giá tương thích ứng viên theo 4 trụ cột bằng chứng, chống gian lận CV (*Anti-Keyword Stuffing*).
          </p>
        </div>

        {/* Step Indicator & Bulk Import Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsBulkImportOpen(true)}
            style={{
              padding: '8px 14px',
              backgroundColor: '#ecfdf5',
              color: '#047857',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 3px rgba(16, 185, 129, 0.1)'
            }}
          >
            <FileSpreadsheet size={16} /> 📂 Nạp 100 CV Test (XLSX / Mẫu)
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '20px', backgroundColor: step === 1 ? '#1e3a8a' : '#f1f5f9', color: step === 1 ? 'white' : '#64748b' }}>
              1. Nhập Nhu Cầu
            </span>
            <span style={{ color: '#cbd5e1' }}>→</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '20px', backgroundColor: step === 2 ? '#1e3a8a' : '#f1f5f9', color: step === 2 ? 'white' : '#64748b' }}>
              2. Duyệt JD & Brief
            </span>
            <span style={{ color: '#cbd5e1' }}>→</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '20px', backgroundColor: step === 3 ? '#1e3a8a' : '#f1f5f9', color: step === 3 ? 'white' : '#64748b' }}>
              3. Xếp Hạng AI
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: PROMPT INPUT */}
      {step === 1 && (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>
            1. Mô tả vị trí & tiêu chí ứng viên bạn đang tìm kiếm (Prompt tự do)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>
            Nhập yêu cầu bằng ngôn ngữ tự nhiên. AI sẽ tự động phân tách Kỹ năng bắt buộc (Must-have), Kỹ năng cộng điểm (Nice-to-have) và tạo bản JD hoàn chỉnh.
          </p>

          <textarea
            rows={5}
            value={promptText}
            onChange={e => setPromptText(e.target.value)}
            placeholder="Ví dụ: Cần tuyển 2 bạn Thực tập sinh Frontend ReactJS biết TypeScript, Tailwind, có ít nhất 1 đồ án thực tế đã được GV duyệt hoặc có link Demo/GitHub, làm việc Full-time tại TP.HCM..."
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', lineHeight: '1.6', boxSizing: 'border-box', marginBottom: '20px' }}
          />

          {/* Sample Prompts */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '10px' }}>
              💡 Hoặc chọn nhanh mẫu tuyển dụng phổ biến:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                onClick={() => handleSelectSamplePrompt('Tuyển 2 Thực tập sinh Frontend ReactJS biết TypeScript, Tailwind, REST API, có đồ án thực tế có link demo.')}
                style={{ padding: '8px 14px', backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ⚛️ Frontend ReactJS (TypeScript, Tailwind)
              </button>
              <button
                onClick={() => handleSelectSamplePrompt('Tuyển Thực tập sinh Backend Node.js biết PostgreSQL, Express, REST API, Docker, có ít nhất 2 đồ án.')}
                style={{ padding: '8px 14px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ⚙️ Backend Node.js (Express, PostgreSQL, Docker)
              </button>
              <button
                onClick={() => handleSelectSamplePrompt('Tuyển Thực tập sinh UI/UX Designer thạo Figma, User Research, Design System, có portfolio sản phẩm.')}
                style={{ padding: '8px 14px', backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🎨 UI/UX Designer (Figma, User Research)
              </button>
            </div>
          </div>

          {/* Action Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleAnalyzePrompt}
              disabled={analyzing}
              style={{ padding: '12px 28px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)' }}
            >
              {analyzing ? '⏳ AI Đang Phân Tích Requirements...' : '⚡ AI Phân Tích & Tạo Hiring Brief →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: HIRING BRIEF & AI GENERATED JD */}
      {step === 2 && hiringBrief && generatedJD && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          
          {/* Column 1: AI Extracted Hiring Brief */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#1e3a8a', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📋 AI Hiring Brief (Tiêu chí trích xuất)
              </h3>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Edit3 size={12} /> Sửa nhu cầu
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Vị trí tuyển dụng:</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginTop: '2px' }}>{hiringBrief.position}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Địa điểm:</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>📍 {hiringBrief.location}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Hình thức:</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>⏰ {hiringBrief.availability}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#047857', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>✓ Kỹ năng cốt lõi (MUST-HAVE):</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {hiringBrief.mustHaveSkills.map((sk, i) => (
                    <span key={i} style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>○ Kỹ năng khuyến khích (NICE-TO-HAVE):</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {hiringBrief.niceToHaveSkills.map((sk, i) => (
                    <span key={i} style={{ fontSize: '12px', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                      ○ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Yêu cầu đồ án thực tế:</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#8b5cf6', marginTop: '2px' }}>
                  🛡️ Tối thiểu {hiringBrief.minProjectsCount} đồ án (Ưu tiên đã qua kiểm định Giảng viên)
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: AI Generated Job Description (JD) */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📝 AI Generated Job Description (JD)
                </h3>
                <span style={{ fontSize: '11px', backgroundColor: '#f5f3ff', color: '#8b5cf6', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                  Tiêu chuẩn AI
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>Tên vị trí bài đăng *</label>
                  <input
                    type="text"
                    value={jdTitle}
                    onChange={e => setJdTitle(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 'bold', color: '#0f172a', boxSizing: 'border-box', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>Mô tả ngắn gọn về công việc</label>
                  <textarea
                    rows={3}
                    value={jdAbout}
                    onChange={e => setJdAbout(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#334155', boxSizing: 'border-box', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>Trách nhiệm chính (AI đã sinh)</label>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                    {generatedJD.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Run Matching */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setStep(1)}
                style={{ padding: '10px 18px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                Quay lại
              </button>
              <button
                onClick={handleRunMatching}
                disabled={matchingLoading}
                style={{ padding: '10px 22px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {matchingLoading ? '⏳ Đang Quét & Khớp AI...' : '🚀 Khớp Ứng Viên Bằng AI Engine →'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: AI RECOMMENDED CANDIDATES & MATCH EXPLANATIONS */}
      {step === 3 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>
                🎯 Kết quả sàng lọc {matchedResults.length} ứng viên cho vị trí "{jdTitle}" (Chuẩn AI Match)
              </span>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Đánh giá theo 4 Trụ cột: Kỹ năng (30%), Độ sâu bằng chứng (40%), Chỉ số định lượng (20%), Cấp độ (10%).
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => setIsBulkImportOpen(true)}
                style={{ padding: '8px 14px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FileSpreadsheet size={14} /> 📂 Nạp Thêm 100 CV (XLSX)
              </button>

              <button
                onClick={() => setStep(2)}
                style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                ← Chỉnh sửa Tiêu chí Hiring Brief
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))', gap: '20px' }}>
            {matchedResults.map(res => {
              const candData = candidatesList.find(c => c.id === res.candidateId);
              return (
                <div key={res.candidateId} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                  <div>
                    {/* Candidate Header & Match Score Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '17px', color: '#0f172a', fontWeight: 'bold' }}>{res.candidateName}</h3>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          🎓 {candData?.university} • GPA: {candData?.gpa}
                        </div>
                      </div>

                      {/* Match Score Ring / Badge */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '22px', fontWeight: '900', color: res.matchScore >= 80 ? '#047857' : '#1d4ed8' }}>
                          {res.matchScore}%
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>TỔNG ĐỘ KHỚP</div>
                      </div>
                    </div>

                    {/* Trust Tier & Pills */}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: res.trustTier === 'VERIFIED_ELITE' ? '#ecfdf5' : '#eff6ff', color: res.trustTier === 'VERIFIED_ELITE' ? '#047857' : '#1d4ed8', padding: '3px 10px', borderRadius: '12px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={13} /> {res.trustTier} (x{res.trustMultiplier})
                      </span>

                      {res.antiStuffingRisk === 'HIGH' && (
                        <span style={{ fontSize: '10px', fontWeight: 'bold', backgroundColor: '#fef2f2', color: '#b91c1c', padding: '3px 8px', borderRadius: '10px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <AlertTriangle size={11} /> Cảnh báo tự khai
                        </span>
                      )}
                    </div>

                    {/* 3-Pillars Mini Score Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #f1f5f9', marginBottom: '14px' }}>
                      <div style={{ fontSize: '11px', color: '#475569' }}>
                        🎯 Skills: <strong style={{ color: '#0f172a' }}>{res.pillars.skillFitScore}%</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: '#475569' }}>
                        🛡️ Evidence: <strong style={{ color: '#0f172a' }}>{res.pillars.evidenceDepthScore}%</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: '#475569' }}>
                        📊 Metrics: <strong style={{ color: '#0f172a' }}>{res.pillars.impactScore}%</strong>
                      </div>
                    </div>

                    {/* Verified Proofs & Why this Candidate */}
                    <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Bằng chứng thực tế & Điểm mạnh:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {res.whyText.map((why, i) => (
                          <div key={i} style={{ fontSize: '11.5px', color: '#047857', fontWeight: '500' }}>
                            {why}
                          </div>
                        ))}
                        {res.warningText && (
                          <div style={{ fontSize: '11.5px', color: '#d97706', fontWeight: '500', marginTop: '2px' }}>
                            {res.warningText}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => setInspectCandidateResult(res)}
                      style={{ width: '100%', padding: '9px', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '12.5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Eye size={15} /> Xem Phân Tích Độ Khớp AI Chi Tiết
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          const localSaved = JSON.parse(localStorage.getItem(`saved_candidates_${user?.id || 'default'}`) || '[]');
                          const alreadySaved = localSaved.some((s: { student_id?: string }) => s.student_id === res.candidateId);
                          if (alreadySaved) {
                            alert(`Ứng viên ${res.candidateName} đã có trong danh sách Đã Lưu!`);
                          } else {
                            const newSaved = {
                              id: 'sc_' + Date.now(),
                              recruiter_id: user?.id || 'rec1',
                              student_id: res.candidateId,
                              folder_name: hiringBrief?.position || 'Ứng viên AI Match',
                              created_at: new Date().toISOString(),
                              student: { id: res.candidateId, full_name: res.candidateName, major: candData?.major, university: candData?.university, gpa: candData?.gpa, skills: candData?.skills }
                            };
                            localStorage.setItem(`saved_candidates_${user?.id || 'default'}`, JSON.stringify([...localSaved, newSaved]));
                            alert(`⭐ Đã lưu ứng viên ${res.candidateName} vào thư mục!`);
                          }
                        }}
                        style={{ flex: 1, padding: '8px', backgroundColor: '#f5f3ff', color: '#8b5cf6', border: '1px solid #ddd6fe', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <Star size={14} /> Lưu Hồ Sơ
                      </button>

                      <button
                        onClick={() => {
                          const newItem = {
                            id: 'p_' + Date.now(),
                            recruiter_id: user?.id || 'rec1',
                            student_id: res.candidateId,
                            stage: 'shortlisted' as const,
                            student: { id: res.candidateId, full_name: res.candidateName, major: candData?.major, university: candData?.university, gpa: candData?.gpa, skills: candData?.skills },
                            private_notes: `AI Match score ${res.matchScore}% (Tier: ${res.trustTier}) cho vị trí ${hiringBrief?.position}`
                          };
                          const added = addToSharedPipeline(newItem, user?.id);
                          if (added) {
                            alert(`📊 Đã thêm ${res.candidateName} vào cột Shortlisted (Pipeline)!`);
                          } else {
                            alert(`Ứng viên ${res.candidateName} đã có trong Pipeline!`);
                          }
                        }}
                        style={{ flex: 1, padding: '8px', backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <Kanban size={14} /> Shortlist
                      </button>
                    </div>

                    <a
                      href={`mailto:${candData?.email}?subject=Mời%20Phỏng%20Vấn%20Vị%20Trí%20${encodeURIComponent(hiringBrief?.position || '')}&body=Chào%20${res.candidateName},%20hệ%20thống%20ProfileHub%20AI%20Match%20đã%20đánh%20giá%20hồ%20sơ%20verified%20của%20bạn%20đạt%20${res.matchScore}%%20tương%20thích%20với%20vị%20trí%20${encodeURIComponent(hiringBrief?.position || '')}...`}
                      style={{ padding: '10px', backgroundColor: '#1e3a8a', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Mail size={14} /> Mời Phỏng Vấn (AI {res.matchScore}%)
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILED CANDIDATE JEV INSPECTION MODAL */}
      {inspectCandidateResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '18px', marginBottom: '22px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#0f172a' }}>
                    {inspectCandidateResult.candidateName}
                  </h2>
                  <span style={{
                    backgroundColor: inspectCandidateResult.trustTier === 'VERIFIED_ELITE' ? '#ecfdf5' : '#eff6ff',
                    color: inspectCandidateResult.trustTier === 'VERIFIED_ELITE' ? '#047857' : '#1d4ed8',
                    fontSize: '11.5px',
                    fontWeight: 'bold',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    border: '1px solid #bfdbfe'
                  }}>
                    🛡️ {inspectCandidateResult.trustTier} (x{inspectCandidateResult.trustMultiplier})
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  Đánh giá toàn diện: Kỹ thuật & Bằng chứng đồ án ({inspectCandidateResult.matchScore}%)
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: inspectCandidateResult.matchScore >= 80 ? '#047857' : '#1d4ed8', lineHeight: 1 }}>
                    {inspectCandidateResult.matchScore}%
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginTop: '2px' }}>TỔNG ĐỘ KHỚP</div>
                </div>
                <button
                  onClick={() => setInspectCandidateResult(null)}
                  style={{ backgroundColor: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: AI Technical Matching & Gap Analysis */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* SECTION 1: AI 4-PILLAR BREAKDOWN */}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="#1d4ed8" />
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>
                      1. Phân Tích Kỹ Thuật Thực Chiến (AI Evidence-Based • Trọng số 85%)
                    </h3>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '6px' }}>
                    Điểm kỹ thuật: {inspectCandidateResult.technicalScore || inspectCandidateResult.matchScore}%
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>🎯 Kỹ năng khớp (30%)</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>
                      {inspectCandidateResult.pillars.skillFitScore}%
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>🛡️ Độ sâu bằng chứng (40%)</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>
                      {inspectCandidateResult.pillars.evidenceDepthScore}%
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>📊 Chỉ số định lượng (20%)</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>
                      {inspectCandidateResult.pillars.impactScore}%
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>🧭 Cấp độ phù hợp (10%)</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>
                      {inspectCandidateResult.pillars.alignmentScore}%
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>
                    ✅ Bằng chứng dự án đã xác minh:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {inspectCandidateResult.whyText.map((why, i) => (
                      <div key={i} style={{ fontSize: '12.5px', color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} /> {why}
                      </div>
                    ))}
                    {inspectCandidateResult.warningText && (
                      <div style={{ fontSize: '12px', color: '#b45309', backgroundColor: '#fef3c7', padding: '6px 10px', borderRadius: '6px', marginTop: '4px' }}>
                        ⚠️ {inspectCandidateResult.warningText}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: POST-INTERVIEW LEVEL CALIBRATION & OFFER STRATEGY */}
              <div style={{ backgroundColor: inspectCandidateResult.matchScore >= 80 ? '#f0fdf4' : '#eff6ff', padding: '18px 20px', borderRadius: '12px', border: `1px solid ${inspectCandidateResult.matchScore >= 80 ? '#bbf7d0' : '#bfdbfe'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={18} color={inspectCandidateResult.matchScore >= 80 ? '#16a34a' : '#2563eb'} />
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>
                      3. Đề Xuất Cấp Bậc Tuyển Dụng & Chiến Lược Offer (AI Talent Calibration)
                    </h3>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: inspectCandidateResult.matchScore >= 80 ? '#16a34a' : '#2563eb',
                    padding: '4px 10px',
                    borderRadius: '12px'
                  }}>
                    {inspectCandidateResult.matchScore >= 80 ? '🚀 UP-LEVEL CANDIDATE' : '✅ ON-TARGET LEVEL'}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6', marginBottom: '10px' }}>
                  {inspectCandidateResult.matchScore >= 80 ? (
                    <>
                      <strong>Khuyến nghị Đôn Cấp (Up-leveling):</strong> Ứng viên đăng ký cấp bậc Fresher nhưng có chỉ số đồ án Verified đạt điểm xuất sắc ({inspectCandidateResult.matchScore}%). 
                      Khuyến nghị HR gửi <strong>Offer ở mức Junior (13 - 17 triệu VNĐ)</strong> để tăng tỷ lệ chốt deal và tránh mất nhân tài tiềm năng.
                    </>
                  ) : (
                    <>
                      <strong>Khuyến nghị Đúng Cấp (On-target):</strong> Năng lực ứng viên khớp đúng tiêu chuẩn cấp bậc vị trí tuyển dụng ({inspectCandidateResult.matchScore}%). 
                      Khuyến nghị gửi Offer theo khung lương chuẩn của công ty (8 - 12 triệu VNĐ).
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11.5px', padding: '3px 8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#475569' }}>
                    📌 Kế hoạch Onboarding: Giao 1 task PoC độc lập trong 2 tuần đầu
                  </span>
                  <span style={{ fontSize: '11.5px', padding: '3px 8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#475569' }}>
                    👨‍💼 Mentor đề xuất: Senior Technical Lead
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '18px', marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setInspectCandidateResult(null)}
                style={{ padding: '10px 18px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                Đóng
              </button>
              <a
                href={`mailto:${candidatesList.find(c => c.id === inspectCandidateResult.candidateId)?.email}?subject=Mời%20Phỏng%20Vấn%20Vị%20Trí%20${encodeURIComponent(hiringBrief?.position || '')}&body=Chào%20${inspectCandidateResult.candidateName},%20hệ%20thống%20ProfileHub%20AI%20Match%20đã%20đánh%20giá%20hồ%20sơ%20verified%20của%20bạn%20đạt%20${inspectCandidateResult.matchScore}%%20tương%20thích%20với%20vị%20trí%20${encodeURIComponent(hiringBrief?.position || '')}...`}
                style={{ padding: '10px 20px', backgroundColor: '#1e3a8a', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Mail size={15} /> Gửi Lời Mời Phỏng Vấn
              </a>
            </div>
          </div>
        </div>
      )}

      {/* BULK XLSX IMPORT MODAL */}
      <BulkCvImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportSuccess={handleBulkImportSuccess}
      />

    </div>
  );
}

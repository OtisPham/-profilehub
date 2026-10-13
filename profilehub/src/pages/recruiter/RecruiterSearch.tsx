import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Kanban,
  Star,
  CheckCircle2,
  Filter,
  Layers,
  Award,
  BookOpen,
  User,
  X,
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  major: string;
  university: string;
  gpa: string;
  skills: string[];
  verifiedProjectsCount: number;
  matchScore: string;
  bio: string;
  topProject: string;
  topProjectScore: number;
  topProjectCode: string;
}

export const RecruiterSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  const candidates: Candidate[] = [
    {
      id: 'c1',
      name: 'Phạm Thái Bảo',
      major: 'Kỹ thuật Phần mềm',
      university: 'ĐH Sư Phạm Kỹ Thuật TP.HCM (HCMUTE)',
      gpa: '3.85 / 4.0',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
      verifiedProjectsCount: 3,
      matchScore: '98%',
      bio: 'Sinh viên năm cuối chuyên ngành Kỹ thuật Phần mềm, có 3 đồ án được thẩm định bởi Giảng viên khoa CNTT, tập trung vào High-Throughput Distributed Systems và Clean Architecture.',
      topProject: 'Hệ thống Quản lý Bán lẻ & Cổng Thanh Toán (E-Commerce Platform)',
      topProjectScore: 9.5,
      topProjectCode: 'PH-VER-8F2A9C',
    },
    {
      id: 'c2',
      name: 'Trần Thị Bích',
      major: 'Hệ thống Nhúng & IoT',
      university: 'ĐH Bách Khoa TP.HCM (HCMUT)',
      gpa: '3.70 / 4.0',
      skills: ['C++', 'Python', 'MQTT', 'ESP32', 'FreeRTOS', 'React'],
      verifiedProjectsCount: 2,
      matchScore: '90%',
      bio: 'Có thế mạnh về lập trình vi điều khiển, tối ưu cảm biến IoT và truyền nhận dữ liệu MQTT, đạt giải Nhất NCKH cấp trường.',
      topProject: 'Hệ thống IoT Giám sát Chất lượng Không khí & Cảnh báo Sớm',
      topProjectScore: 9.0,
      topProjectCode: 'PH-VER-3C8B12',
    },
    {
      id: 'c3',
      name: 'Lê Hoàng Cường',
      major: 'Khoa học Máy tính',
      university: 'ĐH Công Nghệ Thông Tin (UIT)',
      gpa: '3.65 / 4.0',
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Python', 'OpenCV', 'FastAPI'],
      verifiedProjectsCount: 3,
      matchScore: '89%',
      bio: 'Tập trung phát triển sản phẩm Web frontend hiện đại và tích hợp Computer Vision nhận diện khuôn mặt.',
      topProject: 'Ứng dụng Điểm danh Sinh viên qua Nhận diện Khuôn mặt AI',
      topProjectScore: 9.0,
      topProjectCode: 'PH-VER-4D9E21',
    },
  ];

  const filteredCandidates = candidates.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(term) ||
      c.major.toLowerCase().includes(term) ||
      c.university.toLowerCase().includes(term) ||
      c.skills.some((s) => s.toLowerCase().includes(term));
    const matchesVerified = verifiedOnly ? c.verifiedProjectsCount >= 3 : true;
    return matchesSearch && matchesVerified;
  });

  const handleSaveToPipeline = (candidate: Candidate) => {
    if (!savedCandidateIds.includes(candidate.id)) {
      setSavedCandidateIds([...savedCandidateIds, candidate.id]);
      alert(`Đã thêm ứng viên ${candidate.name} vào Quy trình tuyển dụng (Pipeline)!`);
    } else {
      alert(`Ứng viên ${candidate.name} đã có trong Pipeline của bạn.`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <Search className="w-7 h-7 text-indigo-400" />
            <span>Tìm Kiếm Ứng Viên Theo Bằng Chứng Học Thuật (Evidence-Based Search)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Lọc và xếp hạng ứng viên dựa trên đồ án thực tế đã qua thẩm định của Giảng viên đại học.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo kỹ năng (React, TypeScript, Redis, Kafka), trường đại học hoặc chuyên ngành..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
              verifiedOnly
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Chỉ ứng viên ≥ 3 Đồ án Verified</span>
          </button>
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        {filteredCandidates.map((cand) => (
          <div
            key={cand.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all shadow-md space-y-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Info */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-lg font-bold text-slate-100">{cand.name}</h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{cand.verifiedProjectsCount} Đồ án Verified</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-200 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    GPA: {cand.gpa}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                    Độ khớp JD: {cand.matchScore}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>
                    {cand.major} • <strong className="text-slate-300">{cand.university}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{cand.bio}</p>

                {/* Top Verified Project Highlight */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Đồ án tiêu biểu: {cand.topProject}</span>
                    </span>
                    <span className="text-emerald-300 font-mono font-bold">Điểm: {cand.topProjectScore}/10</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cand.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Action */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-3 shrink-0 lg:min-w-[180px] border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                <button
                  onClick={() => handleSaveToPipeline(cand)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Kanban className="w-4 h-4" />
                  <span>{savedCandidateIds.includes(cand.id) ? 'Đã trong Pipeline' : 'Lưu Vào Pipeline'}</span>
                </button>

                <a
                  href={`/verify/${cand.topProjectCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Xem Bảo Chứng</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterSearch;

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 py-12 border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/60">
          
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-blue-100" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                ProfileHub
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nền tảng kiến tạo thương hiệu nghề nghiệp dựa trên dự án thực chiến và kiểm chứng mã nguồn. 
              Chuẩn ATS 100%, không bịa đặt số liệu ảo.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Evidence-First Architecture</span>
            </div>
          </div>

          {/* Cột 2: Sản phẩm & Công cụ */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Sản Phẩm & Tính Năng
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/cv-management" className="hover:text-white transition">
                  Quản Lý CV Đa Phiên Bản
                </Link>
              </li>
              <li>
                <Link to="/cv-builder" className="hover:text-white transition">
                  Studio Biên Tập CV Canvas
                </Link>
              </li>
              <li>
                <Link to="/my-projects" className="hover:text-white transition">
                  Kho Dự Án & Bóc Tách GitHub
                </Link>
              </li>
              <li>
                <Link to="/interview-prep" className="hover:text-white transition">
                  Phòng Thủ Kỹ Thuật Trước Tech Lead
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Dành cho Sinh viên & Tuyển dụng */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Cơ Hội & Hướng Nghiệp
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/student/jobs" className="hover:text-white transition">
                  Cơ Hội Việc Làm IT
                </Link>
              </li>
              <li>
                <Link to="/portfolio-match" className="hover:text-white transition">
                  Đo Độ Khớp Đồ Án Với JD
                </Link>
              </li>
              <li>
                <Link to="/mbti" className="hover:text-white transition">
                  Trắc Nghiệm Nghề Nghiệp MBTI
                </Link>
              </li>
              <li>
                <Link to="/recruiter/dashboard" className="hover:text-white transition">
                  Cổng Thông Tin Nhà Tuyển Dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Cam kết & Mã nguồn */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Cam Kết Chuẩn ATS
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Mỗi bản CV xuất ra đều được khống chế vừa vặn 1 trang A4, tích hợp mã QR quét trực tiếp sản phẩm thật.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Github className="w-3.5 h-3.5 text-slate-400" />
              <span>GitHub Verified Commits</span>
            </div>
          </div>
        </div>

        {/* Thanh bản quyền */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ProfileHub. All rights reserved by Pham Thai Bao.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Xây dựng vì sự phát triển nghề nghiệp thực chiến của lập trình viên</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}

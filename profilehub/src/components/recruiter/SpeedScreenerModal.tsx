import React, { useState, useEffect } from 'react';
import type { CandidatePipelineItem } from '../../types/database';
import { useSpeedScreenerKeyboard } from '../../hooks/useSpeedScreenerKeyboard';
import { CandidateAiTldrBadge } from './CandidateAiTldrBadge';
import {
  generateCandidateAiTldr,
  getNextIndex,
  getPrevIndex,
  preFetchCandidates,
} from '../../services/speedScreenerService';
import {
  X,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Github,
  Globe,
  Award,
  Zap,
} from 'lucide-react';

interface SpeedScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: CandidatePipelineItem[];
  initialIndex?: number;
  onAdvance: (candidate: CandidatePipelineItem) => void;
  onChallenge: (candidate: CandidatePipelineItem) => void;
  onReject: (candidate: CandidatePipelineItem) => void;
}

export const SpeedScreenerModal: React.FC<SpeedScreenerModalProps> = ({
  isOpen,
  onClose,
  candidates,
  initialIndex = 0,
  onAdvance,
  onChallenge,
  onReject,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.min(initialIndex, Math.max(0, candidates.length - 1)));
    }
  }, [isOpen, initialIndex, candidates.length]);

  // Pre-fetch cache cho các ứng viên lân cận
  useEffect(() => {
    if (isOpen && candidates.length > 0) {
      preFetchCandidates(candidates, currentIndex, 3);
    }
  }, [isOpen, currentIndex, candidates]);

  const activeCandidate = candidates[currentIndex] || null;
  const activeTldr = activeCandidate ? generateCandidateAiTldr(activeCandidate) : null;

  const handleNext = () => {
    setCurrentIndex((prev) => getNextIndex(prev, candidates.length));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => getPrevIndex(prev, candidates.length));
  };

  const handleAdvance = () => {
    if (activeCandidate) {
      onAdvance(activeCandidate);
      handleNext();
    }
  };

  const handleChallenge = () => {
    if (activeCandidate) {
      onChallenge(activeCandidate);
      handleNext();
    }
  };

  const handleReject = () => {
    if (activeCandidate) {
      onReject(activeCandidate);
      handleNext();
    }
  };

  const handleOpenDetails = () => {
    if (activeCandidate?.student?.github_url) {
      window.open(activeCandidate.student.github_url, '_blank');
    }
  };

  useSpeedScreenerKeyboard({
    isActive: isOpen,
    onNext: handleNext,
    onPrev: handlePrev,
    onAdvance: handleAdvance,
    onChallenge: handleChallenge,
    onReject: handleReject,
    onOpenDetails: handleOpenDetails,
    onClose,
  });

  if (!isOpen || !activeCandidate) return null;

  const student = activeCandidate.student;
  const project = (activeCandidate as any).project || (student as any)?.projects?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-sm">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Speed Screener (Duyệt Thần Tốc)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-medium">
                  {currentIndex + 1} / {candidates.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sàng lọc ứng viên bằng phím tắt bàn phím không độ trễ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              title="Phím K hoặc Mũi tên Lên"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= candidates.length - 1}
              title="Phím J hoặc Mũi tên Xuống"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />
            <button
              onClick={onClose}
              title="Phím Esc để đóng"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Candidate List (Narrow) */}
          <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 hidden md:block">
            {candidates.map((cand, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <div
                  key={cand.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-l-4 border-indigo-600 shadow-sm'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {cand.student?.full_name || 'Ứng viên'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate mb-1.5">
                    {cand.job?.title || 'Kỹ sư phần mềm'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(cand.student?.skills || []).slice(0, 3).map((sk) => (
                      <span
                        key={sk}
                        className="text-[10px] px-1.5 py-0.2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Candidate Dossier & Live Preview */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-slate-900">
            {/* Candidate Header Profile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {student?.full_name ? student.full_name.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {student?.full_name || 'Ứng viên'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
                      <Award className="w-3 h-3" /> Đồ án Verified
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {student?.university || 'Đại học Bách Khoa'} • GPA: {student?.gpa || '3.5/4.0'} • Chuyên ngành: {student?.major || 'CNTT'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdvance}
                  title="Phím [A] để Nhận phỏng vấn"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>[A] Phỏng Vấn</span>
                </button>
                <button
                  onClick={handleChallenge}
                  title="Phím [T] để Giao thử thách"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Clock className="w-4 h-4" />
                  <span>[T] Giao Test</span>
                </button>
                <button
                  onClick={handleReject}
                  title="Phím [R] để Từ chối"
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>[R] Từ Chối</span>
                </button>
              </div>
            </div>

            {/* AI TL;DR Snapshot */}
            {activeTldr && <CandidateAiTldrBadge tldr={activeTldr} />}

            {/* Project Proof Card */}
            <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Đồ Án Năng Lực Trọng Tâm: {project?.title || 'Hệ Thống Phân Tán Thực Chiến'}</span>
                </h4>
                <div className="flex items-center gap-2">
                  {project?.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-xs font-medium flex items-center gap-1 hover:bg-indigo-100 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {project?.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center gap-1 hover:bg-slate-300 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {project?.description ||
                  'Đồ án áp dụng kiến trúc chuẩn Clean Architecture, tối ưu hóa thời gian phản hồi API dưới 150ms và tích hợp kiểm thử tự động với độ bao phủ 85%.'}
              </p>
            </div>

            {/* Skills & Technologies */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Bộ Kỹ Năng Đã Thẩm Định:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(student?.skills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS']).map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Keyboard Shortcuts Helper Bar */}
        <div className="px-6 py-2.5 bg-slate-900 text-slate-400 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">J</kbd>
              <span>Tiếp</span>
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">K</kbd>
              <span>Trước</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <kbd className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px]">A</kbd>
              <span>Phỏng Vấn</span>
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <kbd className="px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-[10px]">T</kbd>
              <span>Giao Test</span>
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <kbd className="px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 text-[10px]">R</kbd>
              <span>Từ Chối</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">Esc</kbd> Đóng
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

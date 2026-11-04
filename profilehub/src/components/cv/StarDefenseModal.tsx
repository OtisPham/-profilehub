import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Check,
  Copy,
  Download,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  Lightbulb,
  Wrench,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { starDefenseService } from '../../services/starDefenseService';
import type { StarDefenseItem } from '../../types/starDefense.types';

interface StarDefenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  bulletText: string;
  projectName?: string;
  projectId?: string;
  technologies?: string[];
}

export default function StarDefenseModal({
  isOpen,
  onClose,
  bulletText,
  projectName,
  projectId,
  technologies
}: StarDefenseModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'flashcard' | 'notes'>('details');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [candidateNote, setCandidateNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Phân tích câu bullet qua starDefenseService
  const defenseItem: StarDefenseItem = useMemo(() => {
    return starDefenseService.generateBulletDefense(bulletText, {
      projectId,
      projectName,
      technologies
    });
  }, [bulletText, projectId, projectName, technologies]);

  // Đồng bộ ghi chú cá nhân khi mở modal
  useEffect(() => {
    if (defenseItem?.candidateNotes) {
      setCandidateNote(defenseItem.candidateNotes);
    } else {
      setCandidateNote('');
    }
    setFlashcardIndex(0);
    setIsFlipped(false);
    setIsSaved(false);
  }, [defenseItem]);

  if (!isOpen) return null;

  const handleCopyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSaveNotes = () => {
    starDefenseService.saveCandidateDefenseNote(defenseItem.id, candidateNote);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportMarkdown = () => {
    const md = starDefenseService.exportDefenseCheatSheetMarkdown([
      { ...defenseItem, candidateNotes: candidateNote }
    ], projectName ? `Phao Cứu Sinh: ${projectName}` : undefined);

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phao_cuu_sinh_${defenseItem.id.slice(0, 15)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentFlashcard = defenseItem.trapQuestions[flashcardIndex] || defenseItem.trapQuestions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-transparent dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Phao Cứu Sinh Phỏng Vấn (STAR Defense)
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  Anti-Imposter
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {projectName ? `Đồ án: ${projectName}` : 'Giải trình số liệu & kịch bản 30s trước Tech Lead'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              title="Xuất file Markdown"
              className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-xs flex items-center gap-1 font-medium"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Xuất MD</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ORIGINAL BULLET QUOTE */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
          <div className="text-blue-600 dark:text-blue-400 mt-0.5">
            <MessageSquare className="w-4 h-4 shrink-0" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Câu chữ đang bảo vệ:
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 italic line-clamp-2">
              "{bulletText}"
            </p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="px-5 pt-2 border-b border-slate-200 dark:border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Cơ Sở Số Liệu & Bẫy Kỹ Thuật
          </button>
          <button
            onClick={() => setActiveTab('flashcard')}
            className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'flashcard'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Lật Thẻ Ôn Luyện ({defenseItem.trapQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'notes'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Ghi Chú Cá Nhân
            {candidateNote && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-700 dark:text-slate-300 text-xs">
          
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              
              {/* 1. CẢNH BÁO TỪ KHÓA RỦI RO (NẾU CÓ) */}
              {defenseItem.redFlags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    Cảnh Báo Từ Ngữ Nhạy Cảm Dễ Bị Bắt Bẻ ({defenseItem.redFlags.length})
                  </div>
                  <div className="space-y-2">
                    {defenseItem.redFlags.map((rf, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          rf.riskLevel === 'high'
                            ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                            : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                              {rf.riskLevel}
                            </span>
                            Từ nhạy cảm: "{rf.term}"
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                          <strong>Lý do bị vặn:</strong> {rf.reason}
                        </p>
                        <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium text-[11px]">
                            💡 <strong>Gợi ý thay thế an toàn:</strong> "{rf.suggestedReplacement}"
                          </span>
                          <button
                            onClick={() => handleCopyText(rf.suggestedReplacement, `replace_${idx}`)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-600 transition shrink-0"
                            title="Sao chép cụm từ an toàn"
                          >
                            {copiedSection === `replace_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. CƠ SỞ SỐ LIỆU & CÔNG CỤ ĐO ĐẠC */}
              {defenseItem.metricBasis && (
                <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-slate-800/60 dark:to-slate-800/30 p-4 rounded-xl border border-blue-100 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs uppercase tracking-wider">
                      <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Cơ Sở Số Liệu & Công Cụ Đo Đạc
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                      {defenseItem.metricBasis.metricText}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        1. Công Cụ Kiểm Chứng:
                      </span>
                      <p className="font-semibold text-blue-700 dark:text-blue-300 text-xs">
                        {defenseItem.metricBasis.measurementTool}
                      </p>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        2. Trước & Sau Tối Ưu:
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 text-xs">
                        <strong>Before:</strong> {defenseItem.metricBasis.beforeMetric}
                      </p>
                      <p className="text-emerald-700 dark:text-emerald-400 text-xs font-medium mt-1">
                        <strong>After:</strong> {defenseItem.metricBasis.afterMetric}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      3. Kịch Bản Tái Hiện (Live-Demo / Giải Thích):
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 text-xs whitespace-pre-line leading-relaxed">
                      {defenseItem.metricBasis.reproductionMethod}
                    </p>
                  </div>
                </div>
              )}

              {/* 3. TOP CÂU HỎI BẪY & KỊCH BẢN TRẢ LỜI MẪU 30S */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Top Câu Hỏi Bẫy & Kịch Bản Trả Lời 30 Giây ({defenseItem.trapQuestions.length})
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Sát sườn vòng phỏng vấn Tech Lead
                  </span>
                </div>

                <div className="space-y-3">
                  {defenseItem.trapQuestions.map((tq, qIdx) => (
                    <div
                      key={tq.id || qIdx}
                      className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            Q{qIdx + 1}
                          </span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            "{tq.question}"
                          </h4>
                        </div>
                        <button
                          onClick={() => handleCopyText(tq.modelAnswer, `answer_${qIdx}`)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 text-[10px] font-semibold flex items-center gap-1 transition shrink-0"
                          title="Sao chép kịch bản trả lời"
                        >
                          {copiedSection === `answer_${qIdx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Đã sao chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy 30s</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 text-[11px]">
                        <strong>🎯 Ý đồ của Tech Lead:</strong> {tq.interviewerIntent}
                      </div>

                      <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 block">
                          🎙️ Kịch Bản Trả Lời Mẫu 30 Giây (Khiêm Tốn & Chuẩn Kỹ Thuật):
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 text-xs italic leading-relaxed">
                          "{tq.modelAnswer}"
                        </p>
                      </div>

                      <div className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-medium">
                        <span>❌</span>
                        <span><strong>Sai lầm cần tránh:</strong> {tq.pitfallToAvoid}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FLASHCARD REHEARSAL */}
          {activeTab === 'flashcard' && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Phòng Luyện Phản Xạ Phỏng Vấn (Flashcards)
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tập dượt phản xạ nhẩm câu trả lời trước khi bước vào phòng phỏng vấn
                </p>
              </div>

              {/* FLASHCARD CONTAINER */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`cursor-pointer min-h-[220px] rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between shadow-md select-none ${
                  isFlipped
                    ? 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-slate-800 border-indigo-300 dark:border-indigo-700'
                    : 'bg-white dark:bg-slate-800 hover:border-blue-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-3">
                    <span className="font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Thẻ {flashcardIndex + 1} / {defenseItem.trapQuestions.length}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                      <RotateCw className="w-3 h-3" />
                      {isFlipped ? 'Mặt sau (Kịch bản 30s)' : 'Mặt trước (Câu hỏi bẫy)'}
                    </span>
                  </div>

                  {!isFlipped ? (
                    <div className="space-y-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                        Tech Lead Hỏi Xoáy:
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                        "{currentFlashcard?.question}"
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
                        🎯 <em>Họ đang muốn xem:</em> {currentFlashcard?.interviewerIntent}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        Kịch Bản Trả Lời Chuẩn 30s:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed italic">
                        "{currentFlashcard?.modelAnswer}"
                      </p>
                      <div className="pt-2 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                        ❌ <em>Đừng bao giờ nói:</em> {currentFlashcard?.pitfallToAvoid}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 text-center">
                  <span className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition underline">
                    Bấm vào thẻ để lật mặt
                  </span>
                </div>
              </div>

              {/* CARD CONTROLS */}
              <div className="flex items-center justify-between px-2">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setFlashcardIndex(prev => (prev > 0 ? prev - 1 : defenseItem.trapQuestions.length - 1));
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Câu trước
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Lật thẻ
                </button>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setFlashcardIndex(prev => (prev < defenseItem.trapQuestions.length - 1 ? prev + 1 : 0));
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center gap-1 transition"
                >
                  Câu tiếp
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: NOTES & EXPORT */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Ghi Chú Phản Biện Riêng Của Bạn (Tự Lưu Cục Bộ)
                  </label>
                  {isSaved && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 animate-in fade-in">
                      <Check className="w-3.5 h-3.5" />
                      Đã lưu an toàn!
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ghi lại thông số cấu hình máy tính cá nhân, phiên bản phần mềm hoặc các edge-case mà bạn đã gặp trong đồ án này để dễ đối chiếu.
                </p>
                <textarea
                  value={candidateNote}
                  onChange={e => setCandidateNote(e.target.value)}
                  placeholder="Ví dụ: Đo trên MacBook Air M1, test với 20 tab Chrome mở đồng thời, dữ liệu seed gồm 5.000 sản phẩm mẫu..."
                  rows={5}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Lưu Ghi Chú
                  </button>
                </div>
              </div>

              {/* PREVIEW MARKDOWN EXPORT */}
              <div className="p-4 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    Xuất Bản Phao Cứu Sinh Đầy Đủ
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const md = starDefenseService.exportDefenseCheatSheetMarkdown([
                          { ...defenseItem, candidateNotes: candidateNote }
                        ]);
                        handleCopyText(md, 'full_md');
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      {copiedSection === 'full_md' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã copy MD</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép Markdown</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleExportMarkdown}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Tải Tệp .md
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Dán nhanh vào ứng dụng Notion, Obsidian hoặc xem trực tiếp trên điện thoại để ôn tập trước giờ phỏng vấn.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span>ProfileHub Anti-Imposter Defense Engine</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}

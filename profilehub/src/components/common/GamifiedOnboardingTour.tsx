import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  ArrowRight,
  X,
  CheckCircle2,
  Zap,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface TourStep {
  id: string;
  targetId: string;
  questTitle: string;
  stepNumber: number;
  xpReward: number;
  badge: string;
  description: string;
  hint: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'step-github',
    targetId: 'tour-github-import',
    questTitle: 'Nhiệm Vụ 1: Triệu Hồi Bằng Chứng Mã Nguồn',
    stepNumber: 1,
    xpReward: 100,
    badge: '📦 GITHUB HARVESTER',
    description: 'Dán link GitHub repo của bạn (ví dụ: github.com/username/project) vào thanh này. Hệ thống sẽ tự động bóc tách Tech-Stack và các commit cá nhân để tự sinh mô tả dự án.',
    hint: 'Mẹo: Dán thêm nội dung JD để AI tự động đối soát từ khóa!'
  },
  {
    id: 'step-template',
    targetId: 'tour-template-selector',
    questTitle: 'Nhiệm Vụ 2: Chọn Chiến Giáp (Mẫu CV Chuẩn ATS)',
    stepNumber: 2,
    xpReward: 100,
    badge: '🎨 ATS ARMOR',
    description: 'Bấm vào menu này để chọn giữa các mẫu CV chuyên nghiệp: ATS Clean Pro (1 trang A4 tối ưu), Tech Specialist (2 cột chuyên sâu IT), hoặc Harvard Minimalist.',
    hint: 'Mẹo: Bạn có thể đổi màu thương hiệu và font chữ ở thanh bên cạnh!'
  },
  {
    id: 'step-export',
    targetId: 'tour-export-pdf',
    questTitle: 'Nhiệm Vụ 3: Xuất Trận (In & Tải File PDF)',
    stepNumber: 3,
    xpReward: 100,
    badge: '🏆 PDF MASTER',
    description: 'Xem trước trang in A4 và bấm nút "Xuất PDF". Bản CV được tối ưu kích thước trang in 100% không bị tràn dòng hay vỡ trang.',
    hint: 'Phím tắt nhanh: Bạn cũng có thể bấm Ctrl + P bất cứ lúc nào!'
  }
];

export default function GamifiedOnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [xp, setXp] = useState(0);

  // Check initial state
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('profilehub_gamified_tour_v1');
    if (!hasSeenTour) {
      // Small timeout so DOM has mounted and rendered
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsCompleted(true);
      setXp(300);
    }
  }, []);

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Highlight target element on step change
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const el = document.getElementById(currentStep.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-indigo-500', 'ring-offset-4', 'transition-all', 'duration-300');
    }

    return () => {
      if (el) {
        el.classList.remove('ring-4', 'ring-indigo-500', 'ring-offset-4');
      }
    };
  }, [isOpen, currentStepIndex, isCompleted, currentStep]);

  const handleNextStep = () => {
    setXp(prev => prev + currentStep.xpReward);

    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Completed all
      setIsCompleted(true);
      setShowCelebration(true);
      localStorage.setItem('profilehub_gamified_tour_v1', 'completed');
    }
  };

  const handleSkipTour = () => {
    setIsOpen(false);
    localStorage.setItem('profilehub_gamified_tour_v1', 'skipped');
  };

  const handleRestartTour = () => {
    localStorage.removeItem('profilehub_gamified_tour_v1');
    setCurrentStepIndex(0);
    setXp(0);
    setIsCompleted(false);
    setShowCelebration(false);
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Minimized Quest Pill (When closed or active) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-slate-900 hover:bg-black text-white px-3.5 py-2.5 rounded-full shadow-2xl border border-indigo-500/40 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer text-xs font-bold"
        >
          <Gamepad2 className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>🎮 Hướng Dẫn Tân Thủ ({isCompleted ? '3/3 ✓' : `${currentStepIndex + 1}/3`})</span>
        </button>
      )}

      {/* Main Quest Modal / Spotlight Tooltip */}
      {isOpen && !showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-center justify-center p-4 bg-slate-950/40 backdrop-blur-[2px] transition-all">
          <div className="pointer-events-auto bg-slate-900 border border-indigo-500/50 text-white rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Quest Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-400 tracking-wider uppercase">
                    {currentStep.badge}
                  </span>
                  <h4 className="text-xs font-bold text-slate-200">
                    Bước {currentStep.stepNumber}/3: {currentStep.questTitle}
                  </h4>
                </div>
              </div>

              <button
                onClick={handleSkipTour}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                title="Bỏ qua hướng dẫn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* XP & Progress Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                <span>Điểm Năng Lực (XP)</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> +{currentStep.xpReward} XP sau bước này
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Quest Body */}
            <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60 space-y-2">
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentStep.description}
              </p>
              <div className="text-[11px] text-amber-300/90 font-medium bg-amber-950/40 border border-amber-800/40 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>{currentStep.hint}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleSkipTour}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
              >
                Bỏ qua
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Hoàn Thành Nhiệm Vụ' : 'Tiếp Theo'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Celebration Level-Up Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/50 text-white rounded-3xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-90 duration-300">
            
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20 animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                LEVEL UP! ĐẠT CẤP 2
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Tân Thủ Xuất Sắc! 🎉
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Bạn đã nắm trọn vẹn bí kíp tạo CV bằng chứng code từ GitHub. Bây giờ hãy bắt đầu may đo và xuất bản CV đỉnh nhất của bạn!
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center justify-around text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">TỔNG ĐIỂM</div>
                <div className="text-amber-400 font-bold text-sm">+300 XP</div>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <div className="text-slate-400 text-[10px]">DANH HIỆU</div>
                <div className="text-emerald-400 font-bold text-sm">ATS Ready 🛡️</div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowCelebration(false);
                setIsOpen(false);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer"
            >
              Bắt Đầu Trải Nghiệm Ngay 🚀
            </button>

            <button
              onClick={handleRestartTour}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 mx-auto transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xem lại hướng dẫn</span>
            </button>

          </div>
        </div>
      )}
    </>
  );
}

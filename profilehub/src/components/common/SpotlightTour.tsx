import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X, CheckCircle2, Gamepad2 } from 'lucide-react';

export interface SpotlightStep {
  targetId: string;
  title: string;
  description: string;
  badge?: string;
  actionText?: string;
  onAction?: () => void;
  placement?: 'bottom' | 'top' | 'auto';
}

export interface SpotlightTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  steps: SpotlightStep[];
  storageKey?: string;
}

interface TargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
}

export const SpotlightTour: React.FC<SpotlightTourProps> = ({
  isOpen,
  onClose,
  onComplete,
  steps,
  storageKey = 'profilehub_spotlight_tour_completed_v1'
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top?: number; bottom?: number; left: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStepIndex];

  // Hàm tính toán vị trí đích
  const updateTargetPosition = useCallback(() => {
    if (!step) return;

    const el = document.getElementById(step.targetId);
    if (!el) {
      // Nếu không tìm thấy element đích, mặc định đặt giữa màn hình
      setTargetRect(null);
      setTooltipPos({
        top: Math.max(80, window.innerHeight / 2 - 150),
        left: Math.max(16, window.innerWidth / 2 - 200)
      });
      return;
    }

    // Cuộn mượt phần tử vào tầm mắt nếu nó nằm ngoài màn hình
    const rect = el.getBoundingClientRect();
    const isOutOfView = rect.top < 70 || rect.bottom > window.innerHeight - 70;
    if (isOutOfView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }

    // Lấy toạ độ chính xác sau khi scroll
    const freshRect = el.getBoundingClientRect();
    const padding = 8;
    const computedRect: TargetRect = {
      x: Math.max(0, freshRect.left - padding),
      y: Math.max(0, freshRect.top - padding),
      width: freshRect.width + padding * 2,
      height: freshRect.height + padding * 2,
      rx: 16
    };
    setTargetRect(computedRect);

    // Tính toán vị trí của Quest Card Tooltip
    const cardWidth = Math.min(420, window.innerWidth - 32);
    const cardHeight = 220; // ước lượng chiều cao

    // Tính toạ độ X (căn giữa theo phần tử, giữ trong màn hình)
    const targetCenterX = freshRect.left + freshRect.width / 2;
    let left = targetCenterX - cardWidth / 2;
    if (left < 16) left = 16;
    if (left + cardWidth > window.innerWidth - 16) {
      left = window.innerWidth - cardWidth - 16;
    }

    // Tính toạ độ Y (ưu tiên đặt dưới, nếu không đủ chỗ thì đặt trên)
    const spaceBelow = window.innerHeight - (computedRect.y + computedRect.height);
    const spaceAbove = computedRect.y;

    if (spaceBelow >= cardHeight + 24 || spaceBelow >= spaceAbove) {
      setTooltipPos({
        top: computedRect.y + computedRect.height + 16,
        left
      });
    } else {
      setTooltipPos({
        bottom: window.innerHeight - computedRect.y + 16,
        left
      });
    }
  }, [step]);

  // Cập nhật vị trí khi đổi bước hoặc resize/scroll
  useEffect(() => {
    if (!isOpen) return;

    // Chờ 1 chút để DOM ổn định sau khi cuộn
    const timer = setTimeout(() => {
      updateTargetPosition();
    }, 100);

    const handleScrollOrResize = () => {
      window.requestAnimationFrame(updateTargetPosition);
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, currentStepIndex, updateTargetPosition]);

  // Điều khiển phím tắt bàn phím
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, steps.length]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, 'true');
      } catch (err) {
        console.warn('Cannot write to localStorage:', err);
      }
    }
    onComplete();
  };

  const handleDismiss = () => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, 'true');
      } catch (err) {
        console.warn('Cannot write to localStorage:', err);
      }
    }
    onClose();
  };

  if (!isOpen || !step) return null;

  return (
    <div className="fixed inset-0 z-[9990] overflow-hidden select-none">
      {/* 1. SVG Cutout Mask - Phủ tối toàn màn hình nhưng rọi sáng phần tử đích */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none transition-all duration-300">
        <defs>
          <mask id="game-spotlight-mask">
            {/* Lớp nền trắng = giữ lại lớp tối */}
            <rect width="100%" height="100%" fill="white" />
            {/* Vùng khoét đen = trong suốt rọi đèn sáng */}
            {targetRect && (
              <rect
                x={targetRect.x}
                y={targetRect.y}
                width={targetRect.width}
                height={targetRect.height}
                rx={targetRect.rx}
                fill="black"
                className="transition-all duration-300 ease-out"
              />
            )}
          </mask>
        </defs>
        {/* Phủ màn tối game (85% opacity) kèm mask khoét lỗ */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(5, 8, 16, 0.82)"
          mask="url(#game-spotlight-mask)"
          className="pointer-events-auto"
          onClick={handleDismiss}
        />
      </svg>

      {/* 2. Vành đai hào quang Game Neon Pulsing Ring */}
      {targetRect && (
        <div
          style={{
            top: targetRect.y,
            left: targetRect.x,
            width: targetRect.width,
            height: targetRect.height,
            borderRadius: targetRect.rx
          }}
          className="fixed z-[9992] pointer-events-none border-2 border-cyan-400 dark:border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.85),inset_0_0_15px_rgba(6,182,212,0.3)] animate-pulse transition-all duration-300 ease-out"
        >
          {/* 4 Reticle góc nhắm mục tiêu chuẩn giao diện game */}
          <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400 rounded-tl-sm shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
          <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400 rounded-tr-sm shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400 rounded-bl-sm shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400 rounded-br-sm shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
        </div>
      )}

      {/* 3. Quest Dialogue Tooltip Card */}
      {tooltipPos && (
        <div
          ref={cardRef}
          style={{
            top: tooltipPos.top !== undefined ? `${tooltipPos.top}px` : undefined,
            bottom: tooltipPos.bottom !== undefined ? `${tooltipPos.bottom}px` : undefined,
            left: `${tooltipPos.left}px`,
            maxWidth: 'min(420px, calc(100vw - 32px))'
          }}
          className="fixed z-[9995] w-full bg-[#0c101c]/95 dark:bg-[#0c101c]/95 border-2 border-indigo-500/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(99,102,241,0.25)] rounded-2xl p-5 text-white backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header Card: Quest badge & Close */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/40">
                <Gamepad2 size={13} className="text-amber-400" />
                <span>{step.badge || `Nhiệm Vụ ${currentStepIndex + 1}/${steps.length}`}</span>
              </span>
            </div>

            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition flex items-center justify-center cursor-pointer"
              title="Bỏ qua hướng dẫn (Esc)"
            >
              <X size={15} />
            </button>
          </div>

          {/* Title & Description */}
          <div className="space-y-2 mb-5">
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles size={18} className="text-cyan-400 shrink-0 animate-spin-slow" />
              <span>{step.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Action Trigger Button nếu có */}
          {step.actionText && step.onAction && (
            <div className="mb-4">
              <button
                onClick={() => {
                  step.onAction?.();
                  handleNext();
                }}
                className="w-full py-2 px-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/40 text-cyan-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
              >
                <span>{step.actionText}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Stepper Dots & Navigation Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {/* Step Progress Indicators */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'w-6 bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                      : idx < currentStepIndex
                      ? 'w-2 bg-emerald-400/70'
                      : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`Bước ${idx + 1}`}
                />
              ))}
            </div>

            {/* Actions: Prev / Next */}
            <div className="flex items-center gap-2">
              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Quay lại</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 ${
                  currentStepIndex === steps.length - 1
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-950/50'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-950/50'
                }`}
              >
                {currentStepIndex === steps.length - 1 ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Hoàn Thành 🚀</span>
                  </>
                ) : (
                  <>
                    <span>Tiếp tục</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotlightTour;

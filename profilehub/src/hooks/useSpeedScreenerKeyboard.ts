import { useEffect, useCallback } from 'react';

export interface UseSpeedScreenerKeyboardOptions {
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  onAdvance: () => void;
  onChallenge: () => void;
  onReject: () => void;
  onOpenDetails?: () => void;
  onClose: () => void;
}

export const useSpeedScreenerKeyboard = ({
  isActive,
  onNext,
  onPrev,
  onAdvance,
  onChallenge,
  onReject,
  onOpenDetails,
  onClose,
}: UseSpeedScreenerKeyboardOptions): void => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive) return;

      // Không can thiệp nếu người dùng đang nhập liệu trong input, textarea hoặc contenteditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'j':
        case 'arrowdown':
          e.preventDefault();
          onNext();
          break;
        case 'k':
        case 'arrowup':
          e.preventDefault();
          onPrev();
          break;
        case 'a':
          e.preventDefault();
          onAdvance();
          break;
        case 't':
          e.preventDefault();
          onChallenge();
          break;
        case 'r':
          e.preventDefault();
          onReject();
          break;
        case 'o':
          if (onOpenDetails) {
            e.preventDefault();
            onOpenDetails();
          }
          break;
        case 'escape':
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    },
    [isActive, onNext, onPrev, onAdvance, onChallenge, onReject, onOpenDetails, onClose]
  );

  useEffect(() => {
    if (!isActive) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, handleKeyDown]);
};

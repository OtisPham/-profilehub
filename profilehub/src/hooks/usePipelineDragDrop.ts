import { useState, useCallback } from 'react';
import type { PipelineStage } from '../types/database';
import { canDropInStage } from '../utils/pipelineDragDrop';

export interface UsePipelineDragDropOptions {
  onDropItem?: (itemId: string, targetStage: PipelineStage) => void;
}

export function usePipelineDragDrop(options?: UsePipelineDragDropOptions) {
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [sourceStage, setSourceStage] = useState<PipelineStage | null>(null);
  const [hoveredStage, setHoveredStage] = useState<PipelineStage | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string, stage: PipelineStage) => {
    setDraggingItemId(itemId);
    setSourceStage(stage);

    try {
      e.dataTransfer.setData('application/json', JSON.stringify({ itemId, sourceStage: stage }));
      e.dataTransfer.effectAllowed = 'move';
    } catch {
      // Fallback cho môi trường test không có dataTransfer đầy đủ
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    try {
      e.dataTransfer.dropEffect = 'move';
    } catch {
      // Fallback
    }

    setHoveredStage((prev) => (prev !== stage ? stage : prev));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, stage: PipelineStage) => {
    // Chỉ reset khi rời khỏi chính vùng của stage này
    setHoveredStage((prev) => (prev === stage ? null : prev));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetStage: PipelineStage) => {
      e.preventDefault();
      setHoveredStage(null);

      let targetItemId = draggingItemId;
      let targetSourceStage = sourceStage;

      // Đọc từ dataTransfer nếu state bị mất trong luồng phức tạp
      try {
        const raw = e.dataTransfer.getData('application/json');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.itemId) targetItemId = parsed.itemId;
          if (parsed.sourceStage) targetSourceStage = parsed.sourceStage;
        }
      } catch {
        // Fallback dùng state
      }

      if (targetItemId && canDropInStage(targetSourceStage, targetStage)) {
        options?.onDropItem?.(targetItemId, targetStage);
      }

      setDraggingItemId(null);
      setSourceStage(null);
    },
    [draggingItemId, sourceStage, options]
  );

  const handleDragEnd = useCallback(() => {
    setDraggingItemId(null);
    setSourceStage(null);
    setHoveredStage(null);
  }, []);

  const isDragging = useCallback(
    (itemId: string) => draggingItemId === itemId,
    [draggingItemId]
  );

  const isColumnHovered = useCallback(
    (stage: PipelineStage) => hoveredStage === stage && canDropInStage(sourceStage, stage),
    [hoveredStage, sourceStage]
  );

  return {
    draggingItemId,
    sourceStage,
    hoveredStage,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    isDragging,
    isColumnHovered,
  };
}

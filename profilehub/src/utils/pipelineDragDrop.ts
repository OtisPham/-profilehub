import type { PipelineStage, CandidatePipelineItem } from '../types/database';

export interface DragItemPayload {
  itemId: string;
  sourceStage: PipelineStage;
}

export interface DragDropState {
  draggingItemId: string | null;
  sourceStage: PipelineStage | null;
  hoveredStage: PipelineStage | null;
}

export const INITIAL_DRAG_STATE: DragDropState = {
  draggingItemId: null,
  sourceStage: null,
  hoveredStage: null,
};

/**
 * Kiểm tra xem có thể thả thẻ từ stage nguồn vào stage đích hay không
 */
export function canDropInStage(sourceStage: PipelineStage | null, targetStage: PipelineStage): boolean {
  if (!sourceStage) return false;
  return sourceStage !== targetStage;
}

/**
 * Cập nhật stage của ứng viên trong danh sách pipeline (hàm thuần khiết - Pure Function)
 */
export function moveItemStage(
  items: CandidatePipelineItem[],
  itemId: string,
  targetStage: PipelineStage
): CandidatePipelineItem[] {
  return items.map((item) => {
    if (item.id === itemId) {
      return {
        ...item,
        stage: targetStage,
        updated_at: new Date().toISOString(),
      };
    }
    return item;
  });
}

/**
 * Tạo bản cập nhật lạc quan (Optimistic Update) và lưu vết stage ban đầu để rollback khi lỗi
 */
export function createOptimisticPipelineUpdate(
  items: CandidatePipelineItem[],
  itemId: string,
  targetStage: PipelineStage
): {
  updatedItems: CandidatePipelineItem[];
  previousStage: PipelineStage | null;
  item: CandidatePipelineItem | null;
} {
  const currentItem = items.find((i) => i.id === itemId);
  if (!currentItem) {
    return { updatedItems: items, previousStage: null, item: null };
  }

  const previousStage = currentItem.stage;
  const updatedItems = moveItemStage(items, itemId, targetStage);

  return {
    updatedItems,
    previousStage,
    item: currentItem,
  };
}

/**
 * Khôi phục trạng thái cũ (Rollback) nếu tác vụ đồng bộ Cloud thất bại
 */
export function rollbackPipelineUpdate(
  items: CandidatePipelineItem[],
  itemId: string,
  previousStage: PipelineStage
): CandidatePipelineItem[] {
  return items.map((item) => {
    if (item.id === itemId) {
      return {
        ...item,
        stage: previousStage,
      };
    }
    return item;
  });
}

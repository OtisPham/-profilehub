import { describe, it, expect } from 'vitest';
import {
  canDropInStage,
  moveItemStage,
  createOptimisticPipelineUpdate,
  rollbackPipelineUpdate,
} from './pipelineDragDrop';
import type { CandidatePipelineItem } from '../types/database';

describe('Tầng Logic Kéo Thả Pipeline (pipelineDragDrop utility)', () => {
  const mockItems: CandidatePipelineItem[] = [
    {
      id: 'pipe_1',
      recruiter_id: 'rec_alpaca',
      student_id: 'stu_01',
      stage: 'discovered',
      private_notes: 'Ứng viên tiềm năng',
      created_at: '2026-11-01T08:00:00Z',
    },
    {
      id: 'pipe_2',
      recruiter_id: 'rec_alpaca',
      student_id: 'stu_02',
      stage: 'contacted',
      created_at: '2026-11-02T09:00:00Z',
    },
  ];

  it('TC-DND-01: canDropInStage cho phép thả khi stage đích khác stage nguồn', () => {
    expect(canDropInStage('discovered', 'shortlisted')).toBe(true);
    expect(canDropInStage('shortlisted', 'interview')).toBe(true);
    expect(canDropInStage('interview', 'hired')).toBe(true);
  });

  it('TC-DND-02: canDropInStage từ chối khi thả vào cùng stage hoặc sourceStage rỗng', () => {
    expect(canDropInStage('discovered', 'discovered')).toBe(false);
    expect(canDropInStage('interview', 'interview')).toBe(false);
    expect(canDropInStage(null, 'shortlisted')).toBe(false);
  });

  it('TC-DND-03: moveItemStage cập nhật chính xác stage và gán updated_at mới', () => {
    const result = moveItemStage(mockItems, 'pipe_1', 'interview');
    const updated = result.find((i) => i.id === 'pipe_1');
    const untouched = result.find((i) => i.id === 'pipe_2');

    expect(updated?.stage).toBe('interview');
    expect(updated?.updated_at).toBeDefined();
    expect(untouched?.stage).toBe('contacted');
  });

  it('TC-DND-04: createOptimisticPipelineUpdate lưu vết previousStage chính xác', () => {
    const { updatedItems, previousStage, item } = createOptimisticPipelineUpdate(
      mockItems,
      'pipe_1',
      'hired'
    );

    expect(previousStage).toBe('discovered');
    expect(item?.id).toBe('pipe_1');
    expect(updatedItems.find((i) => i.id === 'pipe_1')?.stage).toBe('hired');
  });

  it('TC-DND-05: rollbackPipelineUpdate khôi phục stage ban đầu an toàn khi gặp lỗi', () => {
    const { updatedItems, previousStage } = createOptimisticPipelineUpdate(
      mockItems,
      'pipe_1',
      'hired'
    );
    expect(updatedItems.find((i) => i.id === 'pipe_1')?.stage).toBe('hired');

    // Tiến hành Rollback
    const rolledBack = rollbackPipelineUpdate(updatedItems, 'pipe_1', previousStage!);
    expect(rolledBack.find((i) => i.id === 'pipe_1')?.stage).toBe('discovered');
  });
});

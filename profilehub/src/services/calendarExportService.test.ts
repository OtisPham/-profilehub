import { describe, it, expect, vi } from 'vitest';
import {
  formatToCompactUtc,
  generateGoogleCalendarUrl,
  generateIcsContent,
  downloadIcsFile,
  createSlotExportPayload,
} from './calendarExportService';
import type { InterviewSlot } from '../types/database';

describe('Dịch Vụ Đồng Bộ Lịch Đa Nền Tảng (calendarExportService)', () => {
  const samplePayload = {
    title: '[Phỏng Vấn] Frontend Developer - FPT Software',
    description: 'Phỏng vấn kỹ thuật ReactJS và TypeScript.\nLink họp: https://meet.google.com/abc-xyz',
    location: 'https://meet.google.com/abc-xyz',
    startTime: '2026-11-20T09:00:00.000Z',
    endTime: '2026-11-20T10:00:00.000Z',
  };

  it('TC-CAL-01: formatToCompactUtc định dạng chính xác chuỗi Compact UTC không có dấu gạch', () => {
    const compact = formatToCompactUtc('2026-11-20T09:00:00.000Z');
    expect(compact).toBe('20261120T090000Z');
  });

  it('TC-CAL-02: generateGoogleCalendarUrl sinh URL Google Calendar hợp lệ chứa đầy đủ tham số', () => {
    const url = generateGoogleCalendarUrl(samplePayload);
    expect(url).toContain('https://calendar.google.com/calendar/render');
    expect(url).toContain('action=TEMPLATE');
    expect(url).toContain('dates=20261120T090000Z%2F20261120T100000Z');
    expect(url).toContain('Frontend+Developer');
    expect(url).toContain('https%3A%2F%2Fmeet.google.com%2Fabc-xyz');
  });

  it('TC-CAL-03: generateIcsContent sinh chuỗi VCALENDAR chuẩn RFC 5545 có nhắc hẹn VALARM', () => {
    const ics = generateIcsContent(samplePayload);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('DTSTART:20261120T090000Z');
    expect(ics).toContain('DTEND:20261120T100000Z');
    expect(ics).toContain('SUMMARY:[Phỏng Vấn] Frontend Developer - FPT Software');
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('TRIGGER:-PT30M');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('TC-CAL-04: createSlotExportPayload trích xuất đúng payload từ InterviewSlot', () => {
    const mockSlot: InterviewSlot = {
      id: 'slot_1',
      candidatePipelineId: 'pipe_1',
      startTime: '2026-11-20T14:00:00.000Z',
      endTime: '2026-11-20T15:00:00.000Z',
      status: 'available',
      meetUrl: 'https://meet.google.com/test-room',
    };

    const payload = createSlotExportPayload(mockSlot, 'Backend Node.js', 'VNG Corp', 'Nguyễn Văn A');
    expect(payload.title).toBe('[Phỏng Vấn ProfileHub] Backend Node.js - VNG Corp');
    expect(payload.location).toBe('https://meet.google.com/test-room');
    expect(payload.startTime).toBe(mockSlot.startTime);
    expect(payload.endTime).toBe(mockSlot.endTime);
  });

  it('TC-CAL-05: downloadIcsFile xử lý an toàn khi chạy trong môi trường node hoặc có mock DOM', () => {
    // Trường hợp không có window/document: không ném lỗi
    expect(() => downloadIcsFile(samplePayload, 'phong-van.ics')).not.toThrow();

    // Trường hợp có DOM:
    const clickSpy = vi.fn();
    const appendSpy = vi.fn();
    const removeSpy = vi.fn();
    const mockAnchor = {
      href: '',
      setAttribute: vi.fn(),
      click: clickSpy,
    };

    (globalThis as any).window = {
      URL: {
        createObjectURL: vi.fn(() => 'blob:mock-url'),
        revokeObjectURL: vi.fn(),
      },
    };
    (globalThis as any).document = {
      createElement: vi.fn(() => mockAnchor),
      body: {
        appendChild: appendSpy,
        removeChild: removeSpy,
      },
    };

    downloadIcsFile(samplePayload, 'phong-van.ics');

    expect(clickSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalledWith(mockAnchor);
    expect(removeSpy).toHaveBeenCalledWith(mockAnchor);

    delete (globalThis as any).window;
    delete (globalThis as any).document;
  });
});

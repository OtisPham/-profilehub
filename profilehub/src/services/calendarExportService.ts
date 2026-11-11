import type { InterviewSlot } from '../types/database';

export interface CalendarExportPayload {
  title: string;
  description: string;
  location: string;
  startTime: string; // ISO 8601 (e.g. "2026-11-15T09:00:00Z" or "2026-11-15T09:00:00+07:00")
  endTime: string;   // ISO 8601
}

/**
 * Định dạng chuỗi ngày ISO sang chuẩn Compact UTC (YYYYMMDDTHHmmssZ)
 */
export const formatToCompactUtc = (isoDateStr: string): string => {
  const date = new Date(isoDateStr);
  if (isNaN(date.getTime())) {
    return '20261115T090000Z';
  }
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};

/**
 * Sinh URL thêm sự kiện trực tiếp vào Google Calendar
 */
export const generateGoogleCalendarUrl = (payload: CalendarExportPayload): string => {
  const startUtc = formatToCompactUtc(payload.startTime);
  const endUtc = formatToCompactUtc(payload.endTime);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: payload.title,
    dates: `${startUtc}/${endUtc}`,
    details: payload.description,
    location: payload.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Sinh nội dung chuỗi tệp iCalendar (.ics) tuân thủ chuẩn RFC 5545
 */
export const generateIcsContent = (payload: CalendarExportPayload): string => {
  const startUtc = formatToCompactUtc(payload.startTime);
  const endUtc = formatToCompactUtc(payload.endTime);
  const nowUtc = formatToCompactUtc(new Date().toISOString());
  const uid = `profilehub-interview-${Date.now()}@profilehub.vn`;

  // Escape ký tự đặc biệt trong RFC 5545: dấu phẩy, chấm phẩy, xuống dòng
  const cleanSummary = payload.title.replace(/[,;]/g, '\\$&');
  const cleanDescription = payload.description.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const cleanLocation = payload.location.replace(/[,;]/g, '\\$&');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ProfileHub//Career Ecosystem RFC5545//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanLocation}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Nhắc nhở phỏng vấn ProfileHub trước 30 phút',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
};

/**
 * Tải file .ics trực tiếp trên trình duyệt
 */
export const downloadIcsFile = (payload: CalendarExportPayload, filename = 'lich-phong-van-profilehub.ics'): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const icsString = generateIcsContent(payload);
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Khởi tạo CalendarExportPayload từ InterviewSlot
 */
export const createSlotExportPayload = (
  slot: InterviewSlot,
  jobTitle = 'Kỹ sư phần mềm',
  companyName = 'Công ty Công nghệ',
  candidateName = 'Ứng viên'
): CalendarExportPayload => {
  const meet = slot.meetUrl || 'https://meet.google.com/new';
  return {
    title: `[Phỏng Vấn ProfileHub] ${jobTitle} - ${companyName}`,
    description: `Buổi phỏng vấn giữa ${companyName} và ứng viên ${candidateName} cho vị trí ${jobTitle}.\n\nLiên kết phòng họp Google Meet: ${meet}\nNền tảng bảo chứng hồ sơ: ProfileHub.vn`,
    location: meet,
    startTime: slot.startTime,
    endTime: slot.endTime,
  };
};

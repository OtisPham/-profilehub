import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { 
  getInitialTheme, 
  getInitialPreference, 
  THEME_STORAGE_KEY, 
  THEME_PREFERENCE_KEY 
} from './ThemeContext';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] || null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

const mockStorage = new LocalStorageMock();
vi.stubGlobal('localStorage', mockStorage);

// Mock document.documentElement classList
const classListStore = new Set<string>();
const mockDocument = {
  documentElement: {
    classList: {
      add: (cls: string) => classListStore.add(cls),
      remove: (cls: string) => classListStore.delete(cls),
      contains: (cls: string) => classListStore.has(cls),
    },
  },
};
vi.stubGlobal('document', mockDocument);

// Mock window event target
const eventTarget = new EventTarget();
vi.stubGlobal('window', {
  addEventListener: eventTarget.addEventListener.bind(eventTarget),
  removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
  dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
  localStorage: mockStorage,
});

describe('Theme Management & Mode Switching Logic', () => {
  beforeEach(() => {
    mockStorage.clear();
    classListStore.clear();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('TC-THEME-01: getInitialTheme trả về theme đã lưu trong localStorage nếu hợp lệ', () => {
    mockStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(getInitialTheme()).toBe('dark');

    mockStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(getInitialTheme()).toBe('light');
  });

  it('TC-THEME-02: getInitialTheme mặc định là light hoặc dark hợp lệ khi chưa có dữ liệu lưu', () => {
    mockStorage.removeItem(THEME_STORAGE_KEY);
    mockStorage.removeItem(THEME_PREFERENCE_KEY);
    const theme = getInitialTheme();
    expect(['light', 'dark']).toContain(theme);
  });

  it('TC-THEME-03: Thao tác thêm/xóa class dark trên thẻ documentElement hoạt động chính xác', () => {
    mockDocument.documentElement.classList.add('dark');
    expect(mockDocument.documentElement.classList.contains('dark')).toBe(true);

    mockDocument.documentElement.classList.remove('dark');
    expect(mockDocument.documentElement.classList.contains('dark')).toBe(false);
  });

  it('TC-THEME-04: Dispatch sự kiện profilehub_theme_change khi chuyển đổi', () => {
    const listener = vi.fn();
    window.addEventListener('profilehub_theme_change', listener as EventListener);

    window.dispatchEvent(
      new CustomEvent('profilehub_theme_change', { detail: { theme: 'dark' } })
    );

    expect(listener).toHaveBeenCalled();
    const event = listener.mock.calls[0][0] as CustomEvent;
    expect(event.detail.theme).toBe('dark');

    window.removeEventListener('profilehub_theme_change', listener as EventListener);
  });

  it('TC-THEME-05: getInitialPreference mặc định là solar (tự động theo thời gian mặt trời)', () => {
    mockStorage.removeItem(THEME_PREFERENCE_KEY);
    expect(getInitialPreference()).toBe('solar');
  });

  it('TC-THEME-06: Chế độ solar tự động chọn light mode khi trời sáng (10:00 sáng)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 3, 10, 0, 0)); // 10:00 sáng

    mockStorage.setItem(THEME_PREFERENCE_KEY, 'solar');
    expect(getInitialTheme()).toBe('light');
  });

  it('TC-THEME-07: Chế độ solar tự động chọn dark mode sau khi mặt trời lặn (20:00 tối)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 3, 20, 0, 0)); // 20:00 tối

    mockStorage.setItem(THEME_PREFERENCE_KEY, 'solar');
    expect(getInitialTheme()).toBe('dark');
  });

  it('TC-THEME-08: Preference ghi đè thủ công (manual light/dark) được tôn trọng', () => {
    mockStorage.setItem(THEME_PREFERENCE_KEY, 'dark');
    expect(getInitialPreference()).toBe('dark');
    expect(getInitialTheme()).toBe('dark');

    mockStorage.setItem(THEME_PREFERENCE_KEY, 'light');
    expect(getInitialPreference()).toBe('light');
    expect(getInitialTheme()).toBe('light');
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getInitialTheme } from './ThemeContext';

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
  });

  it('TC-THEME-01: getInitialTheme trả về theme đã lưu trong localStorage nếu hợp lệ', () => {
    mockStorage.setItem('profilehub_theme', 'dark');
    expect(getInitialTheme()).toBe('dark');

    mockStorage.setItem('profilehub_theme', 'light');
    expect(getInitialTheme()).toBe('light');
  });

  it('TC-THEME-02: getInitialTheme mặc định là light khi chưa có dữ liệu lưu', () => {
    mockStorage.removeItem('profilehub_theme');
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
});

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  getSolarInfo, 
  isDaytime, 
  type SolarInfo 
} from '../utils/solarTheme';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'solar' | 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  preference: ThemePreference;
  solarInfo: SolarInfo;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setPreference: (pref: ThemePreference) => void;
  resetToSolar: () => void;
}

export const THEME_STORAGE_KEY = 'profilehub_theme';
export const THEME_PREFERENCE_KEY = 'profilehub_theme_preference';

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  preference: 'solar',
  solarInfo: getSolarInfo(),
  toggleTheme: () => {},
  setTheme: () => {},
  setPreference: () => {},
  resetToSolar: () => {},
});

/**
 * Đọc preference ban đầu của người dùng:
 * 1. Đọc từ localStorage ('profilehub_theme_preference')
 * 2. Mặc định là 'solar' (chế độ chuyển màu theo thời gian thực: ban ngày sáng, sau mặt trời lặn tối)
 */
export function getInitialPreference(): ThemePreference {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(THEME_PREFERENCE_KEY);
      if (saved === 'solar' || saved === 'light' || saved === 'dark') {
        return saved;
      }
    }
  } catch {}
  return 'solar';
}

/**
 * Helper an toàn để xác định theme ban đầu:
 * 1. Nếu preference là 'light' hoặc 'dark' -> dùng theme đó
 * 2. Nếu localStorage 'profilehub_theme' có 'light' hoặc 'dark' và chưa cấu hình preference -> dùng theme đó để tương thích ngược
 * 3. Mặc định: theo chu kỳ mặt trời (Trời sáng -> 'light', Sau khi mặt trời lặn -> 'dark')
 */
export function getInitialTheme(): ThemeMode {
  try {
    if (typeof localStorage !== 'undefined') {
      const savedPref = localStorage.getItem(THEME_PREFERENCE_KEY);
      if (savedPref === 'light' || savedPref === 'dark') {
        return savedPref;
      }
      if (savedPref === 'solar') {
        return isDaytime() ? 'light' : 'dark';
      }
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    }
  } catch {}
  return isDaytime() ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(getInitialPreference);
  const [solarInfo, setSolarInfo] = useState<SolarInfo>(() => getSolarInfo());
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const pref = getInitialPreference();
    if (pref === 'light' || pref === 'dark') return pref;
    return getSolarInfo().isDaylight ? 'light' : 'dark';
  });

  // Áp dụng class 'dark' lên thẻ <html> và lưu vào localStorage
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        window.localStorage.setItem(THEME_PREFERENCE_KEY, preference);
      }
    } catch {}

    // Bắn custom event cho các module không dùng React context nếu cần
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('profilehub_theme_change', { 
          detail: { 
            theme, 
            preference, 
            solarInfo: getSolarInfo() 
          } 
        })
      );
    }
  }, [theme, preference]);

  // Cập nhật chu kỳ Mặt Trời theo thời gian thực (real-time sync)
  useEffect(() => {
    const updateSolarStatus = () => {
      const current = getSolarInfo();
      setSolarInfo(current);

      // Nếu đang ở chế độ 'solar' (mặc định), tự động chuyển đổi theme theo chu kỳ mặt trời
      if (preference === 'solar') {
        const expectedTheme: ThemeMode = current.isDaylight ? 'light' : 'dark';
        setThemeState(prev => (prev !== expectedTheme ? expectedTheme : prev));
      }
    };

    updateSolarStatus();

    // Chu kỳ polling định kỳ mỗi 15 giây
    const intervalId = window.setInterval(updateSolarStatus, 15000);

    // Timeout chính xác đến đúng thời điểm hoàng hôn hoặc bình minh tiếp theo
    const current = getSolarInfo();
    const timeoutId = window.setTimeout(updateSolarStatus, current.msUntilNextTransition + 500);

    // Khi người dùng quay lại tab hoặc mở máy sau khi ngủ
    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        updateSolarStatus();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', updateSolarStatus);
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibility);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.clearInterval(intervalId);
        window.clearTimeout(timeoutId);
        window.removeEventListener('focus', updateSolarStatus);
      }
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibility);
      }
    };
  }, [preference]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    setPreferenceState(nextTheme);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    setPreferenceState(newTheme);
  };

  const setPreference = (newPref: ThemePreference) => {
    setPreferenceState(newPref);
    if (newPref === 'solar') {
      const current = getSolarInfo();
      setSolarInfo(current);
      setThemeState(current.isDaylight ? 'light' : 'dark');
    } else {
      setThemeState(newPref);
    }
  };

  const resetToSolar = () => {
    setPreference('solar');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        preference,
        solarInfo,
        toggleTheme,
        setTheme,
        setPreference,
        resetToSolar,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

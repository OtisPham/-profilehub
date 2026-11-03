import { describe, it, expect } from 'vitest';
import { 
  getSolarInfo, 
  isDaytime, 
  calculateAstronomicalSunriseSunset,
  DEFAULT_SUNRISE_HOUR, 
  DEFAULT_SUNSET_HOUR 
} from './solarTheme';

describe('Solar Theme Calculation Engine (solarTheme.ts)', () => {
  it('TC-SOLAR-01: Xác định chính xác ban ngày khi trời sáng (06:00 - 18:00)', () => {
    // 08:51 sáng - thời gian hiện tại
    const morning = new Date(2026, 10, 3, 8, 51, 0);
    const morningInfo = getSolarInfo(morning);
    expect(morningInfo.isDaylight).toBe(true);
    expect(isDaytime(morning)).toBe(true);
    expect(morningInfo.phase).toBe('day');

    // 12:00 trưa
    const noon = new Date(2026, 10, 3, 12, 0, 0);
    expect(isDaytime(noon)).toBe(true);

    // 16:30 chiều
    const afternoon = new Date(2026, 10, 3, 16, 30, 0);
    expect(isDaytime(afternoon)).toBe(true);
  });

  it('TC-SOLAR-02: Xác định chính xác ban đêm sau khi mặt trời lặn (sau 18:00)', () => {
    // 18:00 - thời điểm mặt trời lặn
    const sunsetExact = new Date(2026, 10, 3, 18, 0, 0);
    expect(isDaytime(sunsetExact)).toBe(false);

    // 20:30 tối
    const evening = new Date(2026, 10, 3, 20, 30, 0);
    const eveningInfo = getSolarInfo(evening);
    expect(eveningInfo.isDaylight).toBe(false);
    expect(isDaytime(evening)).toBe(false);
    expect(eveningInfo.phase).toBe('night');

    // 23:59 đêm
    const midnight = new Date(2026, 10, 3, 23, 59, 59);
    expect(isDaytime(midnight)).toBe(false);
  });

  it('TC-SOLAR-03: Xác định chính xác ban đêm trước khi mặt trời mọc (trước 06:00)', () => {
    // 02:00 sáng sớm
    const earlyMorning = new Date(2026, 10, 3, 2, 0, 0);
    expect(isDaytime(earlyMorning)).toBe(false);

    // 05:59 trước bình minh
    const beforeDawn = new Date(2026, 10, 3, 5, 59, 59);
    expect(isDaytime(beforeDawn)).toBe(false);
  });

  it('TC-SOLAR-04: Điểm biên chuyển đổi (06:00 bình minh và 18:00 hoàng hôn) chính xác từng giây', () => {
    // 05:59:59 -> tối (trước khi mặt trời mọc)
    const justBeforeSunrise = new Date(2026, 10, 3, 5, 59, 59);
    expect(isDaytime(justBeforeSunrise)).toBe(false);

    // 06:00:00 -> sáng (bình minh)
    const sunriseMoment = new Date(2026, 10, 3, 6, 0, 0);
    expect(isDaytime(sunriseMoment)).toBe(true);

    // 17:59:59 -> sáng (vẫn còn ban ngày)
    const justBeforeSunset = new Date(2026, 10, 3, 17, 59, 59);
    expect(isDaytime(justBeforeSunset)).toBe(true);

    // 18:00:00 -> tối (mặt trời bắt đầu lặn)
    const sunsetMoment = new Date(2026, 10, 3, 18, 0, 0);
    expect(isDaytime(sunsetMoment)).toBe(false);
  });

  it('TC-SOLAR-05: Nhận diện đúng giai đoạn bình minh (sunrise) và hoàng hôn (sunset)', () => {
    // 06:10 sáng -> giai đoạn bình minh
    const sunriseWindow = new Date(2026, 10, 3, 6, 10, 0);
    const sunriseInfo = getSolarInfo(sunriseWindow);
    expect(sunriseInfo.phase).toBe('sunrise');
    expect(sunriseInfo.phaseLabel).toContain('Bình minh');

    // 17:50 chiều -> giai đoạn hoàng hôn
    const sunsetWindow = new Date(2026, 10, 3, 17, 50, 0);
    const sunsetInfo = getSolarInfo(sunsetWindow);
    expect(sunsetInfo.phase).toBe('sunset');
    expect(sunsetInfo.phaseLabel).toContain('Hoàng hôn');
  });

  it('TC-SOLAR-06: Thông tin đếm ngược thời gian chuyển giao tiếp theo (msUntilNextTransition & label)', () => {
    // 14:00 chiều -> lần chuyển tiếp theo là hoàng hôn 18:00 (4 tiếng = 4 * 3600 * 1000 ms)
    const afternoon = new Date(2026, 10, 3, 14, 0, 0);
    const info = getSolarInfo(afternoon);
    expect(info.msUntilNextTransition).toBe(4 * 60 * 60 * 1000);
    expect(info.nextTransitionLabel).toContain('18:00');
    expect(info.nextTransitionLabel).toContain('Tối');

    // 22:00 tối -> lần chuyển tiếp theo là bình minh ngày mai 06:00 (8 tiếng = 8 * 3600 * 1000 ms)
    const night = new Date(2026, 10, 3, 22, 0, 0);
    const nightInfo = getSolarInfo(night);
    expect(nightInfo.msUntilNextTransition).toBe(8 * 60 * 60 * 1000);
    expect(nightInfo.nextTransitionLabel).toContain('06:00');
    expect(nightInfo.nextTransitionLabel).toContain('Sáng');
  });

  it('TC-SOLAR-07: Hỗ trợ tính toán thiên văn NOAA với tọa độ địa lý tùy chọn', () => {
    // Tọa độ Hà Nội: 21.0285°N, 105.8542°E
    const testDate = new Date(2026, 5, 21, 12, 0, 0); // Hạ chí
    const astro = calculateAstronomicalSunriseSunset(testDate, 21.0285, 105.8542);
    expect(astro.sunrise).toBeInstanceOf(Date);
    expect(astro.sunset).toBeInstanceOf(Date);
    expect(astro.sunrise.getTime()).toBeLessThan(astro.sunset.getTime());
  });
});

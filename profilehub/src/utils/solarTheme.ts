/**
 * solarTheme.ts
 * Module tính toán chu kỳ Mặt Trời và thời gian thực cho tính năng
 * tự động chuyển chế độ giao diện Sáng / Tối:
 * - Ban ngày (Trời sáng: từ bình minh ~06:00 đến hoàng hôn ~18:00): Giao diện Sáng (Light mode)
 * - Ban đêm (Sau khi mặt trời lặn ~18:00 đến bình minh hôm sau ~06:00): Giao diện Tối (Dark mode)
 */

export interface SolarCoordinates {
  latitude: number;
  longitude: number;
}

export interface SolarConfig {
  sunriseHour?: number;    // Giờ mặt trời mọc mặc định (06:00)
  sunriseMinute?: number;
  sunsetHour?: number;     // Giờ mặt trời lặn mặc định (18:00)
  sunsetMinute?: number;
  coordinates?: SolarCoordinates | null;
}

export type SolarPhase = 'sunrise' | 'day' | 'sunset' | 'night';

export interface SolarInfo {
  isDaylight: boolean;
  phase: SolarPhase;
  phaseLabel: string;
  phaseDescription: string;
  sunriseTime: string;  // Định dạng "06:00"
  sunsetTime: string;   // Định dạng "18:00"
  currentTime: string;  // Định dạng "08:51"
  nextTransitionLabel: string;
  msUntilNextTransition: number;
  sunriseDate: Date;
  sunsetDate: Date;
}

export const DEFAULT_SUNRISE_HOUR = 6;
export const DEFAULT_SUNRISE_MINUTE = 0;
export const DEFAULT_SUNSET_HOUR = 18;
export const DEFAULT_SUNSET_MINUTE = 0;

export function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export function formatTimeHM(date: Date): string {
  return `${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
}

/**
 * Thuật toán thiên văn NOAA tính toán giờ Mặt trời mọc và lặn chuẩn xác theo tọa độ
 */
export function calculateAstronomicalSunriseSunset(
  date: Date,
  lat: number,
  lng: number
): { sunrise: Date; sunset: Date } {
  try {
    const rad = Math.PI / 180;
    const deg = 180 / Math.PI;

    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    const lngHour = lng / 15;

    const calcSolarEvent = (isSunrise: boolean): Date => {
      const t = dayOfYear + ((isSunrise ? 6 : 18) - lngHour) / 24;
      const M = (0.9856 * t) - 3.289;
      let L = M + (1.916 * Math.sin(M * rad)) + (0.020 * Math.sin(2 * M * rad)) + 282.634;
      L = ((L % 360) + 360) % 360;

      let RA = deg * Math.atan(0.91764 * Math.tan(L * rad));
      RA = ((RA % 360) + 360) % 360;

      const Lquadrant = Math.floor(L / 90) * 90;
      const RAquadrant = Math.floor(RA / 90) * 90;
      RA = (RA + (Lquadrant - RAquadrant)) / 15;

      const sinDec = 0.39782 * Math.sin(L * rad);
      const cosDec = Math.cos(Math.asin(sinDec));

      const zenith = 90.8333; // Chuẩn góc chân trời gồm khúc xạ khí quyển
      const cosH = (Math.cos(zenith * rad) - (sinDec * Math.sin(lat * rad))) / (cosDec * Math.cos(lat * rad));

      if (cosH > 1 || cosH < -1) {
        const fallback = new Date(date);
        fallback.setHours(isSunrise ? DEFAULT_SUNRISE_HOUR : DEFAULT_SUNSET_HOUR, 0, 0, 0);
        return fallback;
      }

      const H = (isSunrise ? 360 - deg * Math.acos(cosH) : deg * Math.acos(cosH)) / 15;
      const T = H + RA - (0.06571 * t) - 6.622;
      let UT = T - lngHour;
      UT = ((UT % 24) + 24) % 24;

      // Chuyển từ Universal Time (UTC) sang giờ địa phương của date
      const tzOffsetHours = -date.getTimezoneOffset() / 60;
      let localHours = UT + tzOffsetHours;
      localHours = ((localHours % 24) + 24) % 24;

      const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const hours = Math.floor(localHours);
      const minutes = Math.floor((localHours - hours) * 60);
      const seconds = Math.floor(((localHours - hours) * 60 - minutes) * 60);

      eventDate.setHours(hours, minutes, seconds, 0);
      return eventDate;
    };

    const sunrise = calcSolarEvent(true);
    const sunset = calcSolarEvent(false);

    // Đảm bảo tính bất biến trên mọi múi giờ (kể cả UTC runner): bình minh luôn xảy ra trước hoàng hôn
    if (sunrise.getTime() > sunset.getTime()) {
      sunrise.setDate(sunrise.getDate() - 1);
    }

    return {
      sunrise,
      sunset,
    };
  } catch {
    const sRise = new Date(date);
    sRise.setHours(DEFAULT_SUNRISE_HOUR, DEFAULT_SUNRISE_MINUTE, 0, 0);
    const sSet = new Date(date);
    sSet.setHours(DEFAULT_SUNSET_HOUR, DEFAULT_SUNSET_MINUTE, 0, 0);
    return { sunrise: sRise, sunset: sSet };
  }
}

/**
 * Tính toán trạng thái Mặt trời và chu kỳ thời gian hiện tại
 */
export function getSolarInfo(date = new Date(), config?: SolarConfig): SolarInfo {
  let sunriseDate: Date;
  let sunsetDate: Date;

  if (config?.coordinates) {
    const astro = calculateAstronomicalSunriseSunset(
      date,
      config.coordinates.latitude,
      config.coordinates.longitude
    );
    sunriseDate = astro.sunrise;
    sunsetDate = astro.sunset;
  } else {
    const sHour = config?.sunriseHour ?? DEFAULT_SUNRISE_HOUR;
    const sMin = config?.sunriseMinute ?? DEFAULT_SUNRISE_MINUTE;
    const eHour = config?.sunsetHour ?? DEFAULT_SUNSET_HOUR;
    const eMin = config?.sunsetMinute ?? DEFAULT_SUNSET_MINUTE;

    sunriseDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), sHour, sMin, 0, 0);
    sunsetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), eHour, eMin, 0, 0);
  }

  const currentMs = date.getTime();
  const sunriseMs = sunriseDate.getTime();
  const sunsetMs = sunsetDate.getTime();

  // Ban ngày: từ lúc mặt trời mọc đến lúc mặt trời lặn
  const isDaylight = currentMs >= sunriseMs && currentMs < sunsetMs;

  // Xác định giai đoạn mặt trời trong ngày
  const halfHourMs = 30 * 60 * 1000;
  let phase: SolarPhase = 'day';
  let phaseLabel = 'Ban ngày (Trời sáng)';
  let phaseDescription = 'Trời sáng (từ bình minh đến hoàng hôn), giao diện tự động đặt chế độ Sáng tối ưu thị giác.';

  if (Math.abs(currentMs - sunriseMs) <= halfHourMs) {
    phase = 'sunrise';
    phaseLabel = 'Bình minh (Mặt trời mọc)';
    phaseDescription = 'Mặt trời đang mọc, hệ thống tự động chuyển sang giao diện Sáng rạng rỡ.';
  } else if (Math.abs(currentMs - sunsetMs) <= halfHourMs) {
    phase = 'sunset';
    phaseLabel = 'Hoàng hôn (Mặt trời lặn)';
    phaseDescription = 'Mặt trời bắt đầu lặn, hệ thống tự động chuyển sang giao diện Tối dịu mắt.';
  } else if (!isDaylight) {
    phase = 'night';
    phaseLabel = 'Ban đêm (Sau khi mặt trời lặn)';
    phaseDescription = 'Sau khi mặt trời lặn, giao diện tự động chuyển sang chế độ Tối bảo vệ mắt.';
  }

  // Tính toán thời điểm chuyển giao tiếp theo
  let nextTransitionLabel = '';
  let msUntilNextTransition = 0;

  if (currentMs < sunriseMs) {
    // Chưa đến bình minh hôm nay
    msUntilNextTransition = sunriseMs - currentMs;
    nextTransitionLabel = `Chuyển nền Sáng khi mặt trời mọc lúc ${formatTimeHM(sunriseDate)}`;
  } else if (currentMs >= sunriseMs && currentMs < sunsetMs) {
    // Đang là ban ngày, lần chuyển tiếp theo là hoàng hôn hôm nay
    msUntilNextTransition = sunsetMs - currentMs;
    nextTransitionLabel = `Chuyển nền Tối sau khi mặt trời lặn lúc ${formatTimeHM(sunsetDate)}`;
  } else {
    // Đã qua hoàng hôn hôm nay, lần chuyển tiếp theo là bình minh ngày mai
    const tomorrowSunrise = new Date(sunriseDate);
    tomorrowSunrise.setDate(tomorrowSunrise.getDate() + 1);
    msUntilNextTransition = tomorrowSunrise.getTime() - currentMs;
    nextTransitionLabel = `Chuyển nền Sáng khi mặt trời mọc lúc ${formatTimeHM(tomorrowSunrise)}`;
  }

  return {
    isDaylight,
    phase,
    phaseLabel,
    phaseDescription,
    sunriseTime: formatTimeHM(sunriseDate),
    sunsetTime: formatTimeHM(sunsetDate),
    currentTime: formatTimeHM(date),
    nextTransitionLabel,
    msUntilNextTransition: Math.max(0, msUntilNextTransition),
    sunriseDate,
    sunsetDate,
  };
}

/**
 * Kiểm tra nhanh xem thời điểm đã cho có phải là ban ngày hay không
 */
export function isDaytime(date = new Date(), config?: SolarConfig): boolean {
  return getSolarInfo(date, config).isDaylight;
}

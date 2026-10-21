import { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth.middleware.js';

interface RateLimitRecord {
  timestamps: number[];
}

interface RateLimiterOptions {
  windowMs: number; // Thời gian cửa sổ (milliseconds)
  max: number;      // Số request tối đa trong cửa sổ
  message?: string; // Thông điệp lỗi khi vượt ngưỡng
}

/**
 * Tạo một Middleware Rate Limiter theo thuật toán Sliding Window
 * Nhẹ, không cần thêm dependency ngoài, hỗ trợ nhận diện qua User ID hoặc IP
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const { windowMs, max, message } = options;
  const store = new Map<string, RateLimitRecord>();

  // Tự động dọn dẹp các IP/User cũ mỗi 5 phút để tránh rò rỉ bộ nhớ
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref(); // unref để không chặn process exit

  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    
    // Nhận diện client: ưu tiên user ID (nếu đã đăng nhập), sau đó là IP
    const clientIp = (
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown-client'
    );
    const clientKey = authReq.user?.id ? `user_${authReq.user.id}` : `ip_${clientIp}`;

    const now = Date.now();
    let record = store.get(clientKey);

    if (!record) {
      record = { timestamps: [] };
      store.set(clientKey, record);
    }

    // Lọc bỏ các timestamp nằm ngoài cửa sổ windowMs
    record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

    const currentCount = record.timestamps.length;

    // Thiết lập Rate Limit Headers chuẩn RFC
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - currentCount - 1));
    const oldestTimestamp = record.timestamps[0] || now;
    const resetTime = Math.ceil((oldestTimestamp + windowMs) / 1000);
    res.setHeader('X-RateLimit-Reset', resetTime);

    if (currentCount >= max) {
      const retryAfterSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
      res.setHeader('Retry-After', Math.max(1, retryAfterSeconds));
      res.status(429).json({
        success: false,
        message: message || `Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ${Math.max(1, retryAfterSeconds)} giây.`,
        retryAfter: Math.max(1, retryAfterSeconds),
      });
      return;
    }

    record.timestamps.push(now);
    next();
  };
}

/**
 * Bộ kiểm soát tốc độ gọi AI chuyên dụng (Anti-Spam & Cost-Protection)
 * Giới hạn: Tối đa 15 lần gọi AI / 1 phút cho mỗi client
 */
export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 phút
  max: 15,             // Tối đa 15 requests / phút
  message: 'Hệ thống AI đang nhận quá nhiều yêu cầu từ bạn. Vui lòng chờ 1 phút trước khi tiếp tục tạo CV.',
});

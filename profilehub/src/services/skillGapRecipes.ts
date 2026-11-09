import type { ProjectUpgradeRecipe, SkillCategory, SkillCriticality } from '../types/database';

export interface SkillMeta {
  canonicalName: string;
  category: SkillCategory;
  defaultCriticality: SkillCriticality;
  reason: string;
}

export const SKILL_METADATA_MAP: Record<string, SkillMeta> = {
  redis: {
    canonicalName: 'Redis',
    category: 'backend',
    defaultCriticality: 'critical',
    reason: 'Doanh nghiệp cần tối ưu tốc độ phản hồi và giảm tải cơ sở dữ liệu qua In-memory Caching.'
  },
  docker: {
    canonicalName: 'Docker',
    category: 'devops',
    defaultCriticality: 'critical',
    reason: 'Tiêu chuẩn triển khai container hóa đồng nhất giữa môi trường Dev và Production.'
  },
  vitest: {
    canonicalName: 'Vitest / Automated Testing',
    category: 'testing',
    defaultCriticality: 'critical',
    reason: 'Chứng minh năng lực viết code ổn định, có kiểm thử tự động thay vì chỉ test bằng tay.'
  },
  jest: {
    canonicalName: 'Vitest / Automated Testing',
    category: 'testing',
    defaultCriticality: 'critical',
    reason: 'Chứng minh năng lực viết code ổn định, có kiểm thử tự động thay vì chỉ test bằng tay.'
  },
  'ci/cd': {
    canonicalName: 'CI/CD Pipeline',
    category: 'devops',
    defaultCriticality: 'recommended',
    reason: 'Tự động hóa build, lint và test trên GitHub Actions trước khi merge mã nguồn.'
  },
  'github actions': {
    canonicalName: 'CI/CD Pipeline',
    category: 'devops',
    defaultCriticality: 'recommended',
    reason: 'Tự động hóa build, lint và test trên GitHub Actions trước khi merge mã nguồn.'
  },
  'sql indexing': {
    canonicalName: 'SQL Indexing & Optimization',
    category: 'database',
    defaultCriticality: 'recommended',
    reason: 'Tránh full table scan, tối ưu hóa truy vấn cho các bảng dữ liệu quy mô lớn.'
  },
  indexing: {
    canonicalName: 'SQL Indexing & Optimization',
    category: 'database',
    defaultCriticality: 'recommended',
    reason: 'Tránh full table scan, tối ưu hóa truy vấn cho các bảng dữ liệu quy mô lớn.'
  },
  rabbitmq: {
    canonicalName: 'Message Queue (RabbitMQ / BullMQ)',
    category: 'backend',
    defaultCriticality: 'recommended',
    reason: 'Tách các tác vụ nặng (gửi email, xử lý ảnh) ra khỏi vòng lặp request-response.'
  },
  kafka: {
    canonicalName: 'Message Queue (RabbitMQ / BullMQ)',
    category: 'backend',
    defaultCriticality: 'recommended',
    reason: 'Tách các tác vụ nặng (gửi email, xử lý ảnh) ra khỏi vòng lặp request-response.'
  },
  typescript: {
    canonicalName: 'TypeScript Strict Mode',
    category: 'frontend',
    defaultCriticality: 'recommended',
    reason: 'Đảm bảo Type-safety, giảm 70% lỗi runtime phổ biến trên môi trường Production.'
  }
};

/**
 * Ngân hàng công thức nâng cấp mã nguồn (Recipe Template Bank)
 */
export const RECIPE_TEMPLATE_BANK: Record<string, Omit<ProjectUpgradeRecipe, 'id' | 'status' | 'completedAt'>> = {
  Redis: {
    targetSkill: 'Redis',
    title: 'Tích hợp Redis Cache-Aside Pattern cho API Danh Sách Sản Phẩm',
    complexity: 'Intermediate',
    estimatedHours: 2,
    stepByStepGuide: [
      'Cài đặt thư viện ioredis hoặc redis: `npm install ioredis`',
      'Tạo middleware hoặc helper `cacheMiddleware(ttlSeconds)` để kiểm tra key trong Redis trước khi truy vấn Database',
      'Nếu cache hit -> trả về ngay lập tức; nếu cache miss -> truy vấn DB, lưu vào Redis với TTL 60s rồi trả về',
      'Đo lường thời gian phản hồi: Thời gian response giảm từ ~120ms xuống < 8ms'
    ],
    codeSnippet: `// Ví dụ: redisCache.ts
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function getOrSetCache<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const freshData = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(freshData));
  return freshData;
}`,
    acceptanceCriteria: [
      'Khởi chạy Redis instance thành công (qua Docker hoặc cục bộ)',
      'API trả header X-Cache: HIT khi gọi lại lần thứ 2',
      'Có cơ chế vô hiệu hóa cache (Cache Invalidation) khi dữ liệu bị sửa/xóa'
    ]
  },
  Docker: {
    targetSkill: 'Docker',
    title: 'Container hóa Ứng Dụng Đa Dịch Vụ với Dockerfile & Docker Compose',
    complexity: 'Beginner',
    estimatedHours: 2,
    stepByStepGuide: [
      'Viết `Dockerfile` tối ưu nhiều tầng (Multi-stage build) để giảm kích thước image từ 1GB xuống < 120MB',
      'Tạo `.dockerignore` loại trừ node_modules, .git, và .env',
      'Viết tệp `docker-compose.yml` liên kết App Service, PostgreSQL/MongoDB và Redis',
      'Thử nghiệm chạy toàn bộ hệ thống bằng 1 lệnh duy nhất: `docker compose up -d`'
    ],
    codeSnippet: `# Dockerfile (Multi-stage build)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]`,
    acceptanceCriteria: [
      'Image build thành công không có warning bảo mật nghiêm trọng',
      'Đóng gói `docker-compose.yml` cho phép người khác clone về chạy được ngay',
      'Tài liệu hóa lệnh chạy trong README.md'
    ]
  },
  'Vitest / Automated Testing': {
    targetSkill: 'Vitest / Automated Testing',
    title: 'Xây Dựng Bộ Kiểm Thử Đơn Vị & Tích Hợp Đạt Coverage > 80%',
    complexity: 'Intermediate',
    estimatedHours: 3,
    stepByStepGuide: [
      'Cài đặt Vitest: `npm install -D vitest @vitest/coverage-v8`',
      'Viết Unit Test cho các hàm Core Business Logic (Validation, Calculation, Auth tokens)',
      'Viết Integration Test giả lập gọi API với mock database',
      'Chạy lệnh `npx vitest run --coverage` và đưa báo cáo tóm tắt vào README'
    ],
    codeSnippet: `// authService.test.ts
import { describe, it, expect } from 'vitest';
import { validatePasswordStrength, hashPassword } from './authService';

describe('Auth Service Core Invariants', () => {
  it('từ chối mật khẩu dưới 8 ký tự hoặc thiếu chữ hoa/số', () => {
    expect(validatePasswordStrength('abc')).toBe(false);
    expect(validatePasswordStrength('Abc12345')).toBe(true);
  });
});`,
    acceptanceCriteria: [
      'Toàn bộ test suites pass 100% khi chạy ở môi trường CI',
      'Không có flakiness (test chập chờn)',
      'Bao phủ tối thiểu 5 ca biên (Edge cases & Error handling)'
    ]
  },
  'CI/CD Pipeline': {
    targetSkill: 'CI/CD Pipeline',
    title: 'Thiết Lập GitHub Actions Tự Động Hóa Kiểm Thử & Kiểm Tra Kiểu',
    complexity: 'Beginner',
    estimatedHours: 1,
    stepByStepGuide: [
      'Tạo thư mục `.github/workflows/` trong kho mã nguồn đồ án',
      'Tạo file `ci.yml` kích hoạt mỗi khi có `push` hoặc `pull_request` vào branch `main`',
      'Cấu hình các bước: Checkout code, Setup Node.js, Cài dependencies, Kiểm tra TypeScript (`tsc --noEmit`), Chạy Vitest',
      'Chèn status badge `CI: Passing` vào đầu file README.md'
    ],
    codeSnippet: `name: Continuous Integration
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run test`,
    acceptanceCriteria: [
      'Workflow chạy thành công với tích xanh trên GitHub',
      'Chặn Pull Request nếu có test bị fail',
      'Hiển thị huy hiệu CI xanh trên file README'
    ]
  },
  'SQL Indexing & Optimization': {
    targetSkill: 'SQL Indexing & Optimization',
    title: 'Tối Ưu Truy Vấn Cơ Sở Dữ Liệu với B-Tree Composite Index & EXPLAIN ANALYZE',
    complexity: 'Advanced',
    estimatedHours: 2,
    stepByStepGuide: [
      'Xác định các câu lệnh query bị chậm thường xuyên (WHERE filter, JOIN, ORDER BY)',
      'Sử dụng `EXPLAIN ANALYZE` để phát hiện Seq Scan (quét toàn bảng)',
      'Thêm chỉ mục Composite Index phù hợp: `CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);`',
      'Ghi lại bảng so sánh thời gian thực thi: Trước (340ms) vs Sau khi Index (4ms)'
    ],
    codeSnippet: `-- Migration tối ưu hóa truy vấn
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_price 
ON products (category_id, price ASC) 
WHERE is_active = true;

-- Kiểm tra lại hiệu năng
EXPLAIN ANALYZE 
SELECT id, title, price FROM products 
WHERE category_id = 'cat_123' AND is_active = true 
ORDER BY price ASC LIMIT 20;`,
    acceptanceCriteria: [
      'Loại bỏ hoàn toàn Seq Scan trên bảng có > 10,000 dòng dữ liệu',
      'Thời gian thực thi truy vấn giảm tối thiểu 80%',
      'Ghi chú giải thích rõ lý do chọn composite index vào tài liệu kiến trúc'
    ]
  },
  'Message Queue (RabbitMQ / BullMQ)': {
    targetSkill: 'Message Queue (RabbitMQ / BullMQ)',
    title: 'Tách Tác Vụ Bất Đồng Bộ với Hàng Đợi Tin Nhắn & Worker',
    complexity: 'Advanced',
    estimatedHours: 3,
    stepByStepGuide: [
      'Cài đặt BullMQ hoặc amqplib: `npm install bullmq ioredis`',
      'Tạo Producer đẩy Job vào hàng đợi: `emailQueue.add("sendWelcomeEmail", { userId })`',
      'Tạo Worker tiến trình riêng để tiêu thụ và xử lý tin nhắn với cơ chế Retry lũy tiến (Exponential Backoff)',
      'Giao diện người dùng phản hồi ngay tức thì mà không phải chờ tác vụ gửi email hoàn tất'
    ],
    codeSnippet: `// worker.ts
import { Worker } from 'bullmq';
import { sendEmailViaProvider } from './emailService';

export const emailWorker = new Worker('emailQueue', async (job) => {
  console.log(\`Đang xử lý gửi email cho job \${job.id}\`);
  await sendEmailViaProvider(job.data.to, job.data.subject, job.data.body);
}, {
  connection: { host: 'localhost', port: 6379 },
  concurrency: 5
});`,
    acceptanceCriteria: [
      'API trả về 202 Accepted ngay sau khi đẩy job vào queue',
      'Có cơ chế dead-letter queue (DLQ) khi job thất bại quá 3 lần',
      'Worker có khả năng tự động khôi phục khi mất kết nối mạng'
    ]
  }
};

/**
 * Tạo recipe từ mẫu với mã ID duy nhất
 */
export function buildRecipeForSkill(skillName: string): ProjectUpgradeRecipe | null {
  const normalizedKey = skillName.trim();
  const template = RECIPE_TEMPLATE_BANK[normalizedKey];
  if (!template) {
    // Nếu chưa có template chuyên biệt, sinh recipe nâng cấp tổng quát
    return {
      id: `recipe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      targetSkill: skillName,
      title: `Bổ sung module thực nghiệm ${skillName} vào đồ án`,
      complexity: 'Intermediate',
      estimatedHours: 2,
      stepByStepGuide: [
        `Tìm hiểu tài liệu chính thức và cài đặt thư viện ${skillName}`,
        `Tạo một branch Git mới: \`feature/integrate-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}\``,
        `Tích hợp vào 1 tính năng cụ thể trong đồ án và viết tài liệu hướng dẫn vào README.md`,
        `Commit và tạo Pull Request minh chứng năng lực`
      ],
      codeSnippet: `// Gợi ý tích hợp ${skillName}\nconsole.log('Tích hợp module ${skillName} thành công');`,
      acceptanceCriteria: [
        `Mã nguồn chạy ổn định trên môi trường local`,
        `Có commit rõ ràng thể hiện việc bổ sung ${skillName}`
      ],
      status: 'not_started'
    };
  }

  return {
    id: `recipe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...template,
    status: 'not_started'
  };
}

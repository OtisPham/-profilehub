import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

// Middlewares
// Dynamic CORS Configuration compliant with W3C specification for credentials: true
const allowedOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : [])
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (server-to-server, mobile apps, curl)
      if (!origin) return callback(null, true);

      // Cho phép các domain trong danh sách và tất cả domain Vercel preview (*.vercel.app)
      const isAllowed = allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS Warning] Chặn origin chưa được cấp phép: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 ProfileHub REST API Server is running with Gemini AI',
    version: '1.0.0',
    gemini_status: ENV.GEMINI_API_KEY ? 'Configured' : 'Missing Key',
  });
});

// Mount routes under both /api and /api/v1 for 100% compatibility
app.use('/api', apiRouter);
app.use('/api/v1', apiRouter);

// Centralized error handling
app.use(errorHandler);

// Start server
const PORT = ENV.PORT;
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`✨ Server running at: http://localhost:${PORT}`);
  console.log(`✨ API Base: http://localhost:${PORT}/api & /api/v1`);
  console.log(
    `🔑 Gemini Key Status: ${
      ENV.GEMINI_API_KEY
        ? `✅ ĐÃ NHẬN KEY (${ENV.GEMINI_API_KEY.slice(0, 7)}...${ENV.GEMINI_API_KEY.slice(-4)})`
        : '❌ CHƯA THẤY KEY trong file .env!'
    }`
  );
  console.log(`🤖 Active Gemini Model: ${ENV.GEMINI_MODEL}`);
  console.log(`=======================================================`);
});

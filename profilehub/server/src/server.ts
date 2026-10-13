import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

// Middlewares
app.use(
  cors({
    origin: '*',
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

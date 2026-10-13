import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

// Tự động tìm và load file .env từ cả thư mục server và thư mục gốc của dự án
const candidatePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(currentDir, '../../.env'),
  path.resolve(currentDir, '../../../.env'),
  path.resolve(currentDir, '../.env'),
];

for (const envPath of candidatePaths) {
  try {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    }
  } catch {
    // Ignore read errors
  }
}
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || 5000,
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
  LLM_PROVIDER: process.env.LLM_PROVIDER || 'gemini',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  ANTHROPIC_MODEL_REPLY: process.env.ANTHROPIC_MODEL_REPLY || 'claude-3-5-sonnet-20241022',
  ANTHROPIC_MODEL_EXTRACT: process.env.ANTHROPIC_MODEL_EXTRACT || 'claude-3-5-haiku-20241022',
  ANTHROPIC_MODEL_GENERATE: process.env.ANTHROPIC_MODEL_GENERATE || 'claude-3-5-sonnet-20241022',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

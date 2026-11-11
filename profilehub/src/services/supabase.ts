import { createClient } from '@supabase/supabase-js'

// Polyfill safe fallback WebSocket cho Node.js test runner nếu không có WebSocket nguyên bản
if (typeof globalThis.WebSocket === 'undefined') {
  class DummyWebSocket {
    static readonly CONNECTING = 0
    static readonly OPEN = 1
    static readonly CLOSING = 2
    static readonly CLOSED = 3
    readonly readyState = 3
    addEventListener() {}
    removeEventListener() {}
    close() {}
    send() {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).WebSocket = DummyWebSocket
}

// Fallback an toàn trỏ đúng vào dự án Supabase ProfileHub nếu Vercel chưa nạp biến môi trường
const DEFAULT_SUPABASE_URL = 'https://kdfjiqnfjjtyxctcolyi.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkZmppcW5mamp0eXhjdGNvbHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NzQ0NzksImV4cCI6MjEwNTI1MDQ3OX0.U3PmLsBcccMf6Gbkp_7d6m1I3PoHkN3R04BczqKqB-0'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

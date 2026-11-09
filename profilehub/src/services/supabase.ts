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

// Fallback an toàn cho môi trường CI / Test không có file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

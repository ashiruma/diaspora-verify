import type { SupabaseClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials supporting Vite and Next.js naming conventions
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://mfpaeazewapznhyoxvca.supabase.co';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_iq5N3ZLHtJQrA6iH9AunRA_p3EmeypP';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let _clientPromise: Promise<SupabaseClient | null> | null = null;
let _clientInstance: SupabaseClient | null = null;

export async function getSupabase(): Promise<SupabaseClient | null> {
  if (_clientInstance) return _clientInstance;
  if (!isSupabaseConfigured) return null;
  if (!_clientPromise) {
    _clientPromise = import('@supabase/supabase-js').then(({ createClient }) => {
      _clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      return _clientInstance;
    }).catch(() => null);
  }
  return _clientPromise;
}

// Lazy client proxy ensuring zero static bundle weight until auth actions run
export const supabase = isSupabaseConfigured ? ({
  auth: {
    getSession: async () => {
      const client = await getSupabase();
      return client ? client.auth.getSession() : { data: { session: null }, error: null };
    },
    onAuthStateChange: (callback: (event: any, session: any) => void) => {
      let activeSub: { unsubscribe: () => void } | null = null;
      let isUnsubscribed = false;
      getSupabase().then(client => {
        if (!client || isUnsubscribed) return;
        const res = client.auth.onAuthStateChange(callback);
        activeSub = res.data?.subscription || null;
      });
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              isUnsubscribed = true;
              if (activeSub) activeSub.unsubscribe();
            }
          }
        }
      };
    },
    signInWithPassword: async (credentials: any) => {
      const client = await getSupabase();
      if (!client) throw new Error('Supabase client failed to initialize');
      return client.auth.signInWithPassword(credentials);
    },
    signUp: async (credentials: any) => {
      const client = await getSupabase();
      if (!client) throw new Error('Supabase client failed to initialize');
      return client.auth.signUp(credentials);
    },
    signOut: async () => {
      const client = await getSupabase();
      if (client) return client.auth.signOut();
    }
  }
} as unknown as SupabaseClient) : null;

/**
 * Computes a SHA-256 cryptographic digest of any string or ArrayBuffer.
 * Used for tamper-evident evidence verification and immutable report hashing.
 */
export async function computeSHA256(data: string | ArrayBuffer | Uint8Array): Promise<string> {
  const uint8: Uint8Array = typeof data === 'string' 
    ? new TextEncoder().encode(data) 
    : (data instanceof Uint8Array ? data : new Uint8Array(data));
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', uint8 as unknown as BufferSource);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Deterministic fallback for environments without subtle crypto
  let hash = 0;
  for (let i = 0; i < uint8.length; i++) {
    hash = ((hash << 5) - hash) + uint8[i];
    hash |= 0;
  }
  return 'fallback-' + Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Client-Side Rate Limiter for intake forms and authentication submissions.
 * Prevents rapid-fire automated submission spam.
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  check(actionKey: string, maxAttempts: number = 5, windowMs: number = 60000): { allowed: boolean; retryAfterSec?: number } {
    const now = Date.now();
    const timestamps = (this.attempts.get(actionKey) || []).filter(ts => now - ts < windowMs);
    
    if (timestamps.length >= maxAttempts) {
      const oldest = timestamps[0];
      const retryAfterSec = Math.ceil((windowMs - (now - oldest)) / 1000);
      return { allowed: false, retryAfterSec };
    }

    timestamps.push(now);
    this.attempts.set(actionKey, timestamps);
    return { allowed: true };
  }
}

export const rateLimiter = new RateLimiter();

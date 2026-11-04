import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { getFileSupabaseConfig } from '~/config/supabase';
import type {
  ContactInquiryInsert,
  ContactInquiryRow,
  ContactInquiryUpdate,
} from '~/types/contact-inquiry';

export type Database = {
  public: {
    Tables: {
      contact_inquiries: {
        Row: ContactInquiryRow;
        Insert: ContactInquiryInsert & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: ContactInquiryUpdate & {
          updated_at?: string;
        };
      };
    };
  };
};

export type SupabaseRuntimeConfig = {
  url: string;
  anonKey: string;
};

declare global {
  interface Window {
    __SUPABASE_CONFIG__?: SupabaseRuntimeConfig;
  }
}

let client: SupabaseClient<Database> | null = null;

/** Normalize common Supabase URL mistakes (e.g. pasting the REST endpoint). */
export function normalizeSupabaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/i, '');
}

/** Resolve config: page injection → code file → optional env override */
export function resolveSupabaseConfig(): SupabaseRuntimeConfig | null {
  const injected = typeof window !== 'undefined' ? window.__SUPABASE_CONFIG__ : undefined;
  if (injected?.url && injected?.anonKey) {
    return {
      url: normalizeSupabaseUrl(injected.url),
      anonKey: injected.anonKey,
    };
  }

  const fromFile = getFileSupabaseConfig();
  if (fromFile) {
    return {
      url: normalizeSupabaseUrl(fromFile.url),
      anonKey: fromFile.anonKey,
    };
  }

  const rawUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!rawUrl || !anonKey) return null;

  return {
    url: normalizeSupabaseUrl(rawUrl),
    anonKey,
  };
}

export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (typeof window === 'undefined') return null;

  const config = resolveSupabaseConfig();
  if (!config) return null;

  if (!client) {
    client = createClient<Database>(config.url, config.anonKey);
  }

  return client;
}

export function isSupabaseConfigured(): boolean {
  return resolveSupabaseConfig() !== null;
}

export const SUPABASE_SETUP_HINT = `请在 src/config/supabase.ts 中填写 Supabase 连接信息：

• url：项目根地址（如 https://xxx.supabase.co，不要带 /rest/v1/）
• anonKey：Supabase Settings → API 中的 anon / publishable key

修改后重新部署即可，无需在 Vercel 配置环境变量。`;

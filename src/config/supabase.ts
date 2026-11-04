/**
 * Inquiry inbox (Supabase table contact_inquiries). Anon/publishable key only; use RLS.
 * Set PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY / PUBLIC_SOURCE_SITE in .env.
 *
 * URL 使用项目根地址，不要带 /rest/v1/
 */
export const SUPABASE_CONFIG = {
  url: (import.meta.env.PUBLIC_SUPABASE_URL as string) ?? '',
  anonKey: (import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string) ?? '',
} as const;

export const SOURCE_SITE = (import.meta.env.PUBLIC_SOURCE_SITE as string) || 'example.com';

export function getFileSupabaseConfig() {
  const { url, anonKey } = SUPABASE_CONFIG;
  if (!url || !anonKey || url.includes('your-project')) return null;
  return { url, anonKey };
}
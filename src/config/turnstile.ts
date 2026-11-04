/**
 * Cloudflare Turnstile — site key is public and safe in the browser.
 *
 * 1. Cloudflare Dashboard → Turnstile → Add widget (Managed)
 * 2. Add your domain(s) + localhost as hostnames
 * 3. Paste the Site Key below, or set PUBLIC_TURNSTILE_SITE_KEY
 */
export const TURNSTILE_CONFIG = {
  siteKey: '',
} as const;

export function getTurnstileSiteKey(): string | null {
  const fromFile = TURNSTILE_CONFIG.siteKey?.trim() ?? '';
  if (fromFile && !fromFile.includes('your-site-key')) return fromFile;

  const envKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;
  const fromEnv = typeof envKey === 'string' ? envKey.trim() : '';
  if (fromEnv) return fromEnv;

  return null;
}

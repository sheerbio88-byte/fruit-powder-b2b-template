import { I18N_LOCALES } from '../i18n/locales';

/** Locale prefixes used in URL paths (not hreflang codes). */
export const SITEMAP_LOCALE_PREFIXES = I18N_LOCALES;

/** Path without locale prefix, no trailing slash. */
export function sitemapPathnameKey(page: string): string {
  const pathname = new URL(page).pathname.replace(/\/+$/, '') || '/';
  const parts = pathname.split('/').filter(Boolean);
  const first = parts[0];
  if (first && (SITEMAP_LOCALE_PREFIXES as readonly string[]).includes(first)) {
    const rest = parts.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }
  return pathname;
}

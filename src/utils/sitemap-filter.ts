/** Sitemap inclusion rules — mirror page-level noindex settings. */

import { isCommercialCanonicalBlogPostPath } from './blog-canonical-seo';
import { isNoindexBlogSlug, isNoindexExactPath } from './seo-noindex-paths';
import { sitemapPathnameKey } from './sitemap-urls';
import { getLocaleFromPath, isTranslatedPath } from '../i18n/locales';

const NOINDEX_PATH_PREFIXES = ['/internal', '/landing'] as const;

function getPathname(pageUrl: string): string {
  try {
    return new URL(pageUrl).pathname;
  } catch {
    return pageUrl;
  }
}

function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function isNoindexSectionPath(pathname: string): boolean {
  return NOINDEX_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function shouldIncludeInSitemap(pageUrl: string): boolean {
  let pathname: string;
  try {
    pathname = normalizePathname(sitemapPathnameKey(pageUrl));
  } catch {
    return false;
  }

  if (isNoindexSectionPath(pathname)) return false;
  // Language copies that are not real translations canonicalize to English.
  const rawPath = getPathname(pageUrl);
  if (getLocaleFromPath(rawPath) !== 'en' && !isTranslatedPath(rawPath)) return false;
  if (pathname === '/404') return false;
  if (/\/blog\/\d+$/.test(pathname)) return false;
  if (/\/category\/[^/]+\/\d+$/.test(pathname)) return false;
  // Tag archives are noindex while apps.blog.tag.robots.index is false
  if (pathname.startsWith('/tag/')) return false;
  // Cross-canonical blog posts defer to commercial owner URLs
  if (isCommercialCanonicalBlogPostPath(pathname)) return false;
  // C-end education + market-report pages (GSC bleed stop)
  if (isNoindexExactPath(pathname)) return false;
  // Consumer blog slugs without commercial owner
  const bareSlug = pathname.replace(/^\//, '');
  if (bareSlug && !bareSlug.includes('/') && isNoindexBlogSlug(bareSlug)) return false;

  return true;
}
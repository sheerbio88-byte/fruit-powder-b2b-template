/**
 * Paths / blog slugs kept out of organic discovery.
 */

const NOINDEX_EXACT_PATHS = new Set<string>(['/contact/thanks']);

/** No remaining C-end blog slugs — set kept empty intentionally. */
export const NOINDEX_BLOG_SLUGS = new Set<string>([]);

export function isNoindexExactPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return NOINDEX_EXACT_PATHS.has(normalized);
}

export function isNoindexBlogSlug(slug: string): boolean {
  return NOINDEX_BLOG_SLUGS.has(slug);
}

export const CONSUMER_EDUCATION_NOINDEX_PATHS = NOINDEX_EXACT_PATHS;

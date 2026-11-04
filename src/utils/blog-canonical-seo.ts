/** Maps hub-duplicate blog slugs to commercial owner URLs when needed. */

export const BLOG_COMMERCIAL_CANONICAL: Record<string, string> = {

};

const CTA_LABELS: Record<string, string> = {
  '/services/': 'OEM services',
  '/products/': 'Product catalog',
  '/contact/#inquiry-form': 'Request a quote',
};

const BLOG_CTA_PATHS: Record<string, string> = {
  'what-are-vegetable-powders-used-for': '/products/',
};

export const BLOG_COMMERCIAL_CANONICAL_SLUGS = new Set(Object.keys(BLOG_COMMERCIAL_CANONICAL));

export function isBlogCommercialCanonicalSlug(slug: string): boolean {
  return BLOG_COMMERCIAL_CANONICAL_SLUGS.has(slug);
}

export function isCommercialCanonicalBlogPostPath(pathname: string): boolean {
  const slug = pathname.replace(/\/+$/, '').replace(/^\//, '');
  if (!slug || slug.includes('/')) return false;
  return isBlogCommercialCanonicalSlug(slug);
}

export function getBlogCommercialCanonicalPath(slug: string): string | undefined {
  return BLOG_COMMERCIAL_CANONICAL[slug];
}

export function getBlogPostCtaTarget(slug: string): { href: string; label: string } {
  const href = BLOG_CTA_PATHS[slug] ?? '/contact/#inquiry-form';
  return { href, label: CTA_LABELS[href] ?? 'Request a quote' };
}

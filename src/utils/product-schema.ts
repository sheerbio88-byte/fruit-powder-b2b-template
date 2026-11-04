import { BRAND_NAME, ORGANIZATION_ID } from '~/utils/organization-schema';
import { getSiteUrl } from '~/utils/site-url';

export type ProductSchemaInput = {
  name: string;
  description?: string | null;
  /** Absolute URL or site-relative path */
  image?: string | null;
  /** Absolute product page URL */
  url: string;
  category?: string | null;
  /** ISO date (YYYY-MM-DD) for Offer.priceValidUntil; defaults to end of next calendar year */
  priceValidUntil?: string;
};

/**
 * Product JSON-LD for Google rich results.
 * B2B OEM/wholesale has no public retail price; include Offer with price 0
 * (quote-on-request) so GSC gets required offers|review|aggregateRating.
 * Do not invent review/aggregateRating.
 */
export function buildProductSchema(input: ProductSchemaInput) {
  const siteUrl = getSiteUrl();
  const image =
    input.image == null || input.image === ''
      ? undefined
      : input.image.startsWith('http')
        ? input.image
        : `${siteUrl}${input.image.startsWith('/') ? '' : '/'}${input.image}`;

  const priceValidUntil =
    input.priceValidUntil ?? `${new Date().getUTCFullYear() + 1}-12-31`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description || undefined,
    image,
    url: input.url,
    brand: { '@type': 'Brand', name: BRAND_NAME },
    category: input.category || undefined,
    offers: {
      '@type': 'Offer',
      url: input.url,
      priceCurrency: 'USD',
      // Quote-based wholesale: no public list price. Google requires price on Offer;
      // 0 marks inquiry/OEM pricing rather than inventing a retail figure.
      price: '0',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil,
      seller: {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: BRAND_NAME,
      },
    },
  };
}

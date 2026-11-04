import { getSiteUrl } from '~/utils/site-url';

export const ORGANIZATION_ID = `${getSiteUrl()}/#organization`;

/** Public brand name used site-wide */
export const BRAND_NAME = 'Sheer Superfood';
export const LOGO_PATH = '/wp-content/uploads/2025/12/cropped-cropped-logo03-e1765874141220.png';

export function buildOrganizationSchema() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: BRAND_NAME,
    alternateName: ['sheersuperfood', 'SheerHerb'],
    url: `${siteUrl}/`,
    logo: `${siteUrl}${LOGO_PATH}`,
    description:
      'Fruit and vegetable powder supplier for food, beverage, health product, and catering brands. OEM and bulk ingredients.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Room 1204, Vanke Huizhi Center, Yanta District',
      addressLocality: "Xi'an",
      addressRegion: 'Shaanxi',
      addressCountry: 'CN',
    },
    parentOrganization: { '@type': 'Organization', '@id': 'https://sheerherb-oem.com/#organization', name: "Xi'an Sheerherb Biological Technology Co., Ltd.", url: 'https://sheerherb-oem.com/' },
    sameAs: ['https://sheerdds.com/', 'https://sheerherb-oem.com/', 'https://naturalsheerherb.com/'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        url: `${siteUrl}/contact/`,
        availableLanguage: ['English'],
        areaServed: 'Worldwide',
      },
    ],
  };
}

export function buildManufacturingPlantSchema() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/about-us/#location`,
    name: BRAND_NAME,
    url: `${siteUrl}/about-us/`,
    parentOrganization: { '@id': ORGANIZATION_ID },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Room 1204, Vanke Huizhi Center, Yanta District',
      addressLocality: "Xi'an",
      addressRegion: 'Shaanxi',
      addressCountry: 'CN',
    },
    description: 'Fruit and vegetable powder supplier for bulk and OEM ingredient programs.',
    areaServed: 'Worldwide',
    knowsAbout: ['Fruit powder', 'Vegetable powder', 'Plant-based protein', 'Instant tea powder', 'OEM ingredients'],
  };
}

export function buildAboutPageSchema() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${siteUrl}/about-us/#webpage`,
    url: `${siteUrl}/about-us/`,
    name: 'About Sheer Superfood',
    description: 'About Sheer Superfood — fruit and vegetable powder supplier for food and supplement brands.',
    isPartOf: { '@type': 'WebSite', url: `${siteUrl}/` },
    about: { '@id': ORGANIZATION_ID },
  };
}

export function buildContactPageSchema() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${siteUrl}/contact/#webpage`,
    url: `${siteUrl}/contact/`,
    name: 'Contact Sheer Superfood',
    description: 'Request a quote for fruit powder, vegetable powder, plant protein, or OEM ingredients.',
    isPartOf: { '@type': 'WebSite', url: `${siteUrl}/` },
    mainEntity: { '@id': ORGANIZATION_ID },
  };
}

export function buildBlogPostingSchema(post: {
  title: string;
  excerpt?: string;
  publishDate: Date;
  updateDate?: Date;
  imageUrl?: string;
  url: string;
}) {
  const siteUrl = getSiteUrl();
  const image = post.imageUrl?.startsWith('http')
    ? post.imageUrl
    : post.imageUrl
      ? `${siteUrl}${post.imageUrl}`
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: post.url,
    mainEntityOfPage: post.url,
    datePublished: post.publishDate.toISOString(),
    dateModified: (post.updateDate ?? post.publishDate).toISOString(),
    author: { '@type': 'Organization', '@id': ORGANIZATION_ID },
    publisher: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/images/default.png` },
    },
    ...(image ? { image } : {}),
  };
}

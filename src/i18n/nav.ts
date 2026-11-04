import { pagePath, type Locale } from './locales';
import { categoryName } from './titles';
import { getUi } from './ui';

type NavGroup = { title?: string; text?: string; href?: string; links?: { text: string; href: string }[] };

const CATEGORY_LINKS = [
  { slug: 'fruit-powder', href: '/product-category/fruit-powder/' },
  { slug: 'vegetable-powder', href: '/product-category/vegetable-powder/' },
  { slug: 'plant-based-protein', href: '/product-category/plant-based-protein/' },
  { slug: 'instant-tea-powder', href: '/product-category/instant-tea-powder/' },
  { slug: 'greens-powder', href: '/product-category/greens-powder/' },
  { slug: 'dried-fruit', href: '/product-category/dried-fruit/' },
  { slug: 'dried-vegetables', href: '/product-category/dried-vegetables/' },
  { slug: 'adaptogens-powder', href: '/product-category/adaptogens-powder/' },
];

export function getHeaderFooter(locale: Locale) {
  const ui = getUi(locale);
  const p = (path: string) => pagePath(path, locale);
  const home = p('/');
  const year = new Date().getFullYear();
  const productLinks = [
    { text: ui.catalog, href: p('/products/') },
    ...CATEGORY_LINKS.map((link) => ({
      text: categoryName(link.slug, locale),
      href: p(link.href),
    })),
  ];
  return {
    trustLeft: ui.trustLeft,
    trustRight: ui.trustRight,
    tagline: ui.tagline,
    blurb: ui.blurb,
    homeHref: home,
    ctaBandTitle: ui.ctaBandTitle,
    ctaBandBody: ui.ctaBandBody,
    ctaBandButton: ui.ctaBandButton,
    quoteHref: p('/contact/#inquiry-form'),
    header: {
      links: [
        { text: ui.home, href: home },
        { text: ui.products, links: productLinks },
        { text: ui.oem, href: p('/services/') },
        { text: ui.blog, href: p('/blog/') },
        {
          text: ui.company,
          links: [
            { text: ui.about, href: p('/about-us/') },
            { text: ui.contact, href: p('/contact/') },
          ],
        },
      ] as NavGroup[],
      actions: [{ text: ui.quote, href: p('/contact/#inquiry-form'), variant: 'primary' as const }],
    },
    footer: {
      links: [
        { title: ui.products, links: productLinks },
        { title: ui.oem, links: [{ text: ui.oem, href: p('/services/') }] },
        {
          title: ui.company,
          links: [
            { text: ui.about, href: p('/about-us/') },
            { text: ui.contact, href: p('/contact/#inquiry-form') },
            { text: ui.blog, href: p('/blog/') },
          ],
        },
      ],
      secondaryLinks: [{ text: ui.privacy, href: p('/privacy-policy-2/') }],
      socialLinks: [],
      footNote: ui.footnote.replace('{year}', String(year)).replace('{home}', home),
    },
  };
}

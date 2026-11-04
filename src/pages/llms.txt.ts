/**
 * /llms.txt — LLM-oriented site guide (https://llmstxt.org/)
 */
import { tagSiteLinksForLlm } from '~/utils/llm-urls';
import products from '~/data/catalog/products.json';
import categories from '~/data/catalog/categories.json';
import { KEY_FACTS } from '~/data/key-facts';

export const prerender = true;

const origin = 'https://sheersuperfood.com';
const categoryLines = categories
  .map((category) => `- [${category.name}](${origin}${category.path})`)
  .join('\n');
const productLines = products
  .map((product) => {
    const spec = (product.shortText || product.description || '').replace(/\s+/g, ' ').trim();
    return `- [${product.title}](${origin}${product.path})${spec ? `: ${spec}` : ''}`;
  })
  .join('\n');

const factLines = KEY_FACTS.map((f) => `- ${f.label}: ${f.text}${f.href ? ` (${origin}${f.href})` : ''}`).join('\n');

const BODY = `# Sheer Superfood

> Fruit and vegetable powder supplier. Bulk ingredients and OEM for food, beverage, and supplement brands. Site: ${origin}/

Sheer Superfood is the fruit and vegetable powder site of SheerHerb, Room 1204, Vanke Huizhi Center, Yanta District, Xi'an, Shaanxi, China. It sells bulk powders and OEM programs to businesses; it is not a consumer checkout.

## Key facts

${factLines}

## Pages

- [Home](${origin}/)
- [Products](${origin}/products/)
- [OEM](${origin}/services/)
- [About Us](${origin}/about-us/)
- [Contact](${origin}/contact/)
- [Privacy Policy](${origin}/privacy-policy-2/)
- [Blog](${origin}/blog/)
- [What are vegetable powders used for?](${origin}/what-are-vegetable-powders-used-for/)

## Product categories

${categoryLines}

## Products

${productLines}

## How to inquire

- Inquiry form: ${origin}/contact/#inquiry-form (name, email, optional phone/WhatsApp, product, company type, channel, volume, message). Share the product, specification, and volume for a quote.
`;

export const GET = async () => {
  const body = tagSiteLinksForLlm(BODY.replace(/^\uFEFF/, '').trimStart()) + '\n';

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};

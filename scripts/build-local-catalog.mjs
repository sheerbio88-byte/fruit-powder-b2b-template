/**
 * Build catalog JSON from the local WordPress tree, saved HTML, and Yoast files.
 * The live site is behind a captcha, so this does not fetch it.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/Users/Administrator/Desktop/sheersuperfood';
const WP_UPLOADS = 'C:/Users/Administrator/Desktop/sheersuperfood-wp/wp-content/uploads';
const PUBLIC_UPLOADS = path.join(ROOT, 'public/wp-content/uploads');
const OUT = path.join(ROOT, 'src/data/catalog');
const SAMPLE = 'C:/Users/Administrator/AppData/Local/Temp/ssf-sample';

const SQL_PATH = 'C:/Users/Administrator/Downloads/dbtco7ouqhfkdu.sql';
const CATEGORY_ORDER = [
  'fruit-powder',
  'fruit-powder/freeze-dried-fruit-powder',
  'vegetable-powder',
  'plant-based-protein',
  'instant-tea-powder',
  'greens-powder',
  'dried-fruit',
  'dried-vegetables',
  'adaptogens-powder',
];

function titleFromSlug(slug) {
  const special = {
    'lions-mane-powder': "Lion's Mane Powder",
    'applepectin-powder': 'Apple Pectin Powder',
    'best-pea-protein-powder': 'Best Pea Protein Powder',
  };
  if (special[slug]) return special[slug];
  return slug.split('-').map((part) => (part === 'and' ? 'and' : part.charAt(0).toUpperCase() + part.slice(1))).join(' ');
}

function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(html) {
  const withBreaks = html.replace(/<br\s*\/?>/gi, '\n');
  return decodeEntities(withBreaks.replace(/<[^>]+>/g, ' ')).trim();
}

function unescapeLlms(value) {
  return value.replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1').replace(/\s+/g, ' ').trim();
}

function parseLlms() {
  const text = fs.readFileSync('C:/Users/Administrator/Desktop/sheersuperfood-wp/llms.txt', 'utf8');
  const map = new Map();
  const pattern = /- \[([^\]]+)\]\(https:\/\/sheersuperfood.com\/product\/([^/]+)\/\):([\s\S]*?)(?=\n- \[|\n## |\n$)/g;
  for (const match of text.matchAll(pattern)) {
    map.set(match[2], { title: match[1], shortText: unescapeLlms(match[3]) });
  }
  return map;
}

function preferOriginal(rel) {
  const sized = rel.match(/^(.*)-\d+x\d+(\.[a-z0-9]+)$/i);
  if (!sized) return rel;
  const original = `${sized[1]}${sized[2]}`;
  return fs.existsSync(path.join(WP_UPLOADS, original)) ? original : rel;
}

function copyUpload(urlPath) {
  const rel = preferOriginal(decodeURIComponent(urlPath.replace(/^\/wp-content\/uploads\//, '')));
  const src = path.join(WP_UPLOADS, rel);
  const dest = path.join(PUBLIC_UPLOADS, rel);
  if (!fs.existsSync(src)) return { publicPath: `/wp-content/uploads/${rel.replace(/\\/g, '/')}`, ok: false };
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
  return { publicPath: `/wp-content/uploads/${rel.replace(/\\/g, '/')}`, ok: true };
}

function parseSitemap() {
  const xml = fs.readFileSync('C:/Users/Administrator/AppData/Local/Temp/ssf-sitemaps/product-sitemap.xml', 'utf8');
  const chunks = xml.split('<url>').slice(1);
  const products = [];
  for (const chunk of chunks) {
    const loc = chunk.match(/<loc>([^<]+)<\/loc>/)?.[1] || '';
    if (!loc.includes('/product/')) continue;
    const slug = loc.match(/\/product\/([^/]+)\//)[1];
    const image = chunk.match(/<image:loc>([^<]+)<\/image:loc>/)?.[1] || '';
    let imagePath = '';
    if (image) {
      const pathname = new URL(image).pathname;
      imagePath = copyUpload(pathname).publicPath;
    }
    products.push({ slug, image: imagePath });
  }
  return products;
}

function shortHtmlFromText(text) {
  if (!text) return '';
  const lines = text.split(/(?=Appearance:|Extraction|Nutrients:|Packaging|Storage|Latin name:|Main components:)/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return `<p>${text}</p>`;
  return lines.map((line) => `<p>${line}</p>`).join('');
}

function parseTomato() {
  const html = fs.readFileSync(path.join(SAMPLE, 'tomato.html'), 'utf8');
  const shortRaw = html.match(/woocommerce-product-details__short-description">([\s\S]*?)<\/div>/i)?.[1] || '';
  const bodyRaw = html.match(/id="tab-description"[\s\S]*?>([\s\S]*?)<\/div>\s*<\/article>/i)?.[1] || '';
  const clean = (fragment) => fragment
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/https?:\/\/(?:www\.)?sheersuperfood\.com/gi, '')
    .replace(/<a\b([^>]*)>/gi, (_, attrs) => {
      const href = attrs.match(/href="([^"]+)"/i)?.[1] || '';
      return href ? `<a href="${href}">` : '<a>';
    })
    .replace(/<(?!\/?(?:p|h2|h3|ol|ul|li|a|strong|em|br)\b)[^>]+>/gi, '');
  return {
    shortText: stripTags(shortRaw),
    shortHtml: clean(shortRaw),
    bodyHtml: clean(bodyRaw),
    seoTitle: 'Tomato Powder Supplier | Natural Vegetable Powder Ingredient',
    description: 'Tomato Powder is made from fresh tomatoes through advanced drying technology. It retains natural flavor, color, and nutrients, widely used in sauces, soups, beverages, and food applications.',
  };
}

function extractBlocks(file) {
  if (!fs.existsSync(file)) return [];
  const html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main[\s\S]*<\/main>/i)?.[0] || '';
  const cleaned = main.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<form[\s\S]*?<\/form>/gi, '');
  const blocks = [];
  const pattern = /<(h[1-6]|p|li)\b[^>]*>([\s\S]*?)<\/\1>|<img\b[^>]*>/gi;
  let match;
  while ((match = pattern.exec(cleaned))) {
    if (match[0].startsWith('<img')) {
      const src = match[0].match(/\bsrc="([^"]+)"/i)?.[1] || '';
      const alt = decodeEntities(match[0].match(/\balt="([^"]*)"/i)?.[1] || '');
      if (!src.includes('/wp-content/uploads/') || /logo|spinner|submit-spin/i.test(src)) continue;
      const copied = copyUpload(new URL(src, 'https://sheersuperfood.com').pathname);
      if (!copied.ok) continue;
      blocks.push({ type: 'img', src: copied.publicPath, alt });
      continue;
    }
    const text = polishText(stripTags(match[2]));
    if (!text || text.length < 2) continue;
    const type = match[1].toLowerCase() === 'h1' ? 'h2' : match[1].toLowerCase();
    blocks.push({ type, text });
  }
  const seen = new Set();
  return blocks.filter((block) => {
    const key = `${block.type}:${block.text || block.src}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 60);
}

function polishText(value) {
  return value
    .split('\n')
    .map((line) =>
      line
        .replace(/:([A-Za-z])/g, ': $1')
        .replace(/SuperfoodCoffee/g, 'Superfood Coffee')
        .replace(/HuizhiCenter/g, 'Huizhi Center')
        .replace(/(?<=\s)&(?=\S)/g, '& ')
        .replace(/,(?=[A-Za-z])/g, ', ')
        .replace(/[ \t]+/g, ' ')
        .trim()
    )
    .filter(Boolean)
    .join('\n');
}

function fixTypos(value) {
  return value.replace(/\bfurit\b/gi, 'fruit');
}

function fixAboutBlocks(blocks) {
  const text = 'SheerHerb is a modern high-tech enterprise integrating R&D, production, and sales of fruit and vegetable powders. We are deeply involved in the field of natural raw materials, focusing on transforming the natural nutrition and healthy flavor of fresh fruits and vegetables into high-quality, easy-to-use powder products through spray drying and vacuum freeze-drying technologies. We are committed to providing excellent raw materials and exclusive customization for global food, beverage, health product, catering, and personal consumer brands.';
  return blocks.map((block) => (
    block.type === 'p' && block.text && block.text.includes('enterprise')
      ? { ...block, text }
      : block
  ));
}

function sqlEscape(char) {
  if (char === 'n') return '\n';
  if (char === 'r') return '\r';
  if (char === 't') return '\t';
  if (char === '0') return '\0';
  return char;
}

function parseSqlTuples(section) {
  const rows = [];
  let i = 0;
  while (i < section.length) {
    const values = section.indexOf('VALUES', i);
    if (values === -1) break;
    i = section.indexOf('(', values);
    if (i === -1) break;
    while (i !== -1 && i < section.length && section[i] === '(') {
      const fields = [];
      let j = i + 1;
      let current = '';
      let inString = false;
      while (j < section.length) {
        const char = section[j];
        if (inString) {
          if (char === '\\') {
            current += sqlEscape(section[j + 1] ?? '');
            j += 2;
            continue;
          }
          if (char === "'" && section[j + 1] === "'") {
            current += "'";
            j += 2;
            continue;
          }
          if (char === "'") {
            inString = false;
            j += 1;
            continue;
          }
          current += char;
          j += 1;
          continue;
        }
        if (char === "'") {
          inString = true;
          j += 1;
          continue;
        }
        if (char === ',') {
          fields.push(current.trim());
          current = '';
          j += 1;
          continue;
        }
        if (char === ')') {
          fields.push(current.trim());
          rows.push(fields);
          j += 1;
          break;
        }
        current += char;
        j += 1;
      }
      while (j < section.length && /\s/.test(section[j])) j += 1;
      if (section[j] === ',') {
        i = section.indexOf('(', j);
        continue;
      }
      i = j;
      break;
    }
  }
  return rows;
}

function sliceSqlTable(sql, name) {
  const marker = `INSERT INTO \`${name}\``;
  const start = sql.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${name} in the SQL dump`);
  const end = sql.indexOf('\nCREATE TABLE', start + marker.length);
  return sql.slice(start, end === -1 ? sql.length : end);
}

function plainText(html) {
  return fixTypos(stripTags(html || '')).replace(/\s+/g, ' ').trim();
}

function localHref(href) {
  return href.replace(/^https?:\/\/(?:www\.)?sheersuperfood\.com/i, '') || href;
}

function cleanProductHtml(html) {
  let value = (html || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\u00a0/g, ' ');
  value = value.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  value = value.replace(/<!--[\s\S]*?-->/g, '');
  value = value.replace(/<\/?([a-z0-9:-]+)([^>]*)>/gi, (full, rawName, rest) => {
    const tag = rawName.toLowerCase();
    if (tag === 'br') return '<br>';
    if (tag === 'img') {
      if (full.startsWith('</')) return '';
      let src = rest.match(/\bsrc="([^"]+)"/i)?.[1] || '';
      const alt = decodeEntities(rest.match(/\balt="([^"]*)"/i)?.[1] || '');
      if (!src) return '';
      try {
        if (/^https?:/i.test(src)) src = new URL(src).pathname;
      } catch {
        // keep the original src
      }
      if (src.includes('/wp-content/uploads/')) src = copyUpload(src).publicPath;
      return `<img src="${src}" alt="${alt.replace(/"/g, '&quot;')}">`;
    }
    if (tag === 'a') {
      if (full.startsWith('</')) return '</a>';
      const href = localHref(rest.match(/\bhref="([^"]+)"/i)?.[1] || '');
      return href ? `<a href="${href}">` : '<a>';
    }
    if (['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote'].includes(tag)) {
      return full.startsWith('</') ? `</${tag}>` : `<${tag}>`;
    }
    if (tag === 'b') return full.startsWith('</') ? '</strong>' : '<strong>';
    if (tag === 'i') return full.startsWith('</') ? '</em>' : '<em>';
    return '';
  });
  value = fixTypos(value).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const pieces = value.split(/(<h[2-4]>[\s\S]*?<\/h[2-4]>|<ul>[\s\S]*?<\/ul>|<ol>[\s\S]*?<\/ol>|<table>[\s\S]*?<\/table>|<blockquote>[\s\S]*?<\/blockquote>|<p>[\s\S]*?<\/p>)/i);
  return pieces.map((piece) => {
    const text = piece.trim();
    if (!text || /^(\s|&nbsp;|<br\s*\/?>)*$/i.test(text)) return '';
    if (/^<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>$/i.test(text)) return '';
    const imageHeading = text.match(/^<h[2-4]>\s*(<img\b[^>]*>)\s*<\/h[2-4]>$/i);
    if (imageHeading) return imageHeading[1];
    if (text.startsWith('<')) return text;
    return text.split(/\n{2,}/).map((paragraph) => `<p>${paragraph.replace(/\n+/g, ' ').trim()}</p>`).filter((paragraph) => !/^<p>(\s|&nbsp;)*<\/p>$/i.test(paragraph)).join('');
  }).join('\n');
}

function paragraphsFromText(text) {
  const lines = fixTypos(text || '').replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ').split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return lines.map((line) => `<p>${line.replace(/</g, '&lt;')}</p>`).join('');
}

function loadSqlCatalog() {
  if (!fs.existsSync(SQL_PATH)) throw new Error(`WordPress SQL dump not found: ${SQL_PATH}`);
  const sql = fs.readFileSync(SQL_PATH, 'utf8');
  const posts = parseSqlTuples(sliceSqlTable(sql, 'kqi_posts'));
  const terms = parseSqlTuples(sliceSqlTable(sql, 'kqi_terms'));
  const taxonomies = parseSqlTuples(sliceSqlTable(sql, 'kqi_term_taxonomy'));
  const relationships = parseSqlTuples(sliceSqlTable(sql, 'kqi_term_relationships'));
  const meta = parseSqlTuples(sliceSqlTable(sql, 'kqi_postmeta'));

  const termById = new Map(terms.map((row) => [row[0], { name: decodeEntities(row[1]), slug: row[2] }]));
  const taxById = new Map(taxonomies.map((row) => [row[0], row]));
  const taxByTerm = new Map(taxonomies.map((row) => [row[1], row]));
  const products = new Map();
  for (const row of posts) {
    if (row[20] !== 'product' || row[7] !== 'publish') continue;
    products.set(row[0], {
      slug: row[11],
      title: decodeEntities(row[5]).trim(),
      content: row[4] || '',
      excerpt: row[6] || '',
    });
  }

  const metaByPost = new Map();
  for (const row of meta) {
    if (!products.has(row[1])) continue;
    if (row[2] !== 'rank_math_title' && row[2] !== 'rank_math_description') continue;
    if (!metaByPost.has(row[1])) metaByPost.set(row[1], {});
    metaByPost.get(row[1])[row[2]] = decodeEntities(row[3] || '').trim();
  }

  function categorySlug(termId) {
    const slugs = [];
    const seen = new Set();
    let current = termId;
    while (current && current !== '0' && !seen.has(current)) {
      seen.add(current);
      const term = termById.get(current);
      if (!term) break;
      slugs.unshift(term.slug);
      current = taxByTerm.get(current)?.[4] || '0';
    }
    return slugs.join('/');
  }

  const categories = [];
  const tags = [];
  for (const row of taxonomies) {
    if (row[2] !== 'product_cat' && row[2] !== 'product_tag') continue;
    const term = termById.get(row[1]);
    if (!term || term.slug === 'uncategorized') continue;
    const slug = row[2] === 'product_cat' ? categorySlug(row[1]) : term.slug;
    const descriptionText = plainText(row[3] || '');
    const record = {
      taxonomyId: row[0],
      slug,
      name: term.name,
      path: row[2] === 'product_cat' ? `/product-category/${slug}/` : `/product-tag/${slug}/`,
      seoTitle: `${term.name} | Sheer Superfood`,
      description: descriptionText || `${term.name} from Sheer Superfood.`,
      introHtml: descriptionText ? paragraphsFromText(row[3] || '') : '',
    };
    if (row[2] === 'product_cat') categories.push(record);
    else tags.push(record);
  }
  categories.sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.slug);
    const bi = CATEGORY_ORDER.indexOf(b.slug);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });

  const byTaxonomy = new Map();
  for (const row of relationships) {
    if (!products.has(row[0])) continue;
    if (!byTaxonomy.has(row[0])) byTaxonomy.set(row[0], []);
    byTaxonomy.get(row[0]).push(row[1]);
  }

  const bySlug = new Map();
  for (const [id, product] of products) {
    const taxonomyIds = byTaxonomy.get(id) || [];
    const productCategories = categories.filter((category) => taxonomyIds.includes(category.taxonomyId));
    const productTags = tags.filter((tag) => taxonomyIds.includes(tag.taxonomyId));
    const seo = metaByPost.get(id) || {};
    bySlug.set(product.slug, {
      ...product,
      categories: productCategories.map(({ name, path: categoryPath, slug }) => ({ name, path: categoryPath, slug })),
      tags: productTags.map(({ name, path: tagPath, slug }) => ({ name, path: tagPath, slug })),
      rankTitle: seo.rank_math_title || '',
      rankDescription: seo.rank_math_description || '',
    });
  }

  return {
    bySlug,
    categories: categories.map(({ slug, name, path: categoryPath, seoTitle, description, introHtml }) => ({
      slug, name, path: categoryPath, seoTitle, description, introHtml,
    })),
    tags: tags.map(({ slug, name, path: tagPath, seoTitle, description }) => ({
      slug, name, path: tagPath, seoTitle, description,
    })),
  };
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const sqlCatalog = loadSqlCatalog();
  const sitemapProducts = parseSitemap();
  const counts = {};
  const missingSql = [];
  const products = sitemapProducts.map((item) => {
    const fromSql = sqlCatalog.bySlug.get(item.slug);
    if (!fromSql) missingSql.push(item.slug);
    const title = fromSql?.title || titleFromSlug(item.slug);
    const categories = fromSql?.categories || [];
    for (const category of categories) counts[category.slug] = (counts[category.slug] || 0) + 1;
    const bodyHtml = cleanProductHtml(fromSql?.content || '');
    const excerpt = fromSql?.excerpt || '';
    const shortText = plainText(excerpt);
    const shortHtml = shortText ? (excerpt.includes('<') ? cleanProductHtml(excerpt) : paragraphsFromText(excerpt)) : '';
    const description = plainText(fromSql?.rankDescription || '') || shortText || plainText(bodyHtml).slice(0, 180);
    const rankTitle = fromSql?.rankTitle && !fromSql.rankTitle.includes('%') ? fromSql.rankTitle : '';
    const seoTitle = rankTitle && rankTitle.toLowerCase() !== title.toLowerCase()
      ? (rankTitle.includes('Sheer') ? rankTitle : `${rankTitle} | Sheer Superfood`)
      : `${title} Supplier | Sheer Superfood`;
    return {
      slug: item.slug,
      path: `/product/${item.slug}/`,
      title,
      seoTitle,
      description,
      image: item.image,
      imageAlt: title,
      gallery: item.image ? [item.image] : [],
      shortText,
      shortHtml,
      bodyHtml,
      categories,
      tags: fromSql?.tags || [],
    };
  });

  const pages = {
    '/': { path: '/', seoTitle: 'Fruit & Vegetable Powder Supplier | Sheer Superfood', description: 'Fruit powders, vegetable powders, plant protein, and instant tea powder for food, beverage, and supplement brands.', blocks: extractBlocks(path.join(SAMPLE, 'home.html')), emails: ['sales@example.com'] },
    '/about-us/': { path: '/about-us/', seoTitle: 'About Us | Sheer Superfood', description: 'About Sheer Superfood, supplier of fruit and vegetable powders.', blocks: fixAboutBlocks(extractBlocks(path.join(SAMPLE, 'about.html'))), emails: ['sales@example.com'] },
    '/services/': { path: '/services/', seoTitle: 'OEM | Sheer Superfood', description: 'OEM and custom fruit and vegetable powder programs.', blocks: extractBlocks(path.join(SAMPLE, 'services.html')), emails: ['sales@example.com'] },
    '/contact/': { path: '/contact/', seoTitle: 'Contact | Sheer Superfood', description: 'Contact Sheer Superfood for fruit and vegetable powder quotes.', blocks: extractBlocks(path.join(SAMPLE, 'contact.html')), emails: ['sales@example.com'] },
    '/products/': { path: '/products/', seoTitle: 'Products | Sheer Superfood', description: 'Fruit powder, vegetable powder, plant protein, instant tea, and dried ingredients.', blocks: extractBlocks(path.join(SAMPLE, 'products.html')), emails: [] },
    '/what-are-vegetable-powders-used-for/': { path: '/what-are-vegetable-powders-used-for/', seoTitle: 'What are vegetable powders used for?', description: 'How vegetable powders are used in food, beverages, and supplements.', blocks: extractBlocks(path.join(SAMPLE, 'post.html')), emails: [] },
  };

  if (missingSql.length) throw new Error(`SQL dump has no published product for: ${missingSql.join(', ')}`);
  const usedTagSlugs = new Set(products.flatMap((product) => product.tags.map((tag) => tag.slug)));
  const tags = sqlCatalog.tags.filter((tag) => usedTagSlugs.has(tag.slug));
  const missing = products.filter((product) => product.image && !fs.existsSync(path.join(ROOT, 'public', product.image.replace(/^\//, ''))));
  const withBody = products.filter((product) => product.bodyHtml.length > 80).length;
  fs.writeFileSync(path.join(OUT, 'products.json'), JSON.stringify(products, null, 2));
  fs.writeFileSync(path.join(OUT, 'categories.json'), JSON.stringify(sqlCatalog.categories, null, 2));
  fs.writeFileSync(path.join(OUT, 'tags.json'), JSON.stringify(tags, null, 2));
  fs.writeFileSync(path.join(OUT, 'pages.json'), JSON.stringify(pages, null, 2));
  console.log(JSON.stringify({
    products: products.length,
    counts,
    withBody,
    tagged: products.filter((product) => product.tags.length).map((product) => product.slug),
    missingImages: missing.length,
    pageBlocks: Object.fromEntries(Object.entries(pages).map(([key, page]) => [key, page.blocks.length])),
  }, null, 2));
}

main();

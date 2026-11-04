/**
 * Pull indexed sheersuperfood.com pages into src/data/catalog
 * and copy referenced uploads from the local WordPress tree.
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('C:/Users/Administrator/Desktop/sheersuperfood');
const WP_UPLOADS = 'C:/Users/Administrator/Desktop/sheersuperfood-wp/wp-content/uploads';
const PUBLIC_UPLOADS = path.join(ROOT, 'public/wp-content/uploads');
const OUT = path.join(ROOT, 'src/data/catalog');
const SITEMAP_DIR = 'C:/Users/Administrator/AppData/Local/Temp/ssf-sitemaps';
const SAMPLE_DIR = 'C:/Users/Administrator/AppData/Local/Temp/ssf-sample';
const CACHE_DIR = 'C:/Users/Administrator/AppData/Local/Temp/ssf-html';
const SAMPLE_BY_PATH = {
  '/': 'home.html',
  '/about-us/': 'about.html',
  '/services/': 'services.html',
  '/contact/': 'contact.html',
  '/products/': 'products.html',
  '/what-are-vegetable-powders-used-for/': 'post.html',
  '/product/tomato-powder/': 'tomato.html',
};

const PAGE_URLS = [
  'https://sheersuperfood.com/',
  'https://sheersuperfood.com/about-us/',
  'https://sheersuperfood.com/services/',
  'https://sheersuperfood.com/contact/',
  'https://sheersuperfood.com/privacy-policy-2/',
  'https://sheersuperfood.com/products/',
  'https://sheersuperfood.com/blog/',
  'https://sheersuperfood.com/what-are-vegetable-powders-used-for/',
  'https://sheersuperfood.com/category/uncategorized/',
];

function decodeEntities(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).trim();
}

function metaContent(html, key) {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${key}["']`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeEntities(match[1]);
  }
  return '';
}

function locsFrom(file) {
  const xml = fs.readFileSync(file, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function curl(url) {
  return new Promise((resolve, reject) => {
    execFile(
      'curl.exe',
      [
        '-fsSL',
        '--compressed',
        '--retry',
        '3',
        '--retry-all-errors',
        '--retry-delay',
        '1',
        '--max-time',
        '45',
        '-A',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        '-H',
        'Accept: text/html',
        url,
      ],
      { maxBuffer: 25 * 1024 * 1024, encoding: 'utf8' },
      (error, stdout) => {
        if (error) reject(new Error(`${url} ${error.message}`));
        else resolve(stdout);
      }
    );
  });
}

function cacheFile(url) {
  const slug = new URL(url).pathname.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home';
  return path.join(CACHE_DIR, `${slug}.html`);
}

async function fetchHtml(url) {
  const cached = cacheFile(url);
  if (fs.existsSync(cached) && fs.statSync(cached).size > 800) return fs.readFileSync(cached, 'utf8');
  const sampleName = SAMPLE_BY_PATH[new URL(url).pathname];
  try {
    const html = await curl(url);
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cached, html);
    return html;
  } catch (error) {
    if (sampleName && fs.existsSync(path.join(SAMPLE_DIR, sampleName))) {
      console.warn(`sample fallback ${url}`);
      return fs.readFileSync(path.join(SAMPLE_DIR, sampleName), 'utf8');
    }
    throw error;
  }
}

async function mapPool(items, limit, worker) {
  const results = new Array(items.length);
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function preferOriginal(rel) {
  const sized = rel.match(/^(.*)-\d+x\d+(\.[a-z0-9]+)$/i);
  if (!sized) return rel;
  const original = `${sized[1]}${sized[2]}`;
  if (fs.existsSync(path.join(WP_UPLOADS, original))) return original;
  return rel;
}

const copied = new Set();

function localizeUploads(url) {
  if (!url || !url.includes('/wp-content/uploads/')) return url || '';
  let pathname = url;
  try {
    pathname = new URL(url, 'https://sheersuperfood.com').pathname;
  } catch {
    return url;
  }
  const rel = preferOriginal(decodeURIComponent(pathname.replace(/^\/wp-content\/uploads\//, '')));
  const src = path.join(WP_UPLOADS, rel);
  const dest = path.join(PUBLIC_UPLOADS, rel);
  const publicPath = `/wp-content/uploads/${rel.replace(/\\/g, '/')}`;
  if (fs.existsSync(src)) {
    if (!copied.has(dest)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      copied.add(dest);
    }
    return publicPath;
  }
  return publicPath;
}

function rewriteHtml(html) {
  return html
    .replace(/https?:\/\/(?:www\.)?sheersuperfood\.com/gi, '')
    .replace(/(src|href|data-src)="([^"]+)"/gi, (_, attr, value) => {
      const next = value.includes('/wp-content/uploads/') ? localizeUploads(value) : value;
      return `${attr}="${next}"`;
    });
}

function sanitizeFragment(html) {
  let fragment = rewriteHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sclass="[^"]*"/gi, '')
    .replace(/\sdata-[a-z0-9-]+="[^"]*"/gi, '')
    .replace(/\ssrcset="[^"]*"/gi, '')
    .replace(/\ssizes="[^"]*"/gi, '')
    .replace(/\sloading="[^"]*"/gi, '')
    .replace(/\sdecoding="[^"]*"/gi, '')
    .replace(/\swidth="[^"]*"/gi, '')
    .replace(/\sheight="[^"]*"/gi, '')
    .replace(/<img\b([^>]*?)\/?>/gi, (_, attrs) => {
      const src = attrs.match(/\bsrc="([^"]+)"/i)?.[1] || '';
      const alt = attrs.match(/\balt="([^"]*)"/i)?.[1] || '';
      if (!src || src.includes('submit-spin') || src.endsWith('.svg')) return '';
      return `<img src="${src}" alt="${alt}" />`;
    });
  fragment = fragment.replace(/<(?!\/?(?:p|h2|h3|h4|ul|ol|li|a|img|strong|em|br|table|thead|tbody|tr|th|td)\b)[^>]+>/gi, '');
  return fragment.replace(/\n{3,}/g, '\n\n').trim();
}

function links(html, pattern) {
  const found = [];
  const seen = new Set();
  for (const match of html.matchAll(pattern)) {
    const href = match[1];
    const name = stripTags(match[2] || '');
    if (!name || seen.has(href)) continue;
    seen.add(href);
    const url = new URL(href, 'https://sheersuperfood.com');
    found.push({
      name,
      path: url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`,
      slug: url.pathname.replace(/^\/|\/$/g, ''),
    });
  }
  return found;
}

function parseProduct(html, url) {
  const slug = new URL(url).pathname.replace(/^\/product\/|\/$/g, '');
  const h1 = stripTags(html.match(/<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  const shortRaw = html.match(/woocommerce-product-details__short-description">([\s\S]*?)<\/div>/i)?.[1] || '';
  const bodyRaw = html.match(/id="tab-description"[\s\S]*?>([\s\S]*?)<\/div>\s*<\/article>/i)?.[1] || '';
  const image =
    html.match(/class="woocommerce-product-gallery"[\s\S]*?data-src="([^"]+)"/i)?.[1] ||
    html.match(/class="woocommerce-product-gallery"[\s\S]*?<img[^>]+src="([^"]+)"/i)?.[1] ||
    metaContent(html, 'og:image');
  const categories = links(html.match(/class="posted_in"[\s\S]*?<\/span>/i)?.[0] || '', /href="([^"]*product-category[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi);
  const tags = links(html.match(/class="tagged_as"[\s\S]*?<\/span>/i)?.[0] || '', /href="([^"]*product-tag[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi);
  const gallery = [];
  const galleryHtml = html.match(/class="woocommerce-product-gallery"[\s\S]*?<\/figure>/i)?.[0] || '';
  for (const match of galleryHtml.matchAll(/data-src="([^"]+)"/g)) gallery.push(localizeUploads(match[1]));
  return {
    slug,
    path: `/product/${slug}/`,
    title: h1 || slug,
    seoTitle: metaContent(html, 'og:title') || stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || ''),
    description: metaContent(html, 'og:description') || metaContent(html, 'description'),
    image: localizeUploads(image),
    imageAlt: h1 || slug,
    gallery: [...new Set(gallery.filter(Boolean))],
    shortText: stripTags(shortRaw),
    shortHtml: sanitizeFragment(shortRaw),
    bodyHtml: sanitizeFragment(bodyRaw),
    categories: categories.map((item) => ({
      name: item.name,
      path: `/${item.slug}/`.replace(/\/{2,}/g, '/'),
      slug: item.slug.replace(/^product-category\//, ''),
    })),
    tags: tags.map((item) => ({
      name: item.name,
      path: `/${item.slug}/`,
      slug: item.slug.replace(/^product-tag\//, ''),
    })),
  };
}

function extractBlocks(html) {
  const main = html.match(/<main[\s\S]*<\/main>/i)?.[0] || html;
  const cleaned = main
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<form[\s\S]*?<\/form>/gi, '');
  const blocks = [];
  const pattern = /<(h[1-6]|p|li)\b[^>]*>([\s\S]*?)<\/\1>|<img\b[^>]*>/gi;
  let match;
  while ((match = pattern.exec(cleaned))) {
    if (match[0].startsWith('<img')) {
      const src = match[0].match(/\bsrc="([^"]+)"/i)?.[1] || match[0].match(/\bdata-src="([^"]+)"/i)?.[1] || '';
      const alt = decodeEntities(match[0].match(/\balt="([^"]*)"/i)?.[1] || '');
      if (!src || src.includes('submit-spin') || src.includes('data:image') || /logo|icon|spinner/i.test(src)) continue;
      const local = localizeUploads(src);
      if (!local.includes('/wp-content/uploads/')) continue;
      blocks.push({ type: 'img', src: local, alt });
      continue;
    }
    const text = stripTags(match[2]);
    if (!text || text.length < 2) continue;
    if (/cookie|wordpress|woocommerce|elementor/i.test(text) && text.length < 40) continue;
    const type = match[1].toLowerCase();
    blocks.push({ type: type === 'h1' ? 'h2' : type, text });
  }
  const deduped = [];
  const seen = new Set();
  for (const block of blocks) {
    const key = `${block.type}:${block.text || block.src}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(block);
  }
  return deduped.slice(0, 80);
}

function parsePage(html, url) {
  const pathname = new URL(url).pathname;
  return {
    path: pathname.endsWith('/') ? pathname : `${pathname}/`,
    seoTitle: metaContent(html, 'og:title') || stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || ''),
    description: metaContent(html, 'og:description') || metaContent(html, 'description'),
    blocks: extractBlocks(html),
    emails: [...html.matchAll(/data-cfemail="([0-9a-f]+)"/gi)].map((match) => decodeCf(match[1])),
  };
}

function decodeCf(hex) {
  const key = parseInt(hex.slice(0, 2), 16);
  let out = '';
  for (let i = 2; i < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  return out;
}

function parseCategory(html, url) {
  const pathname = new URL(url).pathname;
  const slug = pathname.replace(/^\/product-category\/|\/$/g, '');
  const h1 = stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || slug);
  const term = html.match(/class="term-description"[\s\S]*?<\/div>/i)?.[0] || '';
  return {
    slug,
    path: pathname.endsWith('/') ? pathname : `${pathname}/`,
    name: h1,
    seoTitle: metaContent(html, 'og:title'),
    description: metaContent(html, 'og:description') || metaContent(html, 'description') || stripTags(term),
    introHtml: sanitizeFragment(term),
  };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const productUrls = locsFrom(path.join(SITEMAP_DIR, 'product-sitemap.xml')).filter((url) => url.includes('/product/'));
  const categoryUrls = locsFrom(path.join(SAMPLE_DIR, 'product_cat-sitemap.xml'));
  const tagUrls = locsFrom(path.join(SAMPLE_DIR, 'product_tag-sitemap.xml'));
  console.log(`fetch products ${productUrls.length} categories ${categoryUrls.length} tags ${tagUrls.length}`);

  const products = (
    await mapPool(productUrls, 4, async (url, index) => {
      try {
        const html = await fetchHtml(url);
        const product = parseProduct(html, url);
        if ((index + 1) % 10 === 0) console.log(`products ${index + 1}/${productUrls.length}`);
        return product;
      } catch (error) {
        console.error(String(error).slice(0, 300));
        return null;
      }
    })
  ).filter(Boolean);

  const categories = (
    await mapPool(categoryUrls, 3, async (url) => {
      try {
        return parseCategory(await fetchHtml(url), url);
      } catch (error) {
        console.error(String(error).slice(0, 240));
        const pathname = new URL(url).pathname;
        return {
          slug: pathname.replace(/^\/product-category\/|\/$/g, ''),
          path: pathname,
          name: pathname.split('/').filter(Boolean).pop(),
          seoTitle: '',
          description: '',
        };
      }
    })
  ).filter(Boolean);
  const tags = (
    await mapPool(tagUrls, 2, async (url) => {
      try {
        const html = await fetchHtml(url);
        const pathname = new URL(url).pathname;
        return {
          slug: pathname.replace(/^\/product-tag\/|\/$/g, ''),
          path: pathname.endsWith('/') ? pathname : `${pathname}/`,
          name: stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || ''),
          seoTitle: metaContent(html, 'og:title'),
          description: metaContent(html, 'og:description') || metaContent(html, 'description'),
        };
      } catch (error) {
        console.error(String(error).slice(0, 240));
        return null;
      }
    })
  ).filter(Boolean);

  const pages = {};
  for (const url of PAGE_URLS) {
    try {
      const html = await fetchHtml(url);
      const page = parsePage(html, url);
      pages[page.path] = page;
      console.log(`page ${page.path} blocks ${page.blocks.length} emails ${page.emails.join(',')}`);
    } catch (error) {
      console.error(String(error).slice(0, 240));
    }
  }

  fs.writeFileSync(path.join(OUT, 'products.json'), JSON.stringify(products, null, 2));
  fs.writeFileSync(path.join(OUT, 'categories.json'), JSON.stringify(categories, null, 2));
  fs.writeFileSync(path.join(OUT, 'tags.json'), JSON.stringify(tags, null, 2));
  fs.writeFileSync(path.join(OUT, 'pages.json'), JSON.stringify(pages, null, 2));
  const missingImage = products.filter((product) => !product.image || !fs.existsSync(path.join(ROOT, 'public', product.image.replace(/^\//, '')))).length;
  console.log(JSON.stringify({
    products: products.length,
    categories: categories.length,
    tags: tags.length,
    imagesCopied: copied.size,
    missingImage,
    sample: products[0],
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export const LOCALES = ['en', 'zh', 'zh-tw', 'es', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'ko', 'ar', 'id', 'vi'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const I18N_LOCALES = LOCALES.filter((l): l is Exclude<Locale, 'en'> => l !== 'en');

export const LOCALE_META: Record<
  Locale,
  { name: string; htmlLang: string; ogLocale: string; dir: 'ltr' | 'rtl' }
> = {
  en: { name: 'English', htmlLang: 'en', ogLocale: 'en_US', dir: 'ltr' },
  zh: { name: '简体中文', htmlLang: 'zh-Hans', ogLocale: 'zh_CN', dir: 'ltr' },
  'zh-tw': { name: '繁體中文', htmlLang: 'zh-Hant', ogLocale: 'zh_TW', dir: 'ltr' },
  es: { name: 'Español', htmlLang: 'es', ogLocale: 'es', dir: 'ltr' },
  pt: { name: 'Português', htmlLang: 'pt', ogLocale: 'pt_BR', dir: 'ltr' },
  fr: { name: 'Français', htmlLang: 'fr', ogLocale: 'fr_FR', dir: 'ltr' },
  de: { name: 'Deutsch', htmlLang: 'de', ogLocale: 'de_DE', dir: 'ltr' },
  it: { name: 'Italiano', htmlLang: 'it', ogLocale: 'it_IT', dir: 'ltr' },
  ru: { name: 'Русский', htmlLang: 'ru', ogLocale: 'ru_RU', dir: 'ltr' },
  ja: { name: '日本語', htmlLang: 'ja', ogLocale: 'ja_JP', dir: 'ltr' },
  ko: { name: '한국어', htmlLang: 'ko', ogLocale: 'ko_KR', dir: 'ltr' },
  ar: { name: 'العربية', htmlLang: 'ar', ogLocale: 'ar_SA', dir: 'rtl' },
  id: { name: 'Bahasa Indonesia', htmlLang: 'id', ogLocale: 'id_ID', dir: 'ltr' },
  vi: { name: 'Tiếng Việt', htmlLang: 'vi', ogLocale: 'vi_VN', dir: 'ltr' },
};

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && (LOCALES as readonly string[]).includes(value));
}

export function getLocaleFromPath(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return isLocale(first) ? first : 'en';
}

export function stripLocale(pathname: string): string {
  const path = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  if (parts[0] && isLocale(parts[0])) {
    const rest = parts.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }
  return path;
}

export function localizePath(path: string, locale: Locale): string {
  const clean = stripLocale(path);
  if (locale === 'en') return clean;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}

export function pagePath(path: string, locale: Locale): string {
  const hash = path.includes('#') ? `#${path.slice(path.indexOf('#') + 1)}` : '';
  const localized = localizePath(path, locale);
  const withSlash = localized === '/' ? '/' : localized.endsWith('/') ? localized : `${localized}/`;
  return `${withSlash}${hash}`;
}

const LOCALIZED_EXACT = new Set([
  '/',
  '/products',
  '/about-us',
  '/services',
  '/contact',
  '/contact/thanks',
  '/privacy-policy-2',
  '/blog',
]);

export function isLocalizedPath(pathname: string): boolean {
  const key = stripLocale(pathname).replace(/\/$/, '') || '/';
  if (LOCALIZED_EXACT.has(key)) return true;
  return key.startsWith('/product/') || key.startsWith('/product-category/') || key.startsWith('/product-tag/');
}

/**
 * Paths whose /<lang>/ copies are real translations (title, H1 and body).
 * Product detail pages and the blog index only translate the title and page
 * chrome while the body stays English, so they are not hreflang alternates:
 * their language copies canonicalize to the English URL.
 */
export function isTranslatedPath(pathname: string): boolean {
  if (!isLocalizedPath(pathname)) return false;
  const key = stripLocale(pathname).replace(/\/$/, '') || '/';
  if (key === '/blog' || key.startsWith('/product/')) return false;
  return true;
}

export function getHreflangMap(pathname: string): Record<Locale, string> | null {
  if (!isTranslatedPath(pathname)) return null;
  const bare = stripLocale(pathname);
  return Object.fromEntries(LOCALES.map((locale) => [locale, pagePath(bare, locale)])) as Record<Locale, string>;
}

export function switchLocalePath(pathname: string, target: Locale): string {
  const hash = pathname.includes('#') ? `#${pathname.split('#')[1]}` : '';
  const bare = stripLocale(pathname.split('#')[0]);
  if (!isLocalizedPath(bare)) return pagePath('/', target) + hash;
  return pagePath(bare, target) + hash;
}

export const WHATSAPP_BY_LOCALE: Record<Locale, string> = {
  en: 'Hello, I would like to inquire about fruit or vegetable powder. Is that convenient for you?',
  zh: '您好，我想咨询果蔬粉。方便发一下规格和报价吗？',
  'zh-tw': '您好，我想詢問果蔬粉。方便提供規格和報價嗎？',
  es: 'Hola, quiero consultar polvos de fruta y verdura. ¿Me pueden enviar especificación y precio?',
  pt: 'Olá, quero consultar pós de fruta e vegetal. Podem enviar especificação e preço?',
  fr: 'Bonjour, je souhaite un devis pour des poudres de fruits et légumes. Pouvez-vous envoyer la spécification et le prix ?',
  de: 'Hallo, ich möchte Frucht- und Gemüsepulver anfragen. Bitte senden Sie Spezifikation und Preis.',
  it: 'Buongiorno, vorrei un’offerta per polveri di frutta e verdura. Potete inviare specifica e prezzo?',
  ru: 'Здравствуйте, хочу запросить фруктовый или овощной порошок. Пришлите, пожалуйста, спецификацию и цену.',
  ja: 'こんにちは。果菜パウダーについて問い合わせたいです。規格と価格を送っていただけますか。',
  ko: '안녕하세요. 과일·채소 분말을 문의드립니다. 규격과 가격을 보내주실 수 있나요?',
  ar: 'مرحباً، أود الاستفسار عن مسحوق الفواكه والخضار. هل يمكنكم إرسال المواصفة والسعر؟',
  id: 'Halo, saya ingin menanyakan bubuk buah dan sayur. Mohon kirim spesifikasi dan harga.',
  vi: 'Xin chào, tôi muốn hỏi bột trái cây và rau củ. Vui lòng gửi quy cách và giá.',
};

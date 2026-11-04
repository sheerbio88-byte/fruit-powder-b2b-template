import { isContactLeadSource, type ContactLeadSource } from '~/types/contact-inquiry';

/** First-touch store. Keep in sync with LeadAttribution.astro inline script. */
export const LEAD_ATTR_STORAGE_KEY = 'aw_lead_attribution';
/** B2B consideration window — do not reset on a later Contact click. */
export const LEAD_ATTR_TTL_MS = 90 * 24 * 60 * 60 * 1000;

export type LeadTouch = {
  captured_at: string;
  landing_page: string;
  search: string;
  referrer: string | null;
  referrer_host: string | null;
};

export type StoredLeadAttribution = {
  v: 1;
  first: LeadTouch;
  last: LeadTouch | null;
};

export type LeadAttributionSignals = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  gclid: string | null;
  referrer: string | null;
  referrer_host: string | null;
  landing_page?: string | null;
  first_captured_at?: string | null;
  last_landing_page?: string | null;
  last_search?: string | null;
};

export type LeadSourceDetection = {
  lead_source: ContactLeadSource | null;
  /** Raw signals stored in extra for debugging / manual review */
  attribution: LeadAttributionSignals;
};

const PAID_MEDIUMS = new Set(['cpc', 'ppc', 'paid', 'paidsearch', 'display', 'ads', 'ad', 'cpm', 'cpa']);

/** ChatGPT / OpenAI / Perplexity — stored as lead_source `chatgpt`. */
const CHATGPT_HOSTS = ['chatgpt.com', 'openai.com', 'perplexity.ai'];

/** Other LLM surfaces — stored as lead_source `ai`, not ChatGPT. */
const OTHER_AI_HOSTS = [
  'claude.ai',
  'anthropic.com',
  'gemini.google.com',
  'bard.google.com',
  'copilot.microsoft.com',
  'copilot.bing.com',
  'grok.com',
  'x.ai',
  'deepseek.com',
  'kimi.com',
  'moonshot.cn',
  'you.com',
  'phind.com',
  'meta.ai',
  'poe.com',
  'mistral.ai',
  'character.ai',
];

const AI_HOSTS = [...CHATGPT_HOSTS, ...OTHER_AI_HOSTS];

function normalize(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

function stripWww(host: string): string {
  return host.replace(/^www\./, '').toLowerCase();
}

export function hostFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return stripWww(new URL(url).hostname);
  } catch {
    return null;
  }
}

function hostMatchesDomain(host: string, domain: string): boolean {
  const h = stripWww(host);
  const d = stripWww(domain);
  return h === d || h.endsWith(`.${d}`);
}

function isAiHost(host: string | null): boolean {
  if (!host) return false;
  return AI_HOSTS.some((domain) => hostMatchesDomain(host, domain));
}

function isSameSiteHost(referrerHost: string | null, currentHost: string | null | undefined): boolean {
  if (!referrerHost || !currentHost) return false;
  return stripWww(referrerHost) === stripWww(currentHost);
}

export function hasCampaignParams(search: string | null | undefined): boolean {
  const raw = search ?? '';
  const params = new URLSearchParams(raw.startsWith('?') ? raw.slice(1) : raw);
  return Boolean(
    params.get('gclid') ||
    params.get('gbraid') ||
    params.get('wbraid') ||
    params.get('utm_source') ||
    params.get('utm_medium') ||
    params.get('utm_campaign')
  );
}

function isGenericAiToken(token: string): boolean {
  const t = normalize(token);
  return t === 'ai' || t === 'llm' || t === 'aichat' || t === 'llms_txt' || t === 'llms.txt';
}

function isChatGptToken(token: string): boolean {
  const t = normalize(token);
  return t.includes('chatgpt') || t.includes('openai') || t === 'gpt' || t.includes('perplexity');
}

function isOtherAiBrandToken(token: string): boolean {
  const t = normalize(token);
  if (!t) return false;
  return (
    t.includes('claude') ||
    t.includes('anthropic') ||
    t.includes('gemini') ||
    t.includes('bard') ||
    t.includes('copilot') ||
    t.includes('grok') ||
    t.includes('xai') ||
    t.includes('deepseek') ||
    t.includes('kimi') ||
    t.includes('moonshot') ||
    t.includes('tongyi') ||
    t.includes('qwen') ||
    t.includes('qianwen') ||
    t.includes('phind') ||
    t.includes('poe') ||
    t.includes('mistral') ||
    t.includes('character.ai') ||
    t.includes('meta.ai')
  );
}

function isAiToken(token: string): boolean {
  return isGenericAiToken(token) || isChatGptToken(token) || isOtherAiBrandToken(token);
}

function isGenericAiUtm(source: string, medium: string, campaign: string): boolean {
  if (isChatGptToken(source)) return false;
  return isGenericAiToken(source) || isGenericAiToken(medium) || campaign === 'llms_txt';
}

function isChatGptHost(host: string | null): boolean {
  if (!host) return false;
  return CHATGPT_HOSTS.some((domain) => hostMatchesDomain(host, domain));
}

function matchSourceFromToken(token: string): ContactLeadSource | null {
  const t = normalize(token);
  if (!t) return null;

  if (isChatGptToken(t)) return 'chatgpt';
  if (isGenericAiToken(t) || isOtherAiBrandToken(t)) return 'ai';
  if (t.includes('yahoo')) return 'yahoo';
  if (t.includes('bing') || t === 'msn') return 'bing';
  if (t.includes('baidu')) return 'baidu';
  if (t.includes('alibaba') || t.includes('1688') || t.includes('aliexpress')) return 'alibaba';
  if (t.includes('facebook') || t === 'fb' || t.includes('instagram') || t === 'ig' || t === 'meta') {
    return 'facebook';
  }
  if (t.includes('linkedin') || t === 'li') return 'linkedin';
  if (t.includes('whatsapp') || t === 'wa') return 'whatsapp';
  if (t.includes('email') || t === 'newsletter' || t === 'mail') return 'email';
  if (t.includes('google')) return 'google_organic';

  return null;
}

function matchFromReferrerHost(host: string | null): ContactLeadSource | null {
  if (!host) return null;

  // AI hosts first — gemini.google.com would otherwise look like Google organic
  if (isChatGptHost(host)) return 'chatgpt';
  if (isAiHost(host)) return 'ai';

  if (host.includes('google.')) return 'google_organic';
  if (host.includes('yahoo.')) return 'yahoo';
  if (host.includes('bing.') || host === 'bing.com' || host.includes('msn.')) return 'bing';
  if (host.includes('baidu.')) return 'baidu';
  if (host.includes('alibaba.') || host.includes('1688.com') || host.includes('aliexpress.')) {
    return 'alibaba';
  }
  if (
    host.includes('facebook.') ||
    host.includes('fb.com') ||
    host.includes('instagram.') ||
    host.includes('l.facebook')
  ) {
    return 'facebook';
  }
  if (host.includes('linkedin.') || host.includes('lnkd.in')) return 'linkedin';
  if (host.includes('whatsapp.') || host === 'wa.me') return 'whatsapp';

  return null;
}

function currentHost(): string | null {
  return typeof window !== 'undefined' ? window.location.hostname : null;
}

/**
 * Detect customer acquisition source from UTM params, Google click ids, and referrer.
 * Pass stored first-touch search + referrer on submit — do not use the Contact page URL.
 */
export function detectLeadSource(input?: {
  search?: string;
  referrer?: string | null;
  host?: string | null;
}): LeadSourceDetection {
  const search = input?.search ?? (typeof window !== 'undefined' ? window.location.search : '');
  const rawReferrer =
    input?.referrer !== undefined ? input.referrer : typeof document !== 'undefined' ? document.referrer || null : null;
  const host = input?.host ?? currentHost();
  const referrer = isSameSiteHost(hostFromUrl(rawReferrer), host) ? null : rawReferrer;

  const params = new URLSearchParams(search.startsWith('?') ? search : search ? `?${search}` : '');
  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_campaign = params.get('utm_campaign');
  const gclid = params.get('gclid') || params.get('gbraid') || params.get('wbraid');
  const referrer_host = hostFromUrl(referrer);

  const attribution: LeadAttributionSignals = {
    utm_source: utm_source?.trim() || null,
    utm_medium: utm_medium?.trim() || null,
    utm_campaign: utm_campaign?.trim() || null,
    gclid: gclid?.trim() || null,
    referrer: referrer?.trim() || null,
    referrer_host,
  };

  const medium = normalize(utm_medium);
  const source = normalize(utm_source);
  const campaign = normalize(utm_campaign);
  const genericAi = isGenericAiUtm(source, medium, campaign);
  const isPaid =
    Boolean(gclid) ||
    PAID_MEDIUMS.has(medium) ||
    medium.includes('paid') ||
    medium.includes('cpc') ||
    medium.includes('ppc');

  // 1) Google Ads: gclid / paid Google UTM / paid with no source (common ad landings)
  if (gclid) {
    return { lead_source: 'google_ads', attribution };
  }
  if (isPaid && (source.includes('google') || source === 'adwords' || source === 'ads' || !source)) {
    return { lead_source: 'google_ads', attribution };
  }

  // 2) Specific UTM source (not the generic llms.txt AI tag)
  if (source && !genericAi) {
    if (source.includes('google') && !isAiToken(source)) {
      return {
        lead_source: isPaid ? 'google_ads' : 'google_organic',
        attribution,
      };
    }
    const fromUtm = matchSourceFromToken(source);
    if (fromUtm) {
      return { lead_source: fromUtm, attribution };
    }
  }

  // 2b) Generic AI UTM: prefer a real referrer (Claude vs ChatGPT) over "ai"
  if (genericAi) {
    const fromRef = matchFromReferrerHost(referrer_host);
    if (fromRef) return { lead_source: fromRef, attribution };
    return { lead_source: 'ai', attribution };
  }

  // 3) UTM medium only (e.g. utm_medium=email)
  if (medium) {
    if (medium === 'organic' && referrer_host?.includes('google.')) {
      return { lead_source: 'google_organic', attribution };
    }
    const fromMedium = matchSourceFromToken(medium);
    if (fromMedium) return { lead_source: fromMedium, attribution };
  }

  // 4) Referrer host
  const fromRef = matchFromReferrerHost(referrer_host);
  if (fromRef) {
    if (fromRef === 'google_organic' && isPaid) {
      return { lead_source: 'google_ads', attribution };
    }
    return { lead_source: fromRef, attribution };
  }

  // 5) Direct / no signal
  if (!referrer_host && !source && !gclid) {
    return { lead_source: 'direct', attribution };
  }

  // External unknown referrer
  if (referrer_host) {
    return { lead_source: 'other', attribution };
  }

  return { lead_source: null, attribution };
}

export function parseLeadSource(value: string | null | undefined): ContactLeadSource | null {
  if (!value) return null;
  return isContactLeadSource(value) ? value : null;
}

function cookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const parts = document.cookie.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${name}=`)) {
      try {
        return decodeURIComponent(trimmed.slice(name.length + 1));
      } catch {
        return trimmed.slice(name.length + 1);
      }
    }
  }
  return null;
}

function writeCookie(name: string, value: string, maxAgeSec: number): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSec}; SameSite=Lax`;
}

function parseStored(raw: string | null | undefined): StoredLeadAttribution | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredLeadAttribution;
    if (parsed?.v !== 1 || !parsed.first?.captured_at) return null;
    const age = Date.now() - Date.parse(parsed.first.captured_at);
    if (!Number.isFinite(age) || age > LEAD_ATTR_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function readStoredLeadAttribution(): StoredLeadAttribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const fromLs = parseStored(localStorage.getItem(LEAD_ATTR_STORAGE_KEY));
    if (fromLs) return fromLs;
  } catch {
    /* private mode */
  }
  try {
    const fromSs = parseStored(sessionStorage.getItem(LEAD_ATTR_STORAGE_KEY));
    if (fromSs) return fromSs;
  } catch {
    /* ignore */
  }
  return parseStored(cookieValue(LEAD_ATTR_STORAGE_KEY));
}

function writeStoredLeadAttribution(value: StoredLeadAttribution): void {
  if (typeof window === 'undefined') return;
  const raw = JSON.stringify(value);
  try {
    localStorage.setItem(LEAD_ATTR_STORAGE_KEY, raw);
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.setItem(LEAD_ATTR_STORAGE_KEY, raw);
  } catch {
    /* ignore */
  }
  try {
    writeCookie(LEAD_ATTR_STORAGE_KEY, raw, Math.floor(LEAD_ATTR_TTL_MS / 1000));
  } catch {
    /* ignore */
  }
}

function snapshotTouch(input?: {
  href?: string;
  search?: string;
  referrer?: string | null;
  host?: string | null;
}): LeadTouch {
  const href = input?.href ?? (typeof window !== 'undefined' ? window.location.href : '');
  const search = input?.search ?? (typeof window !== 'undefined' ? window.location.search : '');
  const rawReferrer =
    input?.referrer !== undefined ? input.referrer : typeof document !== 'undefined' ? document.referrer || null : null;
  const host = input?.host ?? currentHost();
  const referrer = isSameSiteHost(hostFromUrl(rawReferrer), host) ? null : rawReferrer?.trim() || null;

  return {
    captured_at: new Date().toISOString(),
    landing_page: href,
    search: search || '',
    referrer,
    referrer_host: hostFromUrl(referrer),
  };
}

function firstTouchIsWeak(touch: LeadTouch): boolean {
  return !hasCampaignParams(touch.search) && !touch.referrer;
}

/**
 * Freeze first-touch on landing. Internal Contact clicks must not overwrite it.
 * New UTM / gclid updates last-touch; upgrades first only when first had no signal.
 */
export function mergeLeadAttribution(stored: StoredLeadAttribution | null, touch: LeadTouch): StoredLeadAttribution {
  const hasCamp = hasCampaignParams(touch.search);
  const hasExt = Boolean(touch.referrer);

  if (!stored) {
    return { v: 1, first: touch, last: null };
  }

  const weak = firstTouchIsWeak(stored.first);

  if (hasCamp) {
    return {
      v: 1,
      first: weak ? touch : stored.first,
      last: touch,
    };
  }

  if (hasExt && weak) {
    return { v: 1, first: touch, last: stored.last };
  }

  return stored;
}

/** Capture current page into the first-touch store. Safe to call on every page load. */
export function captureLeadAttribution(input?: {
  href?: string;
  search?: string;
  referrer?: string | null;
  host?: string | null;
}): StoredLeadAttribution | null {
  if (typeof window === 'undefined') return null;
  const next = mergeLeadAttribution(readStoredLeadAttribution(), snapshotTouch(input));
  writeStoredLeadAttribution(next);
  return next;
}

/**
 * Source to persist on inquiry submit: stored first-touch, not the Contact page.
 */
export function resolveLeadSource(): LeadSourceDetection {
  const stored = captureLeadAttribution() ?? readStoredLeadAttribution();
  if (!stored?.first) {
    return detectLeadSource();
  }

  const detected = detectLeadSource({
    search: stored.first.search,
    referrer: stored.first.referrer,
  });

  return {
    lead_source: detected.lead_source,
    attribution: {
      ...detected.attribution,
      landing_page: stored.first.landing_page || null,
      first_captured_at: stored.first.captured_at || null,
      last_landing_page: stored.last?.landing_page ?? null,
      last_search: stored.last?.search ?? null,
    },
  };
}

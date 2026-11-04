/**
 * Resolve visitor IP + country/region via a free browser-friendly geo API.
 * Failures are silent so form submit is never blocked by geo lookup.
 */

export type ClientGeoInfo = {
  ip_address: string | null;
  country: string | null;
  country_code: string | null;
  region: string | null;
};

const EMPTY_GEO: ClientGeoInfo = {
  ip_address: null,
  country: null,
  country_code: null,
  region: null,
};

type IpWhoIsResponse = {
  success?: boolean;
  ip?: string;
  country?: string;
  country_code?: string;
  region?: string;
  city?: string;
};

type GeoJsResponse = {
  ip?: string;
  country?: string;
  country_code?: string;
  region?: string;
  city?: string;
};

async function fetchWithTimeout(url: string, ms = 2500): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal, credentials: 'omit' });
  } finally {
    window.clearTimeout(timer);
  }
}

async function fromIpWhoIs(): Promise<ClientGeoInfo | null> {
  const res = await fetchWithTimeout('https://ipwho.is/');
  if (!res.ok) return null;
  const data = (await res.json()) as IpWhoIsResponse;
  if (data.success === false) return null;

  const regionParts = [data.region, data.city].filter((v): v is string => Boolean(v && v.trim()));
  return {
    ip_address: data.ip?.trim() || null,
    country: data.country?.trim() || null,
    country_code: data.country_code?.trim()?.toUpperCase() || null,
    region: regionParts.length > 0 ? regionParts.join(' · ') : null,
  };
}

async function fromGeoJs(): Promise<ClientGeoInfo | null> {
  const res = await fetchWithTimeout('https://get.geojs.io/v1/ip/geo.json');
  if (!res.ok) return null;
  const data = (await res.json()) as GeoJsResponse;

  const regionParts = [data.region, data.city].filter((v): v is string => Boolean(v && v.trim()));
  return {
    ip_address: data.ip?.trim() || null,
    country: data.country?.trim() || null,
    country_code: data.country_code?.trim()?.toUpperCase() || null,
    region: regionParts.length > 0 ? regionParts.join(' · ') : null,
  };
}

export async function resolveClientGeo(): Promise<ClientGeoInfo> {
  if (typeof window === 'undefined') return EMPTY_GEO;

  try {
    const primary = await fromIpWhoIs();
    if (primary?.ip_address || primary?.country) return primary;
  } catch {
    // try fallback
  }

  try {
    const fallback = await fromGeoJs();
    if (fallback?.ip_address || fallback?.country) return fallback;
  } catch {
    // ignore
  }

  return EMPTY_GEO;
}

/** Display helper: "United States · California · Los Angeles" style */
export function formatGeoLabel(row: {
  country?: string | null;
  country_code?: string | null;
  region?: string | null;
  ip_address?: string | null;
}): string {
  const parts = [row.country, row.region].filter((v): v is string => Boolean(v && v.trim()));
  if (parts.length > 0) return parts.join(' · ');
  if (row.country_code) return row.country_code;
  if (row.ip_address) return row.ip_address;
  return '—';
}

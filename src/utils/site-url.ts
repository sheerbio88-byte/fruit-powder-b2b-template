import { SITE } from 'astrowind:config';

export function getSiteUrl(): string {
  return SITE?.site?.replace(/\/$/, '') ?? 'https://sheersuperfood.com';
}
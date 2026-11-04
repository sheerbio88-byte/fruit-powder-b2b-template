# Fruit powder B2B template (Sheerherb / 果粉)

<img src=".github/assets/pagespeed-100.svg" align="right" alt="Lighthouse scores: Performance 100, Accessibility 100, Best Practices 100, SEO 100" width="100" height="358">

Open-source **AstroWind + Cloudflare Workers** website template for a fruit & vegetable powder / superfood B2B manufacturer site. Derived from the Sheerherb 果粉 marketing site structure (product pages, multilingual routes, inquiry form with Turnstile + Supabase).

Based on [AstroWind](https://github.com/onwidget/astrowind) by onWidget (MIT).


- ✅ **Production-ready** scores in **PageSpeed Insights** reports.
- ✅ Multilingual product & capability pages
- ✅ Quote / inquiry form with **Cloudflare Turnstile** + **Supabase**
- ✅ Deploy as a **Cloudflare Worker** with static assets

**Demo / Live site:** [sheersuperfood.com](https://sheersuperfood.com) (Sheerherb / 果粉)

## Features

- Static Astro site with localized routes
- Product & content data in `src/data/`
- Quote / inquiry form → Supabase `contact_inquiries` (RLS-protected)
- Cloudflare Turnstile bot check
- Deploy as a Cloudflare Worker with static assets (`wrangler.toml`)

## Requirements

- Node.js `>= 22.12.0`
- A Supabase project (anon/publishable key only)
- A Cloudflare Turnstile widget (site key)
- Cloudflare account for Workers deploy (optional for local preview)

## Quick start

```bash
cp .env.example .env
# edit .env — fill PUBLIC_SUPABASE_*, PUBLIC_TURNSTILE_SITE_KEY, contact fields

npm install
npm run dev
npm run build
npm run preview
```

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | recommended | Canonical site origin, e.g. `https://example.com` |
| `PUBLIC_SUPABASE_URL` | for inquiries | Supabase project URL (`https://….supabase.co`) |
| `PUBLIC_SUPABASE_ANON_KEY` | for inquiries | **anon / publishable** key only |
| `PUBLIC_SOURCE_SITE` | for inquiries | Host string written to `source_site` (must be allowlisted server-side) |
| `PUBLIC_TURNSTILE_SITE_KEY` | for inquiries | Turnstile **site** key |
| `PUBLIC_CONTACT_EMAIL` | optional | Public sales email |
| `PUBLIC_CONTACT_PHONE` | optional | E.164-ish phone |
| `PUBLIC_CONTACT_PHONE_DISPLAY` | optional | Display formatting |
| `PUBLIC_CONTACT_WHATSAPP` | optional | WhatsApp display number |
| `PUBLIC_CONTACT_WHATSAPP_HREF` | optional | `https://wa.me/…` link |
| `PUBLIC_CONTACT_WHATSAPP_NUMBER` | optional | Digits only for `wa.me` links after a successful inquiry; empty hides them |


## Assets / media

Product and brand images are **not** bundled in this public template (keeps the clone small).

- Put your own images under `public/wp-content/uploads/` (see `public/wp-content/uploads/README.md`).
- Tiny placeholders exist for the filenames referenced in `src/` — replace them, or change those paths in the source to match your files.
- Prefer WebP/AVIF or reasonably sized JPEG/PNG for production.

## Deploy (Cloudflare Workers)

```bash
npm run build
npx wrangler deploy
```

Or wire Workers Builds / CI to this repo and set the same `PUBLIC_*` vars in the build environment. Update `name` in `wrangler.toml` for your worker and attach your own domain.

## Security

- **Never commit** `.env`, `.dev.vars`, or any **`service_role`** / secret API token.
- Only the Supabase **anon / publishable** key belongs in the browser bundle; protect rows with **RLS**.
- Turnstile **secret** key stays on the server, not in this static site.

## License

MIT © Xi'an Sheerherb Biological Technology Co., Ltd. (Sheerherb / 新维禾) and onWidget (AstroWind) — see [LICENSE](./LICENSE).

# webseed-site

Static HTML for **webseed.me**. Deployed to Netlify on every push to `main`.

## Layout

- `index.html` · `contact.html` · `blog.html` · `blog-post.html` · `404.html` — marketing pages
- `impressum.html` · `privacy.html` · `terms.html` — legal pages (bilingual DE/EN)
- `tokens.css` — design system tokens
- `index.css` · `contact.css` · `blog.css` · `post.css` · `legal.css` · `page404.css` — per-page styles
- `assets/` — fonts (self-hosted Bricolage Grotesque + Geist), logos, OG image, portrait
- `js/plausible.js` — self-hosted Plausible analytics
- `_redirects` · `sitemap.xml` · `robots.txt` · `netlify.toml` — Netlify wiring

## Deploy

Push to `main` → Netlify auto-builds and ships to webseed.me.

## Editing legal pages

Search for `legal-fill` spans in `impressum.html` and `privacy.html` to find required fill-ins:
- Webseed OÜ registered street + postal code
- Estonian registrikood
- VAT status (EE VAT ID or "not registered")
- "Last updated" date

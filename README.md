# Manahari Dahal: portfolio (v2)

Next.js static site. Design rules live in `DESIGN.md`; product context in `PRODUCT.md`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build      # checks colour contrast, then exports the static site to out/
```

`npm run check:contrast` runs the contrast gate on its own, and `npm run lint` runs ESLint.

Set `NEXT_PUBLIC_SITE_URL` to the real domain before a production deploy; it feeds the sitemap, canonical URLs and share cards.

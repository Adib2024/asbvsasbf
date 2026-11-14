# ASBF vs ASB Calculator

Mobile-first web app that helps Malaysians compare **ASBF** (borrowing from a bank to buy ASB units)
with **saving the same monthly amount into ASB in cash**. It shows which option comes out ahead, what
you get if you close early, and how ASBF affects home loan eligibility (DSR).

- Bahasa Melayu by default, with an EN/BM toggle
- Results update live; tap the chart or a table row to pick a year
- Installable PWA that works offline; inputs are saved on the device and can be shared as a link

## Develop

```bash
npm install
npm run dev
```

```bash
npm test
```

```bash
npm run build
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes `dist/` to
GitHub Pages. One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The build uses relative asset paths, so `dist/` also works on any static host.

## Structure

- `src/calc.js` – formulas (installment, projection, break-even dividend, DSR), covered by `tests/`
- `src/App.jsx`, `src/components.jsx`, `src/NetWorthChart.jsx` – UI
- `src/i18n.js` – BM/EN text and number formatting
- `src/state.js` – localStorage and share-link encoding

Estimates only, not financial advice.

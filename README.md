# Acknowledgment Calculation

A reactive React + Tailwind CSS web app that converts grants and intervention
costs between **EUR** and **EGP** using monthly Euro exchange rates.

## Features

- **Exchange Rate Manager** — sidebar table of monthly EUR→EGP rates from
  `1(2025)` through `4(2026)`. Every value is editable and the entire UI
  recalculates instantly.
- **Cost Input Table** — add / remove / edit Post Arrival and Post Return cost
  lines in EGP with an auto-computed total row.
- **Scenario Calculators** — three cards covering:
  1. **Post Arrival** — pick the execution month, the Euro rate auto-locks,
     and the case-worker EGP total is synced from the items table.
  2. **Post Return in 1 Month** — input grant in EUR, pick the month, see the
     instantly converted EGP grant.
  3. **Post Return in 2 Months** — input grant in EUR + a target total in EGP,
     pick the month, see the converted grant and the EGP delta.
- **Summary Dashboard** — bottom panel with `Total Intervention (EGP / EUR)`,
  `Grant (EUR)`, `Paid by LM`, and `Paid by Beneficiary`.

All currency outputs are formatted to **2 decimal places**.

## Tech stack

- React 19 + Vite
- Tailwind CSS 3
- `useState` / `useEffect` / `useMemo` for reactive calculations

## Getting started

```bash
npm install
npm run dev      # start the dev server (default: http://localhost:5173)
npm run build    # production build
npm run preview  # preview the production build
```

## Project structure

```
src/
├── App.jsx                          # composes the layout & calculation logic
├── main.jsx                         # React entry
├── index.css                        # Tailwind + small component layer
├── components/
│   ├── ExchangeRateManager.jsx      # editable monthly rate table
│   ├── CostInputTable.jsx           # EGP line-item table
│   ├── ScenarioCalculators.jsx      # 3 conversion cards
│   └── SummaryDashboard.jsx         # consolidated totals panel
└── utils/
    ├── defaults.js                  # default rates & line items
    └── format.js                    # number / currency formatters
```

## How calculations are wired

- `lineItems` → totals & per-category subtotals (Post Arrival vs. Post Return).
- `scenarios.*.month` is watched by a `useEffect` that looks up the rate from
  `exchangeRates` and writes it into `scenarios.*.euroRate`. Selecting a month
  therefore *locks in* the Euro rate.
- `summary` is derived in `useMemo` from `scenarios`, `lineItems`, and
  `exchangeRates`, so any input change ripples through the dashboard
  immediately.

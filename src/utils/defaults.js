// Default monthly Euro -> EGP exchange rates from 1(2025) to 4(2026).
// Values are illustrative defaults; users can edit them in the UI.
export const DEFAULT_EXCHANGE_RATES = [
  { month: "1(2025)", rate: 53.04724 },
  { month: "2(2025)", rate: 52.89015 },
  { month: "3(2025)", rate: 53.71288 },
  { month: "4(2025)", rate: 55.42017 },
  { month: "5(2025)", rate: 56.18342 },
  { month: "6(2025)", rate: 56.94011 },
  { month: "7(2025)", rate: 57.20488 },
  { month: "8(2025)", rate: 56.81204 },
  { month: "9(2025)", rate: 56.49872 },
  { month: "10(2025)", rate: 55.93611 },
  { month: "11(2025)", rate: 55.42179 },
  { month: "12(2025)", rate: 55.08402 },
  { month: "1(2026)", rate: 54.71355 },
  { month: "2(2026)", rate: 54.40128 },
  { month: "3(2026)", rate: 54.12790 },
  { month: "4(2026)", rate: 53.95216 },
];

export const newId = () =>
  `id_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;

export const DEFAULT_LINE_ITEMS = [
  { id: newId(), item: "Post Arrival", costEGP: 4500 },
  { id: newId(), item: "Post Return - Rent", costEGP: 8000 },
  { id: newId(), item: "Post Return - Utilities", costEGP: 1500 },
  { id: newId(), item: "Post Return - Food & Supplies", costEGP: 2200 },
];

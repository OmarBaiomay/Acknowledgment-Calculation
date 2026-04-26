export const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) return 0;
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

const NUMBER_FMT = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatNumber = (value) => NUMBER_FMT.format(toNumber(value));

export const formatEgp = (value) => `${formatNumber(value)} EGP`;

export const formatEur = (value) => `€ ${formatNumber(value)}`;

export const formatRate = (value) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 5,
  }).format(toNumber(value));

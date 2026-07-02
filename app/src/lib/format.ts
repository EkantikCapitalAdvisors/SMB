export const usd = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

/** Compact currency for big figures: $2.16M, $190K. */
export const usdShort = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${n < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${n < 0 ? "-" : ""}$${Math.round(abs / 1_000)}K`;
  return usd(n);
};

export const pct = (n: number, decimals = 1) => `${n.toFixed(decimals)}%`;
export const mult = (n: number, decimals = 1) => `${n.toFixed(decimals)}×`;

/** Render a low–high band the way the page shows a range (never a bare point). */
export const band = (lo: number, hi: number, fmt: (n: number) => string = usdShort) =>
  `${fmt(lo)} – ${fmt(hi)}`;

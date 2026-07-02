/**
 * §3.1 — Engine constants (from the live page; do not invent new figures).
 * Single source of truth consumed by every calculator AND static stat block.
 */
export const K = {
  DEFAULT_SDE: 500_000,
  EFF_RATE: { cons: 0.32, base: 0.38, strong: 0.44 },
  DB: {
    ceiling: 300_000,
    defTarget: 150_000,
    rangeMult: [0.8, 1.2] as const,
    employeeLoad: {
      low: [0.1, 0.15] as const,
      med: [0.2, 0.3] as const,
      high: [0.35, 0.45] as const,
    },
  },
  CAPTIVE: {
    premiumCap2026: 2_900_000,
    defPremium: 250_000,
    defAdmin: 25_000,
    growth: { cons: 0.03, base: 0.05, strong: 0.08 },
    claims: { none: 0, low: 0.1, med: 0.25 },
    haircut: [1.0, 0.75, 0.5] as const,
  },
  SERP: {
    defComp: 150_000,
    replMult: [1.5, 2.0, 3.0] as const,
    defFunding: 25_000,
    defVestYrs: 7,
    defDepartReduction: 0.5,
    loanRate: 0.055,
    defLoan: 150_000,
  },
  EPIG: {
    scenarios: { cons: 0.05, base: 0.08, strong: 0.12 },
    /**
     * HARD RULE (§3.1): backtest figures are DISPLAY-ONLY. They may never feed
     * a forward projection — projections use the 5/8/12 scenario rates only.
     * The backtest firewall lint (§7.4) bans importing this into any projection
     * module. It lives here for the single EPIG display block exclusively.
     */
    BACKTEST_DISPLAY_ONLY: { cagr: 0.161, spx: 0.086, from: 2000, to: 2026 },
  },
  EXIT: { mult: { cons: 2.5, base: 3.5, strong: 5.0 } },
  REINVEST_EFF: { cons: 0.6, base: 0.75, strong: 0.9 },
  COSTS: { defSetup: 10_000, defThirdParty: 15_000 },
} as const;

export type Scenario = "cons" | "base" | "strong";
export type ClaimsLevel = "none" | "low" | "med";

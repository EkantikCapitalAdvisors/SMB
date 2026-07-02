/**
 * §3.2 — Core engine functions (pure, unit-tested).
 *
 * Every figure the page displays flows through here — a stat is never hardcoded
 * twice (the "single number must propagate" rule, §3). Formulas are derived to
 * reproduce the published golden vectors (§3.3); see golden.test.ts.
 */
import { K, type Scenario, type ClaimsLevel } from "./constants";

/** Ordinary-annuity future value: `pmt` contributed each period, compounded at `r` for `n` periods. */
export function fvAnnuity(pmt: number, r: number, n: number): number {
  if (r === 0) return pmt * n;
  return (pmt * (Math.pow(1 + r, n) - 1)) / r;
}

/** Future value of a single lump sum `pv` compounded at `r` for `n` periods. */
export function fvLump(pv: number, r: number, n: number): number {
  return pv * Math.pow(1 + r, n);
}

// ---------------------------------------------------------------------------
// LEAK — the wound, quantified (Force D). Vector LEAK-1.
// ---------------------------------------------------------------------------
export interface Leak {
  annual: number;
  decade: number;
  quarterly: number;
}
export function leak(sde: number, rate: number): Leak {
  const annual = sde * rate;
  return { annual, decade: annual * 10, quarterly: annual / 4 };
}

// ---------------------------------------------------------------------------
// DB ACCELERATOR — Defined Benefit. Vector DB-1.
// ---------------------------------------------------------------------------
export interface DbInputs {
  target: number;
  taxRate: number;
  years: number;
  returnRate: number;
}
export interface DbResult {
  contribLow: number;
  contribHigh: number;
  taxSavingLow: number;
  taxSavingHigh: number;
  /** Widest honest out-of-pocket band: lowContrib − highSaving … highContrib − lowSaving. */
  netOopLow: number;
  netOopHigh: number;
  accumulation: number;
}
export function dbModel(i: DbInputs): DbResult {
  const [lo, hi] = K.DB.rangeMult;
  const contribLow = i.target * lo;
  const contribHigh = i.target * hi;
  const taxSavingLow = contribLow * i.taxRate;
  const taxSavingHigh = contribHigh * i.taxRate;
  return {
    contribLow,
    contribHigh,
    taxSavingLow,
    taxSavingHigh,
    netOopLow: contribLow - taxSavingHigh,
    netOopHigh: contribHigh - taxSavingLow,
    accumulation: fvAnnuity(i.target, i.returnRate, i.years),
  };
}

// ---------------------------------------------------------------------------
// 831(b) CAPTIVE RESERVE — tax efficiency + shock absorption. Vector CAP-1.
// ---------------------------------------------------------------------------
export interface CaptiveInputs {
  premium: number;
  admin: number;
  returnRate: number;
  years: number;
  claims: ClaimsLevel;
  taxRate: number;
  /** Deductibility haircut, 1.0 | 0.75 | 0.5 — the IRS-challenge stress case (honesty inversion). */
  deductibility: number;
  monthlyOverhead?: number;
}
export interface CaptiveResult {
  taxEffect: number;
  netReserve: number;
  pool: number;
  annualClaims: number;
  monthsCovered?: number;
}
export function captiveModel(i: CaptiveInputs): CaptiveResult {
  const claimsPct = K.CAPTIVE.claims[i.claims];
  const annualClaims = i.premium * claimsPct;
  const deductiblePortion = i.premium * i.deductibility;
  const taxEffect = deductiblePortion * i.taxRate;
  const netReserve = i.premium - i.admin - annualClaims;
  const pool = fvAnnuity(netReserve, i.returnRate, i.years);
  return {
    taxEffect,
    netReserve,
    pool,
    annualClaims,
    monthsCovered: i.monthlyOverhead ? Math.floor(pool / i.monthlyOverhead) : undefined,
  };
}

// ---------------------------------------------------------------------------
// SERP — retention ROI + optional leverage. Vectors SERP-1, SERP-2.
// ---------------------------------------------------------------------------
export interface SerpLeverage {
  loan: number;
  loanRate: number;
  epigReturn: number;
  years: number;
  policyDrag?: number;
  taxable?: boolean;
}
export interface SerpInputs {
  comp: number;
  replMult: number;
  departReduction: number;
  funding: number;
  vestYears: number;
  profitRisk?: number;
  leverage?: SerpLeverage;
}
export interface SerpResult {
  costOfLoss: number;
  totalInvestment: number;
  valueProtected: number;
  leverage?: {
    fv: number;
    interest: number;
    netGain: number;
    spreadPct: number;
    totalValue: number;
  };
}
export function serpModel(i: SerpInputs): SerpResult {
  const costOfLoss = i.comp * i.replMult + (i.profitRisk ?? 0);
  const totalInvestment = i.funding * i.vestYears;
  const valueProtected = costOfLoss * i.departReduction;

  let leverage: SerpResult["leverage"];
  if (i.leverage) {
    const { loan, loanRate, epigReturn, years, policyDrag = 0, taxable = false } = i.leverage;
    const net = epigReturn - policyDrag;
    const eff = taxable ? net * 0.8 : net; // 20% LTCG haircut on gains if taxable
    const fv = fvLump(loan, eff, years);
    const interest = loan * loanRate * years;
    const netGain = fv - loan - interest;
    leverage = {
      fv,
      interest,
      netGain,
      spreadPct: (eff - loanRate) * 100,
      totalValue: valueProtected + netGain,
    };
  }
  return { costOfLoss, totalInvestment, valueProtected, leverage };
}

/** §3.2 — the WOW multiplier: net value created per dollar of tax saved. */
export function multiplier(netValue: number, taxSaved: number): number {
  return taxSaved > 0 ? netValue / taxSaved : 0;
}

// ---------------------------------------------------------------------------
// DASHBOARD — composes the above. Vector DASH-1.
//
// ⚠ NEEDS CONFIRMATION (spec §10-class gap): the exit-uplift formula and the
// net-value composition are NOT fully determined by the spec. §3.2 only names
// dashboardModel ("composes the above") and the live JS disagrees with the
// DASH-1 vector (live: retention 325K, exit ~656K; vector: 225K, 350K, net
// 2.92M, 5.1×). The pieces below that ARE pinned by other vectors (tax,
// accumulation, retention, reserves) are exact; `exitUplift` is an interim
// placeholder pending sign-off — see golden.test.ts (DASH-1 marked todo).
// ---------------------------------------------------------------------------
export interface DashboardInputs {
  sde: number;
  taxRate: number;
  years: number;
  epigReturn: number;
  exitMultiple: number;
  reinvestEff: number;
  db: boolean;
  b831: boolean;
  serp: boolean;
  dbContrib: number;
  b831Premium: number;
  serpFunding: number;
  serpReplMult: number;
  ecaFee: number;
  setupCosts: number;
  thirdPartyCosts: number;
}
export interface DashboardResult {
  totalTaxSavings: number;
  accumulation: number;
  reserves: number;
  retentionRoi: number;
  exitUplift: number;
  netValue: number;
  multiplier: number;
  /** True while the exit/net composition is unconfirmed (blocks the DASH-1 ship gate). */
  exitUpliftUnconfirmed: true;
}
export function dashboardModel(i: DashboardInputs): DashboardResult {
  const dbContrib = i.db ? i.dbContrib : 0;
  const b831Premium = i.b831 ? i.b831Premium : 0;

  const annualTax = dbContrib * i.taxRate + b831Premium * i.taxRate;
  const totalTaxSavings = annualTax * i.years;

  // SERP is retention-only in the dashboard (not an accumulation vehicle) — this
  // is what makes DASH-1's accumulation read as DB-only (~2.16M).
  const accumulation = fvAnnuity(dbContrib, i.epigReturn, i.years);

  const netReserve = i.b831 ? (b831Premium - K.CAPTIVE.defAdmin) * 0.9 : 0;
  const reserves = i.b831 ? fvAnnuity(netReserve, K.CAPTIVE.growth.base, i.years) : 0;

  const retentionRoi = i.serp
    ? K.SERP.defComp * i.serpReplMult * K.SERP.defDepartReduction
    : 0;

  // INTERIM exit-uplift placeholder — do not treat as final (see block comment).
  const incrementalSde = i.sde * i.reinvestEff * 0.1;
  const exitUplift = incrementalSde * i.exitMultiple * i.years * 0.5;

  const totalCosts = i.setupCosts + (i.ecaFee + i.thirdPartyCosts) * i.years;
  const netValue = accumulation + reserves + exitUplift - totalCosts;

  return {
    totalTaxSavings,
    accumulation,
    reserves,
    retentionRoi,
    exitUplift,
    netValue,
    multiplier: multiplier(netValue, totalTaxSavings),
    exitUpliftUnconfirmed: true,
  };
}

// ---------------------------------------------------------------------------
// DELAY — Cost of Waiting (Force U). Monotonic in quarters delayed.
// delayCost(N) = NV(start now) − NV(start +N qtrs) on the same end date, plus
// per-quarter unrecaptured leak. Range across scenarios; never a point.
// ---------------------------------------------------------------------------
export interface DelayInputs {
  quartersDelayed: number;
  quarterlyLeak: number;
  annualContribution: number;
  horizonYears: number;
}
export function delayModel(i: DelayInputs, scenario: Scenario) {
  const r = K.EPIG.scenarios[scenario];
  const n = i.horizonYears;
  const yearsDelayed = i.quartersDelayed / 4;
  const runwayIfNow = fvAnnuity(i.annualContribution, r, n);
  const runwayIfDelayed = fvAnnuity(i.annualContribution, r, Math.max(0, n - yearsDelayed));
  const foregoneCompounding = Math.max(0, runwayIfNow - runwayIfDelayed);
  const unrecapturedLeak = i.quarterlyLeak * i.quartersDelayed;
  return {
    scenario,
    unrecapturedLeak,
    foregoneCompounding,
    totalCost: unrecapturedLeak + foregoneCompounding,
  };
}

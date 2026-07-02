/**
 * §3 — Shared engine public surface. Consumed by ALL calculators and the
 * static stat blocks. Import from here, never reach into files directly.
 *
 * Note: `K.EPIG.BACKTEST_DISPLAY_ONLY` is intentionally re-exported via `K` but
 * must only be read by the single EPIG display block — never a projection
 * (backtest firewall, §7.4).
 */
export { K } from "./constants";
export type { Scenario, ClaimsLevel } from "./constants";
export {
  fvAnnuity,
  fvLump,
  leak,
  dbModel,
  captiveModel,
  serpModel,
  dashboardModel,
  delayModel,
  multiplier,
} from "./core";
export type {
  Leak,
  DbInputs,
  DbResult,
  CaptiveInputs,
  CaptiveResult,
  SerpInputs,
  SerpResult,
  SerpLeverage,
  DashboardInputs,
  DashboardResult,
  DelayInputs,
} from "./core";

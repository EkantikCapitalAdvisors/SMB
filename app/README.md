# SMB Retirement Supercharger — React/TS re-platform

Faithful rebuild of `smb.ekantikcapital.com` per **SMB Calculator Suite & Visual
Persuasion System — Production Spec v1.0**. Stack: Vite + React 19 + TypeScript,
Vitest for the CI-blocking golden vectors.

> **Not deployed.** This lives beside the current static site (repo root) and
> replaces it only after parity **and** the spec's launch gate (§7.8/§9: counsel
> + CEG/Manish sign-off). The live site is unchanged.

## Status (build order §9)

- ✅ ① §1 blocking language fixes — applied to the static site (separate commit)
- ✅ Scaffold: Vite/React/TS/Vitest + accelerator design tokens (`src/styles/foundation.css`)
- ✅ ② Shared engine (`src/engine/`) + §3.3 golden vectors
  - Passing (exact/≈): **LEAK-1, DB-1, CAP-1, SERP-1, SERP-2**
  - `todo` (needs sign-off): **DASH-1 exit-uplift / net / 5.1× composition** — the
    spec does not determine the exit formula and the live JS disagrees with the
    vector (retention 325K vs 225K, exit ~656K vs 350K). Determined parts of
    DASH-1 (tax 570K, accum ≈2.16M, retention 225K) are asserted and pass.
- ⏳ ③ migrate 4 existing calculators · ④ Leak Meter section · ⑤ visuals 6.1–6.8
  · ⑥ Screener · ⑦ Cost of Waiting · ⑧ instrumentation — pending

## Commands

```bash
npm install
npm test        # golden vectors (CI gate)
npm run build   # typecheck + static build to dist/
npm run dev     # local dev server
```

## Open blockers (people-decisions, not code)

- §10 resolutions (EPIG backronym wording; whether "0% downside" survives; screener
  & cost-of-waiting copy; cohort seat number; foregone-compounding toggle; regulatory
  frame for the email-gated PDF).
- The confirmed exit-uplift / dashboard-net formula (unblocks DASH-1).
- HubSpot integration details for §8 instrumentation.
- Counsel review of all verdict/result copy + Manish (CEG) sign-off before deploy.

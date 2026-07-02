import { useMemo, useState } from "react";
import { K, serpModel } from "../engine";
import { usdShort, pct } from "../lib/format";
import { Illustrative } from "../components/Illustrative";
import { CalcShell, Slider, PillGroup, Result, Toggle, ShowTheMath } from "../components/ui";

const REPL_OPTS = K.SERP.replMult.map((m) => ({ value: m, label: `${m}×` }));
const EPIG_OPTS = [
  { value: K.EPIG.scenarios.cons, label: "5% cons" },
  { value: K.EPIG.scenarios.base, label: "8% base" },
  { value: K.EPIG.scenarios.strong, label: "12% strong" },
];

export function SerpRetention() {
  const [comp, setComp] = useState<number>(K.SERP.defComp);
  const [replMult, setReplMult] = useState<number>(3.0);
  const [departReduction, setDepart] = useState(0.5);
  const [funding, setFunding] = useState<number>(K.SERP.defFunding);
  const [vestYears, setVest] = useState<number>(K.SERP.defVestYrs);

  const [leverageOn, setLeverageOn] = useState(true);
  const [loan, setLoan] = useState<number>(K.SERP.defLoan);
  const [epigReturn, setEpigReturn] = useState<number>(K.EPIG.scenarios.base);

  const stressed = epigReturn <= 0;

  const r = useMemo(
    () =>
      serpModel({
        comp,
        replMult,
        departReduction,
        funding,
        vestYears,
        leverage: leverageOn
          ? { loan, loanRate: K.SERP.loanRate, epigReturn, years: 10 }
          : undefined,
      }),
    [comp, replMult, departReduction, funding, vestYears, leverageOn, loan, epigReturn],
  );

  return (
    <CalcShell
      title="SERP Retention + Leverage"
      intro="A SERP is golden handcuffs for a key employee — and its policy cash value can be borrowed to compound a spread. The spread can be negative; we let you model that too."
      inputs={
        <>
          <Slider label="Key-employee comp" value={comp} min={75_000} max={500_000} step={5_000} format={usdShort} onChange={setComp} />
          <PillGroup label="Replacement multiple" value={replMult} options={REPL_OPTS} onChange={setReplMult} />
          <Slider label="Departure-risk reduction" value={departReduction} min={0.1} max={0.9} step={0.05} format={(n) => pct(n * 100, 0)} onChange={setDepart} />
          <Slider label="Annual funding" value={funding} min={10_000} max={100_000} step={5_000} format={usdShort} onChange={setFunding} />
          <Slider label="Vesting years" value={vestYears} min={3} max={10} step={1} format={(n) => `${n} yr`} onChange={setVest} />
          <Toggle label="Model policy-loan leverage" checked={leverageOn} onChange={setLeverageOn} />
          {leverageOn && (
            <>
              <Slider label="Borrowed capital" value={loan} min={50_000} max={500_000} step={10_000} format={usdShort} onChange={setLoan} />
              <PillGroup label={`EPIG scenario (loan rate ${pct(K.SERP.loanRate * 100)})`} value={epigReturn} options={EPIG_OPTS} onChange={setEpigReturn} />
              <button
                type="button"
                className="btn btn--ghost"
                style={{ alignSelf: "flex-start" }}
                onClick={() => setEpigReturn(0)}
              >
                ⚠ Negative-spread stress test
              </button>
            </>
          )}
        </>
      }
      outputs={
        <Illustrative note="SERPs are §409A non-qualified plans; policy-loan leverage involves risk, including lapse if unpaid.">
          <div className="result-grid">
            <Result label="Cost of losing them" value={usdShort(r.costOfLoss)} tone="lost" />
            <Result label="SERP investment" value={usdShort(r.totalInvestment)} tone="data" />
            <Result label="Value protected (expected)" value={usdShort(r.valueProtected)} tone="upside" />
          </div>
          {r.leverage && (
            <>
              <div className="result-grid" style={{ marginTop: "var(--space-4)" }}>
                <Result label="FV of borrowed capital" value={usdShort(r.leverage.fv)} tone={stressed ? "kill" : "data"} />
                <Result label="Total loan interest" value={usdShort(r.leverage.interest)} tone="lost" />
                <Result label="Net leverage gain" value={usdShort(r.leverage.netGain)} tone={r.leverage.netGain >= 0 ? "upside" : "kill"} />
                <Result label="Spread" value={pct(r.leverage.spreadPct)} tone={r.leverage.spreadPct >= 0 ? "upside" : "kill"} />
                <Result label="Total value created" value={usdShort(r.leverage.totalValue)} tone="upside" />
              </div>
              {stressed && (
                <p className="legal" style={{ color: "var(--color-kill)", marginTop: "var(--space-3)" }}>
                  Stress case: with a 0% EPIG return the spread is negative — loan interest still
                  accrues, net leverage gain turns into a loss, and an unpaid loan can lapse the
                  policy. No competitor lets you model this. We do.
                </p>
              )}
            </>
          )}
          <ShowTheMath
            formula={
              <>
                Cost of loss = comp × replacement multiple. Value protected = cost × departure
                reduction. Leverage: FV = <code>fvLump(loan, EPIG, 10)</code>; interest = loan ×
                rate × years; net gain = FV − loan − interest; spread = EPIG − loan rate.
              </>
            }
            assumptions={[
              "Value protected is probability-weighted by the departure-risk reduction.",
              "EPIG scenarios are 5/8/12% (or 0% under stress) — not backtest figures.",
              "Loan interest accrues simply on the borrowed capital each year.",
            ]}
            excludes={[
              "Policy drag / cost of insurance beyond the modeled loan rate.",
              "Tax treatment of the SERP benefit and any policy distributions.",
              "The scenario where the key employee departs anyway.",
            ]}
          />
        </Illustrative>
      }
    />
  );
}

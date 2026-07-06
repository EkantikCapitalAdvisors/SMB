import { useMemo, useState } from "react";
import { K, dashboardModel } from "../engine";
import { usdShort, mult } from "../lib/format";
import { DisclaimerBlock } from "../components/DisclaimerBlock";
import { CalcShell, Slider, PillGroup, Result, Toggle, ShowTheMath } from "../components/ui";

const RATE_OPTS = [
  { value: 0.32, label: "32%" },
  { value: 0.38, label: "38%" },
  { value: 0.44, label: "44%" },
];
const EPIG_OPTS = [
  { value: K.EPIG.scenarios.cons, label: "5% cons" },
  { value: K.EPIG.scenarios.base, label: "8% base" },
  { value: K.EPIG.scenarios.strong, label: "12% strong" },
];

// §4.6 — Duveen identity: let the visitor find themselves in the machine. One tap pre-fills.
const PERSONAS = [
  { key: "A", label: "Dr. A — 52, solo, $650K SDE", sde: 650_000, taxRate: 0.38, dbContrib: 180_000, serpFunding: 25_000 },
  { key: "B", label: "Dr. B — 47, 4-op, $900K SDE", sde: 900_000, taxRate: 0.44, dbContrib: 220_000, serpFunding: 35_000 },
  { key: "C", label: "Owner C — 55, $500K SDE", sde: 500_000, taxRate: 0.38, dbContrib: 150_000, serpFunding: 20_000 },
];

export function MasterDashboard() {
  const [sde, setSde] = useState<number>(K.DEFAULT_SDE);
  const [taxRate, setTaxRate] = useState(0.38);
  const [epigReturn, setEpigReturn] = useState<number>(K.EPIG.scenarios.base);
  const [db, setDb] = useState(true);
  const [b831, setB831] = useState(false); // §5.4: 831(b) OFF by default (compliant posture)
  const [serp, setSerp] = useState(true);
  const [dbContrib, setDbContrib] = useState<number>(K.DB.defTarget);
  const [b831Premium, setB831Premium] = useState<number>(K.CAPTIVE.defPremium);
  const [serpFunding, setSerpFunding] = useState<number>(K.SERP.defFunding);
  const [ecaFee, setEcaFee] = useState(0); // required input; never defaulted (never imply a price)
  const [persona, setPersona] = useState<string>("");

  function applyPersona(p: (typeof PERSONAS)[number]) {
    setPersona(p.key);
    setSde(p.sde);
    setTaxRate(p.taxRate);
    setDbContrib(p.dbContrib);
    setSerpFunding(p.serpFunding);
  }

  const r = useMemo(
    () =>
      dashboardModel({
        sde,
        taxRate,
        years: 10,
        epigReturn,
        exitMultiple: K.EXIT.mult.base,
        reinvestEff: K.REINVEST_EFF.base,
        db,
        b831,
        serp,
        dbContrib,
        b831Premium,
        serpFunding,
        serpReplMult: 3.0,
        ecaFee,
        setupCosts: K.COSTS.defSetup,
        thirdPartyCosts: K.COSTS.defThirdParty,
      }),
    [sde, taxRate, epigReturn, db, b831, serp, dbContrib, b831Premium, serpFunding, ecaFee],
  );

  return (
    <CalcShell
      title="Master Dashboard"
      intro="Coordination is the product. Toggle the levers and watch tax savings compound into retirement, reserves, and exit value — one dollar of tax saved becomes several."
      inputs={
        <>
          <div className="field">
            <label>Start from a profile</label>
            <div className="pillrow">
              {PERSONAS.map((p) => (
                <button key={p.key} type="button" className="pill" aria-pressed={persona === p.key} onClick={() => applyPersona(p)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <PillGroup label="Effective tax rate" value={taxRate} options={RATE_OPTS} onChange={setTaxRate} />
          <PillGroup label="EPIG scenario" value={epigReturn} options={EPIG_OPTS} onChange={setEpigReturn} />
          <Toggle label="Defined Benefit plan" checked={db} onChange={setDb} />
          {db && <Slider label="DB contribution" value={dbContrib} min={50_000} max={K.DB.ceiling} step={5_000} format={usdShort} onChange={setDbContrib} />}
          <Toggle label="831(b) reserve (opt-in)" checked={b831} onChange={setB831} />
          {b831 && <Slider label="831(b) premium" value={b831Premium} min={50_000} max={K.CAPTIVE.premiumCap2026} step={10_000} format={usdShort} onChange={setB831Premium} />}
          <Toggle label="SERP retention" checked={serp} onChange={setSerp} />
          {serp && <Slider label="SERP funding" value={serpFunding} min={10_000} max={100_000} step={5_000} format={usdShort} onChange={setSerpFunding} />}
          <Slider label="ECA advisory fee (required)" value={ecaFee} min={0} max={100_000} step={5_000} format={(n) => (n === 0 ? "— enter to price" : usdShort(n))} onChange={setEcaFee} />
        </>
      }
      outputs={
        <DisclaimerBlock note="Depends on eligibility, plan design, IRS/DOL compliance, and market performance.">
          {ecaFee === 0 && (
            <p className="legal" style={{ color: "var(--gold-500)", marginTop: 0 }}>
              Enter your ECA advisory fee to price net costs. It is quoted at the strategy session
              (a % of value created, not AUM) — never assumed here.
            </p>
          )}
          <div className="result-grid">
            <Result label="Total tax saved (10 yr)" value={usdShort(r.totalTaxSavings)} tone="upside" />
            <Result label="Retirement accumulation" value={usdShort(r.accumulation)} tone="upside" />
            <Result label="Reserve pool" value={usdShort(r.reserves)} tone="data" />
            <Result label="Retention ROI" value={usdShort(r.retentionRoi)} tone="data" />
          </div>

          <div
            className="result"
            style={{ marginTop: "var(--space-5)", borderColor: "var(--hairline-gold)", background: "rgba(200,169,81,.06)" }}
          >
            <span className="badge badge--kill" style={{ marginBottom: "var(--space-3)" }}>
              <span className="badge__dot" /> Exit uplift &amp; multiplier — unconfirmed formula
            </span>
            <div className="result-grid">
              <Result label="Exit uplift (interim)" value={usdShort(r.exitUplift)} tone="lost" />
              <Result label="Net value (interim)" value={usdShort(r.netValue)} tone="upside" />
              <Result label="Multiplier (interim)" value={mult(r.multiplier)} tone="upside" />
            </div>
            <p className="legal" style={{ marginTop: "var(--space-3)" }}>
              The exit-uplift formula and the resulting net-value multiplier are pending sign-off
              (spec DASH-1). Shown as an interim value — not a published figure.
            </p>
          </div>

          <ShowTheMath
            formula={
              <>
                Tax saved = (DB + 831b) × rate × years. Accumulation ={" "}
                <code>fvAnnuity(DB, EPIG, 10)</code>. Reserves ={" "}
                <code>fvAnnuity(netReserve, 5%, 10)</code>. Retention = comp × 3× × 50%. Multiplier
                = net value ÷ tax saved. <em>(Exit uplift interim — see note.)</em>
              </>
            }
            assumptions={[
              "SERP is retention-only here, not an accumulation vehicle.",
              "831(b) is opt-in and OFF by default (the compliant posture).",
              "Conservative scenario is always shown alongside base/strong on the chart (equal prominence).",
            ]}
            excludes={[
              "The confirmed exit-uplift formula (this drives the headline multiplier).",
              "Your ECA advisory fee until you enter it — never assumed.",
              "Taxes on distribution and individual circumstances.",
            ]}
          />
        </DisclaimerBlock>
      }
    />
  );
}

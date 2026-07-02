import { useMemo, useState } from "react";
import { K, captiveModel, type ClaimsLevel } from "../engine";
import { usdShort } from "../lib/format";
import { Illustrative } from "../components/Illustrative";
import { CalcShell, Slider, PillGroup, Result, ShowTheMath } from "../components/ui";

const CLAIMS_OPTS = [
  { value: "none" as ClaimsLevel, label: "None" },
  { value: "low" as ClaimsLevel, label: "Low (10%)" },
  { value: "med" as ClaimsLevel, label: "Med (25%)" },
];
const RATE_OPTS = [
  { value: 0.32, label: "32%" },
  { value: 0.38, label: "38%" },
  { value: 0.44, label: "44%" },
];
const GROWTH_OPTS = [
  { value: K.CAPTIVE.growth.cons, label: "3% cons" },
  { value: K.CAPTIVE.growth.base, label: "5% base" },
  { value: K.CAPTIVE.growth.strong, label: "8% strong" },
];
const HAIRCUT_OPTS = [
  { value: 1.0, label: "100%" },
  { value: 0.75, label: "75%" },
  { value: 0.5, label: "50%" },
];

export function CaptiveReserve() {
  const [premium, setPremium] = useState<number>(K.CAPTIVE.defPremium);
  const [admin, setAdmin] = useState<number>(K.CAPTIVE.defAdmin);
  const [returnRate, setReturnRate] = useState<number>(K.CAPTIVE.growth.base);
  const [claims, setClaims] = useState<ClaimsLevel>("low");
  const [taxRate, setTaxRate] = useState(0.38);
  const [deductibility, setDeductibility] = useState(1.0);
  const [overhead, setOverhead] = useState(50_000);

  const r = useMemo(
    () => captiveModel({ premium, admin, returnRate, years: 10, claims, taxRate, deductibility, monthlyOverhead: overhead }),
    [premium, admin, returnRate, claims, taxRate, deductibility, overhead],
  );

  return (
    <CalcShell
      title="831(b) Reserve"
      intro="Fund tax-efficient reserves for real business risks — then measure the pool in months of survival, not just dollars. We model the IRS-challenge scenario because your other advisors won't."
      inputs={
        <>
          <Slider label="Annual premium" value={premium} min={50_000} max={K.CAPTIVE.premiumCap2026} step={10_000} format={usdShort} onChange={setPremium} />
          <Slider label="Admin cost" value={admin} min={0} max={100_000} step={5_000} format={usdShort} onChange={setAdmin} />
          <Slider label="Monthly overhead" value={overhead} min={10_000} max={250_000} step={5_000} format={usdShort} onChange={setOverhead} />
          <PillGroup label="Expected claims" value={claims} options={CLAIMS_OPTS} onChange={setClaims} />
          <PillGroup label="Reserve growth" value={returnRate} options={GROWTH_OPTS} onChange={setReturnRate} />
          <PillGroup label="Effective tax rate" value={taxRate} options={RATE_OPTS} onChange={setTaxRate} />
          <PillGroup label="Deductibility (IRS-challenge stress)" value={deductibility} options={HAIRCUT_OPTS} onChange={setDeductibility} />
        </>
      }
      outputs={
        <Illustrative note="831(b) elections carry strict IRS requirements; deductibility is fact-specific.">
          <div className="result-grid">
            <Result label="Year-1 tax effect" value={usdShort(r.taxEffect)} tone="upside" />
            <Result label="Year-1 net reserve" value={usdShort(r.netReserve)} tone="data" />
            <Result label="~10-yr reserve pool" value={usdShort(r.pool)} tone="data" />
            <Result label="Shock absorption" value={r.monthsCovered != null ? `~${r.monthsCovered} mo` : "—"} tone="upside" />
          </div>
          <ShowTheMath
            formula={
              <>
                Deductible portion = premium × haircut. Tax effect = deductible × rate. Net reserve
                = premium − admin − claims. Pool = <code>fvAnnuity(netReserve, r, 10)</code>. Months
                = pool ÷ monthly overhead.
              </>
            }
            assumptions={[
              "Haircut lets you stress the IRS-challenge scenario (100 / 75 / 50% deductible).",
              "Reserve growth uses the conservative 3/5/8% scenario rates.",
              "Claims reduce the net reserve at the selected percentage of premium.",
            ]}
            excludes={[
              "Formation, actuarial, and ongoing compliance costs of the captive.",
              "The risk that the IRS challenges the arrangement entirely.",
              "Investment losses in the reserve pool.",
            ]}
          />
        </Illustrative>
      }
    />
  );
}

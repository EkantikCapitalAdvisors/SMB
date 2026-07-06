import { useMemo, useState } from "react";
import { K, dbModel } from "../engine";
import { usdShort, band } from "../lib/format";
import { DisclaimerBlock } from "../components/DisclaimerBlock";
import { CalcShell, Slider, PillGroup, Result, ShowTheMath } from "../components/ui";

const RATE_OPTS = [
  { value: 0.32, label: "32%" },
  { value: 0.38, label: "38%" },
  { value: 0.44, label: "44%" },
];
const RETURN_OPTS = [
  { value: K.EPIG.scenarios.cons, label: "5% cons" },
  { value: K.EPIG.scenarios.base, label: "8% base" },
  { value: K.EPIG.scenarios.strong, label: "12% strong" },
];

export function DbAccelerator() {
  const [target, setTarget] = useState<number>(K.DB.defTarget);
  const [taxRate, setTaxRate] = useState(0.38);
  const [years, setYears] = useState(10);
  const [returnRate, setReturnRate] = useState<number>(K.EPIG.scenarios.base);

  const r = useMemo(
    () => dbModel({ target, taxRate, years, returnRate }),
    [target, taxRate, years, returnRate],
  );

  return (
    <CalcShell
      title="DB Accelerator"
      intro="A defined benefit plan can shelter far more than a 401(k)/SEP. The single most persuasive fact: your deduction funds most of the contribution — net out-of-pocket is a fraction of what goes in."
      inputs={
        <>
          <Slider label="Target annual contribution" value={target} min={50_000} max={K.DB.ceiling} step={5_000} format={usdShort} onChange={setTarget} />
          <PillGroup label="Effective tax rate" value={taxRate} options={RATE_OPTS} onChange={setTaxRate} />
          <Slider label="Years" value={years} min={5} max={20} step={1} format={(n) => `${n} yr`} onChange={setYears} />
          <PillGroup label="Growth scenario" value={returnRate} options={RETURN_OPTS} onChange={setReturnRate} />
        </>
      }
      outputs={
        <DisclaimerBlock note="Contribution limits are set by IRS rules and actuarial determination.">
          <div className="result-grid">
            <Result label="Contribution range" value={band(r.contribLow, r.contribHigh)} tone="upside" />
            <Result label="Tax savings (yr 1)" value={band(r.taxSavingLow, r.taxSavingHigh)} tone="upside" />
            <Result label="Net out-of-pocket" value={band(r.netOopLow, r.netOopHigh)} tone="lost" />
            <Result label="~10-yr accumulation" value={usdShort(r.accumulation)} tone="upside" />
          </div>
          <ShowTheMath
            formula={
              <>
                Contribution band = target × [{K.DB.rangeMult[0]}, {K.DB.rangeMult[1]}]. Tax savings =
                contribution × rate. Net out-of-pocket = widest honest band (low contribution −{" "}
                high saving … high contribution − low saving). Accumulation ={" "}
                <code>fvAnnuity(target, r, years)</code>.
              </>
            }
            assumptions={[
              "Contribution range is illustrative ±20% of target; the actuary sets the real number.",
              "Tax savings assume the contribution is fully deductible at your blended rate.",
              "Growth uses the 5/8/12% scenario rates — not backtest figures.",
            ]}
            excludes={[
              "Employee coverage costs for team plans (typically 20–40% more — modeled separately).",
              "Plan setup, third-party administration, and actuarial fees.",
              "State taxes and your specific circumstances.",
            ]}
          />
        </DisclaimerBlock>
      }
    />
  );
}

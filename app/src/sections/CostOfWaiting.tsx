import { useMemo, useState } from "react";
import { K, leak, delayModel, type Scenario } from "../engine";
import { usd, usdShort } from "../lib/format";
import { Section, Kicker, PillGroup, Result } from "../components/ui";
import { DisclaimerBlock } from "../components/DisclaimerBlock";

const DELAY_OPTS = [
  { value: 0, label: "This quarter" },
  { value: 2, label: "+2 quarters" },
  { value: 4, label: "+4 quarters" },
  { value: 8, label: "+8 quarters" },
];
const SCENARIOS: Scenario[] = ["cons", "base", "strong"];

/** §4.7 THE COST OF WAITING — U-force via true arithmetic (no fake timers). */
export function CostOfWaiting() {
  const [q, setQ] = useState(4);

  const quarterlyLeak = useMemo(() => leak(K.DEFAULT_SDE, K.EFF_RATE.base).quarterly, []);
  const results = useMemo(
    () =>
      SCENARIOS.map((s) =>
        delayModel(
          { quartersDelayed: q, quarterlyLeak, annualContribution: K.DB.defTarget, horizonYears: 10 },
          s,
        ),
      ),
    [q, quarterlyLeak],
  );

  const unrecaptured = results[0].unrecapturedLeak; // leak term is scenario-independent
  const lo = Math.min(...results.map((r) => r.foregoneCompounding));
  const hi = Math.max(...results.map((r) => r.foregoneCompounding));

  return (
    <Section variant="dark">
      <Kicker num="08">The cost of waiting</Kicker>
      <h2 className="h2">The arithmetic is the pressure. Nothing else.</h2>
      <p className="section-intro">
        A Defined Benefit plan must be adopted and funded within the tax year to count for that year.
        Miss the window and the deduction for the current year is not deferred — it is forfeited.
        {/* [PENDING: counsel confirms exact adoption/funding deadline language before ship.] */}
      </p>

      <div className="card" style={{ marginTop: "var(--space-6)" }}>
        <PillGroup label="If you start…" value={q} options={DELAY_OPTS} onChange={setQ} />
        <div className="result-grid" style={{ marginTop: "var(--space-4)" }}>
          <Result label="Unrecaptured taxes" value={usd(unrecaptured)} tone="lost" />
          <Result
            label="10-yr net value forgone"
            value={q === 0 ? "$0" : `${usdShort(lo)} – ${usdShort(hi)}`}
            tone="lost"
          />
        </div>
        <p style={{ marginTop: "var(--space-3)", color: "var(--muted-on-dark)" }}>
          At an illustrative $500K SDE profile, waiting {q === 0 ? "zero" : q} quarter{q === 1 ? "" : "s"}{" "}
          ≈ <strong>{usd(unrecaptured)}</strong> in unrecoverable taxes
          {q > 0 && (
            <>
              {" "}plus an illustrative {usdShort(lo)}–{usdShort(hi)} of 10-year net value forgone
              (a shorter compounding runway)
            </>
          )}
          .
        </p>
        <DisclaimerBlock note="Range spans the conservative/base/strong scenario rates; assumes eligibility and consistent funding.">
          <span />
        </DisclaimerBlock>
      </div>
    </Section>
  );
}

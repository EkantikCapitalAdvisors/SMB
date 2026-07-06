import { Section, Kicker, Result } from "../components/ui";
import { DisclaimerBlock } from "../components/DisclaimerBlock";

/**
 * §4.4 THE MULTIPLIER — promoted above the calculators (the shareable idea).
 * §1.4 — model-framed, owned by the visitor. NEVER a typicality/member claim.
 */
export function Multiplier() {
  return (
    <Section variant="panel">
      <Kicker num="04" gold>The multiplier</Kicker>
      <h2 className="h2">One dollar of tax saved, coordinated, models into several.</h2>
      <p className="section-intro">
        The coordinated model illustrates $1 of tax saved compounding into <strong>$4–6 of modeled
        net value</strong> over 10 years — through retirement accumulation, reserves, retention, and
        exit value working together. This is a model output, not a track record. Run your own inputs
        below; the dashboard computes <em>your</em> multiplier, not ours.
      </p>

      <div className="card" style={{ marginTop: "var(--space-6)" }}>
        <div className="result-grid">
          <Result label="You save (illustrative)" value="$1" tone="upside" />
          <Result label="Models into (10-yr net)" value="$4 – $6" tone="upside" />
          <Result label="Your number" value="Run the dashboard ↓" tone="data" />
        </div>
        <DisclaimerBlock note="Modeled range from the coordinated dashboard using illustrative scenario rates; depends entirely on your inputs, eligibility, and market performance.">
          <p style={{ marginTop: "var(--space-2)", color: "var(--muted-on-dark)", fontSize: "var(--step--1)" }}>
            Multiplier = modeled net value ÷ tax saved. Every input is yours; every assumption is
            visible.
          </p>
        </DisclaimerBlock>
      </div>
    </Section>
  );
}

import { useMemo, useState } from "react";
import { K, leak } from "../engine";
import { usd } from "../lib/format";
import { Section, Kicker, Slider, PillGroup, Result } from "../components/ui";
import { DisclaimerBlock } from "../components/DisclaimerBlock";

const RATE_OPTS = [
  { value: 0.32, label: "32%" },
  { value: 0.38, label: "38%" },
  { value: 0.44, label: "44%" },
];

/** §4.1 HERO — pain-first, quantified (D-force + Jobs specificity). Headline A. */
export function Hero() {
  const [sde, setSde] = useState<number>(K.DEFAULT_SDE);
  const [rate, setRate] = useState<number>(K.EFF_RATE.base);
  const r = useMemo(() => leak(sde, rate), [sde, rate]);

  return (
    <Section variant="dark">
      <Kicker gold>Ekantik Capital · Retirement Supercharger</Kicker>
      <h1 className="h1" style={{ marginTop: "var(--space-4)", maxWidth: "18ch" }}>
        A $500K-profit practice sends the IRS roughly <em>$190,000</em> a year. There is an
        architecture that redirects it.
      </h1>
      <p className="lead" style={{ marginTop: "var(--space-4)", color: "var(--muted-on-dark)" }}>
        Illustrative at a 38% effective rate. Run your own number below. Defined Benefit + 831(b) +
        SERP, coordinated and compounded through EPIG — a fiduciary-minded, compliance-first program
        for established business owners, built with your CPA and attorney, not around them.
      </p>

      <div className="card" style={{ marginTop: "var(--space-6)", maxWidth: 660 }}>
        <span className="kicker" style={{ marginBottom: "var(--space-4)" }}>
          <span className="kicker__num">01</span> · Your leak, quantified
        </span>
        <Slider label="Annual SDE / owner profit" value={sde} min={200_000} max={2_000_000} step={10_000} format={usd} onChange={setSde} />
        <PillGroup label="Effective tax rate" value={rate} options={RATE_OPTS} onChange={setRate} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", marginTop: "var(--space-4)" }}>
          <Result label="Annual leak" value={usd(r.annual)} tone="lost" />
          <Result label="Over 10 years" value={usd(r.decade)} tone="lost" />
          <Result label="Per quarter" value={usd(r.quarterly)} tone="lost" />
        </div>
        <DisclaimerBlock note="Blended-rate approximation.">
          <span />
        </DisclaimerBlock>
      </div>

      <div style={{ marginTop: "var(--space-6)", display: "flex", gap: "var(--space-4)", alignItems: "center", flexWrap: "wrap" }}>
        <a className="btn btn--primary" href="#run-your-numbers">
          Run my numbers →
        </a>
        <span className="legal" style={{ margin: 0 }}>
          Compliance-first. Eligibility-dependent. Coordinated with your CPA and attorney.
        </span>
      </div>
    </Section>
  );
}

import { useMemo, useState } from "react";
import { K, leak } from "./engine";
import { usd } from "./lib/format";
import { Section, Kicker, Slider, PillGroup, Result } from "./components/ui";
import { Illustrative } from "./components/Illustrative";
import { DbAccelerator } from "./calculators/DbAccelerator";
import { CaptiveReserve } from "./calculators/CaptiveReserve";
import { SerpRetention } from "./calculators/SerpRetention";
import { MasterDashboard } from "./calculators/MasterDashboard";

const RATE_OPTS = [
  { value: 0.32, label: "32%" },
  { value: 0.38, label: "38%" },
  { value: 0.44, label: "44%" },
];

/** Hero widget — Tax Leak Meter (§4.1, Force D). The wound, quantified. */
function LeakMeter() {
  const [sde, setSde] = useState<number>(K.DEFAULT_SDE);
  const [rate, setRate] = useState<number>(K.EFF_RATE.base);
  const r = useMemo(() => leak(sde, rate), [sde, rate]);
  return (
    <div className="card" style={{ marginTop: "var(--space-6)", maxWidth: 640 }}>
      <Slider label="Annual SDE" value={sde} min={200_000} max={2_000_000} step={10_000} format={usd} onChange={setSde} />
      <PillGroup label="Effective tax rate" value={rate} options={RATE_OPTS} onChange={setRate} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", marginTop: "var(--space-4)" }}>
        <Result label="Annual leak" value={usd(r.annual)} tone="lost" />
        <Result label="Over 10 years" value={usd(r.decade)} tone="lost" />
        <Result label="Per quarter" value={usd(r.quarterly)} tone="lost" />
      </div>
      <Illustrative note="Blended-rate approximation." >
        <span />
      </Illustrative>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <Section variant="dark">
        <Kicker gold>Ekantik Capital · Retirement Supercharger</Kicker>
        <h1 className="h1" style={{ marginTop: "var(--space-4)" }}>
          Turn tax-optimized structures into <em>accelerated</em> retirement outcomes.
        </h1>
        <p className="lead" style={{ marginTop: "var(--space-4)", color: "var(--muted-on-dark)" }}>
          Four levers working together — Defined Benefit, 831(b), SERP, and EPIG compounding. Your
          own numbers, computed live. Start with what a blended tax rate quietly costs you every year.
        </p>
        <LeakMeter />
      </Section>

      <Section id="architecture" variant="panel">
        <Kicker num="01">The architecture</Kicker>
        <h2 className="h2">Three levers create the fuel. One engine multiplies it.</h2>
        <p className="section-intro">
          Tax savings, reserves, and retention free up capital; EPIG compounds it. Below, each lever
          is a live calculator driven by one shared engine — coordination you can experience, not
          just read about.
        </p>
      </Section>

      <Section id="db" variant="dark">
        <Kicker num="02">Lever 1 · Defined Benefit</Kicker>
        <h2 className="h2">A higher ceiling — and the deduction funds it.</h2>
        <DbAccelerator />
      </Section>

      <Section id="captive" variant="panel">
        <Kicker num="03">Lever 2 · 831(b)</Kicker>
        <h2 className="h2">Reserves, measured in months of survival.</h2>
        <CaptiveReserve />
      </Section>

      <Section id="serp" variant="dark">
        <Kicker num="04">Lever 3 · SERP</Kicker>
        <h2 className="h2">Golden handcuffs — plus a spread you can model both ways.</h2>
        <SerpRetention />
      </Section>

      <Section id="dashboard" variant="panel">
        <Kicker num="05" gold>The full model</Kicker>
        <h2 className="h2">One dollar of tax saved, coordinated.</h2>
        <MasterDashboard />
      </Section>

      <Section variant="dark">
        <p className="legal">
          © 2026 Ekantik Capital Advisors LLC. All calculators are illustrative, educational
          estimates — not tax, legal, or investment advice, and not an offer or solicitation. All
          figures depend on eligibility, compliance, plan design, and market performance. Past
          performance does not indicate future results. Investing involves risk, including loss of
          principal.
        </p>
      </Section>
    </main>
  );
}

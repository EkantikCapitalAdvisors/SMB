import { Section, Kicker } from "../components/ui";

const LEVERS = [
  { n: "1", t: "Defined Benefit", d: "A higher, actuary-set retirement ceiling — the deduction funds most of the contribution." },
  { n: "2", t: "831(b) Reserve", d: "Tax-efficient reserves for real business risks, measured in months of survival." },
  { n: "3", t: "SERP", d: "Golden handcuffs for a key employee, with optional policy-loan leverage." },
];

// §1.2 / §4.3 — mechanism trio replaces the deleted performance stat trio.
// Apparatus of proof, not outcomes.
const MECHANISM = [
  "Rules-based execution — no discretion",
  "Defined de-risk triggers in correction regimes",
  "Third-party custody: Interactive Brokers",
];

/** §4.3 THE ARCHITECTURE — three levers create the fuel; EPIG compounds it. */
export function Architecture() {
  return (
    <Section id="architecture" variant="dark">
      <Kicker num="03">The architecture</Kicker>
      <h2 className="h2">Three levers create the fuel. One engine compounds it.</h2>
      <p className="section-intro">
        Tax savings, reserves, and retention free up capital; EPIG — a rule-based, risk-managed S&amp;P
        500 strategy — compounds it. Create fuel → deploy to EPIG → multiply.
      </p>

      <div className="result-grid" style={{ marginTop: "var(--space-6)" }}>
        {LEVERS.map((l) => (
          <div key={l.n} className="card">
            <span className="kicker kicker--gold" style={{ margin: 0 }}>
              <span className="kicker__num">{l.n}</span>
            </span>
            <h3 className="h3" style={{ marginTop: "var(--space-2)" }}>{l.t}</h3>
            <p style={{ marginTop: "var(--space-2)", color: "var(--muted-on-dark)" }}>{l.d}</p>
          </div>
        ))}
      </div>

      <hr className="hairline" />

      <h3 className="h3">EPIG — the engine, by its mechanism</h3>
      <p className="section-intro">We describe EPIG by how it works, not by a performance number.</p>
      <div className="result-grid" style={{ marginTop: "var(--space-4)" }}>
        {MECHANISM.map((m) => (
          <div key={m} className="result">
            <div style={{ color: "var(--text-on-dark)", fontWeight: 600 }}>{m}</div>
          </div>
        ))}
      </div>
      <p className="legal" style={{ marginTop: "var(--space-4)" }}>
        Backtested methodology and full assumptions are available in the EPIG strategy brief (gated).
        Nothing here is a performance representation.
      </p>
    </Section>
  );
}

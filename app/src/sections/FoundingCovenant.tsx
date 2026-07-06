import { Section, Kicker } from "../components/ui";

const TERMS = [
  "Our fee is a percentage of value created — not AUM.",
  "Locked for 10 years under Good Standing.",
  "Third-party costs (actuary, TPA, legal) disclosed upfront and billed separately.",
  "Coordinated with — never replacing — your CPA and attorney.",
];

/** §4.8 THE FOUNDING COVENANT — named risk reversal (R-force). */
export function FoundingCovenant() {
  return (
    <Section variant="panel">
      <Kicker num="10" gold>The founding covenant</Kicker>
      <h2 className="h2">Your success is not our marketing. It is our compensation.</h2>
      <div className="result-grid" style={{ marginTop: "var(--space-6)" }}>
        {TERMS.map((t, i) => (
          <div key={i} className="card">
            <span className="stat__num stat__num--upside" style={{ fontSize: "1.4rem" }}>◆</span>
            <p style={{ marginTop: "var(--space-2)" }}>{t}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

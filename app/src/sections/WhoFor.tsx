import { Section, Kicker } from "../components/ui";

const IS = [
  "Established owner, age 45+, with 5+ years to retirement",
  "$300K+ SDE / owner profit, stable cash flow",
  "Willing to commit to consistent annual funding",
  "Wants the maximum coordinated, compliant tax-deductible structure",
];
const NOT = [
  "Under ~$300K SDE — the structures rarely justify their cost",
  "Planning an exit in the next 1–2 years",
  "Wants a DIY tool, not a coordinated program",
  "Needs guaranteed returns — nothing here is guaranteed",
];

/** §3.9 WHO THIS IS FOR / NOT FOR — Duveen qualification (the screener can say no). */
export function WhoFor() {
  return (
    <Section id="fit" variant="dark">
      <Kicker num="09">Fit</Kicker>
      <h2 className="h2">This is built for some owners. Not all.</h2>
      <div className="calc" style={{ marginTop: "var(--space-6)" }}>
        <div className="card">
          <h3 className="h3" style={{ color: "var(--gold-500)" }}>This is for you if…</h3>
          <ul style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {IS.map((x) => (
              <li key={x} style={{ color: "var(--muted-on-dark)" }}>◆ {x}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="h3" style={{ color: "var(--slate-400)" }}>It isn't, if…</h3>
          <ul style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {NOT.map((x) => (
              <li key={x} style={{ color: "var(--muted-on-dark)" }}>— {x}</li>
            ))}
          </ul>
          <p className="legal" style={{ marginTop: "var(--space-3)" }}>
            If we're not a fit, we'll say so. The refusal is the point.
          </p>
        </div>
      </div>
    </Section>
  );
}

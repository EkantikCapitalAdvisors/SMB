import { Section, Kicker } from "../components/ui";

const FAQS: [string, string][] = [
  [
    "Isn't the IRS hostile to micro-captives?",
    "In abusive configurations, yes — and we say so on this page. That is precisely why the 831(b) lever is OFF by default in our model, eligibility-screened, and implemented only with qualified captive counsel.",
  ],
  [
    "Why should I trust a firm in soft launch?",
    "You shouldn't take it on faith — take it on apparatus. Visible formulas, disclosed exclusions, third-party custody, and a covenant that ties our fee to value created. We're selecting a founding cohort, not manufacturing testimonials we don't have.",
  ],
  [
    "What return assumptions does the model use?",
    "Illustrative scenario rates only — conservative, base, and strong — shown side by side so the conservative path has equal prominence. These are assumptions for modeling, not forecasts or guarantees.",
  ],
  [
    "Are the calculator results guaranteed?",
    "No. Every result is an illustrative, educational estimate that depends on eligibility, plan design, compliance, and market performance. The math is shown so you can check it — and stress it.",
  ],
];

/** §4.9 FAQ — objection preemption. */
export function Faq() {
  return (
    <Section id="faq" variant="dark">
      <Kicker num="12">FAQ</Kicker>
      <h2 className="h2">The hardest questions, answered on the page.</h2>
      <div style={{ marginTop: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {FAQS.map(([q, a]) => (
          <details key={q} className="drawer" style={{ borderTop: "1px solid var(--border-on-dark)" }}>
            <summary style={{ color: "var(--text-on-dark)", textTransform: "none", letterSpacing: 0, fontSize: "var(--step-1)" }}>
              {q}
            </summary>
            <div className="drawer__body">{a}</div>
          </details>
        ))}
      </div>
    </Section>
  );
}

import { Section, Kicker } from "../components/ui";

/** §4.8 close — single primary CTA, Duveen application frame (506(b) discipline). */
export function Apply() {
  return (
    <Section id="apply" variant="panel">
      <Kicker num="13" gold>Apply</Kicker>
      <h2 className="h2">Selection, not solicitation.</h2>
      <p className="section-intro">
        Short application. If we're a fit, you'll receive an invitation to a strategy session. Every
        step is about eligibility and fit — never an investment offer.
      </p>
      <div style={{ marginTop: "var(--space-6)", display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
        <a className="btn btn--primary" href="https://calendly.com/hd-ekantikcapital/30min" target="_blank" rel="noopener noreferrer">
          Apply for the founding cohort →
        </a>
        <a className="btn btn--ghost" href="mailto:hd@ekantikcapital.com">
          hd@ekantikcapital.com
        </a>
      </div>
      {/* §1.5 scarcity: publish the true integer cap or nothing. Cohort number PENDING (Hiren) —
          so no scarcity claim is made here. */}
    </Section>
  );
}

import { Section, Kicker } from "../components/ui";

/** §4.5 THE ARCHITECT — named authority (Cialdini authority + P-force). */
export function Architect() {
  return (
    <Section variant="dark">
      <Kicker num="05">The architect</Kicker>
      <h2 className="h2">Who's behind this.</h2>

      <div className="card" style={{ marginTop: "var(--space-6)", display: "grid", gridTemplateColumns: "auto 1fr", gap: "var(--space-5)", alignItems: "start" }}>
        <div
          aria-hidden
          style={{
            width: 84, height: 84, borderRadius: "50%", flexShrink: 0,
            display: "grid", placeItems: "center",
            background: "var(--navy-800)", border: "1px solid var(--hairline-gold)",
            fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--gold-500)",
          }}
        >
          HD
        </div>
        <div>
          <h3 className="h3">Hiren Desai</h3>
          <p style={{ color: "var(--gold-500)", fontWeight: 600 }}>Founder &amp; Chief Investment Officer</p>
          <p style={{ marginTop: "var(--space-3)", color: "var(--muted-on-dark)" }}>
            I built this because the owners who fund everyone else's retirement architecture rarely
            have one of their own. Ekantik coordinates the levers that actually move the number —
            with your CPA and attorney, not around them.
          </p>
          {/* [PENDING: Hiren confirms exact registrable entity language. Omit rather than
              approximate — approximated regulatory claims are a §1-class violation.] */}
        </div>
      </div>

      <div className="card" style={{ marginTop: "var(--space-5)", borderColor: "var(--hairline-gold)" }}>
        <h3 className="h3">What you won't find on this page.</h3>
        <p style={{ marginTop: "var(--space-2)", color: "var(--muted-on-dark)" }}>
          No fake testimonials. No stock photos of handshakes. This is a soft launch — we're
          selecting a founding cohort, and we'd rather show you the apparatus of proof (visible
          formulas, disclosed exclusions, third-party custody) than manufacture social proof that
          doesn't exist yet.
        </p>
      </div>
    </Section>
  );
}

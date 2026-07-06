import type { ReactNode } from "react";

/**
 * §4.6 / §7.1 — DisclaimerBlock: every numeric output renders inside this
 * wrapper (lint/acceptance-enforced: ≥1 per calculator). Carries the
 * illustrative label and the consult-your-professionals line. §7.5 not-advice
 * boundary — outputs are educational estimates, never advice.
 */
export function DisclaimerBlock({
  children,
  note,
}: {
  children: ReactNode;
  note?: string;
}) {
  return (
    <div>
      {children}
      <p className="legal" style={{ marginTop: "var(--space-3)" }}>
        <span className="illustrative-tag">Illustrative</span> — educational estimate, not tax,
        legal, or investment advice. {note ? note + " " : ""}Consult your CPA, attorney, and
        financial professionals.
      </p>
    </div>
  );
}

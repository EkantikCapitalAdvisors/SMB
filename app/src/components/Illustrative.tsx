import type { ReactNode } from "react";

/**
 * §7.1 — every numeric output renders inside this wrapper, which carries the
 * illustrative label + the consult-your-professionals line. §7.5 not-advice
 * boundary: outputs are educational estimates, never advice.
 */
export function Illustrative({
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

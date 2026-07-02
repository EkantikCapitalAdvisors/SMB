import { useMemo, useState } from "react";
import { K, leak } from "./engine";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/**
 * Re-platform shell. This turn lands the foundation: brand tokens + the shared
 * engine (§3), demonstrated live via the Tax Leak Meter (§4.1, Force D). The
 * remaining sections (§2 scroll arc, calculators, §6 visuals, screener) build
 * on top of this same engine — numbers are never hardcoded in the UI.
 */
export default function App() {
  const [sde, setSde] = useState<number>(K.DEFAULT_SDE);
  const [rate, setRate] = useState<keyof typeof K.EFF_RATE>("base");
  const result = useMemo(() => leak(sde, K.EFF_RATE[rate]), [sde, rate]);

  return (
    <main>
      <section style={{ paddingBlock: "var(--section-y)" }}>
        <div className="wrap">
          <span
            style={{
              fontSize: "var(--step--1)",
              fontWeight: 600,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "var(--gold-500)",
            }}
          >
            ◆ Ekantik Capital · Retirement Supercharger
          </span>
          <h1 className="h1" style={{ marginTop: "var(--space-4)" }}>
            Turn tax-optimized structures into <em style={{ fontStyle: "italic", color: "var(--gold-500)" }}>accelerated</em> retirement outcomes.
          </h1>
          <p style={{ marginTop: "var(--space-4)", maxWidth: "60ch", color: "var(--muted-on-dark)" }}>
            Re-platform in progress (React/TS). Foundation online: brand tokens + the shared
            calculation engine. Below is the engine driving the hero Tax Leak Meter — every figure
            is engine-computed, never hardcoded.
          </p>

          <div
            style={{
              marginTop: "var(--space-6)",
              padding: "var(--space-6)",
              background: "var(--navy-900)",
              border: "1px solid var(--border-on-dark)",
              borderRadius: "var(--radius-lg)",
              maxWidth: 640,
            }}
          >
            <label style={{ display: "block", fontSize: "var(--step--1)", color: "var(--muted-on-dark)" }}>
              Annual SDE — {fmt(sde)}
            </label>
            <input
              type="range"
              min={200_000}
              max={2_000_000}
              step={10_000}
              value={sde}
              onChange={(e) => setSde(Number(e.target.value))}
              style={{ width: "100%", marginBlock: "var(--space-3)", accentColor: "var(--gold-500)" }}
            />
            <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
              {(["cons", "base", "strong"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setRate(k)}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--step--1)",
                    padding: ".4rem .9rem",
                    borderRadius: 999,
                    cursor: "pointer",
                    border: "1px solid " + (rate === k ? "var(--gold-500)" : "var(--border-on-dark)"),
                    background: rate === k ? "var(--gold-500)" : "transparent",
                    color: rate === k ? "var(--navy-950)" : "var(--muted-on-dark)",
                  }}
                >
                  {(K.EFF_RATE[k] * 100).toFixed(0)}%
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)" }}>
              <Stat label="Annual leak" value={fmt(result.annual)} />
              <Stat label="Over 10 years" value={fmt(result.decade)} />
              <Stat label="Per quarter" value={fmt(result.quarterly)} />
            </div>
            <p style={{ marginTop: "var(--space-4)", fontSize: "var(--step--1)", color: "var(--muted-on-dark)" }}>
              Illustrative; blended-rate approximation; consult your CPA. Not tax, legal, or
              investment advice.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="mono"
        style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", lineHeight: 1, color: "var(--slate-400)" }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: "var(--space-2)",
          fontSize: "var(--step--1)",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--muted-on-dark)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

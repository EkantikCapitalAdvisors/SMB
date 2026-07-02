import type { ReactNode } from "react";

export function Section({
  id,
  variant = "dark",
  children,
}: {
  id?: string;
  variant?: "dark" | "panel" | "light";
  children: ReactNode;
}) {
  return (
    <section id={id} className={`section section--${variant}`}>
      <div className="wrap">{children}</div>
    </section>
  );
}

export function Kicker({ num, gold, children }: { num?: string; gold?: boolean; children: ReactNode }) {
  return (
    <span className={`kicker${gold ? " kicker--gold" : ""}`}>
      {num ? <span className="kicker__num">{num}</span> : <span className="kicker__glyph">◆</span>}
      {" · "}
      {children}
    </span>
  );
}

/** A labelled slider bound to a numeric value. */
export function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="field">
      <label>
        {label} <b>{format(value)}</b>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/** A mutually-exclusive pill selector. */
export function PillGroup<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div className="pillrow">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            className="pill"
            aria-pressed={o.value === value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (b: boolean) => void;
}) {
  return (
    <label className="switchrow">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function Result({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "upside" | "data" | "lost" | "kill";
}) {
  return (
    <div className="result">
      <div className={`stat__num${tone ? " stat__num--" + tone : ""}`} style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}>
        {value}
      </div>
      <span className="stat__label">{label}</span>
    </div>
  );
}

/** "Show the math" — collapsible formula + assumptions + exclusions (§5, standardized). */
export function ShowTheMath({
  formula,
  assumptions,
  excludes,
}: {
  formula: ReactNode;
  assumptions: string[];
  excludes: string[];
}) {
  return (
    <details className="drawer">
      <summary>Show the math</summary>
      <div className="drawer__body">
        <p style={{ marginBottom: "var(--space-3)" }}>{formula}</p>
        <strong>Assumptions</strong>
        <ul style={{ margin: "var(--space-2) 0 var(--space-3)" }}>
          {assumptions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
        <strong>What this excludes</strong>
        <ul style={{ marginTop: "var(--space-2)" }}>
          {excludes.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </div>
    </details>
  );
}

export function CalcShell({
  title,
  intro,
  inputs,
  outputs,
}: {
  title: string;
  intro: ReactNode;
  inputs: ReactNode;
  outputs: ReactNode;
}) {
  return (
    <div className="card" style={{ marginTop: "var(--space-6)" }}>
      <h3 className="h3">{title}</h3>
      <p className="section-intro" style={{ marginTop: "var(--space-2)" }}>
        {intro}
      </p>
      <div className="calc">
        <div className="calc__inputs">{inputs}</div>
        <div className="calc__outputs">{outputs}</div>
      </div>
    </div>
  );
}

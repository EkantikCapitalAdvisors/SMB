import { Section, Kicker } from "../components/ui";

const ROWS: [string, string, string][] = [
  ["Tax posture", "Filed after the fact", "Architected before the year"],
  ["Retirement ceiling", "$70K (401k/SEP limits)", "Actuary-determined, often $100K–$300K+"],
  ["Advisors", "Siloed, transactional", "CPA + attorney + actuary, one blueprint"],
  ["Fees", "AUM regardless of outcome", "Percentage of value created, 10-yr lock"],
];

/** §4.2 THE ENEMY — Ogilvy contrast; validates L4 distrust. */
export function Enemy() {
  return (
    <Section variant="panel">
      <Kicker num="02">The enemy</Kicker>
      <h2 className="h2">You've been right to be skeptical.</h2>
      <p className="section-intro">
        Conventional planning treats your tax bill as history — your CPA files what already
        happened. Your 401(k) hits its ceiling in February. And the strategies that actually move
        the number — defined benefit plans, captives, executive retention architecture — are sold to
        you piecemeal, by people who each see one lever and none of the system.
      </p>
      <div style={{ overflowX: "auto", marginTop: "var(--space-5)" }}>
        <table className="compare">
          <thead>
            <tr>
              <th></th>
              <th>Conventional</th>
              <th className="compare__ours">◆ Coordinated</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, conv, ours]) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{conv}</td>
                <td className="compare__ours">{ours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="legal" style={{ marginTop: "var(--space-4)" }}>
        All figures illustrative; educational estimates, not advice.
      </p>
    </Section>
  );
}

import { Section, Kicker } from "./components/ui";
import { Hero } from "./sections/Hero";
import { Enemy } from "./sections/Enemy";
import { Architecture } from "./sections/Architecture";
import { Multiplier } from "./sections/Multiplier";
import { Architect } from "./sections/Architect";
import { CostOfWaiting } from "./sections/CostOfWaiting";
import { WhoFor } from "./sections/WhoFor";
import { FoundingCovenant } from "./sections/FoundingCovenant";
import { Faq } from "./sections/Faq";
import { Apply } from "./sections/Apply";
import { DbAccelerator } from "./calculators/DbAccelerator";
import { CaptiveReserve } from "./calculators/CaptiveReserve";
import { SerpRetention } from "./calculators/SerpRetention";
import { MasterDashboard } from "./calculators/MasterDashboard";

/**
 * §3 narrative arc (COM-sequenced L4 → L3 → L2 → close). Each numbered section
 * asks for exactly one step more commitment than the last.
 */
export default function App() {
  return (
    <main>
      <Hero />           {/* 1 · quantified pain + promise (L4/L3) */}
      <Enemy />          {/* 2 · why conventional fails (validates distrust) */}
      <Architecture />   {/* 3 · four levers, one system (overview) */}
      <Multiplier />     {/* 4 · the shareable idea, model-framed */}
      <Architect />      {/* 5 · named founder, authority before the effort-ask */}

      {/* 6 · RUN YOUR NUMBERS — calculators (L2 engagement) */}
      <Section id="run-your-numbers" variant="dark">
        <Kicker num="06" gold>Run your numbers</Kicker>
        <h2 className="h2">Your inputs. Your assumptions. Your conclusion.</h2>
        <p className="section-intro">
          On-screen results are free — the math is meant to be checked and stressed. Each lever is a
          live calculator on one shared engine.
        </p>
        <DbAccelerator />
        <CaptiveReserve />
        <SerpRetention />
      </Section>

      {/* 7 · MASTER DASHBOARD — full coordination view */}
      <Section id="dashboard" variant="panel">
        <Kicker num="07">The full model</Kicker>
        <h2 className="h2">One dollar of tax saved, coordinated.</h2>
        <MasterDashboard />
      </Section>

      <CostOfWaiting />     {/* 8 · computed urgency (true deadline mechanic) */}
      <WhoFor />            {/* 9 · Duveen qualification */}
      <FoundingCovenant />  {/* 10 · named risk reversal */}
      <Faq />              {/* 12 · objection preemption (11 Roadmap: PENDING port) */}
      <Apply />            {/* 13 · single close */}

      <Section variant="dark">
        <p className="legal">
          © 2026 Ekantik Capital Advisors LLC. Every calculator and figure on this page is an
          illustrative, educational estimate — not tax, legal, or investment advice, and not an offer
          or solicitation. Results depend on eligibility, compliance, plan design, and market
          performance. Past performance does not indicate future results. Investing involves risk,
          including loss of principal.
        </p>
      </Section>
    </main>
  );
}

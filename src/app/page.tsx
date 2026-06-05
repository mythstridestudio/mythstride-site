import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import RunToBattle from "@/components/RunToBattle";
import Features from "@/components/Features";
import WorldSection from "@/components/WorldSection";
import CharacterSection from "@/components/CharacterSection";
import AppShowcase from "@/components/AppShowcase";
import BossBattle from "@/components/BossBattle";
import AethronAI from "@/components/AethronAI";
import AethronLegend from "@/components/AethronLegend";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

function JourneyTransition({ tone = "gold" }: { tone?: "gold" | "ember" | "emerald" | "mist" | "shadow" }) {
  return (
    <div aria-hidden="true" className={`journey-transition journey-transition-${tone}`}>
      <span className="journey-transition__mist" />
      <span className="journey-transition__light" />
      <span className="journey-transition__embers" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <JourneyTransition tone="ember" />
      <RunToBattle />
      <JourneyTransition tone="mist" />
      <WorldSection />
      <JourneyTransition tone="gold" />
      <Features />
      <JourneyTransition tone="ember" />
      <BossBattle />
      <JourneyTransition tone="emerald" />
      <AethronAI />
      <JourneyTransition tone="mist" />
      <AethronLegend />
      <JourneyTransition tone="shadow" />
      <AppShowcase />
      <JourneyTransition tone="gold" />
      <CharacterSection />
      <JourneyTransition tone="ember" />
      <FinalCTA />
      <Footer />
    </main>
  );
}

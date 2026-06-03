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

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <RunToBattle />
      <WorldSection />
      <Features />
      <BossBattle />
      <AethronAI />
      <AethronLegend />
      <AppShowcase />
      <CharacterSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}

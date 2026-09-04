import { Hero } from "@/sections/Hero";
import { JourneyDashboard } from "@/features/dashboard/JourneyDashboard";
import { AppsSection } from "@/sections/AppsSection";
import { ComparisonSection } from "@/sections/ComparisonSection";
import { ChallengeSection } from "@/sections/ChallengeSection";
import { CuriositiesSection } from "@/sections/CuriositiesSection";
import { TipsSection } from "@/sections/TipsSection";
import { AboutSection } from "@/sections/AboutSection";

export default function Home() {
  return (
    <>
      <Hero />
      <JourneyDashboard />
      <AppsSection />
      <ComparisonSection />
      <ChallengeSection />
      <CuriositiesSection />
      <TipsSection />
      <AboutSection />
    </>
  );
}

import HeroSection from "../components/landing/HeroSection";
import CategoriesSection from "../components/landing/CategoriesSection";
import RecentReportsSection from "../components/landing/RecentReportsSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import SafetyCTA from "../components/landing/CTA";

export default function LandingPage() {
  // Navbar + Footer come from PublicLayout — this page only owns its sections.
  return (
    <main className="scroll-smooth text-[#17231d]">
      {/* Navbar */}
      
      {/* Hero */}
      <HeroSection />

      {/* Categories */}
      <CategoriesSection />

      {/* Recent Reports */}
      <RecentReportsSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Final CTA */}
      <SafetyCTA />
    </main>
  );
}

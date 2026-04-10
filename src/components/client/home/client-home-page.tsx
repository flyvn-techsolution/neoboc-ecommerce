import { BestsellersSection } from "./bestsellers-section";
import { ClientFooter } from "./client-footer";
import { ClientNavbar } from "./client-navbar";
import { FaqSection } from "./faq-section";
import { FeaturedCollections } from "./featured-collections";
import { HeroSection } from "./hero-section";
import { ServicesSection } from "./services-section";

export function ClientHomePage() {
  return (
    <>
      <div className="grainy-overlay" />
      <ClientNavbar />
      <main className="pt-20">
        <HeroSection />
        <ServicesSection />
        <FeaturedCollections />
        <BestsellersSection />
        <FaqSection />
      </main>
      <ClientFooter />
    </>
  );
}

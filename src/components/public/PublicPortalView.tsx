import React from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { DedicatedServiceFunnelView } from './DedicatedServiceFunnelView.tsx';
import { AnnouncementBar, Navbar } from './Navbar.tsx';
import { HeroSection } from './HeroSection.tsx';
import { SystemMapSection } from './SystemMapSection.tsx';
import { ServicesSection } from './ServicesSection.tsx';
import { ProcessSection } from './ProcessSection.tsx';
import { ComparisonSection } from './ComparisonSection.tsx';
import { FunnelsCatalogSection } from './FunnelsCatalogSection.tsx';
import { PricingPlansSection } from './PricingPlansSection.tsx';
import { CaseStudySection } from './CaseStudySection.tsx';
import { FaqSection } from './FaqSection.tsx';
import { ContactFormSection } from './ContactFormSection.tsx';
import { Footer, StickyBottomBar } from './Footer.tsx';
import { AiConciergeModal } from './AiConciergeModal.tsx';
import { ClientPaymentPortalModal } from './ClientPaymentPortalModal.tsx';

export const PublicPortalView: React.FC = () => {
  const { activeFunnelId, setActiveFunnelId, funnels } = useBusiness();

  // Check if a dedicated service funnel is currently requested (via state or URL param)
  const currentActiveFunnel = activeFunnelId
    ? funnels.find((f) => f.slug === activeFunnelId || f.id === activeFunnelId)
    : null;

  if (currentActiveFunnel) {
    return (
      <DedicatedServiceFunnelView
        funnel={currentActiveFunnel}
        onBackToOverview={() => {
          setActiveFunnelId(null);
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('funnel');
            window.history.replaceState({}, '', url.toString());
          } catch {
            // ignore
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SystemMapSection />
        <ServicesSection />
        <ProcessSection />
        <ComparisonSection />
        <FunnelsCatalogSection />
        <PricingPlansSection />
        <CaseStudySection />
        <FaqSection />
        <ContactFormSection />
      </main>
      <Footer />
      <StickyBottomBar />
      <AiConciergeModal />
      <ClientPaymentPortalModal />
    </div>
  );
};

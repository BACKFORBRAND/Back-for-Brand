import React, { useEffect, useState } from 'react';
import { BusinessProvider, useBusiness } from './context/BusinessContext.tsx';
import { PublicPortalView } from './components/public/PublicPortalView.tsx';
import { BusinessMachineView } from './components/admin/BusinessMachineView.tsx';
import { EmbedLeadCapture } from './components/public/EmbedLeadCapture.tsx';
import { NotificationToast } from './components/common/NotificationToast.tsx';
import { MotionExperience } from './components/common/MotionExperience.tsx';
import { TRAFFIC_SOURCES } from './types/index.ts';

const AppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setMachineTab,
    updateChannel,
    channels,
    setActiveFunnelId,
    recordFunnelVisit,
    openPaymentModal,
  } = useBusiness();
  const [isEmbedMode, setIsEmbedMode] = useState<boolean>(false);

  // Track inbound UTM params and URL route parameters
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const tabParam = params.get('tab');
      const utmSource = params.get('utm_source');
      const funnelParam = params.get('funnel');
      const embedParam = params.get('embed');
      const payParam = params.get('pay') || params.get('checkout') || params.get('invoice');

      if (embedParam === 'form' || embedParam === 'true' || embedParam === 'lead') {
        setIsEmbedMode(true);
      }
      if (payParam) {
        const amt = parseFloat(params.get('amount') || '1500') || 1500;
        const curr = params.get('currency') || 'USD';
        const client = params.get('client') || params.get('name') || '';
        const note = params.get('note') || 'Invoice Kickoff Retainer';
        const method = params.get('method') || '';
        openPaymentModal({ amount: amt, currency: curr, clientName: client, note, method });
      }
      if (viewParam === 'machine') {
        setCurrentView('machine');
      } else if (viewParam === 'public') {
        setCurrentView('public');
      }

      if (tabParam) {
        setMachineTab(tabParam);
      }
      if (funnelParam) {
        setActiveFunnelId(funnelParam);
        recordFunnelVisit(funnelParam);
      }

      // If arrived via tracking link, record the visit into channel attribution
      const channelParam = params.get('channel') || utmSource;
      if (channelParam) {
        const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
        const matchedIdx = channels.findIndex(
          (c) => slug(c.name) === slug(channelParam) || c.name.toLowerCase() === channelParam.toLowerCase()
        );
        if (matchedIdx !== -1) {
          updateChannel(matchedIdx, 'visits', (channels[matchedIdx].visits || 0) + 1);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  if (isEmbedMode) {
    return (
      <>
        <NotificationToast />
        <EmbedLeadCapture />
      </>
    );
  }

  return (
    <>
      <MotionExperience />
      <NotificationToast />
      {currentView === 'machine' ? <BusinessMachineView /> : <PublicPortalView />}
    </>
  );
};

export default function App() {
  return (
    <BusinessProvider>
      <AppContent />
    </BusinessProvider>
  );
}

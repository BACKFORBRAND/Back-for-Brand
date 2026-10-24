import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { AdminSidebar } from './AdminSidebar.tsx';
import { AdminTopNav } from './AdminTopNav.tsx';
import { AgentConsoleTab } from './AgentConsoleTab.tsx';
import { WhatsAppAgentTab } from './WhatsAppAgentTab.tsx';
import { CommunicationsTab } from './CommunicationsTab.tsx';
import { CalendarSchedulerTab } from './CalendarSchedulerTab.tsx';
import { ServicesManagerTab } from './ServicesManagerTab.tsx';
import { OverviewTab } from './OverviewTab.tsx';
import { CrmTab } from './CrmTab.tsx';
import { ContactsTab } from './ContactsTab.tsx';
import { AutomationsTab } from './AutomationsTab.tsx';
import { ChannelsTab } from './ChannelsTab.tsx';
import { TrackingLinksTab } from './TrackingLinksTab.tsx';
import { ConnectLandingTab } from './ConnectLandingTab.tsx';
import { AnalyticsTab } from './AnalyticsTab.tsx';
import { FunnelsManagerTab } from './FunnelsManagerTab.tsx';
import { TemplatesLibraryTab } from './TemplatesLibraryTab.tsx';
import { IntegrationGuideTab } from './IntegrationGuideTab.tsx';
import { BankingPaymentsTab } from './BankingPaymentsTab.tsx';
import { CeoSecurityControlTab } from './CeoSecurityControlTab.tsx';
import { CeoApprovalsTab } from './CeoApprovalsTab.tsx';
import { AdsSocialLaunchpadTab } from './AdsSocialLaunchpadTab.tsx';
import { SecurityLoginView } from './SecurityLoginView.tsx';
import { AccessDeniedBlock } from './AccessDeniedBlock.tsx';

export const BusinessMachineView: React.FC = () => {
  const { machineTab, isAuthenticated, currentUser, isModuleAllowed } = useBusiness();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If session is locked or unauthenticated, present the Executive Security Login Gate
  if (!isAuthenticated || !currentUser) {
    return <SecurityLoginView />;
  }

  const renderActiveTab = () => {
    // 1. CEO Master Security Tab
    if (machineTab === 'CEO Security & Permissions' || machineTab === 'CEO Master Control') {
      if (currentUser.role !== 'ceo') {
        return <AccessDeniedBlock requestedModule="CEO Security & Permissions" />;
      }
      return <CeoSecurityControlTab />;
    }

    // 2. Strict Role-Based Area Allocation Check
    if (!isModuleAllowed(machineTab)) {
      return <AccessDeniedBlock requestedModule={machineTab} />;
    }

    // 3. Render Authorized Area
    switch (machineTab) {
      case 'CEO Reports & Approvals':
      case 'CEO Approvals':
      case 'Approvals':
        return <CeoApprovalsTab />;
      case 'Ads & Social Launchpad':
      case 'Ads & Social':
      case 'Meta Ads':
      case 'Google Ads':
      case 'Ads':
        return <AdsSocialLaunchpadTab />;
      case 'Agent Console':
        return <AgentConsoleTab />;
      case 'WhatsApp AI Agent':
        return <WhatsAppAgentTab />;
      case 'WhatsApp & Email':
        return <CommunicationsTab />;
      case 'Automations':
        return <AutomationsTab />;
      case 'Booking Calendar':
        return <CalendarSchedulerTab />;
      case 'Services Delivery':
        return <ServicesManagerTab />;
      case 'Funnels & Pages':
      case 'Funnels':
        return <FunnelsManagerTab />;
      case 'Template Gallery':
      case 'Templates':
      case 'Templates Library':
        return <TemplatesLibraryTab />;
      case 'CRM Pipeline':
      case 'CRM':
        return <CrmTab />;
      case 'Contacts':
        return <ContactsTab />;
      case 'Overview KPIs':
      case 'Overview':
        return <OverviewTab />;
      case 'Analytics':
        return <AnalyticsTab />;
      case 'Channel ROI':
      case 'Channels':
        return <ChannelsTab />;
      case 'Tracking links':
        return <TrackingLinksTab />;
      case 'Connect landing':
        return <ConnectLandingTab />;
      case 'Integration Guide':
      case 'Integration':
      case 'Setup Guide':
        return <IntegrationGuideTab />;
      case 'Payment Gateways & Banking':
      case 'Payment Gateways':
      case 'Banking & Payments':
      case 'Payments':
      case 'Banking':
        return <BankingPaymentsTab />;
      default:
        return <AgentConsoleTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex transition-colors duration-200">
      {/* Left-Side Dashboard Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area (offset on large screens by left sidebar width) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full">
        {/* Top bar with breadcrumbs, role badge, session lock, and mobile trigger */}
        <AdminTopNav onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1360px] w-full mx-auto">
          {renderActiveTab()}
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-[var(--mu)] border-t border-[var(--bd)] bg-[var(--soft)]/30">
          Back for Brand · Executive Dashboard OS v5.0 · Left Sidebar Architecture · Role-Based Zero-Trust Active
        </footer>
      </div>
    </div>
  );
};

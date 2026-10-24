import React from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { Globe, Moon, Sun, Sparkles, Bot, MessageSquare, Calendar, Rocket, LayoutDashboard, DollarSign, Link2, BarChart3, Users, Zap, LayoutTemplate, BookOpen, CreditCard, Megaphone, CheckCheck } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const {
    machineTab,
    setMachineTab,
    setCurrentView,
    theme,
    toggleTheme,
    addLead,
    agentActions,
    ceoApprovals = [],
    campaigns = [],
  } = useBusiness();

  const tabs = [
    { name: 'CEO Reports & Approvals', icon: CheckCheck, badge: ceoApprovals.filter((a) => a.status === 'pending').length || undefined },
    { name: 'Ads & Social Launchpad', icon: Megaphone, badge: campaigns.filter((c) => c.status === 'ready_to_launch' || c.status === 'pending_approval').length || undefined },
    { name: 'Payment Gateways & Banking', icon: CreditCard },
    { name: 'Integration Guide', icon: BookOpen },
    { name: 'Agent Console', icon: Bot, badge: agentActions.filter((a) => a.status === 'pending_approval').length },
    { name: 'WhatsApp AI Agent', icon: MessageSquare, isAgent: true },
    { name: 'WhatsApp & Email', icon: MessageSquare },
    { name: 'Automations', icon: Zap },
    { name: 'Booking Calendar', icon: Calendar },
    { name: 'Services Delivery', icon: Rocket },
    { name: 'Funnels & Pages', icon: Globe },
    { name: 'Templates', icon: LayoutTemplate },
    { name: 'CRM Pipeline', icon: LayoutDashboard },
    { name: 'Contacts', icon: Users },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Overview KPIs', icon: DollarSign },
    { name: 'Channel ROI', icon: Sparkles },
    { name: 'Tracking links', icon: Link2 },
  ];

  const handleSimulateLead = () => {
    const randomSources = ['Meta Ads', 'SEO', 'GEO (AI search)', 'Google Ads', 'WhatsApp', 'TikTok'];
    const chosenSrc = randomSources[Math.floor(Math.random() * randomSources.length)];
    const mockCompanies = ['Apex Logistics', 'Solari Dental', 'Nova SaaS', 'Vortex Auto', 'Lumina Beauty', 'Crestview Capital'];
    const chosenName = mockCompanies[Math.floor(Math.random() * mockCompanies.length)] + ' ' + Math.floor(Math.random() * 90 + 10);

    addLead({
      name: chosenName,
      email: chosenName.toLowerCase().replace(/\s+/g, '') + '@client.com',
      phone: '923' + Math.floor(100000000 + Math.random() * 900000000),
      src: chosenSrc,
      stage: 'New',
      val: Math.floor(Math.random() * 20 + 5) * 100, // 500 - 2500
      need: 'Simulated Funnel Lead',
      message: 'Inbound live lead generated via simulation test.',
    });
  };

  return (
    <header className="bg-[#070e24] text-white px-4 sm:px-6 py-3.5 border-b border-[#cca34c]/20 sticky top-0 z-30 shadow-md">
      <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-1 rounded-xl shadow-md border border-[#cca34c]/40 flex items-center justify-center">
              <img
                src="/assets/aistudio/images_9652885d.png"
                alt="Back for Brand"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div className="font-extrabold text-base tracking-tight leading-tight flex items-center gap-1">
              <span>Back for</span>
              <span className="text-[#cca34c]">Brand</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 font-bold ml-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c48c] animate-pulse" />
              <span>Control Agent OS</span>
            </span>
          </div>

          {/* Mobile Right controls */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setCurrentView('public')}
              className="p-1.5 rounded-lg bg-[#0c183a] border border-[#cca34c]/30 text-[#cca34c] text-xs font-semibold"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-1.5 text-[#cca34c]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#cca34c]" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Center: Tabs with Badges */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1 no-scrollbar justify-start md:justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = machineTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setMachineTab(tab.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#00c48c] text-white border-[#00c48c] shadow-sm shadow-[#00c48c]/30'
                    : 'bg-transparent text-emerald-100/70 border-white/10 hover:border-[#cca34c]/40 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-[#cca34c] text-[#070e24] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={handleSimulateLead}
            title="Simulate a live inbound lead arriving into the CRM"
            className="px-2.5 py-1.5 rounded-lg bg-[#00c48c]/15 border border-[#00c48c]/40 text-[#00c48c] text-xs font-semibold hover:bg-[#00c48c]/25 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00c48c]" />
            <span>Simulate Lead</span>
          </button>

          <button
            onClick={() => setCurrentView('public')}
            className="px-3 py-1.5 rounded-lg bg-[#0c183a] border border-[#cca34c]/30 text-[#cca34c] hover:text-[#e5b85c] text-xs font-bold hover:bg-[#122252] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#cca34c]" />
            <span>Public Funnel</span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-lg border border-[#cca34c]/30 bg-[#0c183a] flex items-center justify-center text-[#cca34c] hover:text-white transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#cca34c]" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

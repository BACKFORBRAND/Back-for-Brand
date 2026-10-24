import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  Bot,
  MessageSquare,
  Calendar,
  Rocket,
  LayoutDashboard,
  DollarSign,
  Sparkles,
  Link2,
  FileSpreadsheet,
  Globe,
  Moon,
  Sun,
  X,
  ChevronRight,
  ShieldCheck,
  User,
  Lock,
  LogOut,
  RefreshCw,
  KeyRound,
  Shield,
  Layers,
  BarChart3,
  Users,
  Zap,
  LayoutTemplate,
  BookOpen,
  CreditCard,
  Megaphone,
  CheckCheck,
  Send,
} from 'lucide-react';
import { UserRole } from '../../types/index.ts';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  desc?: string;
  highlight?: boolean;
  ceoOnly?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    machineTab,
    setMachineTab,
    setCurrentView,
    theme,
    toggleTheme,
    addLead,
    agentActions,
    currentUser,
    logout,
    switchActiveRole,
    isModuleAllowed,
    teamMembers,
    campaigns = [],
    ceoApprovals = [],
  } = useBusiness();

  const [showRoleSwitcherModal, setShowRoleSwitcherModal] = useState(false);

  const pendingApprovalsCount = agentActions.filter((a) => a.status === 'pending_approval').length;
  const pendingCeoCount = ceoApprovals.filter((a) => a.status === 'pending').length;
  const isCeo = currentUser?.role === 'ceo';

  const navGroups: NavGroup[] = [
    {
      title: 'GOVERNANCE & CEO CONTROL',
      items: [
        {
          name: 'CEO Security & Permissions',
          icon: ShieldCheck,
          highlight: true,
          ceoOnly: true,
          desc: 'Account allocations & live audit trail',
        },
        {
          name: 'CEO Reports & Approvals',
          icon: CheckCheck,
          badge: pendingCeoCount > 0 ? pendingCeoCount : undefined,
          highlight: true,
          desc: 'Briefing reports & 1-click authorizations',
        },
      ],
    },
    {
      title: 'CAMPAIGNS & SOCIAL LAUNCHPAD',
      items: [
        {
          name: 'Ads & Social Launchpad',
          icon: Megaphone,
          highlight: true,
          badge: campaigns.filter((c) => c.status === 'ready_to_launch' || c.status === 'pending_approval').length || undefined,
          desc: 'Meta Ads, Google Ads & Social Pages Hub',
        },
      ],
    },
    {
      title: 'AI AGENT OPERATIONS',
      items: [
        {
          name: 'Agent Console',
          icon: Bot,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          desc: 'Autonomous operations supervisor',
        },
        {
          name: 'WhatsApp AI Agent',
          icon: MessageSquare,
          highlight: true,
          desc: 'Trilingual qualifier & booking manager',
        },
      ],
    },
    {
      title: 'CLIENT COMMUNICATIONS',
      items: [
        {
          name: 'WhatsApp & Email',
          icon: MessageSquare,
          desc: 'Omnichannel chat & email dispatcher',
        },
        {
          name: 'Automations',
          icon: Zap,
          highlight: true,
          desc: 'Email sequences & status updates',
        },
        {
          name: 'Booking Calendar',
          icon: Calendar,
          desc: 'Visual scheduler & Meet links',
        },
      ],
    },
    {
      title: 'DELIVERY & PIPELINE',
      items: [
        {
          name: 'Services Delivery',
          icon: Rocket,
          desc: 'Active projects & sprint milestones',
        },
        {
          name: 'Funnels & Pages',
          icon: Globe,
          highlight: true,
          desc: 'Multi-service funnels & embed links',
        },
        {
          name: 'Template Gallery',
          icon: LayoutTemplate,
          highlight: true,
          desc: 'High-converting funnel blueprints',
        },
        {
          name: 'CRM Pipeline',
          icon: LayoutDashboard,
          desc: 'Kanban lead stages & deal values',
        },
        {
          name: 'Contacts',
          icon: Users,
          desc: 'Directory, categories & status tracking',
          highlight: true,
        },
      ],
    },
    {
      title: 'ANALYTICS & ATTRIBUTION',
      items: [
        {
          name: 'Analytics',
          icon: BarChart3,
          highlight: true,
          desc: 'Conversion funnel & lead growth',
        },
        {
          name: 'Overview KPIs',
          icon: DollarSign,
          desc: 'Executive telemetry & ROAS',
        },
        {
          name: 'Channel ROI',
          icon: Sparkles,
          desc: '17-channel attribution matrix',
        },
        {
          name: 'Tracking links',
          icon: Link2,
          desc: 'UTM link synthesizer',
        },
        {
          name: 'Connect landing',
          icon: FileSpreadsheet,
          desc: 'Google Sheets & Webhooks',
        },
      ],
    },
    {
      title: 'GLOBAL SETTLEMENT & BANKING',
      items: [
        {
          name: 'Payment Gateways & Banking',
          icon: CreditCard,
          highlight: true,
          desc: 'Stripe, PayPal, GCC & Pakistani Banks',
        },
      ],
    },
    {
      title: 'DEVELOPER & INTEGRATION DOCS',
      items: [
        {
          name: 'Integration Guide',
          icon: BookOpen,
          highlight: true,
          desc: 'Step-by-step connection manual',
        },
      ],
    },
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
      val: Math.floor(Math.random() * 20 + 5) * 100,
      need: 'Simulated Funnel Lead',
      message: 'Inbound live lead generated via simulation test.',
    });
  };

  const handleSelectTab = (tabName: string) => {
    setMachineTab(tabName);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Left Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#070e24] text-white flex flex-col border-r border-[#1a2850] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with Official Logo */}
        <div className="p-4 sm:p-5 border-b border-[#1a2850] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl shadow-md border border-[#cca34c]/40 flex items-center justify-center">
              <img
                src="/assets/aistudio/images_9652885d.png"
                alt="Back for Brand"
                className="h-9 w-auto object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight leading-tight flex items-center gap-1">
                <span>Back for</span>
                <span className="text-[#cca34c]">Brand</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#00c48c] animate-pulse" />
                <span className="text-[10px] text-[#00c48c] font-black uppercase tracking-wider">
                  Control Agent OS
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-blue-300 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Clearance Level Status Strip */}
        <div className="px-4 py-2.5 bg-[#050a1b] border-b border-[#cca34c]/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <Shield className={`w-3.5 h-3.5 flex-shrink-0 ${isCeo ? 'text-[#cca34c]' : 'text-[#00c48c]'}`} />
            <span className="text-[11px] font-bold text-emerald-100/90 truncate">
              {isCeo ? 'Master Clearance (CEO)' : `Allocated: ${currentUser?.allowedModules.length} Areas`}
            </span>
          </div>
          <button
            onClick={() => setShowRoleSwitcherModal(true)}
            className="text-[10px] text-[#cca34c] hover:text-[#e5b85c] font-mono underline ml-1 cursor-pointer flex-shrink-0"
            title="Switch demo account"
          >
            Switch
          </button>
        </div>

        {/* Scrollable Nav Categories */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navGroups.map((group) => {
            // If group is CEO only and user is not CEO, we still show the group or items with locked badge so they know it exists
            return (
              <div key={group.title} className="space-y-1">
                <span className="text-[10px] font-black tracking-wider text-[#cca34c]/70 uppercase px-3 block mb-1.5">
                  {group.title}
                </span>

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isSelected =
                    machineTab === item.name ||
                    (item.name === 'Template Gallery' &&
                      (machineTab === 'Templates' || machineTab === 'Templates Library'));
                  const allowed = item.name === 'CEO Security & Permissions'
                    ? isCeo
                    : isModuleAllowed(item.name);

                  return (
                    <button
                      key={item.name}
                      onClick={() => handleSelectTab(item.name)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#00c48c] to-[#009b6e] text-white shadow-md shadow-[#00c48c]/30 font-black'
                          : allowed
                          ? 'text-emerald-100/80 hover:text-white hover:bg-white/5'
                          : 'text-blue-300/40 hover:text-blue-200 hover:bg-white/5 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 transition-colors ${
                            isSelected
                              ? 'text-white'
                              : !allowed
                              ? 'text-amber-400/60'
                              : item.highlight
                              ? 'text-[#00c48c]'
                              : 'text-emerald-200/70 group-hover:text-white'
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {!allowed && (
                          <span
                            className="text-[9px] bg-[#cca34c]/15 text-[#cca34c] border border-[#cca34c]/30 px-1.5 py-0.5 rounded flex items-center gap-1"
                            title="Restricted Area - Requires CEO Allocation"
                          >
                            <Lock className="w-2.5 h-2.5" />
                            <span className="hidden sm:inline">Restricted</span>
                          </span>
                        )}

                        {item.ceoOnly && isCeo && (
                          <span className="bg-[#cca34c]/20 text-[#cca34c] text-[9px] font-black px-1.5 py-0.5 rounded border border-[#cca34c]/40">
                            CEO
                          </span>
                        )}

                        {item.badge !== undefined && (
                          <span className="bg-[#cca34c] text-[#070e24] text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-sm animate-pulse">
                            {item.badge}
                          </span>
                        )}

                        {isSelected && <ChevronRight className="w-3.5 h-3.5 text-white/90" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer Quick Controls & Operator Profile */}
        <div className="p-4 border-t border-[#1a2850] bg-[#050a1b] space-y-3">
          {/* Quick Action: Simulate Lead */}
          <button
            onClick={handleSimulateLead}
            className="w-full py-2 px-3 rounded-xl bg-[#00c48c]/15 hover:bg-[#00c48c]/25 border border-[#00c48c]/40 text-[#00c48c] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00c48c]" />
            <span>Simulate Inbound Lead</span>
          </button>

          {/* Switch to Public Site & Theme */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('public')}
              className="flex-1 py-2 px-3 rounded-xl bg-[#0c183a] hover:bg-[#122252] border border-[#cca34c]/30 text-[#cca34c] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#cca34c]" />
              <span>Public Funnel</span>
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-xl border border-[#cca34c]/30 bg-[#0c183a] hover:bg-[#122252] flex items-center justify-center text-[#cca34c] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#cca34c]" /> : <Moon className="w-4 h-4 text-emerald-200" />}
            </button>
          </div>

          {/* Active Operator Profile Card with Sign Out / Lock Button */}
          <div className="pt-2.5 flex items-center justify-between text-xs text-blue-200 border-t border-[#1a2850]/70">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-sm ${
                  isCeo ? 'bg-[#cca34c] text-[#070e24] font-black' : 'bg-[#00c48c] text-white'
                }`}
              >
                {currentUser?.name
                  ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                  : 'GW'}
              </div>
              <div className="truncate min-w-0">
                <strong className="block font-bold text-white text-[11px] truncate flex items-center gap-1">
                  <span>{currentUser?.name || 'Ghazi Wazir'}</span>
                  {isCeo && <span className="text-[#cca34c] text-[10px]">👑</span>}
                </strong>
                <span className="text-[10px] text-emerald-200/70 block truncate">
                  {currentUser?.title || 'Chief Executive Officer'}
                </span>
              </div>
            </div>

            {/* Lock / Sign Out Button */}
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-blue-300 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
              title="Lock dashboard & sign out"
              aria-label="Lock dashboard"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Quick Role Switcher Modal */}
      {showRoleSwitcherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#070e24] border border-[#cca34c]/40 shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-black flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#00c48c]" />
                <span>Simulate Role &amp; Permissions</span>
              </h3>
              <button
                onClick={() => setShowRoleSwitcherModal(false)}
                className="p-1 text-emerald-200/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-emerald-100/70">
              Test how the dashboard behaves under CEO versus restricted permission accounts:
            </p>

            <div className="space-y-2">
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    switchActiveRole(member.role);
                    setShowRoleSwitcherModal(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    currentUser?.id === member.id
                      ? 'bg-[#00c48c]/20 border-[#00c48c] text-white shadow-md'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-emerald-100/80'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>{member.name}</span>
                      {member.role === 'ceo' && <span className="text-[#cca34c]">👑 Master CEO</span>}
                    </div>
                    <div className="text-[10px] text-emerald-200/60 mt-0.5">
                      {member.title} · {member.role === 'ceo' ? 'All Areas' : `${member.allowedModules.length} Areas Allocated`}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#00c48c]" />
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                logout();
                setShowRoleSwitcherModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Dashboard &amp; Open Login Portal</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

import React from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  Menu,
  Sparkles,
  Globe,
  DollarSign,
  Users,
  Rocket,
  Calendar,
  Lock,
  ShieldCheck,
  LogOut,
  User,
  BookOpen,
  CreditCard,
  Sun,
  Moon,
  Megaphone,
  CheckCheck,
} from 'lucide-react';

interface TopNavProps {
  onOpenMobileSidebar: () => void;
}

export const AdminTopNav: React.FC<TopNavProps> = ({ onOpenMobileSidebar }) => {
  const {
    machineTab,
    setMachineTab,
    setCurrentView,
    leads,
    projects,
    bookings,
    currentUser,
    logout,
    theme,
    toggleTheme,
    ceoApprovals = [],
  } = useBusiness();

  const isCeo = currentUser?.role === 'ceo';
  const pendingCeoCount = ceoApprovals.filter((a) => a.status === 'pending').length;
  const wonLeads = leads.filter((l) => l.stage === 'Won');
  const totalRevenue = wonLeads.reduce((sum, l) => sum + (l.val || 0), 0);
  const activeSprints = projects.filter((p) => p.status === 'In Progress' || p.status === 'Active Support').length;

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--bd)] px-4 sm:px-6 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl border border-[var(--bd)] text-[var(--ink)] hover:bg-[var(--soft)] transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="lg:hidden bg-white p-0.5 rounded-lg border border-[#cca34c]/30 shadow-xs flex items-center justify-center">
            <img
              src="/assets/aistudio/images_9652885d.png"
              alt="Back for Brand"
              className="h-6 w-auto object-contain"
            />
          </div>

          <div>
            <div className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider flex items-center gap-1.5">
              <span className="font-extrabold text-[var(--ink)]">
                Back for <span className="text-[#cca34c]">Brand</span>
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-[#00c48c] font-bold">{machineTab}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
              <span>{machineTab}</span>
              {machineTab === 'CEO Security & Permissions' && (
                <span className="px-2 py-0.5 rounded-full bg-[#cca34c]/20 text-[#cca34c] text-[10px] font-black uppercase tracking-wider border border-[#cca34c]/40">
                  CEO Master
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Right: Telemetry Ticker, Role Chip, and Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Telemetry Pills (Financials protected for CEO only) */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            {isCeo ? (
              <div className="px-3 py-1.5 rounded-xl bg-[#cca34c]/15 border border-[#cca34c]/35 text-[#cca34c] font-bold flex items-center gap-1.5 shadow-2xs">
                <DollarSign className="w-3.5 h-3.5 text-[#cca34c]" />
                <span>${totalRevenue.toLocaleString()} Won</span>
              </div>
            ) : (
              <div
                className="px-2.5 py-1.5 rounded-xl bg-[var(--soft)] border border-[var(--bd)] text-[var(--mu)] text-xs font-semibold flex items-center gap-1.5"
                title="Revenue figures restricted to CEO account"
              >
                <Lock className="w-3 h-3 text-[#cca34c]" />
                <span>Financials (CEO Only)</span>
              </div>
            )}

            <div className="px-3 py-1.5 rounded-xl bg-[#00c48c]/10 border border-[#00c48c]/30 text-[#00a876] dark:text-[#20d89f] font-bold flex items-center gap-1.5 shadow-2xs">
              <Users className="w-3.5 h-3.5 text-[#00c48c]" />
              <span>{leads.length} Leads</span>
            </div>

            <div className="hidden md:flex px-3 py-1.5 rounded-xl bg-[var(--soft)] border border-[#cca34c]/30 text-[#cca34c] font-bold items-center gap-1.5 shadow-2xs">
              <Rocket className="w-3.5 h-3.5 text-[#cca34c]" />
              <span>{activeSprints} Sprints</span>
            </div>
          </div>

          {/* Active Clearance Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--soft)] border border-[#cca34c]/30 text-xs">
            <div
              className={`w-2 h-2 rounded-full ${
                isCeo ? 'bg-[#cca34c]' : 'bg-[#00c48c]'
              }`}
            />
            <span className="font-extrabold text-[var(--ink)]">
              {isCeo ? '👑 Ghazi Wazir (CEO)' : currentUser?.name || 'Staff User'}
            </span>
          </div>

          {/* Quick Ads Launchpad Button */}
          <button
            onClick={() => setMachineTab('Ads & Social Launchpad')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              machineTab === 'Ads & Social Launchpad'
                ? 'bg-[#00c48c] text-white border-[#00c48c]'
                : 'border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] hover:border-[#00c48c]'
            }`}
            title="Open Meta & Google Ads Launchpad & Social Hub"
          >
            <Megaphone className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden xl:inline">Ads Launchpad</span>
          </button>

          {/* Quick CEO Approvals Button */}
          <button
            onClick={() => setMachineTab('CEO Reports & Approvals')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs relative ${
              machineTab === 'CEO Reports & Approvals'
                ? 'bg-[#00c48c] text-white border-[#00c48c]'
                : 'border-[#cca34c]/40 bg-[#cca34c]/10 text-[#cca34c] hover:border-[#cca34c]'
            }`}
            title="Open CEO Reports, Briefings & 1-Click Approvals"
          >
            <CheckCheck className="w-3.5 h-3.5 text-[#cca34c]" />
            <span className="hidden lg:inline">CEO Approvals</span>
            {pendingCeoCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                {pendingCeoCount}
              </span>
            )}
          </button>

          {/* Quick Integration Guide Button */}
          <button
            onClick={() => setMachineTab('Integration Guide')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              machineTab === 'Integration Guide'
                ? 'bg-[#00c48c] text-white border-[#00c48c]'
                : 'border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] hover:border-[#00c48c]'
            }`}
            title="Open Integration Manual & Setup Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#cca34c]" />
            <span className="hidden md:inline">Integration Guide</span>
          </button>

          {/* Quick Banking & Payments Button */}
          <button
            onClick={() => setMachineTab('Payment Gateways & Banking')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              machineTab === 'Payment Gateways & Banking'
                ? 'bg-[#00c48c] text-white border-[#00c48c]'
                : 'border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] hover:border-[#00c48c]'
            }`}
            title="Open Global Banking & Payment Rails (Stripe, PayPal, GCC, Pakistan)"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#00c48c]" />
            <span className="hidden xl:inline">Banking &amp; Payments</span>
          </button>

          {/* Lock Dashboard / Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] hover:bg-red-50 dark:hover:bg-red-950/40 text-[var(--mu)] hover:text-red-500 transition-colors shadow-2xs cursor-pointer"
            title="Lock Dashboard & Sign Out"
            aria-label="Lock dashboard"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
            className="w-8 h-8 rounded-xl border border-[var(--bd)] bg-[var(--bg)] flex items-center justify-center text-[#cca34c] hover:border-[#00c48c] transition-colors cursor-pointer shadow-2xs"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#cca34c]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
          </button>

          {/* Public Portal Switcher */}
          <button
            onClick={() => setCurrentView('public')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer shadow-[#00c48c]/25"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Funnel</span>
            <span className="sm:hidden">Public</span>
          </button>
        </div>
      </div>
    </header>
  );
};

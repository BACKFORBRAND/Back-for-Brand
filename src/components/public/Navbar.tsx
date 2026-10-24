import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { Sparkles, Moon, Sun, ArrowRight, LayoutDashboard, Menu, X, ChevronDown, ExternalLink, Globe, CreditCard } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-[#070e24] via-[#0b1b36] to-[#070e24] text-white text-xs md:text-sm text-center py-2 px-4 font-medium flex items-center justify-center gap-2 border-b border-[#cca34c]/25">
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#00c48c] animate-pulse shadow-[0_0_8px_#00c48c]" />
        <span>🎯 Free high-ticket growth plan &amp; WhatsApp AI demo —</span>
      </span>
      <a href="#start" className="text-[#cca34c] hover:text-[#e5b85c] font-bold hover:underline inline-flex items-center gap-1 transition-colors">
        claim yours <ArrowRight className="w-3.5 h-3.5 text-[#00c48c]" />
      </a>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    theme,
    toggleTheme,
    newLeadsCountSinceView,
    funnels,
    setActiveFunnelId,
    recordFunnelVisit,
    openPaymentModal,
  } = useBusiness();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const handleLaunchFunnel = (funnelSlug: string) => {
    setActiveFunnelId(funnelSlug);
    recordFunnelVisit(funnelSlug);
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-40 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--bd)] transition-colors duration-200">
      <div className="max-w-[1160px] w-[92%] mx-auto h-[72px] flex items-center justify-between">
        {/* Official Brand Logo with Mustard Gold & Emerald Green */}
        <a href="#top" className="flex items-center gap-3 group">
          <div className="bg-white p-1 rounded-xl shadow-md border border-[#cca34c]/30 flex items-center justify-center transition-transform group-hover:scale-105">
            <img
              src="/assets/aistudio/images_9652885d.png"
              alt="Back for Brand Official Logo"
              className="h-10 sm:h-11 w-auto object-contain"
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-black text-lg tracking-tight leading-none text-[var(--ink)]">
              Back for <span className="text-[#cca34c]">Brand</span>
            </span>
            <span className="text-[10px] text-[#00c48c] font-black tracking-widest uppercase mt-0.5">
              Autonomous Growth Machine
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--mu)]">
          {/* Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              className="hover:text-[var(--ink)] transition-colors flex items-center gap-1 cursor-pointer py-2"
            >
              <span className="font-bold text-[var(--ink)]">Services &amp; Funnels</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesDropdownOpen ? 'rotate-180 text-[#00c48c]' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {servicesDropdownOpen && (
              <div
                onMouseLeave={() => setServicesDropdownOpen(false)}
                className="absolute top-full left-0 w-80 rounded-2xl bg-[var(--bg)] border border-[var(--bd)] shadow-2xl p-3 z-50 animate-in fade-in"
              >
                <div className="text-[10px] font-black uppercase tracking-wider text-[var(--mu)] px-3 py-1.5 border-b border-[var(--bd)] mb-1">
                  Dedicated Service Funnels ({funnels.length})
                </div>
                <div className="space-y-1">
                  {funnels.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleLaunchFunnel(f.slug)}
                      className="w-full p-2.5 rounded-xl hover:bg-[var(--soft)] text-left flex items-start justify-between gap-2 transition-colors cursor-pointer group"
                    >
                      <div>
                        <strong className="block text-xs font-black text-[var(--ink)] group-hover:text-[#00c48c] transition-colors leading-snug">
                          {f.name}
                        </strong>
                        <span className="text-[11px] text-[var(--mu)] block mt-0.5">
                          {f.serviceCategory} · ${f.pricingTiers[0]?.price.toLocaleString()}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#cca34c] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a href="#features" className="hover:text-[var(--ink)] transition-colors">What we build</a>
          <a href="#how" className="hover:text-[var(--ink)] transition-colors">How it works</a>
          <a href="#funnels" className="hover:text-[var(--ink)] transition-colors">Funnels</a>
          <a href="#plans" className="hover:text-[var(--ink)] transition-colors">Plans</a>
          <a href="#faq" className="hover:text-[var(--ink)] transition-colors">FAQ</a>
        </div>

        {/* Right Action buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Executive Switcher to Business Machine */}
          <button
            onClick={() => setCurrentView(currentView === 'public' ? 'machine' : 'public')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              currentView === 'machine'
                ? 'bg-[#070e24] text-[#00c48c] border-[#cca34c]/60 shadow-sm'
                : 'bg-[#00c48c]/10 dark:bg-[#00c48c]/15 text-[#00a876] dark:text-[#20d89f] border-[#00c48c]/30 hover:bg-[#00c48c]/20'
            }`}
            title="Switch to Executive CRM & Business Operating System"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#cca34c]" />
            <span>Business Machine OS</span>
            {newLeadsCountSinceView > 0 && (
              <span className="bg-[#cca34c] text-white px-1.5 py-0.2 rounded-full text-[10px] font-black animate-pulse shadow-sm">
                +{newLeadsCountSinceView}
              </span>
            )}
          </button>

          {/* Client Pay / Wire Portal Button */}
          <button
            onClick={() => openPaymentModal({ amount: 1500, note: 'General Retainer & Growth System Kickoff' })}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border border-[#cca34c]/40 bg-[#cca34c]/10 text-[#cca34c] hover:bg-[#cca34c]/20 cursor-pointer shadow-2xs"
            title="Open Client Payment & Bank Wire Portal (Stripe, PayPal, GCC & Pakistani Banks)"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#cca34c]" />
            <span>Pay / Wire Portal</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            className="w-9 h-9 rounded-xl border border-[var(--bd)] flex items-center justify-center text-[var(--mu)] hover:text-[#00c48c] hover:border-[#00c48c]/50 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#cca34c]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
          </button>

          {/* CTA with Brand Emerald Green & Gold Trim */}
          <a
            href="#start"
            className="bg-gradient-to-r from-[#00c48c] to-[#00a876] hover:from-[#00b07d] hover:to-[#00875e] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_0_#007a56] hover:shadow-[0_2px_0_#007a56] hover:translate-y-[2px]"
          >
            Get free plan
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setCurrentView(currentView === 'public' ? 'machine' : 'public')}
            className="p-1.5 rounded-lg border border-[#00c48c]/40 text-[#00a876] dark:text-[#20d89f] text-xs font-bold flex items-center gap-1 bg-[#00c48c]/10 cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#cca34c]" />
            <span>CRM</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 text-[var(--mu)] cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#cca34c]" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[var(--ink)]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--bd)] bg-[var(--bg)] px-6 py-4 flex flex-col gap-3.5 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="text-xs font-black uppercase tracking-wider text-[#00c48c] py-1 border-b border-[var(--bd)]">
            Explore Dedicated Service Pages:
          </div>
          <div className="grid grid-cols-1 gap-1.5 pl-2">
            {funnels.map((f) => (
              <button
                key={f.id}
                onClick={() => handleLaunchFunnel(f.slug)}
                className="text-left py-1 text-xs font-bold text-[var(--ink)] hover:text-[#00c48c] flex items-center justify-between"
              >
                <span>{f.name}</span>
                <span className="text-[10px] text-[#cca34c] font-normal">${f.pricingTiers[0]?.price}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-[var(--bd)] pt-2 flex flex-col gap-2">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--ink)] font-medium py-1"
            >
              What we build
            </a>
            <a
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--ink)] font-medium py-1"
            >
              How it works
            </a>
            <a
              href="#funnels"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--ink)] font-medium py-1"
            >
              Funnels Catalog
            </a>
            <a
              href="#plans"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--ink)] font-medium py-1"
            >
              Plans
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--ink)] font-medium py-1"
            >
              FAQ
            </a>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setCurrentView(currentView === 'public' ? 'machine' : 'public');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center bg-[#070e24] text-[#00c48c] border border-[#cca34c]/40 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-[#cca34c]" />
              <span>Open Business Machine OS</span>
            </button>
            <button
              onClick={() => {
                openPaymentModal({ amount: 1500, note: 'Mobile Retainer Kickoff' });
                setMobileMenuOpen(false);
              }}
              className="w-full text-center bg-[#cca34c]/15 text-[#cca34c] border border-[#cca34c]/40 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-[#cca34c]" />
              <span>Pay Online / Bank Wire Portal</span>
            </button>
            <a
              href="#start"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-gradient-to-r from-[#00c48c] to-[#00a876] text-white font-bold py-2.5 rounded-xl shadow-[0_3px_0_#007a56]"
            >
              Get Free Growth Plan →
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

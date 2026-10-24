import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { ServiceFunnel, FunnelPricingTier } from '../../types/index.ts';
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Layers,
  Zap,
  Globe,
  Clock,
  Send,
  Check,
  Copy,
  LayoutDashboard,
  Moon,
  Sun,
  Code2,
  Smartphone,
  Monitor,
  X,
  CreditCard,
  Lock,
} from 'lucide-react';

import { ClientPaymentPortalModal } from './ClientPaymentPortalModal.tsx';

interface DedicatedServiceFunnelViewProps {
  funnel: ServiceFunnel;
  onBackToOverview: () => void;
}

export const DedicatedServiceFunnelView: React.FC<DedicatedServiceFunnelViewProps> = ({
  funnel,
  onBackToOverview,
}) => {
  const {
    funnels,
    setActiveFunnelId,
    setCurrentView,
    addLead,
    addBooking,
    theme,
    toggleTheme,
    baseUrl,
    openPaymentModal,
  } = useBusiness();

  // Selected pricing tier state
  const [selectedTier, setSelectedTier] = useState<FunnelPricingTier>(
    funnel.pricingTiers.find((t) => t.recommended) || funnel.pricingTiers[0]
  );

  // Form State
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [timeline, setTimeline] = useState('Immediate (Next 7-14 days)');
  const [notes, setNotes] = useState('');
  const [bookingRequested, setBookingRequested] = useState(true);
  const [bookingSlot, setBookingSlot] = useState('Tomorrow 11:00 AM');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Embed / Integration drawer state
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [embedTab, setEmbedTab] = useState<'iframe' | 'widget' | 'whatsapp' | 'webhook'>('iframe');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Accordion open items
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Accent Color Theme classes
  const getThemeColors = (accent: ServiceFunnel['accentColor']) => {
    switch (accent) {
      case 'gold':
        return {
          primary: '#cca34c',
          primaryHover: '#b58f3e',
          pillBg: 'bg-[#cca34c]/15 text-[#cca34c] border-[#cca34c]/30',
          gradient: 'from-[#cca34c] to-[#a88234]',
          shadow: 'shadow-[0_4px_20px_rgba(204,163,76,0.25)]',
          borderAccent: 'border-[#cca34c]',
        };
      case 'blue':
        return {
          primary: '#3b82f6',
          primaryHover: '#2563eb',
          pillBg: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
          gradient: 'from-blue-500 to-blue-700',
          shadow: 'shadow-[0_4px_20px_rgba(59,130,246,0.25)]',
          borderAccent: 'border-blue-500',
        };
      case 'purple':
        return {
          primary: '#a855f7',
          primaryHover: '#9333ea',
          pillBg: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
          gradient: 'from-purple-500 to-purple-700',
          shadow: 'shadow-[0_4px_20px_rgba(168,85,247,0.25)]',
          borderAccent: 'border-purple-500',
        };
      case 'orange':
        return {
          primary: '#f97316',
          primaryHover: '#ea580c',
          pillBg: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
          gradient: 'from-orange-500 to-orange-700',
          shadow: 'shadow-[0_4px_20px_rgba(249,115,22,0.25)]',
          borderAccent: 'border-orange-500',
        };
      default:
        return {
          primary: '#00c48c',
          primaryHover: '#00a876',
          pillBg: 'bg-[#00c48c]/15 text-[#00c48c] border-[#00c48c]/30',
          gradient: 'from-[#00c48c] to-[#009b6e]',
          shadow: 'shadow-[0_4px_20px_rgba(0,196,140,0.25)]',
          borderAccent: 'border-[#00c48c]',
        };
    }
  };

  const themeStyles = getThemeColors(funnel.accentColor);
  const currentOrigin = (baseUrl || window.location.origin || 'https://backforbrand.com').replace(/\/$/, '');
  const publicFunnelUrl = `${currentOrigin}/?funnel=${funnel.slug}`;

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !email) return;

    setIsSubmitting(true);

    // Save lead into CRM pipeline
    const newLead = addLead({
      name: clientName.trim(),
      company: company.trim() || `${clientName}'s Business`,
      email: email.trim(),
      phone: phone.trim() || 'Not specified',
      src: `${funnel.name}`,
      stage: 'New',
      val: selectedTier.price,
      need: `${funnel.name} (${selectedTier.name} Tier)`,
      message: `Inbound customer inquiry via dedicated service page for ${funnel.serviceCategory}.\nSelected Package: ${selectedTier.name} ($${selectedTier.price.toLocaleString()})\nTimeline: ${timeline}\nNotes: ${notes || 'None'}`,
    });

    // If appointment requested, also sync into booking calendar
    if (bookingRequested) {
      addBooking({
        name: clientName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        service: `${funnel.name} Strategy Session`,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '11:00',
        durationMinutes: 45,
        st: 'Pending',
        meetingLink: `https://meet.google.com/bfb-${funnel.slug}-${newLead.id.slice(0, 6)}`,
        notes: `Automated booking intake from ${funnel.name}. Preferred: ${bookingSlot}`,
      });
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedCode(key);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // ignore
    }
  };

  // WhatsApp Deep link with pre-filled message
  const waMessage = `Hi Back for Brand! I would like to integrate the "${funnel.name}" system (${selectedTier.name} Tier) for my business.`;
  const whatsappUrl = `https://wa.me/923331112223?text=${encodeURIComponent(waMessage)}`;

  // Iframe code
  const iframeSnippet = `<!-- Back for Brand Dedicated Service Funnel Embed -->
<iframe
  src="${publicFunnelUrl}"
  width="100%"
  height="900"
  style="border: none; border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.12);"
  allow="payment; camera; microphone"
  loading="lazy"
></iframe>`;

  // Script widget snippet
  const widgetSnippet = `<!-- Back for Brand Floating Service Widget -->
<script
  src="${currentOrigin}/embed.js"
  data-funnel="${funnel.slug}"
  data-accent="${funnel.accentColor}"
  data-cta="${encodeURIComponent(funnel.ctaText)}"
  data-position="bottom-right"
  async
></script>`;

  // Webhook JSON format
  const webhookExample = `POST ${currentOrigin}/api/funnels/${funnel.slug}/inbound-lead
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "phone": "+14155550199",
  "company": "Acme Ventures",
  "tier": "${selectedTier.name}",
  "dealValue": ${selectedTier.price},
  "notes": "Inbound lead from external Webflow/WordPress form"
}`;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col font-sans transition-colors duration-200">
      {/* Top Floating Control & Service Switcher Navigation */}
      <header className="sticky top-0 z-40 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--bd)] shadow-sm">
        <div className="max-w-[1240px] w-[94%] mx-auto h-16 flex items-center justify-between gap-4">
          {/* Back button & Brand Identification */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToOverview}
              className="p-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] hover:bg-[var(--bd)] text-[var(--ink)] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Return to Main Agency Overview"
            >
              <ArrowLeft className="w-4 h-4 text-[#cca34c]" />
              <span className="hidden sm:inline">All Services</span>
            </button>

            <div className="h-6 w-[1px] bg-[var(--bd)] hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${themeStyles.pillBg}`}>
                {funnel.badge}
              </span>
              <span className="font-extrabold text-xs sm:text-sm text-[var(--ink)] hidden md:inline truncate max-w-xs">
                {funnel.name}
              </span>
            </div>
          </div>

          {/* Center Switcher: Jump to any other Service Funnel */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[var(--mu)] hidden lg:inline">
              Switch Service Page:
            </span>
            <select
              value={funnel.slug}
              onChange={(e) => {
                const targetSlug = e.target.value;
                if (targetSlug === 'all') {
                  onBackToOverview();
                } else {
                  setActiveFunnelId(targetSlug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="text-xs px-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold focus:outline-none focus:border-[#00c48c] max-w-[200px] sm:max-w-xs truncate"
            >
              <option value="all">← Return to Full Agency Overview</option>
              {funnels.map((f) => (
                <option key={f.id} value={f.slug}>
                  {f.name} ({f.serviceCategory.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Embed on website helper */}
            <button
              onClick={() => setShowEmbedModal(true)}
              className="px-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] hover:bg-[var(--bd)] text-xs font-bold text-[var(--ink)] flex items-center gap-1.5 transition-all cursor-pointer"
              title="Integrate & Embed this service page onto external websites"
            >
              <Code2 className="w-3.5 h-3.5 text-[#00c48c]" />
              <span className="hidden sm:inline">Embed / Integrate</span>
            </button>

            {/* Switch to Executive Business Machine */}
            <button
              onClick={() => setCurrentView('machine')}
              className="px-3 py-1.5 rounded-xl bg-[#070e24] text-[#00c48c] border border-[#cca34c]/50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Switch to CEO Business Machine & CRM"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#cca34c]" />
              <span className="hidden sm:inline">CRM OS</span>
            </button>

            {/* Direct Client Pay / Wire Portal Button */}
            <button
              onClick={() => openPaymentModal({ amount: selectedTier.price, note: `${funnel.name} - ${selectedTier.name} Package` })}
              className="px-3 py-1.5 rounded-xl bg-[#cca34c]/15 text-[#cca34c] border border-[#cca34c]/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs hover:bg-[#cca34c]/25 cursor-pointer"
              title="Open International Payment Portal (Stripe, GCC, Pakistani Banks)"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#cca34c]" />
              <span className="hidden sm:inline">Pay / Wire</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              className="w-8 h-8 rounded-xl border border-[var(--bd)] flex items-center justify-center text-[var(--mu)] hover:text-[#00c48c] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#cca34c]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Funnel Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[var(--bd)]">
        {/* Ambient background glows tailored to funnel accent */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[120px] opacity-15 pointer-events-none"
          style={{ backgroundColor: themeStyles.primary }}
        />

        <div className="max-w-[1160px] w-[92%] mx-auto text-center relative z-10">
          {/* Target Audience Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--soft)] border border-[var(--bd)] shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: themeStyles.primary }} />
            <span className="text-xs font-bold text-[var(--mu)]">
              Engineered specifically for: <strong className="text-[var(--ink)]">{funnel.targetAudience}</strong>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.12] text-[var(--ink)] max-w-4xl mx-auto mb-6">
            {funnel.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-[var(--mu)] max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            {funnel.subheadline}
          </p>

          {/* Key Metric Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10 text-xs sm:text-sm font-bold text-[var(--ink)]">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--bd)] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#cca34c]" />
              <span>{funnel.heroHighlight}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--bd)] shadow-xs">
              <MessageSquare className="w-4 h-4 text-[#00c48c]" />
              <span>&lt; 45s WhatsApp AI Qualifier</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--bd)] shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Asset Ownership</span>
            </div>
          </div>

          {/* Dual Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <a
              href="#pricing"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-white font-extrabold text-sm tracking-wide shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: themeStyles.primary }}
            >
              <span>{funnel.ctaText}</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#070e24] text-white hover:bg-[#0c183a] border border-[#cca34c]/40 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#00c48c]" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Deliverables & Architecture Breakdown */}
      <section className="py-16 md:py-20 bg-[var(--soft)]/50 border-b border-[var(--bd)]">
        <div className="max-w-[1160px] w-[92%] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#00c48c] block mb-2">
              The Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[var(--ink)] tracking-tight">
              What Is Included In The <span className="highlight-gold">{funnel.serviceCategory}</span> Engine
            </h2>
          </div>

          {/* 2-Column Grid: Deliverables vs Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Complete Deliverables list */}
            <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black text-[var(--ink)] mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00c48c]" />
                <span>Production Deliverables</span>
              </h3>
              <p className="text-xs text-[var(--mu)] mb-6 leading-relaxed">
                Everything built is delivered ready to convert traffic on day 1 with full source code, CRM integration, and analytics tracking.
              </p>

              <div className="space-y-3.5">
                {funnel.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--ink)]">
                    <CheckCircle2 className="w-4 h-4 text-[#00c48c] flex-shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Concrete Business Benefits */}
            <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black text-[var(--ink)] mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#cca34c]" />
                <span>Immediate Revenue Impact</span>
              </h3>
              <p className="text-xs text-[var(--mu)] mb-6 leading-relaxed">
                Designed specifically to eliminate lead leakage, cut acquisition costs, and streamline your customer onboarding.
              </p>

              <div className="space-y-3.5">
                {funnel.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--ink)]">
                    <div className="w-5 h-5 rounded-full bg-[#cca34c]/15 text-[#cca34c] flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="font-medium leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Verified Performance Box */}
              <div className="mt-8 p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[var(--mu)] uppercase block">
                    Historical Funnel Conversion
                  </span>
                  <span className="text-xl font-black text-[#00c48c]">
                    {funnel.conversionRate ? `${funnel.conversionRate}%` : '18.4%'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[var(--mu)] uppercase block">
                    Average Close Cycle
                  </span>
                  <span className="text-xl font-black text-[#cca34c]">
                    4.2 Days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tiered Pricing Packages Section */}
      <section id="pricing" className="py-20 border-b border-[var(--bd)]">
        <div className="max-w-[1160px] w-[92%] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-[#cca34c] block mb-2">
              Select Your Tier
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--ink)] tracking-tight">
              Transparent Investment For <span className="text-[#00c48c]">{funnel.name}</span>
            </h2>
            <p className="text-sm text-[var(--mu)] mt-3">
              One-time deployment fee. No hidden royalties, no vendor lock-in.
            </p>
          </div>

          {/* Pricing Tiers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {funnel.pricingTiers.map((tier) => {
              const isSelected = selectedTier.id === tier.id;
              const isRecommended = tier.recommended;

              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className={`rounded-3xl p-7 transition-all flex flex-col justify-between cursor-pointer relative ${
                    isSelected
                      ? 'bg-[var(--card)] border-2 shadow-xl scale-[1.02]'
                      : 'bg-[var(--card)] border border-[var(--bd)] hover:border-[var(--bd)]/80 hover:shadow-md'
                  }`}
                  style={{
                    borderColor: isSelected ? themeStyles.primary : undefined,
                  }}
                >
                  {isRecommended && (
                    <span
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white font-black text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md"
                      style={{ backgroundColor: themeStyles.primary }}
                    >
                      Most Popular System
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-black text-[var(--ink)] tracking-tight">
                        {tier.name}
                      </h4>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[var(--mu)] mb-6 min-h-[36px] leading-relaxed">
                      {tier.description}
                    </p>

                    {/* Price figure */}
                    <div className="mb-6 pb-6 border-b border-[var(--bd)]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-[var(--mu)]">$</span>
                        <span className="text-4xl font-black text-[var(--ink)] tracking-tight">
                          {tier.price.toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold text-[var(--mu)]">
                          {tier.period || 'USD flat'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#00a876] font-bold block mt-1">
                        ✓ Complete source code handover
                      </span>
                    </div>

                    {/* Features checklist */}
                    <div className="space-y-2.5 mb-8 text-xs text-[var(--ink)]">
                      <span className="text-[10px] font-bold text-[var(--mu)] uppercase tracking-wider block mb-2">
                        Features Included:
                      </span>
                      {tier.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00c48c] flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href="#intake"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTier(tier);
                      const el = document.getElementById('intake');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      isSelected
                        ? 'text-white'
                        : 'bg-[var(--soft)] hover:bg-[var(--bd)] text-[var(--ink)]'
                    }`}
                    style={{
                      backgroundColor: isSelected ? themeStyles.primary : undefined,
                    }}
                  >
                    <span>{isSelected ? 'Selected Package' : 'Select ' + tier.name}</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </a>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openPaymentModal({
                        amount: tier.price,
                        note: `${funnel.name} - ${tier.name} ($${tier.price.toLocaleString()})`,
                      });
                    }}
                    className="w-full mt-2 py-2 rounded-xl bg-[var(--soft)] hover:bg-[#00c48c]/15 text-[var(--ink)] hover:text-[#00c48c] border border-[var(--bd)] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#00c48c]" />
                    <span>Pay ${tier.price.toLocaleString()} (Stripe / Bank Wire)</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Direct Inbound Lead Capture & Booking Intake Form */}
      <section id="intake" className="py-20 bg-[var(--soft)]/50 border-b border-[var(--bd)]">
        <div className="max-w-[760px] w-[92%] mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#00c48c] block mb-2">
              Fast-Track Onboarding
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[var(--ink)] tracking-tight">
              Get Started With <span className="highlight-gold">{funnel.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mu)] mt-2">
              Fill in your details below. Our team and 24/7 WhatsApp AI will prepare your customized setup.
            </p>
          </div>

          <div className="bg-[var(--card)] border-2 border-[#cca34c]/30 rounded-3xl p-6 sm:p-10 shadow-xl">
            {submitted ? (
              <div className="text-center py-8 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-[var(--ink)]">
                  Inquiry Received &amp; Pipeline Activated!
                </h3>
                <p className="text-xs sm:text-sm text-[var(--mu)] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{clientName}</strong>! Your inquiry for <strong>{funnel.name}</strong> ({selectedTier.name} Tier · ${selectedTier.price.toLocaleString()}) has been automatically logged into our CRM.
                </p>

                <div className="pt-6 border-t border-[var(--bd)] flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open Instant WhatsApp AI Chat</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setClientName('');
                      setEmail('');
                      setPhone('');
                      setCompany('');
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[var(--bd)] bg-[var(--soft)] hover:bg-[var(--bd)] text-xs font-bold text-[var(--ink)] transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="space-y-5 text-xs">
                {/* Active Tier Summary Pill */}
                <div className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[var(--mu)] uppercase block">
                      Target Service Tier
                    </span>
                    <strong className="text-sm font-black text-[var(--ink)]">
                      {selectedTier.name} — ${selectedTier.price.toLocaleString()}
                    </strong>
                  </div>
                  <a
                    href="#pricing"
                    className="text-xs font-bold text-[#00c48c] hover:underline"
                  >
                    Change Tier
                  </a>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--ink)] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Dr. Sara / Alex Smith"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-medium focus:outline-none focus:border-[#00c48c]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--ink)] mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex@company.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-medium focus:outline-none focus:border-[#00c48c]"
                    />
                  </div>
                </div>

                {/* WhatsApp Phone & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--ink)] mb-1.5">
                      WhatsApp Phone Number (with country code)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +92 333 1112223 or +1 415 5550199"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-medium focus:outline-none focus:border-[#00c48c]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--ink)] mb-1.5">
                      Company / Clinic / Brand Name
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Premier Health Corp"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-medium focus:outline-none focus:border-[#00c48c]"
                    />
                  </div>
                </div>

                {/* Project Timeline & Meeting Option */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--ink)] mb-1.5">
                      Target Launch Timeline
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-medium focus:outline-none focus:border-[#00c48c]"
                    >
                      <option value="Immediate (Next 7-14 days)">Immediate (Next 7-14 days)</option>
                      <option value="Next 30 days">Next 30 days</option>
                      <option value="Exploring & Budgeting">Exploring &amp; Budgeting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--ink)] mb-1.5">
                      Preferred Strategy Call Slot
                    </label>
                    <input
                      type="text"
                      value={bookingSlot}
                      onChange={(e) => setBookingSlot(e.target.value)}
                      placeholder="e.g. Tomorrow 11:00 AM"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-medium focus:outline-none focus:border-[#00c48c]"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1.5">
                    Specific Requirements or Questions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us about your current traffic source, existing website, or what specific features you need..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-medium focus:outline-none focus:border-[#00c48c]"
                  />
                </div>

                {/* Checkbox for Automated Calendar Sync */}
                <label className="flex items-center gap-2.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={bookingRequested}
                    onChange={(e) => setBookingRequested(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00c48c] focus:ring-[#00c48c]"
                  />
                  <span className="font-bold text-[var(--ink)]">
                    Hold my Google Meet strategy call slot automatically
                  </span>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl text-white font-black text-sm tracking-wide shadow-lg transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: themeStyles.primary }}
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Activating Pipeline...'
                      : `Claim ${selectedTier.name} Strategy Plan ($${selectedTier.price.toLocaleString()})`}
                  </span>
                </button>

                <p className="text-[11px] text-center text-[var(--mu)]">
                  🔒 Zero spam guarantee. Leads flow securely straight to executive CRM.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Service Specific FAQ Accordion */}
      <section className="py-16 md:py-20 border-b border-[var(--bd)]">
        <div className="max-w-[800px] w-[92%] mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#cca34c] block mb-2">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] tracking-tight">
              Frequently Asked Questions About <span className="text-[#00c48c]">{funnel.serviceCategory}</span>
            </h2>
          </div>

          <div className="space-y-3">
            {funnel.faqItems.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[var(--bd)] bg-[var(--card)] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[var(--ink)] cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--mu)] transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-[#00c48c]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--mu)] leading-relaxed border-t border-[var(--bd)]/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Strip */}
      <footer className="py-8 bg-[var(--soft)] text-center text-xs text-[var(--mu)] border-t border-[var(--bd)]">
        <div className="max-w-[1160px] w-[92%] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[var(--ink)]">Back for Brand™</span>
            <span>· Dedicated Service Funnel Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <button
              onClick={onBackToOverview}
              className="text-[#00c48c] hover:underline cursor-pointer"
            >
              ← Return to Main Agency Site
            </button>
            <button
              onClick={() => setCurrentView('machine')}
              className="text-[#cca34c] hover:underline cursor-pointer"
            >
              Business Machine CRM
            </button>
          </div>
        </div>
      </footer>

      {/* EMBED & INTEGRATION MODAL */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[var(--bg)] border-2 border-[#cca34c]/40 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
              <div>
                <h3 className="text-lg font-black text-[var(--ink)] flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[#00c48c]" />
                  <span>Integrate &amp; Embed This Service Page</span>
                </h3>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Sell <strong>{funnel.name}</strong> on any WordPress, Shopify, Webflow, or custom website.
                </p>
              </div>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Integration method tabs */}
            <div className="flex items-center gap-2 border-b border-[var(--bd)] pb-3 text-xs font-bold">
              <button
                onClick={() => setEmbedTab('iframe')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  embedTab === 'iframe'
                    ? 'bg-[#00c48c] text-white'
                    : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
                }`}
              >
                Website Iframe Embed
              </button>
              <button
                onClick={() => setEmbedTab('widget')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  embedTab === 'widget'
                    ? 'bg-[#00c48c] text-white'
                    : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
                }`}
              >
                Floating Sales Widget
              </button>
              <button
                onClick={() => setEmbedTab('whatsapp')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  embedTab === 'whatsapp'
                    ? 'bg-[#00c48c] text-white'
                    : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
                }`}
              >
                WhatsApp Direct Link
              </button>
              <button
                onClick={() => setEmbedTab('webhook')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  embedTab === 'webhook'
                    ? 'bg-[#00c48c] text-white'
                    : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
                }`}
              >
                External Form Webhook
              </button>
            </div>

            {/* Tab content */}
            {embedTab === 'iframe' && (
              <div className="space-y-3 text-xs">
                <p className="text-[var(--mu)]">
                  Copy and paste this HTML code directly into your WordPress Custom HTML block, Shopify page template, Webflow Embed, or Squarespace Code block:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30">
                    {iframeSnippet}
                  </pre>
                  <button
                    onClick={() => handleCopy(iframeSnippet, 'iframe')}
                    className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all"
                  >
                    {copiedCode === 'iframe' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'iframe' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>
            )}

            {embedTab === 'widget' && (
              <div className="space-y-3 text-xs">
                <p className="text-[var(--mu)]">
                  Add this single tag right before the closing <code>&lt;/body&gt;</code> tag of your website. It injects a floating booking trigger button that expands this service funnel in a slide-out drawer:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30">
                    {widgetSnippet}
                  </pre>
                  <button
                    onClick={() => handleCopy(widgetSnippet, 'widget')}
                    className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all"
                  >
                    {copiedCode === 'widget' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'widget' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>
            )}

            {embedTab === 'whatsapp' && (
              <div className="space-y-3 text-xs">
                <p className="text-[var(--mu)]">
                  Use this link in your social media bio (Instagram, TikTok, LinkedIn, Meta Ads CTA) to direct clicks straight to your 24/7 AI WhatsApp Agent with this service inquiry pre-populated:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30">
                    {whatsappUrl}
                  </pre>
                  <button
                    onClick={() => handleCopy(whatsappUrl, 'wa')}
                    className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all"
                  >
                    {copiedCode === 'wa' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'wa' ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            )}

            {embedTab === 'webhook' && (
              <div className="space-y-3 text-xs">
                <p className="text-[var(--mu)]">
                  Send leads from Zapier, Make, Typeform, or external landing pages directly into this funnel&apos;s CRM pipeline:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30">
                    {webhookExample}
                  </pre>
                  <button
                    onClick={() => handleCopy(webhookExample, 'wh')}
                    className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all"
                  >
                    {copiedCode === 'wh' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'wh' ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[var(--bd)] flex items-center justify-end">
              <button
                onClick={() => setShowEmbedModal(false)}
                className="px-5 py-2 rounded-xl bg-[var(--soft)] hover:bg-[var(--bd)] text-xs font-bold text-[var(--ink)] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Multi-Rail Payment Modal */}
      <ClientPaymentPortalModal />
    </div>
  );
};

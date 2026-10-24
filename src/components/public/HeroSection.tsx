import React, { useState, useEffect, useRef } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  Bot,
  Bell,
  Sparkles,
  MessageSquare,
  Globe2,
  Calendar,
  Zap,
  TrendingUp,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface SlideData {
  title: string;
  description: string;
}

const SLIDES: SlideData[] = [
  {
    title: 'The big picture',
    description: 'Traffic flows down the funnel and becomes high-value booked clients.',
  },
  {
    title: 'Step 1: Attract',
    description: 'Targeted ads, organic search and social media bring qualified leads.',
  },
  {
    title: 'Step 2: WhatsApp & Chat Capture',
    description: 'AI WhatsApp Agent qualifies leads in English, Arabic & Urdu in under 45 seconds.',
  },
  {
    title: 'Step 3: Automated Bookings',
    description: 'Calendar bookings, reminders and CRM pipeline sync automatically.',
  },
  {
    title: 'Step 4: Delight & Scale',
    description: 'Smooth onboarding, service delivery tickets and CEO oversight dashboard.',
  },
];

// Phrases that will be animated with the dynamic writing / typewriter effect
const HEADLINE_PHRASES = [
  {
    text: 'Booked High-Ticket Clients',
    category: 'Bookings',
    tag: '⚡ 3.4x Higher Conversion',
  },
  {
    text: 'WhatsApp & Email Sales 24/7',
    category: 'WhatsApp AI',
    tag: '💬 < 45s Response Time',
  },
  {
    text: 'Closed Deals in EN, AR & UR',
    category: 'Multi-Lingual',
    tag: '🌍 English · Arabic · Urdu',
  },
  {
    text: 'Scalable Revenue on Autopilot',
    category: 'Autonomous',
    tag: '📈 $2.4M+ Pipeline',
  },
  {
    text: '7-Figure Brand Authority',
    category: 'Branding',
    tag: '👑 Back for Brand™',
  },
];

export const HeroSection: React.FC = () => {
  const { addLead } = useBusiness();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Dynamic writing / typewriter state
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(60);

  // Handle writing animation
  useEffect(() => {
    const currentFullText = HEADLINE_PHRASES[phraseIdx].text;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (charIdx < currentFullText.length) {
          setCharIdx((prev) => prev + 1);
          setTypingSpeed(55 + Math.random() * 30); // Realistic slight typing variance
        } else {
          // Finished writing full phrase -> pause before deleting
          setTypingSpeed(2200);
          setIsDeleting(true);
        }
      } else {
        // Deleting backward
        if (charIdx > 0) {
          setCharIdx((prev) => prev - 1);
          setTypingSpeed(30);
        } else {
          // Finished deleting -> move to next phrase
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % HEADLINE_PHRASES.length);
          setTypingSpeed(120);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, phraseIdx, typingSpeed]);

  // Jump to specific phrase when user clicks quick chip
  const handleSelectPhrase = (index: number) => {
    setPhraseIdx(index);
    setCharIdx(HEADLINE_PHRASES[index].text.length);
    setIsDeleting(false);
    setTypingSpeed(2500);
  };

  // Auto-advance slides every 6s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    addLead({
      name: email.split('@')[0] || 'Website Lead',
      email: email,
      src: 'Direct/Other',
      stage: 'New',
      val: 1200,
      need: 'Free High-Ticket Growth Plan',
      message: 'Captured from Back for Brand Hero email portal.',
    });

    setSubmitted(true);
    setTimeout(() => {
      const el = document.getElementById('start');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 800);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
      }
    }
    touchStartX.current = null;
  };

  const currentPhrase = HEADLINE_PHRASES[phraseIdx];
  const displayedWritingText = currentPhrase.text.slice(0, charIdx);

  return (
    <header className="relative pt-10 pb-16 md:py-20 overflow-hidden bg-gradient-to-b from-[#00c48c]/[0.05] via-[#cca34c]/[0.03] to-transparent dark:from-[#00c48c]/[0.08] dark:via-[#070e24]/50">
      {/* Luxury Ambient Glows: Brand Emerald Green & Mustard Gold Glows */}
      <div className="absolute -left-20 top-0 w-[520px] h-[520px] rounded-full bg-[#00c48c]/[0.15] dark:bg-[#00c48c]/[0.22] blur-[140px] pointer-events-none -z-0" />
      <div className="absolute right-0 top-1/4 w-[460px] h-[460px] rounded-full bg-[#cca34c]/[0.10] dark:bg-[#cca34c]/[0.15] blur-[140px] pointer-events-none -z-0" />
      <div className="absolute left-1/3 bottom-0 w-[380px] h-[380px] rounded-full bg-[#00c48c]/[0.08] dark:bg-[#cca34c]/[0.10] blur-[120px] pointer-events-none -z-0" />

      <div className="max-w-[1180px] w-[92%] mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Animated Brand Colors Headline & Branding */}
        <div>
          {/* Top Brand Pill with Official Logo & Neon Beacon */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#070e24]/90 border-2 border-[#cca34c]/40 text-xs font-semibold text-[var(--ink)] mb-5 shadow-md shadow-[#cca34c]/10 backdrop-blur-md">
            <img
              src="/assets/aistudio/images_9652885d.png"
              alt="Back for Brand Official Logo"
              className="h-6 w-auto object-contain bg-white rounded p-0.5 shadow-sm"
            />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c48c] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00c48c]" />
            </span>
            <span className="font-extrabold tracking-wide uppercase text-[11px] text-[#cca34c]">
              Back for Brand™ OS
            </span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="flex items-center gap-1 text-[11px] text-[var(--ink)] font-semibold">
              <Sparkles className="w-3 h-3 text-[#cca34c] fill-[#cca34c]" />
              Autonomous Business Machine
            </span>
          </div>

          {/* Master Headline with Dynamic Animated Writing in Brand Colors */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-5xl lg:text-[58px] font-black tracking-tight leading-[1.1] text-[var(--ink)]">
              <span className="block text-base sm:text-lg md:text-xl font-extrabold uppercase tracking-widest text-[#cca34c] dark:text-[#e5b85c] mb-2.5">
                Back for Brand
              </span>
              <span>Turn Visitors Into</span>
              {/* Dynamic Writing Animation in Brand Emerald Green & Mustard Gold */}
              <span className="block mt-2 min-h-[1.25em] sm:min-h-[1.2em] relative">
                <span className="bg-gradient-to-r from-[#00c48c] via-[#20d89f] to-[#cca34c] dark:from-[#00c48c] dark:via-[#34e2ab] dark:to-[#e5b85c] bg-clip-text text-transparent font-black tracking-tight animate-brand-glow">
                  {displayedWritingText}
                </span>
                {/* Brand Emerald Green Blinking Writing Cursor */}
                <span
                  className="inline-block w-[3.5px] sm:w-[4px] h-[0.85em] ml-1.5 bg-[#00c48c] align-middle animate-cursor-blink shadow-[0_0_14px_#00c48c,0_0_24px_rgba(204,163,76,0.5)] rounded-[1px]"
                  aria-hidden="true"
                />
              </span>
            </h1>

            {/* Keyword-Rich H2 Tag for Back for Brand, Ghazi Wazir, and Active Projects */}
            <h2 className="text-sm sm:text-base font-semibold text-[#00a876] dark:text-[#20d89f] mt-3.5 mb-2 flex flex-wrap items-center gap-2">
              <span>Back for Brand OS Engineered by Founder Ghazi Wazir</span>
              <span className="text-[var(--bd)] hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#cca34c]/15 text-[#cca34c] text-xs font-bold border border-[#cca34c]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#cca34c] animate-pulse" />
                14+ Active Projects Running
              </span>
            </h2>

            {/* Quick Interactive Headline Mode Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-1">
              <span className="text-[11px] font-bold text-[#00a876] dark:text-[#20d89f] uppercase tracking-wider mr-1">
                Active Feature:
              </span>
              {HEADLINE_PHRASES.map((item, idx) => {
                const isActive = phraseIdx === idx;
                return (
                  <button
                    key={item.category}
                    onClick={() => handleSelectPhrase(idx)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 border cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#00c48c] to-[#00a876] text-white border-[#00c48c] shadow-md shadow-[#00c48c]/30 scale-[1.03]'
                        : 'bg-[var(--soft)] text-[var(--mu)] border-[var(--bd)] hover:border-[#00c48c]/50 hover:text-[#00a876] dark:hover:text-[#20d89f]'
                    }`}
                  >
                    <span>{item.category}</span>
                    {isActive && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-[var(--mu)] leading-relaxed max-w-[560px] mb-8 font-normal">
            <strong className="text-[var(--ink)] font-semibold">Back for Brand</strong> combines high-converting funnels, an autonomous{' '}
            <span className="text-[#00a876] dark:text-[#20d89f] font-bold bg-[#00c48c]/10 px-1.5 py-0.5 rounded border border-[#00c48c]/30">
              WhatsApp &amp; Email AI Agent
            </span>
            , and calendar booking to qualify and close high-ticket clients around the clock.
          </p>

          {/* Quick Capture Form with Brand Focus & High Contrast */}
          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-[#00c48c]/10 border-2 border-[#00c48c] text-emerald-950 dark:text-emerald-100 font-medium flex items-center gap-3.5 mb-6 max-w-[530px] shadow-lg shadow-[#00c48c]/15">
              <div className="w-10 h-10 rounded-xl bg-[#00c48c] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-[#00c48c]/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <strong className="block text-emerald-950 dark:text-emerald-100 font-bold text-sm sm:text-base">
                  VIP Growth Plan Queued!
                </strong>
                <span className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200">
                  Your lead is registered in the Executive CRM. Our WhatsApp agent is ready to connect.
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-[530px] mb-5">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your business email"
                  aria-label="Your email address"
                  autoComplete="email"
                  className="w-full text-base px-4 py-3.5 rounded-xl border-2 border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[#00c48c] focus:ring-4 focus:ring-[#00c48c]/20 transition-all shadow-sm"
                />
                <span className="absolute right-3 top-3.5 text-xs font-semibold px-2 py-0.5 rounded bg-[#00c48c]/10 text-[#00a876] dark:text-[#20d89f] border border-[#00c48c]/25 hidden sm:inline-block">
                  CEO Audit
                </span>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#00c48c] via-[#05df9d] to-[#cca34c] hover:from-[#00b07d] hover:to-[#b8903c] text-white font-black text-base px-7 py-3.5 rounded-xl transition-all shadow-[0_5px_0_#00875e] hover:shadow-[0_2px_0_#00875e] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2 whitespace-nowrap btn-shimmer relative overflow-hidden"
              >
                <span>Get Free Plan</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>
          )}

          {/* Trust Highlights & Brand Guarantees */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs sm:text-sm text-[var(--mu)] font-medium pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#cca34c]/15 text-[#cca34c] flex items-center justify-center font-bold text-xs">
                ✓
              </span>
              <span>100% Free Strategy Blueprint</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#00c48c]/15 text-[#00a876] flex items-center justify-center font-bold text-xs">
                ✓
              </span>
              <span>WhatsApp Agent in 3 Languages</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                ✓
              </span>
              <span>Executive CRM Dashboard Included</span>
            </span>
          </div>

          {/* Real-time Performance Ticker with Brand Accents */}
          <div className="mt-8 pt-6 border-t border-[var(--bd)] grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[560px]">
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-[#00c48c] dark:text-[#20d89f] tracking-tight">
                &lt; 45s
              </span>
              <span className="text-[11px] text-[var(--mu)] font-medium flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-[#00c48c]" /> WhatsApp Reply
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-[var(--ink)] tracking-tight">
                98.4%
              </span>
              <span className="text-[11px] text-[var(--mu)] font-medium flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#cca34c]" /> Lead Qualify Rate
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-[#cca34c] dark:text-[#e5b85c] tracking-tight">
                3 Langs
              </span>
              <span className="text-[11px] text-[var(--mu)] font-medium flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-[#cca34c]" /> EN · AR · UR
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-[var(--ink)] tracking-tight">
                $2.4M+
              </span>
              <span className="text-[11px] text-[var(--mu)] font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#00c48c]" /> Pipeline Tracked
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Machine Showcase & WhatsApp Agent Simulator */}
        <div
          className="relative min-w-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Decorative Brand Glow Aura behind the machine */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#00c48c]/25 via-[#cca34c]/15 to-transparent rounded-3xl blur-2xl -z-10 opacity-70" />

          {/* Machine Header Bar with Official Back for Brand Logo & Status */}
          <div className="bg-[var(--bg)] border border-[var(--bd)] rounded-t-2xl px-4 py-2.5 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="bg-white p-0.5 rounded-md border border-[#cca34c]/30 shadow-sm flex items-center justify-center">
                <img
                  src="/assets/aistudio/images_9652885d.png"
                  alt="Back for Brand"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <span className="font-black text-xs text-[var(--ink)]">
                Back for <span className="text-[#cca34c]">Brand</span> OS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#00c48c]/15 text-[#00a876] dark:text-[#00e09f] text-[10px] font-black border border-[#00c48c]/30">
                LIVE 24/7
              </span>
            </div>
            <div className="flex items-center gap-2 text-[var(--mu)] text-[11px]">
              <span className="hidden sm:inline">WhatsApp Agent:</span>
              <span className="text-[#00c48c] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00c48c] inline-block animate-pulse" /> Active
              </span>
            </div>
          </div>

          <div className="relative h-[410px] sm:h-[430px] w-full border-x border-b border-[var(--bd)] rounded-b-2xl bg-[var(--bg)]/90 backdrop-blur-md shadow-2xl p-4 flex items-center justify-center overflow-hidden">
            {/* SLIDE 0: The Big Picture */}
            <div
              className={`absolute inset-4 transition-all duration-500 flex flex-col items-center justify-center ${
                currentSlide === 0
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="relative w-full max-w-[420px] p-2 flex flex-col items-center gap-2.5">
                {/* Funnel Stage 1 */}
                <div className="funnel-trap-1 w-full bg-[#2b59ff] text-white py-3.5 px-6 text-center font-bold text-base shadow-lg shadow-blue-500/20">
                  <span>1. High-Intent Traffic</span>
                  <small className="block text-[11px] font-normal opacity-90">Meta Ads · Google · Social Content</small>
                </div>
                {/* Funnel Stage 2 with Brand Emerald Green */}
                <div className="funnel-trap-2 w-[86%] bg-gradient-to-r from-[#00c48c] to-[#009b6e] text-white py-3 px-5 text-center font-bold text-sm shadow-lg shadow-[#00c48c]/25 border-y border-[#00c48c]/50">
                  <span>2. WhatsApp AI Qualification</span>
                  <small className="block text-[11px] font-normal opacity-95">English · Arabic · Urdu in &lt;45s</small>
                </div>
                {/* Funnel Stage 3 */}
                <div className="funnel-trap-3 w-[70%] bg-[#1a3aab] text-white py-2.5 px-4 text-center font-bold text-sm shadow-lg shadow-blue-700/20">
                  <span>3. Calendar Booking</span>
                  <small className="block text-[10px] font-normal opacity-90">Auto-Reminders &amp; Deposit</small>
                </div>
                {/* Funnel Stage 4 */}
                <div className="funnel-trap-4 w-[52%] bg-[#ff6a1a] text-white py-2.5 px-3 text-center font-bold text-xs shadow-lg shadow-orange-500/20">
                  <span>4. High-Ticket Client Won</span>
                  <small className="block text-[10px] font-normal opacity-90">CEO Pipeline Sync</small>
                </div>

                {/* Floating WhatsApp Agent Notification Badge */}
                <div className="absolute top-[6%] -right-2 bg-[var(--bg)] border-2 border-[#00c48c] dark:border-[#00c48c]/80 shadow-xl rounded-2xl py-2 px-3 text-xs font-semibold animate-float flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#00c48c] text-white flex items-center justify-center shadow-md shadow-[#00c48c]/40">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#00a876] dark:text-[#20d89f] font-bold block">
                      💬 WhatsApp Qualified
                    </span>
                    <b className="text-[var(--ink)] text-xs">$3,500 Deal · Slot Booked</b>
                  </div>
                </div>

                {/* Floating CEO Security Badge */}
                <div
                  className="absolute bottom-[10%] -left-3 bg-[var(--bg)] border border-[var(--bd)] shadow-xl rounded-2xl py-2 px-3 text-xs font-semibold animate-float flex items-center gap-2"
                  style={{ animationDelay: '-3s' }}
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#2b59ff] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--mu)] block">👑 CEO Master Control</span>
                    <b className="text-[#2b59ff] text-xs">RBAC Protected</b>
                  </div>
                </div>
              </div>
            </div>

            {/* SLIDE 1: Attract */}
            <div
              className={`absolute inset-4 transition-all duration-500 flex flex-col items-center justify-center ${
                currentSlide === 1
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="w-full max-w-[420px] bg-[var(--soft)]/60 border border-[var(--bd)] rounded-2xl shadow-xl p-5 flex flex-col gap-3 text-xs">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[var(--bd)] text-[var(--mu)] bg-[var(--bg)]">
                  <Search className="w-3.5 h-3.5 text-[#00c48c]" />
                  <span className="text-[#00a876] dark:text-[#20d89f] font-medium">high-ticket agency funnels &amp; AI</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-[#00c48c]/10 border border-[#00c48c]/30">
                  <div className="flex items-center justify-between">
                    <b className="text-[#00a876] dark:text-[#20d89f] text-sm font-bold">
                      Back for Brand™ — Business Machine
                    </b>
                    <span className="text-[10px] bg-[#00c48c] text-white font-black px-1.5 py-0.5 rounded">
                      #1 Ranked
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--mu)] mt-1">
                    Autonomous sales funnels, multi-lingual WhatsApp closer and CEO CRM.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--bd)] text-center animate-float font-medium">
                    <span className="text-lg block mb-0.5">📣</span>
                    <span className="text-[11px]">Meta Ads</span>
                  </div>
                  <div
                    className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--bd)] text-center animate-float font-medium"
                    style={{ animationDelay: '-1.5s' }}
                  >
                    <span className="text-lg block mb-0.5">▶</span>
                    <span className="text-[11px]">TikTok Viral</span>
                  </div>
                  <div
                    className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--bd)] text-center animate-float font-medium"
                    style={{ animationDelay: '-3s' }}
                  >
                    <span className="text-lg block mb-0.5">🌐</span>
                    <span className="text-[11px]">Google SEO</span>
                  </div>
                </div>
                <div className="text-center font-bold text-[#00a876] dark:text-[#20d89f] text-xs">
                  ⚡ 1,420 High-Intent Visitors Inbound This Week
                </div>
              </div>
            </div>

            {/* SLIDE 2: WhatsApp AI Simulation */}
            <div
              className={`absolute inset-4 transition-all duration-500 flex flex-col items-center justify-center ${
                currentSlide === 2
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="w-full max-w-[420px] bg-[var(--bg)] border border-[#00c48c]/30 dark:border-[#00c48c]/40 rounded-2xl shadow-xl p-4 flex flex-col gap-2.5 text-xs">
                {/* Simulated WhatsApp Chat Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[var(--bd)]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#00c48c] text-white flex items-center justify-center font-bold text-xs">
                      💬
                    </div>
                    <div>
                      <b className="text-[var(--ink)] block text-xs">Back for Brand WhatsApp AI</b>
                      <span className="text-[10px] text-[#00a876] dark:text-[#20d89f] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00c48c]" /> Online · EN / AR / UR
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#00c48c]/15 text-[#00a876] dark:text-[#20d89f] font-bold px-2 py-0.5 rounded-full">
                    Auto-Qualifying
                  </span>
                </div>

                {/* Chat Bubble 1: Prospect */}
                <div className="bg-[var(--soft)] p-2.5 rounded-2xl rounded-tl-sm max-w-[85%] text-[11px] self-start">
                  <span>Hello, I need an automated client acquisition system for my consulting firm. Budget is $4k+.</span>
                </div>

                {/* Chat Bubble 2: WhatsApp AI */}
                <div className="bg-emerald-50 dark:bg-[#00c48c]/15 border border-[#00c48c]/30 text-emerald-950 dark:text-emerald-100 p-2.5 rounded-2xl rounded-tr-sm max-w-[90%] text-[11px] self-end shadow-sm">
                  <b className="text-[#00a876] dark:text-[#20d89f] block mb-0.5 font-bold">Back for Brand Agent:</b>
                  <span>
                    Welcome! That fits our High-Ticket Growth Engine. I have an executive onboarding spot open tomorrow at 3:00 PM. Would you like me to book it for you?
                  </span>
                </div>

                {/* Chat Bubble 3: Prospect */}
                <div className="bg-[var(--soft)] p-2 rounded-2xl rounded-tl-sm text-[11px] self-start">
                  <span>Yes, 3:00 PM works perfect.</span>
                </div>

                {/* Notification */}
                <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl p-2 text-center font-bold text-[11px] flex items-center justify-center gap-1.5 border border-[#00c48c]/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00c48c]" />
                  <span>Calendar Slot Confirmed · Synced to CEO CRM</span>
                </div>
              </div>
            </div>

            {/* SLIDE 3: CRM Conversion */}
            <div
              className={`absolute inset-4 transition-all duration-500 flex flex-col items-center justify-center ${
                currentSlide === 3
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="w-full max-w-[420px] bg-[var(--bg)] border border-[var(--bd)] rounded-2xl shadow-xl p-4 flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between pb-1">
                  <b className="font-bold text-[var(--ink)]">Executive CRM · Deals Pipeline</b>
                  <span className="text-[10px] text-[#cca34c] font-black">👑 Level-5 CEO View</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[var(--soft)] p-2 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] text-[var(--mu)] font-bold">New Lead</span>
                    <span className="bg-[var(--bg)] border border-[var(--bd)] p-1.5 rounded text-[11px] font-semibold truncate">
                      Omar R. ($4.2k)
                    </span>
                  </div>
                  <div className="bg-[var(--soft)] p-2 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] text-[#00a876] dark:text-[#20d89f] font-bold">Meeting Booked</span>
                    <span className="bg-[#00c48c]/15 border border-[#00c48c]/40 p-1.5 rounded text-[11px] font-bold text-[#00a876] dark:text-[#20d89f] truncate">
                      Sophia M. ($5.0k)
                    </span>
                  </div>
                  <div className="bg-[var(--soft)] p-2 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] text-emerald-600 font-bold">Won ✓</span>
                    <span className="bg-[#00c48c] text-white p-1.5 rounded text-[11px] font-bold truncate">
                      Apex Ltd ($8.5k)
                    </span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#00c48c]/10 border border-[#00c48c]/30 text-[#00a876] dark:text-[#20d89f] text-center font-bold flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#cca34c]" />
                  <span>Pipeline Total: $84,200 · 14 Pending Closings</span>
                </div>
              </div>
            </div>

            {/* SLIDE 4: Client Delivery */}
            <div
              className={`absolute inset-4 transition-all duration-500 flex flex-col items-center justify-center ${
                currentSlide === 4
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="w-full max-w-[420px] bg-[var(--bg)] border border-[var(--bd)] rounded-2xl shadow-xl p-4 flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <b className="text-sm font-bold text-[var(--ink)]">Client Delivery Machine</b>
                  <span className="text-[10px] bg-[#00c48c]/15 text-[#00a876] dark:text-[#20d89f] px-2 py-0.5 rounded-full font-bold">
                    100% On-Track
                  </span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  <li className="p-2 rounded-lg bg-[var(--soft)] text-[var(--ink)] font-medium flex items-center gap-2 text-xs">
                    <span className="text-[#00c48c] font-black">✓</span> 1. High-Converting Landing Page Launched
                  </li>
                  <li className="p-2 rounded-lg bg-[var(--soft)] text-[var(--ink)] font-medium flex items-center gap-2 text-xs">
                    <span className="text-[#00c48c] font-black">✓</span> 2. WhatsApp AI Trained &amp; Deployed
                  </li>
                  <li className="p-2 rounded-lg bg-[var(--soft)] text-[var(--ink)] font-medium flex items-center gap-2 text-xs">
                    <span className="text-[#00c48c] font-black">✓</span> 3. Multi-Lingual Prompt Integration
                  </li>
                  <li className="p-2 rounded-lg bg-[var(--soft)] text-[var(--mu)] flex items-center gap-2 text-xs">
                    <span className="text-[#cca34c] animate-spin">⟳</span> 4. CEO Dashboard &amp; Lead Routing Active
                  </li>
                </ul>
                <div className="h-2 rounded-full bg-[var(--bd)] overflow-hidden mt-1">
                  <div className="h-full bg-gradient-to-r from-[#00c48c] to-[#cca34c] w-4/5 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
              aria-label="Previous slide"
              className="w-9 h-9 rounded-full border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] hover:border-[#00c48c] hover:text-[#00c48c] flex items-center justify-center font-bold text-base transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex-1 text-xs text-[var(--mu)] min-h-[36px] flex flex-col justify-center">
              <b className="text-[var(--ink)] font-bold text-xs flex items-center gap-1.5">
                <span className="text-[#00a876] dark:text-[#20d89f] font-black">{currentSlide + 1}/{SLIDES.length}</span>
                <span>· {SLIDES[currentSlide].title}</span>
              </b>
              <span className="truncate">{SLIDES[currentSlide].description}</span>
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
              aria-label="Next slide"
              className="w-9 h-9 rounded-full border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] hover:border-[#00c48c] hover:text-[#00c48c] flex items-center justify-center font-bold text-base transition-colors flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Indicator with Brand Active Color */}
          <div className="flex gap-1.5 justify-center mt-2.5">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-6 bg-[#00c48c]' : 'w-1.5 bg-[var(--bd)] hover:bg-[#00c48c]/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

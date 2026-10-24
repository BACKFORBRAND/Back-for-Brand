import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Rocket,
  Building2,
  UserCheck,
  Calendar,
  MessageSquare,
  Globe,
  DollarSign,
  Clock,
  ShieldCheck,
  Send,
  Mail,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface StepMeta {
  number: number;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepMeta[] = [
  {
    number: 1,
    label: 'Architecture',
    sublabel: 'Choose Service',
    icon: Rocket,
  },
  {
    number: 2,
    label: 'Profile',
    sublabel: 'Goals & Timeline',
    icon: Building2,
  },
  {
    number: 3,
    label: 'Contact & Call',
    sublabel: 'Lock Strategy Slot',
    icon: UserCheck,
  },
];

interface ServiceOption {
  id: string;
  title: string;
  badge: string;
  price: number;
  description: string;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'funnel',
    title: 'High-Converting Sales Funnel',
    badge: 'Popular',
    price: 1500,
    description: 'Custom landing page, copywriting, and instant conversion tracking.',
  },
  {
    id: 'whatsapp_ai',
    title: '24/7 AI WhatsApp Closer',
    badge: 'Fast ROI',
    price: 1200,
    description: 'Trilingual qualifier (EN/AR/UR) replying in <45s and syncing to calendar.',
  },
  {
    id: 'ecommerce',
    title: 'High-AOV E-Commerce Upsell Engine',
    badge: '+38% AOV',
    price: 1800,
    description: 'Sub-second checkout, 1-click upsells, and abandoned cart recovery.',
  },
  {
    id: 'full_os',
    title: 'Full AI Business Machine OS',
    badge: 'Flagship',
    price: 3500,
    description: 'Funnels, WhatsApp agent, CRM pipeline, automations & CEO security.',
  },
  {
    id: 'app_saas',
    title: 'Custom App or SaaS Architecture',
    badge: 'Enterprise',
    price: 4500,
    description: 'Full-stack web application, client portal, database & Stripe billing.',
  },
  {
    id: 'geo_seo',
    title: 'SEO & AI Search Dominance (GEO)',
    badge: 'Organic',
    price: 950,
    description: 'Generative Engine Optimization to get cited by ChatGPT & Perplexity.',
  },
];

const BOTTLENECKS = [
  'Visitors leave website without booking or buying',
  'Slow lead response after business hours (losing clients)',
  'Ad spend ROAS on Meta/Google is unprofitable',
  'Need automated WhatsApp & email nurture workflows',
  'Launching a new high-ticket offer from scratch',
];

const TIMELINES = [
  { label: '⚡ Urgent (7–14 Days)', value: '7-14 Days' },
  { label: '📅 30-Day Sprint', value: '30 Days' },
  { label: '🎯 Next Quarter', value: 'Quarterly' },
];

const REVENUE_TARGETS = [
  '$10k – $25k / month',
  '$25k – $100k / month',
  '$100k – $500k / month',
  '$500k+ / month',
];

const SLOTS = [
  'Tomorrow 11:00 AM (EST)',
  'Tomorrow 3:00 PM (EST)',
  'Thursday 11:00 AM (EST)',
  'Friday 2:00 PM (EST)',
];

export const LeadCaptureStepper: React.FC = () => {
  const { addLead, addBooking, setCurrentView } = useBusiness();

  // Wizard Step: 1, 2, 3, or 4 (Submitted)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1 State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('funnel');
  const [revenueTarget, setRevenueTarget] = useState<string>('$25k – $100k / month');

  // Step 2 State
  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [selectedBottleneck, setSelectedBottleneck] = useState(BOTTLENECKS[0]);
  const [timeline, setTimeline] = useState('7-14 Days');

  // Step 3 State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingSlot, setBookingSlot] = useState(SLOTS[0]);
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Submitted lead info
  const [submittedLead, setSubmittedLead] = useState<any>(null);

  const selectedServiceObj = SERVICE_OPTIONS.find((s) => s.id === selectedServiceId) || SERVICE_OPTIONS[0];

  // Step Navigation Handlers
  const handleNextFromStep1 = () => {
    setCurrentStep(2);
    setValidationError(null);
  };

  const handleNextFromStep2 = () => {
    if (!companyName.trim()) {
      setValidationError('Please enter your business or brand name to continue.');
      return;
    }
    setValidationError(null);
    setCurrentStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid work email address.');
      return;
    }

    setValidationError(null);

    // Register lead in central CRM
    const newLead = addLead({
      name: fullName.trim(),
      company: companyName.trim() || `${fullName}'s Venture`,
      email: email.trim(),
      phone: phone.trim() || 'Unspecified',
      src: 'Direct/Other',
      stage: 'Contacted',
      val: selectedServiceObj.price,
      need: selectedServiceObj.title,
      message: `Onboarding Wizard Intake:\n• Service: ${selectedServiceObj.title} ($${selectedServiceObj.price})\n• Revenue Target: ${revenueTarget}\n• Bottleneck: ${selectedBottleneck}\n• Timeline: ${timeline}\n• Website: ${websiteUrl || 'None'}\n• Strategy Slot: ${bookingSlot}\n• Notes: ${notes || 'None'}`,
    });

    // Auto-schedule Strategy Session
    addBooking({
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      service: `${selectedServiceObj.title} Strategy Review`,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '11:00',
      durationMinutes: 45,
      st: 'Confirmed',
      meetingLink: `https://meet.google.com/bfb-onboard-${Math.random().toString(36).slice(2, 8)}`,
      notes: `Intake from onboarding progress stepper. Package: ${selectedServiceObj.title}. Target: ${revenueTarget}.`,
    });

    setSubmittedLead({
      name: fullName.trim(),
      company: companyName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      service: selectedServiceObj.title,
      price: selectedServiceObj.price,
      slot: bookingSlot,
      id: newLead.id,
    });

    setCurrentStep(4);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setCompanyName('');
    setWebsiteUrl('');
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setSubmittedLead(null);
    setValidationError(null);
  };

  // Progress Percentage
  const progressPercent =
    currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

  return (
    <div className="w-full max-w-[820px] mx-auto bg-[var(--bg)] text-[var(--ink)] rounded-3xl border-2 border-[#cca34c]/40 shadow-2xl p-6 sm:p-10 transition-all overflow-hidden relative">
      {/* Background Ambient Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00c48c]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#cca34c]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Visual Stepper Header */}
      <div className="relative z-10 mb-8 pb-6 border-b border-[var(--bd)]">
        {/* Progress Meta Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-[var(--mu)]">
              {currentStep < 4
                ? `Onboarding Step ${currentStep} of 3`
                : 'Onboarding 100% Completed'}
            </span>
          </div>
          <span className="text-xs font-mono font-black text-[#00c48c] bg-[#00c48c]/10 px-2.5 py-0.5 rounded-full border border-[#00c48c]/30">
            {progressPercent}% Complete
          </span>
        </div>

        {/* Dynamic Glowing Progress Line */}
        <div className="w-full bg-[var(--soft)] h-2 rounded-full overflow-hidden mb-6 relative">
          <div
            className="h-full bg-gradient-to-r from-[#00c48c] via-[#05df9d] to-[#cca34c] transition-all duration-500 ease-out rounded-full shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stepper Nodes */}
        <div className="grid grid-cols-3 gap-2 relative">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.number || currentStep === 4;
            const isActive = currentStep === step.number;

            return (
              <div
                key={step.number}
                className={`flex flex-col sm:flex-row items-center sm:items-start gap-2.5 p-2 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[#00c48c]/10 border border-[#00c48c]/40'
                    : isCompleted
                    ? 'opacity-90'
                    : 'opacity-50'
                }`}
              >
                {/* Numbered / Check Badge */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 transition-transform ${
                    isCompleted
                      ? 'bg-[#00c48c] text-white shadow-md shadow-[#00c48c]/30'
                      : isActive
                      ? 'bg-gradient-to-br from-[#cca34c] to-[#b8903c] text-[#070e24] shadow-md shadow-[#cca34c]/30 scale-105'
                      : 'bg-[var(--soft)] text-[var(--mu)] border border-[var(--bd)]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Step Labels */}
                <div className="text-center sm:text-left min-w-0">
                  <span
                    className={`block text-xs font-black truncate leading-tight ${
                      isActive
                        ? 'text-[#00c48c]'
                        : isCompleted
                        ? 'text-[var(--ink)]'
                        : 'text-[var(--mu)]'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="hidden sm:block text-[10px] text-[var(--mu)] truncate mt-0.5">
                    {step.sublabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center gap-2 animate-shake">
          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP 1: SERVICE & GOALS SELECTION */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[var(--ink)] tracking-tight">
              Select Your Growth Architecture
            </h3>
            <p className="text-xs sm:text-sm text-[var(--mu)] mt-1">
              Choose the primary engine you want Back for Brand to engineer for your business.
            </p>
          </div>

          {/* Interactive Service Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICE_OPTIONS.map((srv) => {
              const isSelected = selectedServiceId === srv.id;
              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left relative ${
                    isSelected
                      ? 'border-[#00c48c] bg-[#00c48c]/10 shadow-md shadow-[#00c48c]/15'
                      : 'border-[var(--bd)] bg-[var(--soft)]/50 hover:border-[#cca34c]/40 hover:bg-[var(--soft)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        isSelected
                          ? 'bg-[#00c48c] text-white border-[#00c48c]'
                          : 'bg-[var(--bg)] text-[#cca34c] border-[#cca34c]/30'
                      }`}
                    >
                      {srv.badge}
                    </span>
                    <span className="font-mono font-black text-xs text-[var(--ink)]">
                      ${srv.price.toLocaleString()}
                    </span>
                  </div>

                  <strong className="block text-xs sm:text-sm font-black text-[var(--ink)] mb-1">
                    {srv.title}
                  </strong>
                  <p className="text-[11px] text-[var(--mu)] leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Monthly Revenue Target Selection */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-[var(--ink)] mb-2">
              Current Target Monthly Revenue
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {REVENUE_TARGETS.map((target) => {
                const isTarget = revenueTarget === target;
                return (
                  <button
                    key={target}
                    type="button"
                    onClick={() => setRevenueTarget(target)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      isTarget
                        ? 'bg-[#070e24] text-[#cca34c] border-[#cca34c] shadow-sm'
                        : 'bg-[var(--soft)] text-[var(--mu)] border-[var(--bd)] hover:border-[#00c48c]/50'
                    }`}
                  >
                    {target}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 1 Footer Action */}
          <div className="pt-4 flex items-center justify-between border-t border-[var(--bd)]">
            <div className="text-xs text-[var(--mu)]">
              Selected: <b className="text-[var(--ink)]">{selectedServiceObj.title}</b>
            </div>
            <button
              type="button"
              onClick={handleNextFromStep1}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#00a876] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs sm:text-sm font-black shadow-md shadow-[#00c48c]/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Continue to Business Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BUSINESS DETAILS & BOTTLENECK */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[var(--ink)] tracking-tight">
              Tell Us About Your Brand &amp; Bottlenecks
            </h3>
            <p className="text-xs sm:text-sm text-[var(--mu)] mt-1">
              Help us customize your growth blueprint to your exact market and timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                Company / Brand Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Health Clinic"
                className="w-full text-sm px-4 py-2.5 rounded-xl border-2 border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[#00c48c] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                Current Website or Social (Optional)
              </label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="e.g. apexclinic.com or @apexhealth"
                className="w-full text-sm px-4 py-2.5 rounded-xl border-2 border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[#00c48c] transition-all"
              />
            </div>
          </div>

          {/* Primary Current Bottleneck */}
          <div>
            <label className="block text-xs font-bold text-[var(--ink)] mb-2">
              Primary Bottleneck You Need Solved
            </label>
            <div className="space-y-2">
              {BOTTLENECKS.map((b) => {
                const isSelected = selectedBottleneck === b;
                return (
                  <div
                    key={b}
                    onClick={() => setSelectedBottleneck(b)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-[#00c48c]/10 border-[#00c48c] text-[var(--ink)] font-bold'
                        : 'bg-[var(--soft)]/60 border-[var(--bd)] text-[var(--mu)] hover:border-[#cca34c]/50'
                    }`}
                  >
                    <span>{b}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'border-[#00c48c] bg-[#00c48c] text-white'
                          : 'border-[var(--bd)]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Target Launch Timeline */}
          <div>
            <label className="block text-xs font-bold text-[var(--ink)] mb-2">
              Target Launch Timeline
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIMELINES.map((t) => {
                const isSel = timeline === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTimeline(t.value)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      isSel
                        ? 'bg-[#070e24] text-[#cca34c] border-[#cca34c] shadow-sm'
                        : 'bg-[var(--soft)] text-[var(--mu)] border-[var(--bd)] hover:border-[#00c48c]/50'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 Footer Navigation */}
          <div className="pt-4 flex items-center justify-between border-t border-[var(--bd)]">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] hover:bg-[var(--bd)] text-xs font-bold text-[var(--ink)] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNextFromStep2}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#00a876] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs sm:text-sm font-black shadow-md shadow-[#00c48c]/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Continue to Contact Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONTACT & STRATEGY CALL */}
      {currentStep === 3 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[var(--ink)] tracking-tight">
              Executive Contact &amp; Strategy Session Slot
            </h3>
            <p className="text-xs sm:text-sm text-[var(--mu)] mt-1">
              Founder Ghazi Wazir and our conversion architects will review your project on a 15-minute Strategy Call.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Marcus Vance"
                className="w-full text-sm px-4 py-2.5 rounded-xl border-2 border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[#00c48c] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                Work Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marcus@vancegroup.com"
                className="w-full text-sm px-4 py-2.5 rounded-xl border-2 border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[#00c48c] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                WhatsApp or Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (305) 555-0199"
                className="w-full text-sm px-4 py-2.5 rounded-xl border-2 border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[#00c48c] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                Preferred Strategy Session Slot
              </label>
              <select
                value={bookingSlot}
                onChange={(e) => setBookingSlot(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border-2 border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold focus:outline-none focus:border-[#00c48c] transition-all"
              >
                {SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--ink)] mb-1">
              Specific Requirements or Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific questions, competitors you like, or existing tech stack..."
              rows={2}
              className="w-full text-sm px-4 py-2.5 rounded-xl border-2 border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[#00c48c] transition-all resize-none"
            />
          </div>

          {/* Step 3 Footer Navigation & Submit */}
          <div className="pt-4 flex items-center justify-between border-t border-[var(--bd)]">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] hover:bg-[var(--bd)] text-xs font-bold text-[var(--ink)] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00c48c] via-[#05df9d] to-[#cca34c] hover:from-[#00b07d] hover:to-[#b8903c] text-white text-xs sm:text-sm font-black shadow-lg shadow-[#00c48c]/30 flex items-center gap-2 cursor-pointer transition-all transform hover:scale-[1.01]"
            >
              <span>Complete Onboarding &amp; Claim Blueprint</span>
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: CONFIRMATION & BLUEPRINT CONFIRMED */}
      {currentStep === 4 && submittedLead && (
        <div className="space-y-6 text-center py-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00c48c] to-[#cca34c] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#00c48c]/30">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 text-xs font-black uppercase tracking-wider">
              Onboarding Completed (Lead #{submittedLead.id})
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[var(--ink)] tracking-tight mt-3">
              Growth Blueprint Reserved for {submittedLead.name}!
            </h3>
            <p className="text-xs sm:text-sm text-[var(--mu)] max-w-lg mx-auto mt-1">
              Your inquiry has been automatically qualified and scheduled into the{' '}
              <b className="text-[#00c48c]">Back for Brand Executive CRM</b>.
            </p>
          </div>

          {/* Lead Summary Card */}
          <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-[var(--bd)] pb-1.5">
              <span className="text-[var(--mu)]">Service Selected:</span>
              <span className="font-bold text-[var(--ink)]">{submittedLead.service}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--bd)] pb-1.5">
              <span className="text-[var(--mu)]">Estimated Value:</span>
              <span className="font-bold text-[#cca34c]">${submittedLead.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--bd)] pb-1.5">
              <span className="text-[var(--mu)]">Strategy Session:</span>
              <span className="font-bold text-[#00c48c]">{submittedLead.slot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--mu)]">Assigned Strategist:</span>
              <span className="font-bold text-[var(--ink)]">Ghazi Wazir (Founder)</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
            <button
              onClick={() => setCurrentView('machine')}
              className="px-5 py-3 rounded-xl bg-[#070e24] text-[#00c48c] border border-[#00c48c]/40 font-bold text-xs hover:bg-[#0c183a] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Inspect in Business Machine OS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/923001234567?text=${encodeURIComponent(`Hello Ghazi, I just completed onboarding on the website for ${submittedLead.service}. My name is ${submittedLead.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#00a876] hover:from-[#00b07d] hover:to-[#00875e] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>

          <button
            onClick={handleReset}
            className="text-xs text-[var(--mu)] underline hover:text-[#00c48c] pt-2 cursor-pointer inline-block"
          >
            Start another onboarding intake
          </button>
        </div>
      )}
    </div>
  );
};

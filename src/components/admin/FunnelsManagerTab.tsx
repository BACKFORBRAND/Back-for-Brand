import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  ServiceFunnel,
  FunnelPricingTier,
} from '../../types/index.ts';
import {
  Globe,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  Eye,
  Users,
  DollarSign,
  Tag,
  CheckCircle2,
  Layers,
  ArrowRight,
  Filter,
  X,
  Play,
  RotateCcw,
  CheckCheck,
  Rocket,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Code2,
  Share2,
  Monitor,
  Tablet,
  Smartphone,
  MessageSquare,
  FileSpreadsheet,
  Link2,
  LayoutTemplate,
} from 'lucide-react';

interface ServicePreset {
  category: string;
  name: string;
  badge: string;
  targetAudience: string;
  headline: string;
  subheadline: string;
  heroHighlight: string;
  accentColor: 'emerald' | 'gold' | 'blue' | 'purple' | 'orange';
  deliverables: string[];
  benefits: string[];
  pricingTiers: FunnelPricingTier[];
}

const SERVICE_PRESETS: ServicePreset[] = [
  {
    category: 'Consulting & Strategy',
    name: 'High-Ticket Advisory & Retainer Funnel',
    badge: 'B2B Advisory Engine',
    targetAudience: 'Management Consultants, Fractional Executives & B2B Advisory Firms',
    headline: 'Turn High-Intent Traffic Into Booked Consulting Retainers ($3k-$10k)',
    subheadline: 'Eliminate proposal chasing. High-authority conversion copy, autonomous WhatsApp qualifier, and direct calendar sync.',
    heroHighlight: '3.4x Higher Strategy Session Bookings',
    accentColor: 'gold',
    deliverables: [
      'Strategic conversion copywriting & executive layout',
      '24/7 Trilingual WhatsApp qualifier & appointment booking',
      'Direct Google Meet & calendar integration',
      'Executive CRM pipeline with deal value tracking',
    ],
    benefits: [
      'Attract enterprise decision-makers ready to invest',
      'Pre-qualify buyer budgets before getting on the phone',
      '100% full ownership of all domain assets and code',
    ],
    pricingTiers: [
      {
        id: 'tier-c1',
        name: 'Advisory Starter',
        price: 1200,
        description: 'Single high-authority funnel with calendar booking.',
        features: ['Custom 1-page authority funnel', 'Calendar booking sync', 'Lead nurture sequence', 'Mobile responsive'],
      },
      {
        id: 'tier-c2',
        name: 'Growth Retainer OS',
        price: 2800,
        description: 'Flagship system with WhatsApp AI and CRM pipeline.',
        features: ['Full conversion funnel & proposal room', 'Trilingual WhatsApp closer (<45s)', 'Connected CRM pipeline', 'Meta/Google ad setup'],
        recommended: true,
      },
      {
        id: 'tier-c3',
        name: 'Enterprise Advisory OS',
        price: 4800,
        description: 'Multi-service architecture for consulting partnerships.',
        features: ['Multi-funnel architecture for 3+ lines', 'Client intake portal & contract e-sign', 'Dedicated engineering sprint'],
      },
    ],
  },
  {
    category: 'Healthcare & Clinics',
    name: 'Patient Intake & Clinic Booking Funnel',
    badge: 'Healthcare & Aesthetic Clinics',
    targetAudience: 'Private Clinics, Dental Centers, Aesthetic Practices & Doctors',
    headline: 'Fill Practice Appointment Slots With Zero No-Shows On Autopilot',
    subheadline: 'Intelligent medical booking funnel and 24/7 WhatsApp concierge that triages patient needs, answers FAQs, and books confirmed slots.',
    heroHighlight: '< 45s Patient Response Time',
    accentColor: 'emerald',
    deliverables: [
      'High-converting patient booking landing page',
      'Automated intake questionnaire & triage flow',
      '24/7 WhatsApp patient assistant (FAQ + bookings)',
      'Automated 24h and 1h SMS/WhatsApp reminders',
    ],
    benefits: [
      'Virtually eliminate costly patient no-shows',
      'Free up front-desk staff from answering repetitive questions',
      'Capture after-hours and weekend patient inquiries instantly',
    ],
    pricingTiers: [
      {
        id: 'tier-cl1',
        name: 'Clinic Launch',
        price: 800,
        description: 'Essential automated appointment booking for practices.',
        features: ['Mobile-optimized booking page', 'Google Calendar integration', 'Automated reminders'],
      },
      {
        id: 'tier-cl2',
        name: 'Premier Practice OS',
        price: 1800,
        description: 'Complete patient acquisition with 24/7 WhatsApp AI receptionist.',
        features: ['Multi-doctor booking calendar', 'WhatsApp AI receptionist (EN/AR/UR)', 'Deposit payment integration (Stripe)', 'No-show recovery automation'],
        recommended: true,
      },
      {
        id: 'tier-cl3',
        name: 'Hospital / Multi-Branch',
        price: 3500,
        description: 'Enterprise healthcare solution for medical groups.',
        features: ['Multi-location doctor routing', 'EHR/EMR webhook integration', 'HIPAA/GDPR compliance layout'],
      },
    ],
  },
  {
    category: 'E-Commerce & DTC',
    name: 'High-AOV E-Commerce & 1-Click Upsell Funnel',
    badge: 'E-Commerce & DTC Brands',
    targetAudience: 'Online Retailers, DTC Brands & High-Growth Shopify Stores',
    headline: 'Skyrocket Average Order Value (AOV) With Frictionless 1-Click Upsells',
    subheadline: 'Sub-second loading sales pages, post-purchase order bumps, and automated WhatsApp abandoned cart recovery.',
    heroHighlight: '+38% Higher Cart Value',
    accentColor: 'purple',
    deliverables: [
      'Conversion-optimized custom product sales page',
      'Post-purchase 1-click upsell and downsell architecture',
      'Abandoned cart recovery via automated WhatsApp & email',
      'Stripe, Apple Pay & PayPal multi-currency checkout',
    ],
    benefits: [
      'Boost customer lifetime value without increasing ad spend',
      'Recover up to 28% of abandoned shopping carts',
      'Sub-second page speeds that improve Meta ad ROAS',
    ],
    pricingTiers: [
      {
        id: 'tier-ec1',
        name: 'Hero Product Funnel',
        price: 1500,
        description: 'Single high-converting hero product page with order bump.',
        features: ['High-speed product page', '1-click post-purchase upsell', 'Stripe checkout integration'],
      },
      {
        id: 'tier-ec2',
        name: 'Scale & ROAS Accelerator',
        price: 2900,
        description: 'Complete e-commerce sales engine with WhatsApp cart recovery.',
        features: ['Full funnel with upsells & downsells', 'WhatsApp & email cart abandonment', 'Meta Ads CAPI tracking', 'AOV multiplier consulting'],
        recommended: true,
      },
      {
        id: 'tier-ec3',
        name: 'Omnichannel Brand OS',
        price: 5200,
        description: 'Enterprise multi-sku checkout architecture.',
        features: ['Multi-currency international checkout', 'ERP/Inventory sync webhooks', 'VIP customer loyalty automation'],
      },
    ],
  },
  {
    category: 'SaaS & Digital Products',
    name: 'B2B SaaS Free Trial-to-Paid Growth Engine',
    badge: 'SaaS & Web Applications',
    targetAudience: 'Software Founders, Tech Startups & SaaS Products',
    headline: 'Accelerate SaaS Free Trial-to-Paid Conversions On Autopilot',
    subheadline: 'Explain technical value fast, guide users to an Aha! moment, and automate activation email sequences.',
    heroHighlight: '42% Higher Activation Rate',
    accentColor: 'blue',
    deliverables: [
      'Interactive product feature showcase & UX wireframes',
      'Frictionless free trial signup & onboarding flow',
      'Usage-triggered email nurture and trial expiry countdown',
      'Tiered pricing matrix with monthly/annual billing toggle',
    ],
    benefits: [
      'Shorten user time-to-value with clear visual walkthroughs',
      'Prevent trial churn with automated product engagement alerts',
      'Clean developer-friendly API integration endpoints',
    ],
    pricingTiers: [
      {
        id: 'tier-saas1',
        name: 'Seed SaaS Launch',
        price: 2200,
        description: 'For early-stage software products validating product-market fit.',
        features: ['Product landing page with demo embeds', 'Free trial signup webhook', 'Welcome email sequence'],
      },
      {
        id: 'tier-saas2',
        name: 'Scale & MRR Multiplier',
        price: 4500,
        description: 'Complete acquisition and activation engine for SaaS.',
        features: ['Interactive product tour & pricing matrix', 'Automated onboarding drip', 'Stripe Billing setup', 'Full CRM pipeline sync'],
        recommended: true,
      },
      {
        id: 'tier-saas3',
        name: 'Enterprise Cloud System',
        price: 8000,
        description: 'Full-stack application development & RBAC security.',
        features: ['Custom web app engineering (React/Node)', 'Role-based access & zero-trust security', 'PostgreSQL database backend'],
      },
    ],
  },
  {
    category: 'AI Agents & Automation',
    name: '24/7 Trilingual WhatsApp AI Closer Funnel',
    badge: 'Autonomous AI Sales Rep',
    targetAudience: 'Real Estate Brokers, Agencies, High-Ticket Service Providers',
    headline: 'Deploy a 24/7 WhatsApp AI Closer That Qualifies & Books High-Ticket Clients',
    subheadline: 'Conversational sales agent responding in English, Arabic, and Urdu in under 45 seconds, pushing qualified appointments into your Google Calendar.',
    heroHighlight: 'Sub-45s WhatsApp Response',
    accentColor: 'emerald',
    deliverables: [
      'Custom-trained WhatsApp AI knowledge model',
      'Trilingual qualification logic (Budget, Need, Urgency)',
      'Direct CRM lead scoring & stage auto-advancement',
      'Stripe deposit checkout via WhatsApp chat link',
    ],
    benefits: [
      'Never lose another customer who inquires at 2:00 AM',
      'Eliminate 80% of routine qualification call overhead',
      'Engage international prospects in their native language',
    ],
    pricingTiers: [
      {
        id: 'tier-ai1',
        name: 'AI Agent Starter',
        price: 1100,
        description: 'Single-number WhatsApp AI qualification bot.',
        features: ['Official WhatsApp Cloud API setup', 'Knowledge base training on your business', 'English & Arabic support'],
      },
      {
        id: 'tier-ai2',
        name: 'Autonomous Closer OS',
        price: 2600,
        description: 'Full sales closer bot with calendar sync & CRM pipeline.',
        features: ['Trilingual AI (English, Arabic, Urdu)', 'Direct Google Calendar booking sync', 'Lead qualification scoring', 'Real-time human takeover alert'],
        recommended: true,
      },
      {
        id: 'tier-ai3',
        name: 'Enterprise Multi-Number Agency',
        price: 4900,
        description: 'Multi-agent routing for high-volume sales teams.',
        features: ['Multiple WhatsApp numbers routing', 'Custom CRM / Webhook integration', 'Voice note audio transcription & reply'],
      },
    ],
  },
];

export const FunnelsManagerTab: React.FC = () => {
  const {
    funnels,
    addFunnel,
    updateFunnel,
    toggleFunnelPublished,
    deleteFunnel,
    duplicateFunnel,
    setActiveFunnelId,
    setCurrentView,
    setMachineTab,
    addLead,
    baseUrl,
  } = useBusiness();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingFunnelId, setEditingFunnelId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Integration Modal State
  const [integrationFunnel, setIntegrationFunnel] = useState<ServiceFunnel | null>(null);
  const [integrationTab, setIntegrationTab] = useState<'url' | 'iframe' | 'widget' | 'whatsapp' | 'webhook'>('url');
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  // Device Preview Modal State
  const [previewFunnel, setPreviewFunnel] = useState<ServiceFunnel | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Consulting & Strategy');
  const [targetAudience, setTargetAudience] = useState('');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [heroHighlight, setHeroHighlight] = useState('3.4x Higher Conversion');
  const [badge, setBadge] = useState('High-Converting Funnel');
  const [ctaText, setCtaText] = useState('Claim Free Growth Plan');
  const [accentColor, setAccentColor] = useState<'emerald' | 'gold' | 'blue' | 'purple' | 'orange'>('emerald');
  const [deliverableInput, setDeliverableInput] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([
    'Custom conversion copywriting & wireframing',
    '24/7 Trilingual WhatsApp lead qualification',
    'Google Calendar direct appointment sync',
  ]);
  const [benefitInput, setBenefitInput] = useState('');
  const [benefits, setBenefits] = useState<string[]>([
    'Convert cold traffic into qualified buyers',
    'Zero manual data entry or lead leakage',
  ]);
  const [published, setPublished] = useState(true);
  const [pricingTiers, setPricingTiers] = useState<FunnelPricingTier[]>([
    {
      id: 'tier-1',
      name: 'Launch Tier',
      price: 950,
      description: 'Essential landing page and lead capture flow.',
      features: ['Conversion landing page', 'Email capture sequence', 'Mobile responsive'],
    },
    {
      id: 'tier-2',
      name: 'Growth Engine',
      price: 2400,
      description: 'Complete sales funnel with WhatsApp AI closer and CRM pipeline.',
      features: ['Full conversion funnel', '24/7 WhatsApp AI closer', 'Connected CRM', 'Ad tracking'],
      recommended: true,
    },
  ]);

  // Aggregate stats across all funnels
  const totalVisits = funnels.reduce((sum, f) => sum + (f.visits || 0), 0);
  const totalLeads = funnels.reduce((sum, f) => sum + (f.leads || 0), 0);
  const totalWon = funnels.reduce((sum, f) => sum + (f.won || 0), 0);
  const avgConversion = totalVisits > 0 ? ((totalWon / totalVisits) * 100).toFixed(1) : '0';

  // Categories list
  const categories = Array.from(new Set(funnels.map((f) => f.serviceCategory)));

  // Filtered funnels
  const filteredFunnels = funnels.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = filterCategory === 'all' || f.serviceCategory === filterCategory;
    const matchStatus = filterStatus === 'all' || f.status === filterStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  const originUrl = (baseUrl || window.location.origin || 'https://backforbrand.com').replace(/\/$/, '');

  const generateFunnelUrl = (funnelSlug: string) => {
    return `${originUrl}/?funnel=${funnelSlug}`;
  };

  const handleCopyLink = (funnelSlug: string) => {
    const url = generateFunnelUrl(funnelSlug);
    try {
      navigator.clipboard.writeText(url);
      setCopiedSlug(funnelSlug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleLaunchPublicView = (funnel: ServiceFunnel) => {
    setActiveFunnelId(funnel.slug);
    setCurrentView('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyPreset = (preset: ServicePreset) => {
    setName(preset.name);
    setSlug(preset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    setServiceCategory(preset.category);
    setBadge(preset.badge);
    setTargetAudience(preset.targetAudience);
    setHeadline(preset.headline);
    setSubheadline(preset.subheadline);
    setHeroHighlight(preset.heroHighlight);
    setAccentColor(preset.accentColor);
    setDeliverables([...preset.deliverables]);
    setBenefits([...preset.benefits]);
    setPricingTiers(JSON.parse(JSON.stringify(preset.pricingTiers)));
  };

  const handleOpenCreate = () => {
    setEditingFunnelId(null);
    setName('');
    setSlug('');
    setServiceCategory('Consulting & Strategy');
    setTargetAudience('');
    setHeadline('');
    setSubheadline('');
    setHeroHighlight('3.4x Higher Conversion');
    setBadge('High-Converting Funnel');
    setCtaText('Claim Free Growth Plan');
    setAccentColor('emerald');
    setDeliverables([
      'Strategic conversion copywriting & design',
      '24/7 AI WhatsApp Closer & Lead Qualifier',
      'Direct Calendar Appointment Sync',
    ]);
    setBenefits([
      'Convert clicks into high-ticket clients',
      'Zero lead leakage or manual scheduling delay',
    ]);
    setPricingTiers([
      {
        id: 'tier-1',
        name: 'Starter Funnel',
        price: 1100,
        description: 'Single high-converting landing page with lead sequence.',
        features: ['Conversion copy', 'Fast page speeds', 'Email notification'],
      },
      {
        id: 'tier-2',
        name: 'Growth Machine',
        price: 2600,
        description: 'Complete multi-step funnel with WhatsApp automation and CRM.',
        features: ['Full funnel flow', '24/7 WhatsApp AI', 'CRM pipeline sync', 'Meta/Google ad setup'],
        recommended: true,
      },
    ]);
    setPublished(true);
    setShowModal(true);
  };

  const handleOpenEdit = (funnel: ServiceFunnel) => {
    setEditingFunnelId(funnel.id);
    setName(funnel.name);
    setSlug(funnel.slug);
    setServiceCategory(funnel.serviceCategory);
    setTargetAudience(funnel.targetAudience);
    setHeadline(funnel.headline);
    setSubheadline(funnel.subheadline);
    setHeroHighlight(funnel.heroHighlight);
    setBadge(funnel.badge);
    setCtaText(funnel.ctaText);
    setAccentColor(funnel.accentColor);
    setDeliverables([...funnel.deliverables]);
    setBenefits([...funnel.benefits]);
    setPricingTiers(JSON.parse(JSON.stringify(funnel.pricingTiers)));
    setPublished(funnel.published);
    setShowModal(true);
  };

  const handleAddDeliverable = () => {
    if (deliverableInput.trim()) {
      setDeliverables([...deliverables, deliverableInput.trim()]);
      setDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (idx: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const handleSaveFunnel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const payload = {
      name: name.trim(),
      slug: formattedSlug,
      serviceCategory,
      targetAudience: targetAudience.trim(),
      headline: headline.trim(),
      subheadline: subheadline.trim(),
      heroHighlight,
      badge,
      ctaText,
      accentColor,
      deliverables,
      benefits,
      pricingTiers,
      faqItems: [
        {
          question: `How does the ${serviceCategory} funnel work?`,
          answer: `We architect conversion copy, deploy 24/7 WhatsApp AI qualification, and sync bookings straight to your CRM.`,
        },
      ],
      published,
      status: published ? ('active' as const) : ('draft' as const),
    };

    if (editingFunnelId) {
      updateFunnel(editingFunnelId, payload);
    } else {
      addFunnel(payload);
    }

    setShowModal(false);
  };

  const handleSimulateFunnelLead = (funnel: ServiceFunnel) => {
    const mockLeadName = `${funnel.serviceCategory.split(' ')[0]} Prospect ${Math.floor(Math.random() * 80 + 10)}`;
    const randomTier = funnel.pricingTiers[Math.floor(Math.random() * funnel.pricingTiers.length)];

    addLead({
      name: mockLeadName,
      company: `${funnel.serviceCategory.split(' ')[0]} Corp`,
      email: `${mockLeadName.toLowerCase().replace(/\s+/g, '')}@client.com`,
      phone: '923' + Math.floor(100000000 + Math.random() * 900000000),
      src: `${funnel.name}`,
      stage: 'Won',
      val: randomTier?.price || 1500,
      need: `${funnel.name} (${randomTier?.name || 'Growth Plan'})`,
      message: `Inbound customer converted through public funnel: ${funnel.name}`,
    });
  };

  const getAccentBadge = (color: string) => {
    switch (color) {
      case 'gold':
        return 'text-[#cca34c] bg-[#cca34c]/15 border-[#cca34c]/30';
      case 'blue':
        return 'text-blue-500 bg-blue-500/15 border-blue-400/30';
      case 'purple':
        return 'text-purple-500 bg-purple-500/15 border-purple-400/30';
      case 'orange':
        return 'text-orange-500 bg-orange-500/15 border-orange-400/30';
      default:
        return 'text-[#00c48c] bg-[#00c48c]/15 border-[#00c48c]/30';
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedCodeKey(key);
      setTimeout(() => setCopiedCodeKey(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#070e24] via-[#0c183a] to-[#070e24] text-white p-6 sm:p-8 border border-[#cca34c]/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c48c]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#cca34c]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#00c48c]/15 border border-[#00c48c]/35 text-[#00c48c] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Globe className="w-3.5 h-3.5 text-[#00c48c]" />
                <span>Multi-Funnel Architecture</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#cca34c]/20 border border-[#cca34c]/40 text-[#cca34c] text-xs font-bold">
                Multiple Landing Pages &amp; Different Services
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Service Funnels &amp; Landing Page Hub
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/75 max-w-2xl leading-relaxed">
              Create, integrate, and sell different services (Consulting, Clinic Bookings, E-Commerce Upsell, SaaS Onboarding, and AI Agents) with dedicated high-converting funnels, embed codes, and CRM attribution.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setMachineTab('Template Gallery')}
              className="px-4 py-2.5 rounded-xl bg-[#cca34c]/20 hover:bg-[#cca34c]/30 border border-[#cca34c]/50 text-[#ffd84d] text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer"
              title="Select from pre-built high-converting funnel architectures"
            >
              <LayoutTemplate className="w-4 h-4 text-[#cca34c]" />
              <span>Browse Template Gallery</span>
            </button>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-[#00c48c]/30 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create Custom Funnel</span>
            </button>
            <button
              onClick={() => {
                setActiveFunnelId(null);
                setCurrentView('public');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="View Public Master Portal"
            >
              <Globe className="w-4 h-4 text-[#cca34c]" />
              <span>Master Public Site</span>
            </button>
          </div>
        </div>

        {/* Telemetry Strip across multiple funnels */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Active Funnels
            </span>
            <span className="text-2xl font-black text-white">
              {funnels.length} <span className="text-xs font-normal text-emerald-100/60">Dedicated Pages</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Combined Traffic
            </span>
            <span className="text-2xl font-black text-[#00c48c]">
              {totalVisits.toLocaleString()} <span className="text-xs font-normal text-emerald-100/60">Visits</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Inbound Leads Captured
            </span>
            <span className="text-2xl font-black text-white">
              {totalLeads} Leads
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Funnel Conversion Rate
            </span>
            <span className="text-2xl font-black text-[#cca34c]">
              {avgConversion}%
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search funnels by service or headline..."
            className="w-full text-xs pl-3.5 pr-8 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[#00c48c]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--ink)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[var(--mu)] font-bold hidden sm:inline">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold focus:outline-none focus:border-[#00c48c]"
            >
              <option value="all">All Service Lines ({funnels.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[var(--mu)] font-bold hidden sm:inline">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold focus:outline-none focus:border-[#00c48c]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active &amp; Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Funnels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFunnels.map((funnel) => {
          const isCopied = copiedSlug === funnel.slug;
          const accentBadgeClass = getAccentBadge(funnel.accentColor);

          return (
            <div
              key={funnel.id}
              className={`rounded-3xl border transition-all p-6 sm:p-7 shadow-sm flex flex-col justify-between ${
                funnel.published
                  ? 'bg-[var(--card)] border-[var(--bd)] hover:border-[#00c48c]/50 hover:shadow-md'
                  : 'bg-[var(--soft)]/50 border-[var(--bd)]/60 opacity-75'
              }`}
            >
              <div>
                {/* Header: Badge, Category & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider border ${accentBadgeClass}`}>
                      {funnel.badge}
                    </span>
                    <span className="text-xs font-bold text-[var(--mu)]">
                      {funnel.serviceCategory}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleFunnelPublished(funnel.id)}
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border cursor-pointer transition-colors ${
                        funnel.published
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-300'
                      }`}
                      title="Toggle publish status"
                    >
                      {funnel.published ? 'LIVE ON SITE' : 'DRAFT'}
                    </button>
                  </div>
                </div>

                {/* Funnel Title & Target Audience */}
                <h3 className="text-lg font-black text-[var(--ink)] tracking-tight mb-1">
                  {funnel.name}
                </h3>
                <span className="text-xs font-semibold text-[#00a876] dark:text-[#20d89f] block mb-3">
                  Target: {funnel.targetAudience}
                </span>

                {/* Headline Preview */}
                <div className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] text-xs mb-4">
                  <strong className="block text-[var(--ink)] font-bold text-xs leading-snug mb-1">
                    &quot;{funnel.headline}&quot;
                  </strong>
                  <p className="text-[11px] text-[var(--mu)] line-clamp-2 leading-relaxed">
                    {funnel.subheadline}
                  </p>
                </div>

                {/* Key Deliverables Pills */}
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-bold text-[var(--mu)] uppercase tracking-wider block">
                    Core Deliverables Included:
                  </span>
                  <div className="space-y-1 text-xs">
                    {funnel.deliverables.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-[var(--ink)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00c48c] flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Tiers summary */}
                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[var(--bg)] border border-[var(--bd)] mb-4">
                  <span className="text-[var(--mu)] font-medium">Pricing Tiers:</span>
                  <div className="flex items-center gap-2 font-bold text-[var(--ink)]">
                    {funnel.pricingTiers.map((tier) => (
                      <span key={tier.id} className="font-mono text-[11px] bg-[var(--soft)] px-2 py-0.5 rounded border border-[var(--bd)]">
                        ${tier.price.toLocaleString()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics Bar */}
                <div className="grid grid-cols-4 gap-2 text-center p-2.5 rounded-2xl bg-[var(--soft)]/50 border border-[var(--bd)] mb-4 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-[var(--mu)] uppercase block">Visits</span>
                    <b className="text-[var(--ink)] font-black text-xs">{funnel.visits.toLocaleString()}</b>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[var(--mu)] uppercase block">Leads</span>
                    <b className="text-[#00c48c] font-black text-xs">{funnel.leads}</b>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[var(--mu)] uppercase block">Won</span>
                    <b className="text-[#cca34c] font-black text-xs">{funnel.won}</b>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[var(--mu)] uppercase block">Conv %</span>
                    <b className="text-[var(--ink)] font-black text-xs">
                      {funnel.visits > 0 ? ((funnel.won / funnel.visits) * 100).toFixed(1) : '0'}%
                    </b>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-4 border-t border-[var(--bd)] flex flex-col gap-3 text-xs">
                {/* Row 1: Integration & Embed Tools */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {/* Integrate & Embed Modal Button */}
                    <button
                      onClick={() => setIntegrationFunnel(funnel)}
                      className="px-3 py-1.5 rounded-xl border border-[#00c48c]/40 bg-[#00c48c]/10 hover:bg-[#00c48c]/20 text-[#00a876] dark:text-[#20d89f] font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      title="Get embed code, iframe, widget & Webhooks"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Integrate &amp; Embed</span>
                    </button>

                    {/* Preview in Device Frames */}
                    <button
                      onClick={() => setPreviewFunnel(funnel)}
                      className="p-1.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] hover:bg-[var(--bd)] text-[var(--ink)] transition-colors cursor-pointer"
                      title="Multi-Device Preview (Desktop, Tablet, Mobile)"
                    >
                      <Eye className="w-4 h-4 text-[#cca34c]" />
                    </button>

                    {/* Duplicate Funnel */}
                    <button
                      onClick={() => duplicateFunnel(funnel.id)}
                      className="p-1.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] hover:bg-[var(--bd)] text-[var(--mu)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                      title="Duplicate this funnel for a new client/service"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Simulate Lead */}
                    <button
                      onClick={() => handleSimulateFunnelLead(funnel)}
                      className="p-1.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] hover:bg-[var(--bd)] text-[var(--mu)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                      title="Simulate an inbound lead for this funnel"
                    >
                      <Sparkles className="w-4 h-4 text-[#00c48c]" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(funnel)}
                      className="p-1.5 rounded-xl border border-[var(--bd)] text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--soft)] transition-colors cursor-pointer"
                      title="Edit Funnel Content & Pricing"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete service funnel "${funnel.name}"?`)) {
                          deleteFunnel(funnel.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Delete Funnel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Row 2: Copy URL & Launch Live Page */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--bd)]/60">
                  <button
                    onClick={() => handleCopyLink(funnel.slug)}
                    className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-[var(--soft)] hover:bg-[var(--bd)] text-[var(--ink)] border-[var(--bd)]'
                    }`}
                    title="Copy direct funnel URL"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Link Copied!' : 'Copy Direct URL'}</span>
                  </button>

                  <button
                    onClick={() => handleLaunchPublicView(funnel)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-[#00c48c]/25 cursor-pointer whitespace-nowrap"
                  >
                    <span>View Dedicated Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT FUNNEL MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl rounded-3xl bg-[var(--bg)] border-2 border-[#cca34c]/40 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
              <div>
                <h3 className="text-lg font-black text-[var(--ink)] flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#00c48c]" />
                  <span>
                    {editingFunnelId ? 'Edit Service Funnel & Page' : 'Create New Service Funnel & Landing Page'}
                  </span>
                </h3>
                <p className="text-xs text-[var(--mu)]">
                  Configure custom landing page headline, deliverables, pricing tiers, and public URL slug.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Preset Selector */}
            {!editingFunnelId && (
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#cca34c] block">
                  ⚡ 1-Click Load Service Template:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="px-2.5 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--card)] hover:border-[#00c48c] text-[11px] font-bold text-[var(--ink)] transition-colors cursor-pointer"
                    >
                      {p.category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveFunnel} className="space-y-5 text-xs">
              {/* Row 1: Funnel Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Funnel Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingFunnelId && !slug) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="e.g. Clinic Patient Booking Funnel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Custom URL Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="px-2.5 py-2.5 rounded-l-xl bg-[var(--bd)]/50 text-[var(--mu)] text-[10px] font-mono border border-r-0 border-[var(--bd)]">
                      /?funnel=
                    </span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="e.g. clinic-booking"
                      className="w-full px-3 py-2.5 rounded-r-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Service Category & Accent Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Service Line Category
                  </label>
                  <input
                    type="text"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    placeholder="e.g. Healthcare & Clinics"
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Accent Color Theme
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {(['emerald', 'gold', 'blue', 'purple', 'orange'] as const).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAccentColor(color)}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                          accentColor === color ? 'scale-125 border-white shadow-md' : 'border-transparent'
                        }`}
                        style={{
                          backgroundColor:
                            color === 'emerald'
                              ? '#00c48c'
                              : color === 'gold'
                              ? '#cca34c'
                              : color === 'blue'
                              ? '#3b82f6'
                              : color === 'purple'
                              ? '#a855f7'
                              : '#f97316',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">
                  Target Audience / Niche *
                </label>
                <input
                  type="text"
                  required
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Private Clinics, Dental Centers & Medical Practices"
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                />
              </div>

              {/* Headline & Subheadline */}
              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">
                  Page Headline (High-Converting Hook) *
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Fill Practice Appointment Slots With Zero No-Shows On Autopilot"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">
                  Subheadline / Offer Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  placeholder="Briefly explain the transformation your service provides..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                />
              </div>

              {/* Hero Highlight & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Hero Proof Highlight
                  </label>
                  <input
                    type="text"
                    value={heroHighlight}
                    onChange={(e) => setHeroHighlight(e.target.value)}
                    placeholder="e.g. < 45s Patient Response Time"
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Healthcare & Clinics"
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                  />
                </div>
              </div>

              {/* Deliverables Manager */}
              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">
                  Deliverables Checklist
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDeliverable())}
                    placeholder="Add a deliverable and press Enter..."
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-3 py-1.5 rounded-xl bg-[var(--bd)] font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-[var(--soft)] text-xs"
                    >
                      <span>✓ {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="text-red-400 hover:text-red-600 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Tiers */}
              <div>
                <label className="block font-bold text-[var(--ink)] mb-2">
                  Pricing Tiers ({pricingTiers.length})
                </label>
                <div className="space-y-3">
                  {pricingTiers.map((tier, idx) => (
                    <div
                      key={tier.id}
                      className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => {
                            const updated = [...pricingTiers];
                            updated[idx].name = e.target.value;
                            setPricingTiers(updated);
                          }}
                          placeholder="Tier Name"
                          className="px-2.5 py-1 rounded-lg border border-[var(--bd)] bg-[var(--bg)] font-bold"
                        />
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => {
                            const updated = [...pricingTiers];
                            updated[idx].price = Number(e.target.value);
                            setPricingTiers(updated);
                          }}
                          placeholder="Price ($)"
                          className="px-2.5 py-1 rounded-lg border border-[var(--bd)] bg-[var(--bg)] font-mono font-bold"
                        />
                        <label className="flex items-center gap-1.5 text-[11px] font-bold">
                          <input
                            type="checkbox"
                            checked={tier.recommended || false}
                            onChange={(e) => {
                              const updated = pricingTiers.map((t, i) => ({
                                ...t,
                                recommended: i === idx ? e.target.checked : false,
                              }));
                              setPricingTiers(updated);
                            }}
                          />
                          <span>Recommended</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={tier.description}
                        onChange={(e) => {
                          const updated = [...pricingTiers];
                          updated[idx].description = e.target.value;
                          setPricingTiers(updated);
                        }}
                        placeholder="Short description..."
                        className="w-full px-2.5 py-1 rounded-lg border border-[var(--bd)] bg-[var(--bg)] text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Published Switch */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--bd)]">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00c48c]"
                  />
                  <span>Publish and activate on public site immediately</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--bd)] font-bold text-[var(--mu)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] text-white font-black"
                  >
                    {editingFunnelId ? 'Save Changes' : 'Create Service Funnel'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTEGRATION & EMBED MODAL */}
      {integrationFunnel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[var(--bg)] border-2 border-[#cca34c]/40 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
              <div>
                <h3 className="text-lg font-black text-[var(--ink)] flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[#00c48c]" />
                  <span>Integration &amp; Embed Suite</span>
                </h3>
                <p className="text-xs text-[var(--mu)]">
                  Embed or link <strong>{integrationFunnel.name}</strong> onto any external website, social bio, or CRM webhook.
                </p>
              </div>
              <button
                onClick={() => setIntegrationFunnel(null)}
                className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab buttons */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-[var(--bd)] pb-3 text-xs font-bold">
              <button
                onClick={() => setIntegrationTab('url')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  integrationTab === 'url' ? 'bg-[#00c48c] text-white' : 'bg-[var(--soft)] text-[var(--mu)]'
                }`}
              >
                Direct Public URL
              </button>
              <button
                onClick={() => setIntegrationTab('iframe')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  integrationTab === 'iframe' ? 'bg-[#00c48c] text-white' : 'bg-[var(--soft)] text-[var(--mu)]'
                }`}
              >
                Website Iframe Embed
              </button>
              <button
                onClick={() => setIntegrationTab('widget')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  integrationTab === 'widget' ? 'bg-[#00c48c] text-white' : 'bg-[var(--soft)] text-[var(--mu)]'
                }`}
              >
                Floating Sales Widget
              </button>
              <button
                onClick={() => setIntegrationTab('whatsapp')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  integrationTab === 'whatsapp' ? 'bg-[#00c48c] text-white' : 'bg-[var(--soft)] text-[var(--mu)]'
                }`}
              >
                WhatsApp Direct Link
              </button>
              <button
                onClick={() => setIntegrationTab('webhook')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  integrationTab === 'webhook' ? 'bg-[#00c48c] text-white' : 'bg-[var(--soft)] text-[var(--mu)]'
                }`}
              >
                Inbound Webhook
              </button>
            </div>

            {/* Tab: Direct URL */}
            {integrationTab === 'url' && (
              <div className="space-y-4 text-xs">
                <p className="text-[var(--mu)] leading-relaxed">
                  Share this dedicated URL on your Google Ads, Meta Ads, social media bio, or email newsletters. Traffic lands directly on this service page.
                </p>
                <div className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] flex items-center justify-between gap-3">
                  <span className="font-mono font-bold text-[var(--ink)] truncate text-xs">
                    {generateFunnelUrl(integrationFunnel.slug)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(generateFunnelUrl(integrationFunnel.slug), 'url')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white font-black text-xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                  >
                    {copiedCodeKey === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeKey === 'url' ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => handleLaunchPublicView(integrationFunnel)}
                    className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--bd)] font-bold text-[var(--ink)] flex items-center gap-1.5 hover:border-[#00c48c] cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#00c48c]" />
                    <span>Open Live Page in New View</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Iframe Embed */}
            {integrationTab === 'iframe' && (
              <div className="space-y-3 text-xs">
                <p className="text-[var(--mu)] leading-relaxed">
                  Paste this responsive HTML code into your WordPress, Shopify, Webflow, or Squarespace page:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30">
{`<!-- Back for Brand Funnel Embed: ${integrationFunnel.name} -->
<iframe
  src="${generateFunnelUrl(integrationFunnel.slug)}"
  width="100%"
  height="900"
  style="border: none; border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.12);"
  allow="payment; camera; microphone"
  loading="lazy"
></iframe>`}
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `<iframe src="${generateFunnelUrl(integrationFunnel.slug)}" width="100%" height="900" style="border:none;border-radius:20px;box-shadow:0 12px 40px rgba(0,0,0,0.12);" allow="payment" loading="lazy"></iframe>`,
                        'iframe'
                      )
                    }
                    className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5"
                  >
                    {copiedCodeKey === 'iframe' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeKey === 'iframe' ? 'Copied' : 'Copy Iframe'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Floating Widget */}
            {integrationTab === 'widget' && (
              <div className="space-y-3 text-xs">
                <p className="text-[var(--mu)] leading-relaxed">
                  Inject a floating booking button on your website that expands this service funnel in a slide-out drawer:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30">
{`<!-- Back for Brand Floating Sales Widget -->
<script
  src="${originUrl}/embed.js"
  data-funnel="${integrationFunnel.slug}"
  data-accent="${integrationFunnel.accentColor}"
  data-cta="${encodeURIComponent(integrationFunnel.ctaText)}"
  data-position="bottom-right"
  async
></script>`}
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `<script src="${originUrl}/embed.js" data-funnel="${integrationFunnel.slug}" data-accent="${integrationFunnel.accentColor}" data-position="bottom-right" async></script>`,
                        'widget'
                      )
                    }
                    className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5"
                  >
                    {copiedCodeKey === 'widget' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeKey === 'widget' ? 'Copied' : 'Copy Widget'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab: WhatsApp Link */}
            {integrationTab === 'whatsapp' && (
              <div className="space-y-3 text-xs">
                <p className="text-[var(--mu)] leading-relaxed">
                  Click-to-chat WhatsApp deep link with this service pre-filled for immediate mobile lead qualification:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30">
{`https://wa.me/923331112223?text=${encodeURIComponent(
  `Hi Back for Brand! I would like to inquire about "${integrationFunnel.name}" (${integrationFunnel.serviceCategory}).`
)}`}
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `https://wa.me/923331112223?text=${encodeURIComponent(
                          `Hi Back for Brand! I would like to inquire about "${integrationFunnel.name}" (${integrationFunnel.serviceCategory}).`
                        )}`,
                        'wa'
                      )
                    }
                    className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5"
                  >
                    {copiedCodeKey === 'wa' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeKey === 'wa' ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Webhook */}
            {integrationTab === 'webhook' && (
              <div className="space-y-3 text-xs">
                <p className="text-[var(--mu)] leading-relaxed">
                  Inbound Webhook endpoint to sync leads from Zapier, Make, Typeform, or external forms directly into this funnel&apos;s CRM pipeline:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30">
{`POST ${originUrl}/api/funnels/${integrationFunnel.slug}/inbound-lead
Content-Type: application/json

{
  "name": "Alex Carter",
  "email": "alex@client.com",
  "phone": "+1 415 555 0199",
  "company": "Carter Enterprises",
  "dealValue": ${integrationFunnel.pricingTiers[0]?.price || 1500},
  "tier": "${integrationFunnel.pricingTiers[0]?.name || 'Growth'}"
}`}
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${originUrl}/api/funnels/${integrationFunnel.slug}/inbound-lead`,
                        'wh'
                      )
                    }
                    className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5"
                  >
                    {copiedCodeKey === 'wh' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeKey === 'wh' ? 'Copied' : 'Copy Endpoint'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[var(--bd)] flex items-center justify-end">
              <button
                onClick={() => setIntegrationFunnel(null)}
                className="px-5 py-2 rounded-xl bg-[var(--soft)] hover:bg-[var(--bd)] text-xs font-bold text-[var(--ink)] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-DEVICE PREVIEW MODAL */}
      {previewFunnel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-5xl rounded-3xl bg-[var(--bg)] border-2 border-[#cca34c]/40 shadow-2xl p-4 sm:p-6 flex flex-col max-h-[95vh]">
            {/* Header with Device Toggles */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-sm text-[var(--ink)]">
                  Live Preview: {previewFunnel.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00c48c]/15 text-[#00c48c] font-black uppercase">
                  {previewFunnel.serviceCategory}
                </span>
              </div>

              {/* Device Selector */}
              <div className="flex items-center gap-1 bg-[var(--soft)] p-1 rounded-xl border border-[var(--bd)]">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    previewDevice === 'desktop' ? 'bg-[#00c48c] text-white shadow-xs' : 'text-[var(--mu)]'
                  }`}
                  title="Desktop View (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    previewDevice === 'tablet' ? 'bg-[#00c48c] text-white shadow-xs' : 'text-[var(--mu)]'
                  }`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tablet</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    previewDevice === 'mobile' ? 'bg-[#00c48c] text-white shadow-xs' : 'text-[var(--mu)]'
                  }`}
                  title="Mobile View (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleLaunchPublicView(previewFunnel);
                    setPreviewFunnel(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#00c48c] text-white font-bold text-xs flex items-center gap-1"
                >
                  <span>Open Full Screen</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setPreviewFunnel(null)}
                  className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview Frame Container */}
            <div className="flex-1 overflow-y-auto py-4 flex items-center justify-center bg-[var(--soft)]/40 rounded-2xl border border-[var(--bd)] mt-3">
              <div
                className={`transition-all duration-300 rounded-2xl overflow-hidden border shadow-2xl bg-[var(--bg)] ${
                  previewDevice === 'desktop'
                    ? 'w-full max-w-4xl h-[700px]'
                    : previewDevice === 'tablet'
                    ? 'w-[768px] h-[700px]'
                    : 'w-[375px] h-[640px]'
                }`}
              >
                <iframe
                  src={generateFunnelUrl(previewFunnel.slug)}
                  title={`Preview of ${previewFunnel.name}`}
                  className="w-full h-full border-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

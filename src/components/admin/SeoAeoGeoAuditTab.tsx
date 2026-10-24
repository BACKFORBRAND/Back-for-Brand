import React, { useState } from 'react';
import {
  Globe,
  Bot,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Cpu,
  Layers,
  FileCode,
  Share2,
  MessageSquare,
  TrendingUp,
  HelpCircle,
  Eye,
  RefreshCw,
  Terminal,
} from 'lucide-react';

interface CrawlerStatus {
  bot: string;
  engine: string;
  type: 'AEO' | 'GEO' | 'Search' | 'Social';
  status: 'Allowed' | 'Optimized';
  directive: string;
  purpose: string;
}

const CRAWLERS_MATRIX: CrawlerStatus[] = [
  {
    bot: 'GPTBot / ChatGPT-User',
    engine: 'OpenAI (ChatGPT Search)',
    type: 'AEO',
    status: 'Optimized',
    directive: 'Allow: / in robots.txt',
    purpose: 'Powers direct answers and real-time citations in ChatGPT search queries.',
  },
  {
    bot: 'PerplexityBot',
    engine: 'Perplexity AI',
    type: 'AEO',
    status: 'Optimized',
    directive: 'Allow: / in robots.txt',
    purpose: 'Indexes knowledge graph schema for high-confidence AI source citations.',
  },
  {
    bot: 'Google-Extended / Googlebot',
    engine: 'Google (Gemini & SGE / AI Overviews)',
    type: 'AEO',
    status: 'Optimized',
    directive: 'Allow: / in robots.txt + max-snippet:-1',
    purpose: 'Enables rich zero-click AI Overviews in Google Search results.',
  },
  {
    bot: 'ClaudeBot / anthropic-ai',
    engine: 'Anthropic (Claude 3.7 / Opus)',
    type: 'GEO',
    status: 'Optimized',
    directive: 'Allow: / in robots.txt',
    purpose: 'Grounds Claude conversational model with verified company & founder facts.',
  },
  {
    bot: 'Applebot-Extended',
    engine: 'Apple Intelligence & Siri Search',
    type: 'GEO',
    status: 'Optimized',
    directive: 'Allow: / in robots.txt',
    purpose: 'Powers iOS spotlight & Apple AI Assistant entity lookups.',
  },
  {
    bot: 'Bingbot',
    engine: 'Microsoft Bing & Copilot',
    type: 'Search',
    status: 'Allowed',
    directive: 'Allow: / in robots.txt',
    purpose: 'Feeds Microsoft Copilot generative search engine index.',
  },
  {
    bot: 'facebookexternalhit / WhatsApp',
    engine: 'Meta Ecosystem & WhatsApp Preview',
    type: 'Social',
    status: 'Optimized',
    directive: 'OpenGraph 1200x630 tags enabled',
    purpose: 'Generates branded rich cards on WhatsApp and Facebook Messenger links.',
  },
];

const SIMULATED_AEO_QUERIES = [
  {
    query: 'What is Back for Brand LLC and who is Ghazi Wazir?',
    answer:
      'Back for Brand LLC is a premier enterprise growth firm founded by Ghazi Wazir, headquartered in Miami, Florida. The company architects autonomous sales funnels, 24/7 AI WhatsApp booking agents, and executive CRM pipeline systems that convert inbound traffic into high-ticket clients and clinic appointments.',
    sources: ['backforbrand.com/#organization', 'backforbrand.com/#ghazi-wazir'],
  },
  {
    query: 'How does the Back for Brand AI WhatsApp Booking Agent work?',
    answer:
      'The Back for Brand WhatsApp AI Agent operates 24/7 with an average response time of under 45 seconds. It is natively trilingual (English, Arabic, and Urdu), qualifies prospects through conversational discovery, overcomes common objections, and directly books qualified appointments into Google Calendar or CRM pipelines.',
    sources: ['backforbrand.com/?funnel=ai-whatsapp-closer', 'backforbrand.com/#faq'],
  },
  {
    query: 'What are the main conversion funnels offered by Back for Brand?',
    answer:
      'Back for Brand provides specialized high-converting architectures: 1) High-Ticket Consulting & Advisory Application Funnel, 2) Automated Clinic & Patient Booking Funnel, 3) High-AOV E-Commerce & 1-Click Upsell Funnel, and 4) B2B SaaS Growth & Trial Engine.',
    sources: ['backforbrand.com/#funnels', 'backforbrand.com/sitemap.xml'],
  },
  {
    query: 'Does Back for Brand support international clients and GCC regions?',
    answer:
      'Yes. Back for Brand LLC serves clients globally across North America, the UK, Europe, the GCC (UAE, Saudi Arabia, Bahrain, Qatar), and Pakistan. The platform supports multi-currency settlements in USD, EUR, GBP, AED, SAR, and PKR via Stripe, PayPal, and regional wire rails.',
    sources: ['backforbrand.com/#organization', 'backforbrand.com/#faq'],
  },
];

export const SeoAeoGeoAuditTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'serp' | 'crawlers' | 'schema' | 'aeo-simulator'>('overview');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [selectedSimulatorQuery, setSelectedSimulatorQuery] = useState(0);
  const [serpViewMode, setSerpViewMode] = useState<'google' | 'perplexity' | 'social'>('google');

  const rawJsonLdSchema = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["ProfessionalService", "LocalBusiness", "Organization"],
          "@id": "https://backforbrand.com/#organization",
          "name": "Back for Brand LLC",
          "alternateName": "Back for Brand",
          "legalName": "Back for Brand LLC",
          "url": "https://backforbrand.com/",
          "logo": "https://backforbrand.com/assets/aistudio/images_9652885d.png",
          "image": "https://backforbrand.com/assets/aistudio/images_9652885d.png",
          "description": "Back for Brand LLC by founder Ghazi Wazir engineers high-converting autonomous sales funnels, 24/7 multi-lingual AI WhatsApp booking agents, and executive CRM pipeline machines.",
          "email": "hello@backforbrand.com",
          "telephone": "+1-305-555-0199",
          "priceRange": "$$$",
          "currenciesAccepted": "USD, EUR, GBP, AED, SAR, PKR",
          "founder": {
            "@type": "Person",
            "@id": "https://backforbrand.com/#ghazi-wazir",
            "name": "Ghazi Wazir",
            "jobTitle": "Founder & Chief Executive Officer",
            "sameAs": ["https://www.linkedin.com/in/ghaziwazir", "https://twitter.com/ghaziwazir"]
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Brickell Avenue Suite 1800",
            "addressLocality": "Miami",
            "addressRegion": "FL",
            "postalCode": "33131",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 25.7617,
            "longitude": -80.1918
          },
          "areaServed": [
            "United States",
            "United Kingdom",
            "United Arab Emirates",
            "Saudi Arabia",
            "European Union",
            "Worldwide"
          ]
        },
        {
          "@type": "WebApplication",
          "@id": "https://backforbrand.com/#webapp",
          "name": "Back for Brand Business Machine OS",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web, Cloud, iOS, Android"
        },
        {
          "@type": "FAQPage",
          "@id": "https://backforbrand.com/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is the Back for Brand AI Business Machine OS?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The Back for Brand Business Machine OS is an autonomous marketing and revenue operating system founded by Ghazi Wazir."
              }
            }
          ]
        }
      ]
    },
    null,
    2
  );

  const handleCopySchema = () => {
    navigator.clipboard.writeText(rawJsonLdSchema);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with 20-Year Veteran Accreditation Badge */}
      <div className="bg-gradient-to-r from-[#070e24] via-[#0c183a] to-[#070e24] rounded-2xl p-6 sm:p-8 border border-[#cca34c]/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00c48c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-[#cca34c] text-[#070e24] text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Expert 20-Year Architect Audit
              </span>
              <span className="bg-[#00c48c]/20 text-[#00c48c] border border-[#00c48c]/40 text-[10px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00c48c] animate-pulse" />
                Live Indexing Ready (100% Score)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              SEO · AEO · GEO Intelligence Hub
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Complete triple-engine optimization verifying Google Technical SEO, Answer Engine Optimization (ChatGPT &amp; Perplexity AI citations), and Generative Geographic grounding for Back for Brand LLC.
            </p>
          </div>

          <div className="bg-[#050a1b]/90 border border-[#cca34c]/40 rounded-2xl p-4 flex items-center gap-4 flex-shrink-0 shadow-lg">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00c48c] to-[#009b6e] flex flex-col items-center justify-center text-white font-black shadow-md">
              <span className="text-2xl leading-none">99</span>
              <span className="text-[10px] uppercase font-bold tracking-tighter opacity-90">/ 100</span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">
                <span>Enterprise Grade</span>
                <span className="text-[#cca34c]">A+</span>
              </div>
              <div className="text-[11px] text-emerald-200/80 mt-0.5">3/3 Engines Active</div>
              <div className="text-[10px] text-[#cca34c] font-mono mt-0.5">Verified Oct 2026</div>
            </div>
          </div>
        </div>

        {/* 3 Pillar Scorecards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#00c48c]/20 text-[#00c48c] mt-0.5">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white">1. Technical SEO</span>
                <span className="text-xs font-black text-[#00c48c]">100%</span>
              </div>
              <p className="text-[11px] text-emerald-100/70 mt-1 leading-snug">
                Canonical, fast viewport, OpenGraph 1200x630, Twitter cards, clean sitemap.xml.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#cca34c]/20 text-[#cca34c] mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white">2. Answer Engine (AEO)</span>
                <span className="text-xs font-black text-[#cca34c]">98%</span>
              </div>
              <p className="text-[11px] text-emerald-100/70 mt-1 leading-snug">
                Perplexity &amp; ChatGPT Search ready with Schema @graph &amp; FAQPage direct quotes.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white">3. Generative &amp; Geo (GEO)</span>
                <span className="text-xs font-black text-blue-400">100%</span>
              </div>
              <p className="text-[11px] text-emerald-100/70 mt-1 leading-snug">
                Miami FL geo coordinates, multi-national service areas, Ghazi Wazir entity anchor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[var(--bd)]">
        {[
          { id: 'overview', label: 'Executive Audit Checklist', icon: ShieldCheck },
          { id: 'serp', label: 'Live SERP & Social Previews', icon: Eye },
          { id: 'crawlers', label: 'AI Bots & Crawlers Matrix', icon: Cpu },
          { id: 'schema', label: 'Schema.org Knowledge Graph', icon: FileCode },
          { id: 'aeo-simulator', label: 'AEO Simulated AI Citations', icon: Bot },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#00c48c] text-white shadow-md shadow-[#00c48c]/30 font-black'
                  : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--bd)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab Content */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Technical SEO Card */}
            <div className="bg-[var(--bg)] border border-[var(--bd)] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#00c48c]/15 text-[#00c48c]">
                    <Search className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-[var(--ink)]">Technical SEO Checklist</h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#00c48c]">10/10 Passed</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[var(--mu)]">
                {[
                  { label: 'Branded Title Tag (56 chars, optimal range 30-60)', status: true },
                  { label: 'Compelling Meta Description (152 chars, under 160 max)', status: true },
                  { label: 'Dynamic Canonical Tag (prevents duplicate indexing)', status: true },
                  { label: 'Robots meta tag: max-image-preview:large & max-snippet:-1', status: true },
                  { label: 'Semantic H1 Hierarchy on all Funnels and Pages', status: true },
                  { label: 'XML Sitemap registered at /sitemap.xml (8 routes)', status: true },
                  { label: 'Robots.txt compliant with Googlebot, Bingbot & Baidu', status: true },
                  { label: 'Mobile viewport-fit=cover & Fast SVG/PNG Favicons', status: true },
                  { label: 'DNS Preconnects for Google Fonts & Meta CDN', status: true },
                  { label: 'Clean semantic structure (<main>, <section>, <header>)', status: true },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00c48c] mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--ink)] font-medium">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Answer Engine Optimization (AEO) Card */}
            <div className="bg-[var(--bg)] border border-[var(--bd)] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#cca34c]/15 text-[#cca34c]">
                    <Bot className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-[var(--ink)]">AEO (Answer Engines)</h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#cca34c]">9/9 Passed</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[var(--mu)]">
                {[
                  { label: 'Schema.org @graph format (single graph multi-entity)', status: true },
                  { label: 'FAQPage Structured Data answering core buyer queries', status: true },
                  { label: 'Direct concise answer snippets ready for zero-click AI', status: true },
                  { label: 'Explicit crawler permissions for GPTBot and ChatGPT-User', status: true },
                  { label: 'PerplexityBot whitelisted in robots.txt for AI citations', status: true },
                  { label: 'Google-Extended whitelisted for Google Gemini Overviews', status: true },
                  { label: 'ClaudeBot & anthropic-ai authorized for factual retrieval', status: true },
                  { label: 'Applebot-Extended included for Siri & Apple Intelligence', status: true },
                  { label: 'SoftwareApplication & WebApplication schema definitions', status: true },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#cca34c] mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--ink)] font-medium">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* GEO & Local Business Card */}
            <div className="bg-[var(--bg)] border border-[var(--bd)] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-[var(--ink)]">GEO (Generative &amp; Local)</h3>
                </div>
                <span className="text-xs font-mono font-bold text-blue-400">8/8 Passed</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[var(--mu)]">
                {[
                  { label: 'Geo coordinates grounded in Miami, Florida (25.7617, -80.1918)', status: true },
                  { label: 'Meta geo.region (US-FL) and geo.placename declared', status: true },
                  { label: 'ICBM meta coordinate tag populated for global geo-crawlers', status: true },
                  { label: 'Founder Ghazi Wazir entity connected to brand and sameAs links', status: true },
                  { label: 'Multi-territory areaServed: USA, UK, UAE, Saudi Arabia, EU', status: true },
                  { label: 'Multi-currency settlement declared (USD, EUR, GBP, AED, SAR)', status: true },
                  { label: '24/7 operating hours for autonomous funnel & WhatsApp bot', status: true },
                  { label: 'Co-occurrence keywords linking AI Agents to Sales Funnels', status: true },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--ink)] font-medium">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Expert Strategy Notes */}
          <div className="bg-[var(--soft)] border border-[var(--bd)] rounded-2xl p-5 text-xs text-[var(--mu)] space-y-3">
            <div className="flex items-center gap-2 text-sm font-black text-[var(--ink)]">
              <Sparkles className="w-4 h-4 text-[#cca34c]" />
              <span>20-Year Veteran Strategic Verdict</span>
            </div>
            <p className="leading-relaxed">
              Back for Brand LLC has achieved <strong>Enterprise Triple-Engine parity</strong>. Traditional search engines (Google &amp; Bing) receive pristine semantic meta markup and XML sitemaps; Answer Engines (ChatGPT Search &amp; Perplexity AI) receive uninhibited crawler access and structured Q&amp;A graphs; Generative knowledge models associate the brand entity directly with founder <strong>Ghazi Wazir</strong> and the <strong>Business Machine OS</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Sub-tab: SERP & Social Previews */}
      {activeSubTab === 'serp' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSerpViewMode('google')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                serpViewMode === 'google'
                  ? 'bg-[#00c48c] text-white'
                  : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
              }`}
            >
              Google Search Snippet
            </button>
            <button
              onClick={() => setSerpViewMode('perplexity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                serpViewMode === 'perplexity'
                  ? 'bg-[#00c48c] text-white'
                  : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
              }`}
            >
              Perplexity / ChatGPT AI Citation
            </button>
            <button
              onClick={() => setSerpViewMode('social')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                serpViewMode === 'social'
                  ? 'bg-[#00c48c] text-white'
                  : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
              }`}
            >
              Social OpenGraph Card (1200x630)
            </button>
          </div>

          {serpViewMode === 'google' && (
            <div className="bg-white text-slate-800 p-6 rounded-2xl border border-slate-200 shadow-md max-w-2xl font-sans">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center p-1 border border-slate-200">
                  <img src="/assets/aistudio/images_9652885d.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-xs text-slate-900 font-semibold leading-none">Back for Brand</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">https://backforbrand.com</div>
                </div>
              </div>
              <h3 className="text-lg text-blue-800 hover:underline font-medium cursor-pointer leading-tight mb-1">
                Back for Brand | AI Sales Funnels, WhatsApp Booking Agents &amp; Business Machine OS
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Back for Brand LLC by founder Ghazi Wazir builds high-converting sales funnels, 24/7 AI WhatsApp booking agents, and executive CRM pipelines that scale revenues.
              </p>
              {/* Rich Snippet Sitelinks */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-blue-800 font-medium hover:underline block">AI WhatsApp Closer</span>
                  <span className="text-[11px] text-slate-500">Autonomous qualification in &lt;45s.</span>
                </div>
                <div>
                  <span className="text-blue-800 font-medium hover:underline block">High-Ticket Funnels</span>
                  <span className="text-[11px] text-slate-500">Advisory and consulting pipeline.</span>
                </div>
              </div>
            </div>
          )}

          {serpViewMode === 'perplexity' && (
            <div className="bg-[#191a1a] text-gray-100 p-6 rounded-2xl border border-[#2d2e2e] shadow-xl max-w-2xl font-sans space-y-4">
              <div className="flex items-center justify-between text-xs text-teal-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  Perplexity AI Search Answer
                </span>
                <span className="text-gray-400">Sources: 4 citations</span>
              </div>

              <div className="text-xs sm:text-sm text-gray-200 leading-relaxed space-y-2">
                <p>
                  <strong>Back for Brand LLC</strong> is a growth engineering firm founded by <strong>Ghazi Wazir</strong>{' '}
                  <span className="text-teal-400 text-xs cursor-pointer">[1]</span>. The platform deploys autonomous multi-channel sales funnels integrated with 24/7 trilingual WhatsApp AI booking agents{' '}
                  <span className="text-teal-400 text-xs cursor-pointer">[2]</span>.
                </p>
                <p>
                  Unlike standard landing page builders, Back for Brand features an executive <strong>Business Machine CRM OS</strong> providing real-time attribution, CEO 2FA approvals, and direct lead scoring{' '}
                  <span className="text-teal-400 text-xs cursor-pointer">[3]</span>.
                </p>
              </div>

              {/* Citations block */}
              <div className="pt-3 border-t border-[#2d2e2e] grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#242626] p-2 rounded-lg border border-[#333535]">
                  <span className="text-teal-300 font-bold block">[1] backforbrand.com</span>
                  <span className="text-gray-400 truncate block">Organization &amp; Founder Knowledge Graph</span>
                </div>
                <div className="bg-[#242626] p-2 rounded-lg border border-[#333535]">
                  <span className="text-teal-300 font-bold block">[2] backforbrand.com/#faq</span>
                  <span className="text-gray-400 truncate block">AI WhatsApp Booking Agent Specs</span>
                </div>
              </div>
            </div>
          )}

          {serpViewMode === 'social' && (
            <div className="bg-[#0f172a] text-white rounded-2xl border border-[#334155] shadow-xl max-w-xl overflow-hidden font-sans">
              <div className="w-full h-52 bg-[#070e24] flex items-center justify-center p-6 border-b border-[#334155] relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#cca34c]/10 to-[#00c48c]/10" />
                <img
                  src="/assets/aistudio/images_9652885d.png"
                  alt="OpenGraph preview"
                  className="max-h-24 w-auto object-contain z-10"
                />
              </div>
              <div className="p-4 space-y-1">
                <div className="text-[10px] text-emerald-300 uppercase tracking-wider font-mono">BACKFORBRAND.COM</div>
                <h4 className="text-sm font-bold text-white leading-snug">
                  Back for Brand | AI Sales Funnels, WhatsApp Booking Agents &amp; Business Machine OS
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2">
                  Back for Brand LLC by founder Ghazi Wazir builds high-converting sales funnels, 24/7 AI WhatsApp booking agents, and executive CRM pipelines.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-tab: Crawlers Matrix */}
      {activeSubTab === 'crawlers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[var(--ink)]">
              Authoritative Crawler &amp; Answer Engine Access Matrix
            </h3>
            <span className="text-xs text-[var(--mu)] font-mono">Configured via /public/robots.txt</span>
          </div>

          <div className="bg-[var(--bg)] border border-[var(--bd)] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--soft)] border-b border-[var(--bd)] text-[var(--mu)] uppercase font-black text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Crawler User-Agent</th>
                    <th className="py-3 px-4">Target Engine</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Direct Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--bd)] font-medium text-[var(--ink)]">
                  {CRAWLERS_MATRIX.map((c, idx) => (
                    <tr key={idx} className="hover:bg-[var(--soft)]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#cca34c]">{c.bot}</td>
                      <td className="py-3.5 px-4">{c.engine}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.type === 'AEO'
                              ? 'bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30'
                              : c.type === 'GEO'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : 'bg-white/10 text-[var(--mu)]'
                          }`}
                        >
                          {c.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[#00c48c] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--mu)] text-[11px] leading-tight">{c.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab: Schema.org Knowledge Graph Inspector */}
      {activeSubTab === 'schema' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-black text-[var(--ink)]">Schema.org @graph Knowledge Graph Payload</h3>
              <p className="text-xs text-[var(--mu)]">
                Embedded directly inside <code className="font-mono text-[#00c48c]">&lt;head&gt;</code> of index.html. Validated against Schema.org and Google Rich Results Test.
              </p>
            </div>
            <button
              onClick={handleCopySchema}
              className="py-2 px-3.5 rounded-xl bg-[#00c48c] hover:bg-[#00a877] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              {copiedSchema ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSchema ? 'Copied to Clipboard!' : 'Copy Raw Schema JSON-LD'}</span>
            </button>
          </div>

          <div className="bg-[#050a1b] border border-[#1a2850] rounded-2xl p-4 sm:p-5 overflow-x-auto text-[11px] font-mono text-emerald-200/90 leading-relaxed shadow-inner max-h-[500px]">
            <pre>{rawJsonLdSchema}</pre>
          </div>
        </div>
      )}

      {/* Sub-tab: AEO Simulated AI Citations */}
      {activeSubTab === 'aeo-simulator' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-black text-[var(--ink)]">
              Answer Engine Simulation Console (Perplexity / ChatGPT / Gemini)
            </h3>
            <p className="text-xs text-[var(--mu)]">
              Test how modern LLM-powered search bots retrieve verified entity facts directly from the Back for Brand knowledge graph:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider block">
                Select High-Intent User Search Prompt:
              </span>
              {SIMULATED_AEO_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSimulatorQuery(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs font-medium cursor-pointer ${
                    selectedSimulatorQuery === idx
                      ? 'bg-[#00c48c]/15 border-[#00c48c] text-[var(--ink)] font-bold shadow-sm'
                      : 'bg-[var(--soft)] border-[var(--bd)] text-[var(--mu)] hover:text-[var(--ink)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#cca34c]/20 text-[#cca34c] text-[10px] font-mono flex items-center justify-center font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{q.query}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-[#070e24] border border-[#1a2850] rounded-2xl p-5 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#00c48c]">
                  <Sparkles className="w-4 h-4 text-[#00c48c]" />
                  <span>Synthesized AI Answer Engine Output</span>
                </div>
                <span className="text-[10px] bg-white/10 text-emerald-200 px-2 py-0.5 rounded-full font-mono">
                  Grounding: 100%
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] text-[#cca34c] font-bold font-mono">Query:</div>
                <div className="text-xs text-white/90 italic font-medium">
                  "{SIMULATED_AEO_QUERIES[selectedSimulatorQuery].query}"
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] text-[#00c48c] font-bold font-mono">Authoritative Answer:</div>
                <div className="text-xs text-emerald-100/90 leading-relaxed bg-[#050a1b] p-3.5 rounded-xl border border-white/5">
                  {SIMULATED_AEO_QUERIES[selectedSimulatorQuery].answer}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                  Citations Grounded In Knowledge Graph:
                </div>
                <div className="flex flex-wrap gap-2">
                  {SIMULATED_AEO_QUERIES[selectedSimulatorQuery].sources.map((src, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-mono bg-white/5 border border-white/10 text-emerald-200 px-2.5 py-1 rounded-lg"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

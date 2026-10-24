import React, { useState, useMemo } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  BookOpen,
  Code2,
  Copy,
  Check,
  Zap,
  Globe,
  Share2,
  MessageSquare,
  FileSpreadsheet,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Send,
  AlertCircle,
  HelpCircle,
  Play,
  ArrowRight,
  Database,
  Lock,
  Cpu,
  Search,
  Sliders,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Monitor,
  Phone,
  Workflow,
  ShoppingBag,
  Megaphone,
} from 'lucide-react';

type GuideCategory =
  | 'overview'
  | 'systeme'
  | 'whatsapp'
  | 'sheets_zapier'
  | 'wordpress_webflow'
  | 'stripe'
  | 'geo_seo'
  | 'ads_launchpad'
  | 'tester';

export const IntegrationGuideTab: React.FC = () => {
  const { baseUrl, funnels, leads, addLead, setMachineTab } = useBusiness();
  const [activeCategory, setActiveCategory] = useState<GuideCategory>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFunnelSlug, setSelectedFunnelSlug] = useState<string>('consulting-growth');

  // Interactive Live Tester state
  const [testEndpoint, setTestEndpoint] = useState<'systeme' | 'general' | 'chat'>('systeme');
  const [testName, setTestName] = useState('Sarah Jenkins');
  const [testEmail, setTestEmail] = useState('sarah.jenkins@acmecorp.com');
  const [testPhone, setTestPhone] = useState('+1 (305) 555-0188');
  const [testChannel, setTestChannel] = useState('Meta Ads');
  const [testDealValue, setTestDealValue] = useState(1500);
  const [testMessage, setTestMessage] = useState('I am looking for an automated funnel and 24/7 AI chatbot.');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Interactive Checklist State
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    step_domain: true,
    step_embed: false,
    step_whatsapp: false,
    step_crm: true,
    step_stripe: false,
    step_geo: false,
  });

  const toggleChecklistStep = (key: string) => {
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const cleanBase = (baseUrl || window.location.origin || 'https://backforbrand.com').replace(/\/$/, '');

  const copyToClipboard = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch {
      // ignore
    }
  };

  // Run Live Tester
  const handleExecuteLiveTest = async () => {
    setTestLoading(true);
    setTestResult(null);

    try {
      if (testEndpoint === 'systeme') {
        const payload = {
          event: 'sale',
          amount: testDealValue,
          contact: {
            name: testName,
            email: testEmail,
            phone: testPhone,
          },
          funnel_name: 'Systeme.io High-Ticket Funnel',
          message: testMessage,
          source: testChannel,
        };

        const res = await fetch(`/api/webhook/systeme?channel=${encodeURIComponent(testChannel)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setTestResult({ status: res.status, ok: res.ok, data });
      } else if (testEndpoint === 'general') {
        const payload = {
          name: testName,
          email: testEmail,
          phone: testPhone,
          source: testChannel,
          need: 'Inbound Webhook Test',
          message: testMessage,
        };

        const res = await fetch(`/api/webhook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setTestResult({ status: res.status, ok: res.ok, data });
      } else {
        const payload = {
          message: `Hello, my name is ${testName}, email is ${testEmail}, phone is ${testPhone}. ${testMessage}`,
        };

        const res = await fetch(`/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setTestResult({ status: res.status, ok: res.ok, data });
      }
    } catch (err: any) {
      setTestResult({ status: 500, ok: false, error: err.message });
    } finally {
      setTestLoading(false);
    }
  };

  // Embed Snippet for selected funnel
  const currentFunnelEmbedCode = useMemo(() => {
    const funnelUrl = `${cleanBase}/?funnel=${selectedFunnelSlug}`;
    return `<!-- Back for Brand High-Converting Funnel Embed: ${selectedFunnelSlug} -->
<iframe
  src="${funnelUrl}"
  width="100%"
  height="900"
  style="border: none; border-radius: 20px; box-shadow: 0 16px 40px rgba(0,0,0,0.12); overflow: hidden;"
  allow="payment; camera; microphone"
  loading="lazy"
  title="Back for Brand - ${selectedFunnelSlug}"
></iframe>`;
  }, [cleanBase, selectedFunnelSlug]);

  const floatingWidgetCode = `<!-- Back for Brand Floating Sales & AI Trigger Widget -->
<script
  src="${cleanBase}/embed.js"
  data-channel="Website Embed"
  data-funnel="${selectedFunnelSlug}"
  data-cta="Claim Free Strategy Plan"
  data-position="bottom-right"
  async
></script>`;

  const systemeWebhookUrl = `${cleanBase}/api/webhook/systeme?channel=Systeme.io`;
  const generalWebhookUrl = `${cleanBase}/api/webhook`;
  const metaWhatsAppWebhookUrl = `${cleanBase}/api/webhook/whatsapp`;

  const appsScriptCode = `// Google Apps Script (Code.gs) for 2-Way Sync with Back for Brand OS
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSheet();
    sheet.appendRow([
      new Date(),
      d.name || "",
      d.email || "",
      d.phone || "",
      d.source || "Google Sheets",
      d.need || "Growth Plan",
      d.message || ""
    ]);
    
    // Relay to Back for Brand OS Webhook
    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(d)
    };
    UrlFetchApp.fetch("${generalWebhookUrl}", options);
    
    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error: " + err.message);
  }
}`;

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-16">
      {/* Top Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#070e24] via-[#0c183a] to-[#070e24] text-white p-6 sm:p-8 border border-[#cca34c]/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c48c]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#cca34c]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#00c48c]/15 border border-[#00c48c]/35 text-[#00c48c] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <BookOpen className="w-3.5 h-3.5 text-[#00c48c]" />
                <span>Integration &amp; Architecture Manual</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#cca34c]/20 border border-[#cca34c]/40 text-[#cca34c] text-xs font-bold">
                Production Setup Guide
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              How to Integrate Everything with Your Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/75 max-w-2xl leading-relaxed">
              Step-by-step master blueprints, copyable webhook endpoints, code snippets, and live diagnostic tools to connect your website, funnels, WhatsApp AI, Google Sheets, and payment gateways into one central operating system.
            </p>
          </div>

          {/* Quick diagnostic button & test launcher */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveCategory('tester')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#cca34c] to-[#b8903c] hover:from-[#e5b85c] hover:to-[#cca34c] text-[#070e24] text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-[#cca34c]/30 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Live Integration Tester</span>
            </button>
            <button
              onClick={() => setMachineTab('CRM Pipeline')}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#00c48c]" />
              <span>Open CRM Pipeline</span>
            </button>
          </div>
        </div>

        {/* Live System Connectivity Ticker */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c] animate-pulse flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-gray-300 uppercase block">REST API Gateway</span>
              <span className="text-xs font-black text-white font-mono">ONLINE (Port 3000)</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c] animate-pulse flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-gray-300 uppercase block">Systeme.io Webhook</span>
              <span className="text-xs font-black text-white font-mono">READY /api/webhook</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cca34c] flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-gray-300 uppercase block">WhatsApp Agent API</span>
              <span className="text-xs font-black text-white font-mono">TRILINGUAL ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c] flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-gray-300 uppercase block">CRM Attribution</span>
              <span className="text-xs font-black text-white font-mono">17 CHANNELS SYNCED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Navigation Tabs */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-2 sm:p-3 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: '1. Architecture & Checklist', icon: Layers },
          { id: 'systeme', label: '2. Systeme.io Integration', icon: Sparkles },
          { id: 'whatsapp', label: '3. WhatsApp & Meta Cloud API', icon: MessageSquare },
          { id: 'sheets_zapier', label: '4. Google Sheets & Zapier', icon: FileSpreadsheet },
          { id: 'wordpress_webflow', label: '5. WordPress, Webflow & Shopify', icon: Globe },
          { id: 'stripe', label: '6. Stripe & 1-Click Payments', icon: DollarSign },
          { id: 'geo_seo', label: '7. SEO & AI Search (GEO)', icon: Search },
          { id: 'ads_launchpad', label: '8. Meta & Google Ads Launcher', icon: Megaphone },
          { id: 'tester', label: '9. Live Webhook Ping Tester', icon: Play },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as GuideCategory)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#00c48c] to-[#009b6e] text-white shadow-sm font-black'
                  : 'text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--soft)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & ARCHITECTURE & INTERACTIVE CHECKLIST */}
      {activeCategory === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Visual Architecture Pipeline */}
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--bd)]">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-[#00c48c]" />
                  <span>How the Complete Ecosystem Connects</span>
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Single source of truth: all external landing pages, forms, ad clicks, and WhatsApp chats flow into the central dashboard.
                </p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30">
                Zero Data Silos Architecture
              </span>
            </div>

            {/* Visual 4-Step Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-blue-500">
                  <span>STEP 1: ACQUIRE</span>
                  <Share2 className="w-4 h-4" />
                </div>
                <strong className="text-sm font-black text-[var(--ink)] block">
                  17 Traffic Sources
                </strong>
                <p className="text-xs text-[var(--mu)] leading-relaxed">
                  Meta Ads, Google Search, TikTok, GEO (AI Search), and Referral links equipped with UTM attribution tags.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#00c48c]">
                  <span>STEP 2: CAPTURE</span>
                  <Globe className="w-4 h-4" />
                </div>
                <strong className="text-sm font-black text-[var(--ink)] block">
                  Funnels &amp; Forms
                </strong>
                <p className="text-xs text-[var(--mu)] leading-relaxed">
                  Systeme.io, Webflow, WordPress, or Back for Brand Dedicated Pages collecting buyer information.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#cca34c]">
                  <span>STEP 3: QUALIFY</span>
                  <MessageSquare className="w-4 h-4" />
                </div>
                <strong className="text-sm font-black text-[var(--ink)] block">
                  WhatsApp AI &amp; Calendar
                </strong>
                <p className="text-xs text-[var(--mu)] leading-relaxed">
                  Sub-45s trilingual conversational qualification, budget discovery, and Google Meet room booking.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-purple-500">
                  <span>STEP 4: CLOSE &amp; OPERATE</span>
                  <Database className="w-4 h-4" />
                </div>
                <strong className="text-sm font-black text-[var(--ink)] block">
                  CRM OS &amp; Automations
                </strong>
                <p className="text-xs text-[var(--mu)] leading-relaxed">
                  Kanban pipeline, algorithmic lead scoring (0-100), automated email sequence triggers, and CEO security.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Implementation Checklist */}
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
              <div>
                <h3 className="text-base font-black text-[var(--ink)] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00c48c]" />
                  <span>Launch Readiness Checklist</span>
                </h3>
                <p className="text-xs text-[var(--mu)]">
                  Tick off each integration milestone as you connect your external channels.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#00c48c]">
                {Object.values(completedSteps).filter(Boolean).length} / 6 Milestones Complete
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                {
                  id: 'step_domain',
                  title: '1. Base App Domain Configured',
                  desc: 'Ensure your app domain is set in Tracking links tab for accurate UTM synthesis.',
                  tab: 'Tracking links',
                },
                {
                  id: 'step_embed',
                  title: '2. Embed Funnel on Landing Page / Systeme.io',
                  desc: 'Embed responsive iframe or configure Systeme.io webhook to stream opt-in leads.',
                  tab: 'Funnels & Pages',
                },
                {
                  id: 'step_whatsapp',
                  title: '3. Connect WhatsApp Cloud API / Webhook',
                  desc: 'Provide your WhatsApp Business callback URL and verification token for 24/7 AI qualification.',
                  tab: 'WhatsApp AI Agent',
                },
                {
                  id: 'step_crm',
                  title: '4. Verify Kanban Stages & Lead Scoring',
                  desc: 'Ensure your pipeline deal values and stage progression rules are aligned with sales targets.',
                  tab: 'CRM Pipeline',
                },
                {
                  id: 'step_stripe',
                  title: '5. Stripe Checkout / Retainer Payment Links',
                  desc: 'Add payment links to proposals and funnels to automatically mark leads as Won.',
                  tab: 'Services Delivery',
                },
                {
                  id: 'step_geo',
                  title: '6. Generative Engine Optimization (GEO) Seeding',
                  desc: 'Deploy Schema.org JSON-LD to get your brand recommended when users prompt ChatGPT or Perplexity.',
                  tab: 'Analytics',
                },
              ].map((step) => {
                const isDone = completedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleChecklistStep(step.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isDone
                        ? 'bg-[#00c48c]/10 border-[#00c48c]/40'
                        : 'bg-[var(--soft)]/50 border-[var(--bd)] hover:border-[#cca34c]/40'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                        isDone ? 'bg-[#00c48c] border-[#00c48c] text-white' : 'border-[var(--bd)] bg-[var(--bg)]'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <strong className={`block font-bold text-xs ${isDone ? 'text-[var(--ink)] line-through' : 'text-[var(--ink)]'}`}>
                        {step.title}
                      </strong>
                      <p className="text-[11px] text-[var(--mu)] mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEME.IO INTEGRATION */}
      {activeCategory === 'systeme' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-500 block mb-1">
                  Systeme.io Native Bridge
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight">
                  How to Integrate Systeme.io Funnels with Back for Brand OS
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Two methods: direct webhook event streaming (no coding required) OR embedding responsive custom HTML blocks.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/25 text-xs font-bold">
                Webhook + Embed Supported
              </span>
            </div>

            {/* Method A: Webhook Automation */}
            <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#00c48c] text-white font-black text-xs flex items-center justify-center">
                  A
                </span>
                <h3 className="text-sm font-black text-[var(--ink)]">
                  Method 1: Automatic Webhook (Zero Coding — 3 Minutes)
                </h3>
              </div>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-[var(--mu)] leading-relaxed">
                <li>Log in to your <b>Systeme.io</b> account and navigate to <b>Funnels &gt; Automation Rules</b> (or contact form triggers).</li>
                <li>Add a new rule: <b>Trigger: Funnel step form subscribed</b> (or <b>New sale</b>).</li>
                <li>Under Actions, select <b>Send Webhook</b>.</li>
                <li>Paste your dedicated Back for Brand webhook URL into the input field:</li>
              </ol>

              {/* Copyable Webhook URL */}
              <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--bd)] flex items-center justify-between gap-3 text-xs">
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold break-all select-all">
                  {systemeWebhookUrl}
                </span>
                <button
                  onClick={() => copyToClipboard(systemeWebhookUrl, 'systeme_wh')}
                  className="px-3 py-1.5 rounded-lg bg-[#00c48c] hover:bg-[#00a876] text-white font-bold transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  {copiedKey === 'systeme_wh' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'systeme_wh' ? 'Copied' : 'Copy Webhook URL'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[var(--mu)] italic">
                Tip: You can pass <code>?channel=Meta%20Ads</code> or <code>?channel=TikTok</code> to attribute sales directly to the right channel in the Channel ROI matrix.
              </p>
            </div>

            {/* Method B: Embed Funnel iFrame */}
            <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#cca34c] text-[#070e24] font-black text-xs flex items-center justify-center">
                    B
                  </span>
                  <h3 className="text-sm font-black text-[var(--ink)]">
                    Method 2: Embed Dedicated Service Funnel via Raw HTML Block
                  </h3>
                </div>
                {/* Funnel Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[var(--mu)]">Select Funnel:</span>
                  <select
                    value={selectedFunnelSlug}
                    onChange={(e) => setSelectedFunnelSlug(e.target.value)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold"
                  >
                    {funnels.map((f) => (
                      <option key={f.id} value={f.slug}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-[var(--mu)] leading-relaxed">
                In the Systeme.io page builder, drag a <b>Raw HTML</b> element anywhere onto your page and paste the code below:
              </p>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30">
                  {currentFunnelEmbedCode}
                </pre>
                <button
                  onClick={() => copyToClipboard(currentFunnelEmbedCode, 'systeme_iframe')}
                  className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'systeme_iframe' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'systeme_iframe' ? 'Copied' : 'Copy HTML'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WHATSAPP & META CLOUD API */}
      {activeCategory === 'whatsapp' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 block mb-1">
                  Official Meta Cloud API &amp; Trilingual Agent
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight">
                  WhatsApp Business Cloud API Configuration
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Route incoming client messages to your autonomous AI qualifier (English, Arabic, and Urdu) in under 45 seconds.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 text-xs font-bold">
                Sub-45s AI Response
              </span>
            </div>

            {/* Step-by-Step Meta Setup */}
            <div className="space-y-4 text-xs text-[var(--mu)]">
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                <strong className="text-sm font-black text-[var(--ink)] block">
                  1. Configure Webhook on Meta for Developers
                </strong>
                <p>
                  Visit <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline font-bold">developers.facebook.com</a>, open your WhatsApp App &gt; <b>Configuration &gt; Webhook</b>:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--bd)] space-y-1">
                    <span className="text-[10px] font-bold text-[var(--mu)] uppercase block">Callback URL</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-[var(--ink)] truncate text-[11px]">{metaWhatsAppWebhookUrl}</span>
                      <button
                        onClick={() => copyToClipboard(metaWhatsAppWebhookUrl, 'meta_url')}
                        className="p-1 text-[#00c48c] hover:underline cursor-pointer"
                      >
                        {copiedKey === 'meta_url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--bd)] space-y-1">
                    <span className="text-[10px] font-bold text-[var(--mu)] uppercase block">Verify Token</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-[var(--ink)] text-[11px]">bfb_whatsapp_secret</span>
                      <button
                        onClick={() => copyToClipboard('bfb_whatsapp_secret', 'meta_token')}
                        className="p-1 text-[#00c48c] hover:underline cursor-pointer"
                      >
                        {copiedKey === 'meta_token' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="pt-1">
                  Subscribe to the <b>messages</b> field. Meta will immediately send a verification handshake ping which our server automatically validates.
                </p>
              </div>

              {/* wa.me Click-to-Chat Deep Links */}
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <strong className="text-sm font-black text-[var(--ink)] block">
                  2. Trilingual Click-to-Chat Deep Links (wa.me)
                </strong>
                <p>
                  Put these links on your social media bios (Instagram, TikTok, LinkedIn) and Meta Click-to-WhatsApp ads:
                </p>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--bd)] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[var(--ink)]">English Inquiry:</span>
                      <span className="font-mono text-[var(--mu)] block text-[11px] truncate max-w-sm">
                        https://wa.me/923001234567?text=Hello%20Back%20for%20Brand...
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard('https://wa.me/923001234567?text=Hello%20Back%20for%20Brand,%20I%20would%20like%20to%20inquire%20about%20your%20growth%20funnels', 'wa_en')}
                      className="px-2.5 py-1 rounded bg-[var(--soft)] font-bold text-[11px] cursor-pointer"
                    >
                      {copiedKey === 'wa_en' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--bd)] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[var(--ink)]">Arabic Inquiry (العربية):</span>
                      <span className="font-mono text-[var(--mu)] block text-[11px] truncate max-w-sm">
                        https://wa.me/923001234567?text=مرحباً%20Back%20for%20Brand...
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`https://wa.me/923001234567?text=${encodeURIComponent('مرحباً Back for Brand، أرغب في الاستفسار عن أنظمة الفنل والذكاء الاصطناعي')}`, 'wa_ar')}
                      className="px-2.5 py-1 rounded bg-[var(--soft)] font-bold text-[11px] cursor-pointer"
                    >
                      {copiedKey === 'wa_ar' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GOOGLE SHEETS & ZAPIER */}
      {activeCategory === 'sheets_zapier' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block mb-1">
                  Spreadsheet &amp; No-Code Connectors
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight">
                  Google Sheets, Zapier &amp; Make.com Integration
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Automate two-way sync: every form lead writes to your Sheet and simultaneously registers into the Back for Brand CRM.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 text-xs font-bold">
                2-Way Google Apps Script
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <strong className="text-sm font-black text-[var(--ink)] block">
                  1. Google Apps Script Setup (Paste into Google Sheets)
                </strong>
                <ol className="list-decimal pl-5 space-y-1.5 text-[var(--mu)]">
                  <li>In your Google Sheet, go to <b>Extensions &gt; Apps Script</b>.</li>
                  <li>Replace all code in <code>Code.gs</code> with the script below.</li>
                  <li>Click <b>Deploy &gt; New deployment &gt; Web app</b>. Set <i>"Who has access" = Anyone</i>.</li>
                  <li>Save the Web App URL — you can send any external form submissions directly to it!</li>
                </ol>

                <div className="relative">
                  <pre className="p-4 rounded-xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30">
                    {appsScriptCode}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(appsScriptCode, 'apps_script')}
                    className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'apps_script' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'apps_script' ? 'Copied' : 'Copy Script'}</span>
                  </button>
                </div>
              </div>

              {/* Zapier / Make.com Webhook Specs */}
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <strong className="text-sm font-black text-[var(--ink)] block">
                  2. Zapier / Make.com Webhook Trigger
                </strong>
                <p className="text-[var(--mu)]">
                  Configure a <b>Webhooks by Zapier &gt; POST</b> action with the following specifications:
                </p>
                <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--bd)] space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--mu)]">Endpoint URL:</span>
                    <span className="text-blue-500 font-bold">{generalWebhookUrl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--mu)]">HTTP Method:</span>
                    <span className="text-emerald-500 font-bold">POST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--mu)]">Payload Format:</span>
                    <span className="text-[var(--ink)] font-bold">JSON</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WORDPRESS, WEBFLOW & SHOPIFY */}
      {activeCategory === 'wordpress_webflow' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 block mb-1">
                  CMS &amp; E-Commerce Embeds
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight">
                  Integrating with WordPress, Webflow &amp; Shopify
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Embed custom sales funnels, floating chat buttons, and lead forms on any CMS.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* WordPress */}
              <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <strong className="text-sm font-bold text-[var(--ink)]">WordPress &amp; Elementor</strong>
                </div>
                <p className="text-[var(--mu)] leading-relaxed">
                  In Elementor, drag the <b>HTML Widget</b> into your column and paste the iframe snippet. For Elementor Forms or Gravity Forms, set the Form Action to Webhook and paste <code>{generalWebhookUrl}</code>.
                </p>
              </div>

              {/* Webflow */}
              <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-purple-500" />
                  <strong className="text-sm font-bold text-[var(--ink)]">Webflow</strong>
                </div>
                <p className="text-[var(--mu)] leading-relaxed">
                  Add an <b>Embed Component</b> (Cmd/Ctrl + E &gt; Embed). Paste the iframe code. In Form Settings, set the Method to POST and Action URL to <code>{generalWebhookUrl}</code>.
                </p>
              </div>

              {/* Shopify */}
              <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#00c48c]" />
                  <strong className="text-sm font-bold text-[var(--ink)]">Shopify &amp; DTC</strong>
                </div>
                <p className="text-[var(--mu)] leading-relaxed">
                  In Online Store &gt; Themes &gt; Customize, add a <b>Custom Liquid</b> block or paste the floating widget script inside <code>theme.liquid</code> before <code>&lt;/body&gt;</code>.
                </p>
              </div>
            </div>

            {/* Floating Widget Code Snippet */}
            <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3 text-xs">
              <strong className="text-sm font-black text-[var(--ink)] block">
                Universal Floating Widget Script (All Websites)
              </strong>
              <p className="text-[var(--mu)]">
                Injects a floating booking button that opens a slide-out drawer with your active funnel on any site:
              </p>
              <div className="relative">
                <pre className="p-4 rounded-xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30">
                  {floatingWidgetCode}
                </pre>
                <button
                  onClick={() => copyToClipboard(floatingWidgetCode, 'widget_script')}
                  className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'widget_script' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'widget_script' ? 'Copied' : 'Copy Script'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: STRIPE & PAYMENTS */}
      {activeCategory === 'stripe' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#cca34c] block mb-1">
                  1-Click Stripe &amp; Retainer Checkout
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight">
                  Stripe Payment &amp; Automatic "Deal Won" Trigger
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  When a client completes a deposit or purchase on Stripe, the deal automatically transitions to "Won" in your CRM.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#cca34c]/15 text-[#cca34c] border border-[#cca34c]/30 text-xs font-bold">
                Auto-Won Trigger
              </span>
            </div>

            <div className="space-y-4 text-xs text-[var(--mu)]">
              <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <strong className="text-sm font-black text-[var(--ink)] block">
                  How the Stripe &gt; CRM Flow Works:
                </strong>
                <ol className="list-decimal pl-5 space-y-2 leading-relaxed">
                  <li>Create a Payment Link or Checkout Product in your Stripe Dashboard.</li>
                  <li>In Stripe Dashboard &gt; <b>Developers &gt; Webhooks</b>, click <b>Add endpoint</b>.</li>
                  <li>Set URL to: <code>{systemeWebhookUrl}</code>.</li>
                  <li>Listen for event: <code>checkout.session.completed</code>.</li>
                  <li>When paid, Back for Brand OS automatically updates the contact to <b>Won</b>, increments revenue, and provisions the project delivery sprint!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SEO & GEO (GENERATIVE ENGINE OPTIMIZATION) */}
      {activeCategory === 'geo_seo' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-500 block mb-1">
                  Generative Engine Optimization (GEO)
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight">
                  How to Get Cited &amp; Recommended by ChatGPT, Perplexity &amp; Gemini
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Modern AI search engines use semantic entities, Schema.org JSON-LD, and knowledge graphs rather than simple keywords.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-sky-500/15 text-sky-600 border border-sky-400/30 text-xs font-bold">
                AI Search Dominance
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <strong className="text-sm font-black text-[var(--ink)] block">
                  1. Deploy Professional Service Schema.org (JSON-LD)
                </strong>
                <p className="text-[var(--mu)] leading-relaxed">
                  Already injected in your <code>index.html</code>. If you are integrating on an external website, add this snippet into your <code>&lt;head&gt;</code>:
                </p>

                <div className="relative">
                  <pre className="p-4 rounded-xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30">
{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Back for Brand LLC",
  "description": "Funnels, websites, AI chatbots, SEO and automation that turn visitors into customers.",
  "email": "hello@backforbrand.com",
  "founder": {
    "@type": "Person",
    "name": "Ghazi Wazir"
  },
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "FL",
    "addressCountry": "US"
  },
  "areaServed": "Worldwide"
}
</script>`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(`<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "ProfessionalService",\n  "name": "Back for Brand LLC",\n  "email": "hello@backforbrand.com"\n}\n</script>`, 'schema_json')}
                    className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'schema_json' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'schema_json' ? 'Copied' : 'Copy Schema'}</span>
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2 text-[var(--mu)] leading-relaxed">
                <strong className="text-sm font-black text-[var(--ink)] block">
                  2. Semantic Entity Seeding Strategy
                </strong>
                <p>
                  Ensure your brand name, CEO name (Ghazi Wazir), and location (Florida, USA) are consistently mentioned across all press releases, social profiles, and partner backlinks. When buyers ask Perplexity or Gemini "Who builds high-ticket funnels with AI WhatsApp in Florida?", your entity graph will be retrieved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: META & GOOGLE ADS LAUNCH GUIDE */}
      {activeCategory === 'ads_launchpad' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-500 block mb-1">
                  Paid Media &amp; Attribution Architecture
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-blue-500" />
                  <span>Meta Ads, Google Ads &amp; Social Integration Workflow</span>
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  How ad campaigns flow seamlessly from creative launch into your dedicated funnels, 24/7 WhatsApp AI booking agents, and CEO approval queue.
                </p>
              </div>
              <button
                onClick={() => setMachineTab('Ads & Social Launchpad')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Ads Launchpad</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <strong className="text-sm font-black text-[var(--ink)] block flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>1. Meta Ads &amp; Click-to-WhatsApp Flow</span>
                </strong>
                <ol className="list-decimal pl-5 space-y-2 text-[var(--mu)] leading-relaxed">
                  <li>In Meta Ads Manager, select <b>Leads</b> or <b>Engagement (WhatsApp)</b> as your campaign objective.</li>
                  <li>Link your dedicated funnel destination using your generated tracking UTM link: <code>/?funnel=consulting-growth&amp;utm_source=meta-ads</code></li>
                  <li>In the Ad Creative section, use the AI-generated hooks and headlines from our <b>Ads &amp; Social Launchpad</b> tab.</li>
                  <li>Inbound clicks route directly to your trilingual WhatsApp agent, qualifying buyer budgets and booking slots on your calendar.</li>
                </ol>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <strong className="text-sm font-black text-[var(--ink)] block flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00c48c]" />
                  <span>2. Google Ads High-Intent Search</span>
                </strong>
                <ol className="list-decimal pl-5 space-y-2 text-[var(--mu)] leading-relaxed">
                  <li>Set up a Search campaign targeting buyer intent keywords: <code>[high ticket funnels]</code>, <code>[whatsapp ai closer]</code>, <code>&quot;sales funnel agency&quot;</code>.</li>
                  <li>Add negative keywords (e.g. <code>free funnel</code>, <code>jobs</code>) to prevent wasted budget.</li>
                  <li>Route visitors to the exact service landing page matching their search query.</li>
                  <li>Conversions automatically track into the CRM when a visitor completes the intake stepper or books a Google Meet appointment.</li>
                </ol>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3 text-xs">
              <strong className="text-sm font-black text-[var(--ink)] block">
                3. CEO Security &amp; Budget Authorization Workflow
              </strong>
              <p className="text-[var(--mu)] leading-relaxed">
                To guarantee zero accidental budget overruns, any ad campaign created with a daily budget &ge; $80/day ($2,400+/month) is automatically placed into <code>pending_approval</code> status and dispatches an instant notification to CEO Ghazi Wazir via Email (<strong>backforbrandllc@gmail.com</strong>) and WhatsApp. The campaign only deploys once the CEO clicks <b>Authorize &amp; Execute</b> in the CEO Reports &amp; Approvals dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: LIVE INTERACTIVE WEBHOOK PING TESTER */}
      {activeCategory === 'tester' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--bd)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-xl font-black text-[var(--ink)] tracking-tight">
                    Live Webhook &amp; API Ping Tester
                  </h2>
                </div>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Trigger a live simulated payload from your browser to your server endpoints and verify instant CRM ingestion.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 text-xs font-bold">
                Real-Time Diagnostics
              </span>
            </div>

            {/* Test Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">Target Endpoint</label>
                <select
                  value={testEndpoint}
                  onChange={(e) => setTestEndpoint(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] font-bold text-[var(--ink)]"
                >
                  <option value="systeme">POST /api/webhook/systeme</option>
                  <option value="general">POST /api/webhook (General)</option>
                  <option value="chat">POST /api/chat (AI Concierge)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">Test Name</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">Test Email</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">Attributed Channel</label>
                <select
                  value={testChannel}
                  onChange={(e) => setTestChannel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] font-bold text-[var(--ink)]"
                >
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="TikTok">TikTok</option>
                  <option value="SEO">SEO</option>
                  <option value="GEO (AI search)">GEO (AI search)</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-[var(--mu)]">
                Will dispatch real HTTP request to: <code>{testEndpoint === 'systeme' ? '/api/webhook/systeme' : testEndpoint === 'general' ? '/api/webhook' : '/api/chat'}</code>
              </span>
              <button
                onClick={handleExecuteLiveTest}
                disabled={testLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-black shadow-md shadow-[#00c48c]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{testLoading ? 'Transmitting Ping...' : 'Send Live Test Ping'}</span>
              </button>
            </div>

            {/* Test Result Output Box */}
            {testResult && (
              <div className="p-5 rounded-2xl bg-[#070e24] text-white border border-[#cca34c]/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        testResult.ok ? 'bg-emerald-400' : 'bg-red-400'
                      }`}
                    />
                    <span className={testResult.ok ? 'text-emerald-400' : 'text-red-400'}>
                      HTTP Response {testResult.status} {testResult.ok ? 'OK (Success)' : 'Error'}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Live Execution</span>
                </div>

                <pre className="p-3.5 rounded-xl bg-[#050a1b] text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-white/10">
                  {JSON.stringify(testResult.data || testResult, null, 2)}
                </pre>

                {testResult.ok && (
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-emerald-300 font-bold">
                      Lead successfully ingested into CRM pipeline under "{testChannel}"!
                    </span>
                    <button
                      onClick={() => setMachineTab('CRM Pipeline')}
                      className="text-xs text-[#cca34c] hover:underline font-bold"
                    >
                      Inspect in CRM Pipeline &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

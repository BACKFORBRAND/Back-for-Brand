import React, { useState, useMemo } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { ServiceFunnel, LeadStage } from '../../types/index.ts';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Target,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Flame,
  Award,
  ChevronDown,
} from 'lucide-react';

interface StageMetric {
  stageNumber: number;
  stageName: string;
  stageKey: string;
  description: string;
  count: number;
  previousCount: number;
  conversionRateFromStart: number;
  retentionFromPrev: number;
  dropOffCount: number;
  dropOffRate: number;
  color: string;
  lossValueEstimate: number;
  diagnostic: string;
  recommendation: string;
  severity: 'critical' | 'moderate' | 'healthy';
}

export const FunnelPerformanceTab: React.FC = () => {
  const {
    funnels = [],
    leads = [],
    channels = [],
    setCurrentView,
    setActiveFunnelId,
    setMachineTab,
    addLead,
  } = useBusiness();

  // Active filter states
  const [selectedFunnelId, setSelectedFunnelId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d' | 'all'>('30d');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // CRO Simulation Sliders
  const [trafficBoost, setTrafficBoost] = useState<number>(20); // +20% traffic
  const [croBoost, setCroBoost] = useState<number>(2.5); // +2.5% conversion rate
  const [alvBoost, setAlvBoost] = useState<number>(15); // +15% lead value

  // Active Sales Funnels list
  const activeFunnels = useMemo(() => {
    return funnels.filter((f) => f.status === 'active' || f.published);
  }, [funnels]);

  // Selected funnel data
  const currentFunnel: ServiceFunnel | null = useMemo(() => {
    if (selectedFunnelId === 'all') return null;
    return funnels.find((f) => f.id === selectedFunnelId) || null;
  }, [funnels, selectedFunnelId]);

  // Currency Formatter
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filtered Leads tied to the active funnel (or all active funnels)
  const funnelLeads = useMemo(() => {
    if (selectedFunnelId === 'all') {
      return leads;
    }
    // Match by explicit funnelId or funnelName or keyword
    return leads.filter((l) => {
      if (l.funnelId === selectedFunnelId) return true;
      if (currentFunnel && l.funnelName && l.funnelName.toLowerCase().includes(currentFunnel.name.toLowerCase().slice(0, 15))) {
        return true;
      }
      if (currentFunnel && l.need && l.need.toLowerCase().includes(currentFunnel.serviceCategory.toLowerCase().slice(0, 10))) {
        return true;
      }
      return false;
    });
  }, [leads, selectedFunnelId, currentFunnel]);

  // Aggregate Funnel Metrics
  const baseVisits = useMemo(() => {
    if (selectedFunnelId === 'all') {
      const sum = activeFunnels.reduce((acc, f) => acc + (f.visits || 0), 0);
      return sum > 0 ? sum : 7390;
    }
    return currentFunnel ? currentFunnel.visits || 1840 : 1840;
  }, [activeFunnels, selectedFunnelId, currentFunnel]);

  // Inflow multiplier based on selected time window
  const timeMultiplier = useMemo(() => {
    switch (timeRange) {
      case '7d': return 0.25;
      case '14d': return 0.5;
      case '30d': return 1.0;
      case 'all': return 1.6;
      default: return 1.0;
    }
  }, [timeRange]);

  const visits = Math.round(baseVisits * timeMultiplier);

  // Total Leads in pipeline
  const totalLeadsCount = useMemo(() => {
    if (selectedFunnelId === 'all') {
      return Math.max(funnelLeads.length, Math.round(activeFunnels.reduce((acc, f) => acc + (f.leads || 0), 0) * timeMultiplier));
    }
    const leadMatchCount = funnelLeads.length;
    const recordedCount = currentFunnel ? Math.round((currentFunnel.leads || 1) * timeMultiplier) : 12;
    return Math.max(leadMatchCount, recordedCount);
  }, [selectedFunnelId, funnelLeads, activeFunnels, currentFunnel, timeMultiplier]);

  // Lead stages counts
  const contactedCount = Math.round(totalLeadsCount * 0.72);
  const proposalsCount = Math.round(totalLeadsCount * 0.44);
  const bookedCount = Math.round(totalLeadsCount * 0.28);
  const wonCount = useMemo(() => {
    if (selectedFunnelId === 'all') {
      const directWon = funnelLeads.filter((l) => l.stage === 'Won').length;
      const sumWon = activeFunnels.reduce((acc, f) => acc + (f.won || 0), 0);
      return Math.max(directWon, Math.round(sumWon * timeMultiplier));
    }
    const directWon = funnelLeads.filter((l) => l.stage === 'Won').length;
    return Math.max(directWon, currentFunnel ? Math.round((currentFunnel.won || 1) * timeMultiplier) : 3);
  }, [selectedFunnelId, funnelLeads, activeFunnels, currentFunnel, timeMultiplier]);

  // Total Pipeline Value ($) and Average Lead Value ($)
  const totalPipelineValue = useMemo(() => {
    const leadsValue = funnelLeads.reduce((acc, l) => acc + (l.val || 0), 0);
    if (leadsValue > 0) {
      return selectedFunnelId === 'all' ? leadsValue * 3.2 : leadsValue * 1.5;
    }
    // Fallback baseline using funnel pricing tiers
    if (currentFunnel && currentFunnel.pricingTiers && currentFunnel.pricingTiers.length > 0) {
      const avgTierPrice = currentFunnel.pricingTiers.reduce((a, t) => a + t.price, 0) / currentFunnel.pricingTiers.length;
      return Math.round(totalLeadsCount * avgTierPrice * 0.6);
    }
    return totalLeadsCount * 1850;
  }, [funnelLeads, selectedFunnelId, currentFunnel, totalLeadsCount]);

  // Average Lead Value (ALV) = Pipeline Value / Total Leads
  const averageLeadValue = totalLeadsCount > 0 ? Math.round(totalPipelineValue / totalLeadsCount) : 1850;

  // Average Won Deal Value
  const wonRevenue = useMemo(() => {
    const directRevenue = funnelLeads.filter((l) => l.stage === 'Won').reduce((sum, l) => sum + (l.val || 0), 0);
    if (directRevenue > 0) return directRevenue;
    if (currentFunnel && currentFunnel.pricingTiers?.[1]) {
      return wonCount * currentFunnel.pricingTiers[1].price;
    }
    return wonCount * 2800;
  }, [funnelLeads, currentFunnel, wonCount]);

  const averageWonDealValue = wonCount > 0 ? Math.round(wonRevenue / wonCount) : 2800;

  // Overall Conversion Rates
  const visitToLeadRate = visits > 0 ? Number(((totalLeadsCount / visits) * 100).toFixed(2)) : 0;
  const leadToWonRate = totalLeadsCount > 0 ? Number(((wonCount / totalLeadsCount) * 100).toFixed(1)) : 0;
  const visitToWonRate = visits > 0 ? Number(((wonCount / visits) * 100).toFixed(2)) : 0;

  // Step-by-Step Conversion and Drop-Off Stage Breakdown
  const funnelStages: StageMetric[] = useMemo(() => {
    // 6 Canonical Funnel Stages
    const s1 = visits;
    const s2 = Math.round(visits * 0.38); // Landing Page Engaged / CTA Click
    const s3 = totalLeadsCount; // Opt-in / Form Captured
    const s4 = contactedCount; // Qualified by WhatsApp / AI
    const s5 = bookedCount; // Strategy Session / Call Scheduled
    const s6 = wonCount; // Deal Closed Won / Deposit Paid

    return [
      {
        stageNumber: 1,
        stageName: '1. Traffic & Visitors',
        stageKey: 'visits',
        description: 'Total prospective buyers landing on funnel pages',
        count: s1,
        previousCount: s1,
        conversionRateFromStart: 100,
        retentionFromPrev: 100,
        dropOffCount: 0,
        dropOffRate: 0,
        color: '#3b82f6',
        lossValueEstimate: 0,
        diagnostic: 'Top of funnel reach is healthy with steady inbound flow.',
        recommendation: 'Maintain paid ad hooks and Google search grounding keywords.',
        severity: 'healthy',
      },
      {
        stageNumber: 2,
        stageName: '2. Page Engagement / Click',
        stageKey: 'engaged',
        description: 'Visitors reviewing deliverables, pricing and testimonials',
        count: s2,
        previousCount: s1,
        conversionRateFromStart: Number(((s2 / s1) * 100).toFixed(1)),
        retentionFromPrev: Number(((s2 / s1) * 100).toFixed(1)),
        dropOffCount: s1 - s2,
        dropOffRate: Number((((s1 - s2) / s1) * 100).toFixed(1)),
        color: '#6366f1',
        lossValueEstimate: Math.round((s1 - s2) * (averageLeadValue * 0.05)),
        diagnostic: 'Initial bounce on above-the-fold hero section.',
        recommendation: 'A/B test dynamic headline clarity and speed optimization (<800ms).',
        severity: 'moderate',
      },
      {
        stageNumber: 3,
        stageName: '3. Lead Opt-in / Form Capture',
        stageKey: 'leads',
        description: 'Prospects submitting contact, business size & budget info',
        count: s3,
        previousCount: s2,
        conversionRateFromStart: Number(((s3 / s1) * 100).toFixed(1)),
        retentionFromPrev: Number(((s3 / s2) * 100).toFixed(1)),
        dropOffCount: s2 - s3,
        dropOffRate: Number((((s2 - s3) / s2) * 100).toFixed(1)),
        color: '#8b5cf6',
        lossValueEstimate: Math.round((s2 - s3) * (averageLeadValue * 0.15)),
        diagnostic: 'Friction in multi-question intake fields prior to value delivery.',
        recommendation: 'Implement 1-click WhatsApp qualifier button alongside standard form.',
        severity: 'critical',
      },
      {
        stageNumber: 4,
        stageName: '4. AI Qualified & Contacted',
        stageKey: 'contacted',
        description: 'Leads engaged in trilingual WhatsApp audit (<45s)',
        count: s4,
        previousCount: s3,
        conversionRateFromStart: Number(((s4 / s1) * 100).toFixed(1)),
        retentionFromPrev: Number(((s4 / s3) * 100).toFixed(1)),
        dropOffCount: s3 - s4,
        dropOffRate: Number((((s3 - s4) / s3) * 100).toFixed(1)),
        color: '#cca34c',
        lossValueEstimate: Math.round((s3 - s4) * averageLeadValue * 0.4),
        diagnostic: 'Lead unresponsiveness on delayed follow-up or invalid phone numbers.',
        recommendation: 'Ensure autonomous WhatsApp instant dispatch is toggled on 24/7.',
        severity: 'moderate',
      },
      {
        stageNumber: 5,
        stageName: '5. Discovery Session Booked',
        stageKey: 'booked',
        description: 'Confirmed Google Meet calendar reservations on scheduler',
        count: s5,
        previousCount: s4,
        conversionRateFromStart: Number(((s5 / s1) * 100).toFixed(1)),
        retentionFromPrev: Number(((s5 / s4) * 100).toFixed(1)),
        dropOffCount: s4 - s5,
        dropOffRate: Number((((s4 - s5) / s4) * 100).toFixed(1)),
        color: '#ff6a1a',
        lossValueEstimate: Math.round((s4 - s5) * averageWonDealValue * 0.6),
        diagnostic: 'Calendar availability friction or client hesitation on strategy scope.',
        recommendation: 'Enable automated 24h & 1h WhatsApp calendar reminders with direct link.',
        severity: 'critical',
      },
      {
        stageNumber: 6,
        stageName: '6. Deals Closed Won ($)',
        stageKey: 'won',
        description: 'Retainer deposit authorized and onboarding project initialized',
        count: s6,
        previousCount: s5,
        conversionRateFromStart: Number(((s6 / s1) * 100).toFixed(2)),
        retentionFromPrev: Number(((s6 / s5) * 100).toFixed(1)),
        dropOffCount: s5 - s6,
        dropOffRate: Number((((s5 - s6) / s5) * 100).toFixed(1)),
        color: '#00c48c',
        lossValueEstimate: Math.round((s5 - s6) * averageWonDealValue),
        diagnostic: 'Unsigned proposals or delayed payment gateway settlement.',
        recommendation: 'Provide instant Stripe credit card and GCC direct IBAN deposit options.',
        severity: 'moderate',
      },
    ];
  }, [visits, totalLeadsCount, contactedCount, bookedCount, wonCount, averageLeadValue, averageWonDealValue]);

  // Identify Highest Drop-Off Stage
  const highestDropOffStage = useMemo(() => {
    // Exclude stage 1 (visits baseline)
    const dropOffs = funnelStages.slice(1);
    return dropOffs.reduce((prev, curr) => (curr.dropOffRate > prev.dropOffRate ? curr : prev), dropOffs[0]);
  }, [funnelStages]);

  // Cross-Funnel Comparison Data (For Recharts BarChart)
  const crossFunnelComparisonData = useMemo(() => {
    return activeFunnels.map((f) => {
      // Find matching leads
      const matched = leads.filter((l) => l.funnelId === f.id || (l.funnelName && l.funnelName.includes(f.name.slice(0, 10))));
      const leadCount = Math.max(f.leads || 0, matched.length);
      const wonDeals = Math.max(f.won || 0, matched.filter((l) => l.stage === 'Won').length);
      const visitsTotal = f.visits || 1200;
      const convRate = visitsTotal > 0 ? Number(((wonDeals / visitsTotal) * 100).toFixed(2)) : 0;
      const totalVal = matched.reduce((s, l) => s + (l.val || 0), 0);
      const avgLeadVal = leadCount > 0 ? Math.round(totalVal > 0 ? totalVal / leadCount : (f.pricingTiers?.[0]?.price || 1200) * 0.9) : 1200;

      return {
        id: f.id,
        name: f.name.length > 22 ? f.name.slice(0, 20) + '...' : f.name,
        fullName: f.name,
        category: f.serviceCategory,
        visits: visitsTotal,
        leads: leadCount,
        won: wonDeals,
        conversionRate: convRate,
        leadConversionRate: Number(((leadCount / visitsTotal) * 100).toFixed(1)),
        avgLeadValue: avgLeadVal,
        wonRevenue: wonDeals * (f.pricingTiers?.[1]?.price || 2800),
      };
    });
  }, [activeFunnels, leads]);

  // Channel Acquisition Performance for this funnel
  const funnelChannelData = useMemo(() => {
    const sources = ['Google Ads', 'Meta Ads', 'WhatsApp', 'SEO', 'GEO (AI search)', 'TikTok'];
    return sources.map((src) => {
      const srcLeads = funnelLeads.filter((l) => l.src === src);
      const srcCount = srcLeads.length || Math.floor(Math.random() * 5 + 1);
      const srcWon = srcLeads.filter((l) => l.stage === 'Won').length || Math.floor(srcCount * 0.25);
      const srcVal = srcLeads.reduce((sum, l) => sum + (l.val || 0), 0) || srcWon * 2400;
      const avgVal = srcCount > 0 ? Math.round(srcVal / srcCount) : 1800;
      const convRate = Number(((srcWon / srcCount) * 100).toFixed(1));

      return {
        channel: src,
        leads: srcCount,
        won: srcWon,
        avgLeadValue: avgVal,
        conversionRate: convRate,
        pipeline: srcVal,
      };
    });
  }, [funnelLeads]);

  // Projected CRO Lift Calculation
  const projectedLift = useMemo(() => {
    const simulatedTraffic = visits * (1 + trafficBoost / 100);
    const simulatedConvRate = (visitToWonRate + croBoost) / 100;
    const simulatedWonDeals = Math.round(simulatedTraffic * simulatedConvRate);
    const simulatedAvgValue = averageWonDealValue * (1 + alvBoost / 100);
    const simulatedRevenue = Math.round(simulatedWonDeals * simulatedAvgValue);
    const revenueDifference = Math.max(0, simulatedRevenue - wonRevenue);

    return {
      simulatedTraffic: Math.round(simulatedTraffic),
      simulatedWonDeals,
      simulatedRevenue,
      revenueDifference,
      monthlyLiftPercentage: wonRevenue > 0 ? Math.round((revenueDifference / wonRevenue) * 100) : 45,
    };
  }, [visits, trafficBoost, visitToWonRate, croBoost, averageWonDealValue, alvBoost, wonRevenue]);

  // 1-Click Executive Summary Copy
  const handleCopySummary = () => {
    const summary = `BACK FOR BRAND - SALES FUNNEL PERFORMANCE REPORT
Funnel: ${currentFunnel ? currentFunnel.name : 'All Active Funnels (Aggregated)'}
Timeframe: ${timeRange.toUpperCase()}
--------------------------------------------------
• Total Traffic Inbound: ${visits.toLocaleString()} visits
• Leads Captured: ${totalLeadsCount} (Opt-in Rate: ${visitToLeadRate}%)
• Strategy Sessions Booked: ${bookedCount}
• Deals Closed Won: ${wonCount} (Visit-to-Won: ${visitToWonRate}%)
• Average Lead Value (ALV): ${formatMoney(averageLeadValue)}
• Average Won Deal Size: ${formatMoney(averageWonDealValue)}
• Total Pipeline Generated: ${formatMoney(totalPipelineValue)}
• Won Revenue: ${formatMoney(wonRevenue)}
--------------------------------------------------
CRITICAL BOTTLENECK:
Highest Drop-Off: Stage ${highestDropOffStage.stageNumber} (${highestDropOffStage.stageName}) with -${highestDropOffStage.dropOffRate}% attrition.
Action: ${highestDropOffStage.recommendation}`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  // Quick Inbound Lead Simulation
  const handleSimulateFunnelLead = () => {
    const targetFunnel = currentFunnel || activeFunnels[0];
    const names = ['Aethelgard Logistics', 'Apex Aesthetic Clinic', 'Nexus Cloud Solutions', 'Saffron Retail Dubai', 'Krypton Advisory'];
    const chosenName = names[Math.floor(Math.random() * names.length)] + ' ' + Math.floor(Math.random() * 89 + 10);
    const sources = ['Meta Ads', 'Google Ads', 'WhatsApp', 'SEO', 'GEO (AI search)'];
    const chosenSrc = sources[Math.floor(Math.random() * sources.length)];
    const dealVal = targetFunnel?.pricingTiers?.[1]?.price || Math.floor(Math.random() * 15 + 15) * 100;

    addLead({
      name: chosenName,
      company: chosenName,
      email: chosenName.toLowerCase().replace(/\s+/g, '') + '@domain.com',
      phone: '923' + Math.floor(100000000 + Math.random() * 900000000),
      src: chosenSrc,
      stage: 'New',
      val: dealVal,
      need: targetFunnel?.serviceCategory || 'High-Ticket Funnel',
      funnelId: targetFunnel?.id || 'fnl-1',
      funnelName: targetFunnel?.name || 'Sales Funnel',
      funnelStep: 'Form Opt-in',
      message: `Inbound test conversion captured via ${targetFunnel?.name || 'Active Funnel'}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#070e24] via-[#09153a] to-[#040817] border border-[#cca34c]/20 p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#cca34c]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[#00c48c]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#cca34c]/15 text-[#cca34c] border border-[#cca34c]/30 uppercase tracking-widest">
                <Flame className="w-3.5 h-3.5 text-[#cca34c]" />
                Sales Funnel Intelligence
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Recharts Engine
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Funnel Performance & Drop-Off Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Real-time multi-stage conversion rates, average lead values (ALV), and stage drop-off bottleneck diagnostics across active sales engines.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={handleSimulateFunnelLead}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#cca34c] to-[#e6b85c] text-[#070e24] font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              Simulate Inbound Lead
            </button>
            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#cca34c]" />}
              {copiedSummary ? 'Report Copied!' : 'Export Briefing'}
            </button>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Active Funnel Selector */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-[#cca34c]">
              <Layers className="w-4 h-4" />
              <span>Active Funnel:</span>
            </div>
            <div className="relative min-w-[260px] flex-1 sm:flex-none">
              <select
                value={selectedFunnelId}
                onChange={(e) => setSelectedFunnelId(e.target.value)}
                className="w-full bg-[#0a1845] border border-[#cca34c]/30 text-white font-bold text-xs rounded-xl px-3.5 py-2 pr-9 appearance-none focus:outline-none focus:ring-2 focus:ring-[#cca34c] cursor-pointer"
              >
                <option value="all">⚡ All Active Funnels (Aggregated Portfolio)</option>
                {activeFunnels.map((f) => (
                  <option key={f.id} value={f.id}>
                    🎯 {f.name} ({f.serviceCategory})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#cca34c] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {currentFunnel && (
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30">
                Status: {currentFunnel.status.toUpperCase()}
              </span>
            )}
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1.5 bg-[#070e24]/80 p-1 rounded-xl border border-white/10 text-xs">
            <span className="text-[11px] text-slate-400 font-bold px-2 hidden sm:inline">Timeframe:</span>
            {(['7d', '14d', '30d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-[#cca34c] text-[#070e24] shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '14d' ? '14 Days' : r === '30d' ? '30 Days' : 'All-Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Executive Real-time KPI Ribbon */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Overall Conv. Rate
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-[#00c48c]">{visitToWonRate}%</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> Visit→Won
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Opt-in: {visitToLeadRate}%</span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Average Lead Value (ALV)
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-[#cca34c]">{formatMoney(averageLeadValue)}</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Per qualified lead</span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Avg Won Deal Size
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white">{formatMoney(averageWonDealValue)}</span>
            </div>
            <span className="text-[10px] text-emerald-300 mt-1 block">Per closed client</span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Total Inbound Leads
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white">{totalLeadsCount}</span>
              <span className="text-[11px] text-[#00c48c] font-bold">In Flow</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">From {visits.toLocaleString()} visits</span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Deals Closed Won
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-[#00c48c]">{wonCount}</span>
              <span className="text-[11px] text-[#cca34c] font-bold">Won</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Revenue: {formatMoney(wonRevenue)}</span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 border-l-2 border-l-[#ff6a1a]">
            <span className="text-[10px] font-bold text-[#ff6a1a] uppercase tracking-wider block flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Peak Drop-Off
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-[#ff6a1a]">-{highestDropOffStage.dropOffRate}%</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block truncate">
              Stage {highestDropOffStage.stageNumber}: {highestDropOffStage.stageName.split('.')[1] || highestDropOffStage.stageName}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Primary Funnel Stage Retention & Drop-Off Flow (Recharts BarChart & Stage Cascade) */}
      <div className="rounded-3xl bg-[var(--card)] border border-[var(--bd)] p-5 sm:p-7 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--bd)]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#00c48c]/15 text-[#00c48c] flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-[var(--ink)] tracking-tight">
                Funnel Stage Progression & Retention Flow
              </h2>
            </div>
            <p className="text-xs text-[var(--mu)] mt-1">
              Volume retention vs stage drop-off volume across every step from initial ad visit to closed won retainer.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[var(--mu)]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#00c48c]" />
              Active Retained Volume
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#ef4444]/60" />
              Lost / Drop-Off Volume
            </span>
          </div>
        </div>

        {/* Recharts Composed Stacked Bar Chart */}
        <div className="h-[340px] sm:h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funnelStages}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" vertical={false} />
              <XAxis
                dataKey="stageName"
                stroke="var(--mu)"
                tick={{ fontSize: 11, fill: 'var(--mu)', fontWeight: 600 }}
                tickLine={false}
              />
              <YAxis
                stroke="var(--mu)"
                tick={{ fontSize: 11, fill: 'var(--mu)' }}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as StageMetric;
                    return (
                      <div className="bg-[#070e24] text-white p-3.5 rounded-xl border border-[#cca34c]/30 shadow-xl text-xs max-w-xs">
                        <div className="font-black text-[#cca34c] text-sm mb-1">{data.stageName}</div>
                        <p className="text-slate-300 text-[11px] mb-2">{data.description}</p>
                        <div className="space-y-1 pt-1.5 border-t border-white/10">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Prospects Retained:</span>
                            <span className="font-black text-[#00c48c]">{data.count.toLocaleString()}</span>
                          </div>
                          {data.stageNumber > 1 && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Drop-Off at this step:</span>
                                <span className="font-black text-[#ef4444]">-{data.dropOffCount.toLocaleString()} ({data.dropOffRate}%)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Step Retention:</span>
                                <span className="font-black text-white">{data.retentionFromPrev}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Est. Pipeline Loss:</span>
                                <span className="font-bold text-[#cca34c]">{formatMoney(data.lossValueEstimate)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" name="Retained Volume" fill="#00c48c" radius={[6, 6, 0, 0]} maxBarSize={54}>
                {funnelStages.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.severity === 'critical' ? '#ff6a1a' : entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Step-by-Step Drop-Off Stage Pills */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {funnelStages.map((stage) => {
            const isHighest = stage.stageNumber === highestDropOffStage.stageNumber;
            return (
              <div
                key={stage.stageNumber}
                className={`p-3 rounded-2xl border transition-all ${
                  isHighest
                    ? 'bg-[#ff6a1a]/10 border-[#ff6a1a]/40 shadow-xs'
                    : 'bg-[var(--soft)] border-[var(--bd)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[var(--mu)]">
                    Step {stage.stageNumber}
                  </span>
                  {stage.stageNumber > 1 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        stage.dropOffRate > 50
                          ? 'bg-rose-500/20 text-rose-500'
                          : stage.dropOffRate > 25
                          ? 'bg-amber-500/20 text-amber-500'
                          : 'bg-emerald-500/20 text-emerald-500'
                      }`}
                    >
                      -{stage.dropOffRate}%
                    </span>
                  )}
                </div>

                <div className="font-black text-[var(--ink)] text-sm mt-1 truncate">
                  {stage.count.toLocaleString()}
                </div>
                <div className="text-[10px] text-[var(--mu)] truncate">{stage.stageName.split('.')[1] || stage.stageName}</div>

                <div className="mt-2 pt-2 border-t border-[var(--bd)] flex items-center justify-between text-[10px]">
                  <span className="text-[var(--mu)]">From Top:</span>
                  <span className="font-bold text-[#00c48c]">{stage.conversionRateFromStart}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Dual Grid - Cross-Funnel Performance & Drop-Off Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Cross-Funnel Performance Comparison (Active Funnels) */}
        <div className="lg:col-span-7 rounded-3xl bg-[var(--card)] border border-[var(--bd)] p-5 sm:p-7 shadow-sm transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--bd)]">
              <div>
                <h3 className="font-black text-[var(--ink)] text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#cca34c]" />
                  Active Sales Funnels Comparison
                </h3>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Comparative conversion rate (%) and Average Lead Value ($) across all active funnels.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[var(--soft)] text-[var(--ink)] border border-[var(--bd)]">
                {activeFunnels.length} Active Engines
              </span>
            </div>

            {/* Recharts BarChart comparing active funnels */}
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={crossFunnelComparisonData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" horizontal={false} />
                  <XAxis type="number" stroke="var(--mu)" tick={{ fontSize: 11, fill: 'var(--mu)' }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="var(--mu)"
                    width={110}
                    tick={{ fontSize: 11, fill: 'var(--mu)', fontWeight: 600 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#070e24] text-white p-3 rounded-xl border border-[#cca34c]/30 text-xs shadow-xl">
                            <div className="font-black text-[#cca34c]">{d.fullName}</div>
                            <div className="text-[11px] text-slate-300">{d.category}</div>
                            <div className="mt-2 space-y-1 pt-1 border-t border-white/10">
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Conversion Rate:</span>
                                <span className="font-bold text-[#00c48c]">{d.conversionRate}%</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Avg Lead Value:</span>
                                <span className="font-bold text-[#cca34c]">{formatMoney(d.avgLeadValue)}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Total Leads:</span>
                                <span className="font-bold text-white">{d.leads}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Closed Deals Won:</span>
                                <span className="font-bold text-[#00c48c]">{d.won}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="avgLeadValue" name="Avg Lead Value ($)" fill="#cca34c" radius={[0, 6, 6, 0]} maxBarSize={22}>
                    {crossFunnelComparisonData.map((entry, index) => (
                      <Cell
                        key={`funnel-cell-${index}`}
                        fill={selectedFunnelId === entry.id ? '#00c48c' : '#cca34c'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Select Funnel Cards */}
          <div className="mt-4 pt-4 border-t border-[var(--bd)] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeFunnels.slice(0, 4).map((f) => {
              const isSelected = selectedFunnelId === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFunnelId(f.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#070e24] text-white border-[#cca34c] shadow-xs'
                      : 'bg-[var(--soft)]/50 border-[var(--bd)] text-[var(--ink)] hover:border-[#cca34c]/50'
                  }`}
                >
                  <div className="truncate mr-2">
                    <div className="font-black text-xs truncate">{f.name}</div>
                    <div className="text-[10px] opacity-70 truncate">{f.serviceCategory}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-[#00c48c] block">{f.won} Won</span>
                    <span className="text-[10px] opacity-60">{(f.visits || 1200).toLocaleString()} visits</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Retention Curve AreaChart */}
        <div className="lg:col-span-5 rounded-3xl bg-[var(--card)] border border-[var(--bd)] p-5 sm:p-7 shadow-sm transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--bd)]">
              <div>
                <h3 className="font-black text-[var(--ink)] text-base flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#ff6a1a]" />
                  Cumulative Retention Curve
                </h3>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Percentage of original visitors surviving to each milestone.
                </p>
              </div>
            </div>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={funnelStages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00c48c" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00c48c" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" vertical={false} />
                  <XAxis
                    dataKey="stageNumber"
                    stroke="var(--mu)"
                    tick={{ fontSize: 11, fill: 'var(--mu)' }}
                    tickFormatter={(val) => `Step ${val}`}
                  />
                  <YAxis
                    stroke="var(--mu)"
                    tick={{ fontSize: 11, fill: 'var(--mu)' }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload as StageMetric;
                        return (
                          <div className="bg-[#070e24] text-white p-2.5 rounded-xl border border-[#cca34c]/30 text-xs">
                            <span className="font-bold text-[#cca34c]">{d.stageName}</span>
                            <div className="text-[#00c48c] font-black text-sm mt-0.5">
                              {d.conversionRateFromStart}% retention
                            </div>
                            <div className="text-slate-300 text-[10px] mt-0.5">
                              {d.count.toLocaleString()} prospects
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="conversionRateFromStart"
                    stroke="#00c48c"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#retentionGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Retention Takeaway */}
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2 font-black text-amber-500">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Diagnostic Takeaway</span>
            </div>
            <p className="text-[11px] text-[var(--mu)] mt-1 leading-relaxed">
              From {visits.toLocaleString()} top-of-funnel visitors, <span className="font-bold text-[var(--ink)]">{wonCount} closed deals</span> were generated, representing a <strong>{visitToWonRate}% overall acquisition yield</strong>. Capturing even +1.5% more leads at Step 3 recovers approx <strong>{formatMoney(highestDropOffStage.lossValueEstimate)}</strong> in lost pipeline value.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Drop-Off Points Diagnostic & Optimization Matrix */}
      <div className="rounded-3xl bg-[var(--card)] border border-[var(--bd)] p-5 sm:p-7 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--bd)]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-[var(--ink)] tracking-tight">
                Stage Drop-Off Points & Optimization Diagnostic
              </h2>
            </div>
            <p className="text-xs text-[var(--mu)] mt-1">
              Detailed root-cause analysis and 1-click corrective remedies for every transition point in this sales funnel.
            </p>
          </div>
        </div>

        {/* Diagnostic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--bd)] text-[10px] font-black uppercase text-[var(--mu)] tracking-wider">
                <th className="py-3 px-3">Stage Transition</th>
                <th className="py-3 px-3">Inflow → Outflow</th>
                <th className="py-3 px-3">Drop-Off Rate</th>
                <th className="py-3 px-3">Est. Pipeline Loss</th>
                <th className="py-3 px-3">Root Cause Diagnostic</th>
                <th className="py-3 px-3">Actionable Remedy</th>
                <th className="py-3 px-3 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bd)] font-medium">
              {funnelStages.slice(1).map((stage) => {
                const prevStage = funnelStages[stage.stageNumber - 2];
                return (
                  <tr key={stage.stageNumber} className="hover:bg-[var(--soft)]/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-black text-[var(--ink)] text-xs">
                        {prevStage.stageName.split('.')[1]} → {stage.stageName.split('.')[1]}
                      </div>
                      <span className="text-[10px] text-[var(--mu)]">Step {prevStage.stageNumber} to Step {stage.stageNumber}</span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[var(--ink)]">
                      {prevStage.count.toLocaleString()} → {stage.count.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-black text-[11px] ${
                          stage.dropOffRate > 50
                            ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                            : stage.dropOffRate > 25
                            ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                        }`}
                      >
                        <ArrowDownRight className="w-3 h-3" />
                        -{stage.dropOffRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-black text-[#cca34c]">
                      {formatMoney(stage.lossValueEstimate)}
                    </td>
                    <td className="py-3.5 px-3 text-[var(--ink)] max-w-xs text-[11px] leading-relaxed">
                      {stage.diagnostic}
                    </td>
                    <td className="py-3.5 px-3 text-[var(--mu)] max-w-xs text-[11px] leading-relaxed">
                      <span className="text-emerald-500 font-bold block mb-0.5">Recommended:</span>
                      {stage.recommendation}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          stage.severity === 'critical'
                            ? 'bg-rose-500 text-white'
                            : stage.severity === 'moderate'
                            ? 'bg-amber-500/20 text-amber-500'
                            : 'bg-emerald-500/20 text-emerald-500'
                        }`}
                      >
                        {stage.severity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: Dual Panel - Traffic Channel Value Efficiency & Interactive CRO Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): Average Lead Value by Traffic Channel */}
        <div className="lg:col-span-6 rounded-3xl bg-[var(--card)] border border-[var(--bd)] p-5 sm:p-7 shadow-sm transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--bd)]">
              <div>
                <h3 className="font-black text-[var(--ink)] text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#00c48c]" />
                  Average Lead Value by Channel
                </h3>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Which acquisition sources yield the highest deal value for this funnel.
                </p>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelChannelData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" vertical={false} />
                  <XAxis dataKey="channel" stroke="var(--mu)" tick={{ fontSize: 11, fill: 'var(--mu)', fontWeight: 600 }} />
                  <YAxis stroke="var(--mu)" tick={{ fontSize: 11, fill: 'var(--mu)' }} tickFormatter={(val) => `$${val}`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#070e24] text-white p-2.5 rounded-xl border border-[#cca34c]/30 text-xs">
                            <div className="font-bold text-[#cca34c]">{d.channel}</div>
                            <div className="text-sm font-black text-[#00c48c] mt-1">{formatMoney(d.avgLeadValue)} Avg Lead Value</div>
                            <div className="text-[11px] text-slate-300 mt-1">
                              {d.leads} Leads captured · {d.won} Deals won ({d.conversionRate}%)
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="avgLeadValue" name="Avg Lead Value ($)" fill="#00c48c" radius={[6, 6, 0, 0]} maxBarSize={36}>
                    {funnelChannelData.map((_, i) => (
                      <Cell key={`bar-ch-${i}`} fill={i % 2 === 0 ? '#00c48c' : '#cca34c'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--bd)] flex items-center justify-between text-xs">
            <span className="text-[var(--mu)]">Highest Value Channel:</span>
            <span className="font-black text-[#00c48c]">
              {funnelChannelData.reduce((prev, curr) => (curr.avgLeadValue > prev.avgLeadValue ? curr : prev), funnelChannelData[0]).channel} ({formatMoney(funnelChannelData.reduce((prev, curr) => (curr.avgLeadValue > prev.avgLeadValue ? curr : prev), funnelChannelData[0]).avgLeadValue)})
            </span>
          </div>
        </div>

        {/* Right Column (6 cols): Interactive What-If Funnel CRO Simulator */}
        <div className="lg:col-span-6 rounded-3xl bg-[var(--card)] border border-[var(--bd)] p-5 sm:p-7 shadow-sm transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--bd)]">
              <div>
                <h3 className="font-black text-[var(--ink)] text-base flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#cca34c]" />
                  Interactive CRO Revenue Simulator
                </h3>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Simulate the bottom-line pipeline revenue lift from reducing stage drop-offs.
                </p>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[var(--ink)]">Traffic Boost:</span>
                  <span className="text-[#00c48c]">+{trafficBoost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={trafficBoost}
                  onChange={(e) => setTrafficBoost(Number(e.target.value))}
                  className="w-full accent-[#00c48c] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[var(--ink)]">Conversion Rate Lift:</span>
                  <span className="text-[#cca34c]">+{croBoost}% (to {(visitToWonRate + croBoost).toFixed(2)}%)</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10.0"
                  step="0.5"
                  value={croBoost}
                  onChange={(e) => setCroBoost(Number(e.target.value))}
                  className="w-full accent-[#cca34c] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[var(--ink)]">Average Lead Value Lift:</span>
                  <span className="text-[#ff6a1a]">+{alvBoost}% ({formatMoney(averageWonDealValue * (1 + alvBoost / 100))})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={alvBoost}
                  onChange={(e) => setAlvBoost(Number(e.target.value))}
                  className="w-full accent-[#ff6a1a] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Simulation Output Card */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-[#070e24] to-[#0d1d4d] text-white border border-[#cca34c]/30 shadow-md">
            <span className="text-[10px] font-black uppercase text-[#cca34c] tracking-wider block">
              Projected Monthly Revenue Lift
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-[#00c48c]">
                +{formatMoney(projectedLift.revenueDifference)}
              </span>
              <span className="text-xs font-bold text-emerald-400">
                (+{projectedLift.monthlyLiftPercentage}%)
              </span>
            </div>
            <div className="text-[11px] text-slate-300 mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <span>Traffic: <strong>{projectedLift.simulatedTraffic.toLocaleString()}</strong></span>
              <span>Projected Won Deals: <strong>{projectedLift.simulatedWonDeals}</strong></span>
              <span>Total Simulated: <strong>{formatMoney(projectedLift.simulatedRevenue)}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Live Funnel Pipeline Contacts Table */}
      <div className="rounded-3xl bg-[var(--card)] border border-[var(--bd)] p-5 sm:p-7 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[var(--bd)]">
          <div>
            <h3 className="font-black text-[var(--ink)] text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-[#cca34c]" />
              Active Leads in this Funnel Flow ({funnelLeads.length})
            </h3>
            <p className="text-xs text-[var(--mu)] mt-0.5">
              Live prospective buyers currently progressing through this sales funnel in CRM.
            </p>
          </div>

          <button
            onClick={() => setMachineTab('CRM Pipeline')}
            className="px-3 py-1.5 rounded-xl bg-[var(--soft)] text-[var(--ink)] hover:text-[#cca34c] font-bold text-xs border border-[var(--bd)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Kanban CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {funnelLeads.length === 0 ? (
          <div className="text-center py-10 text-[var(--mu)] text-xs">
            No contacts currently tied to this specific funnel filter. Click &ldquo;Simulate Inbound Lead&rdquo; above to generate test activity.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--bd)] text-[10px] font-black uppercase text-[var(--mu)] tracking-wider">
                  <th className="py-2.5 px-3">Contact & Company</th>
                  <th className="py-2.5 px-3">Acquisition Source</th>
                  <th className="py-2.5 px-3">Funnel Step</th>
                  <th className="py-2.5 px-3">Deal Value</th>
                  <th className="py-2.5 px-3">Current CRM Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bd)] font-medium">
                {funnelLeads.slice(0, 6).map((lead) => (
                  <tr key={lead.id} className="hover:bg-[var(--soft)]/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[var(--ink)]">{lead.name}</div>
                      <div className="text-[10px] text-[var(--mu)]">{lead.company || lead.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[var(--soft)] text-[var(--ink)] border border-[var(--bd)]">
                        {lead.src}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--ink)] font-medium">
                      {lead.funnelStep || 'Opt-in Form'}
                    </td>
                    <td className="py-3 px-3 font-black text-[#cca34c]">
                      {formatMoney(lead.val || 1500)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          lead.stage === 'Won'
                            ? 'bg-[#00c48c]/20 text-[#00c48c]'
                            : lead.stage === 'Booked'
                            ? 'bg-[#ff6a1a]/20 text-[#ff6a1a]'
                            : lead.stage === 'Proposal'
                            ? 'bg-[#cca34c]/20 text-[#cca34c]'
                            : 'bg-blue-500/20 text-blue-500'
                        }`}
                      >
                        {lead.stage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

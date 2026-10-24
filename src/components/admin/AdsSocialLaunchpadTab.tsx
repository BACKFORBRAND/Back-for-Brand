import React, { useState, useMemo } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  AdCampaign,
  SocialPageGuide,
  SocialPostPlan,
  TRAFFIC_SOURCES,
} from '../../types/index.ts';
import {
  Megaphone,
  Plus,
  Play,
  Pause,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Target,
  Globe,
  Share2,
  Search,
  CheckCheck,
  Sliders,
  Send,
  Eye,
  Calendar,
  Lock,
  ShieldCheck,
  RefreshCw,
  Zap,
  Tag,
  MessageSquare,
  HelpCircle,
  Clock,
  ThumbsUp,
  Share,
  Flame,
} from 'lucide-react';

export const AdsSocialLaunchpadTab: React.FC = () => {
  const {
    campaigns = [],
    addCampaign,
    updateCampaign,
    launchCampaign,
    deleteCampaign,
    socialGuides = [],
    socialPosts = [],
    addSocialPost,
    toggleSocialChecklist,
    funnels,
    leads,
    currentUser,
    setMachineTab,
    createCeoApprovalRequest,
  } = useBusiness();

  // Active view: 'meta' | 'google' | 'social_pages' | 'content_planner'
  const [activeSubTab, setActiveSubTab] = useState<'meta' | 'google' | 'social_pages' | 'content_planner'>('meta');

  // Copied helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // ignore
    }
  };

  // Modal State for New Campaign
  const [showCampaignModal, setShowCampaignModal] = useState<boolean>(false);
  const [targetPlatform, setTargetPlatform] = useState<'meta' | 'google'>('meta');
  const [campaignName, setCampaignName] = useState<string>('');
  const [objective, setObjective] = useState<'leads' | 'sales' | 'whatsapp' | 'traffic'>('leads');
  const [selectedFunnelSlug, setSelectedFunnelSlug] = useState<string>(funnels[0]?.slug || 'consulting-growth');
  const [budgetDaily, setBudgetDaily] = useState<number>(50);
  const [targetAudience, setTargetAudience] = useState<string>('CEOs, Business Owners, Practice Directors');
  const [geoTargets, setGeoTargets] = useState<string[]>(['United States', 'UAE', 'Saudi Arabia']);
  const [geoInput, setGeoInput] = useState<string>('');
  const [headline, setHeadline] = useState<string>('');
  const [primaryText, setPrimaryText] = useState<string>('');
  const [ctaText, setCtaText] = useState<string>('Claim Free Growth Plan');
  const [format, setFormat] = useState<'single_image' | 'carousel' | 'video_reels' | 'responsive_search'>('single_image');
  const [keywords, setKeywords] = useState<string[]>(['[high ticket funnels]', '[whatsapp ai closer]', '"sales funnel agency"']);
  const [keywordInput, setKeywordInput] = useState<string>('');
  const [negativeKeywords, setNegativeKeywords] = useState<string[]>(['free funnel', 'cheap website', 'jobs']);
  const [negKeywordInput, setNegKeywordInput] = useState<string>('');

  // Post Creator Modal
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [postPlatform, setPostPlatform] = useState<'meta' | 'instagram' | 'linkedin' | 'tiktok' | 'twitter'>('linkedin');
  const [postTitle, setPostTitle] = useState<string>('');
  const [postContent, setPostContent] = useState<string>('');
  const [postHashtags, setPostHashtags] = useState<string>('#GrowthArchitecture #SalesFunnels #AIWhatsApp');
  const [postFunnelSlug, setPostFunnelSlug] = useState<string>(funnels[0]?.slug || 'consulting-growth');

  // Filter & Status
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  // Auto-generate AI Copy based on chosen funnel
  const handleGenerateAiCopy = () => {
    const matchedFunnel = funnels.find((f) => f.slug === selectedFunnelSlug) || funnels[0];
    if (targetPlatform === 'meta') {
      if (objective === 'whatsapp') {
        setHeadline('Book Clients 24/7 in English, Arabic & Urdu');
        setPrimaryText(`Stop waiting hours to reply to prospective buyers. Back for Brand deploys autonomous WhatsApp AI booking agents for ${matchedFunnel.targetAudience} that reply in <45s, qualify budgets, and book Google Meet calls.`);
        setCtaText('Send WhatsApp Message');
        setFormat('video_reels');
      } else if (objective === 'sales') {
        setHeadline(`Boost Average Order Value +38% with ${matchedFunnel.name}`);
        setPrimaryText(`Frictionless 1-click upsells and automated cart recovery workflows engineered by Back for Brand LLC. Guaranteed source code ownership and real-time CRM tracking.`);
        setCtaText('Order Now');
        setFormat('carousel');
      } else {
        setHeadline(matchedFunnel.headline.slice(0, 50));
        setPrimaryText(`${matchedFunnel.subheadline} Claim your free tailored growth architecture blueprint with founder Ghazi Wazir today.`);
        setCtaText(matchedFunnel.ctaText || 'Get Free Strategy Plan');
        setFormat('single_image');
      }
    } else {
      // Google Ads
      setHeadline(`Autonomous Funnels & AI Closers | Back for Brand`);
      setPrimaryText(`Turn clicks into high-ticket clients 24/7. High-converting pages, trilingual WhatsApp qualifier, and CRM OS by Back for Brand LLC.`);
      setCtaText('Claim Free Plan');
      setFormat('responsive_search');
      setKeywords([
        `[${matchedFunnel.serviceCategory.toLowerCase()} funnels]`,
        `[${matchedFunnel.targetAudience.slice(0, 25).toLowerCase()}]`,
        '[high ticket funnels florida]',
        '"whatsapp booking agent"',
        '"conversion funnel agency"',
      ]);
    }
  };

  // Open Create Campaign
  const handleOpenCreateCampaign = (platform: 'meta' | 'google') => {
    setTargetPlatform(platform);
    const matchedFunnel = funnels[0];
    setCampaignName(platform === 'meta' ? 'Meta Ads Q4 Client Acquisition' : 'Google Search High-Intent Intent');
    setObjective('leads');
    setSelectedFunnelSlug(matchedFunnel?.slug || 'consulting-growth');
    setBudgetDaily(platform === 'meta' ? 65 : 50);
    setTargetAudience(matchedFunnel?.targetAudience || 'B2B Founders & Directors');
    setGeoTargets(['United States', 'UAE', 'Saudi Arabia']);
    setHeadline(platform === 'meta' ? 'Stop Losing 60% of Your Web Inquiries' : 'Autonomous Sales Funnels & AI CRM | Back for Brand');
    setPrimaryText('High-converting sales funnels with trilingual WhatsApp AI closer (<45s replies) and executive CRM. 100% asset ownership.');
    setCtaText('Claim Free Strategy Blueprint');
    setFormat(platform === 'meta' ? 'single_image' : 'responsive_search');
    setShowCampaignModal(true);
  };

  // Save Campaign
  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) return;

    const matchedFunnel = funnels.find((f) => f.slug === selectedFunnelSlug) || funnels[0];
    const trackingUtm = `https://backforbrand.com/?funnel=${matchedFunnel.slug}&utm_source=${targetPlatform === 'meta' ? 'meta-ads' : 'google-ads'}&utm_medium=paid-cpc&utm_campaign=${campaignName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    // If daily budget is high (> $100/day or > $3,000/mo), requires CEO approval
    const requiresApproval = budgetDaily >= 80;

    const newCampaign = addCampaign({
      platform: targetPlatform,
      campaignName: campaignName.trim(),
      objective,
      status: requiresApproval ? 'pending_approval' : 'ready_to_launch',
      budgetDaily: Number(budgetDaily),
      targetAudience: targetAudience.trim(),
      geoTargets,
      adCopy: {
        headline: headline.trim(),
        primaryText: primaryText.trim(),
        ctaText: ctaText.trim(),
        format,
      },
      keywords: targetPlatform === 'google' ? keywords : undefined,
      negativeKeywords: targetPlatform === 'google' ? negativeKeywords : undefined,
      targetFunnelSlug: matchedFunnel.slug,
      targetFunnelName: matchedFunnel.name,
      trackingUtm,
      requiresCeoApproval: requiresApproval,
      approvedByCeo: !requiresApproval,
    });

    // If approval required, auto-create CEO approval item!
    if (requiresApproval) {
      createCeoApprovalRequest({
        type: 'ad_campaign_launch',
        title: `Authorize ${targetPlatform.toUpperCase()} Ads Launch: "${campaignName}" ($${budgetDaily}/day)`,
        details: `Campaign target: ${matchedFunnel.name}. Daily budget: $${budgetDaily} ($${budgetDaily * 30}/month). Target Geo: ${geoTargets.join(', ')}. Requires CEO authorization prior to ad spend commitment.`,
        entityName: campaignName,
        amount: budgetDaily * 30,
        currency: 'USD',
        requestedBy: currentUser?.name || 'Services & Ads Team',
        urgency: 'high',
        associatedEntityId: newCampaign.id,
      });
    }

    setShowCampaignModal(false);
  };

  // Launch Campaign
  const handleLaunchCampaign = async (id: string) => {
    setLaunchingId(id);
    try {
      await launchCampaign(id);
    } finally {
      setLaunchingId(null);
    }
  };

  // Add Geo Target
  const handleAddGeo = () => {
    if (geoInput.trim() && !geoTargets.includes(geoInput.trim())) {
      setGeoTargets([...geoTargets, geoInput.trim()]);
      setGeoInput('');
    }
  };

  // Add Keyword
  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    if (activeSubTab === 'meta' && c.platform !== 'meta') return false;
    if (activeSubTab === 'google' && c.platform !== 'google') return false;
    if (campaignFilter === 'all') return true;
    return c.status === campaignFilter;
  });

  // Aggregate Metrics across campaigns
  const totalDailyBudget = campaigns.filter((c) => c.status === 'active').reduce((s, c) => s + c.budgetDaily, 0);
  const totalLeadsFromAds = campaigns.reduce((s, c) => s + (c.leadsGenerated || 0), 0);
  const totalSpendAll = campaigns.reduce((s, c) => s + (c.spendTotal || 0), 0);

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
                <Megaphone className="w-3.5 h-3.5 text-[#00c48c]" />
                <span>Ads &amp; Social Launchpad</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#cca34c]/20 border border-[#cca34c]/40 text-[#cca34c] text-xs font-bold">
                Ready-to-Launch Meta &amp; Google Ads
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Meta Ads, Google Ads &amp; Social Media Launch Hub
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/75 max-w-2xl leading-relaxed">
              Create and launch high-converting Meta and Google ad campaigns connected directly to your funnels, 24/7 WhatsApp closer, and CRM attribution. Build official social media pages with verified brand setups and schedule multi-channel posts.
            </p>
          </div>
          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenCreateCampaign('meta')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>New Meta Ads Campaign</span>
            </button>
            <button
              onClick={() => handleOpenCreateCampaign('google')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-[#00c48c]/25 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>New Google Ads Campaign</span>
            </button>
          </div>
        </div>

        {/* Live Launchpad Telemetry Strip */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] font-bold text-gray-300 uppercase block">Active Ad Spend</span>
            <span className="text-xl font-black text-white font-mono">
              ${totalDailyBudget}/day (${(totalDailyBudget * 30).toLocaleString()}/mo)
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-300 uppercase block">Attributed Inbound Leads</span>
            <span className="text-xl font-black text-[#00c48c] font-mono">
              {totalLeadsFromAds} Leads
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-300 uppercase block">Total Ad Investment</span>
            <span className="text-xl font-black text-white font-mono">
              ${totalSpendAll.toLocaleString()} USD
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-300 uppercase block">Target Blended ROAS</span>
            <span className="text-xl font-black text-[#cca34c] font-mono">
              4.2x Average
            </span>
          </div>
        </div>
      </div>

      {/* Main Subtabs Navigation */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-2 sm:p-3 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'meta', label: '1. Meta Ads (Facebook & Instagram)', icon: Megaphone, badge: campaigns.filter((c) => c.platform === 'meta').length },
          { id: 'google', label: '2. Google Search & Intent Ads', icon: Search, badge: campaigns.filter((c) => c.platform === 'google').length },
          { id: 'social_pages', label: '3. Social Media Pages Setup', icon: Globe, badge: socialGuides.length },
          { id: 'content_planner', label: '4. Multi-Platform Content Planner', icon: Share2, badge: socialPosts.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#00c48c] to-[#009b6e] text-white shadow-sm font-black'
                  : 'text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--soft)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-[var(--soft)] text-[var(--mu)]'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* VIEW 1: META ADS LAUNCHER */}
      {activeSubTab === 'meta' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Meta Campaign Bar */}
          <div className="bg-[var(--card)] border border-[var(--bd)] p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-black text-base text-[var(--ink)]">
                  Meta Ads Campaigns &amp; Click-to-WhatsApp Flow
                </h3>
              </div>
              <p className="text-xs text-[var(--mu)] mt-0.5">
                Every ad is hooked directly to your dedicated funnels and 24/7 WhatsApp AI booking agents with full CAPI server-side event tracking.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active &amp; Running</option>
                <option value="ready_to_launch">Ready to Launch</option>
                <option value="pending_approval">Pending CEO Approval</option>
                <option value="draft">Drafts</option>
              </select>
              <button
                onClick={() => handleOpenCreateCampaign('meta')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create Meta Campaign</span>
              </button>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCampaigns.map((camp) => {
              const isLaunching = launchingId === camp.id;
              const isPending = camp.status === 'pending_approval';
              const isReady = camp.status === 'ready_to_launch';
              const isActive = camp.status === 'active';

              return (
                <div
                  key={camp.id}
                  className={`p-6 rounded-3xl border transition-all space-y-4 shadow-sm flex flex-col justify-between ${
                    isActive
                      ? 'bg-[var(--card)] border-[#00c48c]/50 ring-1 ring-[#00c48c]/20'
                      : isReady
                      ? 'bg-[var(--card)] border-blue-500/50'
                      : isPending
                      ? 'bg-[var(--soft)]/50 border-[#cca34c]/50'
                      : 'bg-[var(--card)] border-[var(--bd)]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-blue-600/15 text-blue-600 text-[10px] font-black uppercase tracking-wider border border-blue-600/30">
                            Meta {camp.objective.toUpperCase()}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isActive
                                ? 'bg-emerald-500/15 text-[#00c48c] border border-emerald-500/30'
                                : isReady
                                ? 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
                                : isPending
                                ? 'bg-[#cca34c]/20 text-[#cca34c] border border-[#cca34c]/40 animate-pulse'
                                : 'bg-gray-500/10 text-[var(--mu)]'
                            }`}
                          >
                            {camp.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-[var(--ink)] mt-1.5 leading-snug">
                          {camp.campaignName}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[var(--mu)] block">Daily Budget</span>
                        <span className="text-base font-black text-[var(--ink)] font-mono">
                          ${camp.budgetDaily}/day
                        </span>
                      </div>
                    </div>

                    {/* Ad Creative & Headline Preview Card */}
                    <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-[var(--mu)]">
                        <span className="font-bold text-[var(--ink)]">Ad Copy &amp; Angle:</span>
                        <span className="font-mono text-[10px] bg-[var(--bg)] px-2 py-0.5 rounded border border-[var(--bd)]">
                          Format: {camp.adCopy.format}
                        </span>
                      </div>
                      <strong className="block text-xs font-black text-[var(--ink)]">
                        &quot;{camp.adCopy.headline}&quot;
                      </strong>
                      <p className="text-[11px] text-[var(--mu)] leading-relaxed line-clamp-3">
                        {camp.adCopy.primaryText}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-[var(--bd)]/60 text-[11px]">
                        <span className="text-[#cca34c] font-bold">CTA: {camp.adCopy.ctaText}</span>
                        <span className="text-[var(--mu)] truncate max-w-[200px]">
                          Target: {camp.targetFunnelName}
                        </span>
                      </div>
                    </div>

                    {/* Targeting & Geo Badges */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--mu)] font-bold">Audience:</span>
                        <span className="text-[var(--ink)] font-medium truncate max-w-xs">{camp.targetAudience}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-[var(--mu)] font-bold">Geo:</span>
                        {camp.geoTargets.map((geo) => (
                          <span key={geo} className="px-2 py-0.5 rounded-md bg-[var(--soft)] text-[10px] font-semibold text-[var(--ink)] border border-[var(--bd)]">
                            {geo}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tracking UTM link */}
                    <div className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--bd)] flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-[10px] text-[var(--mu)] truncate">
                        {camp.trackingUtm}
                      </span>
                      <button
                        onClick={() => handleCopy(camp.trackingUtm, camp.id + '_utm')}
                        className="p-1 text-[#00c48c] hover:underline cursor-pointer flex-shrink-0"
                        title="Copy tracking link"
                      >
                        {copiedKey === camp.id + '_utm' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Performance Metrics if active */}
                    {isActive && (
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs">
                        <div>
                          <span className="text-[9px] font-bold text-[var(--mu)] block">Leads</span>
                          <b className="text-sm font-black text-[#00c48c]">{camp.leadsGenerated}</b>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-[var(--mu)] block">Spend</span>
                          <b className="text-sm font-black text-[var(--ink)]">${camp.spendTotal}</b>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-[var(--mu)] block">ROAS</span>
                          <b className="text-sm font-black text-[#cca34c]">{camp.roas}</b>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-[var(--bd)] flex items-center justify-between gap-2 text-xs">
                    {/* Launch or Approval Trigger */}
                    {isReady ? (
                      <button
                        onClick={() => handleLaunchCampaign(camp.id)}
                        disabled={isLaunching}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white font-black flex items-center gap-1.5 shadow-md shadow-[#00c48c]/30 cursor-pointer disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isLaunching ? 'Deploying...' : 'Launch to Meta Ad Account'}</span>
                      </button>
                    ) : isPending ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setMachineTab('CEO Security & Permissions')}
                          className="px-3.5 py-2 rounded-xl bg-[#cca34c]/20 hover:bg-[#cca34c]/30 border border-[#cca34c]/40 text-[#cca34c] font-black flex items-center gap-1.5 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Awaiting CEO Approval</span>
                        </button>
                      </div>
                    ) : isActive ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-[#00c48c] border border-emerald-500/30 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#00c48c] animate-pulse" />
                        <span>Live &amp; Attributing</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => updateCampaign(camp.id, { status: 'ready_to_launch' })}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                      >
                        Mark Ready to Launch
                      </button>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete campaign "${camp.campaignName}"?`)) {
                            deleteCampaign(camp.id);
                          }
                        }}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: GOOGLE SEARCH & INTENT ADS */}
      {activeSubTab === 'google' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Google Ads Bar */}
          <div className="bg-[var(--card)] border border-[var(--bd)] p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-500" />
                <h3 className="font-black text-base text-[var(--ink)]">
                  Google High-Intent Search Ads &amp; Performance Max
                </h3>
              </div>
              <p className="text-xs text-[var(--mu)] mt-0.5">
                Capture buyers at the moment of search with phrase and exact match keywords, responsive ads, and negative keyword filtering.
              </p>
            </div>
            <button
              onClick={() => handleOpenCreateCampaign('google')}
              className="px-4 py-2 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#00c48c]/30"
            >
              <Plus className="w-4 h-4" />
              <span>Create Google Campaign</span>
            </button>
          </div>

          {/* Google Campaigns List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.filter((c) => c.platform === 'google').map((camp) => (
              <div
                key={camp.id}
                className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--bd)] shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                        Google Search Ads
                      </span>
                      <h4 className="text-base font-black text-[var(--ink)] mt-1.5">
                        {camp.campaignName}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-[var(--mu)] block">Daily Budget</span>
                      <span className="text-base font-black text-[var(--ink)] font-mono">
                        ${camp.budgetDaily}/day
                      </span>
                    </div>
                  </div>

                  {/* Google Search Result Mockup */}
                  <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-1.5 text-xs">
                    <span className="text-[10px] text-gray-500 font-bold block">Sponsored Google Ad:</span>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span>backforbrand.com</span>
                      <span>/</span>
                      <span>{camp.targetFunnelSlug}</span>
                    </div>
                    <strong className="block text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      {camp.adCopy.headline}
                    </strong>
                    <p className="text-[11px] text-[var(--mu)] leading-relaxed">
                      {camp.adCopy.primaryText}
                    </p>
                  </div>

                  {/* Keywords Pill Grid */}
                  {camp.keywords && camp.keywords.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[var(--mu)] uppercase tracking-wider block">
                        Search Intent Keywords ({camp.keywords.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {camp.keywords.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-[var(--bg)] border border-[var(--bd)] font-mono text-[10px] text-[var(--ink)] font-bold">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Negative Keywords */}
                  {camp.negativeKeywords && camp.negativeKeywords.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                        Negative Exclusions:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {camp.negativeKeywords.map((nkw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 font-mono text-[10px] text-red-400">
                            -{nkw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[var(--bd)] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#cca34c]">
                    Target Funnel: {camp.targetFunnelName}
                  </span>
                  <button
                    onClick={() => handleLaunchCampaign(camp.id)}
                    className="px-4 py-2 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Campaign</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: SOCIAL MEDIA PAGES CREATION & LAUNCH GUIDE */}
      {activeSubTab === 'social_pages' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00c48c] block mb-1">
                  Brand Presence &amp; Social Inbound Channels
                </span>
                <h3 className="text-xl font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#00c48c]" />
                  <span>Official Social Media Pages Creation &amp; Verification Hub</span>
                </h3>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Complete checklists, bio copy templates, and verified link setups to turn your social profiles into 24/7 lead magnets.
                </p>
              </div>
            </div>

            {/* Social Platform Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'soc-meta',
                  name: 'Meta Business Suite (Facebook & Instagram)',
                  handle: '@backforbrand',
                  status: 'Active & Verified',
                  badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
                  bio: 'Autonomous Sales Funnels, 24/7 WhatsApp AI Booking Agents & Executive CRM. Florida, USA | Claim your free growth plan below  ',
                  checklist: [
                    { id: 'c1', label: 'Create Meta Business Manager Account', done: true },
                    { id: 'c2', label: 'Link Instagram Professional + WhatsApp Number', done: true },
                    { id: 'c3', label: 'Install Meta Pixel on Funnel & Dashboard', done: true },
                    { id: 'c4', label: 'Configure Automated Welcome Messenger Bot', done: true },
                  ],
                },
                {
                  id: 'soc-linkedin',
                  name: 'LinkedIn Company Page',
                  handle: 'linkedin.com/company/back-for-brand',
                  status: 'B2B Authority Active',
                  badgeColor: 'text-sky-600 bg-sky-600/10 border-sky-600/30',
                  bio: 'Back for Brand LLC | Engineering high-converting funnels, AI chatbots, and automated business operating systems for high-growth enterprises.',
                  checklist: [
                    { id: 'l1', label: 'Create LinkedIn Organization Page', done: true },
                    { id: 'l2', label: 'Add Founder Ghazi Wazir as Lead Executive', done: true },
                    { id: 'l3', label: 'Deploy Custom Action Button ("Visit Website")', done: true },
                    { id: 'l4', label: 'Post Weekly Thought Leadership Case Studies', done: false },
                  ],
                },
                {
                  id: 'soc-tiktok',
                  name: 'TikTok for Business',
                  handle: '@backforbrand',
                  status: 'Creator Mode Ready',
                  badgeColor: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
                  bio: 'We replace 5 disconnected tools with 1 automated AI business machine. Link in bio to book your free strategy call!  ',
                  checklist: [
                    { id: 't1', label: 'Switch to TikTok Business Account', done: true },
                    { id: 't2', label: 'Add Verified Website URL in Bio', done: true },
                    { id: 't3', label: 'Setup TikTok Event Pixel for Funnels', done: false },
                    { id: 't4', label: 'Deploy First 3 Short-Form Video Hooks', done: true },
                  ],
                },
                {
                  id: 'soc-youtube',
                  name: 'YouTube Channel & VSL Hub',
                  handle: 'youtube.com/@backforbrand',
                  status: 'Active Channel',
                  badgeColor: 'text-red-500 bg-red-500/10 border-red-500/30',
                  bio: 'Official channel of Back for Brand LLC. In-depth funnel breakdowns, AI automation tutorials, and live client case studies by Ghazi Wazir.',
                  checklist: [
                    { id: 'y1', label: 'Create Brand Channel with 4K Banner & Logo', done: true },
                    { id: 'y2', label: 'Upload 10-Minute Video Sales Letter (VSL)', done: true },
                    { id: 'y3', label: 'Add UTM Tracking Links to Video Descriptions', done: true },
                    { id: 'y4', label: 'Embed YouTube Videos into Dedicated Funnels', done: true },
                  ],
                },
                {
                  id: 'soc-gmb',
                  name: 'Google Business Profile (GMB)',
                  handle: 'Back for Brand LLC (Florida, USA)',
                  status: 'Local Map Pack #1 Target',
                  badgeColor: 'text-emerald-600 bg-emerald-600/10 border-emerald-600/30',
                  bio: 'Top-rated software and growth engineering firm in Florida. Serving clients across North America, Europe, and the GCC.',
                  checklist: [
                    { id: 'g1', label: 'Verify Business Address in Florida, USA', done: true },
                    { id: 'g2', label: 'Add Direct Strategy Session Booking Link', done: true },
                    { id: 'g3', label: 'Setup 5-Star Review Generation Flow', done: true },
                    { id: 'g4', label: 'Add Photos of Dashboard OS & Client Projects', done: true },
                  ],
                },
                {
                  id: 'soc-twitter',
                  name: 'X (Twitter) Company Presence',
                  handle: '@backforbrand',
                  status: 'Active',
                  badgeColor: 'text-slate-800 dark:text-slate-200 bg-slate-500/10 border-slate-500/30',
                  bio: 'Autonomous growth machines for high-ticket companies. Led by @ghaziwazir. Code, copy, and AI pipelines.',
                  checklist: [
                    { id: 'x1', label: 'Claim @backforbrand Handle', done: true },
                    { id: 'x2', label: 'Pin High-Converting Teardown Thread', done: true },
                    { id: 'x3', label: 'Automate Lead Magnet DMs via Webhook', done: false },
                  ],
                },
              ].map((plat) => (
                <div
                  key={plat.id}
                  className="p-5 rounded-3xl bg-[var(--soft)] border border-[var(--bd)] space-y-4 flex flex-col justify-between shadow-xs hover:border-[#00c48c]/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${plat.badgeColor}`}>
                        {plat.status}
                      </span>
                      <span className="font-mono text-[11px] text-[var(--mu)] font-bold">{plat.handle}</span>
                    </div>
                    <h4 className="text-base font-black text-[var(--ink)] leading-snug">
                      {plat.name}
                    </h4>
                    {/* Bio Copy Preview */}
                    <div className="p-3 rounded-2xl bg-[var(--bg)] border border-[var(--bd)] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-[var(--mu)] font-bold">
                        <span>Optimized Bio Template:</span>
                        <button
                          onClick={() => handleCopy(plat.bio, plat.id + '_bio')}
                          className="text-[#00c48c] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === plat.id + '_bio' ? <Check className="w-3 h-3 text-[#00c48c]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === plat.id + '_bio' ? 'Copied' : 'Copy Bio'}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-[var(--ink)] italic leading-relaxed">
                        &quot;{plat.bio}&quot;
                      </p>
                    </div>

                    {/* Setup Checklist */}
                    <div className="space-y-2 text-xs">
                      <span className="text-[10px] font-bold text-[var(--mu)] uppercase tracking-wider block">
                        Launch &amp; Verification Checklist:
                      </span>
                      <div className="space-y-1.5">
                        {plat.checklist.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 text-[11px]">
                            <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-[#00c48c] text-white' : 'border border-[var(--bd)]'}`}>
                              {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={item.done ? 'text-[var(--ink)] font-semibold' : 'text-[var(--mu)]'}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--bd)]">
                    <button
                      onClick={() => {
                        setActiveSubTab('content_planner');
                        setPostPlatform(plat.id === 'soc-linkedin' ? 'linkedin' : plat.id === 'soc-tiktok' ? 'tiktok' : 'meta');
                      }}
                      className="w-full py-2 rounded-xl bg-[var(--bg)] hover:bg-[#00c48c] hover:text-white border border-[var(--bd)] text-xs font-bold transition-all text-center cursor-pointer shadow-2xs"
                    >
                      Plan Content for {plat.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: MULTI-PLATFORM CONTENT PLANNER */}
      {activeSubTab === 'content_planner' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] p-5 sm:p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#cca34c]" />
                <h3 className="font-black text-base text-[var(--ink)]">
                  Social Media Content Planner &amp; UTM Link Binder
                </h3>
              </div>
              <p className="text-xs text-[var(--mu)] mt-0.5">
                Pre-formatted organic social posts with high-converting hooks and embedded funnel tracking parameters.
              </p>
            </div>
            <button
              onClick={() => setShowPostModal(true)}
              className="px-4 py-2 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#00c48c]/30"
            >
              <Plus className="w-4 h-4" />
              <span>Draft New Social Post</span>
            </button>
          </div>

          {/* Social Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 'post-1',
                platform: 'LinkedIn',
                title: 'Why Most Service Businesses Bleed 60% of Inbound Leads',
                content: `Did you know the average agency takes over 4 hours to reply to an inbound quote request?\n\nBy that time, your prospect has already Googled two competitors.\n\nAt Back for Brand LLC, we engineered an autonomous WhatsApp AI agent that replies in < 45 seconds in English, Arabic, and Urdu, qualifies buyer budgets, and books a Google Meet slot directly on your calendar.\n\nOne connected machine beats six separate tools every single time.`,
                hashtags: ['#B2BGrowth', '#Funnels', '#AIAgents', '#CEO'],
                targetFunnel: 'High-Ticket Consulting Funnel',
                utmLink: 'https://backforbrand.com/?funnel=consulting-growth&utm_source=linkedin&utm_medium=organic&utm_campaign=lead-bleed-post',
                date: 'Tomorrow at 09:00 AM',
                status: 'Scheduled',
              },
              {
                id: 'post-2',
                platform: 'Instagram / Meta',
                title: 'Before & After: Medical Aesthetic Booking Funnel (Zero No-Shows)',
                content: `Private practices and cosmetic clinics don't need another generic website   they need a patient booking engine.\n\nHere is how our client Bab Al-Khaleej deployed zero-friction patient intake with 24/7 WhatsApp triage, leading to a 3.4x surge in confirmed appointments.\n\nTap the link in bio to claim your free clinic growth audit!  `,
                hashtags: ['#MedicalAesthetics', '#ClinicGrowth', '#PatientIntake', '#DigitalHealth'],
                targetFunnel: 'Clinic Patient Booking Funnel',
                utmLink: 'https://backforbrand.com/?funnel=clinic-booking&utm_source=instagram&utm_medium=organic&utm_campaign=clinic-casestudy',
                date: 'Friday at 01:00 PM',
                status: 'Scheduled',
              },
              {
                id: 'post-3',
                platform: 'Twitter / X',
                title: 'The Modern Revenue Stack: Funnel + AI Closer + CRM',
                content: `Stop paying $800/month for Zapier, Calendly, Typeform, and separate bot tools.\n\nDeploy one unified Business Machine OS:\n  Sub-second landing pages\n  Trilingual WhatsApp closer (<45s)\n  Executive CRM with lead scoring\n  100% asset and code ownership\n\nLink below for our free breakdown.`,
                hashtags: ['#BuildInPublic', '#SaaS', '#GrowthEngine'],
                targetFunnel: 'High-Ticket Consulting Funnel',
                utmLink: 'https://backforbrand.com/?funnel=consulting-growth&utm_source=x-twitter&utm_medium=organic&utm_campaign=stack-thread',
                date: 'Published Yesterday',
                status: 'Published',
              },
            ].map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-3xl bg-[var(--card)] border border-[var(--bd)] space-y-3.5 shadow-sm flex flex-col justify-between hover:border-[#cca34c]/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-wider border border-blue-500/30">
                      {p.platform}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--mu)]">{p.date}</span>
                  </div>
                  <h4 className="text-sm font-black text-[var(--ink)] leading-snug">{p.title}</h4>
                  <div className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] text-xs text-[var(--ink)] whitespace-pre-line leading-relaxed font-sans max-h-48 overflow-y-auto">
                    {p.content}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.hashtags.map((tag) => (
                      <span key={tag} className="text-[10px] font-bold text-[#00c48c]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--bd)] space-y-2">
                  <div className="p-2 rounded-xl bg-[var(--bg)] border border-[var(--bd)] flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-[var(--mu)] truncate max-w-[200px]">
                      {p.utmLink}
                    </span>
                    <button
                      onClick={() => handleCopy(p.utmLink, p.id + '_link')}
                      className="text-[#00c48c] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === p.id + '_link' ? <Check className="w-3 h-3 text-[#00c48c]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === p.id + '_link' ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleCopy(`${p.content}\n\n${p.hashtags.join(' ')}\n\nLink: ${p.utmLink}`, p.id + '_full')}
                    className="w-full py-2 rounded-xl bg-[var(--soft)] hover:bg-[#00c48c] hover:text-white border border-[var(--bd)] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === p.id + '_full' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === p.id + '_full' ? 'Full Post Copied!' : 'Copy Post & Caption'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW CAMPAIGN */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl rounded-3xl bg-[var(--bg)] border-2 border-[#cca34c]/40 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto text-[var(--ink)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
              <div>
                <h3 className="text-lg font-black text-[var(--ink)] flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#00c48c]" />
                  <span>Configure {targetPlatform === 'meta' ? 'Meta Ads' : 'Google Ads'} Campaign</span>
                </h3>
                <p className="text-xs text-[var(--mu)]">
                  Connect target conversion funnel, budget, ad copy angles, and attribution tags.
                </p>
              </div>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[var(--ink)] mb-1">Campaign Name *</label>
                  <input
                    type="text"
                    required
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">Campaign Objective</label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                  >
                    <option value="leads">Lead Generation (Forms)</option>
                    <option value="whatsapp">Click-to-WhatsApp Chat</option>
                    <option value="sales">E-Commerce Checkout / Sales</option>
                    <option value="traffic">High-Intent Traffic</option>
                  </select>
                </div>
              </div>

              {/* Target Funnel Selection & Auto-Copy Generator */}
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#00c48c]" />
                    <span>Target Service Funnel Destination:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateAiCopy}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#cca34c] to-[#b8903c] text-[#070e24] font-black text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Ad Copy</span>
                  </button>
                </div>
                <select
                  value={selectedFunnelSlug}
                  onChange={(e) => setSelectedFunnelSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold"
                >
                  {funnels.map((f) => (
                    <option key={f.id} value={f.slug}>
                      {f.name} ({f.serviceCategory})
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget & Targeting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Daily Budget ($ USD) *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black">$</span>
                    <input
                      type="number"
                      value={budgetDaily}
                      onChange={(e) => setBudgetDaily(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-mono font-bold"
                      min={10}
                      step={5}
                    />
                    <span className="text-[11px] text-[var(--mu)] font-bold whitespace-nowrap">
                      = ${(budgetDaily * 30).toLocaleString()}/mo
                    </span>
                  </div>
                  {budgetDaily >= 80 && (
                    <span className="text-[10px] text-[#cca34c] font-bold block mt-1">
                      * Budgets &gt; $80/day automatically require CEO authorization before ad spend starts.
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">Target Geographic Locations</label>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <input
                      type="text"
                      value={geoInput}
                      onChange={(e) => setGeoInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGeo())}
                      placeholder="e.g. Florida, United Kingdom, Qatar..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                    />
                    <button
                      type="button"
                      onClick={handleAddGeo}
                      className="px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--bd)] font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {geoTargets.map((geo) => (
                      <span key={geo} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 text-[10px] font-bold border border-blue-500/20">
                        {geo}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ad Copy Fields */}
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <span className="font-black text-xs text-[var(--ink)] block uppercase tracking-wider">
                  Ad Creative &amp; Messaging Angles:
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--mu)] mb-1">Headline Hook *</label>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Stop Losing Inbound Clients to Slow Response Times"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--mu)] mb-1">Primary Ad Text *</label>
                  <textarea
                    rows={3}
                    required
                    value={primaryText}
                    onChange={(e) => setPrimaryText(e.target.value)}
                    placeholder="Enter the main conversion ad body..."
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] resize-y"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--mu)] mb-1">Call To Action (CTA)</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--mu)] mb-1">Creative Format</label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold"
                    >
                      <option value="single_image">High-Definition Single Image</option>
                      <option value="video_reels">Vertical Video / Reels (9:16)</option>
                      <option value="carousel">Multi-Card Carousel</option>
                      <option value="responsive_search">Google Responsive Search Ad</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Google Specific Keywords */}
              {targetPlatform === 'google' && (
                <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                  <span className="font-black text-xs text-[var(--ink)] block uppercase tracking-wider">
                    Google Search Keywords &amp; Negative Exclusions:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      placeholder="Add keyword e.g. [high ticket funnels]..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--bd)] font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 font-mono text-[10px] font-bold">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--bd)]">
                <span className="text-[11px] text-[var(--mu)]">
                  Attribution: <code>utm_source={targetPlatform === 'meta' ? 'meta-ads' : 'google-ads'}</code>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCampaignModal(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--bd)] font-bold text-[var(--mu)] hover:bg-[var(--soft)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] text-white font-black shadow-md shadow-[#00c48c]/30 cursor-pointer"
                  >
                    Save &amp; Prepare Launch
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

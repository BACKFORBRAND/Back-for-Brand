import React, { useState, useMemo } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { FUNNEL_TEMPLATES, FunnelTemplate } from '../../data/funnelTemplates.ts';
import {
  LayoutTemplate,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Eye,
  Sliders,
  DollarSign,
  TrendingUp,
  Globe,
  Layers,
  Smartphone,
  Tablet,
  Monitor,
  X,
  Plus,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  Zap,
  Check,
} from 'lucide-react';

export const TemplatesLibraryTab: React.FC = () => {
  const {
    funnels,
    addFunnel,
    setActiveFunnelId,
    setCurrentView,
    setMachineTab,
  } = useBusiness();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'cr' | 'aov' | 'name'>('cr');

  // Modals
  const [inspectTemplate, setInspectTemplate] = useState<FunnelTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<FunnelTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [customizingTemplate, setCustomizingTemplate] = useState<FunnelTemplate | null>(null);

  // Customization Form State
  const [customName, setCustomName] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customAccent, setCustomAccent] = useState<'emerald' | 'gold' | 'blue' | 'purple' | 'orange'>('emerald');
  const [customHeadline, setCustomHeadline] = useState('');
  const [importedResult, setImportedResult] = useState<{ id: string; slug: string; name: string } | null>(null);

  // Set of already installed slugs in current workspace
  const installedSlugs = useMemo(() => {
    return new Set(funnels.map((f) => f.slug.toLowerCase()));
  }, [funnels]);

  // Categories list
  const categories = useMemo(() => {
    const list = Array.from(new Set(FUNNEL_TEMPLATES.map((t) => t.category)));
    return ['All', ...list];
  }, []);

  // Filtered & Sorted templates
  const filteredTemplates = useMemo(() => {
    let result = FUNNEL_TEMPLATES.filter((tmpl) => {
      const matchesCategory = selectedCategory === 'All' || tmpl.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tmpl.name.toLowerCase().includes(q) ||
        tmpl.category.toLowerCase().includes(q) ||
        tmpl.industry.toLowerCase().includes(q) ||
        tmpl.architectureType.toLowerCase().includes(q) ||
        tmpl.funnelData.headline.toLowerCase().includes(q) ||
        tmpl.funnelData.targetAudience.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    result.sort((a, b) => {
      if (sortBy === 'cr') {
        const crA = parseFloat(a.benchmarkCR.replace('%', '')) || 0;
        const crB = parseFloat(b.benchmarkCR.replace('%', '')) || 0;
        return crB - crA;
      }
      if (sortBy === 'aov') {
        const aovA = parseFloat(a.benchmarkAOV.replace(/[^0-9.]/g, '')) || 0;
        const aovB = parseFloat(b.benchmarkAOV.replace(/[^0-9.]/g, '')) || 0;
        return aovB - aovA;
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  // Open Customize modal
  const handleOpenCustomize = (tmpl: FunnelTemplate) => {
    setCustomizingTemplate(tmpl);
    setCustomName(tmpl.name);
    // Suggest clean slug, appending a suffix if collision exists
    let suggestedSlug = tmpl.funnelData.slug;
    if (installedSlugs.has(suggestedSlug.toLowerCase())) {
      suggestedSlug = `${suggestedSlug}-${Math.floor(10 + Math.random() * 90)}`;
    }
    setCustomSlug(suggestedSlug);
    setCustomCategory(tmpl.funnelData.serviceCategory);
    setCustomAccent(tmpl.funnelData.accentColor);
    setCustomHeadline(tmpl.funnelData.headline);
    setImportedResult(null);
  };

  // Perform Direct 1-Click Import
  const handleDirectImport = (tmpl: FunnelTemplate) => {
    let targetSlug = tmpl.funnelData.slug;
    if (installedSlugs.has(targetSlug.toLowerCase())) {
      targetSlug = `${targetSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const created = addFunnel({
      ...tmpl.funnelData,
      slug: targetSlug,
    });

    setImportedResult({ id: created.id, slug: created.slug, name: created.name });
    setCustomizingTemplate(tmpl);
  };

  // Confirm Custom Import
  const handleConfirmCustomImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customizingTemplate || !customName.trim()) return;

    let finalSlug = customSlug.trim() || customName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (installedSlugs.has(finalSlug.toLowerCase())) {
      finalSlug = `${finalSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const created = addFunnel({
      ...customizingTemplate.funnelData,
      name: customName.trim(),
      slug: finalSlug,
      serviceCategory: customCategory,
      accentColor: customAccent,
      headline: customHeadline.trim() || customizingTemplate.funnelData.headline,
    });

    setImportedResult({ id: created.id, slug: created.slug, name: created.name });
  };

  // Jump to view in Public Portal
  const handleLaunchLive = (funnelSlug: string) => {
    setActiveFunnelId(funnelSlug);
    setCurrentView('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump to Funnels & Pages
  const handleGoToFunnelsTab = () => {
    setMachineTab('Funnels & Pages');
  };

  const getAccentBadgeClass = (accent: string) => {
    switch (accent) {
      case 'gold':
        return 'text-[#cca34c] bg-[#cca34c]/10 border-[#cca34c]/30';
      case 'blue':
        return 'text-blue-500 bg-blue-500/10 border-blue-400/30';
      case 'purple':
        return 'text-purple-500 bg-purple-500/10 border-purple-400/30';
      case 'orange':
        return 'text-orange-500 bg-orange-500/10 border-orange-400/30';
      default:
        return 'text-[#00c48c] bg-[#00c48c]/10 border-[#00c48c]/30';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-16">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#070e24] via-[#0c183a] to-[#070e24] text-white p-6 sm:p-8 border border-[#cca34c]/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c48c]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#cca34c]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#00c48c]/15 border border-[#00c48c]/35 text-[#00c48c] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <LayoutTemplate className="w-3.5 h-3.5 text-[#00c48c]" />
                <span>Template Gallery</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#cca34c]/20 border border-[#cca34c]/40 text-[#cca34c] text-xs font-bold">
                Pre-Built High-Converting Funnel Architectures
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Template Gallery: Pre-Built Funnel Structures
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
              Select, inspect, and load field-tested funnel architectures for high-ticket consulting, aesthetic clinics, DTC e-commerce, local trade contractors, AI agents, and enterprise SaaS into your business machine with 1 click.
            </p>
          </div>

          {/* Quick summary stats & button */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 w-full lg:w-auto">
            <button
              onClick={handleGoToFunnelsTab}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00c48c]/25 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>View Active Funnels ({funnels.length})</span>
            </button>
            <div className="text-[11px] text-gray-300 flex items-center gap-2">
              <span className="flex items-center gap-1 text-[#00c48c] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 9 Architectures Tested
              </span>
              <span>·</span>
              <span className="text-[#cca34c] font-bold">Avg 23.4% CR Benchmark</span>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00c48c]/15 text-[#00c48c] flex items-center justify-center">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[var(--mu)] uppercase">Ready Templates</div>
            <div className="text-lg font-black text-[var(--ink)]">{FUNNEL_TEMPLATES.length} Architectures</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#cca34c]/15 text-[#cca34c] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[var(--mu)] uppercase">Avg CR Benchmark</div>
            <div className="text-lg font-black text-[#cca34c]">23.4% Conversion</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[var(--mu)] uppercase">Benchmark Deal (AOV)</div>
            <div className="text-lg font-black text-[var(--ink)]">$6,200 Avg Ticket</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[var(--mu)] uppercase">Installed in System</div>
            <div className="text-lg font-black text-[var(--ink)]">{funnels.length} Active Funnels</div>
          </div>
        </div>
      </div>

      {/* Filter, Search & Sort Control Bar */}
      <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-4">
        {/* Search input and Sort selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[var(--mu)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by industry, offer, or keyword..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--bd)] text-xs text-[var(--ink)] focus:outline-none focus:border-[#00c48c] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-[var(--mu)] whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--bd)] text-xs text-[var(--ink)] focus:outline-none focus:border-[#00c48c]"
            >
              <option value="cr">Highest Conversion Rate (CR)</option>
              <option value="aov">Highest Average Ticket (AOV)</option>
              <option value="name">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'All'
                ? FUNNEL_TEMPLATES.length
                : FUNNEL_TEMPLATES.filter((t) => t.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#00c48c] text-white border-[#00c48c] shadow-xs'
                    : 'bg-[var(--bg)] text-[var(--mu)] border-[var(--bd)] hover:border-[#00c48c]/50 hover:text-[var(--ink)]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[var(--soft)] text-[var(--mu)]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const isInstalled = installedSlugs.has(template.funnelData.slug.toLowerCase());

          return (
            <div
              key={template.id}
              className="rounded-3xl bg-[var(--bg)] border border-[var(--bd)] hover:border-[#00c48c]/50 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header & Badges */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wide">
                    {template.industry}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#00c48c]/15 text-[#00c48c] text-[10px] font-black border border-[#00c48c]/30">
                      {template.benchmarkCR} CR
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#cca34c]/15 text-[#cca34c] text-[10px] font-bold border border-[#cca34c]/30">
                      {template.benchmarkAOV} AOV
                    </span>
                  </div>
                </div>

                {/* Title & Architecture */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${getAccentBadgeClass(template.funnelData.accentColor)}`}>
                      {template.funnelData.badge}
                    </span>
                    {isInstalled && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Installed
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[var(--ink)] leading-snug group-hover:text-[#00c48c] transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs font-semibold text-[var(--mu)]">
                    {template.architectureType}
                  </p>
                </div>

                {/* Headline Preview Box */}
                <div className="p-3 rounded-xl bg-[var(--soft)] border border-[var(--bd)] text-xs text-[var(--ink)] italic leading-relaxed">
                  "{template.funnelData.headline}"
                </div>

                {/* Best Traffic Sources */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-[var(--mu)] uppercase tracking-wider">
                    Recommended Traffic Hooks:
                  </div>
                  <div className="text-xs text-[var(--ink)] font-medium flex items-center gap-1.5 flex-wrap">
                    {template.bestTrafficSources.map((source, i) => (
                      <React.Fragment key={source}>
                        <span>{source}</span>
                        {i < template.bestTrafficSources.length - 1 && (
                          <span className="text-gray-400">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Key Deliverables sample */}
                <div className="space-y-1.5 pt-1 border-t border-[var(--bd)]">
                  <div className="text-[10px] font-bold text-[var(--mu)] uppercase tracking-wider">
                    Core Structure Includes:
                  </div>
                  <ul className="space-y-1 text-xs text-[var(--ink)]">
                    {template.funnelData.deliverables.slice(0, 3).map((deliv, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00c48c] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{deliv}</span>
                      </li>
                    ))}
                    {template.funnelData.deliverables.length > 3 && (
                      <li className="text-[11px] text-[var(--mu)] pl-5">
                        +{template.funnelData.deliverables.length - 3} more structured deliverables
                      </li>
                    )}
                  </ul>
                </div>

                {/* Pricing Tiers summary */}
                <div className="p-3 rounded-xl bg-[var(--soft)]/50 border border-[var(--bd)] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[var(--mu)] block">Pre-Built Pricing:</span>
                    <span className="font-bold text-[var(--ink)]">
                      {template.funnelData.pricingTiers.length} Offer Tiers
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[var(--mu)] block">Entry Investment:</span>
                    <span className="font-extrabold text-[#00c48c]">
                      ${template.funnelData.pricingTiers[0]?.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 sm:p-5 bg-[var(--soft)]/40 border-t border-[var(--bd)] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setInspectTemplate(template)}
                    className="w-full py-2 px-3 rounded-xl bg-[var(--bg)] hover:bg-[var(--soft)] border border-[var(--bd)] text-xs font-bold text-[var(--ink)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[var(--mu)]" />
                    <span>Blueprint</span>
                  </button>
                  <button
                    onClick={() => {
                      setPreviewTemplate(template);
                      setPreviewDevice('desktop');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[var(--bg)] hover:bg-[var(--soft)] border border-[var(--bd)] text-xs font-bold text-[var(--ink)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[var(--mu)]" />
                    <span>Live Preview</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenCustomize(template)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-[#00c48c]/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>{isInstalled ? 'Load Another Copy' : 'Load Funnel Structure'}</span>
                  </button>
                  <button
                    onClick={() => handleDirectImport(template)}
                    className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--bd)] hover:border-[#00c48c] text-[var(--ink)] text-xs font-bold transition-colors cursor-pointer"
                    title="1-Click Quick Load"
                  >
                    <Zap className="w-4 h-4 text-[#cca34c]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16 px-4 bg-[var(--soft)] rounded-3xl border border-[var(--bd)] space-y-3">
          <HelpCircle className="w-10 h-10 text-[var(--mu)] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[var(--ink)]">No funnel templates found</h3>
          <p className="text-xs text-[var(--mu)] max-w-sm mx-auto">
            Try adjusting your search criteria or clear the category filters to browse all available structures.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-[#00c48c] text-white text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: INSPECT BLUEPRINT & CONVERSION PLAYBOOK                          */}
      {/* ========================================================================= */}
      {inspectTemplate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[var(--bg)] border border-[var(--bd)] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col my-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[var(--bg)]/95 backdrop-blur-md p-5 sm:p-6 border-b border-[var(--bd)] flex items-center justify-between gap-4 z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${getAccentBadgeClass(inspectTemplate.funnelData.accentColor)}`}>
                    {inspectTemplate.funnelData.badge}
                  </span>
                  <span className="text-xs text-[var(--mu)] font-semibold">
                    {inspectTemplate.industry}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[var(--ink)] mt-1">
                  {inspectTemplate.name}
                </h2>
              </div>
              <button
                onClick={() => setInspectTemplate(null)}
                className="p-2 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Funnel Stage Timeline Flow */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--mu)] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#00c48c]" />
                    <span>6-Stage High-Converting Architecture Flow</span>
                  </h3>
                  <span className="text-[11px] font-bold text-[#00c48c]">
                    Benchmark: {inspectTemplate.benchmarkCR} CR
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {inspectTemplate.stages.map((stage) => (
                    <div
                      key={stage.stepNumber}
                      className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-[#00c48c]/20 text-[#00c48c] text-xs font-black flex items-center justify-center">
                          {stage.stepNumber}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--mu)]">
                          Stage {stage.stepNumber}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-[var(--ink)]">{stage.name}</div>
                      <p className="text-[11px] text-[var(--mu)] leading-relaxed">
                        {stage.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {stage.keyElements.map((el, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--bd)] text-[9px] font-semibold text-[var(--ink)]"
                          >
                            {el}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversion Psychology & Playbook */}
              <div className="p-4 rounded-2xl bg-[#cca34c]/10 border border-[#cca34c]/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-[#cca34c] uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-[#cca34c]" />
                  <span>Conversion Psychology &amp; Scaling Playbook</span>
                </div>
                <p className="text-xs text-[var(--ink)] leading-relaxed font-medium">
                  {inspectTemplate.conversionPlaybook.corePsychology}
                </p>
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-[var(--ink)]">Why this specific structure converts:</div>
                  <ul className="space-y-1 text-xs text-[var(--ink)]">
                    {inspectTemplate.conversionPlaybook.whyItConverts.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#00c48c] shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-[#cca34c]/20 text-xs text-[var(--ink)] font-semibold flex items-center gap-1.5">
                  <span className="text-[#cca34c] font-black">Pro Scaling Tip:</span>
                  <span>{inspectTemplate.conversionPlaybook.scaleTip}</span>
                </div>
              </div>

              {/* Offer Deliverables Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[var(--mu)]">
                  Complete Deliverables Scope Included:
                </h4>
                <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                  {inspectTemplate.funnelData.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[var(--ink)]">
                      <CheckCircle2 className="w-4 h-4 text-[#00c48c] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pre-Configured Pricing Tiers */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[var(--mu)]">
                  Pre-Configured Pricing Tiers ({inspectTemplate.funnelData.pricingTiers.length}):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {inspectTemplate.funnelData.pricingTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                        tier.recommended
                          ? 'bg-[#00c48c]/10 border-[#00c48c] shadow-xs'
                          : 'bg-[var(--soft)] border-[var(--bd)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--ink)]">{tier.name}</span>
                        {tier.recommended && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#00c48c] text-white">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-black text-[var(--ink)]">
                        ${tier.price.toLocaleString()}
                        {tier.period && (
                          <span className="text-[10px] text-[var(--mu)] font-normal ml-1">
                            /{tier.period}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--mu)] line-clamp-2">{tier.description}</p>
                      <ul className="space-y-1 text-[11px] text-[var(--ink)] pt-1 border-t border-[var(--bd)]">
                        {tier.features.slice(0, 3).map((feat, i) => (
                          <li key={i} className="flex items-center gap-1 line-clamp-1">
                            <span className="text-[#00c48c]">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="sticky bottom-0 bg-[var(--bg)]/95 backdrop-blur-md p-4 sm:p-6 border-t border-[var(--bd)] flex items-center justify-between gap-3">
              <button
                onClick={() => setInspectTemplate(null)}
                className="px-4 py-2.5 rounded-xl border border-[var(--bd)] text-xs font-bold text-[var(--mu)] hover:bg-[var(--soft)] transition-colors cursor-pointer"
              >
                Close Blueprint
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const tmpl = inspectTemplate;
                    setInspectTemplate(null);
                    setPreviewTemplate(tmpl);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[var(--soft)] border border-[var(--bd)] hover:border-[#00c48c] text-xs font-bold text-[var(--ink)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4 text-[#00c48c]" />
                  <span>Preview Page</span>
                </button>
                <button
                  onClick={() => {
                    const tmpl = inspectTemplate;
                    setInspectTemplate(null);
                    handleOpenCustomize(tmpl);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-[#00c48c]/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Import This Architecture</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CUSTOMIZE & IMPORT TO WORKSPACE                                  */}
      {/* ========================================================================= */}
      {customizingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[var(--bg)] border border-[var(--bd)] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-auto">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[var(--bd)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#00c48c] uppercase tracking-wider">
                  Import Funnel Architecture
                </span>
                <h3 className="text-lg font-black text-[var(--ink)]">
                  {importedResult ? 'Funnel Imported Successfully!' : `Import: ${customizingTemplate.name}`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setCustomizingTemplate(null);
                  setImportedResult(null);
                }}
                className="p-2 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Imported Success State */}
            {importedResult ? (
              <div className="p-6 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#00c48c]/20 text-[#00c48c] mx-auto flex items-center justify-center shadow-lg shadow-[#00c48c]/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-[var(--ink)]">
                    "{importedResult.name}" is Ready!
                  </h4>
                  <p className="text-xs text-[var(--mu)] max-w-sm mx-auto">
                    The complete high-converting structure, deliverables, and tiered pricing were provisioned and linked to your CRM.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] text-xs text-left space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[var(--mu)]">
                    <span>Live Customer URL:</span>
                    <span className="text-[#00c48c] font-bold">Ready</span>
                  </div>
                  <div className="font-mono text-xs text-[var(--ink)] break-all bg-[var(--bg)] p-2 rounded-xl border border-[var(--bd)]">
                    /?funnel={importedResult.slug}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setCustomizingTemplate(null);
                      setImportedResult(null);
                      handleLaunchLive(importedResult.slug);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#cca34c] hover:bg-[#b8903c] text-[#070e24] text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch Live Customer View</span>
                  </button>
                  <button
                    onClick={() => {
                      setCustomizingTemplate(null);
                      setImportedResult(null);
                      handleGoToFunnelsTab();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Manage in Funnels &amp; Pages</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Customization Form */
              <form onSubmit={handleConfirmCustomImport} className="p-5 sm:p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--ink)]">Funnel Display Name</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--bd)] text-xs text-[var(--ink)] focus:outline-none focus:border-[#00c48c]"
                    placeholder="e.g. Executive Strategy Sprint"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--ink)]">
                    URL Slug Identifier <span className="text-[11px] text-[var(--mu)] font-normal">(Public web address)</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[var(--mu)] font-mono">/?funnel=</span>
                    <input
                      type="text"
                      required
                      value={customSlug}
                      onChange={(e) =>
                        setCustomSlug(
                          e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '')
                        )
                      }
                      className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--bd)] font-mono text-xs text-[var(--ink)] focus:outline-none focus:border-[#00c48c]"
                      placeholder="executive-strategy"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--ink)]">Hero Headline Offer</label>
                  <textarea
                    rows={2}
                    value={customHeadline}
                    onChange={(e) => setCustomHeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--bd)] text-xs text-[var(--ink)] focus:outline-none focus:border-[#00c48c]"
                    placeholder="Compelling conversion headline..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--ink)]">Service Category</label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--bd)] text-xs text-[var(--ink)] focus:outline-none focus:border-[#00c48c]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--ink)]">Accent Theme Color</label>
                    <select
                      value={customAccent}
                      onChange={(e) => setCustomAccent(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--bd)] text-xs text-[var(--ink)] focus:outline-none focus:border-[#00c48c]"
                    >
                      <option value="emerald">Emerald Brand Green</option>
                      <option value="gold">Executive Gold</option>
                      <option value="blue">High-Tech Blue</option>
                      <option value="purple">Creative Purple</option>
                      <option value="orange">Performance Orange</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#00c48c]/10 border border-[#00c48c]/25 text-xs text-[var(--ink)] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00c48c] shrink-0 mt-0.5" />
                  <span>
                    Will import <strong>{customizingTemplate.funnelData.deliverables.length} deliverables</strong> and{' '}
                    <strong>{customizingTemplate.funnelData.pricingTiers.length} pricing tiers</strong> ready for immediate client acquisition.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--bd)]">
                  <button
                    type="button"
                    onClick={() => setCustomizingTemplate(null)}
                    className="px-4 py-2 rounded-xl border border-[var(--bd)] text-xs font-bold text-[var(--mu)] hover:bg-[var(--soft)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-[#00c48c]/30 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm &amp; Load Funnel Structure</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: RESPONSIVE DEVICE LIVE PREVIEW                                   */}
      {/* ========================================================================= */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          <div className="w-full max-w-5xl h-[94vh] flex flex-col bg-[#070e24] text-white rounded-3xl border border-[#cca34c]/30 shadow-2xl overflow-hidden">
            {/* Top Preview Control Bar */}
            <div className="px-5 py-3.5 bg-[#0c183a] border-b border-[#cca34c]/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-[#00c48c] flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>Template Simulator</span>
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                  {previewTemplate.name}
                </span>
              </div>

              {/* Device Selector */}
              <div className="flex items-center gap-1 bg-[#070e24] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    previewDevice === 'desktop'
                      ? 'bg-[#00c48c] text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Desktop View (1200px)"
                >
                  <Monitor className="w-4 h-4" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    previewDevice === 'tablet'
                      ? 'bg-[#00c48c] text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-4 h-4" />
                  <span className="hidden sm:inline">Tablet</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    previewDevice === 'mobile'
                      ? 'bg-[#00c48c] text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Mobile View (390px)"
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const tmpl = previewTemplate;
                    setPreviewTemplate(null);
                    handleOpenCustomize(tmpl);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Import</span>
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewport Frame */}
            <div className="flex-1 bg-[#050a1a] p-4 sm:p-6 overflow-y-auto flex justify-center items-start">
              <div
                className={`bg-white text-slate-900 transition-all duration-300 rounded-2xl shadow-2xl overflow-y-auto border border-white/20 ${
                  previewDevice === 'desktop'
                    ? 'w-full max-w-4xl min-h-full'
                    : previewDevice === 'tablet'
                    ? 'w-[768px] min-h-full'
                    : 'w-[390px] min-h-full'
                }`}
                style={{ maxHeight: 'calc(94vh - 90px)' }}
              >
                {/* Simulated Customer Landing View */}
                <div className="p-6 sm:p-10 space-y-8 font-sans">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#070e24] text-[#cca34c] font-black text-xs flex items-center justify-center">
                        B
                      </div>
                      <span className="font-extrabold text-sm text-[#070e24]">
                        Back for <span className="text-[#cca34c]">Brand</span>
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      {previewTemplate.funnelData.serviceCategory}
                    </span>
                  </div>

                  {/* Hero */}
                  <div className="text-center space-y-4 max-w-2xl mx-auto pt-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {previewTemplate.funnelData.badge}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                      {previewTemplate.funnelData.headline}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {previewTemplate.funnelData.subheadline}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <div className="px-6 py-3 rounded-xl bg-[#00c48c] text-white text-xs font-black shadow-md">
                        {previewTemplate.funnelData.ctaText}
                      </div>
                      <div className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold">
                        Chat on WhatsApp
                      </div>
                    </div>
                  </div>

                  {/* Highlight Bar */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs font-bold text-slate-700">
                    ✨ {previewTemplate.funnelData.heroHighlight}
                  </div>

                  {/* Deliverables Scope */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      What is Included in This System:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {previewTemplate.funnelData.deliverables.map((deliv, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Cards */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 text-center">
                      Investment Packages:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {previewTemplate.funnelData.pricingTiers.map((tier) => (
                        <div
                          key={tier.id}
                          className={`p-4 rounded-2xl border text-xs space-y-2 ${
                            tier.recommended
                              ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                              : 'border-slate-200 bg-slate-50'
                          }`}
                        >
                          <div className="font-bold text-slate-900">{tier.name}</div>
                          <div className="text-lg font-black text-slate-900">
                            ${tier.price.toLocaleString()}
                          </div>
                          <p className="text-[11px] text-slate-500">{tier.description}</p>
                          <div className="w-full py-2 text-center rounded-lg bg-slate-900 text-white font-bold text-[11px] mt-2">
                            Select Package
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Intake Simulation */}
                  <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3 text-center">
                    <h3 className="text-base font-black">
                      Schedule Your Strategy Call
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Fill out the 30-second inquiry form to check availability and lock in your project sprint.
                    </p>
                    <div className="max-w-md mx-auto space-y-2 pt-2">
                      <div className="h-9 rounded-lg bg-slate-800 border border-slate-700 text-left px-3 text-xs text-slate-400 flex items-center">
                        Full Name
                      </div>
                      <div className="h-9 rounded-lg bg-slate-800 border border-slate-700 text-left px-3 text-xs text-slate-400 flex items-center">
                        Work Email
                      </div>
                      <div className="h-9 rounded-lg bg-[#00c48c] text-white font-black text-xs flex items-center justify-center">
                        Submit &amp; Select Calendar Slot
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

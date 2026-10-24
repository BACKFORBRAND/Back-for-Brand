import React, { useState, useMemo } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  RotateCcw,
  TrendingUp,
  Code2,
  Sparkles,
  Link2,
  Search,
  DollarSign,
  Users,
  Target,
  ExternalLink,
  Layers,
  Zap,
} from 'lucide-react';
import { ChannelEmbedModal } from './ChannelEmbedModal.tsx';

export const ChannelsTab: React.FC = () => {
  const { channels, leads, updateChannel, resetDemoData } = useBusiness();
  const [embedChannel, setEmbedChannel] = useState<string>('Meta Ads');
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ads' | 'search' | 'social' | 'direct'>('all');

  // Compute live stats from CRM for each channel
  const channelData = useMemo(() => {
    return channels.map((c, i) => {
      const srcLeads = leads.filter((l) => l.src === c.name);
      const srcWon = srcLeads.filter((l) => l.stage === 'Won');
      const srcRev = srcWon.reduce((sum, l) => sum + (l.val || 0), 0);
      const leadsCount = srcLeads.length;
      const wonCount = srcWon.length;
      const costPerLead = leadsCount && c.spend ? Math.round(c.spend / leadsCount) : null;
      const roas = c.spend ? (srcRev / c.spend).toFixed(1) + 'x' : '–';
      const targetPct = c.target ? Math.min(100, Math.round((leadsCount / c.target) * 100)) : 0;

      // Category tagging
      let cat: 'ads' | 'search' | 'social' | 'direct' = 'direct';
      if (c.name.includes('Ads')) cat = 'ads';
      else if (c.name.includes('SEO') || c.name.includes('GEO') || c.name.includes('AEO')) cat = 'search';
      else if (
        ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'X (Twitter)'].includes(c.name)
      )
        cat = 'social';

      return {
        index: i,
        name: c.name,
        visits: c.visits,
        spend: c.spend,
        target: c.target,
        leads: leadsCount,
        won: wonCount,
        revenue: srcRev,
        costPerLead,
        roas,
        targetPct,
        category: cat,
      };
    });
  }, [channels, leads]);

  // Aggregate metrics across channels
  const totalVisits = useMemo(() => channelData.reduce((s, c) => s + c.visits, 0), [channelData]);
  const totalSpend = useMemo(() => channelData.reduce((s, c) => s + c.spend, 0), [channelData]);
  const totalLeads = useMemo(() => channelData.reduce((s, c) => s + c.leads, 0), [channelData]);
  const totalWonRev = useMemo(() => channelData.reduce((s, c) => s + c.revenue, 0), [channelData]);
  const blendedRoas = totalSpend > 0 ? (totalWonRev / totalSpend).toFixed(1) + 'x' : '–';

  // Filtered rows
  const filteredData = useMemo(() => {
    return channelData.filter((row) => {
      const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = categoryFilter === 'all' || row.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [channelData, searchQuery, categoryFilter]);

  const formatCurrency = (val: number) => '$' + Math.round(val).toLocaleString();

  const handleOpenEmbed = (channelName: string) => {
    setEmbedChannel(channelName);
    setIsEmbedModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro & Systeme.io Embed Action Header */}
      <div className="bg-[var(--card)] border border-[var(--bd)] p-5 rounded-3xl shadow-sm text-xs text-[var(--mu)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <b className="text-[var(--ink)] text-base font-black">Multi-Channel Attribution &amp; Systeme.io Matrix</b>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 border border-blue-500/20">
              17 Channels Synced
            </span>
          </div>
          <p className="max-w-2xl leading-relaxed">
            Track monthly traffic, ad spend, and conversion goals across all marketing channels. Generate <b>Systeme.io embed blocks</b>, <b>responsive iFrames</b>, <b>popup widgets</b>, <b>webhooks</b>, and <b>trackable UTM links</b> for any channel.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap flex-shrink-0">
          <button
            onClick={() => handleOpenEmbed('Meta Ads')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Systeme.io &amp; Embed Suite</span>
          </button>

          <button
            onClick={resetDemoData}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[var(--bd)] text-xs font-semibold text-[var(--ink)] hover:bg-[var(--soft)] transition-colors whitespace-nowrap"
            title="Reset to default channel benchmark numbers"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
            <span>Reset benchmark</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[var(--card)] border border-[var(--bd)] p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold text-[var(--mu)] uppercase block mb-0.5">Total Visits</span>
          <span className="text-lg font-black text-[var(--ink)]">{totalVisits.toLocaleString()}</span>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold text-[var(--mu)] uppercase block mb-0.5">Total Ad Spend</span>
          <span className="text-lg font-black text-rose-600">{formatCurrency(totalSpend)}</span>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold text-[var(--mu)] uppercase block mb-0.5">Attributed Leads</span>
          <span className="text-lg font-black text-blue-600">{totalLeads} leads</span>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold text-[var(--mu)] uppercase block mb-0.5">Won Revenue</span>
          <span className="text-lg font-black text-emerald-600">{formatCurrency(totalWonRev)}</span>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] p-3.5 rounded-2xl col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-[var(--mu)] uppercase block mb-0.5">Blended ROAS</span>
          <span className="text-lg font-black text-amber-500">{blendedRoas}</span>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--card)] border border-[var(--bd)] p-3 rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--mu)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channels..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {(
            [
              { id: 'all', label: 'All Channels (17)' },
              { id: 'ads', label: 'Paid Ads' },
              { id: 'search', label: 'Search & AI' },
              { id: 'social', label: 'Social' },
              { id: 'direct', label: 'Direct & Chat' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Channel Attribution Table */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[960px]">
            <thead>
              <tr className="border-b border-[var(--bd)] bg-[var(--soft)]/60 text-[var(--mu)] text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-3">Visits</th>
                <th className="py-3.5 px-3">Spend ($)</th>
                <th className="py-3.5 px-3">Lead Target</th>
                <th className="py-3.5 px-3">Leads</th>
                <th className="py-3.5 px-3">Won</th>
                <th className="py-3.5 px-3">Revenue</th>
                <th className="py-3.5 px-3">Cost/Lead</th>
                <th className="py-3.5 px-3">ROAS</th>
                <th className="py-3.5 px-4 min-w-[130px]">Goal Progress</th>
                <th className="py-3.5 px-4 text-right">Embed &amp; Link Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bd)]/70 text-[var(--ink)]">
              {filteredData.map((row) => (
                <tr key={row.name} className="hover:bg-[var(--soft)]/40 transition-colors group">
                  <td className="py-3.5 px-4 font-bold text-[var(--ink)]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      value={row.visits}
                      onChange={(e) => updateChannel(row.index, 'visits', Number(e.target.value))}
                      className="w-20 px-2 py-1 rounded-lg border border-[var(--bd)] bg-[var(--bg)] text-xs text-right font-medium focus:border-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      value={row.spend}
                      onChange={(e) => updateChannel(row.index, 'spend', Number(e.target.value))}
                      className="w-20 px-2 py-1 rounded-lg border border-[var(--bd)] bg-[var(--bg)] text-xs text-right font-medium focus:border-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      value={row.target}
                      onChange={(e) => updateChannel(row.index, 'target', Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg border border-[var(--bd)] bg-[var(--bg)] text-xs text-right font-medium focus:border-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-3.5 px-3 font-bold text-blue-600">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10">
                      {row.leads}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-emerald-600">
                    {row.won}
                  </td>
                  <td className="py-3.5 px-3 font-black">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[var(--mu)]">
                    {row.costPerLead !== null ? formatCurrency(row.costPerLead) : '–'}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-[#ff6a1a]">
                    {row.roas}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[var(--bd)] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${row.targetPct}%` }}
                          className={`h-full rounded-full transition-all duration-300 ${
                            row.targetPct >= 100 ? 'bg-emerald-500' : 'bg-orange-500'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--mu)] w-10 text-right">
                        {row.targetPct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenEmbed(row.name)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white font-bold text-xs transition-all border border-blue-500/30 shadow-xs cursor-pointer"
                      title={`Generate embed link, Systeme.io code or webhook for ${row.name}`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Embed &amp; Link</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embed Modal Dialog */}
      <ChannelEmbedModal
        initialChannelName={embedChannel}
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
      />
    </div>
  );
};

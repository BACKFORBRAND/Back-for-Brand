import React from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { STAGES, TRAFFIC_SOURCES } from '../../types/index.ts';
import { TrendingUp, Users, DollarSign, Calendar, Eye, PieChart, BarChart3 } from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { leads, bookings, channels } = useBusiness();

  // Metrics computation
  const totalVisits = channels.reduce((sum, c) => sum + (c.visits || 0), 0);
  const totalSpend = channels.reduce((sum, c) => sum + (c.spend || 0), 0);
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.stage === 'Won');
  const totalRevenue = wonLeads.reduce((sum, l) => sum + (l.val || 0), 0);
  const openBookings = bookings.filter((b) => b.st === 'Pending' || b.st === 'Confirmed').length;
  const conversionRate = totalLeads ? Math.round((wonLeads.length / totalLeads) * 100) : 0;
  const roas = totalSpend ? (totalRevenue / totalSpend).toFixed(1) + 'x' : '–';

  // CRM Funnel Stage counts
  const stageCounts = STAGES.map((s) => ({
    stage: s,
    count: leads.filter((l) => l.stage === s).length,
  }));
  const maxStageCount = Math.max(1, ...stageCounts.map((x) => x.count));

  // Channel attribution stats
  const channelStats = TRAFFIC_SOURCES.map((source) => {
    const srcLeads = leads.filter((l) => l.src === source);
    const srcWon = srcLeads.filter((l) => l.stage === 'Won');
    const srcRev = srcWon.reduce((s, l) => s + (l.val || 0), 0);
    return {
      source,
      leads: srcLeads.length,
      won: srcWon.length,
      revenue: srcRev,
    };
  });
  const maxChannelLeads = Math.max(1, ...channelStats.map((c) => c.leads));

  const formatCurrency = (val: number) => '$' + Math.round(val).toLocaleString();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome / Status Card */}
      <div className="bg-gradient-to-r from-[#070e24] via-[#0c183a] to-[#070e24] text-white p-5 rounded-2xl shadow-sm border border-[#cca34c]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <span>Executive System Pulse</span>
            <span className="text-xs bg-[#cca34c]/20 text-[#cca34c] px-2 py-0.5 rounded-full border border-[#cca34c]/30 font-bold uppercase tracking-wider">
              Back for Brand OS
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/70 mt-0.5">
            Real-time telemetry uniting website visitors, AI WhatsApp qualification, and CRM sales velocity.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#00c48c] animate-pulse" />
          <span className="font-bold">Live Operating Sync Active</span>
        </div>
      </div>

      {/* 8 Core KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-4 shadow-sm hover:border-[#00c48c]/40 transition-colors">
          <div className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider flex items-center justify-between">
            <span>Traffic (visits)</span>
            <Eye className="w-3.5 h-3.5 text-[#00c48c]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[var(--ink)] mt-1.5">
            {totalVisits.toLocaleString()}
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-4 shadow-sm hover:border-[#00c48c]/40 transition-colors">
          <div className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider flex items-center justify-between">
            <span>Leads</span>
            <Users className="w-3.5 h-3.5 text-[#00c48c]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#00c48c] mt-1.5">
            {totalLeads}
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-4 shadow-sm hover:border-[#00c48c]/40 transition-colors">
          <div className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider flex items-center justify-between">
            <span>Orders closed</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#00c48c]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#00c48c] mt-1.5">
            {wonLeads.length}
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-4 shadow-sm hover:border-[#cca34c]/40 transition-colors">
          <div className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider flex items-center justify-between">
            <span>Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-[#cca34c]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#cca34c] mt-1.5">
            {formatCurrency(totalRevenue)}
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-4 shadow-sm hover:border-[#00c48c]/40 transition-colors">
          <div className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider flex items-center justify-between">
            <span>Open bookings</span>
            <Calendar className="w-3.5 h-3.5 text-[#00c48c]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[var(--ink)] mt-1.5">
            {openBookings}
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-4 shadow-sm hover:border-[#00c48c]/40 transition-colors">
          <div className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider flex items-center justify-between">
            <span>Lead → Order</span>
            <PieChart className="w-3.5 h-3.5 text-[#00c48c]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[var(--ink)] mt-1.5">
            {conversionRate}%
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-4 shadow-sm hover:border-[#cca34c]/40 transition-colors">
          <div className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider flex items-center justify-between">
            <span>Ad + Tool Spend</span>
            <DollarSign className="w-3.5 h-3.5 text-[#cca34c]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[var(--ink)] mt-1.5">
            {formatCurrency(totalSpend)}
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-4 shadow-sm hover:border-[#cca34c]/40 transition-colors">
          <div className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider flex items-center justify-between">
            <span>ROAS</span>
            <BarChart3 className="w-3.5 h-3.5 text-[#cca34c]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#cca34c] mt-1.5">
            {roas}
          </div>
        </div>
      </div>

      {/* CRM Funnel Stage Progress */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-extrabold text-base text-[var(--ink)]">CRM Pipeline Funnel Velocity</h3>
          <span className="text-xs text-[var(--mu)]">Stage volume distribution</span>
        </div>
        <div className="space-y-3.5">
          {stageCounts.map((s) => {
            const pct = Math.min(100, Math.round((s.count / maxStageCount) * 100));
            return (
              <div key={s.stage} className="flex items-center gap-3 text-xs sm:text-sm">
                <span className="w-28 font-semibold text-[var(--ink)] flex-shrink-0">
                  {s.stage}
                </span>
                <div className="flex-1 h-3.5 bg-[var(--bd)] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      s.stage === 'Won'
                        ? 'bg-[#00c48c]'
                        : s.stage === 'Booked' || s.stage === 'Proposal'
                        ? 'bg-[#cca34c]'
                        : s.stage === 'Lost'
                        ? 'bg-red-400'
                        : 'bg-gradient-to-r from-[#00c48c] to-[#cca34c]'
                    }`}
                  />
                </div>
                <span className="w-16 text-right font-bold text-[var(--ink)] flex-shrink-0">
                  {s.count} leads
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leads & Orders by Traffic Source */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-extrabold text-base text-[var(--ink)]">Leads &amp; Orders by Traffic Source</h3>
          <span className="text-xs text-[var(--mu)]">17-channel cross-comparison</span>
        </div>
        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">
          {channelStats.map((ch) => {
            const barWidth = ch.leads ? Math.min(100, (ch.leads / maxChannelLeads) * 100) : 0;
            return (
              <div key={ch.source} className="flex items-center gap-3 text-xs sm:text-sm">
                <span className="w-36 font-semibold text-[var(--ink)] truncate flex-shrink-0" title={ch.source}>
                  {ch.source}
                </span>
                <div className="flex-1 h-3 bg-[var(--bd)] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${barWidth}%` }}
                    className="h-full bg-gradient-to-r from-[#00c48c] to-[#009b6e] rounded-full transition-all duration-300"
                  />
                </div>
                <span className="w-16 text-right font-medium text-[var(--mu)] flex-shrink-0">
                  {ch.leads} leads
                </span>
                <span className="w-16 text-right font-black text-[#00c48c] flex-shrink-0">
                  {ch.won} won
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

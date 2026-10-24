import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { CeoApprovalItem } from '../../types/index.ts';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  DollarSign,
  Users,
  Calendar,
  Rocket,
  Check,
  Clock,
  ExternalLink,
  Lock,
  RotateCcw,
  AlertTriangle,
  FileText,
  HelpCircle,
  Megaphone,
  CheckCheck,
  Printer,
  Copy,
  ChevronRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

export const CeoApprovalsTab: React.FC = () => {
  const {
    leads,
    bookings,
    projects,
    campaigns = [],
    ceoApprovals = [],
    decideCeoApproval,
    dispatchCeoBriefing,
    currentUser,
    setMachineTab,
    ceoNotificationSettings,
    updateCeoNotificationSettings,
  } = useBusiness();

  const isCeo = currentUser?.role === 'ceo';

  // Subtab: 'approvals' | 'briefing' | 'settings'
  const [activeSubTab, setActiveSubTab] = useState<'approvals' | 'briefing' | 'settings'>('approvals');
  const [filterType, setFilterType] = useState<string>('all');
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});
  const [decidingId, setDecidingId] = useState<string | null>(null);

  // Dispatch Briefing state
  const [dispatchChannel, setDispatchChannel] = useState<'both' | 'email' | 'whatsapp'>('both');
  const [briefingCustomNote, setBriefingCustomNote] = useState<string>('');
  const [dispatchLoading, setDispatchLoading] = useState<boolean>(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);
  const [lastDispatchedPreview, setLastDispatchedPreview] = useState<any | null>(null);

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

  // Metrics calculation
  const wonLeads = leads.filter((l) => l.stage === 'Won');
  const wonRevenue = wonLeads.reduce((s, l) => s + (l.val || 0), 0);
  const pendingApprovals = ceoApprovals.filter((a) => a.status === 'pending');
  const decidedApprovals = ceoApprovals.filter((a) => a.status !== 'pending');
  const activeCampaignsCount = campaigns.filter((c) => c.status === 'active').length;

  const filteredApprovals = ceoApprovals.filter((item) => {
    if (filterType === 'pending') return item.status === 'pending';
    if (filterType === 'decided') return item.status !== 'pending';
    if (filterType === 'campaigns') return item.type === 'ad_campaign_launch';
    if (filterType === 'deals') return item.type === 'proposal_dispatch' || item.type === 'high_ticket_deal';
    return true;
  });

  // Handle Approve or Reject
  const handleDecide = async (id: string, decision: 'approved' | 'rejected') => {
    setDecidingId(id);
    const note = decisionNotes[id] || undefined;
    try {
      await decideCeoApproval(id, decision, note);
    } finally {
      setDecidingId(null);
    }
  };

  // Dispatch CEO Briefing
  const handleSendBriefing = async () => {
    setDispatchLoading(true);
    setDispatchSuccessMsg(null);
    try {
      const res = await dispatchCeoBriefing(dispatchChannel, briefingCustomNote.trim() || undefined);
      setDispatchSuccessMsg(res.message);
      if (res.payload) {
        setLastDispatchedPreview(res.payload);
      }
      setBriefingCustomNote('');
    } finally {
      setDispatchLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-16">
      {/* CEO Executive Clearance Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#070e24] via-[#0c183a] to-[#070e24] text-white p-6 sm:p-8 border border-[#cca34c]/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c48c]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#cca34c]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#cca34c]/20 border border-[#cca34c]/40 text-[#cca34c] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span>👑</span>
                <span>CEO Executive Briefing &amp; Approvals</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#00c48c]/15 border border-[#00c48c]/30 text-[#00c48c] text-xs font-bold">
                Level 5 Clearance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              CEO Notifications &amp; Authorization Gateway
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/75 max-w-2xl leading-relaxed">
              Review and authorize pending Meta/Google ad launches, commercial proposals, and autonomous WhatsApp agent triggers. Dispatch real-time executive telemetry to CEO Email (<strong className="text-white">backforbrandllc@gmail.com</strong>) and WhatsApp.
            </p>
          </div>
          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveSubTab('briefing')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-[#00c48c]/30 cursor-pointer"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Dispatch CEO Live Briefing</span>
            </button>
            <button
              onClick={() => setActiveSubTab('approvals')}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative"
            >
              <CheckCheck className="w-4 h-4 text-[#cca34c]" />
              <span>Pending Approvals</span>
              {pendingApprovals.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {pendingApprovals.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Telemetry Strip */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] font-bold text-gray-300 uppercase block">Pending Approvals</span>
            <span className="text-2xl font-black text-amber-400 font-mono">
              {pendingApprovals.length} Actions
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-300 uppercase block">Closed Won Revenue</span>
            <span className="text-2xl font-black text-[#00c48c] font-mono">
              ${wonRevenue.toLocaleString()} USD
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-300 uppercase block">Active Marketing Campaigns</span>
            <span className="text-2xl font-black text-white font-mono">
              {activeCampaignsCount} Active
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-300 uppercase block">Client Appointments</span>
            <span className="text-2xl font-black text-white font-mono">
              {bookings.length} Sessions
            </span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-2 sm:p-3 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'approvals', label: `1. Authorization Queue (${pendingApprovals.length})`, icon: ShieldCheck },
          { id: 'briefing', label: '2. Dispatch CEO Email & WhatsApp Report', icon: Send },
          { id: 'settings', label: '3. Notification Alert Settings', icon: Lock },
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
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: AUTHORIZATION & APPROVALS QUEUE */}
      {activeSubTab === 'approvals' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filter Bar */}
          <div className="bg-[var(--card)] border border-[var(--bd)] p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--mu)]">Filter Approvals:</span>
              <div className="flex items-center gap-1 bg-[var(--soft)] p-1 rounded-xl border border-[var(--bd)]">
                {[
                  { id: 'all', label: `All (${ceoApprovals.length})` },
                  { id: 'pending', label: `Pending (${pendingApprovals.length})` },
                  { id: 'decided', label: `Decided (${decidedApprovals.length})` },
                  { id: 'campaigns', label: 'Ad Launches' },
                  { id: 'deals', label: 'Deals & Proposals' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterType === f.id
                        ? 'bg-[#070e24] text-[#00c48c] shadow-xs'
                        : 'text-[var(--mu)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-[var(--mu)]">
              CEO Action: Click Approve to execute action across CRM and Ad systems.
            </span>
          </div>

          {/* Approvals Cards */}
          <div className="space-y-4">
            {filteredApprovals.length === 0 ? (
              <div className="text-center py-16 bg-[var(--card)] rounded-3xl border border-[var(--bd)] space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#00c48c] mx-auto opacity-70" />
                <h3 className="text-base font-bold text-[var(--ink)]">All Approvals Are Up to Date!</h3>
                <p className="text-xs text-[var(--mu)] max-w-sm mx-auto">
                  No pending action requests require CEO authorization at this moment.
                </p>
              </div>
            ) : (
              filteredApprovals.map((appr) => {
                const isPending = appr.status === 'pending';
                const isApproved = appr.status === 'approved';
                const isRejected = appr.status === 'rejected';
                const isDeciding = decidingId === appr.id;

                return (
                  <div
                    key={appr.id}
                    className={`p-6 rounded-3xl border transition-all space-y-4 shadow-sm ${
                      isPending
                        ? 'bg-[var(--card)] border-[#cca34c]/50 ring-1 ring-[#cca34c]/20'
                        : isApproved
                        ? 'bg-[#00c48c]/5 border-[#00c48c]/30'
                        : 'bg-red-500/5 border-red-500/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              appr.urgency === 'critical'
                                ? 'bg-red-500/15 text-red-500 border-red-500/30'
                                : appr.urgency === 'high'
                                ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                                : 'bg-blue-500/15 text-blue-500 border-blue-500/30'
                            }`}
                          >
                            {appr.urgency} Urgency
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isApproved
                                ? 'bg-[#00c48c] text-white'
                                : isRejected
                                ? 'bg-red-500 text-white'
                                : 'bg-[#cca34c] text-[#070e24] animate-pulse font-extrabold'
                            }`}
                          >
                            {appr.status.toUpperCase()}
                          </span>
                          <span className="text-[11px] text-[var(--mu)] font-mono">
                            Submitted: {appr.submittedAt} by <strong className="text-[var(--ink)]">{appr.requestedBy}</strong>
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-[var(--ink)] leading-snug">
                          {appr.title}
                        </h3>
                      </div>

                      {appr.amount && (
                        <div className="text-right flex-shrink-0">
                          <span className="text-[10px] font-bold text-[var(--mu)] uppercase block">Budget / Value</span>
                          <span className="text-xl font-black text-[#cca34c] font-mono">
                            ${appr.amount.toLocaleString()} {appr.currency || 'USD'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details Box */}
                    <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] text-xs text-[var(--ink)] leading-relaxed space-y-2">
                      <p>{appr.details}</p>
                      {appr.decisionNote && (
                        <div className="pt-2 border-t border-[var(--bd)] text-[11px] text-[#00c48c] font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>{appr.decisionNote} ({appr.decidedAt})</span>
                        </div>
                      )}
                    </div>

                    {/* Action Decision Controls (For CEO) */}
                    {isPending && (
                      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <input
                          type="text"
                          placeholder="Optional decision note / feedback..."
                          value={decisionNotes[appr.id] || ''}
                          onChange={(e) => setDecisionNotes({ ...decisionNotes, [appr.id]: e.target.value })}
                          className="w-full sm:w-80 px-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-xs text-[var(--ink)]"
                        />
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => handleDecide(appr.id, 'rejected')}
                            disabled={isDeciding}
                            className="px-4 py-2 rounded-xl border border-red-500/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleDecide(appr.id, 'approved')}
                            disabled={isDeciding}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-black shadow-md shadow-[#00c48c]/30 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Authorize &amp; Execute</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: DISPATCH CEO EMAIL & WHATSAPP REPORT */}
      {activeSubTab === 'briefing' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00c48c] block mb-1">
                  Executive Dispatch Engine
                </span>
                <h3 className="text-xl font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#00c48c]" />
                  <span>Send Real-Time Intelligence Report to CEO</span>
                </h3>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Synthesize today&apos;s active leads, closed won revenue, appointment bookings, and pending approvals into a formatted briefing.
                </p>
              </div>
            </div>

            {dispatchSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{dispatchSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <strong className="block text-sm font-black text-[var(--ink)]">
                  CEO Email Destination
                </strong>
                <div className="flex items-center gap-2 font-mono">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-[var(--ink)] select-all">{ceoNotificationSettings.ceoEmail}</span>
                </div>
                <p className="text-[11px] text-[var(--mu)] leading-relaxed">
                  Receives high-level executive breakdown, revenue attribution matrix, and action item links.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <strong className="block text-sm font-black text-[var(--ink)]">
                  CEO WhatsApp Direct
                </strong>
                <div className="flex items-center gap-2 font-mono">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-[var(--ink)] select-all">{ceoNotificationSettings.ceoPhone}</span>
                </div>
                <p className="text-[11px] text-[var(--mu)] leading-relaxed">
                  Receives formatted WhatsApp notification with 1-tap quick action deep links.
                </p>
              </div>
            </div>

            {/* Dispatch Configuration */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">Target Channel</label>
                  <select
                    value={dispatchChannel}
                    onChange={(e) => setDispatchChannel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] font-bold text-[var(--ink)]"
                  >
                    <option value="both">Both (Email &amp; WhatsApp)</option>
                    <option value="email">Email Only</option>
                    <option value="whatsapp">WhatsApp Only</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[var(--ink)] mb-1">Optional Message / Operator Note</label>
                  <input
                    type="text"
                    value={briefingCustomNote}
                    onChange={(e) => setBriefingCustomNote(e.target.value)}
                    placeholder="e.g. Meta Ads campaign ready for review, 3 high-intent bookings today..."
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] text-xs"
                  />
                </div>
              </div>

              <button
                onClick={handleSendBriefing}
                disabled={dispatchLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00c48c]/30 cursor-pointer disabled:opacity-50"
              >
                {dispatchLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing &amp; Disagreeing Report...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Dispatch Real-Time Report to CEO Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Dispatched Preview */}
            {lastDispatchedPreview && (
              <div className="p-5 rounded-2xl bg-[#070e24] text-white border border-[#cca34c]/40 space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <strong className="text-xs font-black text-[#cca34c] uppercase tracking-wider">
                    Dispatched Report Transcript ({lastDispatchedPreview.channel.toUpperCase()})
                  </strong>
                  <button
                    onClick={() => handleCopy(lastDispatchedPreview.emailBody || lastDispatchedPreview.whatsappBody, 'report_body')}
                    className="text-[#00c48c] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'report_body' ? <Check className="w-3 h-3 text-[#00c48c]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'report_body' ? 'Copied' : 'Copy Report'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-[#050a1b] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed border border-white/10">
                  {lastDispatchedPreview.emailBody || lastDispatchedPreview.whatsappBody}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: SETTINGS & POLICIES */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-lg font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#cca34c]" />
              <span>CEO Notification &amp; Approval Governance Rules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <label className="block font-bold text-[var(--ink)]">CEO Primary Email</label>
                <input
                  type="email"
                  value={ceoNotificationSettings.ceoEmail}
                  onChange={(e) => updateCeoNotificationSettings({ ceoEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] font-bold text-[var(--ink)]"
                />
              </div>

              <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3">
                <label className="block font-bold text-[var(--ink)]">CEO Primary WhatsApp</label>
                <input
                  type="text"
                  value={ceoNotificationSettings.ceoPhone}
                  onChange={(e) => updateCeoNotificationSettings({ ceoPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] font-mono font-bold text-[var(--ink)]"
                />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] cursor-pointer">
                <div>
                  <span className="font-bold text-[var(--ink)] block">Automated Email Notifications</span>
                  <span className="text-[11px] text-[var(--mu)]">Send instant email alert when high-ticket deal or ad campaign requires approval</span>
                </div>
                <input
                  type="checkbox"
                  checked={ceoNotificationSettings.emailAlertsEnabled}
                  onChange={(e) => updateCeoNotificationSettings({ emailAlertsEnabled: e.target.checked })}
                  className="w-5 h-5 text-[#00c48c] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] cursor-pointer">
                <div>
                  <span className="font-bold text-[var(--ink)] block">Automated WhatsApp Notifications</span>
                  <span className="text-[11px] text-[var(--mu)]">Send WhatsApp message with 1-click approve link for urgent actions</span>
                </div>
                <input
                  type="checkbox"
                  checked={ceoNotificationSettings.whatsappAlertsEnabled}
                  onChange={(e) => updateCeoNotificationSettings({ whatsappAlertsEnabled: e.target.checked })}
                  className="w-5 h-5 text-[#00c48c] rounded"
                />
              </label>

              <div className="p-4 rounded-2xl bg-[#00c48c]/10 border border-[#00c48c]/30 text-xs text-[var(--ink)] flex items-center justify-between">
                <div>
                  <strong className="block font-bold">Auto-Approval Threshold</strong>
                  <span className="text-[11px] text-[var(--mu)]">Ad budgets and proposals under this value can be initiated by senior managers</span>
                </div>
                <div className="flex items-center gap-1 font-mono font-black text-sm">
                  <span>${ceoNotificationSettings.highValueThresholdUsd} USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

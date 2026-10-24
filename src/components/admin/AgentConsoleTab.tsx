import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  XCircle,
  Zap,
  Sliders,
  Check,
  Clock,
  MessageSquare,
  Calendar,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';

export const AgentConsoleTab: React.FC = () => {
  const {
    agentActions,
    agentSettings,
    approveAgentAction,
    dismissAgentAction,
    updateAgentSettings,
    executeAgentCommand,
    leads,
    projects,
    bookings,
    setMachineTab,
    ceoApprovals = [],
    campaigns = [],
  } = useBusiness();

  const [commandInput, setCommandInput] = useState('');
  const [executing, setExecuting] = useState(false);
  const [agentLogs, setAgentLogs] = useState<Array<{ id: string; role: 'user' | 'agent'; text: string; time: string }>>([
    {
      id: 'log-1',
      role: 'agent',
      text: "Back for Brand Autonomous Services Control Agent is online and monitoring 6 clients, 3 active projects, and 3 calendar appointments. Standing by for instructions or autonomous execution.",
      time: '08:45 AM',
    },
  ]);

  const pendingActions = agentActions.filter((a) => a.status === 'pending_approval');
  const executedActions = agentActions.filter((a) => a.status === 'executed');

  const handleRunCommand = async (customCommand?: string) => {
    const cmd = (customCommand || commandInput).trim();
    if (!cmd || executing) return;

    const userEntry = {
      id: 'log-' + Date.now(),
      role: 'user' as const,
      text: cmd,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAgentLogs((prev) => [...prev, userEntry]);
    if (!customCommand) setCommandInput('');
    setExecuting(true);

    try {
      const res = await executeAgentCommand(cmd);
      setAgentLogs((prev) => [
        ...prev,
        {
          id: 'log-' + (Date.now() + 1),
          role: 'agent' as const,
          text: res.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setAgentLogs((prev) => [
        ...prev,
        {
          id: 'log-' + (Date.now() + 1),
          role: 'agent' as const,
          text: 'Error processing instruction. State remains safely synchronized.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setExecuting(false);
    }
  };

  const sampleCommands = [
    'Send real-time report to CEO Email & WhatsApp',
    'Check Meta & Google Ads campaigns ready to launch',
    'Confirm booking for Dr. Sara Clinic and send calendar link',
    'Move Ali Traders to Won and start onboarding project',
    'Summarize current client revenue and deliverable progress',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Control Pulse */}
      <div className="bg-gradient-to-r from-[#0b1533] via-[#142354] to-[#1e3478] text-white p-6 rounded-3xl shadow-xl border border-blue-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/80 border border-blue-400/40 text-white flex items-center justify-center font-bold relative shadow-lg">
            <Bot className="w-8 h-8 text-blue-200" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0b1533] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Services Manager AI Control Agent
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                Autonomous Level 3
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl leading-relaxed">
              Supervises client lifecycle end-to-end: automates WhatsApp touchpoints, dispatches proposal emails, handles calendar invites, and guides delivery milestones.
            </p>
          </div>
        </div>

        {/* Autonomous Mode Toggle */}
        <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15 backdrop-blur-sm self-stretch lg:self-auto justify-between lg:justify-start">
          <div>
            <span className="text-xs font-bold block text-white">Full Autonomous Mode</span>
            <span className="text-[10px] text-blue-200 block">
              {agentSettings.autonomousMode ? 'Auto-approving routine actions' : 'Manual approval required'}
            </span>
          </div>
          <button
            onClick={() => updateAgentSettings({ autonomousMode: !agentSettings.autonomousMode })}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 cursor-pointer ${
              agentSettings.autonomousMode ? 'bg-emerald-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                agentSettings.autonomousMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[var(--card)] border border-[var(--bd)] p-4 rounded-2xl shadow-sm">
          <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider block">Pending Approvals</span>
          <b className="text-2xl sm:text-3xl font-black text-amber-500 block mt-1">{pendingActions.length}</b>
        </div>
        <div className="bg-[var(--card)] border border-[var(--bd)] p-4 rounded-2xl shadow-sm">
          <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider block">Executed Actions</span>
          <b className="text-2xl sm:text-3xl font-black text-emerald-600 block mt-1">{executedActions.length}</b>
        </div>
        <div className="bg-[var(--card)] border border-[var(--bd)] p-4 rounded-2xl shadow-sm">
          <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider block">Monitored Clients</span>
          <b className="text-2xl sm:text-3xl font-black text-blue-600 block mt-1">{leads.length}</b>
        </div>
        <div className="bg-[var(--card)] border border-[var(--bd)] p-4 rounded-2xl shadow-sm">
          <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider block">Active Projects</span>
          <b className="text-2xl sm:text-3xl font-black text-purple-600 block mt-1">{projects.length}</b>
        </div>
      </div>

      {/* Main Grid: Command Console & Task Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Interactive Command Console & Chat Log */}
        <div className="lg:col-span-7 bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 shadow-sm flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--bd)] mb-4">
            <div className="flex items-center gap-2 font-black text-sm text-[var(--ink)]">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Operational Command Interface</span>
            </div>
            <span className="text-xs text-[var(--mu)]">Voice / NLP Prompt Engine</span>
          </div>

          {/* Interactive Logs */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4 text-xs">
            {agentLogs.map((log) => (
              <div
                key={log.id}
                className={`p-3.5 rounded-2xl ${
                  log.role === 'user'
                    ? 'bg-blue-600 text-white ml-8 rounded-tr-sm'
                    : 'bg-[var(--soft)] text-[var(--ink)] border border-[var(--bd)] mr-8 rounded-tl-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1 opacity-75 text-[10px] font-bold">
                  <span>{log.role === 'user' ? 'Founder / Operator' : 'AI Services Manager Agent'}</span>
                  <span>{log.time}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-line text-xs sm:text-sm">{log.text}</p>
              </div>
            ))}
            {executing && (
              <div className="flex items-center gap-2 text-xs text-blue-600 p-2 font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>Executing across CRM, WhatsApp &amp; Calendar systems...</span>
              </div>
            )}
          </div>

          {/* Quick command pills */}
          <div className="overflow-x-auto flex gap-2 pb-2 mb-3 no-scrollbar">
            {sampleCommands.map((sc, i) => (
              <button
                key={i}
                onClick={() => handleRunCommand(sc)}
                disabled={executing}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-[var(--soft)] border border-[var(--bd)] text-[var(--ink)] hover:border-blue-400 whitespace-nowrap transition-colors flex-shrink-0"
              >
                ⚡ {sc}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunCommand();
            }}
            className="flex items-center gap-2 pt-2 border-t border-[var(--bd)]"
          >
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Instruct agent (e.g. 'Schedule call with Hamza Store', 'Move Ali Traders to Won')..."
              disabled={executing}
              className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!commandInput.trim() || executing}
              className="bg-[#2b59ff] hover:bg-[#1a3fd1] disabled:opacity-40 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Execute</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Column (5 cols): Action Approval Queue & Policy Settings */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick CEO & Campaign Launchpad Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#070e24] to-[#0c183a] text-white border border-[#cca34c]/40 text-xs space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-black text-[#cca34c] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <span>👑</span>
                <span>Executive CEO &amp; Campaign Controls</span>
              </span>
              <span className="text-[10px] bg-[#00c48c]/20 text-[#00c48c] px-2 py-0.5 rounded font-black border border-[#00c48c]/40">
                Level 5 Clearance
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setMachineTab('CEO Reports & Approvals')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer relative"
              >
                <span>CEO Approvals</span>
                {ceoApprovals.filter((a) => a.status === 'pending').length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    {ceoApprovals.filter((a) => a.status === 'pending').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMachineTab('Ads & Social Launchpad')}
                className="p-2.5 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#00c48c]/25"
              >
                <span>Ads Launchpad</span>
              </button>
            </div>
          </div>

          {/* Action Approval Queue */}
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-5 shadow-sm flex flex-col h-[380px]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)] mb-3">
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-[var(--ink)]">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Pending Agent Actions ({pendingActions.length})</span>
              </div>
              <span className="text-[10px] text-[var(--mu)]">Click to execute</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {pendingActions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--mu)] text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2 opacity-80" />
                  <span>All client actions are up to date. No pending approvals in queue.</span>
                </div>
              ) : (
                pendingActions.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-2xl bg-[var(--soft)]/60 border border-[var(--bd)] text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <strong className="font-bold text-[var(--ink)] block">
                        {act.title}
                      </strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold whitespace-nowrap">
                        {act.targetClient}
                      </span>
                    </div>
                    <p className="text-[var(--mu)] text-[11px] leading-relaxed">
                      {act.details}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[var(--mu)]">{act.timestamp}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => dismissAgentAction(act.id)}
                          className="px-2.5 py-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-[11px] font-semibold transition-colors"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => approveAgentAction(act.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve &amp; Send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Autonomous Policy & Rules */}
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-5 shadow-sm text-xs space-y-3">
            <h4 className="font-extrabold text-xs text-[var(--ink)] uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-500" />
              <span>Autonomous Rules &amp; Triggers</span>
            </h4>

            <div className="space-y-2.5 text-[var(--ink)]">
              <label className="flex items-center justify-between p-2 rounded-xl bg-[var(--soft)]/50 hover:bg-[var(--soft)] cursor-pointer">
                <span>Auto-qualify new inbound leads</span>
                <input
                  type="checkbox"
                  checked={agentSettings.autoQualifyLeads}
                  onChange={(e) => updateAgentSettings({ autoQualifyLeads: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-[var(--soft)]/50 hover:bg-[var(--soft)] cursor-pointer">
                <span>Auto-send WhatsApp greeting to new leads</span>
                <input
                  type="checkbox"
                  checked={agentSettings.autoSendWhatsAppWelcome}
                  onChange={(e) => updateAgentSettings({ autoSendWhatsAppWelcome: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-[var(--soft)]/50 hover:bg-[var(--soft)] cursor-pointer">
                <span>Auto-send 24h &amp; 1h booking reminders</span>
                <input
                  type="checkbox"
                  checked={agentSettings.autoSendBookingReminders}
                  onChange={(e) => updateAgentSettings({ autoSendBookingReminders: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-[var(--soft)]/50 hover:bg-[var(--soft)] cursor-pointer">
                <span>Escalate stale leads after 48 hours</span>
                <input
                  type="checkbox"
                  checked={agentSettings.autoEscalateStaleLeads}
                  onChange={(e) => updateAgentSettings({ autoEscalateStaleLeads: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  AutomationRule,
  AutomationTriggerType,
  AutomationActionType,
  EmailSequenceStep,
  LeadStage,
  STAGES,
  TRAFFIC_SOURCES,
} from '../../types/index.ts';
import {
  Zap,
  Plus,
  Play,
  Pause,
  Edit3,
  Trash2,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  Send,
  User,
  Tag,
  Calendar,
  Filter,
  FileText,
  RotateCcw,
} from 'lucide-react';

export const AutomationsTab: React.FC = () => {
  const {
    automations,
    automationLogs,
    leads,
    addAutomation,
    updateAutomation,
    toggleAutomationActive,
    deleteAutomation,
    triggerAutomation,
    setMachineTab,
  } = useBusiness();

  // Filter state
  const [filterTrigger, setFilterTrigger] = useState<string>('all');
  const [activeTabSub, setActiveTabSub] = useState<'workflows' | 'logs'>('workflows');

  // Modal State for Create / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [triggerType, setTriggerType] = useState<AutomationTriggerType>('lead_created');
  const [toStageCondition, setToStageCondition] = useState<LeadStage>('Proposal');
  const [staleHours, setStaleHours] = useState(48);
  const [actionType, setActionType] = useState<AutomationActionType>('combined_sequence');
  const [targetStage, setTargetStage] = useState<LeadStage>('Contacted');
  const [statusNote, setStatusNote] = useState('Automated sequence dispatched');
  const [tagInput, setTagInput] = useState('');
  const [tagsToAdd, setTagsToAdd] = useState<string[]>(['Nurture Active']);
  const [emailSequence, setEmailSequence] = useState<EmailSequenceStep[]>([
    {
      id: 'step-new-1',
      stepNumber: 1,
      delayHours: 0,
      delayLabel: 'Immediate',
      subject: 'Welcome to Back for Brand: Your Strategy Architecture for {{company}}',
      body: 'Hi {{name}},\n\nThank you for reaching out to Back for Brand LLC. We specialize in building autonomous client acquisition machines.\n\nOur team is reviewing your requirements and will follow up shortly.\n\nWarm regards,\nGhazi Wazir\nFounder & CEO',
    },
  ]);

  // Quick Run Target Lead Selection
  const [testLeadId, setTestLeadId] = useState<string>(leads[0]?.id || '');
  const [executingId, setExecutingId] = useState<string | null>(null);

  // Helper to open edit modal
  const handleOpenEdit = (rule: AutomationRule) => {
    setEditingRuleId(rule.id);
    setName(rule.name);
    setDescription(rule.description);
    setActive(rule.active);
    setTriggerType(rule.triggerType);
    setToStageCondition(rule.triggerCondition?.toStage || 'Proposal');
    setStaleHours(rule.triggerCondition?.staleHours || 48);
    setActionType(rule.actionType);
    setTargetStage(rule.targetStage || 'Contacted');
    setStatusNote(rule.statusNote || '');
    setTagsToAdd(rule.tagsToAdd ? [...rule.tagsToAdd] : []);
    setEmailSequence(rule.emailSequence ? JSON.parse(JSON.stringify(rule.emailSequence)) : []);
    setShowModal(true);
  };

  // Helper to open create modal
  const handleOpenCreate = () => {
    setEditingRuleId(null);
    setName('');
    setDescription('');
    setActive(true);
    setTriggerType('lead_created');
    setToStageCondition('Proposal');
    setStaleHours(48);
    setActionType('combined_sequence');
    setTargetStage('Contacted');
    setStatusNote('Automated sequence dispatched');
    setTagsToAdd(['Nurture Active']);
    setEmailSequence([
      {
        id: 'step-new-1',
        stepNumber: 1,
        delayHours: 0,
        delayLabel: 'Immediate',
        subject: 'Welcome to Back for Brand: Growth Architecture for {{company}}',
        body: 'Hi {{name}},\n\nThank you for reaching out to Back for Brand LLC. We engineer full-funnel systems that turn visitors into customers on autopilot.\n\nWarm regards,\nGhazi Wazir',
      },
    ]);
    setShowModal(true);
  };

  const handleAddSequenceStep = () => {
    const nextStepNum = emailSequence.length + 1;
    const delay = nextStepNum === 2 ? 24 : nextStepNum === 3 ? 48 : 72;
    const newStep: EmailSequenceStep = {
      id: 'step-' + Math.random().toString(36).slice(2, 7),
      stepNumber: nextStepNum,
      delayHours: delay,
      delayLabel: `After ${delay} hours`,
      subject: `Step ${nextStepNum}: Follow-up for {{name}}`,
      body: `Hi {{name}},\n\nChecking in regarding your digital deliverables. Let us know if you need any adjustments!\n\nBest regards,\nBack for Brand Team`,
    };
    setEmailSequence([...emailSequence, newStep]);
  };

  const handleRemoveSequenceStep = (stepId: string) => {
    if (emailSequence.length <= 1) return;
    const filtered = emailSequence
      .filter((s) => s.id !== stepId)
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setEmailSequence(filtered);
  };

  const handleUpdateStep = (
    index: number,
    field: keyof EmailSequenceStep,
    value: string | number
  ) => {
    const updated = [...emailSequence];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setEmailSequence(updated);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tagsToAdd.includes(tagInput.trim())) {
      setTagsToAdd([...tagsToAdd, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTagsToAdd(tagsToAdd.filter((item) => item !== t));
  };

  const handleSaveAutomation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      active,
      triggerType,
      triggerCondition: {
        toStage: triggerType === 'stage_changed' ? toStageCondition : undefined,
        staleHours: triggerType === 'lead_stale' ? staleHours : undefined,
      },
      actionType,
      targetStage: actionType !== 'send_email_sequence' ? targetStage : undefined,
      statusNote: statusNote.trim() || undefined,
      tagsToAdd: tagsToAdd.length > 0 ? tagsToAdd : undefined,
      emailSequence: actionType !== 'update_lead_stage' ? emailSequence : [],
    };

    if (editingRuleId) {
      updateAutomation(editingRuleId, payload);
    } else {
      addAutomation(payload);
    }

    setShowModal(false);
  };

  const handleTestRun = async (automationId: string) => {
    setExecutingId(automationId);
    try {
      await triggerAutomation(automationId, testLeadId || leads[0]?.id);
    } finally {
      setExecutingId(null);
    }
  };

  // Filtered automations
  const filteredAutomations = automations.filter((rule) => {
    if (filterTrigger === 'all') return true;
    return rule.triggerType === filterTrigger;
  });

  const totalActive = automations.filter((a) => a.active).length;
  const totalExecutions = automations.reduce((sum, a) => sum + (a.executionsCount || 0), 0);
  const totalEmailSteps = automations.reduce((sum, a) => sum + (a.emailSequence?.length || 0), 0);

  // Helper trigger badge labels
  const getTriggerBadge = (type: AutomationTriggerType, condition?: AutomationRule['triggerCondition']) => {
    switch (type) {
      case 'lead_created':
        return { label: 'When Lead Created', icon: Sparkles, color: 'text-[#00c48c] bg-[#00c48c]/15 border-[#00c48c]/30' };
      case 'stage_changed':
        return {
          label: `When Stage → ${condition?.toStage || 'Any'}`,
          icon: Layers,
          color: 'text-[#cca34c] bg-[#cca34c]/15 border-[#cca34c]/30',
        };
      case 'booking_confirmed':
        return { label: 'When Booking Confirmed', icon: Calendar, color: 'text-sky-500 bg-sky-500/15 border-sky-400/30' };
      case 'lead_stale':
        return {
          label: `When Inactive > ${condition?.staleHours || 48}h`,
          icon: Clock,
          color: 'text-rose-500 bg-rose-500/15 border-rose-400/30',
        };
      case 'value_threshold':
        return { label: 'When Deal > $1,500', icon: Zap, color: 'text-purple-500 bg-purple-500/15 border-purple-400/30' };
      default:
        return { label: 'Event Trigger', icon: Zap, color: 'text-blue-500 bg-blue-500/15 border-blue-400/30' };
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      {/* Top Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#070e24] via-[#0c183a] to-[#070e24] text-white p-6 sm:p-8 border border-[#cca34c]/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c48c]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#cca34c]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#00c48c]/15 border border-[#00c48c]/35 text-[#00c48c] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-[#00c48c]" />
                <span>Workflow Engine</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#cca34c]/20 border border-[#cca34c]/40 text-[#cca34c] text-xs font-bold">
                Email Sequences &amp; Status Triggers
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Automated Sequences &amp; Lifecycle Triggers
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/75 max-w-2xl leading-relaxed">
              Define trigger-based automated workflows that instantly send multi-step email nurture series, update lead pipeline stages, assign tags, and guarantee zero lead leakage.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-[#00c48c]/30 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create Automation Workflow</span>
            </button>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Active Workflows
            </span>
            <span className="text-2xl font-black text-white">
              {totalActive} <span className="text-xs font-normal text-emerald-100/60">/ {automations.length} Rules</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Executions Run
            </span>
            <span className="text-2xl font-black text-[#00c48c]">
              {totalExecutions}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Email Steps Configured
            </span>
            <span className="text-2xl font-black text-[#cca34c]">
              {totalEmailSteps} Steps
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Autonomous Dispatch
            </span>
            <span className="text-2xl font-black text-[#00c48c] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c] animate-pulse" />
              Active 24/7
            </span>
          </div>
        </div>
      </div>

      {/* Subtab Toggle: Workflows vs Execution Logs */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTabSub('workflows')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSub === 'workflows'
                ? 'bg-gradient-to-r from-[#00c48c] to-[#009b6e] text-white shadow-sm'
                : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Configured Workflows ({automations.length})</span>
          </button>
          <button
            onClick={() => setActiveTabSub('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSub === 'logs'
                ? 'bg-[#070e24] text-[#cca34c] border border-[#cca34c]/40 shadow-sm'
                : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Execution Audit Trail ({automationLogs.length})</span>
          </button>
        </div>

        {/* Target Lead Selector for Quick Test Simulation */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-[var(--mu)] font-bold whitespace-nowrap">Test Contact:</span>
          <select
            value={testLeadId}
            onChange={(e) => setTestLeadId(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold focus:outline-none focus:border-[#00c48c]"
          >
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.stage} · {l.val ? `$${l.val}` : '$0'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: WORKFLOWS LIST */}
      {activeTabSub === 'workflows' && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] font-black uppercase text-[var(--mu)] tracking-wider mr-1">
              Trigger Filter:
            </span>
            {[
              { id: 'all', label: 'All Triggers' },
              { id: 'lead_created', label: 'Lead Created' },
              { id: 'stage_changed', label: 'Stage Changed' },
              { id: 'booking_confirmed', label: 'Booking Confirmed' },
              { id: 'lead_stale', label: 'Stale Leads' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterTrigger(f.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterTrigger === f.id
                    ? 'bg-[#070e24] text-[#00c48c] border border-[#00c48c]/40 shadow-xs'
                    : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)] border border-[var(--bd)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Automations Cards */}
          <div className="grid grid-cols-1 gap-5">
            {filteredAutomations.map((rule) => {
              const triggerBadge = getTriggerBadge(rule.triggerType, rule.triggerCondition);
              const TriggerIcon = triggerBadge.icon;
              const isExecuting = executingId === rule.id;

              return (
                <div
                  key={rule.id}
                  className={`rounded-3xl border transition-all p-6 sm:p-7 shadow-sm ${
                    rule.active
                      ? 'bg-[var(--card)] border-[var(--bd)] hover:border-[#00c48c]/50'
                      : 'bg-[var(--soft)]/40 border-[var(--bd)]/60 opacity-80'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--bd)]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 border ${triggerBadge.color}`}
                        >
                          <TriggerIcon className="w-3.5 h-3.5" />
                          <span>{triggerBadge.label}</span>
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-[var(--ink)] tracking-tight">
                          {rule.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[var(--mu)] max-w-2xl leading-relaxed">
                        {rule.description}
                      </p>
                    </div>

                    {/* Active Toggle & Quick Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleAutomationActive(rule.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                          rule.active
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-300'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            rule.active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                          }`}
                        />
                        <span>{rule.active ? 'Active' : 'Paused'}</span>
                      </button>

                      <button
                        onClick={() => handleTestRun(rule.id)}
                        disabled={isExecuting}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#cca34c] to-[#b8903c] hover:from-[#e5b85c] hover:to-[#cca34c] text-[#070e24] text-xs font-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                        title="Simulate workflow execution on selected test contact"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{isExecuting ? 'Running...' : 'Test Run'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(rule)}
                        className="p-2 rounded-xl border border-[var(--bd)] text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--soft)] transition-colors cursor-pointer"
                        title="Edit Automation Rule"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete automation "${rule.name}"?`)) {
                            deleteAutomation(rule.id);
                          }
                        }}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Execution Flow Pipeline */}
                  <div className="py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Step 1: Trigger Box */}
                    <div className="md:col-span-4 p-4 rounded-2xl bg-[var(--soft)]/70 border border-[var(--bd)] space-y-1.5 text-xs">
                      <div className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider flex items-center justify-between">
                        <span>Trigger Condition</span>
                        <TriggerIcon className="w-3.5 h-3.5" />
                      </div>
                      <b className="text-[var(--ink)] block font-bold text-sm">
                        {triggerBadge.label}
                      </b>
                      <span className="text-[11px] text-[var(--mu)] block">
                        Source: {rule.triggerCondition?.source || 'All Inbound Channels'}
                      </span>
                    </div>

                    {/* Arrow Divider */}
                    <div className="hidden md:flex md:col-span-1 justify-center text-[var(--mu)]">
                      <ArrowRight className="w-5 h-5 text-[#00c48c]" />
                    </div>

                    {/* Step 2: Lead Status & Tags Action */}
                    <div className="md:col-span-3 p-4 rounded-2xl bg-[var(--soft)]/70 border border-[var(--bd)] space-y-1.5 text-xs">
                      <div className="text-[10px] font-bold text-[#00c48c] uppercase tracking-wider flex items-center justify-between">
                        <span>Lead Status Action</span>
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      {rule.targetStage ? (
                        <div>
                          <span className="text-[11px] text-[var(--mu)]">Advance Stage to:</span>
                          <span className="block font-black text-sm text-[var(--ink)]">
                            {rule.targetStage}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[var(--mu)] italic">
                          No stage change
                        </span>
                      )}
                      {rule.tagsToAdd && rule.tagsToAdd.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {rule.tagsToAdd.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#00c48c]/15 text-[#00c48c]"
                            >
                              +{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Arrow Divider */}
                    <div className="hidden md:flex md:col-span-1 justify-center text-[var(--mu)]">
                      <ArrowRight className="w-5 h-5 text-[#00c48c]" />
                    </div>

                    {/* Step 3: Email Sequence Pipeline */}
                    <div className="md:col-span-3 p-4 rounded-2xl bg-[var(--soft)]/70 border border-[var(--bd)] space-y-1.5 text-xs">
                      <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Email Sequence</span>
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <b className="text-[var(--ink)] block font-bold text-sm">
                        {rule.emailSequence?.length || 0} Step Sequence
                      </b>
                      <div className="space-y-1">
                        {(rule.emailSequence || []).map((step) => (
                          <div
                            key={step.id}
                            className="text-[10px] text-[var(--mu)] flex items-center justify-between truncate"
                          >
                            <span className="font-semibold text-[var(--ink)]">
                              Step {step.stepNumber} ({step.delayLabel})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sequence Preview Accordion */}
                  {rule.emailSequence && rule.emailSequence.length > 0 && (
                    <div className="pt-3 border-t border-[var(--bd)]/80 space-y-2">
                      <span className="text-[10px] font-bold text-[var(--mu)] uppercase tracking-wider block">
                        Sequence Steps Preview:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {rule.emailSequence.map((step) => (
                          <div
                            key={step.id}
                            className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--bd)] text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-[#cca34c]">
                                Step {step.stepNumber} · {step.delayLabel}
                              </span>
                              <Mail className="w-3 h-3 text-[var(--mu)]" />
                            </div>
                            <strong className="block text-[11px] font-bold text-[var(--ink)] truncate" title={step.subject}>
                              {step.subject}
                            </strong>
                            <p className="text-[10px] text-[var(--mu)] line-clamp-2">
                              {step.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card Footer / Stats */}
                  <div className="mt-4 pt-3 border-t border-[var(--bd)] flex items-center justify-between text-xs text-[var(--mu)]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00c48c]" />
                      <span>{rule.executionsCount} successful executions recorded</span>
                    </span>
                    <span className="text-[11px] font-mono">
                      Last run: {rule.lastExecutedAt || 'Pending trigger'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: EXECUTION LOGS AUDIT TRAIL */}
      {activeTabSub === 'logs' && (
        <div className="rounded-3xl bg-[var(--card)] border border-[var(--bd)] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
            <div>
              <h3 className="text-base font-black text-[var(--ink)]">
                Real-Time Automation Execution Logs
              </h3>
              <p className="text-xs text-[var(--mu)]">
                Live audit trail of dispatched sequences, stage migrations, and contact status updates.
              </p>
            </div>
            <button
              onClick={() => {
                const auto = automations[0];
                if (auto) handleTestRun(auto.id);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 text-xs font-bold hover:bg-[#00c48c]/25 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Trigger Event</span>
            </button>
          </div>

          <div className="divide-y divide-[var(--bd)]/70">
            {automationLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[var(--mu)]">
                No automation events recorded yet. Run a test trigger above.
              </div>
            ) : (
              automationLogs.map((log) => (
                <div key={log.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#00c48c] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      <Zap className="w-4 h-4 text-[#00c48c]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="font-bold text-sm text-[var(--ink)]">
                          {log.automationName}
                        </strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 uppercase">
                          {log.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--ink)]/80 mt-0.5">
                        {log.actionSummary}
                      </p>
                      <span className="text-[10px] text-[var(--mu)] font-mono">
                        Target: {log.targetContact} {log.targetEmail && `(${log.targetEmail})`}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[var(--mu)] font-mono whitespace-nowrap">
                    {log.timestamp}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT AUTOMATION WORKFLOW MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl rounded-3xl bg-[var(--bg)] border-2 border-[#cca34c]/40 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
              <div>
                <h3 className="text-lg font-black text-[var(--ink)] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#00c48c]" />
                  <span>
                    {editingRuleId ? 'Edit Automation Workflow' : 'Build Automation Workflow'}
                  </span>
                </h3>
                <p className="text-xs text-[var(--mu)]">
                  Configure trigger conditions, lead status migrations, and email sequences.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAutomation} className="space-y-5 text-xs">
              {/* Row 1: Workflow Name & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Workflow Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. VIP Consultation Welcome Series"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={active ? 'active' : 'paused'}
                    onChange={(e) => setActive(e.target.value === 'active')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                  >
                    <option value="active">Active (Dispatches 24/7)</option>
                    <option value="paused">Paused (Manual Test Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">
                  Workflow Objective / Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Delivers 3-day value nurture sequence and moves lead to Contacted"
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                />
              </div>

              {/* SECTION: STEP 1 - TRIGGER SPECIFICATION */}
              <div className="p-4 rounded-2xl bg-[var(--soft)]/60 border border-[var(--bd)] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#cca34c] text-[#070e24] font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="font-extrabold text-sm text-[var(--ink)]">
                    Specify Trigger Event
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--mu)] mb-1">
                      Trigger Type
                    </label>
                    <select
                      value={triggerType}
                      onChange={(e) => setTriggerType(e.target.value as AutomationTriggerType)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold"
                    >
                      <option value="lead_created">When a New Lead is Created</option>
                      <option value="stage_changed">When Lead Moves to Specific Stage</option>
                      <option value="booking_confirmed">When Appointment is Booked</option>
                      <option value="lead_stale">When Lead is Inactive / Stale</option>
                      <option value="value_threshold">When Deal Value Exceeds Threshold</option>
                    </select>
                  </div>

                  {triggerType === 'stage_changed' && (
                    <div>
                      <label className="block font-bold text-[var(--mu)] mb-1">
                        Target Stage to Trigger on
                      </label>
                      <select
                        value={toStageCondition}
                        onChange={(e) => setToStageCondition(e.target.value as LeadStage)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {triggerType === 'lead_stale' && (
                    <div>
                      <label className="block font-bold text-[var(--mu)] mb-1">
                        Inactivity Threshold (Hours)
                      </label>
                      <input
                        type="number"
                        value={staleHours}
                        onChange={(e) => setStaleHours(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: STEP 2 - ACTION TYPE & LEAD STATUS UPDATES */}
              <div className="p-4 rounded-2xl bg-[var(--soft)]/60 border border-[var(--bd)] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#00c48c] text-white font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <span className="font-extrabold text-sm text-[var(--ink)]">
                    Action: Lead Status &amp; CRM Updates
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--mu)] mb-1">
                      Action Type
                    </label>
                    <select
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value as AutomationActionType)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold"
                    >
                      <option value="combined_sequence">
                        Combined: Email Sequence + Update Lead Status
                      </option>
                      <option value="send_email_sequence">
                        Email Sequence Only
                      </option>
                      <option value="update_lead_stage">
                        Lead Status &amp; Tags Update Only
                      </option>
                    </select>
                  </div>

                  {actionType !== 'send_email_sequence' && (
                    <div>
                      <label className="block font-bold text-[var(--mu)] mb-1">
                        Automatically Migrate Lead to Stage:
                      </label>
                      <select
                        value={targetStage}
                        onChange={(e) => setTargetStage(e.target.value as LeadStage)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Status Note & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-[var(--mu)] mb-1">
                      Set Status Note
                    </label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g. Welcome series active"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--mu)] mb-1">
                      Add Tags
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Tag name + Enter"
                        className="flex-1 px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--bd)] font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tagsToAdd.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-[#00c48c]/15 text-[#00c48c] text-[10px] font-bold flex items-center gap-1"
                        >
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="hover:text-red-500 cursor-pointer"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: STEP 3 - EMAIL SEQUENCE BUILDER */}
              {actionType !== 'update_lead_stage' && (
                <div className="p-4 rounded-2xl bg-[var(--soft)]/60 border border-[var(--bd)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        3
                      </span>
                      <span className="font-extrabold text-sm text-[var(--ink)]">
                        Email Sequence Steps ({emailSequence.length})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSequenceStep}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Sequence Step</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {emailSequence.map((step, idx) => (
                      <div
                        key={step.id}
                        className="p-3.5 rounded-2xl bg-[var(--bg)] border border-[var(--bd)] space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-[#cca34c]">
                            Step {step.stepNumber}:
                          </span>

                          <div className="flex items-center gap-2">
                            <label className="text-[11px] text-[var(--mu)] font-bold">Timing:</label>
                            <select
                              value={step.delayHours}
                              onChange={(e) => {
                                const h = Number(e.target.value);
                                handleUpdateStep(idx, 'delayHours', h);
                                handleUpdateStep(
                                  idx,
                                  'delayLabel',
                                  h === 0 ? 'Immediate' : `After ${h} hours`
                                );
                              }}
                              className="px-2 py-1 rounded-lg border border-[var(--bd)] bg-[var(--soft)] text-xs font-bold"
                            >
                              <option value={0}>Immediate (0 delay)</option>
                              <option value={1}>After 1 hour</option>
                              <option value={24}>After 24 hours</option>
                              <option value={48}>After 48 hours</option>
                              <option value={72}>After 72 hours (3 days)</option>
                              <option value={168}>After 7 days</option>
                            </select>

                            {emailSequence.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSequenceStep(step.id)}
                                className="p-1 rounded-lg text-gray-400 hover:text-red-500 cursor-pointer"
                                title="Remove Step"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[var(--mu)] mb-0.5">
                            Subject Line (Supports &#123;&#123;name&#125;&#125;, &#123;&#123;company&#125;&#125;)
                          </label>
                          <input
                            type="text"
                            required
                            value={step.subject}
                            onChange={(e) => handleUpdateStep(idx, 'subject', e.target.value)}
                            placeholder="e.g. Welcome {{name}} to Back for Brand"
                            className="w-full px-3 py-1.5 rounded-lg border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[var(--mu)] mb-0.5">
                            Email Body Template
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={step.body}
                            onChange={(e) => handleUpdateStep(idx, 'body', e.target.value)}
                            placeholder="Write email copy..."
                            className="w-full px-3 py-1.5 rounded-lg border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] resize-y"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--bd)]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--bd)] font-bold hover:bg-[var(--soft)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] text-white font-black shadow-md shadow-[#00c48c]/30 cursor-pointer"
                >
                  {editingRuleId ? 'Update Automation' : 'Save & Activate Workflow'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

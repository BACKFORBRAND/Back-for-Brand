import React, { useState, useMemo } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  Lead,
  LeadStage,
  STAGES,
  TRAFFIC_SOURCES,
  ContactCategory,
  CONTACT_CATEGORIES,
  HotnessTier,
  LeadScoreBreakdown,
} from '../../types/index.ts';
import {
  calculateLeadScore,
  getHotnessTierIcon,
  getScoreMeterGradient,
  FUNNEL_STEP_OPTIONS,
} from '../../utils/leadScoring.ts';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit3,
  Trash2,
  MessageSquare,
  Mail,
  Phone,
  Building,
  Briefcase,
  DollarSign,
  Tag,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
  AlertCircle,
  X,
  Check,
  Shield,
  Layers,
  Calendar,
  Flame,
  Zap,
  TrendingUp,
  Info,
  Activity,
  ArrowUpDown,
  Target,
  RefreshCw,
  Award,
} from 'lucide-react';

export const ContactsTab: React.FC = () => {
  const {
    leads,
    bookings,
    whatsappMessages,
    emailThreads,
    projects,
    funnels,
    addLead,
    updateLead,
    deleteLead,
    sendWhatsAppMessage,
    sendEmail,
    setMachineTab,
  } = useBusiness();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedHotness, setSelectedHotness] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('hotness_desc');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [scoringInspectLead, setScoringInspectLead] = useState<Lead | null>(null);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // New Contact Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState(TRAFFIC_SOURCES[0] || 'SEO');
  const [stage, setStage] = useState<LeadStage>('New');
  const [val, setVal] = useState<number | ''>('');
  const [category, setCategory] = useState<ContactCategory>('General Prospect');
  const [need, setNeed] = useState('Funnel or landing page');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [statusNote, setStatusNote] = useState('');
  const [notes, setNotes] = useState('');
  const [funnelId, setFunnelId] = useState('');
  const [funnelStep, setFunnelStep] = useState<string>(FUNNEL_STEP_OPTIONS[0]);

  // Edit Contact Form State
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [editTagInput, setEditTagInput] = useState('');

  // Simulation notification toast
  const [simNotification, setSimNotification] = useState<string | null>(null);

  const showSimToast = (msg: string) => {
    setSimNotification(msg);
    setTimeout(() => setSimNotification(null), 3500);
  };

  // Pre-calculate Lead Scores for all leads
  const scoringContext = useMemo(
    () => ({
      bookings,
      whatsappMessages,
      emailThreads,
      projects,
      funnels,
    }),
    [bookings, whatsappMessages, emailThreads, projects, funnels]
  );

  const leadScores = useMemo(() => {
    const map = new Map<string, LeadScoreBreakdown>();
    leads.forEach((lead) => {
      map.set(lead.id, calculateLeadScore(lead, scoringContext));
    });
    return map;
  }, [leads, scoringContext]);

  interface ScoringStatsResult {
    avgScore: number;
    veryHotCount: number;
    hotCount: number;
    warmCount: number;
    coolColdCount: number;
    topLead: Lead | null;
  }

  // Summary Metrics across leads
  const scoringStats: ScoringStatsResult = useMemo(() => {
    if (leads.length === 0) {
      return {
        avgScore: 0,
        veryHotCount: 0,
        hotCount: 0,
        warmCount: 0,
        coolColdCount: 0,
        topLead: null,
      };
    }

    let sum = 0;
    let veryHot = 0;
    let hot = 0;
    let warm = 0;
    let coolCold = 0;
    let highestScore = -1;
    let topLead: Lead | null = null;

    leads.forEach((lead) => {
      const breakdown = leadScores.get(lead.id) || calculateLeadScore(lead, scoringContext);
      sum += breakdown.totalScore;
      if (breakdown.tier === 'Very Hot') veryHot++;
      else if (breakdown.tier === 'Hot') hot++;
      else if (breakdown.tier === 'Warm') warm++;
      else coolCold++;

      if (breakdown.totalScore > highestScore) {
        highestScore = breakdown.totalScore;
        topLead = lead;
      }
    });

    return {
      avgScore: Math.round(sum / leads.length),
      veryHotCount: veryHot,
      hotCount: hot,
      warmCount: warm,
      coolColdCount: coolCold,
      topLead,
    };
  }, [leads, leadScores, scoringContext]);

  // Open Edit Modal
  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setEditForm({
      name: lead.name,
      company: lead.company || '',
      position: lead.position || '',
      email: lead.email || '',
      phone: lead.phone || '',
      src: lead.src,
      stage: lead.stage,
      val: lead.val,
      category: lead.category || 'General Prospect',
      need: lead.need || '',
      tags: lead.tags ? [...lead.tags] : [],
      statusNote: lead.statusNote || '',
      notes: lead.notes || '',
      funnelId: lead.funnelId || '',
      funnelName: lead.funnelName || '',
      funnelStep: lead.funnelStep || FUNNEL_STEP_OPTIONS[0],
      customScoreAdjustment: lead.customScoreAdjustment || 0,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleAddEditTag = () => {
    if (editTagInput.trim()) {
      const currentTags = editForm.tags || [];
      if (!currentTags.includes(editTagInput.trim())) {
        setEditForm({ ...editForm, tags: [...currentTags, editTagInput.trim()] });
        setEditTagInput('');
      }
    }
  };

  const handleRemoveEditTag = (t: string) => {
    setEditForm({
      ...editForm,
      tags: (editForm.tags || []).filter((item) => item !== t),
    });
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const matchedFunnel = funnels.find((f) => f.id === funnelId);

    addLead({
      name: name.trim(),
      company: company.trim() || undefined,
      position: position.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      src: source,
      stage,
      val: Number(val) || 0,
      category,
      need,
      tags: tags.length > 0 ? tags : undefined,
      statusNote: statusNote.trim() || undefined,
      notes: notes.trim() || undefined,
      funnelId: funnelId || undefined,
      funnelName: matchedFunnel ? matchedFunnel.name : undefined,
      funnelStep: funnelStep || undefined,
      lastContactedAt: new Date().toISOString(),
    });

    // Reset Form
    setName('');
    setCompany('');
    setPosition('');
    setEmail('');
    setPhone('');
    setVal('');
    setTags([]);
    setTagInput('');
    setStatusNote('');
    setNotes('');
    setFunnelId('');
    setFunnelStep(FUNNEL_STEP_OPTIONS[0]);
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead || !editForm.name?.trim()) return;

    const matchedFunnel = funnels.find((f) => f.id === editForm.funnelId);

    updateLead(editingLead.id, {
      name: editForm.name.trim(),
      company: editForm.company?.trim() || undefined,
      position: editForm.position?.trim() || undefined,
      email: editForm.email?.trim() || undefined,
      phone: editForm.phone?.trim() || undefined,
      src: editForm.src || editingLead.src,
      stage: editForm.stage || editingLead.stage,
      val: Number(editForm.val) || 0,
      category: editForm.category || 'General Prospect',
      need: editForm.need?.trim() || undefined,
      tags: editForm.tags,
      statusNote: editForm.statusNote?.trim() || undefined,
      notes: editForm.notes?.trim() || undefined,
      funnelId: editForm.funnelId || undefined,
      funnelName: matchedFunnel ? matchedFunnel.name : editForm.funnelName,
      funnelStep: editForm.funnelStep || undefined,
      customScoreAdjustment: editForm.customScoreAdjustment,
      lastContactedAt: new Date().toISOString(),
    });

    setEditingLead(null);
  };

  // Quick Stage change directly from table
  const handleQuickStageChange = (leadId: string, newStage: LeadStage) => {
    updateLead(leadId, {
      stage: newStage,
      statusNote: `Status updated to ${newStage} on ${new Date().toLocaleDateString()}`,
      lastContactedAt: new Date().toISOString(),
    });
  };

  // Quick Category update directly from table
  const handleQuickCategoryChange = (leadId: string, newCategory: ContactCategory) => {
    updateLead(leadId, {
      category: newCategory,
    });
  };

  // Interactive Touchpoint Simulator Actions
  const handleSimulateTouchpoint = (
    lead: Lead,
    actionType: 'wa_inbound' | 'email_open' | 'advance_funnel' | 'vip_boost'
  ) => {
    const cleanPhone = (lead.phone || '').replace(/\D/g, '') || '923001234567';
    const emailAddr = lead.email || 'contact@clientcompany.com';

    if (actionType === 'wa_inbound') {
      sendWhatsAppMessage({
        clientId: lead.id,
        clientName: lead.name,
        phone: cleanPhone,
        direction: 'inbound',
        text: `Salam / Hello! We reviewed the proposed architecture for ${lead.company || lead.name} and want to confirm kickoff. Can we hop on a 15-minute call today?`,
        status: 'read',
      });
      updateLead(lead.id, {
        lastContactedAt: new Date().toISOString(),
        statusNote: 'Inbound WhatsApp reply received: ready to move forward',
      });
      showSimToast(`🔥 Inbound WhatsApp logged for ${lead.name} (+8 pts Hotness Boost)`);
    } else if (actionType === 'email_open') {
      sendEmail({
        clientId: lead.id,
        clientName: lead.name,
        email: emailAddr,
        subject: `Re: Commercial Proposal & Service Scope - ${lead.name}`,
        body: `Client opened proposal document and spent 4+ minutes reviewing pricing tiers.`,
        direction: 'outbound',
        status: 'opened',
      });
      updateLead(lead.id, {
        lastContactedAt: new Date().toISOString(),
        statusNote: 'Proposal email opened & reviewed by prospect',
      });
      showSimToast(`⚡ Email proposal opened by ${lead.name} (+6 pts Hotness Boost)`);
    } else if (actionType === 'advance_funnel') {
      const currentStep = lead.funnelStep || FUNNEL_STEP_OPTIONS[0];
      const currentIndex = FUNNEL_STEP_OPTIONS.indexOf(currentStep as any);
      const nextIndex = Math.min(FUNNEL_STEP_OPTIONS.length - 1, currentIndex + 1);
      const nextStep = FUNNEL_STEP_OPTIONS[nextIndex];

      const newStage: LeadStage =
        nextStep === 'Payment Completed'
          ? 'Won'
          : nextStep === 'Discovery Call Booked'
          ? 'Booked'
          : nextStep === 'Pricing Selected' || nextStep === 'Checkout Initiated'
          ? 'Proposal'
          : lead.stage;

      updateLead(lead.id, {
        funnelStep: nextStep,
        stage: newStage,
        lastContactedAt: new Date().toISOString(),
        statusNote: `Funnel progression advanced to: ${nextStep}`,
      });
      showSimToast(`🎯 Funnel step advanced to "${nextStep}" for ${lead.name}`);
    } else if (actionType === 'vip_boost') {
      const existingTags = lead.tags || [];
      const updatedTags = existingTags.includes('VIP')
        ? existingTags
        : [...existingTags, 'VIP', 'High Intent'];

      updateLead(lead.id, {
        tags: updatedTags,
        category: 'Enterprise VIP',
        customScoreAdjustment: (lead.customScoreAdjustment || 0) + 5,
        lastContactedAt: new Date().toISOString(),
      });
      showSimToast(`💎 Account elevated to Enterprise VIP with +5 sales priority boost!`);
    }

    // Refresh viewing modal if active
    if (viewingLead && viewingLead.id === lead.id) {
      const updated = leads.find((l) => l.id === lead.id);
      if (updated) setViewingLead(updated);
    }
  };

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    let result = leads.filter((lead) => {
      const matchSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.phone && lead.phone.includes(searchTerm)) ||
        (lead.tags && lead.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (lead.funnelName && lead.funnelName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' || (lead.category || 'General Prospect') === selectedCategory;

      const matchStage = selectedStage === 'all' || lead.stage === selectedStage;

      const matchSource = selectedSource === 'all' || lead.src === selectedSource;

      // Hotness filter
      const scoreData = leadScores.get(lead.id);
      const matchHotness =
        selectedHotness === 'all' ||
        (selectedHotness === 'Very Hot' && scoreData?.tier === 'Very Hot') ||
        (selectedHotness === 'Hot' && scoreData?.tier === 'Hot') ||
        (selectedHotness === 'Warm' && scoreData?.tier === 'Warm') ||
        (selectedHotness === 'Cool' && scoreData?.tier === 'Cool') ||
        (selectedHotness === 'Cold' && scoreData?.tier === 'Cold');

      return matchSearch && matchCategory && matchStage && matchSource && matchHotness;
    });

    // Sorting
    result.sort((a, b) => {
      const scoreA = leadScores.get(a.id)?.totalScore || 0;
      const scoreB = leadScores.get(b.id)?.totalScore || 0;

      if (sortBy === 'hotness_desc') {
        return scoreB - scoreA;
      }
      if (sortBy === 'hotness_asc') {
        return scoreA - scoreB;
      }
      if (sortBy === 'val_desc') {
        return (b.val || 0) - (a.val || 0);
      }
      if (sortBy === 'recent') {
        const dateA = a.lastContactedAt ? new Date(a.lastContactedAt).getTime() : new Date(a.createdAt).getTime();
        const dateB = b.lastContactedAt ? new Date(b.lastContactedAt).getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      }
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [
    leads,
    searchTerm,
    selectedCategory,
    selectedStage,
    selectedSource,
    selectedHotness,
    sortBy,
    leadScores,
  ]);

  // Aggregate Category Metrics
  const categoryStats = useMemo(() => {
    const map: Record<string, number> = {};
    CONTACT_CATEGORIES.forEach((cat) => {
      map[cat] = leads.filter((l) => (l.category || 'General Prospect') === cat).length;
    });
    return map;
  }, [leads]);

  // Export to CSV with Lead Scoring Data
  const handleExportCSV = () => {
    const headers = [
      'Name',
      'Company',
      'Position',
      'Category',
      'Email',
      'Phone',
      'Source',
      'Stage',
      'Hotness Score',
      'Hotness Tier',
      'Funnel Name',
      'Funnel Step',
      'Deal Value',
      'Need',
      'Tags',
      'Status Note',
      'Created At',
    ];

    const rows = filteredLeads.map((l) => {
      const score = leadScores.get(l.id);
      return [
        `"${l.name}"`,
        `"${l.company || ''}"`,
        `"${l.position || ''}"`,
        `"${l.category || 'General Prospect'}"`,
        `"${l.email || ''}"`,
        `"${l.phone || ''}"`,
        `"${l.src}"`,
        `"${l.stage}"`,
        score?.totalScore || 0,
        `"${score?.tier || 'Cold'}"`,
        `"${l.funnelName || 'Unassigned'}"`,
        `"${l.funnelStep || 'Unassigned'}"`,
        l.val || 0,
        `"${l.need || ''}"`,
        `"${(l.tags || []).join(', ')}"`,
        `"${l.statusNote || ''}"`,
        `"${l.createdAt}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `backforbrand_contacts_scored_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val: number) => '$' + Math.round(val).toLocaleString();

  // Color helper for categories
  const getCategoryBadgeClass = (cat?: string) => {
    switch (cat) {
      case 'Enterprise VIP':
        return 'bg-[#cca34c]/15 text-[#cca34c] border-[#cca34c]/40';
      case 'High-Ticket Agency':
        return 'bg-[#00c48c]/15 text-[#00c48c] border-[#00c48c]/40';
      case 'SMB / Clinic':
        return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-400/40';
      case 'E-commerce':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-400/40';
      case 'Strategic Partner':
        return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-400/40';
      default:
        return 'bg-gray-500/10 text-[var(--mu)] border-[var(--bd)]';
    }
  };

  // Color helper for stage
  const getStageBadgeClass = (s: LeadStage) => {
    switch (s) {
      case 'Won':
        return 'bg-[#00c48c] text-white';
      case 'Booked':
        return 'bg-[#0ea5e9] text-white';
      case 'Proposal':
        return 'bg-[#cca34c] text-[#070e24] font-bold';
      case 'Contacted':
        return 'bg-purple-600 text-white';
      case 'Lost':
        return 'bg-rose-500 text-white';
      default:
        return 'bg-[#2b59ff] text-white';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-12">
      {/* Toast Notification for Simulated Touchpoints */}
      {simNotification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#070e24] text-white border-2 border-[#00c48c] shadow-2xl animate-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-[#00c48c] animate-spin" />
          <span className="text-xs font-bold">{simNotification}</span>
        </div>
      )}

      {/* Top Header Card with Brand Styling */}
      <div className="rounded-3xl bg-gradient-to-r from-[#070e24] via-[#0c183a] to-[#070e24] text-white p-6 sm:p-8 border border-[#cca34c]/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c48c]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#cca34c]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#cca34c]/20 border border-[#cca34c]/40 text-[#cca34c] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Users className="w-3.5 h-3.5" />
                <span>Executive Contact Directory</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>Algorithmic Lead Scoring Active</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              CRM Contacts &amp; Relationship Directory
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/75 max-w-2xl leading-relaxed">
              Every contact is assigned a dynamic 0–100 Hotness score computed in real time from omnichannel interaction history (WhatsApp replies, email opens, calendar bookings) and multi-step funnel progression.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowRulesModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Inspect scoring weights, formulas, and ranking rules"
            >
              <Info className="w-4 h-4 text-[#cca34c]" />
              <span>Scoring Rules &amp; Matrix</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-[#00c48c]/30 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Add New Contact</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Export filtered contacts to CSV spreadsheet with lead scores"
            >
              <Download className="w-4 h-4 text-[#cca34c]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Lead Scoring Intelligence Summary Strip */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {/* Avg Score */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#cca34c]/20 to-[#cca34c]/40 text-[#cca34c] flex items-center justify-center font-black text-base border border-[#cca34c]/30 flex-shrink-0">
              <Activity className="w-5 h-5 text-[#cca34c]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider block">
                Avg Lead Hotness
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white">{scoringStats.avgScore}</span>
                <span className="text-[11px] text-gray-400 font-mono">/ 100</span>
              </div>
            </div>
          </div>

          {/* Very Hot Leads */}
          <button
            onClick={() => setSelectedHotness(selectedHotness === 'Very Hot' ? 'all' : 'Very Hot')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedHotness === 'Very Hot'
                ? 'bg-rose-500/25 border-rose-500 shadow-md ring-2 ring-rose-500/50'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Very Hot (85+)</span>
              </span>
              <span className="text-xs">🔥</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-white">{scoringStats.veryHotCount}</span>
              <span className="text-[10px] text-rose-300 font-semibold">Immediate Close</span>
            </div>
          </button>

          {/* Hot Leads */}
          <button
            onClick={() => setSelectedHotness(selectedHotness === 'Hot' ? 'all' : 'Hot')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedHotness === 'Hot'
                ? 'bg-amber-500/25 border-amber-500 shadow-md ring-2 ring-amber-500/50'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Hot Leads (70-84)</span>
              </span>
              <span className="text-xs">⚡</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-white">{scoringStats.hotCount}</span>
              <span className="text-[10px] text-amber-300 font-semibold">Active Funnel</span>
            </div>
          </button>

          {/* Warm Leads */}
          <button
            onClick={() => setSelectedHotness(selectedHotness === 'Warm' ? 'all' : 'Warm')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedHotness === 'Warm'
                ? 'bg-yellow-500/25 border-yellow-500 shadow-md ring-2 ring-yellow-500/50'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
                <span>Warm (50-69)</span>
              </span>
              <span className="text-xs">🌤️</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-white">{scoringStats.warmCount}</span>
              <span className="text-[10px] text-yellow-300 font-semibold">Nurture Flow</span>
            </div>
          </button>

          {/* Top Hot Opportunity */}
          {scoringStats.topLead && (
            <div
              onClick={() => setViewingLead(scoringStats.topLead)}
              className="col-span-2 sm:col-span-4 lg:col-span-1 p-3.5 rounded-2xl bg-gradient-to-tr from-[#cca34c]/20 to-emerald-500/20 border border-[#cca34c]/40 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#cca34c] uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Highest Velocity</span>
                </span>
                <span className="text-xs font-mono font-black text-emerald-400">
                  {leadScores.get(scoringStats.topLead.id)?.totalScore} pts
                </span>
              </div>
              <div className="mt-1 truncate">
                <span className="text-xs font-black text-white block truncate">
                  {scoringStats.topLead.name}
                </span>
                <span className="text-[10px] text-emerald-200/70 block truncate">
                  {scoringStats.topLead.company || scoringStats.topLead.need || 'Priority Lead'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter, Search & Sorting Controls Bar */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--mu)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts, funnels, company, tags..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[#00c48c] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--ink)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Hotness Tier Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[var(--mu)] font-bold hidden sm:inline flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>Score:</span>
            </span>
            <select
              value={selectedHotness}
              onChange={(e) => setSelectedHotness(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold focus:outline-none focus:border-[#00c48c]"
            >
              <option value="all">All Hotness Tiers</option>
              <option value="Very Hot">🔥 Very Hot (85-100)</option>
              <option value="Hot">⚡ Hot Intent (70-84)</option>
              <option value="Warm">🌤️ Warm Engaged (50-69)</option>
              <option value="Cool">❄️ Cool (30-49)</option>
              <option value="Cold">🧊 Cold (&lt;30)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[var(--mu)] font-bold hidden xl:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold focus:outline-none focus:border-[#00c48c]"
            >
              <option value="all">All Categories</option>
              {CONTACT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Stage / Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[var(--mu)] font-bold hidden xl:inline">Stage:</span>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold focus:outline-none focus:border-[#00c48c]"
            >
              <option value="all">All Stages</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 text-xs ml-auto sm:ml-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--mu)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold focus:outline-none focus:border-[#00c48c]"
            >
              <option value="hotness_desc">Sort: 🔥 Hotness (High to Low)</option>
              <option value="hotness_asc">Sort: 🧊 Hotness (Low to High)</option>
              <option value="val_desc">Sort: 💰 Value (High to Low)</option>
              <option value="recent">Sort: 🕒 Recent Activity</option>
              <option value="name_asc">Sort: 🔤 Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Scored Contacts Table */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--bd)] flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <strong className="font-extrabold text-[var(--ink)]">
              Showing {filteredLeads.length} of {leads.length} Scored Contacts
            </strong>
            {(selectedCategory !== 'all' ||
              selectedStage !== 'all' ||
              selectedSource !== 'all' ||
              selectedHotness !== 'all' ||
              searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedStage('all');
                  setSelectedSource('all');
                  setSelectedHotness('all');
                  setSearchTerm('');
                }}
                className="text-xs text-[#00c48c] hover:underline font-bold ml-2 cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[var(--mu)]">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>Score calculated automatically from interaction logs</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[1050px]">
            <thead>
              <tr className="border-b border-[var(--bd)] bg-[var(--soft)]/50 text-[var(--mu)] uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3 px-4">Contact &amp; Company</th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    <span>Hotness Score</span>
                  </div>
                </th>
                <th className="py-3 px-3">Funnel &amp; Progress</th>
                <th className="py-3 px-3">Status / Stage</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Pipeline Value</th>
                <th className="py-3 px-3">Source &amp; Recency</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bd)]/70 text-[var(--ink)]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[var(--mu)]">
                    No contacts found matching the selected search, category, or hotness criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const cleanPhone = (lead.phone || '').replace(/\D/g, '');
                  const currentCategory = (lead.category as ContactCategory) || 'General Prospect';
                  const score = leadScores.get(lead.id) || calculateLeadScore(lead, scoringContext);
                  const tierIcon = getHotnessTierIcon(score.tier);

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-[var(--soft)]/40 transition-colors group"
                    >
                      {/* Name & Company */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setViewingLead(lead)}
                            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#070e24] to-[#0c183a] text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm border border-[#cca34c]/30 hover:scale-105 transition-transform cursor-pointer"
                            title="View Full Contact Dossier"
                          >
                            {lead.name.charAt(0)}
                          </button>
                          <div className="min-w-0">
                            <button
                              onClick={() => setViewingLead(lead)}
                              className="font-bold text-sm text-[var(--ink)] hover:text-[#00c48c] transition-colors block text-left truncate cursor-pointer"
                            >
                              {lead.name}
                            </button>
                            <div className="text-[11px] text-[var(--mu)] flex items-center gap-1.5 flex-wrap">
                              {lead.company && (
                                <span className="font-semibold text-[var(--ink)] flex items-center gap-1">
                                  <Building className="w-3 h-3 text-[#cca34c]" />
                                  <span>{lead.company}</span>
                                </span>
                              )}
                              {lead.position && (
                                <>
                                  <span>•</span>
                                  <span>{lead.position}</span>
                                </>
                              )}
                            </div>
                            <div className="text-[10px] text-[var(--mu)] font-mono mt-0.5 flex items-center gap-2">
                              {lead.email && <span>{lead.email}</span>}
                              {lead.phone && <span>{lead.phone}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Hotness Score Column */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => setScoringInspectLead(lead)}
                          className="w-full text-left group/score cursor-pointer"
                          title="Click to inspect exact scoring factors and simulation"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-base">{tierIcon}</span>
                              <span className="font-black text-sm text-[var(--ink)] font-mono">
                                {score.totalScore}
                              </span>
                              <span className="text-[10px] text-[var(--mu)] font-mono">/100</span>
                            </div>
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${score.tierBadgeBg}`}
                            >
                              {score.tier}
                            </span>
                          </div>

                          {/* Mini Progress Heat Bar */}
                          <div className="w-28 h-1.5 rounded-full bg-[var(--soft)] border border-[var(--bd)] overflow-hidden mt-1.5">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${getScoreMeterGradient(
                                score.totalScore
                              )} transition-all duration-500`}
                              style={{ width: `${Math.max(6, score.totalScore)}%` }}
                            />
                          </div>

                          <div className="text-[9px] text-[var(--mu)] mt-0.5 group-hover/score:text-[#00c48c] flex items-center gap-1">
                            <span>Inspect factors</span>
                            <ChevronRight className="w-2.5 h-2.5" />
                          </div>
                        </button>
                      </td>

                      {/* Funnel & Step Progress */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1 max-w-[190px]">
                          {lead.funnelName ? (
                            <div className="text-[11px] font-bold text-[var(--ink)] truncate" title={lead.funnelName}>
                              {lead.funnelName}
                            </div>
                          ) : (
                            <span className="text-[10px] text-[var(--mu)] italic">Direct Inbound</span>
                          )}
                          {lead.funnelStep ? (
                            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#00c48c]/10 text-[#00c48c] border border-[#00c48c]/30 truncate max-w-full">
                              Step: {lead.funnelStep}
                            </span>
                          ) : (
                            lead.need && (
                              <span className="text-[10px] text-[var(--mu)] truncate block" title={lead.need}>
                                {lead.need}
                              </span>
                            )
                          )}
                        </div>
                      </td>

                      {/* Status / Stage with Quick Switcher */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-1">
                          <select
                            value={lead.stage}
                            onChange={(e) =>
                              handleQuickStageChange(lead.id, e.target.value as LeadStage)
                            }
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border-0 cursor-pointer shadow-xs focus:ring-2 focus:ring-[#00c48c] ${getStageBadgeClass(
                              lead.stage
                            )}`}
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s} className="bg-[var(--bg)] text-[var(--ink)]">
                                {s}
                              </option>
                            ))}
                          </select>
                          {lead.statusNote && (
                            <span className="text-[10px] text-[var(--mu)] truncate max-w-[130px]" title={lead.statusNote}>
                              {lead.statusNote}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category Badge + Quick Select */}
                      <td className="py-3.5 px-3">
                        <select
                          value={currentCategory}
                          onChange={(e) =>
                            handleQuickCategoryChange(lead.id, e.target.value as ContactCategory)
                          }
                          className={`text-[11px] font-black px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${getCategoryBadgeClass(
                            currentCategory
                          )}`}
                        >
                          {CONTACT_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} className="bg-[var(--bg)] text-[var(--ink)]">
                              {cat}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Deal Value */}
                      <td className="py-3.5 px-3">
                        <span className="font-black text-sm text-[#00a876] dark:text-[#20d89f]">
                          {formatCurrency(lead.val || 0)}
                        </span>
                      </td>

                      {/* Source & Recency */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--soft)] border border-[var(--bd)] text-[var(--ink)]">
                            {lead.src}
                          </span>
                          <div className="text-[10px] text-[var(--mu)] flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>
                              {lead.lastContactedAt
                                ? new Date(lead.lastContactedAt).toLocaleDateString()
                                : new Date(lead.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick WhatsApp Simulator */}
                          <button
                            onClick={() => handleSimulateTouchpoint(lead, 'wa_inbound')}
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Simulate inbound WhatsApp reply from lead (+8 pts)"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Email open simulator */}
                          <button
                            onClick={() => handleSimulateTouchpoint(lead, 'email_open')}
                            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                            title="Simulate proposal email opened (+6 pts)"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          {/* Inspect Score button */}
                          <button
                            onClick={() => setScoringInspectLead(lead)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Inspect Lead Hotness Factors"
                          >
                            <Flame className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Contact */}
                          <button
                            onClick={() => openEditModal(lead)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[var(--ink)] hover:bg-[var(--soft)] transition-colors cursor-pointer"
                            title="Edit Contact Profile & Funnel"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Contact */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete contact record for "${lead.name}"?`)) {
                                deleteLead(lead.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Add New Contact with Funnel & Lead Scoring */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[var(--bg)] border-2 border-[#cca34c]/40 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
              <div>
                <h3 className="text-lg font-black text-[var(--ink)] flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#00c48c]" />
                  <span>Create New CRM Contact</span>
                </h3>
                <p className="text-xs text-[var(--mu)]">
                  Register a prospect with categorization, associated funnel architecture, and starting deal value.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-4 text-xs">
              {/* Row 1: Name, Company, Position */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Mansoor"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Mansoor Logistics"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Chief Operating Officer"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tariq@mansoor.com"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    WhatsApp / Phone (with country code)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 97317000000"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
              </div>

              {/* Row 3: Category, Stage, Value */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ContactCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                  >
                    {CONTACT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Initial Lifecycle Stage
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as LeadStage)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Pipeline Deal Value ($)
                  </label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => setVal(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 2500"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
              </div>

              {/* Row 4: Associated Funnel & Funnel Step */}
              <div className="p-3.5 rounded-2xl bg-[#00c48c]/5 border border-[#00c48c]/20 space-y-2.5">
                <div className="flex items-center gap-2 text-[#00c48c] font-black">
                  <Target className="w-4 h-4" />
                  <span>Funnel Architecture Association</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--ink)] mb-1">
                      Attributed Funnel
                    </label>
                    <select
                      value={funnelId}
                      onChange={(e) => setFunnelId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-medium"
                    >
                      <option value="">Direct / No Funnel Attribution</option>
                      {funnels.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--ink)] mb-1">
                      Starting Funnel Step Reached
                    </label>
                    <select
                      value={funnelStep}
                      onChange={(e) => setFunnelStep(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-medium"
                    >
                      {FUNNEL_STEP_OPTIONS.map((step) => (
                        <option key={step} value={step}>
                          {step}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Source & Service Need */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Acquisition Source
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  >
                    {TRAFFIC_SOURCES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Primary Service Interest
                  </label>
                  <input
                    type="text"
                    value={need}
                    onChange={(e) => setNeed(e.target.value)}
                    placeholder="e.g. AI WhatsApp Receptionist & CRM"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">
                  Tags &amp; Segmentation (Press Enter or click Add)
                </label>
                <div className="flex items-center gap-2 mb-2">
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
                    placeholder="Add tag (e.g. VIP, Contract Sent, High Intent)..."
                    className="flex-1 px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3.5 py-2 rounded-xl bg-[var(--soft)] border border-[var(--bd)] font-bold hover:bg-[var(--bd)] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 text-[11px] font-bold flex items-center gap-1.5"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Note */}
              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">
                  Lifecycle Status Note
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Discovery session booked, proposal pending"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--bd)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--bd)] font-bold hover:bg-[var(--soft)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] text-white font-black shadow-md shadow-[#00c48c]/30 cursor-pointer"
                >
                  Save Scored Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Contact Profile & Funnel Progress */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[var(--bg)] border-2 border-[#00c48c]/40 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
              <div>
                <h3 className="text-lg font-black text-[var(--ink)] flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#00c48c]" />
                  <span>Edit Contact: {editingLead.name}</span>
                </h3>
                <p className="text-xs text-[var(--mu)]">
                  Update contact attributes, funnel step milestone, deal value, and priority score adjustment.
                </p>
              </div>
              <button
                onClick={() => setEditingLead(null)}
                className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={editForm.company || ''}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={editForm.position || ''}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Category
                  </label>
                  <select
                    value={editForm.category || 'General Prospect'}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as ContactCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                  >
                    {CONTACT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Lifecycle Status / Stage
                  </label>
                  <select
                    value={editForm.stage || 'New'}
                    onChange={(e) => setEditForm({ ...editForm, stage: e.target.value as LeadStage })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Deal Value ($)
                  </label>
                  <input
                    type="number"
                    value={editForm.val !== undefined ? editForm.val : ''}
                    onChange={(e) => setEditForm({ ...editForm, val: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
              </div>

              {/* Funnel Architecture & Step */}
              <div className="p-3.5 rounded-2xl bg-[#00c48c]/5 border border-[#00c48c]/20 space-y-2.5">
                <div className="flex items-center gap-2 text-[#00c48c] font-black">
                  <Target className="w-4 h-4" />
                  <span>Funnel Architecture Association</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--ink)] mb-1">
                      Attributed Funnel
                    </label>
                    <select
                      value={editForm.funnelId || ''}
                      onChange={(e) => setEditForm({ ...editForm, funnelId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-medium"
                    >
                      <option value="">Direct / No Funnel Attribution</option>
                      {funnels.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--ink)] mb-1">
                      Funnel Step Progress
                    </label>
                    <select
                      value={editForm.funnelStep || FUNNEL_STEP_OPTIONS[0]}
                      onChange={(e) => setEditForm({ ...editForm, funnelStep: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-medium"
                    >
                      {FUNNEL_STEP_OPTIONS.map((step) => (
                        <option key={step} value={step}>
                          {step}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Source & Custom Adjustment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">
                    Acquisition Traffic Source
                  </label>
                  <select
                    value={editForm.src || TRAFFIC_SOURCES[0]}
                    onChange={(e) => setEditForm({ ...editForm, src: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  >
                    {TRAFFIC_SOURCES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1 flex items-center justify-between">
                    <span>Manual Score Adjustment (Override)</span>
                    <span className="text-[10px] text-[#00c48c] font-mono">
                      {(editForm.customScoreAdjustment || 0) >= 0 ? `+${editForm.customScoreAdjustment || 0}` : editForm.customScoreAdjustment} pts
                    </span>
                  </label>
                  <input
                    type="number"
                    value={editForm.customScoreAdjustment || 0}
                    onChange={(e) => setEditForm({ ...editForm, customScoreAdjustment: Number(e.target.value) })}
                    placeholder="e.g. +10 or -5"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-medium"
                  />
                </div>
              </div>

              {/* Edit Tags */}
              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">
                  Tags &amp; Segmentation
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={editTagInput}
                    onChange={(e) => setEditTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEditTag();
                      }
                    }}
                    placeholder="Add tag (e.g. VIP, Contract Sent)..."
                    className="flex-1 px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                  />
                  <button
                    type="button"
                    onClick={handleAddEditTag}
                    className="px-3.5 py-2 rounded-xl bg-[var(--soft)] border border-[var(--bd)] font-bold hover:bg-[var(--bd)] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(editForm.tags || []).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 text-[11px] font-bold flex items-center gap-1.5"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEditTag(t)}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Note */}
              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">
                  Status Tracking Note
                </label>
                <input
                  type="text"
                  value={editForm.statusNote || ''}
                  onChange={(e) => setEditForm({ ...editForm, statusNote: e.target.value })}
                  placeholder="e.g. Contract signed, onboarding scheduled"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)]"
                />
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">
                  Executive Notes
                </label>
                <textarea
                  rows={2}
                  value={editForm.notes || ''}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Add background notes or client preferences..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--bd)]">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--bd)] font-bold hover:bg-[var(--soft)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white font-black shadow-md shadow-[#00c48c]/30 cursor-pointer"
                >
                  Update Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: View Full Contact Dossier & Lead Scorecard */}
      {viewingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[var(--bg)] border-2 border-[#cca34c]/40 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-[var(--bd)]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#cca34c] to-[#e5b85c] text-[#070e24] font-black text-lg flex items-center justify-center shadow-md">
                  {viewingLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[var(--ink)] tracking-tight">
                    {viewingLead.name}
                  </h3>
                  <div className="text-xs text-[var(--mu)] flex items-center gap-2 mt-0.5">
                    {viewingLead.company && (
                      <span className="font-bold text-[var(--ink)]">
                        {viewingLead.company}
                      </span>
                    )}
                    {viewingLead.position && <span>• {viewingLead.position}</span>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingLead(null)}
                className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges & Status Track */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-black px-3 py-1 rounded-xl border ${getCategoryBadgeClass(
                  viewingLead.category
                )}`}
              >
                {viewingLead.category || 'General Prospect'}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-xl ${getStageBadgeClass(
                  viewingLead.stage
                )}`}
              >
                Stage: {viewingLead.stage}
              </span>
              <span className="text-xs font-black text-[#00c48c] bg-[#00c48c]/10 border border-[#00c48c]/30 px-3 py-1 rounded-xl">
                Value: {formatCurrency(viewingLead.val || 0)}
              </span>
              <span className="text-xs text-[var(--mu)] bg-[var(--soft)] px-2.5 py-1 rounded-xl border border-[var(--bd)]">
                Via: {viewingLead.src}
              </span>
            </div>

            {/* Comprehensive Lead Scorecard Block */}
            {(() => {
              const currentScore =
                leadScores.get(viewingLead.id) || calculateLeadScore(viewingLead, scoringContext);
              return (
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#070e24] to-[#0c183a] text-white border border-[#cca34c]/40 space-y-3.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-red-400 animate-pulse" />
                      <span className="font-black text-sm uppercase tracking-wider text-amber-300">
                        Lead Hotness Scorecard
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-white font-mono">
                        {currentScore.totalScore}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">/ 100</span>
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-md border ${currentScore.tierBadgeBg}`}
                      >
                        {getHotnessTierIcon(currentScore.tier)} {currentScore.tier}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getScoreMeterGradient(
                        currentScore.totalScore
                      )} transition-all duration-500`}
                      style={{ width: `${Math.max(6, currentScore.totalScore)}%` }}
                    />
                  </div>

                  {/* 4 Pillars Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-gray-300 block uppercase font-sans">
                        Funnel Progress
                      </span>
                      <span className="text-sm font-black text-emerald-400">
                        {currentScore.funnelScore} / 35
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-gray-300 block uppercase font-sans">
                        Interactions
                      </span>
                      <span className="text-sm font-black text-cyan-400">
                        {currentScore.interactionScore} / 35
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-gray-300 block uppercase font-sans">
                        Recency Velocity
                      </span>
                      <span className="text-sm font-black text-amber-400">
                        {currentScore.recencyScore} / 15
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-gray-300 block uppercase font-sans">
                        Deal &amp; Profile Fit
                      </span>
                      <span className="text-sm font-black text-purple-400">
                        {currentScore.valueScore} / 15
                      </span>
                    </div>
                  </div>

                  {/* Prescriptive Recommendation */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-amber-300 block">Prescriptive Action:</strong>
                      <span className="text-amber-100/90 leading-relaxed">
                        {currentScore.recommendedAction}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Interactive Touchpoint Simulator Panel */}
            <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[var(--ink)] block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#00c48c]" />
                  <span>Interactive Omnichannel Touchpoint Simulator</span>
                </span>
                <span className="text-[10px] text-[var(--mu)]">Click to test live score reaction</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateTouchpoint(viewingLead, 'wa_inbound')}
                  className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  + WhatsApp Reply (+8)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateTouchpoint(viewingLead, 'email_open')}
                  className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  + Email Opened (+6)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateTouchpoint(viewingLead, 'advance_funnel')}
                  className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  + Advance Step (+5)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateTouchpoint(viewingLead, 'vip_boost')}
                  className="p-2 rounded-xl bg-[#cca34c]/10 hover:bg-[#cca34c]/20 text-[#cca34c] border border-[#cca34c]/30 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  + VIP Boost (+5)
                </button>
              </div>
            </div>

            {/* Funnel Lifecycle Progression */}
            <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[var(--ink)] block uppercase tracking-wider text-[11px]">
                  Funnel Architecture &amp; Lifecycle Progression
                </span>
                {viewingLead.funnelName && (
                  <span className="text-[11px] font-bold text-[#00c48c]">
                    {viewingLead.funnelName}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-6 gap-1 text-center font-bold text-[10px]">
                {STAGES.map((s, idx) => {
                  const currentIdx = STAGES.indexOf(viewingLead.stage);
                  const isCurrent = s === viewingLead.stage;
                  const isPassed = currentIdx >= idx;

                  return (
                    <div
                      key={s}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isCurrent
                          ? 'bg-[#00c48c] text-white border-[#00c48c] shadow-xs'
                          : isPassed
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300/40'
                          : 'bg-[var(--bg)] text-[var(--mu)] border-[var(--bd)] opacity-60'
                      }`}
                    >
                      <span className="block truncate">{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact Information & Notes */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[var(--soft)]/50 border border-[var(--bd)] flex items-center justify-between">
                <span className="text-[var(--mu)] font-medium">Work Email:</span>
                <span className="font-mono text-[var(--ink)] font-bold">
                  {viewingLead.email || 'Not provided'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--soft)]/50 border border-[var(--bd)] flex items-center justify-between">
                <span className="text-[var(--mu)] font-medium">WhatsApp / Phone:</span>
                <span className="font-mono text-[var(--ink)] font-bold">
                  {viewingLead.phone || 'Not provided'}
                </span>
              </div>
              {viewingLead.statusNote && (
                <div className="p-3 rounded-xl bg-[var(--soft)]/50 border border-[var(--bd)] flex items-start justify-between gap-3">
                  <span className="text-[var(--mu)] font-medium flex-shrink-0">Status Tracking:</span>
                  <span className="text-[var(--ink)] font-medium text-right">
                    {viewingLead.statusNote}
                  </span>
                </div>
              )}
              {viewingLead.notes && (
                <div className="p-3 rounded-xl bg-[var(--soft)]/50 border border-[var(--bd)]">
                  <span className="text-[var(--mu)] font-medium block mb-1">Executive Notes:</span>
                  <p className="text-[var(--ink)] leading-relaxed italic">{viewingLead.notes}</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {viewingLead.tags && viewingLead.tags.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider block">
                  Assigned Tags:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingLead.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 text-xs font-bold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--bd)]">
              <span className="text-[10px] text-[var(--mu)] font-mono">
                Created: {new Date(viewingLead.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const l = viewingLead;
                    setViewingLead(null);
                    setScoringInspectLead(l);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs hover:bg-rose-500/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Inspect Factors</span>
                </button>
                <button
                  onClick={() => {
                    setViewingLead(null);
                    openEditModal(viewingLead);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#070e24] text-[#00c48c] border border-[#cca34c]/40 font-bold text-xs hover:bg-[#0c183a] transition-all cursor-pointer"
                >
                  Edit Profile
                </button>
                {viewingLead.phone && (
                  <a
                    href={`https://wa.me/${viewingLead.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Algorithmic Lead Scoring Factor Inspection Modal */}
      {scoringInspectLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-[var(--bg)] border-2 border-red-500/40 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[var(--bd)]">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                  <h3 className="text-lg font-black text-[var(--ink)]">
                    Lead Hotness Audit: {scoringInspectLead.name}
                  </h3>
                </div>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Complete algorithmic breakdown of interaction weights and funnel progress signals.
                </p>
              </div>
              <button
                onClick={() => setScoringInspectLead(null)}
                className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const audit =
                leadScores.get(scoringInspectLead.id) ||
                calculateLeadScore(scoringInspectLead, scoringContext);
              return (
                <div className="space-y-4 text-xs">
                  {/* Big Score Header */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#070e24] to-[#0c183a] text-white border border-red-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-300 uppercase tracking-wider block font-bold">
                        Calculated Velocity Rating
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-3xl font-black font-mono text-white">
                          {audit.totalScore}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">/ 100</span>
                        <span
                          className={`text-xs font-black px-2.5 py-1 rounded-lg border ${audit.tierBadgeBg}`}
                        >
                          {getHotnessTierIcon(audit.tier)} {audit.tier} Tier
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-gray-300 block">
                        Lifecycle Stage
                      </span>
                      <span className="text-xs font-black text-[#00c48c]">
                        {scoringInspectLead.stage}
                      </span>
                    </div>
                  </div>

                  {/* Factor Pillars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                    <div className="p-2.5 rounded-xl bg-[var(--soft)] border border-[var(--bd)]">
                      <span className="text-[10px] text-[var(--mu)] block font-sans">
                        Funnel Score
                      </span>
                      <span className="text-sm font-black text-emerald-500">
                        {audit.funnelScore} / 35
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--soft)] border border-[var(--bd)]">
                      <span className="text-[10px] text-[var(--mu)] block font-sans">
                        Interactions
                      </span>
                      <span className="text-sm font-black text-cyan-500">
                        {audit.interactionScore} / 35
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--soft)] border border-[var(--bd)]">
                      <span className="text-[10px] text-[var(--mu)] block font-sans">
                        Recency
                      </span>
                      <span className="text-sm font-black text-amber-500">
                        {audit.recencyScore} / 15
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--soft)] border border-[var(--bd)]">
                      <span className="text-[10px] text-[var(--mu)] block font-sans">
                        Value &amp; Fit
                      </span>
                      <span className="text-sm font-black text-purple-500">
                        {audit.valueScore} / 15
                      </span>
                    </div>
                  </div>

                  {/* Detected Triggers List */}
                  <div>
                    <span className="font-extrabold text-[var(--ink)] block uppercase tracking-wider text-[11px] mb-2">
                      Active Factor Triggers Detected ({audit.factors.length}):
                    </span>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {audit.factors.map((factor) => (
                        <div
                          key={factor.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                            factor.positive
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                              : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-500/30 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-xs block text-[var(--ink)]">
                              {factor.label}
                            </span>
                            <span className="text-[10px] text-[var(--mu)]">
                              {factor.description}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-lg text-xs font-mono font-black ${
                              factor.positive
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {factor.points >= 0 ? `+${factor.points}` : factor.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Simulator shortcuts */}
                  <div className="pt-2 border-t border-[var(--bd)] flex items-center justify-between">
                    <span className="text-[11px] text-[var(--mu)]">
                      Want to test score updates?
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSimulateTouchpoint(scoringInspectLead, 'wa_inbound')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/25 transition-all text-[11px] cursor-pointer"
                      >
                        + WhatsApp (+8)
                      </button>
                      <button
                        onClick={() => handleSimulateTouchpoint(scoringInspectLead, 'advance_funnel')}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-500/25 transition-all text-[11px] cursor-pointer"
                      >
                        + Advance (+5)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODAL 5: Scoring Rules & Matrix Documentation Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[var(--bg)] border-2 border-[#cca34c]/50 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[var(--bd)]">
              <div>
                <h3 className="text-lg font-black text-[var(--ink)] flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  <span>Lead Hotness Scoring Rules &amp; Matrix</span>
                </h3>
                <p className="text-xs text-[var(--mu)]">
                  How Back for Brand automatically evaluates, ranks, and prioritizes sales opportunities.
                </p>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Tiers overview */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30">
                  <span className="text-lg block">🔥</span>
                  <strong className="text-rose-500 block font-black">Very Hot</strong>
                  <span className="text-[10px] text-[var(--mu)] font-mono">85 - 100</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
                  <span className="text-lg block">⚡</span>
                  <strong className="text-amber-500 block font-black">Hot</strong>
                  <span className="text-[10px] text-[var(--mu)] font-mono">70 - 84</span>
                </div>
                <div className="p-2.5 rounded-xl bg-yellow-500/15 border border-yellow-500/30">
                  <span className="text-lg block">🌤️</span>
                  <strong className="text-yellow-600 dark:text-yellow-400 block font-black">Warm</strong>
                  <span className="text-[10px] text-[var(--mu)] font-mono">50 - 69</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30">
                  <span className="text-lg block">❄️</span>
                  <strong className="text-cyan-600 dark:text-cyan-400 block font-black">Cool</strong>
                  <span className="text-[10px] text-[var(--mu)] font-mono">30 - 49</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-500/15 border border-slate-500/30">
                  <span className="text-lg block">🧊</span>
                  <strong className="text-slate-500 block font-black">Cold</strong>
                  <span className="text-[10px] text-[var(--mu)] font-mono">0 - 29</span>
                </div>
              </div>

              {/* 4 Pillars details */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-[var(--ink)]">
                    <span className="flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-500" />
                      <span>1. Funnel Progress &amp; Stage (Max 35 pts)</span>
                    </span>
                    <span className="text-[#00c48c] font-mono">35% Weight</span>
                  </div>
                  <p className="text-[11px] text-[var(--mu)] leading-relaxed">
                    Evaluates position in the conversion journey: Won (+30), Booked Strategy Session (+25), Proposal under review (+20), Contacted (+14), Inbound (+8). Reaching checkout/payment steps yields an extra +7 pts; completing application yields +5 pts.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-[var(--ink)]">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-cyan-500" />
                      <span>2. Omnichannel Interaction History (Max 35 pts)</span>
                    </span>
                    <span className="text-cyan-500 font-mono">35% Weight</span>
                  </div>
                  <p className="text-[11px] text-[var(--mu)] leading-relaxed">
                    Automatically scans all matched communications: Inbound WhatsApp replies from lead (+8 pts each, up to 16 pts), confirmed calendar bookings (+12 pts), proposal email opens (+6 pts), and active client delivery projects (+8 pts).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-[var(--ink)]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>3. Velocity &amp; Touchpoint Recency (Max 15 pts)</span>
                    </span>
                    <span className="text-amber-500 font-mono">15% Weight</span>
                  </div>
                  <p className="text-[11px] text-[var(--mu)] leading-relaxed">
                    Fresh interactions generate momentum: Active within 24h (+15 pts), within 3 days (+10 pts), within 7 days (+5 pts). Leads dormant for more than 14 days incur a -5 pts decay penalty.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-[var(--ink)]">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-purple-500" />
                      <span>4. Deal Value &amp; Profile Fit (Max 15 pts)</span>
                    </span>
                    <span className="text-purple-500 font-mono">15% Weight</span>
                  </div>
                  <p className="text-[11px] text-[var(--mu)] leading-relaxed">
                    Evaluates commercial upside: Enterprise ticket &gt;$2,000 (+6 pts), High-Ticket &gt;$1,000 (+4 pts), AI Search (GEO/AEO) high-intent inbound (+4 pts), Enterprise VIP tag (+3 pts).
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-[var(--bd)]">
                <button
                  type="button"
                  onClick={() => setShowRulesModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#00c48c] text-white font-black hover:bg-[#00a876] cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

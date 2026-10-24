import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { STAGES, TRAFFIC_SOURCES, LeadStage, Lead } from '../../types/index.ts';
import { Plus, Trash2, MessageCircle, DollarSign, Search, Filter } from 'lucide-react';

export const CrmTab: React.FC = () => {
  const { leads, addLead, updateLeadStage, updateLeadValue, deleteLead } = useBusiness();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState(TRAFFIC_SOURCES[3]); // Meta Ads
  const [val, setVal] = useState<number | ''>('');
  const [need, setNeed] = useState('Funnel or landing page');

  // Filter / Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      src: source,
      stage: 'New',
      val: Number(val) || 0,
      need,
    });

    setName('');
    setPhone('');
    setEmail('');
    setVal('');
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.phone && l.phone.includes(searchTerm));
    const matchesSource = filterSource === 'all' || l.src === filterSource;
    return matchesSearch && matchesSource;
  });

  const formatCurrency = (amount: number) => '$' + Math.round(amount).toLocaleString();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Add Lead Bar */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-5 shadow-sm">
        <h3 className="font-extrabold text-sm text-[var(--ink)] mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-blue-600" />
          <span>Quick Add Inbound Lead</span>
        </h3>
        <form onSubmit={handleCreateLead} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2.5">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name / Business *"
            className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="WhatsApp (923...)"
            className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500"
          />
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500"
          >
            {TRAFFIC_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value ? Number(e.target.value) : '')}
            placeholder="Deal value $"
            className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-[#2b59ff] hover:bg-[#1a3fd1] text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mu)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, email, phone..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[var(--mu)]" />
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Traffic Sources</option>
            {TRAFFIC_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stage);
          const stageValue = stageLeads.reduce((acc, curr) => acc + (curr.val || 0), 0);

          return (
            <div
              key={stage}
              className="bg-[var(--soft)]/50 border border-[var(--bd)] rounded-2xl p-3 flex flex-col min-w-[210px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--bd)]">
                <div>
                  <h4 className="font-extrabold text-xs text-[var(--ink)] uppercase tracking-wider">
                    {stage}
                  </h4>
                  <span className="text-[10px] text-[var(--mu)]">
                    {stageLeads.length} leads · {formatCurrency(stageValue)}
                  </span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    stage === 'Won'
                      ? 'bg-emerald-500'
                      : stage === 'Lost'
                      ? 'bg-rose-500'
                      : 'bg-blue-500'
                  }`}
                />
              </div>

              {/* Lead Cards List */}
              <div className="space-y-2.5 flex-1 max-h-[580px] overflow-y-auto pr-1">
                {stageLeads.map((lead) => {
                  const cleanPhone = (lead.phone || '').replace(/\D/g, '');
                  return (
                    <div
                      key={lead.id}
                      className="bg-[var(--card)] border border-[var(--bd)] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow text-xs"
                    >
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <strong className="font-bold text-[var(--ink)] block truncate" title={lead.name}>
                          {lead.name}
                        </strong>
                        <span className="font-black text-[#18a864] text-[11px] whitespace-nowrap">
                          {formatCurrency(lead.val || 0)}
                        </span>
                      </div>

                      <div className="text-[11px] text-[var(--mu)] space-y-0.5 mb-2.5">
                        <div className="flex items-center gap-1 font-semibold text-[var(--ink)]">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                            {lead.src}
                          </span>
                        </div>
                        {lead.email && <div className="truncate">{lead.email}</div>}
                        {lead.need && <div className="text-[10px] italic truncate">{lead.need}</div>}
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[var(--bd)]/80">
                        <select
                          value={lead.stage}
                          onChange={(e) => updateLeadStage(lead.id, e.target.value as LeadStage)}
                          className="text-[11px] py-1 px-1.5 rounded-lg border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-semibold"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                              title="Message via WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Delete lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {stageLeads.length === 0 && (
                  <div className="py-6 text-center text-[11px] text-[var(--mu)] italic">
                    No leads in {stage}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[var(--mu)] bg-[var(--card)] p-3 rounded-xl border border-[var(--bd)] flex items-center gap-2">
        <span>💡</span>
        <span>
          When a lead is moved to <b>Won</b>, it instantly updates the executive metrics, closing count, and revenue across the system.
        </span>
      </p>
    </div>
  );
};

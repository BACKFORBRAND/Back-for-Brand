import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  Rocket,
  CheckCircle2,
  Clock,
  Plus,
  TrendingUp,
  DollarSign,
  Layers,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { ProjectStatus, PROJECT_STATUSES, ClientProject } from '../../types/index.ts';

export const ServicesManagerTab: React.FC = () => {
  const { projects, createProject, updateProjectStatus, toggleProjectMilestone } = useBusiness();

  const [showAddModal, setShowAddModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [serviceType, setServiceType] = useState('Full AI Business System');
  const [dealValue, setDealValue] = useState(2000);
  const [deadline, setDeadline] = useState('2026-11-15');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    createProject({
      clientName: clientName.trim(),
      serviceType,
      dealValue: Number(dealValue) || 1000,
      status: 'In Progress',
      progress: 25,
      startDate: new Date().toISOString().split('T')[0],
      deadline,
      milestones: [
        { id: 'm-new-1', title: 'Funnel Strategy & Wireframing', completed: true, dueDate: 'Week 1', category: 'Strategy' },
        { id: 'm-new-2', title: 'Conversion Copywriting & Design', completed: false, dueDate: 'Week 2', category: 'Design' },
        { id: 'm-new-3', title: 'AI Chatbot & CRM System Setup', completed: false, dueDate: 'Week 3', category: 'Engineering' },
        { id: 'm-new-4', title: 'Final QA, Stripe Connect & Launch', completed: false, dueDate: 'Week 4', category: 'Launch & QA' },
      ],
      notes: 'New client service delivery sprint launched.',
    });

    setShowAddModal(false);
    setClientName('');
  };

  const totalRetainers = projects.reduce((sum, p) => sum + (p.dealValue || 0), 0);
  const activeDeliveries = projects.filter((p) => p.status === 'In Progress' || p.status === 'Review').length;

  const formatCurrency = (val: number) => '$' + Math.round(val).toLocaleString();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--card)] border border-[var(--bd)] p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[var(--mu)] uppercase tracking-wider block">Total Project Value</span>
            <b className="text-2xl sm:text-3xl font-black text-[var(--ink)] block mt-1">{formatCurrency(totalRetainers)}</b>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[var(--mu)] uppercase tracking-wider block">Active Sprints</span>
            <b className="text-2xl sm:text-3xl font-black text-blue-600 block mt-1">{activeDeliveries}</b>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
            <Rocket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--bd)] p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[var(--mu)] uppercase tracking-wider block">On-Time Deliveries</span>
            <b className="text-2xl sm:text-3xl font-black text-purple-600 block mt-1">100%</b>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-[var(--ink)]">Client Projects &amp; Service Deliverables</h2>
          <p className="text-xs text-[var(--mu)] mt-0.5">
            Monitor sprint progress, complete milestones, and ensure zero delay client satisfaction.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#2b59ff] hover:bg-[#1a3fd1] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Client Project</span>
        </button>
      </div>

      {/* Add Project Form Drawer */}
      {showAddModal && (
        <div className="bg-[var(--card)] border-2 border-blue-500 rounded-3xl p-6 shadow-xl space-y-4 animate-slideDown">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
            <b className="text-sm font-black text-[var(--ink)]">Initiate Client Project Sprint</b>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-xs text-[var(--mu)] hover:text-[var(--ink)]"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateProject} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[var(--mu)] mb-1">Client Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Solari Dental"
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--mu)] mb-1">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
              >
                <option>Full AI Business System</option>
                <option>E-commerce Funnel &amp; Upsells</option>
                <option>Automated Booking Funnel</option>
                <option>AI Chatbot &amp; WhatsApp Automation</option>
                <option>Custom SaaS &amp; Web App</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[var(--mu)] mb-1">Deal Value ($)</label>
              <input
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--mu)] mb-1">Target Deadline</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-4 flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#2b59ff] hover:bg-[#1a3fd1] text-white py-2.5 px-6 rounded-xl font-bold transition-colors shadow-sm"
              >
                Initiate Project &amp; Provision Milestones
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-extrabold text-base text-[var(--ink)] tracking-tight">
                    {proj.clientName}
                  </h3>
                  <span className="text-xs text-[var(--mu)] block mt-0.5">{proj.serviceType}</span>
                </div>
                <span className="text-xs font-black text-[#18a864] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  {formatCurrency(proj.dealValue)}
                </span>
              </div>

              {/* Status and Progress Bar */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--ink)]">Deliverable Progress</span>
                  <span className="font-black text-blue-600">{proj.progress}%</span>
                </div>
                <div className="h-2.5 bg-[var(--bd)] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${proj.progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-2 mb-5">
                <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider block">
                  Milestones:
                </span>
                <div className="space-y-1.5 text-xs">
                  {proj.milestones.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => toggleProjectMilestone(proj.id, m.id)}
                      className="w-full text-left flex items-start gap-2 p-1.5 rounded-lg hover:bg-[var(--soft)] transition-colors group"
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                          m.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-[var(--bd)] bg-[var(--bg)] group-hover:border-blue-400'
                        }`}
                      >
                        {m.completed && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span
                        className={`leading-tight flex-1 ${
                          m.completed ? 'line-through text-[var(--mu)]' : 'text-[var(--ink)] font-medium'
                        }`}
                      >
                        {m.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[var(--bd)] flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1 text-[var(--mu)]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Deadline: {proj.deadline}</span>
              </div>

              <select
                value={proj.status}
                onChange={(e) => updateProjectStatus(proj.id, e.target.value as ProjectStatus)}
                className="font-bold px-2 py-1 rounded-lg border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
              >
                {PROJECT_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

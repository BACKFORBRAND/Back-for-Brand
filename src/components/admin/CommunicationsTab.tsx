import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  MessageSquare,
  Mail,
  Send,
  ExternalLink,
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  Phone,
  FileText,
  User,
  Plus,
} from 'lucide-react';
import { WhatsAppMessage, EmailThread } from '../../types/index.ts';

const WA_TEMPLATES = [
  {
    name: 'Meeting Reminder',
    text: 'Hi {name}! Friendly reminder about your strategy session with Ghazi Wazir on your scheduled time. Google Meet link: https://meet.google.com/bfb-growth. Please let us know if you need to reschedule!',
  },
  {
    name: 'Proposal Follow-up',
    text: 'Salam {name}, our engineering team has finalized your tailored conversion funnel architecture and scope proposal. Did you have any questions before we initiate the kickoff sprint?',
  },
  {
    name: 'Onboarding Welcome',
    text: 'Welcome aboard {name}! Your staging environment and sprint board have been provisioned by Back for Brand. Here is your client portal kickoff link: https://backforbrand.com/portal',
  },
  {
    name: 'Deposit / Invoice',
    text: 'Hello {name}, your deposit invoice for the Growth Funnel package has been generated. You can complete it securely via Stripe here: https://buy.stripe.com/bfb-invoice',
  },
];

const EMAIL_TEMPLATES = [
  {
    title: 'Strategy Plan Teardown Delivery',
    subject: 'Your Complimentary Growth Plan & Funnel Architecture — Back for Brand',
    body: `Dear {name},\n\nThank you for requesting a growth plan with Back for Brand LLC.\n\nAfter reviewing your business model and target audience, founder Ghazi Wazir and our systems team have outlined your optimal conversion pathway:\n\n1. High-Converting Landing Page & Funnel Copy\n2. 24/7 AI Receptionist & Lead Qualifier\n3. CRM Automation Pipeline (Zero lead leakage)\n\nWe would love to walk you through the architecture in a brief 15-minute briefing.\n\nWarm regards,\nGhazi Wazir\nFounder & CEO, Back for Brand LLC\nFlorida, USA`,
  },
  {
    title: 'Proposal & Scope of Work',
    subject: 'Proposal & Deliverables Scope: {name} — Back for Brand',
    body: `Dear {name},\n\nAttached is your formal scope of work and implementation timeline.\n\nDeliverables:\n- Custom conversion funnel & design system\n- Full CRM & WhatsApp automation triggers\n- Multi-channel ROAS attribution analytics\n- Dedicated engineering sprint & QA launch\n\nPlease let us know if you have any questions or are ready for kickoff.\n\nBest regards,\nBack for Brand Operations Team`,
  },
  {
    title: 'Weekly Sprint Progress Report',
    subject: 'Weekly Sprint Update: {name} Project Milestones',
    body: `Hello {name},\n\nHere is your weekly engineering sprint update from Back for Brand:\n\n✓ Milestone 1: Audience Research & Architecture (Completed)\n✓ Milestone 2: Conversion Copywriting & Layout (Completed)\n⚡ Milestone 3: AI Concierge & CRM Integration (In Progress)\n\nTarget official launch remains on schedule.\n\nBest regards,\nBack for Brand Services Team`,
  },
];

export const CommunicationsTab: React.FC = () => {
  const { leads, whatsappMessages, emailThreads, sendWhatsAppMessage, sendEmail } = useBusiness();

  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [selectedClientName, setSelectedClientName] = useState<string>(leads[0]?.name || 'Ali Traders');

  // WhatsApp compose state
  const [waText, setWaText] = useState('');

  // Email compose state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [showEmailCompose, setShowEmailCompose] = useState(false);

  const selectedLead = leads.find((l) => l.name === selectedClientName) || leads[0];

  // Filter messages for current client
  const clientWaMessages = whatsappMessages.filter(
    (m) => m.clientName.toLowerCase() === selectedClientName.toLowerCase()
  );

  const handleSendWa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waText.trim()) return;

    sendWhatsAppMessage({
      clientName: selectedClientName,
      phone: selectedLead?.phone || '923001234567',
      direction: 'outbound',
      text: waText.trim(),
      status: 'sent',
    });

    setWaText('');
  };

  const handleApplyWaTemplate = (templateText: string) => {
    const interpolated = templateText.replace('{name}', selectedClientName);
    setWaText(interpolated);
  };

  const handleApplyEmailTemplate = (t: typeof EMAIL_TEMPLATES[0]) => {
    setEmailSubject(t.subject.replace('{name}', selectedClientName));
    setEmailBody(t.body.replace('{name}', selectedClientName));
  };

  const handleSendEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) return;

    sendEmail({
      clientName: selectedClientName,
      email: selectedLead?.email || 'client@business.com',
      subject: emailSubject.trim(),
      body: emailBody.trim(),
      direction: 'outbound',
      status: 'sent',
    });

    setShowEmailCompose(false);
    setEmailSubject('');
    setEmailBody('');
  };

  const cleanPhone = (selectedLead?.phone || '').replace(/\D/g, '');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Subchannel Switcher */}
      <div className="bg-[var(--card)] border border-[var(--bd)] p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveChannel('whatsapp')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeChannel === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Command Center</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">{whatsappMessages.length}</span>
          </button>

          <button
            onClick={() => setActiveChannel('email')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeChannel === 'email'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Dispatcher &amp; Threads</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">{emailThreads.length}</span>
          </button>
        </div>

        {cleanPhone && (
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900"
          >
            <span>Open {selectedClientName} in WhatsApp Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* WHATSAPP VIEW */}
      {activeChannel === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Client List (4 cols) */}
          <div className="lg:col-span-4 bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-4 shadow-sm h-[620px] flex flex-col">
            <h3 className="font-extrabold text-xs text-[var(--ink)] uppercase tracking-wider px-2 pb-3 mb-2 border-b border-[var(--bd)]">
              Active Client Conversations
            </h3>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {leads.map((lead) => {
                const isSelected = lead.name === selectedClientName;
                const leadWa = whatsappMessages.filter((m) => m.clientName.toLowerCase() === lead.name.toLowerCase());
                const lastMsg = leadWa[leadWa.length - 1];

                return (
                  <button
                    key={lead.id}
                    onClick={() => setSelectedClientName(lead.name)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800'
                        : 'hover:bg-[var(--soft)] border border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <strong className="text-xs font-bold text-[var(--ink)] truncate">{lead.name}</strong>
                        <span className="text-[10px] text-[var(--mu)]">{lead.src}</span>
                      </div>
                      <p className="text-[11px] text-[var(--mu)] truncate mt-0.5">
                        {lastMsg ? lastMsg.text : lead.phone || 'No direct chat yet'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Interactive Chat Terminal (8 cols) */}
          <div className="lg:col-span-8 bg-[var(--card)] border border-[var(--bd)] rounded-3xl overflow-hidden shadow-sm h-[620px] flex flex-col">
            {/* WhatsApp Header */}
            <div className="bg-[#075e54] text-white px-5 py-3.5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
                  {selectedClientName.charAt(0)}
                </div>
                <div>
                  <b className="block text-sm font-black">{selectedClientName}</b>
                  <span className="text-[11px] text-emerald-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>WhatsApp Connected · {selectedLead?.phone || '+1 555 0192'}</span>
                  </span>
                </div>
              </div>

              <div className="text-xs text-emerald-100 flex items-center gap-2">
                <span>Stage: <b>{selectedLead?.stage}</b></span>
              </div>
            </div>

            {/* Quick Templates Drawer */}
            <div className="bg-[var(--soft)]/70 px-4 py-2 border-b border-[var(--bd)] flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-[var(--mu)] uppercase flex-shrink-0">
                Templates:
              </span>
              {WA_TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => handleApplyWaTemplate(tpl.text)}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[var(--card)] border border-[var(--bd)] text-[var(--ink)] hover:border-emerald-500 whitespace-nowrap transition-colors flex-shrink-0"
                >
                  ⚡ {tpl.name}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#e5ddd5]/30 dark:bg-black/30">
              {clientWaMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-xs text-[var(--mu)]">
                  <MessageSquare className="w-8 h-8 text-emerald-600 mb-2 opacity-60" />
                  <span>No message history with {selectedClientName}. Use templates above or type a message below.</span>
                </div>
              ) : (
                clientWaMessages.map((msg) => {
                  const isOutbound = msg.direction === 'outbound';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[78%] p-3 rounded-2xl text-xs sm:text-sm shadow-xs ${
                          isOutbound
                            ? 'bg-[#dcf8c6] dark:bg-emerald-950 text-gray-900 dark:text-emerald-100 rounded-tr-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm border border-[var(--bd)]'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                          <span>{msg.timestamp}</span>
                          {isOutbound && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendWa} className="p-3 bg-[var(--card)] border-t border-[var(--bd)] flex items-center gap-2">
              <input
                type="text"
                value={waText}
                onChange={(e) => setWaText(e.target.value)}
                placeholder={`Message ${selectedClientName} on WhatsApp...`}
                className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!waText.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EMAIL VIEW */}
      {activeChannel === 'email' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[var(--ink)]">
              Client Email Inbox &amp; Dispatched Threads
            </h3>
            <button
              onClick={() => setShowEmailCompose(true)}
              className="bg-[#2b59ff] hover:bg-[#1a3fd1] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Compose Email</span>
            </button>
          </div>

          {/* Email Compose Drawer / Box */}
          {showEmailCompose && (
            <div className="bg-[var(--card)] border-2 border-blue-500 rounded-3xl p-6 shadow-xl space-y-4 animate-slideDown">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
                <b className="text-sm font-black text-[var(--ink)]">Compose Email to Client</b>
                <button
                  onClick={() => setShowEmailCompose(false)}
                  className="text-xs text-[var(--mu)] hover:text-[var(--ink)]"
                >
                  Cancel
                </button>
              </div>

              {/* Template Picker */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[11px] font-bold text-[var(--mu)] uppercase flex-shrink-0">Quick Templates:</span>
                {EMAIL_TEMPLATES.map((et, i) => (
                  <button
                    key={i}
                    onClick={() => handleApplyEmailTemplate(et)}
                    className="text-[11px] font-semibold px-3 py-1 rounded-lg bg-[var(--soft)] border border-[var(--bd)] text-[var(--ink)] hover:border-blue-500 whitespace-nowrap transition-colors flex-shrink-0"
                  >
                    📄 {et.title}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendEmailSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--mu)] mb-1">Target Client</label>
                    <select
                      value={selectedClientName}
                      onChange={(e) => setSelectedClientName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
                    >
                      {leads.map((l) => (
                        <option key={l.id} value={l.name}>
                          {l.name} ({l.email || 'no email'})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--mu)] mb-1">Subject Line</label>
                    <input
                      type="text"
                      required
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="e.g. Back for Brand — Project Deliverables & Next Steps"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--mu)] mb-1">Email Body</label>
                  <textarea
                    rows={6}
                    required
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Write your email body..."
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] resize-y"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailCompose(false)}
                    className="px-4 py-2 text-xs font-semibold text-[var(--mu)]"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2b59ff] hover:bg-[#1a3fd1] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Email</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Email Threads List */}
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-5 shadow-sm divide-y divide-[var(--bd)]/80">
            {emailThreads.map((thread) => (
              <div key={thread.id} className="py-4 first:pt-0 last:pb-0 text-xs sm:text-sm space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="font-bold text-[var(--ink)] block">{thread.subject}</strong>
                      <span className="text-[11px] text-[var(--mu)]">
                        To: {thread.clientName} ({thread.email})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-semibold text-[10px]">
                      {thread.status.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-[var(--mu)]">{thread.timestamp}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--soft)]/50 text-[var(--ink)] text-xs font-mono leading-relaxed whitespace-pre-line border border-[var(--bd)]/60">
                  {thread.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

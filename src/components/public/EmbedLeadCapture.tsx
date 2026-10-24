import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { Send, CheckCircle2, ShieldCheck, Sparkles, Building, Phone, Mail, User } from 'lucide-react';

export const EmbedLeadCapture: React.FC = () => {
  const { addLead, channels, funnels } = useBusiness();
  const [channel, setChannel] = useState<string>('Direct/Other');
  const [funnelSlug, setFunnelSlug] = useState<string>('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [redirectUrl, setRedirectUrl] = useState<string>('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [need, setNeed] = useState('Growth & Funnel Strategy');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ch = params.get('channel') || params.get('src') || params.get('utm_source');
      if (ch) {
        // Find best match or use as-is
        const matched = channels.find(
          (c) => c.name.toLowerCase() === ch.toLowerCase() || c.name.toLowerCase().includes(ch.toLowerCase())
        );
        setChannel(matched ? matched.name : ch);
      }
      const fn = params.get('funnel');
      if (fn) setFunnelSlug(fn);

      const th = params.get('theme');
      if (th === 'light' || th === 'dark') setTheme(th);

      const rd = params.get('redirect');
      if (rd) setRedirectUrl(rd);
    } catch {
      // ignore
    }
  }, [channels]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);

    const matchedFunnel = funnels.find((f) => f.slug === funnelSlug);

    const newLead = addLead({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      company: company.trim() || undefined,
      src: channel,
      stage: 'New',
      val: 1200,
      need: need,
      funnelId: matchedFunnel ? matchedFunnel.id : undefined,
      funnelName: matchedFunnel ? matchedFunnel.name : (funnelSlug ? funnelSlug : undefined),
      funnelStep: 'Embed Form Submitted',
      message: `Submitted via Embed Lead Form for channel: ${channel}`,
    });

    // Notify parent window if inside an iframe
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: 'BFB_LEAD_SUBMITTED',
            lead: newLead,
            channel: channel,
          },
          '*'
        );
      }
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setSubmitted(true);

    if (redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-6 transition-colors ${
        isDark ? 'bg-[#060b19] text-white' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl p-6 sm:p-7 border shadow-2xl transition-all ${
          isDark
            ? 'bg-[#0c142b] border-[#1f2f5c] text-white shadow-black/60'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/80'
        }`}
      >
        {/* Attribution Chip */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Back for Brand OS
            </span>
          </div>
          <div
            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
              isDark
                ? 'bg-blue-900/40 border-blue-600/40 text-blue-300'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}
          >
            Channel: {channel}
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-6 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-1">Thank You, {name}!</h3>
            <p className={`text-xs mb-4 max-w-xs mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Your request has been received and routed into our growth pipeline via <b className="text-emerald-400">{channel}</b>.
            </p>
            {redirectUrl ? (
              <p className="text-[11px] text-blue-400 animate-pulse">
                Redirecting you to next step...
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setPhone('');
                  setCompany('');
                }}
                className="text-xs text-blue-400 hover:underline"
              >
                Submit another response
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <h2 className="text-lg font-black tracking-tight mb-1">
                Claim Your Free Growth Architecture
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Enter your business details below to get started.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold mb-1 opacity-90">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-3 opacity-40" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className={`w-full text-xs pl-9 pr-3 py-2 rounded-xl border outline-none font-medium transition-all ${
                    isDark
                      ? 'bg-[#070d20] border-[#223567] text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold mb-1 opacity-90">
                Work Email *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 opacity-40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full text-xs pl-9 pr-3 py-2 rounded-xl border outline-none font-medium transition-all ${
                    isDark
                      ? 'bg-[#070d20] border-[#223567] text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold mb-1 opacity-90">
                  Phone (WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-3 opacity-40" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0192"
                    className={`w-full text-xs pl-9 pr-3 py-2 rounded-xl border outline-none font-medium transition-all ${
                      isDark
                        ? 'bg-[#070d20] border-[#223567] text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-1 opacity-90">
                  Company
                </label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 absolute left-3 top-3 opacity-40" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                    className={`w-full text-xs pl-9 pr-3 py-2 rounded-xl border outline-none font-medium transition-all ${
                      isDark
                        ? 'bg-[#070d20] border-[#223567] text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold mb-1 opacity-90">
                Primary Goal / Service
              </label>
              <select
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                className={`w-full text-xs px-3 py-2 rounded-xl border outline-none font-medium transition-all ${
                  isDark
                    ? 'bg-[#070d20] border-[#223567] text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                }`}
              >
                <option value="Growth & Funnel Strategy">High-Converting Sales Funnel</option>
                <option value="24/7 AI Chatbot & WhatsApp">24/7 AI Booking Agent & WhatsApp</option>
                <option value="E-Commerce & Scale">Omni-Channel E-Commerce Architecture</option>
                <option value="SEO & Search Engine Domination">SEO / GEO AI Search Optimization</option>
                <option value="Full Autonomous Business OS">Full Autonomous Business OS</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Get Instant Strategy & Blueprint'}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] opacity-60">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Zero-Spam Guarantee · Encrypted 256-bit Attributed Lead</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

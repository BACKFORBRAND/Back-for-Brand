import React from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { Check, Star, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';

export const PricingPlansSection: React.FC = () => {
  const { openPaymentModal } = useBusiness();
  const scrollToContact = (planName: string) => {
    const el = document.getElementById('start');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const select = el.querySelector('select[name="s"]') as HTMLSelectElement | null;
      if (select) {
        if (planName === 'Launch') select.value = 'Funnel or landing page';
        if (planName === 'Growth') select.value = 'AI chatbot & automation';
        if (planName === 'Scale') select.value = 'Full AI business system';
      }
    }
  };

  return (
    <section id="plans" className="py-20 bg-[var(--bg)] border-t border-[var(--bd)]">
      <div className="max-w-[1160px] w-[92%] mx-auto text-center">
        <div className="text-[#00c48c] font-black text-xs uppercase tracking-widest mb-2">
          Plans
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight text-[var(--ink)] mb-4">
          Start small or <span className="highlight-gold">go all in</span>.
        </h2>
        <p className="text-base sm:text-lg text-[var(--mu)] max-w-[620px] mx-auto mb-14">
          Every project starts with a free custom strategy plan. Then you get a crystal clear proposal tailored to your targets.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-[1040px] mx-auto items-stretch">
          {/* Plan 1: Launch */}
          <div className="bg-[var(--bg)] border border-[var(--bd)] rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-[#00c48c]/40 transition-all">
            <div>
              <h3 className="text-2xl font-black text-[var(--ink)] mb-2">Launch</h3>
              <p className="text-sm text-[var(--mu)] mb-6">
                For ambitious new businesses getting established online.
              </p>
              <ul className="space-y-3.5 text-sm text-[var(--mu)] mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#00c48c] font-black text-base">✓</span>
                  <span>Conversion-focused website</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#00c48c] font-black text-base">✓</span>
                  <span>SEO foundations &amp; meta structure</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#00c48c] font-black text-base">✓</span>
                  <span>Lead capture and email sequence</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#00c48c] font-black text-base">✓</span>
                  <span>Analytics &amp; UTM setup</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2 mt-2">
              <button
                onClick={() => scrollToContact('Launch')}
                className="w-full py-3 rounded-xl border-2 border-[var(--bd)] text-[var(--ink)] font-bold text-xs hover:border-[#00c48c] hover:text-[#00c48c] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request a quote</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#00c48c]" />
              </button>
              <button
                onClick={() => openPaymentModal({ amount: 500, note: 'Launch Plan Kickoff Retainer ($500 Deposit)' })}
                className="w-full py-2.5 rounded-xl bg-[#00c48c]/10 hover:bg-[#00c48c]/20 text-[#00a876] dark:text-[#20d89f] font-black text-xs transition-all flex items-center justify-center gap-1.5 border border-[#00c48c]/30 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay $500 Deposit (Stripe / Bank)</span>
              </button>
            </div>
          </div>

          {/* Plan 2: Growth (Recommended) */}
          <div className="bg-[var(--bg)] border-2 border-[#cca34c] rounded-3xl p-8 shadow-2xl relative flex flex-col justify-between scale-100 md:scale-105 z-10 shadow-[#cca34c]/15">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#cca34c] to-[#b8903c] text-white text-xs font-black px-4 py-1 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>★ RECOMMENDED</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-[var(--ink)] mb-2">Growth</h3>
              <p className="text-sm text-[var(--mu)] mb-6">
                For growing businesses ready to aggressively multiply customer pipeline.
              </p>
              <ul className="space-y-3.5 text-sm text-[var(--mu)] mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#00c48c] font-black text-base">✓</span>
                  <span className="font-semibold text-[var(--ink)]">Everything included in Launch</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#00c48c] font-black text-base">✓</span>
                  <span>24/7 WhatsApp AI &amp; CRM pipeline</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#00c48c] font-black text-base">✓</span>
                  <span>Automated follow-ups &amp; WhatsApp alerts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#00c48c] font-black text-base">✓</span>
                  <span>SEO, Google &amp; Meta ad management</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#00c48c] font-black text-base">✓</span>
                  <span>Real-time ROI &amp; ROAS reporting</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2 mt-2">
              <button
                onClick={() => openPaymentModal({ amount: 1500, note: 'Growth Plan ($1,500 Kickoff Retainer / Full)' })}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white font-black text-sm transition-all shadow-[0_4px_0_#007a56] hover:shadow-[0_2px_0_#007a56] hover:translate-y-[2px] flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-white" />
                <span>Pay $1,500 Growth Plan (Instant)</span>
              </button>
              <button
                onClick={() => scrollToContact('Growth')}
                className="w-full py-2.5 rounded-xl border border-[#cca34c]/50 text-[#cca34c] hover:bg-[#cca34c]/10 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request proposal first</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#cca34c]" />
              </button>
            </div>
          </div>

          {/* Plan 3: Scale */}
          <div className="bg-[var(--bg)] border border-[var(--bd)] rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-[#cca34c]/40 transition-all">
            <div>
              <h3 className="text-2xl font-black text-[var(--ink)] mb-2">Scale</h3>
              <p className="text-sm text-[var(--mu)] mb-6">
                For established teams scaling on fully connected, autonomous systems.
              </p>
              <ul className="space-y-3.5 text-sm text-[var(--mu)] mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#cca34c] font-black text-base">✓</span>
                  <span className="font-semibold text-[var(--ink)]">Full Back for Brand OS</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#cca34c] font-black text-base">✓</span>
                  <span>Custom apps, SaaS &amp; API integrations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#cca34c] font-black text-base">✓</span>
                  <span>Dedicated executive CTO architecture</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#cca34c] font-black text-base">✓</span>
                  <span>Ongoing CRO &amp; continuous optimization</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2 mt-2">
              <button
                onClick={() => scrollToContact('Scale')}
                className="w-full py-3 rounded-xl border-2 border-[var(--bd)] text-[var(--ink)] font-bold text-xs hover:border-[#cca34c] hover:text-[#cca34c] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request enterprise proposal</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#cca34c]" />
              </button>
              <button
                onClick={() => openPaymentModal({ amount: 3500, note: 'Scale Plan Custom Retainer Kickoff ($3,500)' })}
                className="w-full py-2.5 rounded-xl bg-[#cca34c]/10 hover:bg-[#cca34c]/20 text-[#cca34c] font-black text-xs transition-all flex items-center justify-center gap-1.5 border border-[#cca34c]/30 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay $3,500 Enterprise Deposit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

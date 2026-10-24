import React from 'react';
import { ArrowRight } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Attract',
      text: 'We bring the right qualified buyers to you with organic SEO, targeted ads and authority content.',
      tag: 'SEO · Ads · Social',
      color: 'bg-[#070e24] text-[#00c48c] border-2 border-[#cca34c]',
    },
    {
      num: '2',
      title: 'Capture',
      text: 'Lightning-fast landing pages and an intelligent AI chatbot turn anonymous visitors into verified leads.',
      tag: 'Pages · Forms · WhatsApp',
      color: 'bg-[#00c48c] text-white shadow-md shadow-[#00c48c]/30',
    },
    {
      num: '3',
      title: 'Convert',
      text: 'Automated follow-ups, instant WhatsApp pings, interactive proposals and frictionless checkout close the deal.',
      tag: 'CRM · Email · Payments',
      color: 'bg-[#cca34c] text-white shadow-md shadow-[#cca34c]/30',
    },
    {
      num: '4',
      title: 'Delight',
      text: 'Smooth automated onboarding, self-serve portals and responsive support turn customers into lifelong advocates.',
      tag: 'Onboarding · Support',
      color: 'bg-gradient-to-r from-[#00c48c] to-[#cca34c] text-white',
    },
  ];

  return (
    <section id="how" className="py-20 bg-[var(--soft)]/40 border-y border-[var(--bd)]">
      <div className="max-w-[1160px] w-[92%] mx-auto text-center">
        <div className="text-[#00c48c] font-black text-xs uppercase tracking-widest mb-2">
          How it works
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight text-[var(--ink)] mb-4">
          Your funnel in <span className="highlight-gold">4 simple steps</span>.
        </h2>
        <p className="text-base sm:text-lg text-[var(--mu)] max-w-[600px] mx-auto mb-14">
          From first touchpoint to cash in the bank, we engineer the complete customer acquisition pathway.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {steps.map((st) => (
            <div
              key={st.num}
              className="bg-[var(--bg)] border border-[var(--bd)] rounded-2xl p-7 shadow-sm hover:shadow-lg hover:border-[#00c48c]/50 transition-all relative flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-11 h-11 rounded-full ${st.color} font-extrabold text-lg flex items-center justify-center mb-5 shadow-md`}
                >
                  {st.num}
                </div>
                <h3 className="text-xl font-black text-[var(--ink)] tracking-tight mb-2">
                  {st.title}
                </h3>
                <p className="text-sm text-[var(--mu)] leading-relaxed mb-6">
                  {st.text}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--bd)]">
                <span className="text-xs font-bold text-[#00c48c]">
                  {st.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <a
            href="#start"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white font-black text-base px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#00c48c]/30 hover:scale-[1.02] cursor-pointer"
          >
            <span>Build my funnel</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

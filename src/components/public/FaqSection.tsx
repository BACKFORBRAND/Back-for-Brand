import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'What is a sales funnel?',
    answer:
      'A funnel is the orchestrated path an anonymous visitor takes from first discovering your business to becoming a high-paying, repeat customer: traffic generation, landing page lead capture, automated qualification & follow-up, proposal checkout, and seamless onboarding.',
  },
  {
    question: 'Do I need technical skills?',
    answer:
      'No, zero technical skills required. We architect, design, code, launch, and maintain the entire system for you, and we walk you and your team through every step in plain, practical language.',
  },
  {
    question: 'Can you help me rank on Google and AI search?',
    answer:
      'Yes. We build high-speed, SEO-engineered websites and execute technical SEO, local SEO (Google Business Profiles), and modern Generative Engine Optimization (GEO/AEO) so AI answer engines like Gemini, ChatGPT, and Perplexity reference your brand as an authority.',
  },
  {
    question: 'Do you work outside the USA?',
    answer:
      'Yes. Back for Brand LLC is headquartered in Florida, USA, and actively serves companies across North America, the UK, Europe, the GCC (including Bahrain, UAE, and Saudi Arabia), and worldwide with cross-border payment & multi-currency funnels.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'Investment depends on your current volume and operational scope. Request your free strategy plan below, and we will formulate a transparent proposal with clear deliverables and predictable pricing options.',
  },
  {
    question: 'Who owns what you build?',
    answer:
      'You own 100% of the assets, code, copy, domains, and CRM data. Full administrator access and credentials are transitioned to your ownership according to your client agreement.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-20 bg-[var(--bg)] border-t border-[var(--bd)]">
      <div className="max-w-[1160px] w-[92%] mx-auto text-center">
        <div className="text-[#00c48c] font-black text-xs uppercase tracking-widest mb-2">
          FAQ
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight text-[var(--ink)] mb-4">
          Got questions? <span className="highlight-gold">We’ve got answers.</span>
        </h2>
        <p className="text-base sm:text-lg text-[var(--mu)] max-w-[620px] mx-auto mb-12">
          Everything you need to know about our funnels, technology stack, and partnership.
        </p>

        <div className="max-w-[800px] mx-auto text-left space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[var(--bg)] border border-[var(--bd)] rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left font-bold text-base sm:text-lg text-[var(--ink)] hover:text-[#00c48c] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="w-8 h-8 rounded-full bg-[var(--soft)] flex items-center justify-center text-[#cca34c] flex-shrink-0 ml-4 font-black">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[var(--mu)] leading-relaxed border-t border-[var(--bd)]/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

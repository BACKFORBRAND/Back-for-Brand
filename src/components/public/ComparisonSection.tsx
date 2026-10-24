import React from 'react';
import { X, Check } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  return (
    <section className="py-20 bg-[var(--bg)]">
      <div className="max-w-[1160px] w-[92%] mx-auto text-center">
        <div className="text-[#00c48c] font-black text-xs uppercase tracking-widest mb-2">
          Why Back for Brand
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight text-[var(--ink)] mb-4">
          Stop piecing it together <span className="highlight-gold">yourself</span>.
        </h2>
        <p className="text-base sm:text-lg text-[var(--mu)] max-w-[620px] mx-auto mb-14">
          Trying to integrate multiple software subscriptions and freelancers creates leaks in your funnel. Here is the difference:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-[960px] mx-auto">
          {/* Left: Doing it alone */}
          <div className="rounded-3xl p-8 sm:p-10 border border-[var(--bd)] bg-[var(--bg)] shadow-sm">
            <h3 className="text-2xl font-black text-[var(--ink)] mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
                ✕
              </span>
              <span>Doing it alone</span>
            </h3>
            <ul className="space-y-5 text-sm sm:text-base text-[var(--mu)]">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-lg mt-[-2px]">✕</span>
                <span>Five or six different software subscriptions that refuse to talk to each other cleanly.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-lg mt-[-2px]">✕</span>
                <span>Inbound leads wait hours (or days) for a human reply, going cold to competitors.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-lg mt-[-2px]">✕</span>
                <span>Guessing what marketing works because ad spend isn't tied to closed deals.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-lg mt-[-2px]">✕</span>
                <span>Months wasted learning complex automation tools instead of running your actual company.</span>
              </li>
            </ul>
          </div>

          {/* Right: With Back for Brand */}
          <div className="rounded-3xl p-8 sm:p-10 bg-[#070e24] text-white border-2 border-[#cca34c]/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00c48c]/15 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#00c48c] text-white flex items-center justify-center text-sm font-bold shadow-md">
                ✓
              </span>
              <span>
                With Back for <span className="text-[#cca34c]">Brand</span>
              </span>
            </h3>
            <ul className="space-y-5 text-sm sm:text-base text-emerald-100/90">
              <li className="flex items-start gap-3">
                <span className="text-[#cca34c] font-black text-lg mt-[-2px]">✓</span>
                <span>One unified, connected engine custom-engineered for your exact business model.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#cca34c] font-black text-lg mt-[-2px]">✓</span>
                <span>AI WhatsApp closer replies in &lt;45s, qualifies requirements, and books meetings 24/7.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#cca34c] font-black text-lg mt-[-2px]">✓</span>
                <span>A crystal clear growth roadmap with full UTM channel attribution and real ROAS metrics.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#cca34c] font-black text-lg mt-[-2px]">✓</span>
                <span>Done-for-you build, launch, technical integration, and ongoing executive support.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { ExternalLink, Award, Sparkles } from 'lucide-react';

export const CaseStudySection: React.FC = () => {
  return (
    <section className="py-20 bg-[var(--soft)]/50 border-t border-[var(--bd)]">
      <div className="max-w-[1160px] w-[92%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left: Case study badge in Brand Navy & Mustard Gold */}
        <div className="bg-gradient-to-br from-[#070e24] via-[#0b1b36] to-[#070e24] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#cca34c]/30 relative overflow-hidden">
          <div className="inline-block px-3 py-1 rounded-full bg-[#cca34c]/20 border border-[#cca34c]/40 text-[#cca34c] text-xs font-black tracking-wider mb-5">
            CLIENT CASE STUDY
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
            Bab Al-Khaleej Business Consultant
          </h3>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-6">
            A Bahrain-based business consultancy supported by technology development and digital infrastructure from Back for Brand LLC.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3.5 py-1 rounded-full bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 text-xs font-bold backdrop-blur-sm">
              AI
            </span>
            <span className="px-3.5 py-1 rounded-full bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 text-xs font-bold backdrop-blur-sm">
              Website
            </span>
            <span className="px-3.5 py-1 rounded-full bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 text-xs font-bold backdrop-blur-sm">
              CRM
            </span>
            <span className="px-3.5 py-1 rounded-full bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 text-xs font-bold backdrop-blur-sm">
              Automation
            </span>
            <span className="px-3.5 py-1 rounded-full bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 text-xs font-bold backdrop-blur-sm">
              Dashboard
            </span>
          </div>

          <p className="text-[#cca34c]/80 text-xs leading-relaxed border-t border-white/10 pt-4">
            Bab Al-Khaleej is an independent Bahrain company. Back for Brand LLC is an independent Florida technology company. They are separate businesses led by the same CEO.
          </p>
        </div>

        {/* Right: Founder Profile */}
        <div>
          <div className="text-[#00c48c] font-black text-xs uppercase tracking-widest mb-2.5">
            Built for real businesses
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-[var(--ink)] mb-5">
            Founder <span className="highlight-gold">Ghazi Wazir</span> &amp; Back for Brand Engineering
          </h2>
          <p className="text-base sm:text-lg text-[var(--mu)] leading-relaxed mb-6">
            Ghazi Wazir leads Back for Brand LLC with an obsessive focus on applied AI, production-grade software engineering, digital transformation, and international commerce — managing active projects that founders can launch, automate, and scale with total confidence.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="https://www.linkedin.com/in/ghaziwazir"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[var(--bd)] text-[var(--ink)] font-bold text-sm hover:border-[#00c48c] hover:text-[#00c48c] transition-all bg-[var(--bg)] cursor-pointer"
            >
              <span>Founder on LinkedIn</span>
              <ExternalLink className="w-4 h-4 text-[#00c48c]" />
            </a>
            <span className="text-xs text-[var(--mu)] font-medium">
              Registered in Florida, USA · Serving clients globally
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

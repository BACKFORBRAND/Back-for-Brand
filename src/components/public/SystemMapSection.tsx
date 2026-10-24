import React from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Bot,
  LayoutDashboard,
  DollarSign,
  Share2,
  CheckCircle2,
} from 'lucide-react';

export const SystemMapSection: React.FC = () => {
  const { funnels, channels } = useBusiness();

  const systemNodes = [
    {
      step: '01',
      title: '17 Traffic Channels',
      desc: 'SEO, GEO AI Search, Meta/Google Ads, WhatsApp, & Affiliates',
      badge: 'Unified Attribution',
      icon: Share2,
      accent: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
    {
      step: '02',
      title: 'High-Converting Funnels',
      desc: `${funnels.length} Pre-built & Custom Dedicated Conversion Architectures`,
      badge: 'Zero Friction',
      icon: Globe,
      accent: 'border-[#00c48c]/40 text-[#00c48c] bg-[#00c48c]/10',
    },
    {
      step: '03',
      title: '24/7 AI Concierge',
      desc: 'Trilingual Qualifier, Booking Manager, & WhatsApp Dispatcher',
      badge: 'Instant Response',
      icon: Bot,
      accent: 'border-[#cca34c]/40 text-[#cca34c] bg-[#cca34c]/10',
    },
    {
      step: '04',
      title: 'Autonomous CRM & OS',
      desc: 'Automated Sequences, Task Allocations, & Executive Governance',
      badge: 'Full Ownership',
      icon: LayoutDashboard,
      accent: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[var(--soft)]/40 border-y border-[var(--bd)] relative overflow-hidden">
      <div className="max-w-[1240px] w-[92%] mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00c48c]/15 border border-[#00c48c]/30 text-[#00c48c] text-xs font-black uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>End-to-End System Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--ink)] tracking-tight">
            One Connected System. <span className="text-[#cca34c]">Not Six Disconnected Tools.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--mu)] leading-relaxed">
            Every visitor, ad click, and WhatsApp message flows into a continuous, automated revenue engine with real-time attribution and client asset ownership.
          </p>
        </div>

        {/* System Diagram Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {systemNodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <div
                key={node.step}
                className="bg-[var(--card)] border border-[var(--bd)] hover:border-[#00c48c]/50 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black font-mono text-[var(--mu)] opacity-70">
                      STEP {node.step}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${node.accent}`}>
                      {node.badge}
                    </span>
                  </div>

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${node.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-[var(--ink)] group-hover:text-[#00c48c] transition-colors">
                      {node.title}
                    </h3>
                    <p className="text-xs text-[var(--mu)] leading-relaxed">
                      {node.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--bd)]/60 flex items-center justify-between text-[11px] font-bold text-[var(--mu)]">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                  </span>
                  {index < 3 && (
                    <ArrowRight className="w-4 h-4 text-[var(--mu)] opacity-40 hidden lg:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

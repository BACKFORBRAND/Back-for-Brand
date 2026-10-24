import React from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { ArrowRight, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export const FunnelsCatalogSection: React.FC = () => {
  const { funnels, setActiveFunnelId, recordFunnelVisit } = useBusiness();

  const handleLaunchFunnel = (funnelSlug: string) => {
    setActiveFunnelId(funnelSlug);
    recordFunnelVisit(funnelSlug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getBadgeStyle = (accent: string) => {
    switch (accent) {
      case 'gold':
        return 'bg-[#cca34c]/15 text-[#cca34c] border-[#cca34c]/30';
      case 'blue':
        return 'bg-blue-500/15 text-blue-500 border-blue-500/30';
      case 'purple':
        return 'bg-purple-500/15 text-purple-500 border-purple-500/30';
      case 'orange':
        return 'bg-orange-500/15 text-orange-500 border-orange-500/30';
      default:
        return 'bg-[#00c48c]/15 text-[#00a876] dark:text-[#20d89f] border-[#00c48c]/30';
    }
  };

  return (
    <section id="funnels" className="py-20 bg-[var(--soft)]/50 border-t border-[var(--bd)]">
      <div className="max-w-[1160px] w-[92%] mx-auto text-center">
        <div className="text-[#00c48c] font-black text-xs uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#cca34c]" />
          <span>Multi-Funnel Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight text-[var(--ink)] mb-4">
          A dedicated funnel for <span className="highlight-gold">every service you sell</span>.
        </h2>
        <p className="text-base sm:text-lg text-[var(--mu)] max-w-[660px] mx-auto mb-14 leading-relaxed">
          From high-ticket advisory retainers to medical clinic bookings and frictionless 1-click e-commerce checkouts, each service gets its own high-converting sales engine.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {funnels.map((funnel) => {
            const badgeClass = getBadgeStyle(funnel.accentColor);

            return (
              <article
                key={funnel.id}
                onClick={() => handleLaunchFunnel(funnel.slug)}
                className="group bg-[var(--bg)] border border-[var(--bd)] rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#00c48c]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-block text-[11px] font-black py-1 px-3 rounded-full border uppercase tracking-wider ${badgeClass}`}>
                      {funnel.badge}
                    </span>
                    <span className="text-[11px] font-bold text-[var(--mu)]">
                      {funnel.serviceCategory.split(' ')[0]}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[var(--ink)] tracking-tight mb-2 group-hover:text-[#00c48c] transition-colors">
                    {funnel.name}
                  </h3>

                  <p className="text-xs text-[var(--mu)] leading-relaxed mb-4 line-clamp-2">
                    {funnel.subheadline}
                  </p>

                  <div className="space-y-1 mb-6 text-xs text-[var(--ink)]/80">
                    {funnel.deliverables.slice(0, 2).map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00c48c] flex-shrink-0" />
                        <span className="truncate">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--bd)] flex items-center justify-between">
                  <div className="text-xs font-bold text-[var(--ink)]">
                    <span className="text-[10px] text-[var(--mu)] block">Starting at</span>
                    <span className="font-black text-sm text-[#cca34c]">
                      ${funnel.pricingTiers[0]?.price.toLocaleString()}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-black text-[#00a876] dark:text-[#20d89f] group-hover:translate-x-1 transition-transform">
                    <span>View Funnel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { Target, Bot, Zap, Search, ShoppingBag, Rocket, ArrowRight, ExternalLink } from 'lucide-react';

interface ServiceItem {
  id: string;
  funnelSlug: string;
  icon: React.ReactNode;
  bgIcon: string;
  title: string;
  description: string;
  deliverables: string[];
}

const SERVICES: ServiceItem[] = [
  {
    id: 'funnels',
    funnelSlug: 'consulting-growth',
    icon: <Target className="w-6 h-6 text-[#00c48c]" />,
    bgIcon: 'bg-[#00c48c]/15 border border-[#00c48c]/30',
    title: 'Funnels & landing pages',
    description: 'High-converting pages designed to turn clicks into leads and leads into buyers with surgical precision.',
    deliverables: ['Custom conversion copy', 'Mobile-first design', 'A/B split testing', 'Fast-loading code'],
  },
  {
    id: 'ai-chat',
    funnelSlug: 'clinic-booking',
    icon: <Bot className="w-6 h-6 text-[#cca34c]" />,
    bgIcon: 'bg-[#cca34c]/15 border border-[#cca34c]/30',
    title: 'AI chatbots & WhatsApp closers',
    description: 'Answer questions, qualify leads and book calls on your site and WhatsApp, day and night without human delay.',
    deliverables: ['Custom-trained knowledge base', 'WhatsApp & web widget', 'Live CRM data injection', 'Multi-language (EN·AR·UR)'],
  },
  {
    id: 'automation',
    funnelSlug: 'saas-growth',
    icon: <Zap className="w-6 h-6 text-[#00c48c]" />,
    bgIcon: 'bg-[#00c48c]/15 border border-[#00c48c]/30',
    title: 'CRM & automation',
    description: 'Follow-ups, pipelines and workflows that run themselves so no lead goes cold and every deal is tracked.',
    deliverables: ['Kanban lead pipelines', 'Automated email & SMS', 'Instant WhatsApp triggers', 'Task reminders'],
  },
  {
    id: 'seo-ads',
    funnelSlug: 'local-leads',
    icon: <Search className="w-6 h-6 text-[#cca34c]" />,
    bgIcon: 'bg-[#cca34c]/15 border border-[#cca34c]/30',
    title: 'SEO & paid ads',
    description: 'Show up on Google, AI search engines (GEO/AEO), and run Google and Meta ads that reliably pay back with positive ROAS.',
    deliverables: ['Local SEO & GMB setup', 'Generative Engine Optimization', 'Meta & Google ad sets', 'UTM attribution tracking'],
  },
  {
    id: 'ecommerce',
    funnelSlug: 'ecommerce-checkout',
    icon: <ShoppingBag className="w-6 h-6 text-[#00c48c]" />,
    bgIcon: 'bg-[#00c48c]/15 border border-[#00c48c]/30',
    title: 'E-commerce',
    description: 'Online stores with frictionless checkout, one-click upsells, inventory sync, and abandoned cart automation built in.',
    deliverables: ['High-speed product pages', 'One-click post-purchase upsells', 'Stripe / PayPal gateways', 'Customer loyalty workflows'],
  },
  {
    id: 'apps-saas',
    funnelSlug: 'saas-growth',
    icon: <Rocket className="w-6 h-6 text-[#cca34c]" />,
    bgIcon: 'bg-[#070e24] border border-[#cca34c]/40',
    title: 'Apps & Business OS',
    description: 'Custom web and mobile digital products, client portals, and SaaS platforms built from first prototype to enterprise scale.',
    deliverables: ['Full-stack cloud architecture', 'Role-based access & auth', 'REST/GraphQL APIs', 'Scalable database backends'],
  },
];

export const ServicesSection: React.FC = () => {
  const { setActiveFunnelId, recordFunnelVisit } = useBusiness();

  const handleLaunchServiceFunnel = (funnelSlug: string) => {
    setActiveFunnelId(funnelSlug);
    recordFunnelVisit(funnelSlug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceForm = (serviceTitle: string) => {
    const formElement = document.getElementById('start');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      const selectElement = formElement.querySelector('select[name="s"]') as HTMLSelectElement | null;
      if (selectElement) {
        for (let i = 0; i < selectElement.options.length; i++) {
          if (serviceTitle.toLowerCase().includes(selectElement.options[i].text.toLowerCase().slice(0, 5))) {
            selectElement.selectedIndex = i;
            break;
          }
        }
      }
    }
  };

  return (
    <section id="features" className="py-20 bg-[var(--soft)]/50">
      <div className="max-w-[1160px] w-[92%] mx-auto text-center">
        <div className="text-[#00c48c] font-black text-xs uppercase tracking-widest mb-2">
          Everything you need
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight text-[var(--ink)] max-w-[800px] mx-auto">
          One team to build your <span className="highlight-gold">entire online sales system</span>.
        </h2>
        <p className="text-base sm:text-lg text-[var(--mu)] max-w-[640px] mx-auto mt-4 mb-12">
          Stop juggling five disconnected agencies. Back for Brand unites strategic conversion architecture, custom engineering, AI agents, and ROI marketing under one roof.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {SERVICES.map((s) => (
            <article
              key={s.id}
              className="group bg-[var(--bg)] border border-[var(--bd)] rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#00c48c]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-13 h-13 rounded-2xl ${s.bgIcon} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-sm`}
                >
                  {s.icon}
                </div>
                <h3 className="text-xl font-black text-[var(--ink)] tracking-tight mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-[var(--mu)] leading-relaxed mb-5">
                  {s.description}
                </p>
                <ul className="space-y-1.5 text-xs text-[var(--ink)]/80 mb-6">
                  {s.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00c48c]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[var(--bd)] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleLaunchServiceFunnel(s.funnelSlug)}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-[#00a876] dark:text-[#20d89f] hover:text-[#cca34c] transition-colors cursor-pointer"
                >
                  <span>Explore Service Page</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#cca34c]" />
                </button>

                <button
                  onClick={() => handleSelectServiceForm(s.title)}
                  className="text-[11px] font-bold text-[var(--mu)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                >
                  Quick Quote →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

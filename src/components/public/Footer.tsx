import React from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { LayoutDashboard, ExternalLink, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useBusiness();

  return (
    <footer className="bg-[#070e24] text-[#a9b5d6] pt-16 pb-24 md:pb-16 text-sm border-t border-[#cca34c]/20">
      <div className="max-w-[1160px] w-[92%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1a2850]">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <a href="#top" className="flex items-center gap-3 font-extrabold text-xl tracking-tight text-white mb-4 group">
              <div className="bg-white p-1 rounded-xl shadow-md border border-[#cca34c]/40 flex items-center justify-center">
                <img
                  src="/assets/aistudio/images_9652885d.png"
                  alt="Back for Brand"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight leading-none text-white">
                  Back for <span className="text-[#cca34c]">Brand</span>
                </span>
                <span className="text-[10px] text-[#00c48c] font-black tracking-widest uppercase mt-0.5">
                  Autonomous Growth Machine
                </span>
              </div>
            </a>
            <p className="max-w-[420px] text-xs sm:text-sm text-[#8f9ec2] leading-relaxed mb-6">
              Back for Brand LLC is an independent technology company registered in Florida, USA, building conversion-engineered funnels, applied AI, custom software and digital growth systems worldwide.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('machine')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0c183a] hover:bg-[#122252] text-[#00c48c] text-xs font-semibold transition-colors border border-[#cca34c]/30 shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#cca34c]" />
                <span>Launch Back for Brand OS</span>
              </button>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <b className="block text-white font-bold mb-4 text-xs uppercase tracking-wider">
              Explore
            </b>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#features" className="hover:text-[#00c48c] transition-colors">What we build</a>
              </li>
              <li>
                <a href="#how" className="hover:text-[#00c48c] transition-colors">How it works</a>
              </li>
              <li>
                <a href="#funnels" className="hover:text-[#00c48c] transition-colors">Funnels catalog</a>
              </li>
              <li>
                <a href="#plans" className="hover:text-[#00c48c] transition-colors">Pricing &amp; plans</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#00c48c] transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <b className="block text-white font-bold mb-4 text-xs uppercase tracking-wider">
              Contact &amp; Connect
            </b>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="mailto:hello@backforbrand.com"
                  className="hover:text-[#00c48c] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#cca34c]" />
                  <span>hello@backforbrand.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/ghaziwazir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00c48c] transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#cca34c]" />
                  <span>Founder Ghazi Wazir</span>
                </a>
              </li>
              <li className="pt-2 text-xs text-[#6e7ea8]">
                <span>Florida, United States</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6e7ea8]">
          <span>© 2026 Back for Brand LLC. All rights reserved.</span>
          <span className="text-[#00c48c]/90 font-medium">Conversion Architecture · Applied AI · High-Velocity Growth</span>
        </div>
      </div>
    </footer>
  );
};

export const StickyBottomBar: React.FC = () => {
  return (
    <div className="md:hidden fixed left-0 right-0 bottom-0 z-30 p-3 bg-[var(--bg)]/95 backdrop-blur-md border-t border-[var(--bd)] shadow-2xl">
      <a
        href="#start"
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#00a876] hover:from-[#00b07d] hover:to-[#00875e] text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_3px_0_#007a56]"
      >
        <span>Get my free growth plan →</span>
      </a>
    </div>
  );
};

import React from 'react';
import { LeadCaptureStepper } from './LeadCaptureStepper.tsx';

export const ContactFormSection: React.FC = () => {
  return (
    <section id="start" className="py-20 bg-gradient-to-br from-[#070e24] via-[#0c183a] to-[#070e24] text-white border-t border-[#cca34c]/20 relative overflow-hidden">
      {/* Brand Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00c48c]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#cca34c]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1160px] w-[92%] mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00c48c]/15 text-[#00c48c] border border-[#00c48c]/30 text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
          <span>Free Strategy Consultation &amp; Onboarding</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight leading-tight max-w-[760px] mx-auto mb-4 text-white">
          Ready to turn visitors into <span className="text-[#cca34c]">high-ticket customers</span>?
        </h2>
        <p className="text-base sm:text-lg text-emerald-100/80 max-w-[600px] mx-auto mb-10">
          Complete our quick 3-step onboarding questionnaire and <strong className="text-white font-bold">Back for Brand</strong> will architect an autonomous executive growth engine tailored to your revenue target.
        </p>

        {/* Visual Progress Stepper Lead Capture Engine */}
        <LeadCaptureStepper />
      </div>
    </section>
  );
};

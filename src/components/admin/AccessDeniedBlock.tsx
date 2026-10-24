import React from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  ShieldAlert,
  Lock,
  ArrowRight,
  UserCheck,
  KeyRound,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface AccessDeniedProps {
  requestedModule: string;
}

export const AccessDeniedBlock: React.FC<AccessDeniedProps> = ({ requestedModule }) => {
  const { currentUser, setMachineTab, logout, switchActiveRole } = useBusiness();

  const allowed = currentUser?.allowedModules || [];
  const firstAllowedTab = allowed.length > 0 && allowed[0] !== '*' ? allowed[0] : 'Agent Console';

  return (
    <div className="py-12 sm:py-16 px-4 flex items-center justify-center">
      <div className="max-w-[620px] w-full rounded-3xl bg-[var(--bg)] border border-[#cca34c]/40 shadow-xl p-6 sm:p-10 text-center relative overflow-hidden transition-colors">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#cca34c]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Shield Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#cca34c]/15 border border-[#cca34c]/40 text-[#cca34c] mx-auto flex items-center justify-center mb-5 shadow-lg shadow-[#cca34c]/10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Clearance Title */}
        <span className="text-[11px] font-black uppercase tracking-wider text-[#cca34c] bg-[#cca34c]/15 border border-[#cca34c]/30 px-3 py-1 rounded-full inline-block mb-3">
          Restricted Business Clearance · Area Not Allocated
        </span>

        <h2 className="text-xl sm:text-2xl font-black text-[var(--ink)] tracking-tight mb-2">
          Access Restricted: &quot;{requestedModule}&quot;
        </h2>

        <p className="text-xs sm:text-sm text-[var(--mu)] max-w-md mx-auto mb-6">
          Your active account (<strong className="text-[var(--ink)]">{currentUser?.name}</strong> &mdash; {currentUser?.title}) does not have permission allocated for this specific area of the business dashboard.
        </p>

        {/* Allocated Scope Card */}
        <div className="rounded-2xl bg-[var(--soft)] border border-[var(--bd)] p-4 text-left mb-6">
          <div className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Your Authorized Business Areas:</span>
            <span className="text-[#00c48c] font-mono font-bold">{allowed.length} allocated</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {allowed.map((mod) => (
              <button
                key={mod}
                onClick={() => setMachineTab(mod)}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg)] border border-[var(--bd)] text-xs font-bold text-[var(--ink)] hover:border-[#00c48c] hover:text-[#00c48c] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c48c]" />
                <span>{mod}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setMachineTab(firstAllowedTab)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md shadow-[#00c48c]/25 cursor-pointer"
          >
            <span>Go to My Allocated Workspace ({firstAllowedTab})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => switchActiveRole('ceo')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#cca34c] hover:bg-[#b8903c] text-[#070e24] text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>👑 Switch to CEO Master Control</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--bd)] text-[11px] text-[var(--mu)] flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5" />
          <span>Need access? The CEO (Ghazi Wazir) can allocate this area from the CEO Security &amp; Permissions tab.</span>
        </div>
      </div>
    </div>
  );
};

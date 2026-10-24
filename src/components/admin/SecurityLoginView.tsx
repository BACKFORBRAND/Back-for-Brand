import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  ShieldCheck,
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Globe,
  AlertCircle,
  CheckCircle2,
  Users,
  Building,
  UserCheck,
} from 'lucide-react';
import { UserRole } from '../../types/index.ts';

export const SecurityLoginView: React.FC = () => {
  const { login, switchActiveRole, setCurrentView, teamMembers } = useBusiness();

  const [email, setEmail] = useState('backforbrand@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('Unable to connect to authentication service. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = async (presetEmail: string, role: UserRole) => {
    setEmail(presetEmail);
    setPassword('');
    setError(null);
    setLoading(true);
    try {
      await switchActiveRole(role);
    } catch {
      setError('Failed to switch role session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b1a] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background radial ambient glows */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[15%] w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-[350px] h-[350px] bg-[#ff6a1a]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-[#070f26]/80">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-xl shadow-md border border-[#cca34c]/40 flex items-center justify-center">
            <img
              src="/assets/aistudio/images_9652885d.png"
              alt="Back for Brand"
              className="h-9 w-auto object-contain"
            />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight leading-tight flex items-center gap-1.5">
              <span>Back for</span>
              <span className="text-[#cca34c]">Brand</span>
              <span className="text-white/40 text-xs font-mono">|</span>
              <span className="text-xs text-[#00c48c] font-bold uppercase tracking-wider">
                CEO Security Gateway
              </span>
            </div>
            <p className="text-[11px] text-blue-200/70">
              Role-Based Access Control · CEO Master &amp; Staff Permitted Areas
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('public')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-blue-200 hover:text-white transition-all shadow-sm"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>Return to Public Site</span>
        </button>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[540px]">
          {/* Outer glow container */}
          <div className="relative rounded-3xl bg-[#09132e]/95 border-2 border-[#cca34c]/30 shadow-2xl shadow-blue-950/80 backdrop-blur-xl p-6 sm:p-8">
            {/* Centered Brand Logo Showcase */}
            <div className="flex flex-col items-center justify-center text-center mb-6">
              <div className="bg-white p-2.5 rounded-2xl shadow-xl border-2 border-[#cca34c]/40 mb-3 hover:scale-105 transition-transform flex items-center justify-center">
                <img
                  src="/assets/aistudio/images_9652885d.png"
                  alt="Back for Brand Official Logo"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5">
                <span>Sign In to</span>
                <span className="text-[#cca34c]">Back for Brand</span>
                <span className="text-[#00c48c]">OS</span>
              </h1>
              <p className="text-xs text-blue-200/80 mt-1 max-w-[420px]">
                Enter authorized credentials. CEO retains unrestricted master control; staff accounts are strictly routed to allocated business areas.
              </p>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#cca34c]/15 border border-[#cca34c]/40 text-[#cca34c] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-extrabold text-white tracking-tight">
                    Enterprise Zero-Trust Security
                  </h2>
                  <span className="text-[10px] text-[#00c48c] font-bold tracking-wider uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00c48c] animate-pulse" />
                    256-bit TLS · Role Isolated
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#cca34c] font-mono bg-[#cca34c]/10 border border-[#cca34c]/30 px-2 py-1 rounded-md font-bold">
                  LEVEL 5 RBAC
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
                  Authorized Work Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400/70">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@backforbrand.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1c45] border border-blue-500/30 text-white placeholder-blue-300/40 text-xs sm:text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                    Access Passcode / Key
                  </label>
                  <span className="text-[10px] text-blue-400 font-mono">
                    Encrypted via TLS
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400/70">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#070e24] border border-[#cca34c]/30 text-white placeholder-blue-300/40 text-xs sm:text-sm focus:outline-none focus:border-[#00c48c] focus:ring-2 focus:ring-[#00c48c]/25 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#cca34c]/70 hover:text-[#cca34c]"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00c48c] via-[#05df9d] to-[#cca34c] hover:from-[#00b07d] hover:to-[#b8903c] active:scale-[0.99] text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00c48c]/30 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Clearance...</span>
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-white" />
                    <span>Authenticate &amp; Open Workspace</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>

            {/* Quick-Access Role Switcher / Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-300/80 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#cca34c]" />
                  <span>1-Click Test Credentials &amp; Role Simulator:</span>
                </span>
                <span className="text-[10px] text-[#00c48c] font-mono font-bold">Demo Mode</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* CEO Card */}
                <button
                  type="button"
                  onClick={() => handleQuickPreset('backforbrand@gmail.com', 'ceo')}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#070e24] via-[#0c183a] to-[#070e24] border-2 border-[#cca34c] hover:border-[#00c48c] text-left transition-all group hover:scale-[1.01] shadow-md"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-black text-xs text-white">
                      <span className="text-[#cca34c]">👑</span>
                      <span>CEO Master</span>
                    </div>
                    <span className="text-[9px] bg-[#cca34c]/20 text-[#cca34c] font-extrabold px-1.5 py-0.5 rounded border border-[#cca34c]/40">
                      100% Control
                    </span>
                  </div>
                  <div className="text-[10px] text-blue-200/80">Ghazi Wazir (Founder)</div>
                  <div className="text-[9px] text-[#00c48c] font-mono mt-0.5 truncate font-semibold">
                    Master Access · All 10 Modules &amp; Financials
                  </div>
                </button>

                {/* Services Manager Card */}
                <button
                  type="button"
                  onClick={() => handleQuickPreset('tariq@backforbrand.com', 'services_manager')}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/60 text-left transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <span>🛠️</span>
                      <span>Services Manager</span>
                    </div>
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.5 rounded">
                      Allocated: 3
                    </span>
                  </div>
                  <div className="text-[10px] text-blue-200/80">Tariq Mansoor</div>
                  <div className="text-[9px] text-blue-300/60 font-mono mt-0.5 truncate">
                    Operations · Delivery &amp; Comms
                  </div>
                </button>

                {/* Sales & CRM Rep Card */}
                <button
                  type="button"
                  onClick={() => handleQuickPreset('sara@backforbrand.com', 'sales_rep')}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/60 text-left transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <span>🎯</span>
                      <span>Sales &amp; CRM Rep</span>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                      Allocated: 3
                    </span>
                  </div>
                  <div className="text-[10px] text-blue-200/80">Sara Ahmed</div>
                  <div className="text-[9px] text-blue-300/60 font-mono mt-0.5 truncate">
                    Pipelines · CRM &amp; WhatsApp Agent
                  </div>
                </button>

                {/* Client Viewer Card */}
                <button
                  type="button"
                  onClick={() => handleQuickPreset('client@babalkhaleej.bh', 'client_viewer')}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/60 text-left transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <span>🤝</span>
                      <span>Client Viewer</span>
                    </div>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-bold px-1.5 py-0.5 rounded">
                      Allocated: 2
                    </span>
                  </div>
                  <div className="text-[10px] text-blue-200/80">Bab Al-Khaleej</div>
                  <div className="text-[9px] text-blue-300/60 font-mono mt-0.5 truncate">
                    Client Portal · Sprints &amp; Bookings
                  </div>
                </button>
              </div>
            </div>

            {/* Zero-Trust Notice */}
            <div className="mt-5 text-center text-[10px] text-blue-300/50 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Full CEO Governance · All access events are audited with client IP &amp; timestamp</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full px-6 py-4 text-center text-[11px] text-blue-200/50 border-t border-white/5 bg-[#050b1a]/90">
        Back for Brand LLC · Florida, USA · Executive Dashboard Control Agent OS
      </footer>
    </div>
  );
};

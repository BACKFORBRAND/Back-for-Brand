import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  Trash2,
  Edit3,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  Users,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Check,
  X,
} from 'lucide-react';
import {
  UserProfile,
  UserRole,
  ALL_BUSINESS_MODULES,
  BusinessModule,
} from '../../types/index.ts';

export const CeoSecurityControlTab: React.FC = () => {
  const {
    teamMembers,
    auditLogs,
    currentUser,
    updateUserPermissions,
    addTeamMember,
    deleteTeamMember,
    toggleUserActiveStatus,
    resetUserPassword,
    emergencyLockdown,
    switchActiveRole,
  } = useBusiness();

  // State for Add Staff modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberTitle, setNewMemberTitle] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('services_manager');
  const [newMemberPasscode, setNewMemberPasscode] = useState('');
  const [newMemberModules, setNewMemberModules] = useState<string[]>([
    'Services Delivery',
    'Booking Calendar',
    'WhatsApp & Email',
  ]);

  // State for Editing Allocated Areas
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editSelectedModules, setEditSelectedModules] = useState<string[]>([]);

  // State for Password Reset
  const [resetModalUserId, setResetModalUserId] = useState<string | null>(null);
  const [newPasscodeValue, setNewPasscodeValue] = useState('');

  // State for Audit Search/Filter
  const [auditSearch, setAuditSearch] = useState('');
  const [auditRoleFilter, setAuditRoleFilter] = useState<string>('all');

  // Policy toggles
  const [hideFinancialsFromStaff, setHideFinancialsFromStaff] = useState(true);
  const [enforceZeroTrust, setEnforceZeroTrust] = useState(true);
  const [autoLockTimeout, setAutoLockTimeout] = useState('30m');

  const openAllocateModal = (user: UserProfile) => {
    setEditingUserId(user.id);
    setEditSelectedModules([...user.allowedModules]);
  };

  const handleToggleModuleInEdit = (mod: string) => {
    if (editSelectedModules.includes(mod)) {
      setEditSelectedModules(editSelectedModules.filter((m) => m !== mod));
    } else {
      setEditSelectedModules([...editSelectedModules, mod]);
    }
  };

  const handleSaveAllocations = () => {
    if (editingUserId) {
      updateUserPermissions(editingUserId, editSelectedModules);
      setEditingUserId(null);
    }
  };

  const handleApplyPresetInEdit = (preset: 'services' | 'sales' | 'client' | 'all') => {
    if (preset === 'services') {
      setEditSelectedModules(['Services Delivery', 'Booking Calendar', 'WhatsApp & Email']);
    } else if (preset === 'sales') {
      setEditSelectedModules(['CRM Pipeline', 'WhatsApp AI Agent', 'Tracking links']);
    } else if (preset === 'client') {
      setEditSelectedModules(['Services Delivery', 'Booking Calendar']);
    } else if (preset === 'all') {
      setEditSelectedModules(ALL_BUSINESS_MODULES.filter((m) => m !== 'CEO Security & Permissions'));
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail || !newMemberPasscode) return;

    await addTeamMember(
      {
        name: newMemberName,
        email: newMemberEmail,
        title: newMemberTitle || 'Business Operations Specialist',
        role: newMemberRole,
        allowedModules: newMemberRole === 'ceo' ? ['*'] : newMemberModules,
        active: true,
      },
      newMemberPasscode
    );

    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberTitle('');
    setNewMemberPasscode('');
    setShowAddModal(false);
  };

  const handleExecutePasswordReset = async () => {
    if (resetModalUserId && newPasscodeValue) {
      await resetUserPassword(resetModalUserId, newPasscodeValue);
      setResetModalUserId(null);
      setNewPasscodeValue('');
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchText =
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.ip.toLowerCase().includes(auditSearch.toLowerCase());
    const matchRole = auditRoleFilter === 'all' || log.userRole === auditRoleFilter;
    return matchText && matchRole;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* CEO Executive Clearance Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#070e24] via-[#0c183a] to-[#070e24] text-white p-6 sm:p-8 border border-[#cca34c]/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c48c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-[#cca34c]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#cca34c]/20 border border-[#cca34c]/40 text-[#cca34c] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span>👑</span>
                <span>CEO Master Control Center</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#00c48c]/15 border border-[#00c48c]/30 text-[#00c48c] text-xs font-bold">
                Clearance Level 5 · Unrestricted
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Security Governance &amp; Area Permissions
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/70 max-w-2xl">
              Complete CEO administrative command. Provision staff accounts, restrict team access strictly to their allocated business sectors, audit real-time sessions, and enforce enterprise zero-trust policies.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-[#00c48c]/30 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Provision Staff Account</span>
            </button>

            <button
              onClick={emergencyLockdown}
              className="px-4 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/60 text-red-300 text-xs font-black transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              title="Terminate non-CEO sessions immediately"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Emergency Lockdown</span>
            </button>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Authorized Accounts
            </span>
            <span className="text-xl font-black text-white">{teamMembers.length} Accounts</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Master CEO
            </span>
            <span className="text-xl font-black text-[#cca34c]">1 (Ghazi Wazir)</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Permitted Staff Accounts
            </span>
            <span className="text-xl font-black text-[#00c48c]">
              {teamMembers.filter((m) => m.role !== 'ceo').length} Members
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#cca34c] uppercase tracking-wider block">
              Security Status
            </span>
            <span className="text-xl font-black text-[#00c48c] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c] animate-pulse" />
              Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: User Accounts & Area Allocation Matrix */}
      <div className="rounded-3xl bg-[var(--bg)] border border-[var(--bd)] p-5 sm:p-7 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--bd)]">
          <div>
            <h2 className="text-lg font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-[#00c48c]" />
              <span>Team Accounts &amp; Allocated Business Areas</span>
            </h2>
            <p className="text-xs text-[var(--mu)] mt-0.5">
              Each team member is restricted strictly to their assigned business modules. The CEO has 100% control over allocations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--mu)] font-medium">Quick Test Role:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => switchActiveRole('ceo')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentUser?.role === 'ceo'
                    ? 'bg-[#cca34c] text-[#070e24] font-black shadow-sm'
                    : 'bg-[var(--soft)] text-[var(--ink)] hover:bg-[var(--bd)]'
                }`}
              >
                👑 CEO
              </button>
              <button
                onClick={() => switchActiveRole('services_manager')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentUser?.role === 'services_manager'
                    ? 'bg-[#00c48c] text-white font-black shadow-sm'
                    : 'bg-[var(--soft)] text-[var(--ink)] hover:bg-[var(--bd)]'
                }`}
              >
                🛠️ Services
              </button>
              <button
                onClick={() => switchActiveRole('sales_rep')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentUser?.role === 'sales_rep'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[var(--soft)] text-[var(--ink)] hover:bg-[var(--bd)]'
                }`}
              >
                🎯 Sales
              </button>
            </div>
          </div>
        </div>

        {/* User Account Cards / Rows */}
        <div className="space-y-4">
          {teamMembers.map((member) => {
            const isCeo = member.role === 'ceo';
            const isEditing = editingUserId === member.id;

            return (
              <div
                key={member.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                  isCeo
                    ? 'bg-[#cca34c]/10 border-[#cca34c]/40'
                    : member.active
                    ? 'bg-[var(--soft)]/50 border-[var(--bd)] hover:border-[#00c48c]/50'
                    : 'bg-red-500/5 border-red-300/40 opacity-70'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left: Avatar & Identity */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm ${
                        isCeo
                          ? 'bg-gradient-to-tr from-[#cca34c] to-[#e5b85c] text-[#070e24] font-black shadow-[#cca34c]/30'
                          : member.role === 'services_manager'
                          ? 'bg-[#00c48c] text-white'
                          : member.role === 'sales_rep'
                          ? 'bg-[#0b1b36] text-[#00c48c] border border-[#00c48c]/40'
                          : 'bg-[#070e24] text-white'
                      }`}
                    >
                      {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-sm font-black text-[var(--ink)] truncate">
                          {member.name}
                        </strong>
                        {isCeo && (
                          <span className="px-2 py-0.5 rounded-full bg-[#cca34c] text-[#070e24] font-black text-[10px] uppercase tracking-wider">
                            Master CEO
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            member.active
                              ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                              : 'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300'
                          }`}
                        >
                          {member.active ? 'Active' : 'Suspended'}
                        </span>
                      </div>

                      <div className="text-xs text-[var(--mu)] font-medium mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>{member.title}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px]">{member.email}</span>
                        <span>•</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">🔒 Password Encrypted (Hashed on Server)</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar for CEO */}
                  <div className="flex flex-wrap items-center gap-2">
                    {!isCeo && (
                      <>
                        <button
                          onClick={() => openAllocateModal(member)}
                          className="px-3 py-1.5 rounded-xl bg-[#00c48c]/15 border border-[#00c48c]/40 text-[#00c48c] hover:bg-[#00c48c]/25 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Allocate Areas</span>
                        </button>

                        <button
                          onClick={() => {
                            setResetModalUserId(member.id);
                            setNewPasscodeValue('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[var(--bg)] border border-[var(--bd)] text-[var(--ink)] hover:bg-[var(--bd)] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Reset user password"
                        >
                          <Key className="w-3.5 h-3.5 text-[#cca34c]" />
                          <span>Reset Key</span>
                        </button>

                        <button
                          onClick={() => toggleUserActiveStatus(member.id)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            member.active
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-700 hover:bg-amber-100'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {member.active ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>Suspend</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Activate</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete staff account for ${member.name}?`)) {
                              deleteTeamMember(member.id);
                            }
                          }}
                          className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                          title="Delete account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {isCeo && (
                      <span className="text-xs font-black text-[#cca34c] bg-[#cca34c]/15 px-3 py-1.5 rounded-xl border border-[#cca34c]/30">
                        Full Master Access (All Modules + Financials)
                      </span>
                    )}
                  </div>
                </div>

                {/* Display Allocated Modules Pills */}
                <div className="mt-3.5 pt-3.5 border-t border-[var(--bd)] flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-[var(--mu)] uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#00c48c]" />
                    <span>Allocated Business Areas:</span>
                  </span>

                  {isCeo ? (
                    <span className="text-xs font-bold text-[#00c48c] bg-[#00c48c]/10 border border-[#00c48c]/30 px-2.5 py-0.5 rounded-lg">
                      All 10 Business Modules + CEO Security Governance
                    </span>
                  ) : (
                    member.allowedModules.map((mod) => (
                      <span
                        key={mod}
                        className="text-xs font-bold text-[var(--ink)] bg-[var(--bg)] border border-[var(--bd)] px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00c48c]" />
                        <span>{mod}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* In-Place Area Allocation Modal */}
      {editingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-[var(--bg)] border border-[var(--bd)] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--bd)]">
              <div>
                <h3 className="text-lg font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#00c48c]" />
                  <span>Allocate Business Areas</span>
                </h3>
                <p className="text-xs text-[var(--mu)]">
                  Select which sections this team account is permitted to access.
                </p>
              </div>
              <button
                onClick={() => setEditingUserId(null)}
                className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-[var(--mu)] tracking-wider block">
                Quick Role Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPresetInEdit('services')}
                  className="px-2.5 py-1 rounded-lg bg-[var(--soft)] border border-[var(--bd)] text-xs font-bold hover:border-[#00c48c] hover:text-[#00c48c] cursor-pointer"
                >
                  🛠️ Services Lead Preset
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetInEdit('sales')}
                  className="px-2.5 py-1 rounded-lg bg-[var(--soft)] border border-[var(--bd)] text-xs font-bold hover:border-[#00c48c] hover:text-[#00c48c] cursor-pointer"
                >
                  🎯 Sales &amp; CRM Preset
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetInEdit('client')}
                  className="px-2.5 py-1 rounded-lg bg-[var(--soft)] border border-[var(--bd)] text-xs font-bold hover:border-[#cca34c] hover:text-[#cca34c] cursor-pointer"
                >
                  🤝 Client Guest Preset
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetInEdit('all')}
                  className="px-2.5 py-1 rounded-lg bg-[var(--soft)] border border-[var(--bd)] text-xs font-bold hover:border-[#cca34c] hover:text-[#cca34c] cursor-pointer"
                >
                  ⚡ Grant All Operations
                </button>
              </div>
            </div>

            {/* Modules Checkbox Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {ALL_BUSINESS_MODULES.filter((m) => m !== 'CEO Security & Permissions').map((mod) => {
                const isSelected = editSelectedModules.includes(mod);
                return (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => handleToggleModuleInEdit(mod)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#00c48c]/15 border-[#00c48c] text-[#00c48c] dark:text-[#00c48c]'
                        : 'bg-[var(--soft)]/60 border-[var(--bd)] text-[var(--ink)] hover:border-[#00c48c]/40'
                    }`}
                  >
                    <span className="truncate">{mod}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-[#00c48c] text-white' : 'border border-[var(--bd)]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--bd)]">
              <span className="text-xs font-bold text-[var(--mu)]">
                {editSelectedModules.length} areas allocated
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingUserId(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--bd)] text-xs font-bold hover:bg-[var(--soft)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAllocations}
                  className="px-5 py-2 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white text-xs font-black shadow-md shadow-[#00c48c]/30 cursor-pointer"
                >
                  Save Allocated Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {resetModalUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[var(--bg)] border border-[var(--bd)] shadow-2xl p-6 sm:p-7 space-y-4">
            <h3 className="text-base font-black text-[var(--ink)] flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <span>Reset Password for Staff Account</span>
            </h3>
            <p className="text-xs text-[var(--mu)]">
              Enter a new secure access password. It will be salted and cryptographically hashed on the server.
            </p>
            <input
              type="password"
              value={newPasscodeValue}
              onChange={(e) => setNewPasscodeValue(e.target.value)}
              placeholder="Enter new secure password (min 6 chars)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-mono text-sm focus:outline-none focus:border-[#00c48c]"
            />
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setResetModalUserId(null)}
                className="px-4 py-2 rounded-xl border border-[var(--bd)] text-xs font-bold hover:bg-[var(--soft)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecutePasswordReset}
                className="px-4 py-2 rounded-xl bg-[#cca34c] hover:bg-[#b8903c] text-[#070e24] text-xs font-black cursor-pointer shadow-sm"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[var(--bg)] border border-[var(--bd)] shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
              <div>
                <h3 className="text-lg font-black text-[var(--ink)] flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#00c48c]" />
                  <span>Provision New Staff Account</span>
                </h3>
                <p className="text-xs text-[var(--mu)]">
                  Create an authorized login with tailored area permissions.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-[var(--soft)] text-[var(--mu)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g. Zaid Khan"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-xs text-[var(--ink)] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="zaid@backforbrand.com"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-xs text-[var(--ink)] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    Operational Title
                  </label>
                  <input
                    type="text"
                    value={newMemberTitle}
                    onChange={(e) => setNewMemberTitle(e.target.value)}
                    placeholder="e.g. Client Delivery Specialist"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-xs text-[var(--ink)] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    Role Category
                  </label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-xs text-[var(--ink)] font-medium"
                  >
                    <option value="services_manager">Services &amp; Ops Manager</option>
                    <option value="sales_rep">Sales &amp; CRM Representative</option>
                    <option value="client_viewer">Client Representative / Guest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                  Access Passcode
                </label>
                <input
                  type="text"
                  required
                  value={newMemberPasscode}
                  onChange={(e) => setNewMemberPasscode(e.target.value)}
                  placeholder="e.g. staff2026"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-xs text-[var(--ink)] font-mono"
                />
              </div>

              {/* Initial Allocated Areas */}
              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">
                  Initial Allocated Areas ({newMemberModules.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto p-2 rounded-xl bg-[var(--soft)] border border-[var(--bd)]">
                  {ALL_BUSINESS_MODULES.filter((m) => m !== 'CEO Security & Permissions').map((mod) => (
                    <label key={mod} className="flex items-center gap-2 text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMemberModules.includes(mod)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewMemberModules([...newMemberModules, mod]);
                          } else {
                            setNewMemberModules(newMemberModules.filter((m) => m !== mod));
                          }
                        }}
                        className="rounded text-[#00c48c] focus:ring-[#00c48c]"
                      />
                      <span className="truncate">{mod}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--bd)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--bd)] text-xs font-bold hover:bg-[var(--soft)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white text-xs font-black shadow-md shadow-[#00c48c]/30 cursor-pointer"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CEO Master Security Policies Card */}
      <div className="rounded-3xl bg-[var(--bg)] border border-[var(--bd)] p-5 sm:p-7 shadow-sm transition-colors">
        <h2 className="text-lg font-black text-[var(--ink)] tracking-tight flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-500" />
          <span>CEO Master Security Policies &amp; Governance</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Policy 1: Financial Masking */}
          <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[var(--ink)]">Financial Concealment</span>
              <button
                onClick={() => setHideFinancialsFromStaff(!hideFinancialsFromStaff)}
                className={`w-10 h-6 rounded-full p-1 transition-colors ${
                  hideFinancialsFromStaff ? 'bg-emerald-500' : 'bg-gray-400'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    hideFinancialsFromStaff ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-[var(--mu)]">
              Automatically hides deal dollar revenues, margins, and ROAS from staff roles. Only the CEO can view financial telemetry.
            </p>
          </div>

          {/* Policy 2: Zero-Trust RBAC */}
          <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[var(--ink)]">Zero-Trust Enforcement</span>
              <button
                onClick={() => setEnforceZeroTrust(!enforceZeroTrust)}
                className={`w-10 h-6 rounded-full p-1 transition-colors ${
                  enforceZeroTrust ? 'bg-emerald-500' : 'bg-gray-400'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    enforceZeroTrust ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-[var(--mu)]">
              Blocks direct URL parameter bypass into non-allocated tabs and renders the Access Denied block.
            </p>
          </div>

          {/* Policy 3: Auto-Lock Timeout */}
          <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[var(--ink)]">Idle Session Timeout</span>
              <select
                value={autoLockTimeout}
                onChange={(e) => setAutoLockTimeout(e.target.value)}
                className="px-2 py-1 rounded-lg bg-[var(--bg)] border border-[var(--bd)] text-xs font-bold text-[var(--ink)]"
              >
                <option value="15m">15 Minutes</option>
                <option value="30m">30 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="never">Never (Testing)</option>
              </select>
            </div>
            <p className="text-[11px] text-[var(--mu)]">
              Enforces automatic return to the Security Login Gateway when an operator is inactive.
            </p>
          </div>
        </div>
      </div>

      {/* Real-Time Security Audit Log */}
      <div className="rounded-3xl bg-[var(--bg)] border border-[var(--bd)] p-5 sm:p-7 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[var(--bd)]">
          <div>
            <h2 className="text-lg font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <span>Real-Time Security &amp; Access Audit Trail</span>
            </h2>
            <p className="text-xs text-[var(--mu)] mt-0.5">
              Immutable event log tracking all logins, permission updates, and operational commands.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--mu)]" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-xs text-[var(--ink)]"
              />
            </div>

            <select
              value={auditRoleFilter}
              onChange={(e) => setAuditRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-xs text-[var(--ink)] font-bold"
            >
              <option value="all">All Roles</option>
              <option value="ceo">CEO</option>
              <option value="services_manager">Services</option>
              <option value="sales_rep">Sales</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table / Stream */}
        <div className="divide-y divide-[var(--bd)] max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--mu)]">
              No matching audit events recorded.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isAlert = log.status === 'alert' || log.action.includes('Failed') || log.action.includes('Blocked') || log.action.includes('LOCKDOWN');
              const isSuccess = log.status === 'success' || log.action.includes('success');

              return (
                <div key={log.id} className="py-3 flex items-start gap-3 text-xs">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isAlert
                        ? 'bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400'
                        : isSuccess
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                        : 'bg-[#cca34c]/15 text-[#cca34c]'
                    }`}
                  >
                    {isAlert ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : isSuccess ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Shield className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="font-bold text-[var(--ink)]">{log.userName}</strong>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--mu)] bg-[var(--soft)] px-1.5 py-0.2 rounded">
                        {log.userRole}
                      </span>
                      <span className="text-[10px] text-[var(--mu)] font-mono">{log.timestamp}</span>
                      <span className="text-[10px] text-[var(--mu)] font-mono">({log.ip})</span>
                    </div>
                    <p className="text-[11px] text-[var(--mu)] mt-0.5 leading-relaxed">
                      {log.action}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  GccBankAccount,
  PakistaniBankAccount,
  InternationalWireAccount,
  PaymentProofSubmission,
} from '../../types/index.ts';
import {
  CreditCard,
  Building2,
  Globe,
  DollarSign,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Send,
  Zap,
  ArrowRight,
  Sparkles,
  FileText,
  AlertCircle,
  HelpCircle,
  Lock,
  Search,
  MessageSquare,
  RefreshCw,
  Coins,
  Receipt,
  User,
  CheckCheck,
  XCircle,
} from 'lucide-react';

export const BankingPaymentsTab: React.FC = () => {
  const {
    paymentSettings,
    updatePaymentSettings,
    paymentProofs,
    verifyPaymentProof,
    deletePaymentProof,
    addPaymentProof,
    leads,
    currentUser,
    setMachineTab,
  } = useBusiness();

  // Active Rail Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'stripe' | 'paypal' | 'gcc' | 'pakistan' | 'wire' | 'crypto' | 'queue'
  >('overview');

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // ignore
    }
  };

  // Currency Converter State
  const [convertAmountUsd, setConvertAmountUsd] = useState<number>(1500);

  // Conversion rates (Fixed standard peg/interbank approximations)
  const convertedValues = useMemo(() => {
    const usd = Number(convertAmountUsd) || 0;
    return {
      sar: (usd * 3.75).toLocaleString(undefined, { maximumFractionDigits: 0 }),
      aed: (usd * 3.67).toLocaleString(undefined, { maximumFractionDigits: 0 }),
      bhd: (usd * 0.377).toLocaleString(undefined, { maximumFractionDigits: 2 }),
      qar: (usd * 3.64).toLocaleString(undefined, { maximumFractionDigits: 0 }),
      pkr: (usd * 278.5).toLocaleString(undefined, { maximumFractionDigits: 0 }),
      eur: (usd * 0.92).toLocaleString(undefined, { maximumFractionDigits: 2 }),
      gbp: (usd * 0.79).toLocaleString(undefined, { maximumFractionDigits: 2 }),
    };
  }, [convertAmountUsd]);

  // Client Payment Link Generator State
  const [genClientName, setGenClientName] = useState<string>('Ali Traders');
  const [genAmount, setGenAmount] = useState<number>(1200);
  const [genCurrency, setGenCurrency] = useState<'USD' | 'SAR' | 'AED' | 'BHD' | 'PKR'>('USD');
  const [genMethod, setGenMethod] = useState<string>('pakistani_bank');
  const [genNotes, setGenNotes] = useState<string>('50% kickoff retainer for High-Converting Funnel & Meta Ads');

  // Manual Receipt Form State
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [manualClient, setManualClient] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualAmount, setManualAmount] = useState<number>(1500);
  const [manualCurrency, setManualCurrency] = useState('USD');
  const [manualMethod, setManualMethod] = useState<'stripe' | 'paypal' | 'gcc_bank' | 'pakistani_bank' | 'wise_payoneer' | 'crypto'>('gcc_bank');
  const [manualMethodLabel, setManualMethodLabel] = useState('Emirates NBD UAE IBAN');
  const [manualRef, setManualRef] = useState('BANK-WIRE-' + Math.floor(100000 + Math.random() * 900000));
  const [manualNote, setManualNote] = useState('');

  const handleCreateManualProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualClient.trim()) return;

    addPaymentProof({
      clientName: manualClient.trim(),
      clientEmail: manualEmail.trim() || 'client@company.com',
      amount: Number(manualAmount) || 0,
      currency: manualCurrency,
      paymentMethod: manualMethod,
      paymentMethodLabel: manualMethodLabel,
      transactionReference: manualRef.trim() || 'MANUAL-REF-' + Date.now(),
      receiptNote: manualNote.trim(),
    });

    setShowManualModal(false);
    setManualClient('');
    setManualNote('');
    setActiveTab('queue');
  };

  // Generate customized WhatsApp invoice message
  const generatedPaymentMessage = useMemo(() => {
    let details = '';
    if (genMethod === 'pakistani_bank') {
      const p = paymentSettings.pakistaniBanks[0];
      details = `Bank: ${p?.bankName || 'Meezan Bank Ltd'}\nAccount Title: ${p?.accountTitle || 'Back for Brand / Ghazi Wazir'}\nRaast ID: ${p?.raastId || '923001234567'} (Instant Raast - 0 Fee)\nIBAN: ${p?.iban || 'PK82MEZN0001020304050607'}`;
    } else if (genMethod === 'gcc_bank') {
      const g = paymentSettings.gccBanks[0];
      details = `Bank: ${g?.bankName || 'Emirates NBD'}\nCountry: ${g?.country || 'UAE'}\nAccount Title: ${g?.accountTitle || 'Back for Brand LLC'}\nIBAN: ${g?.iban || 'AE070260001020304050607'}\nSWIFT: ${g?.swiftBic || 'EBILAEADXXX'}`;
    } else if (genMethod === 'stripe') {
      details = `Direct Secure Card / Apple Pay Link: ${paymentSettings.stripe.retainerPaymentUrl}`;
    } else if (genMethod === 'paypal') {
      details = `PayPal Email: ${paymentSettings.paypal.merchantEmail}\nPayPal Checkout Link: https://paypal.me/backforbrand/${genAmount}`;
    } else if (genMethod === 'wise') {
      const w = paymentSettings.internationalWire[0];
      details = `Wise USD Account: ${w?.accountNumber}\nRouting (ABA): ${w?.routingNumberAba}\nBank: ${w?.bankName}\nTitle: ${w?.accountTitle}`;
    } else {
      details = `USDT (TRC-20): ${paymentSettings.crypto.usdtTrc20Address}\nNetwork: Tron (TRC20)`;
    }

    return `Salam / Hello ${genClientName},\n\nHere is your official payment dispatch for "${genNotes}".\n\nTotal Due: ${genCurrency} ${genAmount.toLocaleString()}\n\nPayment Details:\n${details}\n\nPlease reply with your transaction reference or receipt screenshot once sent so our team can immediately provision your project sprint.\n\nWarm regards,\nGhazi Wazir\nFounder & CEO, Back for Brand LLC (Florida, USA)`;
  }, [genClientName, genAmount, genCurrency, genMethod, genNotes, paymentSettings]);

  // Telemetry Counts
  const pendingCount = paymentProofs.filter((p) => p.status === 'pending_verification').length;
  const verifiedCount = paymentProofs.filter((p) => p.status === 'verified').length;
  const verifiedTotalUsd = paymentProofs
    .filter((p) => p.status === 'verified')
    .reduce((s, p) => s + (p.currency === 'USD' ? p.amount : p.amount / 3.75), 0);

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-16">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#070e24] via-[#0c183a] to-[#070e24] text-white p-6 sm:p-8 border border-[#cca34c]/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c48c]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#cca34c]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#00c48c]/15 border border-[#00c48c]/35 text-[#00c48c] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <CreditCard className="w-3.5 h-3.5 text-[#00c48c]" />
                <span>Multi-Rail International Banking &amp; Payments</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#cca34c]/20 border border-[#cca34c]/40 text-[#cca34c] text-xs font-bold">
                Global Settlement Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              International Bank Accounts &amp; Client Payment Rails
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/75 max-w-2xl leading-relaxed">
              Collect payments from clients across the United States, GCC (Saudi Arabia, UAE, Bahrain, Qatar, Kuwait), Pakistan (Raast &amp; IBFT), and Europe via Stripe, PayPal, local bank transfers, and Wise.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowManualModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#cca34c] to-[#b8903c] hover:from-[#e5b85c] hover:to-[#cca34c] text-[#070e24] text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-[#cca34c]/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Manual Payment / Slip</span>
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative"
            >
              <Receipt className="w-4 h-4 text-[#00c48c]" />
              <span>Verification Queue</span>
              {pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Settlement Telemetry Ribbon */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c] animate-pulse flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-gray-300 uppercase block">Verified Collections</span>
              <span className="text-xs sm:text-sm font-black text-[#00c48c] font-mono">
                ${Math.round(verifiedTotalUsd).toLocaleString()} USD ({verifiedCount} Cleared)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cca34c] flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-gray-300 uppercase block">Verification Queue</span>
              <span className="text-xs sm:text-sm font-black text-white font-mono">
                {pendingCount} Pending Review
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c] flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-gray-300 uppercase block">GCC Banking Rails</span>
              <span className="text-xs sm:text-sm font-black text-white font-mono">
                UAE, KSA, BHD, QAT (Active)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c] flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-gray-300 uppercase block">Pakistani Rails</span>
              <span className="text-xs sm:text-sm font-black text-white font-mono">
                Raast (0-Fee) + Meezan / Alfalah
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Tabs */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-2 sm:p-3 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: '1. Settlement Matrix & Converter', icon: DollarSign },
          { id: 'gcc', label: '2. GCC Banks (UAE, KSA, Bahrain)', icon: Building2 },
          { id: 'pakistan', label: '3. Pakistani Banks & Raast (0-Fee)', icon: Zap },
          { id: 'stripe', label: '4. Stripe & Apple Pay / Cards', icon: CreditCard },
          { id: 'paypal', label: '5. PayPal International', icon: Globe },
          { id: 'wire', label: '6. Wise, Payoneer & US Wire', icon: FileText },
          { id: 'crypto', label: '7. USDT Stablecoin (Borderless)', icon: Coins },
          {
            id: 'queue',
            label: `8. Verification Queue (${pendingCount})`,
            icon: Receipt,
            badge: pendingCount,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#00c48c] to-[#009b6e] text-white shadow-sm font-black'
                  : 'text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--soft)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & REAL-TIME MULTI-CURRENCY CONVERTER */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Multi-Currency Calculator */}
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--bd)]">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#00c48c]" />
                  <span>Real-Time Multi-Currency Settlement Matrix</span>
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Calculate exact client quote values across US Dollar, Saudi Riyal, UAE Dirham, Bahraini Dinar, and Pakistani Rupee.
                </p>
              </div>

              {/* Amount Input */}
              <div className="flex items-center gap-2 bg-[var(--soft)] p-1.5 rounded-2xl border border-[var(--bd)]">
                <span className="text-xs font-bold text-[var(--mu)] pl-2">Quote USD:</span>
                <input
                  type="number"
                  value={convertAmountUsd}
                  onChange={(e) => setConvertAmountUsd(Number(e.target.value))}
                  className="w-28 text-sm font-black px-3 py-1.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-mono"
                  step="100"
                />
              </div>
            </div>

            {/* Currency Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#cca34c]">SAR (Saudi Arabia)</span>
                  <span className="text-[10px] font-bold text-[var(--mu)]">Mada / Sarie</span>
                </div>
                <div className="text-lg font-black text-[var(--ink)] font-mono">
                  {convertedValues.sar} SAR
                </div>
                <span className="text-[10px] text-[var(--mu)] block">Peg: 3.75 SAR = 1 USD</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#00c48c]">AED (UAE)</span>
                  <span className="text-[10px] font-bold text-[var(--mu)]">CBUAE Direct</span>
                </div>
                <div className="text-lg font-black text-[var(--ink)] font-mono">
                  {convertedValues.aed} AED
                </div>
                <span className="text-[10px] text-[var(--mu)] block">Peg: 3.67 AED = 1 USD</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-blue-500">BHD (Bahrain)</span>
                  <span className="text-[10px] font-bold text-[var(--mu)]">BenefitPay</span>
                </div>
                <div className="text-lg font-black text-[var(--ink)] font-mono">
                  {convertedValues.bhd} BHD
                </div>
                <span className="text-[10px] text-[var(--mu)] block">Peg: 0.377 BHD = 1 USD</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-600">PKR (Pakistan)</span>
                  <span className="text-[10px] font-bold text-[var(--mu)]">Raast / 1Link</span>
                </div>
                <div className="text-lg font-black text-[var(--ink)] font-mono truncate">
                  Rs {convertedValues.pkr}
                </div>
                <span className="text-[10px] text-[var(--mu)] block">SBP Interbank @ 278.5</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-purple-500">EUR (Europe)</span>
                  <span className="text-[10px] font-bold text-[var(--mu)]">SEPA Instant</span>
                </div>
                <div className="text-lg font-black text-[var(--ink)] font-mono">
                  €{convertedValues.eur}
                </div>
                <span className="text-[10px] text-[var(--mu)] block">Wise / Stripe EU</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-indigo-500">GBP (UK)</span>
                  <span className="text-[10px] font-bold text-[var(--mu)]">FPS Transfer</span>
                </div>
                <div className="text-lg font-black text-[var(--ink)] font-mono">
                  £{convertedValues.gbp}
                </div>
                <span className="text-[10px] text-[var(--mu)] block">UK Faster Payments</span>
              </div>
            </div>
          </div>

          {/* Client Invoice & Payment Link Synthesizer */}
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--bd)]">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#cca34c]" />
                  <span>Instant Client Payment Dispatch Generator</span>
                </h3>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Generate a pre-formatted WhatsApp / Email invoice with your verified bank details and IBAN.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">Client / Lead Name</label>
                <input
                  type="text"
                  value={genClientName}
                  onChange={(e) => setGenClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                  placeholder="e.g. Bab Al-Khaleej"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">Deal Amount</label>
                <input
                  type="number"
                  value={genAmount}
                  onChange={(e) => setGenAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold font-mono"
                  step="50"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">Invoice Currency</label>
                <select
                  value={genCurrency}
                  onChange={(e) => setGenCurrency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                >
                  <option value="USD">USD ($)</option>
                  <option value="AED">AED (UAE Dirham)</option>
                  <option value="SAR">SAR (Saudi Riyal)</option>
                  <option value="BHD">BHD (Bahraini Dinar)</option>
                  <option value="PKR">PKR (Pakistani Rupee)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">Preferred Settlement Rail</label>
                <select
                  value={genMethod}
                  onChange={(e) => setGenMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                >
                  <option value="pakistani_bank">🇵🇰 Pakistani Banks &amp; Raast (0-Fee)</option>
                  <option value="gcc_bank">🇦🇪 🇸🇦 GCC Bank IBAN (Emirates NBD / Al Rajhi)</option>
                  <option value="stripe">💳 Stripe Credit Card / Apple Pay</option>
                  <option value="paypal">🌐 PayPal International</option>
                  <option value="wise">🏦 Wise US / EU Wire Transfer</option>
                  <option value="crypto">🪙 USDT Stablecoin (TRC-20)</option>
                </select>
              </div>
            </div>

            {/* Generated Output Preview */}
            <div className="relative">
              <div className="flex items-center justify-between pb-1.5 text-xs">
                <span className="font-bold text-[var(--mu)]">Generated Client Dispatch Message:</span>
                <span className="text-[11px] text-[#00c48c] font-bold">Ready to Send on WhatsApp / Email</span>
              </div>
              <pre className="p-4 rounded-2xl bg-[#070e24] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-[#cca34c]/30 leading-relaxed">
                {generatedPaymentMessage}
              </pre>
              <div className="absolute top-8 right-3 flex items-center gap-2">
                <button
                  onClick={() => handleCopy(generatedPaymentMessage, 'gen_msg')}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
                >
                  {copiedKey === 'gen_msg' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'gen_msg' ? 'Copied' : 'Copy Message'}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(generatedPaymentMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#00c48c] hover:bg-[#00a876] text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GCC BANKS (UAE, SAUDI ARABIA, BAHRAIN, QATAR) */}
      {activeTab === 'gcc' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#cca34c] block mb-1">
                  Gulf Cooperation Council (GCC) Banking
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#cca34c]" />
                  <span>GCC Direct IBAN &amp; National Debit Rails</span>
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Accept local currency bank transfers in UAE (AED), Saudi Arabia (SAR / Mada), Bahrain (BHD / BenefitPay), and Qatar (QAR).
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#cca34c]/15 text-[#cca34c] border border-[#cca34c]/30 text-xs font-bold">
                {paymentSettings.gccBanks.filter((b) => b.active).length} Active Accounts
              </span>
            </div>

            {/* GCC Bank Accounts Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentSettings.gccBanks.map((bank) => (
                <div
                  key={bank.id}
                  className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3 relative hover:border-[#cca34c]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg)] text-[#cca34c] border border-[#cca34c]/30">
                        {bank.country} · {bank.currency}
                      </span>
                      <h4 className="text-sm font-black text-[var(--ink)] mt-1.5">{bank.bankName}</h4>
                      <span className="text-xs text-[var(--mu)] font-semibold">{bank.accountTitle}</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c]" title="Active Account" />
                  </div>

                  {/* IBAN & SWIFT Box */}
                  <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--bd)] space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[var(--mu)] font-sans">IBAN:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[var(--ink)] select-all">{bank.iban}</span>
                        <button
                          onClick={() => handleCopy(bank.iban, bank.id + '_iban')}
                          className="p-1 hover:text-[#00c48c] text-[var(--mu)] cursor-pointer"
                          title="Copy IBAN"
                        >
                          {copiedKey === bank.id + '_iban' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[var(--mu)] font-sans">SWIFT / BIC:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[var(--ink)] select-all">{bank.swiftBic}</span>
                        <button
                          onClick={() => handleCopy(bank.swiftBic, bank.id + '_swift')}
                          className="p-1 hover:text-[#00c48c] text-[var(--mu)] cursor-pointer"
                          title="Copy SWIFT"
                        >
                          {copiedKey === bank.id + '_swift' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Supported Networks */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-[var(--mu)] font-bold">Networks:</span>
                    {bank.supportedNetworks.map((net) => (
                      <span
                        key={net}
                        className="px-2 py-0.5 rounded-md bg-[#00c48c]/10 text-[#00a876] dark:text-[#20d89f] text-[10px] font-bold border border-[#00c48c]/25"
                      >
                        {net}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-[var(--mu)] leading-relaxed italic border-t border-[var(--bd)] pt-2">
                    {bank.instructions}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAKISTANI BANKS & RAAST (0-FEE INSTANT SETTLEMENT) */}
      {activeTab === 'pakistan' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--bd)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇵🇰</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">
                    State Bank of Pakistan (SBP) Rails
                  </span>
                </div>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight">
                  Pakistani Banks, Raast (Zero Fee) &amp; Digital Wallets
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Accept instant domestic and inward freelance export payments via 1Link, Raast ID, and Islamic banking.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-xs font-bold">
                Instant 24/7 Raast Enabled
              </span>
            </div>

            {/* Pakistani Bank Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentSettings.pakistaniBanks.map((bank) => (
                <div
                  key={bank.id}
                  className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3 relative hover:border-[#00c48c]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg)] text-emerald-600 border border-emerald-500/30">
                        {bank.serviceType}
                      </span>
                      <h4 className="text-sm font-black text-[var(--ink)] mt-1.5">{bank.bankName}</h4>
                      <span className="text-xs text-[var(--mu)] font-semibold">{bank.accountTitle}</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c]" title="Active Account" />
                  </div>

                  {/* Account Details */}
                  <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--bd)] space-y-1.5 text-xs font-mono">
                    {bank.raastId && (
                      <div className="flex items-center justify-between bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                        <span className="text-[10px] font-black text-emerald-600 font-sans uppercase">
                          ⚡ Raast ID (Zero Fee):
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-emerald-600 select-all">{bank.raastId}</span>
                          <button
                            onClick={() => handleCopy(bank.raastId!, bank.id + '_raast')}
                            className="p-0.5 text-emerald-600 cursor-pointer"
                            title="Copy Raast ID"
                          >
                            {copiedKey === bank.id + '_raast' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[var(--mu)] font-sans">IBAN:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[var(--ink)] select-all truncate max-w-[180px]">{bank.iban}</span>
                        <button
                          onClick={() => handleCopy(bank.iban, bank.id + '_iban')}
                          className="p-1 hover:text-[#00c48c] text-[var(--mu)] cursor-pointer"
                        >
                          {copiedKey === bank.id + '_iban' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[var(--mu)] font-sans">Account No:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[var(--ink)] select-all">{bank.accountNumber}</span>
                        <button
                          onClick={() => handleCopy(bank.accountNumber, bank.id + '_acc')}
                          className="p-1 hover:text-[#00c48c] text-[var(--mu)] cursor-pointer"
                        >
                          {copiedKey === bank.id + '_acc' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--mu)] leading-relaxed italic border-t border-[var(--bd)] pt-2">
                    {bank.instructions}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STRIPE & CREDIT CARDS */}
      {activeTab === 'stripe' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 block mb-1">
                  Direct Credit/Debit Card &amp; Digital Wallets
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-500" />
                  <span>Stripe Card Processing &amp; Apple Pay</span>
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Accept Visa, Mastercard, American Express, Apple Pay, and Google Pay from clients in 135+ countries.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-600 border border-indigo-500/30 text-xs font-bold">
                {paymentSettings.stripe.enabled ? 'Stripe Connected' : 'Disabled'}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                <label className="block font-bold text-[var(--ink)]">Stripe Publishable Key</label>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <input
                    type="text"
                    value={paymentSettings.stripe.publishableKey}
                    onChange={(e) =>
                      updatePaymentSettings({
                        stripe: { ...paymentSettings.stripe, publishableKey: e.target.value },
                      })
                    }
                    className="flex-1 px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
                  />
                  <button
                    onClick={() => handleCopy(paymentSettings.stripe.publishableKey, 'stripe_pk')}
                    className="p-2 border border-[var(--bd)] rounded-xl bg-[var(--bg)] cursor-pointer"
                  >
                    {copiedKey === 'stripe_pk' ? <Check className="w-4 h-4 text-[#00c48c]" /> : <Copy className="w-4 h-4 text-[var(--mu)]" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                  <label className="block font-bold text-[var(--ink)]">Retainer Checkout URL ($500 Deposit)</label>
                  <input
                    type="text"
                    value={paymentSettings.stripe.retainerPaymentUrl}
                    onChange={(e) =>
                      updatePaymentSettings({
                        stripe: { ...paymentSettings.stripe, retainerPaymentUrl: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-mono"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                  <label className="block font-bold text-[var(--ink)]">Growth Plan Checkout URL ($1,500 Full)</label>
                  <input
                    type="text"
                    value={paymentSettings.stripe.growthPlanPaymentUrl}
                    onChange={(e) =>
                      updatePaymentSettings({
                        stripe: { ...paymentSettings.stripe, growthPlanPaymentUrl: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PAYPAL INTERNATIONAL */}
      {activeTab === 'paypal' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-500 block mb-1">
                  Global Wallet &amp; Buyer Protection
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span>PayPal Merchant Integration</span>
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Receive international client balances via PayPal wallet, Venmo, and international debit cards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                <label className="block font-bold text-[var(--ink)]">PayPal Merchant Email</label>
                <input
                  type="email"
                  value={paymentSettings.paypal.merchantEmail}
                  onChange={(e) =>
                    updatePaymentSettings({
                      paypal: { ...paymentSettings.paypal, merchantEmail: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                <label className="block font-bold text-[var(--ink)]">PayPal Client ID</label>
                <input
                  type="text"
                  value={paymentSettings.paypal.clientId}
                  onChange={(e) =>
                    updatePaymentSettings({
                      paypal: { ...paymentSettings.paypal, clientId: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: WISE, PAYONEER & US WIRE */}
      {activeTab === 'wire' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 block mb-1">
                  US ACH, FedWire &amp; SEPA Multi-Currency
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight">
                  Wise, Payoneer &amp; Federal US Bank Accounts
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Direct routing numbers and receiving accounts for US and European corporate clients with zero wire fees.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {paymentSettings.internationalWire.map((wire) => (
                <div
                  key={wire.id}
                  className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-3 relative hover:border-[#00c48c]/40 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg)] text-[#00c48c] border border-[#00c48c]/30">
                      {wire.provider}
                    </span>
                    <h4 className="text-sm font-black text-[var(--ink)] mt-2">{wire.bankName}</h4>
                    <span className="text-[11px] text-[var(--mu)] block mt-0.5 font-bold">{wire.accountTitle}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--bd)] space-y-1.5 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[var(--mu)] font-sans">Account:</span>
                      <span className="font-bold text-[var(--ink)] select-all">{wire.accountNumber}</span>
                    </div>
                    {wire.routingNumberAba && (
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-[var(--mu)] font-sans">Routing (ABA):</span>
                        <span className="font-bold text-[var(--ink)] select-all">{wire.routingNumberAba}</span>
                      </div>
                    )}
                    {wire.swiftBic && (
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-[var(--mu)] font-sans">SWIFT:</span>
                        <span className="font-bold text-[var(--ink)] select-all">{wire.swiftBic}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-[var(--mu)] italic">{wire.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: USDT CRYPTO RAILS */}
      {activeTab === 'crypto' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--bd)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                  Instant Borderless Settlement
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  <span>USDT Stablecoin (TRC-20 &amp; ERC-20)</span>
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Zero bank holds, instantaneous international settlement for clients in regions with banking restrictions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                <span className="font-sans font-bold text-emerald-500 block">USDT (TRC-20 Network - Recommended &lt;$1 fee)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={paymentSettings.crypto.usdtTrc20Address}
                    onChange={(e) =>
                      updatePaymentSettings({
                        crypto: { ...paymentSettings.crypto, usdtTrc20Address: e.target.value },
                      })
                    }
                    className="flex-1 px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] text-[11px]"
                  />
                  <button
                    onClick={() => handleCopy(paymentSettings.crypto.usdtTrc20Address, 'usdt_trc')}
                    className="p-2 border border-[var(--bd)] rounded-xl bg-[var(--bg)] cursor-pointer"
                  >
                    {copiedKey === 'usdt_trc' ? <Check className="w-4 h-4 text-[#00c48c]" /> : <Copy className="w-4 h-4 text-[var(--mu)]" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-2">
                <span className="font-sans font-bold text-purple-400 block">USDT (ERC-20 Ethereum Network)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={paymentSettings.crypto.usdtErc20Address}
                    onChange={(e) =>
                      updatePaymentSettings({
                        crypto: { ...paymentSettings.crypto, usdtErc20Address: e.target.value },
                      })
                    }
                    className="flex-1 px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] text-[11px]"
                  />
                  <button
                    onClick={() => handleCopy(paymentSettings.crypto.usdtErc20Address, 'usdt_erc')}
                    className="p-2 border border-[var(--bd)] rounded-xl bg-[var(--bg)] cursor-pointer"
                  >
                    {copiedKey === 'usdt_erc' ? <Check className="w-4 h-4 text-[#00c48c]" /> : <Copy className="w-4 h-4 text-[var(--mu)]" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: VERIFICATION QUEUE & CLIENT RECEIPTS */}
      {activeTab === 'queue' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--bd)]">
              <div>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#00c48c]" />
                  <span>Client Payment Proof &amp; Settlement Queue</span>
                </h2>
                <p className="text-xs text-[var(--mu)] mt-0.5">
                  Review submitted bank transfer references, Raast transaction IDs, and wire slips. Approving a proof automatically transitions the lead to <b>Won</b>!
                </p>
              </div>

              <button
                onClick={() => setShowManualModal(true)}
                className="px-4 py-2 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Record New Receipt</span>
              </button>
            </div>

            {/* Submissions List */}
            {paymentProofs.length === 0 ? (
              <div className="text-center py-12 text-[var(--mu)] text-xs">
                No payment proofs submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {paymentProofs.map((proof) => {
                  const isVerified = proof.status === 'verified';
                  const isRejected = proof.status === 'rejected';

                  return (
                    <div
                      key={proof.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isVerified
                          ? 'bg-[#00c48c]/10 border-[#00c48c]/30'
                          : isRejected
                          ? 'bg-red-500/10 border-red-500/30'
                          : 'bg-[var(--soft)] border-[var(--bd)] shadow-sm'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-black text-[var(--ink)]">
                            {proof.clientName}
                          </strong>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                              isVerified
                                ? 'bg-[#00c48c] text-white border-[#00c48c]'
                                : isRejected
                                ? 'bg-red-500 text-white border-red-500'
                                : 'bg-[#cca34c]/20 text-[#cca34c] border-[#cca34c]/40 animate-pulse'
                            }`}
                          >
                            {proof.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--mu)]">
                          <span>
                            Amount: <b className="text-[var(--ink)] font-mono">${proof.amount.toLocaleString()} {proof.currency}</b>
                          </span>
                          <span>·</span>
                          <span>Method: <b className="text-[var(--ink)]">{proof.paymentMethodLabel}</b></span>
                          <span>·</span>
                          <span>Ref: <b className="text-blue-500 font-mono select-all">{proof.transactionReference}</b></span>
                        </div>

                        {proof.receiptNote && (
                          <p className="text-[11px] text-[var(--mu)] italic pt-0.5">
                            "{proof.receiptNote}"
                          </p>
                        )}
                        <span className="text-[10px] text-[var(--mu)] block">
                          Submitted: {proof.submittedAt} {proof.verifiedBy && `· Verified by ${proof.verifiedBy}`}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                        {!isVerified && (
                          <button
                            onClick={() => verifyPaymentProof(proof.id, 'verified')}
                            className="px-3.5 py-2 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white text-xs font-black shadow-md shadow-[#00c48c]/25 flex items-center gap-1.5 cursor-pointer transition-all"
                            title="Verify payment and auto-update deal to Won in CRM"
                          >
                            <CheckCheck className="w-4 h-4" />
                            <span>Verify &amp; Mark Won</span>
                          </button>
                        )}
                        {!isRejected && !isVerified && (
                          <button
                            onClick={() => verifyPaymentProof(proof.id, 'rejected')}
                            className="px-3 py-2 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-500 text-xs font-bold transition-all cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deletePaymentProof(proof.id)}
                          className="p-2 text-[var(--mu)] hover:text-red-500 cursor-pointer"
                          title="Remove record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Payment Record Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
              <h3 className="text-base font-black text-[var(--ink)]">
                Record Client Payment / Bank Transfer Slip
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-[var(--mu)] hover:text-[var(--ink)] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualProof} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={manualClient}
                  onChange={(e) => setManualClient(e.target.value)}
                  placeholder="e.g. Bab Al-Khaleej / Dr. Kelly"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">Amount *</label>
                  <input
                    type="number"
                    required
                    value={manualAmount}
                    onChange={(e) => setManualAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--ink)] mb-1">Currency</label>
                  <select
                    value={manualCurrency}
                    onChange={(e) => setManualCurrency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="AED">AED</option>
                    <option value="SAR">SAR</option>
                    <option value="BHD">BHD</option>
                    <option value="PKR">PKR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">Settlement Method</label>
                <select
                  value={manualMethod}
                  onChange={(e) => {
                    const m = e.target.value as any;
                    setManualMethod(m);
                    if (m === 'pakistani_bank') setManualMethodLabel('Meezan Bank Raast ID');
                    else if (m === 'gcc_bank') setManualMethodLabel('Emirates NBD UAE IBAN');
                    else if (m === 'stripe') setManualMethodLabel('Stripe Card');
                    else if (m === 'paypal') setManualMethodLabel('PayPal Wallet');
                    else if (m === 'wise_payoneer') setManualMethodLabel('Wise US ACH Wire');
                    else setManualMethodLabel('USDT TRC20');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                >
                  <option value="gcc_bank">GCC Bank Transfer (IBAN / BenefitPay / Mada)</option>
                  <option value="pakistani_bank">Pakistani Bank (Raast ID / IBFT)</option>
                  <option value="stripe">Stripe Card Payment</option>
                  <option value="paypal">PayPal</option>
                  <option value="wise_payoneer">Wise / Payoneer Wire</option>
                  <option value="crypto">USDT Stablecoin</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">Transaction Ref / Slip No.</label>
                <input
                  type="text"
                  value={manualRef}
                  onChange={(e) => setManualRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--ink)] mb-1">Internal Note (Optional)</label>
                <textarea
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  placeholder="e.g. Cleared 50% retainer deposit for funnel copywriting and deployment."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[var(--bd)]">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--bd)] text-[var(--mu)] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white font-bold cursor-pointer shadow-md"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

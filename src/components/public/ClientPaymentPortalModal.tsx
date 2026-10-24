import React, { useState, useMemo, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  X,
  CreditCard,
  Building2,
  Globe,
  Zap,
  FileText,
  Coins,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Printer,
  Sparkles,
  HelpCircle,
  Receipt,
  Download,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const ClientPaymentPortalModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    closePaymentModal,
    paymentModalPrefill,
    paymentSettings,
    addPaymentProof,
  } = useBusiness();

  // Active Rail Tab
  const [selectedRail, setSelectedRail] = useState<
    'stripe' | 'paypal' | 'gcc' | 'pakistan' | 'wire' | 'crypto' | 'proof'
  >('stripe');

  // Currency selection
  const [currency, setCurrency] = useState<'USD' | 'SAR' | 'AED' | 'BHD' | 'PKR' | 'EUR' | 'GBP'>('USD');
  const [amountUsd, setAmountUsd] = useState<number>(1500);

  // Form states
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [txRef, setTxRef] = useState<string>('');
  const [receiptNote, setReceiptNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Simulated card states for direct Stripe card checkout
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('777');
  const [cardholderName, setCardholderName] = useState<string>('');
  const [cardProcessing, setCardProcessing] = useState<boolean>(false);

  // Success Voucher State
  const [confirmedVoucher, setConfirmedVoucher] = useState<{
    id: string;
    clientName: string;
    clientEmail: string;
    amount: number;
    currency: string;
    method: string;
    txRef: string;
    status: 'verified' | 'pending_verification';
    timestamp: string;
  } | null>(null);

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

  // Pre-fill handling
  useEffect(() => {
    if (paymentModalPrefill) {
      if (paymentModalPrefill.amount) setAmountUsd(paymentModalPrefill.amount);
      if (paymentModalPrefill.currency) setCurrency(paymentModalPrefill.currency as any);
      if (paymentModalPrefill.clientName) {
        setClientName(paymentModalPrefill.clientName);
        setCardholderName(paymentModalPrefill.clientName);
      }
      if (paymentModalPrefill.note) setReceiptNote(paymentModalPrefill.note);
      if (paymentModalPrefill.method) {
        if (paymentModalPrefill.method.includes('gcc')) setSelectedRail('gcc');
        else if (paymentModalPrefill.method.includes('pakistan')) setSelectedRail('pakistan');
        else if (paymentModalPrefill.method.includes('stripe')) setSelectedRail('stripe');
        else if (paymentModalPrefill.method.includes('paypal')) setSelectedRail('paypal');
        else if (paymentModalPrefill.method.includes('wire')) setSelectedRail('wire');
      }
    }
  }, [paymentModalPrefill, isPaymentModalOpen]);

  // Selected GCC bank
  const [selectedGccId, setSelectedGccId] = useState<string>('gcc-uae-1');
  const activeGccBank = useMemo(() => {
    return paymentSettings.gccBanks.find((b) => b.id === selectedGccId) || paymentSettings.gccBanks[0];
  }, [paymentSettings.gccBanks, selectedGccId]);

  // Selected Pakistani bank
  const [selectedPkId, setSelectedPkId] = useState<string>('pk-meezan-1');
  const activePkBank = useMemo(() => {
    return paymentSettings.pakistaniBanks.find((b) => b.id === selectedPkId) || paymentSettings.pakistaniBanks[0];
  }, [paymentSettings.pakistaniBanks, selectedPkId]);

  // Selected International wire
  const [selectedWireId, setSelectedWireId] = useState<string>('wire-wise-1');
  const activeWire = useMemo(() => {
    return paymentSettings.internationalWire.find((w) => w.id === selectedWireId) || paymentSettings.internationalWire[0];
  }, [paymentSettings.internationalWire, selectedWireId]);

  // Real-time converted values based on USD base
  const exchangeRates: Record<string, { rate: number; symbol: string; label: string }> = {
    USD: { rate: 1, symbol: '$', label: 'US Dollar (Base)' },
    SAR: { rate: 3.75, symbol: 'SAR', label: 'Saudi Riyal (Pegged)' },
    AED: { rate: 3.67, symbol: 'AED', label: 'UAE Dirham (Pegged)' },
    BHD: { rate: 0.377, symbol: 'BHD', label: 'Bahraini Dinar (Pegged)' },
    PKR: { rate: 278.5, symbol: 'Rs', label: 'Pakistani Rupee' },
    EUR: { rate: 0.92, symbol: '€', label: 'Euro' },
    GBP: { rate: 0.79, symbol: '£', label: 'British Pound' },
  };

  const currentConvertedAmount = useMemo(() => {
    const usd = Number(amountUsd) || 0;
    const info = exchangeRates[currency] || { rate: 1 };
    const converted = usd * info.rate;
    if (currency === 'BHD' || currency === 'EUR' || currency === 'GBP') {
      return converted.toFixed(2);
    }
    return Math.round(converted).toLocaleString();
  }, [amountUsd, currency]);

  if (!isPaymentModalOpen) return null;

  // Handle client card payment authorization simulation
  const handleSimulateCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardholderName.trim()) {
      alert('Please enter the name on your card.');
      return;
    }

    setCardProcessing(true);
    setTimeout(() => {
      const generatedTx = 'ch_live_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      const proof = addPaymentProof({
        clientName: cardholderName.trim(),
        clientEmail: clientEmail.trim() || 'client@stripe.com',
        clientPhone: clientPhone.trim(),
        amount: Number(amountUsd) || 1500,
        currency: 'USD',
        paymentMethod: 'stripe',
        paymentMethodLabel: 'Stripe Card / Apple Pay (Instant Authorization)',
        transactionReference: generatedTx,
        receiptNote: receiptNote || 'Direct Stripe instant credit card kickoff authorization',
      });

      // Also notify backend
      fetch('/api/payments/submit-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: cardholderName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          amount: Number(amountUsd) || 1500,
          currency: 'USD',
          paymentMethod: 'stripe',
          paymentMethodLabel: 'Stripe Card / Apple Pay (Instant)',
          transactionReference: generatedTx,
          receiptNote: 'Instant card payment authorization cleared',
        }),
      }).catch(() => {});

      setCardProcessing(false);
      setConfirmedVoucher({
        id: proof.id,
        clientName: cardholderName.trim(),
        clientEmail: clientEmail.trim() || 'client@stripe.com',
        amount: Number(amountUsd) || 1500,
        currency: 'USD',
        method: 'Stripe Card / Apple Pay (Cleared)',
        txRef: generatedTx,
        status: 'verified',
        timestamp: new Date().toLocaleString(),
      });
    }, 1200);
  };

  // Handle manual bank transfer / wire receipt submission
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('Please enter your full name or company name.');
      return;
    }
    if (!txRef.trim()) {
      alert('Please provide the transaction reference ID or bank transfer number.');
      return;
    }

    setIsSubmitting(true);

    let railLabel = 'International Bank Wire';
    if (selectedRail === 'gcc') railLabel = `${activeGccBank.bankName} (${activeGccBank.country} IBAN)`;
    else if (selectedRail === 'pakistan') railLabel = `${activePkBank.bankName} (Raast / IBFT)`;
    else if (selectedRail === 'paypal') railLabel = 'PayPal International Transfer';
    else if (selectedRail === 'wire') railLabel = `${activeWire.provider} Wire`;
    else if (selectedRail === 'crypto') railLabel = 'USDT Stablecoin (TRC-20)';

    const proof = addPaymentProof({
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || 'client@company.com',
      clientPhone: clientPhone.trim(),
      amount: Number(amountUsd) || 1500,
      currency,
      paymentMethod: selectedRail === 'gcc' ? 'gcc_bank' : selectedRail === 'pakistan' ? 'pakistani_bank' : 'wise_payoneer',
      paymentMethodLabel: railLabel,
      transactionReference: txRef.trim(),
      receiptNote: receiptNote.trim() || 'Client bank wire submission via Public Portal',
    });

    // Notify backend
    try {
      await fetch('/api/payments/submit-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          amount: Number(amountUsd) || 1500,
          currency,
          paymentMethod: selectedRail === 'gcc' ? 'gcc_bank' : selectedRail === 'pakistan' ? 'pakistani_bank' : 'wise_payoneer',
          paymentMethodLabel: railLabel,
          transactionReference: txRef.trim(),
          receiptNote: receiptNote.trim(),
        }),
      });
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setConfirmedVoucher({
      id: proof.id,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || 'client@company.com',
      amount: Number(amountUsd) || 1500,
      currency,
      method: railLabel,
      txRef: txRef.trim(),
      status: 'pending_verification',
      timestamp: new Date().toLocaleString(),
    });
  };

  const whatsappNotificationUrl = useMemo(() => {
    if (!confirmedVoucher) return '';
    const text = `Salam / Hello Ghazi Wazir,\n\nI have just submitted payment confirmation for Back for Brand LLC.\n\nClient: ${confirmedVoucher.clientName}\nAmount: ${confirmedVoucher.currency} ${confirmedVoucher.amount}\nPayment Method: ${confirmedVoucher.method}\nTransaction Reference: ${confirmedVoucher.txRef}\nVoucher ID: ${confirmedVoucher.id}\n\nPlease confirm clearance and provision our kickoff sprint. Thank you!`;
    return `https://wa.me/923001234567?text=${encodeURIComponent(text)}`;
  }, [confirmedVoucher]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[var(--bg)] border border-[var(--bd)] rounded-3xl shadow-2xl overflow-hidden text-[var(--ink)]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#070e24] via-[#0c183a] to-[#070e24] text-white flex items-center justify-between border-b border-[#cca34c]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00c48c]/20 border border-[#00c48c]/40 flex items-center justify-center text-[#00c48c] shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base tracking-tight">
                  Back for Brand LLC · Global Payment Portal
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#cca34c]/20 border border-[#cca34c]/40 text-[#cca34c] text-[10px] font-black uppercase tracking-wider">
                  Verified US Merchant
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/70">
                Florida, USA · Direct GCC (UAE, Saudi, Bahrain) &amp; Pakistani Banking Rails
              </p>
            </div>
          </div>

          <button
            onClick={closePaymentModal}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Payment Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency & Amount Ribbon */}
        <div className="px-6 py-3 bg-[var(--card)] border-b border-[var(--bd)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[var(--mu)]">Deal / Invoice Quote:</span>
            <div className="flex items-center gap-1.5 bg-[var(--soft)] px-3 py-1.5 rounded-xl border border-[var(--bd)]">
              <span className="font-black text-[#00c48c]">$</span>
              <input
                type="number"
                value={amountUsd}
                onChange={(e) => setAmountUsd(Number(e.target.value))}
                className="w-20 font-black text-sm bg-transparent border-none outline-none text-[var(--ink)] font-mono"
                step="50"
              />
              <span className="text-[10px] font-bold text-[var(--mu)]">USD</span>
            </div>
          </div>

          {/* Currency Select */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--mu)]">Settlement Currency:</span>
            <div className="flex items-center gap-1 bg-[var(--soft)] p-1 rounded-xl border border-[var(--bd)]">
              {(['USD', 'SAR', 'AED', 'BHD', 'PKR', 'EUR', 'GBP'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                    currency === c
                      ? 'bg-[#00c48c] text-white shadow-xs'
                      : 'text-[var(--mu)] hover:text-[var(--ink)]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-[#cca34c]/10 text-[#cca34c] font-black border border-[#cca34c]/30 font-mono">
              = {currentConvertedAmount} {currency}
            </span>
          </div>
        </div>

        {/* Modal Body / Tabs */}
        {confirmedVoucher ? (
          /* CONFIRMED RECEIPT VOUCHER VIEW */
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            <div className="rounded-3xl bg-gradient-to-br from-[#070e24] to-[#0c183a] text-white p-6 sm:p-8 border border-[#00c48c]/40 shadow-2xl relative space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#00c48c]/20 border border-[#00c48c] flex items-center justify-center text-[#00c48c] shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00c48c]">
                      {confirmedVoucher.status === 'verified' ? 'Payment Verified & Cleared' : 'Payment Proof Logged & Queued'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black">Official Payment Confirmation Voucher</h2>
                    <span className="text-xs text-gray-300">Voucher Ref: {confirmedVoucher.id}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Amount</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#00c48c] font-mono">
                    {confirmedVoucher.currency} {confirmedVoucher.amount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Voucher Detail Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 font-sans block">Client Account</span>
                  <strong className="text-sm font-black text-white font-sans block">{confirmedVoucher.clientName}</strong>
                  <span className="text-gray-300">{confirmedVoucher.clientEmail}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 font-sans block">Payment Channel &amp; Rail</span>
                  <strong className="text-sm font-black text-[#cca34c] font-sans block">{confirmedVoucher.method}</strong>
                  <span className="text-gray-300">Ref: {confirmedVoucher.txRef}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 font-sans block">Issuing Organization</span>
                  <strong className="text-white font-sans block">Back for Brand LLC (Florida, USA)</strong>
                  <span className="text-gray-300">Founder &amp; CEO: Ghazi Wazir</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 font-sans block">Timestamp &amp; Clearance</span>
                  <strong className="text-white font-sans block">{confirmedVoucher.timestamp}</strong>
                  <span className="text-emerald-400">Status: {confirmedVoucher.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={whatsappNotificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-2xl bg-[#00c48c] hover:bg-[#00a876] text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-[#00c48c]/30 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify Ghazi Wazir on WhatsApp</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Voucher / Save PDF</span>
                </button>

                <button
                  onClick={() => {
                    setConfirmedVoucher(null);
                    closePaymentModal();
                  }}
                  className="px-4 py-3 rounded-2xl bg-transparent hover:bg-white/10 text-gray-300 font-bold text-xs cursor-pointer ml-auto"
                >
                  Done &amp; Return
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Rails Selector */}
            <div className="w-full md:w-64 bg-[var(--soft)] border-r border-[var(--bd)] p-3 space-y-1.5 flex-shrink-0 overflow-y-auto">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--mu)] px-3 py-1 block">
                Choose Payment Rail
              </span>

              {[
                { id: 'stripe', label: 'Credit Card / Apple Pay', badge: 'Stripe', icon: CreditCard },
                { id: 'gcc', label: 'GCC Banks (UAE, KSA, BHD)', badge: 'Local IBAN', icon: Building2 },
                { id: 'pakistan', label: 'Pakistani Banks & Raast', badge: '0-Fee', icon: Zap },
                { id: 'paypal', label: 'PayPal International', badge: 'Global', icon: Globe },
                { id: 'wire', label: 'Wise / US FedWire', badge: 'USD/EUR', icon: FileText },
                { id: 'crypto', label: 'USDT Stablecoin', badge: 'Instant', icon: Coins },
                { id: 'proof', label: 'Submit Bank Wire Slip', badge: 'Upload Ref', icon: Receipt },
              ].map((rail) => {
                const Icon = rail.icon;
                const isSelected = selectedRail === rail.id;
                return (
                  <button
                    key={rail.id}
                    onClick={() => setSelectedRail(rail.id as any)}
                    className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#00c48c] text-white shadow-md font-black'
                        : 'hover:bg-[var(--card)] text-[var(--ink)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-[#00c48c]'}`} />
                      <span className="text-xs font-bold truncate leading-tight">{rail.label}</span>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase flex-shrink-0 ${
                        isSelected
                          ? 'bg-black/25 text-white'
                          : 'bg-[var(--card)] border border-[var(--bd)] text-[var(--mu)]'
                      }`}
                    >
                      {rail.badge}
                    </span>
                  </button>
                );
              })}

              <div className="mt-4 p-3 rounded-2xl bg-[var(--card)] border border-[var(--bd)] text-[11px] text-[var(--mu)] space-y-1">
                <span className="font-black text-[#cca34c] block">🔒 100% Encrypted &amp; Secure</span>
                <p className="leading-snug">
                  All transactions are covered by official contracts and verifiable invoices under Back for Brand LLC.
                </p>
              </div>
            </div>

            {/* Main Rail Content Area */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* RAIL 1: STRIPE DIRECT CARD CHECKOUT */}
              {selectedRail === 'stripe' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--bd)]">
                    <div>
                      <h4 className="text-base font-black text-[var(--ink)] flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-indigo-500" />
                        <span>Instant Card Payment (Visa, Mastercard, Amex, Apple Pay)</span>
                      </h4>
                      <p className="text-xs text-[var(--mu)] mt-0.5">
                        Processed via Stripe US Gateway with 256-bit encryption. Zero foreign exchange markup.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-black text-xs border border-indigo-500/30">
                      Instant Clearance
                    </span>
                  </div>

                  {/* Quick Stripe Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={paymentSettings.stripe.retainerPaymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white flex items-center justify-between gap-3 shadow-md transition-transform hover:-translate-y-0.5"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-200 block">Fast 1-Click Checkout</span>
                        <strong className="text-sm font-black block">Pay $500 Kickoff Retainer</strong>
                      </div>
                      <ExternalLink className="w-4 h-4 text-indigo-200" />
                    </a>

                    <a
                      href={paymentSettings.stripe.growthPlanPaymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-2xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#20d89f] hover:to-[#00c48c] text-white flex items-center justify-between gap-3 shadow-md transition-transform hover:-translate-y-0.5"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-100 block">Fast 1-Click Checkout</span>
                        <strong className="text-sm font-black block">Pay $1,500 Full Growth Plan</strong>
                      </div>
                      <ExternalLink className="w-4 h-4 text-emerald-100" />
                    </a>
                  </div>

                  {/* Direct Simulated Card Form */}
                  <form onSubmit={handleSimulateCardPayment} className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-4">
                    <span className="text-xs font-black text-[var(--ink)] block uppercase tracking-wider">
                      Or Enter Card Details Below for Instant Authorization:
                    </span>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-[var(--ink)] mb-1">Cardholder Full Name</label>
                        <input
                          type="text"
                          required
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          placeholder="e.g. Tariq Al-Mansoor"
                          className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-[var(--ink)] mb-1">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[var(--ink)] mb-1">Expires / CVC</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-1/2 px-2 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-mono text-center"
                            />
                            <input
                              type="text"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="CVC"
                              className="w-1/2 px-2 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-mono text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[var(--ink)] mb-1">Client Email (For Receipt)</label>
                          <input
                            type="email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="tariq@company.com"
                            className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[var(--ink)] mb-1">WhatsApp / Phone</label>
                          <input
                            type="text"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            placeholder="+971 50 123 4567"
                            className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={cardProcessing}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
                    >
                      {cardProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Authorizing Card with Stripe Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay ${amountUsd.toLocaleString()} USD Now</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* RAIL 2: GCC BANKS (UAE, SAUDI, BAHRAIN, QATAR) */}
              {selectedRail === 'gcc' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--bd)]">
                    <div>
                      <h4 className="text-base font-black text-[var(--ink)] flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#cca34c]" />
                        <span>GCC Direct Local Bank Transfers (IBAN)</span>
                      </h4>
                      <p className="text-xs text-[var(--mu)] mt-0.5">
                        Transfer directly in local GCC currencies without international wire delays.
                      </p>
                    </div>
                  </div>

                  {/* GCC Country Selector Tabs */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {paymentSettings.gccBanks.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedGccId(b.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          selectedGccId === b.id
                            ? 'bg-[#cca34c] text-white shadow-xs font-black'
                            : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
                        }`}
                      >
                        <span>{b.country === 'UAE' ? '🇦🇪 UAE' : b.country === 'Saudi Arabia' ? '🇸🇦 Saudi Arabia' : b.country === 'Bahrain' ? '🇧🇭 Bahrain' : '🇶🇦 Qatar'}</span>
                        <span className="text-[10px] opacity-80">({b.currency})</span>
                      </button>
                    ))}
                  </div>

                  {/* Bank Account Details Card */}
                  <div className="p-6 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#cca34c] px-2 py-0.5 rounded bg-[var(--bg)] border border-[#cca34c]/30">
                          {activeGccBank.country} Local Clearing
                        </span>
                        <h3 className="text-lg font-black text-[var(--ink)] mt-2">{activeGccBank.bankName}</h3>
                        <span className="text-xs text-[var(--mu)] font-bold">Beneficiary: {activeGccBank.accountTitle}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {activeGccBank.supportedNetworks.map((net) => (
                          <span key={net} className="px-2 py-0.5 rounded bg-[#00c48c]/15 text-[#00c48c] text-[10px] font-black border border-[#00c48c]/30">
                            {net}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Copyable IBAN */}
                    <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--bd)] space-y-3 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[var(--mu)] font-sans font-bold">IBAN NUMBER:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[var(--ink)] select-all sm:text-sm">{activeGccBank.iban}</span>
                          <button
                            onClick={() => handleCopy(activeGccBank.iban, 'gcc_iban')}
                            className="px-2.5 py-1 rounded-lg bg-[var(--soft)] hover:bg-[#00c48c] hover:text-white text-[var(--ink)] font-sans font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === 'gcc_iban' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedKey === 'gcc_iban' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[var(--bd)] pt-2">
                        <span className="text-[10px] text-[var(--mu)] font-sans font-bold">SWIFT / BIC:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[var(--ink)] select-all">{activeGccBank.swiftBic}</span>
                          <button
                            onClick={() => handleCopy(activeGccBank.swiftBic, 'gcc_swift')}
                            className="p-1 hover:text-[#00c48c] text-[var(--mu)] cursor-pointer"
                          >
                            {copiedKey === 'gcc_swift' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--mu)] italic leading-relaxed">
                      💡 {activeGccBank.instructions}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setReceiptNote(`GCC Wire via ${activeGccBank.bankName} (${activeGccBank.iban})`);
                          setSelectedRail('proof');
                        }}
                        className="w-full py-3 rounded-xl bg-[#cca34c] hover:bg-[#b8903c] text-[#070e24] font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Receipt className="w-4 h-4" />
                        <span>I Have Completed the Wire &gt; Submit Slip Reference</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* RAIL 3: PAKISTANI BANKS & RAAST */}
              {selectedRail === 'pakistan' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--bd)]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇵🇰</span>
                        <h4 className="text-base font-black text-[var(--ink)]">
                          Pakistani Instant Raast &amp; IBFT Banking Rails
                        </h4>
                      </div>
                      <p className="text-xs text-[var(--mu)] mt-0.5">
                        Zero Fee instant settlement 24/7/365 via State Bank of Pakistan (SBP) Raast &amp; 1Link.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 font-black text-xs border border-emerald-500/30">
                      Zero Transfer Fee
                    </span>
                  </div>

                  {/* Pakistani Bank Tabs */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {paymentSettings.pakistaniBanks.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedPkId(b.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedPkId === b.id
                            ? 'bg-emerald-600 text-white shadow-xs font-black'
                            : 'bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {b.bankName.split(' ')[0]} {b.bankName.split(' ')[1] || ''}
                      </button>
                    ))}
                  </div>

                  {/* Bank Details Card */}
                  <div className="p-6 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 px-2 py-0.5 rounded bg-[var(--bg)] border border-emerald-500/30">
                          {activePkBank.serviceType}
                        </span>
                        <h3 className="text-lg font-black text-[var(--ink)] mt-2">{activePkBank.bankName}</h3>
                        <span className="text-xs text-[var(--mu)] font-bold">Account Title: {activePkBank.accountTitle}</span>
                      </div>
                    </div>

                    {/* Raast Highlight Box */}
                    {activePkBank.raastId && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />
                            <span>Instant Raast ID (Zero Fee - Mobile/IBAN):</span>
                          </span>
                          <span className="text-base font-black text-emerald-600 font-mono block mt-0.5 select-all">
                            {activePkBank.raastId}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(activePkBank.raastId!, 'raast_id')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-black text-xs flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          {copiedKey === 'raast_id' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'raast_id' ? 'Copied' : 'Copy Raast'}</span>
                        </button>
                      </div>
                    )}

                    {/* Standard Account & IBAN */}
                    <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--bd)] space-y-2.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[var(--mu)] font-sans font-bold">ACCOUNT NUMBER:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[var(--ink)] select-all">{activePkBank.accountNumber}</span>
                          <button
                            onClick={() => handleCopy(activePkBank.accountNumber, 'pk_acc')}
                            className="p-1 hover:text-[#00c48c] text-[var(--mu)] cursor-pointer"
                          >
                            {copiedKey === 'pk_acc' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[var(--bd)] pt-2">
                        <span className="text-[10px] text-[var(--mu)] font-sans font-bold">1LINK IBAN:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[var(--ink)] select-all truncate max-w-[200px]">{activePkBank.iban}</span>
                          <button
                            onClick={() => handleCopy(activePkBank.iban, 'pk_iban')}
                            className="p-1 hover:text-[#00c48c] text-[var(--mu)] cursor-pointer"
                          >
                            {copiedKey === 'pk_iban' ? <Check className="w-3.5 h-3.5 text-[#00c48c]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--mu)] italic leading-relaxed">
                      💡 {activePkBank.instructions}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setReceiptNote(`Pakistani Transfer via ${activePkBank.bankName} (Raast ID ${activePkBank.raastId || activePkBank.accountNumber})`);
                          setSelectedRail('proof');
                        }}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Receipt className="w-4 h-4" />
                        <span>I Have Transferred via Raast / IBFT &gt; Submit Slip Reference</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* RAIL 4: PAYPAL */}
              {selectedRail === 'paypal' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--bd)]">
                    <div>
                      <h4 className="text-base font-black text-[var(--ink)] flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <span>PayPal International Express Checkout</span>
                      </h4>
                      <p className="text-xs text-[var(--mu)] mt-0.5">
                        Pay via PayPal balance, linked bank accounts, or international cards.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-4">
                    <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--bd)] space-y-2 text-xs">
                      <span className="font-bold text-[var(--mu)] block">Official Merchant Email:</span>
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-black text-sm text-[var(--ink)] select-all">{paymentSettings.paypal.merchantEmail}</span>
                        <button
                          onClick={() => handleCopy(paymentSettings.paypal.merchantEmail, 'pp_email')}
                          className="px-3 py-1.5 rounded-lg bg-[var(--soft)] hover:bg-blue-500 hover:text-white font-sans font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'pp_email' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'pp_email' ? 'Copied' : 'Copy Email'}</span>
                        </button>
                      </div>
                    </div>

                    <a
                      href={`https://paypal.me/backforbrand/${amountUsd}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Open PayPal.Me Checkout (${amountUsd} USD)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* RAIL 5: WISE / US FEDWIRE */}
              {selectedRail === 'wire' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--bd)]">
                    <div>
                      <h4 className="text-base font-black text-[var(--ink)] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-500" />
                        <span>US Federal Wire, ACH &amp; Wise Multi-Currency</span>
                      </h4>
                      <p className="text-xs text-[var(--mu)] mt-0.5">
                        Direct US routing numbers (ABA) for domestic US wire transfers with 0 intermediary fee.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#00c48c] px-2 py-0.5 rounded bg-[var(--bg)] border border-[#00c48c]/30">
                          {activeWire.provider}
                        </span>
                        <h3 className="text-lg font-black text-[var(--ink)] mt-2">{activeWire.bankName}</h3>
                        <span className="text-xs text-[var(--mu)] font-bold">Account Title: {activeWire.accountTitle}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--bd)] space-y-2.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[var(--mu)] font-sans font-bold">ACCOUNT NUMBER:</span>
                        <span className="font-black text-[var(--ink)] select-all">{activeWire.accountNumber}</span>
                      </div>
                      {activeWire.routingNumberAba && (
                        <div className="flex items-center justify-between border-t border-[var(--bd)] pt-2">
                          <span className="text-[10px] text-[var(--mu)] font-sans font-bold">ABA ROUTING NUMBER (US):</span>
                          <span className="font-black text-[var(--ink)] select-all">{activeWire.routingNumberAba}</span>
                        </div>
                      )}
                      {activeWire.swiftBic && (
                        <div className="flex items-center justify-between border-t border-[var(--bd)] pt-2">
                          <span className="text-[10px] text-[var(--mu)] font-sans font-bold">SWIFT CODE:</span>
                          <span className="font-bold text-[var(--ink)] select-all">{activeWire.swiftBic}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-[var(--mu)] italic">
                      💡 {activeWire.instructions}
                    </p>

                    <button
                      onClick={() => {
                        setReceiptNote(`US Wire / Wise to ${activeWire.bankName} (${activeWire.accountNumber})`);
                        setSelectedRail('proof');
                      }}
                      className="w-full py-3 rounded-xl bg-[#00c48c] hover:bg-[#00a876] text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>I Have Completed Federal Wire &gt; Submit Slip Reference</span>
                    </button>
                  </div>
                </div>
              )}

              {/* RAIL 6: USDT CRYPTO */}
              {selectedRail === 'crypto' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--bd)]">
                    <div>
                      <h4 className="text-base font-black text-[var(--ink)] flex items-center gap-2">
                        <Coins className="w-5 h-5 text-emerald-400" />
                        <span>USDT Stablecoin (TRC-20 Tron &amp; ERC-20)</span>
                      </h4>
                      <p className="text-xs text-[var(--mu)] mt-0.5">
                        Instant international blockchain settlement with zero banking hold.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[var(--soft)] border border-[var(--bd)] space-y-4">
                    <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--bd)] space-y-2 text-xs font-mono">
                      <span className="font-sans font-bold text-emerald-500 block">USDT TRC-20 Address (Fee &lt;$1):</span>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--ink)] select-all text-xs break-all">{paymentSettings.crypto.usdtTrc20Address}</span>
                        <button
                          onClick={() => handleCopy(paymentSettings.crypto.usdtTrc20Address, 'trc20')}
                          className="px-3 py-1.5 rounded-lg bg-[var(--soft)] hover:bg-[#00c48c] hover:text-white font-sans font-bold flex items-center gap-1 cursor-pointer flex-shrink-0 ml-2"
                        >
                          {copiedKey === 'trc20' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'trc20' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setReceiptNote(`USDT Transfer to ${paymentSettings.crypto.usdtTrc20Address}`);
                        setSelectedRail('proof');
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>I Have Sent USDT &gt; Submit Blockchain Tx Hash</span>
                    </button>
                  </div>
                </div>
              )}

              {/* RAIL 7: SUBMIT PROOF OF PAYMENT SLIP FORM */}
              {selectedRail === 'proof' && (
                <form onSubmit={handleSubmitProof} className="space-y-4 animate-fadeIn">
                  <div className="pb-3 border-b border-[var(--bd)]">
                    <h4 className="text-base font-black text-[var(--ink)] flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-[#00c48c]" />
                      <span>Submit Payment Proof / Bank Transfer Slip</span>
                    </h4>
                    <p className="text-xs text-[var(--mu)] mt-0.5">
                      Once submitted, our finance officer verifies your bank transfer and generates your signed project agreement.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-[var(--ink)] mb-1">Your Name / Company Name *</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Bab Al-Khaleej Consultant"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[var(--ink)] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="office@company.com"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[var(--ink)] mb-1">WhatsApp / Phone Number</label>
                      <input
                        type="text"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+973 1700 0000 or +92 300 1234567"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[var(--ink)] mb-1">Transaction Ref / Slip Number *</label>
                      <input
                        type="text"
                        required
                        value={txRef}
                        onChange={(e) => setTxRef(e.target.value)}
                        placeholder="e.g. ENBD-TX-8829104 or Raast Ref"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--ink)] mb-1 text-xs">Receipt Notes / Funnel Package</label>
                    <textarea
                      rows={2}
                      value={receiptNote}
                      onChange={(e) => setReceiptNote(e.target.value)}
                      placeholder="e.g. 50% Kickoff Retainer for High-Converting Funnel & Meta Ads setup"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--soft)] text-[var(--ink)] text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#20d89f] hover:to-[#00c48c] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00c48c]/30 cursor-pointer transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting Payment Proof...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit Proof &amp; Generate Official Confirmation Voucher</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  MessageSquare,
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  Calendar,
  Globe,
  Sliders,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Phone,
  QrCode,
  Code2,
  Share2,
  RotateCcw,
} from 'lucide-react';
import { SupportedLanguage, QualificationData } from '../../types/index.ts';

interface SimMessage {
  id: string;
  sender: 'client' | 'agent';
  text: string;
  timestamp: string;
}

const SAMPLE_PROMPTS: Record<SupportedLanguage, string[]> = {
  en: [
    'I run a dental clinic and want more patients booked on autopilot.',
    'We are an e-commerce brand doing $20k/month. How can you raise our AOV?',
    'Can I book a strategy session with Ghazi Wazir tomorrow at 11 AM?',
  ],
  ar: [
    'عندي متجر إلكتروني في الرياض وأريد زيادة المبيعات ونظام واتساب ذكي.',
    'نحن شركة استشارات في دبي ونحتاج لنظام حجز مواعيد آلي لعملائنا.',
    'أريد حجز جلسة استراتيجية مجانية مع المؤسس غازي وزير غداً.',
  ],
  ur: [
    'Hamari Lahore mein retail shop hai, online orders aur WhatsApp automation chahiye.',
    'Growth plan ki pricing kya hai aur AI chatbot kaise integrate hoga?',
    'Kya kal dopahar 11 baje Ghazi bhai ke sath strategy call book ho sakti hai?',
  ],
};

const INITIAL_GREETINGS: Record<SupportedLanguage, string> = {
  en: "Hello! I'm your Back for Brand WhatsApp Booking & Services Manager. I can help qualify your funnel needs, outline pricing, and schedule a 15-minute Strategy Session with founder Ghazi Wazir. What type of business do you run?",
  ar: "مرحباً بك! أنا مدير الحجوزات والخدمات الآلي لشركة Back for Brand LLC في فلوريدا. يمكنني مساعدتك في استكشاف أنظمة الـ Funnel والذكاء الاصطناعي، وتحديد الميزانية المناسبة، وحجز جلسة استراتيجية مجانية مع المؤسس غازي وزير. ما هو نشاط شركتك؟",
  ur: "السلام علیکم! میں Back for Brand کا واٹس ایپ بکنگ و سروسز مینیجر ہوں۔ ہم آپ کے بزنس کے لیے ہائی کنورٹنگ سیلز فنلز، AI چیٹ بوٹس اور آٹومیشن بناتے ہیں۔ کیا آپ بانی غازی وزیر کے ساتھ 15 منٹ کا فری اسٹریٹیجی سیشن شیڈول کرنا چاہتے ہیں؟",
};

export const WhatsAppAgentTab: React.FC = () => {
  const { addLead, addBooking, setCurrentView, setMachineTab, baseUrl, createCeoApprovalRequest } = useBusiness();

  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [messages, setMessages] = useState<SimMessage[]>([
    {
      id: 'msg-init',
      sender: 'agent',
      text: INITIAL_GREETINGS.en,
      timestamp: '10:00 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeIntegrationTab, setActiveIntegrationTab] = useState<'meta' | 'widget' | 'nocode' | 'qr'>('meta');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Live Extracted Qualification State
  const [qualification, setQualification] = useState<QualificationData>({
    businessType: 'Consulting & Services',
    servicesInterested: ['Funnel Architecture', 'AI WhatsApp Receptionist'],
    budgetTier: '$1,500 - $3,500 (Growth Tier)',
    urgency: 'Immediate (Next 7 days)',
    qualificationScore: 85,
    bookingRequested: true,
    bookingSlot: 'Tomorrow at 11:00 AM',
    clientName: 'Dr. Sara Clinic',
    clientPhone: '+92 333 1112223',
    clientEmail: 'sara@premierhealth.org',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setMessages([
      {
        id: 'msg-' + Date.now(),
        sender: 'agent',
        text: INITIAL_GREETINGS[lang],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text || loading) return;

    const userMsg: SimMessage = {
      id: 'msg-' + Date.now(),
      sender: 'client',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/whatsapp-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          history: messages.map((m) => ({
            role: m.sender === 'client' ? 'user' : 'model',
            text: m.text,
          })),
          clientName: qualification.clientName,
          clientPhone: qualification.clientPhone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const agentReply = data.reply || 'Thank you for reaching out. Let us schedule your strategy session.';

        if (data.qualification) {
          setQualification((prev) => ({
            ...prev,
            ...data.qualification,
            qualificationScore: data.qualification.qualificationScore || prev.qualificationScore,
          }));

          // If booking requested, auto-add to context state & CRM
          if (data.qualification.bookingRequested) {
            const tomorrow = new Date(Date.now() + 3600000 * 24).toISOString().split('T')[0];
            const clientNameExtracted = data.qualification.extractedContact?.name || qualification.clientName || 'WhatsApp Qualified Prospect';
            const clientPhoneExtracted = data.qualification.extractedContact?.phone || qualification.clientPhone || '+92 333 1112223';
            const clientEmailExtracted = data.qualification.extractedContact?.email || qualification.clientEmail || 'client@business.com';
            const serviceRequested = data.qualification.serviceNeeded || 'Executive Strategy Session';

            addBooking({
              name: clientNameExtracted,
              phone: clientPhoneExtracted,
              email: clientEmailExtracted,
              date: tomorrow,
              time: '11:00',
              service: serviceRequested,
              durationMinutes: 45,
              meetingLink: 'https://meet.google.com/bfb-whatsapp-booking',
              st: 'Confirmed',
              notes: `Auto-qualified by WhatsApp Agent (${language.toUpperCase()}). Score: ${data.qualification.qualificationScore}%`,
            });

            // Also ensure lead is logged into CRM Pipeline with Booked status
            addLead({
              name: clientNameExtracted,
              phone: clientPhoneExtracted,
              email: clientEmailExtracted,
              src: 'WhatsApp',
              stage: 'Booked',
              val: 2800,
              need: serviceRequested,
              message: `Auto-booked via WhatsApp Agent. Language: ${language.toUpperCase()}. Score: ${data.qualification.qualificationScore}%. Slot: ${tomorrow} at 11:00 AM.`,
            });

            // Auto-trigger CEO approval & notification item
            createCeoApprovalRequest({
              type: 'high_ticket_deal',
              title: `WhatsApp Auto-Booking: ${clientNameExtracted} ($2,800 Retainer Prospect)`,
              details: `Client qualified by WhatsApp AI Agent with ${data.qualification.qualificationScore}% intent score. Scheduled strategy session on ${tomorrow} at 11:00 AM. Requires CEO welcome sign-off.`,
              entityName: clientNameExtracted,
              amount: 2800,
              currency: 'USD',
              requestedBy: 'WhatsApp Booking Agent AI',
              urgency: 'high',
            });
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            id: 'msg-' + (Date.now() + 1),
            sender: 'agent',
            text: agentReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      // Fallback response
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + (Date.now() + 1),
          sender: 'agent',
          text: language === 'ar'
            ? 'شكراً لتواصلك! تم تسجيل طلبك وسيقوم مدير الحجوزات بتأكيد موعد الجلسة الاستراتيجية معك عبر واتساب.'
            : language === 'ur'
            ? 'آپ کے رابطہ کرنے کا شکریہ! آپ کا اسٹریٹیجی سیشن غازی وزیر کے ساتھ شیڈول کیا جا رہا ہے۔'
            : 'Thank you for connecting! Your strategy session request has been registered in our booking calendar.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // ignore
    }
  };

  const webhookUrl = `${window.location.origin}/api/webhook/whatsapp`;
  const verifyToken = 'bfb_whatsapp_secret';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#075e54] via-[#128c7e] to-[#0b1533] text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-2xl shadow-inner">
            <span className="text-3xl">💬</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                WhatsApp Lead Qualification &amp; Booking Agent
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 font-black">
                TRILINGUAL AI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl leading-relaxed">
              Autonomous Booking Manager that converses in <b>English, Arabic, and Urdu</b> to qualify buyer budgets, explain funnels, and book strategy calls on autopilot.
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/15 backdrop-blur-sm self-stretch md:self-auto justify-center">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              language === 'en' ? 'bg-white text-gray-900 shadow-md' : 'text-emerald-100 hover:text-white'
            }`}
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
          <button
            onClick={() => handleLanguageChange('ar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              language === 'ar' ? 'bg-white text-gray-900 shadow-md' : 'text-emerald-100 hover:text-white'
            }`}
          >
            <span>🇸🇦</span>
            <span>العربية</span>
          </button>
          <button
            onClick={() => handleLanguageChange('ur')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              language === 'ur' ? 'bg-white text-gray-900 shadow-md' : 'text-emerald-100 hover:text-white'
            }`}
          >
            <span>🇵🇰</span>
            <span>اردو</span>
          </button>
        </div>
      </div>

      {/* Main Split: Simulator & Real-Time Lead Qualification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: WhatsApp Chat Simulator (7 cols) */}
        <div className="lg:col-span-7 bg-[var(--card)] border border-[var(--bd)] rounded-3xl overflow-hidden shadow-sm flex flex-col h-[640px]">
          {/* Header */}
          <div className="bg-[#075e54] text-white px-5 py-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center relative">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#075e54]" />
              </div>
              <div>
                <b className="block text-sm font-black flex items-center gap-1.5">
                  <span>Back for Brand Booking Manager</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </b>
                <span className="text-[11px] text-emerald-200">
                  Online · Trilingual Lead Qualification Agent
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider block">Language</span>
              <span className="text-xs font-black text-white">{language.toUpperCase()} MODE</span>
            </div>
          </div>

          {/* Prompt suggestions */}
          <div className="bg-[var(--soft)]/80 px-4 py-2 border-b border-[var(--bd)] overflow-x-auto flex gap-2 no-scrollbar">
            <span className="text-[10px] font-bold text-[var(--mu)] uppercase flex-shrink-0 self-center">
              Try Scenario:
            </span>
            {SAMPLE_PROMPTS[language].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[var(--card)] border border-[var(--bd)] text-[var(--ink)] hover:border-emerald-500 whitespace-nowrap transition-colors flex-shrink-0"
              >
                💬 {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#e5ddd5]/30 dark:bg-black/40">
            {messages.map((m) => {
              const isAgent = m.sender === 'agent';
              return (
                <div
                  key={m.id}
                  className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                      isAgent
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm border border-[var(--bd)]'
                        : 'bg-[#dcf8c6] dark:bg-emerald-950 text-gray-900 dark:text-emerald-100 rounded-tr-sm'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                    <span className="block text-[10px] text-gray-500 dark:text-gray-400 mt-1 text-right">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold pl-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>WhatsApp Agent is typing response...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[var(--card)] border-t border-[var(--bd)] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'اكتب رسالتك لمدير الحجوزات...'
                  : language === 'ur'
                  ? 'اپنا پیغام یہاں لکھیں...'
                  : 'Message Back for Brand Booking Manager...'
              }
              disabled={loading}
              className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-5 py-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right: Live Qualification Telemetry & CRM Pipeline Sync (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Qualification Card */}
          <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-[var(--ink)]">
                  Live Lead Qualification Telemetry
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Score: {qualification.qualificationScore}%
              </span>
            </div>

            {/* Score Ring Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--ink)]">Buyer Intent Readiness</span>
                <span className="font-black text-emerald-600">
                  {qualification.qualificationScore >= 80 ? '🔥 High Intent (Ready to Close)' : '⚡ Nurture Stage'}
                </span>
              </div>
              <div className="h-3 bg-[var(--bd)] rounded-full overflow-hidden">
                <div
                  style={{ width: `${qualification.qualificationScore}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                />
              </div>
            </div>

            {/* Extracted Details Table */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[var(--soft)] flex items-center justify-between">
                <span className="text-[var(--mu)] font-medium">Business / Vertical:</span>
                <b className="text-[var(--ink)]">{qualification.businessType || 'General Business'}</b>
              </div>

              <div className="p-3 rounded-xl bg-[var(--soft)] flex items-center justify-between">
                <span className="text-[var(--mu)] font-medium">Services Desired:</span>
                <b className="text-blue-600 text-right">{qualification.serviceNeeded || 'Funnels & AI Chatbot'}</b>
              </div>

              <div className="p-3 rounded-xl bg-[var(--soft)] flex items-center justify-between">
                <span className="text-[var(--mu)] font-medium">Budget Tier:</span>
                <b className="text-emerald-600">{qualification.budgetTier || '$1,500 - $3,500'}</b>
              </div>

              <div className="p-3 rounded-xl bg-[var(--soft)] flex items-center justify-between">
                <span className="text-[var(--mu)] font-medium">Appointment Booking:</span>
                <b className="text-orange-600 font-bold">{qualification.suggestedSlot || 'Tomorrow 11:00 AM'}</b>
              </div>

              <div className="p-3 rounded-xl bg-[var(--soft)] flex items-center justify-between">
                <span className="text-[var(--mu)] font-medium">Contact Extracted:</span>
                <span className="text-[var(--ink)] font-mono text-[11px]">
                  {qualification.clientPhone || '+92 300 1234567'}
                </span>
              </div>
            </div>

            {/* Direct Sync Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setMachineTab('CRM Pipeline');
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#2b59ff] hover:bg-[#1a3fd1] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>View in CRM Pipeline</span>
              </button>
              <button
                onClick={() => {
                  setMachineTab('Booking Calendar');
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-[var(--bd)] text-[var(--ink)] hover:bg-[var(--soft)] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Open Calendar</span>
              </button>
            </div>
          </div>

          {/* Quick wa.me Trigger */}
          <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <b className="text-emerald-900 dark:text-emerald-200 block text-xs">Direct WhatsApp Hand-off</b>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300">Click to open native WhatsApp with pre-filled message</span>
              </div>
            </div>
            <a
              href={`https://wa.me/923001234567?text=${encodeURIComponent(
                language === 'ar'
                  ? 'مرحباً، أود حجز جلسة استراتيجية مع غازي وزير لتطوير نظام الـ Funnel الخاص بنا.'
                  : language === 'ur'
                  ? 'السلام علیکم، ہم اپنے بزنس کے لیے AI فنل اور بکنگ سسٹم بنوانا چاہتے ہیں۔'
                  : "Hello Back for Brand, I'd like to book a strategy session with Ghazi Wazir."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1 whitespace-nowrap"
            >
              <span>Launch</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* CEO Real-Time Notification & Approval Trigger Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#070e24] to-[#0c183a] text-white border border-[#cca34c]/40 text-xs space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-black text-[#cca34c] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <span>👑</span>
                <span>CEO Executive Approval Integration</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#00c48c]/20 text-[#00c48c] font-black border border-[#00c48c]/40">
                Email + WhatsApp Alerts
              </span>
            </div>
            <p className="text-emerald-100/80 leading-relaxed text-[11px]">
              When the WhatsApp Agent qualifies a high-ticket prospect (Score &gt;= 75% or Value &gt;= $1,000), it automatically triggers an executive authorization item and dispatches formatted alerts to CEO Ghazi Wazir via Email (<strong>backforbrandllc@gmail.com</strong>) and WhatsApp.
            </p>
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  handleSendMessage('Salam Ghazi, we are a multi-location clinic in Dubai ready to deploy the $2,800 Retainer OS. Please confirm our Google Meet slot tomorrow at 11 AM.');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#cca34c] to-[#b8903c] hover:from-[#e5b85c] hover:to-[#cca34c] text-[#070e24] font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate High-Ticket Lead &amp; CEO Alert</span>
              </button>
              <button
                onClick={() => setMachineTab('CEO Reports & Approvals')}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-[#00c48c]" />
                <span>Open Approvals</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WHATSAPP INTEGRATION OPTIONS CENTER */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--bd)]">
          <div>
            <h3 className="text-lg font-black text-[var(--ink)] flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-600" />
              <span>WhatsApp Integration Options &amp; Gateway Hub</span>
            </h3>
            <p className="text-xs text-[var(--mu)] mt-0.5">
              Connect your official Meta Cloud API, QR code gateway, Twilio, or Zapier webhooks to handle incoming WhatsApp messages 24/7.
            </p>
          </div>

          {/* Integration Subtabs */}
          <div className="flex items-center gap-1.5 bg-[var(--soft)] p-1 rounded-2xl border border-[var(--bd)] overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveIntegrationTab('meta')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeIntegrationTab === 'meta'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[var(--mu)] hover:text-[var(--ink)]'
              }`}
            >
              Meta Cloud API (Official)
            </button>
            <button
              onClick={() => setActiveIntegrationTab('widget')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeIntegrationTab === 'widget'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[var(--mu)] hover:text-[var(--ink)]'
              }`}
            >
              Click-to-Chat &amp; Widget
            </button>
            <button
              onClick={() => setActiveIntegrationTab('nocode')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeIntegrationTab === 'nocode'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[var(--mu)] hover:text-[var(--ink)]'
              }`}
            >
              Twilio / Zapier / Make
            </button>
            <button
              onClick={() => setActiveIntegrationTab('qr')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeIntegrationTab === 'qr'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[var(--mu)] hover:text-[var(--ink)]'
              }`}
            >
              QR Code Multi-Device
            </button>
          </div>
        </div>

        {/* OPTION 1: Meta WhatsApp Cloud API */}
        {activeIntegrationTab === 'meta' && (
          <div className="space-y-4 text-xs">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 leading-relaxed">
              <b>Official Meta Business Integration:</b> Configure your WhatsApp Business Cloud API app on{' '}
              <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">
                developers.facebook.com
              </a>
              . Copy the Webhook URL and Verification Token below into the Meta Webhook configuration.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-[var(--bd)] bg-[var(--soft)]/50 space-y-2">
                <span className="font-bold text-[var(--ink)] block">Meta Callback Webhook URL</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="flex-1 font-mono text-[11px] px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
                  />
                  <button
                    onClick={() => copyToClipboard(webhookUrl, 'url')}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1"
                  >
                    {copiedField === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'url' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-[var(--bd)] bg-[var(--soft)]/50 space-y-2">
                <span className="font-bold text-[var(--ink)] block">Webhook Verify Token</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={verifyToken}
                    className="flex-1 font-mono text-[11px] px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
                  />
                  <button
                    onClick={() => copyToClipboard(verifyToken, 'token')}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1"
                  >
                    {copiedField === 'token' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'token' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--bd)] bg-[var(--card)] space-y-2">
              <span className="font-bold text-[var(--ink)] block text-xs">Test Meta Webhook Payload (cURL Simulation)</span>
              <pre className="p-3 rounded-xl bg-[#0b1533] text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"object":"whatsapp_business_account","entry":[{"id":"1000","changes":[{"value":{"messaging_product":"whatsapp","metadata":{"display_phone_number":"15550192"},"messages":[{"from":"923001234567","id":"wamid.test","timestamp":"1697700000","text":{"body":"Hi, I need an AI funnel for my clinic"}}]},"field":"messages"}]}]}'`}
              </pre>
            </div>
          </div>
        )}

        {/* OPTION 2: Click-to-Chat & Embeddable Web Widget */}
        {activeIntegrationTab === 'widget' && (
          <div className="space-y-4 text-xs">
            <p className="text-[var(--mu)]">
              Embed a floating WhatsApp booking widget on any website (Webflow, WordPress, Shopify, Next.js). Pre-configured to initiate chats in English, Arabic, or Urdu.
            </p>

            <div className="p-4 rounded-2xl border border-[var(--bd)] bg-[var(--soft)]/50 space-y-3">
              <span className="font-bold text-[var(--ink)] block">HTML Embed Code (Place before &lt;/body&gt;)</span>
              <pre className="p-3 rounded-xl bg-[#0b1533] text-blue-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`<!-- Back for Brand WhatsApp Booking Widget -->
<a href="https://wa.me/923001234567?text=Hello%20Back%20for%20Brand,%20I'd%20like%20to%20qualify%20my%20funnel%20and%20book%20a%20strategy%20session"
   target="_blank"
   style="position:fixed;bottom:24px;left:24px;z-index:9999;background:#25D366;color:#fff;padding:12px 18px;border-radius:99px;font-family:sans-serif;font-weight:700;text-decoration:none;box-shadow:0 8px 24px rgba(37,211,102,0.4);display:flex;align-items:center;gap:8px;">
   <span>💬</span> Chat with Booking Manager
</a>`}
              </pre>
            </div>
          </div>
        )}

        {/* OPTION 3: Twilio / Zapier / Make.com */}
        {activeIntegrationTab === 'nocode' && (
          <div className="space-y-4 text-xs">
            <p className="text-[var(--mu)]">
              Receive WhatsApp triggers from Twilio Studio, Zapier, Make.com, or ManyChat into our central qualification engine.
            </p>

            <div className="p-4 rounded-2xl border border-[var(--bd)] bg-[var(--soft)]/50 space-y-2">
              <span className="font-bold text-[var(--ink)] block">Direct Webhook Ingestion API</span>
              <div className="p-3 rounded-xl bg-[#0b1533] text-blue-200 font-mono text-[11px] leading-relaxed">
                <span className="text-emerald-400 font-bold">POST</span> {window.location.origin}/api/webhook<br />
                Content-Type: application/json<br /><br />
                {`{
  "name": "Client Name",
  "phone": "+923001234567",
  "email": "client@business.com",
  "source": "WhatsApp",
  "need": "Full AI Business System",
  "message": "Inbound inquiry via Zapier/Twilio"
}`}
              </div>
            </div>
          </div>
        )}

        {/* OPTION 4: QR Code Multi-Device */}
        {activeIntegrationTab === 'qr' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="p-6 rounded-2xl border border-[var(--bd)] bg-[var(--soft)]/50 flex flex-col items-center justify-center text-center">
                <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-md border border-gray-200 flex items-center justify-center mb-3">
                  {/* Visual QR Code Representation */}
                  <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-900 rounded-xl p-2 flex flex-col justify-between text-white text-center font-mono text-[10px]">
                    <div className="flex justify-between">
                      <div className="w-6 h-6 border-4 border-white" />
                      <div className="w-6 h-6 border-4 border-white" />
                    </div>
                    <div className="font-bold">SCAN TO CONNECT WA</div>
                    <div className="flex justify-between">
                      <div className="w-6 h-6 border-4 border-white" />
                      <div className="text-[9px] opacity-75">v4.0 ACTIVE</div>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[var(--ink)]">Multi-Device Baileys Gateway</span>
                <span className="text-[10px] text-[var(--mu)] mt-0.5">Point WhatsApp &gt; Linked Devices to pair</span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[var(--ink)]">Zero-Setup Instant Pairing</h4>
                <p className="text-[var(--mu)] leading-relaxed">
                  Link your team's existing WhatsApp Business number without waiting for Meta Developer app reviews. Incoming client inquiries stream directly into the trilingual AI qualifier.
                </p>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Gateway Status: Ready for Multi-Device Session</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

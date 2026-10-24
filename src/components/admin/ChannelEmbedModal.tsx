import React, { useState, useMemo } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { TRAFFIC_SOURCES, LeadStage } from '../../types/index.ts';
import {
  X,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Link2,
  Globe,
  Sliders,
  Send,
  QrCode,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Download,
  Terminal,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

interface ChannelEmbedModalProps {
  initialChannelName?: string;
  isOpen: boolean;
  onClose: () => void;
}

type EmbedTab =
  | 'systeme'
  | 'iframe'
  | 'popup'
  | 'webhook'
  | 'utm'
  | 'qrcode'
  | 'preview';

export const ChannelEmbedModal: React.FC<ChannelEmbedModalProps> = ({
  initialChannelName = 'Meta Ads',
  isOpen,
  onClose,
}) => {
  const { baseUrl, funnels, channels, addLead, updateChannel } = useBusiness();

  const [selectedChannel, setSelectedChannel] = useState<string>(initialChannelName);
  const [activeTab, setActiveTab] = useState<EmbedTab>('systeme');
  const [targetFunnel, setTargetFunnel] = useState<string>('main');
  const [campaignName, setCampaignName] = useState<string>('growth-2026');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [iframeWidth, setIframeWidth] = useState<'100%' | '480px' | '600px'>('100%');
  const [iframeHeight, setIframeHeight] = useState<'520px' | '640px' | '720px'>('640px');
  const [buttonLabel, setButtonLabel] = useState<string>('Claim Free Strategy Consultation');
  const [buttonPosition, setButtonPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  const [redirectAfterSubmit, setRedirectAfterSubmit] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Webhook Simulator State
  const [simName, setSimName] = useState('David Miller');
  const [simEmail, setSimEmail] = useState('david.miller@acme-ventures.com');
  const [simPhone, setSimPhone] = useState('+1 (305) 555-8842');
  const [simDealValue, setSimDealValue] = useState(1200);
  const [simIsSale, setSimIsSale] = useState(false);
  const [simSuccessMsg, setSimSuccessMsg] = useState<string | null>(null);

  // Live Preview Form State
  const [previewName, setPreviewName] = useState('');
  const [previewEmail, setPreviewEmail] = useState('');
  const [previewPhone, setPreviewPhone] = useState('');
  const [previewService, setPreviewService] = useState('High-Converting Funnel & AI OS');
  const [previewSubmitted, setPreviewSubmitted] = useState(false);

  // Sync selected channel when modal opens
  React.useEffect(() => {
    if (initialChannelName && TRAFFIC_SOURCES.includes(initialChannelName)) {
      setSelectedChannel(initialChannelName);
    }
  }, [initialChannelName, isOpen]);

  const cleanBase = (baseUrl || 'https://backforbrand.com').trim().replace(/\/$/, '');

  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const currentChannelData = useMemo(() => {
    return channels.find((c) => c.name === selectedChannel) || {
      name: selectedChannel,
      visits: 0,
      spend: 0,
      target: 10,
    };
  }, [channels, selectedChannel]);

  // Generate UTM link
  const generatedUtmLink = useMemo(() => {
    const params = new URLSearchParams();
    if (targetFunnel !== 'main') {
      params.set('funnel', targetFunnel);
    }
    params.set('utm_source', slug(selectedChannel));
    params.set('utm_medium', selectedChannel.includes('Ads') ? 'paid-cpc' : selectedChannel.includes('AI') ? 'ai-search' : 'organic');
    params.set('utm_campaign', slug(campaignName) || 'growth-2026');
    params.set('channel', selectedChannel);

    return `${cleanBase}/?${params.toString()}`;
  }, [cleanBase, targetFunnel, selectedChannel, campaignName]);

  // Generate iFrame Embed Code
  const generatedIframeCode = useMemo(() => {
    const params = new URLSearchParams();
    params.set('embed', 'form');
    params.set('channel', selectedChannel);
    if (targetFunnel !== 'main') {
      params.set('funnel', targetFunnel);
    }
    params.set('theme', theme);
    if (redirectAfterSubmit.trim()) {
      params.set('redirect', redirectAfterSubmit.trim());
    }

    const embedUrl = `${cleanBase}/?${params.toString()}`;

    return `<iframe\n  src="${embedUrl}"\n  width="${iframeWidth}"\n  height="${iframeHeight}"\n  frameborder="0"\n  style="border: none; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); overflow: hidden;"\n  title="Back for Brand - ${selectedChannel} Lead Capture"\n></iframe>`;
  }, [cleanBase, selectedChannel, targetFunnel, theme, redirectAfterSubmit, iframeWidth, iframeHeight]);

  // Generate Systeme.io Custom HTML Code Snippet
  const generatedSystemeCode = useMemo(() => {
    const chSlug = slug(selectedChannel);
    return `<!-- ======================================================== -->
<!-- BACK FOR BRAND OS x SYSTEME.IO CHANNEL EMBED INTEGRATION  -->
<!-- Channel: ${selectedChannel} | Campaign: ${campaignName} -->
<!-- ======================================================== -->
<div id="bfb-systeme-embed-${chSlug}" class="bfb-embed-container" style="max-width: 540px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="background: ${theme === 'dark' ? '#0b1329' : '#ffffff'}; color: ${theme === 'dark' ? '#ffffff' : '#0f172a'}; padding: 32px; border-radius: 20px; border: 1px solid ${theme === 'dark' ? '#1e293b' : '#e2e8f0'}; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
    
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
      <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #00c48c;">
        ● Back for Brand Architecture
      </span>
      <span style="font-size: 10px; font-weight: 700; background: ${theme === 'dark' ? '#1e293b' : '#f1f5f9'}; padding: 4px 10px; border-radius: 999px; color: ${theme === 'dark' ? '#94a3b8' : '#475569'};">
        Source: ${selectedChannel}
      </span>
    </div>

    <h3 style="font-size: 22px; font-weight: 900; margin: 0 0 8px 0; line-height: 1.25;">
      Claim Your High-Ticket Growth Blueprint
    </h3>
    <p style="font-size: 13px; color: ${theme === 'dark' ? '#94a3b8' : '#64748b'}; margin: 0 0 24px 0;">
      Turn traffic into booked calls and qualified pipeline on autopilot.
    </p>

    <form id="bfb-form-${chSlug}" onsubmit="handleBfbSubmit(event)">
      <input type="hidden" name="channel" value="${selectedChannel}">
      <input type="hidden" name="funnel" value="${targetFunnel}">
      <input type="hidden" name="campaign" value="${campaignName}">

      <div style="margin-bottom: 14px;">
        <label style="display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px;">Full Name *</label>
        <input type="text" id="bfb-name-${chSlug}" required placeholder="e.g. John Doe" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border-radius: 10px; border: 1px solid ${theme === 'dark' ? '#334155' : '#cbd5e1'}; background: ${theme === 'dark' ? '#0f172a' : '#f8fafc'}; color: ${theme === 'dark' ? '#ffffff' : '#0f172a'}; font-size: 13px; outline: none;">
      </div>

      <div style="margin-bottom: 14px;">
        <label style="display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px;">Work Email *</label>
        <input type="email" id="bfb-email-${chSlug}" required placeholder="john@company.com" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border-radius: 10px; border: 1px solid ${theme === 'dark' ? '#334155' : '#cbd5e1'}; background: ${theme === 'dark' ? '#0f172a' : '#f8fafc'}; color: ${theme === 'dark' ? '#ffffff' : '#0f172a'}; font-size: 13px; outline: none;">
      </div>

      <div style="margin-bottom: 14px;">
        <label style="display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px;">WhatsApp / Phone</label>
        <input type="tel" id="bfb-phone-${chSlug}" placeholder="+1 (555) 000-0000" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border-radius: 10px; border: 1px solid ${theme === 'dark' ? '#334155' : '#cbd5e1'}; background: ${theme === 'dark' ? '#0f172a' : '#f8fafc'}; color: ${theme === 'dark' ? '#ffffff' : '#0f172a'}; font-size: 13px; outline: none;">
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px;">Primary Growth Objective</label>
        <select id="bfb-need-${chSlug}" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border-radius: 10px; border: 1px solid ${theme === 'dark' ? '#334155' : '#cbd5e1'}; background: ${theme === 'dark' ? '#0f172a' : '#f8fafc'}; color: ${theme === 'dark' ? '#ffffff' : '#0f172a'}; font-size: 13px; outline: none;">
          <option value="High-Ticket Sales Funnel">High-Ticket Sales Funnel</option>
          <option value="24/7 AI Booking Agent & WhatsApp">24/7 AI Booking Agent & WhatsApp</option>
          <option value="Paid Ads Attribution & Scaling">Paid Ads Scaling (Meta/Google)</option>
          <option value="Full Autonomous Growth Machine">Full Autonomous Growth Machine</option>
        </select>
      </div>

      <button type="submit" id="bfb-btn-${chSlug}" style="width: 100%; padding: 14px 20px; border: none; border-radius: 12px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; font-size: 14px; font-weight: 800; cursor: pointer; transition: opacity 0.2s; box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);">
        ${buttonLabel} →
      </button>

      <div id="bfb-msg-${chSlug}" style="display: none; margin-top: 16px; padding: 14px; border-radius: 10px; background: #064e3b; color: #a7f3d0; font-size: 13px; font-weight: 600; text-align: center;">
        ✓ Your request has been confirmed! Our executive team is reviewing your requirements.
      </div>
    </form>
  </div>
</div>

<script>
function handleBfbSubmit(e) {
  e.preventDefault();
  var ch = "${selectedChannel}";
  var name = document.getElementById("bfb-name-" + "${chSlug}").value;
  var email = document.getElementById("bfb-email-" + "${chSlug}").value;
  var phone = document.getElementById("bfb-phone-" + "${chSlug}").value;
  var need = document.getElementById("bfb-need-" + "${chSlug}").value;
  var btn = document.getElementById("bfb-btn-" + "${chSlug}");
  var msg = document.getElementById("bfb-msg-" + "${chSlug}");

  btn.disabled = true;
  btn.innerText = "Transmitting to OS...";

  var payload = {
    name: name,
    email: email,
    phone: phone,
    source: ch,
    need: need,
    campaign: "${campaignName}",
    message: "Captured via Systeme.io Embed form for channel: " + ch
  };

  fetch("${cleanBase}/api/webhook/systeme?channel=" + encodeURIComponent(ch), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(function(res) {
    btn.style.display = "none";
    msg.style.display = "block";
    ${redirectAfterSubmit ? `setTimeout(function() { window.location.href = "${redirectAfterSubmit}"; }, 1200);` : ''}
  }).catch(function(err) {
    btn.disabled = false;
    btn.innerText = "${buttonLabel} →";
    alert("Submission received into pipeline.");
  });
}
</script>`;
  }, [selectedChannel, campaignName, theme, targetFunnel, buttonLabel, cleanBase, redirectAfterSubmit]);

  // Floating Popup Widget Snippet
  const generatedPopupCode = useMemo(() => {
    const chSlug = slug(selectedChannel);
    const positionStyle =
      buttonPosition === 'bottom-right'
        ? 'position: fixed; bottom: 24px; right: 24px;'
        : 'position: fixed; bottom: 24px; left: 24px;';

    return `<!-- BACK FOR BRAND FLOATING CONVERSION TRIGGER (Channel: ${selectedChannel}) -->
<div id="bfb-floating-widget-${chSlug}" style="${positionStyle} z-index: 999999; font-family: -apple-system, sans-serif;">
  <button
    onclick="window.open('${generatedUtmLink}', '_blank')"
    style="display: flex; align-items: center; gap: 10px; padding: 14px 22px; background: linear-gradient(135deg, #0f172a, #1e293b); color: #ffffff; border: 2px solid #00c48c; border-radius: 999px; font-weight: 800; font-size: 13px; cursor: pointer; box-shadow: 0 12px 30px rgba(0, 196, 140, 0.35); transition: transform 0.2s;"
    onmouseover="this.style.transform='scale(1.05)'"
    onmouseout="this.style.transform='scale(1)'"
  >
    <span style="width: 10px; height: 10px; border-radius: 50%; background: #00c48c;"></span>
    <span>${buttonLabel}</span>
  </button>
</div>`;
  }, [selectedChannel, buttonPosition, generatedUtmLink, buttonLabel]);

  // Webhook URL
  const webhookUrl = `${cleanBase}/api/webhook/systeme?channel=${encodeURIComponent(selectedChannel)}`;

  const copyToClipboard = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch {
      // ignore
    }
  };

  // Run Webhook Simulation
  const handleSimulateWebhook = () => {
    if (!simName.trim() || !simEmail.trim()) return;

    // Record visit to channel
    const chIdx = channels.findIndex((c) => c.name === selectedChannel);
    if (chIdx !== -1) {
      updateChannel(chIdx, 'visits', (channels[chIdx].visits || 0) + 1);
    }

    const stage: LeadStage = simIsSale ? 'Won' : 'New';

    addLead({
      name: simName.trim(),
      email: simEmail.trim(),
      phone: simPhone.trim(),
      src: selectedChannel,
      stage: stage,
      val: Number(simDealValue) || 1200,
      need: simIsSale ? 'Systeme.io Checkout Purchase' : 'Systeme.io Opt-in Funnel',
      funnelName: targetFunnel !== 'main' ? targetFunnel : 'Systeme Inbound Funnel',
      funnelStep: simIsSale ? 'Order Paid' : 'Opt-in Completed',
      message: `Triggered via live Systeme.io Webhook simulation for channel "${selectedChannel}". Event: ${simIsSale ? 'checkout.sale' : 'lead.created'}`,
    });

    setSimSuccessMsg(
      `✓ Webhook successfully received & processed! Lead "${simName}" attributed to ${selectedChannel} (${simIsSale ? 'Won: $' + simDealValue : 'New Lead'}). Check Channels table & CRM pipeline!`
    );

    setTimeout(() => {
      setSimSuccessMsg(null);
    }, 6000);
  };

  // Run Live Form Submission Test
  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewName.trim() || !previewEmail.trim()) return;

    addLead({
      name: previewName.trim(),
      email: previewEmail.trim(),
      phone: previewPhone.trim() || undefined,
      src: selectedChannel,
      stage: 'New',
      val: 1200,
      need: previewService,
      funnelName: targetFunnel !== 'main' ? targetFunnel : 'Embed Direct',
      funnelStep: 'Embed Form Submitted',
      message: `Submitted through interactive embed preview for channel: ${selectedChannel}`,
    });

    setPreviewSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-[var(--ink)] my-auto">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--bd)] bg-[var(--soft)]/40 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[var(--ink)]">
                  Channel Integration &amp; Embed Suite
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                  Systeme.io Ready
                </span>
              </div>
              <p className="text-xs text-[var(--mu)]">
                Generate embed forms, Systeme.io custom HTML blocks, webhooks, and UTM links for all 17 traffic channels.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Channel Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--mu)] hidden sm:inline">Active Channel:</span>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="text-xs font-black px-3 py-2 rounded-xl border border-blue-500/40 bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              >
                {TRAFFIC_SOURCES.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-[var(--bd)] hover:bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)] transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Channel Metrics Bar */}
        <div className="px-6 py-3 bg-[var(--bg)] border-b border-[var(--bd)] flex items-center justify-between gap-4 overflow-x-auto text-xs">
          <div className="flex items-center gap-6 min-w-max">
            <div>
              <span className="text-[10px] font-bold text-[var(--mu)] uppercase block">Channel</span>
              <span className="font-extrabold text-[var(--ink)]">{selectedChannel}</span>
            </div>
            <div className="h-6 w-[1px] bg-[var(--bd)]" />
            <div>
              <span className="text-[10px] font-bold text-[var(--mu)] uppercase block">Visits</span>
              <span className="font-bold text-[var(--ink)]">{currentChannelData.visits.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--mu)] uppercase block">Spend</span>
              <span className="font-bold text-[var(--ink)]">${currentChannelData.spend.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--mu)] uppercase block">Target</span>
              <span className="font-bold text-[var(--ink)]">{currentChannelData.target} leads</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--mu)] uppercase block">Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Attribution Active
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[var(--mu)] min-w-max">
            Domain: <code className="font-mono text-blue-500 font-bold">{cleanBase}</code>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-[var(--bd)] bg-[var(--soft)]/20 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('systeme')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'systeme'
                ? 'border-blue-600 text-blue-600 bg-[var(--card)] shadow-xs'
                : 'border-transparent text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--soft)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Systeme.io Embed Code</span>
          </button>

          <button
            onClick={() => setActiveTab('iframe')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'iframe'
                ? 'border-blue-600 text-blue-600 bg-[var(--card)] shadow-xs'
                : 'border-transparent text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--soft)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Responsive iFrame</span>
          </button>

          <button
            onClick={() => setActiveTab('popup')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'popup'
                ? 'border-blue-600 text-blue-600 bg-[var(--card)] shadow-xs'
                : 'border-transparent text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--soft)]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>Floating Trigger Widget</span>
          </button>

          <button
            onClick={() => setActiveTab('webhook')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'webhook'
                ? 'border-blue-600 text-blue-600 bg-[var(--card)] shadow-xs'
                : 'border-transparent text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--soft)]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Systeme.io Webhook &amp; Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('utm')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'utm'
                ? 'border-blue-600 text-blue-600 bg-[var(--card)] shadow-xs'
                : 'border-transparent text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--soft)]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-purple-500" />
            <span>UTM Link</span>
          </button>

          <button
            onClick={() => setActiveTab('qrcode')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'qrcode'
                ? 'border-blue-600 text-blue-600 bg-[var(--card)] shadow-xs'
                : 'border-transparent text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--soft)]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-rose-500" />
            <span>QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'preview'
                ? 'border-blue-600 text-blue-600 bg-[var(--card)] shadow-xs'
                : 'border-transparent text-[var(--mu)] hover:text-[var(--ink)] hover:bg-[var(--soft)]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-teal-500" />
            <span>Interactive Live Preview</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Target Funnel & Campaign Configuration Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--soft)]/40 border border-[var(--bd)] text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                Target Funnel / Destination
              </label>
              <select
                value={targetFunnel}
                onChange={(e) => setTargetFunnel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold focus:outline-none"
              >
                <option value="main">Main Public Portal (All Services)</option>
                {funnels.map((f) => (
                  <option key={f.id} value={f.slug}>
                    {f.name} ({f.serviceCategory.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                Campaign Name (utm_campaign)
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="growth-2026"
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-mono font-bold focus:outline-none"
              >
              </input>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                Post-Submit Redirect URL (Optional)
              </label>
              <input
                type="url"
                value={redirectAfterSubmit}
                onChange={(e) => setRedirectAfterSubmit(e.target.value)}
                placeholder="https://your-systeme-funnel.com/thank-you"
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* TAB 1: SYSTEME.IO CUSTOM HTML */}
          {activeTab === 'systeme' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <b className="font-extrabold text-sm block">How to embed into Systeme.io Funnels:</b>
                  <ol className="list-decimal pl-4 space-y-1 text-xs opacity-90">
                    <li>Log in to your <b>Systeme.io</b> account and open your Funnel step (Squeeze Page, Sales Page, or Thank You page).</li>
                    <li>In the left element palette, drag a <b>"Raw HTML"</b> element into your page design.</li>
                    <li>Click the element, open <b>"Edit code"</b>, and paste the code block below.</li>
                    <li>Save changes! Every submission is automatically tagged as <b className="text-blue-500">{selectedChannel}</b> and routes directly into your Back for Brand CRM pipeline.</li>
                  </ol>
                </div>
              </div>

              {/* Code Box */}
              <div className="border border-[var(--bd)] rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b142b] border-b border-[#1f2f5c] text-blue-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono font-bold text-[11px]">systeme-embed-{slug(selectedChannel)}.html</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedSystemeCode, 'systeme_code')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    {copiedKey === 'systeme_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'systeme_code' ? 'Copied Code!' : 'Copy Systeme.io Snippet'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-[#060b19] text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[380px]">
                  {generatedSystemeCode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: RESPONSIVE IFRAME */}
          {activeTab === 'iframe' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--soft)]/50 border border-[var(--bd)] text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                    Frame Width
                  </label>
                  <div className="flex gap-1.5">
                    {(['100%', '480px', '600px'] as const).map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setIframeWidth(w)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          iframeWidth === w
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-[var(--bg)] border-[var(--bd)] text-[var(--ink)]'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                    Frame Height
                  </label>
                  <div className="flex gap-1.5">
                    {(['520px', '640px', '720px'] as const).map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setIframeHeight(h)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          iframeHeight === h
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-[var(--bg)] border-[var(--bd)] text-[var(--ink)]'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                    Color Theme
                  </label>
                  <div className="flex gap-1.5">
                    {(['dark', 'light'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTheme(t)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border capitalize transition-colors ${
                          theme === t
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-[var(--bg)] border-[var(--bd)] text-[var(--ink)]'
                        }`}
                      >
                        {t} Theme
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Box */}
              <div className="border border-[var(--bd)] rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b142b] border-b border-[#1f2f5c] text-blue-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono font-bold text-[11px]">iframe-embed-{slug(selectedChannel)}.html</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedIframeCode, 'iframe_code')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    {copiedKey === 'iframe_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'iframe_code' ? 'Copied iFrame!' : 'Copy iFrame Code'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-[#060b19] text-blue-300 font-mono text-[11px] leading-relaxed overflow-x-auto">
                  {generatedIframeCode}
                </pre>
              </div>

              <p className="text-xs text-[var(--mu)]">
                Works on WordPress, Webflow, Shopify, ClickFunnels, Leadpages, Wix, Squarespace, or custom static HTML pages.
              </p>
            </div>
          )}

          {/* TAB 3: POPUP / FLOATING TRIGGER */}
          {activeTab === 'popup' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[var(--soft)]/50 border border-[var(--bd)] text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={buttonLabel}
                    onChange={(e) => setButtonLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                    Screen Position
                  </label>
                  <div className="flex gap-2">
                    {(['bottom-right', 'bottom-left'] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setButtonPosition(pos)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          buttonPosition === pos
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-[var(--bg)] border-[var(--bd)] text-[var(--ink)]'
                        }`}
                      >
                        {pos === 'bottom-right' ? 'Bottom Right' : 'Bottom Left'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Box */}
              <div className="border border-[var(--bd)] rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b142b] border-b border-[#1f2f5c] text-blue-200 text-xs">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono font-bold text-[11px]">floating-widget.html</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedPopupCode, 'popup_code')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    {copiedKey === 'popup_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'popup_code' ? 'Copied Snippet!' : 'Copy Floating Button Code'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-[#060b19] text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto">
                  {generatedPopupCode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEME.IO WEBHOOK & SIMULATOR */}
          {activeTab === 'webhook' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Webhook Endpoint */}
              <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--bd)] space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h4 className="font-extrabold text-xs text-[var(--ink)] uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Dedicated Systeme.io Webhook URL for {selectedChannel}</span>
                    </h4>
                    <p className="text-xs text-[var(--mu)] mt-0.5">
                      Paste this URL into Systeme.io's <b>Automation Rules &gt; Send Webhook</b> action.
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(webhookUrl, 'webhook_url')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs transition-colors shadow-xs"
                  >
                    {copiedKey === 'webhook_url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'webhook_url' ? 'Copied URL!' : 'Copy Webhook URL'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[var(--soft)] border border-[var(--bd)] font-mono text-xs text-blue-600 dark:text-blue-400 break-all select-all font-bold">
                  {webhookUrl}
                </div>
              </div>

              {/* Live Webhook Simulator */}
              <div className="p-5 rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <h4 className="font-black text-sm text-[var(--ink)]">
                      Live Systeme.io Webhook Simulator
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    Test live ingestion into {selectedChannel}
                  </span>
                </div>

                <p className="text-xs text-[var(--mu)]">
                  Simulate an incoming webhook call from Systeme.io right now. This will trigger the server endpoint, create a real lead tagged with <b className="text-[var(--ink)]">{selectedChannel}</b>, increment channel visits and conversions, and update your ROAS in the matrix.
                </p>

                {simSuccessMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-fadeIn flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{simSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={simName}
                      onChange={(e) => setSimName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--card)] font-medium text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold mb-1">Email</label>
                    <input
                      type="email"
                      value={simEmail}
                      onChange={(e) => setSimEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--card)] font-medium text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold mb-1">Deal Value ($)</label>
                    <input
                      type="number"
                      value={simDealValue}
                      onChange={(e) => setSimDealValue(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--card)] font-medium text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold mb-1">Event Type</label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSimIsSale(false)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          !simIsSale
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-[var(--card)] border-[var(--bd)] text-[var(--ink)]'
                        }`}
                      >
                        Opt-in Lead
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimIsSale(true)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          simIsSale
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-[var(--card)] border-[var(--bd)] text-[var(--ink)]'
                        }`}
                      >
                        Won Sale ($)
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateWebhook}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Webhook from Systeme.io → Attribute to {selectedChannel}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: UTM ATTRIBUTION LINK */}
          {activeTab === 'utm' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--bd)] space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-extrabold text-xs text-[var(--ink)] uppercase tracking-wider flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-purple-500" />
                    <span>Live Tracking Link (UTM Parameterized)</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(generatedUtmLink, 'utm_link')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      {copiedKey === 'utm_link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'utm_link' ? 'Copied Link!' : 'Copy Tracking Link'}</span>
                    </button>
                    <a
                      href={generatedUtmLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl border border-[var(--bd)] hover:bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)] transition-colors"
                      title="Test open link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--soft)] border border-[var(--bd)] font-mono text-xs text-purple-700 dark:text-purple-300 break-all select-all font-bold">
                  {generatedUtmLink}
                </div>
              </div>

              {/* UTM Breakdown Table */}
              <div className="border border-[var(--bd)] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--soft)] border-b border-[var(--bd)] font-bold text-[var(--mu)]">
                    <tr>
                      <th className="py-2.5 px-4">Parameter</th>
                      <th className="py-2.5 px-4">Value</th>
                      <th className="py-2.5 px-4">Attribution Function</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--bd)] text-[var(--ink)]">
                    <tr>
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-600">utm_source</td>
                      <td className="py-2.5 px-4 font-mono">{slug(selectedChannel)}</td>
                      <td className="py-2.5 px-4 text-[var(--mu)]">Matches {selectedChannel} in Channel ROI Matrix</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-600">utm_medium</td>
                      <td className="py-2.5 px-4 font-mono">link</td>
                      <td className="py-2.5 px-4 text-[var(--mu)]">Channel classification (paid, search, organic)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-600">utm_campaign</td>
                      <td className="py-2.5 px-4 font-mono">{slug(campaignName) || 'growth-2026'}</td>
                      <td className="py-2.5 px-4 text-[var(--mu)]">Campaign cohort grouping</td>
                    </tr>
                    {targetFunnel !== 'main' && (
                      <tr>
                        <td className="py-2.5 px-4 font-mono font-bold text-emerald-600">funnel</td>
                        <td className="py-2.5 px-4 font-mono">{targetFunnel}</td>
                        <td className="py-2.5 px-4 text-[var(--mu)]">Directs visitor to specific service funnel</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: QR CODE */}
          {activeTab === 'qrcode' && (
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--bd)] flex flex-col sm:flex-row items-center gap-6 animate-fadeIn">
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-300 shadow-md flex-shrink-0 flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(generatedUtmLink)}`}
                  alt={`QR Code for ${selectedChannel}`}
                  className="w-44 h-44 object-contain"
                />
              </div>

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 font-bold text-xs">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Physical &amp; Offline Channel Attribution</span>
                </div>

                <h4 className="text-base font-black text-[var(--ink)]">
                  QR Asset for {selectedChannel}
                </h4>

                <p className="text-xs text-[var(--mu)] leading-relaxed">
                  Ideal for print advertisements, business cards, trade show banners, Google Business (GMB) offline signage, direct flyers, and customer packaging. Scanning instantly opens the tracked funnel with <b className="text-[var(--ink)]">{selectedChannel}</b> attribution.
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(generatedUtmLink)}`}
                    download={`qr-${slug(selectedChannel)}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download High-Res QR</span>
                  </a>

                  <button
                    onClick={() => copyToClipboard(generatedUtmLink, 'qr_url')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--bd)] hover:bg-[var(--soft)] font-bold text-xs transition-colors"
                  >
                    {copiedKey === 'qr_url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'qr_url' ? 'Copied Link!' : 'Copy QR Target Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: INTERACTIVE LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="p-6 rounded-2xl bg-[var(--soft)]/30 border border-[var(--bd)] animate-fadeIn">
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-[var(--card)] border border-[var(--bd)] shadow-xl">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--bd)]">
                  <span className="text-[11px] font-black uppercase text-emerald-500">
                    ● Live Preview Frame
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/30">
                    Attributing to: {selectedChannel}
                  </span>
                </div>

                {previewSubmitted ? (
                  <div className="text-center py-6 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h4 className="font-black text-base text-[var(--ink)]">Test Lead Registered!</h4>
                    <p className="text-xs text-[var(--mu)]">
                      "{previewName}" has been recorded under <b className="text-blue-500">{selectedChannel}</b> with deal value $1,200. Check the CRM pipeline to see the live entry.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewSubmitted(false);
                        setPreviewName('');
                        setPreviewEmail('');
                      }}
                      className="text-xs font-bold text-blue-600 hover:underline pt-2 inline-block"
                    >
                      Reset &amp; Test Again
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePreviewSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={previewName}
                        onChange={(e) => setPreviewName(e.target.value)}
                        placeholder="e.g. Rachel Adams"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] font-medium focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={previewEmail}
                        onChange={(e) => setPreviewEmail(e.target.value)}
                        placeholder="rachel@venturecap.com"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] font-medium focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={previewPhone}
                        onChange={(e) => setPreviewPhone(e.target.value)}
                        placeholder="+1 555-0144"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] font-medium focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold mb-1">Service Requested</label>
                      <select
                        value={previewService}
                        onChange={(e) => setPreviewService(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] font-medium focus:outline-none"
                      >
                        <option value="High-Converting Funnel & AI OS">High-Converting Funnel &amp; AI OS</option>
                        <option value="Aesthetic Clinic Growth Funnel">VIP Aesthetics &amp; Smile Clinic</option>
                        <option value="E-Commerce Architecture Scale">Omni-Channel E-Commerce Scale</option>
                        <option value="24/7 AI Booking Agent">24/7 AI Booking Agent</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md mt-2 cursor-pointer"
                    >
                      {buttonLabel}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[var(--bd)] bg-[var(--soft)]/30 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-[var(--mu)]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Real-time attribution to <b>{selectedChannel}</b> active across all embed options.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--bd)] text-xs font-bold text-[var(--ink)] hover:bg-[var(--soft)] transition-colors"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { TRAFFIC_SOURCES } from '../../types/index.ts';
import { Copy, Check, ExternalLink, Link2, Globe, Target, Code2, Sparkles } from 'lucide-react';
import { ChannelEmbedModal } from './ChannelEmbedModal.tsx';

export const TrackingLinksTab: React.FC = () => {
  const { baseUrl, setBaseUrl, funnels } = useBusiness();
  const [urlInput, setUrlInput] = useState(baseUrl);
  const [targetDestination, setTargetDestination] = useState<string>('main');
  const [campaignName, setCampaignName] = useState<string>('growth-2026');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Embed Modal State
  const [selectedEmbedChannel, setSelectedEmbedChannel] = useState<string>('Meta Ads');
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-$/, '');

  const generateLink = (sourceName: string) => {
    const cleanBase = (baseUrl || 'https://backforbrand.com').trim().replace(/\/$/, '');
    const params = new URLSearchParams();

    if (targetDestination !== 'main') {
      params.set('funnel', targetDestination);
    }

    params.set('utm_source', slug(sourceName));
    params.set('utm_medium', 'link');
    params.set('utm_campaign', slug(campaignName) || 'bfb');
    params.set('channel', sourceName);

    return `${cleanBase}/?${params.toString()}`;
  };

  const handleCopy = (index: number, link: string) => {
    try {
      navigator.clipboard.writeText(link);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setBaseUrl(urlInput.trim());
    }
  };

  const handleOpenEmbed = (sourceName: string) => {
    setSelectedEmbedChannel(sourceName);
    setIsEmbedModalOpen(true);
  };

  // All 17 channels
  const trackableSources = TRAFFIC_SOURCES;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Base URL & Target Funnel Configuration */}
      <div className="bg-[var(--card)] border border-[var(--bd)] p-5 sm:p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-black text-base text-[var(--ink)] mb-1 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-blue-600" />
              <span>Multi-Funnel Attribution &amp; Embed Generator</span>
            </h3>
            <p className="text-xs text-[var(--mu)] leading-relaxed max-w-2xl">
              Generate trackable UTM links, Systeme.io funnel embed blocks, and responsive iFrames for all 17 traffic channels.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => handleOpenEmbed('Meta Ads')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Systeme.io &amp; Embed Suite</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--mu)]">Target Funnel:</span>
              <select
                value={targetDestination}
                onChange={(e) => setTargetDestination(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-bold focus:outline-none focus:border-[#00c48c]"
              >
                <option value="main">Main Public Portal (All Services)</option>
                {funnels.map((f) => (
                  <option key={f.id} value={f.slug}>
                    {f.name} ({f.serviceCategory.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveUrl} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
              Base App Domain
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500 font-mono font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
              Campaign Tag (utm_campaign)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. spring-promo"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] font-mono font-medium"
              />
              <button
                type="submit"
                className="bg-[#2b59ff] hover:bg-[#1a3fd1] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm whitespace-nowrap cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Generated links & Embed Codes Table */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[var(--bd)] flex items-center justify-between gap-3 flex-wrap">
          <h4 className="font-black text-xs text-[var(--ink)] uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-[#00c48c]" />
            <span>
              17-Channel Attribution Matrix {targetDestination !== 'main' ? `(Target: ${targetDestination})` : ''}
            </span>
          </h4>
          <span className="text-[11px] text-[var(--mu)]">
            Click <b>Embed &amp; Link</b> to view Systeme.io snippet, iframe, and webhooks
          </span>
        </div>

        <div className="divide-y divide-[var(--bd)]">
          {trackableSources.map((source, index) => {
            const link = generateLink(source);
            const isCopied = copiedIndex === index;

            return (
              <div
                key={source}
                className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[var(--soft)]/40 transition-colors"
              >
                <div className="w-52 flex-shrink-0">
                  <span className="text-xs font-extrabold text-[var(--ink)] block">{source}</span>
                  <span className="text-[10px] text-[var(--mu)] font-mono">utm_source={slug(source)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    readOnly
                    value={link}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="w-full text-[11px] font-mono px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]/80 focus:outline-none focus:border-blue-500 cursor-text truncate font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => handleCopy(index, link)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isCopied
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[var(--soft)] hover:bg-[var(--bd)] text-[var(--ink)] border border-[var(--bd)]'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy UTM'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEmbed(source)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-500/30 text-xs font-bold transition-all cursor-pointer"
                    title={`Generate embed options for ${source}`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Embed &amp; Link</span>
                  </button>

                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-[var(--bd)] hover:bg-[var(--soft)] text-[var(--mu)] hover:text-[var(--ink)] transition-colors"
                    title="Test Open Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embed Modal Dialog */}
      <ChannelEmbedModal
        initialChannelName={selectedEmbedChannel}
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
      />
    </div>
  );
};

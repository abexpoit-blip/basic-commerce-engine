import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink, 
  Zap, 
  Globe2,
  Lock,
  ShoppingBag,
  Briefcase,
  Play
} from 'lucide-react';
import { ShortLink } from '@/lib/types';

interface QuickShortenHeroProps {
  onQuickCreate: (data: {
    targetUrl: string;
    slug?: string;
    preset: 'fb-strict' | 'adsterra-direct' | 'ecommerce-lead';
  }) => Promise<ShortLink>;
  onSelectForSimulation: (slug: string) => void;
}

export default function QuickShortenHero({ onQuickCreate, onSelectForSimulation }: QuickShortenHeroProps) {
  const [targetUrl, setTargetUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [preset, setPreset] = useState<'fb-strict' | 'adsterra-direct' | 'ecommerce-lead'>('fb-strict');
  const [selectedDomain, setSelectedDomain] = useState('shop.basictrickhub.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdLink, setCreatedLink] = useState<ShortLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const getBaseUrl = () => {
    return `https://${selectedDomain}`;
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreatedLink(null);

    if (!targetUrl.trim() || !targetUrl.startsWith('http')) {
      setError('Please enter a valid URL starting with https:// or http://');
      return;
    }

    try {
      setLoading(true);
      const link = await onQuickCreate({
        targetUrl: targetUrl.trim(),
        slug: customSlug.trim() || undefined,
        preset,
      });
      setCreatedLink(link);
      setTargetUrl('');
      setCustomSlug('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate link');
    } finally {
      setLoading(false);
    }
  };

  const copyShortUrl = (slug: string) => {
    const url = `${getBaseUrl()}/r/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm">
      {/* Background Soft Mesh Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-teal-50/50 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Title Header & Domain Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Domain: <strong>shop.basictrickhub.com</strong></span>
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                0% Traffic Drop Routing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Facebook Ads Short Link
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
              Generate protected short links under <strong className="text-slate-800">shop.basictrickhub.com</strong>. Facebook review crawlers automatically see policy-compliant safe pages while real buyers reach your offer instantly.
            </p>
          </div>

          {/* Domain Selector Pill */}
          <div className="bg-slate-50 border border-slate-200 p-1.5 rounded-2xl flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-semibold px-2 text-[11px]">Domain:</span>
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value)}
              className="bg-white border border-slate-200 font-mono text-xs text-indigo-700 font-bold px-2.5 py-1.5 rounded-xl focus:outline-none shadow-xs"
            >
              <option value="shop.basictrickhub.com">shop.basictrickhub.com (Custom Domain)</option>
              <option value="fb-ads-safe-shortener.vercel.app">fb-ads-safe-shortener.vercel.app</option>
            </select>
          </div>
        </div>

        {/* 1-Click Shortener Bar Form */}
        <form onSubmit={handleShorten} className="space-y-4">
          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner flex flex-col md:flex-row items-stretch gap-2 focus-within:border-indigo-500 focus-within:bg-white transition-all">
            {/* Target URL Input */}
            <div className="flex-1 flex items-center px-3 py-2">
              <Globe2 className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
              <input
                type="url"
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                placeholder="Paste destination URL (Sales landing page, Adsterra direct link, CPA offer)..."
                required
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-sans"
              />
            </div>

            {/* Custom Alias Input */}
            <div className="flex items-center bg-white rounded-xl px-3 py-2 border border-slate-200 md:w-52 shadow-sm">
              <span className="text-xs text-slate-400 font-mono">/r/</span>
              <input
                type="text"
                value={customSlug}
                onChange={e => setCustomSlug(e.target.value)}
                placeholder="custom-slug"
                className="w-full bg-transparent text-xs text-indigo-600 font-mono font-bold focus:outline-none pl-1 placeholder:text-slate-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Shorten & Armor</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                Preset Routing:
              </span>
              {[
                { id: 'fb-strict', label: 'Meta Ads Strict Review Armor', icon: ShieldCheck },
                { id: 'adsterra-direct', label: 'Adsterra Direct Safe Bridge', icon: Zap },
                { id: 'ecommerce-lead', label: 'E-Commerce Storefront Funnel', icon: ShoppingBag },
              ].map(p => {
                const Icon = p.icon;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPreset(p.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs border flex items-center gap-1.5 transition-all ${
                      preset === p.id
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Domain SSL: <strong className="text-emerald-600 font-semibold">Active & Encrypted (HTTPS)</strong></span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}
        </form>

        {/* Immediate Result Card */}
        {createdLink && (
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-sm space-y-3.5 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Campaign Link Generated & Armed on {selectedDomain}!
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Ready to paste into Meta Ads Manager. UTM parameters and click attribution are preserved.
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 w-fit">
                Policy Compliant
              </span>
            </div>

            {/* URL Display */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex-1 font-mono text-xs sm:text-sm text-indigo-600 font-bold px-2 select-all break-all">
                {getBaseUrl()}/r/{createdLink.slug}
              </div>

              <button
                onClick={() => copyShortUrl(createdLink.slug)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5 stroke-[2.5]" />}
                <span>{copied ? 'Copied!' : 'Copy Ad Link'}</span>
              </button>

              <button
                onClick={() => setShowQr(true)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                title="Mobile QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectForSimulation(createdLink.slug)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current text-indigo-600" />
                <span>Test in Simulator</span>
              </button>
            </div>

            {/* QR Modal */}
            {showQr && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                onClick={() => setShowQr(false)}
              >
                <div 
                  className="bg-white border border-slate-200 rounded-3xl p-6 text-center max-w-xs w-full shadow-xl"
                  onClick={e => e.stopPropagation()}
                >
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Mobile Test QR</h4>
                  <p className="text-xs text-slate-500 mb-4 font-mono">{getBaseUrl()}/r/{createdLink.slug}</p>
                  <div className="bg-slate-50 p-3.5 rounded-2xl inline-block mb-4 border border-slate-200">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${getBaseUrl()}/r/${createdLink.slug}`)}`} 
                      alt="QR Code"
                      className="w-44 h-44"
                    />
                  </div>
                  <button
                    onClick={() => setShowQr(false)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

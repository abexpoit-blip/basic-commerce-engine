import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  Edit3, 
  Trash2, 
  QrCode, 
  Eye,
  SlidersHorizontal,
  Play,
  Globe2,
  Users,
  Bot,
  Activity,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Clock,
  Smartphone,
  Laptop,
  Flame,
  Sparkles
} from 'lucide-react';
import { ShortLink, TrafficLog } from '@/lib/types';

interface LinkListProps {
  links: ShortLink[];
  onEdit: (link: ShortLink) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (link: ShortLink) => void;
  onSelectForSimulation: (slug: string) => void;
  onOpenCreateModal: () => void;
}

export default function LinkList({
  links,
  onEdit,
  onDelete,
  onToggleStatus,
  onSelectForSimulation,
  onOpenCreateModal,
}: LinkListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrSlug, setQrSlug] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDomain, setCurrentDomain] = useState('shop.basictrickhub.com');

  const getBaseUrl = () => {
    return `https://${currentDomain}`;
  };

  const copyToClipboard = (slug: string, id: string) => {
    const fullUrl = `${getBaseUrl()}/r/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLinks = links.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (links.length === 0) {
    return (
      <div className="p-16 text-center rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-7 h-7 text-indigo-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">No Campaign Links Created Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          Create your first shielded campaign link under <strong className="text-slate-700">shop.basictrickhub.com</strong> to protect your Facebook ads against policy crawlers.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          Create First Link
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Domain Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search campaigns by name, slug (/r/...), or target URL..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-sans"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={currentDomain}
              onChange={e => setCurrentDomain(e.target.value)}
              className="bg-transparent font-mono text-xs text-slate-700 font-bold focus:outline-none cursor-pointer"
            >
              <option value="shop.basictrickhub.com">shop.basictrickhub.com</option>
              <option value="fb-ads-safe-shortener.vercel.app">fb-ads-safe-shortener.vercel.app</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-semibold px-2">
            <span>{filteredLinks.length} Saved Campaigns</span>
          </div>
        </div>
      </div>

      {/* QR Code Quick Modal */}
      {qrSlug && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setQrSlug(null)}
        >
          <div 
            className="bg-white border border-slate-200 rounded-3xl p-6 text-center max-w-xs w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto mb-2">
              <QrCode className="w-5 h-5 text-indigo-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Mobile Test QR Code</h4>
            <p className="text-xs text-slate-500 mb-4 font-mono select-all break-all">{getBaseUrl()}/r/{qrSlug}</p>
            <div className="bg-slate-50 p-3.5 rounded-2xl inline-block mb-4 border border-slate-200">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${getBaseUrl()}/r/${qrSlug}`)}`} 
                alt="QR Code"
                className="w-44 h-44"
              />
            </div>
            <p className="text-[11px] text-slate-500 mb-4">
              Scan with your mobile camera to test ad click routing
            </p>
            <button
              onClick={() => setQrSlug(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Campaign Links List with Highlighted Latest Link */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLinks.map((link, index) => {
          const fullShortUrl = `${getBaseUrl()}/r/${link.slug}`;
          const isLatest = index === 0; // Mark the topmost (most recent) link
          
          const totalClicks = link.clicks?.total || 0;
          const humanClicks = link.clicks?.human || 0;
          const botClicks = link.clicks?.bot || 0;
          
          const humanPercent = totalClicks > 0 ? Math.round((humanClicks / totalClicks) * 100) : 0;
          const botPercent = totalClicks > 0 ? Math.round((botClicks / totalClicks) * 100) : 0;

          return (
            <div
              key={link.id}
              className={`rounded-2xl border transition-all overflow-hidden relative ${
                isLatest
                  ? 'bg-white border-indigo-400 shadow-md ring-2 ring-indigo-500/10'
                  : link.enabled
                  ? 'bg-white border-slate-200 hover:border-indigo-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              {/* Top Main Row */}
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left Column: Link Metadata & Actions */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {isLatest && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center gap-1 shadow-xs">
                          <Flame className="w-3 h-3 fill-amber-300 text-amber-300 animate-pulse" />
                          <span>Latest Campaign Link</span>
                        </span>
                      )}

                      <span className="font-extrabold text-sm text-slate-900">{link.title}</span>
                      
                      {/* Active Status Badge */}
                      <button
                        onClick={() => onToggleStatus(link)}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-colors ${
                          link.enabled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${link.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {link.enabled ? 'Shield Active' : 'Paused'}
                      </button>

                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                        {link.sensitivity === 'strict-fb' ? 'Strict FB Defense' : link.sensitivity === 'paranoid' ? 'Paranoid Mode' : 'Standard'}
                      </span>

                      <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        Safe: {link.safePageType}
                      </span>
                    </div>

                    {/* Short URL Box & Quick Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 font-mono text-xs text-indigo-700 font-bold select-all break-all shadow-inner">
                        {fullShortUrl}
                      </div>

                      <a
                        href={fullShortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs transition-colors flex items-center gap-1 font-bold shadow-xs active:scale-95"
                        title="Test Live Destination"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Test Link ➔</span>
                      </a>
                      
                      <button
                        onClick={() => copyToClipboard(link.slug, link.id)}
                        className="p-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs transition-colors flex items-center gap-1 font-semibold shadow-xs"
                        title="Copy Short URL"
                      >
                        {copiedId === link.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[11px] hidden sm:inline">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setQrSlug(link.slug)}
                        className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs transition-colors shadow-xs"
                        title="Show Mobile QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Destination Details */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="truncate max-w-md font-mono text-[11px] text-slate-600">
                        Target Destination: <strong className="text-slate-800 font-normal">{link.targetUrl}</strong>
                      </span>
                      {link.preserveUtms && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                          Meta Pixel & UTM Passthrough Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Per-Link Live Traffic Counters */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* Per-Link Visual Counter Card */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 min-w-[260px] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                          <Activity className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Campaign Traffic</span>
                        </span>
                        <span className="font-mono text-slate-900 font-black text-xs">
                          {totalClicks} Hits
                        </span>
                      </div>

                      {/* Real vs Bot Numbers */}
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-1.5">
                          <div className="text-[10px] font-bold text-emerald-700 uppercase">Real Humans</div>
                          <div className="text-base font-black text-emerald-700 font-mono">{humanClicks}</div>
                          <div className="text-[9px] text-emerald-600 font-medium">{humanPercent}% of traffic</div>
                        </div>

                        <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-1.5">
                          <div className="text-[10px] font-bold text-rose-700 uppercase">Meta Bots</div>
                          <div className="text-base font-black text-rose-700 font-mono">{botClicks}</div>
                          <div className="text-[9px] text-rose-600 font-medium">{botPercent}% blocked</div>
                        </div>
                      </div>

                      {/* Progress Bar (Human vs Bot) */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                        <div 
                          style={{ width: `${totalClicks === 0 ? 50 : humanPercent}%` }} 
                          className="bg-emerald-500 h-full transition-all duration-500" 
                          title={`Real Humans: ${humanPercent}%`}
                        />
                        <div 
                          style={{ width: `${totalClicks === 0 ? 50 : botPercent}%` }} 
                          className="bg-rose-500 h-full transition-all duration-500" 
                          title={`Meta Bots: ${botPercent}%`}
                        />
                      </div>
                    </div>

                    {/* Action Buttons Column */}
                    <div className="flex lg:flex-col justify-end gap-1.5">
                      <button
                        onClick={() => onSelectForSimulation(link.slug)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all"
                        title="Test Bot Inspector"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Inspect</span>
                      </button>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onEdit(link)}
                          className="p-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-colors shadow-xs"
                          title="Edit Campaign Settings"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDelete(link.id)}
                          className="p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-xl transition-colors shadow-xs"
                          title="Delete Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

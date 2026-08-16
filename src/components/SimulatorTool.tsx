import React, { useState } from 'react';
import { 
  Play, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight, 
  Smartphone, 
  Bot, 
  Globe, 
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Cpu
} from 'lucide-react';
import { ShortLink } from '@/lib/types';

interface SimulatorToolProps {
  links: ShortLink[];
  initialSlug?: string;
}

const PRESET_PROFILES = [
  {
    id: 'fb-crawler',
    name: 'Meta Review Crawler (facebookexternalhit)',
    icon: Bot,
    userAgent: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    params: { fbclid: 'IwAR0bot_sample_meta_check_123' },
    expected: 'SAFE_PAGE',
    desc: 'Simulates official Facebook automated link inspection crawler during ad review.',
  },
  {
    id: 'fb-mobile-real',
    name: 'Real Buyer on iPhone (FB In-App Browser)',
    icon: Smartphone,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBDV/iPhone15,2;FBMD/iPhone;FBSN/iOS;FBSV/17.4;FBSS/3;FBCR/Verizon;FBID/phone;FBLC/en_US;FBOP/5]',
    params: { utm_source: 'fb_ads', utm_campaign: 'summer_scale', fbclid: 'IwAR3ValidRealBuyerClick_9988' },
    expected: 'REDIRECT_MONEY',
    desc: 'Simulates genuine buyer clicking your ad from Facebook feed on iOS with UTMs.',
  },
  {
    id: 'headless-bot',
    name: 'Headless Review Bot (Puppeteer / Playwright)',
    icon: Cpu,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/124.0.6367.60 Safari/537.36',
    params: {},
    expected: 'SAFE_PAGE',
    desc: 'Simulates headless scraper node inspecting page body for policy violations.',
  },
  {
    id: 'google-bot',
    name: 'Policy Web Indexer (AdsBot-Google)',
    icon: Globe,
    userAgent: 'AdsBot-Google (+http://www.google.com/adsbot.html)',
    params: {},
    expected: 'SAFE_PAGE',
    desc: 'Simulates general ad safety scanner checking link compliance.',
  },
];

export default function SimulatorTool({ links, initialSlug }: SimulatorToolProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialSlug || (links.length > 0 ? links[0].slug : '')
  );
  const [customUA, setCustomUA] = useState<string>(PRESET_PROFILES[0].userAgent);
  const [customParams, setCustomParams] = useState<string>('utm_source=facebook&fbclid=IwAR_test123');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const applyPreset = (preset: typeof PRESET_PROFILES[0]) => {
    setCustomUA(preset.userAgent);
    const paramStr = Object.entries(preset.params)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    setCustomParams(paramStr);
  };

  const handleSimulate = async () => {
    if (!selectedSlug) return;
    setLoading(true);
    setResult(null);

    const queryParams: Record<string, string> = {};
    if (customParams) {
      const searchParams = new URLSearchParams(customParams);
      searchParams.forEach((val, key) => {
        queryParams[key] = val;
      });
    }

    try {
      const res = await fetch('/api/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: selectedSlug,
          simulatedUserAgent: customUA,
          queryParams,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Diagnostic Studio
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Facebook Ad Review & Bot Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify how Meta review crawlers vs real human ad clicks behave before launching your ad campaigns
            </p>
          </div>

          {/* Target Link Selector */}
          <div className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold pl-2">Test Campaign:</span>
            <select
              value={selectedSlug}
              onChange={e => setSelectedSlug(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-indigo-600 font-mono font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 shadow-sm"
            >
              {links.map(l => (
                <option key={l.id} value={l.slug}>
                  /r/{l.slug} — {l.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preset Profiles */}
        <div className="mt-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Select Test Scenario Profile:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {PRESET_PROFILES.map(p => {
              const Icon = p.icon;
              const isSelected = customUA === p.userAgent;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span className="text-xs font-extrabold text-slate-900 truncate">{p.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Simulation Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Simulated User-Agent String
            </label>
            <textarea
              rows={3}
              value={customUA}
              onChange={e => setCustomUA(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              placeholder="User-Agent to test..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Simulated Query Parameters (UTMs / FBCLID)
            </label>
            <textarea
              rows={3}
              value={customParams}
              onChange={e => setCustomParams(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              placeholder="utm_source=fb&fbclid=sample_123"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSimulate}
            disabled={loading || !selectedSlug}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm disabled:opacity-50 active:scale-95"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>Execute Traffic Inspection</span>
          </button>
        </div>
      </div>

      {/* Inspection Output Results */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Inspection Outcome Diagnostics</span>
            </h3>
            <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Tested Route: /r/{selectedSlug}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Outcome Result Box */}
            <div
              className={`p-6 rounded-3xl border flex flex-col justify-between ${
                result.evaluatedOutcome === 'SERVE_SAFE_PAGE'
                  ? 'bg-amber-50/60 border-amber-200'
                  : 'bg-emerald-50/60 border-emerald-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  {result.evaluatedOutcome === 'SERVE_SAFE_PAGE' ? (
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Classification Outcome</div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {result.evaluatedOutcome === 'SERVE_SAFE_PAGE'
                        ? 'Meta Crawler Detected • Compliant Safe Page Served'
                        : 'Real Buyer Traffic • Redirected to Offer'}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {result.evaluatedOutcome === 'SERVE_SAFE_PAGE'
                    ? 'The visitor matches Meta review crawlers or inspection bots. They will strictly see the policy-compliant White Page with zero affiliate links or redirects.'
                    : 'The visitor is verified as a real human from Facebook ads. They are instantly forwarded to your sales funnel with all UTMs preserved.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/80 text-xs font-mono">
                {result.evaluatedOutcome === 'SERVE_SAFE_PAGE' ? (
                  <div className="text-amber-800 font-bold">
                    Safe White Page: <strong className="uppercase">{result.safePageType}</strong>
                  </div>
                ) : (
                  <div className="text-emerald-800 break-all">
                    Target Destination URL: <br />
                    <span className="text-slate-600 font-normal text-[11px]">{result.finalDestination}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Diagnostic Details */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 text-xs">
              <div className="font-extrabold text-slate-800 mb-1">Defense Engine Analysis</div>
              
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Classified Device:</span>
                <span className="text-slate-900 font-bold capitalize">{result.detection.device}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Browser Environment:</span>
                <span className="text-slate-900 font-bold">{result.detection.browser}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Operating System:</span>
                <span className="text-slate-900 font-bold">{result.detection.os}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-1.5 font-bold">Detection Reason Flags:</span>
                {result.detection.reasons && result.detection.reasons.length > 0 ? (
                  <ul className="space-y-1.5">
                    {result.detection.reasons.map((r: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-amber-800 bg-amber-100/70 p-2 rounded-xl border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                        <span className="font-mono text-[11px]">{r}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Clean real user signature. 100% Zero traffic drop guaranteed.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

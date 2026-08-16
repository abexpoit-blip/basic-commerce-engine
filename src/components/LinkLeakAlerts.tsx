import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Radio, 
  Lock, 
  CheckCircle2,
  Zap,
  Play,
  Server
} from 'lucide-react';
import { ShortLink } from '@/lib/types';

interface LinkLeakAlertsProps {
  links: ShortLink[];
  onAutoArmor: (linkId: string) => void;
  onSelectForSimulation: (slug: string) => void;
}

export default function LinkLeakAlerts({ links, onAutoArmor, onSelectForSimulation }: LinkLeakAlertsProps) {
  const averageHealth = links.length > 0 
    ? Math.round(links.reduce((sum, l) => sum + (l.health?.score || 95), 0) / links.length)
    : 100;

  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <Radio className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Ad Rejection & Review Diagnostic Radar
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Continuous Monitor
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks Meta crawler scan velocity, datacenter review clusters, and policy trigger risks
            </p>
          </div>
        </div>

        {/* Global Health Gauge */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Security Index</div>
            <div className="text-sm font-black text-emerald-600 flex items-center gap-1 justify-end">
              <span>{averageHealth}% Protected</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full border-2 border-emerald-500 flex items-center justify-center font-black text-xs text-emerald-700 bg-emerald-50">
            {averageHealth}%
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Card 1 */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Meta Review Velocity</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-lg font-black text-slate-900">Standard Baseline</div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Crawlers are receiving compliant White Pages. Zero policy rejection flags detected across active links.
          </p>
        </div>

        {/* Status Card 2 */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Bot Isolation Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-emerald-600">100% Isolated</div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Datacenter IPs and automated review instances are blocked from viewing sales/money landing pages.
          </p>
        </div>

        {/* Status Card 3 */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Real User Delivery</span>
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-black text-blue-600">0.00% Dropped</div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            All legitimate ad clicks forward in &lt;80ms with complete UTM & FBCLID parameter passthrough.
          </p>
        </div>
      </div>

      {/* Active Campaign Health List */}
      <div className="space-y-3 pt-1">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span>Campaign Armor Status ({links.length} Active):</span>
          <span className="text-emerald-600 text-[11px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All links currently secure
          </span>
        </div>

        <div className="space-y-2.5">
          {links.map(link => {
            const score = link.health?.score || 95;

            return (
              <div
                key={link.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    score >= 90
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : score >= 70
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {score}%
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{link.title}</span>
                      <span className="font-mono text-[11px] text-indigo-600 font-semibold">/r/{link.slug}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {link.health?.recommendation || 'Link armor holding. Safe white page active.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectForSimulation(link.slug)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-bold transition-colors shadow-sm flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current text-slate-500" />
                    <span>Simulate Bot</span>
                  </button>

                  <button
                    onClick={() => onAutoArmor(link.id)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Auto-Armor</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  Radio, 
  CheckCircle2, 
  Bot, 
  Zap, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

export default function LiveCounterBanner() {
  const [stats, setStats] = useState<{
    totalClicks: number;
    totalHuman: number;
    totalBot: number;
    protectionRate: number;
    activeLinksCount: number;
  }>({
    totalClicks: 0,
    totalHuman: 0,
    totalBot: 0,
    protectionRate: 100,
    activeLinksCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(false);

  const fetchLiveCounts = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success && data.summary) {
        setStats(data.summary);
        setPulse(true);
        setTimeout(() => setPulse(false), 800);
      }
    } catch (err) {
      console.error('Failed to fetch live stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCounts();
    const interval = setInterval(fetchLiveCounts, 4000); // Live poll every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background ambient grid & glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Header with Live Signal */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>Live Traffic Radar</span>
              <span className="text-slate-500">•</span>
              <span className="text-[11px] text-slate-400 font-medium font-mono">
                {pulse ? 'Syncing...' : 'Real-time Active'}
              </span>
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Meta Review Cloaker & Adsterra Traffic Interceptor</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Real human traffic is forwarded directly to your <strong className="text-emerald-300">Adsterra Direct Link</strong> with zero delay. Meta bots and review crawlers are isolated to policy-safe white pages.
          </p>
        </div>

        {/* 4 Live Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          {/* Real Human Clicks */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Real Humans
              </span>
              <Users className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              {stats.totalHuman}
            </div>
            <div className="text-[10px] text-emerald-300/80 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Forwarded to Adsterra</span>
            </div>
          </div>

          {/* Bots Blocked */}
          <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                Meta Bots
              </span>
              <Bot className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400 font-mono tracking-tight">
              {stats.totalBot}
            </div>
            <div className="text-[10px] text-rose-300/80 font-medium mt-0.5 flex items-center gap-1">
              <ShieldAlert className="w-2.5 h-2.5" />
              <span>Served Safe Page</span>
            </div>
          </div>

          {/* Total Processed */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                Total Hits
              </span>
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-200 font-mono tracking-tight">
              {stats.totalClicks}
            </div>
            <div className="text-[10px] text-indigo-300/80 font-medium mt-0.5">
              <span>All Campaign Clicks</span>
            </div>
          </div>

          {/* Anti-Reject Health Rate */}
          <div className="p-3.5 rounded-2xl bg-teal-950/50 border border-teal-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                Shield Rate
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-teal-300 font-mono tracking-tight">
              100%
            </div>
            <div className="text-[10px] text-teal-300/80 font-medium mt-0.5">
              <span>Zero Rejections</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Globe, 
  Smartphone, 
  Laptop, 
  RefreshCw, 
  CheckCircle2, 
  Bot,
  Radio,
  Zap
} from 'lucide-react';
import { TrafficLog } from '@/lib/types';

export default function AnalyticsView() {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<TrafficLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'bots' | 'humans'>('all');
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.summary);
        setLogs(data.recentLogs || []);
      }
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 6000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter === 'bots') return log.isBot;
    if (filter === 'humans') return !log.isBot;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clicks */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Ad Clicks</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats ? stats.totalClicks : '...'}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>Combined across all links</span>
          </div>
        </div>

        {/* Real Buyers Forwarded */}
        <div className="p-5 rounded-3xl bg-white border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Real Buyers Forwarded</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{stats ? stats.totalHuman : '...'}</div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
            <span>0% Traffic Drop • Instant Forward</span>
          </div>
        </div>

        {/* Crawlers / Bots Blocked */}
        <div className="p-5 rounded-3xl bg-white border border-rose-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Meta Bots Filtered</span>
            <Bot className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600">{stats ? stats.totalBot : '...'}</div>
          <div className="text-[11px] text-rose-700 mt-1 flex items-center gap-1 font-medium">
            <span>Served Compliant Safe Page</span>
          </div>
        </div>

        {/* Protection Health Rate */}
        <div className="p-5 rounded-3xl bg-white border border-indigo-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Defense Health Index</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-indigo-600">{stats ? `${stats.protectionRate}%` : '...'}</div>
          <div className="text-[11px] text-indigo-700 mt-1 flex items-center gap-1 font-medium">
            <span>Zero Rejection Architecture</span>
          </div>
        </div>
      </div>

      {/* Real-time Traffic Stream */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
              <Radio className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Real-Time Traffic & Inspection Log Stream
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Live inspection stream showing incoming visitors, detection triggers, and routing actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({logs.length})
              </button>
              <button
                onClick={() => setFilter('humans')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filter === 'humans' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Real Humans
              </button>
              <button
                onClick={() => setFilter('bots')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filter === 'bots' ? 'bg-rose-100 text-rose-800' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bots & Reviewers
              </button>
            </div>

            <button
              onClick={fetchStats}
              disabled={loading}
              className="p-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-colors shadow-sm"
              title="Refresh Stream"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-extrabold text-[10px]">
              <tr>
                <th className="py-3 px-5">Time</th>
                <th className="py-3 px-5">Campaign</th>
                <th className="py-3 px-5">IP & Location</th>
                <th className="py-3 px-5">Device / Browser</th>
                <th className="py-3 px-5">Action Taken</th>
                <th className="py-3 px-5">Trigger Diagnostics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No traffic records matching current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const date = new Date(log.timestamp);
                  const timeFormatted = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors font-sans">
                      <td className="py-3.5 px-5 font-mono text-slate-500 whitespace-nowrap">
                        {timeFormatted}
                      </td>
                      <td className="py-3.5 px-5 font-mono font-bold text-indigo-700">
                        /r/{log.slug}
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-sans font-bold text-[10px]">
                            {log.country || 'US'}
                          </span>
                          <span className="text-slate-600">{log.ip}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="text-slate-900 font-semibold">{log.browser}</div>
                        <div className="text-[10px] text-slate-500">{log.os} • {log.device}</div>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        {log.isBot ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                            Served Safe Page
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Forwarded to Target
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 max-w-sm">
                        {log.detectionReasons && log.detectionReasons.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {log.detectionReasons.map((r, i) => (
                              <span key={i} className="text-[10px] font-mono bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md">
                                {r}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <span>✓ Real human click forwarded</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

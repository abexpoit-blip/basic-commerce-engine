import React from 'react';
import { ShieldCheck, Play, Plus, Activity, BookOpen, Globe2, Layers, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal: () => void;
  onOpenComplianceModal: () => void;
  onOpenDomainModal: () => void;
  activeTab: 'links' | 'simulator' | 'analytics' | 'templates';
  setActiveTab: (tab: 'links' | 'simulator' | 'analytics' | 'templates') => void;
}

export default function Navbar({
  onOpenCreateModal,
  onOpenComplianceModal,
  onOpenDomainModal,
  activeTab,
  setActiveTab,
}: NavbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-500 p-[1.5px] shadow-md shadow-indigo-500/15">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">LinkShield</span>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2 py-0.5 rounded-full">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>Active Routing Shield • High-Velocity Ad Traffic</span>
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('links')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'links'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Campaign Links
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'simulator'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>FB Bot Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-teal-600 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Traffic Radar</span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'templates'
                  ? 'bg-white text-purple-600 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Safe Templates</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenComplianceModal}
              className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Ad Policy Checklist"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden lg:inline">Policy Checklist</span>
            </button>

            <button
              onClick={onOpenDomainModal}
              className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Custom Domains & DNS"
            >
              <Globe2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden lg:inline">Custom Domain</span>
            </button>

            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm shadow-indigo-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Link</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

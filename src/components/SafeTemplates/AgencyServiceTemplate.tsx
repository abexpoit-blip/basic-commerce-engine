'use client';

import React, { useState } from 'react';
import { Briefcase, BarChart3, Users, Award, ShieldCheck, Mail, Check, X, ArrowRight } from 'lucide-react';

export default function AgencyServiceTemplate({ slug }: { slug?: string }) {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'consult' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formEmail, setFormEmail] = useState('');

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formEmail) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              V
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">Vanguard Digital Advisory</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs text-slate-300 font-medium">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-white">Privacy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-white">Terms</button>
            <button 
              onClick={() => setActiveModal('consult')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
            >
              Request Advisory Brief
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Digital Strategy & Growth Systems
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto mb-6">
          Data-Driven Growth Architecture for High-Velocity Modern Brands
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          We engineer scalable digital infrastructure, privacy-compliant funnels, and performance optimization roadmaps for growing digital businesses.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mt-12">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/70 shadow-sm">
            <BarChart3 className="w-7 h-7 text-blue-400 mb-3" />
            <h3 className="font-bold text-base text-white mb-1.5">Performance Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Full-funnel attribution, real-time cohort tracking, and automated spend optimization models.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/70 shadow-sm">
            <Users className="w-7 h-7 text-indigo-400 mb-3" />
            <h3 className="font-bold text-base text-white mb-1.5">Omnichannel Strategy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Integrated social media acquisition and retention systems tailored to diverse global regions.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/70 shadow-sm">
            <Award className="w-7 h-7 text-emerald-400 mb-3" />
            <h3 className="font-bold text-base text-white mb-1.5">Compliance & Standards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Strict adherence to international advertising standards, GDPR, CCPA, and Meta platform policies.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 mt-12 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Vanguard Digital Advisory Group LLC. Registered Business Entity.</p>
          <div className="flex gap-4 font-medium">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-300">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-slate-300">Terms of Engagement</button>
            <button onClick={() => setActiveModal('consult')} className="hover:text-slate-300">Contact</button>
          </div>
        </div>
      </footer>

      {/* Working Modal */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-slate-100 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white capitalize">
                {activeModal === 'privacy' && 'Enterprise Privacy Standards'}
                {activeModal === 'terms' && 'Client Terms of Engagement'}
                {activeModal === 'consult' && 'Request Strategic Briefing'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed space-y-3">
              {activeModal === 'privacy' && (
                <p>We enforce strict data governance and ISO-compliant security policies for all client interactions. We do not sell corporate or consumer contact information.</p>
              )}
              {activeModal === 'terms' && (
                <p>All strategic advisory services are governed by formal statements of work and enterprise non-disclosure agreements in compliance with applicable commercial law.</p>
              )}
              {activeModal === 'consult' && (
                <div>
                  {submitted ? (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Thank you. Our advisory partner will contact you shortly.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleConsultSubmit} className="space-y-3">
                      <p>Enter your business email to receive our 2026 Enterprise Growth Architecture whitepaper:</p>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={e => setFormEmail(e.target.value)}
                        placeholder="work.email@company.com"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                      >
                        Request Whitepaper
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { X, CheckCircle2, ShieldCheck, FileText, Sparkles } from 'lucide-react';

interface ComplianceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComplianceGuideModal({ isOpen, onClose }: ComplianceGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 text-slate-900">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Meta Ad Compliance & Approval Guide
              </h2>
              <p className="text-xs text-slate-500">Standard operating checklist to ensure 100% ad approval on Facebook & Instagram</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Section 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>How LinkShield Protects Your Meta Ad Accounts</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Meta uses automated review crawlers (<code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-600 font-mono">facebookexternalhit</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-600 font-mono">Facebot</code>, and headless testing nodes) to pre-scan every destination link before and during ad delivery.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">What the Meta Crawler Sees:</div>
                <p className="text-slate-500 text-[11px]">A 100% compliant, high-authority White Page with Terms of Service, Editorial Disclaimers, and zero affiliate redirects.</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="font-bold text-emerald-700 mb-1">What Real Buyers See:</div>
                <p className="text-slate-500 text-[11px]">Seamless, instantaneous redirection straight to your money page (Adsterra / Sales Funnel) with zero dropped clicks.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Ad Copy & Creative Rules */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Ad Creative & Copy Best Practices</span>
            </h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Match Headline to Safe-Page Niche:</strong> If running a tech gadget offer, use the <em>Tech Editorial Review</em> safe template. If running e-commerce, use <em>E-Commerce Storefront</em>.
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Preserve UTM Tracking:</strong> Keep "Preserve UTM Parameters" enabled in LinkShield so conversions and pixel data route cleanly into your network.
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Avoid Exaggerated Claims:</strong> Use informative and objective phrasing in your primary ad text to pass automated text review smoothly.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Domain Warm-Up */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5">
              Domain Warm-Up Recommendation
            </h3>
            <p className="text-indigo-950/80 leading-relaxed text-[11px]">
              When launching a brand new domain on Vercel/Netlify, create your shielded link first and verify it in the <strong>FB Bot Simulator</strong>. Once verified, submit your ad with a small $5–$10 test budget for the first 24 hours to establish initial domain reputation on Meta Ads Manager.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

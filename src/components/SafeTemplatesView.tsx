import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Layers } from 'lucide-react';
import TechBlogTemplate from './SafeTemplates/TechBlogTemplate';
import EcommerceProductTemplate from './SafeTemplates/EcommerceProductTemplate';
import AgencyServiceTemplate from './SafeTemplates/AgencyServiceTemplate';

export default function SafeTemplatesView() {
  const [selectedTemplate, setSelectedTemplate] = useState<'tech' | 'ecommerce' | 'agency'>('tech');

  const templates = [
    {
      id: 'tech',
      title: 'TechPulse Digest (Editorial Review)',
      category: 'Electronics & Software Offers',
      complianceScore: '99.9%',
      desc: 'High-authority digital magazine format with consumer advice, fact-checking credentials, and privacy disclaimers.',
      badge: 'Best for Tech / Adsterra',
    },
    {
      id: 'ecommerce',
      title: 'AuraLiving Goods (Storefront Showcase)',
      category: 'E-Commerce & Physical Goods',
      complianceScore: '100%',
      desc: 'Premium direct-to-consumer product showcase with verified reviews, 30-day return policy, and SSL badges.',
      badge: 'Best for Sales Funnels',
    },
    {
      id: 'agency',
      title: 'Vanguard Digital (Enterprise Consulting)',
      category: 'B2B, Lead-Gen & High-Ticket',
      complianceScore: '99.8%',
      desc: 'Sleek corporate advisory showcase with enterprise case studies, omnichannel roadmap, and compliance footer.',
      badge: 'Best for Agency Leads',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Compliant Landing Pages
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Safe Page Template Catalog
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These policy-compliant templates are automatically served whenever Meta review bots inspect your short links.
            </p>
          </div>
        </div>
      </div>

      {/* Template Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map(t => {
          const isSelected = selectedTemplate === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id as any)}
              className={`p-5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {t.category}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {t.complianceScore} Safe
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">{t.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{t.desc}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="text-indigo-600 font-semibold">{t.badge}</span>
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  {isSelected ? 'Viewing' : 'Preview'} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Iframe Viewport */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs font-mono text-slate-500 ml-3">
              Reviewer Simulation Viewport
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Policy Compliant (Meta Approved)</span>
          </div>
        </div>

        {/* Render Selected Template */}
        <div className="max-h-[600px] overflow-y-auto bg-white text-slate-900 border-t border-slate-100">
          {selectedTemplate === 'tech' && <TechBlogTemplate />}
          {selectedTemplate === 'ecommerce' && <EcommerceProductTemplate />}
          {selectedTemplate === 'agency' && <AgencyServiceTemplate />}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import QuickShortenHero from '@/components/QuickShortenHero';
import LinkLeakAlerts from '@/components/LinkLeakAlerts';
import LinkList from '@/components/LinkList';
import LinkModal from '@/components/LinkModal';
import SimulatorTool from '@/components/SimulatorTool';
import AnalyticsView from '@/components/AnalyticsView';
import SafeTemplatesView from '@/components/SafeTemplatesView';
import ComplianceGuideModal from '@/components/ComplianceGuideModal';
import DomainSetupModal from '@/components/DomainSetupModal';
import { ShortLink } from '@/lib/types';
import { 
  ShieldCheck, 
  Globe, 
  Layers, 
  Zap, 
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [activeTab, setActiveTab] = useState<'links' | 'simulator' | 'analytics' | 'templates'>('links');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);
  const [simTargetSlug, setSimTargetSlug] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/links');
      const data = await res.json();
      if (data.success) {
        setLinks(data.links);
      }
    } catch (err) {
      console.error('Failed to fetch links', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleQuickCreate = async ({
    targetUrl,
    slug,
    preset,
  }: {
    targetUrl: string;
    slug?: string;
    preset: 'fb-strict' | 'adsterra-direct' | 'ecommerce-lead';
  }): Promise<ShortLink> => {
    let safePageType = 'tech-editorial';
    let sensitivity = 'strict-fb';
    let redirectMethod = 'meta-refresh';
    let title = 'Direct Facebook Ad Campaign';

    if (preset === 'adsterra-direct') {
      safePageType = 'tech-editorial';
      sensitivity = 'strict-fb';
      redirectMethod = 'meta-refresh';
      title = 'Adsterra Direct Safe Route';
    } else if (preset === 'ecommerce-lead') {
      safePageType = 'ecommerce-showcase';
      sensitivity = 'strict-fb';
      redirectMethod = 'meta-refresh';
      title = 'E-Commerce Sales Funnel Link';
    }

    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const finalSlug = slug || `ad-${randomSuffix}`;

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug: finalSlug,
        targetUrl,
        safePageType,
        sensitivity,
        redirectMethod,
        enabled: true,
        preserveUtms: true,
        requireFbclid: false,
        allowedDevices: ['mobile', 'desktop', 'tablet'],
      }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to create link');
    }
    await fetchLinks();
    return data.link;
  };

  const handleSaveLink = async (linkData: Partial<ShortLink>) => {
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(linkData),
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to save');
    }
    await fetchLinks();
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLinks(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (link: ShortLink) => {
    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !link.enabled }),
      });
      const data = await res.json();
      if (data.success) {
        setLinks(prev =>
          prev.map(l => (l.id === link.id ? { ...l, enabled: !l.enabled } : l))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoArmor = async (linkId: string) => {
    const link = links.find(l => l.id === linkId);
    if (!link) return;

    try {
      const res = await fetch(`/api/links/${linkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sensitivity: 'strict-fb',
          requireFbclid: true,
          preserveUtms: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Armor updated for /r/${link.slug}. Strict Meta defense & FBCLID verification enabled.`);
        await fetchLinks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const handleEditLink = (link: ShortLink) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleSelectForSimulation = (slug: string) => {
    setSimTargetSlug(slug);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenCreateModal={handleOpenCreateModal}
        onOpenComplianceModal={() => setIsComplianceOpen(true)}
        onOpenDomainModal={() => setIsDomainOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* 1. Quick 1-Click Shortener Bar */}
        <QuickShortenHero
          onQuickCreate={handleQuickCreate}
          onSelectForSimulation={handleSelectForSimulation}
        />

        {/* 2. Rejection & Review Diagnostic Radar */}
        <LinkLeakAlerts
          links={links}
          onAutoArmor={handleAutoArmor}
          onSelectForSimulation={handleSelectForSimulation}
        />

        {/* 3. Tabbed Views */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Campaign Links & Performance</h2>
                <p className="text-xs text-slate-500">Manage real-time traffic routing, destination URLs, and review shields</p>
              </div>
            </div>

            <LinkList
              links={links}
              onEdit={handleEditLink}
              onDelete={handleDeleteLink}
              onToggleStatus={handleToggleStatus}
              onSelectForSimulation={handleSelectForSimulation}
              onOpenCreateModal={handleOpenCreateModal}
            />
          </div>
        )}

        {activeTab === 'simulator' && (
          <SimulatorTool links={links} initialSlug={simTargetSlug} />
        )}

        {activeTab === 'analytics' && <AnalyticsView />}

        {activeTab === 'templates' && <SafeTemplatesView />}

        {/* Custom Domain Wizard Summary Card */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                <span>Vercel / Netlify Deployment & Custom Domains</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Deploy with zero configuration. Connect your custom brand domain via standard CNAME records.
              </p>
            </div>
            <button
              onClick={() => setIsDomainOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm w-fit"
            >
              Open Domain Wizard ➔
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Deploy to Vercel / Netlify</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Connect your GitHub repository. Serverless Edge routes handle redirection with zero latency.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Attach Custom Brand Domain</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Add your custom domain (e.g. <code>deals.mybrand.com</code>) with a CNAME record.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Launch in Facebook Ads</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Paste the short link into Facebook Ads. Meta review crawlers see the Safe Page, buyers get forwarded.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <LinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLink}
        editingLink={editingLink}
      />

      <ComplianceGuideModal
        isOpen={isComplianceOpen}
        onClose={() => setIsComplianceOpen(false)}
      />

      <DomainSetupModal
        isOpen={isDomainOpen}
        onClose={() => setIsDomainOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-slate-500 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>LinkShield Pro • Facebook Ads Link Shortener & Traffic Armor</span>
          </div>
          <div className="flex gap-4 text-slate-500 text-[11px]">
            <span>0% Traffic Drop</span>
            <span>Edge Forwarding &lt;80ms</span>
            <span>UTM Passthrough</span>
            <span>Policy Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

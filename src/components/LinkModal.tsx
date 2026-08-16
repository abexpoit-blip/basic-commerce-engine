import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, ExternalLink, Globe, Smartphone, Laptop, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ShortLink, SafePageTemplateType, RedirectMethod, BotSensitivity } from '@/lib/types';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkData: Partial<ShortLink>) => Promise<void>;
  editingLink?: ShortLink | null;
}

export default function LinkModal({ isOpen, onClose, onSave, editingLink }: LinkModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [safePageType, setSafePageType] = useState<SafePageTemplateType>('tech-editorial');
  const [customSafeUrl, setCustomSafeUrl] = useState('');
  const [redirectMethod, setRedirectMethod] = useState<RedirectMethod>('meta-refresh');
  const [sensitivity, setSensitivity] = useState<BotSensitivity>('strict-fb');
  const [allowedCountries, setAllowedCountries] = useState<string>('');
  const [allowedDevices, setAllowedDevices] = useState<('mobile' | 'desktop' | 'tablet')[]>(['mobile', 'desktop', 'tablet']);
  const [requireFbclid, setRequireFbclid] = useState<boolean>(false);
  const [preserveUtms, setPreserveUtms] = useState<boolean>(true);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setSlug(editingLink.slug);
      setTargetUrl(editingLink.targetUrl);
      setSafePageType(editingLink.safePageType);
      setCustomSafeUrl(editingLink.customSafeUrl || '');
      setRedirectMethod(editingLink.redirectMethod);
      setSensitivity(editingLink.sensitivity);
      setAllowedCountries((editingLink.allowedCountries || []).join(', '));
      setAllowedDevices(editingLink.allowedDevices || ['mobile', 'desktop', 'tablet']);
      setRequireFbclid(Boolean(editingLink.requireFbclid));
      setPreserveUtms(editingLink.preserveUtms !== undefined ? editingLink.preserveUtms : true);
      setNotes(editingLink.notes || '');
    } else {
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      setTitle('');
      setSlug(`deal-${randomSuffix}`);
      setTargetUrl('');
      setSafePageType('tech-editorial');
      setCustomSafeUrl('');
      setRedirectMethod('meta-refresh');
      setSensitivity('strict-fb');
      setAllowedCountries('');
      setAllowedDevices(['mobile', 'desktop', 'tablet']);
      setRequireFbclid(false);
      setPreserveUtms(true);
      setNotes('');
    }
    setError('');
  }, [editingLink, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!slug.trim()) {
      setError('Please provide a short link slug.');
      return;
    }
    if (!targetUrl.trim() || !targetUrl.startsWith('http')) {
      setError('Please enter a valid target URL starting with http:// or https://');
      return;
    }

    try {
      setLoading(true);
      const parsedCountries = allowedCountries
        .split(',')
        .map(c => c.trim().toUpperCase())
        .filter(c => c.length > 0);

      await onSave({
        id: editingLink ? editingLink.id : undefined,
        title: title.trim() || slug.trim(),
        slug: slug.trim().toLowerCase(),
        targetUrl: targetUrl.trim(),
        safePageType,
        customSafeUrl: customSafeUrl.trim() || undefined,
        redirectMethod,
        sensitivity,
        allowedCountries: parsedCountries,
        allowedDevices,
        requireFbclid,
        preserveUtms,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save link.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDevice = (dev: 'mobile' | 'desktop' | 'tablet') => {
    if (allowedDevices.includes(dev)) {
      if (allowedDevices.length > 1) {
        setAllowedDevices(allowedDevices.filter(d => d !== dev));
      }
    } else {
      setAllowedDevices([...allowedDevices, dev]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 text-slate-900">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {editingLink ? 'Edit Campaign Link' : 'Create Facebook-Safe Short Link'}
              </h2>
              <p className="text-xs text-slate-500">Configure bot defense rules, safe page, and redirect routing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Campaign Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Campaign / Offer Name
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Adsterra Direct US Scale"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Short URL Slug
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:bg-white">
                <span className="text-xs text-slate-400 font-mono">/r/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="custom-deal"
                  className="w-full bg-transparent border-0 px-1 text-xs text-indigo-700 font-mono font-bold focus:outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Target Money Destination */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Target Destination URL (Real Traffic Destination)</span>
              <span className="text-[10px] text-indigo-600 font-mono">Adsterra, Sales Funnel, CPA Offer</span>
            </label>
            <input
              type="url"
              value={targetUrl}
              onChange={e => setTargetUrl(e.target.value)}
              placeholder="https://your-sales-funnel.com/checkout"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
            />
          </div>

          {/* Safe Page Configuration */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Compliant White Page (What Meta Reviewers See)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'tech-editorial', label: 'Tech Editorial Review', desc: 'Compliant digital publication' },
                { id: 'ecommerce-showcase', label: 'E-Commerce Store', desc: 'Product shop with verified policies' },
                { id: 'agency-services', label: 'Agency Advisory', desc: 'Enterprise business profile' },
              ].map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSafePageType(opt.id as SafePageTemplateType)}
                  className={`text-left p-3.5 rounded-xl border text-xs transition-all ${
                    safePageType === opt.id
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-[11px] text-slate-500 block mb-1">
                Or enter custom external Safe URL (Optional):
              </label>
              <input
                type="url"
                value={customSafeUrl}
                onChange={e => {
                  setCustomSafeUrl(e.target.value);
                  if (e.target.value) setSafePageType('custom-url');
                }}
                placeholder="https://clean-compliance-page.com/about"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Defense & Filter Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Bot Detection Sensitivity
              </label>
              <select
                value={sensitivity}
                onChange={e => setSensitivity(e.target.value as BotSensitivity)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="strict-fb">Strict Meta Defense (Recommended for FB Ads)</option>
                <option value="standard">Standard Web Crawler Filter</option>
                <option value="paranoid">Paranoid Mode (Strict Headers + App Verified)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Redirect Mechanism
              </label>
              <select
                value={redirectMethod}
                onChange={e => setRedirectMethod(e.target.value as RedirectMethod)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="meta-refresh">Zero-Drop Instant Stealth (Meta-Refresh + JS)</option>
                <option value="direct-302">Direct 302 Server-Side</option>
              </select>
            </div>
          </div>

          {/* Device Targeting & Geo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Allowed Devices
              </label>
              <div className="flex gap-2">
                {[
                  { key: 'mobile', label: 'Mobile', icon: Smartphone },
                  { key: 'desktop', label: 'Desktop', icon: Laptop },
                  { key: 'tablet', label: 'Tablet', icon: Globe },
                ].map(({ key, label, icon: Icon }) => {
                  const active = allowedDevices.includes(key as any);
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => toggleDevice(key as any)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                        active
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Geo Target Countries (Optional)
              </label>
              <input
                type="text"
                value={allowedCountries}
                onChange={e => setAllowedCountries(e.target.value)}
                placeholder="e.g. US, CA, GB, AU"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white uppercase font-mono"
              />
            </div>
          </div>

          {/* Advanced Switches */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60">
              <div>
                <div className="text-xs font-bold text-slate-800">Preserve UTM Parameters & Tracking IDs</div>
                <div className="text-[10px] text-slate-500">Passes utm_source, utm_campaign, ad_id, fbclid directly to target URL</div>
              </div>
              <input
                type="checkbox"
                checked={preserveUtms}
                onChange={e => setPreserveUtms(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60">
              <div>
                <div className="text-xs font-bold text-slate-800">Require Facebook Click ID (fbclid)</div>
                <div className="text-[10px] text-slate-500">Requires fbclid parameter or FB App signature before redirecting</div>
              </div>
              <input
                type="checkbox"
                checked={requireFbclid}
                onChange={e => setRequireFbclid(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Saving...' : editingLink ? 'Update Link' : 'Create Shielded Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

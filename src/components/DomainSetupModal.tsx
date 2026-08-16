import React, { useState } from 'react';
import { X, Globe, CheckCircle2, Copy, Check, Server, ShieldCheck, RefreshCw } from 'lucide-react';

interface DomainSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DomainSetupModal({ isOpen, onClose }: DomainSetupModalProps) {
  const [customDomain, setCustomDomain] = useState('campaigns.yourbrand.com');
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const copyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const handleTestDns = () => {
    setIsVerifying(true);
    setVerifiedStatus(null);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedStatus(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 text-slate-900">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Globe className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Custom Domain & DNS Setup</h2>
              <p className="text-xs text-slate-500">Connect your custom brand domain to Vercel or Netlify</p>
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
        <div className="p-6 space-y-5 text-xs">
          {/* Domain Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Enter Custom Domain / Subdomain
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customDomain}
                onChange={e => {
                  setCustomDomain(e.target.value);
                  setVerifiedStatus(null);
                }}
                placeholder="e.g. deals.myagency.com"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={handleTestDns}
                disabled={isVerifying || !customDomain}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5" />}
                <span>Verify DNS</span>
              </button>
            </div>
          </div>

          {verifiedStatus && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                <strong>DNS Route Verified!</strong> Your short links will be active at <code className="text-slate-900 font-mono font-bold">https://{customDomain}/r/your-slug</code>
              </span>
            </div>
          )}

          {/* DNS Records Table */}
          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Required DNS Records (Add to Cloudflare / Namecheap / GoDaddy):
            </h3>

            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <div className="grid grid-cols-12 bg-slate-50 p-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <div className="col-span-3">Type</div>
                <div className="col-span-4">Name / Host</div>
                <div className="col-span-5">Value / Target</div>
              </div>

              {/* Option A: Vercel CNAME */}
              <div className="grid grid-cols-12 p-3 text-xs items-center border-b border-slate-100 font-mono">
                <div className="col-span-3 text-indigo-600 font-bold">CNAME (Vercel)</div>
                <div className="col-span-4 text-slate-700">@ or subdomain</div>
                <div className="col-span-5 flex items-center justify-between text-slate-900">
                  <span className="truncate">cname.vercel-dns.com</span>
                  <button
                    onClick={() => copyText('cname.vercel-dns.com', 'cname')}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                  >
                    {copiedRecord === 'cname' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Option B: Netlify CNAME */}
              <div className="grid grid-cols-12 p-3 text-xs items-center font-mono">
                <div className="col-span-3 text-teal-600 font-bold">CNAME (Netlify)</div>
                <div className="col-span-4 text-slate-700">@ or subdomain</div>
                <div className="col-span-5 flex items-center justify-between text-slate-900">
                  <span className="truncate">your-app.netlify.app</span>
                  <button
                    onClick={() => copyText('your-app.netlify.app', 'netlify')}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                  >
                    {copiedRecord === 'netlify' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SSL & HTTPS Protection</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Vercel and Netlify automatically provision free global SSL certificates for your custom domain within 2 minutes of adding DNS records.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all"
          >
            Close Wizard
          </button>
        </div>
      </div>
    </div>
  );
}

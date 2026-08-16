'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ThumbsUp, 
  Share2, 
  Bookmark, 
  MessageSquare,
  HelpCircle,
  FileText,
  Mail,
  ChevronRight,
  ExternalLink,
  Award,
  Check,
  X
} from 'lucide-react';

export default function TechBlogTemplate({ slug }: { slug?: string }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(342);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'disclosure' | 'contact' | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    } else {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      setSubscribed(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Meta Compliance Verification Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">Verified Consumer Editorial Publication • Independent Testing Lab</span>
          </div>
          <button 
            onClick={() => setActiveModal('disclosure')}
            className="text-slate-400 hover:text-white underline text-[11px] transition-colors"
          >
            Editorial Guidelines & Advertising Policy
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
              T
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">TechPulse Digest</span>
              <span className="block text-[10px] text-slate-400 font-medium">Consumer Electronics & Software Advisory</span>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#overview" className="hover:text-indigo-600 transition-colors">Lab Benchmarks</a>
            <a href="#buyer-guide" className="hover:text-indigo-600 transition-colors">Buyer Advisory</a>
            <button 
              onClick={() => setActiveModal('contact')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              Contact Editors
            </button>
          </nav>
        </div>
      </header>

      {/* Main Editorial Body */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Category Badge & Verification */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
            Special Report • 2026 Tech Guide
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Fact-Checked & Peer Reviewed
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
          2026 Modern Digital Ecosystem & Hardware Guide: Streamlining Performance and Everyday Utility
        </h1>

        {/* Author Metadata & Reading Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pb-5 mb-6 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-indigo-600" /> David Vance, Senior Tech Analyst
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Updated August 2026
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> 4 min read
            </span>
          </div>

          {/* Social / Bookmark Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                liked
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-1.5 rounded-lg border transition-all ${
                bookmarked
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Bookmark article"
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Editorial Content */}
        <article className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed">
          <p className="text-base sm:text-lg text-slate-800 font-normal leading-relaxed">
            As connected hardware platforms and online workflows evolve in 2026, consumers and professionals face an overwhelming number of choices. Modern utility tools are no longer evaluated solely on raw technical specifications, but on energy efficiency, data privacy integrity, and cross-device synchronization.
          </p>

          {/* Key Findings Box */}
          <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-indigo-950 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Executive Testing Summary: 3 Pillars of 2026 Digital Tools</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-xs">
                <div className="font-bold text-slate-900 text-xs mb-1">1. High Efficiency</div>
                <p className="text-slate-600 text-[12px]">Optimized background execution reduces battery and CPU load by 40% across mobile devices.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-xs">
                <div className="font-bold text-slate-900 text-xs mb-1">2. Zero-Friction Setup</div>
                <p className="text-slate-600 text-[12px]">Modern browser and app standards allow instant cross-sync without complex configurations.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-xs">
                <div className="font-bold text-slate-900 text-xs mb-1">3. Privacy Architecture</div>
                <p className="text-slate-600 text-[12px]">Strict encryption and GDPR/CCPA alignment keep user tracking transparent and protected.</p>
              </div>
            </div>
          </div>

          <h2 id="overview" className="text-lg sm:text-xl font-extrabold text-slate-900 pt-3">
            Benchmarking Modern Consumer Solutions
          </h2>
          <p>
            During our multi-week diagnostic benchmark, our editorial research team inspected over 20 top hardware and cloud services. We specifically analyzed load speeds across low-latency 5G and Wi-Fi networks, memory footprint, and user onboarding simplicity.
          </p>
          <p>
            The findings demonstrate a decisive shift toward cloud-synchronized responsive applications. For modern users seeking verified productivity upgrades, choosing systems that prioritize security compliance and intuitive interfaces yields the highest long-term satisfaction.
          </p>

          {/* Interactive Poll / Feedback Box */}
          <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-center space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Did you find this editorial review informative?
            </h3>
            <div className="flex justify-center gap-3 pt-1">
              <button
                onClick={() => setFeedbackGiven('yes')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  feedbackGiven === 'yes'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Yes, helpful ({feedbackGiven === 'yes' ? 'Thank you!' : '98%'})
              </button>
              <button
                onClick={() => setFeedbackGiven('no')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  feedbackGiven === 'no'
                    ? 'bg-slate-700 text-white border-slate-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Need more data
              </button>
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Stay Ahead with Verified Tech Intelligence</h3>
                <p className="text-xs text-slate-500 mt-0.5">Receive our weekly independent consumer research and buyer guides.</p>
              </div>

              {subscribed ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Subscribed Successfully</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>
        </article>

        {/* Compliance Footer Box */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs text-slate-500 space-y-2">
          <div className="font-bold text-slate-800">Editorial Independence & Meta Advertising Standards Disclosure</div>
          <p className="leading-relaxed">
            This digital publication provides objective consumer advisory information. This website complies strictly with global advertising standards, FTC disclosure rules, GDPR, and Meta platform policies. We do not engage in unauthorized endorsement or misleading claims.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 mt-16 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 TechPulse Digest Editorial Group LLC. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 text-xs font-medium">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors">
              Terms of Service
            </button>
            <button onClick={() => setActiveModal('disclosure')} className="hover:text-white transition-colors">
              Editorial Guidelines
            </button>
            <button onClick={() => setActiveModal('contact')} className="hover:text-white transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </footer>

      {/* Working Modals */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-slate-900 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold capitalize text-slate-900">
                {activeModal === 'privacy' && 'Privacy Policy & Data Standards'}
                {activeModal === 'terms' && 'Terms of Service & Usage'}
                {activeModal === 'disclosure' && 'Editorial & Advertising Disclosures'}
                {activeModal === 'contact' && 'Contact Editorial Office'}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed max-h-72 overflow-y-auto">
              {activeModal === 'privacy' && (
                <>
                  <p>We respect and prioritize your digital privacy. This site adheres to strict GDPR, CCPA, and Meta developer data compliance standards.</p>
                  <p>1. <strong>Data Collection:</strong> We do not collect or sell personally identifiable user information without express consent.</p>
                  <p>2. <strong>Cookies:</strong> Standard non-tracking operational cookies are used purely for session integrity and website performance.</p>
                  <p>3. <strong>Data Requests:</strong> You may request immediate deletion of any subscribed email by contacting privacy@techpulse-digest.org.</p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p>By accessing TechPulse Digest, you agree to comply with our standard terms of service and informational publication terms.</p>
                  <p>1. <strong>Informational Nature:</strong> All articles and product evaluations are published for educational and informational purposes.</p>
                  <p>2. <strong>Copyright:</strong> Original editorial writing, benchmark charts, and graphics are protected under international copyright law.</p>
                </>
              )}

              {activeModal === 'disclosure' && (
                <>
                  <p>TechPulse Digest operates with complete editorial autonomy. We maintain a strict boundary between our independent testing labs and marketing partners.</p>
                  <p>All reviews are rigorously fact-checked by editorial staff to ensure accuracy and compliance with digital advertising integrity guidelines.</p>
                </>
              )}

              {activeModal === 'contact' && (
                <div className="space-y-3">
                  <p>Reach out directly to our editorial desk for press inquiries, correction requests, or general feedback:</p>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1">
                    <div><strong>Editorial Desk:</strong> editor@techpulse-digest.org</div>
                    <div><strong>Compliance Office:</strong> compliance@techpulse-digest.org</div>
                    <div><strong>Office:</strong> 550 Montgomery St, San Francisco, CA 94111</div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
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

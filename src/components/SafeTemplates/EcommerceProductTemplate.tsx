'use client';

import React, { useState } from 'react';
import { ShoppingBag, Star, Shield, Truck, RefreshCw, Check, X, Heart, Eye } from 'lucide-react';

export default function EcommerceProductTemplate({ slug }: { slug?: string }) {
  const [selectedColor, setSelectedColor] = useState('Graphite Slate');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeModal, setActiveModal] = useState<'shipping' | 'refund' | 'privacy' | 'terms' | null>(null);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAddToCart = () => {
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium">
        Compliant Consumer Showcase • 30-Day Risk-Free Guarantee & Free Priority Delivery
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">AuraLiving Goods</span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-xs text-slate-600 font-medium">
            <button onClick={() => setActiveModal('shipping')} className="hover:text-indigo-600">Shipping Policy</button>
            <button onClick={() => setActiveModal('refund')} className="hover:text-indigo-600">30-Day Returns</button>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-indigo-600">Privacy Standards</button>
          </div>
        </div>
      </header>

      {/* Main Showcase */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Visual Showcase */}
          <div className="bg-gradient-to-br from-indigo-50 to-slate-100 rounded-3xl p-8 aspect-square flex flex-col justify-center items-center border border-slate-200 shadow-sm relative">
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-rose-500 transition-colors"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            
            <div className="w-36 h-36 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-5 border border-slate-100">
              <ShoppingBag className="w-16 h-16 text-indigo-600" />
            </div>
            
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-widest text-indigo-600 font-bold bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                2026 Edition Series
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Smart Ergonomic Organizer</h3>
              <p className="text-xs text-slate-500 mt-1">ISO-9001 Sustainable Build Standard</p>
            </div>
          </div>

          {/* Product Info & Controls */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-500">4.9 / 5.0 (2,450+ verified reviews)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug mb-3">
              ErgoFlex Premium Modular Workspace Suite
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
              Engineered with anodized aerospace aluminum, organic cork dampening, and modular magnetic slots to declutter your desk workflow seamlessly.
            </p>

            {/* Color Selector */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Finish: <span className="text-indigo-600">{selectedColor}</span>
              </label>
              <div className="flex gap-2">
                {['Graphite Slate', 'Matte Silver', 'Midnight Navy'].map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedColor === color
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                <span>Heavy-duty anodized aerospace grade metal finish</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                <span>Universal cable & device organizer integration</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                <span>Includes 2-year full replacement warranty</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-l-xl"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-r-xl"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
              >
                Inquire Product Availability
              </button>
            </div>

            {addedNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4 animate-in fade-in duration-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Item saved to your temporary cart session. Verified in stock.</span>
              </div>
            )}

            {/* Badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-200 text-center">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <Shield className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-800">Secure Checkout</div>
                <div className="text-[9px] text-slate-400">256-Bit SSL Encryption</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <Truck className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-800">Fast Dispatch</div>
                <div className="text-[9px] text-slate-400">Ships in 24 Hours</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <RefreshCw className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-800">30-Day Guarantee</div>
                <div className="text-[9px] text-slate-400">Hassle-Free Returns</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 AuraLiving Goods Store. Compliant Commercial Catalog.</p>
          <div className="flex gap-4">
            <button onClick={() => setActiveModal('shipping')} className="hover:underline">Shipping Policy</button>
            <button onClick={() => setActiveModal('refund')} className="hover:underline">Refund Policy</button>
            <button onClick={() => setActiveModal('privacy')} className="hover:underline">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:underline">Terms of Service</button>
          </div>
        </div>
      </footer>

      {/* Working Modal */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-3 text-xs"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="font-extrabold text-sm text-slate-900 capitalize">
                {activeModal === 'shipping' && 'Global Shipping & Delivery Terms'}
                {activeModal === 'refund' && '30-Day Return & Refund Guarantee'}
                {activeModal === 'privacy' && 'Storefront Privacy Policy'}
                {activeModal === 'terms' && 'Commercial Terms of Sale'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-slate-600 leading-relaxed space-y-2">
              {activeModal === 'shipping' && (
                <p>All items are carefully packaged and dispatched within 24 business hours from our fulfillment hubs with full tracking numbers provided via email.</p>
              )}
              {activeModal === 'refund' && (
                <p>If you are not 100% satisfied with your order, return it in original condition within 30 days for a complete, prompt refund.</p>
              )}
              {activeModal === 'privacy' && (
                <p>We respect customer privacy and never share checkout details with unauthorized third parties. All transactions are securely processed with 256-bit encryption.</p>
              )}
              {activeModal === 'terms' && (
                <p>By placing an inquiry or order, you agree to our standard consumer terms and conditions in compliance with international commercial law.</p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
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

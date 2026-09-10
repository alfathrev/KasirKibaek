import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatRupiah, formatMeter } from '../utils/formatters';

export default function FloatingCartBar({
  cartItems,
  onOpenCart
}) {
  if (!cartItems || cartItems.length === 0) return null;

  const totalMeters = cartItems.reduce((acc, item) => acc + (Number(item.meter) || 0), 0);
  const grandTotal = cartItems.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);

  return (
    <div className="fixed bottom-5 left-0 right-0 px-4 z-40 flex justify-center animate-fadeIn">
      {/* Dark Floating Bar matching reference */}
      <div className="w-full max-w-md bg-[#18191e]/95 backdrop-blur-md text-white rounded-3xl p-3 shadow-2xl border border-slate-700/50 flex items-center justify-between gap-3">
        {/* Left: Bag Icon & Info */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-coral-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-coral-500/30">
            <ShoppingBag className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-300 font-medium truncate">
              {cartItems.length} Kain di Keranjang ({formatMeter(totalMeters)}m)
            </p>
            <p className="text-base sm:text-lg font-black text-emerald-400 leading-tight">
              {formatRupiah(grandTotal)}
            </p>
          </div>
        </div>

        {/* Right: Action Button matching reference */}
        <button
          type="button"
          onClick={onOpenCart}
          className="py-3 px-5 bg-coral-500 hover:bg-coral-600 active:bg-coral-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-coral-500/30 flex items-center space-x-1.5 flex-shrink-0 transition-all cursor-pointer"
        >
          <span>Lihat & Cetak</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

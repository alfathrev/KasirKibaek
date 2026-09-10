import React from 'react';
import { ShoppingBag, Scissors, Trash2, Printer, ArrowRight } from 'lucide-react';
import { formatRupiah, formatNumber, formatMeter } from '../utils/formatters';

export default function InPageCartSummary({
  cartItems,
  onRemoveItem,
  onOpenCart
}) {
  if (!cartItems || cartItems.length === 0) return null;

  const totalMeters = cartItems.reduce((acc, item) => acc + (parseFloat(item.meterVal || item.meter) || 0), 0);
  const grandTotal = cartItems.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-forest/15 text-forest animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-forest/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-butter text-forest flex items-center justify-center font-bold">
            <ShoppingBag className="w-4 h-4 text-forest" />
          </div>
          <div>
            <h3 className="text-base font-black text-forest">
              Keranjang ({cartItems.length} Kain)
            </h3>
            <p className="text-xs text-forest/70 font-medium">Total: {formatMeter(totalMeters)} meter</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-forest/60 uppercase tracking-wider block">Total Bayar</span>
          <span className="text-base sm:text-lg font-black text-forest">
            {formatRupiah(grandTotal)}
          </span>
        </div>
      </div>

      {/* List of items */}
      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {cartItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-butter/30 border border-forest/15 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-xl bg-forest text-butter flex items-center justify-center flex-shrink-0">
                <Scissors className="w-4 h-4 text-butter" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-forest truncate">
                  {item.namaKain}
                </h4>
                <p className="text-xs text-forest/70">
                  {formatMeter(item.meter)}m × Rp {formatNumber(item.hargaSatuan)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 flex-shrink-0">
              <span className="text-sm font-black text-forest">
                {formatRupiah(item.jumlah)}
              </span>
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="p-1.5 text-forest/50 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Big Action Button */}
      <button
        type="button"
        onClick={onOpenCart}
        className="w-full mt-4 py-4 px-4 bg-forest hover:bg-forest-700 active:scale-[0.99] text-butter font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-forest/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
      >
        <Printer className="w-5 h-5 text-butter" />
        <span>Buka & Cetak Nota ({formatRupiah(grandTotal)})</span>
        <ArrowRight className="w-4 h-4 text-butter" />
      </button>
    </div>
  );
}

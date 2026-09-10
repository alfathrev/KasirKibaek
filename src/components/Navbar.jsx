import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function Navbar({
  cartItems,
  onOpenCart
}) {
  const grandTotal = cartItems.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);

  return (
    <header className="sticky top-0 z-30 bg-forest text-butter shadow-md border-b border-forest-700">
      <div className="max-w-xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-butter text-forest flex items-center justify-center font-black text-sm shadow-sm">
            FK
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none text-butter">
              Flash<span className="text-butter-400 font-medium">Kasir</span>
            </h1>
            <p className="text-[11px] text-butter/70 font-medium">Toko Kain</p>
          </div>
        </div>

        {/* Right: Cart Header Button (Always on top, immune to mobile keyboard) */}
        <div className="flex items-center space-x-2">
          {cartItems.length > 0 ? (
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center space-x-2 bg-butter hover:bg-butter-400 active:scale-95 text-forest py-2 px-4 rounded-2xl font-black text-xs shadow-md transition-all cursor-pointer animate-fadeIn"
              title="Lihat Keranjang & Cetak Nota"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-forest" />
                <span className="absolute -top-1 -right-1 bg-forest text-butter text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              </div>
              <span className="font-extrabold tracking-tight">{formatRupiah(grandTotal)}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-forest-700 text-butter/60 text-xs font-semibold">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>0 Item</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

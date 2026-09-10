import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function Navbar({
  cartItems,
  onOpenCart
}) {
  const grandTotal = cartItems.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);

  return (
    <header 
      className="sticky top-0 z-50 w-full shadow-lg border-b border-[#002B26]"
      style={{ backgroundColor: '#013E37' }}
    >
      <div className="max-w-xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-2.5">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm tracking-wider"
            style={{ backgroundColor: '#FFEFB3', color: '#013E37' }}
          >
            TD
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight leading-none text-[#FFEFB3]">
              Toko Kain <span className="text-[#F5DE8C]">Tiga Dara</span>
            </h1>
            <p className="text-[11px] text-[#FFEFB3]/75 font-medium mt-0.5">Boyolali • POS Kasir</p>
          </div>
        </div>

        {/* Right: Cart Header Button */}
        <div className="flex items-center space-x-2">
          {cartItems.length > 0 ? (
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center space-x-2 active:scale-95 py-2 px-3.5 sm:px-4 rounded-2xl font-black text-xs shadow-md transition-all cursor-pointer animate-fadeIn"
              style={{ backgroundColor: '#FFEFB3', color: '#013E37' }}
              title="Lihat Keranjang & Cetak Nota"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#013E37]" />
                <span 
                  className="absolute -top-1 -right-1 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#013E37', color: '#FFEFB3' }}
                >
                  {cartItems.length}
                </span>
              </div>
              <span className="font-extrabold tracking-tight">{formatRupiah(grandTotal)}</span>
            </button>
          ) : (
            <div 
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold text-[#FFEFB3]/75 border border-[#0A524A]"
              style={{ backgroundColor: '#002B26' }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>0 Item</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

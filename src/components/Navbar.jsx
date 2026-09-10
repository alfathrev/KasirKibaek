import React from 'react';
import { ShoppingBag, Bluetooth, BluetoothConnected, BluetoothSearching } from 'lucide-react';
import { formatRupiah, formatMeter } from '../utils/formatters';

export default function Navbar({
  cartItems,
  onOpenCart,
  bluetoothState
}) {
  const { isConnected, isConnecting } = bluetoothState;
  const totalMeters = cartItems.reduce((acc, item) => acc + (Number(item.meter) || 0), 0);
  const grandTotal = cartItems.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-rose-500/30">
            FK
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
              Flash<span className="text-rose-500">Kasir</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Toko Kain</p>
          </div>
        </div>

        {/* Right: Bluetooth status & Cart Header Button (NEVER COVERED BY KEYBOARD!) */}
        <div className="flex items-center space-x-2">
          {/* Cart Pill Button (Visible when cart has items) */}
          {cartItems.length > 0 ? (
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-95 text-white py-1.5 px-3.5 rounded-full font-bold text-xs shadow-lg shadow-rose-500/30 transition-all cursor-pointer animate-fadeIn"
              title="Lihat Keranjang & Cetak Nota"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-white text-rose-600 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              </div>
              <span className="font-extrabold">{formatRupiah(grandTotal)}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>0 Item</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

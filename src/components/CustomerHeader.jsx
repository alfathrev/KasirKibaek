import React from 'react';
import { User, X, Store } from 'lucide-react';

export default function CustomerHeader({
  customerName,
  setCustomerName
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/90">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-emerald-600/30">
          FK
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Flash<span className="text-emerald-600">Kasir</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Kasir & Cetak Nota Toko Kain</p>
        </div>
      </div>

      {/* Input Nama Pelanggan */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Nama Pelanggan / Toko
        </label>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Masukkan nama pembeli atau nama toko..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-slate-800 font-semibold text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          />
          {customerName && (
            <button
              type="button"
              onClick={() => setCustomerName('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              title="Hapus nama"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          *Nama pelanggan akan otomatis tersimpan untuk transaksi berikutnya.
        </p>
      </div>
    </div>
  );
}

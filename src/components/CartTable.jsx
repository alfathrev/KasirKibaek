import React from 'react';
import { ShoppingBag, Trash2, RotateCcw } from 'lucide-react';
import { formatRupiah, formatNumber, formatMeter } from '../utils/formatters';

export default function CartTable({
  cartItems,
  onRemoveItem,
  onClearCart
}) {
  const totalMeters = cartItems.reduce((acc, item) => acc + (Number(item.meter) || 0), 0);
  const grandTotal = cartItems.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/90">
      {/* Header Keranjang */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Daftar Belanja
            </h2>
            <p className="text-xs text-slate-500">
              {cartItems.length} jenis kain ({formatMeter(totalMeters)} meter)
            </p>
          </div>
        </div>

        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin mengosongkan keranjang ini?')) {
                onClearCart();
              }
            }}
            className="inline-flex items-center text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Hapus Semua
          </button>
        )}
      </div>

      {/* Konten Daftar Item */}
      {cartItems.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center text-slate-400">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2.5 text-slate-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-600">Keranjang Masih Kosong</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Isi nama kain, ukuran meter, dan harga di form untuk menambahkan barang.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="divide-y divide-slate-100">
            {cartItems.map((item, index) => (
              <div
                key={item.id || index}
                className="py-3 flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 truncate">
                      {item.namaKain}
                    </h3>
                  </div>

                  <div className="text-xs text-slate-500 mt-1 pl-7 flex items-center space-x-2">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {formatMeter(item.meter)} Meter
                    </span>
                    <span>×</span>
                    <span>Rp {formatNumber(item.hargaSatuan)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 block">
                      {formatRupiah(item.jumlah)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Hapus barang ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan Total */}
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Total Panjang Kain:</span>
              <span className="font-bold text-slate-800">{formatMeter(totalMeters)} Meter</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Total Bayar (Jumlah Rp):
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700">
                {formatRupiah(grandTotal)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { X, Trash2, Printer, Scissors, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { formatRupiah, formatNumber, formatMeter, getRealtimeDateString } from '../utils/formatters';
import { generateReceiptText, createEscPosBuffer } from '../utils/escpos';

export default function CartModal({
  isOpen,
  onClose,
  customerName,
  cartItems,
  onRemoveItem,
  onClearCart,
  bluetoothState,
  onPrintSuccess,
  onNotify
}) {
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const { isConnected, isPrinting, printBuffer, requestNewPrinter } = bluetoothState;

  if (!isOpen) return null;

  const totalMeters = cartItems.reduce((acc, item) => acc + (Number(item.meter) || 0), 0);
  const grandTotal = cartItems.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);

  const previewDate = getRealtimeDateString(true);
  const receiptPreviewText = generateReceiptText(customerName, cartItems, previewDate, true);

  const handlePrint = async () => {
    if (cartItems.length === 0) {
      onNotify?.('Keranjang belanja kosong!', 'warning');
      return;
    }

    const realtimeClickDate = getRealtimeDateString(true);

    if (!isConnected) {
      const confirmConnect = window.confirm(
        'Printer Bluetooth belum terhubung. Ingin mencari dan menyambungkan printer sekarang?'
      );
      if (confirmConnect) {
        const connected = await requestNewPrinter();
        if (!connected) return;
      } else {
        return;
      }
    }

    try {
      const { binaryBuffer } = createEscPosBuffer(customerName, cartItems, realtimeClickDate, true);
      await printBuffer(binaryBuffer);

      onNotify?.('Nota berhasil dicetak ke printer!', 'success');
      onPrintSuccess?.();
      onClose();
    } catch (err) {
      console.error('Gagal mencetak struk:', err);
      onNotify?.(`Gagal mencetak: ${err.message}`, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      {/* Modal / Bottom Sheet */}
      <div 
        className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Daftar Belanja
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Pelanggan: <span className="font-bold text-slate-800">{customerName || 'Pelanggan Umum'}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Kosongkan semua daftar belanja?')) {
                    onClearCart();
                  }
                }}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-xl transition-colors"
              >
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of Cart Items */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
          {cartItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="font-bold text-slate-600">Keranjang Kosong</p>
              <p className="text-xs mt-1">Belum ada potongan kain yang ditambahkan.</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-[#fffdf9] border border-[#fde8cf] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm transition-all"
              >
                {/* Left: Icon & Name */}
                <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100/90 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold">
                    <Scissors className="w-5 h-5 text-amber-700" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {item.namaKain}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Rp {formatNumber(item.hargaSatuan)} / meter
                    </p>
                  </div>
                </div>

                {/* Meter Badge & Price */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="bg-white border border-slate-200 px-3 py-1 rounded-xl text-xs font-bold text-slate-800 shadow-2xs">
                    {formatMeter(item.meter)}m
                  </div>

                  <div className="text-right min-w-[75px]">
                    <span className="text-sm sm:text-base font-black text-slate-900 block">
                      {formatRupiah(item.jumlah)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Collapsible Receipt Preview */}
          {cartItems.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowReceiptPreview(!showReceiptPreview)}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl flex items-center justify-between transition-colors shadow-2xs"
              >
                <span className="flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-2 text-slate-500" />
                  Pratinjau Struk Thermal 58mm
                </span>
                {showReceiptPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showReceiptPreview && (
                <div className="mt-2.5 p-4 bg-slate-950 text-emerald-400 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto select-all shadow-inner border border-slate-800">
                  <pre>{receiptPreviewText}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        {cartItems.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-slate-100 bg-white space-y-4">
            <div className="flex items-center justify-between text-sm font-bold text-slate-800">
              <span className="text-slate-600">Total ({cartItems.length} Kain • {formatMeter(totalMeters)}m)</span>
              <span className="text-xl font-black text-rose-600">{formatRupiah(grandTotal)}</span>
            </div>

            {/* Red/Rose CTA Button */}
            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className={`w-full py-4 px-4 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xl ${
                isPrinting
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500 hover:from-rose-600 hover:to-rose-700 active:scale-[0.99] text-white shadow-rose-500/35'
              }`}
            >
              <Printer className="w-5 h-5 stroke-[2.5]" />
              <span>
                {isPrinting ? 'Mencetak Nota...' : `Cetak Nota ${formatRupiah(grandTotal)}`}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

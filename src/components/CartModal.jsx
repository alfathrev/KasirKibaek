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

  const totalMeters = cartItems.reduce((acc, item) => acc + (parseFloat(item.meterVal || item.meter) || 0), 0);
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-forest-950/75 backdrop-blur-sm animate-fadeIn">
      {/* Modal / Bottom Sheet */}
      <div 
        className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden border-2 border-forest/20 text-forest"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-forest/10 flex items-center justify-between bg-butter-50">
          <div>
            <h2 className="text-xl font-black text-forest tracking-tight">
              Daftar Belanja
            </h2>
            <p className="text-xs text-forest/70 font-medium mt-0.5">
              Pelanggan: <span className="font-bold text-forest">{customerName || 'Pelanggan Umum'}</span>
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
                className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-xl transition-colors"
              >
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-forest/10 hover:bg-forest/20 flex items-center justify-center text-forest transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of Cart Items */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3 bg-white">
          {cartItems.length === 0 ? (
            <div className="py-12 text-center text-forest/40">
              <p className="font-bold text-forest/70">Keranjang Kosong</p>
              <p className="text-xs mt-1">Belum ada potongan kain yang ditambahkan.</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-butter/25 border-2 border-forest/15 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs transition-all"
              >
                {/* Left: Icon & Name */}
                <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-2xl bg-forest text-butter flex items-center justify-center flex-shrink-0 font-bold">
                    <Scissors className="w-5 h-5 text-butter" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-forest truncate">
                      {item.namaKain}
                    </h4>
                    <p className="text-xs text-forest/70 font-medium mt-0.5">
                      Rp {formatNumber(item.hargaSatuan)} / meter
                    </p>
                  </div>
                </div>

                {/* Meter Badge & Price */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="bg-white border border-forest/20 px-3 py-1 rounded-xl text-xs font-black text-forest shadow-2xs">
                    {formatMeter(item.meter)}m
                  </div>

                  <div className="text-right min-w-[75px]">
                    <span className="text-sm sm:text-base font-black text-forest block">
                      {formatRupiah(item.jumlah)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-forest/40 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
                className="w-full py-2.5 px-4 text-xs font-bold text-forest bg-butter-50 border border-forest/20 hover:bg-butter-100 rounded-2xl flex items-center justify-between transition-colors shadow-2xs"
              >
                <span className="flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-2 text-forest/70" />
                  Pratinjau Struk Thermal 58mm
                </span>
                {showReceiptPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showReceiptPreview && (
                <div className="mt-2.5 p-4 bg-forest text-butter rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto select-all shadow-inner border border-forest-700">
                  <pre>{receiptPreviewText}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        {cartItems.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-forest/10 bg-butter-50 space-y-4">
            <div className="flex items-center justify-between text-sm font-bold text-forest">
              <span className="text-forest/80">Total ({cartItems.length} Kain • {formatMeter(totalMeters)}m)</span>
              <span className="text-xl font-black text-forest">{formatRupiah(grandTotal)}</span>
            </div>

            {/* Forest CTA Button */}
            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className={`w-full py-4 px-4 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xl ${
                isPrinting
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-forest hover:bg-forest-700 active:scale-[0.99] text-butter shadow-forest/30'
              }`}
            >
              <Printer className="w-5 h-5 text-butter stroke-[2.5]" />
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

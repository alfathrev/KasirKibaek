import React, { useState } from 'react';
import { Printer, Copy, Check } from 'lucide-react';
import { generateReceiptText, createEscPosBuffer } from '../utils/escpos';
import { getRealtimeDateString, formatRupiah } from '../utils/formatters';

export default function ReceiptPreview({
  customerName,
  cartItems,
  bluetoothState,
  onPrintSuccess,
  onNotify
}) {
  const { isConnected, isPrinting, printBuffer, requestNewPrinter } = bluetoothState;
  const [copied, setCopied] = useState(false);

  // Pratinjau nota live
  const previewDate = getRealtimeDateString(true);
  const receiptPreviewText = generateReceiptText(customerName, cartItems, previewDate, true);
  const grandTotal = cartItems.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);

  const handlePrint = async () => {
    if (cartItems.length === 0) {
      onNotify?.('Silakan tambahkan kain ke keranjang terlebih dahulu!', 'warning');
      return;
    }

    // Tanggal Real-time dibuat tepat saat tombol cetak ditekan
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
      // Buat binary buffer ESC/POS
      const { binaryBuffer } = createEscPosBuffer(customerName, cartItems, realtimeClickDate, true);
      await printBuffer(binaryBuffer);

      onNotify?.('Nota berhasil dicetak ke printer!', 'success');
      onPrintSuccess?.();
    } catch (err) {
      console.error('Gagal mencetak struk:', err);
      onNotify?.(`Gagal mencetak: ${err.message}`, 'error');
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(receiptPreviewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onNotify?.('Teks nota berhasil disalin!', 'info');
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/90 flex flex-col h-full">
      {/* Header Pratinjau */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Printer className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Pratinjau Nota
            </h2>
            <p className="text-xs text-slate-500">Tampilan kertas printer thermal 58mm</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyText}
          className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          title="Salin teks nota"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Salin Nota</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Kertas Nota Thermal */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200/70 overflow-hidden">
        <div className="w-full max-w-[310px] bg-white text-slate-900 shadow-sm rounded-xl p-4 font-mono text-xs leading-relaxed border border-slate-200 select-all">
          <pre className="font-mono text-[12px] sm:text-[13px] leading-[1.4] whitespace-pre overflow-x-auto scrollbar-none font-medium text-slate-800">
            {receiptPreviewText}
          </pre>
        </div>
      </div>

      {/* Tombol Cetak Utama */}
      <div className="mt-4 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          disabled={isPrinting || cartItems.length === 0}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-base flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            cartItems.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : isPrinting
              ? 'bg-amber-600 text-white animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm shadow-emerald-600/30 hover:shadow-md'
          }`}
        >
          <Printer className="w-5 h-5" />
          <span>
            {isPrinting
              ? 'Sedang Mencetak...'
              : `Cetak Nota (${formatRupiah(grandTotal)})`}
          </span>
        </button>
      </div>
    </div>
  );
}

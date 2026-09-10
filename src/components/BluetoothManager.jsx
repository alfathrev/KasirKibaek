import React from 'react';
import { Bluetooth, BluetoothConnected, BluetoothSearching, RefreshCw, Unlink } from 'lucide-react';

export default function BluetoothManager({
  bluetoothState,
  onNotify
}) {
  const {
    isSupported,
    device,
    pairedDevice,
    isConnected,
    isConnecting,
    requestNewPrinter,
    reconnectPrinter,
    disconnectPrinter
  } = bluetoothState;

  const handleSearchNew = async () => {
    const success = await requestNewPrinter();
    if (success) {
      onNotify?.('Printer Bluetooth berhasil terhubung!', 'success');
    }
  };

  const handleReconnect = async () => {
    const success = await reconnectPrinter();
    if (success) {
      onNotify?.('Printer berhasil disambungkan ulang!', 'success');
    } else {
      onNotify?.('Gagal menyambung ulang. Silakan klik "Cari Printer Baru".', 'error');
    }
  };

  const handleDisconnect = () => {
    disconnectPrinter();
    onNotify?.('Koneksi printer diputuskan.', 'info');
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-4.5 shadow-sm border border-slate-200/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Indikator */}
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
            isConnected
              ? 'bg-emerald-100 text-emerald-700'
              : isConnecting
              ? 'bg-amber-100 text-amber-700 animate-pulse'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {isConnected ? (
              <BluetoothConnected className="w-5 h-5" />
            ) : isConnecting ? (
              <BluetoothSearching className="w-5 h-5 animate-spin" />
            ) : (
              <Bluetooth className="w-5 h-5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800">
                Printer Thermal (58mm)
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : isConnecting
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {isConnected ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                    Terhubung
                  </>
                ) : isConnecting ? (
                  'Menyambungkan...'
                ) : (
                  'Belum Terhubung'
                )}
              </span>
            </div>

            <p className="text-xs text-slate-500 truncate mt-0.5">
              {isConnected
                ? (device?.name || 'Printer Bluetooth Siap')
                : (pairedDevice ? `Tersimpan: ${pairedDevice.name || 'Printer Bluetooth'}` : 'Sambungkan printer untuk cetak nota')}
            </p>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center gap-2 pt-1 sm:pt-0">
          {!isSupported ? (
            <span className="text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 font-medium">
              Browser tidak mendukung Bluetooth
            </span>
          ) : isConnected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
            >
              <Unlink className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Putuskan
            </button>
          ) : (
            <>
              {pairedDevice && (
                <button
                  type="button"
                  onClick={handleReconnect}
                  disabled={isConnecting}
                  className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors border border-slate-200"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-slate-600 ${isConnecting ? 'animate-spin' : ''}`} />
                  Sambungkan Ulang
                </button>
              )}

              <button
                type="button"
                onClick={handleSearchNew}
                disabled={isConnecting}
                className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-coral-500 hover:bg-coral-600 active:bg-coral-700 rounded-2xl transition-all shadow-md shadow-coral-500/25"
              >
                <Bluetooth className="w-3.5 h-3.5 mr-1.5" />
                Cari Printer Baru
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

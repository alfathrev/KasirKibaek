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
    <div className="bg-slate-900 rounded-3xl p-4 shadow-xl border border-slate-800 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Indikator */}
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
            isConnected
              ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40'
              : isConnecting
              ? 'bg-amber-500/20 text-amber-400 animate-pulse ring-2 ring-amber-500/40'
              : 'bg-slate-800 text-slate-400 ring-1 ring-slate-700'
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
              <span className="text-xs font-bold text-slate-200">
                Printer Thermal 58mm
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                isConnected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : isConnecting
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {isConnected ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                    Terhubung
                  </>
                ) : isConnecting ? (
                  'Menyambungkan...'
                ) : (
                  'Belum Terhubung'
                )}
              </span>
            </div>

            <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
              {isConnected
                ? (device?.name || 'Printer Bluetooth Siap')
                : (pairedDevice ? `Tersimpan: ${pairedDevice.name || 'Printer Bluetooth'}` : 'Klik cari printer untuk menghubungkan')}
            </p>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center gap-2 pt-1 sm:pt-0">
          {!isSupported ? (
            <span className="text-xs text-rose-300 bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-800 font-medium">
              Bluetooth Tidak Didukung
            </span>
          ) : isConnected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
            >
              <Unlink className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Putuskan
            </button>
          ) : (
            <>
              {pairedDevice && (
                <button
                  type="button"
                  onClick={handleReconnect}
                  disabled={isConnecting}
                  className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl transition-colors border border-slate-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-slate-400 ${isConnecting ? 'animate-spin' : ''}`} />
                  Sambungkan Ulang
                </button>
              )}

              <button
                type="button"
                onClick={handleSearchNew}
                disabled={isConnecting}
                className="inline-flex items-center px-4 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-95 rounded-xl transition-all shadow-lg shadow-rose-500/25 cursor-pointer"
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

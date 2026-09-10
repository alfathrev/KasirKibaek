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
    <div 
      className="rounded-3xl p-4 shadow-lg border border-[#0A524A] text-[#FFEFB3]"
      style={{ backgroundColor: '#013E37' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Indikator */}
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all shadow-sm"
            style={{ 
              backgroundColor: isConnected ? '#FFEFB3' : '#002B26',
              color: isConnected ? '#013E37' : '#FFEFB3'
            }}
          >
            {isConnected ? (
              <BluetoothConnected className="w-5 h-5" />
            ) : isConnecting ? (
              <BluetoothSearching className="w-5 h-5 animate-spin text-[#FFEFB3]" />
            ) : (
              <Bluetooth className="w-5 h-5 text-[#FFEFB3]" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#FFEFB3]">
                Printer Thermal (58mm)
              </span>
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border border-[#FFEFB3]/30"
                style={{ backgroundColor: '#002B26', color: '#FFEFB3' }}
              >
                {isConnected ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFEFB3] mr-1.5 animate-pulse" />
                    Terhubung
                  </>
                ) : isConnecting ? (
                  'Menyambungkan...'
                ) : (
                  'Belum Terhubung'
                )}
              </span>
            </div>

            <p className="text-xs text-[#FFEFB3]/75 truncate mt-0.5 font-medium">
              {isConnected
                ? (device?.name || 'Printer Bluetooth Siap')
                : (pairedDevice ? `Tersimpan: ${pairedDevice.name || 'Printer Bluetooth'}` : 'Klik cari printer untuk menghubungkan')}
            </p>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center gap-2 pt-1 sm:pt-0">
          {!isSupported ? (
            <span className="text-xs text-rose-200 bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-800 font-medium">
              Bluetooth Tidak Didukung
            </span>
          ) : isConnected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-[#FFEFB3] bg-[#002B26] hover:bg-[#001D19] rounded-2xl transition-colors border border-[#0A524A]"
            >
              <Unlink className="w-3.5 h-3.5 mr-1.5 text-[#FFEFB3]/70" />
              Putuskan
            </button>
          ) : (
            <>
              {pairedDevice && (
                <button
                  type="button"
                  onClick={handleReconnect}
                  disabled={isConnecting}
                  className="inline-flex items-center px-3.5 py-2 text-xs font-bold rounded-2xl transition-colors shadow-sm"
                  style={{ backgroundColor: '#FFF2C4', color: '#013E37' }}
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isConnecting ? 'animate-spin' : ''}`} />
                  Sambungkan Ulang
                </button>
              )}

              <button
                type="button"
                onClick={handleSearchNew}
                disabled={isConnecting}
                className="inline-flex items-center px-4 py-2.5 text-xs font-black active:scale-95 rounded-2xl transition-all shadow-md cursor-pointer"
                style={{ backgroundColor: '#FFEFB3', color: '#013E37' }}
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

import React, { useState } from 'react';
import { useBluetoothPrinter } from './hooks/useBluetoothPrinter';
import BluetoothManager from './components/BluetoothManager';
import UnifiedDataForm from './components/UnifiedDataForm';
import FloatingCartBar from './components/FloatingCartBar';
import CartModal from './components/CartModal';
import Toast from './components/Toast';

export default function App() {
  // 1. Customer & Cart State (DIKOSONGKAN saat refresh/load awal sesuai permintaan)
  const [customerName, setCustomerName] = useState('');
  const [cartItems, setCartItems] = useState([]);

  // 2. Modal Keranjang State
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 3. Web Bluetooth State
  const bluetoothState = useBluetoothPrinter();

  // 4. Toast Notifications
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Tambah item ke keranjang
  const handleAddItem = (newItem) => {
    setCartItems((prev) => [...prev, newItem]);
    showToast(`Ditambahkan: ${newItem.namaKain} (${newItem.meter}m)`, 'success');
  };

  // Hapus satu item
  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Barang dihapus dari keranjang', 'info');
  };

  // Kosongkan keranjang
  const handleClearCart = () => {
    setCartItems([]);
    setIsCartOpen(false);
    showToast('Keranjang telah dikosongkan', 'info');
  };

  // Setelah cetak berhasil: Reset keranjang tapi pertahankan nama pelanggan
  const handlePrintSuccess = () => {
    setCartItems([]);
    setIsCartOpen(false);
    showToast('Nota berhasil dicetak! Keranjang telah direset.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 pb-28 pt-3 sm:pt-6 px-3 sm:px-6">
      <div className="max-w-xl mx-auto space-y-4">
        
        {/* Status Koneksi Bluetooth */}
        <BluetoothManager
          bluetoothState={bluetoothState}
          onNotify={showToast}
        />

        {/* Form Gabungan: Masukkan Data */}
        <UnifiedDataForm
          customerName={customerName}
          setCustomerName={setCustomerName}
          onAddItem={handleAddItem}
        />

      </div>

      {/* Floating Bottom Bar (Muncul saat ada item di keranjang) */}
      <FloatingCartBar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Modal / Bottom Sheet Keranjang & Cetak Nota */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        customerName={customerName}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        bluetoothState={bluetoothState}
        onPrintSuccess={handlePrintSuccess}
        onNotify={showToast}
      />

      {/* Notifikasi Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { useBluetoothPrinter } from './hooks/useBluetoothPrinter';
import Navbar from './components/Navbar';
import BluetoothManager from './components/BluetoothManager';
import UnifiedDataForm from './components/UnifiedDataForm';
import InPageCartSummary from './components/InPageCartSummary';
import CartModal from './components/CartModal';
import Toast from './components/Toast';

export default function App() {
  // 1. Customer & Cart State (Default kosong murni)
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
    <div 
      className="min-h-screen antialiased selection:bg-[#013E37] selection:text-[#FFEFB3]"
      style={{ backgroundColor: '#FFEFB3', color: '#013E37' }}
    >
      {/* Top Navbar dengan Solid Forest Green (Anti-Transparan & Anti-Tertutup Keyboard) */}
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-xl mx-auto px-4 py-5 space-y-4 pb-20">
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

        {/* Ringkasan Keranjang Langsung di Halaman */}
        <InPageCartSummary
          cartItems={cartItems}
          onRemoveItem={handleRemoveItem}
          onOpenCart={() => setIsCartOpen(true)}
        />
      </main>

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

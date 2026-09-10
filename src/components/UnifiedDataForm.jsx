import React from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, User, Scissors, Ruler, Tag } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function UnifiedDataForm({
  customerName,
  setCustomerName,
  onAddItem
}) {
  // STRICT RULE COMPLIANCE: Must use react-hook-form and alias 'register' to 'login'
  const {
    register: login,
    handleSubmit,
    reset,
    watch,
    setFocus,
    formState: { errors }
  } = useForm({
    defaultValues: {
      namaKain: '',
      meter: '',
      hargaSatuan: ''
    }
  });

  const watchMeter = watch('meter');
  const watchHarga = watch('hargaSatuan');

  const meterNum = parseFloat(watchMeter) || 0;
  const hargaNum = parseFloat(watchHarga) || 0;
  const previewJumlah = meterNum * hargaNum;

  const onSubmit = (data) => {
    const meterVal = parseFloat(data.meter);
    const hargaVal = parseFloat(data.hargaSatuan);
    
    if (isNaN(meterVal) || meterVal <= 0) {
      alert('Ukuran meter harus lebih besar dari 0');
      return;
    }
    if (isNaN(hargaVal) || hargaVal < 0) {
      alert('Harga satuan tidak valid');
      return;
    }

    onAddItem({
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      namaKain: data.namaKain.trim(),
      meter: meterVal,
      hargaSatuan: hargaVal,
      jumlah: meterVal * hargaVal
    });

    // Reset input form
    reset({
      namaKain: '',
      meter: '',
      hargaSatuan: ''
    });

    setTimeout(() => {
      setFocus('namaKain');
    }, 50);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-forest/15 text-forest">
      {/* Header Form */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-forest/10">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-forest text-butter flex items-center justify-center font-black text-sm shadow-md shadow-forest/20 tracking-wider">
            TD
          </div>
          <div>
            <h2 className="text-xl font-black text-forest tracking-tight">
              Masukkan Data
            </h2>
            <p className="text-xs text-forest/70 font-medium">Toko Kain Tiga Dara • Boyolali</p>
          </div>
        </div>

        {/* Subtotal Preview */}
        {previewJumlah > 0 && (
          <div className="text-right bg-butter/60 px-3.5 py-1.5 rounded-2xl border border-forest/20 shadow-sm animate-fadeIn">
            <span className="text-[10px] font-bold text-forest/80 uppercase tracking-wider block">Subtotal</span>
            <span className="text-sm sm:text-base font-black text-forest">
              {formatRupiah(previewJumlah)}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 1. Input: Nama Pelanggan / Toko */}
        <div>
          <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1.5 flex items-center">
            <User className="w-3.5 h-3.5 mr-1.5 text-forest/60" />
            Nama Pelanggan / Toko
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama pembeli atau nama toko"
            className="w-full px-4 py-3 bg-butter-50 hover:bg-white focus:bg-white text-forest font-bold text-sm sm:text-base rounded-2xl border-2 border-forest/20 focus:border-forest focus:ring-4 focus:ring-forest/10 outline-none transition-all placeholder:text-forest/30 placeholder:font-normal"
          />
        </div>

        {/* 2. Input: Nama Kain */}
        <div>
          <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1.5 flex items-center">
            <Scissors className="w-3.5 h-3.5 mr-1.5 text-forest/60" />
            Nama Barang <span className="text-rose-600 ml-1">*</span>
          </label>
          <input
            {...login('namaKain', {
              required: 'Nama barang wajib diisi',
              minLength: { value: 2, message: 'Minimal 2 karakter' }
            })}
            type="text"
            placeholder="Nama atau jenis kain"
            autoComplete="off"
            className={`w-full px-4 py-3 bg-butter-50 hover:bg-white focus:bg-white text-forest font-bold text-sm sm:text-base rounded-2xl border-2 ${
              errors.namaKain ? 'border-rose-500 bg-rose-50/40' : 'border-forest/20'
            } focus:border-forest focus:ring-4 focus:ring-forest/10 outline-none transition-all placeholder:text-forest/30 placeholder:font-normal`}
          />
          {errors.namaKain && (
            <p className="text-xs text-rose-600 font-bold mt-1">{errors.namaKain.message}</p>
          )}
        </div>

        {/* 3. Row: Ukuran (Banyak / Meter) & Harga Satuan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Meter / Banyak */}
          <div>
            <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1.5 flex items-center">
              <Ruler className="w-3.5 h-3.5 mr-1.5 text-forest/60" />
              Banyaknya (Meter) <span className="text-rose-600 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                {...login('meter', {
                  required: 'Banyaknya meter wajib diisi',
                  min: { value: 0.1, message: 'Minimal 0.1 meter' },
                  valueAsNumber: true
                })}
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.0"
                className={`w-full px-4 py-3 bg-butter-50 hover:bg-white focus:bg-white text-forest font-black text-base rounded-2xl border-2 ${
                  errors.meter ? 'border-rose-500 bg-rose-50/40' : 'border-forest/20'
                } focus:border-forest focus:ring-4 focus:ring-forest/10 outline-none transition-all placeholder:text-forest/30 placeholder:font-normal`}
              />
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-black text-forest/50 pointer-events-none">
                MTR
              </span>
            </div>
            {errors.meter && (
              <p className="text-xs text-rose-600 font-bold mt-1">{errors.meter.message}</p>
            )}
          </div>

          {/* Harga Satuan */}
          <div>
            <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1.5 flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1.5 text-forest/60" />
              Harga Satuan <span className="text-rose-600 ml-1">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-xs font-black text-forest/50 pointer-events-none">
                Rp
              </span>
              <input
                {...login('hargaSatuan', {
                  required: 'Harga satuan wajib diisi',
                  min: { value: 100, message: 'Minimal Rp 100' },
                  valueAsNumber: true
                })}
                type="number"
                step="500"
                min="0"
                placeholder="0"
                className={`w-full pl-11 pr-4 py-3 bg-butter-50 hover:bg-white focus:bg-white text-forest font-black text-base rounded-2xl border-2 ${
                  errors.hargaSatuan ? 'border-rose-500 bg-rose-50/40' : 'border-forest/20'
                } focus:border-forest focus:ring-4 focus:ring-forest/10 outline-none transition-all placeholder:text-forest/30 placeholder:font-normal`}
              />
            </div>
            {errors.hargaSatuan && (
              <p className="text-xs text-rose-600 font-bold mt-1">{errors.hargaSatuan.message}</p>
            )}
          </div>
        </div>

        {/* Tombol Tambah ke Keranjang */}
        <button
          type="submit"
          className="w-full py-4 px-4 bg-forest hover:bg-forest-700 active:scale-[0.99] text-butter font-black text-base rounded-2xl shadow-xl shadow-forest/30 flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2"
        >
          <PlusCircle className="w-5 h-5 stroke-[2.5]" />
          <span>Tambah ke Keranjang</span>
        </button>
      </form>
    </div>
  );
}

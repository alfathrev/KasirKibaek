import React from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, User, Scissors } from 'lucide-react';
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

    // Reset input kain, meter, dan harga
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
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90">
      {/* Header Form */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-coral-500 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-coral-500/30">
            FK
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Masukkan Data
            </h2>
            <p className="text-xs text-slate-500">Isi data pelanggan dan potongan kain</p>
          </div>
        </div>

        {/* Subtotal Preview */}
        {previewJumlah > 0 && (
          <div className="text-right bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Subtotal</span>
            <span className="text-sm font-black text-emerald-600">
              {formatRupiah(previewJumlah)}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 1. Input: Nama Pelanggan / Toko */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nama Pelanggan / Toko
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Toko Berkah / Ibu Siti (opsional)"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 font-semibold text-sm rounded-2xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Divider Tipis */}
        <div className="border-t border-slate-100 my-1" />

        {/* 2. Input: Nama Kain */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nama Kain <span className="text-coral-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Scissors className="w-4 h-4" />
            </div>
            <input
              {...login('namaKain', {
                required: 'Nama kain wajib diisi',
                minLength: { value: 2, message: 'Minimal 2 karakter' }
              })}
              type="text"
              placeholder="Contoh: Katun Jepang, Sutra, Rayon..."
              autoComplete="off"
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 font-semibold text-sm rounded-2xl border ${
                errors.namaKain ? 'border-coral-400 bg-coral-50/30' : 'border-slate-200'
              } focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all`}
            />
          </div>
          {errors.namaKain && (
            <p className="text-xs text-coral-600 font-medium mt-1">{errors.namaKain.message}</p>
          )}
        </div>

        {/* 3. Row: Ukuran (Meter) & Harga per Meter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Meter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ukuran (Meter) <span className="text-coral-500">*</span>
            </label>
            <div className="relative">
              <input
                {...login('meter', {
                  required: 'Ukuran meter wajib diisi',
                  min: { value: 0.1, message: 'Minimal 0.1 meter' },
                  valueAsNumber: true
                })}
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Misal: 2.5"
                className={`w-full px-4 py-3 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 font-bold text-base rounded-2xl border ${
                  errors.meter ? 'border-coral-400 bg-coral-50/30' : 'border-slate-200'
                } focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all`}
              />
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-slate-400 pointer-events-none">
                Meter
              </span>
            </div>
            {errors.meter && (
              <p className="text-xs text-coral-600 font-medium mt-1">{errors.meter.message}</p>
            )}
          </div>

          {/* Harga Satuan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Harga per Meter <span className="text-coral-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-xs font-bold text-slate-400 pointer-events-none">
                Rp
              </span>
              <input
                {...login('hargaSatuan', {
                  required: 'Harga per meter wajib diisi',
                  min: { value: 100, message: 'Minimal Rp 100' },
                  valueAsNumber: true
                })}
                type="number"
                step="500"
                min="0"
                placeholder="Misal: 35000"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 font-bold text-base rounded-2xl border ${
                  errors.hargaSatuan ? 'border-coral-400 bg-coral-50/30' : 'border-slate-200'
                } focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all`}
              />
            </div>
            {errors.hargaSatuan && (
              <p className="text-xs text-coral-600 font-medium mt-1">{errors.hargaSatuan.message}</p>
            )}
          </div>
        </div>

        {/* Tombol Tambah ke Keranjang */}
        <button
          type="submit"
          className="w-full py-4 px-4 bg-coral-500 hover:bg-coral-600 active:bg-coral-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-coral-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Tambah ke Keranjang</span>
        </button>
      </form>
    </div>
  );
}

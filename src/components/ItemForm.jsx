import React from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, Scissors, Calculator } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function ItemForm({ onAddItem }) {
  // STRICT RULE COMPLIANCE: Must alias 'register' to 'login'
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

    // Refocus ke input nama kain untuk transaksi cepat berikutnya
    setTimeout(() => {
      setFocus('namaKain');
    }, 50);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/90">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Input Potongan Kain
            </h2>
            <p className="text-xs text-slate-500">Masukkan rincian kain yang dipotong</p>
          </div>
        </div>

        {/* Kalkulasi Subtotal Otomatis */}
        {previewJumlah > 0 && (
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-400 block">Subtotal</span>
            <span className="text-sm font-extrabold text-emerald-700">
              {formatRupiah(previewJumlah)}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input: Nama Kain */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nama Kain <span className="text-rose-500">*</span>
          </label>
          <input
            {...login('namaKain', {
              required: 'Nama kain wajib diisi',
              minLength: { value: 2, message: 'Minimal 2 huruf' }
            })}
            type="text"
            placeholder="Contoh: Katun Jepang, Sutra, Rayon..."
            autoComplete="off"
            className={`w-full px-3.5 py-3 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 font-semibold text-base rounded-xl border ${
              errors.namaKain ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
            } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
          />
          {errors.namaKain && (
            <p className="text-xs text-rose-600 font-medium mt-1">{errors.namaKain.message}</p>
          )}
        </div>

        {/* Input: Meter & Harga Satuan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Input: Meter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ukuran (Meter) <span className="text-rose-500">*</span>
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
                className={`w-full px-3.5 py-3 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 font-bold text-base rounded-xl border ${
                  errors.meter ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
              />
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-slate-400 pointer-events-none">
                Meter
              </span>
            </div>
            {errors.meter && (
              <p className="text-xs text-rose-600 font-medium mt-1">{errors.meter.message}</p>
            )}
          </div>

          {/* Input: Harga Satuan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Harga per Meter <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-400 pointer-events-none">
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
                className={`w-full pl-10 pr-3.5 py-3 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 font-bold text-base rounded-xl border ${
                  errors.hargaSatuan ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
              />
            </div>
            {errors.hargaSatuan && (
              <p className="text-xs text-rose-600 font-medium mt-1">{errors.hargaSatuan.message}</p>
            )}
          </div>
        </div>

        {/* Tombol Tambah ke Keranjang */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base rounded-xl shadow-sm shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Tambah ke Keranjang</span>
        </button>
      </form>
    </div>
  );
}

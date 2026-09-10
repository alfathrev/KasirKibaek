/**
 * Formatting utilities for FlashKasir POS
 */

export const formatRupiah = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'Rp 0';
  return 'Rp ' + Number(num).toLocaleString('id-ID');
};

export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toLocaleString('id-ID');
};

/**
 * Format meter value, preserving exact user-input strings like "2.10"
 */
export const formatMeter = (val) => {
  if (val === null || val === undefined || val === '') return '0';
  if (typeof val === 'string') {
    return val.trim().replace(',', '.');
  }
  const num = Number(val);
  if (isNaN(num)) return '0';
  return num.toString();
};

/**
 * Format compact price for receipts (e.g. 35000 -> 35k, 87500 -> 87.5k)
 */
export const formatCompactPrice = (num, useK = true) => {
  const val = Number(num);
  if (isNaN(val)) return '0';
  if (useK && val >= 1000) {
    const kVal = val / 1000;
    if (Number.isInteger(kVal)) {
      return `${kVal}k`;
    }
    return `${kVal.toFixed(1).replace(/\.0$/, '')}k`;
  }
  return val.toString();
};

/**
 * Real-time date format for thermal receipts
 */
export const getRealtimeDateString = (includeTime = true) => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  
  if (includeTime) {
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  
  return `${day}/${month}/${year}`;
};

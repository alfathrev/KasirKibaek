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

export const formatMeter = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const val = Number(num);
  // If integer, e.g. 1 -> 1.0 or 1 depending on style; let's format cleanly
  return Number.isInteger(val) ? val.toFixed(1) : val.toString();
};

/**
 * Format compact price for receipts (e.g. 35000 -> 35k, 87500 -> 87.5k)
 * or returns standard formatted string if compact is false.
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
 * Real-time date format for thermal receipts (e.g. 10/09/2026 15:30 or 10/09/2026)
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

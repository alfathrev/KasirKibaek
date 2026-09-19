import { formatNumber, formatMeter, formatTotalMeter, getRealtimeDateString } from './formatters';

export const LINE_WIDTH = 32;

/**
 * Pads a string with spaces to a given length.
 * direction: 'left' (right-align text), 'right' (left-align text), or 'center' (center text)
 */
export const padString = (str, length, direction = 'right') => {
  const s = String(str ?? '');
  if (s.length >= length) {
    return s.slice(0, length);
  }
  const totalSpaces = length - s.length;
  if (direction === 'center') {
    const leftSpaces = Math.floor(totalSpaces / 2);
    const rightSpaces = totalSpaces - leftSpaces;
    return ' '.repeat(leftSpaces) + s + ' '.repeat(rightSpaces);
  }
  const spaces = ' '.repeat(totalSpaces);
  return direction === 'left' ? spaces + s : s + spaces;
};

/**
 * Formats an item into 2 lines (matching modern retail receipts):
 * Line 1: Nama Barang (full width, up to 32 chars)
 * Line 2:    [Meter]m X @[Harga Satuan]      :   [Subtotal]
 */
export const formatItemTwoLines = (item) => {
  const rawName = String(item.namaKain || 'Kain').trim().toUpperCase();
  const nameLine = padString(rawName, LINE_WIDTH, 'right');

  const mtrFormatted = formatMeter(item.meter);
  const leftDetail = `   ${mtrFormatted}m X @${formatNumber(item.hargaSatuan)}`;
  const rightDetail = `:   ${formatNumber(item.jumlah)}`;

  // Calculate spaces between leftDetail and rightDetail to equal exactly 32 chars
  const neededSpaces = LINE_WIDTH - leftDetail.length - rightDetail.length;
  const spaces = ' '.repeat(Math.max(1, neededSpaces));
  const detailLine = `${leftDetail}${spaces}${rightDetail}`;

  return `${nameLine}\n${detailLine}`;
};

/**
 * Formats the entire receipt string matching 58mm (32 chars/line) standard.
 * Layout: 2-line item rows without column headers.
 */
export const generateReceiptText = (customerName, cartItems, printDate = null) => {
  const dateStr = printDate || getRealtimeDateString(true);
  const custName = (customerName && customerName.trim()) ? customerName.trim().toUpperCase() : 'UMUM / CASH';
  const divider = '-'.repeat(LINE_WIDTH);
  const doubleDivider = '='.repeat(LINE_WIDTH);

  const totalMeters = cartItems.reduce((acc, item) => acc + (parseFloat(item.meterVal || item.meter) || 0), 0);
  const grandTotal = cartItems.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);
  const grandTotalFormatted = formatNumber(grandTotal);

  const lines = [];

  // Header Toko Kain Tiga Dara
  lines.push(doubleDivider);
  lines.push(padString('TOKO KAIN TIGA DARA', LINE_WIDTH, 'center'));
  lines.push(padString('Jl. Kemuning 32A, Pusung', LINE_WIDTH, 'center'));
  lines.push(padString('Boyolali', LINE_WIDTH, 'center'));
  lines.push(padString('WA. 082 220 200 676', LINE_WIDTH, 'center'));
  lines.push(doubleDivider);

  // Metadata Pelanggan & Tanggal
  lines.push(`Tgl. ${dateStr}`);
  lines.push(`Kepada Yth.`);
  lines.push(`Tuan/Toko: ${custName}`);
  lines.push(divider);

  // Items (2 Lines per item, no column headers)
  if (cartItems.length === 0) {
    lines.push(padString('Belum ada barang', LINE_WIDTH, 'center'));
  } else {
    for (const item of cartItems) {
      lines.push(formatItemTwoLines(item));
    }
  }

  lines.push(divider);

  // Summary & Grand Total
  lines.push(`Total Item  : ${cartItems.length} Kain`);
  lines.push(`Total Meter : ${formatTotalMeter(totalMeters)}m`);
  
  const totalLabel = "Jumlah Rp.";
  const remainingSpace = LINE_WIDTH - totalLabel.length;
  const rightPaddedTotal = padString(grandTotalFormatted, remainingSpace, 'left');
  lines.push(`${totalLabel}${rightPaddedTotal}`);
  lines.push(divider);

  // Bottom Footer Messages
  lines.push(padString('Maturnuwun', LINE_WIDTH, 'center'));
  lines.push(padString('Semoga Kita Selalu Diberi', LINE_WIDTH, 'center'));
  lines.push(padString('Kesehatan, Rejekinya Lancar', LINE_WIDTH, 'center'));
  lines.push(padString('Dan Umur Yang Barokah', LINE_WIDTH, 'center'));

  return lines.join('\n');
};

/**
 * Converts a text string and ESC/POS commands into a binary Uint8Array.
 * Calibrated 3-line tear feed.
 */
export const createEscPosBuffer = (customerName, cartItems, realtimeDate) => {
  const receiptText = generateReceiptText(customerName, cartItems, realtimeDate);

  // ESC/POS Commands
  const ESC = 0x1b;

  const init = [ESC, 0x40]; // ESC @ (Initialize printer)
  const alignLeft = [ESC, 0x61, 0x00]; // Align left
  const lineSpacing = [ESC, 0x32]; // Default line spacing
  
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(receiptText + '\n');

  // Feed 3 baris pas di pisau sobek
  const feedTear = [
    ESC, 0x64, 0x03 // ESC d 3
  ];

  // Combine commands and data
  const fullBuffer = new Uint8Array([
    ...init,
    ...alignLeft,
    ...lineSpacing,
    ...textBytes,
    ...feedTear
  ]);

  return {
    rawText: receiptText,
    binaryBuffer: fullBuffer
  };
};

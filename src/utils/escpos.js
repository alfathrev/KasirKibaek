import { formatCompactPrice, formatMeter, getRealtimeDateString } from './formatters';

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
 * Builds a 32-character line for an item in 4 columns:
 * 1. Nama Barang (11 chars, left-aligned)
 * 2. Banyak (6 chars, right-aligned)
 * 3. Harga (6 chars, right-aligned)
 * 4. Jumlah (6 chars, right-aligned)
 * Separated by 1 space each (11 + 1 + 6 + 1 + 6 + 1 + 6 = 32)
 */
export const formatItemRow = (item, useKNotation = true) => {
  const name = padString(item.namaKain || 'Kain', 11, 'right');
  const mtr = padString(`${formatMeter(item.meter)}m`, 6, 'left');
  const hrg = padString(formatCompactPrice(item.hargaSatuan, useKNotation), 6, 'left');
  const jml = padString(formatCompactPrice(item.jumlah, useKNotation), 6, 'left');

  return `${name} ${mtr} ${hrg} ${jml}`;
};

/**
 * Formats the entire receipt string matching 58mm (32 chars/line) standard.
 * Exact template based on "TOKO KAIN TIGA DARA" physical receipt.
 */
export const generateReceiptText = (customerName, cartItems, printDate = null, useKNotation = true) => {
  const dateStr = printDate || getRealtimeDateString(true);
  const custName = (customerName && customerName.trim()) ? customerName.trim().toUpperCase() : 'UMUM / CASH';
  const divider = '-'.repeat(LINE_WIDTH);
  const doubleDivider = '='.repeat(LINE_WIDTH);

  const grandTotal = cartItems.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);
  const grandTotalFormatted = String(grandTotal);

  const lines = [];

  // Header Toko Kain Tiga Dara
  lines.push(doubleDivider);
  lines.push(padString('TOKO KAIN', LINE_WIDTH, 'center'));
  lines.push(padString('TIGA DARA', LINE_WIDTH, 'center'));
  lines.push(padString('Jl. Kemuning 32A, Pusung', LINE_WIDTH, 'center'));
  lines.push(padString('Boyolali', LINE_WIDTH, 'center'));
  lines.push(padString('(Komplek MTsN Boyolali)', LINE_WIDTH, 'center'));
  lines.push(padString('WA. 082 220 200 676', LINE_WIDTH, 'center'));
  lines.push(doubleDivider);

  // Metadata Pelanggan & Tanggal
  lines.push(`Tgl. ${dateStr}`);
  lines.push(`Kepada Yth.`);
  lines.push(`Tuan/Toko: ${custName}`);
  lines.push(divider);

  // Table Columns Header (Exactly 32 chars)
  // Nama Barang(11) + ' '(1) + 'Banyak'(6) + ' '(1) + ' Harga'(6) + ' '(1) + 'Jumlah'(6) = 32
  const colHeader = `${padString('Nama Barang', 11, 'right')} ${padString('Banyak', 6, 'left')} ${padString('Harga', 6, 'left')} ${padString('Jumlah', 6, 'left')}`;
  lines.push(colHeader);
  lines.push(divider);

  // Items
  if (cartItems.length === 0) {
    lines.push(padString('Belum ada barang', LINE_WIDTH, 'right'));
  } else {
    for (const item of cartItems) {
      lines.push(formatItemRow(item, useKNotation));
    }
  }

  lines.push(divider);

  // Total Row (Left text: "Jumlah Rp.", Right: Grand total)
  const label = "Jumlah Rp.";
  const remainingSpace = LINE_WIDTH - label.length;
  const rightPaddedTotal = padString(grandTotalFormatted, remainingSpace, 'left');
  lines.push(`${label}${rightPaddedTotal}`);
  lines.push(divider);

  // Bottom Footer Messages
  lines.push('');
  lines.push(padString('Maturnuwun', LINE_WIDTH, 'center'));
  lines.push('');
  lines.push(padString('Semoga Kita Selalu Diberi', LINE_WIDTH, 'center'));
  lines.push(padString('Kesehatan, Rejekinya Lancar', LINE_WIDTH, 'center'));
  lines.push(padString('Dan Umur Yang Barokah', LINE_WIDTH, 'center'));

  return lines.join('\n');
};

/**
 * Converts a text string and ESC/POS commands into a binary Uint8Array.
 */
export const createEscPosBuffer = (customerName, cartItems, realtimeDate, useKNotation = true) => {
  const receiptText = generateReceiptText(customerName, cartItems, realtimeDate, useKNotation);

  // ESC/POS Commands
  const ESC = 0x1b;
  const GS = 0x1d;

  const init = [ESC, 0x40]; // ESC @ (Initialize printer)
  const alignLeft = [ESC, 0x61, 0x00]; // Align left
  const lineSpacing = [ESC, 0x32]; // Default line spacing
  
  // Convert text string to bytes
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(receiptText + '\n\n\n\n\n'); // Add feed lines

  const feedCut = [
    ESC, 0x64, 0x03, // ESC d 3 (Feed 3 lines)
    GS, 0x56, 0x42, 0x00 // Partial cut if supported
  ];

  // Combine commands and data
  const fullBuffer = new Uint8Array([
    ...init,
    ...alignLeft,
    ...lineSpacing,
    ...textBytes,
    ...feedCut
  ]);

  return {
    rawText: receiptText,
    binaryBuffer: fullBuffer
  };
};

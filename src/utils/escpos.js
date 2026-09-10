import { formatCompactPrice, formatMeter, getRealtimeDateString } from './formatters';

export const LINE_WIDTH = 32;

/**
 * Pads a string with spaces to a given length.
 * direction: 'left' (right-align text) or 'right' (left-align text)
 */
export const padString = (str, length, direction = 'right') => {
  const s = String(str ?? '');
  if (s.length >= length) {
    return s.slice(0, length);
  }
  const spaces = ' '.repeat(length - s.length);
  return direction === 'left' ? spaces + s : s + spaces;
};

/**
 * Builds a 32-character line for an item in 4 columns:
 * 1. NAMA KAIN (12 chars, left-aligned)
 * 2. MTR (4 chars, right-aligned)
 * 3. HRG (6 chars, right-aligned)
 * 4. JML (7 chars, right-aligned)
 * Separated by 1 space each (12 + 1 + 4 + 1 + 6 + 1 + 7 = 32)
 */
export const formatItemRow = (item, useKNotation = true) => {
  const name = padString(item.namaKain || 'Kain', 12, 'right');
  const mtr = padString(formatMeter(item.meter), 4, 'left');
  const hrg = padString(formatCompactPrice(item.hargaSatuan, useKNotation), 6, 'left');
  const jml = padString(formatCompactPrice(item.jumlah, useKNotation), 7, 'left');

  return `${name} ${mtr} ${hrg} ${jml}`;
};

/**
 * Formats the entire receipt string matching 58mm (32 chars/line) standard.
 */
export const generateReceiptText = (customerName, cartItems, printDate = null, useKNotation = true) => {
  const dateStr = printDate || getRealtimeDateString(true);
  const custName = (customerName && customerName.trim()) ? customerName.trim().toUpperCase() : 'UMUM / CASH';
  const divider = '-'.repeat(LINE_WIDTH);

  const grandTotal = cartItems.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);
  const grandTotalFormatted = String(grandTotal);

  const lines = [];

  // Header
  lines.push(`Tgl. ${dateStr}`);
  lines.push(`Kepada Yth.`);
  lines.push(`Tuan/Toko: ${custName}`);
  lines.push(divider);

  // Table Columns Header (Exactly 32 chars)
  // NAMA KAIN(12) + ' '(1) + ' MTR'(4) + ' '(1) + '   HRG'(6) + ' '(1) + '    JML'(7) = 32
  const colHeader = `${padString('NAMA KAIN', 12, 'right')} ${padString('MTR', 4, 'left')} ${padString('HRG', 6, 'left')} ${padString('JML', 7, 'left')}`;
  lines.push(colHeader);
  lines.push(divider);

  // Items
  if (cartItems.length === 0) {
    lines.push(padString('Belum ada item', LINE_WIDTH, 'right'));
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
  const textBytes = encoder.encode(receiptText + '\n\n\n\n'); // Add feed lines

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

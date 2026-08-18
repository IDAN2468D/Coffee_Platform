import { PDFDocument, rgb, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { OrderReceiptData } from './googleDriveService';

// In-memory cache for the font buffer to avoid repeated network fetches
let cachedFontBytes: ArrayBuffer | null = null;

async function getRubikFontBytes(): Promise<ArrayBuffer> {
  if (cachedFontBytes) {
    return cachedFontBytes;
  }
  const fontUrl =
    'https://fonts.gstatic.com/s/rubik/v28/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-WYi1UE80V4bVkA.ttf';
  const response = await fetch(fontUrl);
  if (!response.ok) {
    throw new Error('Failed to download Rubik font for PDF receipt rendering');
  }
  cachedFontBytes = await response.arrayBuffer();
  return cachedFontBytes;
}

/**
 * Reverses Hebrew characters for proper RTL display in PDF LTR text rendering.
 */
export function formatBidiText(str: string): string {
  if (!str) return '';
  if (!/[\u0590-\u05FF]/.test(str)) {
    return str;
  }

  // Split into words, reverse Hebrew words and rearrange for RTL presentation
  const words = str.split(' ');
  const processed = words.map((w) => {
    if (/[\u0590-\u05FF]/.test(w)) {
      return w.split('').reverse().join('');
    }
    return w;
  });

  return processed.reverse().join(' ');
}

/**
 * Generates a high-quality, branded PDF receipt buffer for an order.
 */
export async function generateReceiptPdfBuffer(order: OrderReceiptData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontBytes = await getRubikFontBytes();
  const font = await pdfDoc.embedFont(fontBytes);

  // A4 Page dimensions: 595.28 x 841.89 points
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Color palette
  const darkBg = rgb(0.06, 0.05, 0.05); // #0f0d0d
  const cardBg = rgb(0.09, 0.08, 0.07); // #171412
  const borderAmber = rgb(0.85, 0.55, 0.1); // #d97706
  const goldPrimary = rgb(0.96, 0.62, 0.07); // #f59e0b
  const textWhite = rgb(0.96, 0.96, 0.96);
  const textMuted = rgb(0.65, 0.65, 0.68);
  const tableHeaderBg = rgb(0.14, 0.12, 0.1);
  const dividerColor = rgb(0.2, 0.18, 0.16);

  // 1. Draw Page Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: darkBg,
  });

  // 2. Draw Main Outer Card
  const marginX = 35;
  const marginY = 35;
  const cardWidth = pageWidth - marginX * 2;
  const cardHeight = pageHeight - marginY * 2;

  page.drawRectangle({
    x: marginX,
    y: marginY,
    width: cardWidth,
    height: cardHeight,
    borderColor: borderAmber,
    borderWidth: 1.5,
    color: cardBg,
  });

  let currentY = pageHeight - 75;

  // 3. Header Branding
  const brandTitle = 'THE DIGITAL ROAST';
  const brandWidth = font.widthOfTextAtSize(brandTitle, 22);
  page.drawText(brandTitle, {
    x: (pageWidth - brandWidth) / 2,
    y: currentY,
    size: 22,
    font,
    color: goldPrimary,
  });

  currentY -= 18;
  const brandSub = 'Gourmet Coffee Lab & Micro-Roastery';
  const subWidth = font.widthOfTextAtSize(brandSub, 10);
  page.drawText(brandSub, {
    x: (pageWidth - subWidth) / 2,
    y: currentY,
    size: 10,
    font,
    color: textMuted,
  });

  currentY -= 22;
  const receiptTitle = formatBidiText(`קבלה דיגיטלית / חשבונית מס ממוחשבת #${order.orderNumber}`);
  const titleWidth = font.widthOfTextAtSize(receiptTitle, 13);
  page.drawText(receiptTitle, {
    x: (pageWidth - titleWidth) / 2,
    y: currentY,
    size: 13,
    font,
    color: textWhite,
  });

  // Header Divider
  currentY -= 18;
  page.drawLine({
    start: { x: marginX + 25, y: currentY },
    end: { x: pageWidth - marginX - 25, y: currentY },
    thickness: 1,
    color: borderAmber,
  });

  // 4. Order Information Box
  currentY -= 20;
  const infoBoxHeight = 65;
  page.drawRectangle({
    x: marginX + 20,
    y: currentY - infoBoxHeight,
    width: cardWidth - 40,
    height: infoBoxHeight,
    color: rgb(0.12, 0.1, 0.09),
    borderColor: rgb(0.25, 0.2, 0.15),
    borderWidth: 1,
  });

  const formattedDate = new Date(order.createdAt).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const infoY = currentY - 22;
  // Right Column (Hebrew details)
  const clientText = formatBidiText(`שם הלקוח: ${order.fullName}`);
  page.drawText(clientText, {
    x: marginX + 35,
    y: infoY,
    size: 10,
    font,
    color: textWhite,
  });

  const phoneText = formatBidiText(`טלפון: ${order.phone}`);
  page.drawText(phoneText, {
    x: marginX + 35,
    y: infoY - 22,
    size: 10,
    font,
    color: textMuted,
  });

  // Left Column
  const dateText = formatBidiText(`תאריך: ${formattedDate}`);
  page.drawText(dateText, {
    x: marginX + cardWidth / 2 + 10,
    y: infoY,
    size: 10,
    font,
    color: textWhite,
  });

  const addressText = formatBidiText(`כתובת: ${order.deliveryAddress}`);
  page.drawText(addressText, {
    x: marginX + cardWidth / 2 + 10,
    y: infoY - 22,
    size: 10,
    font,
    color: textMuted,
  });

  // 5. Items Table
  currentY = currentY - infoBoxHeight - 25;
  const tableX = marginX + 20;
  const tableWidth = cardWidth - 40;
  const rowHeight = 28;

  // Table Header Row
  page.drawRectangle({
    x: tableX,
    y: currentY - 22,
    width: tableWidth,
    height: 22,
    color: tableHeaderBg,
  });

  // Columns: [Total 80px] [Price 80px] [Qty 50px] [Item Name Remainder]
  const colTotalX = tableX + 15;
  const colPriceX = tableX + 95;
  const colQtyX = tableX + 175;
  const colNameX = tableX + 240;

  page.drawText(formatBidiText('סה"כ'), { x: colTotalX, y: currentY - 16, size: 9, font, color: goldPrimary });
  page.drawText(formatBidiText('מחיר יח\''), { x: colPriceX, y: currentY - 16, size: 9, font, color: textWhite });
  page.drawText(formatBidiText('כמות'), { x: colQtyX, y: currentY - 16, size: 9, font, color: textWhite });
  page.drawText(formatBidiText('פריט והתאמה אישית'), { x: colNameX, y: currentY - 16, size: 9, font, color: textWhite });

  currentY -= 26;

  // Render Table Items
  const items = order.items || [];
  for (const item of items) {
    const lineTotal = item.quantity * item.pricePerUnit;
    const details = [
      item.shots ? `${item.shots} שוטים` : '',
      item.milkType ? item.milkType : '',
      item.origin ? item.origin : '',
    ]
      .filter(Boolean)
      .join(' • ');

    const itemLabel = details ? `${item.itemName} (${details})` : item.itemName;

    // Item line
    page.drawText(`₪${lineTotal.toFixed(2)}`, {
      x: colTotalX,
      y: currentY - 14,
      size: 10,
      font,
      color: goldPrimary,
    });

    page.drawText(`₪${item.pricePerUnit.toFixed(2)}`, {
      x: colPriceX,
      y: currentY - 14,
      size: 9,
      font,
      color: textWhite,
    });

    page.drawText(String(item.quantity), {
      x: colQtyX + 5,
      y: currentY - 14,
      size: 9,
      font,
      color: textWhite,
    });

    page.drawText(formatBidiText(itemLabel), {
      x: colNameX,
      y: currentY - 14,
      size: 9,
      font,
      color: textWhite,
    });

    // Row underline
    page.drawLine({
      start: { x: tableX, y: currentY - 20 },
      end: { x: tableX + tableWidth, y: currentY - 20 },
      thickness: 0.5,
      color: dividerColor,
    });

    currentY -= rowHeight;
  }

  // 6. Totals Box
  currentY -= 15;
  const vatRate = 0.18;
  const subtotal = order.totalPrice / (1 + vatRate);
  const vatAmount = order.totalPrice - subtotal;

  const totalsBoxX = tableX + tableWidth - 220;
  const totalsBoxWidth = 220;

  // Subtotal
  page.drawText(formatBidiText('סכום לפני מע"מ:'), {
    x: totalsBoxX + 90,
    y: currentY,
    size: 10,
    font,
    color: textMuted,
  });
  page.drawText(`₪${subtotal.toFixed(2)}`, {
    x: totalsBoxX + 10,
    y: currentY,
    size: 10,
    font,
    color: textWhite,
  });

  currentY -= 18;
  // VAT
  page.drawText(formatBidiText('מע"מ (18%):'), {
    x: totalsBoxX + 90,
    y: currentY,
    size: 10,
    font,
    color: textMuted,
  });
  page.drawText(`₪${vatAmount.toFixed(2)}`, {
    x: totalsBoxX + 10,
    y: currentY,
    size: 10,
    font,
    color: textWhite,
  });

  currentY -= 10;
  page.drawLine({
    start: { x: totalsBoxX, y: currentY },
    end: { x: tableX + tableWidth, y: currentY },
    thickness: 1,
    color: borderAmber,
  });

  currentY -= 20;
  // Grand Total
  page.drawText(formatBidiText('סה"כ לתשלום:'), {
    x: totalsBoxX + 90,
    y: currentY,
    size: 12,
    font,
    color: goldPrimary,
  });
  page.drawText(`₪${order.totalPrice.toFixed(2)}`, {
    x: totalsBoxX + 10,
    y: currentY,
    size: 13,
    font,
    color: goldPrimary,
  });

  // 7. Footer & Security Seal
  const footerY = marginY + 45;
  page.drawLine({
    start: { x: marginX + 30, y: footerY + 25 },
    end: { x: pageWidth - marginX - 30, y: footerY + 25 },
    thickness: 0.5,
    color: rgb(0.3, 0.25, 0.2),
  });

  const footerText1 = formatBidiText('מסמך ממוחשב זה הינו קבלה / חשבונית מס דיגיטלית חוקית מבית The Digital Roast');
  const f1Width = font.widthOfTextAtSize(footerText1, 8.5);
  page.drawText(footerText1, {
    x: (pageWidth - f1Width) / 2,
    y: footerY + 10,
    size: 8.5,
    font,
    color: textMuted,
  });

  const footerText2 = formatBidiText('סונכרן ונשמר אוטומטית כ-PDF רשמי ומאובטח בענן Google Drive ☕');
  const f2Width = font.widthOfTextAtSize(footerText2, 8.5);
  page.drawText(footerText2, {
    x: (pageWidth - f2Width) / 2,
    y: footerY - 4,
    size: 8.5,
    font,
    color: textMuted,
  });

  return await pdfDoc.save();
}

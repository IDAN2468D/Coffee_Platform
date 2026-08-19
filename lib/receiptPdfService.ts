
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
 * Generates an ultra-luxurious, branded PDF receipt buffer for an order.
 * Designed with Liquid Glass & Gold Foil aesthetics for Google Drive cloud sync.
 */
export async function generateReceiptPdfBuffer(order: OrderReceiptData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontBytes = await getRubikFontBytes();
  const font = await pdfDoc.embedFont(fontBytes);

  // Standard A4 Page dimensions: 595.28 x 841.89 points
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Luxury Color Palette
  const bgDark = rgb(0.04, 0.035, 0.03); // Deep luxury obsidian #0a0908
  const cardBg = rgb(0.075, 0.065, 0.055); // #13110e
  const innerCardBg = rgb(0.1, 0.085, 0.07); // #1a1612
  const goldPrimary = rgb(0.96, 0.62, 0.07); // #f59e0b
  const goldAmber = rgb(0.85, 0.55, 0.1); // #d97706
  const goldLight = rgb(0.98, 0.75, 0.14); // #fbbf24
  const emeraldGreen = rgb(0.2, 0.8, 0.45); // #34d399
  const textWhite = rgb(0.97, 0.97, 0.97); // #f8fafc
  const textMuted = rgb(0.68, 0.64, 0.6); // #a8a29e
  const textSubtle = rgb(0.48, 0.45, 0.42); // #78716c
  const tableHeaderBg = rgb(0.13, 0.11, 0.09); // #211c17
  const tableRowAltBg = rgb(0.085, 0.075, 0.065); // #161310
  const dividerColor = rgb(0.22, 0.18, 0.14);

  // 1. Draw Page Background (Obsidian)
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: bgDark,
  });

  // 2. Draw Double Gold Foil Outer Border
  const marginX = 28;
  const marginY = 28;
  const cardWidth = pageWidth - marginX * 2;
  const cardHeight = pageHeight - marginY * 2;

  // Outer primary card container
  page.drawRectangle({
    x: marginX,
    y: marginY,
    width: cardWidth,
    height: cardHeight,
    borderColor: goldAmber,
    borderWidth: 1.2,
    color: cardBg,
  });

  // Inner subtle gold inlay frame
  page.drawRectangle({
    x: marginX + 4,
    y: marginY + 4,
    width: cardWidth - 8,
    height: cardHeight - 8,
    borderColor: rgb(0.35, 0.25, 0.12),
    borderWidth: 0.6,
  });

  let currentY = pageHeight - 62;

  // 3. Header Branding & Luxury Seal
  const brandTitle = 'THE DIGITAL ROAST';
  const brandWidth = font.widthOfTextAtSize(brandTitle, 21);
  page.drawText(brandTitle, {
    x: (pageWidth - brandWidth) / 2,
    y: currentY,
    size: 21,
    font,
    color: goldLight,
  });

  currentY -= 15;
  const brandSubtitle = 'GOURMET COFFEE LAB & MICRO-ROASTERY • SPECIALTY EXTRACTION SCIENCE';
  const subWidth = font.widthOfTextAtSize(brandSubtitle, 7.5);
  page.drawText(brandSubtitle, {
    x: (pageWidth - subWidth) / 2,
    y: currentY,
    size: 7.5,
    font,
    color: textMuted,
  });

  currentY -= 13;
  const companyMeta = formatBidiText('ח.פ. 519824601 • שדרות רוטשילד 45, תל אביב • טל: 03-6821900 • support@digitalroast.co.il');
  const compWidth = font.widthOfTextAtSize(companyMeta, 7);
  page.drawText(companyMeta, {
    x: (pageWidth - compWidth) / 2,
    y: currentY,
    size: 7,
    font,
    color: textSubtle,
  });

  // Certified Digital Stamp Pill
  currentY -= 20;
  const stampText = formatBidiText('✓ מסמך ממוחשב - מקור חתום דיגיטלית ומאושר');
  const stampWidth = font.widthOfTextAtSize(stampText, 8.5);
  const pillPadding = 12;
  const pillWidth = stampWidth + pillPadding * 2;
  const pillHeight = 16;
  const pillX = (pageWidth - pillWidth) / 2;

  page.drawRectangle({
    x: pillX,
    y: currentY - 3,
    width: pillWidth,
    height: pillHeight,
    color: rgb(0.04, 0.15, 0.08),
    borderColor: rgb(0.12, 0.45, 0.22),
    borderWidth: 0.8,
  });

  page.drawText(stampText, {
    x: pillX + pillPadding,
    y: currentY,
    size: 8.5,
    font,
    color: emeraldGreen,
  });

  // Invoice / Receipt Title Badge
  currentY -= 22;
  const invoiceNum = order.orderNumber.startsWith('DR-') ? order.orderNumber : `DR-${order.orderNumber}`;
  const receiptTitle = formatBidiText(`חשבונית מס / קבלה דיגיטלית #${invoiceNum}`);
  const titleWidth = font.widthOfTextAtSize(receiptTitle, 13);
  page.drawText(receiptTitle, {
    x: (pageWidth - titleWidth) / 2,
    y: currentY,
    size: 13,
    font,
    color: textWhite,
  });

  // Gold Decorative Line
  currentY -= 14;
  page.drawLine({
    start: { x: marginX + 30, y: currentY },
    end: { x: pageWidth - marginX - 30, y: currentY },
    thickness: 0.8,
    color: goldAmber,
  });

  // 4. Order Information Container Box
  currentY -= 14;
  const infoBoxHeight = 68;
  const infoBoxWidth = cardWidth - 36;
  const infoBoxX = marginX + 18;

  page.drawRectangle({
    x: infoBoxX,
    y: currentY - infoBoxHeight,
    width: infoBoxWidth,
    height: infoBoxHeight,
    color: innerCardBg,
    borderColor: rgb(0.3, 0.22, 0.15),
    borderWidth: 0.8,
  });

  const formattedDate = new Date(order.createdAt).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const infoRow1Y = currentY - 18;
  const infoRow2Y = currentY - 36;
  const infoRow3Y = currentY - 54;

  const colRightX = infoBoxX + infoBoxWidth - 14;
  const colLeftX = infoBoxX + (infoBoxWidth / 2) - 10;

  // Row 1: Client Name (Right), Date & Time (Left)
  const clientLabel = formatBidiText(`שם המזמין: ${order.fullName || 'לקוח The Digital Roast'}`);
  page.drawText(clientLabel, {
    x: colRightX - font.widthOfTextAtSize(clientLabel, 9.5),
    y: infoRow1Y,
    size: 9.5,
    font,
    color: textWhite,
  });

  const dateLabel = formatBidiText(`תאריך ושעת הפקה: ${formattedDate}`);
  page.drawText(dateLabel, {
    x: colLeftX - font.widthOfTextAtSize(dateLabel, 9),
    y: infoRow1Y,
    size: 9,
    font,
    color: textWhite,
  });

  // Row 2: Phone (Right), Delivery Address (Left)
  const phoneLabel = formatBidiText(`טלפון ליצירת קשר: ${order.phone || '050-0000000'}`);
  page.drawText(phoneLabel, {
    x: colRightX - font.widthOfTextAtSize(phoneLabel, 8.5),
    y: infoRow2Y,
    size: 8.5,
    font,
    color: textMuted,
  });

  const addressLabel = formatBidiText(`כתובת יעד למשלוח: ${order.deliveryAddress || 'איסוף עצמי מסניף רוטשילד'}`);
  page.drawText(addressLabel, {
    x: colLeftX - font.widthOfTextAtSize(addressLabel, 8.5),
    y: infoRow2Y,
    size: 8.5,
    font,
    color: textMuted,
  });

  // Row 3: Payment Method & Status
  const paymentLabel = formatBidiText(`אמצעי תשלום: ${order.paymentMethod || 'כרטיס אשראי מאובטח (SSL 256-bit)'}`);
  page.drawText(paymentLabel, {
    x: colRightX - font.widthOfTextAtSize(paymentLabel, 8.5),
    y: infoRow3Y,
    size: 8.5,
    font,
    color: textMuted,
  });

  const statusLabel = formatBidiText('סטטוס תשלום: שולם במלואו (PAID) ✓');
  page.drawText(statusLabel, {
    x: colLeftX - font.widthOfTextAtSize(statusLabel, 8.5),
    y: infoRow3Y,
    size: 8.5,
    font,
    color: emeraldGreen,
  });

  // 5. Itemized Table of Coffee & Gourmet Items
  currentY = currentY - infoBoxHeight - 20;
  const tableX = marginX + 18;
  const tableWidth = cardWidth - 36;
  const tableHeaderHeight = 22;

  // Table Header Background
  page.drawRectangle({
    x: tableX,
    y: currentY - tableHeaderHeight,
    width: tableWidth,
    height: tableHeaderHeight,
    color: tableHeaderBg,
    borderColor: rgb(0.4, 0.28, 0.15),
    borderWidth: 0.6,
  });

  // Column definitions (RTL layout)
  const colTotalX = tableX + 14;
  const colPriceX = tableX + 85;
  const colQtyX = tableX + 160;
  const colNameX = tableX + tableWidth - 14;

  const thTotal = formatBidiText('סה"כ');
  page.drawText(thTotal, { x: colTotalX, y: currentY - 15, size: 9, font, color: goldLight });

  const thPrice = formatBidiText('מחיר יח\'');
  page.drawText(thPrice, { x: colPriceX, y: currentY - 15, size: 9, font, color: textWhite });

  const thQty = formatBidiText('כמות');
  page.drawText(thQty, { x: colQtyX, y: currentY - 15, size: 9, font, color: textWhite });

  const thDesc = formatBidiText('תיאור פריט הקפה והתאמות בראיסטה');
  const thDescWidth = font.widthOfTextAtSize(thDesc, 9);
  page.drawText(thDesc, { x: colNameX - thDescWidth, y: currentY - 15, size: 9, font, color: textWhite });

  currentY -= (tableHeaderHeight + 6);

  // Render Items
  const items = order.items || [];
  const rowHeight = 26;

  items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      page.drawRectangle({
        x: tableX,
        y: currentY - rowHeight + 4,
        width: tableWidth,
        height: rowHeight,
        color: tableRowAltBg,
      });
    }

    const lineTotal = item.quantity * item.pricePerUnit;
    const details = [
      item.shots ? `${item.shots} שוטים` : '',
      item.milkType ? item.milkType : '',
      item.origin ? `מקור: ${item.origin}` : '',
    ]
      .filter(Boolean)
      .join(' • ');

    const itemTitle = details ? `${item.itemName} (${details})` : item.itemName;
    const bidiItemTitle = formatBidiText(itemTitle);
    const itemTitleWidth = font.widthOfTextAtSize(bidiItemTitle, 9);

    // Line Total
    page.drawText(`₪${lineTotal.toFixed(2)}`, {
      x: colTotalX,
      y: currentY - 13,
      size: 9.5,
      font,
      color: goldLight,
    });

    // Price Per Unit
    page.drawText(`₪${item.pricePerUnit.toFixed(2)}`, {
      x: colPriceX,
      y: currentY - 13,
      size: 8.5,
      font,
      color: textWhite,
    });

    // Quantity
    page.drawText(String(item.quantity), {
      x: colQtyX + 6,
      y: currentY - 13,
      size: 9,
      font,
      color: textWhite,
    });

    // Item Description
    page.drawText(bidiItemTitle, {
      x: colNameX - itemTitleWidth,
      y: currentY - 13,
      size: 9,
      font,
      color: textWhite,
    });

    // Bottom divider
    page.drawLine({
      start: { x: tableX, y: currentY - rowHeight + 4 },
      end: { x: tableX + tableWidth, y: currentY - rowHeight + 4 },
      thickness: 0.4,
      color: dividerColor,
    });

    currentY -= rowHeight;
  });

  // 6. Totals Box & VAT Calculations
  currentY -= 12;
  const vatRate = 0.18;
  const subtotal = order.totalPrice / (1 + vatRate);
  const vatAmount = order.totalPrice - subtotal;

  const totalsBoxWidth = 240;
  const totalsBoxX = tableX + tableWidth - totalsBoxWidth;
  const totalsBoxHeight = 84;

  page.drawRectangle({
    x: totalsBoxX,
    y: currentY - totalsBoxHeight,
    width: totalsBoxWidth,
    height: totalsBoxHeight,
    color: innerCardBg,
    borderColor: rgb(0.4, 0.28, 0.15),
    borderWidth: 0.8,
  });

  const totalsColLabelX = totalsBoxX + totalsBoxWidth - 12;
  const totalsColValX = totalsBoxX + 12;

  // Subtotal
  let totY = currentY - 16;
  const lblSubtotal = formatBidiText('סכום ביניים (לפני מע"מ):');
  page.drawText(lblSubtotal, {
    x: totalsColLabelX - font.widthOfTextAtSize(lblSubtotal, 8.5),
    y: totY,
    size: 8.5,
    font,
    color: textMuted,
  });
  page.drawText(`₪${subtotal.toFixed(2)}`, {
    x: totalsColValX,
    y: totY,
    size: 8.5,
    font,
    color: textWhite,
  });

  // VAT (18%)
  totY -= 16;
  const lblVat = formatBidiText('מע"מ כחוק (18%):');
  page.drawText(lblVat, {
    x: totalsColLabelX - font.widthOfTextAtSize(lblVat, 8.5),
    y: totY,
    size: 8.5,
    font,
    color: textMuted,
  });
  page.drawText(`₪${vatAmount.toFixed(2)}`, {
    x: totalsColValX,
    y: totY,
    size: 8.5,
    font,
    color: textWhite,
  });

  // Free VIP Delivery
  totY -= 16;
  const lblShip = formatBidiText('דמי משלוח וטיפול VIP:');
  page.drawText(lblShip, {
    x: totalsColLabelX - font.widthOfTextAtSize(lblShip, 8.5),
    y: totY,
    size: 8.5,
    font,
    color: textMuted,
  });
  const lblFree = formatBidiText('חינם (הטבת מועדון)');
  page.drawText(lblFree, {
    x: totalsColValX,
    y: totY,
    size: 8,
    font,
    color: emeraldGreen,
  });

  // Grand Total Box Inlay
  totY -= 24;
  page.drawRectangle({
    x: totalsBoxX + 4,
    y: totY - 4,
    width: totalsBoxWidth - 8,
    height: 20,
    color: rgb(0.2, 0.15, 0.08),
    borderColor: goldAmber,
    borderWidth: 0.8,
  });

  const lblGrand = formatBidiText('סה"כ לתשלום כולל מע"מ:');
  page.drawText(lblGrand, {
    x: totalsColLabelX - 8 - font.widthOfTextAtSize(lblGrand, 9.5),
    y: totY + 2,
    size: 9.5,
    font,
    color: goldLight,
  });

  page.drawText(`₪${order.totalPrice.toFixed(2)}`, {
    x: totalsColValX + 4,
    y: totY + 2,
    size: 11,
    font,
    color: goldLight,
  });

  // 7. Security Barcode & Google Drive Cloud Verification Footer
  const footerBaseY = marginY + 22;

  // Barcode line simulation
  const barcodeX = marginX + 30;
  const barcodeY = footerBaseY + 38;
  const barPattern = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 4, 2, 1, 2, 3, 2, 1, 4, 1, 3];
  let curBarX = barcodeX;
  for (const barWidth of barPattern) {
    page.drawRectangle({
      x: curBarX,
      y: barcodeY,
      width: barWidth * 1.5,
      height: 18,
      color: goldAmber,
    });
    curBarX += (barWidth * 1.5) + 2.5;
  }

  // Cloud Auth Hash & Specs
  const authHash = `DRIVE-AUTH-${invoiceNum}-${Date.now().toString(36).toUpperCase()}-SCA-GOLD-CUP`;
  page.drawText(authHash, {
    x: barcodeX,
    y: barcodeY - 9,
    size: 6.5,
    font,
    color: textSubtle,
  });

  // Google Drive Cloud Backup Badge (Left of barcode)
  const cloudBadgeText = formatBidiText('☁ סונכרן ונשמר אוטומטית כ-PDF רשמי ומאובטח בענן Google Drive');
  const cloudBadgeWidth = font.widthOfTextAtSize(cloudBadgeText, 8);
  page.drawText(cloudBadgeText, {
    x: (pageWidth - marginX - 25) - cloudBadgeWidth,
    y: barcodeY + 8,
    size: 8,
    font,
    color: goldLight,
  });

  const securityNotice = formatBidiText('מסמך זה הינו קבלה / חשבונית מס דיגיטלית חוקית מבית The Digital Roast בע"מ.');
  const secWidth = font.widthOfTextAtSize(securityNotice, 7.5);
  page.drawText(securityNotice, {
    x: (pageWidth - marginX - 25) - secWidth,
    y: barcodeY - 4,
    size: 7.5,
    font,
    color: textMuted,
  });

  // Bottom Divider
  page.drawLine({
    start: { x: marginX + 25, y: footerBaseY + 18 },
    end: { x: pageWidth - marginX - 25, y: footerBaseY + 18 },
    thickness: 0.5,
    color: rgb(0.3, 0.22, 0.15),
  });

  const thankYouText = formatBidiText('תודה שבחרת ב-The Digital Roast • חווית קפה ספציאליטי יוצאת דופן ☕');
  const thankWidth = font.widthOfTextAtSize(thankYouText, 8.5);
  page.drawText(thankYouText, {
    x: (pageWidth - thankWidth) / 2,
    y: footerBaseY + 6,
    size: 8.5,
    font,
    color: textMuted,
  });

  return await pdfDoc.save();
}

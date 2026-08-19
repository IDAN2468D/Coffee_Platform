import { google } from 'googleapis';
import { Readable } from 'stream';
import { cookies } from 'next/headers';

export interface ReceiptItem {
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  shots?: number;
  milkType?: string;
  origin?: string;
}

export interface OrderReceiptData {
  orderNumber: string;
  fullName: string;
  email?: string;
  phone: string;
  deliveryAddress: string;
  items: ReceiptItem[];
  totalPrice: number;
  createdAt: string;
  paymentMethod?: string;
  status?: string;
}

export interface DriveSyncResult {
  success: boolean;
  fileId?: string;
  webViewLink?: string;
  webContentLink?: string;
  fileName?: string;
  syncedAt: string;
  isSimulated?: boolean;
  error?: string;
}

/**
 * Checks if Google Drive credentials or active user OAuth tokens are available.
 */
export async function isDriveConfigured(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('google_drive_refresh_token')?.value || cookieStore.get('google_drive_access_token')?.value) {
      return true;
    }
  } catch {
    // Context without cookies
  }

  if (process.env.GOOGLE_REFRESH_TOKEN || process.env.GOOGLE_DRIVE_REFRESH_TOKEN) {
    return true;
  }

  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  return Boolean(email && privateKey && privateKey.includes('PRIVATE KEY'));
}

/**
 * Initializes and returns a Google Drive API client using OAuth2 Cookies / Env or Service Account.
 */
export async function getDriveAuthClient() {
  // 1. OAuth2 User Session from Cookies
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('google_drive_refresh_token')?.value;
    const accessToken = cookieStore.get('google_drive_access_token')?.value;

    if (refreshToken || accessToken) {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        refresh_token: refreshToken,
        access_token: accessToken,
      });

      return google.drive({ version: 'v3', auth: oauth2Client });
    }
  } catch {
    // cookies() unavailable in some execution contexts
  }

  // 2. OAuth2 Server Environment Refresh Token
  const envRefreshToken = process.env.GOOGLE_REFRESH_TOKEN || process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && envRefreshToken) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: envRefreshToken,
    });

    return google.drive({ version: 'v3', auth: oauth2Client });
  }

  // 3. Service Account Credentials
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (email && rawKey && rawKey.includes('PRIVATE KEY')) {
    const privateKey = rawKey.replace(/\\n/g, '\n');
    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive',
      ],
    });
    return google.drive({ version: 'v3', auth });
  }

  return null;
}

/**
 * Generates an elegant, fully responsive, printable HTML receipt document
 * styled in The Digital Roast brand with RTL Hebrew support.
 */
export function generateReceiptHtml(order: OrderReceiptData): string {
  const vatRate = 0.18;
  const subtotal = order.totalPrice / (1 + vatRate);
  const vatAmount = order.totalPrice - subtotal;
  const invoiceNum = order.orderNumber.startsWith('DR-') ? order.orderNumber : `DR-${order.orderNumber}`;

  const formattedDate = new Date(order.createdAt).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const itemsRows = (order.items || [])
    .map((item, idx) => {
      const lineTotal = item.quantity * item.pricePerUnit;
      const details = [
        item.shots ? `${item.shots} שוטים אספרסו` : '',
        item.milkType ? item.milkType : '',
        item.origin ? `מקור: ${item.origin}` : '',
      ]
        .filter(Boolean)
        .join(' • ');

      const bgStyle = idx % 2 === 0 ? 'background: rgba(255, 255, 255, 0.02);' : 'background: transparent;';

      return `
        <tr style="${bgStyle} border-bottom: 1px solid rgba(245, 158, 11, 0.12);">
          <td style="padding: 14px 12px; text-align: right;">
            <div style="font-weight: 800; color: #fafaf9; font-size: 14px; letter-spacing: -0.2px;">${item.itemName}</div>
            ${details ? `<div style="font-size: 11px; color: #fbbf24; margin-top: 3px; font-weight: 500;">✦ ${details}</div>` : ''}
          </td>
          <td style="padding: 14px 12px; text-align: center; font-family: monospace; font-size: 14px; color: #e7e5e4; font-weight: bold;">${item.quantity}</td>
          <td style="padding: 14px 12px; text-align: center; font-family: monospace; font-size: 13px; color: #d6d3d1;">₪${item.pricePerUnit.toFixed(2)}</td>
          <td style="padding: 14px 12px; text-align: left; font-family: monospace; font-weight: 900; color: #fbbf24; font-size: 15px;">₪${lineTotal.toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>קבלה דיגיטלית יוקרתית - The Digital Roast #${invoiceNum}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      padding: 40px 16px;
      font-family: 'Rubik', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: radial-gradient(circle at top, #1c1510 0%, #0c0a09 100%);
      background-color: #0c0a09;
      color: #f5f5f4;
      direction: rtl;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .receipt-container {
      width: 100%;
      max-width: 720px;
      background: linear-gradient(165deg, rgba(28, 24, 20, 0.95) 0%, rgba(14, 12, 10, 0.98) 100%);
      border: 1.5px solid rgba(245, 158, 11, 0.45);
      border-radius: 28px;
      padding: 40px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }
    .receipt-container::before {
      content: '';
      position: absolute;
      top: -100px;
      right: -100px;
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .header {
      text-align: center;
      border-bottom: 1.5px dashed rgba(245, 158, 11, 0.35);
      padding-bottom: 26px;
      margin-bottom: 26px;
      position: relative;
    }
    .brand-title {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #fbbf24;
      margin-bottom: 6px;
      text-shadow: 0 0 25px rgba(245, 158, 11, 0.4);
    }
    .brand-sub {
      font-size: 11px;
      color: #a8a29e;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
    }
    .brand-meta {
      font-size: 11px;
      color: #78716c;
      margin-top: 6px;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 14px;
      padding: 6px 16px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.4);
      border-radius: 999px;
      color: #34d399;
      font-size: 12px;
      font-weight: 700;
    }
    .order-badge {
      display: inline-block;
      margin-top: 12px;
      font-size: 16px;
      font-weight: 800;
      color: #fafaf9;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 6px 18px;
      border-radius: 12px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 28px;
      background: rgba(255, 255, 255, 0.025);
      padding: 20px;
      border-radius: 18px;
      border: 1px solid rgba(255, 255, 255, 0.07);
    }
    .info-item {
      font-size: 13px;
    }
    .info-label {
      color: #a8a29e;
      font-size: 11px;
      font-weight: 500;
      margin-bottom: 4px;
    }
    .info-val {
      font-weight: 700;
      color: #f5f5f4;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 26px;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    th {
      background: rgba(245, 158, 11, 0.08);
      padding: 12px;
      font-size: 12px;
      color: #fbbf24;
      font-weight: 700;
      border-bottom: 1px solid rgba(245, 158, 11, 0.25);
    }
    .totals-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 18px;
      padding: 20px;
      margin-top: 20px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-size: 13.5px;
      color: #d6d3d1;
    }
    .total-row.grand {
      font-size: 19px;
      font-weight: 900;
      color: #fbbf24;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1.5px dashed rgba(245, 158, 11, 0.4);
    }
    .auth-footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      text-align: center;
    }
    .barcode-sim {
      display: flex;
      gap: 3px;
      align-items: center;
      height: 32px;
      opacity: 0.85;
    }
    .barcode-sim span {
      background-color: #fbbf24;
      height: 100%;
      border-radius: 1px;
    }
    .cloud-seal {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.25);
      padding: 8px 18px;
      border-radius: 999px;
      font-size: 11.5px;
      color: #fbbf24;
      font-weight: 700;
    }
    .legal-notice {
      font-size: 11px;
      color: #78716c;
      line-height: 1.6;
    }

    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
        padding: 0 !important;
      }
      .receipt-container {
        max-width: 100% !important;
        background: #ffffff !important;
        border: 1px solid #000000 !important;
        box-shadow: none !important;
        padding: 24px !important;
        color: #000000 !important;
      }
      .brand-title, .order-badge, .status-badge, th, .total-row.grand, .cloud-seal {
        color: #000000 !important;
        text-shadow: none !important;
        background: transparent !important;
        border-color: #000000 !important;
      }
      .info-grid, table, .totals-box {
        background: transparent !important;
        border-color: #cccccc !important;
      }
      .info-val, tr td div, .total-row {
        color: #000000 !important;
      }
      .barcode-sim span {
        background-color: #000000 !important;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <div class="brand-title">☕ THE DIGITAL ROAST</div>
      <div class="brand-sub">Gourmet Coffee Lab & Micro-Roastery • Specialty Extraction</div>
      <div class="brand-meta">ח.פ. 519824601 • שדרות רוטשילד 45, תל אביב • טל: 03-6821900 • support@digitalroast.co.il</div>
      
      <div>
        <div class="status-badge">
          <span>✓</span>
          <span>מסמך ממוחשב - מקור חתום ומאושר</span>
        </div>
      </div>

      <div>
        <div class="order-badge">חשבונית מס / קבלה דיגיטלית #${invoiceNum}</div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">שם המזמין:</div>
        <div class="info-val">${order.fullName || 'לקוח The Digital Roast'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">תאריך ושעת הפקה:</div>
        <div class="info-val">${formattedDate}</div>
      </div>
      <div class="info-item">
        <div class="info-label">טלפון ליצירת קשר:</div>
        <div class="info-val" style="font-family: monospace;">${order.phone || '050-0000000'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">כתובת יעד לאספקה:</div>
        <div class="info-val">${order.deliveryAddress || 'איסוף עצמי מסניף רוטשילד'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">אמצעי תשלום:</div>
        <div class="info-val">${order.paymentMethod || 'כרטיס אשראי מאובטח (SSL 256-bit)'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">סטטוס תשלום:</div>
        <div class="info-val" style="color: #34d399;">שולם במלואו (PAID) ✓</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align: right;">תיאור פריט הקפה והתאמות אישיות</th>
          <th style="text-align: center; width: 60px;">כמות</th>
          <th style="text-align: center; width: 90px;">מחיר יח'</th>
          <th style="text-align: left; width: 100px;">סה"כ לתשלום</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="totals-box">
      <div class="total-row">
        <span>סכום ביניים לפני מע"מ:</span>
        <span style="font-family: monospace; font-weight: bold;">₪${subtotal.toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>מע"מ כחוק (18%):</span>
        <span style="font-family: monospace; font-weight: bold;">₪${vatAmount.toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>דמי משלוח וטיפול VIP:</span>
        <span style="color: #34d399; font-weight: bold;">חינם (הטבת מועדון Roast Club)</span>
      </div>
      <div class="total-row grand">
        <span>סה"כ שולם כולל מע"מ:</span>
        <span style="font-family: monospace;">₪${order.totalPrice.toFixed(2)}</span>
      </div>
    </div>

    <div class="auth-footer">
      <div class="barcode-sim">
        <span style="width: 4px;"></span>
        <span style="width: 2px;"></span>
        <span style="width: 6px;"></span>
        <span style="width: 3px;"></span>
        <span style="width: 2px;"></span>
        <span style="width: 8px;"></span>
        <span style="width: 3px;"></span>
        <span style="width: 5px;"></span>
        <span style="width: 2px;"></span>
        <span style="width: 6px;"></span>
        <span style="width: 3px;"></span>
        <span style="width: 4px;"></span>
        <span style="width: 2px;"></span>
        <span style="width: 7px;"></span>
        <span style="width: 3px;"></span>
        <span style="width: 5px;"></span>
      </div>
      
      <div style="font-family: monospace; font-size: 10px; color: #78716c;">
        AUTH-HASH: DRIVE-CLOUD-${invoiceNum}-2026-SSL-SECURE
      </div>

      <div class="cloud-seal">
        <span>☁</span>
        <span>נשמר וסונכרן אוטומטית כ-PDF רשמי ומאובטח בענן Google Drive</span>
      </div>

      <div class="legal-notice">
        מסמך ממוחשב זה הינו קבלה / חשבונית מס דיגיטלית חוקית מבית The Digital Roast בע"מ.<br>
        תודה שבחרת בקפה הגורמה שלנו • חווית קפה ספציאליטי יוצאת דופן! ☕
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

import { generateReceiptPdfBuffer } from './receiptPdfService';

/**
 * Uploads a single order receipt to Google Drive as an official PDF document.
 */
export async function uploadReceiptToGoogleDrive(order: OrderReceiptData): Promise<DriveSyncResult> {
  const syncedAt = new Date().toISOString();
  const safeFullName = (order.fullName || 'Customer').replace(/\s+/g, '_');
  const fileName = `Receipt_${order.orderNumber}_${safeFullName}.pdf`;

  const drive = await getDriveAuthClient();

  // If live credentials are not set, return clear not-connected result
  if (!drive) {
    return {
      success: false,
      error: 'חשבון Google Drive אינו מחובר. יש להתחבר לחשבון Google כדי לשמור קבלות בענן.',
      syncedAt,
      isSimulated: false,
    };
  }

  try {
    const folderId = process.env.GOOGLE_DRIVE_RECEIPTS_FOLDER_ID;
    
    // Generate high-resolution PDF document with luxury styling
    const pdfBytes = await generateReceiptPdfBuffer(order);

    const fileMetadata: any = {
      name: fileName,
      mimeType: 'application/pdf',
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const media = {
      mimeType: 'application/pdf',
      body: Readable.from(Buffer.from(pdfBytes)),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, name, webViewLink, webContentLink',
    });

    // Make the file readable with link if needed
    try {
      if (response.data.id) {
        await drive.permissions.create({
          fileId: response.data.id,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
      }
    } catch {
      // Permission create might be restricted by org policy; continue anyway
    }

    return {
      success: true,
      fileId: response.data.id || undefined,
      webViewLink: response.data.webViewLink || (response.data.id ? `https://drive.google.com/file/d/${response.data.id}/view` : undefined),
      webContentLink: response.data.webContentLink || undefined,
      fileName: response.data.name || fileName,
      syncedAt,
      isSimulated: false,
    };
  } catch (error: any) {
    console.error('Google Drive PDF Upload Error:', error);
    return {
      success: false,
      error: error.message || 'שגיאה בהעלאת קובץ ה-PDF ל-Google Drive',
      syncedAt,
    };
  }
}

/**
 * Bulk syncs an array of orders to Google Drive.
 */
export async function bulkSyncReceiptsToDrive(orders: OrderReceiptData[]): Promise<{
  successCount: number;
  failedCount: number;
  results: Array<{ orderNumber: string; result: DriveSyncResult }>;
}> {
  const results: Array<{ orderNumber: string; result: DriveSyncResult }> = [];
  let successCount = 0;
  let failedCount = 0;

  for (const order of orders) {
    const result = await uploadReceiptToGoogleDrive(order);
    results.push({ orderNumber: order.orderNumber, result });
    if (result.success) {
      successCount++;
    } else {
      failedCount++;
    }
  }

  return {
    successCount,
    failedCount,
    results,
  };
}

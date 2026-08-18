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

  const formattedDate = new Date(order.createdAt).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const itemsRows = (order.items || [])
    .map((item) => {
      const lineTotal = item.quantity * item.pricePerUnit;
      const details = [
        item.shots ? `${item.shots} שוטים` : '',
        item.milkType ? item.milkType : '',
        item.origin ? `מקור: ${item.origin}` : '',
      ]
        .filter(Boolean)
        .join(' • ');

      return `
        <tr style="border-bottom: 1px solid #27272a;">
          <td style="padding: 12px 10px; text-align: right;">
            <div style="font-weight: bold; color: #f4f4f5; font-size: 14px;">${item.itemName}</div>
            ${details ? `<div style="font-size: 11px; color: #a1a1aa; margin-top: 2px;">${details}</div>` : ''}
          </td>
          <td style="padding: 12px 10px; text-align: center; font-family: monospace; font-size: 13px; color: #f4f4f5;">${item.quantity}</td>
          <td style="padding: 12px 10px; text-align: center; font-family: monospace; font-size: 13px; color: #f4f4f5;">₪${item.pricePerUnit.toFixed(2)}</td>
          <td style="padding: 12px 10px; text-align: left; font-family: monospace; font-weight: bold; color: #fbbf24; font-size: 14px;">₪${lineTotal.toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <title>קבלה דיגיטלית - The Digital Roast #${order.orderNumber}</title>
  <style>
    body {
      margin: 0;
      padding: 30px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #09090b;
      color: #fafafa;
      direction: rtl;
    }
    .receipt-container {
      max-width: 680px;
      margin: 0 auto;
      background: #12100e;
      border: 1px solid #d97706;
      border-radius: 20px;
      padding: 36px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.8);
    }
    .header {
      text-align: center;
      border-bottom: 2px dashed #78350f;
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #f59e0b;
      margin-bottom: 6px;
      font-family: monospace;
    }
    .brand-sub {
      font-size: 12px;
      color: #a1a1aa;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .order-badge {
      display: inline-block;
      margin-top: 14px;
      padding: 6px 14px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid #d97706;
      border-radius: 999px;
      color: #fbbf24;
      font-size: 13px;
      font-weight: bold;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
      background: rgba(255, 255, 255, 0.03);
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #27272a;
    }
    .info-item {
      font-size: 13px;
    }
    .info-label {
      color: #71717a;
      margin-bottom: 4px;
    }
    .info-val {
      font-weight: bold;
      color: #e4e4e7;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #1c1917;
      padding: 10px;
      font-size: 12px;
      color: #d4d4d8;
      border-bottom: 1px solid #3f3f46;
    }
    .totals-box {
      border-top: 2px dashed #78350f;
      padding-top: 16px;
      margin-top: 16px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
      color: #a1a1aa;
    }
    .total-row.grand {
      font-size: 18px;
      font-weight: 900;
      color: #fbbf24;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #3f3f46;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #27272a;
      font-size: 11px;
      color: #71717a;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <div class="brand-title">☕ THE DIGITAL ROAST</div>
      <div class="brand-sub">Gourmet Coffee Lab & Micro-Roastery</div>
      <div class="order-badge">קבלה ממוחשבת #${order.orderNumber}</div>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">שם הלקוח:</div>
        <div class="info-val">${order.fullName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">תאריך ושעה:</div>
        <div class="info-val">${formattedDate}</div>
      </div>
      <div class="info-item">
        <div class="info-label">טלפון:</div>
        <div class="info-val">${order.phone}</div>
      </div>
      <div class="info-item">
        <div class="info-label">כתובת למשלוח:</div>
        <div class="info-val">${order.deliveryAddress}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align: right;">פריט והתאמה אישית</th>
          <th style="text-align: center;">כמות</th>
          <th style="text-align: center;">מחיר יח'</th>
          <th style="text-align: left;">סה"כ</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="totals-box">
      <div class="total-row">
        <span>סכום לפני מע"מ:</span>
        <span style="font-family: monospace;">₪${subtotal.toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>מע"מ (18%):</span>
        <span style="font-family: monospace;">₪${vatAmount.toFixed(2)}</span>
      </div>
      <div class="total-row grand">
        <span>סה"כ לתשלום כולל מע"מ:</span>
        <span style="font-family: monospace;">₪${order.totalPrice.toFixed(2)}</span>
      </div>
    </div>

    <div class="footer">
      <div>מסמך ממוחשב זה הינו קבלה / חשבונית מס דיגיטלית חוקית מבית The Digital Roast.</div>
      <div>נשמר וסונכרן אוטומטית בענן Google Drive • תודה שבחרת בקפה הגורמה שלנו! ☕</div>
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

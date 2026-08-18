import { google } from 'googleapis';
import { Readable } from 'stream';

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
 * Checks if Google Drive credentials are fully configured in the environment.
 */
export function isDriveConfigured(): boolean {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  return Boolean(email && privateKey && privateKey.includes('PRIVATE KEY'));
}

/**
 * Initializes and returns a Google Drive API client using Service Account credentials.
 */
function getDriveClient() {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error('Google Drive API credentials (GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY) are missing.');
  }

  // Handle newlines in private key string whether passed as \n or real newlines
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
    .badge {
      display: inline-block;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      color: #34d399;
      font-size: 11px;
      font-weight: bold;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-top: 8px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      background: #1c1917;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #292524;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .meta-item span {
      display: block;
      color: #a8a29e;
      font-size: 11px;
    }
    .meta-item strong {
      color: #fafaf9;
      font-size: 13px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #1c1917;
      color: #d6d3d1;
      padding: 10px;
      font-size: 12px;
      border-bottom: 1px solid #44403c;
    }
    .summary-box {
      background: #1c1917;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #44403c;
      margin-bottom: 24px;
    }
    .summary-line {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #d6d3d1;
      margin-bottom: 6px;
    }
    .summary-total {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      font-weight: bold;
      color: #fbbf24;
      border-top: 1px dashed #78350f;
      padding-top: 10px;
      margin-top: 10px;
    }
    .footer {
      text-align: center;
      border-top: 1px solid #292524;
      padding-top: 16px;
      font-size: 11px;
      color: #78716c;
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <div class="brand-title">☕ THE DIGITAL ROAST</div>
      <div style="font-size: 12px; color: #a8a29e;">חברת הקפה הגורמה והקלייה הספציאליטית בע"מ • ח.פ. 519824601</div>
      <div style="font-size: 11px; color: #78716c; margin-top: 4px;">שדרות רוטשילד 45, תל אביב • טלפון: 03-6821900 • service@digitalroast.co.il</div>
      <div class="badge">✓ מסמך ממוחשב - מקור חתום דיגיטלית</div>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <span>מספר הזמנה / חשבונית:</span>
        <strong style="color: #fbbf24; font-family: monospace;">#${order.orderNumber}</strong>
      </div>
      <div class="meta-item">
        <span>תאריך הפקה:</span>
        <strong>${formattedDate}</strong>
      </div>
      <div class="meta-item">
        <span>שם הלקוח:</span>
        <strong>${order.fullName}</strong>
      </div>
      <div class="meta-item">
        <span>טלפון ליצירת קשר:</span>
        <strong style="font-family: monospace;">${order.phone}</strong>
      </div>
      <div class="meta-item" style="grid-column: span 2;">
        <span>כתובת משלוח:</span>
        <strong>${order.deliveryAddress}</strong>
      </div>
      <div class="meta-item" style="grid-column: span 2;">
        <span>אמצעי תשלום:</span>
        <strong>${order.paymentMethod || 'כרטיס אשראי מאובטח'}</strong>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align: right;">תיאור פריט</th>
          <th style="text-align: center;">כמות</th>
          <th style="text-align: center;">מחיר יח'</th>
          <th style="text-align: left;">סה"כ</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="summary-box">
      <div class="summary-line">
        <span>סכום ביניים לפני מע״מ:</span>
        <span style="font-family: monospace;">₪${subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-line">
        <span>מע״מ (18%):</span>
        <span style="font-family: monospace;">₪${vatAmount.toFixed(2)}</span>
      </div>
      <div class="summary-line">
        <span>דמי משלוח אקספרס:</span>
        <span style="color: #34d399; font-weight: bold;">חינם (הטבת VIP)</span>
      </div>
      <div class="summary-total">
        <span>סה״כ לתשלום כולל מע״מ:</span>
        <span style="font-family: monospace;">₪${order.totalPrice.toFixed(2)}</span>
      </div>
    </div>

    <div class="footer">
      <div style="font-family: monospace; margin-bottom: 4px;">AUTH-HASH: ${order.orderNumber}-SECURE-ROAST-DRIVE</div>
      <div>תודה שבחרת ב-The Digital Roast • קפה ספציאליטי ברמה הגבוהה ביותר ☕</div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Uploads a single order receipt to Google Drive.
 * Automatically falls back to a sandbox simulated link if credentials are not configured.
 */
export async function uploadReceiptToGoogleDrive(order: OrderReceiptData): Promise<DriveSyncResult> {
  const syncedAt = new Date().toISOString();
  const fileName = `Receipt_${order.orderNumber}_${order.fullName.replace(/\s+/g, '_')}.html`;

  // If live credentials are not set, return simulated Drive sync result
  if (!isDriveConfigured()) {
    const mockFileId = `drive_mock_${order.orderNumber}_${Date.now().toString(36)}`;
    const mockLink = `https://drive.google.com/file/d/${mockFileId}/view?usp=sharing`;

    return {
      success: true,
      fileId: mockFileId,
      webViewLink: mockLink,
      webContentLink: mockLink,
      fileName,
      syncedAt,
      isSimulated: true,
    };
  }

  try {
    const drive = getDriveClient();
    const folderId = process.env.GOOGLE_DRIVE_RECEIPTS_FOLDER_ID;
    const htmlContent = generateReceiptHtml(order);

    const fileMetadata: any = {
      name: fileName,
      mimeType: 'text/html',
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const media = {
      mimeType: 'text/html',
      body: Readable.from([htmlContent]),
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
      webViewLink: response.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view`,
      webContentLink: response.data.webContentLink || undefined,
      fileName: response.data.name || fileName,
      syncedAt,
      isSimulated: false,
    };
  } catch (error: any) {
    console.error('Google Drive Upload Error:', error);
    return {
      success: false,
      error: error.message || 'שגיאה בהעלאת הקובץ ל-Google Drive',
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

'use server';

import {
  uploadReceiptToGoogleDrive,
  bulkSyncReceiptsToDrive,
  isDriveConfigured,
  OrderReceiptData,
  DriveSyncResult,
} from '@/lib/googleDriveService';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

/**
 * Server action to sync a single order receipt to Google Drive
 */
export async function syncOrderToGoogleDriveAction(
  orderData: OrderReceiptData
): Promise<DriveSyncResult & { message: string }> {
  try {
    if (!orderData || !orderData.orderNumber) {
      return {
        success: false,
        error: 'חסרים פרטי הזמנה לביצוע הסנכרון',
        syncedAt: new Date().toISOString(),
        message: 'שגיאה: מספר הזמנה לא סופק',
      };
    }

    // Upload receipt to Google Drive
    const uploadResult = await uploadReceiptToGoogleDrive(orderData);

    if (uploadResult.success && uploadResult.fileId) {
      // Update order in MongoDB if database is available
      try {
        await connectToDatabase();
        await Order.updateOne(
          { orderNumber: orderData.orderNumber },
          {
            driveReceiptId: uploadResult.fileId,
            driveReceiptUrl: uploadResult.webViewLink,
            driveSyncedAt: new Date(uploadResult.syncedAt),
          }
        );
      } catch (dbErr) {
        console.warn('Could not update order in MongoDB after Drive sync:', dbErr);
      }

      const msg = uploadResult.isSimulated
        ? `קבלה #${orderData.orderNumber} נשמרה בסימולציית Google Drive בהצלחה!`
        : `קבלה #${orderData.orderNumber} הועלתה ונשמרה ב-Google Drive בהצלחה!`;

      return {
        ...uploadResult,
        message: msg,
      };
    } else {
      return {
        ...uploadResult,
        message: uploadResult.error || 'שגיאה בהעלאת הקבלה ל-Google Drive',
      };
    }
  } catch (error: any) {
    console.error('Error in syncOrderToGoogleDriveAction:', error);
    return {
      success: false,
      error: error.message || 'שגיאת שרת בעת סנכרון ל-Google Drive',
      syncedAt: new Date().toISOString(),
      message: error.message || 'שגיאת שרת בעת סנכרון הקבלה',
    };
  }
}

/**
 * Server action to bulk sync multiple orders to Google Drive
 */
export async function bulkSyncAllOrdersAction(ordersData: OrderReceiptData[]): Promise<{
  success: boolean;
  successCount: number;
  failedCount: number;
  message: string;
  results: Array<{ orderNumber: string; result: DriveSyncResult }>;
}> {
  try {
    if (!ordersData || ordersData.length === 0) {
      return {
        success: false,
        successCount: 0,
        failedCount: 0,
        message: 'לא נמצאו הזמנות לסנכרון',
        results: [],
      };
    }

    const isConfigured = await isDriveConfigured();
    if (!isConfigured) {
      return {
        success: false,
        successCount: 0,
        failedCount: ordersData.length,
        message: 'חשבון Google Drive אינו מחובר עדיין. יש להתחבר לחשבון Google כדי לשמור קבלות בענן.',
        results: ordersData.map((o) => ({
          orderNumber: o.orderNumber,
          result: {
            success: false,
            error: 'חשבון Google Drive אינו מחובר',
            syncedAt: new Date().toISOString(),
          },
        })),
      };
    }

    const bulkResult = await bulkSyncReceiptsToDrive(ordersData);

    // Update MongoDB records in bulk if DB is accessible
    try {
      await connectToDatabase();
      for (const item of bulkResult.results) {
        if (item.result.success && item.result.fileId) {
          await Order.updateOne(
            { orderNumber: item.orderNumber },
            {
              driveReceiptId: item.result.fileId,
              driveReceiptUrl: item.result.webViewLink,
              driveSyncedAt: new Date(item.result.syncedAt),
            }
          );
        }
      }
    } catch (dbErr) {
      console.warn('Could not batch update MongoDB after bulk Drive sync:', dbErr);
    }

    const message = `סונכרנו ${bulkResult.successCount} מתוך ${ordersData.length} קבלות ישירות ל-Google Drive בהצלחה!`;

    return {
      success: bulkResult.successCount > 0,
      successCount: bulkResult.successCount,
      failedCount: bulkResult.failedCount,
      message,
      results: bulkResult.results,
    };
  } catch (error: any) {
    console.error('Error in bulkSyncAllOrdersAction:', error);
    return {
      success: false,
      successCount: 0,
      failedCount: ordersData.length,
      message: error.message || 'שגיאה בסנכרון גורף ל-Google Drive',
      results: [],
    };
  }
}

/**
 * Server action to check Google Drive configuration state
 */
export async function getDriveConfigStatusAction(): Promise<{
  isConfigured: boolean;
  folderId?: string;
  clientEmail?: string;
}> {
  const configured = await isDriveConfigured();
  return {
    isConfigured: configured,
    folderId: process.env.GOOGLE_DRIVE_RECEIPTS_FOLDER_ID || undefined,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL
      ? process.env.GOOGLE_CLIENT_EMAIL.replace(/^(.{3}).*(@.*)$/, '$1***$2')
      : undefined,
  };
}

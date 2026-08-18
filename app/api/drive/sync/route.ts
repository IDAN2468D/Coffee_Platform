import { NextResponse } from 'next/server';
import {
  uploadReceiptToGoogleDrive,
  bulkSyncReceiptsToDrive,
  isDriveConfigured,
  OrderReceiptData,
} from '@/lib/googleDriveService';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order, orders, syncAll } = body;

    // 1. Bulk sync requested via list of orders
    if (orders && Array.isArray(orders) && orders.length > 0) {
      const bulkResult = await bulkSyncReceiptsToDrive(orders);

      try {
        await connectToDatabase();
        for (const item of bulkResult.results) {
          if (item.result.success && item.result.fileId && !item.result.isSimulated) {
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
        console.warn('MongoDB bulk update fallback in API route:', dbErr);
      }

      const configured = await isDriveConfigured();
      return NextResponse.json({
        success: true,
        successCount: bulkResult.successCount,
        failedCount: bulkResult.failedCount,
        results: bulkResult.results,
        isConfigured: configured,
      });
    }

    // 2. Sync all unsynced orders from MongoDB
    if (syncAll) {
      let ordersToSync: OrderReceiptData[] = [];
      try {
        await connectToDatabase();
        const rawOrders = await Order.find({ driveReceiptId: { $exists: false } }).limit(50).lean();
        ordersToSync = rawOrders.map((o: any) => ({
          orderNumber: o.orderNumber,
          fullName: o.fullName,
          email: o.email,
          phone: o.phone,
          deliveryAddress: o.deliveryAddress,
          items: o.items || [],
          totalPrice: o.totalPrice,
          createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
          paymentMethod: 'אשראי מאובטח',
          status: o.status,
        }));
      } catch (dbErr) {
        console.warn('Could not query MongoDB for unsynced orders:', dbErr);
      }

      if (ordersToSync.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'לא נמצאו קבלות הממתינות לסנכרון במסד הנתונים',
          successCount: 0,
        });
      }

      const bulkResult = await bulkSyncReceiptsToDrive(ordersToSync);
      const configured = await isDriveConfigured();
      return NextResponse.json({
        success: true,
        successCount: bulkResult.successCount,
        failedCount: bulkResult.failedCount,
        results: bulkResult.results,
        isConfigured: configured,
      });
    }

    // 3. Single order sync
    if (order && order.orderNumber) {
      const uploadResult = await uploadReceiptToGoogleDrive(order);

      if (uploadResult.success && uploadResult.fileId && !uploadResult.isSimulated) {
        try {
          await connectToDatabase();
          await Order.updateOne(
            { orderNumber: order.orderNumber },
            {
              driveReceiptId: uploadResult.fileId,
              driveReceiptUrl: uploadResult.webViewLink,
              driveSyncedAt: new Date(uploadResult.syncedAt),
            }
          );
        } catch (dbErr) {
          console.warn('MongoDB single update fallback:', dbErr);
        }
      }

      const configured = await isDriveConfigured();
      return NextResponse.json({
        success: uploadResult.success,
        data: uploadResult,
        isConfigured: configured,
      });
    }

    return NextResponse.json(
      { error: 'נתונים לא תקינים. יש לספק אובייקט order או orders' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('API /api/drive/sync error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאת שרת פנימית בסנכרון ל-Google Drive' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const configured = await isDriveConfigured();
  return NextResponse.json({
    status: 'online',
    isConfigured: configured,
    folderId: process.env.GOOGLE_DRIVE_RECEIPTS_FOLDER_ID || null,
  });
}

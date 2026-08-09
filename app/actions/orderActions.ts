'use server';

import { orderSchema, OrderInput } from '@/lib/validations/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { sendOrderConfirmationEmail } from '@/lib/email/emailService';

export async function createStandardOrder(data: OrderInput) {
  try {
    const validated = orderSchema.parse(data);

    // Calculate total price
    const totalPrice = validated.items.reduce(
      (sum, item) => sum + item.pricePerUnit * item.quantity,
      0
    );

    const orderNumber = 'DR-' + Math.floor(100000 + Math.random() * 900000);
    let emailSent = false;
    let previewUrl: string | null = null;

    // Send confirmation email if email is provided
    if (validated.email) {
      const emailResult = await sendOrderConfirmationEmail({
        orderNumber,
        fullName: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        deliveryAddress: validated.deliveryAddress,
        items: validated.items.map((i) => ({
          itemName: i.itemName,
          quantity: i.quantity,
          pricePerUnit: i.pricePerUnit,
          shots: i.shots,
          milkType: i.milkType,
        })),
        totalPrice,
      });

      emailSent = emailResult.success;
      if (emailResult.previewUrl) {
        previewUrl = emailResult.previewUrl;
      }
    }

    // Save to database (with fallback for dev without live MongoDB URI)
    try {
      await connectToDatabase();
      await Order.create({
        orderNumber,
        fullName: validated.fullName,
        email: validated.email || '',
        phone: validated.phone,
        deliveryAddress: validated.deliveryAddress,
        items: validated.items,
        totalPrice,
        status: 'PENDING',
        whatsappSent: false,
        emailSent,
      });
    } catch (dbErr) {
      console.warn('MongoDB order save fallback:', dbErr);
    }

    const createdAtIso = new Date().toISOString();

    return {
      success: true,
      orderNumber,
      totalPrice,
      fullName: validated.fullName,
      email: validated.email || '',
      emailSent,
      previewUrl,
      deliveryAddress: validated.deliveryAddress,
      itemCount: validated.items.length,
      items: validated.items,
      phone: validated.phone,
      createdAt: createdAtIso,
      status: 'PENDING',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'שגיאה ביצירת ההזמנה במערכת',
    };
  }
}

// Action to fetch user order history from MongoDB
export async function getUserOrdersAction(userEmail?: string, userPhone?: string) {
  try {
    await connectToDatabase();
    const query: any = {};
    if (userEmail && userPhone) {
      query.$or = [{ email: userEmail }, { phone: userPhone }];
    } else if (userEmail) {
      query.email = userEmail;
    } else if (userPhone) {
      query.phone = userPhone;
    }

    const rawOrders = await Order.find(query).sort({ createdAt: -1 }).limit(30).lean();

    const orders = rawOrders.map((o: any) => ({
      orderNumber: o.orderNumber,
      fullName: o.fullName,
      email: o.email || '',
      phone: o.phone,
      deliveryAddress: o.deliveryAddress,
      items: (o.items || []).map((item: any) => ({
        coffeeItemId: item.coffeeItemId,
        itemName: item.itemName,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        shots: item.shots,
        milkType: item.milkType,
      })),
      totalPrice: o.totalPrice,
      status: o.status,
      createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
      whatsappSent: !!o.whatsappSent,
      emailSent: !!o.emailSent,
    }));

    return {
      success: true,
      orders,
    };
  } catch (err: any) {
    console.warn('Could not fetch orders from MongoDB:', err.message);
    return {
      success: false,
      error: err.message || 'לא ניתן למשוך הזמנות ממסד הנתונים',
      orders: [],
    };
  }
}

// Action to send/resend confirmation email to a specific address
export async function sendOrderEmailAction(orderData: {
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  totalPrice: number;
  items: Array<{
    itemName: string;
    quantity: number;
    pricePerUnit: number;
    shots?: number;
    milkType?: string;
  }>;
}) {
  try {
    if (!orderData.email) {
      return { success: false, error: 'אנא הזן כתובת אימייל תקינה' };
    }

    const result = await sendOrderConfirmationEmail({
      orderNumber: orderData.orderNumber,
      fullName: orderData.fullName,
      email: orderData.email,
      phone: orderData.phone,
      deliveryAddress: orderData.deliveryAddress,
      totalPrice: orderData.totalPrice,
      items: orderData.items,
    });

    if (result.success) {
      // Update DB status if MongoDB is accessible
      try {
        await connectToDatabase();
        await Order.updateOne(
          { orderNumber: orderData.orderNumber },
          { email: orderData.email, emailSent: true }
        );
      } catch (err) {
        console.warn('DB update failed after sending email:', err);
      }

      return {
        success: true,
        previewUrl: result.previewUrl || null,
        message: `אישור ההזמנה נשלח בהצלחה לכתובת ${orderData.email}`,
      };
    } else {
      return { success: false, error: result.error || 'שגיאה בשליחת המייל' };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'אירעה שגיאה בשרת בעת שליחת המייל' };
  }
}

// Alias for backwards compatibility if needed elsewhere
export async function createOrderAndDispatchWhatsApp(data: OrderInput) {
  return createStandardOrder(data);
}

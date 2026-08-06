import { Schema, model, models, Document } from 'mongoose';

export interface IOrderItem {
  coffeeItemId: string;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  shots: number;
  milkType: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  fullName: string;
  email?: string;
  phone: string;
  deliveryAddress: string;
  items: IOrderItem[];
  totalPrice: number;
  status: 'PENDING' | 'BREWING' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED';
  whatsappSent: boolean;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  coffeeItemId: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  pricePerUnit: { type: Number, required: true },
  shots: { type: Number, default: 1 },
  milkType: { type: String, default: 'חלב רגיל' },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    items: [OrderItemSchema],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'BREWING', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    whatsappSent: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Order = models.Order || model<IOrder>('Order', OrderSchema);

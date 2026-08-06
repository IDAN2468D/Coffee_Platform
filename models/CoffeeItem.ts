import { Schema, model, models, Document } from 'mongoose';

export interface ICoffeeItem extends Document {
  name: string;
  hebrewName: string;
  description: string;
  category: 'ESPRESSO' | 'SPECIALTY_LATTE' | 'V60_KIT' | 'CAPSULES' | 'PASTRY';
  price: number;
  roastLevel: number;
  origin: string;
  flavorNotes: string[];
  imageUrl: string;
  isAvailable: boolean;
  caffeineMgPerServing: number;
  caloriesBase: number;
}

const CoffeeItemSchema = new Schema<ICoffeeItem>(
  {
    name: { type: String, required: true },
    hebrewName: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['ESPRESSO', 'SPECIALTY_LATTE', 'V60_KIT', 'CAPSULES', 'PASTRY'],
      required: true,
    },
    price: { type: Number, required: true },
    roastLevel: { type: Number, min: 1, max: 12, default: 8 },
    origin: { type: String, default: 'Ethiopia Yirgacheffe' },
    flavorNotes: [{ type: String }],
    imageUrl: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    caffeineMgPerServing: { type: Number, default: 150 },
    caloriesBase: { type: Number, default: 80 },
  },
  { timestamps: true }
);

export const CoffeeItem = models.CoffeeItem || model<ICoffeeItem>('CoffeeItem', CoffeeItemSchema);

import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  fullName: string;
  phone?: string;
  passwordHash?: string;
  role: 'CUSTOMER' | 'BARISTA' | 'ADMIN';
  authProvider: 'local' | 'google';
  googleId?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: false },
    passwordHash: { type: String, required: false },
    role: { type: String, enum: ['CUSTOMER', 'BARISTA', 'ADMIN'], default: 'CUSTOMER' },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, required: false },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>('User', UserSchema);

'use server';

import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { registerSchema, loginSchema, RegisterInput, LoginInput } from '@/lib/validations/auth';
import bcrypt from 'bcryptjs';

export async function registerUserAction(data: RegisterInput) {
  try {
    const validated = registerSchema.parse(data);
    await connectToDatabase();

    const existingUser = await User.findOne({ email: validated.email.toLowerCase() });
    if (existingUser) {
      return { success: false, error: 'כתובת האימייל כבר רשומה במערכת' };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    const newUser = await User.create({
      fullName: validated.fullName,
      email: validated.email.toLowerCase(),
      phone: validated.phone,
      passwordHash,
      role: 'CUSTOMER',
    });

    return {
      success: true,
      user: {
        id: newUser._id.toString(),
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        image: newUser.image,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'שגיאה בהרשמת המשתמש' };
  }
}

export async function loginUserAction(data: LoginInput) {
  try {
    const validated = loginSchema.parse(data);
    await connectToDatabase();

    const user = await User.findOne({ email: validated.email.toLowerCase() });
    if (!user) {
      return { success: false, error: 'שם משתמש או סיסמה שגויים' };
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: 'שם משתמש או סיסמה שגויים' };
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'שגיאה בהתחברות למערכת' };
  }
}

export async function googleLoginAction(data: {
  email: string;
  fullName: string;
  googleId?: string;
  image?: string;
}) {
  try {
    await connectToDatabase();

    let user = await User.findOne({ email: data.email.toLowerCase() });

    if (!user) {
      user = await User.create({
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        authProvider: 'google',
        googleId: data.googleId || `google_${Date.now()}`,
        image: data.image || '/idan-profile-circle.png',
        role: 'CUSTOMER',
      });
    } else {
      let isChanged = false;
      if (user.authProvider !== 'google') {
        user.authProvider = 'google';
        isChanged = true;
      }
      if (data.googleId && user.googleId !== data.googleId) {
        user.googleId = data.googleId;
        isChanged = true;
      }
      if (data.image && user.image !== data.image) {
        user.image = data.image;
        isChanged = true;
      }
      if (isChanged) {
        await user.save();
      }
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        image: user.image || '/idan-profile-circle.png',
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'שגיאה בהתחברות עם חשבון Google' };
  }
}

export async function updateUserProfileImageAction(data: { userId: string; image: string }) {
  try {
    await connectToDatabase();
    const user = await User.findById(data.userId);
    if (!user) {
      return { success: false, error: 'משתמש לא נמצא' };
    }
    user.image = data.image;
    await user.save();
    return {
      success: true,
      image: user.image,
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'שגיאה בעדכון תמונת הפרופיל' };
  }
}

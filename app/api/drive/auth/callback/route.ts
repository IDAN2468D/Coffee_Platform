import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");
    
    let baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) {
      baseUrl = host ? `${protocol}://${host}` : "http://localhost:3000";
    }
    baseUrl = baseUrl.replace(/\/+$/, "");

    if (error || !code) {
      return NextResponse.redirect(`${baseUrl}/order-history?driveAuth=error&message=${encodeURIComponent(error || "Missing code")}`);
    }

    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/drive/auth/callback`;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const cookieStore = await cookies();
    
    if (tokens.refresh_token) {
      cookieStore.set("google_drive_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 ימים
      });
    }

    if (tokens.access_token) {
      cookieStore.set("google_drive_access_token", tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600,
      });
    }

    return NextResponse.redirect(`${baseUrl}/order-history?driveAuth=success`);
  } catch (err: any) {
    console.error("Google Drive OAuth Callback Error:", err);
    let baseUrl = process.env.NEXTAUTH_URL || "https://coffee-platform-o2nt.onrender.com";
    baseUrl = baseUrl.replace(/\/+$/, "");
    return NextResponse.redirect(`${baseUrl}/order-history?driveAuth=error&message=${encodeURIComponent(err.message || "Failed token exchange")}`);
  }
}
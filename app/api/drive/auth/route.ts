import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");

    let baseUrl = process.env.NEXTAUTH_URL || (host ? `${protocol}://${host}` : "http://localhost:3000");
    baseUrl = baseUrl.replace(/\/+$/, "");

    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/drive/auth/callback`;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const scopes = [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/spreadsheets",
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
    });

    return NextResponse.redirect(url);
  } catch (error: any) {
    console.error("Google Drive Auth Init Error:", error);
    return NextResponse.json({ error: "Failed to initialize Google Drive auth" }, { status: 500 });
  }
}
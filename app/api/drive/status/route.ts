import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("google_drive_refresh_token")?.value;
    const accessToken = cookieStore.get("google_drive_access_token")?.value;

    const isConnected = Boolean(refreshToken || accessToken);

    return NextResponse.json({
      connected: isConnected,
    });
  } catch (error: any) {
    return NextResponse.json({ connected: false }, { status: 500 });
  }
}

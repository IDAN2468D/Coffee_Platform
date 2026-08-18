import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { Readable } from "stream";
import { generateReceiptPdfBuffer } from "@/lib/receiptPdfService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title = "Coffee Order Export", content = "Coffee Data", order, format = "pdf" } = body;

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("google_drive_refresh_token")?.value;
    const accessToken = cookieStore.get("google_drive_access_token")?.value;

    if (!refreshToken && !accessToken) {
      return NextResponse.json(
        { error: "Google Drive is not authenticated. Please connect your Google account first." },
        { status: 401 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
      access_token: accessToken,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    let fileMetadata: any;
    let media: any;

    if (order) {
      // Create high quality PDF document
      const pdfBytes = await generateReceiptPdfBuffer(order);
      const safeName = (order.fullName || 'Customer').replace(/\s+/g, '_');
      fileMetadata = {
        name: `Receipt_${order.orderNumber}_${safeName}.pdf`,
        mimeType: "application/pdf",
      };
      media = {
        mimeType: "application/pdf",
        body: Readable.from(Buffer.from(pdfBytes)),
      };
    } else {
      const isPdf = format === "pdf";
      fileMetadata = {
        name: `${title} - ${new Date().toLocaleDateString("he-IL")}.${isPdf ? "pdf" : "txt"}`,
        mimeType: isPdf ? "application/pdf" : "text/plain",
      };
      media = {
        mimeType: isPdf ? "application/pdf" : "text/plain",
        body: typeof content === "object" ? JSON.stringify(content, null, 2) : String(content),
      };
    }

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, name, webViewLink",
    });

    // הגדרת הרשאת צפייה לקישור
    if (file.data.id) {
      try {
        await drive.permissions.create({
          fileId: file.data.id,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        });
      } catch (permErr) {
        console.warn("Could not set public permission:", permErr);
      }
    }

    return NextResponse.json({
      success: true,
      fileId: file.data.id,
      webViewLink: file.data.webViewLink,
    });

  } catch (error: any) {
    console.error("Google Drive File Creation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create file in Google Drive" },
      { status: 500 }
    );
  }
}

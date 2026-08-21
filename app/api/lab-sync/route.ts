import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { target, session, markdown } = body;

    return NextResponse.json({
      success: true,
      target,
      filename: `${session.title.replace(/\s+/g, "_")}.md`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
  }
}

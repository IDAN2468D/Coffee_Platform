import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    base: "USD",
    rates: {
      ILS: 3.68,
      USD: 1.0,
      EUR: 0.92,
      COP: 3950,
      ETB: 57.5
    },
    updatedAt: new Date().toISOString()
  });
}

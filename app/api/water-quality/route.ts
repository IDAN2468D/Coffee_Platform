import { NextResponse } from "next/server";
import { ISRAEL_REGIONS } from "@/components/IsraelWaterCalibrator";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get("cityId") || "tel-aviv";

  const profile = ISRAEL_REGIONS.find((c) => c.id === cityId) || ISRAEL_REGIONS[0];

  return NextResponse.json({
    success: true,
    source: "Datagov Israel API (Mock & Live Cache)",
    timestamp: new Date().toISOString(),
    profile
  });
}

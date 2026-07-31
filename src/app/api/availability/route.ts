import { NextResponse } from "next/server";

/**
 * Proxies the LMS availability endpoint so the shared secret stays server-side.
 * Admin-managed slots are the single source of truth for what is bookable.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface AvailabilityDay {
  date: string; // "2026-08-05", Pakistan calendar
  times: { startTime: string; endTime: string; label: string | null }[];
}

export async function GET() {
  const baseUrl = process.env.LMS_ELIGIBILITY_URL;
  const apiKey = process.env.LMS_API_KEY;

  if (!baseUrl || !apiKey) {
    console.error("[availability] LMS_ELIGIBILITY_URL or LMS_API_KEY is not configured");
    return NextResponse.json({ error: "Not configured", days: [] }, { status: 503 });
  }

  // Same host, sibling route.
  const url = baseUrl.replace(/\/eligibility\/?$/, "/availability");

  try {
    const response = await fetch(url, {
      headers: { "x-api-key": apiKey },
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`[availability] LMS responded ${response.status}`);
      return NextResponse.json({ error: "Unavailable", days: [] }, { status: 503 });
    }

    const data = await response.json();
    return NextResponse.json({ days: Array.isArray(data.days) ? data.days : [] });
  } catch (error) {
    console.error("[availability] Could not reach the LMS:", error);
    return NextResponse.json({ error: "Unavailable", days: [] }, { status: 503 });
  }
}

import { NextResponse } from "next/server";

/**
 * Proxies the LMS availability endpoint so the shared secret stays server-side.
 * Admin-managed slots are the single source of truth for what is bookable.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface AvailabilityTime {
  slotId: string;
  startTime: string;
  endTime: string;
  label: string | null;
  /** Already taken by another student — shown greyed out, not hidden. */
  booked: boolean;
}

export interface AvailabilityDay {
  date: string; // "2026-08-05", Pakistan calendar
  times: AvailabilityTime[];
}

export async function GET(request: Request) {
  const baseUrl = process.env.LMS_ELIGIBILITY_URL;
  const apiKey = process.env.LMS_API_KEY;

  if (!baseUrl || !apiKey) {
    console.error("[availability] LMS_ELIGIBILITY_URL or LMS_API_KEY is not configured");
    return NextResponse.json({ error: "Not configured", days: [] }, { status: 503 });
  }

  // Same host, sibling route. The email is optional and only used to tell the
  // student when their next session may be booked.
  const email = new URL(request.url).searchParams.get("email")?.trim() ?? "";
  const base = baseUrl.replace(/\/eligibility\/?$/, "/availability");
  const url = email ? `${base}?email=${encodeURIComponent(email)}` : base;

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
    return NextResponse.json({
      days: Array.isArray(data.days) ? data.days : [],
      nextEligibleDate: data.nextEligibleDate ?? null,
      cooldownDays: data.cooldownDays ?? 30,
    });
  } catch (error) {
    console.error("[availability] Could not reach the LMS:", error);
    return NextResponse.json({ error: "Unavailable", days: [] }, { status: 503 });
  }
}

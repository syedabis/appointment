import { NextResponse } from "next/server";
import { checkStudentEligibility, LmsUnavailableError } from "@/lib/lmsEligibility";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

/**
 * Looks up a student email against the LMS. Runs server-side so the LMS secret
 * stays out of the browser and the student list cannot be enumerated directly.
 */

export const runtime = "nodejs";

const MAX_LOOKUPS = 10;
const WINDOW_MS = 60_000;

export async function POST(request: Request) {
  const limit = rateLimit(`verify:${getClientIp(request)}`, MAX_LOOKUPS, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const result = await checkStudentEligibility(email);

    if (!result.eligible || !result.student) {
      return NextResponse.json({ eligible: false });
    }

    return NextResponse.json({ eligible: true, student: result.student });
  } catch (error) {
    if (error instanceof LmsUnavailableError) {
      // Never fall back to "eligible" when we simply could not check.
      console.error("[verify-student] LMS unavailable:", error.message);
      return NextResponse.json(
        { error: "We could not verify your email right now. Please try again shortly." },
        { status: 503 }
      );
    }
    console.error("[verify-student] Unexpected failure:", error);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}

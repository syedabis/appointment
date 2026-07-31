import { NextResponse } from "next/server";
import { appendBookingRow } from "@/lib/googleSheets";
import { checkStudentEligibility } from "@/lib/lmsEligibility";
import { BookingSubmission } from "@/types/booking";

// googleapis needs the Node runtime; it does not run on the edge.
export const runtime = "nodejs";

const REQUIRED_FIELDS: (keyof BookingSubmission)[] = [
  "fullName",
  "email",
  "trackTitle",
  "date",
  "slot",
];

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const missing = REQUIRED_FIELDS.filter((field) => !text(body[field]));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const email = text(body.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  // Re-check eligibility here rather than trusting the browser. The UI blocks
  // ineligible students, but this endpoint is reachable directly with curl.
  let eligibility;
  try {
    eligibility = await checkStudentEligibility(email);
  } catch (error) {
    console.error("[bookings] Eligibility check failed:", error);
    return NextResponse.json(
      { error: "We could not verify your email right now. Please try again shortly." },
      { status: 503 }
    );
  }

  if (!eligibility.eligible || !eligibility.student) {
    return NextResponse.json(
      { error: "This email is not approved for mentorship booking." },
      { status: 403 }
    );
  }

  // The booking id and timestamp are assigned here rather than in the browser so
  // the sheet is the authority on when a booking was actually recorded.
  const bookingId = `DC-101-${Math.floor(100000 + Math.random() * 900000)}`;

  const booking: BookingSubmission = {
    bookingId,
    submittedAt: new Date().toISOString(),
    trackTitle: text(body.trackTitle),
    amount: "Rs 0 (Student Pass)",
    mentorName: text(body.mentorName),
    date: text(body.date),
    slot: text(body.slot),
    timezone: text(body.timezone),
    // Identity fields come from the LMS, not the form, so they cannot be spoofed.
    fullName: eligibility.student.fullName || text(body.fullName),
    email,
    phone: text(body.phone) || eligibility.student.phone,
    careerStatus: text(body.careerStatus),
    portfolioUrl: text(body.portfolioUrl),
    goals: text(body.goals),
    focusAreas: Array.isArray(body.focusAreas) ? body.focusAreas.map(text).filter(Boolean) : [],
    rollNo: "",
    cohort: eligibility.student.cohort,
    isEnrolledVerified: true,
    paymentMethod: "Student Free Pass",
    trxId: "",
  };

  try {
    await appendBookingRow(booking);
  } catch (error) {
    console.error("[bookings] Failed to append row to Google Sheet:", error);
    return NextResponse.json(
      { error: "Could not record the booking. Please contact us on WhatsApp to confirm." },
      { status: 502 }
    );
  }

  return NextResponse.json({ bookingId }, { status: 201 });
}

import { NextResponse } from "next/server";
import { appendBookingRow } from "@/lib/googleSheets";
import { reserveBooking } from "@/lib/lmsEligibility";
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

  const slotId = text(body.slotId);
  if (!slotId) {
    return NextResponse.json({ error: "Please select a time slot." }, { status: 400 });
  }

  // The booking id is assigned here so the same reference appears in the LMS
  // and in the sheet.
  const bookingId = `DC-101-${Math.floor(100000 + Math.random() * 900000)}`;

  // The LMS is the authority: it re-checks eligibility, enforces one-student-
  // per-slot via a unique constraint, and applies the 30-day cooldown.
  let reservation;
  try {
    reservation = await reserveBooking({
      slotId,
      bookingId,
      studentEmail: email,
      phone: text(body.phone),
      trackTitle: text(body.trackTitle),
      careerStatus: text(body.careerStatus),
      portfolioUrl: text(body.portfolioUrl),
      goals: text(body.goals),
      focusAreas: Array.isArray(body.focusAreas) ? body.focusAreas.map(text).filter(Boolean) : [],
      timezone: text(body.timezone),
    });
  } catch (error) {
    console.error("[bookings] Could not reach the LMS:", error);
    return NextResponse.json(
      { error: "We could not confirm your booking right now. Please try again shortly." },
      { status: 503 }
    );
  }

  if (!reservation.ok) {
    // Pass the LMS's own wording through — it explains slot-taken vs cooldown.
    return NextResponse.json(
      { error: reservation.error, reason: reservation.reason },
      { status: reservation.status }
    );
  }

  const eligibility = { student: reservation.student! };

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

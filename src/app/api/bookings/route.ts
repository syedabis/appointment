import { NextResponse } from "next/server";
import { appendBookingRow } from "@/lib/googleSheets";
import { reserveBooking } from "@/lib/lmsEligibility";
import { BookingSubmission } from "@/types/booking";

// googleapis needs the Node runtime; it does not run on the edge.
export const runtime = "nodejs";

const REQUIRED_FIELDS: (keyof BookingSubmission)[] = [
  "fullName",
  "email",
  "phone",
  "trackTitle",
  "date",
  "slot",
];

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  let receiptFile: File | null = null;

  // A paid booking arrives as multipart so it can carry the payment receipt.
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    try {
      body = JSON.parse(String(form.get("payload") ?? "{}"));
    } catch {
      return NextResponse.json({ error: "Invalid form payload." }, { status: 400 });
    }
    const file = form.get("receipt");
    if (file instanceof File && file.size > 0) receiptFile = file;
  } else {
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
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

  // focusAreas is an array, so it is not covered by the REQUIRED_FIELDS check.
  const focusAreas = Array.isArray(body.focusAreas)
    ? body.focusAreas.map(text).filter(Boolean)
    : [];
  if (focusAreas.length === 0) {
    return NextResponse.json(
      { error: "Please select at least one focus topic for this meeting." },
      { status: 400 }
    );
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
      focusAreas,
      timezone: text(body.timezone),
      receipt: receiptFile
        ? {
            buffer: Buffer.from(await receiptFile.arrayBuffer()),
            filename: receiptFile.name || "receipt.jpg",
            mimeType: receiptFile.type,
          }
        : undefined,
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

  // A paying non-student has no LMS profile, so there is nothing to trust from
  // the LMS — fall back to what they typed. For students the LMS values win,
  // which is what stops a student spoofing someone else's name.
  const student = reservation.student ?? null;

  const booking: BookingSubmission = {
    bookingId,
    submittedAt: new Date().toISOString(),
    trackTitle: text(body.trackTitle),
    amount: reservation.isPaid ? `Rs ${reservation.amountPkr}` : "Rs 0 (Student Pass)",
    mentorName: text(body.mentorName),
    date: text(body.date),
    slot: text(body.slot),
    timezone: text(body.timezone),
    fullName: student?.fullName || text(body.fullName),
    email,
    phone: text(body.phone) || student?.phone || "",
    careerStatus: text(body.careerStatus),
    portfolioUrl: text(body.portfolioUrl),
    goals: text(body.goals),
    focusAreas,
    rollNo: "",
    cohort: student?.cohort || (reservation.isPaid ? "Paid (non-student)" : ""),
    isEnrolledVerified: !reservation.isPaid,
    paymentMethod: reservation.isPaid ? "Paid — receipt verified" : "Student Free Pass",
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

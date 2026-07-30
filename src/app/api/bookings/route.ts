import { NextResponse } from "next/server";
import { appendBookingRow } from "@/lib/googleSheets";
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

  // The booking id and timestamp are assigned here rather than in the browser so
  // the sheet is the authority on when a booking was actually recorded.
  const bookingId = `DC-101-${Math.floor(100000 + Math.random() * 900000)}`;

  const booking: BookingSubmission = {
    bookingId,
    submittedAt: new Date().toISOString(),
    trackTitle: text(body.trackTitle),
    amount: text(body.amount),
    mentorName: text(body.mentorName),
    date: text(body.date),
    slot: text(body.slot),
    timezone: text(body.timezone),
    fullName: text(body.fullName),
    email,
    phone: text(body.phone),
    careerStatus: text(body.careerStatus),
    portfolioUrl: text(body.portfolioUrl),
    goals: text(body.goals),
    focusAreas: Array.isArray(body.focusAreas) ? body.focusAreas.map(text).filter(Boolean) : [],
    rollNo: text(body.rollNo),
    cohort: text(body.cohort),
    isEnrolledVerified: body.isEnrolledVerified === true,
    paymentMethod: text(body.paymentMethod),
    trxId: text(body.trxId),
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

/**
 * Payload sent from the booking wizard to /api/bookings, and the column order
 * used when appending a row to the Google Sheet. Keep SHEET_COLUMNS in sync
 * with this interface — the header row is written from it.
 */
export interface BookingSubmission {
  bookingId: string;
  submittedAt: string;
  trackTitle: string;
  amount: string;
  mentorName: string;
  date: string;
  slot: string;
  timezone: string;
  fullName: string;
  email: string;
  phone: string;
  careerStatus: string;
  portfolioUrl: string;
  goals: string;
  focusAreas: string[];
  rollNo: string;
  cohort: string;
  isEnrolledVerified: boolean;
  paymentMethod: string;
  trxId: string;
}

/** Sheet column headers, in the exact order rows are written. */
export const SHEET_COLUMNS: { key: keyof BookingSubmission; label: string }[] = [
  { key: "submittedAt", label: "Submitted At" },
  { key: "bookingId", label: "Booking ID" },
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "WhatsApp" },
  { key: "trackTitle", label: "Session Track" },
  { key: "date", label: "Date" },
  { key: "slot", label: "Time Slot" },
  { key: "timezone", label: "Timezone" },
  { key: "mentorName", label: "Mentor" },
  { key: "amount", label: "Amount" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "trxId", label: "Transaction ID" },
  { key: "isEnrolledVerified", label: "Enrolled Student" },
  { key: "rollNo", label: "Roll No" },
  { key: "cohort", label: "Cohort" },
  { key: "careerStatus", label: "Career Status" },
  { key: "portfolioUrl", label: "Portfolio / Resume" },
  { key: "focusAreas", label: "Focus Areas" },
  { key: "goals", label: "Goals & Questions" },
];

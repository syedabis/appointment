/**
 * Server-side client for the LMS eligibility endpoint.
 *
 * The shared secret must never reach the browser, so this module is only ever
 * imported from API routes — never from a component.
 */

export interface VerifiedStudent {
  fullName: string;
  email: string;
  phone: string;
  cohort: string;
}

export interface PaymentInstructions {
  amountPkr: number;
  windowHours: number;
  bank: { name: string; title: string; iban: string; accountNumber: string };
  wallet: { title: string; number: string };
  supportWhatsApp: string;
}

export interface EligibilityResponse {
  /** Always true now — anyone may book, the question is free or paid. */
  eligible: boolean;
  /** True only for an LMS student whose course grants appointments. */
  isStudent?: boolean;
  student?: VerifiedStudent | null;
  /** True when this booking costs nothing (a student's free session). */
  free?: boolean;
  amountPkr?: number;
  /** When their next FREE session becomes available, if they have used it. */
  freeAvailableFrom?: string | null;
  /** Bank/wallet details, present only when payment is required. */
  payment?: PaymentInstructions | null;
}

/** Give up rather than hold the booking page hostage to a slow LMS. */
const LMS_TIMEOUT_MS = 5000;

export class LmsUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LmsUnavailableError";
  }
}

export async function checkStudentEligibility(email: string): Promise<EligibilityResponse> {
  const baseUrl = process.env.LMS_ELIGIBILITY_URL;
  const apiKey = process.env.LMS_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new LmsUnavailableError("LMS_ELIGIBILITY_URL or LMS_API_KEY is not configured");
  }

  const url = `${baseUrl}?email=${encodeURIComponent(email.trim().toLowerCase())}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { "x-api-key": apiKey },
      signal: AbortSignal.timeout(LMS_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    // Network failure or timeout. Treated as "unknown", never as "eligible".
    throw new LmsUnavailableError(
      error instanceof Error ? error.message : "Could not reach the LMS"
    );
  }

  if (!response.ok) {
    throw new LmsUnavailableError(`LMS responded ${response.status}`);
  }

  // Pass the LMS answer through as-is: it now describes a price rather than
  // granting or denying access.
  return (await response.json()) as EligibilityResponse;
}

export interface ReservationResult {
  ok: boolean;
  student?: VerifiedStudent;
  isPaid?: boolean;
  amountPkr?: number;
  error?: string;
  reason?: string;
  status: number;
}

/**
 * Asks the LMS to reserve a slot. The LMS owns the rules: eligibility, one
 * student per slot (a unique constraint, so simultaneous clicks cannot both
 * win), and the rolling cooldown between sessions.
 */
export async function reserveBooking(input: {
  slotId: string;
  bookingId: string;
  studentEmail: string;
  phone?: string;
  trackTitle?: string;
  careerStatus?: string;
  portfolioUrl?: string;
  goals?: string;
  focusAreas?: string[];
  timezone?: string;
  /** Payment receipt image, required when the session is not free. */
  receipt?: { buffer: Buffer; filename: string; mimeType: string };
}): Promise<ReservationResult> {
  const baseUrl = process.env.LMS_ELIGIBILITY_URL;
  const apiKey = process.env.LMS_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new LmsUnavailableError("LMS_ELIGIBILITY_URL or LMS_API_KEY is not configured");
  }

  const url = baseUrl.replace(/\/eligibility\/?$/, "/book");

  const { receipt, ...payload } = input;

  // OCR takes several seconds, so a paid booking gets a longer budget than the
  // usual lookup timeout.
  const timeoutMs = receipt ? 45_000 : LMS_TIMEOUT_MS;

  const form = new FormData();
  form.append("payload", JSON.stringify(payload));
  if (receipt) {
    form.append(
      "receipt",
      new Blob([new Uint8Array(receipt.buffer)], { type: receipt.mimeType }),
      receipt.filename
    );
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "x-api-key": apiKey },
      body: form,
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch (error) {
    throw new LmsUnavailableError(
      error instanceof Error ? error.message : "Could not reach the LMS"
    );
  }

  const data = await response.json().catch(() => ({}));

  if (response.ok && data?.ok) {
    return { ok: true, student: data.student, isPaid: !!data.isPaid, amountPkr: data.amountPkr ?? 0, status: 200 };
  }

  return {
    ok: false,
    error: data?.error || "Could not confirm your booking.",
    reason: data?.reason,
    status: response.status,
  };
}

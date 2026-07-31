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

export interface EligibilityResponse {
  eligible: boolean;
  student?: VerifiedStudent;
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

  const data = (await response.json()) as EligibilityResponse;

  // Only trust an explicit true plus a usable profile.
  if (data?.eligible === true && data.student?.email) {
    return { eligible: true, student: data.student };
  }
  return { eligible: false };
}

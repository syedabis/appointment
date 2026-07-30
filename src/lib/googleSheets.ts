import { google } from "googleapis";
import { BookingSubmission, SHEET_COLUMNS } from "@/types/booking";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

/**
 * Reads service account credentials from the environment. Throws a descriptive
 * error rather than a generic auth failure when something is missing, because
 * these are the settings most likely to be wrong on a fresh deploy.
 */
function getConfig() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  // Either name works; both are common in Google service account setups.
  const clientEmail =
    process.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetName = process.env.GOOGLE_SHEET_NAME || "Bookings";

  const missing = [
    !spreadsheetId && "GOOGLE_SHEET_ID",
    !clientEmail && "GOOGLE_CLIENT_EMAIL",
    !rawPrivateKey && "GOOGLE_PRIVATE_KEY",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }

  // Env files store the key on a single line with escaped newlines; the Google
  // auth client needs them expanded back into real line breaks.
  const privateKey = rawPrivateKey!.replace(/\\n/g, "\n");

  return { spreadsheetId: spreadsheetId!, clientEmail: clientEmail!, privateKey, sheetName };
}

function getSheetsClient(clientEmail: string, privateKey: string) {
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });
  return google.sheets({ version: "v4", auth });
}

type SheetsClient = ReturnType<typeof getSheetsClient>;

/**
 * Creates the target tab if the spreadsheet does not have one yet, so a brand
 * new sheet (which only ships with "Sheet1") works without manual renaming.
 */
async function ensureSheetExists(
  sheets: SheetsClient,
  spreadsheetId: string,
  sheetName: string
): Promise<void> {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });

  const exists = meta.data.sheets?.some(
    (sheet) => sheet.properties?.title === sheetName
  );
  if (exists) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{ addSheet: { properties: { title: sheetName } } }],
    },
  });
}

function formatCell(value: BookingSubmission[keyof BookingSubmission]): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value ?? "";
}

/**
 * Appends one booking as a row. Writes the header row first if the sheet is
 * still empty, so a brand new spreadsheet is usable without manual setup.
 */
export async function appendBookingRow(booking: BookingSubmission): Promise<void> {
  const { spreadsheetId, clientEmail, privateKey, sheetName } = getConfig();
  const sheets = getSheetsClient(clientEmail, privateKey);

  await ensureSheetExists(sheets, spreadsheetId, sheetName);

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:A1`,
  });

  if (!existing.data.values || existing.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_COLUMNS.map((column) => column.label)] },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    // RAW, not USER_ENTERED: phone numbers here start with "+", which Sheets
    // would otherwise parse as a formula and store as #ERROR!.
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [SHEET_COLUMNS.map((column) => formatCell(booking[column.key]))],
    },
  });
}

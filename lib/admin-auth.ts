import { createHash } from "crypto";
import { cookies } from "next/headers";

// Server-side guard for the leads admin API.
//
// Access is gated by a secret key (LEADS_ADMIN_TOKEN). After the key is
// verified once, an httpOnly cookie is set — so the key never lives in the
// client bundle and unauthenticated requests to /api/leads are rejected.
//
// On Vercel: set LEADS_ADMIN_TOKEN in the project's environment variables.
// Locally it falls back to a dev default (see below).

const TOKEN = process.env.LEADS_ADMIN_TOKEN || "smartinspect-demo-admin";
const EXPECTED = createHash("sha256").update(TOKEN).digest("hex");

export const ADMIN_COOKIE = "si_leads_admin";

/** Cookie value stored after a successful unlock (hash, not the raw key). */
export function sessionValue() {
  return EXPECTED;
}

export function verifyToken(token: string) {
  if (!token) return false;
  return createHash("sha256").update(token).digest("hex") === EXPECTED;
}

export async function isAdminAuthed() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === EXPECTED;
}

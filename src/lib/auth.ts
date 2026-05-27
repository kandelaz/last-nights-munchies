export const ARCHIVE_PASSWORD = process.env.ARCHIVE_PASSWORD ?? "sriracha";
export const UNLOCK_COOKIE = "lnm_unlocked";
export const UNLOCK_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function unlockToken(password: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${password}:lnm:v1`)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

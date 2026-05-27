import { NextResponse } from "next/server";
import {
  ARCHIVE_PASSWORD,
  UNLOCK_COOKIE,
  UNLOCK_MAX_AGE_SECONDS,
  unlockToken,
} from "@/lib/auth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (typeof body.password !== "string" || body.password !== ARCHIVE_PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const token = await unlockToken(ARCHIVE_PASSWORD);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(UNLOCK_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: UNLOCK_MAX_AGE_SECONDS,
  });
  return res;
}

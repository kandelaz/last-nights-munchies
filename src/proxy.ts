import { NextResponse, type NextRequest } from "next/server";
import { ARCHIVE_PASSWORD, UNLOCK_COOKIE, unlockToken } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const cookie = req.cookies.get(UNLOCK_COOKIE)?.value;
  const expected = await unlockToken(ARCHIVE_PASSWORD);
  if (cookie === expected) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!t/|unlock$|api/|_next/|audio/|icon$|favicon|.*\\.[^/]+$).*)",
  ],
};

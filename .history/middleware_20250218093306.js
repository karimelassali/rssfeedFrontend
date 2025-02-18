import { NextResponse } from "next/server";
import { withSession } from "supertokens-node/nextjs";
import { ensureSuperTokensInit } from "./config/supertokens";

ensureSuperTokensInit();

export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return await withSession(request, async (session) => {
      if (session) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*"]
};
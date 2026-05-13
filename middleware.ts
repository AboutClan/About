import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  const pathname = req.nextUrl.pathname;

  if (
    pathname === "/" &&
    (host === "xn--ob0b42knwutje.com" || host === "www.xn--ob0b42knwutje.com")
  ) {
    return NextResponse.rewrite(new URL("/cafe-map", req.url));
  }

  return NextResponse.next();
}

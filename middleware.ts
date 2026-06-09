import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // cafe-map 로그인 중 OAuth 에러로 /home 등에 착지하는 경우 차단
  // redirect 콜백에서 callbackUrl로 잡지 못한 케이스(callbackUrl 유실)의 최후 방어선
  if (searchParams.has("error")) {
    const cafeMapPending = request.cookies.get("cafe_map_auth_pending");

    if (cafeMapPending) {
      const response = NextResponse.redirect(new URL("/cafe-map/login", request.url));
      // 사용 후 쿠키 삭제
      response.cookies.set("cafe_map_auth_pending", "", { maxAge: 0, path: "/" });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // /home, /login, /register 경로에서만 동작 (성능)
  matcher: ["/home", "/login", "/register/:path*"],
};

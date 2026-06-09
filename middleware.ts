import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // /home에 error 파라미터와 함께 도착했을 때 cafe-map 플로우인지 확인
  if (searchParams.has("error")) {
    const cafeMapPending =
      request.cookies.get("cafe_map_auth_pending")?.value;

    // 디버깅: 미들웨어 실행 확인
    console.log("[middleware] /home?error detected", {
      error: searchParams.get("error"),
      cafeMapPending,
      allCookies: request.cookies
        .getAll()
        .map((c) => c.name)
        .join(", "),
    });

    if (cafeMapPending) {
      console.log("[middleware] cafe_map_auth_pending 쿠키 감지 → /cafe-map/login으로 redirect");
      const response = NextResponse.redirect(
        new URL("/cafe-map/login", request.url),
      );
      // 사용 후 삭제
      response.cookies.set("cafe_map_auth_pending", "", {
        maxAge: 0,
        path: "/",
        sameSite: "lax",
        secure: true,
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // /home 만 대상으로 한정 (불필요한 경로 미들웨어 실행 방지)
  matcher: ["/home"],
};

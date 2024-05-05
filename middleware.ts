/* eslint-disable */

async function getData() {
  const res = await fetch("https://api.example.com/...");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
const secret = process.env.NEXTAUTH_SECRET;
export async function middleware() {
  // const session = await getSession();
  // const session=await getServerSession(context.req,context.res,auth)
  // const token2 = await getToken({ req });
  // const token3 = await encode({
  //   token: token2 as JWT,
  //   secret: secret as string,
  // });
  // const e = cookies().get("next-auth.session-token");
  // const f = `Bearer ${token3}`;
  // // axios.defaults.headers.common["Authorization"] = f;
  // const authResponse = await fetch(
  //   `https://about-backend.herokuapp.com/user/profile`,
  //   {
  //     method: "get",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token3}`,
  //     },
  //   }
  // );
  // const C = await authResponse.json();
  // const A = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://about-backend.herokuapp.com/user/profile`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token2}`,
  //         },
  //       }
  //     );
  //     return await response.data;
  //   } catch (error) {
  //     console.error("Fetch error:", error);
  //     // 적절한 오류 처리를 여기에 추가
  //   }
  // };
  // A().then((data) => console.log(31123234, data));
  // const { pathname } = req.nextUrl;
  // // 인증이 필요하지 않은 경로를 정의합니다.
  // const publicPaths = ["/login", "/register", "/public"];
  // // 요청 경로가 공개 경로에 해당하는지 확인합니다.
  // const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  // // 공개 경로의 경우, 미들웨어 로직을 건너뜁니다.
  // if (isPublicPath) {
  //   return NextResponse.next();
  // }
  // // 그 외의 경우, 토큰을 검증합니다.
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // if (!token) {
  //   // 토큰이 없는 경우 로그인 페이지로 리디렉션합니다.
  //   return NextResponse.redirect("/login");
  // }
  // 인증된 사용자에 대한 요청을 계속 진행합니다.
  // return NextResponse.next();
  // // 로그인 페이지나 NextAuth 관련 경로에 대해서는 미들웨어 로직을 건너뜁니다.
  // if (pathname.includes("/api/auth") || token) {
  //   return NextResponse.next();
  // }
  // // 인증되지 않은 사용자는 로그인 페이지로 리디렉션합니다.
  // if (!token && pathname !== "/login") {
  //   return NextResponse.redirect("/login");
  // }
  // if (request.nextUrl.pathname === "/")
  //
  // if (
  //   request.nextUrl.pathname === "/" &&
  //   ["undefined", null].includes(request.nextUrl.searchParams.get("location"))
  // ) {
  //
  //   return NextResponse.redirect(new URL("/?location=suw", request.url));
  // }
}

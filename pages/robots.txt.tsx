import { GetServerSideProps } from "next";

import { resolveSiteOrigin } from "@/constants/seo";

/**
 * robots.txt 를 호스트별로 내려준다.
 *
 * 한 앱이 study-about.club 과 카공지도.com 두 도메인을 함께 서빙하므로,
 * Sitemap 줄이 자기 도메인을 가리켜야 한다. 정적 public/robots.txt 로는
 * 이 분기를 할 수 없어서 페이지 라우트로 만들었다.
 */
const buildRobotsTxt = (origin: string) =>
  [
    "User-agent: *",
    "Allow: /",
    "",
    "# 약관·개인정보는 공개 페이지라 색인 대상이다. 아래 Disallow: /user/ 보다 먼저 온다.",
    "Allow: /user/info/",
    "",
    "# 로그인·결제·관리자처럼 색인될 이유가 없거나 개인 데이터가 걸린 경로",
    "Disallow: /api/",
    "Disallow: /admin",
    "Disallow: /login",
    "Disallow: /register",
    "Disallow: /user/",
    "Disallow: /profile/",
    "Disallow: /payment",
    "Disallow: /pay",
    "Disallow: /point",
    "Disallow: /nice-auth",
    "Disallow: /checkingServer",
    "Disallow: /noMember",
    "Disallow: /_open",
    "Disallow: /designs",
    "Disallow: /test",
    "Disallow: /test2",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");

function Robots() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const origin = resolveSiteOrigin(req.headers.host);

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  // 크롤러가 자주 받아가는 파일이라 하루 캐시. 내용이 바뀔 일은 드물다.
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.write(buildRobotsTxt(origin));
  res.end();

  return { props: {} };
};

export default Robots;

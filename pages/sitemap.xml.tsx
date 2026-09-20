import { GetServerSideProps } from "next";

import { ABOUT_ORIGIN, CAFE_MAP_ORIGIN, isCafeMapHost } from "@/constants/seo";

type SitemapEntry = { path: string; changefreq: string; priority: string };

/**
 * 카공지도.com 은 루트가 곧 카공지도 페이지다. 나머지 카공지도 경로(/cafe-map/login 등)는
 * 로그인·프로필이라 색인 대상이 아니므로 루트 하나만 싣는다.
 */
const CAFE_MAP_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
];

/**
 * 어바웃은 로그인 없이 의미 있는 내용이 보이는 경로만 싣는다.
 * 스터디·모임·커뮤니티는 전부 로그인 뒤라서 넣어봐야 빈 페이지로 수집된다.
 *
 * /cafe-map 은 일부러 뺐다. canonical 이 카공지도.com 을 가리키므로
 * 여기 실으면 서로 다른 말을 하는 셈이 된다.
 */
const ABOUT_ENTRIES: SitemapEntry[] = [
  { path: "/home", changefreq: "daily", priority: "1.0" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/newbie-guide", changefreq: "monthly", priority: "0.6" },
  { path: "/notice", changefreq: "weekly", priority: "0.5" },
  { path: "/user/info/policy", changefreq: "yearly", priority: "0.3" },
  { path: "/user/info/privacy", changefreq: "yearly", priority: "0.3" },
];

const buildSitemap = (origin: string, entries: SitemapEntry[], lastmod: string) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(({ path, changefreq, priority }) =>
      [
        "  <url>",
        `    <loc>${origin}${path}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n"),
    ),
    "</urlset>",
    "",
  ].join("\n");

function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const isCafeMap = isCafeMapHost(req.headers.host);
  const origin = isCafeMap ? CAFE_MAP_ORIGIN : ABOUT_ORIGIN;
  const entries = isCafeMap ? CAFE_MAP_ENTRIES : ABOUT_ENTRIES;
  const lastmod = new Date().toISOString().split("T")[0];

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.write(buildSitemap(origin, entries, lastmod));
  res.end();

  return { props: {} };
};

export default Sitemap;

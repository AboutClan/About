/**
 * 도메인 두 개(어바웃 / 카공지도)가 한 Next 앱을 공유한다.
 * 어느 도메인으로 들어왔는지에 따라 갈라져야 하는 SEO 값을 여기 모아둔다.
 *
 * _document.tsx(메타 태그), robots.txt.tsx, sitemap.xml.tsx 가 같이 쓴다.
 */

export const CAFE_MAP_HOSTS = [
  "xn--ob0b42knwutje.com",
  "www.xn--ob0b42knwutje.com",
  "카공지도.com",
];

/** 어바웃 정식 도메인. about20s.club 은 여기로 301 되는 옛 도메인이다. */
export const ABOUT_ORIGIN = "https://study-about.club";

/** 카공지도 정식 도메인. 카공지도 페이지의 canonical 이 전부 여기를 가리킨다. */
export const CAFE_MAP_ORIGIN = "https://xn--ob0b42knwutje.com";

export const isCafeMapHost = (host: string | undefined) =>
  CAFE_MAP_HOSTS.includes(host?.split(":")?.[0] || "");

/** 요청이 들어온 도메인의 origin. robots.txt·sitemap.xml 의 자기 참조 URL 에 쓴다. */
export const resolveSiteOrigin = (host: string | undefined) =>
  isCafeMapHost(host) ? CAFE_MAP_ORIGIN : ABOUT_ORIGIN;

import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { Fragment } from "react";
import { ServerStyleSheet } from "styled-components";

import { GROUP_OG_MAPPING } from "@/pages/s/group/[id]";

const CAFE_MAP_HOSTS = ["xn--ob0b42knwutje.com", "www.xn--ob0b42knwutje.com", "카공지도.com"];

const DEFAULT_IMAGE =
  "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%ED%83%80/thumbnail.jpg";
/** 카공지도 페이지의 정식 URL. study-about.club/cafe-map 과 같은 내용이라 이쪽으로 통일한다. */
const CAFE_MAP_CANONICAL = "https://xn--ob0b42knwutje.com/";

const CAFE_MAP_IMAGE =
  "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%ED%83%80/cafe-map.png";

type OG = {
  title: string;
  description: string;
  url: string;
  image: string;
  /** 검색결과·탭 파비콘. 지정하지 않으면 어바웃 기본 배지를 쓴다. */
  icon?: string;
  appleIcon?: string;
  /** 이 페이지의 정식 URL. 같은 내용이 여러 도메인에 뜨는 경우에만 지정한다. */
  canonical?: string;
  /** 검색결과에 뜨는 사이트 이름. 지정하지 않으면 "어바웃". */
  siteName?: string;
};

const DEFAULT_ICON = "/favicon.ico";
const DEFAULT_APPLE_ICON = "/appIcon.png";
const CAFE_MAP_ICON = "/cafe-map-icon-180.png";
const DEFAULT_SITE_NAME = "어바웃";
const CAFE_MAP_SITE_NAME = "카공지도";
const CAFE_MAP_LARGE_ICON = "/cafe-map-icon.png";

const resolveOgBase = (host: string | undefined, asPath: string): OG => {
  const normalizedHost = host?.split(":")?.[0];
  const isCafeMapHost = CAFE_MAP_HOSTS.includes(normalizedHost || "");

  if (isCafeMapHost) {
    return {
      title: "카공 지도 | 내 근처 카공 카페 찾기",
      description: "100만개 이상의 카공 리뷰를 기반으로 제작된, 진짜 카공 지도",
      url: CAFE_MAP_CANONICAL,
      image: CAFE_MAP_IMAGE,
      icon: CAFE_MAP_ICON,
      appleIcon: CAFE_MAP_ICON,
      canonical: CAFE_MAP_CANONICAL,
      siteName: CAFE_MAP_SITE_NAME,
    };
  }

  const pathname = asPath.split("?")[0];
  const [, first, second, third] = pathname.split("/");

  if (pathname === "/home/gatherReview") {
    return {
      title: "멤버 리뷰",
      description: "함께 참여했던 멤버들에 대한 후기를 익명으로 평가할 수 있어요!",
      url: "https://study-about.club",
      image: DEFAULT_IMAGE,
    };
  }
  if (pathname === "/random-roulette") {
    return {
      title: "🔥 열활 멤버 🔥 이벤트 룰렛",
      description: "소모임 열활 멤버에게 드리는 이벤트 티켓! 접속해서 확인하세요!",
      url: "https://study-about.club/cafe-map",
      image:
        "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%9D%B4%EB%B2%A4%ED%8A%B8+%EB%A1%A4%EB%A0%9B.png",
    };
  }
  if (pathname === "/cafe-map" || pathname === "/") {
    return {
      title: "카공 지도 | 내 근처 카공 카페 찾기",
      description: "콘센트·좌석·분위기까지 고려한, 카공러들을 위한 진짜 카공 지도",
      url: CAFE_MAP_CANONICAL,
      image: CAFE_MAP_IMAGE,
      icon: CAFE_MAP_ICON,
      appleIcon: CAFE_MAP_ICON,
      canonical: CAFE_MAP_CANONICAL,
      siteName: CAFE_MAP_SITE_NAME,
    };
  }
  if (pathname === "/s/lounge") {
    return {
      title: "카공 스터디 라운지",
      description: "스터디 확인, 신청, 변경 모두 여기서!",
      url: "https://study-about.club/s/lounge",
      image:
        "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/1.%EC%8A%A4%ED%84%B0%EB%94%94-%EB%A7%A4%EC%B9%AD-%EB%9D%BC%EC%9A%B4%EC%A7%80.png",
    };
  }
  if (pathname === "/s/result") {
    return {
      title: "내 카공 스터디",
      description: "오늘 참여중인 스터디로 바로 이동!",
      url: "https://study-about.club/s/result",
      image:
        "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/2.%EC%8B%A4%EC%8B%9C%EA%B0%84-%EA%B3%B5%EB%B6%80-%EC%9D%B8%EC%A6%9D.png",
    };
  }
  if (pathname === "/s/attend") {
    return {
      title: "실시간 공부 인증",
      description: "개인 공부 인증하고 포인트 받자!",
      url: "https://study-about.club/s/attend",
      image:
        "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/2.%EC%8B%A4%EC%8B%9C%EA%B0%84-%EA%B3%B5%EB%B6%80-%EC%9D%B8%EC%A6%9D.png",
    };
  }
  if (first === "s" && second === "group" && third && GROUP_OG_MAPPING[third]) {
    return {
      ...GROUP_OG_MAPPING[third],
      url: `https://study-about.club/s/results/group/${third}`,
    };
  }
  if (second === "gather") {
    return {
      title: "번개 모임",
      description: "해당 번개로 바로 이동!",
      url: "https://study-about.club/s/results/gather",
      image: DEFAULT_IMAGE,
    };
  }
  return {
    title: "어바웃",
    description: "20대 커뮤니티형 동아리",
    url: "https://study-about.club",
    image: DEFAULT_IMAGE,
  };
};

/**
 * 카공지도 하위 경로(/cafe-map/login 등)는 공유 카드 문구는 기본값을 쓰더라도
 * 파비콘만큼은 어바웃 배지가 아니라 카공지도 아이콘이어야 한다.
 */
const resolveOg = (host: string | undefined, asPath: string): OG => {
  const og = resolveOgBase(host, asPath);
  if (og.icon) return og;

  const pathname = asPath.split("?")[0];
  if (pathname === "/cafe-map" || pathname.startsWith("/cafe-map/")) {
    return { ...og, icon: CAFE_MAP_ICON, appleIcon: CAFE_MAP_ICON };
  }
  return og;
};

type MyDocumentProps = { og: OG };

export default class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps & MyDocumentProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);
      const og = resolveOg(ctx.req?.headers?.host, ctx.asPath ?? "");
      return {
        ...initialProps,
        og,
        styles: [
          <Fragment key="styles">
            {initialProps.styles}
            {sheet.getStyleElement()}
          </Fragment>,
        ],
      };
    } finally {
      sheet.seal();
    }
  }
  render() {
    const { og } = this.props;
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            href="/fonts/PretendardVariable.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          {/* <link rel="manifest" href="/manifest.json" /> */}
          <meta property="og:type" content="website" key="og:type" />
          <meta property="og:locale" content="ko_KR" key="og:locale" />
          {/* 예전엔 환경변수(URL 문자열)가 그대로 들어가 있었다. 사이트 이름이어야 한다. */}
          <meta
            property="og:site_name"
            content={og.siteName ?? DEFAULT_SITE_NAME}
            key="og:site_name"
          />
          <meta charSet="utf-8" key="charset" />

          {/* 검색결과 파비콘. 카공지도 도메인/경로면 카공지도 아이콘으로 바뀐다.
              구글은 사이트 루트의 아이콘을 쓰므로, 카공지도.com 루트가 곧 카공지도 페이지라 여기서 갈라주면 된다. */}
          <link rel="icon" href={og.icon ?? DEFAULT_ICON} key="icon" />
          <link
            rel="apple-touch-icon"
            href={og.appleIcon ?? DEFAULT_APPLE_ICON}
            key="apple-touch-icon"
          />
          {og.icon === CAFE_MAP_ICON && (
            <link
              rel="icon"
              type="image/png"
              sizes="512x512"
              href={CAFE_MAP_LARGE_ICON}
              key="icon-lg"
            />
          )}

          {/* <title> 은 next/head 로 관리한다 (@next/next/no-title-in-document-head).
              크롤러/공유 카드용 제목은 아래 og:title 로 SSR HTML 에 SSR-host 기반 분기와 함께 포함됨. */}
          <meta property="og:title" content={og.title} key="og:title" />
          <meta property="og:description" content={og.description} key="og:description" />
          {/* 구글 검색결과 스니펫은 og:description 이 아니라 이걸 본다. */}
          <meta name="description" content={og.description} key="description" />
          <meta property="og:url" content={og.url} key="og:url" />
          {og.canonical && <link rel="canonical" href={og.canonical} key="canonical" />}
          <meta property="og:image" content={og.image} key="og:image" />

          {/* 구글이 검색결과에 표기하는 사이트 이름. 카공지도.com 은 어바웃이 아니라 카공지도로 뜨게 한다. */}
          <script
            type="application/ld+json"
            key="ld-website"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: og.siteName ?? DEFAULT_SITE_NAME,
                url: og.siteName === CAFE_MAP_SITE_NAME ? CAFE_MAP_CANONICAL : "https://study-about.club",
              }),
            }}
          />

          <script src="https://www.cookiepayments.com/js/cookiepayments-1.1.4.js" defer></script>
          {/* <script src="https://sandbox.cookiepayments.com/js/cookiepayments-1.1.4.js"></script> */}

          <script
            defer
            src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=kyi1yirf4s&submodules=geocoder"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

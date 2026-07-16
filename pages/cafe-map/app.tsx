import type { GetServerSideProps } from "next";
import Head from "next/head";

// 스마트 앱 다운로드 리디렉션: 리트리 등록용 단일 진입점 (https://about20s.club/cafe-map/app)
const ANDROID_APP_STORE_URL = "https://play.google.com/store/apps/details?id=club.about20s.cafemap";
const IOS_APP_STORE_URL = "https://apps.apple.com/kr/app/id6776977905";
const PC_FALLBACK_URL = "https://xn--ob0b42knwutje.com";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // UA별로 응답이 달라지므로 캐시되면 안 되고, 다운로드 링크는 검색 노출도 막는다.
  res.setHeader("Cache-Control", "no-store, private");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  const ua = (req.headers["user-agent"] || "").toLowerCase();

  const isAndroid = /android/.test(ua);
  const isIOSMobileUA = /iphone|ipod|ipad/.test(ua);
  const isWindows = /windows|win32|win64|wow64/.test(ua);
  // iPadOS는 "데스크톱 웹사이트 보기" 여부와 무관하게 기본적으로 Mac Safari와 동일한 UA를 보낸다.
  // 서버에서는 실제 Mac인지 iPad인지 구분할 수 없어 클라이언트에서 maxTouchPoints로 재판별한다.
  const isAmbiguousMac = /macintosh/.test(ua) && !isWindows;

  if (isAndroid) {
    return { redirect: { destination: ANDROID_APP_STORE_URL, permanent: false } };
  }

  if (isIOSMobileUA) {
    return { redirect: { destination: IOS_APP_STORE_URL, permanent: false } };
  }

  if (isAmbiguousMac) {
    return { props: {} };
  }

  // Windows PC 및 그 외 알 수 없는 UA(크롤러 포함)는 PC 결과로 안전하게 폴백
  return { redirect: { destination: PC_FALLBACK_URL, permanent: false } };
};

function CafeMapAppRedirectPage() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        {/* JS가 비활성화된 경우를 위한 폴백 */}
        <meta httpEquiv="refresh" content={`3;url=${PC_FALLBACK_URL}`} />
      </Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var isIPadDesktopMode = navigator.maxTouchPoints > 1;
              window.location.replace(isIPadDesktopMode ? ${JSON.stringify(
                IOS_APP_STORE_URL,
              )} : ${JSON.stringify(PC_FALLBACK_URL)});
            })();
          `,
        }}
      />
    </>
  );
}

export default CafeMapAppRedirectPage;

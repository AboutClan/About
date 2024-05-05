import Script from "next/script";

const NEXT_PUBLIC_NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;

function BaseScript() {
  return (
    <>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NEXT_PUBLIC_NAVER_CLIENT_ID}`}
        strategy="afterInteractive"
      />
      <Script src="https://kit.fontawesome.com/4071928605.js" crossOrigin="anonymous" />
      <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="lazyOnload" />
    </>
  );
}

export default BaseScript;

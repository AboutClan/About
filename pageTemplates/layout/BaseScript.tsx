import Script from "next/script";

function BaseScript() {
  return (
    <>
      <Script src="https://kit.fontawesome.com/4071928605.js" crossOrigin="anonymous" />
      <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="lazyOnload" />
      <Script
        id="kakao-adfit-sdk"
        src="//t1.daumcdn.net/kas/static/ba.min.js"
        strategy="afterInteractive"
      />
      <Script src="https://t1.daumcdn.net/kas/static/ba.min.js" async strategy="afterInteractive" />

      {/* <Script
        src="https://sandbox.cookiepayments.com/js/cookiepayments-1.1.4.js"
        strategy="beforeInteractive"
        crossOrigin="anonymous"
      ></Script> */}
    </>
  );
}

export default BaseScript;

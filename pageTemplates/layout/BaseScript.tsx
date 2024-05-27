import Script from "next/script";



function BaseScript() {
  return (
    <>
      <Script src="https://kit.fontawesome.com/4071928605.js" crossOrigin="anonymous" />
      <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="lazyOnload" />
    </>
  );
}

export default BaseScript;

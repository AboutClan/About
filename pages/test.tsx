/* eslint-disable @typescript-eslint/no-explicit-any */

import Script from "next/script";
import { useState } from "react";

export default function TestPay() {
  const [jqReady, setJqReady] = useState(false);
  const [cpReady, setCpReady] = useState(false);

  const pay = () => {
    const cp = (window as any).cookiepayments;
    if (!cp) return alert("쿠키페이 로딩 실패");

    cp.init({ api_id: "sandbox_VSYEEmnajb" });
    cp.payrequest({
      ORDERNO: `test_${Date.now()}`,
      PRODUCTNAME: "결제 테스트",
      AMOUNT: "1004",
      BUYERNAME: "테스터",
      PAYMETHOD: "CARD",
      RETURNURL: "http://localhost:3000/pay/return",
    });
  };

  return (
    <>
      {/* 1) jQuery 먼저 로드 */}
      <Script
        src="https://code.jquery.com/jquery-1.12.4.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("[jq] loaded:", typeof (window as any).jQuery, typeof (window as any).$);
          setJqReady(true);
        }}
        onError={() => console.error("[jq] load error")}
      />

      {/* 2) jQuery 로드된 후에만 cookiepayments 로드 */}
      {jqReady && (
        <Script
          src="https://sandbox.cookiepayments.com/js/cookiepayments-1.1.4.js"
          strategy="afterInteractive"
          onLoad={() => {
            console.log("[cookiepay] loaded:", (window as any).cookiepayments);
            setCpReady(!!(window as any).cookiepayments);
          }}
          onError={() => console.error("[cookiepay] load error")}
        />
      )}

      <button disabled={!cpReady} onClick={pay}>
        {cpReady ? "결제창 띄우기" : "로딩중..."}
      </button>
    </>
  );
}

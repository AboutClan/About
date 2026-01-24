/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";

declare const cookiepayments: {
  init: (args: { api_id: string }) => void;
  payrequest: (args: Record<string, any>) => void;
};

export default function CookiePayTest() {
  const [ready, setReady] = useState(false);
  const orderNo = useMemo(() => `ORD-${Date.now()}-${Math.random().toString(16).slice(2)}`, []);

  useEffect(() => {
    if (typeof cookiepayments === "undefined") return;

    const apiId = process.env.NEXT_PUBLIC_COOKIEPAY_API_ID;
    console.log("cookiepay apiId exists:", apiId);

    cookiepayments.init({ api_id: apiId as string });
    setReady(true);
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <p>ready: {String(ready)}</p>
      <button
        disabled={!ready}
        onClick={() => {
          cookiepayments.payrequest({
            ORDERNO: orderNo,
            PRODUCTNAME: "어바웃 결제 테스트",
            AMOUNT: "20",
            BUYERNAME: "테스터",
            PAYMETHOD: "CARD",
            RETURNURL: "https://study-about.club/api/cookiepay/return",
          });
        }}
      >
        결제하기
      </button>
    </div>
  );
}

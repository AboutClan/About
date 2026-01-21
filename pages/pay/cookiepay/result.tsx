// pages/pay/cookiepay/result.tsx
import { useRouter } from "next/router";

export default function CookiepayResultPage() {
  const router = useRouter();
  const status = String(router.query.status ?? "");
  const orderNo = String(router.query.orderNo ?? "");
  const msg = String(router.query.msg ?? "");

  return (
    <div style={{ padding: 24 }}>
      <h2>CookiePay Result</h2>
      <p>
        status: <b>{status}</b>
      </p>
      {orderNo ? <p>orderNo: {orderNo}</p> : null}
      {msg ? <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>{msg}</pre> : null}
    </div>
  );
}

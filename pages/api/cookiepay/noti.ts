/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/api/cookiepay/noti.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { findPayment, upsertPayment } from "../../../libs/paymentStore";
import { approveRegisterWithRetry } from "../../../libs/registerApproval";
import { cookiepayPaycert } from "../../../utils/cookiepay";

export const config = {
  api: { bodyParser: true }, // JSON
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "POST only" });

  try {
    const p = req.body ?? {};

    const tid = p.TID ? String(p.TID) : p.tid ? String(p.tid) : "";
    const orderNo = p.ORDERNO ? String(p.ORDERNO) : p.orderno ? String(p.orderno) : "";

    // cancel noti 케이스(문서상 noti_type)
    if (String(p.noti_type ?? "") === "cancel" || String(p.noti_type ?? "") === "deposit_cancel") {
      if (orderNo) {
        upsertPayment({
          orderNo,
          status: "FAIL",
          raw: { noti: p },
        });
      }
      return res.status(200).json({ ok: true });
    }

    // 결제승인 noti: tid 없으면 최소 기록만
    if (!tid || !orderNo) {
      if (orderNo) upsertPayment({ orderNo, status: "PENDING", raw: { noti: p } });
      return res.status(200).json({ ok: true });
    }

    // paycert로 재검증 후 SUCCESS 처리
    const cert = await cookiepayPaycert(tid);
    if (cert?.RESULTCODE === "0000") {
      upsertPayment({
        orderNo,
        tid,
        amount: String(cert.AMOUNT ?? ""),
        paymethod: String(cert.PAYMETHOD ?? ""),
        acceptDate: String(cert.ACCEPTDATE ?? ""),
        status: "SUCCESS",
        raw: { noti: p, cert },
      });

      // ✅ 브라우저 뒤로가기/이탈로 return 콜백(클라이언트 승인 트리거)이
      // 실행되지 못해도, 이 서버-투-서버 webhook이 orderNo로 uid/type을
      // 조회해 가입 승인을 대신 트리거한다. register/approval은 멱등이므로
      // return.ts나 클라이언트가 나중에 다시 호출해도 안전하다.
      const payment = findPayment(orderNo);
      if (payment?.type === "register" && payment?.uid) {
        await approveRegisterWithRetry(payment.uid);
      }
    } else {
      upsertPayment({
        orderNo,
        tid,
        status: "FAIL",
        raw: { noti: p, cert },
      });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    // 통지는 재시도될 수 있어서 200 주는게 보통 안전
    console.error("[cookiepay noti error]", e);
    return res.status(200).json({ ok: true });
  }
}

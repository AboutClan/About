/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/api/cookiepay/noti.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { markCookiepayResultWithRetry } from "../../../libs/cookiepayOrderClient";
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
        await markCookiepayResultWithRetry({ orderNo, verifiedAmount: 0, verifiedStatus: "FAIL" });
      }
      return res.status(200).json({ ok: true });
    }

    // 결제승인 noti: tid 없으면 처리할 게 없음
    if (!tid || !orderNo) {
      return res.status(200).json({ ok: true });
    }

    // ✅ 브라우저 뒤로가기/이탈로 return 콜백이 실행되지 못해도, 이 서버-투-서버
    // webhook이 orderNo 기준으로 최종 처리(가입 승인/포인트 지급)를 대신 트리거한다.
    // return.ts/클라이언트가 나중에 같은 orderNo로 다시 호출해도 nest-back이
    // 원자적으로 한 번만 처리하므로 안전하다. type(register/point) 무관하게 동일하게 동작한다.
    const cert = await cookiepayPaycert(tid);

    if (cert?.RESULTCODE === "0000") {
      await markCookiepayResultWithRetry({
        orderNo,
        verifiedAmount: Number(cert.AMOUNT ?? 0) || 0,
        verifiedStatus: "SUCCESS",
      });
    } else {
      await markCookiepayResultWithRetry({ orderNo, verifiedAmount: 0, verifiedStatus: "FAIL" });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    // 통지는 재시도될 수 있어서 200 주는게 보통 안전
    console.error("[cookiepay noti error]", e);
    return res.status(200).json({ ok: true });
  }
}

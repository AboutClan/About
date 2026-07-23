/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/api/cookiepay/init-order.ts
//
// 결제창을 열기 전에 orderNo <-> uid <-> type을 먼저 서버(paymentStore)에 기록한다.
// PG의 서버-투-서버 webhook(noti.ts)은 브라우저 상태와 무관하게 항상 호출되는데,
// noti.ts 자체 payload만으로는 이 결제가 "회원가입"인지, 누구의 것인지 알 수 없다.
// 결제 시작 시점에 이 정보를 미리 심어두면, 이후 사용자가 결제 도중 뒤로가기/이탈해도
// webhook이 orderNo로 uid/type을 조회해 가입 승인을 대신 트리거할 수 있다.
import type { NextApiRequest, NextApiResponse } from "next";

import { upsertPayment } from "../../../libs/paymentStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "POST only" });

  const orderNo = String(req.body?.orderNo ?? "");
  const uid = String(req.body?.uid ?? "");
  const type = req.body?.type;

  if (!orderNo || !uid || (type !== "register" && type !== "point")) {
    return res.status(400).json({ error: "INVALID_PARAMS" });
  }

  upsertPayment({
    orderNo,
    uid,
    type,
    status: "PENDING",
  });

  return res.status(200).json({ ok: true });
}

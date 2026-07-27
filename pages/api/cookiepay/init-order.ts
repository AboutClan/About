/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/api/cookiepay/init-order.ts
//
// 결제창을 열기 전에 orderNo <-> uid <-> type <-> amount를 먼저 nest-back(MongoDB)에
// 기록한다. 이 저장이 실패하면 결제 자체를 시작하지 않아야 한다(호출부에서 응답 실패 시 결제 중단).
// PG의 서버-투-서버 webhook(noti.ts)은 브라우저 상태와 무관하게 항상 호출되는데,
// noti.ts 자체 payload만으로는 이 결제가 무엇인지 알 수 없어서, 결제 시작 시점에
// 이 정보를 미리 심어둬야 webhook/return이 나중에 orderNo만으로 최종 처리를 할 수 있다.
import type { NextApiRequest, NextApiResponse } from "next";

import { createCookiepayOrder } from "../../../libs/cookiepayOrderClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "POST only" });

  const orderNo = String(req.body?.orderNo ?? "");
  const uid = String(req.body?.uid ?? "");
  const type = req.body?.type;
  const amount = Number(req.body?.amount);
  const discount = req.body?.discount !== undefined ? Number(req.body.discount) : undefined;
  const referrerUid = req.body?.referrerUid ? String(req.body.referrerUid) : undefined;

  if (
    !orderNo ||
    !uid ||
    (type !== "register" && type !== "point") ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return res.status(400).json({ error: "INVALID_PARAMS" });
  }

  const created = await createCookiepayOrder({ orderNo, uid, type, amount, discount, referrerUid });
  if (!created) {
    return res.status(502).json({ error: "ORDER_INIT_FAILED" });
  }

  return res.status(200).json({ ok: true });
}

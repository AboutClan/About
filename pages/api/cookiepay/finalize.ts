/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/api/cookiepay/finalize.ts
//
// 클라이언트가 결제 결과 페이지(status=success)에 도달했을 때 호출한다.
// 이미 return.ts/noti.ts가 서버 간 통신으로 최종 처리를 끝냈을 가능성이 높지만,
// 브라우저가 그 시점에 도달했다는 것 자체가 하나의 추가 트리거이자 안전망이 된다.
// 실제 승인/지급은 nest-back이 orderNo에 이미 SUCCESS로 기록된 결제에 대해서만,
// 그리고 정확히 한 번만 실행하므로 여기서 임의의 값으로 승인/지급을 조작할 수 없다.
import type { NextApiRequest, NextApiResponse } from "next";

import { finalizeCookiepayOrder } from "../../../libs/cookiepayOrderClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "POST only" });

  if (!req.headers.authorization) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  const orderNo = String(req.body?.orderNo ?? "");
  if (!orderNo) return res.status(400).json({ error: "MISSING_ORDER_NO" });

  const result = await finalizeCookiepayOrder(orderNo);
  if (!result) return res.status(502).json({ error: "FINALIZE_FAILED" });

  return res.status(200).json(result);
}

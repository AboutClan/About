/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/api/user/point/credit.ts
//
// PG 결제 성공(paymentStore의 status === "SUCCESS")이 서버에서 이미 검증된 orderNo에 대해서만,
// 정확히 한 번만 실제 포인트 지급 API를 호출한다.
// - 지급 금액은 클라이언트 입력이 아니라 서버가 PG로부터 검증해둔 amount를 사용한다.
// - claimPointCredit이 같은 프로세스 내에서 orderNo당 중복 호출을 원자적으로 막는다.
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

import { SERVER_URI } from "../../../../constants/system";
import { claimPointCredit, finalizePointCredit, findPayment } from "../../../../libs/paymentStore";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function chargePointWithRetry(amount: number, authorization: string, retryCount = 3) {
  let lastError: any = null;

  for (let i = 0; i < retryCount; i++) {
    try {
      return await axios.patch(
        `${SERVER_URI}/user/point`,
        { point: amount, message: "포인트 충전", sub: "point" },
        { headers: { Authorization: authorization } },
      );
    } catch (e) {
      lastError = e;
      if (i < retryCount - 1) await sleep(1000 * (i + 1));
    }
  }

  throw lastError;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "POST only" });

  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "UNAUTHORIZED" });

  const orderNo = String(req.body?.orderNo ?? "");
  if (!orderNo) return res.status(400).json({ error: "MISSING_ORDER_NO" });

  const payment = findPayment(orderNo);
  if (!payment || payment.type !== "point") {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  const claim = claimPointCredit(orderNo);

  if (claim.ok === false) {
    if (claim.reason === "ALREADY_CREDITED") {
      return res.status(200).json({ ok: true, alreadyCredited: true });
    }
    if (claim.reason === "IN_PROGRESS") {
      return res.status(409).json({ error: "IN_PROGRESS" });
    }
    return res.status(400).json({ error: claim.reason });
  }

  const amount = Number(claim.payment.amount);
  if (!amount || amount <= 0) {
    finalizePointCredit(orderNo, "FAILED");
    return res.status(400).json({ error: "INVALID_AMOUNT" });
  }

  try {
    await chargePointWithRetry(amount, authorization);
    finalizePointCredit(orderNo, "DONE");
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    finalizePointCredit(orderNo, "FAILED");
    return res.status(502).json({ error: "CHARGE_FAILED" });
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// libs/cookiepayOrderClient.ts
//
// About(Next.js API routes) <-> nest-back의 CookiepayOrder(MongoDB) 사이의
// 서버-투-서버 통신 헬퍼. 브라우저는 이 함수들을 직접 호출하지 않는다.
// 모든 요청에는 내부 시크릿 키(x-internal-key)가 붙고, nest-back은 이 키로만
// 인증하는 게 아니라 항상 사전에 저장된 orderNo 레코드를 기준으로만 승인/지급을
// 실행하므로, 이 키가 있다고 해서 임의의 uid를 승인/지급할 수는 없다.
import axios from "axios";

import { SERVER_URI } from "../constants/system";

// nest-back과 반드시 동일한 값이어야 한다 (nest-back: src/utils/internalAuth.ts).
const INTERNAL_KEY = "e7996cfca3b07958cf2233af8152d2344da052d15ae0523d1ced5649af928388";

function client() {
  return axios.create({
    baseURL: `${SERVER_URI}/cookiepay`,
    headers: { "x-internal-key": INTERNAL_KEY },
    timeout: 10000,
  });
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type CookiepayOrderType = "register" | "point";

export async function createCookiepayOrder(params: {
  orderNo: string;
  uid: string;
  type: CookiepayOrderType;
  amount: number;
  discount?: number;
  referrerUid?: string;
}): Promise<boolean> {
  try {
    await client().post("/order", params);
    return true;
  } catch (e: any) {
    console.error("[COOKIEPAY_ORDER_CREATE_FAILED]", {
      orderNo: params.orderNo,
      error: e?.response?.data ?? e?.message ?? String(e),
    });
    return false;
  }
}

export async function getCookiepayOrder(
  orderNo: string,
): Promise<{ status: "PENDING" | "SUCCESS" | "FAIL"; amount: number; type: CookiepayOrderType } | null> {
  try {
    const res = await client().get(`/order/${encodeURIComponent(orderNo)}`);
    return res.data;
  } catch {
    return null;
  }
}

export type FinalizeResult = { ok: boolean; processed?: boolean; alreadyProcessed?: boolean };

/**
 * PG 검증(paycert)까지 마친 뒤 결과를 알려주고, SUCCESS면 바로 finalize까지 시도한다.
 * 여러 경로(webhook/return)에서 중복 호출돼도 nest-back이 원자적으로 한 번만 처리한다.
 */
export async function markCookiepayResultWithRetry(
  params: { orderNo: string; verifiedAmount: number; verifiedStatus: "SUCCESS" | "FAIL" },
  retryCount = 3,
): Promise<FinalizeResult | null> {
  let lastError: any = null;

  for (let i = 0; i < retryCount; i++) {
    try {
      const res = await client().post("/mark-result", params);
      return res.data;
    } catch (e: any) {
      lastError = e;
      if (i < retryCount - 1) await sleep(1000 * (i + 1));
    }
  }

  console.error("[COOKIEPAY_MARK_RESULT_FAILED]", {
    orderNo: params.orderNo,
    error: lastError?.response?.data ?? lastError?.message ?? String(lastError),
  });
  return null;
}

/** 클라이언트가 결제 결과 페이지에 도달했을 때, 이미 SUCCESS로 표시된 주문을 마무리 처리한다. */
export async function finalizeCookiepayOrder(orderNo: string): Promise<FinalizeResult | null> {
  try {
    const res = await client().post("/finalize", { orderNo });
    return res.data;
  } catch (e: any) {
    console.error("[COOKIEPAY_FINALIZE_FAILED]", {
      orderNo,
      error: e?.response?.data ?? e?.message ?? String(e),
    });
    return null;
  }
}

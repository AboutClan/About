/* eslint-disable @typescript-eslint/no-explicit-any */

// libs/registerApproval.ts
//
// 결제 webhook(noti)/return 콜백처럼 서버 사이드에서 "가입 승인"을 대신 트리거할 때 쓰는 헬퍼.
// register/approval은 orderNo 기준이 아니라 uid 기준이며, 백엔드가 이미 승인된 경우도
// 성공으로 처리하도록 멱등화되어 있어(register.service.ts approve()) 여러 경로(webhook,
// return 콜백, 클라이언트)에서 중복 호출돼도 안전하다.
import axios from "axios";

import { SERVER_URI } from "../constants/system";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function approveRegisterWithRetry(uid: string, retryCount = 3): Promise<boolean> {
  let lastError: any = null;

  for (let i = 0; i < retryCount; i++) {
    try {
      await axios.post(`${SERVER_URI}/register/approval`, { uid });
      return true;
    } catch (e) {
      lastError = e;
      if (i < retryCount - 1) await sleep(1000 * (i + 1));
    }
  }

  console.error("[REGISTER_APPROVAL_FAILED]", {
    uid,
    error: lastError?.response?.data ?? lastError?.message ?? String(lastError),
  });
  return false;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// lib/paymentStore.ts
import fs from "fs";
import path from "path";

type PayStatus = "PENDING" | "SUCCESS" | "FAIL" | "VERIFY_PENDING";
type PointCreditStatus = "PENDING" | "DONE" | "FAILED";

export type PaymentRecord = {
  orderNo: string;
  tid?: string;
  amount?: string;
  paymethod?: string;
  acceptDate?: string;
  status: PayStatus;
  uid?: string;
  type?: "register" | "point";
  raw?: any;
  pointCreditStatus?: PointCreditStatus;
  updatedAt: string;
};

const FILE = path.join(process.cwd(), ".cookiepay-payments.json");

function readAll(): Record<string, PaymentRecord> {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, PaymentRecord>) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
}

export function upsertPayment(rec: Omit<PaymentRecord, "updatedAt">) {
  const all = readAll();
  const existing = all[rec.orderNo];

  if (existing?.status === "SUCCESS" && rec.status !== "SUCCESS") {
    return existing;
  }

  all[rec.orderNo] = {
    ...(existing ?? {}),
    ...rec,
    updatedAt: new Date().toISOString(),
  };

  writeAll(all);
  return all[rec.orderNo];
}

export function findPayment(orderNo: string) {
  const all = readAll();
  return all[orderNo] ?? null;
}

export type ClaimPointCreditResult =
  | { ok: true; payment: PaymentRecord }
  | { ok: false; reason: "NOT_FOUND" | "NOT_VERIFIED" | "ALREADY_CREDITED" | "IN_PROGRESS" };

// 동기(sync) fs 호출로 read-check-write를 한 이벤트루프 틱 안에서 처리 →
// 같은 프로세스에서 동시에 들어오는 재요청(새로고침, 중복 클릭 등)에 대해
// orderNo당 실제 포인트 지급 호출이 정확히 한 번만 나가도록 보장한다.
export function claimPointCredit(orderNo: string): ClaimPointCreditResult {
  const all = readAll();
  const payment = all[orderNo];

  if (!payment) return { ok: false, reason: "NOT_FOUND" };
  if (payment.status !== "SUCCESS") return { ok: false, reason: "NOT_VERIFIED" };
  if (payment.pointCreditStatus === "DONE") return { ok: false, reason: "ALREADY_CREDITED" };
  if (payment.pointCreditStatus === "PENDING") return { ok: false, reason: "IN_PROGRESS" };

  const claimed: PaymentRecord = {
    ...payment,
    pointCreditStatus: "PENDING",
    updatedAt: new Date().toISOString(),
  };
  all[orderNo] = claimed;
  writeAll(all);

  return { ok: true, payment: claimed };
}

export function finalizePointCredit(orderNo: string, status: "DONE" | "FAILED") {
  const all = readAll();
  const payment = all[orderNo];
  if (!payment) return;

  all[orderNo] = {
    ...payment,
    pointCreditStatus: status,
    updatedAt: new Date().toISOString(),
  };
  writeAll(all);
}

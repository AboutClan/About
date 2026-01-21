/* eslint-disable @typescript-eslint/no-explicit-any */

// lib/paymentStore.ts
import fs from "fs";
import path from "path";

type PayStatus = "PENDING" | "SUCCESS" | "FAIL";

export type PaymentRecord = {
  orderNo: string;
  tid?: string;
  amount?: string;
  paymethod?: string;
  acceptDate?: string;
  status: PayStatus;
  raw?: any;
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
  all[rec.orderNo] = {
    ...(all[rec.orderNo] ?? {}),
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

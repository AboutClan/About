/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/api/cookiepay/return.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { parse as parseQs } from "querystring";

import { upsertPayment } from "../../../libs/paymentStore";
import { cookiepayDecrypt, cookiepayPaycert } from "../../../utils/cookiepay";

export const config = {
  api: { bodyParser: false },
};

function readRawBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function redirect(res: NextApiResponse, url: string) {
  res.redirect(302, url);
}

function pickFirst(v: any): any {
  return Array.isArray(v) ? v[0] : v;
}

function normalizePayload(obj: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj ?? {})) out[k] = pickFirst(v);
  return out;
}

function encodeMsg(msg: string) {
  return encodeURIComponent(msg || "");
}

// ✅ 결제 완료 후 돌아갈 페이지(고정)
const RESULT_PATH = "/register/access";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("cookiepay return content-type:", req.headers["content-type"]);
  console.log("ENV check:", {
    NEXT_PUBLIC_COOKIEPAY_API_ID: !!process.env.NEXT_PUBLIC_COOKIEPAY_API_ID,
    COOKIEPAY_API_ID: !!process.env.COOKIEPAY_API_ID,
    COOKIEPAY_API_KEY: !!process.env.COOKIEPAY_API_KEY,
  });
  console.log("method:", req.method);

  try {
    const query = normalizePayload((req.query ?? {}) as Record<string, any>);

    let bodyObj: Record<string, any> = {};
    const ct = String(req.headers["content-type"] ?? "").toLowerCase();

    console.log("query keys:", Object.keys(req.query ?? {}));

    if (req.method === "POST") {
      const raw = await readRawBody(req);
      console.log("raw head:", raw.slice(0, 300));
      console.log("raw includes ENC_DATA:", raw.includes("ENC_DATA"));

      if (ct.includes("application/x-www-form-urlencoded")) {
        bodyObj = normalizePayload((parseQs(raw) ?? {}) as any);
      } else if (ct.includes("application/json")) {
        bodyObj = raw ? normalizePayload(JSON.parse(raw)) : {};
      } else {
        bodyObj = raw ? ({ __raw: raw } as any) : {};
      }
    }

    const payload = { ...query, ...bodyObj };

    const RESULTCODE = String(payload.RESULTCODE ?? "");
    const RESULTMSG = String(payload.RESULTMSG ?? "");
    const ENC_DATA = payload.ENC_DATA ? String(payload.ENC_DATA) : "";

    console.log("payload flags:", {
      RESULTCODE,
      RESULTMSG,
      has_ENC_DATA: !!ENC_DATA,
      enc_len: ENC_DATA?.length ?? 0,
    });

    // 1) 리턴 단계 실패
    if (RESULTCODE && RESULTCODE !== "0000") {
      redirect(
        res,
        `${RESULT_PATH}?status=fail&reason=RETURN_FAIL&msg=${encodeMsg(
          RESULTMSG || "payment fail",
        )}`,
      );
      return;
    }

    // ---- A) 평문 리턴 ----
    if (!ENC_DATA) {
      const orderNo = String(payload.ORDERNO ?? "");
      const tid = String(payload.TID ?? "");
      const amount = String(payload.AMOUNT ?? "");
      const paymethod = String(payload.PAY_METHOD ?? payload.PAYMETHOD ?? "");
      const acceptDate = String(payload.ACCEPTDATE ?? "");

      if (!orderNo || !tid) {
        redirect(
          res,
          `${RESULT_PATH}?status=fail&reason=MISSING_KEYS&msg=${encodeMsg("missing ORDERNO/TID")}`,
        );
        return;
      }

      const cert = await cookiepayPaycert(tid);
      console.log("paycert:", { rc: cert?.RESULTCODE, msg: cert?.RESULTMSG });

      // 2) paycert 실패(최종 실패)
      if (cert?.RESULTCODE !== "0000") {
        upsertPayment({
          orderNo,
          tid,
          amount,
          paymethod,
          acceptDate,
          status: "FAIL",
          raw: { payload, cert },
        });

        redirect(
          res,
          `${RESULT_PATH}?status=fail&reason=PAYCERT_FAIL&orderNo=${encodeURIComponent(
            orderNo,
          )}&msg=${encodeMsg(cert?.RESULTMSG ?? "paycert fail")}`,
        );
        return;
      }

      // ✅ 성공
      upsertPayment({
        orderNo,
        tid,
        amount: String(cert.AMOUNT ?? amount),
        paymethod: String(cert.PAYMETHOD ?? paymethod),
        acceptDate: String(cert.ACCEPTDATE ?? acceptDate),
        status: "SUCCESS",
        raw: { payload, cert },
      });

      redirect(res, `${RESULT_PATH}?status=success&orderNo=${encodeURIComponent(orderNo)}`);
      return;
    }

    // ---- B) 암호화 리턴 ----
    const dec = await cookiepayDecrypt(ENC_DATA);
    console.log("decrypt:", { rc: dec?.RESULTCODE, msg: dec?.RESULTMSG });

    if (dec?.RESULTCODE !== "0000" || !dec?.decryptData) {
      redirect(
        res,
        `${RESULT_PATH}?status=fail&reason=DECRYPT_FAIL&msg=${encodeMsg(
          dec?.RESULTMSG ?? "decrypt fail",
        )}`,
      );
      return;
    }

    const d = dec.decryptData;
    const orderNo = String(d.ORDERNO ?? "");
    const tid = String(d.TID ?? "");
    const amount = String(d.AMOUNT ?? "");
    const paymethod = String(d.PAY_METHOD ?? d.PAYMETHOD ?? "");
    const acceptDate = String(d.ACCEPTDATE ?? "");

    if (!orderNo || !tid) {
      redirect(
        res,
        `${RESULT_PATH}?status=fail&reason=MISSING_KEYS&msg=${encodeMsg("missing ORDERNO/TID")}`,
      );
      return;
    }

    const cert = await cookiepayPaycert(tid);
    console.log("paycert:", { rc: cert?.RESULTCODE, msg: cert?.RESULTMSG });

    if (cert?.RESULTCODE !== "0000") {
      upsertPayment({
        orderNo,
        tid,
        amount,
        paymethod,
        acceptDate,
        status: "FAIL",
        raw: { payload, dec, cert },
      });

      redirect(
        res,
        `${RESULT_PATH}?status=fail&reason=PAYCERT_FAIL&orderNo=${encodeURIComponent(
          orderNo,
        )}&msg=${encodeMsg(cert?.RESULTMSG ?? "paycert fail")}`,
      );
      return;
    }

    upsertPayment({
      orderNo,
      tid,
      amount: String(cert.AMOUNT ?? amount),
      paymethod: String(cert.PAYMETHOD ?? paymethod),
      acceptDate: String(cert.ACCEPTDATE ?? acceptDate),
      status: "SUCCESS",
      raw: { payload, dec, cert },
    });

    redirect(res, `${RESULT_PATH}?status=success&orderNo=${encodeURIComponent(orderNo)}`);
  } catch (e: any) {
    redirect(
      res,
      `${RESULT_PATH}?status=fail&reason=SERVER_ERROR&msg=${encodeMsg(e?.message ?? String(e))}`,
    );
  }
}

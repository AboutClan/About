/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/api/cookiepay/return.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { parse as parseQs } from "querystring";

import { upsertPayment } from "../../../libs/paymentStore";
import { cookiepayDecrypt, cookiepayPaycert } from "../../../utils/cookiepay";

export const config = {
  api: { bodyParser: false }, // Form Data 받으려고
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("cookiepay return content-type:", req.headers["content-type"]);
  try {
    const query = (req.query ?? {}) as Record<string, any>;

    let bodyObj: Record<string, any> = {};
    if (req.method === "POST") {
      const raw = await readRawBody(req);
      const ct = String(req.headers["content-type"] ?? "").toLowerCase();

      if (ct.includes("application/x-www-form-urlencoded")) bodyObj = (parseQs(raw) ?? {}) as any;
      else if (ct.includes("application/json")) bodyObj = raw ? JSON.parse(raw) : {};
      else bodyObj = raw ? ({ __raw: raw } as any) : {};
    }

    const payload = { ...query, ...bodyObj };
    const RESULTCODE = String(payload.RESULTCODE ?? "");
    const RESULTMSG = String(payload.RESULTMSG ?? "");
    const ENC_DATA = payload.ENC_DATA ? String(payload.ENC_DATA) : "";

    // 성공이든 실패든 최소 저장(PENDING/FAIL)
    // orderNo는 decrypt 후에 알 수 있어서, 우선은 결과페이지만 보냄
    if (!ENC_DATA) {
      return res.redirect(
        302,
        `/pay/cookiepay/result?status=fail&msg=${encodeURIComponent(RESULTMSG || "no ENC_DATA")}`,
      );
    }

    // 1) decrypt
    const dec = await cookiepayDecrypt(ENC_DATA);
    if (dec?.RESULTCODE !== "0000" || !dec?.decryptData) {
      return res.redirect(
        302,
        `/pay/cookiepay/result?status=fail&msg=${encodeURIComponent(
          dec?.RESULTMSG ?? "decrypt fail",
        )}`,
      );
    }

    const d = dec.decryptData;
    const orderNo = String(d.ORDERNO ?? "");
    const tid = String(d.TID ?? "");
    const amount = String(d.AMOUNT ?? "");
    const paymethod = String(d.PAY_METHOD ?? d.PAYMETHOD ?? "");
    const acceptDate = String(d.ACCEPTDATE ?? "");

    if (!orderNo || !tid) {
      return res.redirect(
        302,
        `/pay/cookiepay/result?status=fail&msg=${encodeURIComponent("missing ORDERNO/TID")}`,
      );
    }

    // 2) paycert(검증)
    const cert = await cookiepayPaycert(tid);
    if (cert?.RESULTCODE !== "0000") {
      upsertPayment({
        orderNo,
        tid,
        amount,
        paymethod,
        acceptDate,
        status: "FAIL",
        raw: { RESULTCODE, RESULTMSG, dec, cert },
      });

      return res.redirect(
        302,
        `/pay/cookiepay/result?status=fail&orderNo=${encodeURIComponent(
          orderNo,
        )}&msg=${encodeURIComponent(cert?.RESULTMSG ?? "paycert fail")}`,
      );
    }

    // 3) 최종 저장(SUCCESS)
    upsertPayment({
      orderNo,
      tid,
      amount: String(cert.AMOUNT ?? amount),
      paymethod: String(cert.PAYMETHOD ?? paymethod),
      acceptDate: String(cert.ACCEPTDATE ?? acceptDate),
      status: "SUCCESS",
      raw: { RESULTCODE, RESULTMSG, dec, cert },
    });

    return res.redirect(
      302,
      `/pay/cookiepay/result?status=success&orderNo=${encodeURIComponent(orderNo)}`,
    );
  } catch (e: any) {
    return res.redirect(
      302,
      `/pay/cookiepay/result?status=fail&msg=${encodeURIComponent(e?.message ?? String(e))}`,
    );
  }
}

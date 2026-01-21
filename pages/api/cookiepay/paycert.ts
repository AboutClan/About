/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "POST only" });

  const { tid } = req.body ?? {};
  if (!tid || typeof tid !== "string") {
    return res.status(400).json({ message: "tid required" });
  }

  const baseUrl = process.env.COOKIEPAY_BASE_URL;
  const pay2_id = process.env.COOKIEPAY_API_ID;
  const pay2_key = process.env.COOKIEPAY_API_KEY;

  if (!baseUrl || !pay2_id || !pay2_key) {
    return res.status(500).json({
      message: "Missing env: COOKIEPAY_BASE_URL / COOKIEPAY_API_ID / COOKIEPAY_API_KEY",
    });
  }

  // 1) TOKEN 발급
  const tokenRes = await fetch(`${baseUrl}/payAuth/token`, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ pay2_id, pay2_key }),
  });

  const tokenText = await tokenRes.text();
  let tokenJson: any;
  try {
    tokenJson = JSON.parse(tokenText);
  } catch {
    return res
      .status(502)
      .json({ message: "Token API non-JSON", status: tokenRes.status, raw: tokenText });
  }

  if (tokenJson?.RTN_CD !== "0000" || !tokenJson?.TOKEN) {
    return res
      .status(502)
      .json({ message: "Failed to get TOKEN", status: tokenRes.status, tokenJson });
  }

  // 2) paycert (결제검증)
  const certRes = await fetch(`${baseUrl}/api/paycert`, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
      TOKEN: tokenJson.TOKEN,
    },
    body: JSON.stringify({ tid }),
  });

  const certText = await certRes.text();
  let certJson: any;
  try {
    certJson = JSON.parse(certText);
  } catch {
    return res
      .status(502)
      .json({ message: "paycert non-JSON", status: certRes.status, raw: certText });
  }

  // paycert 결과가 certJson에 들어있다고 가정
  if (certJson?.RESULTCODE === "0000") {
    // 여기서 "결제 성공 처리"를 했다고 가정 (DB 대신 로그로만)
    console.log("[COOKIEPAY SUCCESS]", {
      orderNo: certJson.ORDERNO,
      tid: certJson.TID,
      amount: certJson.AMOUNT,
      paymethod: certJson.PAYMETHOD,
      acceptDate: certJson.ACCEPTDATE,
    });
  } else {
    console.log("[COOKIEPAY FAIL]", certJson);
  }

  return res.status(200).json(certJson);
}

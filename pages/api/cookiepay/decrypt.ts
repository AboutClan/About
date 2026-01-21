/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextApiRequest, NextApiResponse } from "next";

import { cookiepayBaseUrl } from "../../../utils/cookiepay";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "POST only" });

  const { encData } = req.body ?? {};
  if (!encData || typeof encData !== "string") {
    return res.status(400).json({ message: "encData required" });
  }

  const API_ID = process.env.COOKIEPAY_API_ID; // ✅ 이걸로
  const API_KEY = process.env.COOKIEPAY_API_KEY;
  if (!API_ID || !API_KEY) {
    return res.status(500).json({ message: "Missing env: API_ID / API_KEY" });
  }

  const url = `${cookiepayBaseUrl()}/EdiAuth/cookiepay_edi_decrypt`;

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
      ApiKey: API_KEY,
    },
    body: JSON.stringify({
      API_ID,
      ENC_DATA: encData,
    }),
  });

  const text = await r.text();
  // 쿠키페이 응답이 JSON이 아닐 가능성도 있어서 try/catch
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    return res.status(502).json({ message: "Decrypt API non-JSON", raw: text });
  }

  return res.status(200).json(json);
}

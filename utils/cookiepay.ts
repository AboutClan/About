/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

// utils/cookiepay.ts
export function cookiepayBaseUrl() {
  return process.env.COOKIEPAY_MODE === "live"
    ? "https://www.cookiepayments.com"
    : "https://sandbox.cookiepayments.com";
}

export async function cookiepayDecrypt(encData: string) {
  const API_ID = process.env.COOKIEPAY_API_ID;
  const API_KEY = process.env.COOKIEPAY_API_KEY;
  if (!API_ID || !API_KEY) throw new Error("Missing env: COOKIEPAY_API_ID / COOKIEPAY_API_KEY");

  const url = `${cookiepayBaseUrl()}/EdiAuth/cookiepay_edi_decrypt`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
      ApiKey: API_KEY,
    },
    body: JSON.stringify({ API_ID, ENC_DATA: encData }),
  });

  const text = await r.text();
  const json = JSON.parse(text);
  return json;
}

export async function cookiepayToken() {
  const pay2_id = process.env.COOKIEPAY_API_ID;
  const pay2_key = process.env.COOKIEPAY_API_KEY;
  if (!pay2_id || !pay2_key) throw new Error("Missing env: COOKIEPAY_API_ID / COOKIEPAY_API_KEY");

  const url = `${cookiepayBaseUrl()}/payAuth/token`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ pay2_id, pay2_key }),
  });

  const text = await r.text();
  const json = JSON.parse(text);
  return json;
}

export async function cookiepayPaycert(tid: string) {
  const tokenJson = await cookiepayToken();
  if (tokenJson?.RTN_CD !== "0000" || !tokenJson?.TOKEN) {
    throw new Error(`TOKEN failed: ${JSON.stringify(tokenJson)}`);
  }

  const url = `${cookiepayBaseUrl()}/api/paycert`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
      TOKEN: tokenJson.TOKEN,
    },
    body: JSON.stringify({ tid }),
  });

  const text = await r.text();
  const json = JSON.parse(text);
  return json;
}

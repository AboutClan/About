import type { NextApiRequest, NextApiResponse } from "next";

import { cookiepayToken } from "../../../utils/cookiepay";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await cookiepayToken();
    return res.status(200).json(token);
  } catch (e) {
    return res.status(500).json({ ok: false, message: e?.message ?? String(e) });
  }
}

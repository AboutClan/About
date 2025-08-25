import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string) ?? "";
  if (!q.trim()) return res.status(400).json({ message: "q 필요" });

  const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
    q,
  )}&display=10`;

  try {
    const r = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_DEVELOP_CLIENT_ID!,
        "X-Naver-Client-Secret": process.env.NAVER_DEVELOP_CLIENT_SECRET!,
      },
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ message: "proxy error", detail: e?.message });
  }
}

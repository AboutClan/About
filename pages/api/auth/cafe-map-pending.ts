import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  // 서버 Set-Cookie: JS document.cookie 방식과 달리 OAuth 리다이렉트 중에도 유실되지 않음
  res.setHeader(
    "Set-Cookie",
    "cafe_map_auth_pending=1; Path=/; Max-Age=300; HttpOnly; Secure; SameSite=Lax",
  );
  res.status(200).json({ ok: true });
}

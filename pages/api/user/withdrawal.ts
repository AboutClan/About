import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { withdrawal } from "../../../libs/backend/oauthUtils";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const token = await getToken({ req, secret });

  if (!token) {
    res.status(401).end();
  }

  switch (method) {
    case "DELETE":
      await withdrawal(token.accessToken as string);
      res.status(204).end();
      break;
    default:
      res.status(400).end();
      break;
  }
}

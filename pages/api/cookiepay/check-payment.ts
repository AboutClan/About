import type { NextApiRequest, NextApiResponse } from "next";

import { getCookiepayOrder } from "../../../libs/cookiepayOrderClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "GET only" });

  const orderNo = String(req.query.orderNo ?? "");
  if (!orderNo) return res.status(400).json({ error: "orderNo required" });

  const order = await getCookiepayOrder(orderNo);
  if (!order) return res.status(404).json({ error: "not found" });

  return res.status(200).json({
    status: order.status,
    orderNo,
    amount: order.amount,
  });
}

import type { NextApiRequest, NextApiResponse } from "next";

import { findPayment } from "../../../libs/paymentStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "GET only" });

  const orderNo = String(req.query.orderNo ?? "");
  if (!orderNo) return res.status(400).json({ error: "orderNo required" });

  const payment = findPayment(orderNo);
  if (!payment) return res.status(404).json({ error: "not found" });

  return res.status(200).json({
    status: payment.status,
    orderNo: payment.orderNo,
    amount: payment.amount,
  });
}

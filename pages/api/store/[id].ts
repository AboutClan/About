import { NextApiRequest, NextApiResponse } from "next";
import { BadRequestError } from "../../../libs/backend/custom-error";
import dbConnect from "../../../libs/backend/dbConnect";
import { GiftModel } from "../../../models/gift";

export default async function getGift(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    const { id } = req.query;

    const giftUsers = await GiftModel.find({ giftId: id }).select(
      "-_id -createdAt -updatedAt -__v",
    );
    if (!giftUsers) {
      throw new BadRequestError("정보에 해당하는 유저가 존재하지 않습니다.");
    }

    res.status(200).json({ users: giftUsers });
  }
}

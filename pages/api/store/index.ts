import { NextApiRequest, NextApiResponse } from "next";
import { BadRequestError } from "../../../libs/backend/custom-error";
import dbConnect from "../../../libs/backend/dbConnect";
import { GiftModel } from "../../../models/gift";

export default async function giftController(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "POST") {
    const { name, uid, cnt, giftId } = req.body;

    const existingUser = await GiftModel.findOne({ uid, giftId });

    if (existingUser) {
      const user = await GiftModel.findOneAndUpdate(
        { uid },
        { name, uid, cnt: existingUser.cnt + cnt, giftId },
        { new: true, runValidators: true },
      );
      if (!user) {
        throw new BadRequestError("정보에 해당하는 유저가 존재하지 않습니다.");
      }

      const resUser = {
        name: user.name,
        uid: user.uid,
        cnt: user.cnt,
        giftId: user.giftId,
      };

      return res.status(200).json({ user: resUser });
    }
    const newUser = await GiftModel.create({ name, uid, cnt, giftId });
    const user = {
      name: newUser.name,
      uid: newUser.uid,
      cnt: newUser.cnt,
      giftId: newUser.giftId,
    };
    res.status(200).json({ user });
  }
  if (req.method === "GET") {
    const giftUsers = await GiftModel.find({})
      .sort("createdAt")
      .select("-_id -createdAt -updatedAt -__v");

    res.status(200).json({
      users: giftUsers,
    });
  }
}

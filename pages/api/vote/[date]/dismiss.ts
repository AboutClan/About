import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { strToDate } from "../../../../helpers/dateHelpers";
import dbConnect from "../../../../libs/backend/dbConnect";

import { findOneVote } from "../../../../services/voteService";
import { IAbsence, IVote } from "../../../../types/study/study";
import { IUser } from "../../../../types/user/user";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IVote>
) {
  const { method } = req;
  const dateStr = req.query.date as string;
  const date = strToDate(dateStr).toDate();

  const token = await getToken({ req, secret });

  await dbConnect();

  const vote = await findOneVote(date);
  if (!vote) return res.status(500).end();

  switch (method) {
    case "PATCH":
      vote.participations.forEach((participation) => {
        const isTargetParticipation = !!participation.attendences.find(
          (att) => (att.user as IUser)?.uid.toString() === token.uid.toString()
        );
        if (isTargetParticipation) {
          participation.attendences = participation.attendences.filter(
            (att) =>
              (att.user as IUser)?.uid.toString() !== token.uid.toString()
          );
          participation.absences = [
            ...participation.absences,
            { user: token._id, noShow: false, message: "" } as IAbsence,
          ];
        }
      });

      await vote.save();
      return res.status(204).end();
    default:
      return res.status(400).end();
  }
}

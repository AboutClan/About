import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbConnect from "../../../../libs/dbConnect";
import { strToDate } from "../../../../libs/utils/dateUtils";

import { findOneVote } from "../../../../services/voteService";
import { IAbsence, IVote } from "../../../../types/studyDetails";
import { IUser } from "../../../../types/user";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IVote>
) {
  const { method } = req;
  const dateStr = req.query.date as string;
  const date = strToDate(dateStr).toDate();
  console.log(55, date);
  const token = await getToken({ req, secret });

  await dbConnect();

  const vote = await findOneVote(date);
  if (!vote) return res.status(500).end();

  switch (method) {
    case "PATCH":
      vote.participations.forEach((participation) => {
        console.log(participation.attendences[0], token.uid);
        const isTargetParticipation = !!participation.attendences.find(
          (att) => (att.user as IUser)?.uid.toString() === token.uid.toString()
        );
        if (isTargetParticipation) {
          console.log(2);
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

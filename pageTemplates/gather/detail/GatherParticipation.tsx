import { Flex } from "@chakra-ui/react";

import ParticipationBar from "../../../components/atoms/bars/ParticipationBar";
import { IProfileCommentCard } from "../../../components/molecules/cards/ProfileCommentCard";
import SocialingScoreBadge from "../../../components/molecules/SocialingScoreBadge";
import ProfileCardColumn from "../../../components/organisms/ProfileCardColumn";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import {
  IUser,
  IUserSummary,
  UserSimpleInfoProps,
} from "../../../types/models/userTypes/userInfoTypes";

interface IGatherParticipation {
  data: IGather;
}

function GatherParticipation({ data }: IGatherParticipation) {
  const status = data.status;
  const participantsCnt = data.participants.length;
  console.log(data);
  const organizerCard = {
    user: data?.user as IUser,
    memo: (data?.user as IUser).comment,
    rightComponent: <SocialingScoreBadge user={data?.user as UserSimpleInfoProps} size="sm" />,
    crownType: "main" as const,
  };

  const userCardArr: IProfileCommentCard[] = (data?.participants ? [...data.participants] : []).map(
    (par) => ({
      user: par.user,
      memo: par.user.comment,
      rightComponent: <SocialingScoreBadge user={par?.user as IUserSummary} size="sm" />,
    }),
  );

  const isAdminOpen = (data?.user as IUser)?._id === "65df1ddcd73ecfd250b42c89";

  return (
    <>
      <Flex flexDir="column" px={5}>
        <ParticipationBar
          type={status as "open" | "pending"}
          participantsCnt={participantsCnt + (isAdminOpen ? 0 : 1)}
          maxCnt={data?.memberCnt.max}
        />
        <ProfileCardColumn
          hasCommentButton={false}
          userCardArr={[...(!isAdminOpen ? [organizerCard] : []), ...userCardArr]}
        />
      </Flex>
    </>
  );
}

export default GatherParticipation;

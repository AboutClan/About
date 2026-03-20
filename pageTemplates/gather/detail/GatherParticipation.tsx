import { Flex } from "@chakra-ui/react";

import ParticipationBar from "../../../components/atoms/bars/ParticipationBar";
import { IProfileCommentCard } from "../../../components/molecules/cards/ProfileCommentCard";
import SocialingScoreBadge from "../../../components/molecules/SocialingScoreBadge";
import ProfileCardColumn from "../../../components/organisms/ProfileCardColumn";
import { SECRET_USER_SUMMARY } from "../../../constants/serviceConstants/userConstants";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import {
  IUser,
  IUserSummary,
  UserSimpleInfoProps,
} from "../../../types/models/userTypes/userInfoTypes";

interface IGatherParticipation {
  data: IGather;
  isOpenGather: boolean;
}

function GatherParticipation({ data, isOpenGather }: IGatherParticipation) {
  const status = data.status;
  const participantsCnt = data.participants.length;

  const organizerCard = {
    user: isOpenGather ? SECRET_USER_SUMMARY : (data?.user as IUser),
    memo: isOpenGather ? "익명 참여자" : (data?.user as IUser).comment,
    rightComponent: <SocialingScoreBadge user={data?.user as UserSimpleInfoProps} size="sm" />,
    crownType: "main" as const,
  };

  const userCardArr: IProfileCommentCard[] = (data?.participants ? [...data.participants] : []).map(
    (par, idx) => ({
      user: isOpenGather ? SECRET_USER_SUMMARY : par.user,
      memo: isOpenGather ? `익명 신청자 ${idx + 1}` : par.user.comment,
      rightComponent: isOpenGather ? null : (
        <SocialingScoreBadge user={par?.user as IUserSummary} size="sm" />
      ),
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

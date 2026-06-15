import { Flex } from "@chakra-ui/react";

import ParticipationBar from "../../../components/atoms/bars/ParticipationBar";
import { IProfileCommentCard } from "../../../components/molecules/cards/ProfileCommentCard";
import SocialingScoreBadge from "../../../components/molecules/SocialingScoreBadge";
import ProfileCardColumn from "../../../components/organisms/ProfileCardColumn";
import { SECRET_USER_SUMMARY } from "../../../constants/serviceConstants/userConstants";
import { useUserInfo } from "../../../hooks/custom/UserHooks";
import { GatherCategory, IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUser, UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";

interface IGatherParticipation {
  data: IGather;
  gatherType: GatherCategory;
}

function GatherParticipation({ data, gatherType }: IGatherParticipation) {
  const userInfo = useUserInfo();
  const status = data.status;
  const participantsCnt = data.participants.length;

  const isMyGather = data.participants?.some((p) => p.user._id === userInfo?._id);

  const isSecret = gatherType === "openGather" || (gatherType === "secretGather" && !isMyGather);

  const organizerCard = {
    user: isSecret ? SECRET_USER_SUMMARY : (data?.user as IUser),
    memo: isSecret ? "익명 참여자" : (data?.user as IUser).comment,
    rightComponent: <SocialingScoreBadge user={data?.user as UserSimpleInfoProps} size="sm" />,
    crownType: "main" as const,
  };

  const userCardArr: IProfileCommentCard[] = (data?.participants ? [...data.participants] : []).map(
    (par, idx) => ({
      user: isSecret ? (SECRET_USER_SUMMARY as UserSimpleInfoProps) : par.user,
      memo:
        gatherType === "openGather"
          ? `익명 신청자 ${idx + 1}`
          : gatherType === "secretGather" && !isMyGather
          ? `익명 참여자 ${idx + 1}`
          : par.user.comment,
      rightComponent: isSecret ? null : (
        <SocialingScoreBadge user={par?.user as UserSimpleInfoProps} size="sm" />
      ),
    }),
  );

  const isAdminOpen =
    (data?.user as IUser)?._id === "65df1ddcd73ecfd250b42c89" && data?.memberCnt?.max !== 1;

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

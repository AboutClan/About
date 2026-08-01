import { Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import ParticipationBar from "../../../components/atoms/bars/ParticipationBar";
import { IProfileCommentCard } from "../../../components/molecules/cards/ProfileCommentCard";
import SocialingScoreBadge from "../../../components/molecules/SocialingScoreBadge";
import ProfileCardColumn from "../../../components/organisms/ProfileCardColumn";
import { SECRET_USER_SUMMARY } from "../../../constants/serviceConstants/userConstants";
import { useUserInfo } from "../../../hooks/custom/UserHooks";
import {
  GatherCategory,
  IGather,
  IGatherParticipants,
} from "../../../types/models/gatherTypes/gatherTypes";
import { IUser, UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { birthToAge } from "../../../utils/convertUtils/convertTypes";
import GatherDateParticipationChart, {
  IGatherDateParticipationStat,
} from "./GatherDateParticipationChart";

interface IGatherParticipation {
  data: IGather;
  gatherType: GatherCategory;
}

function GatherParticipation({ data, gatherType }: IGatherParticipation) {
  const userInfo = useUserInfo();
  const status = data.status;
  const participantsCnt = data.participants.length;
  console.log(5, data);
  const isMyGather = data.participants?.some((p) => p.user._id === userInfo?._id);

  const isSecret = gatherType === "openGather" || (gatherType === "secretGather" && !isMyGather);

  const findVoterUser = (voter: UserSimpleInfoProps | string) => {
    if (typeof voter !== "string" && (voter as IUser)?.gender) return voter as IUser;
    const voterId = typeof voter === "string" ? voter : voter?.uid || voter?._id;
    return data.participants.find((p) => {
      const u = p.user as UserSimpleInfoProps;
      return u?.uid === voterId || u?._id === voterId;
    })?.user as IUser | undefined;
  };

  const getSelectedDatesText = (par: IGatherParticipants) => {
    const user = par.user as UserSimpleInfoProps;
    const votedDates = (data.dateOptions || []).filter((option) =>
      option.voters?.some((voter) =>
        typeof voter === "string"
          ? voter === user?.uid || voter === user?._id
          : voter?.uid === user?.uid || voter?._id === user?._id,
      ),
    );
    return votedDates.map((option) => dayjs(option.date).format("M월 D일(ddd)")).join(", ");
  };

  const dateParticipationStats: IGatherDateParticipationStat[] =
    gatherType === "openGather"
      ? (data.dateOptions || []).map((option) => {
          let male = 0;
          let female = 0;
          (option.voters || []).forEach((voter) => {
            const gender = findVoterUser(voter)?.gender;
            if (gender === "남성") male++;
            else if (gender === "여성") female++;
          });
          return { date: option.date, male, female };
        })
      : [];

  const getOpenGatherMemo = (par: IGatherParticipants) => {
    const user = par.user as IUser;
    const age = birthToAge(user?.birth);
    return [user?.gender, age ? `${age}세` : null, getSelectedDatesText(par) || "날짜 미정"]
      .filter(Boolean)
      .join(" · ");
  };

  const organizerCard = {
    user: isSecret ? SECRET_USER_SUMMARY : (data?.user as IUser),
    memo: isSecret ? "익명 참여자" : (data?.user as IUser).comment,
    rightComponent: <SocialingScoreBadge user={data?.user as UserSimpleInfoProps} size="sm" />,
    crownType: "main" as const,
  };

  const userCardArr: IProfileCommentCard[] = (data?.participants ? [...data.participants] : []).flatMap(
    (par, idx) => {
      const card: IProfileCommentCard = {
        user: isSecret ? (SECRET_USER_SUMMARY as UserSimpleInfoProps) : par.user,
        memo:
          gatherType === "openGather"
            ? getOpenGatherMemo(par)
            : gatherType === "secretGather" && !isMyGather
            ? `익명 참여자 ${idx + 1}`
            : par.user.comment,
        rightComponent: isSecret ? null : (
          <SocialingScoreBadge user={par?.user as UserSimpleInfoProps} size="sm" />
        ),
      };
      return par.withCompanion ? [card, card] : [card];
    },
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
      {gatherType === "openGather" && !!dateParticipationStats.length && (
        <GatherDateParticipationChart stats={dateParticipationStats} minRequired={5} />
      )}
    </>
  );
}

export default GatherParticipation;

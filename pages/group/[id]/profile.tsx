import { Badge, Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useMemo } from "react";

import Avatar from "../../../components/atoms/Avatar";
import UserBadge from "../../../components/atoms/badges/UserBadge";
import { MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import {
  getTemperature,
  getTemperatureColor,
} from "../../../components/molecules/SocialingScoreBadge";
import { useGatherGroupQuery } from "../../../hooks/gather/queries";
import { useGroupIdQuery, useGroupsMemberActivityQuery } from "../../../hooks/groupStudy/queries";
import { GroupParicipantProps } from "../../../types/models/groupTypes/group";
import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

const MEMBER_ROLE_KR: Record<string, string> = {
  admin: "소모임장",
  manager: "운영진",
  regularMember: "정규 멤버",
  member: "임시 멤버",
};

const ROLE_RANK: Record<string, number> = { admin: 0, manager: 1, regularMember: 2, member: 3 };

function GroupProfilePage() {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const { data: group } = useGroupIdQuery(id, { enabled: !!id });
  const { data: activityData } = useGroupsMemberActivityQuery(id, "last", { enabled: !!id });
  const { data: gathers } = useGatherGroupQuery(id, { enabled: !!id });

  const lastParticipationMap = useMemo(() => {
    const map: Record<string, string> = {};
    gathers?.forEach((gather) => {
      gather.participants?.forEach((par) => {
        const user = par.user as UserSimpleInfoProps;
        const key = user?._id || user?.uid;
        if (!key) return;
        if (!map[key] || dayjs(gather.date).isAfter(dayjs(map[key]))) {
          map[key] = gather.date;
        }
      });
    });
    return map;
  }, [gathers]);

  const members = group
    ? [...group.participants].sort((a, b) => (ROLE_RANK[a.role] ?? 3) - (ROLE_RANK[b.role] ?? 3))
    : [];

  return (
    <>
      <Header title="멤버 프로필" />
      <Slide isNoPadding>
        {!group ? (
          <MainLoadingAbsolute />
        ) : (
          <Box px={5} py={4}>
            <Box fontSize="16px" fontWeight="bold" color="gray.800" mb={1}>
              {group.title}
            </Box>
            <Box fontSize="12px" color="gray.500" mb={5}>
              총 {members.length}명
            </Box>
            <Flex flexDir="column">
              {members.map((member, idx) => (
                <GroupMemberProfileRow
                  key={member.user?._id || idx}
                  participant={member}
                  lastParticipationDate={
                    lastParticipationMap[member.user?._id] || lastParticipationMap[member.user?.uid]
                  }
                  totalGatherCount={
                    activityData?.find((who) => who.user === member.user?._id)?.totalGatherCount
                  }
                />
              ))}
            </Flex>
            <Box h={8} />
          </Box>
        )}
      </Slide>
    </>
  );
}

export default GroupProfilePage;

function GroupMemberProfileRow({
  participant,
  lastParticipationDate,
  totalGatherCount,
}: {
  participant: GroupParicipantProps;
  lastParticipationDate?: string;
  totalGatherCount?: number;
}) {
  const user = participant.user;
  const roleKr = MEMBER_ROLE_KR[participant.role] ?? participant.role ?? "-";
  const registerDate = participant.registerDate
    ? dayjsToFormat(dayjs(participant.registerDate), "YY.MM.DD")
    : "-";
  const lastDateText = lastParticipationDate
    ? dayjsToFormat(dayjs(lastParticipationDate), "YY.MM.DD")
    : "-";
  const temperature = getTemperature(user);
  const { color: tempColor } = getTemperatureColor(
    user?.temperature?.temperature,
    Math.round(user?.temperature?.cnt),
  );

  return (
    <Flex align="center" py={2} borderBottom="1px solid" borderColor="gray.100">
      <Badge
        h="18px"
        w="44px"
        flexShrink={0}
        textAlign="center"
        variant="subtle"
        px={1}
        lineHeight="18px"
        fontWeight="semibold"
        fontSize="9px"
        borderRadius="9px"
        colorScheme={
          participant.role === "admin"
            ? "yellow"
            : participant.role === "manager"
            ? "purple"
            : participant.role === "regularMember"
            ? "blue"
            : "gray"
        }
      >
        {roleKr}
      </Badge>
      <Box ml={2}>
        <Avatar user={user} size="sm1" isLink={false} />
      </Box>
      <Flex direction="column" ml={2.5} flex={1} minW={0}>
        <Flex align="center" gap={1} mb={0.5}>
          <Box fontSize="13px" fontWeight="bold" color="gray.800" noOfLines={1}>
            {user?.name}
          </Box>
          <UserBadge badgeIdx={user?.badge?.badgeIdx} />
        </Flex>
        <Flex fontSize="10.5px" color="gray.500" align="center" gap={1} wrap="wrap">
          <Box whiteSpace="nowrap">가입 {registerDate}</Box>
          <Box color="gray.300">·</Box>
          <Box whiteSpace="nowrap">누적 {totalGatherCount ?? 0}회</Box>
          <Box color="gray.300">·</Box>
          <Box whiteSpace="nowrap">최근 {lastDateText}</Box>
        </Flex>
      </Flex>
      <Box ml={2} flexShrink={0} fontSize="11px" fontWeight={700} color={tempColor}>
        {temperature}
      </Box>
    </Flex>
  );
}

import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../pages/api/auth/[...nextauth]";

const GROUP_SUPER_ADMIN_UIDS = ["2259633694"];
const GROUP_ADMIN_ROLES = ["admin", "manager"];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const id = context.params?.id;
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

  try {
    const res = await fetch(`${SERVER_URI}/groupStudy?groupStudyId=${id}`);
    if (res.ok) {
      const group = await res.json();
      const myParticipant = group?.participants?.find(
        (p: { user: { _id: string }; role: string }) => p.user?._id === session.user.id,
      );
      const isGroupAdmin = myParticipant && GROUP_ADMIN_ROLES.includes(myParticipant.role);
      const isSuperAdmin = GROUP_SUPER_ADMIN_UIDS.includes(session.user.uid);

      if (!isGroupAdmin && !isSuperAdmin) {
        return { redirect: { destination: "/home", permanent: false } };
      }
    }
  } catch {}

  return { props: {} };
};

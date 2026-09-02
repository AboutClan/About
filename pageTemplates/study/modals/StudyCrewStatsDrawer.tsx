import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import Avatar from "../../../components/atoms/Avatar";
import { MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import { useStudyCrewStatsQuery } from "../../../hooks/study/queries";
import { StudyParticipationProps } from "../../../types/models/studyTypes/study-entity.types";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

interface StudyCrewStatsDrawerProps {
  crewMembers: StudyParticipationProps[];
  onClose: () => void;
}

const formatStatDate = (date: string | null) =>
  date ? dayjsToFormat(dayjs(date).locale("ko"), "M월 D일(ddd)") : "기록 없음";

function StudyCrewStatsDrawer({ crewMembers, onClose }: StudyCrewStatsDrawerProps) {
  const userIds = crewMembers.map((member) => member.user._id).filter(Boolean);

  const { data: statsArr, isLoading } = useStudyCrewStatsQuery(userIds, {
    enabled: !!userIds.length,
  });

  const rows = crewMembers
    .map((member) => {
      const stat = statsArr?.find((s) => s.userId === member.user._id);
      return {
        user: member.user,
        lastVoteDate: stat?.lastVoteDate ?? null,
        lastParticipationDate: stat?.lastParticipationDate ?? null,
        voteCount: stat?.voteCount ?? 0,
        participationCount: stat?.participationCount ?? 0,
      };
    })
    .sort((a, b) => b.participationCount - a.participationCount || b.voteCount - a.voteCount);

  return (
    <RightDrawer title="스터디 크루 상세 통계" onClose={onClose}>
      <Box mb={3} fontSize="12px" color="gray.500">
        최근 한달 기준 통계예요.
      </Box>
      {isLoading ? (
        <Box pos="relative" minH="200px">
          <MainLoadingAbsolute size="sm" />
        </Box>
      ) : (
        <Flex direction="column">
          {rows.map((row) => (
            <Flex key={row.user._id} align="center" py={3} borderBottom="var(--border)" gap={3}>
              <Avatar user={row.user} size="sm1" isLink={false} />
              <Flex direction="column" flex={1} gap={1}>
                <Box fontSize="13px" fontWeight="semibold" color="gray.800">
                  {row.user.name || "익명"}
                </Box>
                <Flex fontSize="11px" color="gray.500" gap={2} wrap="wrap">
                  <Box>최근 투표일: {formatStatDate(row.lastVoteDate)}</Box>
                  <Box>최근 참여일: {formatStatDate(row.lastParticipationDate)}</Box>
                </Flex>
              </Flex>
              <Flex direction="column" align="flex-end" fontSize="11px" color="gray.600">
                <Box>
                  투표{" "}
                  <Box as="span" fontWeight="bold" color="gray.800">
                    {row.voteCount}
                  </Box>
                  회
                </Box>
                <Box>
                  참여{" "}
                  <Box as="span" fontWeight="bold" color="mint">
                    {row.participationCount}
                  </Box>
                  회
                </Box>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </RightDrawer>
  );
}

export default StudyCrewStatsDrawer;

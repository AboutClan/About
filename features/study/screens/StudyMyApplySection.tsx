import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMemo } from "react";

import { StudyWeekSetProps } from "@/types/models/studyTypes/study-set.types";
import { dayjsToFormat } from "@/utils/dateTimeUtils";

interface StudyMyApplySectionProps {
  studySet: StudyWeekSetProps;
  myId: string;
  onEdit: () => void;
}

/**
 * 대기 중인 내 신청 요약. `vote2/mine`은 확정된 결과만 주므로
 * 주간 응답의 participations에서 내 것을 뽑아 쓴다.
 */
function StudyMyApplySection({ studySet, myId, onEdit }: StudyMyApplySectionProps) {
  const myApply = useMemo(() => {
    if (!studySet?.participations || !myId) return null;

    const mine = studySet.participations
      .map((participation) => ({
        date: participation.date,
        study: participation.study.find((s) => s.user._id === myId),
      }))
      .filter((entry) => !!entry.study);

    if (!mine.length) return null;

    return {
      dates: mine.map((entry) => entry.date),
      times: mine[0].study.times,
      address: mine[0].study.location?.address,
    };
  }, [studySet?.participations, myId]);

  if (!myApply) return null;

  const dateText = myApply.dates.map((date) => dayjsToFormat(dayjs(date), "M/D(ddd)")).join(", ");

  const timeText =
    myApply.times?.start && myApply.times?.end
      ? `${dayjsToFormat(dayjs(myApply.times.start), "HH:mm")} - ${dayjsToFormat(
          dayjs(myApply.times.end),
          "HH:mm",
        )}`
      : null;

  return (
    <Box p={4} borderRadius="14px" border="1px solid" borderColor="mint.100" bg="mint.50">
      <Flex justify="space-between" align="center" mb={2}>
        <Box fontSize="14px" fontWeight={700} color="gray.800">
          신청한 스터디
        </Box>
        <Button size="xs" variant="outline" borderRadius="full" bg="white" onClick={onEdit}>
          수정
        </Button>
      </Flex>

      <Flex direction="column" gap={1} fontSize="12.5px" color="gray.700">
        <Flex>
          <Box w="52px" flexShrink={0} color="gray.500">
            날짜
          </Box>
          <Box fontWeight={600}>{dateText}</Box>
        </Flex>
        {timeText && (
          <Flex>
            <Box w="52px" flexShrink={0} color="gray.500">
              시간
            </Box>
            <Box fontWeight={600}>{timeText}</Box>
          </Flex>
        )}
        {myApply.address && (
          <Flex>
            <Box w="52px" flexShrink={0} color="gray.500">
              기준 위치
            </Box>
            <Box fontWeight={600} isTruncated>
              {myApply.address}
            </Box>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

export default StudyMyApplySection;

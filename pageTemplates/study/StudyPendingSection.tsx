import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { StudySetProps } from "../../types/models/studyTypes/study-set.types";
import { getTodayStr } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";

interface StudyPendingSectionProps {
  studySet: StudySetProps;
  crewMemberIds?: string[] | null;
}

function StudyPendingSection({ studySet, crewMemberIds }: StudyPendingSectionProps) {
  const userInfo = useUserInfo();

  const thumbnailCardInfoArr: StudyThumbnailCardProps[] = studySet?.results
    ?.filter((result) => result?.study.status === "expected")
    ?.filter((result) => {
      if (!crewMemberIds) return true;
      const crewMemberCnt = result.study.members.filter((member) =>
        crewMemberIds.includes(member.user._id),
      ).length;
      return crewMemberCnt >= 3;
    })
    ?.map((data, idx) => {
      const study = data.study;
      const placeInfo = study.place;
      const textArr = placeInfo.location?.address.split(" ");

      return {
        place: {
          name: placeInfo.location.name,
          branch: textArr?.[0] + " " + textArr?.[1],
          address: placeInfo.location?.address,
          date: dayjs(data.date),
          imageProps: {
            image: placeInfo.image || getRandomImage(GATHER_MAIN_IMAGE_ARR["스터디"]),

            isPriority: idx < 4,
          },
          _id: placeInfo._id,
        },
        participants: study.members.map((att) => att.user),
        url: `/study/${placeInfo._id}/${data.date}?type=results`,
        studyType: "results",
        isMyStudy: study.members.map((member) => member.user._id).includes(userInfo?._id),
        isFutureDate: dayjs(data.date).hour(9).isAfter(dayjs()),
        dateStatus: dayjs(data.date).hour(9).isAfter(dayjs())
        ? "future"
        : data.date == getTodayStr()
        ? "current"
        : "prev",
      };
    });

  if (crewMemberIds && studySet && !thumbnailCardInfoArr?.length) return null;

  return (
    <Box mt={4} mb={2}>
      <Box mb={2} fontSize="16px" fontWeight="semibold">
        오픈 예정 스터디
      </Box>
      {thumbnailCardInfoArr?.length ? (
        <Flex
          overflowX="auto"
          gap={3}
          pb={1}
          sx={{
            "::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {thumbnailCardInfoArr.map((thumbnailCardInfo, idx) => (
            <Box
              key={idx}
              flex="0 0 auto"
              w="76.9%"
              p={3}
              border="var(--border)"
              borderRadius="12px"
            >
              <StudyThumbnailCard {...thumbnailCardInfo} hasBorder={false} isCompact />
            </Box>
          ))}
        </Flex>
      ) : !studySet ? (
        <Flex overflowX="hidden" gap={3}>
          {[1, 2].map((idx) => (
            <Box key={idx} flex="0 0 auto" w="76.9%">
              <StudyThumbnailCardSkeleton />
            </Box>
          ))}
        </Flex>
      ) : null}
    </Box>
  );
}

export default StudyPendingSection;

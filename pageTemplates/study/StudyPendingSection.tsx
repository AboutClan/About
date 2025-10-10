import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { StudySetProps } from "../../types/models/studyTypes/study-set.types";
import { getRandomImage } from "../../utils/imageUtils";

interface StudyPendingSectionProps {
  studySet: StudySetProps;
}

function StudyPendingSection({ studySet }: StudyPendingSectionProps) {
  const userInfo = useUserInfo();

  const [isOpen, setIsOpen] = useState(false);

  const thumbnailCardInfoArr: StudyThumbnailCardProps[] = studySet?.results
    ?.filter((result) => result?.study.status === "expected")
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
      };
    });

  return (
    <Box mt={5}>
      <Box fontSize="18px" mb={4} fontWeight="bold">
        매칭 예정 스터디
      </Box>
      {thumbnailCardInfoArr?.length
        ? (isOpen ? thumbnailCardInfoArr : thumbnailCardInfoArr.slice(0, 3)).map(
            (thumbnailCardInfo, idx) => (
              <Box key={idx} mb={3}>
                <StudyThumbnailCard {...thumbnailCardInfo} />
              </Box>
            ),
          )
        : [1, 2, 3].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)}

      {!isOpen && (
        <Button
          w="100%"
          h="40px"
          bgColor="white"
          border="0.5px solid #E8E8E8"
          onClick={() => setIsOpen(true)}
        >
          더보기
        </Button>
      )}
    </Box>
  );
}

export default StudyPendingSection;

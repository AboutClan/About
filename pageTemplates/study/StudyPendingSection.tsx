import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { StudySetProps } from "../../types/models/studyTypes/study-set.types";

interface StudyPendingSectionProps {
  studySet: StudySetProps;
}

function StudyPendingSection({ studySet }: StudyPendingSectionProps) {
  const userInfo = useUserInfo();

  const [isOpen, setIsOpen] = useState(false);
  console.log(15, studySet);
  const thumbnailCardInfoArr: StudyThumbnailCardProps[] = studySet?.results?.map((data, idx) => {
    const study = data.study;
    const placeInfo = study.place;
    const address =
      idx === 0 ? "서울특별시 강남구 역삼동 827-13 1층" : "서울특별시 동작구 사당동 147-50";
    const textArr = address.split(" ");

    return {
      place: {
        name: idx === 0 ? "셀렉티드닉스" : "세녹",
        branch: textArr?.[0] + " " + textArr?.[1],
        address,
        date: dayjs(idx === 0 ? "2025-10-16" : "2025-10-16"),
        imageProps: {
          image:
            idx === 0
              ? "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240906_186%2F1725619575624GCybh_JPEG%2FKakaoTalk_20240810_142920660.jpg"
              : "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200315_135%2F1584260753270EEzws_JPEG%2FgYm2lzhM39N041f1aia0X1Tz.JPG.jpg",

          isPriority: idx < 4,
        },
        _id: placeInfo._id,
      },
      participants:
        idx === 0
          ? studySet?.participations?.[0]?.study?.map((par) => par?.user)?.slice(0, 8)
          : studySet?.participations?.[0]?.study
              ?.reverse()
              ?.map((par) => par?.user)
              ?.slice(0, 6),
      url: `/study/${placeInfo._id}/${data.date}?type=results`,
      studyType: "results",
      isMyStudy: study.members.map((member) => member.user._id).includes(userInfo?._id),
      isFutureDate: dayjs(data.date).hour(9).isAfter(dayjs()),
    };
  });

  return (
    <Box mt={5}>
      <Box fontSize="18px" mb={4} fontWeight="bold">
        내일 예정된 스터디
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

      {true && (
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

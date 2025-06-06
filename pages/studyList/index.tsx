import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import { useUserCurrentLocation } from "../../hooks/custom/CurrentLocationHook";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { convertStudyToMergeStudy } from "../../libs/study/studyConverters";
import {
  setStudyThumbnailCard,
  sortThumbnailCardInfoArr,
} from "../../libs/study/thumbnailCardLibs";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

export default function StudyList() {
  const { data: session } = useSession();
  const { currentLocation } = useUserCurrentLocation();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const { data: studyVoteData } = useStudyVoteQuery(date, {
    enabled: !!date,
  });

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();

  useEffect(() => {
    if (!studyVoteData) {
      setThumbnailCardinfoArr(null);
      return;
    }
    const getThumbnailCardInfoArr = setStudyThumbnailCard(
      date,
      studyVoteData?.participations,
      convertStudyToMergeStudy(studyVoteData),
      studyVoteData?.realTimes?.userList,
      currentLocation,
      null,
      session?.user.id,
    );

    setThumbnailCardinfoArr(
      sortThumbnailCardInfoArr("인원순", getThumbnailCardInfoArr, session?.user.id),
    );
  }, [studyVoteData, currentLocation, session]);

  return (
    <>
      <Header title={dayjsToFormat(dayjs(date), "M월 D일 스터디")} />

      <Slide>
        <Box mt={3}>
          {thumbnailCardInfoArr?.map((thumbnailCardInfo, idx) => (
            <Box mb={3} key={idx}>
              <StudyThumbnailCard {...thumbnailCardInfo} />
            </Box>
          ))}
        </Box>
      </Slide>
    </>
  );
}

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
import { useStudySetQuery } from "../../hooks/custom/StudyHooks";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import {
  setStudyThumbnailCard,
  sortThumbnailCardInfoArr,
} from "../../libs/study/thumbnailCardLibs";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";

export default function StudyList() {
  const { data: session } = useSession();
  const { currentLocation } = useUserCurrentLocation();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const todayStart = dayjs().startOf("day");
  const dateStart = date ? dayjs(date).startOf("day") : null;

  const isPassedDate = !!dateStart && dateStart.isBefore(todayStart);

  const { data: studyVoteData } = useStudyVoteQuery(date, {
    enabled: !!date,
  });

  const { studySet } = useStudySetQuery(date, !!date && !isPassedDate);

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();

  useEffect(() => {
    if (!studySet) {
      setThumbnailCardinfoArr(null);
      return;
    }
    const getThumbnailCardInfoArr = setStudyThumbnailCard(
      date,
      studySet,
      date === dayjsToStr(dayjs()) ? session?.user.id : null,
    );

    setThumbnailCardinfoArr(
      sortThumbnailCardInfoArr("인원순", getThumbnailCardInfoArr, session?.user.id),
    );
  }, [studySet, currentLocation, session]);

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

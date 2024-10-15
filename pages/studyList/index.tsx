import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { StudyThumbnailCard } from "../../components/molecules/cards/StudyThumbnailCard";
import { useCurrentLocation } from "../../hooks/custom/CurrentLocationHook";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { setStudyToThumbnailInfo } from "../../libs/study/setStudyToThumbnailInfo";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

export default function StudyList() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const location = searchParams.get("location") as LocationEn;
  const locationKr = convertLocationLangTo(location, "kr");

  const { currentLocation } = useCurrentLocation();
  const { data: studyVoteData } = useStudyVoteQuery(date, locationKr, {
    enabled: !!locationKr && !!date,
  });

  const participations = studyVoteData?.participations;

  const thumbnailCardInfoArr = setStudyToThumbnailInfo(participations, currentLocation, date);

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

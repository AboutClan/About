import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { PostThumbnailCard } from "../../components/molecules/cards/PostThumbnailCard";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { setStudyDataToCardCol } from "../../pageTemplates/home/study/StudyCardCol";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

export default function StudyList() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const location = searchParams.get("location") as LocationEn;
  const locationKr = convertLocationLangTo(location, "kr");

  const { data } = useStudyVoteQuery(date, locationKr, {
    enabled: !!locationKr && !!date,
  });

  const studyVoteOne = data?.participations;

  const cardArr =
    studyVoteOne && session && setStudyDataToCardCol(studyVoteOne, date, session.user.uid);

  return (
    <>
      <Header title={dayjsToFormat(dayjs(date), "M월 D일 스터디")} />

      <Slide isNoPadding>
        <Box px="16px">
          {cardArr &&
            cardArr.map((card, idx) => (
              <Box mt="12px" key={idx}>
                <PostThumbnailCard postThumbnailCardProps={card} />
              </Box>
            ))}
        </Box>
      </Slide>
    </>
  );
}

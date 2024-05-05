import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useRecoilValue } from "recoil";

import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { PostThumbnailCard } from "../../components/molecules/cards/PostThumbnailCard";
import { sortedStudyCardListState } from "../../recoils/studyRecoils";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

export default function StudyList() {
  const sortedStudyCardList = useRecoilValue(sortedStudyCardListState);
  const searchParams = useSearchParams();

  const date = searchParams.get("date");

  return (
    <>
      <Header title={dayjsToFormat(dayjs(date), "M월 D일 스터디")} />

      <Slide>
        <Box px="16px">
          {sortedStudyCardList?.map((card, idx) => (
            <Box mt="12px" key={idx}>
              <PostThumbnailCard postThumbnailCardProps={card} />
            </Box>
          ))}
        </Box>
      </Slide>
    </>
  );
}

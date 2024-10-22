import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { STUDY_MAIN_IMAGES } from "../../../assets/images/studyMain";
import ProgressBar from "../../../components/atoms/ProgressBar";
import Slide from "../../../components/layouts/PageSlide";
import { useStudyVoteQuery } from "../../../hooks/study/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { convertMergePlaceToPlace } from "../../../libs/study/convertMergePlaceToPlace";
import { getMyStudyInfo, getMyStudyParticipation } from "../../../libs/study/getMyStudyMethods";
import StudyHeader from "../../../pageTemplates/study/StudyHeader";
import { LocationEn } from "../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";
import { getRandomIdx } from "../../../utils/mathUtils";

function StudyResultPage() {
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");
  const locationParam = searchParams.get("location") as LocationEn;

  const { data: userInfo } = useUserInfoQuery();

  const { data: studyVoteData } = useStudyVoteQuery(
    dateParam,
    convertLocationLangTo(locationParam, "kr"),
    {
      enabled: !!dateParam && !!locationParam,
    },
  );

  const findMyStudyParticipation = getMyStudyParticipation(studyVoteData, userInfo?.uid);

  const myStudyInfo = getMyStudyInfo(findMyStudyParticipation, userInfo?.uid);
  console.log(23, myStudyInfo);
  const place = convertMergePlaceToPlace(findMyStudyParticipation?.place);
  const { name, address, coverImage, latitude, brand, longitude, time, type } = place || {};
  const members = findMyStudyParticipation?.members;
  //스터디 기본 이미지

  return (
    <>
      <StudyHeader brand="스터디 결과" />
      <Slide>
        {myStudyInfo && (
          <>
            <Box position="relative" w="full" aspectRatio={1 / 1}>
              <Image
                src={
                  myStudyInfo?.attendanceInfo?.attendanceImage ||
                  STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length)]
                }
                fill
                alt="studyRecordImage"
              />
            </Box>
            <Flex mt="30px" mb={4} justify="space-between">
              <Box>{dayjsToFormat(dayjs(dateParam), "M월 D일(ddd) 스터디")}</Box>
              <Box>출석</Box>
            </Flex>
            <Flex direction="column" p={3}>
              <Flex fontSize="11px" fontWeight="regular" justify="space-between">
                <Box color="gray.500">목표 시간</Box>
                <Box color="gray.800">9시간</Box>
              </Flex>
              <Box w="full" borderLeft="var(--border)" borderRight="var(--border)"></Box>
              <ProgressBar value={30} />
              <Flex fontSize="11px" fontWeight="regular" justify="space-between">
                <Box color="gray.500">목표 시간</Box>
                <Box color="gray.800">9시간</Box>
              </Flex>
            </Flex>
          </>
        )}
      </Slide>
    </>
  );
}

export default StudyResultPage;

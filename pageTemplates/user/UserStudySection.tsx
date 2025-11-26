import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import { GatherThumbnailCardProps } from "../../components/molecules/cards/GatherThumbnailCard";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { useStudyMineQuery } from "../../hooks/study/queries";
import { backUrlState } from "../../recoils/navigationRecoils";
import GatherSkeletonMain from "../gather/GatherSkeletonMain";

function UserStudySection() {
  const router = useRouter();
  const userInfo = useUserInfo();

  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>();

  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const setBackUrl = useSetRecoilState(backUrlState);

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();

  const { data } = useStudyMineQuery();
  console.log(1, data);

  useEffect(() => {
    if (!data?.length) return;

    const getThumbnailCardInfoArr = data.map((props) => {
      console.log(1214, props);
      const findStudy = props.results.find((result) =>
        result.members.some((member) => member.userId._id === "62a44519f4a6968c58fedb88"),
      );
      console.log(55, findStudy, props.results[0]);
      const place = findStudy?.placeId;
      const textArr = place.location?.address.split(" ");

      return {
        place: {
          name: place?.location?.name,
          branch: textArr?.[0] + " " + textArr?.[1],
          address: place?.location?.address,
          date: dayjs(props?.date),
          imageProps: {
            image: place?.image,
            isPriority: true,
          },
          _id: "",
        },
        participants: findStudy.members.map((userId) => userId.userId),
        url: `/study/${findStudy.placeId._id}/${props.date}?type=results`,
        studyType: "results",
        isMyStudy: false,
      };
    });
    setThumbnailCardinfoArr(getThumbnailCardInfoArr);
  }, [data, userInfo]);

  return (
    <>
      <Box mx={5} pb={10}>
        <Box position="relative" minH="1000px">
          {thumbnailCardInfoArr?.length ? (
            <>
              {thumbnailCardInfoArr?.map((thumbnailCardInfo, idx) => (
                <Box mb={3} key={idx}>
                  <StudyThumbnailCard {...thumbnailCardInfo} />
                </Box>
              ))}
            </>
          ) : isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <Box mb="12px" key={idx}>
                  <GatherSkeletonMain />
                </Box>
              ))}
            </>
          ) : (
            <Flex
              justify="center"
              align="center"
              fontSize="14px"
              fontWeight="medium"
              bg="gray.100"
              px={3}
              py={4}
              minH="114px"
              borderRadius="8px"
              color="gray.600"
              border="var(--border)"
            >
              현재 참여중인 모임이 없습니다.
            </Flex>
          )}
        </Box>
        <div ref={loader} />
        {isLoading && cardDataArr?.length ? (
          <Box position="relative" mt="32px">
            <MainLoadingAbsolute size="sm" />
          </Box>
        ) : undefined}
      </Box>
    </>
  );
}

export default UserStudySection;

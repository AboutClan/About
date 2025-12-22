import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { useStudyMineQuery } from "../../hooks/study/queries";
import { StudyType } from "../../types/models/studyTypes/study-set.types";
import { detectAppDevice, detectDevice2 } from "../../utils/validationUtils";
import GatherSkeletonMain from "../gather/GatherSkeletonMain";

function UserStudySection() {
  const userInfo = useUserInfo();
  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();

  const { data, isLoading } = useStudyMineQuery();

  const a = detectAppDevice();
  const b = detectDevice2();
  const toast = useToast();
  useEffect(() => {
    toast("success", a + b);
  }, [a, b]);

  useEffect(() => {
    if (!data?.length) return;

    const getThumbnailCardInfoArr = data.map((props) => {
      const findStudy = props.results.find((result) =>
        result.members.some((member) => member.userId._id === userInfo?._id),
      );

      const place = findStudy?.placeId;
      const textArr = place.location?.address.split(" ");
      const members = findStudy.members.map((userId) => userId.userId);
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
          _id: place?._id,
        },
        participants: members,
        url: `/study/${findStudy.placeId._id}/${props.date}?type=results`,
        studyType: "results" as StudyType,
        isMyStudy: false,
        hasReview: findStudy.reviewers.includes(userInfo?._id),
        hasAttend: !!findStudy?.members?.find((member) => member.userId._id === userInfo?._id)
          ?.arrived,
      };
    });
    setThumbnailCardinfoArr(getThumbnailCardInfoArr);
  }, [data, userInfo]);

  return (
    <>
      <Box pb={10}>
        <Box position="relative" minH="1000px">
          {thumbnailCardInfoArr?.length ? (
            <>
              {thumbnailCardInfoArr?.map((thumbnailCardInfo, idx) => (
                <Box mb={3} key={idx} mx={5}>
                  <StudyThumbnailCard {...thumbnailCardInfo} hasReviewBtn />
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
      </Box>
    </>
  );
}

export default UserStudySection;

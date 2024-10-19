import { Box, Flex } from "@chakra-ui/react";

import { IInfoCard } from "../../components/atoms/InfoCard";
import InfoCardColumn from "../../components/organisms/InfoCardColumn";
import { StudyParticipationProps } from "../../types/models/studyTypes/studyDetails";

interface StudyWaitingPlacesProps {
  studyWaitingPlaces: StudyParticipationProps[];
}

function StudyWaitingPlaces({ studyWaitingPlaces }: StudyWaitingPlacesProps) {
  const placeCardArr: IInfoCard[] = studyWaitingPlaces.map((par, idx) => {
    const place = par.place;

    return {
      image: place.image,
      name: place.brand,
      text: place.branch,
      leftComponent: (
        <Box w="28px" h="28px" color="var(--color-mint)">
          {idx < 8 ? (
            <i className={`fa-light fa-circle-${idx + 1} fa-2xl`} />
          ) : (
            <i className="fa-light fa-circle-minus fa-2xl" />
          )}
        </Box>
      ),
      rightComponent: (
        <Box fontSize="16px" color="var(--color-mint)">
          {par.members.length}명 신청중
        </Box>
      ),
    };
  });

  return (
    <>
      {placeCardArr.length ? (
        <InfoCardColumn placeCardArr={placeCardArr} isLink={false} />
      ) : (
        <Flex
          align="center"
          justify="center"
          h="200"
          color="var(--gray-600)"
          fontSize="16px"
          textAlign="center"
        >
          <Box as="p" lineHeight="1.8">
            현재 참여중인 멤버가 없습니다.
            <br />
            지금 신청하면{" "}
            <Box as="b" color="var(--color-mint)">
              10 POINT
            </Box>{" "}
            추가 획득!
          </Box>
        </Flex>
      )}
    </>
  );
}

export default StudyWaitingPlaces;

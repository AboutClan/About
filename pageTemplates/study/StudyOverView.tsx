import { Badge, Box } from "@chakra-ui/react";

import InfoBoxCol, { InfoBoxProps } from "../../components/molecules/InfoBoxCol";
import { STUDY_STATUS_TO_BADGE } from "../../constants/studyConstants";
import { StudyStatus } from "../../types/models/studyTypes/studyDetails";

interface IStudyOverview {
  place: {
    name: string;
    address: string;
    branch: string;
  };
  distance: number;
  status: StudyStatus;

  time: string;
}

function StudyOverview({
  place: { name, address, branch },
  distance,
  status,
  time,
}: IStudyOverview) {
  const { text: badgeText, colorScheme: badgeColorScheme } = STUDY_STATUS_TO_BADGE[status];

  const infoBoxPropsArr: InfoBoxProps[] = [
    {
      category: "영업 시간",
      text: time !== "unknown" ? time : "정보 없음",
    },
    {
      category: "장소",
      text: address,
    },
  ];

  return (
    <>
      <Box mx={5} mt={4} mb={5}>
        <Box color="var(--gray-500)" fontSize="12px">
          <Badge mr={2} size="lg" colorScheme={badgeColorScheme}>
            {badgeText}
          </Badge>
          <Box as="span">{branch}</Box>
          <Box as="span" color="var(--gray-400)">
            ・
          </Box>
          <Box as="span">{distance}KM</Box>
        </Box>

        <Box mt={1} mb={4} fontSize="20px" fontWeight="bold">
          {name}
        </Box>

        <InfoBoxCol infoBoxPropsArr={infoBoxPropsArr} />
      </Box>
    </>
  );
}

export default StudyOverview;

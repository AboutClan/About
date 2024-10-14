import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";
import { PlusIcon } from "../../components/Icons/MathIcons";

import StudyInviteModal from "../../modals/study/StudyInviteModal";
import { StudyPlaceProps } from "../../types/models/studyTypes/studyDetails";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface IStudyDateBar {
  date: string;
  place: StudyPlaceProps | PlaceInfoProps;
  memberCnt: number;
}
function StudyDateBar({ place, date, memberCnt }: IStudyDateBar) {
  const [isInviteModal, setIsInviteModal] = useState(false);

  return (
    <>
      <Box mt={10} mb={2}>
        <Flex justify="space-between" align="center">
          <Box fontWeight="bold" fontSize="18px">
            {dayjsToFormat(dayjs(date), "M월 D일 참여 멤버")}
          </Box>
          <Button variant="unstyled" onClick={() => setIsInviteModal(true)}>
            <PlusIcon />
          </Button>
        </Flex>
        <Box mt={1} fontSize="12px" color="gray.500">
          현재 <b>{memberCnt}의 멤버</b>가 참여중이에요 !
        </Box>
      </Box>
      {isInviteModal && <StudyInviteModal setIsModal={setIsInviteModal} place={place} />}
    </>
  );
}

const StudyDateBarContainer = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
`;

const DateText = styled.span`
  font-size: 18px; /* text-lg */
  font-weight: 700; /* font-semibold */
`;

export default StudyDateBar;

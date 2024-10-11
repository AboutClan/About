import { Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import StudyInviteModal from "../../modals/study/StudyInviteModal";
import { StudyPlaceProps } from "../../types/models/studyTypes/studyDetails";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface IStudyDateBar {
  place: StudyPlaceProps | PlaceInfoProps;
}
function StudyDateBar({ place }: IStudyDateBar) {
  const { date } = useParams<{ date: string }>();
  const [isInviteModal, setIsInviteModal] = useState(false);

  return (
    <>
      <StudyDateBarContainer>
        <DateText>{dayjsToFormat(dayjs(date), "M월 D일 참여 멤버")}</DateText>

        <Button
          size="sm"
          variant="outline"
          color="var(--gray-600)"
          rightIcon={<i className="fa-solid fa-plus fa-xs" />}
          padding="0 var(--gap-2)"
          borderColor="var(--gray-400)"
          onClick={() => setIsInviteModal(true)}
        >
          친구초대
        </Button>
      </StudyDateBarContainer>
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

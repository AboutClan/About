import { Button } from "@chakra-ui/react";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import StudyInviteModal from "../../modals/study/StudyInviteModal";
import { IPlace } from "../../types/models/studyTypes/studyDetails";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface IStudyDateBar {
  isPrivateStudy: boolean;
  place: IPlace;
}
function StudyDateBar({ isPrivateStudy, place }: IStudyDateBar) {
  const { date } = useParams<{ date: string }>();
  const [isInviteModal, setIsInviteModal] = useState(false);

  return (
    <>
      <StudyDateBarContainer>
        <DateText>
          {isPrivateStudy ? "개인 스터디" : dayjsToFormat(dayjs(date), "M월 D일 참여 멤버")}
        </DateText>
        {!isPrivateStudy && (
          <Button
            size="sm"
            variant="outline"
            color="var(--gray-3)"
            rightIcon={<FontAwesomeIcon icon={faPlus} size="xs" />}
            padding="0 var(--gap-2)"
            borderColor="var(--gray-5)"
            onClick={() => setIsInviteModal(true)}
          >
            친구초대
          </Button>
        )}
      </StudyDateBarContainer>
      {isInviteModal && <StudyInviteModal setIsModal={setIsInviteModal} place={place} />}
    </>
  );
}

const StudyDateBarContainer = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  background-color: white;
`;

const DateText = styled.span`
  font-size: 18px; /* text-lg */
  font-weight: 700; /* font-semibold */
`;

export default StudyDateBar;

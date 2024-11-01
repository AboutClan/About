import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import styled from "styled-components";

import { IModal } from "../../types/components/modalTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

interface StudyPreferencePopUpProps extends IModal {
  handleClick: () => void;
}

function StudyPreferencePopUp({ setIsModal, handleClick }: StudyPreferencePopUpProps) {
  const footerOptions: IFooterOptions = {
    main: {
      text: "장소 추천받기",
      func: handleClick,
    },
    sub: {
      text: "다음에",
      func: () => {
        localStorage.setItem("preference", dayjsToStr(dayjs()));
        setIsModal(false);
      },
    },

    isFull: true,
  };

  return (
    <ModalLayout title="스터디 즐겨찾기 등록" footerOptions={footerOptions} setIsModal={setIsModal}>
      <Box fontSize="15px">
        스터디 장소를 추천해 드려요! <br />
        궁금하잖아...! 잠깐만 와 봐...!
      </Box>
      <Wrapper>
        <Image
          src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/recordBook.png"
          width={100}
          height={100}
          alt="studyResult"
        />
      </Wrapper>
    </ModalLayout>
  );
}

const Wrapper = styled.div`
  margin-top: 8px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default StudyPreferencePopUp;

import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { ALL_스터디인증 } from "../../constants/serviceConstants/studyConstants/studyPlaceConstants";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IParticipation } from "../../types/models/studyTypes/studyDetails";
import { IFooterOptions, ModalLayout } from "../Modals";

interface StudyOpenCheckModalProps extends IModal {
  par: IParticipation;
}

function StudyOpenCheckModal({ setIsModal, par }: StudyOpenCheckModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const [isFirstPage, setIsFirstPage] = useState(true);

  const footerOptions: IFooterOptions = {
    main: {
      text: isFirstPage ? "다음" : "개인 스터디",
      func: isFirstPage
        ? () => setIsFirstPage(false)
        : () => router.push(`/study/${ALL_스터디인증}/${date}?isPrivate=on`),
    },
    sub: {
      text: isFirstPage ? "닫기" : "자유 오픈",
      func: () =>
        !isFirstPage ? router.push(`/study/${par.place._id}/${date}?isFree=on`) : setIsModal(false),
    },
  };

  function ColorText({ text }: { text: string }) {
    return (
      <Box as="span" color="var(--color-mint)">
        {text}
      </Box>
    );
  }

  return (
    <ModalLayout footerOptions={footerOptions} setIsModal={setIsModal} title="스터디 알림">
      <ModalSubtitle>
        <Box h="72px">
          {isFirstPage ? (
            <>
              신청하셨던 <ColorText text={par.place.branch} /> 스터디가 오픈되지 않았어요.{" "}
              <ColorText text="개인 스터디" />로 이동하거나 <ColorText text="자유 스터디" />로
              오픈을 원하는 경우에는 <ColorText text="'다음'" />을 눌러주세요.
            </>
          ) : (
            <>
              원하는 스터디 방식을 선택해 주세요!
              <br />
              현재 <ColorText text={par.place.branch} /> 지점의 참여 인원은{" "}
              <ColorText text={`${par.attendences.length}명`} />
              입니다.
            </>
          )}
        </Box>
      </ModalSubtitle>
    </ModalLayout>
  );
}

export default StudyOpenCheckModal;

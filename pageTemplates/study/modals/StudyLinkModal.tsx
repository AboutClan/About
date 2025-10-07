import { Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";

import { ModalLayout } from "../../../modals/Modals";
import { StudyType } from "../../../types/models/studyTypes/study-set.types";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import { navigateExternalLink } from "../../../utils/navigateUtils";

interface StudyLinkModalProps {
  date: string;
  onClose: () => void;
  studyType: StudyType;
}

function StudyLinkModal({ studyType, date, onClose }: StudyLinkModalProps) {
  const type =
    studyType === "openRealTimes" && date !== dayjsToStr(dayjs())
      ? "openStudy"
      : date === dayjsToStr(dayjs())
      ? "result"
      : "expected";
  return (
    <ModalLayout
      title={
        type === "openStudy"
          ? "스터디 진행 예정!"
          : type === "result"
          ? "스터디 매칭 성공!"
          : "스터디 매칭 예정!"
      }
      footerOptions={{
        main: {
          text: "입 장",
          func: () => {
            navigateExternalLink("https://open.kakao.com/o/gCRegnOh");
            localStorage.setItem("studyLink", date);
            onClose();
          },
        },
        sub: {
          text: type !== "result" ? "나중에" : "생 략",
          func: () => {
            localStorage.setItem("studyLink", date);
            onClose();
          },
        },
      }}
      setIsModal={onClose}
    >
      <Flex justify="center" mb={5}>
        <Image
          width={64}
          height={64}
          alt="studyRecord"
          src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/falling-star-3d-icon.png"
        />
      </Flex>
      <p>
        {type === "result" ? (
          <>
            스터디 매칭에 성공했어요! <br />
          </>
        ) : (
          <>
            스터디가 진행 될 예정이에요!
            <br />
          </>
        )}
        원활한 스터디 진행을 위해, <br />
        <b>[스터디 단톡방]</b>에 입장해 주세요!
      </p>
    </ModalLayout>
  );
}

export default StudyLinkModal;

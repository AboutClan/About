import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";

import { STUDY_COVER_IMAGES } from "@/assets/images/studyCover";
import MenuButton, { MenuProps } from "@/components/atoms/buttons/MenuButton";
import Header from "@/components/layouts/Header";
import RightDrawer from "@/components/modals/drawer/RightDrawer";
import Accordion from "@/components/molecules/Accordion";
import { ACCORDION_STUDY_FAQ } from "@/constants/contentsText/accordionContents";
import { StudyPlaceProps } from "@/types/models/studyTypes/study-entity.types";
import { StudyType } from "@/types/models/studyTypes/study-set.types";
import { dayjsToFormat } from "@/utils/dateTimeUtils";
import { getRandomImage } from "@/utils/imageUtils";

interface IStudyHeader {
  date?: string;
  placeInfo: StudyPlaceProps;
  studyType?: StudyType;
  onSaveImage?: () => void;
}

function StudyHeader({ placeInfo, date, studyType, onSaveImage }: IStudyHeader) {
  const router = useRouter();
  const [isModal, setIsModal] = useState(false);

  // 아직 장소가 없는 "카공 스터디 라운지"(신청만 모여 있는 상태)
  const isLounge = studyType === "participations";

  const kakaoTitleSuffix =
    studyType === "soloRealTimes"
      ? "M월 D일(ddd) 개인 스터디 인증"
      : isLounge
        ? "M월 D일(ddd) 카공 스터디 신청"
        : `M월 D일(ddd) 카공 스터디: ${placeInfo?.location?.name ?? ""}`;

  const menuArr: MenuProps[] = [
    {
      text: "자주 묻는 질문",
      icon: (
        <Flex justify="center" align="center">
          <InfoIcon />
        </Flex>
      ),
      func: () => {
        setIsModal(true);
      },
    },

    {
      kakaoOptions: {
        // studyType으로 분기한다. 예전에는 place.location의 이름·주소를
        // "개인 스터디 인증" / "스터디 매칭 대기소" / "위치 선정 중" 문자열과 비교했는데
        // 그 값들은 코드 어디에서도 만들어지지 않아 세 분기 모두 도달하지 못했다.
        // 그 결과 스터디 라운지는 place 자체가 없어 "카공 스터디: undefined"가,
        // 개인 공부 인증은 place.name이 "temp"라 "카공 스터디: temp"가 공유됐다.
        title: dayjsToFormat(dayjs(date).locale("ko"), kakaoTitleSuffix),
        subtitle: isLounge ? "스터디 멤버 모집중" : placeInfo?.location?.address,
        img: placeInfo?.image || getRandomImage(STUDY_COVER_IMAGES),
        url: "https://about20s.club" + router.asPath,
      },
    },
  ];

  return (
    <>
      <Header title="카공 스터디">
        {/* 공유·이미지 저장·FAQ 묶음이라 설정(톱니) 대신 "더보기" 아이콘을 쓴다. */}
        <MenuButton menuArr={menuArr} icon={<MoreIcon />} />
      </Header>
      {isModal && (
        <RightDrawer
          title="자주 묻는 질문"
          onClose={() => {
            setIsModal(false);
          }}
        >
          <Box>
            <Accordion contentArr={ACCORDION_STUDY_FAQ} />
          </Box>
        </RightDrawer>
      )}
      {/* {isModal && <BottomButtonColDrawer infoArr={infoArr} setIsModal={setIsModal} />} */}
    </>
  );
}

function MoreIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--gray-700)">
      <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-gray)"
    >
      <path d="M40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q74 0 126 17t112 52q11 6 16.5 14t5.5 21v418q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-441q0-17 11.5-28.5T880-777q17 0 28.5 11.5T920-737v503q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-49 0-95.5 14.5T516-185q-8 5-17.5 7.5T480-175q-9 0-18.5-2.5T444-185q-42-26-88.5-40.5T260-240q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234Zm580-208v-369q0-13 7.5-23.5T647-849l54-18q14-5 26.5 4.5T740-838v369q0 13-7.5 23.5T713-431l-54 18q-14 5-26.5-4.5T620-442Z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-gray)"
    >
      <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
    </svg>
  );
}

export default StudyHeader;

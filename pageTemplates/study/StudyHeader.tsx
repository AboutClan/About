import dayjs from "dayjs";
import { useRouter } from "next/router";

import { STUDY_COVER_IMAGES } from "../../assets/images/studyCover";
import MenuButton, { MenuProps } from "../../components/atoms/buttons/MenuButton";
import Header from "../../components/layouts/Header";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";

interface IStudyHeader {
  date?: string;
  placeInfo: StudyPlaceProps;
}

function StudyHeader({ placeInfo, date }: IStudyHeader) {
  const router = useRouter();

  const menuArr: MenuProps[] = [
    // {
    //   text: "장소 정보 수정 요청",
    //   func: () => {
    //     toast("warning", "준비중인 기능입니다.");
    //   },
    // },
    {
      kakaoOptions: {
        title:
          placeInfo?.location.name === "개인 스터디 인증"
            ? `${dayjsToFormat(dayjs(date).locale("ko"), "M월 D일(ddd) 개인 스터디 인증")}`
            : placeInfo?.location.name === "스터디 매칭 대기소"
            ? `${dayjsToFormat(dayjs(date).locale("ko"), "M월 D일(ddd) 카공 스터디 신청")}`
            : `${dayjsToFormat(
                dayjs(date).locale("ko"),
                `M월 D일(ddd) 카공 스터디: ${placeInfo?.location.name}`,
              )}`,
        subtitle:
          placeInfo?.location.address === "위치 선정 중"
            ? "스터디 멤버 모집중"
            : placeInfo?.location.address,
        img: placeInfo?.image || getRandomImage(STUDY_COVER_IMAGES),
        url: "https://about20s.club" + router.asPath,
      },
    },
  ];

  return (
    <>
      <Header title="스터디" url={`/studyPage?date=${date}`}>
        <MenuButton menuArr={menuArr} />
      </Header>
      {/* {isModal && <BottomButtonColDrawer infoArr={infoArr} setIsModal={setIsModal} />} */}
    </>
  );
}

export default StudyHeader;

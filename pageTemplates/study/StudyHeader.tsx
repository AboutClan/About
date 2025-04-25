import dayjs from "dayjs";
import { useRouter } from "next/router";

import MenuButton, { MenuProps } from "../../components/atoms/buttons/MenuButton";
import Header from "../../components/layouts/Header";
import { useToast } from "../../hooks/custom/CustomToast";
import { MergeStudyPlaceProps } from "../../types/models/studyTypes/derivedTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface IStudyHeader {
  date?: string;
  placeInfo: MergeStudyPlaceProps;
}

function StudyHeader({ placeInfo, date }: IStudyHeader) {
  const router = useRouter();
  const toast = useToast();

  const menuArr: MenuProps[] = [
    {
      text: "장소 정보 수정 요청",
      func: () => {
        toast("warning", "준비중인 기능입니다.");
      },
    },
    {
      kakaoOptions: {
        title:
          placeInfo.name === "개인 스터디 인증"
            ? `${dayjsToFormat(dayjs(date).locale("ko"), "M월 D일(ddd) 개인 스터디 인증")}`
            : placeInfo.name === "스터디 매칭 대기소"
            ? `${dayjsToFormat(dayjs(date).locale("ko"), "M월 D일(ddd) 카공 스터디 신청")}`
            : `${dayjsToFormat(
                dayjs(date).locale("ko"),
                `M월 D일(ddd) 카공 스터디: ${placeInfo.brand}`,
              )}`,
        subtitle: placeInfo.address === "위치 선정 중" ? "스터디 멤버 모집중" : placeInfo.address,
        img: placeInfo.image,
        url: "https://study-about.club" + router.asPath,
      },
    },
  ];

  return (
    <>
      <Header title={placeInfo.name}>
        <MenuButton menuArr={menuArr} />
      </Header>
      {/* {isModal && <BottomButtonColDrawer infoArr={infoArr} setIsModal={setIsModal} />} */}
    </>
  );
}

export default StudyHeader;

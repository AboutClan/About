import { useRouter } from "next/router";

import MenuButton, { MenuProps } from "../../components/atoms/buttons/MenuButton";
import Header from "../../components/layouts/Header";
import { useToast } from "../../hooks/custom/CustomToast";
import { MergeStudyPlaceProps } from "../../types/models/studyTypes/derivedTypes";

interface IStudyHeader {
  placeInfo: MergeStudyPlaceProps;
}

function StudyHeader({ placeInfo }: IStudyHeader) {
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
        title: placeInfo.name,
        subtitle: placeInfo.address,
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

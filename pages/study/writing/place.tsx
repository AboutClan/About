import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import SearchLocation from "../../../components/organisms/SearchLocation";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedStudyWritingState } from "../../../recoils/sharedDataAtoms";
import { KakaoLocationProps } from "../../../types/externals/kakaoLocationSearch";
import { StudyWritingProps } from "../../../types/models/studyTypes/studyInterActions";

function WritingStudyPlace() {
  const router = useRouter();
  const failToast = useFailToast();

  const [studyWriting, setStudyWriting] = useRecoilState(sharedStudyWritingState);

  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: studyWriting?.fullname || "",
    road_address_name: studyWriting?.locationDetail || "",
  });

  const onClickNext = () => {
    if (
      [placeInfo?.place_name, location, placeInfo?.place_url, placeInfo?.x, placeInfo?.y].some(
        (field) => !field,
      )
    ) {
      failToast("free", "장소를 선택해 주세요!");
      return;
    }

    const { fullname, brand, branch } = parsePlaceToStudyPlace(placeInfo.place_name);
    setStudyWriting({
      ...studyWriting,
      fullname,
      brand,
      branch,
      mapURL: placeInfo.place_url,
      locationDetail: placeInfo.road_address_name,
      latitude: +placeInfo.y,
      longitude: +placeInfo.x,
    } as StudyWritingProps);
    router.push(`/study/writing/content`);
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={25} />
        <Header isSlide={false} title="" url="/home" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>추가하고 싶은 스터디 장소를 입력해 주세요!</span>
        </RegisterOverview>
        <SearchLocation
          placeHolder="ex) 사당역 투썸플레이스"
          placeInfo={placeInfo}
          setPlaceInfo={setPlaceInfo}
        />
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} />
    </>
  );
}

const parsePlaceToStudyPlace = (
  name: string,
): { fullname: string; brand: string; branch: string } => {
  const splitText = name.split(" ");
  return { fullname: name, brand: splitText[0], branch: splitText?.[1] || "지점 미입력" };
};

export default WritingStudyPlace;

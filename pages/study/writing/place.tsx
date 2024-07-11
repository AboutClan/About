import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ButtonGroups, { IButtonOpions } from "../../../components/molecules/groups/ButtonGroups";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import SearchLocation from "../../../components/organisms/SearchLocation";
import { LOCATION_CONVERT, LOCATION_OPEN } from "../../../constants/location";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedStudyWritingState } from "../../../recoils/sharedDataAtoms";
import { KakaoLocationProps } from "../../../types/externals/kakaoLocationSearch";
import { StudyWritingProps } from "../../../types/models/studyTypes/studyInterActions";

function WritingStudyPlace() {
  const { data: session } = useSession();
  const router = useRouter();
  const failToast = useFailToast();

  const [studyWriting, setStudyWriting] = useRecoilState(sharedStudyWritingState);

  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: studyWriting?.fullname || "",
    road_address_name: studyWriting?.locationDetail || "",
  });

  const [location, setLocation] = useState(session?.user.location);

  const onClickNext = () => {
    if (
      [placeInfo?.place_name, location, placeInfo?.place_url, placeInfo?.x, placeInfo?.y].some(
        (field) => !field,
      )
    ) {
      failToast("free", "장소를 선택해 주세요!", true);
      return;
    }

    const { fullname, brand, branch } = parsePlaceToStudyPlace(placeInfo.place_name);
    setStudyWriting(
      (old) =>
        ({
          ...old,
          fullname,
          brand,
          branch,
          mapURL: placeInfo.place_url,
          locationDetail: placeInfo.road_address_name,
          latitude: +placeInfo.y,
          longitude: +placeInfo.x,
          location,
        }) as StudyWritingProps,
    );
    router.push(`/study/writing/content`);
  };

  const buttonDataArr: IButtonOpions[] = LOCATION_OPEN.map((locationInfo) => ({
    text: LOCATION_CONVERT[locationInfo],
    func: () => setLocation(locationInfo),
  }));

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={25} />
        <Header isSlide={false} title="" url="/home" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>스터디 장소를 포함하는 지역을 선택해 주세요!</span>
        </RegisterOverview>
        <ButtonGroups
          isWrap={true}
          currentValue={LOCATION_CONVERT[location]}
          buttonDataArr={buttonDataArr}
        />

        <RegisterOverview>
          <span>추가하고 싶은 스터디 장소를 검색해 주세요!</span>
        </RegisterOverview>
        <Location>
          <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} />
        </Location>
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

const Location = styled.div`
  margin-top: var(--gap-3);
  background-color: inherit;
`;

export default WritingStudyPlace;

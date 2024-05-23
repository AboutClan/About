import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import SearchLocation from "../../../components/organisms/SearchLocation";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { KakaoLocationProps } from "../../../types/externals/kakaoLocationSearch";

function WritingGahterLocation() {
  const router = useRouter();
  const failToast = useFailToast();

  const [gatherWriting, setGatherWriting] = useRecoilState(sharedGatherWritingState);

  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: gatherWriting?.location?.main || "",
    road_address_name: gatherWriting?.location?.sub || "",
  });

  const onClickNext = () => {
    if (!placeInfo?.place_name) {
      failToast("free", "장소를 선택해 주세요!", true);
      return;
    }
    setGatherWriting((old) => ({
      ...old,
      location: {
        main: placeInfo.place_name,
        sub: placeInfo.road_address_name,
      },
    }));
    router.push(`/gather/writing/condition`);
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={80} />
        <Header isSlide={false} title="" url="/gather/writing/date" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>날짜와 장소를 선택해 주세요.</span>
        </RegisterOverview>
        <Location>
          <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} />
        </Location>
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} />
    </>
  );
}

const Location = styled.div`
  margin-top: var(--gap-3);
  background-color: inherit;
`;

export default WritingGahterLocation;

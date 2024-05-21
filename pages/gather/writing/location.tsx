import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import LocationSearch from "../../../components/organisms/location/LocationSearch";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherLocation } from "../../../types/models/gatherTypes/gatherTypes";

function WritingGahterLocation() {
  const router = useRouter();
  const failToast = useFailToast();

  const [gatherWriting, setGatherWriting] = useRecoilState(sharedGatherWritingState);
  const [location, setLocation] = useState<IGatherLocation>(
    gatherWriting?.location || { main: "", sub: "" },
  );

  const onClickNext = () => {
    if (!location) {
      failToast("free", "장소를 선택해 주세요!", true);
      return;
    }
    setGatherWriting((old) => ({
      ...old,
      location,
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
          <LocationSearch location={location.main} setLocation={setLocation} />
          <LocationDetailInput
            placeholder="상세 주소"
            value={location.sub}
            onChange={(e) => setLocation((old) => ({ ...old, sub: e.target.value }))}
          />
        </Location>
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} />
    </>
  );
}

const LocationDetailInput = styled.input`
  width: 100%;
  background-color: inherit;
  border-bottom: var(--border);
  padding-top: 0;
  padding-bottom: var(--gap-2);
  padding-left: var(--gap-1);
  outline: none;
  font-size: 13px;
  color: var(--gray-700);
`;

const Location = styled.div`
  margin-top: var(--gap-3);
  background-color: inherit;
`;

export default WritingGahterLocation;

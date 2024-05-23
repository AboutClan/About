import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedStudyWritingState } from "../../../recoils/sharedDataAtoms";

interface PlaceInfoProp {}

function WritingStudyPlace() {
  const router = useRouter();
  const failToast = useFailToast();

  const [studyWriting, setStudyWriting] = useRecoilState(sharedStudyWritingState);
  const [location, setLocation] = useState<PlaceInfoProp>(
    studyWriting?.location || { main: "", sub: "" },
  );

  const onClickNext = () => {
    if (!location) {
      failToast("free", "장소를 선택해 주세요!", true);
      return;
    }
    // setStudyWriting((old) => ({
    //   ...old,
    //   location,
    // }));
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
          <span>추가하고 싶은 스터디 장소를 입력해 주세요!</span>
        </RegisterOverview>
        <Location>
          {/* <LocationSearch info={ } setLocation={setLocation} /> */}
          <LocationDetailInput
            placeholder="상세 주소"
            value=""
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

export default WritingStudyPlace;

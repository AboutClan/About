import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import SearchLocation from "../../../components/organisms/SearchLocation";
import { useToast } from "../../../hooks/custom/CustomToast";
import { ModalLayout } from "../../../modals/Modals";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { LocationProps } from "../../../types/common";

function WritingGahterLocation() {
  const router = useRouter();
  const toast = useToast();

  const [gatherWriting, setGatherWriting] = useRecoilState(sharedGatherWritingState);
  const [isModal, setIsModal] = useState(false);

  const [placeInfo, setPlaceInfo] = useState<LocationProps>({
    name: gatherWriting?.location?.main || "",
    address: gatherWriting?.location?.sub || "",
    latitude: null,
    longitude: null,
  });
  console.log(5, placeInfo);
  const onClickNext = () => {
    if (!placeInfo?.name) {
      setIsModal(true);
      return;
    }
    setGatherWriting((old) => ({
      ...old,
      location: {
        main: placeInfo.name,
        sub: placeInfo.address,
        latitude: placeInfo.latitude,
        longitude: placeInfo.longitude,
      },
    }));
    router.push({ pathname: `/gather/writing/condition`, query: router.query });
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={66} />
        <Header isSlide={false} title="" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>어디서 모이나요?</span>
          <span>모임 장소를 입력해 주세요</span>
        </RegisterOverview>
        <Location>
          <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} />
        </Location>
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} />
      {isModal && (
        <ModalLayout
          title="모임 장소 확인"
          setIsModal={setIsModal}
          footerOptions={{
            main: {
              text: "맞아요",
              func: () => {
                setGatherWriting((old) => ({
                  ...old,
                  location: {
                    main: null,
                    sub: null,
                    latitude: null,
                    longitude: null,
                  },
                }));
                router.push({ pathname: `/gather/writing/condition`, query: router.query });
              },
            },
            sub: {
              text: "아니에요",
              func: () => {
                toast("info", "오프라인 모임이라면 장소를 입력해 주세요!");
                setIsModal(false);
              },
            },
          }}
        >
          온라인으로 진행하는 모임인가요?
        </ModalLayout>
      )}
    </>
  );
}

const Location = styled.div`
  margin-top: var(--gap-3);
  background-color: inherit;
`;

export default WritingGahterLocation;

import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import SearchLocation from "../../../components/organisms/SearchLocation";
import { useFailToast, useToast } from "../../../hooks/custom/CustomToast";
import { useStudyAdditionMutation } from "../../../hooks/study/mutations";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { LocationProps } from "../../../types/common";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

function WritingStudyPlace() {
  const router = useRouter();
  const toast = useToast();
  const failToast = useFailToast();

  // const [studyWriting, setStudyWriting] = useRecoilState(sharedStudyWritingState);

  const [placeInfo, setPlaceInfo] = useState<LocationProps>({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  });

  const { mutate } = useStudyAdditionMutation({
    onSuccess() {
      // setStudyWriting(null);
      toast("success", "추가 완료!");
      router.push(`/studyPage?date=${dayjsToStr(dayjs())}`);
    },
  });

  const onClickNext = () => {
    if ([placeInfo?.name, placeInfo?.address].some((field) => !field)) {
      failToast("free", "장소를 선택해 주세요!");
      return;
    }

    const { latitude, longitude, address, name } = placeInfo;
    mutate({
      location: { name, latitude, longitude, address },
      status: "inactive",
    });

    return;
    // setStudyWriting({
    //   ...studyWriting,
    //   fullname,
    //   brand,
    //   branch,
    //   mapURL: placeInfo.place_url,
    //   locationDetail: placeInfo.address,
    //   latitude: +placeInfo.y,
    //   longitude: +placeInfo.x,
    // } as StudyWritingProps);
    // router.push(`/study/writing/content`);
  };

  return (
    <>
      <Slide isFixed={true}>
        <Header isSlide={false} title="" />
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
      <BottomNav onClick={() => onClickNext()} text="장소 추가" />
    </>
  );
}

export default WritingStudyPlace;

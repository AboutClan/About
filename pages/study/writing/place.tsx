import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import SearchLocation from "../../../components/organisms/SearchLocation";
import { useFailToast, useToast } from "../../../hooks/custom/CustomToast";
import { NaverLocationProps } from "../../../hooks/external/queries";
import { useStudyAdditionMutation } from "../../../hooks/study/mutations";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

function WritingStudyPlace() {
  const router = useRouter();
  const toast = useToast();
  const failToast = useFailToast();

  // const [studyWriting, setStudyWriting] = useRecoilState(sharedStudyWritingState);

  const [placeInfo, setPlaceInfo] = useState<NaverLocationProps>({
    title: "",
    address: "",
    // title: studyWriting?.title || "",
    // address: studyWriting?.location.address || "",
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
    if ([placeInfo?.title, placeInfo?.address].some((field) => !field)) {
      failToast("free", "장소를 선택해 주세요!");
      return;
    }

    const { latitude, longitude, address } = placeInfo;
    mutate({ title: placeInfo.title, location: { latitude, longitude, address }, status: "sub" });

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

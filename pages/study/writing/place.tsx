import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import SearchLocation from "../../../components/organisms/SearchLocation";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudyAdditionMutation } from "../../../hooks/study/mutations";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { LocationProps } from "../../../types/common";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

function WritingStudyPlace() {
  const router = useRouter();
  const toast = useToast();

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
      toast("warning", "장소를 입력해주세요.");
      return;
    }

    return;
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
        <Header isSlide={false} title="장소 추가" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>추가하고 싶은 장소를 입력해주세요</span>
          <span>입력하신 장소는 운영진의 검토 후 추가됩니다.</span>
        </RegisterOverview>
        <SearchLocation
          placeHolder="ex) 사당역 투썸플레이스"
          placeInfo={placeInfo}
          setPlaceInfo={setPlaceInfo}
        />
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} text="완 료" />
    </>
  );
}

export default WritingStudyPlace;

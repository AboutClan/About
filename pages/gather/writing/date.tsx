import "react-datepicker/dist/react-datepicker.css";

import dayjs from "dayjs";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { useRecoilState } from "recoil";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import GatherWritingDateDate from "../../../pageTemplates/gather/writing/GatherWritingDateDate";
import GatherWritingDateSubject from "../../../pageTemplates/gather/writing/GatherWritingDateSubject";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherListItem } from "../../../types/models/gatherTypes/gatherTypes";

function WritingDate() {
  const failToast = useFailToast();
  const router = useRouter();

  const [gatherWriting, setGatherWriting] = useRecoilState(sharedGatherWritingState);

  const [date, setDate] = useState<Date>();
  const [gatherList, setGatherList] = useState<IGatherListItem[]>();

  const onClickNext = () => {
    if (gatherList && !gatherList[0].text) {
      failToast("free", "1차 모임 작성은 필수입니다!");
      return;
    }
    const givenDay = dayjs(date);
    if (givenDay.isSame(dayjs(), "day") && givenDay.hour() === 14) {
      failToast("free", "날짜/시간 선택을 확인해주세요!");
      return;
    }
    setGatherWriting((old) => ({
      ...old,
      date: dayjs(date).toISOString(),
      gatherList,
    }));
    router.push({ pathname: `/gather/writing/location`, query: router.query });
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={50} />
        <Header isSlide={false} title="" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>언제 모임을 진행하나요?</span>
          <span>날짜와 시간을 선택해 주세요</span>
        </RegisterOverview>
        <GatherWritingDateDate date={date} setDate={setDate} gatherWriting={gatherWriting} />
        <GatherWritingDateSubject
          gatherWriting={gatherWriting}
          setGatherList={setGatherList}
          date={date}
        />
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} />
    </>
  );
}

export default WritingDate;

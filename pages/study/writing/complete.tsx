import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useRecoilValue } from "recoil";

import TextBlock from "../../../components/atoms/TextBlock";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { useFailToast, useToast } from "../../../hooks/custom/CustomToast";
import { useStudyAdditionMutation } from "../../../hooks/study/mutations";
import { useUserRequestMutation } from "../../../hooks/user/sub/request/mutations";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedStudyWritingState } from "../../../recoils/sharedDataAtoms";

function WritingStudyComplete() {
  const { data: session } = useSession();
  const router = useRouter();
  const failToast = useFailToast();
  const toast = useToast();
  const studyWriting = useRecoilValue(sharedStudyWritingState);

  const { mutate } = useStudyAdditionMutation({
    onSuccess() {
      router.push("/home");
      toast("success", "추가 요청 완료! 며칠 이내에 신규 장소로 추가됩니다.");
    },
  });
  const { mutate: sendRequest } = useUserRequestMutation();

  const onSubmit = () => {
    const { content, ...placeInfo } = studyWriting;
    mutate(placeInfo);
    sendRequest({
      category: "장소 추가",
      writer: session?.user.name,
      date: dayjs(),
      content: studyWriting.content,
    });
  };

  const LIST_CONTENTS = [
    "관리자가 승인하는 즉시 신규 등록됩니다.",
    "등록된 장소는 한 달 동안만 임시로 유지됩니다.",
    "정규 장소로 확정을 위해서는 한 달 이내에 해당 장소에서 스터디가 2회 진행되어야 합니다.",
    "정규 장소 확정에 성공한다면 등록자에게는 300 POINT의 상품이 지급됩니다.",
  ];

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={100} />
        <Header isSlide={false} title="" url="/study/writing/image" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>마지막으로 최종 사항을 확인해주세요!</span>
        </RegisterOverview>

        <TextBlock listContents={LIST_CONTENTS} />
      </RegisterLayout>
      <BottomNav text="완료" onClick={onSubmit} />
    </>
  );
}

export default WritingStudyComplete;

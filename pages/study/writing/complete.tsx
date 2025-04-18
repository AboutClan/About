import { useRecoilState } from "recoil";

import TextBlock from "../../../components/atoms/TextBlock";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudyAdditionMutation } from "../../../hooks/study/mutations";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedStudyWritingState } from "../../../recoils/sharedDataAtoms";

function WritingStudyComplete() {
  const toast = useToast();
  const [studyWriting, setStudyWriting] = useRecoilState(sharedStudyWritingState);

  const { mutate } = useStudyAdditionMutation({
    onSuccess() {
      setStudyWriting(null);
      toast("success", "추가 요청 완료! 며칠 이내에 신규 장소로 추가됩니다.");
    },
  });

  const onSubmit = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content, ...placeInfo } = studyWriting;

    mutate(placeInfo);
  };

  const LIST_CONTENTS = [
    "관리자가 승인하는 즉시 신규 장소로 추가됩니다.",
    "추가된 장소는 한 달 동안만 임시로 유지됩니다.",
    "정규 등록을 위해서는 스터디가 2회 이상 진행되어야 합니다.",
    "정규 등록자에게는 300 POINT의 상품이 지급됩니다.",
  ];

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={100} />
        <Header isSlide={false} title="" />
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

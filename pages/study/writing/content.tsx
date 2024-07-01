import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";

import Textarea from "../../../components/atoms/Textarea";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedStudyWritingState } from "../../../recoils/sharedDataAtoms";

function WritingStudyContent() {
  const router = useRouter();
  const failToast = useFailToast();

  const [studyWriting, setStudyWriting] = useRecoilState(sharedStudyWritingState);

  const [content, setContent] = useState(studyWriting?.content || "");

  const onClickNext = () => {
    if (!content) {
      failToast("free", "내용을 작성해 주세요!", true);
      return;
    }
    setStudyWriting((old) => ({
      ...old,

      content,
    }));
    router.push(`/study/writing/image`);
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={50} />
        <Header isSlide={false} title="" url="/study/writing/place" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>추가하고 싶은 이유나 장점이 있다면 적어주세요!</span>
        </RegisterOverview>

        <Textarea
          placeholder="분위기가 쾌적해서 카공하기 좋아요!"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          minHeight={200}
        />
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} />
    </>
  );
}

export default WritingStudyContent;

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import WritingConditionLayout, {
  WritingConditionProps,
} from "../../../components/organisms/WritingConditionLayout";
import { GATHER_WRITING_INFO } from "../../../constants/keys/localStorage";
import { useToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherWriting } from "../../../types/models/gatherTypes/gatherTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../../utils/storageUtils";
import { randomPassword } from "../../../utils/validationUtils";


function WritingCondition() {
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const [gatherContent, setGatherContent] = useRecoilState(sharedGatherWritingState);
  const info = getLocalStorageObj(GATHER_WRITING_INFO);

  const defaultCondition: WritingConditionProps = {
    memberMaxCnt: gatherContent?.memberCnt?.max ?? 4,
    isGenderCondition: gatherContent?.genderCondition ?? false,
    age: gatherContent?.age ?? [19, 28],
    kakaoUrl: gatherContent?.kakaoUrl ?? null,
    isApprovalRequired: gatherContent?.isApprovalRequired ?? false,
  };

  const [conditions, setConditions] = useState<WritingConditionProps>(defaultCondition);

  console.log(124, gatherContent, conditions);

  useEffect(() => {
    if (gatherContent?.title) {
      setConditions(defaultCondition);
      setLocalStorageObj(GATHER_WRITING_INFO, gatherContent);
    } else {
      setGatherContent(info);
    }
  }, [gatherContent]);

  const onClickNext = () => {
    if (conditions.kakaoUrl === "") {
      toast("error", "입장 가능한 오픈채팅방 링크를 입력해 주세요.");
      return;
    }

    const gatherData: Partial<IGatherWriting> = {
      ...gatherContent,
      age: conditions.age,
      memberCnt: {
        min: 4,
        max: conditions.memberMaxCnt,
      },
      genderCondition: conditions.isGenderCondition,
      kakaoUrl: conditions.kakaoUrl,
      isApprovalRequired: conditions.isApprovalRequired,
      user: session?.user.id,
      password: randomPassword(),
    };

    setGatherContent(gatherData);
    router.push({ pathname: `/gather/writing/image`, query: router.query });
  };

  return (
    <>
      <>
        <Slide isFixed={true}>
          <ProgressStatus value={83} />
          <Header isSlide={false} title="" />
        </Slide>
        <RegisterLayout>
          <RegisterOverview>
            <span>어떤 인원과 함께하고 싶나요?</span>
            <span>조건을 선택해 주세요</span>
          </RegisterOverview>
          <WritingConditionLayout conditions={conditions} setConditions={setConditions} />
        </RegisterLayout>
        <BottomNav onClick={() => onClickNext()} />
      </>
    </>
  );
}

export default WritingCondition;

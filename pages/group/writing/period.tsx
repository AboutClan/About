import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ButtonCheckNav from "../../../components/molecules/ButtonCheckNav";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGroupWritingState } from "../../../recoils/sharedDataAtoms";
function GroupWritingContent() {
  const router = useRouter();

  const [group, setGroup] = useRecoilState(sharedGroupWritingState);

  const [period, setPeriod] = useState(group?.period || "주 1회");

  //초기 input 세팅

  const onClickNext = () => {
    setGroup((old) => ({
      ...old,
      period,
    }));
    router.push(`/group/writing/hashTag`);
  };

  const periodArr = [
    "매일",
    "주 1회",
    "주 2회",
    "주 3회",
    "주 4회",
    "주 5회",
    "월 1회",
    "월 2회",
    "월 3회",
    "월 4회",
    "자율",
  ];

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={72} />
        <Header isSlide={false} title="" url="/group/writing/content" />
      </Slide>

      <RegisterLayout>
        <RegisterOverview>
          <span>진행 주기를 체크해주세요!</span>
          <span>나중에 변경할 수 있습니다.</span>
        </RegisterOverview>
        <Container>
          <ButtonCheckNav
            buttonList={periodArr}
            setSelectedButton={setPeriod}
            selectedButton={period}
            isWrap={true}
          />
        </Container>
      </RegisterLayout>

      <BottomNav onClick={() => onClickNext()} />
    </>
  );
}

const Container = styled.div`
  margin-top: var(--gap-4);
`;

export default GroupWritingContent;

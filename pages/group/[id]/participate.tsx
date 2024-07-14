import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ParticipateModal from "../../../pageTemplates/group/ParticipateModal";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { transferGroupDataState } from "../../../recoils/transferRecoils";

function Participate() {
  const group = useRecoilValue(transferGroupDataState);

  const [questionText, setQuestionText] = useState("");
  const [isModal, setIsModal] = useState(false);

  const onClick = () => {
    setIsModal(true);
  };

  return (
    <>
      <>
        <Header title="" />
        <Slide>
          <RegisterLayout>
            <RegisterOverview>
              {group?.questionText ? (
                <>
                  <span>모임장의 승인이 필요한 모임입니다!</span>
                  <span>모임장이 설정한 질문에 답변해주세요.</span>
                </>
              ) : (
                <>
                  <span>자유 가입으로 설정된 모임입니다!</span>
                  <span>바로 가입이 가능해요.</span>
                </>
              )}
            </RegisterOverview>
            <Container>
              {group?.questionText && (
                <Item>
                  <Title>Q&#41; {group?.questionText}</Title>
                  <AnswerText
                    placeholder="부담없이 작성해주세요!"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                  />
                </Item>
              )}
            </Container>
          </RegisterLayout>
        </Slide>
        <BottomNav text="가입 신청" onClick={onClick} />
      </>
      {isModal && (
        <ParticipateModal
          isFree={!questionText}
          answer={questionText}
          id={group.id}
          feeText={group.feeText}
          setIsModal={setIsModal}
        />
      )}
    </>
  );
}

const Container = styled.div`
  margin-top: var(--gap-5);
`;

const Item = styled.div``;

const AnswerText = styled.textarea`
  border-radius: var(--rounded);

  border: var(--border);
  width: 100%;
  padding: var(--gap-2);

  :focus {
    outline-color: var(--gray-800);
  }
`;

const Title = styled.div`
  font-size: 15px;
  margin-bottom: var(--gap-4);
`;

export default Participate;

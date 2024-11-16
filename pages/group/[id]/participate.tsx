import { useParams } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { GROUP_STUDY } from "../../../constants/keys/queryKeys";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useGroupWaitingMutation } from "../../../hooks/groupStudy/mutations";
import ParticipateModal from "../../../pageTemplates/group/ParticipateModal";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { transferGroupDataState } from "../../../recoils/transferRecoils";

function Participate() {
  const toast = useToast();
  const [group, setGroup] = useRecoilState(transferGroupDataState);

  const [questionText, setQuestionText] = useState("");
  const [isModal, setIsModal] = useState(false);
  const { id } = useParams<{ id: string }>() || {};

  const queryClient = useQueryClient();

  const { mutate: sendRegisterForm } = useGroupWaitingMutation(group?.id, {
    onSuccess() {
      toast("success", "가입 신청이 완료되었습니다.");
      setGroup(null);
      queryClient.invalidateQueries([GROUP_STUDY, id]);
    },
  });

  const onClick = () => {
    sendRegisterForm({ answer: questionText, pointType: "point" });
  };

  return (
    <>
      <>
        <Header title="" />
        <Slide isNoPadding>
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

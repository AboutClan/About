import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { GROUP_STUDY } from "../../../constants/keys/queryKeys";
import { useToast } from "../../../hooks/custom/CustomToast";
import {
  useGroupParticipationMutation,
  useGroupWaitingMutation,
} from "../../../hooks/groupStudy/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import ParticipateModal from "../../../pageTemplates/group/ParticipateModal";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { transferGroupDataState } from "../../../recoils/transferRecoils";

function Participate() {
  const router = useRouter();
  const toast = useToast();
  const [group, setGroup] = useRecoilState(transferGroupDataState);

  const [questionText, setQuestionText] = useState("");
  const [isModal, setIsModal] = useState(false);
  const { id } = useParams<{ id: string }>() || {};

  const { data: userInfo } = useUserInfoQuery();

  const queryClient = useQueryClient();

  const { mutate } = useGroupParticipationMutation("post", group?.id, {
    onSuccess() {
      toast("success", "가입이 완료되었습니다.");
      setGroup(null);
      queryClient.invalidateQueries([GROUP_STUDY, id]);
      router.push(`/group/${id}`);
    },
  });

  const { mutate: sendRegisterForm, isLoading } = useGroupWaitingMutation(group?.id, {
    onSuccess() {
      toast("success", "가입 신청이 완료되었습니다.");
      setGroup(null);
      queryClient.invalidateQueries([GROUP_STUDY, id]);
      router.push(`/group/${id}`);
    },
  });

  const onClick = () => {
    if (userInfo?.ticket?.groupStudyTicket < (group?.meetingType === "online" ? 1 : 2)) {
      toast("warning", "보유중인 티켓이 부족합니다.");
      return;
    }
    if (group?.questionText) sendRegisterForm({ answer: questionText, pointType: "point" });
    else mutate();
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
        <BottomNav text="가입 신청" onClick={onClick} isLoading={isLoading} />
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

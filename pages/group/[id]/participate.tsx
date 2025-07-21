import { Box, Flex } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "react-query";

import Textarea from "../../../components/atoms/Textarea";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { GROUP_STUDY } from "../../../constants/keys/queryKeys";
import { useToast } from "../../../hooks/custom/CustomToast";
import {
  useGroupParticipationMutation,
  useGroupWaitingMutation,
} from "../../../hooks/groupStudy/mutations";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import ParticipateModal from "../../../pageTemplates/group/ParticipateModal";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";

function Participate() {
  const router = useRouter();
  const toast = useToast();

  const [textArr, setTextArr] = useState<string[]>([]);

  const [isModal, setIsModal] = useState(false);
  const { id } = useParams<{ id: string }>() || {};

  const { data: group } = useGroupIdQuery(id, { enabled: !!id });
  const { data: userInfo } = useUserInfoQuery();

  const queryClient = useQueryClient();

  const { mutate } = useGroupParticipationMutation("post", +id, {
    onSuccess() {
      toast("success", "가입이 완료되었습니다.");

      queryClient.invalidateQueries([GROUP_STUDY, id]);
      router.push(`/group/${id}`);
    },
  });

  const { mutate: sendRegisterForm, isLoading } = useGroupWaitingMutation(+id, {
    onSuccess() {
      toast("success", "가입 신청이 완료되었습니다.");

      queryClient.invalidateQueries([GROUP_STUDY, id]);
      router.push(`/group/${id}`);
    },
  });

  const onClick = () => {
    if (userInfo?.ticket?.groupStudyTicket < (group?.meetingType === "online" ? 1 : 2)) {
      toast("warning", "보유중인 티켓이 부족합니다.");
      return;
    }
    if (group?.questionText) sendRegisterForm({ answer: textArr[0], pointType: "point" });
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
                  <span>모임장 승인이 필요한 모임입니다.</span>
                  <span>아래 질문에 답변해 주세요!</span>
                </>
              ) : (
                <>
                  <span>자유 가입으로 설정된 모임입니다!</span>
                  <span>바로 가입이 가능해요.</span>
                </>
              )}
            </RegisterOverview>
            {[1, 2].map((_, idx) => (
              <Flex flexDir="column" mb={5} key={idx}>
                <Box mb={3} fontSize="14px">
                  Q&#41; {group?.questionText}
                </Box>
                <Textarea
                  minH="80px"
                  onChange={(e) => {
                    setTextArr((old) => {
                      const copy = [...old];
                      copy[idx] = e.target.value;
                      return copy;
                    });
                  }}
                  value={textArr[idx]}
                  placeholder="답변을 작성해 주세요."
                />
              </Flex>
            ))}
          </RegisterLayout>
        </Slide>
        <BottomNav text="가입 신청" onClick={onClick} isLoading={isLoading} />
      </>
      {isModal && (
        <ParticipateModal
          answer={textArr[0]}
          id={group.id}
          feeText={group.feeText}
          setIsModal={setIsModal}
        />
      )}
    </>
  );
}

export default Participate;
